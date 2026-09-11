// Panelin okudugu tek uc. GET /.netlify/functions/panel-veri
//
// Panel sayfalari statik dosya; koruma "sayfada musteri verisi yok, veri
// yalnizca kimlik dogrulayan uclardan gelir" kuralinda. Burasi o uc.
//
// Donen sekil, panelin bugune kadar data/mock.js'ten okudugu seklin aynisi.
// Panelin geri kalani degismiyor: Asama 1'de "tek veri nesnesinden okusun"
// diye kurulmustu, karsiligini burada veriyor.
const veri = require('../veri')
const { oturumOku, hesapOku, depoAc } = require('../hesap')
const { cerezOku, cerezSil, json } = require('../oturum')

// Odeme kayitlari e-postaya gore indekslenmis degil. Musteri basina kayit
// sayisi az (aylik bir tahsilat), tarama bu yuzden yeterli. Hacim buyurse
// hesap kaydina odeme referanslari eklenir; o degisiklik yalniz burayi
// ilgilendirir.
const ODEME_TARAMA_TAVANI = 300

function bugunIstanbul () {
  // Sunucu UTC calisiyor; panelin takvimi Turkiye gununu bekliyor.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date())
}

function paketleriOku () {
  try { return JSON.parse(process.env.IYZICO_PAKETLER || '{}') } catch { return {} }
}

async function odemeleriTopla (eposta) {
  const d = depoAc()
  const liste = await d.list({ prefix: 'odeme/' })
  const anahtarlar = (liste && Array.isArray(liste.blobs) ? liste.blobs : []).slice(0, ODEME_TARAMA_TAVANI)
  const cikti = []
  for (const b of anahtarlar) {
    const kayit = await d.get(b.key, { type: 'json' })
    if (!kayit || kayit.eposta !== eposta) continue
    // Fatura bilgisi (TCKN, adres, telefon) panele GITMEZ. Odeme gecmisinde
    // gosterilmesi gereken tek sey hangi abonelik ne zaman baslamis.
    cikti.push({
      referans: kayit.referans || '',
      plan: kayit.plan || '',
      slug: kayit.slug || '',
      zaman: kayit.yazildi || null,
    })
  }
  cikti.sort((a, b) => String(b.zaman || '').localeCompare(String(a.zaman || '')))
  return cikti
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') {
    return json(405, { hata: 'Yöntem desteklenmiyor.' })
  }

  const id = cerezOku(event)
  if (!id) return json(401, { girisli: false })

  let oturum, hesap
  try {
    oturum = await oturumOku(id)
    if (!oturum) return json(401, { girisli: false }, cerezSil())
    hesap = await hesapOku(oturum.eposta)
  } catch (e) {
    console.error('oturum ya da hesap okunamadi', e && e.message)
    return json(503, { hata: 'Veriler şu an okunamıyor.' })
  }
  // Hesabi silinmis oturum gecersizdir; oturum ucuyla ayni kural.
  if (!hesap) return json(401, { girisli: false }, cerezSil())

  const slug = hesap.motorSlug || ''
  const paketler = paketleriOku()
  const paket = paketler[hesap.slug] || {}

  let motor = null
  let kararlar = { yazilar: {}, konular: {} }
  let ayarlar = {}
  let odemeGecmisi = []
  try {
    if (slug) {
      motor = await veri.motorListeOku(slug)
      kararlar = await veri.kararlarOku(slug)
      ayarlar = await veri.ayarlarOku(slug)
    }
    odemeGecmisi = await odemeleriTopla(oturum.eposta)
  } catch (e) {
    console.error('panel verisi okunamadi', e && e.message)
    return json(503, { hata: 'Veriler şu an okunamıyor.' })
  }

  const govde = veri.birlestir({
    motor: motor || {},
    kararlar,
    ayarlar,
    hesap,
    paketler,
    abonelik: {
      paket: paket.ad || '',
      aylikYazi: Number(paket.aylikYazi) || 0,
      durum: 'aktif',
    },
    odemeGecmisi,
    bugun: bugunIstanbul(),
  })

  // "Veri gelmedi" ile "yazi yok" ayri seyler. Panel bos durumu bu iki
  // bayraga gore secer; yoksa motor hic calismadiginda musteri "benim
  // yazilarim silinmis" sanir.
  govde.motorBagli = Boolean(slug)
  govde.motorYazdiMi = Boolean(motor)

  return json(200, govde)
}
