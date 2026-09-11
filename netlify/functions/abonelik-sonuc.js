// /odeme/sonuc adresini karsilar. iyzico odeme formunu tamamlayan musteriyi
// buraya token ile birlikte geri gonderir. Sonucu kendimiz sorup gosteririz;
// "odendi" hukmu formun donusune degil iyzico'nun cevabina dayanir.
const { formSonuc } = require('../lib/iyzico')
const { kacir, sayfa, html, kayitIcin } = require('../lib/sayfa')
const {
  bekleyenOku, bekleyenSil, bekleyenBulKimlikle, hesapAc, odemeOku, odemeYaz, yetimYaz, taniYaz,
  jetonOku,
} = require('../lib/hesap')

function tokenBul(event) {
  const q = event.queryStringParameters || {}
  if (q.token) return String(q.token).trim()
  let ham = event.body || ''
  if (event.isBase64Encoded) ham = Buffer.from(ham, 'base64').toString('utf-8')
  if (!ham) return ''
  try {
    if ((event.headers['content-type'] || '').includes('application/json')) {
      return String(JSON.parse(ham).token || '').trim()
    }
  } catch { /* form-encoded olarak denenir */ }
  return String(new URLSearchParams(ham).get('token') || '').trim()
}

function ciz(kod, baslik, kutuSinifi, mesaj, ek) {
  return html(kod, sayfa({
    baslik,
    govde: `
      <span class="rozet">Abonelik</span>
      <h1>${kacir(baslik)}</h1>
      <div class="${kutuSinifi}">${kacir(mesaj)}</div>
      ${ek || ''}
      <p class="dip">Sorularınız için <a href="mailto:dolunay@dolunay.ai">dolunay@dolunay.ai</a></p>`,
  }))
}

// --- Asama 2: odeme onaylandiktan sonra hesabi acmak --------------------
//
// Callback govdesinin sekli sozlesmede yazili DEGIL. Hangi alanin konusma
// kimligini tasidigini gercek bir donus gormeden bilmiyoruz ve sandbox
// erisimimiz yok. Bu yuzden eslestirme TEK bir alana baglanmaz:
//   0. jeton isaretcisi -- odeme baslarken yazildi, callback'te elimizde HER
//      ZAMAN token var; sekilden bagimsiz tek kesin yol budur,
//   1. konusma kimligi (conversationId) aranir,
//   2. bulunamazsa e-posta + plan ikilisine dusulur,
//   3. o da olmazsa odeme yetim kaydedilir ve elle acilir.
// Hicbir dal musteriye "odeme olmadi" demez: para alindi, sonuc sayfasi
// basarili kalir. Bu, saglayicinin sekli ne olursa olsun degismeyen kural.

const KIMLIK_ADLARI = ['conversationid']
const EPOSTA_ADLARI = ['customeremail', 'email', 'eposta', 'subscriptionemail', 'contactemail']
const PLAN_ADLARI = ['pricingplanreferencecode', 'planreferencecode', 'pricingplancode']

// Saglayici alan adini `customer_email` ya da `customerEmail` yazabilir;
// karsilastirma noktalama ve buyuk harften bagimsiz yapilir.
function adNormal (ad) {
  return String(ad).toLowerCase().replace(/[^a-z0-9]/g, '')
}

// Verilen adlardan birini tasiyan ILK metin degerini ve bulundugu yolu doner.
// Genisligine once: ust seviyedeki alan, derindeki ayni adli alandan onceliklidir.
// Adim sayisi sinirli; tanimadigimiz bir govde fonksiyonu mesgul etmesin.
function degerAra (kok, adlar) {
  const hedef = new Set(adlar)
  const sira = [[kok, '']]
  const gorulen = new Set()
  let adim = 0
  while (sira.length && adim < 2000) {
    adim += 1
    const [dugum, yol] = sira.shift()
    if (!dugum || typeof dugum !== 'object' || gorulen.has(dugum)) continue
    gorulen.add(dugum)
    for (const anahtar of Object.keys(dugum)) {
      const deger = dugum[anahtar]
      const altYol = yol ? `${yol}.${anahtar}` : anahtar
      if (hedef.has(adNormal(anahtar)) && typeof deger === 'string' && deger.trim()) {
        return { deger: deger.trim(), yol: altYol }
      }
      if (deger && typeof deger === 'object') sira.push([deger, altYol])
    }
  }
  return null
}

// Tani kaydina yalniz ALAN ADLARI ve deger TURLERI girer. Musteri verisi
// (e-posta, ad, telefon, kimlik no, adres) buraya YAZILMAZ: aranan bilgi
// alanin adi, icindeki deger degil. Bu kayit sorunun cevabi kadar yasamali,
// musterinin verisini ikinci bir yerde biriktirmemeli.
function sekilCikar (kok) {
  const yollar = []
  const sira = [[kok, '']]
  const gorulen = new Set()
  let adim = 0
  while (sira.length && adim < 2000 && yollar.length < 300) {
    adim += 1
    const [dugum, yol] = sira.shift()
    if (!dugum || typeof dugum !== 'object' || gorulen.has(dugum)) continue
    gorulen.add(dugum)
    for (const anahtar of Object.keys(dugum)) {
      const deger = dugum[anahtar]
      const altYol = yol ? `${yol}.${anahtar}` : anahtar
      const tur = Array.isArray(deger) ? 'dizi' : deger === null ? 'bos' : typeof deger
      yollar.push(`${altYol}:${tur}`)
      if (deger && typeof deger === 'object') sira.push([deger, altYol])
    }
  }
  return yollar
}

// Odeme ACTIVE dogrulandiktan SONRA cagrilir. Firlatmaz: her hata kendi
// icinde yakalanir ve bir duruma cevrilir. Cagiran taraf sonucu yalnizca
// sayfadaki "sirada ne var" metnini secmek icin kullanir.
async function hesabiKur (cevap, veri, token) {
  const kimlik = degerAra(cevap, KIMLIK_ADLARI)
  const eposta = degerAra(cevap, EPOSTA_ADLARI)
  const plan = degerAra(cevap, PLAN_ADLARI)
  const referans = (veri && (veri.referenceCode || veri.subscriptionReferenceCode))
    || (kimlik && kimlik.deger) || ''

  // Sekil bir kereligine kaydedilir. "conversationId hangi alanda geliyor"
  // sorusu boylece ilk gercek odemede kendiliginden cevaplanir; sandbox
  // beklemeye gerek kalmaz.
  const sekil = {
    yollar: sekilCikar(cevap),
    eslesme: {
      konusmaKimligi: kimlik ? kimlik.yol : null,
      eposta: eposta ? eposta.yol : null,
      plan: plan ? plan.yol : null,
    },
  }
  try {
    const yeni = await taniYaz(sekil)
    // Kayit yalniz depoda kalirsa okumak icin Netlify Blobs erisimi gerekir.
    // Ayni bilgi fonksiyon kaydina da dusurulur: icinde musteri verisi YOK,
    // yalniz alan adlari ve turler. Aradigimiz cevap ilk gercek odemede
    // Netlify fonksiyon kaydinda gorunur, ayrica arac gerekmez.
    if (yeni) console.log('callback sekli', JSON.stringify(sekil))
  } catch (e) {
    console.error('tani kaydi yazilamadi', e && e.message)
    // Depo kapaliysa kayit hic yazilamaz; o zaman tek kaynak logdur.
    console.log('callback sekli', JSON.stringify(sekil))
  }

  let bekleyen = null
  let nasil = null
  let isaret = null
  try {
    if (token) {
      isaret = await jetonOku(token)
      if (isaret) {
        bekleyen = await bekleyenOku(isaret.eposta, isaret.plan)
        if (bekleyen) nasil = 'jeton'
      }
    }
    if (!bekleyen && kimlik) {
      bekleyen = await bekleyenBulKimlikle(kimlik.deger)
      if (bekleyen) nasil = 'konusmaKimligi'
    }
    if (!bekleyen && eposta && plan) {
      bekleyen = await bekleyenOku(eposta.deger, plan.deger)
      if (bekleyen) nasil = 'eposta+plan'
    }
  } catch (e) {
    console.error('bekleyen kayit okunamadi', e && e.message)
    bekleyen = null
  }

  if (!bekleyen) {
    // Callback ikinci kez gelmis ya da musteri sonuc sayfasini yenilemis
    // olabilir: bekleyen kayit ilk seferde silindi. Odeme kaydi duruyorsa is
    // zaten bitmistir. Bunu yetim saymak, elle bakilacak isler listesini
    // yanlis alarmla doldurur ve gercek yetimleri gorunmez yapar.
    // Odeme kaydinin anahtari ilk geciste `referans || konusmaKimligi` idi.
    // Cevapta referans hic gelmiyorsa o anahtari ancak jeton isaretcisindeki
    // konusma kimligiyle yeniden kurabiliriz; isaretci 24 saat yasiyor.
    try {
      const aday = referans || (isaret && isaret.konusmaKimligi) || ''
      if (aday && await odemeOku(aday)) return { durum: 'zaten', nasil: 'odemeKaydi' }
    } catch (e) {
      console.error('odeme kaydi okunamadi', e && e.message)
    }

    // Deger degil YOL loglanir: musterinin e-postasi sunucu kaydina dusmesin.
    console.error('bekleyen kayit bulunamadi', kayitIcin(referans),
      'kimlik:', kimlik ? kimlik.yol : 'yok',
      'eposta:', eposta ? eposta.yol : 'yok',
      'plan:', plan ? plan.yol : 'yok')
    try {
      await yetimYaz(referans || `tanimsiz-${Date.now()}`, {
        referans,
        konusmaKimligi: kimlik ? kimlik.deger : null,
        eposta: eposta ? eposta.deger : null,
        plan: plan ? plan.deger : null,
        yollar: sekil.yollar,
      })
    } catch (e) {
      console.error('yetim kayit yazilamadi', e && e.message)
      return { durum: 'kayitsiz' }
    }
    return { durum: 'yetim' }
  }

  try {
    const acilan = await hesapAc(bekleyen.eposta, {
      eposta: bekleyen.eposta,
      sifreOzeti: bekleyen.sifreOzeti,
      markaAdi: bekleyen.markaAdi,
      webSitesi: bekleyen.webSitesi,
      plan: bekleyen.plan,
      slug: bekleyen.slug,
    })
    await odemeYaz(referans || bekleyen.konusmaKimligi, {
      referans,
      konusmaKimligi: bekleyen.konusmaKimligi,
      eposta: bekleyen.eposta,
      plan: bekleyen.plan,
      slug: bekleyen.slug,
      eslestirme: nasil,
      fatura: {
        ad: bekleyen.ad,
        soyad: bekleyen.soyad,
        telefon: bekleyen.telefon,
        tckn: bekleyen.tckn,
        adres: bekleyen.adres,
        ilce: bekleyen.ilce,
        sehir: bekleyen.sehir,
        postaKodu: bekleyen.postaKodu,
      },
    })
    // Silme en sona birakilir: kayit silinip hesap acilamazsa musterinin
    // sifresi kaybolur ve hesap bir daha acilamaz.
    try {
      await bekleyenSil(bekleyen.eposta, bekleyen.plan)
    } catch (e) {
      // Kalan kayit 24 saatte kendiliginden dusuyor; hesap zaten acildi.
      console.error('bekleyen kayit silinemedi', e && e.message)
    }
    return { durum: acilan.yeni ? 'acildi' : 'zaten', nasil }
  } catch (e) {
    console.error('hesap acilamadi', kayitIcin(referans), e && e.message)
    try {
      await yetimYaz(referans || `acilamadi-${Date.now()}`, {
        referans,
        konusmaKimligi: bekleyen.konusmaKimligi,
        eposta: bekleyen.eposta,
        plan: bekleyen.plan,
        hata: kayitIcin(e && e.message),
      })
    } catch (e2) {
      console.error('yetim kayit yazilamadi', e2 && e2.message)
      return { durum: 'kayitsiz' }
    }
    return { durum: 'yetim' }
  }
}

// Panelin dolunay.ai altindaki adresi HENUZ KARARLASMADI. Adres ortam
// degiskeninden gelir; tanimli degilse baglanti hic cizilmez. Olmayan bir
// adrese buton koymak musteriyi bos sayfaya gonderir. Yalniz https kabul
// edilir: yanlis doldurulmus bir degisken musteriyi sifresiyle birlikte
// sifresiz bir adrese yollamasin.
function panelAdresi () {
  const ham = String(process.env.PANEL_URL || '').trim()
  if (!ham) return ''
  try {
    const u = new URL(ham)
    return u.protocol === 'https:' ? u.toString() : ''
  } catch {
    return ''
  }
}

exports.handler = async (event) => {
  const token = tokenBul(event)
  if (!token) {
    return ciz(400, 'İşlem bulunamadı', 'uyari',
      'Ödeme bilgisi alınamadı. Size iletilen bağlantıdan tekrar deneyin.')
  }

  let cevap
  try {
    cevap = await formSonuc(token)
  } catch (e) {
    return ciz(502, 'Sonuç doğrulanamadı', 'uyari',
      'Ödemeniz alınmış olabilir ama şu an teyit edemedik. Aynı ödemeyi tekrar denemeyin; dolunay@dolunay.ai adresine yazın, durumu kontrol edip size dönelim.')
  }

  const veri = cevap && cevap.data ? cevap.data : cevap || {}

  // Belirsizlik cevabi TEK yerde durur: iki ayri dal ayni cumleyi uretmek zorunda,
  // yoksa biri zamanla "tahsilat yapilmadi" tarafina kayar.
  const belirsiz = () => ciz(502, 'Sonuç teyit edilemedi', 'uyari',
    'Ödemenizin sonucunu şu an teyit edemedik. Karttan tahsilat yapılmış olabilir. Aynı ödemeyi tekrar denemeden bize yazın, durumu kontrol edip size dönelim.',
    `<div class="kart">
       <p class="etiket">Ne yapabilirsiniz</p>
       <ul>
         <li>Aynı ödemeyi TEKRAR denemeyin; çift tahsilat oluşabilir.</li>
         <li>dolunay@dolunay.ai adresine yazın; aboneliğinizin durumunu kontrol edip size dönelim.</li>
       </ul>
     </div>`)

  // Timeout, ag ya da sunucu hatasi bir RET degildir: tahsilat yapilmis olabilir.
  // Bu dalda "tahsilat yapilmadi" demek musteriye yanlis bilgi verir.
  if (!cevap || cevap.hataTipi) {
    console.error('iyzico sonuc teyit edilemedi', cevap && cevap.hataTipi)
    return belirsiz()
  }

  if (cevap && cevap.status === 'success') {
    // `status:'success'` yalnizca SORGUNUN dondugunu soyler, aboneligin basladigini
    // degil. Kayitta `subscriptionStatus` alani var (canlida olculdu: ACTIVE / CANCELED).
    // Saglayici ACTIVE DISINDA bir sey diyorsa "aboneliginiz aktif edildi" demek
    // kanitsiz bir guvence olur. Alan hic gelmediyse davranis degismez; yalnizca
    // saglayicinin ACIKCA aksini soyledigi hal belirsizlige dusurulur.
    // Alanin HIC OLMAMASI ile alanin OKUNAMAMASI ayni sey degildir. `null`, `0`,
    // `false`, `''` ya da `[]` gelirse saglayici bir sey soylemeye calisiyor ama
    // biz anlamiyoruz demektir; bunu "alan yok" sayip onay vermek kanitsiz guvence olur.
    const hamDurum = veri ? veri.subscriptionStatus : undefined
    const durum = typeof hamDurum === 'string' ? hamDurum.trim().toUpperCase() : ''
    if (hamDurum !== undefined && durum === '') {
      console.error('iyzico abonelik durumu okunamadi', typeof hamDurum)
      return belirsiz()
    }
    if (durum && durum !== 'ACTIVE') {
      console.error('iyzico abonelik ACTIVE degil', durum)
      return belirsiz()
    }
    const ref = veri.referenceCode || veri.subscriptionReferenceCode || ''

    // Hesap kurulumu odemenin sonucunu DEGISTIRMEZ. Depo kapaliysa, sekil
    // tanimadigimiz bir sey cikarsa ya da kayit bulunamazsa bile musteri
    // "aboneliginiz basladi" gorur; parasi alindi, kurulum bizim isimiz.
    let kurulum = { durum: 'kapali' }
    try {
      kurulum = await hesabiKur(cevap, veri, token)
    } catch (e) {
      console.error('hesap kurulumu basarisiz', e && e.message)
      kurulum = { durum: 'kayitsiz' }
    }

    const hesapVar = kurulum.durum === 'acildi' || kurulum.durum === 'zaten'
    const panel = hesapVar ? panelAdresi() : ''
    return ciz(200, 'Aboneliğiniz başladı', 'iyi',
      'Ödemeniz alındı ve aboneliğiniz aktif edildi.',
      `<div class="kart">
         <p class="etiket">Sırada ne var</p>
         <ul>
           <li>Aboneliğinizle ilgili her konuda size bu e-posta adresinden yazacağız.</li>
           <li>Bir sonraki tahsilat, gelecek ayın aynı gününde otomatik yapılır.</li>
           <li>Aboneliği durdurmak istediğinizde bize yazmanız yeterli.</li>
           ${hesapVar
             ? '<li>Panel hesabınız hazır; giriş için formda belirlediğiniz şifreyi kullanacaksınız.</li>'
             : '<li>Kurulumunuzu tamamlayıp giriş bilgilerinizi e-posta ile göndereceğiz.</li>'}
         </ul>
         ${panel ? `<p class="ipucu"><a href="${kacir(panel)}">Panele giriş yapın</a></p>` : ''}
         ${ref ? `<p class="ipucu">Abonelik numaranız: ${kacir(ref)}</p>` : ''}
       </div>`)
  }

  // KESIN ret yalnizca `status:'failure'` ile gelir. Tanimadigimiz bir govde
  // (bos nesne, dizi, `pending` gibi ara durum) ret DEGILDIR; tahsilat yapilmis
  // olabilir. Burada "tahsilat yapilmadi" demek yanlis guvence olur.
  if (cevap.status !== 'failure') {
    console.error('iyzico sonuc anlasilamadi', cevap && cevap.status)
    return belirsiz()
  }

  // Saglayicinin ham hata metni musteriye gosterilmez; sunucu kaydinda kalir.
  console.error('iyzico sonuc basarisiz', cevap && cevap.errorCode, kayitIcin(cevap && cevap.errorMessage))
  return ciz(200, 'Ödeme tamamlanmadı', 'uyari',
    'Ödeme tamamlanmadı. Karttan herhangi bir tahsilat yapılmadı.',
    `<div class="kart">
       <p class="etiket">Ne yapabilirsiniz</p>
       <ul>
         <li>Abonelik ödemeleri yalnızca KREDİ KARTI ile alınabiliyor. Banka kartı kabul edilmiyor.</li>
         <li>Bir kredi kartıyla, size iletilen bağlantıdan tekrar deneyebilirsiniz.</li>
         <li>Sorun devam ederse bize yazın, birlikte bakalım.</li>
       </ul>
     </div>`)
}
