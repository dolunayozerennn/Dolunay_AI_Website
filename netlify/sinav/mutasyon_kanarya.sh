#!/bin/bash
# Mutasyon suitinin KENDI kanaryasi: `mutasyon.sh`in yesilinin gercekten
# kirmiziya donebildigini olcer.
#
#   bash netlify/sinav/mutasyon_kanarya.sh
#
# Neden var: ilk surumde kor-nokta esigi "15/15" diye SABIT yaziliydi. Sinav 21
# vakaya cikinca esik hicbir zaman tutmaz oldu; suit hayatta kalan bir mutasyonu
# artik KOR NOKTA diye isaretleyemiyordu ama yine de "kor nokta yok" basiyordu.
# Ayni surum, node hic calismadiginda bile (skor 0/21) yesil verip cikis 0 donuyordu.
# Yani olcen aletin kendisi olculmemisti. Bu dosya o boslugu kapatir.
#
# Sahte bir `node` PATH'in basina konur; boylece gercek dosyalara dokunmadan
# "harness cokmus", "temel dusmus" ve "mutasyon hayatta kalmis" halleri kurulur.
set -u
KOK="$(cd "$(dirname "$0")/../.." && pwd)"
SUIT="$KOK/netlify/sinav/mutasyon.sh"
SAHTE="$(mktemp -d)"
NEGATIF="$KOK/netlify/sinav/.kanarya_negatif.sh"
trap 'rm -rf "$SAHTE" "$NEGATIF"' EXIT
gecti=0; kaldi=0

bekle() { # ad beklenen_cikis beklenen_desen cikti gercek_cikis
  if [ "$5" = "$2" ] && echo "$4" | grep -q "$3"; then
    echo "  GECTI  $1"; gecti=$((gecti + 1))
  else
    echo "  KALDI  $1 (cikis=$5, beklenen=$2, aranan='$3')"
    echo "$4" | sed 's/^/         /'
    kaldi=$((kaldi + 1))
  fi
}

sahte_node() { printf '%s\n' '#!/bin/bash' "$@" > "$SAHTE/node"; chmod +x "$SAHTE/node"; }
kos_sahte() { PATH="$SAHTE:$PATH" bash "$SUIT" 2>&1; }

# N1: sinav hic skor basmiyor. Cokme "yakalandi" degildir; hukum verilemez.
sahte_node 'exit 1'
c="$(kos_sahte)"; k=$?
bekle "cokmus harness kor-nokta-yok DEMEZ" 1 "TEMEL ARIZA" "$c" "$k"

# N2: bozulmamis kod bile sinavi gecmiyor. Tavan tam degilse mutasyon hukmu anlamsiz.
sahte_node 'echo "DUSTU S1_ornek"' 'echo "5/21"'
c="$(kos_sahte)"; k=$?
bekle "temel dusunce hukum verilmez" 1 "TEMEL DUSTU" "$c" "$k"

# N3: her mutasyon tam puan aliyor, yani sinav hicbirini olcmuyor.
sahte_node 'echo "21/21"'
c="$(kos_sahte)"; k=$?
bekle "hayatta kalan mutasyon KOR NOKTA olur" 1 "KOR NOKTA" "$c" "$k"
bekle "son satir uyarir" 1 "EN AZ BIR KOR NOKTA VAR" "$c" "$k"

# N4: mutasyon deseni kod degistigi icin artik tutmuyor. Uygulanmayan mutasyon
# "yakalandi" diye okunamaz.
sed 's|hataTipi: .baglanti./hataTipi: .x.|ARTIK_YOK_OLAN_DESEN/x|' "$SUIT" > "$NEGATIF"
c="$(bash "$NEGATIF" 2>&1)"; k=$?
bekle "tutmayan desen sessizce gecmez" 1 "M1_isaret_adi ARIZA" "$c" "$k"

# N5: gercek kosu hala yesil olmali; kanarya yalniz kirmiziyi degil yesili de sinar.
c="$(bash "$SUIT" 2>&1)"; k=$?
bekle "gercek kosu kor nokta yok" 0 "kor nokta yok" "$c" "$k"

echo "MUTASYON KANARYASI: $gecti gecti, $kaldi kaldi"
[ "$kaldi" = 0 ] || exit 1
