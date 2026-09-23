// Yonetim uclarinin ortak yetki kapisi: YONETIM_SIRRI.
//
// Iki uc kullaniyor: hesap-ac (elle hesap acma) ve yonetim-veri (Savas'in
// musteri listesi). Kapi tek yerde durur ki biri gevseyip digeri siki
// kalmasin.
//
// MOTOR_SIRRI bu kapiyi ACMAZ. O sir motorun calistigi makinede duruyor ve
// yalnizca icerik yazmaya yetiyor; sizmasi halinde musteri listesini de
// okuyabilmesi cok daha agir bir sonuc olurdu.
const crypto = require('crypto')

function sirDogru (gelen) {
  const beklenen = process.env.YONETIM_SIRRI || ''
  // Sir tanimli degilse uc KAPALI. Bos sir "herkese acik" anlamina gelmemeli.
  if (!beklenen || !gelen) return false
  // Ozetler karsilastirilir: uzunluklar farkli olsa bile sure sabit kalir.
  const oa = crypto.createHash('sha256').update(Buffer.from(String(gelen))).digest()
  const ob = crypto.createHash('sha256').update(Buffer.from(beklenen)).digest()
  return crypto.timingSafeEqual(oa, ob)
}

// Baslik adi buyuk-kucuk harf farketmeksizin bulunur; kopru basliklari
// kucuk harfe indiriyor ama yerel denemede boyle olmayabilir.
function sirBasligi (event) {
  const b = (event && event.headers) || {}
  const ad = Object.keys(b).find((a) => a.toLowerCase() === 'x-yonetim-sirri')
  return ad ? b[ad] : ''
}

module.exports = { sirDogru, sirBasligi }
