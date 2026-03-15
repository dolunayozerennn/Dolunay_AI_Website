import { HeroSectionAcosta } from '../components/sections/HeroSectionAcosta';
import { HeroSectionHormozi } from '../components/sections/HeroSectionHormozi';
import { HeroSectionElevate } from '../components/sections/HeroSectionElevate';
import { HeroSection } from '../components/sections/HeroSection';

export function ShowcasePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-black text-white text-center py-4 border-b border-white/10 z-50 sticky top-0 backdrop-blur-md">
        <h2 className="text-xl font-bold">Elevate Varyasyonları (Mavi/Mor Yeni Tasarım)</h2>
        <p className="text-sm text-gray-400">Aşağıya kaydırarak farklı kıyafet ve poz varyasyonlarını inceleyebilirsiniz.</p>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <button onClick={() => document.getElementById('hero-v1')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition cursor-pointer">Varyasyon 1 (Gömlek 1 - Off-Camera)</button>
          <button onClick={() => document.getElementById('hero-v2')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition cursor-pointer">Varyasyon 2 (Gömlek 2 - Koyu)</button>
          <button onClick={() => document.getElementById('hero-v3')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition cursor-pointer">Varyasyon 3 (Kazak 1)</button>
          <button onClick={() => document.getElementById('hero-v4')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition cursor-pointer">Varyasyon 4 (Gömlek 3)</button>
          <button onClick={() => document.getElementById('hero-v5')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition cursor-pointer">Varyasyon 5 (Kazak 2 - Mock-neck)</button>
        </div>
      </div>
      
      <div id="hero-v1">
        <HeroSectionElevate bgImage="hero_bg/hero_Elevate_New_V1.jpg" />
      </div>

      <div id="hero-v2">
        <HeroSectionElevate bgImage="hero_bg/hero_Elevate_New_V2.jpg" />
      </div>

      <div id="hero-v3">
        <HeroSectionElevate bgImage="hero_bg/hero_Elevate_New_V3.jpg" />
      </div>

      <div id="hero-v4">
        <HeroSectionElevate bgImage="hero_bg/hero_Elevate_New_V4.jpg" />
      </div>

      <div id="hero-v5">
        <HeroSectionElevate bgImage="hero_bg/hero_Elevate_New_V5.jpg" />
      </div>
    </div>
  );
}
