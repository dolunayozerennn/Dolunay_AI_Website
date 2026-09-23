// Yonetim ekraninin okudugu tek uc. GET /.netlify/functions/yonetim-veri
//
// Savas'in gordugu musteri listesi. Musteri paneliyle HICBIR ortak yolu yok:
// oturum cerezi okumaz, musteri hesabiyla acilmaz. Yetki YONETIM_SIRRI
// basligiyla (X-Yonetim-Sirri); MOTOR_SIRRI bu ucu acmaz.
//
// Iki kaynak birlestirilir:
//   1. Bizim depomuz: hesap/, odeme/, yetim/, bekleyen/, olay/, motor/<slug>/liste
//   2. iyzico abonelik listesi (SALT OKUNUR): durum, bekleyen siparisin tarihi
// iyzico okunamazsa ekran yine acilir; ilgili sutunlar "okunamadi" der.
// iyzico'da olup bizde hesabi olmayan abonelikler ayrica listelenir: Civelek
// boyle bir kayitti ve dort gun kimse gormedi.
//
// Donen veride TCKN, adres, sifre ozeti YOK.
const { depoAc } = require('../hesap')
const { json } = require('../oturum')
const { sirDogru, sirBasligi } = require('../yonetim')
const { abonelikleriTara } = require('../iyzico')
const { paketAdi, paketBul, OLAY_ONEK } = require('../bildirim')
const veri = require('../veri')

const TAVAN = 2000
const OLAY_SAYISI = 60
// Bekleyen kayitlar 24 saatte dusuyor ama depoda kaliyor; ekranda son bir
// haftanin yarim kalanlari yeterli.
const YARIM_GERI_BAKIS_MS = 7 * 24 * 60 * 60 * 1000
const YARIM_BEKLEME_MS = 45 * 60 * 1000

function zaman (x) {
  if (x === null || x === undefined || x === '') return null
  const d = new Date(typeof x === 'number' || /^\d{10,}$/.test(String(x)) ? Number(x) : String(x))
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

async function onekOku (d, onek) {
  const liste = await d.list({ prefix: onek })
  const anahtarlar = (liste && Array.isArray(liste.blobs) ? liste.blobs : []).slice(0, TAVAN)
  const kayitlar = await Promise.all(anahtarlar.map(async (b) => {
    try { return { anahtar: b.key, kayit: await d.get(b.key, { type: 'json' }) } } catch { return null }
  }))
  return kayitlar.filter((x) => x && x.kayit)
}

// iyzico'nun abonelik kaydindan ekranin ihtiyaci olan ozet. Siparis alan
// adlari canli kayitta olculdu (orders[].orderStatus, price, currencyCode);
// donem tarihi icin birkac ad denenir, bulunamazsa bos kalir.
function iyzicoOzet (k, simdi) {
  const siparisler = (Array.isArray(k.orders) ? k.orders : []).map((o) => ({
    durum: String((o && o.orderStatus) || '').toUpperCase(),
    zaman: zaman(o && (o.startPeriod || o.startDate || o.createdDate)),
    tutar: o && o.price,
    paraBirimi: (o && o.currencyCode) || '',
  }))
  const bekleyen = siparisler.filter((s) => s.durum === 'WAITING' && s.zaman).sort((a, b) => a.zaman.localeCompare(b.zaman))[0]
  const gecmis = siparisler.filter((s) => s.durum !== 'WAITING' && s.zaman && Date.parse(s.zaman) <= simdi)
    .sort((a, b) => b.zaman.localeCompare(a.zaman))
  const sonBasarili = gecmis.find((s) => s.durum === 'SUCCESS')
  return {
    referans: k.referenceCode || '',
    durum: String(k.subscriptionStatus || '').toUpperCase(),
    eposta: String(k.customerEmail || '').trim().toLowerCase(),
    telefon: k.customerGsmNumber || '',
    plan: k.pricingPlanReferenceCode || '',
    planAdi: k.pricingPlanName || '',
    baslangic: zaman(k.startDate || k.createdDate),
    sonrakiCekim: bekleyen ? bekleyen.zaman : null,
    sonrakiTutar: bekleyen ? bekleyen.tutar : null,
    sonSiparis: gecmis[0] ? { durum: gecmis[0].durum, zaman: gecmis[0].zaman } : null,
    sonOdeme: sonBasarili ? { zaman: sonBasarili.zaman, tutar: sonBasarili.tutar, paraBirimi: sonBasarili.paraBirimi } : null,
  }
}

// Ekranda tek bakista okunacak durum. `ton` renk icin: iyi / dikkat / kotu / notr.
function odemeDurumu (iyz, iyzicoOkundu, odemeKaydi) {
  if (iyz) {
    if (iyz.durum === 'ACTIVE') {
      if (iyz.sonSiparis && iyz.sonSiparis.durum !== 'SUCCESS') {
        return { etiket: `Aktif, son çekim ${iyz.sonSiparis.durum === 'FAILED' ? 'başarısız' : iyz.sonSiparis.durum}`, ton: 'kotu' }
      }
      return { etiket: 'Aktif', ton: 'iyi' }
    }
    if (iyz.durum === 'CANCELED') return { etiket: 'İptal edildi', ton: 'notr' }
    if (iyz.durum === 'UNPAID') return { etiket: 'Ödenmedi', ton: 'kotu' }
    return { etiket: iyz.durum || 'Bilinmiyor', ton: 'dikkat' }
  }
  if (!iyzicoOkundu) {
    return odemeKaydi
      ? { etiket: 'Kayıtlı (iyzico okunamadı)', ton: 'notr' }
      : { etiket: 'Ödeme kaydı yok (iyzico okunamadı)', ton: 'dikkat' }
  }
  return odemeKaydi
    ? { etiket: 'iyzico\'da bulunamadı', ton: 'dikkat' }
    : { etiket: 'Ödeme kaydı yok', ton: 'dikkat' }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') {
    return json(405, { hata: 'Yöntem desteklenmiyor.' })
  }
  if (!sirDogru(sirBasligi(event))) return json(401, { hata: 'Yetkisiz.' })

  const simdi = Date.now()
  let hesaplar, odemeler, yetimler, bekleyenler, olayAnahtarlari
  const d = depoAc()
  try {
    ;[hesaplar, odemeler, yetimler, bekleyenler] = await Promise.all([
      onekOku(d, 'hesap/'), onekOku(d, 'odeme/'), onekOku(d, 'yetim/'), onekOku(d, 'bekleyen/'),
    ])
    const ol = await d.list({ prefix: OLAY_ONEK })
    olayAnahtarlari = (ol && Array.isArray(ol.blobs) ? ol.blobs : []).map((b) => b.key)
  } catch (e) {
    console.error('yonetim verisi okunamadi', e && e.message)
    return json(503, { hata: 'Depo şu an okunamıyor.' })
  }

  // iyzico: salt okunur tam liste. Tarama `false` donerse liste tamam,
  // `null` donerse yarim kaldi; yarim listeyle "bulunamadi" demek yanlis olur.
  const iyzicoKayitlari = []
  let iyzicoOkundu = false
  try {
    const t = await abonelikleriTara((k) => { iyzicoKayitlari.push(iyzicoOzet(k, simdi)); return false })
    iyzicoOkundu = t === false
  } catch (e) {
    console.error('yonetim: iyzico okunamadi', e && e.message)
  }

  const odemeKayitlari = odemeler.map((x) => x.kayit)
  const bizimEpostalar = new Set()

  const musteriler = await Promise.all(hesaplar.map(async ({ kayit: h }) => {
    const eposta = String(h.eposta || '').toLowerCase()
    bizimEpostalar.add(eposta)
    const kendiOdemeleri = odemeKayitlari.filter((o) => String(o.eposta || '').toLowerCase() === eposta)
      .sort((a, b) => String(b.yazildi || '').localeCompare(String(a.yazildi || '')))
    const sonOdeme = kendiOdemeleri[0] || null
    const referanslar = new Set(kendiOdemeleri.flatMap((o) => [o.referans, o.abonelikReferansi]).filter(Boolean))

    // Eslestirme: once referans (kesin), sonra e-posta; e-postada aktif olan one.
    let iyz = iyzicoKayitlari.find((k) => k.referans && referanslar.has(k.referans)) || null
    if (!iyz) {
      const adaylar = iyzicoKayitlari.filter((k) => k.eposta === eposta)
      iyz = adaylar.find((k) => k.durum === 'ACTIVE') || adaylar[0] || null
    }

    let motor = null
    if (h.motorSlug) {
      try { motor = await veri.motorListeOku(h.motorSlug) } catch { motor = null }
    }

    const paket = paketBul(h.slug) || paketBul(h.plan)
    return {
      eposta,
      markaAdi: h.markaAdi || '',
      webSitesi: h.webSitesi || '',
      telefon: (sonOdeme && sonOdeme.fatura && sonOdeme.fatura.telefon) || (motor && motor.telefon) || (iyz && iyz.telefon) || '',
      paket: (paket && paket.ad) || (iyz && iyz.planAdi) || h.plan || '',
      kayitTarihi: h.acildi || null,
      acilisYolu: h.acilisYolu || 'odeme-akisi',
      odemeDurumu: odemeDurumu(iyz, iyzicoOkundu, sonOdeme),
      abonelikReferansi: (iyz && iyz.referans) || (sonOdeme && (sonOdeme.abonelikReferansi || sonOdeme.referans)) || '',
      sonOdeme: iyz && iyz.sonOdeme
        ? iyz.sonOdeme
        : sonOdeme ? { zaman: zaman(sonOdeme.odemeTarihi) || sonOdeme.yazildi || null, tutar: sonOdeme.tutar || null, paraBirimi: sonOdeme.paraBirimi || '' } : null,
      sonrakiCekim: iyz && iyz.sonrakiCekim
        ? { zaman: iyz.sonrakiCekim, kaynak: 'iyzico', tutar: iyz.sonrakiTutar }
        : sonOdeme && sonOdeme.sonrakiCekim
          ? { zaman: zaman(sonOdeme.sonrakiCekim), kaynak: sonOdeme.sonrakiCekimHesaplandi ? 'hesaplanan' : 'kayit' }
          : null,
      motor: {
        bagli: Boolean(h.motorSlug),
        slug: h.motorSlug || '',
        yazdi: Boolean(motor),
        sonYazim: (motor && motor.uretildi) || null,
        yaziSayisi: motor && Array.isArray(motor.yazilar) ? motor.yazilar.length : 0,
      },
    }
  }))

  // En yeni kayit en ustte. Tarihi olmayan en alta.
  musteriler.sort((a, b) => String(b.kayitTarihi || '').localeCompare(String(a.kayitTarihi || '')))

  // iyzico'da aktif ama bizde hesabi olmayan abonelikler.
  const hesapsizAbonelikler = iyzicoKayitlari
    .filter((k) => k.durum === 'ACTIVE' && k.eposta && !bizimEpostalar.has(k.eposta))
    .map((k) => Object.assign({}, k, { paket: paketAdi(k.plan) || k.planAdi }))
    .sort((a, b) => String(b.baslangic || '').localeCompare(String(a.baslangic || '')))

  // Yetim kaydi bilerek silinmiyor (is emri). E-postanin artik hesabi varsa
  // elle acilmis demektir: listede kalir ama "cozuldu" diye isaretlenir ve
  // dikkat sayacina girmez.
  const yetimListesi = yetimler.map(({ kayit: y }) => ({
    referans: y.referans || '',
    eposta: y.eposta || '',
    paket: y.plan ? paketAdi(y.plan) : '',
    hata: y.hata || '',
    zaman: y.yazildi || null,
    cozuldu: Boolean(y.eposta) && bizimEpostalar.has(String(y.eposta).toLowerCase()),
  })).sort((a, b) => String(b.zaman || '').localeCompare(String(a.zaman || '')))

  // Yarim kalanlar: formu doldurup kart adimina gecen ama hesabi acilmayan.
  const yarimKalanlar = bekleyenler.map(({ kayit: b }) => b).filter((b) => {
    const t = Date.parse(b.olusturuldu || '')
    if (!Number.isFinite(t) || simdi - t < YARIM_BEKLEME_MS || simdi - t > YARIM_GERI_BAKIS_MS) return false
    return !bizimEpostalar.has(String(b.eposta || '').toLowerCase())
  }).map((b) => ({
    eposta: b.eposta || '',
    markaAdi: b.markaAdi || '',
    adSoyad: `${b.ad || ''} ${b.soyad || ''}`.trim(),
    telefon: b.telefon || '',
    paket: paketAdi(b.slug || b.plan),
    zaman: b.olusturuldu || null,
  })).sort((a, b) => String(b.zaman || '').localeCompare(String(a.zaman || '')))

  // Olaylar: anahtar zamanla basladigi icin ters siralama en yeniyi one getirir.
  const sonOlayAnahtarlari = olayAnahtarlari.sort().reverse().slice(0, OLAY_SAYISI)
  const olaylar = (await Promise.all(sonOlayAnahtarlari.map(async (a) => {
    try { return await d.get(a, { type: 'json' }) } catch { return null }
  }))).filter(Boolean).map((o) => ({
    tur: o.tur, onem: o.onem, baslik: o.baslik, zaman: o.zaman, gonderim: o.gonderim, satirlar: o.satirlar || [], not: o.not || '',
  }))

  return json(200, {
    zaman: new Date(simdi).toISOString(),
    iyzicoOkundu,
    ozet: {
      musteri: musteriler.length,
      aktif: musteriler.filter((m) => m.odemeDurumu.etiket === 'Aktif').length,
      motorBagli: musteriler.filter((m) => m.motor.bagli).length,
      dikkat: hesapsizAbonelikler.length + yetimListesi.filter((y) => !y.cozuldu).length + yarimKalanlar.length,
    },
    musteriler,
    hesapsizAbonelikler,
    yetimler: yetimListesi,
    yarimKalanlar,
    olaylar,
  })
}

exports.iyzicoOzet = iyzicoOzet
