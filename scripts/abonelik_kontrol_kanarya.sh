#!/bin/bash
# Bekcinin KENDI kanaryasi. `abonelik_kontrol.py` bugun yesil veriyor; yesil bir
# bekcinin degeri ancak KIRMIZI verebildigi gosterilince olusur.
#
#   bash scripts/abonelik_kontrol_kanarya.sh
#
# Her vaka bozulmus bir KOPYA kurar, bekciyi ona karsi kosar ve iki sey birden arar:
# cikis kodu 1 OLMALI *ve* beklenen eksen bulguyu ADIYLA basmali. Yalniz cikis koduna
# bakmak yanlis olurdu: bekci coktugunde de sifir disi doner, cokme "yakaladi" degildir.
# Gercek dosyalara DOKUNMAZ.
set -u
set -o pipefail
KOK="$(cd "$(dirname "$0")/.." && pwd)"
BEKCI="$KOK/scripts/abonelik_kontrol.py"
GECICI="$(mktemp -d)" || { echo "ARIZA: gecici dizin acilamadi"; exit 1; }
trap 'rm -rf "$GECICI"' EXIT
GECTI=0; KALDI=0

# Bekcinin okudugu butun yuzeyler. Biri eksik kalirsa kanarya kendi kurdugu
# eksiklige bakar, bozdugu kusura degil.
kopya() {
  local d="$GECICI/$1"
  mkdir -p "$d/src/app/abonelik" "$d/netlify" "$d/public" "$d/scripts" || return 1
  cp "$KOK/src/app/abonelik/_abonelikler.ts" "$d/src/app/abonelik/" || return 1
  cp -R "$KOK/out" "$d/out" || return 1
  cp -R "$KOK/netlify/lib" "$d/netlify/lib" || return 1
  cp -R "$KOK/netlify/functions" "$d/netlify/functions" || return 1
  cp -R "$KOK/public/blog-otomasyonu" "$d/public/blog-otomasyonu" || return 1
  echo "$d"
}

# $1 ad  $2 beklenen cikis  $3 ciktida ARANAN metin (bos = aranmaz)  $4 kopya dizini
olc() {
  local ad="$1" beklenen="$2" aranan="$3" d="$4"
  local cikti kod
  cikti="$(ABONELIK_KOK="$d" python3 "$BEKCI" 2>&1)"; kod=$?
  if [ "$kod" != "$beklenen" ]; then
    echo "  KALDI  $ad (cikis $kod, beklenen $beklenen)"; KALDI=$((KALDI+1)); return
  fi
  if [ -n "$aranan" ] && ! echo "$cikti" | grep -qF "$aranan"; then
    echo "  KALDI  $ad (cikis dogru ama '$aranan' basilmadi)"; KALDI=$((KALDI+1)); return
  fi
  echo "  GECTI  $ad"; GECTI=$((GECTI+1))
}

vaka() {  # $1 ad  $2 beklenen cikis  $3 aranan metin  $4.. bozma komutu
  local ad="$1" beklenen="$2" aranan="$3"; shift 3
  local d; d="$(kopya "$ad")" || { echo "  KALDI  $ad (kopya kurulamadi)"; KALDI=$((KALDI+1)); return; }
  if [ "$#" -gt 0 ]; then
    if ! "$@" "$d"; then echo "  KALDI  $ad (bozma tutmadi)"; KALDI=$((KALDI+1)); return; fi
  fi
  olc "$ad" "$beklenen" "$aranan" "$d"
}

# Bozma yardimcilari. Hepsi DEGISIKLIGI DOGRULAR: tutmayan bir desen sessizce
# "bekci yakalayamadi" diye okunmamali.
degisti() { [ "$1" != "$(cat "$2")" ]; }
sil_desen() {  # $1 desen  $2 dosya(gorece)  $3 kopya dizini
  local f="$3/$2" once; once="$(cat "$f")" || return 1
  python3 - "$f" "$1" <<'PY' || return 1
import io,re,sys
f,d=sys.argv[1],sys.argv[2]
m=io.open(f,encoding='utf-8').read()
io.open(f,'w',encoding='utf-8').write(re.sub(d,'',m,count=1))
PY
  degisti "$once" "$f"
}
ekle_metin() {  # $1 metin  $2 dosya(gorece)  $3 kopya dizini
  local f="$3/$2" once; once="$(cat "$f")" || return 1
  printf '%s\n' "$1" >> "$f" || return 1
  degisti "$once" "$f"
}

echo "BEKCI KANARYASI"
vaka N0_bozulmamis_kopya      0 "bulgu: 0"                     
vaka N1_iskelette_robots_yok  1 "sayfa.js:robots-etiketi-yok"  sil_desen 'name="robots"[^>]*'                 netlify/lib/sayfa.js
vaka N2_iskelet_kullanilmiyor 1 "iskeleti-kullanmiyor"         sil_desen "lib/sayfa"                          netlify/functions/abonelik-baslat.js
vaka N3_sayfada_robots_yok    1 "['index.html']"                 sil_desen 'name="robots"[^>]*'                 public/blog-otomasyonu/index.html
vaka N4_em_dash               1 "em-dash"                      ekle_metin '<p>uzun tire — burada</p>'         public/blog-otomasyonu/index.html
vaka N5_sapkali_harf          1 "sapkali"                      ekle_metin '// hala degil hâlâ yazilmis'       netlify/lib/sayfa.js
vaka N6_kar_payi_muaf         0 "bulgu: 0"                     ekle_metin '<p>Kâr payı dagitimi</p>'          public/blog-otomasyonu/index.html
vaka N7_muafiyet_dar_kalmali  1 "sapkali"                      ekle_metin '<p>yapay zekâ</p>'                 public/blog-otomasyonu/index.html

echo "BEKCI KANARYASI: $GECTI gecti, $KALDI kaldi"
[ "$KALDI" = 0 ] || exit 1
