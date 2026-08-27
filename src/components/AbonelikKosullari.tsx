import Link from 'next/link'

// Abonelik kosullari IKI ekranda birden gorunur: herkese acik paket sayfasi ve
// musteriye ozel abonelik sayfasi. Odeme saglayicisi (iyzico) ikisini de
// denetliyor; iki yerde ayri ayri yazilirsa biri guncellenip digeri eskir ve
// denetimde celiskili sart cikar. Bu yuzden tek kaynak burasi.
export const ABONELIK_KOSULLARI: { etiket: string; deger: string }[] = [
  {
    etiket: 'Faturalama dönemi',
    deger: 'Aylık',
  },
  {
    etiket: 'Tahsilat',
    deger:
      'Sözleşmede belirlenen bedel, her ay aynı gün kayıtlı kredi kartınızdan otomatik tahsil edilir.',
  },
  {
    etiket: 'Ödeme altyapısı',
    deger: 'iyzico. Kart bilgileriniz tarafımızda saklanmaz.',
  },
  {
    etiket: 'Yenileme',
    deger: 'Abonelik, iptal edilmediği sürece her ay kendiliğinden yenilenir.',
  },
  {
    etiket: 'Fiyat değişikliği',
    deger:
      'Aylık bedel, en az 30 gün önceden yazılı bildirim yapılmadan değiştirilmez.',
  },
  {
    etiket: 'İptal',
    deger:
      'dolunay@dolunay.ai adresine yazmanız yeterlidir. İptal talebi alındığında sonraki tahsilat durdurulur, hizmet ödemesi yapılmış dönemin sonuna kadar devam eder.',
  },
  {
    etiket: 'Vergi',
    deger: 'Belirtilen bedellere KDV dahil değildir, faturada ayrıca gösterilir.',
  },
]

export function AbonelikKosullari() {
  return (
    <section className="rounded-3xl border border-white/5 bg-[#0a0a0f] p-8 md:p-10">
      <h2 className="text-2xl font-bold text-white mb-8">Abonelik Koşulları</h2>
      <dl className="divide-y divide-white/5">
        {ABONELIK_KOSULLARI.map((k) => (
          <div key={k.etiket} className="py-4 sm:grid sm:grid-cols-3 sm:gap-8">
            <dt className="text-sm font-bold text-[#7AA8FF] mb-1.5 sm:mb-0">{k.etiket}</dt>
            <dd className="sm:col-span-2 text-sm text-gray-300 leading-relaxed">{k.deger}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-8 text-sm text-gray-500 leading-relaxed">
        Abonelik ilişkisinin tamamı{' '}
        <Link
          href="/sozlesmeler/mesafeli-satis"
          className="text-[#4F8BFF] hover:underline underline-offset-4"
        >
          Mesafeli Satış Sözleşmesi
        </Link>{' '}
        hükümlerine tabidir.
      </p>
    </section>
  )
}
