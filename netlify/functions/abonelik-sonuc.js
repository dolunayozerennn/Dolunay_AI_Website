// /odeme/sonuc adresini karsilar. iyzico odeme formunu tamamlayan musteriyi
// buraya token ile birlikte geri gonderir. Sonucu kendimiz sorup gosteririz;
// "odendi" hukmu formun donusune degil iyzico'nun cevabina dayanir.
const { formSonuc } = require('../lib/iyzico')
const { kacir, sayfa, html } = require('../lib/sayfa')

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
      <p class="dip">Sorulariniz icin <a href="mailto:dolunay@dolunay.ai">dolunay@dolunay.ai</a></p>`,
  }))
}

exports.handler = async (event) => {
  const token = tokenBul(event)
  if (!token) {
    return ciz(400, 'Islem bulunamadi', 'uyari',
      'Odeme bilgisi alinamadi. Size iletilen baglantidan tekrar deneyin.')
  }

  let cevap
  try {
    cevap = await formSonuc(token)
  } catch (e) {
    return ciz(502, 'Sonuc dogrulanamadi', 'uyari',
      'Odemeniz alinmis olabilir ama su an teyit edemedik. Sizinle en kisa surede iletisime gececegiz.')
  }

  const veri = cevap && cevap.data ? cevap.data : cevap || {}

  if (cevap && cevap.status === 'success') {
    const ref = veri.referenceCode || veri.subscriptionReferenceCode || ''
    return ciz(200, 'Aboneliginiz basladi', 'iyi',
      'Odemeniz alindi ve aboneliginiz aktif edildi.',
      `<div class="kart">
         <p class="etiket">Sirada ne var</p>
         <ul>
           <li>Fatura ve tahsilat bildirimleri kayitli e-posta adresinize gonderilir.</li>
           <li>Bir sonraki tahsilat ayni gun otomatik yapilir.</li>
           <li>Aboneligi durdurmak istediginizde bize yazmaniz yeterli.</li>
         </ul>
         ${ref ? `<p class="ipucu">Abonelik numaraniz: ${kacir(ref)}</p>` : ''}
       </div>`)
  }

  return ciz(200, 'Odeme tamamlanmadi', 'uyari',
    (cevap && cevap.errorMessage) || 'Odeme tamamlanmadi. Karttan herhangi bir tahsilat yapilmadi.',
    `<div class="kart">
       <p class="etiket">Ne yapabilirsiniz</p>
       <ul>
         <li>Size iletilen baglantidan tekrar deneyebilirsiniz.</li>
         <li>Sorun devam ederse bize yazin, birlikte bakalim.</li>
       </ul>
     </div>`)
}
