#!/usr/bin/env python3
"""Abonelik sayfalarinin kapisi.

Olctugu her sey "burada bir sey YOK" turunden hukum oldugu icin her kontrol
POZITIF alan da basar (kac karakter, kac satir, kac dosya, kac kayit tarandi):
  1. Herkese acik paket sayfasina fiyat sizmis mi (sizmamali, teklife gore)
  2. Bu isin ekledigi govde satirlarinda em-dash / sapkali harf var mi
  3. Kayitli her musteri sayfasi noindex mi, acik sayfa indekslenebilir mi
  4. Musteriye ozel bedel disariya acik baska bir sayfaya sizmis mi
  5. Kayitta olmayan bir musteri sayfasi ciktida kalmis mi (silinen musteri)

Musteri listesi SABIT YAZILMAZ, _abonelikler.ts'ten okunur. Sabite baglanan
olcum kayit degisince sessizce yanlis sey olcer.

ONCE `npm run build` kosulmali; olcum `out/` icindeki gercek ciktiyi tarar,
kaynagi degil. Cikis 0 = temiz, 1 = bulgu var.
"""
import os, re, html, sys, pathlib, subprocess
# Kok ortam degiskeniyle ezilebilir: bekcinin KENDI kanaryasi bozulmus bir KOPYAYA
# karsi kosabilsin diye. Degisken verilmezse davranis aynen eskisi gibi.
kok = pathlib.Path(os.environ.get('ABONELIK_KOK',
    '/Users/dolunayozeren/Desktop/Antigravity/Projeler/Dolunay_AI_Website'))

# 0) Kayitlari kaynak dosyadan cikar (yorum satirlari haric)
kayit_src = (kok/'src/app/abonelik/_abonelikler.ts').read_text(encoding='utf-8')
kayit_govde = '\n'.join(l for l in kayit_src.splitlines() if not re.match(r'\s*//', l))
kayitlar = []
for blok in re.findall(r'\{(.*?)\}', kayit_govde, flags=re.S):
    slug = re.search(r"slug:\s*'([^']+)'", blok)
    tutar = re.search(r"tutar:\s*'([^']+)'", blok)
    para = re.search(r"paraBirimi:\s*'([^']+)'", blok)
    if slug and tutar and para:
        kayitlar.append((slug.group(1), tutar.group(1), para.group(1)))
print(f'[0] _abonelikler.ts taranan karakter: {len(kayit_src)} | kayitli musteri: {len(kayitlar)} {[k[0] for k in kayitlar]}')

# 1) Herkese acik sayfada fiyat sizmasi
acik = (kok/'out/cozumler/otomasyon-abonelik.html').read_text(encoding='utf-8')
govde = html.unescape(re.sub(r'<script.*?</script>', '', acik, flags=re.S))
govde = re.sub(r'<[^>]+>', ' ', govde)
fiyat_desen = re.compile(r'(₺|\bTL\b|\bUSD\b|\bEUR\b|\$|\b\d{1,3}[.,]\d{3}\b)')
fiyat_bulgu = sorted(set(fiyat_desen.findall(govde)))
print(f'[1] acik sayfa taranan karakter: {len(govde)} | fiyat isareti: {len(fiyat_bulgu)} {fiyat_bulgu}')

# 2) Em-dash ve sapkali harf: SADECE bu isin ekledigi satirlar
#    (tr.json'da onceden duran 4 "zeka" bu ise ait degil, olcume girmemeli)
diff = subprocess.run(['git','diff','HEAD','--unified=0','--','src'],
                      cwd=kok, capture_output=True, text=True).stdout
eklenen = [l[1:] for l in diff.splitlines() if l.startswith('+') and not l.startswith('+++')]
yeni_dosyalar = subprocess.run(['git','ls-files','--others','--exclude-standard','src'],
                               cwd=kok, capture_output=True, text=True).stdout.split()
for d in yeni_dosyalar:
    eklenen += (kok/d).read_text(encoding='utf-8').splitlines()
# Em-dash yasagi Dolunay'in agzindan cikan METNE aittir, kaynak yorumuna degil;
# cevredeki yorumlar zaten em-dash kullaniyor. Yorum satirlari olcum disi.
govde_satir = [l for l in eklenen if not re.match(r'\s*(//|/\*|\*|\{/\*)', l)]
metin = '\n'.join(govde_satir)
sapka = set('âîûêÂÎÛÊ')
emdash = metin.count('—')
sapkali = [c for c in metin if c in sapka]
print(f'[2] taranan eklenen govde satiri: {len(govde_satir)}/{len(eklenen)} (yeni dosya: {len(yeni_dosyalar)}) | em-dash: {emdash} | sapkali harf: {len(sapkali)}')

# 3) Kayitli her musteri sayfasi arama motoruna kapali, acik sayfa acik
noindex_eksik = []
for slug, _, _ in kayitlar:
    p = kok/f'out/abonelik/{slug}.html'
    if not p.exists() or 'noindex' not in p.read_text(encoding='utf-8'):
        noindex_eksik.append(slug)
if kayitlar:
    print(f'[3] taranan musteri sayfasi: {len(kayitlar)} | noindex eksigi: {len(noindex_eksik)} {noindex_eksik} | acik sayfa noindex: {"noindex" in acik}')
else:
    print(f'[3] taranan musteri sayfasi: 0 (kayit yok, bu eksende OLCUM YAPILMADI) | acik sayfa noindex: {"noindex" in acik}')

# 4) Musteriye ozel bedel herkese acik hicbir sayfaya sizmis mi
tum_html = list((kok/'out').rglob('*.html'))
sizinti = []
for slug, tutar, para in kayitlar:
    for p in tum_html:
        if f'abonelik/{slug}' in str(p):
            continue
        icerik = p.read_text(encoding='utf-8')
        if tutar in icerik and para in icerik:
            sizinti.append(f'{p.relative_to(kok/"out")}<-{slug}')
if kayitlar:
    print(f'[4] taranan html: {len(tum_html)} | aranan bedel: {len(kayitlar)} | sizan sayfa: {len(sizinti)} {sizinti}')
else:
    print(f'[4] taranan html: {len(tum_html)} | aranan bedel: 0 (kayit yok, bu eksende OLCUM YAPILMADI)')

# 5) Kayittan cikarilan musterinin sayfasi ciktida kalmis mi
uretilen = sorted(p.stem for p in (kok/'out/abonelik').rglob('*.html')) if (kok/'out/abonelik').exists() else []
kayitli = sorted(k[0] for k in kayitlar)
fazla = [s for s in uretilen if s not in kayitli]
print(f'[5] ciktidaki musteri sayfasi: {len(uretilen)} {uretilen} | kayitli: {len(kayitli)} | kayitsiz kalinti: {len(fazla)} {fazla}')

# 6) Odeme akisinin GIZLILIGI. Eksen [3] yalniz `_abonelikler.ts` kayitlarina bakar;
#    blog otomasyonu sayfasi ve Netlify fonksiyonlarinin URETTIGI sayfalar o listede
#    olmadigi icin oraya bakmiyordu.
#    DIKKAT: fonksiyon dosyalarinda `noindex` KELIMESINI aramak yanlis pozitif verir;
#    etiket ortak iskelette durur. Olculen sey ZINCIR: iskelette etiket var mi VE her
#    fonksiyon sayfayi gercekten o iskeletten uretiyor mu. Biri kopunca gizlilik kopar.
iskelet = kok/'netlify/lib/sayfa.js'
gizlilik_eksik = []
gizli_taranan = 0
iskelet_metin = iskelet.read_text(encoding='utf-8') if iskelet.exists() else ''
gizli_taranan += len(iskelet_metin)
if not re.search(r'name=["\']robots["\'][^>]*noindex', iskelet_metin):
    gizlilik_eksik.append('sayfa.js:robots-etiketi-yok')
sayfa_html = [kok/'public/blog-otomasyonu/index.html']
for p6 in sayfa_html:
    if not p6.exists():
        gizlilik_eksik.append(f'{p6.name}:YOK'); continue
    icerik = p6.read_text(encoding='utf-8')
    gizli_taranan += len(icerik)
    if not re.search(r'name=["\']robots["\'][^>]*noindex', icerik):
        gizlilik_eksik.append(p6.name)
fonksiyonlar = sorted((kok/'netlify/functions').glob('abonelik-*.js'))
for p6 in fonksiyonlar:
    icerik = p6.read_text(encoding='utf-8')
    gizli_taranan += len(icerik)
    if "lib/sayfa" not in icerik:
        gizlilik_eksik.append(f'{p6.name}:iskeleti-kullanmiyor')
print(f'[6] taranan gizli yuzey: {1 + len(sayfa_html) + len(fonksiyonlar)} '
      f'| taranan karakter: {gizli_taranan} | eksik: {len(gizlilik_eksik)} {gizlilik_eksik}')

# 7) Musteriye GORUNEN metinde em-dash ve sapkali harf. Eksen [2] yalniz `src` diffine
#    bakar; bu isin sayfasi ve fonksiyonlarin urettigi metin disarida kaliyordu.
#    Kapsam BILEREK bu odeme akisiyla sinirli: butun `public/` taranirsa baska islerin
#    eski sayfalari yuzunden bekci surekli kirmizi kalir ve okunmaz olur.
#    `kar`/`kar payi` (kazanc) ayrimi icin kullanilan a-sapka BILEREK serbest.
IZINLI_SAPKA = re.compile(r'[Kk][âÂ]r')
metin_yuzeyler = sorted((kok/'public/blog-otomasyonu').rglob('*.html')) \
    + sorted((kok/'netlify/lib').glob('*.js')) + fonksiyonlar
tr_bulgu = []
tr_taranan = 0
for p7 in metin_yuzeyler:
    ham = p7.read_text(encoding='utf-8', errors='replace')
    tr_taranan += len(ham)
    for no, satir in enumerate(ham.splitlines(), 1):
        if '\u2014' in satir:
            tr_bulgu.append(f'{p7.relative_to(kok)}:{no}:em-dash')
        if any(c in sapka for c in IZINLI_SAPKA.sub('', satir)):
            tr_bulgu.append(f'{p7.relative_to(kok)}:{no}:sapkali')
print(f'[7] taranan metin yuzeyi: {len(metin_yuzeyler)} | taranan karakter: {tr_taranan} '
      f'| bulgu: {len(tr_bulgu)} {tr_bulgu[:8]}')

hata = (bool(fiyat_bulgu) or emdash or sapkali or 'noindex' in acik or noindex_eksik
        or sizinti or fazla or gizlilik_eksik or tr_bulgu)
sys.exit(1 if hata else 0)
