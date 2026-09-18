import type { Metadata } from 'next'

// F9 (seo_geo/BULGULAR.md): /en artik GERCEK bir statik rota (ayri page.tsx'
// ler, output:'export' ile HTML'e gomulu). Bu layout /en'in (ana sayfa)
// varsayilan metadata'sini tasir; /en altindaki her alt rota (cozumler,
// egitimler/...) kendi layout.tsx'inde bu deseni tekrarlayip KENDI title'ini
// ve KENDI hreflang haritasini tanimlar (kok layout.tsx'teki TR sayfalarin
// izledigi ayni kural: her rota kendi alternates'ini acikca yazar).
export const metadata: Metadata = {
  // 'absolute': kokteki '%s | dolunay.ai' sablonu bu segmente de miras
  // kaliyor (ayni kural, cozumler/hizmetler/layout.tsx'teki yorumda da
  // anlatiliyor). 'default' kullanilsaydi kok sablonu buna da uygulanip
  // baslik "... Builder | dolunay.ai" olarak IKI KEZ markalanirdi --
  // ilk denemede tam bu hata cikti, build ciktisinda gorulup duzeltildi.
  title: {
    absolute: 'dolunay.ai · AI Trainer & Builder',
  },
  description: 'AI trainer & builder. AI automation solutions for businesses, AI Factory community for entrepreneurs.',
  // keywords root layout.tsx'ten miras kalirdi (Turkce liste); EN sayfada
  // Turkce anahtar kelime kalmasin diye burada acikca ezilir.
  keywords: ['artificial intelligence', 'AI training', 'automation', 'dolunay ozeren', 'AI Factory', 'corporate training', 'AI consulting'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dolunay.ai/en',
    siteName: 'dolunay.ai',
    title: 'dolunay.ai · AI Trainer & Builder',
    description: 'AI trainer & builder. AI automation solutions for businesses, AI Factory community for entrepreneurs.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'dolunay.ai · AI Trainer & Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'dolunay.ai · AI Trainer & Builder',
    description: 'AI trainer & builder. AI automation solutions for businesses.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://dolunay.ai/en',
    languages: {
      tr: 'https://dolunay.ai/',
      en: 'https://dolunay.ai/en',
      'x-default': 'https://dolunay.ai/',
    },
  },
}

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
