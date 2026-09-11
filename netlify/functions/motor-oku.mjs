// Netlify v2 fonksiyon kabugu. Is mantigi ../lib/uclar/motor-oku.js icinde.
// Blobs istemcisi burada ESM olarak alinip hesap katmanina veriliyor;
// gerekcesi ../lib/hesap.js ve ../lib/v2-kopru.js icinde yazili.
import { getStore } from '@netlify/blobs'
import hesap from '../lib/hesap.js'
import kopru from '../lib/v2-kopru.js'
import uc from '../lib/uclar/motor-oku.js'

hesap.getStoreAyarla(getStore)

export default kopru.sar(uc.handler)