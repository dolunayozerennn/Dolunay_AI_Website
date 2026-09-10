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
const { getStore } = require('@netlify/blobs')

const KOVA = 'hesaplar'

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
  // Guclu tutarlilik: kayit yazildiktan dakikalar sonra callback'te okunacak.
  // Eventual tutarlilikta "kayit yok" gorup hesabi acamamak, odemesi alinmis
  // musteriyi hesapsiz birakir.
  return getStore({ name: KOVA, consistency: 'strong' })
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

module.exports = { sifreOzetle, sifreDogrula, bekleyenYaz, bekleyenOku, bekleyenSil, epostaAnahtari }
