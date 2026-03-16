import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setIsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setIsDropdownOpen(false), 200);
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-50 flex justify-center transition-all duration-500 ${
        isScrolled ? 'pt-3' : 'pt-6'
      } px-4 sm:px-6`}
    >
      <div className="flex items-center justify-between w-full max-w-[1240px] bg-[#0c0c14]/40 backdrop-blur-xl border border-white/[0.08] rounded-full px-4 sm:px-5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        
        {/* Left Side: Logo + Links */}
        <div className="flex items-center gap-8 lg:gap-12">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group shrink-0 pl-2">
            <span className="text-xl font-bold tracking-tight text-white">
              dolunay<span className="text-gradient-accent">.ai</span>
            </span>
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {/* Çözümler — Dropdown */}
            <div 
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-all duration-300"
              >
                Çözümler
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-0 mt-2 w-56 bg-[#0c0c14]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl shadow-black/40"
                  >
                    <a
                      href="#artifex"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex flex-col px-5 py-3.5 hover:bg-white/[0.04] transition-all duration-300 border-b border-white/[0.04]"
                    >
                      <span className="text-sm font-medium text-white">Artifex Campus</span>
                      <span className="text-xs text-gray-500 mt-0.5">Hazır AI çözüm paketleri</span>
                    </a>
                    <a
                      href="#/cozumler"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex flex-col px-5 py-3.5 hover:bg-white/[0.04] transition-all duration-300"
                    >
                      <span className="text-sm font-medium text-white">Hizmetler</span>
                      <span className="text-xs text-gray-500 mt-0.5">Özel AI otomasyon & danışmanlık</span>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AI Factory — External Link */}
            <a 
              href="https://www.skool.com/yapay-zeka-factory/about?ref=044f39496d4f45fab11775bcefe4b7f4" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-all duration-300"
            >
              AI Factory
            </a>

            {/* İş Birlikleri */}
            <a 
              href="#collaborations"
              className="text-sm font-medium text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-all duration-300"
            >
              İş Birlikleri
            </a>

            {/* Hakkımızda */}
            <a 
              href="#about"
              className="text-sm font-medium text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-all duration-300"
            >
              Hakkımızda
            </a>
          </div>
        </div>

        {/* Right Side: CTA Button + Mobile Menu Button */}
        <div className="flex items-center gap-2">
          {/* Neon CTA Button */}
          <div className="hidden md:flex">
            <a 
              href="#/cozumler" 
              className="flex items-center gap-2 bg-[#D4FF00] hover:bg-[#C2E600] text-black px-6 py-2.5 rounded-full font-bold text-[13px] uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(212,255,0,0.15)] hover:shadow-[0_0_30px_rgba(212,255,0,0.3)] hover:scale-105"
            >
              Danışmanlık Al
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center pr-1">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors p-2"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-[calc(100%+12px)] w-[calc(100%-2rem)] max-w-sm mx-auto left-4 right-4 bg-[#0c0c14]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-2xl"
          >
            <div className="flex flex-col space-y-1">
              <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Çözümler</div>
              <a 
                href="#artifex"
                className="text-gray-300 hover:text-white font-medium px-4 py-2.5 rounded-lg hover:bg-white/[0.04] transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Artifex Campus
              </a>
              <a 
                href="#/cozumler"
                className="text-gray-300 hover:text-white font-medium px-4 py-2.5 rounded-lg hover:bg-white/[0.04] transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hizmetler
              </a>

              <div className="h-px bg-white/[0.08] my-3 mx-2" />

              <a 
                href="https://www.skool.com/yapay-zeka-factory/about?ref=044f39496d4f45fab11775bcefe4b7f4" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white font-medium px-4 py-2.5 rounded-lg hover:bg-white/[0.04] transition-all flex items-center justify-between"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                AI Factory <span className="text-gray-500 text-xs">↗</span>
              </a>
              <a 
                href="#collaborations"
                className="text-gray-300 hover:text-white font-medium px-4 py-2.5 rounded-lg hover:bg-white/[0.04] transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                İş Birlikleri
              </a>
              <a 
                href="#about"
                className="text-gray-300 hover:text-white font-medium px-4 py-2.5 rounded-lg hover:bg-white/[0.04] transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hakkımızda
              </a>
              
              {/* Mobile CTA */}
              <a 
                href="#/cozumler"
                className="mt-4 flex items-center justify-center gap-2 w-full bg-[#D4FF00] text-black px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Danışmanlık Al
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

