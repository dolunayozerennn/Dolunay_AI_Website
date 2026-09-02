// iyzico IYZWSv2 imzali istek katmani.
// Anahtarlar KODA YAZILMAZ; Netlify ortam degiskenlerinden okunur.
const crypto = require('crypto')

const BASE = (process.env.IYZICO_BASE_URL || 'https://api.iyzipay.com').replace(/\/+$/, '')

function anahtarlar() {
  const apiKey = process.env.IYZICO_API_KEY || ''
  const secretKey = process.env.IYZICO_SECRET_KEY || ''
  if (!apiKey || !secretKey) throw new Error('IYZICO_API_KEY / IYZICO_SECRET_KEY tanimli degil')
  return { apiKey, secretKey }
}

// Imza, GONDERILEN govdenin birebir ayni metni uzerinden hesaplanir.
// Govde yeniden serilestirilirse imza tutmaz.
function yetki(uriPath, bodyStr) {
  const { apiKey, secretKey } = anahtarlar()
  const rnd = String(Date.now()) + crypto.randomBytes(6).toString('hex')
  const imza = crypto.createHmac('sha256', secretKey).update(rnd + uriPath + bodyStr).digest('hex')
  const params = `apiKey:${apiKey}&randomKey:${rnd}&signature:${imza}`
  return { auth: 'IYZWSv2 ' + Buffer.from(params).toString('base64'), rnd }
}

async function istek(method, uriPath, body) {
  const bodyStr = body === undefined ? '' : JSON.stringify(body)
  const { auth, rnd } = yetki(uriPath, bodyStr)
  const cevap = await fetch(BASE + uriPath, {
    method,
    headers: {
      Authorization: auth,
      'x-iyzi-rnd': rnd,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: bodyStr === '' ? undefined : bodyStr,
  })
  const ham = await cevap.text()
  let veri
  try { veri = JSON.parse(ham) } catch { veri = { status: 'failure', errorMessage: 'Beklenmeyen cevap' } }
  return veri
}

// Abonelik odeme formu baslatir. Donen token 30 dakika gecerlidir; bu yuzden
// sabit bir link uretilemez, her ziyarette yeniden alinir.
function formBaslat(veri) {
  return istek('POST', '/v2/subscription/checkoutform/initialize', veri)
}

// Odeme formu sonucu. GET, govdesiz.
function formSonuc(token) {
  return istek('GET', `/v2/subscription/checkoutform/${encodeURIComponent(token)}`, undefined)
}

// Paket katalogu de ortam degiskeninde durur: depo herkese acik oldugu icin
// musteri adi, bedel ve plan kodu depoya yazilmaz.
function paketler() {
  try { return JSON.parse(process.env.IYZICO_PAKETLER || '{}') } catch { return {} }
}

function paketBul(slug) {
  const p = paketler()
  return p && Object.prototype.hasOwnProperty.call(p, slug) ? p[slug] : null
}

module.exports = { formBaslat, formSonuc, paketBul }
