// Panel veri katmani: motorun anlik goruntusu, panelin kararlari, birlestirme.
//
// SAHIPLIK (karar 2026-09-12):
//   Motor sahibi : yazi metni, baslik, ozet, konu listesi, planlanan gun,
//                  yayin durumu
//   Panel sahibi : onay, ret, duzeltme notu, metin degisikligi, yayin gunu ve
//                  saati tercihi, marka ayarlari, WhatsApp izni
//
// Iki taraf AYNI ANAHTARA YAZMAZ. "Ezmeyecek" kurali boylece bir temenni degil
// yapinin kendisi olur. Cakisma yazma aninda degil, okuma anindaki
// birlestirmede cozulur ve orada PANELIN KARARI KAZANIR.
//
//   motor/<slug>/liste       motorun anlik goruntusu, metinsiz
//   motor/<slug>/yazi/<id>   teslim HTML'i, onizleme acilinca okunur
//   motor/<slug>/islenen     motorun kendi imleci (panel okumaz, yazmaz)
//   panel/<slug>/kararlar    onay, ret, tarih ve metin degisikligi, notlar
//   panel/<slug>/ayarlar     yayin programi, marka, WhatsApp izni

const hesapLib = require('./hesap')

const MOTOR_LISTE = (s) => `motor/${encodeURIComponent(s)}/liste`
const MOTOR_YAZI = (s, id) => `motor/${encodeURIComponent(s)}/yazi/${encodeURIComponent(id)}`
const MOTOR_ISLENEN = (s) => `motor/${encodeURIComponent(s)}/islenen`
const PANEL_KARARLAR = (s) => `panel/${encodeURIComponent(s)}/kararlar`
const PANEL_AYARLAR = (s) => `panel/${encodeURIComponent(s)}/ayarlar`

// Slug hem anahtarin parcasi hem de musteri kimligi. Dar tutuluyor ki
// anahtar uzayinda gezinmeye yarayan bir sey gecmesin.
const SLUG_KALIBI = /^[a-z0-9][a-z0-9-]{1,60}$/

function slugGecerli (s) {
  return typeof s === 'string' && SLUG_KALIBI.test(s)
}

function depo () {
  return hesapLib.depoAc()
}

// --- motor tarafi ---------------------------------------------------------

async function motorListeOku (slug) {
  return depo().get(MOTOR_LISTE(slug), { type: 'json' })
}

async function motorListeYaz (slug, liste) {
  await depo().setJSON(MOTOR_LISTE(slug), liste)
}

async function motorYaziOku (slug, id) {
  return depo().get(MOTOR_YAZI(slug, id), { type: 'json' })
}

async function motorYaziYaz (slug, id, kayit) {
  await depo().setJSON(MOTOR_YAZI(slug, id), kayit)
}

async function islenenOku (slug) {
  return (await depo().get(MOTOR_ISLENEN(slug), { type: 'json' })) || { kararlar: [] }
}

async function islenenYaz (slug, kayit) {
  await depo().setJSON(MOTOR_ISLENEN(slug), kayit)
}

// --- panel tarafi ---------------------------------------------------------

async function kararlarOku (slug) {
  return (await depo().get(PANEL_KARARLAR(slug), { type: 'json' })) || { yazilar: {}, konular: {} }
}

async function kararlarYaz (slug, kararlar) {
  await depo().setJSON(PANEL_KARARLAR(slug), kararlar)
}

async function ayarlarOku (slug) {
  return (await depo().get(PANEL_AYARLAR(slug), { type: 'json' })) || {}
}

async function ayarlarYaz (slug, ayarlar) {
  await depo().setJSON(PANEL_AYARLAR(slug), ayarlar)
}

// --- olcumler -------------------------------------------------------------

// Musteri metni duzenleyince motorun kelime ve okuma suresi sayaclari yalan
// soylemeye baslar. 2026-09-10'da "duzenleme sayaclara dokunmaz" denmisti ama
// gerekcesi sahte govdelerin kisaligiydi; gercek metinle o gerekce dustu.
function kelimeSay (html) {
  const duz = String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return duz ? duz.split(' ').length : 0
}

function okumaDakikasi (kelime) {
  return Math.max(1, Math.round((Number(kelime) || 0) / 200))
}

// --- HTML temizligi (Karar E2) --------------------------------------------
//
// Duzenleme alani tarayicinin kendi duzenleme ozelligiyle calisiyor, ciktisi
// HTML. O HTML depoya, oradan da musterinin KENDI SITESINE gidiyor.
// Temizlenmezse panel, musterinin sitesine HTML enjekte etme yolu olur.
//
// Arac cubugu yalniz kalin, italik, madde listesi ve H2 uretiyor; motorun
// teslim HTML'i de paragraf, baglanti, ara baslik ve liste kullaniyor. Izin
// listesi bu yuzden dar tutulabiliyor. Listede olmayan etiket ATILIR, icindeki
// metin KORUNUR: musterinin yazdigi kaybolmasin.
const IZINLI_ETIKET = new Set(['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'h2', 'h3', 'blockquote', 'a'])

function htmlTemizle (ham) {
  const metin = String(ham || '')
  // Once tamamen atilacaklar: govdeleriyle birlikte gider.
  let s = metin
    .replace(/<script\b[\s\S]*?<\/script\s*>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style\s*>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')

  s = s.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (tam, etiket, nitelikler) => {
    const ad = etiket.toLowerCase()
    if (!IZINLI_ETIKET.has(ad)) return ''
    if (tam.startsWith('</')) return `</${ad}>`
    // Nitelikler tamamen dusuyor; tek istisna baglantinin adresi.
    if (ad === 'a') {
      const m = /\bhref\s*=\s*("([^"]*)"|'([^']*)')/i.exec(nitelikler)
      const adres = m ? (m[2] !== undefined ? m[2] : m[3]) : ''
      // javascript: ve data: semalari alinmaz.
      if (/^(https?:\/\/|\/|mailto:)/i.test(adres.trim())) {
        const guvenli = adres.trim().replace(/"/g, '&quot;')
        return `<a href="${guvenli}" rel="noopener nofollow">`
      }
      return '<a>'
    }
    return `<${ad}>`
  })

  return s
}

// --- birlestirme ----------------------------------------------------------

// Tek cumlelik kural: panelin bir karari varsa o kazanir, yoksa motorun degeri.
function yaziBirlestir (motorYazi, karar) {
  const y = Object.assign({}, motorYazi)
  if (!karar) return y

  // Metin: yalniz GERCEKTEN degistirilen alanlar donar (Karar E4). Boylece
  // musteri sadece basligi duzelttiyse motor govdeyi guncellemeye devam eder.
  const md = karar.metinDegisikligi
  if (md) {
    let metinDegisti = false
    for (const alan of ['baslik', 'ozet', 'icerik']) {
      if (typeof md[alan] === 'string' && md[alan].length) {
        y[alan] = md[alan]
        if (alan === 'icerik') metinDegisti = true
      }
    }
    y.panelDuzenledi = true
    y.panelDuzenlemeZamani = md.zaman || null
    // Govde degistiyse sayaclar o metinden yeniden hesaplanir (Karar E3).
    if (metinDegisti) {
      y.kelime = kelimeSay(md.icerik)
      y.okumaDk = okumaDakikasi(y.kelime)
    }
  }

  // Tarih: motorun planladigi gun oneri, panelin tasimasi karar (Karar D).
  if (karar.tarihDegisikligi && karar.tarihDegisikligi.tarih) {
    y.tarih = karar.tarihDegisikligi.tarih
  }

  // Durum. Ret her seyi gecer. Onay yalnizca "bekliyor"u ilerletir: motor
  // zaten "yayinda" diyorsa o daha ileri bir durumdur, geri alinmaz.
  if (karar.ret) {
    y.durum = 'reddedildi'
    y.reddetmeNedeni = karar.ret.neden || ''
    y.reddedildi = karar.ret.zaman || null
    y.tarih = null
  } else if (karar.onay && y.durum === 'bekliyor') {
    y.durum = 'planlandi'
    y.onaylandi = karar.onay.zaman || null
  }

  if (karar.duzeltmeNotu && karar.duzeltmeNotu.not) {
    y.duzeltmeNotu = karar.duzeltmeNotu.not
  }
  return y
}

// Panelin bekledigi sekli kurar. Panelin geri kalani degismez: Asama 1'de
// "tek veri nesnesinden okusun" diye kurulmustu, karsiligini burada veriyor.
function birlestir (girdi) {
  const motor = girdi.motor || {}
  const kararlar = girdi.kararlar || {}
  const ayarlar = girdi.ayarlar || {}
  const hesap = girdi.hesap || {}
  const yaziKararlari = kararlar.yazilar || {}

  const yazilar = (motor.yazilar || []).map((y) => yaziBirlestir(y, yaziKararlari[y.id]))

  // Panelin onerdigi, motorun henuz almadigi konular listenin basinda durur.
  const eklenen = (kararlar.konular && kararlar.konular.eklenen) || []
  const cikarilan = new Set((kararlar.konular && kararlar.konular.cikarilan) || [])
  const konular = eklenen
    .concat(motor.konular || [])
    .filter((k) => !cikarilan.has(k.id || k.konu))

  return {
    bugun: girdi.bugun,
    // Motorun son yazma zamani. Panel bunu "son guncelleme" olarak gosterir:
    // tek yonlu akista musteri, kararinin neden hemen yansimadigini buradan
    // anlar.
    sonGuncelleme: motor.uretildi || null,
    hesap: {
      markaAdi: hesap.markaAdi || '',
      eposta: hesap.eposta || '',
      telefon: (ayarlar.telefon !== undefined ? ayarlar.telefon : hesap.telefon) || '',
    },
    blogAdresi: motor.blogAdresi || hesap.webSitesi || '',
    abonelik: girdi.abonelik || {},
    paketler: girdi.paketler || {},
    yayinProgrami: ayarlar.yayinProgrami || { saat: '', gunler: [] },
    yazilar,
    konular,
    marka: ayarlar.marka || {},
    whatsapp: ayarlar.whatsapp || { numara: '', izin: false, izinZamani: null, izinMetniSurumu: null },
    destek: {
      baglantiDurumu: motor.baglantiDurumu || 'bilinmiyor',
      talepler: ayarlar.destekTalepleri || [],
    },
    odemeGecmisi: girdi.odemeGecmisi || [],
  }
}

// Motorun bekleyen kararlari: daha once islenmemis olanlar.
function bekleyenKararlar (kararlar, islenen) {
  const islenmis = new Set((islenen && islenen.kararlar) || [])
  const cikti = []
  for (const [id, k] of Object.entries((kararlar && kararlar.yazilar) || {})) {
    for (const tur of ['onay', 'ret', 'tarihDegisikligi', 'metinDegisikligi', 'duzeltmeNotu']) {
      if (!k[tur]) continue
      const kimlik = `${id}:${tur}:${k[tur].zaman || ''}`
      if (islenmis.has(kimlik)) continue
      cikti.push({ kimlik, yaziId: id, tur, veri: k[tur] })
    }
  }
  return cikti
}

module.exports = {
  MOTOR_LISTE, MOTOR_YAZI, MOTOR_ISLENEN, PANEL_KARARLAR, PANEL_AYARLAR,
  slugGecerli,
  motorListeOku, motorListeYaz, motorYaziOku, motorYaziYaz,
  islenenOku, islenenYaz,
  kararlarOku, kararlarYaz, ayarlarOku, ayarlarYaz,
  kelimeSay, okumaDakikasi, htmlTemizle, yaziBirlestir, birlestir, bekleyenKararlar,
}
