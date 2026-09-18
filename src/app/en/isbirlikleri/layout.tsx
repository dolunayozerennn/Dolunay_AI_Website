import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brand Collaborations & Sponsorships',
  description: 'Video content production with 500,000+ views and B2B brand sponsorship packages for your AI products, SaaS apps or tech services.',
  openGraph: {
    title: 'Brand Collaborations & Sponsorships | dolunay.ai',
    description: 'Video content production and a B2B brand sponsorship deck for your AI products, SaaS apps or tech services.',
    url: 'https://dolunay.ai/en/isbirlikleri',
  },
  alternates: {
    canonical: 'https://dolunay.ai/en/isbirlikleri',
    languages: {
      tr: 'https://dolunay.ai/isbirlikleri',
      en: 'https://dolunay.ai/en/isbirlikleri',
      'x-default': 'https://dolunay.ai/isbirlikleri',
    },
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
