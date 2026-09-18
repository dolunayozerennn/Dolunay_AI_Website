import dynamic from 'next/dynamic'
import { HeroSectionElevate } from '@/components/sections/HeroSectionElevate'

const ProductsSection = dynamic(() => import('@/components/sections/ProductsSection').then(mod => mod.ProductsSection))
const LogoStrip = dynamic(() => import('@/components/sections/LogoStrip').then(mod => mod.LogoStrip))

// F9: TR anasayfasinin (src/app/page.tsx) birebir aynisi; tek fark WebSite
// semasinin dili ve adresi. Govde metni zaten HeroSectionElevate/LogoStrip/
// ProductsSection icindeki useTranslation() ile geliyor -- bu sayfa /en
// altinda oldugu icin i18n.tsx artik otomatik 'en' cevirisini basar.
export default function EnglishHome() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'dolunay.ai',
            url: 'https://dolunay.ai/en',
            inLanguage: 'en-US',
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
