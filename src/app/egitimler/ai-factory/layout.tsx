import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Factory: Girişimci Yapay Zeka Eğitimi',
  description: 'Yapay zeka otomasyonlarını kopyala ve çalıştır. Ticarileştirilmiş hazır sistemler, haftada iki canlı yayın, birebir soru cevap. Aylık 39 dolar, 400+ üye.',
  openGraph: {
    title: 'AI Factory Topluluğu | dolunay.ai',
    description: 'Yapay zeka otomasyonlarını kopyala ve çalıştır. Hazır sistemler, haftada iki canlı yayın, birebir soru cevap.',
    url: 'https://dolunay.ai/egitimler/ai-factory',
  }
}

// Sayfadaki sorularin AYNISI. Google, yapilandirilmis veride gecen sorunun sayfada
// da GORUNUR olmasini sart kosar; sayfadaki metin degisirse burasi da degismeli.
const sss = [
  ['AI Factory nedir?', 'Yapay zeka otomasyonlarını kopyalayıp kendi işinde ya da müşterinde çalıştırman için kurulmuş bir topluluk. İçinde ticarileştirilmiş hazır sistemler, haftada iki canlı yayın ve birebir soru cevap var.'],
  ['Ücreti ne kadar?', 'Aylık 39 dolar. Skool üzerinden ödenir, üyelik oradan yönetilir.'],
  ['Yazılım bilmem gerekiyor mu?', 'Sistemler kurulmaya hazır geliyor. Sıfırdan kod yazmıyorsun, çalışan bir otomasyonu kendi hesaplarına bağlıyorsun. Takıldığın yerde canlı yayında ve birebir soru cevapta destek alırsın.'],
  ['Katılmadan önce soru sorabilir miyim?', 'Evet. Skool sayfasındaki WhatsApp ön danışma hattından yazabilirsin.'],
  ['Canlı yayınlara katılamazsam ne olur?', 'Toplulukta arşiv duruyor. Ayrıca sorunu birebir sorabilirsin, yayını beklemen gerekmez.'],
  ['Kimler için uygun değil?', 'Teorik yapay zeka eğitimi arıyorsan burası değil. Akademik müfredat ve saatler süren ders videosu yok.'],
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: 'AI Factory Topluluğu ve Eğitimi',
            description: 'Yapay zeka otomasyonlarını kopyalayıp kendi işinde veya müşterinde çalıştırmayı öğreten topluluk. Ticarileştirilmiş hazır sistemler, haftada iki canlı yayın, birebir soru cevap.',
            inLanguage: 'tr',
            url: 'https://dolunay.ai/egitimler/ai-factory',
            provider: {
              '@type': 'Organization',
              name: 'dolunay.ai',
              sameAs: 'https://dolunay.ai'
            },
            offers: {
              '@type': 'Offer',
              price: '39',
              priceCurrency: 'USD',
              category: 'Subscription',
              url: 'https://www.skool.com/yapay-zeka-factory/about',
            },
            hasCourseInstance: {
              '@type': 'CourseInstance',
              courseMode: 'online',
            },
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: sss.map(([soru, cevap]) => ({
              '@type': 'Question',
              name: soru,
              acceptedAnswer: { '@type': 'Answer', text: cevap },
            })),
          })
        }}
      />
      {children}
    </>
  )
}
