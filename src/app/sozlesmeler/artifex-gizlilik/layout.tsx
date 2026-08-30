import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Artifex Otomasyon Gizlilik Politikası',
  description: 'Artifex mesaj otomasyonunun Instagram mesaj ve yorumlarını nasıl işlediği, saklama süreleri, yurt dışına aktarım ve haklarınız.',
  openGraph: {
    title: 'Artifex Otomasyon Gizlilik Politikası | dolunay.ai',
    description: 'Artifex mesaj otomasyonunun Instagram mesaj ve yorumlarını nasıl işlediği, saklama süreleri, yurt dışına aktarım ve haklarınız.',
    url: 'https://dolunay.ai/sozlesmeler/artifex-gizlilik',
  },
}

export default function ArtifexGizlilikPolitikasiPageLayout({ children }: { children: React.ReactNode }) {
  return children
}
