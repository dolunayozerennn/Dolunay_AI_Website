#!/bin/bash
# Sinavin dekoratif olmadigini olcer: uygulama kodunu GECICI bir kopyada bilerek
# bozar, sinavi kopyaya karsi kosar ve kirmizi verip vermedigine bakar.
# Gercek dosyalara DOKUNMAZ.
#
#   bash netlify/sinav/mutasyon.sh
#
# Cikis 0 = TEMEL tam puan aldi VE her mutasyon yakalandi.
# Cikis 1 = kor nokta, ariza ya da temel kosunun kendisi dustu.
#
# Tavan SABIT YAZILMAZ. Eski surumde "15/15" literali duruyordu; sinav 21 vakaya
# cikinca kontrol sessizce korlesti ve hicbir mutasyon KOR NOKTA sayilamaz oldu.
# Artik tavan TEMEL kosudan olculur ve temel tam puan almazsa hicbir hukum verilmez:
# harness'in kendisi calismiyorken "kor nokta yok" demek en tehlikeli yesildir.
set -u
set -o pipefail
KOK="$(cd "$(dirname "$0")/../.." && pwd)"
SINAV="$KOK/netlify/sinav/odeme_sozlesmesi.js"
GECICI="$(mktemp -d)" || { echo "ARIZA: gecici dizin acilamadi"; exit 1; }
trap 'rm -rf "$GECICI"' EXIT
KOR=0

# Cikti ile birlikte cikis kodunu da tasir: skor basip ARDINDAN coken bir kosu
# "gecti" sayilamaz. Son satir daima `KOD=<n>` olur.
kos() {
  local c k
  c="$(node --openssl-config=/dev/null "$SINAV" \
    "$1/iyzico.js" "$1/abonelik-baslat.js" "$1/abonelik-sonuc.js" 2>&1)"
  k=$?
  printf '%s\nKOD=%s\n' "$c" "$k"
}

# Sinavin cikis kodu. DIKKAT: bu bir cokme sinyali DEGILDIR - harness bir vaka
# dustugunde de 1 doner. Bu yuzden yalniz TEMEL kosuda anlamlidir: bozulmamis kodda
# hem skor tam hem cikis 0 olmalidir. Mutasyon dalinda hukum SKORA gore verilir.

# Ciktidan `N/M` satirini ayiklar. Bulamazsa bos doner; bos skor ASLA basari sayilmaz.
skoru_al() { echo "$1" | grep -oE '^[0-9]+/[0-9]+$' | tail -1; }

hazirla() {
  local d="$GECICI/$1"
  mkdir -p "$d" || return 1
  cp "$KOK/netlify/lib/iyzico.js" "$d/iyzico.js" || return 1
  cp "$KOK/netlify/functions/abonelik-baslat.js" "$d/abonelik-baslat.js" || return 1
  cp "$KOK/netlify/functions/abonelik-sonuc.js" "$d/abonelik-sonuc.js" || return 1
  # Kopyalar duz bir dizinde durdugu icin gorece require yollari duzeltilir.
  perl -pi -e "s{require\('\.\./lib/sayfa'\)}{require('$KOK/netlify/lib/sayfa')}g" "$d"/*.js || return 1
  perl -pi -e "s{require\('\.\./lib/iyzico'\)}{require('./iyzico')}g" "$d"/*.js || return 1
  echo "$d"
}

# Mutasyonun GERCEKTEN uygulandigini dogrular. Uygulanmayan bir mutasyon
# "yakalandi" diye okunamaz; desen eskimisse bunu bilmemiz gerekir.
boz() {
  local dosya="$1"; shift
  local once; once="$(cat "$dosya")" || return 1
  perl "$@" "$dosya" || return 1
  [ "$once" != "$(cat "$dosya")" ]
}

olc() {
  local ad="$1" dizin="$2"
  local cikti; cikti="$(kos "$dizin")"
  local skor; skor="$(skoru_al "$cikti")"
  local dusen; dusen="$(echo "$cikti" | awk '/^DUSTU /{printf "%s ", $2}')"
  if [ -z "$skor" ]; then
    # Sinav hic skor basmadiysa cokmustur. Cokme "yakalandi" DEGILDIR.
    echo "$ad ARIZA: sinav skor basmadi"; KOR=1
  elif [ "$skor" = "$TAVAN" ]; then
    echo "$ad $skor KOR NOKTA"; KOR=1
  else
    echo "$ad $skor DUSEN: ${dusen:-?}"
  fi
}

# --- TEMEL: tavani buradan olcuyoruz, sabit yazmiyoruz ---
TEMEL="$(hazirla temel)" || { echo "ARIZA: temel kopya hazirlanamadi"; exit 1; }
TEMEL_CIKTI="$(kos "$TEMEL")"
TAVAN="$(skoru_al "$TEMEL_CIKTI")"
if [ -z "$TAVAN" ]; then
  echo "TEMEL ARIZA: sinav skor basmadi, olcum yapilamaz"
  echo "$TEMEL_CIKTI" | tail -5
  exit 1
fi
echo "temel $TAVAN"
if [ "$(echo "$TEMEL_CIKTI" | awk -F= '/^KOD=/{print $2}' | tail -1)" != "0" ]; then
  echo "TEMEL ARIZA: bozulmamis kosu sifir disi cikis kodu verdi, olcum guvenilmez"
  exit 1
fi
if [ "${TAVAN%/*}" != "${TAVAN#*/}" ]; then
  echo "TEMEL DUSTU: bozulmamis kod sinavi gecmiyor, mutasyon hukmu verilemez"
  echo "$TEMEL_CIKTI" | awk '/^DUSTU /{print "  " $0}'
  exit 1
fi

mutasyon() {
  local ad="$1" dosya="$2"; shift 2
  local d; d="$(hazirla "$ad")" || { echo "$ad ARIZA: kopya hazirlanamadi"; KOR=1; return; }
  if ! boz "$d/$dosya" "$@"; then
    echo "$ad ARIZA: mutasyon deseni tutmadi (kod degismis olabilir)"; KOR=1; return
  fi
  olc "$ad" "$d"
}

mutasyon M1_isaret_adi    iyzico.js         -pi -e "s/hataTipi: 'baglanti'/hataTipi: 'x'/"
mutasyon M2_http_durum    iyzico.js         -0pi -e "s/    if \(!cevap\.ok\) \{\n.*?\n    \}\n//s"
mutasyon M3_timeout       iyzico.js         -pi -e "s/signal: kesici\.signal,//; s/kesici\.abort\(\)/void 0/"
mutasyon M4_belirsizlik   abonelik-sonuc.js -pi -e "s/if \(!cevap \|\| cevap\.hataTipi\) \{/if (false) {/"
mutasyon M5_mukerrer_freni abonelik-baslat.js -pi -e "s/if \(varOlan === null\) \{/if (false) {/"
mutasyon M6_tanimsiz_govde abonelik-sonuc.js -pi -e "s/if \(cevap\.status !== 'failure'\) \{/if (false) {/"
# Okunamayan cevabi kesin hukme cevirmenin bes ayri yuzu. Hepsi ayni sinif.
mutasyon M7_items_dizi_degil   iyzico.js          -pi -e "s/if \(!Array\.isArray\(kayitlar\)\) return null/if (false) return null/"
mutasyon M8_toplam_yok_sayilir iyzico.js          -pi -e "s/if \(toplam !== null \&\& gorulen < toplam\) return null/if (false) return null/"
mutasyon M9_okunamayan_kayit   abonelik-baslat.js -pi -e "s/if \(okunamayanKayit\) \{/if (false) {/"
mutasyon M10_durum_denetimi    abonelik-sonuc.js  -pi -e "s/if \(durum \&\& durum !== .ACTIVE.\) \{/if (false) {/"
mutasyon M11_bos_form          abonelik-baslat.js -pi -e "s/typeof cevap\.checkoutFormContent === .string./cevap.checkoutFormContent != null/"

[ "$KOR" = 0 ] && echo "kor nokta yok" || echo "EN AZ BIR KOR NOKTA VAR"
exit $KOR
