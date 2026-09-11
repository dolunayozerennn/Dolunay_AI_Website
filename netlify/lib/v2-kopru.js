// v1 <-> v2 koprusu.
//
// NEDEN VAR: Netlify, Blobs ortamini (NETLIFY_BLOBS_CONTEXT) yalnizca v2
// fonksiyonlarina enjekte ediyor. Klasik `exports.handler` (v1) fonksiyonunda
// o degisken hic gelmiyor ve getStore "MissingBlobsEnvironmentError" atiyor.
// Olculdu (2026-09-11, ayni kurulumda yan yana iki fonksiyon):
//   v1 -> NETLIFY_BLOBS_CONTEXT yok,  getStore HATA
//   v2 -> NETLIFY_BLOBS_CONTEXT var,  getStore CALISTI
//
// TASARIM: is mantigi oldugu gibi `netlify/lib/uclar/*.js` altinda, CommonJS
// ve v1 imzasiyla kaliyor. `netlify/functions/*.mjs` yalnizca birkac satirlik
// kabuk: Request'i v1 olayina, v1 cevabini Response'a cevirir. Boylece
//   - is mantigi tek yerde ve sinav dosyalari onu dogrudan surmeye devam eder
//   - sozlesme testinin surucusu degismez
//   - Netlify tarafinda gorunen fonksiyon v2 olur ve Blobs calisir

// Netlify yeniden yazma kuralinda (ornegin /odeme/* -> fonksiyon) fonksiyona
// ORIJINAL adres geliyor. v1'de bu `event.path` idi; burada `req.url`'den
// kuruluyor. Odeme akisi paket adini bu yoldan okudugu icin kritik: yanlis
// kurulursa butun paketler 404 olur.
function olayaCevir (req, govdeMetni, context) {
  const u = new URL(req.url)
  const basliklar = {}
  for (const [ad, deger] of req.headers) basliklar[ad.toLowerCase()] = deger

  // Tek seferlik odeme ucu istemci IP'sini bu bagliktan okuyor ve yoksa
  // odemeyi durduruyor. v2'de baslik yine geliyor; gelmezse context.ip
  // yedek olarak kullanilir.
  if (!basliklar['x-nf-client-connection-ip'] && context && context.ip) {
    basliklar['x-nf-client-connection-ip'] = context.ip
  }

  return {
    httpMethod: req.method,
    path: u.pathname,
    rawUrl: req.url,
    headers: basliklar,
    queryStringParameters: Object.fromEntries(u.searchParams),
    body: govdeMetni,
    // Govde metin olarak okunuyor, base64 sarmalamasi yok.
    isBase64Encoded: false,
  }
}

// v1 cevabi: { statusCode, headers, body }. Set-Cookie tek baslik olarak
// geliyor; Response icin Headers nesnesine olduğu gibi konur.
function cevabaCevir (cevap) {
  if (!cevap) return new Response('', { status: 500 })
  const basliklar = new Headers()
  for (const [ad, deger] of Object.entries(cevap.headers || {})) {
    if (deger === undefined || deger === null) continue
    basliklar.set(ad, String(deger))
  }
  // multiValueHeaders kullanan bir uc olursa (birden fazla Set-Cookie)
  // burada append edilir.
  for (const [ad, dizi] of Object.entries(cevap.multiValueHeaders || {})) {
    for (const deger of dizi) basliklar.append(ad, String(deger))
  }
  const govde = cevap.body === undefined || cevap.body === null ? '' : String(cevap.body)
  return new Response(govde, { status: cevap.statusCode || 200, headers: basliklar })
}

// Bir v1 handler'ini v2 fonksiyonuna sarar.
//
// Handler firlatirsa 500 doner ve hata kaydedilir. v1'de bu Netlify'in kendi
// isiydi; kabuk arada oldugu icin burada acikca yapiliyor, yoksa firlayan
// hata sessizce bos cevap olurdu.
function sar (handler) {
  return async function (req, context) {
    let govdeMetni = ''
    try {
      if (req.method !== 'GET' && req.method !== 'HEAD') govdeMetni = await req.text()
    } catch (e) {
      console.error('istek govdesi okunamadi', e && e.message)
    }
    try {
      const cevap = await handler(olayaCevir(req, govdeMetni, context), context || {})
      return cevabaCevir(cevap)
    } catch (e) {
      console.error('fonksiyon hata firlatti', e && e.message)
      return new Response('', { status: 500 })
    }
  }
}

module.exports = { sar, olayaCevir, cevabaCevir }
