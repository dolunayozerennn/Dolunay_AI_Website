import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Marka İşbirlikleri & Sponsorluklar | dolunay.ai',
  description: 'Yapay zeka ürünleriniz, SaaS uygulamalarınız veya teknoloji servisleriniz için 500.000+ izlenmeli video içerik üretimi ve B2B marka sponsorluk paketleri.',
  openGraph: {
    title: 'Marka İşbirlikleri & Sponsorluklar | dolunay.ai',
    description: 'Yapay zeka ürünleriniz, SaaS uygulamalarınız veya teknoloji servisleriniz için video içerik üretimi ve B2B marka sponsorluk dosyası.',
    url: 'https://dolunay.ai/isbirlikleri',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
