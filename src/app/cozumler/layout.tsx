import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Çözümler · İşletmeler ve Girişimciler İçin Yapay Zeka',
  description: 'Dolunay AI çözümleriyle iş süreçlerinizi otomatikleştirin. Hazır AI araçları ve şirkete özel otonom sistem kurulum hizmetleri.',
  openGraph: {
    title: 'Çözümler | dolunay.ai',
    description: 'Dolunay AI çözümleriyle iş süreçlerinizi otomatikleştirin. Hazır AI araçları ve şirkete özel otonom sistem kurulum hizmetleri.',
    url: 'https://dolunay.ai/cozumler',
  },
  // F9: canonical burada tanimli degildi, kokteki './' inherit ediyordu (bu
  // sayfada zaten dogru sonuc veriyordu). languages ayni mirasla gelmiyor,
  // o yuzden acikca yaziliyor.
  alternates: {
    canonical: './',
    languages: {
      tr: 'https://dolunay.ai/cozumler',
      en: 'https://dolunay.ai/en/cozumler',
      'x-default': 'https://dolunay.ai/cozumler',
    },
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
