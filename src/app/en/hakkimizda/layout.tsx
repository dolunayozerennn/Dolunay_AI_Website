import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Me & Our Team',
  description: 'Who is Dolunay Özeren? The Antigravity AI team, our autonomous AI agents and the vision behind our team.',
  openGraph: {
    title: 'About Me & Our Team | dolunay.ai',
    description: 'Who is Dolunay Özeren? The Antigravity AI team, our autonomous AI agents and the vision behind our team.',
    url: 'https://dolunay.ai/en/hakkimizda',
  },
  alternates: {
    canonical: 'https://dolunay.ai/en/hakkimizda',
    languages: {
      tr: 'https://dolunay.ai/hakkimizda',
      en: 'https://dolunay.ai/en/hakkimizda',
      'x-default': 'https://dolunay.ai/hakkimizda',
    },
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
