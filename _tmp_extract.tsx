
// ─── Eğitim & Danışmanlık Referansları ─────────────────────────────────────────
const educationClients = [
  {
    name: 'Türkiye Finans Katılım Bankası',
    desc: '2 günlük yapay zeka araçları workshop\'u düzenlendi.',
    gradient: 'from-emerald-500 to-teal-600',
    bgGlow: 'rgba(52, 211, 153, 0.12)',
  },
  {
    name: 'Misyon Bankası',
    desc: '6 saatlik online eğitim serisi (5 seans, 120 katılımcı) düzenlendi. Personel ile bire bir danışmanlık gerçekleştirildi.',
    gradient: 'from-slate-400 to-slate-600',
    bgGlow: 'rgba(148, 163, 184, 0.12)',
  },
  {
    name: 'Başkent Üniversitesi',
    desc: 'Yapay zeka araçları eğitimi düzenlendi.',
    gradient: 'from-red-500 to-rose-600',
    bgGlow: 'rgba(239, 68, 68, 0.12)',
  },
  {
    name: 'Udemy',
    desc: '45.000+ öğrenciye ulaşan best-seller yapay zeka eğitimi yayınlandı.',
    gradient: 'from-violet-500 to-purple-700',
    bgGlow: 'rgba(139, 92, 246, 0.12)',
  },
  {
    name: 'GittiGidiyor',
    desc: 'Yapay zeka ve otomasyon eğitimi gerçekleştirildi.',
    gradient: 'from-orange-500 to-amber-600',
    bgGlow: 'rgba(249, 115, 22, 0.12)',
  },
  {
    name: 'Trendyol',
    desc: 'Yapay zeka araçları ve verimlilik eğitimi düzenlendi.',
    gradient: 'from-orange-600 to-red-500',
    bgGlow: 'rgba(234, 88, 12, 0.12)',
  },
];

function RefCard({ client, index }: { client: typeof educationClients[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const handleMouse = (e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty('--mouse-x', `${x}%`);
    cardRef.current.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <motion.div
      ref={cardRef}
      variants={fadeUp}
      custom={index}
      onMouseMove={handleMouse}
      className="bento-card !rounded-3xl group relative overflow-hidden"
    >
      {/* Top accent */}
      <div
        className="absolute -top-px left-[15%] right-[15%] h-[1px] opacity-40 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${client.bgGlow.replace('0.12', '0.9')}, transparent)` }}
      />
      {/* Background glow on hover */}
      <div
        className="absolute -top-10 -right-10 w-[180px] h-[180px] rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: client.bgGlow }}
      />

      <div className="relative z-10">
        {/* Icon + Name */}
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${client.gradient} flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 transition-transform duration-500`}>
          <GraduationCap className="w-5 h-5" />
        </div>
        <h4 className="text-lg font-bold text-white mb-2">{client.name}</h4>
        <p className="text-gray-500 text-sm leading-relaxed">{client.desc}</p>
      </div>
    </motion.div>
  );
}

export function ServicesSection() {
  return (
    <section id="services" className="py-32 relative">
      <div className="section-divider max-w-5xl mx-auto mb-32" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <motion.span variants={fadeUp} custom={0} className="inline-block text-electric-blue text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Hizmetler
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Danışmanlık &{' '}
            <span className="text-gradient-accent">Otomasyon</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-gray-400 text-lg leading-relaxed">
            Sadece standart paketler değil, kurumsal firmalar ve hacimli operasyonlar 
            için terzi işi yapay zeka altyapılarını birlikte kuruyoruz.
          </motion.p>
        </motion.div>

        {/* Process Steps — Bento Style */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-24"
        >
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              variants={fadeUp}
              custom={i}
              className="bento-card !rounded-3xl group relative"
            >
              {/* Step number watermark */}
              <span className="absolute top-4 right-4 text-5xl font-bold text-white/[0.03] group-hover:text-white/[0.06] transition-all duration-500">
                {step.num}
              </span>
              
              <div className="w-12 h-12 rounded-2xl bg-electric-blue/10 border border-electric-blue/20 flex items-center justify-center mb-6 text-electric-blue group-hover:scale-110 transition-transform duration-500">
                {step.icon}
              </div>
              <h4 className="text-lg font-bold text-white mb-3">{step.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/*  HİZMET MÜŞTERİLERİ — LOGO MARQUEE                                  */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-32"
        >
          <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3 justify-center mb-10">
            <Building2 className="w-4 h-4 text-electric-blue" />
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-[0.2em]">Hizmet Müşterilerimiz</span>
          </motion.div>

          {/* Logo strip with subtle background */}
          <motion.div
            variants={fadeUp}
            custom={1}
            className="relative py-8 rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.015) 0%, rgba(0,212,255,0.02) 50%, rgba(124,58,237,0.015) 100%)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            {/* Fade masks */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050508] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050508] to-transparent z-10 pointer-events-none" />

            {/* Scrolling logo row */}
            <div className="flex animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused]">
              {[...serviceClients, ...serviceClients].map((client, i) => (
                <div
                  key={`${client.name}-${i}`}
                  className="flex-shrink-0 px-10 md:px-14 flex items-center justify-center"
                >
                  <img
                    src={`${import.meta.env.BASE_URL}${client.logo}`}
                    alt={client.name}
                    className={`h-10 md:h-12 w-auto object-contain opacity-50 hover:opacity-100 transition-all duration-500 select-none ${client.invert ? 'invert' : ''}`}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/*  EĞİTİM & DANIŞMANLIK REFERANSLARI                                   */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mb-32"
        >
          <motion.div variants={fadeUp} custom={0} className="text-center max-w-3xl mx-auto mb-14">
            <div className="flex items-center gap-3 justify-center mb-4">
              <GraduationCap className="w-4 h-4 text-accent-purple" />
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-[0.2em]">Eğitim & Danışmanlık Referansları</span>
            </div>
            <motion.h3 variants={fadeUp} custom={1} className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
              Birlikte çalıştığımız{' '}
              <span className="text-gradient-accent">kurumlar</span>
            </motion.h3>
            <motion.p variants={fadeUp} custom={2} className="text-gray-400 leading-relaxed">
              Türkiye'nin önde gelen kurum ve kuruluşlarına yapay zeka eğitimleri ve danışmanlık hizmetleri sunduk.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {educationClients.map((client, i) => (
              <RefCard key={client.name} client={client} index={i} />
            ))}
          </motion.div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          id="contact"
          className="bento-card !rounded-3xl !p-12 md:!p-16 text-center max-w-4xl mx-auto relative overflow-hidden"
        >
