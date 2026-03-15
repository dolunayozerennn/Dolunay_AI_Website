import { motion } from 'framer-motion';
import { useRef } from 'react';
import type { MouseEvent } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 50, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }
  })
};

interface ProductCardProps {
  title: string;
  description: string;
  tag: string;
  href: string;
  external?: boolean;
  accentColor: string;
  glowColor: string;
  imageSrc: string;
  isPrimary?: boolean;
  custom: number;
}

function ProductCard({ title, description, tag, href, external, glowColor, imageSrc, isPrimary, custom }: ProductCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouse = (e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty('--mouse-x', `${x}%`);
    cardRef.current.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <motion.a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      ref={cardRef}
      variants={fadeUp}
      custom={custom}
      onMouseMove={handleMouse}
      className={`group flex flex-col h-[520px] rounded-[2rem] p-5 overflow-hidden relative transition-all duration-500 hover:-translate-y-2 ${
        isPrimary 
          ? 'bg-gradient-to-br from-[#7e22ce] to-[#581c87] border-none shadow-[0_8px_30px_rgba(126,34,206,0.3)]' 
          : 'bg-[#0f0f12] border border-white/10 hover:border-white/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
      }`}
    >
      {/* Background glow on hover */}
      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: glowColor }}
      />
      
      {/* Top Header Row (Tag & Arrow) */}
      <div className="flex items-center justify-between w-full mb-6 z-10 relative">
        <div 
          className={`px-4 py-1 text-xs font-semibold rounded-full border transition-colors ${
            isPrimary 
              ? 'border-white/30 text-white bg-white/10' 
              : 'border-white/10 text-gray-300 bg-white/5 group-hover:bg-white/10 group-hover:text-white'
          }`}
        >
          {tag}
        </div>
        <div 
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            isPrimary 
              ? 'bg-white text-[#6b21a8] group-hover:scale-110 shadow-lg' 
              : 'bg-white/5 text-white border border-white/10 group-hover:bg-white group-hover:text-black group-hover:scale-110'
          }`}
        >
          {external ? <ExternalLink className="w-4 h-4" /> : <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col mb-6">
        <h3 className="text-2xl font-bold text-white mb-3 leading-tight tracking-tight font-display">{title}</h3>
        <p className={`text-[15px] leading-relaxed line-clamp-3 ${isPrimary ? 'text-purple-100/90' : 'text-gray-400 group-hover:text-gray-300 transition-colors'}`}>
          {description}
        </p>
      </div>

      {/* Image Container */}
      <div className="relative w-full flex-1 rounded-2xl overflow-hidden mt-auto bg-black/50 border border-white/5">
        <div className={`absolute inset-0 z-10 bg-gradient-to-t ${isPrimary ? 'from-[#581c87]/90 via-[#581c87]/20' : 'from-[#0f0f12]/90 via-[#0f0f12]/20'} to-transparent opacity-80`} />
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
          </div>
        )}
      </div>
    </motion.a>
  );
}

export function ProductsSection() {
  const products = [
    {
      title: 'Artifex Campus',
      description: 'İşletmeni AI ile dönüştürecek hazır çözüm paketleri ve eğitimler.',
      tag: '1. Adım: Eğitim',
      href: '#artifex',
      external: false,
      accentColor: '#7c3aed',
      glowColor: 'rgba(124, 58, 237, 0.15)',
      imageSrc: '/images/products/artifex_campus.jpg',
      isPrimary: true,
    },
    {
      title: 'AI Factory',
      description: 'Yapay zekayı iş modeline dönüştüren girişimci topluluğu.',
      tag: '2. Adım: Topluluk',
      href: 'https://www.skool.com/yapay-zeka-factory/about?ref=044f39496d4f45fab11775bcefe4b7f4',
      external: true,
      accentColor: '#00d4ff',
      glowColor: 'rgba(0, 212, 255, 0.12)',
      imageSrc: '/images/products/ai_factory.jpg',
      isPrimary: false,
    },
    {
      title: 'Hizmetler',
      description: 'Şirketine özel kurumsal AI otomasyon ve sistem kurulumu.',
      tag: '3. Adım: Danışmanlık',
      href: '#services',
      external: false,
      accentColor: '#a855f7',
      glowColor: 'rgba(168, 85, 247, 0.12)',
      imageSrc: '/images/products/hizmetler.jpg',
      isPrimary: false,
    },
    {
      title: 'Marka İş Birlikleri',
      description: 'Markanızı milyonlarca kişiye ulaştıran profesyonel içerik üretim çözümleri.',
      tag: '4. Adım: İş Birliği',
      href: '#/isbirlikleri',
      external: false,
      accentColor: '#ec4899',
      glowColor: 'rgba(236, 72, 153, 0.12)',
      imageSrc: '/images/products/marka_is_birlikleri.jpg',
      isPrimary: false,
    },
  ];

  return (
    <section id="products" className="py-24 relative">
      <div className="section-divider max-w-5xl mx-auto mb-24" />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.map((product, i) => (
            <ProductCard key={product.title} {...product} custom={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
