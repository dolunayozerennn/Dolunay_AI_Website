#!/usr/bin/env bash
# Gece toplu yayini: canlidaki surum ile main arasinda yayina girecek bir fark
# varsa Netlify build hook'unu bir kez cagirir, yoksa hicbir sey yapmaz.
# .github/workflows/gece-yayini.yml icinden kosar.
#
# Canlidaki surum, her build'in yazdigi /surum.txt'ten okunur (netlify.toml
# build komutu). Okunamazsa ya da o commit gecmiste yoksa yayin YAPILIR:
# yanlislikla bir gece fazla yayin 15 kredidir, yanlislikla atlanan yayin ise
# sessizce eskimis sitedir.
#
# Ortam: HOOK (build hook adresi, secret), ELLE ("true" ise karsilastirma yapmadan
# yayinlar), SITE (varsayilan https://dolunay.ai).
set -uo pipefail

if [ -z "${HOOK:-}" ]; then
  echo "::error::NETLIFY_GECE_HOOK secret tanimli degil"
  exit 1
fi

SITE="${SITE:-https://dolunay.ai}"
MAIN=$(git rev-parse HEAD)
CANLI=$(curl -fsS --max-time 20 "$SITE/surum.txt" 2>/dev/null | tr -dc '0-9a-f' | cut -c1-40)

KARAR=kur
SEBEP="canlidaki surum okunamadi"
if [ "${ELLE:-}" = "true" ]; then
  SEBEP="elle tetiklendi"
elif [ -n "$CANLI" ] && git cat-file -e "${CANLI}^{commit}" 2>/dev/null; then
  if git diff --quiet "$CANLI" "$MAIN" -- . ':(exclude)seo_geo'; then
    KARAR=atla
    SEBEP="canlidan beri yayina girecek degisiklik yok"
  else
    SEBEP="canlidan beri $(git rev-list --count "$CANLI..$MAIN") commit birikti"
  fi
elif [ -n "$CANLI" ]; then
  SEBEP="canlidaki commit ($CANLI) gecmiste yok"
fi

echo "canli=${CANLI:-yok} main=$MAIN karar=$KARAR ($SEBEP)"
[ "$KARAR" = kur ] || exit 0

curl -fsS --max-time 30 -X POST -d '{}' \
  "${HOOK}?trigger_title=gece+toplu+yayin" >/dev/null
echo "Netlify yayini tetiklendi"
