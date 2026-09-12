// Motorun anlik goruntuyu yazdigi uc. POST /.netlify/functions/motor-yaz
//
// Motor, Savas Bey'in makinesinde calisiyor ve disaridan erisilebilir adresi
// yok. Blobs'a DOGRUDAN yazmiyor: o, Netlify kisisel erisim jetonu isterdi ve
// o jeton hesabin tamamina erisim verir (hesapta baska siteler var). Bunun
// yerine tek amacli bir sir ve bu uc.
//
// Uc yalnizca MOTORUN SAHIBI OLDUGU alanlari kabul eder. Panelin alanlari
// gelse bile yazilmaz: sahiplik kurali sozlesmeyle degil veriyle uygulanir,
// boylece yanlislikla ezilemez.
const crypto = require('crypto')
const veri = require('../veri')
const { hesapOku, hesapGuncelle } = require('../hesap')
const { json, govdeCoz } = require('../oturum')

// Tavanlar: tanimadigimiz bir govde fonksiyonu mesgul etmesin, depo da
// sinirsiz buyumesin.
const EN_COK_YAZI = 200
const EN_COK_KONU = 500
const ICERIK_TAVANI = 300 * 1024
const ALAN_TAVANI = 500
// Uyari musteriye gosterilecek bir cumle; uzun olmasi beklenmiyor ama
// kesilmis yarim cumle de gostermeyelim diye alan tavanindan genis.
const UYARI_TAVANI = 1000

// Motorun sahibi olduklari. Listede olmayan alan ALINMAZ.
const YAZI_ALANLARI = ['id', 'baslik', 'ozet', 'kategori', 'durum', 'tarih', 'okumaDk', 'kelime', 'kapak', 'adres']
const DURUMLAR = ['bekliyor', 'planlandi', 'yayinda', 'taslak']

function sirDogru (gelen) {
  const beklenen = process.env.MOTOR_SIRRI || ''
  if (!beklenen || !gelen) return false
  const a = Buffer.from(String(gelen))
  const b = Buffer.from(beklenen)
  // timingSafeEqual esit uzunluk ister; uzunluk farki da bilgi vermesin diye
  // once ozet alinip sabit uzunlukta karsilastiriliyor.
  const oa = crypto.createHash('sha256').update(a).digest()
  const ob = crypto.createHash('sha256').update(b).digest()
  return crypto.timingSafeEqual(oa, ob)
}

function metin (v, tavan) {
  if (typeof v !== 'string') return ''
  return v.slice(0, tavan || ALAN_TAVANI)
}

function yaziTemizle (ham) {
  const y = {}
  for (const alan of YAZI_ALANLARI) {
    if (ham[alan] === undefined || ham[alan] === null) continue
    if (alan === 'okumaDk' || alan === 'kelime') {
      const n = Number(ham[alan])
      if (Number.isFinite(n) && n >= 0) y[alan] = Math.floor(n)
      continue
    }
    y[alan] = metin(ham[alan], alan === 'ozet' ? 2000 : ALAN_TAVANI)
  }
  if (y.durum && !DURUMLAR.includes(y.durum)) y.durum = 'bekliyor'
  return y
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { hata: 'Yöntem desteklenmiyor.' })

  const basliklar = event.headers || {}
  const sir = basliklar['x-motor-sirri'] || basliklar['X-Motor-Sirri']
  if (!sirDogru(sir)) return json(401, { hata: 'Yetkisiz.' })

  const g = govdeCoz(event)
  if (!veri.slugGecerli(g.slug)) return json(400, { hata: 'Geçersiz slug.' })
  if (!Array.isArray(g.yazilar)) return json(400, { hata: 'yazilar dizi olmalı.' })
  if (g.yazilar.length > EN_COK_YAZI) return json(413, { hata: `En fazla ${EN_COK_YAZI} yazı.` })

  const yazilar = []
  const metinler = []
  for (const ham of g.yazilar) {
    if (!ham || typeof ham !== 'object') continue
    const id = metin(ham.id, 120)
    if (!id) continue
    const y = yaziTemizle(ham)
    y.id = id
    yazilar.push(y)
    // Metin ayri anahtara (Karar B): liste her acilista inmesin.
    if (typeof ham.icerik === 'string' && ham.icerik.length) {
      metinler.push({ id, icerik: ham.icerik.slice(0, ICERIK_TAVANI) })
    }
  }

  const konular = Array.isArray(g.konular)
    ? g.konular.slice(0, EN_COK_KONU).map((k) => ({
        id: metin(k && k.id, 120) || metin(k && k.konu, 120),
        konu: metin(k && k.konu, ALAN_TAVANI),
        kategori: metin(k && k.kategori, 120),
        hacim: Number(k && k.hacim) || 0,
        rekabet: metin(k && k.rekabet, 40),
        skor: Number(k && k.skor) || 0,
      }))
    : []

  const liste = {
    slug: g.slug,
    uretildi: new Date().toISOString(),
    motorZamani: metin(g.uretildi, 40) || null,
    blogAdresi: metin(g.blogAdresi, 300),
    baglantiDurumu: metin(g.baglantiDurumu, 60),
    // Motor, musterinin sectigi yayin programini uygulayamadiysa sebebini
    // burada bildiriyor. Yalniz uyari varken geliyor; gelmedigi durum
    // "program uygulandi" demektir, bos metin de oyle.
    //
    // Neden motorun alani: programi uygulayan taraf motor, uygulanip
    // uygulanmadigini da yalniz o biliyor. Panel bunu gosterir, yazmaz.
    programUyarisi: metin(g.programUyarisi, UYARI_TAVANI),
    yazilar,
    konular,
  }

  try {
    for (const m of metinler) await veri.motorYaziYaz(g.slug, m.id, { icerik: m.icerik })
    // Liste EN SONA yazilir: yarim yazilmis bir listede olmayan metne atif
    // olmasin. Tersi olsaydi panel, metni olmayan bir yaziyi onizlemeye
    // calisirdi.
    await veri.motorListeYaz(g.slug, liste)
  } catch (e) {
    console.error('motor anlik goruntusu yazilamadi', e && e.message)
    return json(503, { hata: 'Şu an yazılamıyor.' })
  }

  // Karar F: eslesmeyi motor bildirir. Hesap kaydina yalniz bu alan eklenir.
  let eslesme = 'yok'
  const eposta = metin(g.eposta, 200)
  if (eposta) {
    try {
      const hesap = await hesapOku(eposta)
      if (!hesap) eslesme = 'hesap bulunamadi'
      else if (hesap.motorSlug === g.slug) eslesme = 'zaten kurulu'
      else { await hesapGuncelle(eposta, { motorSlug: g.slug }); eslesme = 'kuruldu' }
    } catch (e) {
      console.error('eslesme yazilamadi', e && e.message)
      eslesme = 'yazilamadi'
    }
  }

  return json(200, {
    yazildi: true,
    slug: g.slug,
    yazi: yazilar.length,
    metin: metinler.length,
    konu: konular.length,
    eslesme,
    uretildi: liste.uretildi,
  })
}
