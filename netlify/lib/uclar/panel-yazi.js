// Bir yazinin tam metni. GET /.netlify/functions/panel-yazi?id=<id>
//
// Metin listeden AYRI duruyor (Karar B): yazi basina ~4,5 KB, Premium'da 30
// yazi ≈ 135 KB. Panel her acilista bunu indirmek zorunda degil; tam metin
// yalniz onizleme ya da duzenleme acilinca cekiliyor.
//
// Musteri metni duzenlediyse PANELIN metni doner, motorunki degil: birlestirme
// kuralinin ayni yerde uygulanmasi icin.
const veri = require('../veri')
const { oturumOku, hesapOku } = require('../hesap')
const { cerezOku, cerezSil, json } = require('../oturum')

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') {
    return json(405, { hata: 'Yöntem desteklenmiyor.' })
  }

  const oturumId = cerezOku(event)
  if (!oturumId) return json(401, { girisli: false })

  const yaziId = String((event.queryStringParameters || {}).id || '').trim()
  if (!yaziId) return json(400, { hata: 'Yazı kimliği gerekli.' })

  let oturum, hesap
  try {
    oturum = await oturumOku(oturumId)
    if (!oturum) return json(401, { girisli: false }, cerezSil())
    hesap = await hesapOku(oturum.eposta)
  } catch (e) {
    console.error('oturum ya da hesap okunamadi', e && e.message)
    return json(503, { hata: 'Yazı şu an okunamıyor.' })
  }
  if (!hesap) return json(401, { girisli: false }, cerezSil())

  const slug = hesap.motorSlug || ''
  if (!slug) return json(404, { hata: 'Yazı bulunamadı.' })

  try {
    const kararlar = await veri.kararlarOku(slug)
    const karar = (kararlar.yazilar || {})[yaziId]

    // Panelin metni varsa motora hic gidilmez.
    const panelMetni = karar && karar.metinDegisikligi && karar.metinDegisikligi.icerik
    if (panelMetni) {
      return json(200, { id: yaziId, icerik: panelMetni, kaynak: 'panel' })
    }

    const motorYazi = await veri.motorYaziOku(slug, yaziId)
    if (!motorYazi || typeof motorYazi.icerik !== 'string') {
      return json(404, { hata: 'Yazı bulunamadı.' })
    }
    return json(200, { id: yaziId, icerik: motorYazi.icerik, kaynak: 'motor' })
  } catch (e) {
    console.error('yazi okunamadi', e && e.message)
    return json(503, { hata: 'Yazı şu an okunamıyor.' })
  }
}
