// /odeme/<paket> adresini karsilar.
// GET  -> musteri bilgi formunu gosterir.
// POST -> iyzico'dan TAZE odeme formu alir ve sayfaya gomer.
// Token 30 dakikada gecersizlesir, bu yuzden onceden uretilmis sabit bir link
// paylasilamaz; her ziyarette yeniden uretilir.
const { formBaslat, paketBul, abonelikleriTara } = require('../iyzico')
const { kacir, sayfa, html, hataSayfasi, kayitIcin } = require('../sayfa')
const { sifreOzetle, bekleyenYaz, jetonYaz } = require('../hesap')

// Zorunlu metin alanlari. Sira, hata mesajindaki siralamayi da belirler;
// formdaki sirayla ayni tutuldu ki musteri asagi dogru okurken kaybolmasin.
const ALANLAR = [
  ['markaAdi', 'Marka adı'],
  ['eposta', 'E-posta'],
  ['ad', 'Ad'],
  ['soyad', 'Soyad'],
  ['telefon', 'Cep telefonu'],
  ['tckn', 'T.C. kimlik numarası'],
  ['adres', 'Adres'],
  ['ilce', 'İlçe'],
  ['sehir', 'Şehir'],
]

// Zorunlu olmayan metin alanlari. Bos gecilebilir; doluysa dogrulanir.
const ISTEGE_BAGLI = [
  ['webSitesi', 'Web siteniz'],
  ['postaKodu', 'Posta kodu'],
]

// Sifre alanlari AYRI tutulur: kirpilmaz (bastaki/sondaki bosluk musterinin
// sifresinin parcasi olabilir), forma geri BASILMAZ, loglanmaz, iyzico'ya
// gonderilmez. Bu yuzden ALANLAR/ISTEGE_BAGLI donguleriyle islenmezler.
const SIFRE_ALANLARI = ['sifre', 'sifreTekrar']

function govdeCoz(event) {
  let ham = event.body || ''
  if (event.isBase64Encoded) ham = Buffer.from(ham, 'base64').toString('utf-8')
  const p = new URLSearchParams(ham)
  const o = {}
  for (const [k] of ALANLAR) o[k] = (p.get(k) || '').trim()
  for (const [k] of ISTEGE_BAGLI) o[k] = (p.get(k) || '').trim()
  for (const k of SIFRE_ALANLARI) o[k] = p.get(k) || ''
  o.onay = ['on', '1', 'true', 'evet'].includes((p.get('onay') || '').trim().toLowerCase())
  return o
}

// Formun yeniden basildigi her yerde sifreler dusurulur. Tek satirda kalmasi
// icin: "hangi degerler geri gosterilebilir" sorusunun tek cevabi burasi.
function gosterilebilir(v) {
  const o = Object.assign({}, v)
  for (const k of SIFRE_ALANLARI) delete o[k]
  return o
}

// Alan uzunluklari: cok uzun degerin iyzico'nun ham hatasina donmesindense
// burada anlasilir sekilde durmasi icin.
// Sifre ust siniri scrypt maliyetini sinirlamak icin de var: cok uzun girdi
// fonksiyonu mesgul etmesin.
const UZUNLUK = {
  ad: 50, soyad: 50, eposta: 100, sehir: 50, adres: 200, telefon: 20, tckn: 11,
  markaAdi: 80, ilce: 50, webSitesi: 200, postaKodu: 5, sifre: 200,
}

const SIFRE_EN_AZ = 8

function telefonDuzelt(ham) {
  const d = String(ham).replace(/\D/g, '')
  if (d.length === 10 && d[0] === '5') return '+90' + d
  if (d.length === 11 && d.startsWith('05')) return '+90' + d.slice(1)
  if (d.length === 12 && d.startsWith('905')) return '+' + d
  return null
}

// TC kimlik dogrulama hanesi. Yazim hatasi iyzico'ya gitmeden burada durur.
// 99 ile baslayan yabanci kimlik numaralari bu hesabi saglamaz, muaf tutulur.
// Bir kaydin butun metin yapraklarini kucuk harfe indirip kume olarak dondurur.
// Karsilastirma alan adindan bagimsiz ama TAM esitlik uzerinden yapilir.
function yapraklar(kok) {
  const kume = new Set()
  const yigin = [kok]
  let adim = 0
  while (yigin.length && adim < 5000) {
    adim += 1
    const d = yigin.pop()
    if (typeof d === 'string') kume.add(d.trim().toLowerCase())
    else if (Array.isArray(d)) for (const x of d) yigin.push(x)
    else if (d && typeof d === 'object') for (const k of Object.keys(d)) yigin.push(d[k])
  }
  return kume
}

function tcknGecerli(ham) {
  if (!/^[1-9][0-9]{10}$/.test(ham)) return false
  if (ham.startsWith('99')) return true
  const d = ham.split('').map(Number)
  const tek = d[0] + d[2] + d[4] + d[6] + d[8]
  const cift = d[1] + d[3] + d[5] + d[7]
  if ((tek * 7 - cift + 100) % 10 !== d[9]) return false
  const ilkOn = d.slice(0, 10).reduce((a, b) => a + b, 0)
  return ilkOn % 10 === d[10]
}

// Web sitesi zorunlu degil ama girildiyse otomasyonun yaziyi nereye
// gonderecegini belirleyecek. Sema yalnizca http/https; javascript: ve data:
// gibi semalarin kayda girmesi istenmiyor.
function siteDuzelt(ham) {
  const s = String(ham || '').trim()
  if (!s) return ''
  const aday = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(s) ? s : 'https://' + s
  let u
  try {
    u = new URL(aday)
  } catch {
    return null
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
  if (!u.hostname.includes('.')) return null
  return u.toString()
}

function dogrula(v) {
  const eksik = ALANLAR.filter(([k]) => !v[k]).map(([, ad]) => ad)
  if (eksik.length) return 'Şu alanları doldurun: ' + eksik.join(', ') + '.'
  const uzun = ALANLAR.concat(ISTEGE_BAGLI).find(([k]) => v[k].length > (UZUNLUK[k] || 200))
  if (uzun) return `${uzun[1]} alanı çok uzun, en fazla ${UZUNLUK[uzun[0]]} karakter olabilir.`
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.eposta)) return 'E-posta adresi geçerli görünmüyor.'
  if (!telefonDuzelt(v.telefon)) return 'Cep telefonu numaranızı 05XX XXX XX XX biçiminde yazın.'
  if (!/^[1-9][0-9]{10}$/.test(v.tckn)) return 'T.C. kimlik numarası 11 haneli olmalı.'
  if (!tcknGecerli(v.tckn)) return 'T.C. kimlik numaranızı kontrol edin, hatalı görünüyor.'
  if (siteDuzelt(v.webSitesi) === null) return 'Web sitesi adresini https://siteniz.com biçiminde yazın.'
  if (v.postaKodu && !/^[0-9]{5}$/.test(v.postaKodu)) return 'Posta kodu 5 haneli olmalı.'

  // Sifre kontrolleri: mesaj hicbir zaman girilen degeri icermez.
  if (!v.sifre) return 'Panele girmek için bir şifre belirleyin.'
  if (v.sifre.length < SIFRE_EN_AZ) return `Şifre en az ${SIFRE_EN_AZ} karakter olmalı.`
  if (v.sifre.length > UZUNLUK.sifre) return `Şifre en fazla ${UZUNLUK.sifre} karakter olabilir.`
  if (v.sifre !== v.sifreTekrar) return 'İki şifre birbirini tutmuyor.'

  if (!v.onay) return 'Devam etmek için abonelik koşullarını onaylamanız gerekiyor.'
  return null
}

function formSayfasi(slug, paket, deger, hata) {
  // Sifreler burada dusurulur, cagiran yerlerde degil. Form sekiz ayri yerden
  // yeniden ciziliyor; suzgeci tek noktada tutmak, bir cagri yerinde unutulup
  // sifrenin HTML'e geri yazilmasini imkansiz kilar.
  const d = gosterilebilir(deger || {})
  const alan = (ad, etiket, tip, ipucu, zorunlu = true) => `
    <div class="satir">
      <label for="${ad}">${kacir(etiket)}</label>
      <input id="${ad}" name="${ad}" type="${tip}" value="${kacir(d[ad] || '')}" maxlength="${UZUNLUK[ad] || 200}"${zorunlu ? ' required' : ''}>
      ${ipucu ? `<p class="ipucu">${kacir(ipucu)}</p>` : ''}
    </div>`

  // Sifre alanlari ayri yardimci: `value` HIC basilmaz. Dogrulama hatasinda
  // form yeniden ciziliyor; girilen sifrenin HTML'e geri yazilmasi onu tarayici
  // gecmisine ve ara belleklere dusurur. Musteri iki kutuyu tekrar doldurur.
  const sifreAlani = (ad, etiket, ipucu) => `
    <div class="satir">
      <label for="${ad}">${kacir(etiket)}</label>
      <input id="${ad}" name="${ad}" type="password" maxlength="${UZUNLUK.sifre}" minlength="${SIFRE_EN_AZ}" autocomplete="new-password" required>
      ${ipucu ? `<p class="ipucu">${kacir(ipucu)}</p>` : ''}
    </div>`

  const kapsam = Array.isArray(paket.kapsam) && paket.kapsam.length
    ? `<ul>${paket.kapsam.map((m) => `<li>${kacir(m)}</li>`).join('')}</ul>`
    : ''

  return sayfa({
    baslik: 'Abonelik başlat',
    govde: `
      <span class="rozet">Abonelik</span>
      <h1>${kacir(paket.ad || 'Yönetilen otomasyon')}</h1>
      <p class="alt">Aylık aboneliği başlatmak için bilgilerinizi girin.</p>

      ${hata ? `<div class="uyari">${kacir(hata)}</div>` : ''}

      <div class="kart vurgu">
        <p class="etiket">Aylık bedel</p>
        <p class="bedel">${kacir(paket.tutar || '')} <span>/ ${kacir(paket.periyot || 'ay')}</span></p>
        ${paket.notu ? `<p class="ipucu">${kacir(paket.notu)}</p>` : ''}
        ${kapsam}
      </div>

      <form class="kform" method="POST" action="/odeme/${encodeURIComponent(slug)}">
        <div class="kart">
          <p class="etiket">Hesap</p>
          <div class="ikili">
            ${alan('markaAdi', 'Marka adı', 'text', 'Blogunuzda görünecek isim.')}
            ${alan('webSitesi', 'Web siteniz', 'url', 'Varsa yazın; yazılar buraya gönderilecek.', false)}
          </div>
          ${alan('eposta', 'E-posta', 'email', 'Hem aboneliğinizle ilgili yazışmalar hem panel girişi için bu adresi kullanacağız.')}
          <div class="ikili">
            ${sifreAlani('sifre', 'Şifre', `Panele bu şifreyle gireceksiniz. En az ${SIFRE_EN_AZ} karakter.`)}
            ${sifreAlani('sifreTekrar', 'Şifre (tekrar)')}
          </div>
        </div>

        <div class="kart">
          <p class="etiket">Fatura bilgileri</p>
          <div class="ikili">
            ${alan('ad', 'Ad', 'text')}
            ${alan('soyad', 'Soyad', 'text')}
          </div>
          <div class="ikili">
            ${alan('telefon', 'Cep telefonu', 'tel', '05XX XXX XX XX')}
            ${alan('tckn', 'T.C. kimlik numarası', 'text', 'Ödeme kuruluşu abonelik için zorunlu tutuyor.')}
          </div>
          <div class="satir">
            <label for="adres">Fatura adresi</label>
            <textarea id="adres" name="adres" maxlength="${UZUNLUK.adres}" required>${kacir(d.adres || '')}</textarea>
          </div>
          <div class="ikili">
            ${alan('ilce', 'İlçe', 'text')}
            ${alan('sehir', 'Şehir', 'text')}
          </div>
          ${alan('postaKodu', 'Posta kodu', 'text', 'İsteğe bağlı.', false)}

          <!-- Onay metni yalnizca SITEDE GERCEKTEN VAR OLAN belgelere baglanir.
               Genel bir Gizlilik Politikasi ve Kullanim Kosullari sayfasi yok;
               /sozlesmeler altindaki gizlilik ve kosullar sayfalari kapatilmis
               Artifex urunune ait. Olmayan sayfaya baglanan onay kutusu, alicinin
               okumadigi belgeyi kabul ettirmis olur. O iki belge yazildiginda
               buraya eklenecek. -->
          <label class="onay">
            <input type="checkbox" name="onay" ${d.onay ? 'checked' : ''} required>
            <span><a href="/sozlesmeler/mesafeli-satis" target="_blank">Mesafeli Satış Sözleşmesi</a>&apos;ni
            ve <a href="/sozlesmeler/kvkk" target="_blank">KVKK Aydınlatma Metni</a>&apos;ni okudum;
            aylık olarak kartımdan otomatik tahsilat yapılmasını kabul ediyorum.</span>
          </label>

          <p class="kartuyari">Ödeme yalnızca KREDİ KARTI ile alınabilir. Banka kartı abonelikte kabul edilmiyor.</p>
          <button type="submit">Kart bilgilerine geç</button>
        </div>
      </form>

      <p class="dip">Ödeme iyzico altyapısı üzerinden alınır. Kart bilgileriniz bize ulaşmaz.</p>`,
  })
}

// Paket adi once adres yolundan okunur. Netlify yeniden yazma kuralinda hedefe
// yazilan query fonksiyona gecmiyor (canlida olculdu); orijinal yol event.path'te
// durur. Bozuk yuzde-kodlama decodeURIComponent'i firlatir, ham deger kullanilir.
function paketSlug(event) {
  const yol = event.path || event.rawUrl || ''
  // Desen basa sabitli: /x/odeme/a gibi bir yol paket adi uretmemeli.
  const m = yol.match(/^\/odeme\/([^/?#]+)/)
  if (m) {
    let ad
    try {
      ad = decodeURIComponent(m[1])
    } catch {
      ad = m[1]
    }
    // Istisna COZULMUS deger uzerinde bakilir; /odeme/%73onuc de 'sonuc' demektir.
    if (ad !== 'sonuc') return ad
  }
  const q = (event.queryStringParameters && event.queryStringParameters.paket) || ''
  return q.trim()
}

exports.handler = async (event) => {
  const slug = paketSlug(event)
  const paket = paketBul(slug)

  if (!paket || !paket.plan) {
    return hataSayfasi(404, 'Sayfa bulunamadı', 'Bu abonelik bağlantısı bulunamadı. Lütfen size iletilen bağlantıyı kontrol edin.')
  }

  if (event.httpMethod !== 'POST') {
    return html(200, formSayfasi(slug, paket, null, null))
  }

  const v = govdeCoz(event)
  const hata = dogrula(v)
  if (hata) return html(400, formSayfasi(slug, paket, v, hata))

  const adres = {
    contactName: `${v.ad} ${v.soyad}`,
    city: v.sehir,
    country: 'Turkey',
    address: v.adres,
  }

  // Musteri odemeyi tamamladiktan sonra geri gelip formu tekrar doldurursa
  // ikinci bir abonelik acilir ve karttan iki kez cekilir. iyzico'daki kayit
  // tek gercektir; form uretilmeden once oraya bakilir.
  // Kapi bilerek FAIL-CLOSED: tarama tamamlanamazsa ya da bu musteriye ait bir
  // kaydin durumu okunamazsa odeme BASLATILMAZ (503). Bu yorum eskiden
  // "fail-open" diyordu ve koda ters dusmustu; okuyan biri kodu yoruma
  // uydurmaya kalkarsa mukerrer tahsilat kapisi yeniden acilir.
  // Gerekce: kacan bir satis, ikinci kez cekilen paradan iyidir.
  // Bos liste (`items: []`) belirsizlik DEGILDIR; ilk kez satin alan musteri
  // burada takilmaz.
  try {
    const epostaKucuk = v.eposta.toLowerCase()
    const planKucuk = String(paket.plan).toLowerCase()
    // Bu musteriye ve bu pakete ait olup DURUMU okunamayan bir kayit gorursek,
    // "eslesmedi" diyemeyiz. Bayrak disarida durur cunku tarama geri donduginde
    // hukum verilecek yer burasidir.
    let okunamayanKayit = false
    const varOlan = await abonelikleriTara((kayit) => {
      // Alt dize araması yanlış pozitif üretir (bir e-posta baska bir alanin
      // icinde gecebilir). Bu yuzden yalnizca TAM esitlik sayilir: kaydin
      // metin yapraklarindan biri e-postanin, bir baskasi plan kodunun aynisi
      // olmali. Yanlis "zaten aboneligin var" ekrani odemeyi bloklar, o yuzden
      // olcut bilerek dar tutuldu.
      const bizim = yapraklar(kayit).has(epostaKucuk) && yapraklar(kayit).has(planKucuk)
      const durum = kayit && typeof kayit.subscriptionStatus === 'string'
        ? kayit.subscriptionStatus.toUpperCase() : null
      if (durum === null) {
        // Durum alani okunamiyor. Bu "abonelik degil" DEGIL, "bilmiyorum"dur.
        // Yalniz kayit gercekten bu musteriye ve bu pakete aitse anlamli;
        // baskasinin bozuk kaydi bu musterinin odemesini bloklamamali.
        if (bizim) okunamayanKayit = true
        return false
      }
      if (durum !== 'ACTIVE') return false
      return bizim
    })
    if (varOlan) {
      return html(409, formSayfasi(slug, paket, v, 'Bu e-posta için bu pakette zaten aktif bir abonelik var. İkinci kez tahsilat olmaması için yeni ödeme başlatılmadı. Sorunuz varsa dolunay@dolunay.ai adresine yazın.'))
    }
    // `null` = tarama tamamlanamadi, yani mevcut bir abonelik OLMADIGINI bilmiyoruz.
    // Eskiden bu durum sessizce yutulup odeme aciliyordu; belirsiz sonuc ekranini gorup
    // formu tekrar gonderen musteride ikinci tahsilat riski buradan doguyordu.
    // Bilinmeyeni "yok" saymak yerine duruyoruz: kacan bir satis, mukerrer tahsilattan iyidir.
    if (okunamayanKayit) {
      return html(503, formSayfasi(slug, paket, v, 'Mevcut aboneliğiniz olup olmadığını şu an doğrulayamıyoruz. İkinci kez tahsilat olmaması için ödeme başlatılmadı. Birkaç dakika sonra tekrar deneyin.'))
    }
    if (varOlan === null) {
      return html(503, formSayfasi(slug, paket, v, 'Mevcut aboneliğiniz olup olmadığını şu an doğrulayamıyoruz. İkinci kez tahsilat olmaması için ödeme başlatılmadı. Birkaç dakika sonra tekrar deneyin.'))
    }
  } catch (e) {
    console.error('mukerrer taramasi hata verdi', e && e.message)
    return html(503, formSayfasi(slug, paket, v, 'Mevcut aboneliğiniz olup olmadığını şu an doğrulayamıyoruz. İkinci kez tahsilat olmaması için ödeme başlatılmadı. Birkaç dakika sonra tekrar deneyin.'))
  }

  // Hesap odeme aninda ACILMAZ; odemenin alindigi ancak iyzico donusunde belli
  // olur. Musterinin hesap bilgileri burada "bekleyen kayit" olarak saklanir,
  // hesap abonelik-sonuc'ta ACTIVE dogrulandiktan sonra bu kayittan acilir.
  //
  // Sira onemli: kayit iyzico'dan ONCE yazilir. Kapi bilerek FAIL-CLOSED --
  // kayit yazilamazsa odeme HIC baslatilmaz. Tersi, parasi alinmis ama hesabi
  // acilamayan musteri demek olurdu; mukerrer tahsilat kapisiyla ayni gerekce.
  const konusmaKimligi = `${slug}-${Date.now()}`
  try {
    const sifreOzeti = await sifreOzetle(v.sifre)
    await bekleyenYaz({
      eposta: v.eposta,
      plan: paket.plan,
      slug,
      konusmaKimligi,
      sifreOzeti,
      markaAdi: v.markaAdi,
      webSitesi: siteDuzelt(v.webSitesi),
      ad: v.ad,
      soyad: v.soyad,
      telefon: telefonDuzelt(v.telefon),
      tckn: v.tckn,
      adres: v.adres,
      ilce: v.ilce,
      sehir: v.sehir,
      postaKodu: v.postaKodu,
    })
  } catch (e) {
    // Hata metni kayda gider, musteriye gosterilmez. `v` LOGLANMAZ: icinde
    // sifre var.
    console.error('bekleyen kayit yazilamadi', e && e.message)
    return html(503, formSayfasi(slug, paket, v, 'Hesabınız hazırlanamadı, bu yüzden ödeme başlatılmadı. Kartınızdan tahsilat YAPILMADI. Birkaç dakika sonra tekrar deneyin.'))
  }

  let cevap
  try {
    cevap = await formBaslat({
      locale: 'tr',
      conversationId: konusmaKimligi,
      // Host basligi istemciden gelir, guvenilmez. Netlify'in kendi verdigi
      // site adresi kullanilir; o da yoksa kanonik alan adi.
      callbackUrl: `${(process.env.URL || 'https://dolunay.ai').replace(/\/+$/, '')}/odeme/sonuc`,
      pricingPlanReferenceCode: paket.plan,
      subscriptionInitialStatus: 'ACTIVE',
      customer: {
        name: v.ad,
        surname: v.soyad,
        identityNumber: v.tckn,
        email: v.eposta,
        gsmNumber: telefonDuzelt(v.telefon),
        billingAddress: adres,
        shippingAddress: adres,
      },
    })
  } catch (e) {
    console.error('iyzico initialize firlatti', e && e.message)
    return html(500, formSayfasi(slug, paket, v, 'Ödeme sayfası şu an açılamadı. Kartınızdan tahsilat YAPILMADI. Birazdan tekrar deneyin.'))
  }

  // iyzico'ya hic ulasilamadiysa bu bir ret degil belirsizliktir; kart hic denenmedi.
  if (!cevap || cevap.hataTipi) {
    console.error('iyzico initialize ulasilamadi', cevap && cevap.hataTipi)
    return html(503, formSayfasi(slug, paket, v, 'Ödeme hizmetine şu an ulaşılamıyor. Kartınızdan tahsilat YAPILMADI. Birkaç dakika sonra tekrar deneyin.'))
  }

  // `checkoutFormContent` bos nesne ya da dizi olarak gelirse JS'te DOGRUDUR ve
  // eski kontrolden gecerdi; musteri kart adimini gorur ama icinde kullanilabilir
  // form olmazdi. Metin olmasi ve bos olmamasi sart.
  const formIcerik = typeof cevap.checkoutFormContent === 'string'
    ? cevap.checkoutFormContent.trim() : ''
  if (cevap.status !== 'success' || !formIcerik) {
    // Saglayicinin ham hata metni musteriye gosterilmez; sunucu kaydinda kalir.
    console.error('iyzico initialize hatasi', cevap && cevap.errorCode, kayitIcin(cevap && cevap.errorMessage))
    return html(400, formSayfasi(slug, paket, v, 'Ödeme sayfası açılamadı. Bilgileri kontrol edip tekrar deneyin; sorun sürerse dolunay@dolunay.ai adresine yazın.'))
  }

  // Jeton isaretcisi: callback'te bekleyen kaydi kesin olarak bulmak icin.
  // EN IYI CABA -- yazilamazsa odeme aksamaz, musteri kart adimini yine gorur;
  // eslestirme o zaman konusma kimligine ve e-posta + plana duser. Bu yuzden
  // bekleyen kayittaki fail-closed kurali BURADA gecerli degil: form zaten
  // uretildi, musteriyi geri cevirmek kazandirmaz.
  const jeton = cevap.token || (cevap.data && cevap.data.token) || ''
  if (jeton) {
    try {
      await jetonYaz(jeton, { eposta: v.eposta, plan: paket.plan, konusmaKimligi })
    } catch (e) {
      console.error('jeton isaretcisi yazilamadi', e && e.message)
    }
  }

  return html(200, sayfa({
    baslik: 'Kart bilgileri',
    govde: `
      <span class="rozet">Abonelik</span>
      <h1>Kart bilgileri</h1>
      <p class="alt">${kacir(paket.ad || '')} &middot; ${kacir(paket.tutar || '')} / ${kacir(paket.periyot || 'ay')}</p>
      <p class="kartuyari">Yalnızca KREDİ KARTI kabul ediliyor. Banka kartı ile ödeme tamamlanmaz.</p>
      <div class="kart">
        <div id="iyzipay-checkout-form" class="responsive"></div>
      </div>
      ${formIcerik}
      <p class="dip">Bu sayfa 30 dakika geçerlidir. Süresi dolarsa sayfayı yenileyin.</p>`,
  }))
}
