import { motion } from 'framer-motion';
import { Play, TrendingUp, ShoppingCart, Building2, Home, Linkedin } from 'lucide-react';
import { useRef } from 'react';
import type { MouseEvent } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 50, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
};

const automations = [
  { icon: <Play className="w-6 h-6" />, title: "YouTube Otomasyonu", desc: "Kanal yönetiminizi, içerik üretiminizi ve SEO süreçlerinizi birlikte otopilota alıyoruz.", color: "text-red-400", size: "md:col-span-2" },
  { icon: <TrendingUp className="w-6 h-6" />, title: "Influencer Otomasyonu", desc: "Marka işbirliklerinizi ve DM yönetiminizi yapay zeka ile birlikte ölçeklendiriyoruz.", color: "text-pink-400", size: "" },
  { icon: <ShoppingCart className="w-6 h-6" />, title: "Süpermarket Otomasyonu", desc: "Stok takibi ve müşteri ilişkilerinize akıllı çözümler getiriyoruz.", color: "text-green-400", size: "" },
  { icon: <Building2 className="w-6 h-6" />, title: "Otel Otomasyonu", desc: "Rezervasyon ve misafir iletişiminizi 7/24 AI ile yönetiyoruz.", color: "text-amber-400", size: "" },
  { icon: <Home className="w-6 h-6" />, title: "Emlak Otomasyonu", desc: "Lead toplama ve müşteri eşleştirme süreçlerinizi birlikte hızlandırıyoruz.", color: "text-orange-400", size: "" },
  { icon: <Linkedin className="w-6 h-6" />, title: "LinkedIn Otomasyonu", desc: "B2B ağ büyümenizi ve satış tünellerinizi birlikte otomatikleştiriyoruz.", color: "text-blue-400", size: "md:col-span-2" },
];

const testimonials = [
  { name: "Mehmet Y.", role: "E-Ticaret Girişimcisi", text: "AI Factory sayesinde YouTube kanalım 3 ayda 100K aboneye ulaştı." },
  { name: "Ayşe K.", role: "Dijital Pazarlamacı", text: "Influencer otomasyonu ile müşterilerime çok daha hızlı dönüş sağlıyorum." },
  { name: "Can D.", role: "Emlak Danışmanı", text: "Lead toplama sürecim tamamen otomatik. Her gün yeni müşterilerle tanışıyorum." },
];

function BentoCard({ children, className = "", custom = 0 }: { children: React.ReactNode; className?: string; custom?: number }) {
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
      custom={custom}
      onMouseMove={handleMouse}
      className={`bento-card ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function AIFactorySection() {
  return (
    <section id="ai-factory" className="py-32 relative">
      <div className="section-divider max-w-5xl mx-auto mb-32" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.span variants={fadeUp} custom={0} className="inline-block text-electric-blue text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            AI Factory
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Yapay zekâ ile kendi işinizi kurun,{' '}
            <span className="text-gradient-accent">gelirinizi birlikte büyütelim.</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-gray-400 text-lg leading-relaxed">
            Dolunay Özeren'in kurduğu AI Factory, bireysel girişimciler ve freelancerlar 
            için kullanıma hazır otomasyon sistemleri sunan premium topluluktur.
          </motion.p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-24"
        >
          {automations.map((item, i) => (
            <BentoCard key={i} custom={i} className={item.size}>
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-5 ${item.color}`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </BentoCard>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <motion.h3 variants={fadeUp} custom={0} className="text-center text-gray-500 text-sm font-semibold tracking-[0.2em] uppercase mb-10">
            Başarı Hikayeleri
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <BentoCard key={i} custom={i + 1} className="!p-6">
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue/30 to-accent-purple/30 flex items-center justify-center text-sm font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </BentoCard>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
