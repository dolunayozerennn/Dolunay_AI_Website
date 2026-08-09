import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Artifex Veri Silme Talebi',
  description: 'Artifex mesaj otomasyonunda tutulan verilerinizin silinmesini nasıl talep edeceğiniz.',
  openGraph: {
    title: 'Artifex Veri Silme Talebi | dolunay.ai',
    description: 'Artifex mesaj otomasyonunda tutulan verilerinizin silinmesini nasıl talep edeceğiniz.',
    url: 'https://dolunay.ai/sozlesmeler/artifex-veri-silme',
  },
}

export default function ArtifexVeriSilmeLayout({ children }: { children: React.ReactNode }) {
  return children
}
