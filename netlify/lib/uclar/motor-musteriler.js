// Motorun musteri listesini okudugu uc. GET /.netlify/functions/motor-musteriler
//
// Karar 2026-10-02 (Savas): motor musteri listesini gorebilir. Bu, 23.09'daki
// "MOTOR_SIRRI musteri listesini acmaz" kararini bilerek degistirir. Gerekce:
// odeme yapip tanisma formunu dolduran yeni musteriyi motor slug'ini
// bilmeden goremiyordu; slug'i yalniz yonetimden ogrenmek elle bir adim daha
// demekti.
//
// Sizma halinde aciga cikani dar tutmak icin liste YALNIZ motorun isine
// yarayani tasir: kim, hangi slug, tanisma formu, notlarin ne zaman
// degistigi. Odeme, iyzico, fatura, TCKN, adres, sifre ozeti, oturum YOK.
// Not metinleri burada yok; slug'la motor-oku'dan okunur.
// Sozlesme: Blog-Motoru/_kopru/panel-sozlesme.md, bolum 3a.
const crypto = require('crypto')
const tanisma = require('../tanisma')
const { depoAc } = require('../hesap')
const { json } = require('../oturum')

function sirDogru (gelen) {
  const beklenen = process.env.MOTOR_SIRRI || ''
  if (!beklenen || !gelen) return false
  const oa = crypto.createHash('sha256').update(Buffer.from(String(gelen))).digest()
  const ob = crypto.createHash('sha256').update(Buffer.from(beklenen)).digest()
  return crypto.timingSafeEqual(oa, ob)
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return json(405, { hata: 'Yöntem desteklenmiyor.' })
  if (!sirDogru((event.headers || {})['x-motor-sirri'])) return json(401, { hata: 'Yetkisiz.' })

  try {
    const d = depoAc()
    const satirlar = await tanisma.musteriSatirlari(d)
    const musteriler = await Promise.all(satirlar.map(async (s) => {
      const y = s.yonetim
      return {
        tur: s.tur,
        slug: s.slug || '',
        motorSlug: s.motorSlug || '',
        markaAdi: s.markaAdi || '',
        eposta: s.eposta || '',
        telefon: s.telefon || '',
        kayitTarihi: s.kayitTarihi || null,
        tanisma: s.eposta ? (await tanisma.tanismaOku(s.eposta)) || null : null,
        yonetim: y
          ? {
              slug: y.slug,
              guncellendi: y.guncellendi || null,
              notSayisi: Array.isArray(y.notlar) ? y.notlar.length : 0,
              sonNotId: Array.isArray(y.notlar) && y.notlar[0] ? y.notlar[0].id : null,
              silinenNotSayisi: Array.isArray(y.silinenNotlar) ? y.silinenNotlar.length : 0,
            }
          : null,
      }
    }))
    return json(200, { zaman: new Date().toISOString(), musteriler })
  } catch (e) {
    console.error('motor musteri listesi okunamadi', e && e.message)
    return json(503, { hata: 'Şu an okunamıyor.' })
  }
}
