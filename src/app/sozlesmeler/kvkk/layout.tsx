import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gizlilik ve KVKK Politikası',
  description: 'dolunay.ai kişisel verilerin korunması, gizlilik ve çerez politikası.',
  openGraph: {
    title: 'Gizlilik ve KVKK Politikası | dolunay.ai',
    description: 'dolunay.ai kişisel verilerin korunması, gizlilik ve çerez politikası.',
    url: 'https://dolunay.ai/sozlesmeler/kvkk',
  },
}

export default function KvkkLayout({ children }: { children: React.ReactNode }) {
  return children
}
