import { motion } from 'framer-motion';
import { Search, Target, Settings, CheckCircle2, ArrowUpRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 50, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }
  })
};

const steps = [
  { icon: <Search className="w-6 h-6" />, title: "Keşif & Analiz", desc: "Mevcut iş akışlarınızı birlikte dinliyor, AI ile optimize edilebilecek darboğazları tespit ediyoruz.", num: "01" },
  { icon: <Target className="w-6 h-6" />, title: "Sistem Tasarımı", desc: "İhtiyaçlarınıza en uygun yapay zeka araçlarını ve otomasyon senaryolarını birlikte haritalandırıyoruz.", num: "02" },
  { icon: <Settings className="w-6 h-6" />, title: "Kurulum & Entegrasyon", desc: "Sistemleri kuruyor, API bağlantılarını yapıyor ve birlikte test ediyoruz.", num: "03" },
  { icon: <CheckCircle2 className="w-6 h-6" />, title: "Eğitim & Teslim", desc: "Ekibinize sistemin nasıl kullanılacağını öğretiyor ve anahtar teslim bırakıyoruz.", num: "04" },
];

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

        {/* Contact CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          id="contact"
          className="bento-card !rounded-3xl !p-12 md:!p-16 text-center max-w-4xl mx-auto relative overflow-hidden"
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-electric-blue/40 to-transparent" />
          
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-electric-blue/5 blur-[100px] rounded-full pointer-events-none" />
          
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-5 tracking-tight relative z-10">
            Projeyi Birlikte İnşa Edelim
          </h3>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto relative z-10 leading-relaxed">
            Hizmetlerimiz, danışmanlık talepleriniz veya marka işbirlikleri için 
            bizimle doğrudan iletişime geçebilirsiniz.
          </p>
          <a href="mailto:hello@dolunay.ai" className="group relative inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-electric-blue/20 to-accent-purple/20 border border-electric-blue/30 hover:border-electric-blue/60 transition-all duration-500 hover:shadow-[0_0_50px_rgba(0,212,255,0.2)] z-10">
            hello@dolunay.ai
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>
        
      </div>
    </section>
  );
}
