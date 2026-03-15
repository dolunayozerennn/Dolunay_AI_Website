import { HeroSectionAcosta } from '../components/sections/HeroSectionAcosta';
import { ProductsSection } from '../components/sections/ProductsSection';

export function HomePage() {
  return (
    <>
      <HeroSectionAcosta bgImage="hero_bg/hero_Cyberpunk_Neon_356a4f52.jpg" />
      <ProductsSection />
    </>
  );
}
