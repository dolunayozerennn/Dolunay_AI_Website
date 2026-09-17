import dynamic from 'next/dynamic'
import { HeroSectionElevate } from '@/components/sections/HeroSectionElevate'

const ProductsSection = dynamic(() => import('@/components/sections/ProductsSection').then(mod => mod.ProductsSection))
const LogoStrip = dynamic(() => import('@/components/sections/LogoStrip').then(mod => mod.LogoStrip))

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
