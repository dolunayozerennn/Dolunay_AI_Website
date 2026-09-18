#!/usr/bin/env bash
# Netlify `ignore` komutu: bu build yayina cikacak mi?
#
# Netlify sozlesmesi TERS: cikis 0 = build ATLANIR (iptal, kredi yemez),
# sifir disi = build KOSAR. Basarili her production yayini 15 kredi yakar;
# iptal, hata, onizleme ve dal yayini bedavadir.
#
# Karar (2026-09-18, Dolunay): gun ici push'lar yayina CIKMAZ, birikir; gece
# 03:00'te tek yayin cikar (.github/workflows/gece-yayini.yml, fark yoksa hic
# cikmaz). Acil is icin commit mesajina `[yayinla]` yazilir.
#
#   deploy-preview / branch-deploy   -> KUR   (bedava)
#   build hook (gece yayini, elle)   -> KUR   (karari hook'u cagiran verdi)
#   production push, [yayinla] var   -> KUR
#   production push, etiket yok      -> ATLA
#
# Netlify arayuzundeki "Trigger deploy" de bir production push gibi gorunur ve
# ATLANIR. Elle yayin icin GitHub'da "Gece yayini" > Run workflow kullanilir.

if [ "${CONTEXT:-}" != "production" ]; then
  echo "yayin kapisi: ${CONTEXT:-baglam yok}, kuruluyor (bedava)"
  exit 1
fi

if [ -n "${INCOMING_HOOK_TITLE:-}" ]; then
  echo "yayin kapisi: hook ($INCOMING_HOOK_TITLE), kuruluyor"
  exit 1
fi

HEDEF="${COMMIT_REF:-HEAD}"

# Son kurulan commit'ten bu yana gelen butun mesajlara bak: birlikte push'lanan
# commit'lerden biri etiketliyse yeter. Sig klonda eski commit yoksa ya da
# onbelleksiz build'de CACHED == COMMIT ise yalniz son commit'e bakilir.
if [ -n "${CACHED_COMMIT_REF:-}" ] && [ "$CACHED_COMMIT_REF" != "$HEDEF" ] \
  && git cat-file -e "${CACHED_COMMIT_REF}^{commit}" 2>/dev/null; then
  MESAJLAR=$(git log --format=%B "${CACHED_COMMIT_REF}..${HEDEF}" 2>/dev/null)
else
  MESAJLAR=$(git log -1 --format=%B "$HEDEF" 2>/dev/null)
fi

if printf '%s' "$MESAJLAR" | grep -qiF '[yayinla]'; then
  echo "yayin kapisi: [yayinla] etiketi var, hemen kuruluyor"
  exit 1
fi

echo "yayin kapisi: etiket yok, gece toplu yayina birakildi (bu iptal kredi yemez)"
exit 0
