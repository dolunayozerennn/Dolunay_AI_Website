// Netlify v2 fonksiyon kabugu. Is mantigi ../lib/uclar/panel-karar.js icinde.
import { getStore } from '@netlify/blobs'
import hesap from '../lib/hesap.js'
import kopru from '../lib/v2-kopru.js'
import uc from '../lib/uclar/panel-karar.js'

hesap.getStoreAyarla(getStore)

export default kopru.sar(uc.handler)