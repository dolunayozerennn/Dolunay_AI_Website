// Netlify v2 fonksiyon kabugu. Is mantigi ../lib/uclar/abonelik-baslat.js icinde.
//
// Iki isi var:
//   1. Blobs istemcisini ESM olarak alip hesap katmanina verir. Bu sart:
//      esbuild, CommonJS require('@netlify/blobs') cagrisini ESM ciktida
//      calisma anina birakiyor ve paket bulunamiyor (onizlemede olculdu).
//   2. Request'i v1 olayina, v1 cevabini Response'a cevirir.
//
// Kabuk v2 oldugu icin Netlify bu lambda'ya NETLIFY_BLOBS_CONTEXT enjekte
// ediyor; v1 fonksiyonlarda o degisken hic gelmiyordu. Ayrinti:
// ../lib/v2-kopru.js
import { getStore } from '@netlify/blobs'
import hesap from '../lib/hesap.js'
import kopru from '../lib/v2-kopru.js'
import uc from '../lib/uclar/abonelik-baslat.js'

hesap.getStoreAyarla(getStore)

export default kopru.sar(uc.handler)