// Musterinin panelden aboneligini iptal etmesi. POST /.netlify/functions/abonelik-iptal
//
// Taahhut yok (Savas Bey, 3 Ekim 2026): musteri istedigi zaman iptal eder ve
// iyzico'daki abonelik GERCEKTEN durur. "Iptal ettik" deyip aboneligi acik
// birakmak, musteriden para cekilmeye devam etmesi demekti; bu yuzden ekrana
// "iptal edildi" ancak iyzico aboneligi CANCELED gosterdiginde yazilir.
//
// MEVCUT SIFRE SORULUR. Oturum tek basina yetmez: cerezi ele gecirmis biri
// musterinin aboneligini kapatip yayin akisini durdurabilirdi.
//
// Sira: odeme kayitlari -> her abonelik icin iyzico'dan durum ve sahip ->
// iptal -> belirsizse yeniden okuma. Sahibi tutmayan abonelige dokunulmaz.
const {
  hesapOku, hesapGuncelle, sifreDogrula, oturumOku, depoAc,
} = require('../hesap')
const { abonelikGetir, abonelikKaydi, abonelikIptal } = require('../iyzico')
const { bildir, paketAdi } = require('../bildirim')
const { cerezOku, cerezSil, json, govdeCoz } = require('../oturum')

const ODEME_TARAMA_TAVANI = 300
const BITMIS = new Set(['EXPIRED'])

async function abonelikleriBul (eposta) {
  const d = depoAc()
  const liste = await d.list({ prefix: 'odeme/' })
  const anahtarlar = (liste && Array.isArray(liste.blobs) ? liste.blobs : []).slice(0, ODEME_TARAMA_TAVANI)
  const cikti = []
  const gorulen = new Set()
  for (const b of anahtarlar) {
    const kayit = await d.get(b.key, { type: 'json' })
    if (!kayit || kayit.eposta !== eposta) continue
    // Elle acilan hesapta abonelik referansi ayri alanda; akistan gelende
    // kaydin referansi aboneligin kendisi.
    const referans = String(kayit.abonelikReferansi || kayit.referans || '').trim()
    if (!referans || gorulen.has(referans)) continue
    gorulen.add(referans)
    cikti.push({ referans, slug: kayit.slug || '', plan: kayit.plan || '' })
  }
  return cikti
}

function ayniKisi (a, b) {
  return String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase()
}

// Tek aboneligi iptal eder. Donen `sonuc`:
//   iptal     iyzico CANCELED gosteriyor (bu cagriyla ya da onceden)
//   bitmis    abonelik zaten sona ermis (EXPIRED)
//   sahip     iyzico'daki sahibi bu hesap degil; dokunulmadi
//   ret       iyzico iptali kabul etmedi
//   belirsiz  iyzico'ya ulasilamadi ya da cevap okunamadi
async function birIptal (a, eposta) {
  const once = await abonelikGetir(a.referans)
  if (!once || once.status !== 'success') return { sonuc: 'belirsiz', a }
  const kayit = abonelikKaydi(once, a.referans)
  if (!kayit) return { sonuc: 'belirsiz', a }
  if (kayit.customerEmail && !ayniKisi(kayit.customerEmail, eposta)) return { sonuc: 'sahip', a }
  const durum = String(kayit.subscriptionStatus || '').toUpperCase()
  if (durum === 'CANCELED') return { sonuc: 'iptal', a, zaten: true }
  if (BITMIS.has(durum)) return { sonuc: 'bitmis', a }

  const c = await abonelikIptal(a.referans, `iptal-${a.referans}`)
  if (c && c.status === 'success') return { sonuc: 'iptal', a }

  // Cevap bir ret olabilir ya da iptal gitti ama cevap kayboldu. Ayirt eden
  // tek sey aboneligin simdiki durumu.
  const sonra = await abonelikGetir(a.referans)
  const sk = sonra && sonra.status === 'success' ? abonelikKaydi(sonra, a.referans) : null
  if (sk && String(sk.subscriptionStatus || '').toUpperCase() === 'CANCELED') return { sonuc: 'iptal', a }
  if (c && c.status === 'failure' && !c.hataTipi) {
    return { sonuc: 'ret', a, kod: c.errorCode || '', mesaj: c.errorMessage || '' }
  }
  return { sonuc: 'belirsiz', a }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { hata: 'Yöntem desteklenmiyor.' })

  const oturumId = cerezOku(event)
  if (!oturumId) return json(401, { girisli: false })

  const g = govdeCoz(event)
  const mevcut = String(g.mevcut || '')
  if (!mevcut) return json(400, { hata: 'Mevcut şifrenizi yazın.' })

  let oturum, hesap
  try {
    oturum = await oturumOku(oturumId)
    if (!oturum) return json(401, { girisli: false }, cerezSil())
    hesap = await hesapOku(oturum.eposta)
  } catch (e) {
    console.error('oturum ya da hesap okunamadi', e && e.message)
    return json(503, { hata: 'Şu an iptal edilemiyor. Aboneliğiniz devam ediyor.' })
  }
  if (!hesap) return json(401, { girisli: false }, cerezSil())

  let dogru = false
  try { dogru = await sifreDogrula(mevcut, hesap.sifreOzeti || '') } catch { dogru = false }
  if (!dogru) return json(401, { hata: 'Mevcut şifreniz hatalı.' })

  let abonelikler
  try {
    abonelikler = await abonelikleriBul(oturum.eposta)
  } catch (e) {
    console.error('odeme kayitlari okunamadi', e && e.message)
    return json(503, { hata: 'Şu an iptal edilemiyor. Aboneliğiniz devam ediyor.' })
  }

  const kim = [
    ['Marka', hesap.markaAdi],
    ['E-posta', oturum.eposta],
    ['Motor', hesap.motorSlug],
  ]

  // Iyzico referansi olmayan hesap kendiliginden iptal edilemez. Musteriye
  // "iptal edildi" denmez; talep Savas'a gider.
  if (!abonelikler.length) {
    await bildir({
      tur: 'abonelik-iptal-talebi',
      onem: 'dikkat',
      baslik: 'Abonelik iptal talebi: elle iptal gerekiyor',
      satirlar: kim,
      not: 'Hesabın ödeme kaydında iyzico abonelik referansı yok. iyzico panelinden elle iptal edin.',
      eposta: oturum.eposta,
      tekil: `iptal-talebi/${oturum.eposta}`,
    })
    return json(202, {
      iptal: false,
      talep: true,
      mesaj: 'Aboneliğiniz otomatik iptal edilemedi. Talebiniz bize iletildi; iptal tamamlanınca e-posta ile bilgi vereceğiz.',
    })
  }

  const sonuclar = []
  for (const a of abonelikler) sonuclar.push(await birIptal(a, oturum.eposta))

  const iptalEdilen = sonuclar.filter((s) => s.sonuc === 'iptal' && !s.zaten)
  const sorunlu = sonuclar.filter((s) => s.sonuc === 'ret' || s.sonuc === 'belirsiz' || s.sonuc === 'sahip')
  const kapali = sonuclar.every((s) => s.sonuc === 'iptal' || s.sonuc === 'bitmis')

  const zaman = new Date().toISOString()
  if (kapali) {
    try {
      // Ilk iptal ani korunur; tekrar basilinca tarih kaymasin.
      await hesapGuncelle(oturum.eposta, {
        abonelikDurumu: 'iptal',
        iptalZamani: hesap.abonelikDurumu === 'iptal' && hesap.iptalZamani ? hesap.iptalZamani : zaman,
      })
    } catch (e) {
      // iyzico tarafi kapandi; panel kaydi yazilamadi. Musteriye dogrusu
      // soylenir: cekim durdu. Durum bir sonraki denemede yazilir.
      console.error('iptal durumu hesaba yazilamadi', e && e.message)
    }
  }

  if (iptalEdilen.length) {
    await bildir({
      tur: 'abonelik-iptal',
      onem: 'dikkat',
      baslik: 'Müşteri aboneliğini panelden iptal etti',
      satirlar: kim.concat(iptalEdilen.map((s) => ['Abonelik', `${paketAdi(s.a.slug || s.a.plan) || s.a.slug} · ${s.a.referans}`])),
      not: 'iyzico aboneliği CANCELED. Motorda bu müşterinin üretimini durdurun.',
      eposta: oturum.eposta,
      tekil: `iptal/${iptalEdilen.map((s) => s.a.referans).join(',')}`,
    })
  }

  if (sorunlu.length) {
    await bildir({
      tur: 'abonelik-iptal-sorun',
      onem: 'dikkat',
      baslik: 'Abonelik iptali tamamlanamadı',
      satirlar: kim.concat(sorunlu.map((s) => ['Abonelik', `${s.a.referans} · ${s.sonuc}${s.kod ? ' · ' + s.kod : ''}`])),
      not: 'Müşteri panelden iptal istedi. iyzico panelinden durumu kontrol edin.',
      eposta: oturum.eposta,
    })
    return json(502, {
      iptal: false,
      hata: 'İptal şu an tamamlanamadı, aboneliğiniz henüz durmadı. Talebiniz bize iletildi; size e-posta ile dönüş yapacağız.',
    })
  }

  return json(200, {
    iptal: true,
    iptalZamani: hesap.abonelikDurumu === 'iptal' && hesap.iptalZamani ? hesap.iptalZamani : zaman,
    zaten: iptalEdilen.length === 0,
  })
}

exports._ic = { abonelikleriBul, birIptal }
