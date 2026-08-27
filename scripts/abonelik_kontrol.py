#!/usr/bin/env python3
"""Abonelik sayfalarinin kapisi.

Dort seyi olcer, hepsi "burada bir sey YOK" turunden hukumler oldugu icin
her biri POZITIF alan da basar (kac karakter, kac satir, kac dosya tarandi):
  1. Herkese acik paket sayfasina fiyat sizmis mi (sizmamali, teklife gore)
  2. Bu isin ekledigi govde satirlarinda em-dash / sapkali harf var mi
  3. Musteri sayfasi noindex mi, acik sayfa indekslenebilir mi
  4. Musteriye ozel bedel disariya acik baska bir sayfaya sizmis mi

ONCE `npm run build` kosulmali; olcum `out/` icindeki gercek ciktiyi tarar,
kaynagi degil. Cikis 0 = temiz, 1 = bulgu var.
"""
import re, html, sys, pathlib
kok = pathlib.Path('/Users/dolunayozeren/Desktop/Antigravity/Projeler/Dolunay_AI_Website')

# 1) Herkese acik sayfada fiyat sizmasi
acik = (kok/'out/cozumler/otomasyon-abonelik.html').read_text(encoding='utf-8')
govde = html.unescape(re.sub(r'<script.*?</script>', '', acik, flags=re.S))
govde = re.sub(r'<[^>]+>', ' ', govde)
fiyat_desen = re.compile(r'(₺|\bTL\b|\bUSD\b|\bEUR\b|\$|\b\d{1,3}[.,]\d{3}\b)')
fiyat_bulgu = sorted(set(fiyat_desen.findall(govde)))
print(f'[1] acik sayfa taranan karakter: {len(govde)} | fiyat isareti: {len(fiyat_bulgu)} {fiyat_bulgu}')

# 2) Em-dash ve sapkali harf: SADECE bu isin ekledigi satirlar
#    (tr.json'da onceden duran 4 "zeka" bu ise ait degil, olcume girmemeli)
import subprocess
diff = subprocess.run(['git','diff','HEAD','--unified=0','--','src'],
                      cwd=kok, capture_output=True, text=True).stdout
eklenen = [l[1:] for l in diff.splitlines() if l.startswith('+') and not l.startswith('+++')]
yeni_dosyalar = subprocess.run(['git','ls-files','--others','--exclude-standard','src'],
                               cwd=kok, capture_output=True, text=True).stdout.split()
for d in yeni_dosyalar:
    eklenen += (kok/d).read_text(encoding='utf-8').splitlines()
# Em-dash yasagi Dolunay'in agzindan cikan METNE aittir, kaynak yorumuna degil;
# cevredeki yorumlar zaten em-dash kullaniyor. Yorum satirlari olcum disi.
import re as _re
govde_satir = [l for l in eklenen if not _re.match(r'\s*(//|/\*|\*|\{/\*)', l)]
metin = '\n'.join(govde_satir)
sapka = set('\u00e2\u00ee\u00fb\u00ea\u00c2\u00ce\u00db\u00ca')
emdash = metin.count('\u2014')
sapkali = [c for c in metin if c in sapka]
print(f'[2] taranan eklenen govde satiri: {len(govde_satir)}/{len(eklenen)} (yeni dosya: {len(yeni_dosyalar)}) | em-dash: {emdash} | sapkali harf: {len(sapkali)}')

# 3) Musteri sayfasi arama motoruna kapali, acik sayfa acik
cam = (kok/'out/abonelik/cam-termal.html').read_text(encoding='utf-8')
print(f'[3] cam-termal noindex: {"noindex" in cam} | acik sayfa noindex: {"noindex" in acik}')

# 4) Musteriye ozel bedel herkese acik hicbir sayfaya sizmis mi
disari = [p for p in (kok/'out').rglob('*.html') if 'abonelik/cam-termal' not in str(p)]
sizinti = [str(p.relative_to(kok/'out')) for p in disari if '1.000' in p.read_text(encoding='utf-8') and 'USD' in p.read_text(encoding='utf-8')]
print(f'[4] taranan html: {len(disari)} | musteri bedeli sizan sayfa: {len(sizinti)} {sizinti}')

hata = bool(fiyat_bulgu) or emdash or sapkali or 'noindex' in acik or 'noindex' not in cam or sizinti
sys.exit(1 if hata else 0)
