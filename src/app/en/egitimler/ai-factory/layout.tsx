import type { Metadata } from 'next'
import enDict from '@/i18n/locales/en.json'

export const metadata: Metadata = {
  title: 'AI Factory: AI Training for Entrepreneurs',
  description: 'Copy and run AI automations. Ready-to-sell systems, two live sessions a week, one-on-one Q&A. 39 dollars a month, 400+ members.',
  openGraph: {
    title: 'AI Factory Community | dolunay.ai',
    description: 'Copy and run AI automations. Ready-made systems, two live sessions a week, one-on-one Q&A.',
    url: 'https://dolunay.ai/en/egitimler/ai-factory',
  },
  alternates: {
    canonical: 'https://dolunay.ai/en/egitimler/ai-factory',
    languages: {
      tr: 'https://dolunay.ai/egitimler/ai-factory',
      en: 'https://dolunay.ai/en/egitimler/ai-factory',
      'x-default': 'https://dolunay.ai/egitimler/ai-factory',
    },
  },
}

// FAQ metni ELLE YAZILMAZ: sayfa govdesi t(`aiFactory.q${n}`)/t(`aiFactory.a${n}`)
// okuyor, bu semanin metnine BIREBIR uymasi sart (Google kurali). O yuzden
// ayni degerler dogrudan en.json'dan okunur, ikinci bir kopya elle yazilmaz.
type AiFactoryDict = Record<string, string>
const af = enDict.aiFactory as AiFactoryDict
const sss: [string, string][] = [1, 2, 3, 4, 5, 6].map((n) => [af[`q${n}`], af[`a${n}`]])

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: 'AI Factory Community and Training',
            description: 'A community that teaches you to copy AI automations and run them in your own business or for your clients. Ready-to-sell systems, two live sessions a week, one-on-one Q&A.',
            inLanguage: 'en',
            url: 'https://dolunay.ai/en/egitimler/ai-factory',
            provider: {
              '@type': 'Organization',
              name: 'dolunay.ai',
              sameAs: 'https://dolunay.ai',
            },
            offers: {
              '@type': 'Offer',
              price: '39',
              priceCurrency: 'USD',
              category: 'Subscription',
              url: 'https://www.skool.com/yapay-zeka-factory/about',
            },
            hasCourseInstance: {
              '@type': 'CourseInstance',
              courseMode: 'online',
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: sss.map(([soru, cevap]) => ({
              '@type': 'Question',
              name: soru,
              acceptedAnswer: { '@type': 'Answer', text: cevap },
            })),
          }),
        }}
      />
      {children}
    </>
  )
}
