const crypto = require('crypto')
const { isIP } = require('net')
const { tekSeferBaslat, paketBul } = require('../lib/iyzico')
const abonelik = require('./abonelik-baslat')
const { kacir, sayfa, html } = require('../lib/sayfa')

const ALANLAR = [['ad','Ad','text',50],['soyad','Soyad','text',50],['eposta','E-posta','email',100],['telefon','Cep telefonu','tel',20],['tckn','T.C. kimlik numarası','text',11],['sehir','Şehir','text',50],['adres','Fatura adresi','text',200]]

function tutarBicim (k) { const n = BigInt(k); return `${n / 100n}.${String(n % 100n).padStart(2, '0')}` }
function tutarGoster (k) { const [t, o] = tutarBicim(k).split('.'); return `${t.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${o}` }
function telefonDuzelt (s) { const d = s.replace(/\D/g, ''); return /^5\d{9}$/.test(d) ? '+90' + d : /^05\d{9}$/.test(d) ? '+9' + d : /^905\d{9}$/.test(d) ? '+' + d : null }
function tcknGecerli (s) { if (!/^[1-9]\d{10}$/.test(s)) return false; if (s.startsWith('99')) return true; const d = [...s].map(Number); return ((d[0]+d[2]+d[4]+d[6]+d[8])*7-d[1]-d[3]-d[5]-d[7]+100)%10===d[9] && d.slice(0,10).reduce((a,b)=>a+b,0)%10===d[10] }

function formSayfasi (slug, paket, d = {}, hata = '') {
  return sayfa({ baslik: 'Ödeme', govde: `<span class="rozet">Tek seferlik ödeme</span><h1>${kacir(paket.ad || 'Hizmet')}</h1><p class="alt">Ödeme için bilgilerinizi girin.</p>${hata ? `<div class="uyari">${kacir(hata)}</div>` : ''}<div class="kart vurgu"><p class="etiket">Toplam tutar, KDV dahil</p><p class="bedel">${tutarGoster(paket.tutar_kurus)} TL</p><p class="ipucu">Kartınızdan bir kez tahsil edilir.</p>${Array.isArray(paket.kapsam) ? `<ul>${paket.kapsam.map(m => `<li>${kacir(m)}</li>`).join('')}</ul>` : ''}</div><form class="kform" method="POST" action="/odeme/${kacir(encodeURIComponent(slug))}"><div class="kart">${ALANLAR.map(([k, ad, tip, uzunluk]) => `<div class="satir"><label for="${k}">${ad}</label>${k === 'adres' ? `<textarea id="${k}" name="${k}" maxlength="${uzunluk}" required>${kacir(d[k] || '')}</textarea>` : `<input id="${k}" name="${k}" type="${tip}" maxlength="${uzunluk}" value="${kacir(d[k] || '')}" required>`}</div>`).join('')}<label class="onay"><input type="checkbox" name="onay" ${d.onay ? 'checked' : ''} required><span>Toplam bedelin bir kez tahsil edilmesini kabul ediyorum.</span></label><button type="submit">Kart bilgilerine geç</button></div></form><p class="dip">Ödeme iyzico altyapısı üzerinden alınır. Kart bilgileriniz bize ulaşmaz.</p>` })
}

exports.handler = async (event, context) => {
  const sorun = (kod, mesaj) => html(kod, sayfa({ baslik: 'Ödeme açılamadı', govde: `<div class="uyari">${kacir(mesaj)}</div>` }))
  let slug
  try {
    const m = (event.path || '').match(/^\/odeme\/([^/?#]+)\/?$/)
    slug = m ? decodeURIComponent(m[1]) : String(event.queryStringParameters?.paket || '').trim()
  } catch { return sorun(404, 'Bağlantı bulunamadı.') }

  const paket = paketBul(slug)
  if (!paket || typeof paket !== 'object' || ['sonuc', 'tek-sonuc'].includes(slug)) return sorun(404, 'Bağlantı bulunamadı.')
  if (paket.plan) return abonelik.handler(event, context)
  if (!Object.hasOwn(paket, 'tutar_kurus')) return sorun(404, 'Bağlantı bulunamadı.')
  if (!Number.isSafeInteger(paket.tutar_kurus) || paket.tutar_kurus <= 0) return sorun(503, 'Paket bedeli doğrulanamadı.')
  if (event.httpMethod === 'GET') return html(200, formSayfasi(slug, paket))
  if (event.httpMethod !== 'POST') return sorun(405, 'İstek yöntemi desteklenmiyor.')

  let v
  try {
    if (typeof event.body !== 'string' || event.body.length > 16384) return sorun(400, 'Form okunamadı.')
    const p = new URLSearchParams(event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body)
    v = Object.fromEntries(ALANLAR.map(([k]) => [k, (p.get(k) || '').trim()]))
    v.onay = ['on', '1', 'true', 'evet'].includes((p.get('onay') || '').trim().toLowerCase())
  } catch { return sorun(400, 'Form okunamadı.') }

  if (ALANLAR.some(([k, , , n]) => !v[k] || v[k].length > n) || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.eposta) || !telefonDuzelt(v.telefon) || !tcknGecerli(v.tckn) || !v.onay) {
    return html(400, formSayfasi(slug, paket, v, 'Alanları kontrol edip onay kutusunu işaretleyin.'))
  }

  const ip = Object.entries(event.headers || {}).find(([k]) => k.toLowerCase() === 'x-nf-client-connection-ip')?.[1]
  if (typeof ip !== 'string' || !isIP(ip)) return sorun(503, 'Bağlantı bilgisi doğrulanamadı. Ödeme başlatılmadı.')

  try {
    const kimlik = crypto.randomUUID()
    const tutar = tutarBicim(paket.tutar_kurus)
    const bilgi = Buffer.from(JSON.stringify([kimlik, tutar])).toString('base64url')
    const imza = crypto.createHmac('sha256', process.env.IYZICO_SECRET_KEY).update('tek-sefer:' + bilgi).digest('hex')
    const adres = { contactName: `${v.ad} ${v.soyad}`, city: v.sehir, country: 'Turkey', address: v.adres }
    const kok = new URL(process.env.URL || 'https://dolunay.ai')
    if (kok.protocol !== 'https:') throw new Error('URL')
    const callbackUrl = `${kok.origin}/odeme/tek-sonuc?bilgi=${bilgi}&imza=${imza}`
    const cevap = await tekSeferBaslat({
      locale: 'tr', conversationId: kimlik, price: tutar, paidPrice: tutar, currency: 'TRY',
      basketId: kimlik, paymentGroup: 'PRODUCT', callbackUrl, enabledInstallments: [1],
      buyer: { id: kimlik, name: v.ad, surname: v.soyad, gsmNumber: telefonDuzelt(v.telefon), email: v.eposta, identityNumber: v.tckn, registrationAddress: v.adres, ip, city: v.sehir, country: 'Turkey' },
      shippingAddress: adres, billingAddress: adres,
      basketItems: [{ id: slug, name: paket.ad || 'Hizmet', category1: 'Hizmet', itemType: 'VIRTUAL', price: tutar }]
    })
    if (!cevap || cevap.hataTipi) return html(503, formSayfasi(slug, paket, v, 'Ödeme hizmetine ulaşılamıyor. Kartınızdan tahsilat YAPILMADI.'))
    if (cevap.status !== 'success' || typeof cevap.checkoutFormContent !== 'string' || !cevap.checkoutFormContent.trim()) {
      return html(400, formSayfasi(slug, paket, v, 'Kart formu açılamadı. Bilgileri kontrol edin; sorun sürerse dolunay@dolunay.ai adresine yazın.'))
    }
    return html(200, sayfa({ baslik: 'Kart bilgileri', govde: `<span class="rozet">Tek seferlik ödeme</span><h1>Kart bilgileri</h1><p class="alt">${kacir(paket.ad || 'Hizmet')} · ${kacir(tutarGoster(paket.tutar_kurus))} TL, KDV dahil</p><div class="kart"><div id="iyzipay-checkout-form" class="responsive"></div></div>${cevap.checkoutFormContent}<p class="dip">Kartınızdan bir kez tahsil edilir.</p>` }))
  } catch {
    return html(503, formSayfasi(slug, paket, v, 'Kart formu açılamadı. Kartınızdan tahsilat YAPILMADI.'))
  }
}
