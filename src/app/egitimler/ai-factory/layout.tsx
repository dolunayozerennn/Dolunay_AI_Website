import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Factory: Girişimci Yapay Zeka Eğitimi | dolunay.ai',
  description: 'Girişimciler ve profesyoneller için sıfırdan yapay zeka otomasyonu, pasif gelir ve ürün çıkarma topluluğu. Skool üzerinden ulaşıma açık.',
  openGraph: {
    title: 'AI Factory Topluluğu | dolunay.ai',
    description: 'Girişimciler ve profesyoneller için sıfırdan yapay zeka otomasyonu, pasif gelir ve ürün çıkarma topluluğu.',
    url: 'https://dolunay.ai/egitimler/ai-factory',
  }
}

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
            description: 'Girişimciler ve profesyoneller için sıfırdan yapay zeka otomasyonu, pasif gelir ve AI ürün geliştirme kursu.',
            provider: {
              '@type': 'Organization',
              name: 'dolunay.ai',
              sameAs: 'https://dolunay.ai'
            }
          })
        }}
      />
      {children}
    </>
  )
}
