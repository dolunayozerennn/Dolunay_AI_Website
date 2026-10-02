// Musterinin tanisma formu. GET okur, POST yazar.
//   /.netlify/functions/panel-tanisma
//
// Odeme sonrasi musteri panelde doldurur, sonradan guncelleyebilir. Kayit
// HESABA (e-postaya) bagli, motorSlug'a degil: musteri formu motor
// baglanmadan once dolduruyor. panel-karar bu yuzden kullanilmadi, o uc
// motorSlug yoksa 409 veriyor.
//
// Sifre ya da giris bilgisi bu formda ISTENMEZ (is emri 2026-10-01).
const tanisma = require('../tanisma')
const { oturumOku, hesapOku } = require('../hesap')
const { cerezOku, cerezSil, json, govdeCoz } = require('../oturum')
const { bildir } = require('../bildirim')

exports.handler = async (event) => {
  if (!['GET', 'HEAD', 'POST'].includes(event.httpMethod)) {
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
    return json(503, { hata: 'Şu an işlem yapılamıyor.' })
  }
  if (!hesap) return json(401, { girisli: false }, cerezSil())

  if (event.httpMethod !== 'POST') {
    try {
      return json(200, { tanisma: await tanisma.tanismaOku(oturum.eposta) })
    } catch (e) {
      console.error('tanisma okunamadi', e && e.message)
      return json(503, { hata: 'Form şu an okunamıyor.' })
    }
  }

  const { kayit, hatalar } = tanisma.tanismaTemizle(govdeCoz(event))
  if (Object.keys(hatalar).length) return json(400, { hata: 'Eksik ya da hatalı alan var.', hatalar })

  let yazilan
  try {
    yazilan = await tanisma.tanismaYaz(oturum.eposta, kayit)
  } catch (e) {
    console.error('tanisma yazilamadi', e && e.message)
    return json(503, { hata: 'Kaydedilemedi. Birazdan tekrar deneyin.' })
  }

  // Karar 2026-10-02: form ILK doldurulunca Savas'a tek kisa e-posta.
  // Guncellemeler e-posta uretmez. Tekil anahtar ayni hesap icin ikinci
  // e-postayi da keser. Musteriye e-posta GITMEZ. bildir() firlatmaz; e-posta
  // gitmese de musterinin kaydi basarili sayilir.
  if (yazilan.guncellemeSayisi === 1) {
    const i = yazilan.iletisim || {}
    await bildir({
      tur: 'tanisma',
      baslik: `Tanışma formu dolduruldu: ${hesap.markaAdi || oturum.eposta}`,
      satirlar: [
        ['Marka', hesap.markaAdi || ''],
        ['Hesap', oturum.eposta],
        ['İletişim', [i.adSoyad, i.telefon].filter(Boolean).join(', ')],
        ['Site', yazilan.siteAdresi],
      ],
      not: 'Formun tamamı yönetim ekranında, müşterinin satırında.',
      eposta: oturum.eposta,
      tekil: `tanisma:${String(oturum.eposta).toLowerCase()}`,
    })
  }
  return json(200, { kaydedildi: true, tanisma: yazilan })
}
