// /odeme/<paket> adresini karsilar.
// GET  -> musteri bilgi formunu gosterir.
// POST -> iyzico'dan TAZE odeme formu alir ve sayfaya gomer.
// Token 30 dakikada gecersizlesir, bu yuzden onceden uretilmis sabit bir link
// paylasilamaz; her ziyarette yeniden uretilir.
const { formBaslat, paketBul } = require('../lib/iyzico')
const { kacir, sayfa, html, hataSayfasi } = require('../lib/sayfa')

const ALANLAR = [
  ['ad', 'Ad'],
  ['soyad', 'Soyad'],
  ['eposta', 'E-posta'],
  ['telefon', 'Cep telefonu'],
  ['tckn', 'TC kimlik numarasi'],
  ['sehir', 'Sehir'],
  ['adres', 'Adres'],
]

function govdeCoz(event) {
  let ham = event.body || ''
  if (event.isBase64Encoded) ham = Buffer.from(ham, 'base64').toString('utf-8')
  const p = new URLSearchParams(ham)
  const o = {}
  for (const [k] of ALANLAR) o[k] = (p.get(k) || '').trim()
  o.onay = p.get('onay') === 'on'
  return o
}

function telefonDuzelt(ham) {
  const d = String(ham).replace(/\D/g, '')
  if (d.length === 10 && d[0] === '5') return '+90' + d
  if (d.length === 11 && d[0] === '0') return '+90' + d.slice(1)
  if (d.length === 12 && d.startsWith('90')) return '+' + d
  return null
}

function dogrula(v) {
  const eksik = ALANLAR.filter(([k]) => !v[k]).map(([, ad]) => ad)
  if (eksik.length) return 'Su alanlari doldurun: ' + eksik.join(', ') + '.'
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.eposta)) return 'E-posta adresi gecerli gorunmuyor.'
  if (!telefonDuzelt(v.telefon)) return 'Cep telefonunu 05XX XXX XX XX bicminde yazin.'
  if (!/^[1-9][0-9]{10}$/.test(v.tckn)) return 'TC kimlik numarasi 11 haneli olmali.'
  if (!v.onay) return 'Devam etmek icin abonelik kosullarini onaylamaniz gerekiyor.'
  return null
}

function formSayfasi(slug, paket, deger, hata) {
  const d = deger || {}
  const alan = (ad, etiket, tip, ipucu) => `
    <div class="satir">
      <label for="${ad}">${kacir(etiket)}</label>
      <input id="${ad}" name="${ad}" type="${tip}" value="${kacir(d[ad] || '')}" required>
      ${ipucu ? `<p class="ipucu">${kacir(ipucu)}</p>` : ''}
    </div>`

  const kapsam = Array.isArray(paket.kapsam) && paket.kapsam.length
    ? `<ul>${paket.kapsam.map((m) => `<li>${kacir(m)}</li>`).join('')}</ul>`
    : ''

  return sayfa({
    baslik: 'Abonelik baslat',
    govde: `
      <span class="rozet">Abonelik</span>
      <h1>${kacir(paket.ad || 'Yonetilen otomasyon')}</h1>
      <p class="alt">Aylik aboneligi baslatmak icin bilgilerinizi girin.</p>

      ${hata ? `<div class="uyari">${kacir(hata)}</div>` : ''}

      <div class="kart vurgu">
        <p class="etiket">Aylik bedel</p>
        <p class="bedel">${kacir(paket.tutar || '')} <span>/ ${kacir(paket.periyot || 'ay')}</span></p>
        ${paket.notu ? `<p class="ipucu">${kacir(paket.notu)}</p>` : ''}
        ${kapsam}
      </div>

      <form method="POST" action="/odeme/${encodeURIComponent(slug)}">
        <div class="kart">
          <div class="ikili">
            ${alan('ad', 'Ad', 'text')}
            ${alan('soyad', 'Soyad', 'text')}
          </div>
          ${alan('eposta', 'E-posta', 'email', 'Fatura ve tahsilat bildirimleri bu adrese gider.')}
          <div class="ikili">
            ${alan('telefon', 'Cep telefonu', 'tel', '05XX XXX XX XX')}
            ${alan('tckn', 'TC kimlik numarasi', 'text', 'Odeme kurulusu abonelik icin zorunlu tutuyor.')}
          </div>
          ${alan('sehir', 'Sehir', 'text')}
          <div class="satir">
            <label for="adres">Fatura adresi</label>
            <textarea id="adres" name="adres" required>${kacir(d.adres || '')}</textarea>
          </div>

          <label class="onay">
            <input type="checkbox" name="onay" ${d.onay ? 'checked' : ''} required>
            <span><a href="/sozlesmeler/mesafeli-satis" target="_blank">Mesafeli satis sozlesmesini</a>
            okudum ve aylik olarak kartimdan otomatik tahsilat yapilmasini kabul ediyorum.</span>
          </label>

          <button type="submit">Kart bilgilerine gec</button>
        </div>
      </form>

      <p class="dip">Odeme iyzico altyapisi uzerinden alinir. Kart bilgileriniz bize ulasmaz.</p>`,
  })
}

// Paket adi once adres yolundan okunur. Netlify yeniden yazma kuralinda hedefe
// yazilan query fonksiyona gecmiyor (canlida olculdu); orijinal yol event.path'te
// durur. Bozuk yuzde-kodlama decodeURIComponent'i firlatir, ham deger kullanilir.
function paketSlug(event) {
  const yol = event.path || event.rawUrl || ''
  const m = yol.match(/\/odeme\/([^/?#]+)/)
  if (m && m[1] !== 'sonuc') {
    try {
      return decodeURIComponent(m[1])
    } catch {
      return m[1]
    }
  }
  const q = (event.queryStringParameters && event.queryStringParameters.paket) || ''
  return q.trim()
}

exports.handler = async (event) => {
  const slug = paketSlug(event)
  const paket = paketBul(slug)

  if (!paket || !paket.plan) {
    return hataSayfasi(404, 'Sayfa bulunamadi', 'Bu abonelik adresi tanimli degil. Lutfen size iletilen baglantiyi kontrol edin.')
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

  let cevap
  try {
    cevap = await formBaslat({
      locale: 'tr',
      conversationId: `${slug}-${Date.now()}`,
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
    return html(500, formSayfasi(slug, paket, v, 'Odeme sayfasi su an acilamadi. Birazdan tekrar deneyin.'))
  }

  if (cevap.status !== 'success' || !cevap.checkoutFormContent) {
    return html(400, formSayfasi(slug, paket, v, cevap.errorMessage || 'Odeme sayfasi acilamadi.'))
  }

  return html(200, sayfa({
    baslik: 'Kart bilgileri',
    govde: `
      <span class="rozet">Abonelik</span>
      <h1>Kart bilgileri</h1>
      <p class="alt">${kacir(paket.ad || '')} &middot; ${kacir(paket.tutar || '')} / ${kacir(paket.periyot || 'ay')}</p>
      <div class="kart">
        <div id="iyzipay-checkout-form" class="responsive"></div>
      </div>
      ${cevap.checkoutFormContent}
      <p class="dip">Bu sayfa 30 dakika gecerlidir. Suresi dolarsa sayfayi yenileyin.</p>`,
  }))
}
