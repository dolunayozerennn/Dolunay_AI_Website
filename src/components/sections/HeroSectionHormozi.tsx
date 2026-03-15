import { motion } from 'framer-motion';

function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HeroSectionHormozi({ bgImage }: { bgImage: string }) {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-end pb-24 lg:justify-center lg:pb-0 bg-cover bg-center bg-[#070b13]"
      style={{ backgroundImage: `url('${bgImage}')` }}
      id="hero-hormozi"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 pt-32 pb-16">
        <div className="max-w-2xl bg-black/40 backdrop-blur-md border border-white/10 p-8 sm:p-12 rounded-3xl">
          <Reveal delay={0.1}>
            <p className="text-yellow-400 font-serif italic text-2xl sm:text-3xl mb-2 flex items-center gap-4">
              <span className="h-[2px] w-8 bg-yellow-400"></span>
              Geleceğin Şirket Modeli
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <h1 className="font-display uppercase text-[clamp(2.5rem,6vw,5.5rem)] font-black tracking-tighter leading-[0.9] text-white mb-6">
              YAPAY<br/>
              ZEKADAN<br/>
              FAYDALAN
            </h1>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="flex items-center gap-6 mt-10">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold uppercase tracking-widest px-8 py-4 sm:px-12 sm:py-5 rounded-full transition-all">
                HİZMETLERİ KEŞFET
              </button>
              <div className="hidden sm:block">
                <div className="flex gap-1 text-yellow-400 text-lg">
                  ★★★★★
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold mt-1">
                  10B+ Başarılı Öğrenci
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Floating Timer / Bottom banner style equivalent */}
        <Reveal delay={0.6}>
          <div className="mt-12 inline-flex items-center gap-8 bg-white/5 border border-white/10 backdrop-blur-xl px-8 py-4 rounded-2xl">
            <span className="text-white font-bold uppercase tracking-wider">Erken Kayıt</span>
            <div className="flex items-center gap-4 border-l border-white/20 pl-6">
              <div className="text-center">
                <div className="text-3xl font-display font-black text-white">03</div>
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Gün</div>
              </div>
              <div className="text-white/50 text-2xl">:</div>
              <div className="text-center">
                <div className="text-3xl font-display font-black text-white">12</div>
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Saat</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
