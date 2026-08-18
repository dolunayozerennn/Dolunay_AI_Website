import type { Metadata } from 'next'
import { PromptExperience } from './PromptExperience'

export const metadata: Metadata = {
  title: '3 Mini Ürün · ScrapeUnblocker Master Promptları',
  description:
    'İçerik Fırsat Radarı, Müşteri Fırsat Radarı ve Seyahat Bütçe Radarı için ücretsiz Türkçe ve İngilizce Master Promptlar. Claude Code, Codex ya da kullandığın başka bir kodlama aracıyla çalışır.',
  openGraph: {
    title: 'Tek API, üç gerçek ürün',
    description:
      'Üç Master Promptu kopyala; kodlama aracınla içerik, müşteri ve seyahat verisini çalışan ürüne dönüştür.',
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
