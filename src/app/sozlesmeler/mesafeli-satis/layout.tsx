import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mesafeli Satış Sözleşmesi',
  description: 'dolunay.ai üzerinden satın alınan eğitim ve hizmetler için mesafeli satış sözleşmesi.',
  openGraph: {
    title: 'Mesafeli Satış Sözleşmesi | dolunay.ai',
    description: 'dolunay.ai üzerinden satın alınan eğitim ve hizmetler için mesafeli satış sözleşmesi.',
    url: 'https://dolunay.ai/sozlesmeler/mesafeli-satis',
  },
}

export default function MesafeliSatisLayout({ children }: { children: React.ReactNode }) {
  return children
}
