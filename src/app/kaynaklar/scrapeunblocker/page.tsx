import type { Metadata } from 'next'
import { PromptExperience } from './PromptExperience'

export const metadata: Metadata = {
  title: 'Claude Code ile 3 Mini Ürün · ScrapeUnblocker',
  description:
    'İçerik Fırsat Radarı, Müşteri Fırsat Radarı ve Seyahat Bütçe Radarı için ücretsiz Türkçe ve İngilizce Claude Code Master Promptları.',
  openGraph: {
    title: 'Tek API, üç gerçek Claude Code ürünü',
    description:
      'Üç Master Promptu kopyala; Claude Code ile içerik, müşteri ve seyahat verisini çalışan ürüne dönüştür.',
    url: '/kaynaklar/scrapeunblocker',
    type: 'website',
  },
  alternates: {
    canonical: '/kaynaklar/scrapeunblocker',
  },
}

export default function ScrapeUnblockerResourcesPage() {
  return <PromptExperience />
}
