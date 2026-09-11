// Netlify v2 fonksiyon kabugu. Is mantigi ../lib/uclar/panel-veri.js icinde.
// Blobs istemcisi burada ESM olarak alinip hesap katmanina veriliyor;
// gerekcesi ../lib/hesap.js icinde yazili.
import { getStore } from '@netlify/blobs'
import hesap from '../lib/hesap.js'
import kopru from '../lib/v2-kopru.js'
import uc from '../lib/uclar/panel-veri.js'

hesap.getStoreAyarla(getStore)

export default kopru.sar(uc.handler)