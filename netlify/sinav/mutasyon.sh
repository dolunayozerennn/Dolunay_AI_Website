#!/bin/bash
# Sinavin dekoratif olmadigini olcer: uygulama kodunu GECICI bir kopyada bilerek
# bozar, sinavi kopyaya karsi kosar ve kirmizi verip vermedigine bakar.
# Gercek dosyalara DOKUNMAZ. Bir mutasyon 15/15 kaliyorsa orasi sinavin KOR NOKTASIDIR.
#
#   bash netlify/sinav/mutasyon.sh
#
# Cikis 0 = her mutasyon yakalandi. Cikis 1 = en az bir kor nokta var.
set -u
KOK="$(cd "$(dirname "$0")/../.." && pwd)"
SINAV="$KOK/netlify/sinav/odeme_sozlesmesi.js"
GECICI="$(mktemp -d)"
trap 'rm -rf "$GECICI"' EXIT
KOR=0

kos() {
  node --openssl-config=/dev/null "$SINAV" \
    "$1/iyzico.js" "$1/abonelik-baslat.js" "$1/abonelik-sonuc.js" 2>&1
}

hazirla() {
  local d="$GECICI/$1"; mkdir -p "$d"
  cp "$KOK/netlify/lib/iyzico.js" "$d/iyzico.js"
  cp "$KOK/netlify/functions/abonelik-baslat.js" "$d/abonelik-baslat.js"
  cp "$KOK/netlify/functions/abonelik-sonuc.js" "$d/abonelik-sonuc.js"
  # Kopyalar duz bir dizinde durdugu icin gorece require yollari duzeltilir.
  perl -pi -e "s{require\('\.\./lib/sayfa'\)}{require('$KOK/netlify/lib/sayfa')}g" "$d"/*.js
  perl -pi -e "s{require\('\.\./lib/iyzico'\)}{require('./iyzico')}g" "$d"/*.js
  echo "$d"
}

olc() {
  local ad="$1" dizin="$2"
  local cikti; cikti="$(kos "$dizin")"
  local skor; skor="$(echo "$cikti" | grep -oE '^[0-9]+/[0-9]+$' | tail -1)"
  local dusen; dusen="$(echo "$cikti" | awk '/^DUSTU /{printf "%s ", $2}')"
  if [ "$skor" = "15/15" ]; then
    echo "$ad $skor KOR NOKTA"; KOR=1
  else
    echo "$ad $skor DUSEN: ${dusen:-?}"
  fi
}

TEMEL="$(hazirla temel)"
echo "temel $(kos "$TEMEL" | tail -1)"

D="$(hazirla m1)"; perl -pi -e "s/hataTipi: 'baglanti'/hataTipi: 'x'/" "$D/iyzico.js"
olc M1_isaret_adi "$D"

D="$(hazirla m2)"; perl -0pi -e "s/    if \(!cevap\.ok\) \{\n.*?\n    \}\n//s" "$D/iyzico.js"
olc M2_http_durum "$D"

D="$(hazirla m3)"; perl -pi -e "s/signal: kesici\.signal,//; s/kesici\.abort\(\)/void 0/" "$D/iyzico.js"
olc M3_timeout "$D"

D="$(hazirla m4)"; perl -pi -e "s/if \(!cevap \|\| cevap\.hataTipi\) \{/if (false) {/" "$D/abonelik-sonuc.js"
olc M4_belirsizlik "$D"

D="$(hazirla m5)"; perl -pi -e "s/if \(varOlan === null\) \{/if (false) {/" "$D/abonelik-baslat.js"
olc M5_mukerrer_freni "$D"

D="$(hazirla m6)"; perl -pi -e "s/if \(cevap\.status !== 'failure'\) \{/if (false) {/" "$D/abonelik-sonuc.js"
olc M6_tanimsiz_govde "$D"

[ "$KOR" = 0 ] && echo "kor nokta yok" || echo "EN AZ BIR KOR NOKTA VAR"
exit $KOR
