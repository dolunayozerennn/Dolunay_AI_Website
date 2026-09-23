// Test e-postasi. POST /.netlify/functions/yonetim-test
//
// NEDEN VAR: Resend anahtari Netlify'da "secret" olarak duruyor; degeri
// okunamiyor, disaridan denenemiyor. Anahtarin dogru girildigini ve alan
// adinin gonderime acik oldugunu gostermenin tek yolu, bildirimin kendi
// yolundan (bildir -> resendGonder) bir e-posta gondermek. Gercek bir odeme
// olayi uydurmadan.
//
// Yetki yonetim ekraniyla ayni: YONETIM_SIRRI. Tekillik yok, her basis bir
// e-posta; olay kaydina "test" turuyla dusuyor, gercek olaylarla karismiyor.
const { json } = require('../oturum')
const { sirDogru, sirBasligi } = require('../yonetim')
const { bildir } = require('../bildirim')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { hata: 'Yöntem desteklenmiyor.' })
  if (!sirDogru(sirBasligi(event))) return json(401, { hata: 'Yetkisiz.' })

  const zaman = new Date()
  const s = await bildir({
    tur: 'test',
    baslik: 'Test: dolunay.ai bildirimleri çalışıyor',
    satirlar: [
      ['Gönderildiği an', zaman.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })],
      ['Ortam', process.env.CONTEXT || 'bilinmiyor'],
      ['Adres', process.env.URL || ''],
    ],
    not: 'Bu e-posta yönetim ekranındaki "Test e-postası gönder" düğmesiyle istendi. Yeni müşteri ve ödeme bildirimleri aynı yoldan gelir.',
  })
  return json(s.gonderim === 'gonderildi' ? 200 : 502, {
    gonderim: s.gonderim,
    kod: s.kod || null,
    ayrinti: s.ayrinti || null,
    id: s.id || null,
    olay: s.olay,
  })
}
