// GECICI. BIRLESTIRMEDEN ONCE SILINECEK.
//
// Onizlemede uctan uca deneme icin tek kullanimlik bir hesap acar ve siler.
// Gercek odeme yapmadan "hesap aciliyor mu, giris yapilabiliyor mu" sorusunu
// cevaplamanin baska yolu yok: hesaplar normalde odeme onaylandiktan sonra
// aciliyor.
//
// Guvenlik notu: depo site genelinde ortak, yani buraya yazilan kayit
// uretimdeki depoda da gorunur. Bu yuzden adres `.invalid` uzantili (hicbir
// zaman gercek bir adres olamaz) ve is biter bitmez silinir.
import { getStore } from '@netlify/blobs'
import hesapLib from '../lib/hesap.js'
import crypto from 'node:crypto'

hesapLib.getStoreAyarla(getStore)

const ANAHTAR = 'deneme-2026-09-11'
const EPOSTA = 'uctan-uca-deneme@dolunay.invalid'

export default async (req) => {
  const u = new URL(req.url)
  if (u.searchParams.get('anahtar') !== ANAHTAR) return new Response('yok', { status: 404 })

  const islem = u.searchParams.get('islem')
  const json = (kod, govde) => new Response(JSON.stringify(govde, null, 1), {
    status: kod,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  })

  try {
    if (islem === 'ac') {
      const sifre = 'D' + crypto.randomBytes(12).toString('base64url')
      const sonuc = await hesapLib.hesapAc(EPOSTA, {
        eposta: EPOSTA,
        sifreOzeti: await hesapLib.sifreOzetle(sifre),
        markaAdi: 'Uctan Uca Deneme',
        webSitesi: 'https://deneme.invalid/',
        plan: 'deneme-plan',
        slug: 'deneme',
      })
      return json(200, { islem: 'ac', yeni: sonuc.yeni, eposta: EPOSTA, sifre })
    }

    if (islem === 'sil') {
      const { getStore } = await import('@netlify/blobs')
      const d = getStore({ name: 'hesaplar', consistency: 'strong' })
      const anahtar = `hesap/${encodeURIComponent(EPOSTA)}`
      await d.delete(anahtar)
      await d.delete(`deneme/${encodeURIComponent(EPOSTA)}`)
      const kalan = await d.get(anahtar, { type: 'json' })
      return json(200, { islem: 'sil', kaldiMi: kalan ? 'EVET' : 'hayir' })
    }

    if (islem === 'oturumlar') {
      const { getStore } = await import('@netlify/blobs')
      const d = getStore({ name: 'hesaplar', consistency: 'strong' })
      const l = await d.list({ prefix: 'oturum/' })
      return json(200, { islem: 'oturumlar', sayi: (l.blobs || []).length })
    }

    return json(400, { hata: 'islem: ac | sil | oturumlar' })
  } catch (e) {
    return json(500, { hata: String((e && e.message) || e), ad: e && e.name })
  }
}
