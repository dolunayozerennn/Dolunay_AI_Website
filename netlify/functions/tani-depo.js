// GECICI TANI UCU. Birlestirilmeden ONCE SILINECEK.
//
// Netlify Blobs'un bu ortamda neden calismadigini ogrenmek icin. Uc farkli
// kurulumu tek tek deneyip her birinin hata adini ve metnini dondurur.
// Musteri verisine dokunmaz: yalnizca var olmayan bir anahtari okumaya
// calisir, hicbir sey yazmaz.
//
// Kaza sonucu kesfedilmesin diye bir anahtar sorulur.
const ANAHTAR = 'tani-2026-09-11'

async function dene(ad, kur) {
  try {
    const depo = kur()
    const deger = await depo.get('tani/olmayan-anahtar', { type: 'json' })
    return { ad, sonuc: 'CALISTI', okunan: deger === null ? 'null (beklenen)' : typeof deger }
  } catch (e) {
    return {
      ad,
      sonuc: 'HATA',
      hataAdi: e && e.name,
      mesaj: String((e && e.message) || '').slice(0, 300),
    }
  }
}

exports.handler = async (event) => {
  const q = (event.queryStringParameters || {}).anahtar
  if (q !== ANAHTAR) return { statusCode: 404, body: 'yok' }

  let blobs
  try {
    blobs = require('@netlify/blobs')
  } catch (e) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ paket: 'YUKLENEMEDI', mesaj: String(e && e.message) }),
    }
  }

  const denemeler = []
  denemeler.push(await dene('getStore({name, consistency:strong})',
    () => blobs.getStore({ name: 'hesaplar', consistency: 'strong' })))
  denemeler.push(await dene('getStore({name}) tutarlilik belirtmeden',
    () => blobs.getStore({ name: 'hesaplar' })))
  denemeler.push(await dene('getStore("hesaplar") duz metin',
    () => blobs.getStore('hesaplar')))
  if (typeof blobs.getDeployStore === 'function') {
    denemeler.push(await dene('getDeployStore("hesaplar")',
      () => blobs.getDeployStore('hesaplar')))
  }

  // Blobs'un otomatik yapilandirmasi hangi degiskenlerden geliyor: VARLIK
  // bilgisi doner, DEGER donmez.
  const ortam = {}
  for (const ad of ['NETLIFY_BLOBS_CONTEXT', 'SITE_ID', 'NETLIFY_SITE_ID', 'DEPLOY_ID', 'CONTEXT', 'NETLIFY', 'AWS_LAMBDA_FUNCTION_VERSION']) {
    ortam[ad] = process.env[ad] ? 'var' : 'yok'
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    body: JSON.stringify({
      paketSurumu: (() => { try { return require('@netlify/blobs/package.json').version } catch { return 'okunamadi' } })(),
      nodeSurumu: process.version,
      ortam,
      denemeler,
    }, null, 1),
  }
}
