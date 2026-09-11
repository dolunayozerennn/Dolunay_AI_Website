// Panelin karar yazdigi uc. POST /.netlify/functions/panel-karar
//
// Panelin sahibi olduklari buraya yazilir: onay, ret, duzeltme notu, metin
// degisikligi, tarih degisikligi ve ayarlar (yayin programi, marka, WhatsApp
// izni). Motor bu kayda YAZMAZ, yalnizca okur.
//
// Tek yonlu akis: buraya yazilan sey aninda yayina gitmez. Motor gunde bir
// kez gelip okuyor. Panelin metinleri buna gore yazildi.
const veri = require('../veri')
const { oturumOku, hesapOku } = require('../hesap')
const { cerezOku, cerezSil, json, govdeCoz } = require('../oturum')

const NEDEN_TAVANI = 2000
const NOT_TAVANI = 2000
const BASLIK_TAVANI = 500
const OZET_TAVANI = 2000
const ICERIK_TAVANI = 300 * 1024
const TARIH_KALIBI = /^\d{4}-\d{2}-\d{2}$/

const TURLER = ['onay', 'ret', 'tarih', 'metin', 'not', 'ayarlar', 'konu-ekle', 'konu-cikar']

function kirp (v, tavan) {
  return typeof v === 'string' ? v.slice(0, tavan) : ''
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { hata: 'Yöntem desteklenmiyor.' })

  const oturumId = cerezOku(event)
  if (!oturumId) return json(401, { girisli: false })

  let oturum, hesap
  try {
    oturum = await oturumOku(oturumId)
    if (!oturum) return json(401, { girisli: false }, cerezSil())
    hesap = await hesapOku(oturum.eposta)
  } catch (e) {
    console.error('oturum ya da hesap okunamadi', e && e.message)
    return json(503, { hata: 'Kaydedilemiyor.' })
  }
  if (!hesap) return json(401, { girisli: false }, cerezSil())

  const slug = hesap.motorSlug || ''
  if (!slug) return json(409, { hata: 'Hesabınız henüz bir içerik akışına bağlanmadı.' })

  const g = govdeCoz(event)
  const tur = String(g.tur || '')
  if (!TURLER.includes(tur)) return json(400, { hata: 'Bilinmeyen işlem.' })

  const zaman = new Date().toISOString()

  try {
    // Ayarlar ayri kayitta: yazi kararlariyla karismasin.
    if (tur === 'ayarlar') {
      const mevcut = await veri.ayarlarOku(slug)
      const yeni = Object.assign({}, mevcut)
      if (g.yayinProgrami) yeni.yayinProgrami = g.yayinProgrami
      if (g.marka) yeni.marka = g.marka
      if (g.whatsapp) yeni.whatsapp = g.whatsapp
      if (typeof g.telefon === 'string') yeni.telefon = kirp(g.telefon, 40)
      if (Array.isArray(g.destekTalepleri)) yeni.destekTalepleri = g.destekTalepleri.slice(0, 200)
      yeni.guncellendi = zaman
      await veri.ayarlarYaz(slug, yeni)
      return json(200, { kaydedildi: true, tur, zaman })
    }

    const kararlar = await veri.kararlarOku(slug)
    kararlar.yazilar = kararlar.yazilar || {}
    kararlar.konular = kararlar.konular || {}

    if (tur === 'konu-ekle' || tur === 'konu-cikar') {
      const alan = tur === 'konu-ekle' ? 'eklenen' : 'cikarilan'
      const liste = Array.isArray(kararlar.konular[alan]) ? kararlar.konular[alan] : []
      if (tur === 'konu-ekle') {
        liste.unshift({
          id: 'panel-' + zaman, konu: kirp(g.konu, BASLIK_TAVANI),
          kategori: 'Sizin öneriniz', hacim: 0, rekabet: '', skor: 0, zaman,
        })
      } else {
        liste.push(kirp(g.konuId, 200))
      }
      kararlar.konular[alan] = liste.slice(0, 500)
      await veri.kararlarYaz(slug, kararlar)
      return json(200, { kaydedildi: true, tur, zaman })
    }

    const yaziId = kirp(g.yaziId, 200)
    if (!yaziId) return json(400, { hata: 'Yazı kimliği gerekli.' })
    const k = kararlar.yazilar[yaziId] || {}

    if (tur === 'onay') {
      k.onay = { zaman }
      // Onay, onceki reddi geri alir: musteri fikrini degistirmis olabilir.
      delete k.ret
    } else if (tur === 'ret') {
      k.ret = { zaman, neden: kirp(g.neden, NEDEN_TAVANI) }
      delete k.onay
    } else if (tur === 'tarih') {
      const t = kirp(g.tarih, 20)
      if (!TARIH_KALIBI.test(t)) return json(400, { hata: 'Tarih biçimi geçersiz.' })
      k.tarihDegisikligi = { tarih: t, zaman }
    } else if (tur === 'not') {
      k.duzeltmeNotu = { not: kirp(g.not, NOT_TAVANI), zaman }
    } else if (tur === 'metin') {
      // YALNIZ gercekten degistirilen alanlar yazilir (Karar E4): musteri
      // sadece basligi duzelttiyse motor govdeyi guncellemeye devam etsin.
      const md = { zaman }
      if (typeof g.baslik === 'string') md.baslik = kirp(g.baslik, BASLIK_TAVANI)
      if (typeof g.ozet === 'string') md.ozet = kirp(g.ozet, OZET_TAVANI)
      if (typeof g.icerik === 'string') {
        // Karar E2: musterinin sitesine gidecek HTML burada temizlenir.
        md.icerik = veri.htmlTemizle(g.icerik.slice(0, ICERIK_TAVANI))
      }
      if (!md.baslik && !md.ozet && !md.icerik) {
        return json(400, { hata: 'Değiştirilen bir alan yok.' })
      }
      k.metinDegisikligi = Object.assign({}, k.metinDegisikligi, md)
    }

    kararlar.yazilar[yaziId] = k
    await veri.kararlarYaz(slug, kararlar)
    return json(200, { kaydedildi: true, tur, yaziId, zaman })
  } catch (e) {
    console.error('karar yazilamadi', tur, e && e.message)
    return json(503, { hata: 'Kaydedilemiyor. Birazdan tekrar deneyin.' })
  }
}
