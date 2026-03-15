import { motion } from 'framer-motion';
import { ArrowRight, Users, Clock, Zap } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 50, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }
  })
};

export function ArtifexCampusSection() {
  return (
    <section id="artifex" className="py-32 relative overflow-hidden">
      <div className="section-divider max-w-5xl mx-auto mb-32" />
      
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-purple/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-electric-blue/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Value Proposition */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-left"
          >
            <motion.span variants={fadeUp} custom={0} className="inline-block text-accent-purple text-sm font-semibold tracking-[0.2em] uppercase mb-6">
              B2B Çözümler
            </motion.span>
            
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-6xl font-bold leading-[1.1] mb-8 tracking-tight">
              3 kişinin 1 haftada yaptığı işi,{' '}
              <span className="text-gradient-accent">birlikte 1 saatte yapıyoruz.</span>
            </motion.h2>
            
            <motion.p variants={fadeUp} custom={2} className="text-lg text-gray-400 mb-12 leading-relaxed max-w-lg">
              İşletmeniz için personel tasarrufu sağlayan, operasyonel yükü sıfıra indiren 
              sonuç odaklı yapay zeka otomasyonlarını birlikte kuruyoruz.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="space-y-5">
              {[
                { icon: <Users className="w-5 h-5" />, title: "Personel Tasarrufu", desc: "Rutin işler için ekibe değil, sisteme birlikte yatırım yapıyoruz.", color: "text-accent-purple bg-accent-purple/10 border-accent-purple/20" },
                { icon: <Clock className="w-5 h-5" />, title: "7/24 Kesintisiz Operasyon", desc: "Kurduğumuz yapay zeka uyumaz, hata yapmaz, mola vermez.", color: "text-electric-blue bg-electric-blue/10 border-electric-blue/20" },
                { icon: <Zap className="w-5 h-5" />, title: "Anında Ölçeklenme", desc: "Talepleriniz arttığında sisteminiz bizimle birlikte büyür.", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp} custom={4 + i} className="flex items-start gap-4 group">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${item.color} transition-all duration-300 group-hover:scale-110`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white">{item.title}</h4>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Lead Form */}
          <motion.div
            initial={{ opacity: 0, y: 60, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bento-card !p-8 md:!p-10 relative"
          >
            <div className="absolute -top-px left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-accent-purple/50 to-transparent" />
            
            <div className="relative z-10">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-3">Hemen Görüşelim</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Ücretsiz keşif görüşmesi için bilgilerinizi bırakın, 
                  işletmenize özel AI haritasını birlikte çıkaralım.
                </p>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {[
                  { id: "name", label: "Ad Soyad", placeholder: "Ahmet Yılmaz", type: "text" },
                  { id: "company", label: "Şirket Adı", placeholder: "Şirketiniz A.Ş.", type: "text" },
                  { id: "phone", label: "Telefon Numarası", placeholder: "+90 (555) 000 0000", type: "tel" },
                ].map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">{field.label}</label>
                    <input 
                      type={field.type} 
                      id={field.id}
                      placeholder={field.placeholder}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-accent-purple/50 focus:bg-white/[0.05] transition-all duration-300"
                    />
                  </div>
                ))}

                <button className="w-full mt-2 bg-gradient-to-r from-accent-purple to-electric-blue hover:from-accent-violet hover:to-electric-blue text-white font-semibold py-4 px-6 rounded-xl transition-all duration-500 shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_50px_rgba(124,58,237,0.5)] flex justify-center items-center gap-2 group">
                  <span>Sizi Arayalım</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
