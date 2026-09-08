// iyzico IYZWSv2 imzali istek katmani.
// Anahtarlar KODA YAZILMAZ; Netlify ortam degiskenlerinden okunur.
const crypto = require('crypto')

const BASE = (process.env.IYZICO_BASE_URL || 'https://api.iyzipay.com').replace(/\/+$/, '')

function anahtarlar() {
  const apiKey = process.env.IYZICO_API_KEY || ''
  const secretKey = process.env.IYZICO_SECRET_KEY || ''
  if (!apiKey || !secretKey) throw new Error('IYZICO_API_KEY / IYZICO_SECRET_KEY tanimli degil')
  return { apiKey, secretKey }
}

// Imza, GONDERILEN govdenin birebir ayni metni uzerinden hesaplanir.
// Govde yeniden serilestirilirse imza tutmaz.
function yetki(uriPath, bodyStr) {
  const { apiKey, secretKey } = anahtarlar()
  const rnd = String(Date.now()) + crypto.randomBytes(6).toString('hex')
  const imza = crypto.createHmac('sha256', secretKey).update(rnd + uriPath + bodyStr).digest('hex')
  const params = `apiKey:${apiKey}&randomKey:${rnd}&signature:${imza}`
  return { auth: 'IYZWSv2 ' + Buffer.from(params).toString('base64'), rnd }
}

// imzaYolu verilmezse uriPath imzalanir. iyzico sorgu dizesini IMZAYA KATMAZ;
// query'li adreslerde adres query'li, imza query'siz yol ile kurulur (canlida olculdu).
// Cevapsiz kalan istek fonksiyonu suresiz asili birakirdi; 20 saniyede kesilir.
// `hataTipi` alani cagirana "bu bir ret degil, belirsizlik" demek icin vardir:
// `baglanti` = istek gitmedi ya da cevap gelmedi, `sunucu` = HTTP 5xx / JSON olmayan cevap.
// JSON donen 4xx iyzico'nun KENDI hata govdesidir, oldugu gibi gecirilir.
async function istek(method, uriPath, body, imzaYolu) {
  const bodyStr = body === undefined ? '' : JSON.stringify(body)
  const { auth, rnd } = yetki(imzaYolu === undefined ? uriPath : imzaYolu, bodyStr)
  const kesici = new AbortController()
  const zamanlayici = setTimeout(() => kesici.abort(), 20000)
  try {
    const cevap = await fetch(BASE + uriPath, {
      method,
      signal: kesici.signal,
      headers: {
        Authorization: auth,
        'x-iyzi-rnd': rnd,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: bodyStr === '' ? undefined : bodyStr,
    })
    let ham
    try {
      ham = await cevap.text()
    } catch {
      // Govde okunamadi ama HTTP cevabi geldi: bu bir ag kopmasi degil sunucu sorunudur.
      return { status: 'failure', hataTipi: 'sunucu' }
    }
    let veri
    try { veri = JSON.parse(ham) } catch { return { status: 'failure', hataTipi: 'sunucu' } }
    // iyzico is kurali reddini (kart reddi, gecersiz plan) HTTP 200 + `status:'failure'`
    // ile bildirir. Bu yuzden 2xx DISINDAKI her kod -401, 403, 404, 429, 5xx, 3xx dahil-
    // bizim tarafimizdan ALTYAPI sorunudur ve "kesin ret" sayilamaz. Kesin ret sanmak,
    // tahsilat belirsizken musteriye "karttan para cekilmedi" demek olurdu.
    // Saglayicinin hata govdesi kaydi icin korunur, uzerine yalnizca isaret eklenir.
    if (!cevap.ok) {
      return Object.assign({}, veri, { status: 'failure', hataTipi: 'sunucu', httpDurum: cevap.status })
    }
    return veri
  } catch (e) {
    // Beklenmeyen programlama hatasi da buraya duser; sessizce yutulmasin diye kaydedilir.
    console.error('iyzico istek hatasi', uriPath, e && e.name, e && e.message)
    return { status: 'failure', hataTipi: 'baglanti' }
  } finally {
    clearTimeout(zamanlayici)
  }
}

// Abonelik odeme formu baslatir. Donen token 30 dakika gecerlidir; bu yuzden
// sabit bir link uretilemez, her ziyarette yeniden alinir.
function formBaslat(veri) {
  return istek('POST', '/v2/subscription/checkoutform/initialize', veri)
}

// Odeme formu sonucu. GET, govdesiz.
function formSonuc(token) {
  return istek('GET', `/v2/subscription/checkoutform/${encodeURIComponent(token)}`, undefined)
}

// Paket katalogu de ortam degiskeninde durur: depo herkese acik oldugu icin
// musteri adi, bedel ve plan kodu depoya yazilmaz.
function paketler() {
  try { return JSON.parse(process.env.IYZICO_PAKETLER || '{}') } catch { return {} }
}

function paketBul(slug) {
  const p = paketler()
  return p && Object.prototype.hasOwnProperty.call(p, slug) ? p[slug] : null
}

// Ayni paket icin ayni musteriye ikinci abonelik acilmasini onlemek uzere
// iyzico'daki mevcut abonelikleri okur. Sayfalama tavani bilerek dusuk:
// bu bir raporlama degil, tekil bir mukerrer kontrolu.
async function abonelikleriTara(bak, sayfaTavani = 20) {
  const YOL = '/v2/subscription/subscriptions'
  let gorulen = 0
  for (let sayfa = 1; sayfa <= sayfaTavani; sayfa += 1) {
    const cevap = await istek('GET', `${YOL}?page=${sayfa}&count=100`, undefined, YOL)
    if (!cevap || cevap.status !== 'success') return null
    const govde = cevap.data && typeof cevap.data === 'object' ? cevap.data : cevap
    // Canlida olculdu (2026-09-07): iyzico bos sayfada BILE `items` alanini dizi
    // olarak doner (sayfa 99 -> totalCount 1, items []). Yani dizi olmayan bir
    // `items` "abonelik yok" demek DEGILDIR, okuyamadigimiz bir cevaptir. Onu bos
    // dizi sayip gecmek, mevcut aboneligi hic gormeden ikinci tahsilat acardi.
    const kayitlar = govde.items
    if (!Array.isArray(kayitlar)) return null
    for (const kayit of kayitlar) if (bak(kayit)) return kayit
    gorulen += kayitlar.length
    if (kayitlar.length < 100) {
      // Kisa sayfa normalde "liste bitti" demektir. Ama saglayici toplam sayiyi
      // bildiriyorsa ve biz o kadar kaydi GORMEDIYSEK liste bitmemistir. Bunu
      // "abonelik yok" saymak, mevcut aboneligi gormeden ikinci tahsilat acardi.
      const toplam = typeof govde.totalCount === 'number' ? govde.totalCount : null
      if (toplam !== null && gorulen < toplam) return null
      return false
    }
  }
  // Tavana dayanildi: son sayfaya ulasilamadi, yani "yok" DIYEMEYIZ.
  // `null` = bilinmiyor; cagiran bunu bir izin degil bir durak olarak okur.
  return null
}

function tekSeferBaslat (veri) {
  return istek('POST', '/payment/iyzipos/checkoutform/initialize/auth/ecom', veri)
}

function tekSeferSonuc (token) {
  return istek('POST', '/payment/iyzipos/checkoutform/auth/ecom/detail', { locale: 'tr', token })
}

module.exports = { formBaslat, formSonuc, paketBul, abonelikleriTara, tekSeferBaslat, tekSeferSonuc }
