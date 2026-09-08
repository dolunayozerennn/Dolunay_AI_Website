# Dolunay_AI_Website — baslangic notlari

Next.js ile statik uretilen dolunay.ai sitesi. Odeme/abonelik akisi Netlify
Functions uzerinde ayri yasar (`netlify/functions`, `netlify/lib`).

## Abonelik odeme akisi (iyzico) — 2026-09-03 itibariyle CANLI

Musteri linki: `https://dolunay.ai/odeme/<paket-slug>`. Canli musteri paketi:
`carousel`. Sayfa noindex, siteden hicbir yere link verilmiyor; link musteriye
elden gonderiliyor.

Akis: `/odeme/<slug>` formu (ad, soyad, mail, telefon, adres) →
`abonelik-baslat.js` iyzico'da abonelik baslatir ve gomulu kart formunu cizer →
kart girilir → `abonelik-sonuc.js` sonucu gosterir.

**Bildirim maili YOK ve kurulmayacak (2026-09-08, Dolunay'in karari).** Ne musteriye
ne Dolunay'a odeme bildirimi gonderen bir otomasyon vardir. Sebep onun kendi cumlesi:
musterilerle birebir iletisim var ve "ekstradan boyle bir is icin otomasyonu yonetmekle
ugrasmak da istemiyoruz". Sayfa noindex ve link elden gonderildigi icin Dolunay kimin
satin aldigini zaten biliyor. Bu bir eksik degil TERCIHTIR; sonraki oturum "bildirim
kurulmamis" diye is acmaz. Pratik sonuc: ekran metinlerinde musteriye mail vaat EDILMEZ.

**Musteriye gorunen her metin duzgun Turkce yazilir (2026-09-07).** Kart bilgisi girilen
ekranda ASCII Turkce ("Sehir", "Odeme yalnizca") guven kirar. Sinav dosyasi karsilastirma
oncesi aksani duselttigi icin duzgun Turkce yazmak suiti bozmaz; yani ASCII yazmanin
teknik bir mazereti yoktur. Kod tarafi (degisken, regex, JSON anahtari, iyzico'ya giden
alan degerleri) ASCII kalir.

### EN ONEMLI: paket katalogu REPODA DEGIL

Paketler `IYZICO_PAKETLER` adli **Netlify ortam degiskeninde** durur. Repoda
yalnizca onu okuyan tek satir vardir (`netlify/lib/iyzico.js:59`). Depo PUBLIC
oldugu icin musteri adi, fiyat ve plan kodlari bilerek disarida tutuldu. Yani
`grep` ile fiyat ya da paket adi ararsan HICBIR SEY bulamazsin; bu eksiklik
degil, karardir.

JSON sekli:

    {"carousel": {
      "ad": "Instagram Carousel Otomasyonu",
      "plan": "<iyzico pricingPlanReferenceCode>",
      "tutar": "4.000 TL + KDV",
      "periyot": "ay",
      "notu": "Kartinizdan aylik toplam 4.800 TL cekilir.",
      "kapsam": ["...", "..."]
    }}

**Iki paket turu vardir ve ayrimi tek alan yapar.**

- **Abonelik paketi:** `plan` alani DOLU. Yukaridaki sekildir; `/odeme/<slug>` istegi
  `abonelik-baslat.js`e gider. `periyot` bos ise `ay` varsayilir.
- **Tek seferlik paket:** `plan` alani YOK, yerine `tutar_kurus` (KDV DAHIL, pozitif
  tamsayi, kurus cinsinden) vardir. Istek `odeme-baslat.js`e gider.

Tek seferlik sekli:

    {"web-sitesi": {
      "ad": "Web Sitesi Tasarimi",
      "tutar_kurus": 1800000,
      "notu": "15.000 TL + KDV, toplam 18.000 TL tek seferde tahsil edilir.",
      "kapsam": ["...", "..."]
    }}

`plan` varsa tek seferlik alanlara BAKILMAZ; abonelik dali her zaman onceliklidir.

### Fiyat degistirmek

`tutar` ve `notu` SERBEST METINDIR. Ekrana oldugu gibi basilir; sayi
bicimlendirmesi, otomatik "TL" eki ya da KDV hesabi YOKTUR. Karttan cekilen
tutari belirleyen tek sey iyzico'daki `plan` kodudur.

Bu yuzden **ekrandaki yazi ile cekilen para birbirinden bagimsizdir**. `tutar`
alanini degistirmek tahsilati DEGISTIRMEZ. Gercek tutari degistirmek icin
iyzico panelinde yeni fiyatlandirma plani acilir ve `plan` kodu guncellenir.
Ekranda vergi harici rakam yaziyorsa (bugunku hali), toplamin yanindaki notta
acikca yazili olmasi sarttir, yoksa sayfa yalan soyler.

**Tek seferlik pakette bu kural TERSINE isler.** Orada ekranda gorunen tutari da,
karttan cekilen tutari da AYNI alan belirler: `tutar_kurus`. Serbest metin yoktur,
KDV dahil tek sayi vardir; `tutar_kurus` degistiginde tahsilat da degisir. iyzico
panelinde acilacak bir plan YOKTUR.

### Env degiskenini guncelleme (calisan yontem)

Netlify API'sinde `PATCH .../env/<KEY>` **422 doner, calismaz**. Calisan yol
`PUT` ve tam kayit:

    PUT /api/v1/accounts/<account_slug>/env/IYZICO_PAKETLER?site_id=<site_id>
    {"key":"IYZICO_PAKETLER","scopes":["builds","functions"],
     "is_secret":false,"values":[{"value":"<json string>","context":"all"}]}

`account_slug` → `GET /sites/<site_id>` cevabindaki `account_slug`.
site_id: `93e952dd-4720-4bca-93e8-55ddcaa844f6`. Token: master.env icindeki
`NETLIFY_AUTH_TOKEN`.

**Env degisikligi tek basina yetmez**, fonksiyonlar yeni degeri ancak yeniden
deploy sonrasi gorur: `POST /api/v1/sites/<site_id>/builds` govde
`{"clear_cache":false}`, sonra `deploy_id` ile `ready` olana kadar bekle
(~40-50 sn). Sonra sayfayi curl ile ac ve yaziyi gozle dogrula.

### Tek seferlik odeme akisi

Abonelikten AYRI bir yoldur ve iyzico'nun Checkout Form ucunu kullanir.

- `/odeme/<slug>` -> `netlify/functions/odeme-baslat.js`. Paket `plan` tasiyorsa istek
  oldugu gibi `abonelik-baslat.js`e devredilir; tasimiyorsa tek seferlik dal calisir.
- Donus adresi `/odeme/tek-sonuc` -> `netlify/functions/odeme-sonuc.js`.
  Abonelik donusu olan `/odeme/sonuc` ile KARISTIRILMAZ; ikisi ayri fonksiyondur ve
  `netlify.toml`da yildizdan ONCE gelmek zorundadir.
- Tutar butunlugu: `conversationId` ve tutar `IYZICO_SECRET_KEY` ile `tek-sefer:` on ekli
  HMAC'e baglanir, donus adresine imzali olarak konur ve sonuc ucunda yeniden dogrulanir.
  Kullanici tutari degistiremez; bedel daima katalogdan gelir, formdan degil.
- Sonuc ancak `paymentStatus=SUCCESS`, `fraudStatus=1`, para birimi TRY ve hem `price` hem
  `paidPrice` beklenen kurusa esitse basari sayilir. Aksi halde ekran "teyit edilemedi"
  der; sessizce basari YAZILMAZ.

**Bilinen risk: mukerrer tahsilat kilidi YOK.** Ayni kisi formu iki kez gonderip ikisini de
tamamlarsa iki ayri tahsilat olusur. Netlify fonksiyonlarinda kalici depo olmadigi icin
kilit kurulmadi; olursa iyzico panelinden iade edilir.

### Yeni musteri paketi acmak

**Abonelik paketi:**

1. iyzico panelinde urun + fiyatlandirma plani olustur, plan referans kodunu al.
2. `IYZICO_PAKETLER` icine `plan` alanli yeni slug ekle (yukaridaki PUT + build).
3. `https://dolunay.ai/odeme/<slug>` adresini curl ile ac, 200 ve dogru metin gor.
4. Linki musteriye gonder.

**Tek seferlik paket:** iyzico panelinde HICBIR SEY yapilmaz. Kataloga `tutar_kurus`
alanli slug eklenir (adim 2), sonra 3 ve 4 aynidir. Tutar KDV DAHIL girilir.

Slug'i katalogdan silmek sayfayi 404 yapar; test paketleri boyle kapatilir.

## Tuzaklar (canlida yasandi)

- **Abonelikte yalniz KREDI KARTI calisir.** Banka karti iyzico tarafindan
  reddedilir ve musteri "odeme tamamlanmadi" ekranina duser. Bu sart hem form
  sayfasinda hem kart adiminda hem de hata sayfasinda yazili; kaldirma.
- `netlify.toml` basliklari fonksiyon cevaplarina UYGULANMIYOR (canlida olculdu).
  Odeme sayfalarinin CSP'si `netlify/lib/sayfa.js` icinde elle kuruluyor.
- CSP'deki `frame-src https:` / `form-action https:` joker izin BILINCLI
  gevsekliktir: 3DS adimi musterinin bankasina gidiyor ve her banka ayri alan
  adi. Daraltmadan once gercek bir 3DS akisi izlenmeli, yoksa canli odeme
  sessizce kirilir.
- Iyzico'nun gomulu kart formu acik temali; koyu site temasi kart alanlarini
  gorunmez yapiyordu. `#iyzipay-checkout-form` bloku bu yuzden var, silme.
- iyzico API'sinde urun ve fiyatlandirma plani SILINEMIYOR (uc yol da 404
  "System error" veriyor). Temizlik yalnizca panelden elle yapilir.

## Kanit (2026-09-03)

Uctan uca gercek bir odeme alindi ve dogrulandi: 1 TL'lik test paketiyle
abonelik basladi, ilk tahsilat `SUCCESS` dondu, iptal sonrasi durum `CANCELED`
oldu ve gelecek tahsilat dustu. Test slug'i katalogdan kaldirildi, canli
katalogda yalniz `carousel` var.

## Blog Otomasyonu satis sayfasi (2026-09-07)

Sayfa: `public/blog-otomasyonu/index.html`, canli adres
`https://dolunay.ai/blog-otomasyonu/`. Elle yazilmis tek dosya HTML; `bankalar`
ve `kurumsal-egitim` sayfalariyla ayni desen. Kapak gorselleri
`public/blog-otomasyonu/gorseller/` icinde, statik export bunlari `out/`
altina oldugu gibi kopyalar.

**Bilerek LISTELENMEZ.** Satir 7'de `<meta name="robots" content="noindex,
nofollow">` var ve canonical etiketi YOK. `src/app/sitemap.ts` yalniz sabit
yollari ve blog yazilarini uretir, `public/` sayfalarini toplamaz; site
menusunde de bag yok. `src/app/robots.ts` icine Disallow EKLENMEMELI; engel
konursa arama motoru sayfayi hic okumaz ve noindex'i goremez. Bu, listelenmeme
saglar; linki olan herkes acabilir, gizli degil listesizdir.

Katalog anahtarlari: `blog-baslangic`, `blog-profesyonel`, `blog-premium`.
Sayfadaki fiyat KDV HARIC yazilir (₺2.980 / ₺5.980 / ₺9.980 + KDV), iyzico
plan bedeli KDV DAHIL kurulur (%20). Ikisi karistirilirsa musteri ekranda
gordugunden farkli bir tutar oder. Katalog yine `IYZICO_PAKETLER` env'inde;
degisiklik sonrasi yeniden deploy sart.

### Odeme dayanikliligi sozlesmesi

iyzico **is kurali reddini HTTP 200 + `status:"failure"`** ile bildirir. Bu
yuzden 2xx disindaki her kod (401, 403, 404, 429, 3xx, 5xx) bizde ALTYAPI
sorunudur, "kesin ret" degildir. Kurallar:

- Her istek 20 saniyede kesilir; cevapsiz istek fonksiyonu asili birakmaz.
- Belirsizlikte cevaba `hataTipi` isareti konur (`baglanti` = istek gitmedi,
  `sunucu` = 5xx / JSON olmayan / 2xx disi cevap). Saglayicinin kendi hata
  govdesi kaydi icin korunur, musteriye ham metin gosterilmez.
- **Iki cumle asla yer degistirmez.** Kesin bilgi varsa "kartinizdan tahsilat
  YAPILMADI"; sonuc teyit edilemiyorsa "tahsilat yapilmis olabilir, ayni
  odemeyi tekrar denemeyin". Belirsizken "para cekilmedi" demek yanlis
  guvence verir.
- Mukerrer abonelik taramasi okunamazsa odeme BASLATILMAZ (503). Kacan satis,
  ikinci tahsilattan iyidir. Bos liste (`items: []`) okunamamak DEGILDIR: ilk kez
  satin alan musteri normal sekilde ilerler.
- **Ekran metni sistemde karsiligi olmayan sey VAAT ETMEZ (2026-09-08).** Bes ayri
  yerde musteriye "e-postaniza gonderilir / e-postanizi kontrol edin / onay maili
  geldiyse islem tamamlanmistir" deniyordu; boyle bir gonderim hic olmadi. En agir
  hali belirsiz sonuc ekranindaydi: musteri gelmeyecek bir maili beklemeye
  yonlendiriliyor, sonra da odemeyi tekrar deneyebiliyordu. Artik o ekranlar
  musteriyi dogrudan `dolunay@dolunay.ai` adresine yaziyor. Yeni metin yazarken
  kural tek: cumlenin karsiligi kodda yoksa cumle yazilmaz.
- Saglayici toplamda daha cok kayit oldugunu soyluyorsa ve biz hepsini gormediysek
  liste bitmemistir; "abonelik yok" denmez.
- Sorgunun donmesi aboneligin basladigini KANITLAMAZ. Kaydin kendi durumu ACTIVE
  degilse ya da okunamiyorsa "aboneliginiz basladi" denmez.
- Odeme formu gelmediyse ya da bos geldiyse musteriye bos bir kart adimi acilmaz.

Bu sozlesmeyi bagimsiz bir sinav olcer (fix'i yazan el yazmadi):

    node netlify/sinav/odeme_sozlesmesi.js netlify/lib/iyzico.js \
      netlify/functions/abonelik-baslat.js netlify/functions/abonelik-sonuc.js

36 vaka, ag cagrisi yok, cikis 0 bekleniyor. Odeme koduna dokunan her
degisiklikten sonra kosulur.

Sinavin kendisi de olculur. `bash netlify/sinav/mutasyon.sh` uygulama kodunu
gecici kopyalarda on bir ayri yerden bilerek bozar ve sinavin kirmizi verip
vermedigine bakar; gercek dosyalara dokunmaz. Bir mutasyon yesil kaliyorsa orasi
sinavin KOR NOKTASIDIR ve script cikis 1 verir. Su an on bir mutasyonun on biri de
yakalaniyor.

Tekrar eden kusur sinifi tek cumlede: **okunamayan bir cevabi kesin bir evete ya da
hayira cevirmek.** Bu depoda bes ayri yerde bulundu: HTTP 200 + tanimsiz govde,
dizi olmayan `items`, yok sayilan `totalCount`, okunamayan `subscriptionStatus`,
ve bos gelen form icerigi. Yeni kod yazarken once bu soru sorulur: cevabi
anlamadigimizda ne diyoruz.

Sayfa bekcisi de olculur: `python3 scripts/abonelik_kontrol.py` yedi eksende
"burada bir sey YOK" hukmu verir, ve `bash scripts/abonelik_kontrol_kanarya.sh`
bu bekcinin gercekten kirmizi verebildigini gosterir (bozulmus KOPYA, 8 vaka,
cikis 0 bekleniyor). Kanarya yalniz cikis koduna bakmaz, beklenen eksenin bulguyu
ADIYLA bastigini da arar: coken bir bekci de sifir disi doner ve cokme "yakaladi"
demek degildir. Kanaryanin iki vakasi muafiyeti iki yonden sikistirir: `kar payi`
gecmeli, `zeka` gecmemeli.

Bekcinin ilk gizlilik ekseni fonksiyon dosyalarinda `noindex` KELIMESINI ariyordu
ve yanlis pozitif veriyordu; etiket ortak sayfa iskeletinde durur. Simdi olculen sey
ZINCIR: iskelette etiket var mi VE her fonksiyon sayfayi o iskeletten uretiyor mu.

Olcen aletin kendisi de olculur: `bash netlify/sinav/mutasyon_kanarya.sh`.
Sahte bir `node` ile "harness cokmus", "bozulmamis kod bile dusuyor", "mutasyon
hayatta kalmis" ve "mutasyon deseni artik tutmuyor" hallerini kurup suitin
GERCEKTEN kirmizi verdigini gosterir; 6 vaka, cikis 0 bekleniyor.
Bu kanarya bir gercek kusurdan dogdu: ilk surumde kor-nokta esigi `15/15` diye
SABIT yaziliydi, sinav 21 vakaya cikinca esik hicbir zaman tutmadi ve suit
hayatta kalan bir mutasyonu isaretleyemez hale geldi; ustelik `node` hic
calismadiginda bile "kor nokta yok" basip cikis 0 donuyordu. Esik artik temel
kosudan OLCULUR, sabit yazilmaz.

## Paket dogrulama (salt okuma)

`node scripts/plan_dogrula.js`, `IYZICO_PAKETLER` katalogundaki her ABONELIK paketinin
iyzico'da gercekten var oldugunu ve tahsil edilecek bedelin sayfada yazan bedelle
ortustugunu olcer. Tek seferlik paketlerde iyzico'da plan olmadigi icin yalnizca
`tutar_kurus` alaninin gecerli oldugu denetlenir; o paketler tek satirda listelenir
ve bulgu sayilmaz.
Sayfada "+KDV" yazdigi icin kiyas KDV'li tutar uzerinden yapilir (2.980 -> 3576).

Tahsilat yapmaz, abonelik acmaz, iptal etmez; yalniz `GET /v2/subscription/pricing-plans/<ref>`.
Yeni paket acildiktan sonra ve fiyat degisiminde kosulur. Canli test odemesinin YERINE
GECMEZ: yalniz planin var oldugunu ve tutarin dogru oldugunu olcer, kart/3DS akisini sinamaz.
Bulgu varsa cikis 1.

Anahtarlar koda yazilmaz: `master.env` + Netlify'dan gelen `IYZICO_PAKETLER` ile kosar.
