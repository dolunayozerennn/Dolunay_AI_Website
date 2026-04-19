import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kurumsal Eğitimler | dolunay.ai',
  description: 'Şirketiniz için sıfırdan yapay zeka entegrasyonu, verimlilik artışı ve departman bazlı uygulamalı kurumsal AI eğitimleri.',
  openGraph: {
    title: 'Kurumsal Yapay Zeka Eğitimleri | dolunay.ai',
    description: 'Şirketiniz için sıfırdan yapay zeka entegrasyonu, verimlilik artışı ve departman bazlı uygulamalı kurumsal AI eğitimleri.',
    url: 'https://dolunay.ai/egitimler/kurumsal-egitimler',
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
            name: 'Kurumsal Yapay Zeka Uygulamalı Eğitimi',
            description: 'Şirketler için uygulamalı prompt engineering, yöneticilere özel stratejik AI entegrasyonu ve otomasyon eğitimi.',
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
