import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Çözümler — İşletmeler ve Girişimciler İçin Yapay Zeka',
  description: 'Dolunay AI çözümleriyle iş süreçlerinizi otomatikleştirin. Hazır AI araçları ve şirkete özel otonom sistem kurulum hizmetleri.',
  openGraph: {
    title: 'Çözümler | dolunay.ai',
    description: 'Dolunay AI çözümleriyle iş süreçlerinizi otomatikleştirin. Hazır AI araçları ve şirkete özel otonom sistem kurulum hizmetleri.',
    url: 'https://dolunay.ai/cozumler',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
