import { HeroSectionElevate } from '@/components/sections/HeroSectionElevate'
import { ProductsSection } from '@/components/sections/ProductsSection'

export default function Home() {
  return (
    <>
      <HeroSectionElevate bgImage="images/background.jpg" />
      <ProductsSection />
    </>
  )
}
