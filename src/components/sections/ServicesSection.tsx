'use client'

import { motion } from 'framer-motion'
import { Search, Target, Settings, CheckCircle2, ArrowUpRight, Building2 } from 'lucide-react'
import { useTranslation } from '@/i18n/i18n'

const fadeUp = {
  hidden: { opacity: 0, y: 50, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }
  })
};

const serviceClients = [
  { name: 'VARTUR', logo: '/images/logos/images (24).jpeg', invert: false },
  { name: 'musixXen', logo: '/images/logos/unnamed (4).jpg', invert: false },
  { name: 'CAM Hotel', logo: '/images/logos/cam-logo-new (3).webp', invert: false },
  { name: 'Rgwel', logo: '/images/logos/rgwel-logo.png', invert: false },
  { name: 'Forbest', logo: '/images/logos/images (8).png', invert: false },
  { name: 'Acarsan', logo: '/images/logos/356395_259272.webp', invert: false },
  { name: 'WeBee', logo: '/images/logos/images (8) copy.png', invert: false },
  { name: 'VoyantAI', logo: '/images/logos/Screenshot 2026-03-16 at 22.06.12.png', invert: false },
  { name: 'Udemy', logo: '/images/logos/Udemy_logo.svg (1).png', invert: true },
  { name: 'GittiGidiyor', logo: '/images/logos/images (8) copy 2.png', invert: false },
];

export function ServicesSection() {
  const { t } = useTranslation();

  const steps = [
    { icon: <Search className="w-6 h-6" />, title: t('services.step1Title'), desc: t('services.step1Desc'), num: "01" },
    { icon: <Target className="w-6 h-6" />, title: t('services.step2Title'), desc: t('services.step2Desc'), num: "02" },
    { icon: <Settings className="w-6 h-6" />, title: t('services.step3Title'), desc: t('services.step3Desc'), num: "03" },
    { icon: <CheckCircle2 className="w-6 h-6" />, title: t('services.step4Title'), desc: t('services.step4Desc'), num: "04" },
  ];

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
            {t('services.sectionTag')}
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            {t('services.sectionTitle')}{' '}
            <span className="text-gradient-accent">{t('services.sectionTitleHighlight')}</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-gray-400 text-lg leading-relaxed">
            {t('services.sectionDesc')}
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

        {/* Logo Marquee */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-32"
        >
          <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3 justify-center mb-10">
            <Building2 className="w-4 h-4 text-electric-blue" />
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-[0.2em]">{t('services.clientsTitle')}</span>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={1}
            className="relative py-8 rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.015) 0%, rgba(0,212,255,0.02) 50%, rgba(124,58,237,0.015) 100%)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050508] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050508] to-transparent z-10 pointer-events-none" />

            <div className="flex animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused]">
              {[...serviceClients, ...serviceClients].map((client, i) => (
                <div
                  key={`${client.name}-${i}`}
                  className="flex-shrink-0 px-10 md:px-14 flex items-center justify-center"
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className={`h-10 md:h-12 w-auto object-contain opacity-50 hover:opacity-100 transition-all duration-500 select-none ${client.invert ? 'invert' : ''}`}
                  />
                </div>
              ))}
            </div>
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
          <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-electric-blue/40 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-electric-blue/5 blur-[100px] rounded-full pointer-events-none" />
          
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-5 tracking-tight relative z-10">
            {t('services.ctaTitle')}
          </h3>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto relative z-10 leading-relaxed">
            {t('services.ctaDesc')}
          </p>
          <a href="mailto:savas@dolunay.ai" className="group relative inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-electric-blue/20 to-accent-purple/20 border border-electric-blue/30 hover:border-electric-blue/60 transition-all duration-500 hover:shadow-[0_0_50px_rgba(0,212,255,0.2)] z-10">
            savas@dolunay.ai
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>
        
      </div>
    </section>
  );
}
