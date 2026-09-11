// Panelden sifre degistirme. POST /.netlify/functions/sifre-degistir
//
// MEVCUT SIFRE SORULUYOR. Oturum tek basina yetmez: cerezi ele gecirmis biri
// sifreyi degistirip hesabi kalici olarak devralabilirdi. Mevcut sifre
// istemek bunu kapatir, sahibi ise zaten biliyor.
//
// Degisiklikten sonra DIGER OTURUMLAR DUSURULUR. Opak kimlik + depoda kayit
// tasarimini secmemizin ikinci sebebi buydu: imzali jeton olsaydi eski
// oturumlar suresi dolana kadar gecerli kalirdi.
const {
  hesapOku, hesapGuncelle, sifreOzetle, sifreDogrula,
  oturumOku, oturumKapat, oturumlariListele,
} = require('../hesap')
const { cerezOku, cerezSil, json, govdeCoz } = require('../oturum')

const EN_AZ = 8
const EN_COK = 200

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { hata: 'Yöntem desteklenmiyor.' })

  const oturumId = cerezOku(event)
  if (!oturumId) return json(401, { girisli: false })

  const g = govdeCoz(event)
  const mevcut = String(g.mevcut || '')
  const yeni = String(g.yeni || '')

  if (!mevcut || !yeni) return json(400, { hata: 'Mevcut ve yeni şifre gerekli.' })
  if (yeni.length < EN_AZ) return json(400, { hata: `Şifre en az ${EN_AZ} karakter olmalı.` })
  if (yeni.length > EN_COK) return json(400, { hata: `Şifre en fazla ${EN_COK} karakter olabilir.` })

  let oturum, hesap
  try {
    oturum = await oturumOku(oturumId)
    if (!oturum) return json(401, { girisli: false }, cerezSil())
    hesap = await hesapOku(oturum.eposta)
  } catch (e) {
    console.error('oturum ya da hesap okunamadi', e && e.message)
    return json(503, { hata: 'Şu an değiştirilemiyor.' })
  }
  if (!hesap) return json(401, { girisli: false }, cerezSil())

  let dogru = false
  try {
    dogru = await sifreDogrula(mevcut, hesap.sifreOzeti || '')
  } catch (e) {
    console.error('sifre dogrulanamadi', e && e.message)
  }
  if (!dogru) return json(401, { hata: 'Mevcut şifreniz hatalı.' })

  try {
    await hesapGuncelle(oturum.eposta, { sifreOzeti: await sifreOzetle(yeni) })
  } catch (e) {
    console.error('sifre yazilamadi', e && e.message)
    return json(503, { hata: 'Şu an değiştirilemiyor.' })
  }

  // Bu oturum acik kalir, digerleri duser. Kullanicinin kendi sekmesinden
  // atilmasi gereksiz; asil amac baskasinin elindeki oturumu kapatmak.
  let dusen = 0
  try {
    for (const kimlik of await oturumlariListele(oturum.eposta)) {
      if (kimlik === oturumId) continue
      await oturumKapat(kimlik)
      dusen += 1
    }
  } catch (e) {
    // Sifre degisti ama eski oturumlar kapatilamadi: bu bir uyaridir,
    // basarisizlik degil. Kullaniciya soyleniyor.
    console.error('diger oturumlar kapatilamadi', e && e.message)
    return json(200, { degisti: true, digerOturumlar: 'kapatilamadi' })
  }

  return json(200, { degisti: true, dusenOturum: dusen })
}
