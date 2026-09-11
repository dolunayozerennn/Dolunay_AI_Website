// GECICI DENEME. Yalnizca deneme dalinda, birlestirilmeyecek.
// v2 API (export default, Request/Response). Ayni olcumu yapar; amac v1 ile
// v2 arasinda Blobs davranisi farkli mi onu gormek.
import { getStore } from '@netlify/blobs'

const ANAHTAR = 'tani-2026-09-11'

export default async (req) => {
  const u = new URL(req.url)
  if (u.searchParams.get('anahtar') !== ANAHTAR) {
    return new Response('yok', { status: 404 })
  }

  const adlar = Object.keys(process.env)
    .filter((a) => /BLOB|NETLIFY|SITE|DEPLOY|CONTEXT|LAMBDA|AWS_REGION/i.test(a))
    .sort()

  let deneme
  try {
    const depo = getStore({ name: 'hesaplar', consistency: 'strong' })
    const v = await depo.get('tani/olmayan', { type: 'json' })
    deneme = { sonuc: 'CALISTI', okunan: v === null ? 'null (beklenen)' : typeof v }
  } catch (e) {
    deneme = { sonuc: 'HATA', hataAdi: e && e.name, mesaj: String((e && e.message) || '').slice(0, 200) }
  }

  return new Response(JSON.stringify({
    sürüm: 'v2',
    nodeSurumu: process.version,
    ortamAdlari: adlar,
    deneme,
  }, null, 1), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
