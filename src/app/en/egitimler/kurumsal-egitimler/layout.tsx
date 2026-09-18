import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corporate AI Trainings',
  description: 'Hands-on corporate AI training built from scratch for your company: company-wide AI integration, productivity gains and department-specific applications.',
  openGraph: {
    title: 'Corporate AI Trainings | dolunay.ai',
    description: 'Hands-on corporate AI training built from scratch for your company: company-wide AI integration, productivity gains and department-specific applications.',
    url: 'https://dolunay.ai/en/egitimler/kurumsal-egitimler',
  },
  alternates: {
    canonical: 'https://dolunay.ai/en/egitimler/kurumsal-egitimler',
    languages: {
      tr: 'https://dolunay.ai/egitimler/kurumsal-egitimler',
      en: 'https://dolunay.ai/en/egitimler/kurumsal-egitimler',
      'x-default': 'https://dolunay.ai/egitimler/kurumsal-egitimler',
    },
  },
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
            name: 'Applied Corporate AI Training',
            description: 'Hands-on prompt engineering for companies, strategic AI integration for executives and automation training.',
            inLanguage: 'en',
            provider: {
              '@type': 'Organization',
              name: 'dolunay.ai',
              sameAs: 'https://dolunay.ai',
            },
          }),
        }}
      />
      {children}
    </>
  )
}
