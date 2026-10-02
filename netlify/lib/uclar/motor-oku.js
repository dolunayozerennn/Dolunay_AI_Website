// Motorun panel kararlarini okudugu uc.
//   GET  /.netlify/functions/motor-oku?slug=<slug>   bekleyen kararlar
//   POST /.netlify/functions/motor-oku               islenenleri isaretler
//
// Tek yonlu akisin ikinci yarisi: panel motora bir sey gonderemiyor (motorun
// disaridan erisilebilir adresi yok), motor gelip buradan aliyor.
//
// Motor "sunu isledim" demek zorunda ama PANELIN kaydina yazamaz (sahiplik).
// Bu yuzden kendi imlecini kendi alaninda tutuyor: motor/<slug>/islenen.
//
// "bekleyen" yalniz yazi kararlarini degil KONU kararlarini da tasir
// (konu-ekle / konu-cikar). Musterinin onerdigi konu motora ulasmazsa panelde
// "sıradaki yazı olarak üretilecek" yazip hicbir sey yapmamis oluyorduk.
const crypto = require('crypto')
const veri = require('../veri')
const { json, govdeCoz } = require('../oturum')

const tanisma = require('../tanisma')
const { depoAc } = require('../hesap')

const EN_COK_ISARET = 1000

// Yonetim kaydi yoksa formu bulmanin ikinci yolu: motorSlug'i bu slug olan
// hesap. Hesap sayisi az, tarama yeterli; e-posta MOTORDAN alinmaz ki sir
// sizarsa e-posta tahminiyle form okunamasin.
async function motorSlugHesabi (slug) {
  const d = depoAc()
  const liste = await d.list({ prefix: 'hesap/' })
  for (const b of (liste && Array.isArray(liste.blobs) ? liste.blobs : []).slice(0, 2000)) {
    const h = await d.get(b.key, { type: 'json' })
    if (h && h.motorSlug === slug && h.eposta) return h.eposta
  }
  return null
}

function sirDogru (gelen) {
  const beklenen = process.env.MOTOR_SIRRI || ''
  if (!beklenen || !gelen) return false
  const oa = crypto.createHash('sha256').update(Buffer.from(String(gelen))).digest()
  const ob = crypto.createHash('sha256').update(Buffer.from(beklenen)).digest()
  return crypto.timingSafeEqual(oa, ob)
}

exports.handler = async (event) => {
  const basliklar = event.headers || {}
  if (!sirDogru(basliklar['x-motor-sirri'])) return json(401, { hata: 'Yetkisiz.' })

  if (event.httpMethod === 'GET') {
    const slug = (event.queryStringParameters || {}).slug
    if (!veri.slugGecerli(slug)) return json(400, { hata: 'Geçersiz slug.' })

    let kararlar, islenen, ayarlar, yonetim, tanismaKaydi, tanismaEposta
    try {
      kararlar = await veri.kararlarOku(slug)
      islenen = await veri.islenenOku(slug)
      ayarlar = await veri.ayarlarOku(slug)
      // Tanisma formu ve Savas'in notlari (sozlesme bolum 3). Burada yalniz
      // bu slug'in kaydi; liste motor-musteriler ucunda (karar 2026-10-02).
      yonetim = await tanisma.yonetimOku(slug)
      tanismaEposta = (yonetim && yonetim.eposta) || await motorSlugHesabi(slug)
      tanismaKaydi = tanismaEposta ? await tanisma.tanismaOku(tanismaEposta) : null
      if (!tanismaKaydi) tanismaEposta = null
    } catch (e) {
      console.error('kararlar okunamadi', e && e.message)
      return json(503, { hata: 'Şu an okunamıyor.' })
    }

    return json(200, {
      slug,
      // Motorun daha once islemedikleri. Her kararin kimligi zamanini da
      // icerdigi icin ayni yazinin ikinci bir duzenlemesi yeni bir is olur.
      bekleyen: veri.bekleyenKararlar(kararlar, islenen),
      // Panel sahibi ayarlar: motor bunlari OKUR, yazmaz.
      ayarlar: {
        yayinProgrami: ayarlar.yayinProgrami || null,
        marka: ayarlar.marka || null,
        whatsapp: ayarlar.whatsapp || null,
      },
      tanisma: tanismaKaydi || null,
      tanismaEposta: tanismaEposta || null,
      yonetim: yonetim
        ? {
            slug: yonetim.slug, markaAdi: yonetim.markaAdi || '', eposta: yonetim.eposta || '',
            telefon: yonetim.telefon || '', siteAdresi: yonetim.siteAdresi || '', kaynak: yonetim.kaynak || '',
            guncellendi: yonetim.guncellendi || null, notlar: Array.isArray(yonetim.notlar) ? yonetim.notlar : [],
            // Silinen notlarin yalniz kimligi ve ani; metin yok. Motor
            // onceden okudugu notun izini buna gore kaldirir.
            silinenNotlar: Array.isArray(yonetim.silinenNotlar) ? yonetim.silinenNotlar : [],
          }
        : null,
    })
  }

  if (event.httpMethod === 'POST') {
    const g = govdeCoz(event)
    if (!veri.slugGecerli(g.slug)) return json(400, { hata: 'Geçersiz slug.' })
    if (!Array.isArray(g.kimlikler)) return json(400, { hata: 'kimlikler dizi olmalı.' })

    try {
      const islenen = await veri.islenenOku(g.slug)
      const kume = new Set(islenen.kararlar || [])
      for (const k of g.kimlikler.slice(0, EN_COK_ISARET)) {
        if (typeof k === 'string' && k) kume.add(k.slice(0, 300))
      }
      // Liste sinirsiz buyumesin: en yeniler tutulur.
      const liste = [...kume].slice(-EN_COK_ISARET)
      await veri.islenenYaz(g.slug, { kararlar: liste, guncellendi: new Date().toISOString() })
      return json(200, { isaretlendi: true, toplam: liste.length })
    } catch (e) {
      console.error('islenen imleci yazilamadi', e && e.message)
      return json(503, { hata: 'Şu an yazılamıyor.' })
    }
  }

  return json(405, { hata: 'Yöntem desteklenmiyor.' })
}
