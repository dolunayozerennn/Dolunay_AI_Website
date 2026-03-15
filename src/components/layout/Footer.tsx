import { Instagram, Youtube, Linkedin, Twitter } from 'lucide-react';

// TikTok icon (lucide-react doesn't have it)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.6a8.2 8.2 0 0 0 4.76 1.52V6.69h-1z" />
    </svg>
  );
}

export function Footer() {
  const socialLinks = [
    { icon: <Instagram className="w-4 h-4" />, href: "https://instagram.com/dolunayozeren", label: "Instagram" },
    { icon: <TikTokIcon className="w-4 h-4" />, href: "https://tiktok.com/@dolunayozeren", label: "TikTok" },
    { icon: <Youtube className="w-4 h-4" />, href: "https://youtube.com/@dolunayozeren", label: "YouTube" },
    { icon: <Twitter className="w-4 h-4" />, href: "https://x.com/dolunayozeren", label: "X" },
    { icon: <Linkedin className="w-4 h-4" />, href: "https://linkedin.com/in/dolunayozeren", label: "LinkedIn" },
  ];

  return (
    <footer className="relative pt-20 pb-10 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main footer content — 2 columns */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-16">
          {/* Left — Brand & Bio */}
          <div className="max-w-md">
            <span className="text-xl font-bold tracking-tight text-white">
              dolunay<span className="text-gradient-accent">.ai</span>
            </span>
            <p className="text-gray-500 text-sm mt-4 leading-relaxed">
              Yapay zeka eğitmeni ve builder. İşletmeler için AI otomasyon çözümleri üretiyor,
              girişimcilere yapay zekayı iş modeline dönüştürmeyi öğretiyorum.
            </p>
          </div>
          
          {/* Right — Social Icons */}
          <div className="flex gap-3">
            {socialLinks.map((s) => (
              <a 
                key={s.label} 
                href={s.href} 
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/[0.15] hover:bg-white/[0.08] transition-all duration-300"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="section-divider mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">
            © 2026 dolunay.ai
          </p>
        </div>
      </div>
    </footer>
  );
}
