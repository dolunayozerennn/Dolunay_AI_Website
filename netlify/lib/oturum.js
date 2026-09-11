// Panel oturumunun cerez ve cevap katmani. Uc fonksiyon (giris, oturum,
// cikis) burayi kullanir; cerez bicimi tek yerde dursun diye ayrildi.
//
// Panel /panel/ altinda, fonksiyonlar /.netlify/functions/ altinda: AYNI
// KOKEN. Bu yuzden cerez dogrudan calisiyor, CORS kurmaya gerek yok.
// Alt alan adina tasinirsa burasi da degisir.

const CEREZ = 'dolunay_oturum'

// Cerez bilerek okunamaz ve betikten erisilemez:
//   HttpOnly  panel JS'i oturum kimligini goremez, XSS ile calinamaz
//   Secure    yalnizca https
//   SameSite=Lax  baska sitedeki formdan gonderilmez; panel kendi
//                 kokeninden cagirdigi icin Lax yeterli, Strict gereksiz
//                 sertlik olurdu (odeme donusunden panele gelis kirilirdi)
//   Path=/    fonksiyonlar /.netlify/ altinda, panel /panel/ altinda
function cerezYaz (id, omurMs) {
  const saniye = Math.floor(omurMs / 1000)
  return `${CEREZ}=${id}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${saniye}`
}

function cerezSil () {
  return `${CEREZ}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
}

// Basliklar buyuk/kucuk harf duyarsiz gelebilir; ikisine de bakilir.
function cerezOku (event) {
  const basliklar = event.headers || {}
  let ham = ''
  for (const ad of Object.keys(basliklar)) {
    if (ad.toLowerCase() === 'cookie') { ham = String(basliklar[ad] || ''); break }
  }
  if (!ham) return ''
  for (const parca of ham.split(';')) {
    const esit = parca.indexOf('=')
    if (esit < 0) continue
    if (parca.slice(0, esit).trim() === CEREZ) return parca.slice(esit + 1).trim()
  }
  return ''
}

// Oturum cevaplari ONBELLEGE ALINMAZ. Araya giren bir onbellek, bir
// kullanicinin oturum durumunu baskasina gosterebilirdi.
function json (kod, govde, cerez) {
  const basliklar = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  }
  if (cerez) basliklar['Set-Cookie'] = cerez
  return { statusCode: kod, headers: basliklar, body: JSON.stringify(govde) }
}

// Govde hem form-encoded hem JSON gelebilir; ikisi de desteklenir.
function govdeCoz (event) {
  let ham = event.body || ''
  if (event.isBase64Encoded) ham = Buffer.from(ham, 'base64').toString('utf-8')
  if (!ham) return {}
  const tip = Object.keys(event.headers || {})
    .filter((a) => a.toLowerCase() === 'content-type')
    .map((a) => String(event.headers[a] || ''))[0] || ''
  if (tip.includes('application/json')) {
    try { return JSON.parse(ham) } catch { return {} }
  }
  const p = new URLSearchParams(ham)
  const o = {}
  for (const [k, v] of p.entries()) o[k] = v
  return o
}

module.exports = { CEREZ, cerezYaz, cerezSil, cerezOku, json, govdeCoz }
