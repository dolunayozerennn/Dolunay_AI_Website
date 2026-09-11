// Oturum sorgusu. GET /.netlify/functions/oturum
//
// Panel sayfalari statik dosya; sunucu tarafinda kapatilamiyorlar. Koruma
// su kurala dayaniyor: SAYFADA MUSTERI VERISI YOK, veri yalnizca kimlik
// dogrulayan uclardan gelir. Bu uc, panelin acilista "girisli miyim"
// sorusunu sordugu yer.
const { oturumOku, hesapOku } = require('../lib/hesap')
const { cerezOku, cerezSil, json } = require('../lib/oturum')

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') {
    return json(405, { hata: 'Yöntem desteklenmiyor.' })
  }

  const id = cerezOku(event)
  if (!id) return json(401, { girisli: false })

  let oturum
  try {
    oturum = await oturumOku(id)
  } catch (e) {
    // Depo okunamiyor: oturumun gecerli OLDUGUNU soyleyemeyiz. Burada
    // "girisli" demek, dogrulanmamis birine panel acmak olurdu.
    console.error('oturum okunamadi', e && e.message)
    return json(503, { hata: 'Oturum doğrulanamadı.' })
  }

  // Suresi dolmus ya da silinmis oturum: cerezi de dusur ki tarayici
  // her istekte olu bir kimlik gondermeye devam etmesin.
  if (!oturum) return json(401, { girisli: false }, cerezSil())

  let hesap = null
  try {
    hesap = await hesapOku(oturum.eposta)
  } catch (e) {
    console.error('hesap okunamadi', e && e.message)
  }

  // Sifre ozeti ve fatura bilgisi BU CEVAPTA GECMEZ. Panelin basligi icin
  // gereken en az bilgi doner.
  return json(200, {
    girisli: true,
    eposta: oturum.eposta,
    markaAdi: (hesap && hesap.markaAdi) || '',
    webSitesi: (hesap && hesap.webSitesi) || '',
  })
}
