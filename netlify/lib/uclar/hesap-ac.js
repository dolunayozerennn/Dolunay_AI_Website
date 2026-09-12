// Elle hesap acma ucu. POST /.netlify/functions/hesap-ac
//
// NEDEN VAR: hesapAc kod tabaninda TEK bir yerden cagriliyordu, iyzico geri
// donusunden (abonelik-sonuc.js). Yani dolunay.ai odeme akisindan gecmemis
// bir musteri panel hesabina HICBIR SEKILDE sahip olamiyordu. Bu gecici bir
// eksik degil kalici bir durum: Blogient'ten tasinacak musterilerin hicbiri o
// akistan gecmedi, eski odeme linkiyle odeyen de gecmedi.
//
// AYRI SIR: YONETIM_SIRRI. MOTOR_SIRRI'nin yetkisi bilerek genisletilmedi.
// O sir motorun calistigi makinede duruyor ve yalnizca icerik yazmaya yetiyor;
// sizmasi halinde hesap da acabilmesi cok daha agir bir sonuc olurdu.
//
// ODEME BILGISI ZORUNLU DEGIL AMA BEKLENIYOR: bu musteriler bizim odeme
// kaydimizda hic gorunmuyor. Kaynagi, tutari, tarihi ve abonelik referansi
// yazilmazsa musteri "kayitsiz" kalmaya devam eder; panelde odeme gecmisi bos
// gorunur ve bir sonraki tahsilatin ne zaman gelecegini kimse bilemez.
const crypto = require('crypto')
const { hesapOku, hesapAc, sifreOzetle, odemeYaz } = require('../hesap')
const { json, govdeCoz } = require('../oturum')

const EPOSTA_KALIBI = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ALAN_TAVANI = 300
// Musterinin elle yazacagi bir sifre. Karisan karakterler (0/O, 1/l/I)
// alfabede yok; telefonda okunup yazilabilsin diye gruplara bolunuyor.
const ALFABE = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const GRUP = 5
const GRUP_SAYISI = 4

function sirDogru (gelen) {
  const beklenen = process.env.YONETIM_SIRRI || ''
  // Sir tanimli degilse uc KAPALI. Bos sir "herkese acik" anlamina gelmemeli.
  if (!beklenen || !gelen) return false
  const oa = crypto.createHash('sha256').update(Buffer.from(String(gelen))).digest()
  const ob = crypto.createHash('sha256').update(Buffer.from(beklenen)).digest()
  return crypto.timingSafeEqual(oa, ob)
}

function sifreUret () {
  const gruplar = []
  for (let g = 0; g < GRUP_SAYISI; g += 1) {
    let s = ''
    // rejection sampling: 256 % 32 === 0, yani modulo sapmasi yok.
    for (const b of crypto.randomBytes(GRUP)) s += ALFABE[b % ALFABE.length]
    gruplar.push(s)
  }
  return gruplar.join('-')
}

function metin (v, tavan) {
  return typeof v === 'string' ? v.slice(0, tavan || ALAN_TAVANI) : ''
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { hata: 'Yöntem desteklenmiyor.' })

  const basliklar = event.headers || {}
  if (!sirDogru(basliklar['x-yonetim-sirri'])) return json(401, { hata: 'Yetkisiz.' })

  const g = govdeCoz(event)
  const eposta = metin(g.eposta, 200).trim().toLowerCase()
  if (!EPOSTA_KALIBI.test(eposta)) return json(400, { hata: 'Geçerli bir e-posta gerekli.' })

  // IDEMPOTENT: mevcut hesabin ustune yazilmaz ve sifresi DEGISTIRILMEZ.
  // Ikinci cagri yeni sifre uretip donmez; donseydi bu uc, sirri eline
  // gecirenin herhangi bir hesabi devralmasina yarayan bir kapi olurdu.
  let varOlan
  try {
    varOlan = await hesapOku(eposta)
  } catch (e) {
    console.error('hesap okunamadi', e && e.message)
    return json(503, { hata: 'Şu an açılamıyor.' })
  }
  if (varOlan) {
    return json(200, {
      acildi: false,
      zatenVar: true,
      eposta,
      motorSlug: varOlan.motorSlug || null,
      acilis: varOlan.acildi || null,
      not: 'Hesap zaten var. Şifre değiştirilmedi; sıfırlama bu uçtan yapılmaz.',
    })
  }

  const sifre = sifreUret()
  let sifreOzeti
  try {
    sifreOzeti = await sifreOzetle(sifre)
  } catch (e) {
    console.error('sifre ozetlenemedi', e && e.message)
    return json(503, { hata: 'Şu an açılamıyor.' })
  }

  const kayit = {
    eposta,
    sifreOzeti,
    markaAdi: metin(g.markaAdi),
    webSitesi: metin(g.webSitesi),
    plan: metin(g.plan, 200),
    slug: metin(g.slug, 100),
    // Motor slug'ini burada da kabul ediyoruz: bu musterilerde motor zaten
    // calisiyor olabilir ve Karar F'deki "motor ilk yazisinda bildirir" yolu
    // hesap yoksa calismiyordu (hesapOku null donuyordu).
    motorSlug: metin(g.motorSlug, 100),
    // Bu hesabin odeme akisindan GECMEDIGI kaydin kendisinde dursun; sonradan
    // bakan biri "neden bekleyen kaydi yok" diye aramasin.
    acilisYolu: 'elle',
  }
  // Bos alanlar kayda girmesin: "markaAdi: ''" ile "markaAdi yok" farkli
  // seyler ve panel ikincisini bekliyor. eposta/sifreOzeti/acilisYolu hicbir
  // zaman bos olmadigi icin bu temizlikten etkilenmiyor.
  for (const alan of Object.keys(kayit)) if (kayit[alan] === '') delete kayit[alan]

  let acilan
  try {
    acilan = await hesapAc(eposta, kayit)
  } catch (e) {
    console.error('hesap acilamadi', e && e.message)
    return json(503, { hata: 'Şu an açılamıyor.' })
  }
  // hesapAc yaris durumunda mevcut kaydi doner. O zaman urettigimiz sifre
  // HICBIR yere yazilmadi; dondurursek musteriye calismayan sifre veririz.
  if (!acilan.yeni) {
    return json(200, {
      acildi: false,
      zatenVar: true,
      eposta,
      not: 'Hesap bu istek sırasında başka bir yoldan açılmış. Şifre üretilmedi.',
    })
  }

  // Odeme kaydi ayri anahtarda; panel odeme gecmisini oradan okuyor.
  // Yazilamamasi hesabi geri almaz: hesap acildi, musteri girebiliyor.
  // Eksik olan kayit elle tamamlanabilir, kapatilan hesap tamamlanamaz.
  let odeme = 'yazilmadi'
  const referans = metin(g.abonelikReferansi, 200) || metin(g.odemeReferansi, 200)
  if (referans) {
    try {
      const yeni = await odemeYaz(referans, {
        referans,
        eposta,
        plan: metin(g.plan, 200),
        slug: metin(g.slug, 100),
        eslestirme: 'elle',
        // Odemenin bizim akisimizdan gelmedigini soyleyen alanlar.
        odemeKaynagi: metin(g.odemeKaynagi, 100),
        tutar: metin(g.tutar, 40),
        paraBirimi: metin(g.paraBirimi, 10) || 'TRY',
        odemeTarihi: metin(g.odemeTarihi, 40),
        sonrakiCekim: metin(g.sonrakiCekim, 40),
        abonelikReferansi: metin(g.abonelikReferansi, 200),
        musteriReferansi: metin(g.musteriReferansi, 200),
        not: metin(g.not, 500),
      })
      odeme = yeni ? 'yazildi' : 'zaten vardi'
    } catch (e) {
      console.error('elle odeme kaydi yazilamadi', e && e.message)
      odeme = 'yazilamadi'
    }
  }

  // Sifre YALNIZ BURADA, yalniz bir kez doner. Kayda yazilmaz, loglanmaz.
  return json(200, {
    acildi: true,
    eposta,
    sifre,
    odeme,
    motorSlug: kayit.motorSlug || null,
    not: 'Şifre bir kez döner ve hiçbir yere kaydedilmez. Müşteriye iletip panelden değiştirmesini isteyin.',
  })
}

// Sinav icin: sifre uretecinin alfabesi ve bicimi disaridan dogrulanabilsin.
exports.sifreUret = sifreUret
exports.ALFABE = ALFABE
