// GECICI DENEME. Yalnizca deneme dalinda, birlestirilmeyecek.
// v1 (klasik exports.handler) fonksiyonunda Blobs calisiyor mu?
const ANAHTAR = 'tani-2026-09-11'

exports.handler = async (event) => {
  if ((event.queryStringParameters || {}).anahtar !== ANAHTAR) {
    return { statusCode: 404, body: 'yok' }
  }
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    body: JSON.stringify(await olc('v1'), null, 1),
  }
}

// Ortak olcum. Ortam degiskenlerinin yalniz ADLARI doner, degerleri DEGIL.
async function olc (sürüm) {
  const adlar = Object.keys(process.env)
    .filter((a) => /BLOB|NETLIFY|SITE|DEPLOY|CONTEXT|LAMBDA|AWS_REGION/i.test(a))
    .sort()

  let blobs
  try {
    blobs = require('@netlify/blobs')
  } catch (e) {
    return { sürüm, paket: 'YUKLENEMEDI', mesaj: String(e && e.message), ortamAdlari: adlar }
  }

  let deneme
  try {
    const depo = blobs.getStore({ name: 'hesaplar', consistency: 'strong' })
    const v = await depo.get('tani/olmayan', { type: 'json' })
    deneme = { sonuc: 'CALISTI', okunan: v === null ? 'null (beklenen)' : typeof v }
  } catch (e) {
    deneme = { sonuc: 'HATA', hataAdi: e && e.name, mesaj: String((e && e.message) || '').slice(0, 200) }
  }

  return {
    sürüm,
    paketSurumu: (() => { try { return require('@netlify/blobs/package.json').version } catch { return '?' } })(),
    nodeSurumu: process.version,
    ortamAdlari: adlar,
    deneme,
  }
}

module.exports.olc = olc
