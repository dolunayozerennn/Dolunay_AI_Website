import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Artifex Veri Silme Talebi',
  description: 'Artifex\'te tutulan mesaj ve yorum kayıtlarınızın silinmesini nasıl talep edeceğiniz.',
  openGraph: {
    title: 'Artifex Veri Silme Talebi | dolunay.ai',
    description: 'Artifex\'te tutulan mesaj ve yorum kayıtlarınızın silinmesini nasıl talep edeceğiniz.',
    url: 'https://dolunay.ai/sozlesmeler/artifex-veri-silme',
  },
}

export default function ArtifexVeriSilmePageLayout({ children }: { children: React.ReactNode }) {
  return children
}
