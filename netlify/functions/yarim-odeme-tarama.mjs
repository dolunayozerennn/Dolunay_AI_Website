// Netlify zamanlanmis fonksiyon kabugu. Is mantigi ../lib/uclar/yarim-odeme.js
// icinde.
//
// Zamanlanmis fonksiyonlar YALNIZ yayindaki (production) kurulumda calisir;
// onizlemede tetiklenmez. Onizlemede ayni tarama yonetim ekraninin "Yarım
// kalan ödemeler" bolumunden gorunur, o bolum bekleyen kayitlari dogrudan okur.
import { getStore } from '@netlify/blobs'
import hesap from '../lib/hesap.js'
import uc from '../lib/uclar/yarim-odeme.js'

hesap.getStoreAyarla(getStore)

export default async () => {
  try {
    const ozet = await uc.tara()
    console.log('yarim odeme taramasi', JSON.stringify(ozet))
  } catch (e) {
    console.error('yarim odeme taramasi basarisiz', e && e.message)
  }
  return new Response('ok')
}

export const config = { schedule: '*/30 * * * *' }
