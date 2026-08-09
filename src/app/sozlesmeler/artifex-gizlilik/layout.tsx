import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Artifex Otomasyon Gizlilik Politikası',
  description: 'Artifex mesaj otomasyonunun Instagram, Messenger ve WhatsApp verilerini nasıl işlediği.',
  openGraph: {
    title: 'Artifex Otomasyon Gizlilik Politikası | dolunay.ai',
    description: 'Artifex mesaj otomasyonunun Instagram, Messenger ve WhatsApp verilerini nasıl işlediği.',
    url: 'https://dolunay.ai/sozlesmeler/artifex-gizlilik',
  },
}

export default function ArtifexGizlilikLayout({ children }: { children: React.ReactNode }) {
  return children
}
