// Panel girisi. POST /.netlify/functions/giris  { eposta, sifre }
//
// Hesap odeme sonrasi acildi (Asama 2); burada yalnizca dogrulama var,
// kayit YOK. Basarili olursa opak bir oturum kimligi uretilir ve HttpOnly
// cerezle doner.
const { hesapOku, sifreDogrula, oturumAc, denemeOku, denemeArtir, denemeSifirla, DENEME_TAVANI } = require('../lib/hesap')
const { cerezYaz, json, govdeCoz } = require('../lib/oturum')

// Hesap var mi yok mu, sifre mi yanlis: DISARIDAN AYIRT EDILEMEZ. Tek
// mesaj, tek kod. Ayri mesaj vermek, hangi e-postalarin musteri oldugunu
// sizdirirdi.
const HATA = 'E-posta ya da şifre hatalı.'

// Hesap yoksa da scrypt maliyeti odenir. Aksi halde cevap suresi
// "bu e-posta kayitli mi" sorusunu cevaplardi. Parametreler ve ozet uzunlugu
// gercek kayitlarla AYNI olmali, yoksa maliyet farki yine ipucu verir.
const SAHTE_OZET = [
  'scrypt', 16384, 8, 1,
  Buffer.alloc(16).toString('base64'),
  Buffer.alloc(64).toString('base64'),
].join('$')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { hata: 'Yöntem desteklenmiyor.' })
  }

  const v = govdeCoz(event)
  const eposta = String(v.eposta || '').trim()
  const sifre = String(v.sifre || '')

  if (!eposta || !sifre) {
    return json(400, { hata: 'E-posta ve şifre gerekli.' })
  }

  // Kapi once: kilitliyken scrypt bile calistirilmaz.
  let deneme
  try {
    deneme = await denemeOku(eposta)
  } catch (e) {
    // Depo okunamiyorsa girisi acmiyoruz. Sayac calismazken kaba kuvvet
    // kapisi da calismaz; bu durumda durmak dogrusu.
    console.error('deneme sayaci okunamadi', e && e.message)
    return json(503, { hata: 'Giriş şu an yapılamıyor. Birazdan tekrar deneyin.' })
  }
  if (deneme.kilitli) {
    const dakika = Math.max(1, Math.ceil(deneme.kalanMs / 60000))
    return json(429, { hata: `Çok fazla hatalı deneme. ${dakika} dakika sonra tekrar deneyin.` })
  }

  let hesap = null
  try {
    hesap = await hesapOku(eposta)
  } catch (e) {
    console.error('hesap okunamadi', e && e.message)
    return json(503, { hata: 'Giriş şu an yapılamıyor. Birazdan tekrar deneyin.' })
  }

  const ozet = hesap && typeof hesap.sifreOzeti === 'string' ? hesap.sifreOzeti : SAHTE_OZET
  let dogru = false
  try {
    dogru = await sifreDogrula(sifre, ozet)
  } catch (e) {
    console.error('sifre dogrulanamadi', e && e.message)
    dogru = false
  }
  // Hesap yoksa dogrulama sahte ozete karsi kosuldu; sonucu ne olursa olsun
  // basarisiz sayilir.
  if (!hesap || !dogru) {
    try {
      const sayi = await denemeArtir(eposta)
      if (sayi >= DENEME_TAVANI) console.error('giris denemesi tavana ulasti')
    } catch (e) {
      console.error('deneme sayaci yazilamadi', e && e.message)
    }
    return json(401, { hata: HATA })
  }

  let acilan
  try {
    acilan = await oturumAc(eposta)
    await denemeSifirla(eposta)
  } catch (e) {
    console.error('oturum acilamadi', e && e.message)
    return json(503, { hata: 'Giriş şu an yapılamıyor. Birazdan tekrar deneyin.' })
  }

  // Cevapta oturum kimligi GECMEZ; yalnizca cerezde. Panelin gosterecegi
  // isim doner ki giris ekrani bir sey beklemeden panele gecebilsin.
  return json(200, {
    girisli: true,
    markaAdi: hesap.markaAdi || '',
  }, cerezYaz(acilan.id, acilan.omurMs))
}
