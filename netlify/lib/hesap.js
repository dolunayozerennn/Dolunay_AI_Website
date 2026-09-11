// Hesap katmani: sifre ozeti ve odeme oncesi "bekleyen kayit".
//
// Abonelikte hesap odeme aninda ACILAMAZ: odemenin gercekten alinip alinmadigi
// ancak iyzico donusunde belli olur. Bu yuzden form gonderildiginde musterinin
// hesap bilgileri bekleyen kayit olarak saklanir; hesap, abonelik-sonuc'ta
// odeme ACTIVE dogrulandiktan sonra bu kayittan acilir.
//
// SIFRE DUZ METIN OLARAK HICBIR YERDE DURMAZ. Forma girilen sifre burada
// scrypt ile ozetlenir, ham hali cagiran tarafta da tutulmaz. Ozet disinda
// sifreye dair hicbir sey saklanmaz, loglanmaz, iyzico'ya gonderilmez.
//
// Depo Netlify Blobs. Otomasyon kendi kullanici katmanini actiginda degisecek
// tek dosya burasidir; cagiranlar bu dosyanin disina cikmaz.

const crypto = require('crypto')

const KOVA = 'hesaplar'

// Blobs istemcisi iki yoldan gelebilir:
//   1. CommonJS require ile (yerel testler ve sinav dosyalari boyle kullanir)
//   2. v2 kabugu ESM import edip `getStoreAyarla` ile verir (Netlify'da boyle)
//
// Ikincisi ZORUNLU. Olculdu: fonksiyonlar .mjs (ESM) olunca esbuild bu
// CommonJS require'ini bundle'a katmiyor, calisma anina birakiyor; paket
// /var/task altinda bulunmadigi icin fonksiyon "Cannot find module" ile 502
// veriyor. Kabugun ESM import'u ise normal sekilde bundle'laniyor.
let getStoreFn = null
try {
  ;({ getStore: getStoreFn } = require('@netlify/blobs'))
} catch (e) {
  // Bulunamadi; kabuk enjekte edecek. Burada patlamak yanlis olurdu, cunku
  // modul yuklenirken henuz kimse depoya dokunmuyor.
}

function getStoreAyarla (fn) {
  if (typeof fn === 'function') getStoreFn = fn
}

// Bekleyen kayit odeme tamamlanmazsa ortada kalir. Kart formu 30 dakika
// gecerli; 24 saat, gec donen bir odemeyi de kapsayacak kadar genis ama
// kaydin suresiz durmasina izin vermeyecek kadar dar.
const BEKLEYEN_OMRU_MS = 24 * 60 * 60 * 1000

// Parametreler ozetin YANINDA saklanir. Ileride maliyet artirildiginda eski
// kayitlar kendi parametreleriyle dogrulanmaya devam eder.
const SCRYPT = { N: 16384, r: 8, p: 1, uzunluk: 64 }

// scrypt varsayilan bellek siniri N=16384 icin yetmez; acikca yukseltilir.
const SCRYPT_BELLEK = 64 * 1024 * 1024

function depo () {
  if (typeof getStoreFn !== 'function') {
    throw new Error('Blobs istemcisi yok: kabuk getStoreAyarla ile vermeli')
  }
  // Guclu tutarlilik: kayit yazildiktan dakikalar sonra callback'te okunacak.
  // Eventual tutarlilikta "kayit yok" gorup hesabi acamamak, odemesi alinmis
  // musteriyi hesapsiz birakir.
  return getStoreFn({ name: KOVA, consistency: 'strong' })
}

// Ayni adresin farkli yazimlari tek kayda dusmeli.
function epostaAnahtari (eposta) {
  return String(eposta || '').trim().toLowerCase()
}

function bekleyenAnahtar (eposta, plan) {
  // Anahtar e-posta + plan uzerinden kurulur; mukerrer abonelik taramasi da
  // ayni ikiliye bakiyor. Ayni kisi ayni pakette formu tekrar doldurursa son
  // deneme oncekini gecer, istenen davranis budur.
  return `bekleyen/${encodeURIComponent(epostaAnahtari(eposta))}/${encodeURIComponent(String(plan || ''))}`
}

function scryptOzet (sifre, tuz, p) {
  return new Promise((coz, red) => {
    crypto.scrypt(sifre, tuz, p.uzunluk, { N: p.N, r: p.r, p: p.p, maxmem: SCRYPT_BELLEK }, (hata, tur) => {
      if (hata) red(hata)
      else coz(tur)
    })
  })
}

// Ozet tek satirlik metin olarak durur: parametreler, tuz ve ozet bir arada.
// Bicim: scrypt$N$r$p$<tuz-base64>$<ozet-base64>
async function sifreOzetle (sifre) {
  const tuz = crypto.randomBytes(16)
  const ozet = await scryptOzet(sifre, tuz, SCRYPT)
  return ['scrypt', SCRYPT.N, SCRYPT.r, SCRYPT.p, tuz.toString('base64'), ozet.toString('base64')].join('$')
}

// Girisi Asama 3'te bu dogrulayacak. Karsilastirma sabit zamanlidir.
async function sifreDogrula (sifre, saklanan) {
  try {
    const parca = String(saklanan || '').split('$')
    if (parca.length !== 6 || parca[0] !== 'scrypt') return false
    const p = { N: Number(parca[1]), r: Number(parca[2]), p: Number(parca[3]), uzunluk: 0 }
    if (![p.N, p.r, p.p].every(Number.isSafeInteger)) return false
    const tuz = Buffer.from(parca[4], 'base64')
    const beklenen = Buffer.from(parca[5], 'base64')
    if (!tuz.length || !beklenen.length) return false
    p.uzunluk = beklenen.length
    const bulunan = await scryptOzet(sifre, tuz, p)
    return bulunan.length === beklenen.length && crypto.timingSafeEqual(bulunan, beklenen)
  } catch {
    return false
  }
}

// Odeme baslatilmadan ONCE cagrilir. Yazilamazsa cagiran odemeyi baslatmaz:
// para alinip hesap acilamamasindansa odemenin hic baslamamasi yeglenir.
async function bekleyenYaz (kayit) {
  const simdi = Date.now()
  const govde = Object.assign({}, kayit, {
    olusturuldu: new Date(simdi).toISOString(),
    sonKullanma: new Date(simdi + BEKLEYEN_OMRU_MS).toISOString(),
  })
  await depo().setJSON(bekleyenAnahtar(kayit.eposta, kayit.plan), govde)
  return true
}

// Suresi dolmus kayit YOK sayilir; eski bir denemenin sifresiyle hesap acilmaz.
async function bekleyenOku (eposta, plan) {
  const kayit = await depo().get(bekleyenAnahtar(eposta, plan), { type: 'json' })
  if (!kayit) return null
  const bitis = Date.parse(kayit.sonKullanma || '')
  if (!Number.isFinite(bitis) || bitis < Date.now()) return null
  return kayit
}

async function bekleyenSil (eposta, plan) {
  await depo().delete(bekleyenAnahtar(eposta, plan))
}

// --- Asama 2: hesap, odeme ve tani kayitlari -----------------------------
//
// Yukarisi odeme ONCESI. Burasi odeme ACTIVE dogrulandiktan SONRA calisir.
//   hesap/<eposta>     panel girisi, marka bilgisi, sifre ozeti
//   odeme/<referans>   hangi abonelik hangi hesaba baglandi
//   yetim/<referans>   odeme alindi ama bekleyen kayit bulunamadi; elle acilir
//   tani/callback-sekli  saglayici donusunun ALAN ADLARI, bir kereligine

const HESAP = (e) => `hesap/${encodeURIComponent(epostaAnahtari(e))}`
const ODEME = (r) => `odeme/${encodeURIComponent(String(r))}`
const YETIM = (r) => `yetim/${encodeURIComponent(String(r))}`
const TANI = 'tani/callback-sekli'
const BEKLEYEN_ONEK = 'bekleyen/'

// Bekleyen kayitlar 24 saatte dusuyor, yani bu onek her zaman kucuk kalir.
// Tavan yine de var: tanimadigimiz bir depo durumunda fonksiyon suresiz
// donmesin.
const TARAMA_TAVANI = 500

// Jeton isaretcisi: <token> -> {eposta, plan}
//
// Callback'te ELIMIZDE HER ZAMAN OLAN tek sey token. Konusma kimligi
// saglayicinin donusune bagli (belgeye gore yalniz istekte gonderilirse geri
// geliyor, biz sorguda gondermiyoruz), e-posta ve plan da cevapta olmayabilir.
// Bu isaretci ikisine de bagli olmayan kesin yolu acar. En iyi cabadir:
// yazilamazsa odeme AKSAMAZ, eslestirme diger yollara duser.
const JETON = (t) => `jeton/${encodeURIComponent(String(t))}`

async function jetonYaz (token, kayit) {
  const simdi = Date.now()
  await depo().setJSON(JETON(token), Object.assign({}, kayit, {
    olusturuldu: new Date(simdi).toISOString(),
    sonKullanma: new Date(simdi + BEKLEYEN_OMRU_MS).toISOString(),
  }))
}

async function jetonOku (token) {
  const kayit = await depo().get(JETON(token), { type: 'json' })
  if (!kayit) return null
  const bitis = Date.parse(kayit.sonKullanma || '')
  if (!Number.isFinite(bitis) || bitis < Date.now()) return null
  return kayit
}

async function hesapOku (eposta) {
  return depo().get(HESAP(eposta), { type: 'json' })
}

// Ikinci kez cagrilirsa mevcut hesaba DOKUNMAZ. Callback birden fazla kez
// gelebilir ve musteri sonuc sayfasini yenileyebilir. Ustune yazmak, musterinin
// sonradan degistirdigi sifreyi ya da marka bilgisini sessizce geri alirdi.
async function hesapAc (eposta, kayit) {
  const varOlan = await hesapOku(eposta)
  if (varOlan) return { yeni: false, kayit: varOlan }
  const govde = Object.assign({}, kayit, { acildi: new Date().toISOString() })
  await depo().setJSON(HESAP(eposta), govde)
  return { yeni: true, kayit: govde }
}

async function odemeOku (referans) {
  return depo().get(ODEME(referans), { type: 'json' })
}

// Referans anahtarin kendisi oldugu icin ayni odeme iki kez yazilmaz.
async function odemeYaz (referans, kayit) {
  const anahtar = ODEME(referans)
  if (await depo().get(anahtar, { type: 'json' })) return false
  await depo().setJSON(anahtar, Object.assign({}, kayit, { yazildi: new Date().toISOString() }))
  return true
}

// Odeme alindi ama sahibi bulunamadi. Bu kayit bir hata raporu degil, elle
// islenecek bir is emridir: silinmez, ustune yazilir ki son durum gorunsun.
async function yetimYaz (referans, kayit) {
  await depo().setJSON(YETIM(referans), Object.assign({}, kayit, { yazildi: new Date().toISOString() }))
}

// Bekleyen kayit e-posta + plan ile anahtarlanir. Callback bu ikisini
// vermiyorsa elimizde yalniz konusma kimligi kalir; o da kaydin ICINDE durur,
// anahtarinda degil. Kayit sayisi az oldugu icin tarama yeterli. Hacim
// buyurse konusma kimligi icin ayri bir isaretci anahtar yazilir; o degisiklik
// yalniz bu dosyayi ilgilendirir, cagiranlar ayni kalir.
async function bekleyenBulKimlikle (konusmaKimligi) {
  const aranan = String(konusmaKimligi || '').trim()
  if (!aranan) return null
  const d = depo()
  const liste = await d.list({ prefix: BEKLEYEN_ONEK })
  const kayitlar = liste && Array.isArray(liste.blobs) ? liste.blobs.slice(0, TARAMA_TAVANI) : []
  for (const b of kayitlar) {
    const kayit = await d.get(b.key, { type: 'json' })
    if (!kayit || kayit.konusmaKimligi !== aranan) continue
    // Suresi dolmus kayit bekleyenOku'da da yok sayiliyor; iki yol ayni
    // kurala uymazsa eski bir denemenin sifresiyle hesap acilabilir.
    const bitis = Date.parse(kayit.sonKullanma || '')
    if (!Number.isFinite(bitis) || bitis < Date.now()) return null
    return kayit
  }
  return null
}

// Bir kez yazilir, ustune YAZILMAZ: aranan sey ilk gercek callback'in sekli.
// Sonraki odemeler ayni soruyu tekrar cevaplamaz.
async function taniYaz (sekil) {
  const d = depo()
  if (await d.get(TANI, { type: 'json' })) return false
  await d.setJSON(TANI, Object.assign({}, sekil, { yazildi: new Date().toISOString() }))
  return true
}

// --- Asama 3: oturum ve giris denemesi sayaci ----------------------------
//
//   oturum/<id>      giris yapmis kullanici
//   deneme/<eposta>  basarisiz giris sayaci
//
// Oturum kimligi OPAK ve rastgele; icinde bilgi tasimaz. Imzali jeton
// (HMAC) da olurdu ve depo gerektirmezdi, ama IPTAL EDILEMEZDI: cikis
// yapinca oturum gercekten kapanmali, sifre degisince eski oturumlar
// dusmeli. Zaten Blobs kullaniliyor, yeni bagimlilik yok.

const OTURUM = (id) => `oturum/${encodeURIComponent(String(id))}`
const DENEME = (e) => `deneme/${encodeURIComponent(epostaAnahtari(e))}`

// 7 gun. Panel gunluk kullanilan bir arac; kisa sure surekli giris demek.
// "Beni hatirla" yok: tek sure herkese ayni.
const OTURUM_OMRU_MS = 7 * 24 * 60 * 60 * 1000

// Kaba kuvvet kapisi. scrypt zaten pahali (N=16384), bu sayac onun ustune
// ikinci katman. Sayilar burada duruyor ki degistirmek icin kod okumak
// gerekmesin.
const DENEME_PENCERESI_MS = 15 * 60 * 1000
const DENEME_TAVANI = 10

// 32 bayt rastgele, base64url. Tahmin edilemez olmasi tek sart.
function oturumKimligiUret () {
  return crypto.randomBytes(32).toString('base64url')
}

async function oturumAc (eposta) {
  const id = oturumKimligiUret()
  const simdi = Date.now()
  await depo().setJSON(OTURUM(id), {
    eposta: epostaAnahtari(eposta),
    olusturuldu: new Date(simdi).toISOString(),
    sonKullanma: new Date(simdi + OTURUM_OMRU_MS).toISOString(),
  })
  return { id, omurMs: OTURUM_OMRU_MS }
}

// Suresi dolmus oturum YOK sayilir. Kaydi ayrica silmiyoruz: silme isi
// bir sonraki cikis ya da temizlik turuna kalir, okuma tarafi yeter.
async function oturumOku (id) {
  if (!id) return null
  const kayit = await depo().get(OTURUM(id), { type: 'json' })
  if (!kayit) return null
  const bitis = Date.parse(kayit.sonKullanma || '')
  if (!Number.isFinite(bitis) || bitis < Date.now()) return null
  return kayit
}

async function oturumKapat (id) {
  if (!id) return
  await depo().delete(OTURUM(id))
}

// Pencere dolduysa sayac sifirdan baslar; boylece eski hatalar birikmez.
async function denemeOku (eposta) {
  const kayit = await depo().get(DENEME(eposta), { type: 'json' })
  if (!kayit) return { sayi: 0, kilitli: false, kalanMs: 0 }
  const bitis = Date.parse(kayit.pencereSonu || '')
  if (!Number.isFinite(bitis) || bitis < Date.now()) return { sayi: 0, kilitli: false, kalanMs: 0 }
  return {
    sayi: Number(kayit.sayi) || 0,
    kilitli: (Number(kayit.sayi) || 0) >= DENEME_TAVANI,
    kalanMs: bitis - Date.now(),
  }
}

async function denemeArtir (eposta) {
  const d = depo()
  const anahtar = DENEME(eposta)
  const kayit = await d.get(anahtar, { type: 'json' })
  const bitis = kayit ? Date.parse(kayit.pencereSonu || '') : NaN
  const pencereSuruyor = Number.isFinite(bitis) && bitis >= Date.now()
  const sayi = (pencereSuruyor ? Number(kayit.sayi) || 0 : 0) + 1
  await d.setJSON(anahtar, {
    sayi,
    pencereSonu: pencereSuruyor
      ? kayit.pencereSonu
      : new Date(Date.now() + DENEME_PENCERESI_MS).toISOString(),
  })
  return sayi
}

async function denemeSifirla (eposta) {
  await depo().delete(DENEME(eposta))
}

module.exports = {
  getStoreAyarla,
  sifreOzetle, sifreDogrula, bekleyenYaz, bekleyenOku, bekleyenSil, epostaAnahtari,
  hesapOku, hesapAc, odemeOku, odemeYaz, yetimYaz, bekleyenBulKimlikle, taniYaz,
  jetonYaz, jetonOku,
  oturumAc, oturumOku, oturumKapat, denemeOku, denemeArtir, denemeSifirla,
  OTURUM_OMRU_MS, DENEME_TAVANI, DENEME_PENCERESI_MS,
}
