import { HeroSectionAcosta } from '../components/sections/HeroSectionAcosta';
import { HeroSectionHormozi } from '../components/sections/HeroSectionHormozi';
import { HeroSectionElevate } from '../components/sections/HeroSectionElevate';
import { HeroSection } from '../components/sections/HeroSection';

export function ShowcasePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-black text-white text-center py-4 border-b border-white/10 z-50 sticky top-0 backdrop-blur-md">
        <h2 className="text-xl font-bold">Hero Section Alternatifleri</h2>
        <p className="text-sm text-gray-400">Aşağıya kaydırarak farklı varyasyonları inceleyebilirsiniz.</p>
        <div className="flex justify-center gap-4 mt-4">
          <button onClick={() => document.getElementById('hero-current')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition cursor-pointer">Mevcut</button>
          <button onClick={() => document.getElementById('hero-acosta')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition cursor-pointer">Acosta (Neon)</button>
          <button onClick={() => document.getElementById('hero-hormozi')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition cursor-pointer">Hormozi (Trust)</button>
          <button onClick={() => document.getElementById('hero-elevate')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition cursor-pointer">Elevate (Warm)</button>
        </div>
      </div>
      
      <div id="hero-current">
        <HeroSection />
      </div>

      <div id="hero-acosta">
        <HeroSectionAcosta bgImage="hero_bg/hero_Cyberpunk_Neon_356a4f52.jpg" />
      </div>

      <div id="hero-hormozi">
        <HeroSectionHormozi bgImage="hero_bg/hero_Trust_Scale_dd768729.jpg" />
      </div>

      <div id="hero-elevate">
        <HeroSectionElevate bgImage="hero_bg/hero_Authentic_Warm_5ff602c3.jpg" />
      </div>
    </div>
  );
}
