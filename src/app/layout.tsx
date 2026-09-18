import type { Metadata } from 'next'
import { Inter_Tight, JetBrains_Mono } from 'next/font/google'
import { LanguageProvider } from '@/i18n/i18n'
import { Navbar } from '@/components/layout/Navbar'
import dynamic from 'next/dynamic'
import './globals.css'

const Footer = dynamic(() => import('@/components/layout/Footer').then(mod => mod.Footer))
const CookieBanner = dynamic(() => import('@/components/CookieBanner').then(mod => mod.CookieBanner))

const interTight = Inter_Tight({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter-tight',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  // 500/600 kaldirildi: repoda font-mono hicbir yerde bir agirlik utility'siyle
  // (font-medium/font-semibold) birlikte kullanilmiyor, hep varsayilan 400
  // agirlikta cagriliyor. Kullanilmayan iki agirlik indirilen woff2'yi sisiriyordu.
  weight: ['400'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://dolunay.ai'),
  title: {
    default: 'dolunay.ai · Yapay Zeka Eğitmen & Builder',
    template: '%s | dolunay.ai',
  },
  description: 'Yapay zeka eğitmeni & builder. İşletmeler için AI otomasyon çözümleri, girişimciler için AI Factory topluluğu.',
  keywords: ['yapay zeka', 'AI eğitim', 'otomasyon', 'dolunay özeren', 'AI Factory', 'kurumsal eğitim', 'artificial intelligence', 'yapay zeka danışmanlık'],
  authors: [{ name: 'Dolunay Özeren' }],
  creator: 'dolunay.ai',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    // canonical ile ayni mantik: './' o anki sayfaya cozulur. Sabit birakilirsa
    // kendi metadata'si olmayan sayfalar paylasilirken 'bu sayfa ana sayfadir' der.
    url: './',
    siteName: 'dolunay.ai',
    title: 'dolunay.ai · Yapay Zeka Eğitmen & Builder',
    description: 'Yapay zeka eğitmeni & builder. İşletmeler için AI otomasyon çözümleri, girişimciler için AI Factory topluluğu.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'dolunay.ai · Yapay Zeka Eğitmen & Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'dolunay.ai · Yapay Zeka Eğitmen & Builder',
    description: 'Yapay zeka eğitmeni & builder. İşletmeler için AI otomasyon çözümleri.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    // './' metadataBase + o anki yol olarak çözülür, yani her sayfa KENDİ adresini
    // canonical gösterir. Sabit 'https://dolunay.ai' yazılırsa tüm alt sayfalar
    // Google'a "asıl adres ana sayfa" der ve dizinden düşer.
    canonical: './',
    // F9: hreflang BURAYA YAZILMAZ. Kok metadata'daki alternates, kendi
    // alternates'ini tanimlamayan HER sayfaya miras kalir; blog, sozlesmeler,
    // /r ve abonelik sayfalari da "benim Ingilizce surumum /en" demeye baslar.
    // Bu sayfalarin Ingilizce karsiligi YOK, o yuzden hreflang yalniz gercekten
    // iki dilde var olan 7 sayfada, kendi layout/page dosyasinda tanimlanir
    // (TR ana sayfa icin src/app/page.tsx).
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`${interTight.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {/* .ico fallback: bazi tarayici/bot'lar svg destegi olsa bile hala
            /favicon.ico'yu dogrudan ister, o adres yoksa 404 loglanir. */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#08090C" />
      </head>
      <body className="min-h-screen bg-[#08090C] text-[#F4F2EC] font-sans selection:bg-[#4F8BFF]/35">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              // F11: WebSite/Service/Article gibi diger sayfalardaki semalar
              // bu Organization'i COGALTMAK yerine bu @id'ye referansla baglanir.
              '@id': 'https://dolunay.ai/#organization',
              name: 'dolunay.ai',
              url: 'https://dolunay.ai',
              logo: 'https://dolunay.ai/favicon.svg',
              founder: {
                '@type': 'Person',
                name: 'Dolunay Özeren',
                jobTitle: 'AI Eğitmen & Builder',
              },
              sameAs: [
                'https://www.instagram.com/dolunay_ozeren/',
                'https://youtube.com/@dolunayozeren',
                'https://tiktok.com/@dolunayozeren',
              ],
              description: 'Yapay zeka eğitmeni & builder. İşletmeler için AI otomasyon çözümleri, girişimciler için AI Factory topluluğu.',
            }),
          }}
        />
        <LanguageProvider>
          <Navbar />
          <main className="pt-20">
            {children}
          </main>
          <Footer />
          <CookieBanner />
        </LanguageProvider>
      </body>
    </html>
  )
}
