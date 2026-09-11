// Netlify v2 fonksiyon kabugu. Is mantigi ../lib/uclar/odeme-baslat.js icinde.
//
// Kabuk v2 oldugu icin Netlify bu lambda'ya NETLIFY_BLOBS_CONTEXT enjekte
// ediyor ve Blobs calisiyor; v1 (exports.handler) fonksiyonlarda o degisken
// hic gelmiyordu. Ayrinti: ../lib/v2-kopru.js
import kopru from '../lib/v2-kopru.js'
import uc from '../lib/uclar/odeme-baslat.js'

export default kopru.sar(uc.handler)