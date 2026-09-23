// Yarida kalan odemeleri bulur. Zamanlanmis fonksiyon (yarim-odeme-tarama)
// her yarim saatte bir cagirir.
//
// NEDEN AYRI BIR TARAMA: musteri formu doldurup kart adimina geciyor, sonra
// sekmeyi kapatiyor. iyzico o zaman bize HIC donmuyor; callback yok, yani
// abonelik-sonuc hic calismiyor. Bu durumu yakalayabilecek tek iz, odeme
// baslarken yazilan bekleyen kayit. Hesap acilinca o kayit siliniyor; belli
// bir sure sonra hala duruyorsa odeme tamamlanmamistir.
const { depoAc, hesapOku } = require('../hesap')
const { bildir, tarihTr, paketAdi, paketTutari } = require('../bildirim')

// Kart formu 30 dakika gecerli. Bir kac dakikalik gec callback'i de beklemek
// icin 45 dakika: daha erken bakarsak odemesini yapmakta olan musteri icin
// "yarim kaldi" deriz.
const BEKLEME_MS = 45 * 60 * 1000
// Ozellik devreye girmeden onceki eski kayitlar ilk taramada topluca
// bildirilmesin. Bir hafta, kacirilmis bir taramayi telafi etmeye yeter.
const GERI_BAKIS_MS = 7 * 24 * 60 * 60 * 1000
const TAVAN = 500

async function tara (simdi = Date.now()) {
  const d = depoAc()
  const liste = await d.list({ prefix: 'bekleyen/' })
  const anahtarlar = (liste && Array.isArray(liste.blobs) ? liste.blobs : []).slice(0, TAVAN)
  const ozet = { bakilan: anahtarlar.length, bildirilen: 0, erken: 0, eski: 0, tamamlanmis: 0 }

  for (const b of anahtarlar) {
    let kayit
    try { kayit = await d.get(b.key, { type: 'json' }) } catch { continue }
    if (!kayit) continue
    const olusma = Date.parse(kayit.olusturuldu || '')
    if (!Number.isFinite(olusma)) continue
    if (simdi - olusma < BEKLEME_MS) { ozet.erken += 1; continue }
    if (simdi - olusma > GERI_BAKIS_MS) { ozet.eski += 1; continue }

    // Hesap acilmis ama bekleyen kayit silinememis olabilir (silme en sona
    // birakiliyor ve hatasi yutuluyor). Ayni pakette hesap varsa bu yarim
    // bir odeme degil.
    try {
      const hesap = await hesapOku(kayit.eposta)
      if (hesap && (!hesap.plan || hesap.plan === kayit.plan)) { ozet.tamamlanmis += 1; continue }
    } catch { /* okunamadi: bildirmek, susmaktan iyidir */ }

    const s = await bildir({
      tur: 'odeme-yarim',
      onem: 'dikkat',
      baslik: `Ödeme yarıda kaldı: ${kayit.markaAdi || kayit.eposta}`,
      eposta: kayit.eposta,
      // Ayni musteri ayni paketi ertesi gun yeniden denerse o ayri bir deneme.
      tekil: `yarim/${b.key}/${kayit.olusturuldu}`,
      satirlar: [
        ['Ad soyad', `${kayit.ad || ''} ${kayit.soyad || ''}`.trim()],
        ['Marka adı', kayit.markaAdi],
        ['E-posta', kayit.eposta],
        ['Telefon', kayit.telefon],
        ['Paket', paketAdi(kayit.slug || kayit.plan)],
        ['Tutar', paketTutari(kayit.slug || kayit.plan)],
        ['Formu doldurduğu an', `${tarihTr(kayit.olusturuldu)} ${new Date(olusma).toLocaleTimeString('tr-TR', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit' })}`],
      ],
      not: 'Müşteri formu doldurup kart adımına geçti ama ödeme tamamlanmadı; iyzico geri dönüş yapmadı. Karttan tahsilat YAPILMADI. Müşteriye dönmek isteyebilirsiniz.',
    })
    if (s.gonderim !== 'zaten') ozet.bildirilen += 1
  }
  return ozet
}

module.exports = { tara, BEKLEME_MS, GERI_BAKIS_MS }
