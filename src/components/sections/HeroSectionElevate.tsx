import { motion } from 'framer-motion';

function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 1, 0.5, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HeroSectionElevate({ bgImage }: { bgImage: string }) {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center bg-cover bg-center bg-[#1a1110]"
      style={{ backgroundImage: `url('${bgImage}')` }}
      id="hero-elevate"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/60 to-transparent opacity-90" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 pt-24 pb-16">
        <div className="max-w-[42rem]">
          <Reveal delay={0.1}>
            <h1 className="font-display text-[clamp(2.5rem,5vw,5rem)] font-medium tracking-tight leading-[1.1] text-white mb-6">
              Sadece bir şirket değil.
              <br />
              <span className="font-bold text-[#ff9966]">Yapay zekayla bir hareket.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="text-gray-300 text-lg sm:text-slate-300 sm:text-xl font-light leading-relaxed mb-10 max-w-lg">
              Gerçek otomasyonlar kurarak bağları fırsatlara dönüştürmene yardımcı olan premium eğitim ve danışmanlık.
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-medium px-8 py-4 sm:px-10 sm:py-4 rounded-full transition-all group flex items-center justify-center gap-3">
                Ücretsiz Görüşme Talep Et
                <span className="bg-white text-black p-1.5 rounded-full inline-block group-hover:translate-x-1 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.6}>
            <div className="flex flex-wrap items-center gap-12 pt-12 mt-12 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                  <svg className="w-5 h-5 text-[#ff9966]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">200+</div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Başarılı Üye</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                  <svg className="w-5 h-5 text-[#ff9966]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">6M+</div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Erişim Ağı</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                  <svg className="w-5 h-5 text-[#ff9966]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">3k+</div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Mutlu Müşteri</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
