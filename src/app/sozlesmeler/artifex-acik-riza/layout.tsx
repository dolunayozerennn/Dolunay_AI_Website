import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Artifex AI Açık Rıza Metni',
  description: 'Kişisel verilerin yurt dışındaki hizmet sağlayıcılara aktarılmasına ilişkin açık rıza metni.',
  openGraph: {
    title: 'Artifex AI Açık Rıza Metni | dolunay.ai',
    description: 'Kişisel verilerin yurt dışındaki hizmet sağlayıcılara aktarılmasına ilişkin açık rıza metni.',
    url: 'https://dolunay.ai/sozlesmeler/artifex-acik-riza',
  },
}

export default function ArtifexAcikRizaPageLayout({ children }: { children: React.ReactNode }) {
  return children
}
