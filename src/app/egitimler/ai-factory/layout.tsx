import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Factory',
  description: 'Yapay Zeka Otomasyonları satarak gelir elde etmeyi öğrenin. Bireysel girişimciler ve freelancerlar için kullanıma hazır sistemler.',
  openGraph: {
    title: 'AI Factory | dolunay.ai',
    description: 'Yapay Zeka Otomasyonları satarak gelir elde etmeyi öğrenin. Bireysel girişimciler ve freelancerlar için kullanıma hazır sistemler.',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'AI Factory',
    description: 'Yapay Zeka Otomasyonları satarak gelir elde etmeyi öğrenin. Bireysel girişimciler ve freelancerlar için kullanıma hazır sistemler.',
    provider: {
      '@type': 'Organization',
      name: 'Dolunay AI',
      sameAs: 'https://dolunay.ai'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
