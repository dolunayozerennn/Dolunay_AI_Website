import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hakkımda & Ekibimiz | dolunay.ai',
  description: 'Dolunay Özeren kimdir? Antigravity yapay zeka takımı, otonom AI ajanlarımız ve ekibimizin arkasındaki vizyon.',
  openGraph: {
    title: 'Hakkımda & Ekibimiz | dolunay.ai',
    description: 'Dolunay Özeren kimdir? Antigravity yapay zeka takımı, otonom AI ajanlarımız ve ekibimizin arkasındaki vizyon.',
    url: 'https://dolunay.ai/hakkimizda',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
