// Oturum sorgusu. GET /.netlify/functions/oturum
//
// Panel sayfalari statik dosya; sunucu tarafinda kapatilamiyorlar. Koruma
// su kurala dayaniyor: SAYFADA MUSTERI VERISI YOK, veri yalnizca kimlik
// dogrulayan uclardan gelir. Bu uc, panelin acilista "girisli miyim"
// sorusunu sordugu yer.
const { oturumOku, hesapOku } = require('../hesap')
const { cerezOku, cerezSil, json } = require('../oturum')

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
    // Depo okunamiyor: hesabin DURDUGUNU da YOK oldugunu da soyleyemeyiz.
    console.error('hesap okunamadi', e && e.message)
    return json(503, { hata: 'Oturum doğrulanamadı.' })
  }

  // Hesap silinmisse oturum da gecersizdir. Aksi halde silinen bir hesabin
  // oturumu suresi dolana kadar panele girmeye devam ederdi. Olculdu: test
  // hesabi silindikten sonra oturum ucu hala "girisli" diyordu.
  if (!hesap) return json(401, { girisli: false }, cerezSil())

  // Sifre ozeti ve fatura bilgisi BU CEVAPTA GECMEZ. Panelin basligi icin
  // gereken en az bilgi doner.
  return json(200, {
    girisli: true,
    eposta: oturum.eposta,
    markaAdi: hesap.markaAdi || '',
    webSitesi: hesap.webSitesi || '',
  })
}
