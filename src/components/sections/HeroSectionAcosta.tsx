import { motion } from 'framer-motion';

function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HeroSectionAcosta({ bgImage }: { bgImage: string }) {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center bg-cover bg-center bg-no-repeat bg-[#050508]"
      style={{ backgroundImage: `url('${bgImage}')` }}
      id="hero-acosta"
    >
      {/* Dark overlay for text readability on left side */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      
      {/* Grid overlay for cyberpunk feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 pt-24 pb-16">
        <div className="max-w-2xl">
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-2 mb-6 text-sm font-semibold tracking-widest text-[#a855f7] uppercase">
              <span className="w-8 h-[1px] bg-[#a855f7]"></span>
              Dolunay Özeren | AI Eğitmen & Builder
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <h1 className="font-display text-[clamp(2.5rem,6vw,6.5rem)] font-bold tracking-tight leading-[1] text-white mb-6">
              Connect.<br />Build.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#a855f7]">Inspire.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.4}>
            <p className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
              Yapay zekadan sadece teorik olarak değil, pratik olarak faydalanmayı öğren. Şirketini geleceğe taşı.
            </p>
          </Reveal>

          <Reveal delay={0.55}>
            <div className="flex flex-wrap items-center gap-12 border-t border-white/10 pt-8 mt-4">
              <div>
                <div className="text-3xl font-display font-bold text-white mb-1">500+</div>
                <div className="text-sm text-gray-400">Başarılı Üye</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-white mb-1">500,000+</div>
                <div className="text-sm text-gray-400">Takipçi kitlesi</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-white mb-1">#1</div>
                <div className="text-sm text-gray-400">AI Personal Brand</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
