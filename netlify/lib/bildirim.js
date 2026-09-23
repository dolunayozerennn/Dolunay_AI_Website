// Savas'a giden bildirimler: yeni musteri, yarida kalan odeme, yetim kayit.
//
// NEDEN VAR: bir musteri kaydolup odeme yaptiginda bunu hicbir yerden
// goremiyorduk. Civelek'in odemesi 8 Eylul'de alindi, dort gun sonra iyzico
// kaydi elle okunurken bulundu. Bu dosya o sessizligi kapatir.
//
// IKI KANAL, BIRI DIGERINE BAGLI DEGIL:
//   1. E-posta (Resend HTTP API) -> savas@dolunay.ai
//   2. Depoda olay kaydi (olay/<zaman>) -> yonetim ekrani okur
// E-posta gidemezse olay yine yazilir ve yonetim ekraninda "gonderilemedi"
// diye gorunur. Depo kapaliysa e-posta yine denenir. Ikisi birden cokerse
// fonksiyon kaydina yazilir; son kanal o.
//
// ASLA FIRLATMAZ. Bildirim, odeme akisinin sonucunu degistiremez: musteriye
// "aboneliginiz basladi" diyen sayfa, e-posta gitmedi diye hata vermemeli.
//
// ICERIK SINIRI: ad, marka, e-posta, telefon, paket, tutar, tarihler,
// referanslar. TCKN, adres ve sifre ozeti bildirime GIRMEZ; Savas'in bunlara
// bildirim aninda ihtiyaci yok ve e-posta kutusu ikinci bir veri deposu
// olmamali.
const crypto = require('crypto')
const { depoAc } = require('./hesap')
const { kayitIcin } = require('./sayfa')

const ALICI = 'savas@dolunay.ai'
const GONDEREN = 'dolunay.ai <savas@dolunay.ai>'
const RESEND_UCU = 'https://api.resend.com/emails'
// Callback bir kullaniciyi bekletiyor; e-posta icin sayfayi uzun tutmayiz.
const ZAMAN_ASIMI_MS = 8000

const OLAY_ONEK = 'olay/'
const ISARET = (t) => `bildirim/${encodeURIComponent(String(t))}`

// Sinav icin: gercek Resend yerine sahte gonderici verilebilir.
let gonderici = null
function gondericiAyarla (fn) {
  gonderici = typeof fn === 'function' ? fn : null
}

function kok () {
  return String(process.env.URL || 'https://dolunay.ai').replace(/\/+$/, '')
}

// --- bicimleme ------------------------------------------------------------

// ISO metni, epoch ms ya da Date -> "08.09.2026". Okunamazsa bos.
function tarihTr (x) {
  if (x === null || x === undefined || x === '') return ''
  const d = x instanceof Date ? x : new Date(typeof x === 'number' || /^\d{10,}$/.test(String(x)) ? Number(x) : String(x))
  if (Number.isNaN(d.getTime())) return String(x)
  return new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'Europe/Istanbul', day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(d)
}

// Aylik abonelikte sonraki cekim "ayin ayni gunu". Ay o gunu tasimiyorsa
// (31 Ocak -> Subat) ayin son gunune iner. Bu HESAPLANAN tarih; kesin tarih
// iyzico'daki bekleyen siparistir ve yonetim ekrani onu ayrica okur.
function birAySonra (x) {
  const d = x instanceof Date ? new Date(x.getTime()) : new Date(typeof x === 'number' ? x : String(x || ''))
  if (Number.isNaN(d.getTime())) return null
  const gun = d.getUTCDate()
  d.setUTCDate(1)
  d.setUTCMonth(d.getUTCMonth() + 1)
  const sonGun = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate()
  d.setUTCDate(Math.min(gun, sonGun))
  return d
}

function paketler () {
  try { return JSON.parse(process.env.IYZICO_PAKETLER || '{}') } catch { return {} }
}

// Paket katalogda iki yoldan aranir: satis adresindeki slug (blog-baslangic)
// ya da iyzico plan kodu. Bulunamazsa eldeki ham deger doner; bos birakmak
// "hangi paket" sorusunu cevapsiz birakirdi.
function paketBul (slugYaDaPlan) {
  const p = paketler()
  const k = String(slugYaDaPlan || '')
  if (!k) return null
  if (Object.prototype.hasOwnProperty.call(p, k)) return Object.assign({ slug: k }, p[k])
  for (const s of Object.keys(p)) if (p[s] && p[s].plan === k) return Object.assign({ slug: s }, p[s])
  return null
}

function paketAdi (slugYaDaPlan) {
  const p = paketBul(slugYaDaPlan)
  return (p && p.ad) || String(slugYaDaPlan || '')
}

function paketTutari (slugYaDaPlan) {
  const p = paketBul(slugYaDaPlan)
  if (!p || !p.tutar) return ''
  return p.periyot ? `${p.tutar} / ${p.periyot}` : String(p.tutar)
}

function govdeKur (baslik, satirlar, not) {
  const dolu = (satirlar || []).filter(([, d]) => d !== undefined && d !== null && String(d).trim() !== '')
  const en = dolu.reduce((m, [e]) => Math.max(m, e.length), 0)
  const govde = [baslik, '']
  for (const [etiket, deger] of dolu) govde.push(`${(etiket + ':').padEnd(en + 2)}${deger}`)
  if (not) govde.push('', not)
  govde.push('', `Yönetim ekranı: ${kok()}/yonetim/`,
    'Bu e-posta dolunay.ai ödeme akışı tarafından otomatik gönderildi.')
  return govde.join('\n')
}

// --- gonderim -------------------------------------------------------------

async function resendGonder ({ konu, metin, tekil }) {
  const anahtar = process.env.RESEND_API_KEY || ''
  // Anahtar yoksa ag cagrisi HIC yapilmaz. Olay yine yazilir; yonetim
  // ekrani "anahtar yok" gosterir. Sessiz basari gibi gorunmez.
  if (!anahtar) return { durum: 'anahtar-yok' }
  const kesici = new AbortController()
  const zamanlayici = setTimeout(() => kesici.abort(), ZAMAN_ASIMI_MS)
  try {
    const basliklar = { Authorization: `Bearer ${anahtar}`, 'Content-Type': 'application/json' }
    // Ayni olay iki kez tetiklenirse (callback tekrari) Resend ikinciyi dusurur.
    if (tekil) basliklar['Idempotency-Key'] = crypto.createHash('sha256').update(tekil).digest('hex')
    const cevap = await fetch(RESEND_UCU, {
      method: 'POST',
      signal: kesici.signal,
      headers: basliklar,
      body: JSON.stringify({ from: GONDEREN, to: [ALICI], subject: konu, text: metin }),
    })
    if (cevap.ok) {
      let id = ''
      try { id = (await cevap.json()).id || '' } catch { /* govdesiz basari */ }
      return { durum: 'gonderildi', id }
    }
    let ham = ''
    try { ham = await cevap.text() } catch { /* govde okunamadi */ }
    return { durum: 'hata', kod: cevap.status, ayrinti: kayitIcin(ham) }
  } catch (e) {
    return { durum: 'hata', ayrinti: kayitIcin(`${e && e.name}: ${e && e.message}`) }
  } finally {
    clearTimeout(zamanlayici)
  }
}

// tur    : olayin kisa adi (yeni-musteri, odeme-yarim, yetim, ...)
// onem   : 'bilgi' | 'dikkat'  (konu satirinda ve yonetim ekraninda ayirt edilir)
// baslik : e-postanin ilk satiri ve konunun govdesi
// satirlar: [[etiket, deger], ...]  bos degerler atlanir
// tekil  : ayni olayin ikinci kez bildirilmemesi icin anahtar (istege bagli)
async function bildir ({ tur, onem = 'bilgi', baslik, satirlar = [], not = '', eposta = '', tekil = '' }) {
  const sonuc = { tur, gonderim: 'denenmedi', olay: false }
  try {
    let d = null
    try { d = depoAc() } catch { d = null }

    if (tekil && d) {
      try {
        if (await d.get(ISARET(tekil), { type: 'json' })) return Object.assign(sonuc, { gonderim: 'zaten' })
      } catch { /* okunamadiysa gondermeye devam: iki e-posta, hic e-postadan iyidir */ }
    }

    const konu = `${onem === 'dikkat' ? '[DİKKAT] ' : ''}${baslik}`
    const metin = govdeKur(baslik, satirlar, not)

    let g
    try {
      g = await (gonderici || resendGonder)({ konu, metin, tekil })
    } catch (e) {
      g = { durum: 'hata', ayrinti: kayitIcin(e && e.message) }
    }
    sonuc.gonderim = g.durum
    if (g.durum === 'hata') console.error('bildirim gonderilemedi', tur, g.kod || '', g.ayrinti || '')
    if (g.durum === 'anahtar-yok') console.error('bildirim gonderilmedi: RESEND_API_KEY tanimli degil', tur)

    const zaman = new Date().toISOString()
    if (d) {
      try {
        await d.setJSON(`${OLAY_ONEK}${zaman}-${crypto.randomBytes(3).toString('hex')}`, {
          tur, onem, baslik, satirlar: satirlar.filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== ''),
          not, eposta, zaman, gonderim: g.durum, gonderimKodu: g.kod || null,
        })
        sonuc.olay = true
      } catch (e) {
        console.error('olay kaydi yazilamadi', tur, e && e.message)
      }
      // Isaret yalniz gonderim hatasizsa konur: Resend o an cevap vermediyse
      // ayni olay bir sonraki tetikte yeniden denenebilsin.
      if (tekil && g.durum !== 'hata') {
        try { await d.setJSON(ISARET(tekil), { tur, zaman }) } catch { /* bir dahaki sefere yine denenir */ }
      }
    }
    // Hicbir kanal tutmadiysa son iz fonksiyon kaydi. Musteri verisi yazilmaz.
    if (!sonuc.olay && g.durum !== 'gonderildi') console.error('BILDIRIM KAYBOLDU', tur, baslik)
  } catch (e) {
    console.error('bildirim beklenmeyen hata', tur, e && e.message)
  }
  return sonuc
}

module.exports = {
  bildir, gondericiAyarla, resendGonder,
  tarihTr, birAySonra, paketBul, paketAdi, paketTutari,
  ALICI, GONDEREN, OLAY_ONEK,
}
