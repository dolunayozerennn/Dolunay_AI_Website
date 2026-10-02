// Tanisma formu ve yonetim kaydi: sekil, dogrulama, depo anahtarlari.
//
// Sozlesme motor deposunda yazili: Blog-Motoru/_kopru/panel-sozlesme.md
// Alan adi, tavan ya da secenek listesi degisirse o dosya da degisir; motor
// oturumu ona gore okuyor.
//
// SAHIPLIK (karar 2026-09-12'nin devami):
//   tanisma/<eposta>          MUSTERI yazar (panel-tanisma), motor ve yonetim okur
//   yonetim/musteri/<slug>    SAVAS yazar (yonetim-yaz), motor ve yonetim okur
// Musteri paneli yonetim kaydini HICBIR yoldan okumaz: notlar musteriye gitmez.
const hesapLib = require('./hesap')
const veri = require('./veri')

const TANISMA = (e) => `tanisma/${encodeURIComponent(hesapLib.epostaAnahtari(e))}`
const YONETIM_ONEK = 'yonetim/musteri/'
const YONETIM = (s) => `${YONETIM_ONEK}${encodeURIComponent(s)}`

const SEMA_SURUMU = 1

const SITE_YONETIMI = ['wordpress', 'wix', 'shopify', 'ikas', 'ticimax', 'ideasoft', 'ozel', 'site-yok', 'bilmiyorum', 'diger']
const NOT_KANALLARI = ['whatsapp', 'eposta', 'telefon', 'yuz-yuze', 'diger']
const EN_COK_NOT = 500
const NOT_TAVANI = 8000

function kirp (v, tavan) {
  return typeof v === 'string' ? v.trim().slice(0, tavan) : ''
}

// Semasiz yazilan adrese https eklenir; javascript: gibi semalar alinmaz.
function adresDuzelt (v) {
  const a = kirp(v, 300)
  if (!a) return ''
  if (/^https?:\/\//i.test(a)) return a
  if (/^[a-z][a-z0-9+.-]*:/i.test(a)) return null
  return 'https://' + a
}

// Sozlesmedeki sekli kurar. Hatalar alan adiyla doner ki panel onlari
// ilgili alanin altina yazsin (alert yok, karar 2026-09-09).
function tanismaTemizle (g) {
  g = g || {}
  const i = (g.iletisim && typeof g.iletisim === 'object') ? g.iletisim : {}
  const hatalar = {}

  const k = {
    semaSurumu: SEMA_SURUMU,
    firmaHizmetler: kirp(g.firmaHizmetler, 4000),
    hedefOkuyucu: kirp(g.hedefOkuyucu, 2000),
    istenmeyenKonular: kirp(g.istenmeyenKonular, 2000),
    oneCikanKonular: kirp(g.oneCikanKonular, 2000),
    siteAdresi: '',
    siteYonetimi: '',
    siteYonetimiDiger: '',
    iletisim: {
      adSoyad: kirp(i.adSoyad, 120),
      gorev: kirp(i.gorev, 120),
      telefon: kirp(i.telefon, 40),
      eposta: kirp(i.eposta, 200),
    },
  }

  if (!k.firmaHizmetler) hatalar.firmaHizmetler = 'Firmanızı ve hizmetlerinizi kısaca yazın.'
  if (!k.iletisim.adSoyad) hatalar['iletisim.adSoyad'] = 'İletişim kişisinin adını yazın.'
  if (k.iletisim.eposta && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(k.iletisim.eposta)) {
    hatalar['iletisim.eposta'] = 'E-posta adresi geçerli görünmüyor.'
  }

  const adres = adresDuzelt(g.siteAdresi)
  if (adres === null) hatalar.siteAdresi = 'Adres http:// ya da https:// ile başlamalı.'
  else k.siteAdresi = adres

  const sy = kirp(g.siteYonetimi, 40)
  if (sy && !SITE_YONETIMI.includes(sy)) hatalar.siteYonetimi = 'Listeden bir seçenek seçin.'
  else k.siteYonetimi = sy
  if (k.siteYonetimi === 'diger') k.siteYonetimiDiger = kirp(g.siteYonetimiDiger, 200)

  return { kayit: k, hatalar }
}

async function tanismaOku (eposta) {
  if (!eposta) return null
  return hesapLib.depoAc().get(TANISMA(eposta), { type: 'json' })
}

// Ilk kayit zamani ve sayac korunur; geri kalan her sey ustune yazilir.
async function tanismaYaz (eposta, temiz) {
  const d = hesapLib.depoAc()
  const eski = await d.get(TANISMA(eposta), { type: 'json' })
  const simdi = new Date().toISOString()
  const kayit = Object.assign({}, temiz, {
    ilkKayit: (eski && eski.ilkKayit) || simdi,
    guncellendi: simdi,
    guncellemeSayisi: ((eski && Number(eski.guncellemeSayisi)) || 0) + 1,
  })
  await d.setJSON(TANISMA(eposta), kayit)
  return kayit
}

// --- yonetim kaydi --------------------------------------------------------

async function yonetimOku (slug) {
  if (!veri.slugGecerli(slug)) return null
  return hesapLib.depoAc().get(YONETIM(slug), { type: 'json' })
}

async function yonetimYaz (slug, kayit) {
  await hesapLib.depoAc().setJSON(YONETIM(slug), kayit)
}

async function yonetimHepsi () {
  const d = hesapLib.depoAc()
  const liste = await d.list({ prefix: YONETIM_ONEK })
  const anahtarlar = (liste && Array.isArray(liste.blobs) ? liste.blobs : []).slice(0, 2000)
  const kayitlar = await Promise.all(anahtarlar.map(async (b) => {
    try { return await d.get(b.key, { type: 'json' }) } catch { return null }
  }))
  return kayitlar.filter(Boolean)
}

// Musteri basina bir satir. Uc kaynak birlesir:
//   1. panel hesaplari (hesap/)
//   2. yonetimden elle eklenen kayitlar (yonetim/musteri/)
//   3. motorun yazdigi ama ikisinde de olmayan slug'lar (motor/<slug>/liste)
// Esleme: kayit once e-postayla, sonra slug'la hesaba baglanir. Yonetim
// ekrani ve motor-musteriler ayni listeyi kullanir ki ikisi ayrismasin.
// hesapKayitlari verilmezse depodan okunur.
async function musteriSatirlari (d, hesapKayitlari) {
  if (!hesapKayitlari) {
    const hl = await d.list({ prefix: 'hesap/' })
    hesapKayitlari = (await Promise.all((hl && Array.isArray(hl.blobs) ? hl.blobs : []).slice(0, 2000)
      .map((b) => d.get(b.key, { type: 'json' }).catch(() => null)))).filter(Boolean)
  }
  const kayitlar = await yonetimHepsi()
  const kullanilan = new Set()
  const satirlar = []

  for (const h of hesapKayitlari) {
    const eposta = String(h.eposta || '').toLowerCase()
    const y = kayitlar.find((k) => k.eposta && k.eposta === eposta) ||
      (h.motorSlug ? kayitlar.find((k) => k.slug === h.motorSlug) : null) || null
    if (y) kullanilan.add(y.slug)
    satirlar.push({
      tur: 'hesap', markaAdi: h.markaAdi || (y && y.markaAdi) || '', eposta,
      telefon: (y && y.telefon) || '', motorSlug: h.motorSlug || '',
      slug: h.motorSlug || (y && y.slug) || '', kayitTarihi: h.acildi || null, yonetim: y,
    })
  }
  for (const y of kayitlar) {
    if (kullanilan.has(y.slug)) continue
    kullanilan.add(y.slug)
    satirlar.push({
      tur: 'elle', markaAdi: y.markaAdi || '', eposta: y.eposta || '', telefon: y.telefon || '',
      motorSlug: '', slug: y.slug, kayitTarihi: y.olusturuldu || null, yonetim: y,
    })
  }
  const ml = await d.list({ prefix: 'motor/' })
  const motorSluglari = (ml && Array.isArray(ml.blobs) ? ml.blobs : [])
    .map((b) => /^motor\/([^/]+)\/liste$/.exec(b.key)).filter(Boolean).map((m) => decodeURIComponent(m[1]))
  const bilinen = new Set(satirlar.map((s) => s.slug).filter(Boolean))
  for (const s of motorSluglari) {
    if (bilinen.has(s)) continue
    satirlar.push({ tur: 'motor', markaAdi: '', eposta: '', telefon: '', motorSlug: s, slug: s, kayitTarihi: null, yonetim: null })
  }
  return satirlar
}

function notKimligi (zaman) {
  const z = zaman.replace(/\D/g, '').slice(0, 14)
  return `n-${z}-${require('crypto').randomBytes(2).toString('hex')}`
}

// --- durum (motorun yazdigi, yalniz yonetim ekrani okur) -----------------

// Motorun `durum` alani. Gelen her motor-yaz bunu TAMAMEN yeniler; gelmeyen
// alt alan bos kalir. Burada tahmin yok: tanimsiz deger null'a doner ki
// ekran "bilinmiyor" ile "hayir"i karistirmasin.
function durumTemizle (ham) {
  if (!ham || typeof ham !== 'object') return null
  const bool = (v) => (typeof v === 'boolean' ? v : null)
  const n = Number(ham.havuzBekleyenSayisi)
  const uyarilar = Array.isArray(ham.uyarilar)
    ? ham.uyarilar.slice(0, 20).filter((u) => u && typeof u === 'object' && typeof u.metin === 'string' && u.metin.trim())
        .map((u) => ({
          anahtar: kirp(u.anahtar, 200),
          metin: kirp(u.metin, 500),
          zaman: kirp(u.zaman, 40) || null,
        }))
    : null
  return {
    aktif: bool(ham.aktif),
    havuzOnayBekliyor: bool(ham.havuzOnayBekliyor),
    havuzBekleyenSayisi: Number.isFinite(n) && n >= 0 && ham.havuzBekleyenSayisi !== null && ham.havuzBekleyenSayisi !== undefined ? Math.floor(n) : null,
    uyarilar,
  }
}

// Yonetim ekraninin durum sutunlari. Kaynak motorun listesi + panelin
// kararlari; ikisi de yoksa her sey bos. Sayi ve tarih UYDURULMAZ.
function durumOzeti (motor, kararlar) {
  if (!motor) return null
  const yk = (kararlar && kararlar.yazilar) || {}
  const yazilar = (Array.isArray(motor.yazilar) ? motor.yazilar : []).map((y) => veri.yaziBirlestir(y, yk[y.id]))
  const yayinda = yazilar.filter((y) => y.durum === 'yayinda' && y.tarih).sort((a, b) => String(b.tarih).localeCompare(String(a.tarih)))
  const bekleyen = yazilar.filter((y) => y.durum === 'bekliyor')
    .sort((a, b) => String(a.tarih || '9999').localeCompare(String(b.tarih || '9999')))
  const d = motor.durum || null
  return {
    sonYazim: motor.uretildi || null,
    aktif: d ? d.aktif : null,
    havuzOnayBekliyor: d ? d.havuzOnayBekliyor : null,
    havuzBekleyenSayisi: d ? d.havuzBekleyenSayisi : null,
    sonYazi: yayinda[0] ? { baslik: yayinda[0].baslik || '', tarih: yayinda[0].tarih } : null,
    onayBekleyen: { sayi: bekleyen.length, ilk: bekleyen[0] ? { baslik: bekleyen[0].baslik || '', tarih: bekleyen[0].tarih || null } : null },
    uyarilar: d && Array.isArray(d.uyarilar) ? d.uyarilar : null,
    programUyarisi: motor.programUyarisi || '',
  }
}

module.exports = {
  TANISMA, YONETIM, YONETIM_ONEK, SEMA_SURUMU, SITE_YONETIMI, NOT_KANALLARI, EN_COK_NOT, NOT_TAVANI,
  kirp, adresDuzelt, tanismaTemizle, tanismaOku, tanismaYaz,
  yonetimOku, yonetimYaz, yonetimHepsi, musteriSatirlari, notKimligi,
  durumTemizle, durumOzeti,
}
