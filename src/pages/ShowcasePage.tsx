import { HeroSectionAcosta } from '../components/sections/HeroSectionAcosta';
import { HeroSectionHormozi } from '../components/sections/HeroSectionHormozi';
import { HeroSectionElevate } from '../components/sections/HeroSectionElevate';
import { HeroSection } from '../components/sections/HeroSection';

export function ShowcasePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-black text-white text-center py-4 border-b border-white/10 z-50 sticky top-0 backdrop-blur-md">
        <h2 className="text-xl font-bold">Elevate Varyasyonları</h2>
        <p className="text-sm text-gray-400">Aşağıya kaydırarak farklı kıyafet varyasyonlarını inceleyebilirsiniz.</p>
        <div className="flex justify-center gap-4 mt-4">
          <button onClick={() => document.getElementById('hero-v1')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition cursor-pointer">Varyasyon 1 (Smart Casual Gömlek)</button>
          <button onClick={() => document.getElementById('hero-v2')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition cursor-pointer">Varyasyon 2 (Koyu Yakalı)</button>
          <button onClick={() => document.getElementById('hero-v3')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition cursor-pointer">Varyasyon 3 (Casual Gömlek)</button>
        </div>
      </div>
      
      <div id="hero-v1">
        <HeroSectionElevate bgImage="hero_bg/hero_Elevate_V1_aba39aa8.jpg" />
      </div>

      <div id="hero-v2">
        <HeroSectionElevate bgImage="hero_bg/hero_Elevate_V2_202ba49d.jpg" />
      </div>

      <div id="hero-v3">
        <HeroSectionElevate bgImage="hero_bg/hero_Elevate_V3_93de85d5.jpg" />
      </div>
    </div>
  );
}
