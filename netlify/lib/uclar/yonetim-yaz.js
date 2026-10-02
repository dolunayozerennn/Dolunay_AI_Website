// Yonetim ekraninin yazdigi tek uc. POST /.netlify/functions/yonetim-yaz
//
// Savas'in kaydi: yonetici notu (WhatsApp / e-postadan yapistirilan bilgi,
// tarihli) ve panel hesabi acmamis musteriyi elle ekleme. Yetki
// YONETIM_SIRRI (X-Yonetim-Sirri); MOTOR_SIRRI ve musteri oturumu bu ucu
// acmaz.
//
// Turler:
//   musteri-ekle    yeni yonetim kaydi (istege bagli ilk notla)
//   not-ekle        mevcut kayda not
//   not-sil         notu siler (karar 2026-10-02); duzenleme yok
//   kayit-guncelle  marka adi, e-posta, telefon, site adresi
//
// Elle eklenen musteriye PANEL HESABI ACILMAZ. O is hesap-ac ucunda ve
// sifre urettigi icin ayri tutuldu.
const tanisma = require('../tanisma')
const veri = require('../veri')
const { hesapOku, epostaAnahtari } = require('../hesap')
const { json, govdeCoz } = require('../oturum')
const { sirDogru, sirBasligi } = require('../yonetim')

const TURLER = ['musteri-ekle', 'not-ekle', 'not-sil', 'kayit-guncelle']
const { kirp } = tanisma

function notKur (g, zaman) {
  const metin = typeof g.metin === 'string' ? g.metin.slice(0, tanisma.NOT_TAVANI) : ''
  if (!metin.trim()) return { hata: 'Not boş.' }
  const kanal = tanisma.NOT_KANALLARI.includes(g.kanal) ? g.kanal : 'diger'
  // Metin KIRPILMAZ ve duzeltilmez: yapistirilan mesaj oldugu gibi kalsin.
  return { not: { id: tanisma.notKimligi(zaman), zaman, kanal, metin } }
}

// Ortak alanlar. Bos gelen alan "temizle" demektir, gelmeyen "dokunma".
function alanlariOku (g, hatalar) {
  const a = {}
  if (g.markaAdi !== undefined) a.markaAdi = kirp(g.markaAdi, 200)
  if (g.telefon !== undefined) a.telefon = kirp(g.telefon, 40)
  if (g.eposta !== undefined) {
    a.eposta = epostaAnahtari(kirp(g.eposta, 200))
    if (a.eposta && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.eposta)) hatalar.eposta = 'E-posta geçerli görünmüyor.'
  }
  if (g.siteAdresi !== undefined) {
    const s = tanisma.adresDuzelt(g.siteAdresi)
    if (s === null) hatalar.siteAdresi = 'Adres http:// ya da https:// ile başlamalı.'
    else a.siteAdresi = s
  }
  return a
}

// Bir e-posta tek kayda baglanir; iki kayit ayni hesabin formunu okumasin.
async function epostaBaskasinda (eposta, slug) {
  if (!eposta) return null
  const hepsi = await tanisma.yonetimHepsi()
  const k = hepsi.find((x) => x.slug !== slug && String(x.eposta || '') === eposta)
  return k ? k.slug : null
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { hata: 'Yöntem desteklenmiyor.' })
  if (!sirDogru(sirBasligi(event))) return json(401, { hata: 'Yetkisiz.' })

  const g = govdeCoz(event)
  const tur = String(g.tur || '')
  if (!TURLER.includes(tur)) return json(400, { hata: 'Bilinmeyen işlem.' })
  const slug = String(g.slug || '').trim()
  if (!veri.slugGecerli(slug)) {
    return json(400, { hata: 'Kısa ad geçersiz: küçük harf, rakam ve tire; 2-61 karakter.', hatalar: { slug: 'Geçersiz kısa ad.' } })
  }

  const zaman = new Date().toISOString()
  try {
    const mevcut = await tanisma.yonetimOku(slug)

    if (tur === 'musteri-ekle') {
      if (mevcut) return json(409, { hata: `"${slug}" kısa adıyla bir kayıt zaten var.`, hatalar: { slug: 'Bu kısa ad kullanılıyor.' } })
      const hatalar = {}
      const a = alanlariOku(g, hatalar)
      if (!a.markaAdi) hatalar.markaAdi = 'Marka adı gerekli.'
      let ilkNot = null
      if (typeof g.metin === 'string' && g.metin.trim()) {
        const n = notKur(g, zaman)
        if (n.hata) hatalar.metin = n.hata; else ilkNot = n.not
      }
      if (Object.keys(hatalar).length) return json(400, { hata: 'Eksik ya da hatalı alan var.', hatalar })
      const sahibi = await epostaBaskasinda(a.eposta, slug)
      if (sahibi) return json(409, { hata: `Bu e-posta "${sahibi}" kaydına bağlı.`, hatalar: { eposta: 'Başka bir kayda bağlı.' } })

      const hesap = a.eposta ? await hesapOku(a.eposta) : null
      const kayit = {
        slug,
        markaAdi: a.markaAdi,
        eposta: a.eposta || '',
        telefon: a.telefon || '',
        siteAdresi: a.siteAdresi || '',
        kaynak: hesap ? 'hesap' : 'elle',
        olusturuldu: zaman,
        guncellendi: zaman,
        notlar: ilkNot ? [ilkNot] : [],
      }
      await tanisma.yonetimYaz(slug, kayit)
      return json(200, { kaydedildi: true, tur, kayit })
    }

    if (!mevcut) return json(404, { hata: 'Kayıt bulunamadı.' })

    if (tur === 'not-ekle') {
      const n = notKur(g, zaman)
      if (n.hata) return json(400, { hata: n.hata, hatalar: { metin: n.hata } })
      const notlar = Array.isArray(mevcut.notlar) ? mevcut.notlar : []
      // En yeni basta. Tavan asilirsa EN ESKI duser; ekranda sayi gorunur.
      const kayit = Object.assign({}, mevcut, {
        notlar: [n.not].concat(notlar).slice(0, tanisma.EN_COK_NOT),
        guncellendi: zaman,
      })
      await tanisma.yonetimYaz(slug, kayit)
      return json(200, { kaydedildi: true, tur, not: n.not, notSayisi: kayit.notlar.length })
    }

    if (tur === 'not-sil') {
      // Karar 2026-10-02: silme yalniz buradan (yonetim). Not metni kayittan
      // tamamen cikar, motor-oku da artik vermez. Motor notu onceden okuyup
      // profile islemis olabilir: geriye yalniz KIMLIK ve silinme ani kalir
      // (`silinenNotlar`), metin kalmaz. Motor bu listeye bakip kendi
      // tarafindaki izi kaldirir.
      const notId = String(g.notId || '')
      const notlar = Array.isArray(mevcut.notlar) ? mevcut.notlar : []
      if (!notId || !notlar.some((n) => n.id === notId)) return json(404, { hata: 'Not bulunamadı.' })
      const silinen = Array.isArray(mevcut.silinenNotlar) ? mevcut.silinenNotlar : []
      const kayit = Object.assign({}, mevcut, {
        notlar: notlar.filter((n) => n.id !== notId),
        silinenNotlar: [{ id: notId, zaman }].concat(silinen).slice(0, tanisma.EN_COK_NOT),
        guncellendi: zaman,
      })
      await tanisma.yonetimYaz(slug, kayit)
      return json(200, { kaydedildi: true, tur, notId, notSayisi: kayit.notlar.length })
    }

    // kayit-guncelle
    const hatalar = {}
    const a = alanlariOku(g, hatalar)
    if (a.markaAdi !== undefined && !a.markaAdi) hatalar.markaAdi = 'Marka adı boş olamaz.'
    if (Object.keys(hatalar).length) return json(400, { hata: 'Eksik ya da hatalı alan var.', hatalar })
    if (a.eposta) {
      const sahibi = await epostaBaskasinda(a.eposta, slug)
      if (sahibi) return json(409, { hata: `Bu e-posta "${sahibi}" kaydına bağlı.`, hatalar: { eposta: 'Başka bir kayda bağlı.' } })
    }
    const kayit = Object.assign({}, mevcut, a, { guncellendi: zaman })
    await tanisma.yonetimYaz(slug, kayit)
    return json(200, { kaydedildi: true, tur, kayit })
  } catch (e) {
    console.error('yonetim kaydi yazilamadi', tur, e && e.message)
    return json(503, { hata: 'Kaydedilemedi. Birazdan tekrar deneyin.' })
  }
}
