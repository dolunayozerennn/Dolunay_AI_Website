import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Solutions · AI for Businesses and Entrepreneurs',
  description: "Automate your business processes with dolunay.ai's AI solutions. Ready-to-use AI tools and custom autonomous system setup for enterprises.",
  openGraph: {
    title: 'Solutions | dolunay.ai',
    description: "Automate your business processes with dolunay.ai's AI solutions. Ready-to-use AI tools and custom autonomous system setup for enterprises.",
    url: 'https://dolunay.ai/en/cozumler',
  },
  alternates: {
    canonical: 'https://dolunay.ai/en/cozumler',
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
