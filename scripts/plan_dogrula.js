// Katalogdaki her paketin iyzico'da GERCEKTEN var oldugunu ve tahsil edilecek
// bedelin sayfada yazan bedelle ortustugunu olcer.
//
// SALT OKUMA: yalniz GET /v2/subscription/pricing-plans/<ref>. Tahsilat yapmaz,
// abonelik acmaz, iptal etmez. Para hareketi olan tek yol musterinin kendi
// odeme formudur; bu script oraya hic dokunmaz.
//
// Kosma sekli (anahtarlar koda YAZILMAZ, master.env'den gelir):
//   set -a && . _knowledge/credentials/master.env && set +a
//   export IYZICO_PAKETLER="$(netlify env:get IYZICO_PAKETLER)"   # ya da Netlify API
//   node scripts/plan_dogrula.js
const crypto = require('crypto')
const BASE = (process.env.IYZICO_BASE_URL || 'https://api.iyzipay.com').replace(/\/+$/, '')

async function get(uriPath) {
  const apiKey = process.env.IYZICO_API_KEY, secretKey = process.env.IYZICO_SECRET_KEY
  if (!apiKey || !secretKey) throw new Error('IYZICO_API_KEY / IYZICO_SECRET_KEY tanimli degil')
  const rnd = String(Date.now()) + crypto.randomBytes(6).toString('hex')
  const imza = crypto.createHmac('sha256', secretKey).update(rnd + uriPath).digest('hex')
  const auth = 'IYZWSv2 ' + Buffer.from(`apiKey:${apiKey}&randomKey:${rnd}&signature:${imza}`).toString('base64')
  const r = await fetch(BASE + uriPath, { headers: { Authorization: auth, 'x-iyzi-rnd': rnd, Accept: 'application/json' } })
  const t = await r.text()
  // Okunamayan cevap "plan yok" demek DEGILDIR; oyle saymak bu repoda tekrar
  // eden hata sinifidir. Belirsizlik belirsiz olarak raporlanir.
  try { return JSON.parse(t) } catch { return { status: 'okunamadi', httpDurum: r.status } }
}

// Sayfada "2.980 TL + KDV" yazarken iyzico 3576 tahsil eder. Ikisi ayni sey
// olmadigi icin kiyas KDV'li tutar uzerinden yapilir.
const KDV = 1.20
function sayfaKurusu(metin) {
  const m = String(metin || '').replace(/\./g, '').match(/\d+/)
  if (!m) return null
  return Math.round(Number(m[0]) * (/KDV/i.test(String(metin)) ? KDV : 1))
}

;(async () => {
  let paketler
  try { paketler = JSON.parse(process.env.IYZICO_PAKETLER || '{}') }
  catch { console.error('IYZICO_PAKETLER cozulemedi'); process.exit(1) }
  const slugler = Object.keys(paketler)
  if (!slugler.length) { console.error('katalog bos: IYZICO_PAKETLER verilmedi'); process.exit(1) }

  let bulgu = 0
  for (const slug of slugler) {
    const p = paketler[slug] || {}
    if (!p.plan) { console.log(`${slug.padEnd(18)} BULGU: plan kodu bos`); bulgu++; continue }
    const c = await get(`/v2/subscription/pricing-plans/${encodeURIComponent(p.plan)}`)
    const d = (c && c.data) || {}
    if (c.status !== 'success') {
      console.log(`${slug.padEnd(18)} BULGU: iyzico plani dogrulamadi (${c.status}${c.httpDurum ? ' http ' + c.httpDurum : ''})`)
      bulgu++; continue
    }
    const beklenen = sayfaKurusu(p.tutar)
    const uyum = beklenen === null ? '?' : (Math.round(Number(d.price)) === beklenen ? 'TUTUYOR' : 'TUTMUYOR')
    if (uyum === 'TUTMUYOR') bulgu++
    console.log(`${slug.padEnd(18)} sayfa=${String(p.tutar || '-').padEnd(16)} iyzico=${d.price} ${d.currencyCode} ${d.paymentInterval}x${d.paymentIntervalCount} | ${uyum} | ${d.name}`)
  }
  console.log(`\npaket: ${slugler.length} | bulgu: ${bulgu}`)
  process.exit(bulgu ? 1 : 0)
})()
