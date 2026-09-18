import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { HeroSectionElevate } from '@/components/sections/HeroSectionElevate'

const ProductsSection = dynamic(() => import('@/components/sections/ProductsSection').then(mod => mod.ProductsSection))
const LogoStrip = dynamic(() => import('@/components/sections/LogoStrip').then(mod => mod.LogoStrip))

// F9: TR ana sayfa <-> /en esi. Kok layout'ta DEGIL burada duruyor; kokte
// olsaydi Ingilizce karsiligi olmayan butun sayfalara miras kalirdi.
export const metadata: Metadata = {
  alternates: {
    canonical: './',
    languages: {
      tr: 'https://dolunay.ai/',
      en: 'https://dolunay.ai/en',
      'x-default': 'https://dolunay.ai/',
    },
  },
}

export default function Home() {
  return (
    <>
      {/* F11 (seo_geo/BULGULAR.md): WebSite semasi YALNIZ ana sayfaya girer.
          Sitede calisan bir arama kutusu olmadigi icin potentialAction/
          SearchAction BILEREK eklenmedi — olmayan bir ozelligi beyan etmeyiz. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'dolunay.ai',
            url: 'https://dolunay.ai',
            inLanguage: 'tr-TR',
            publisher: { '@id': 'https://dolunay.ai/#organization' },
          }),
        }}
      />
      <HeroSectionElevate bgImage="/hero_bg/hero_Elevate_New_V1.webp" />
      <LogoStrip />
      <ProductsSection />
    </>
  )
}
