// /odeme/sonuc adresini karsilar. iyzico odeme formunu tamamlayan musteriyi
// buraya token ile birlikte geri gonderir. Sonucu kendimiz sorup gosteririz;
// "odendi" hukmu formun donusune degil iyzico'nun cevabina dayanir.
const { formSonuc } = require('../lib/iyzico')
const { kacir, sayfa, html, kayitIcin } = require('../lib/sayfa')

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
    return ciz(200, 'Aboneliğiniz başladı', 'iyi',
      'Ödemeniz alındı ve aboneliğiniz aktif edildi.',
      `<div class="kart">
         <p class="etiket">Sırada ne var</p>
         <ul>
           <li>Aboneliğinizle ilgili her konuda size bu e-posta adresinden yazacağız.</li>
           <li>Bir sonraki tahsilat, gelecek ayın aynı gününde otomatik yapılır.</li>
           <li>Aboneliği durdurmak istediğinizde bize yazmanız yeterli.</li>
         </ul>
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
