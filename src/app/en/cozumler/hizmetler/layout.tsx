import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Consulting and Automation Services | dolunay.ai',
  description: 'dolunay.ai designs professional AI agents and automation services for your business.',
  openGraph: {
    title: 'Services | dolunay.ai',
    description: 'dolunay.ai designs professional AI agents and automation services for your business.',
  },
  alternates: {
    canonical: 'https://dolunay.ai/en/cozumler/hizmetler',
    languages: {
      tr: 'https://dolunay.ai/cozumler/hizmetler',
      en: 'https://dolunay.ai/en/cozumler/hizmetler',
      'x-default': 'https://dolunay.ai/cozumler/hizmetler',
    },
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
