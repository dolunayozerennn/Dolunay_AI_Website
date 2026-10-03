// Netlify v2 fonksiyon kabugu. Is mantigi ../lib/uclar/abonelik-iptal.js icinde.
import { getStore } from '@netlify/blobs'
import hesap from '../lib/hesap.js'
import kopru from '../lib/v2-kopru.js'
import uc from '../lib/uclar/abonelik-iptal.js'

hesap.getStoreAyarla(getStore)

export default kopru.sar(uc.handler)
