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

Zorunlu tek alan `plan`. `periyot` bos ise `ay` varsayilir.

### Fiyat degistirmek

`tutar` ve `notu` SERBEST METINDIR. Ekrana oldugu gibi basilir; sayi
bicimlendirmesi, otomatik "TL" eki ya da KDV hesabi YOKTUR. Karttan cekilen
tutari belirleyen tek sey iyzico'daki `plan` kodudur.

Bu yuzden **ekrandaki yazi ile cekilen para birbirinden bagimsizdir**. `tutar`
alanini degistirmek tahsilati DEGISTIRMEZ. Gercek tutari degistirmek icin
iyzico panelinde yeni fiyatlandirma plani acilir ve `plan` kodu guncellenir.
Ekranda vergi harici rakam yaziyorsa (bugunku hali), toplamin yanindaki notta
acikca yazili olmasi sarttir, yoksa sayfa yalan soyler.

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

### Yeni musteri paketi acmak

1. iyzico panelinde urun + fiyatlandirma plani olustur, plan referans kodunu al.
2. `IYZICO_PAKETLER` icine yeni slug ekle (yukaridaki PUT + build).
3. `https://dolunay.ai/odeme/<slug>` adresini curl ile ac, 200 ve dogru metin gor.
4. Linki musteriye gonder.

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
