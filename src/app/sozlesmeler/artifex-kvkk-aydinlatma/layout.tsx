import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Artifex AI KVKK Aydınlatma Metni',
  description: '6698 sayılı KVKK kapsamında Artifex AI\'ın kişisel verileri hangi amaçla ve hangi hukuki sebeple işlediğine ilişkin aydınlatma metni.',
  openGraph: {
    title: 'Artifex AI KVKK Aydınlatma Metni | dolunay.ai',
    description: '6698 sayılı KVKK kapsamında Artifex AI\'ın kişisel verileri hangi amaçla ve hangi hukuki sebeple işlediğine ilişkin aydınlatma metni.',
    url: 'https://dolunay.ai/sozlesmeler/artifex-kvkk-aydinlatma',
  },
}

export default function ArtifexKvkkAydinlatmaPageLayout({ children }: { children: React.ReactNode }) {
  return children
}
