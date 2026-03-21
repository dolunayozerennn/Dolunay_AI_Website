import type { Metadata } from 'next'
import { LanguageProvider } from '@/i18n/i18n'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://dolunay.ai'),
  title: {
    default: 'dolunay.ai — Yapay Zeka Eğitmen & Builder',
    template: '%s | dolunay.ai',
  },
  description: 'Yapay zeka eğitmeni & builder. İşletmeler için AI otomasyon çözümleri, girişimciler için AI Factory topluluğu.',
  keywords: ['yapay zeka', 'AI eğitim', 'otomasyon', 'dolunay özeren', 'AI Factory', 'kurumsal eğitim'],
  authors: [{ name: 'Dolunay Özeren' }],
  creator: 'dolunay.ai',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://dolunay.ai',
    siteName: 'dolunay.ai',
    title: 'dolunay.ai — Yapay Zeka Eğitmen & Builder',
    description: 'Yapay zeka eğitmeni & builder. İşletmeler için AI otomasyon çözümleri.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'dolunay.ai',
    description: 'Yapay zeka eğitmeni & builder.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Space+Grotesk:wght@300..700&family=Google+Sans+Flex:opsz,wght@8..144,100..1000&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="min-h-screen bg-gray-950 text-white font-sans selection:bg-purple-500/30">
        <LanguageProvider>
          <Navbar />
          <main className="pt-20">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
