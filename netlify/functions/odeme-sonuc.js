const crypto = require('crypto')
const { tekSeferSonuc } = require('../lib/iyzico')
const { kacir, sayfa, html } = require('../lib/sayfa')

function ciz (kod, baslik, sinif, mesaj) {
  return html(kod, sayfa({ baslik, govde: `<span class="rozet">Tek seferlik odeme</span><h1>${kacir(baslik)}</h1><div class="${sinif}">${kacir(mesaj)}</div><p class="dip">Sorulariniz icin <a href="mailto:dolunay@dolunay.ai">dolunay@dolunay.ai</a></p>` }))
}

function kurus (v) {
  if (!['string', 'number'].includes(typeof v)) return null
  const m = String(v).match(/^(\d+)(?:\.(\d{1,2})0*)?$/)
  return m ? BigInt(m[1]) * 100n + BigInt((m[2] || '').padEnd(2, '0')) : null
}

function tokenBul (event) {
  const q = event.queryStringParameters || {}
  let b = {}
  if (event.body) {
    if (typeof event.body !== 'string' || event.body.length > 16384) throw new Error('govde')
    const ham = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body
    const tip = Object.entries(event.headers || {}).find(([k]) => k.toLowerCase() === 'content-type')?.[1] || ''
    b = tip.toLowerCase().includes('application/json') ? JSON.parse(ham) : Object.fromEntries(new URLSearchParams(ham))
    if (!b || typeof b !== 'object' || Array.isArray(b)) throw new Error('govde')
  }
  const token = b.token ?? q.token
  if (typeof token !== 'string' || !/^[A-Za-z0-9._-]{1,256}$/.test(token) || (q.token !== undefined && q.token !== token)) throw new Error('token')
  return token
}

exports.handler = async (event) => {
  const belirsiz = () => ciz(502, 'Sonuc teyit edilemedi', 'uyari', 'Tahsilat yapilmis olabilir. Ayni odemeyi tekrar denemeyin; dolunay@dolunay.ai adresine yazin.')
  if (!['GET', 'POST'].includes(event.httpMethod)) return ciz(405, 'Gecersiz istek', 'uyari', 'Istek yontemi desteklenmiyor.')

  let token, kimlik, tutar
  try {
    token = tokenBul(event)
    const { bilgi, imza } = event.queryStringParameters || {}
    if (typeof bilgi !== 'string' || !/^[A-Za-z0-9_-]{1,256}$/.test(bilgi) || typeof imza !== 'string' || !/^[a-f0-9]{64}$/.test(imza)) throw new Error('baglam')
    if (!process.env.IYZICO_SECRET_KEY) return belirsiz()
    const beklenen = crypto.createHmac('sha256', process.env.IYZICO_SECRET_KEY).update('tek-sefer:' + bilgi).digest()
    if (!crypto.timingSafeEqual(beklenen, Buffer.from(imza, 'hex'))) throw new Error('imza')
    const d = JSON.parse(Buffer.from(bilgi, 'base64url').toString('utf8'))
    if (!Array.isArray(d) || d.length !== 2 || typeof d[0] !== 'string' || typeof d[1] !== 'string' || kurus(d[1]) === null || kurus(d[1]) <= 0n) throw new Error('baglam')
    ;[kimlik, tutar] = d
  } catch {
    return ciz(400, 'Sonuc dogrulanamadi', 'uyari', 'Odeme bilgisi dogrulanamadi. Tahsilat yapilmis olabilir; ayni odemeyi tekrar denemeden dolunay@dolunay.ai adresine yazin.')
  }

  let cevap
  try { cevap = await tekSeferSonuc(token) } catch { return belirsiz() }
  if (!cevap || cevap.hataTipi || cevap.status !== 'success' || cevap.token !== token || cevap.basketId !== kimlik) return belirsiz()
  if (cevap.paymentStatus === 'FAILURE') return ciz(200, 'Odeme tamamlanmadi', 'uyari', 'Odeme tamamlanmadi. Durumu kontrol etmek icin dolunay@dolunay.ai adresine yazin.')
  if (cevap.paymentStatus !== 'SUCCESS' || ![1, '1'].includes(cevap.fraudStatus) || !['string', 'number'].includes(typeof cevap.paymentId) || !/^[1-9]\d*$/.test(String(cevap.paymentId)) || cevap.currency !== 'TRY' || kurus(cevap.price) !== kurus(tutar) || kurus(cevap.paidPrice) !== kurus(tutar)) return belirsiz()
  return ciz(200, 'Odemeniz alindi', 'iyi', `Tek seferlik odemeniz dogrulandi. Islem numaraniz: ${cevap.paymentId}.`)
}
