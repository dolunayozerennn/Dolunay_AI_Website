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
  cta: string;
  href: string;
  external?: boolean;
  accentColor: string;
  glowColor: string;
  custom: number;
}

function ProductCard({ title, description, cta, href, external, accentColor, glowColor, custom }: ProductCardProps) {
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
      className="bento-card group flex flex-col justify-between h-full relative"
    >
      {/* Top accent line */}
      <div 
        className="absolute -top-px left-[15%] right-[15%] h-[1px] opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
      />
      
      {/* Background glow on hover */}
      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: glowColor }}
      />

      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>

      <div className="relative z-10 mt-8">
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold
            border transition-all duration-500 group/btn"
          style={{
            borderColor: `${accentColor}33`,
            background: `linear-gradient(135deg, ${accentColor}14, transparent)`,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = `${accentColor}66`;
            (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${accentColor}20`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = `${accentColor}33`;
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          <span className="text-white">{cta}</span>
          {external ? (
            <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-white transition-colors" />
          ) : (
            <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover/btn:translate-x-0.5 group-hover/btn:text-white transition-all" />
          )}
        </a>
      </div>
    </motion.div>
  );
}

export function ProductsSection() {
  const products = [
    {
      title: 'Artifex Campus',
      description: 'İşletmeni AI ile dönüştürecek hazır çözüm paketleri.',
      cta: 'Keşfet',
      href: '#artifex',
      external: false,
      accentColor: '#7c3aed',
      glowColor: 'rgba(124, 58, 237, 0.08)',
    },
    {
      title: 'AI Factory',
      description: 'Yapay zekayı iş modeline dönüştüren girişimci topluluğu.',
      cta: 'Katıl',
      href: 'https://www.skool.com/yapay-zeka-factory/about?ref=044f39496d4f45fab11775bcefe4b7f4',
      external: true,
      accentColor: '#00d4ff',
      glowColor: 'rgba(0, 212, 255, 0.08)',
    },
    {
      title: 'Hizmetler',
      description: 'Şirketine özel AI otomasyon ve danışmanlık.',
      cta: 'İncele',
      href: '#services',
      external: false,
      accentColor: '#a855f7',
      glowColor: 'rgba(168, 85, 247, 0.08)',
    },
  ];

  return (
    <section id="products" className="py-24 relative">
      <div className="section-divider max-w-5xl mx-auto mb-24" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {products.map((product, i) => (
            <ProductCard key={product.title} {...product} custom={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
