import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Artifex AI Kullanım Koşulları',
  description: 'Artifex AI App kullanım koşulları: hizmetin tanımı, işletmenin yükümlülükleri, sorumluluk sınırları ve fesih.',
  openGraph: {
    title: 'Artifex AI Kullanım Koşulları | dolunay.ai',
    description: 'Artifex AI App kullanım koşulları: hizmetin tanımı, işletmenin yükümlülükleri, sorumluluk sınırları ve fesih.',
    url: 'https://dolunay.ai/sozlesmeler/artifex-kosullar',
  },
}

export default function ArtifexKullanimKosullariPageLayout({ children }: { children: React.ReactNode }) {
  return children
}
