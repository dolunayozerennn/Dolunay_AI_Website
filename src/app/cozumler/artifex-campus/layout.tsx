import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Artifex Campus & Otonom Sistem Kurulumu | dolunay.ai',
  description: 'İşletmeler ve startup\'lar için A\'dan Z\'ye özel yapay zeka ajanları, otonom pazarlama sistemleri ve mimari danışmanlık hizmetleri.',
  openGraph: {
    title: 'Artifex Campus — Kurumsal AI Danışmanlık | dolunay.ai',
    description: 'İşletmeler ve startup\'lar için A\'dan Z\'ye özel yapay zeka ajanları, otonom pazarlama sistemleri ve mimari danışmanlık hizmetleri.',
    url: 'https://dolunay.ai/cozumler/artifex-campus',
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
            '@type': 'Service',
            name: 'Artifex Campus & Otonom AI Sistem Kurulumu',
            description: 'İşletmeler ve startup\'lar için A\'dan Z\'ye özel yapay zeka ajanları, otonom pazarlama sistemleri ve AI mimari danışmanlık hizmetleri.',
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
