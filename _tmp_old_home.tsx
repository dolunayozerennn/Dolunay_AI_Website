import { HeroSectionElevate } from '../components/sections/HeroSectionElevate';
import { ProductsSection } from '../components/sections/ProductsSection';

export function HomePage() {
  return (
    <>
      <HeroSectionElevate bgImage="hero_bg/hero_Elevate_New_V1.jpg" />
      <ProductsSection />
    </>
  );
}
