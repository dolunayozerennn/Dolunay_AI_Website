import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import {
  Instagram, Youtube, Facebook, Users, GraduationCap,
  Mail, ArrowUpRight, Star, Eye, ExternalLink, Heart
} from 'lucide-react';

// ─── Custom Icons ──────────────────────────────────────────────────────────────
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.6a8.2 8.2 0 0 0 4.76 1.52V6.69h-1z" />
    </svg>
  );
}

function SkoolIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Animation Variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 50, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }
  })
};

// ─── Counter Animation ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  const startCounting = () => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
  };

  return (
    <motion.span
      ref={ref}
      onViewportEnter={startCounting}
      viewport={{ once: true }}
    >
      {count.toLocaleString('tr-TR')}{suffix}
    </motion.span>
  );
}

// ─── Bento Card ─────────────────────────────────────────────────────────────────
function BentoCard({ children, className = '', custom = 0 }: { children: React.ReactNode; className?: string; custom?: number }) {
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

// ─── Social Media Platform Data ────────────────────────────────────────────────
const platforms = [
  {
    name: 'Instagram',
    handle: '@dolunayozeren',
    followers: '200K+',
    followersNum: 200000,
    icon: <Instagram className="w-6 h-6" />,
    gradient: 'from-pink-500 to-purple-600',
    bgGlow: 'rgba(236, 72, 153, 0.15)',
    borderColor: 'border-pink-500/20',
    textColor: 'text-pink-400',
    href: 'https://instagram.com/dolunayozeren',
    metric: 'Takipçi',
    engagementLabel: 'Erişim / Post',
    engagementValue: '50K+'
  },
  {
    name: 'TikTok',
    handle: '@dolunayozeren',
    followers: '37K+',
    followersNum: 37000,
    icon: <TikTokIcon className="w-6 h-6" />,
    gradient: 'from-cyan-400 to-blue-600',
    bgGlow: 'rgba(0, 212, 255, 0.15)',
    borderColor: 'border-cyan-500/20',
    textColor: 'text-cyan-400',
    href: 'https://tiktok.com/@dolunayozeren',
    metric: 'Takipçi',
    engagementLabel: 'Ort. İzlenme',
    engagementValue: '100K+'
  },
  {
    name: 'YouTube',
    handle: '@dolunayozeren',
    followers: '43K+',
    followersNum: 43000,
    icon: <Youtube className="w-6 h-6" />,
    gradient: 'from-red-500 to-orange-600',
    bgGlow: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'border-red-500/20',
    textColor: 'text-red-400',
    href: 'https://youtube.com/@dolunayozeren',
    metric: 'Abone',
    engagementLabel: 'Ort. İzlenme',
    engagementValue: '25K+'
  },
  {
    name: 'Facebook',
    handle: 'Dolunay Özeren',
    followers: '15K+',
    followersNum: 15000,
    icon: <Facebook className="w-6 h-6" />,
    gradient: 'from-blue-500 to-blue-700',
    bgGlow: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'border-blue-500/20',
    textColor: 'text-blue-400',
    href: 'https://facebook.com/dolunayozeren',
    metric: 'Takipçi',
    engagementLabel: 'Ort. Etkileşim',
    engagementValue: '5K+'
  },
  {
    name: 'Udemy',
    handle: 'Dolunay Özeren',
    followers: '45K+',
    followersNum: 45000,
    icon: <GraduationCap className="w-6 h-6" />,
    gradient: 'from-violet-500 to-purple-700',
    bgGlow: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'border-violet-500/20',
    textColor: 'text-violet-400',
    href: 'https://www.udemy.com/course/ai-yapay-zeka-uzmanligi-chatgpt-midjourney-dalle-ve-fazlasi/?referralCode=906FDE49207D6106DCBF',
    metric: 'Öğrenci',
    engagementLabel: 'Eğitmen Puanı',
    engagementValue: '4.7 ⭐'
  },
  {
    name: 'Skool',
    handle: 'AI Factory',
    followers: '500+',
    followersNum: 500,
    icon: <SkoolIcon className="w-6 h-6" />,
    gradient: 'from-emerald-400 to-teal-600',
    bgGlow: 'rgba(52, 211, 153, 0.15)',
    borderColor: 'border-emerald-500/20',
    textColor: 'text-emerald-400',
    href: 'https://www.skool.com/yapay-zeka-factory/about?ref=044f39496d4f45fab11775bcefe4b7f4',
    metric: 'Üye',
    engagementLabel: 'Topluluk',
    engagementValue: 'Premium'
  }
];

// ─── Highlight Stats ────────────────────────────────────────────────────────────
const highlightStats = [
  { icon: <Users className="w-5 h-5" />, value: 300, suffix: 'K+', label: 'Toplam Takipçi', color: 'from-cyan-500 to-blue-600' },
  { icon: <GraduationCap className="w-5 h-5" />, value: 50, suffix: 'K+', label: 'Öğrenci', color: 'from-violet-500 to-purple-600' },
  { icon: <Eye className="w-5 h-5" />, value: 100, suffix: 'M+', label: 'Toplam İzlenme', color: 'from-pink-500 to-rose-600' },
  { icon: <Star className="w-5 h-5" />, value: 4.7, suffix: '', label: 'Eğitmen Puanı', color: 'from-amber-400 to-orange-500' },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export function CollaborationsPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/*  HERO — MEDIA KIT BANNER                                            */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden" id="collaborations">
        {/* Background Image with Parallax */}
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0"
        >
          <img 
            src="mediakit-banner.png" 
            alt="" 
            className="w-full h-[120%] object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/60 via-[#050508]/40 to-[#050508]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/80 via-transparent to-[#050508]/80" />
        </motion.div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            opacity: 0.5,
          }}
        />

        {/* Content */}
        <motion.div style={{ y: textY }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-6 border border-white/[0.08] bg-white/[0.03] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
                </span>
                <span className="text-gray-400 text-xs font-medium tracking-[0.18em] uppercase">
                  Creator Media Kit
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-[-0.03em] leading-[1.05] text-white mb-4"
            >
              Dolunay
              <span className="text-gradient-accent block sm:inline"> Özeren</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed mb-8"
            >
              Yapay Zeka Eğitmeni & Builder. Türkiye'nin en büyük yapay zeka topluluğunu yöneten içerik üreticisi.
            </motion.p>

            {/* Quick Stats Row */}
            <motion.div
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {highlightStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={scaleIn}
                  custom={i + 3}
                  className="text-center p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
                >
                  <div className={`inline-flex p-1.5 rounded-lg bg-gradient-to-r ${stat.color} mb-2`}>
                    {stat.icon}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {typeof stat.value === 'number' && stat.value < 10 ? stat.value : <AnimatedCounter target={stat.value} suffix={stat.suffix} />}
                    {typeof stat.value === 'number' && stat.value < 10 && stat.suffix}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: Creator Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:flex justify-center"
          >
            {/* Glow behind photo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[400px] h-[400px] rounded-full blur-[120px]"
                style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, rgba(124,58,237,0.1) 50%, transparent 70%)' }}
              />
            </div>
            
            {/* Orbit ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[380px] h-[380px] rounded-full border border-white/[0.06]" style={{ animation: 'spin 30s linear infinite' }}>
                <div className="absolute w-2 h-2 rounded-full bg-cyan-400" style={{ top: -4, left: '50%', marginLeft: -4, boxShadow: '0 0 12px rgba(0,212,255,0.6)' }} />
              </div>
            </div>

            <img
              src="portrait.png"
              alt="Dolunay Özeren"
              className="relative z-10 w-[340px] h-[340px] object-cover rounded-3xl border border-white/[0.08]"
              style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 60px rgba(124,58,237,0.1)' }}
            />
          </motion.div>
        </motion.div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050508] to-transparent pointer-events-none z-20" />
      </section>


      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/*  SOCIAL MEDIA PLATFORMS — BENTO GRID                                 */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.span variants={fadeUp} custom={0} className="inline-block text-pink-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Platform Erişimi
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-bold mb-5 tracking-tight">
              Tüm platformlarda{' '}
              <span className="text-gradient-accent">aktif kitle</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-400 text-lg leading-relaxed">
              6 farklı platformda, yapay zeka ve teknolojiye tutkulu yüz binlerce takipçiye aynı anda ulaşma imkanı.
            </motion.p>
          </motion.div>

          {/* Bento Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {platforms.map((platform, i) => (
              <BentoCard key={platform.name} custom={i} className="!rounded-3xl group relative overflow-hidden">
                {/* Top accent line */}
                <div
                  className="absolute -top-px left-[15%] right-[15%] h-[1px] opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${platform.bgGlow.replace('0.15', '1')}, transparent)` }}
                />

                {/* Background glow on hover */}
                <div
                  className="absolute -top-10 -right-10 w-[180px] h-[180px] rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: platform.bgGlow }}
                />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center text-white shadow-lg`}>
                        {platform.icon}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{platform.name}</h3>
                        <p className="text-xs text-gray-500">{platform.handle}</p>
                      </div>
                    </div>
                    <a
                      href={platform.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/[0.15] transition-all duration-300"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Main Number */}
                  <div className="mb-4">
                    <div className="text-3xl font-extrabold text-white tracking-tight">{platform.followers}</div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">{platform.metric}</div>
                  </div>

                  {/* Engagement Metric */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                    <Heart className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs text-gray-400">{platform.engagementLabel}:</span>
                    <span className={`text-xs font-semibold ${platform.textColor}`}>{platform.engagementValue}</span>
                  </div>
                </div>
              </BentoCard>
            ))}
          </motion.div>
        </div>
      </section>





      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/*  İLETİŞİM CTA                                                       */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 relative" id="contact">
        <div className="section-divider max-w-5xl mx-auto mb-24" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="bento-card !rounded-3xl !p-12 md:!p-16 text-center relative overflow-hidden"
          >
            {/* Top accent */}
            <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-pink-500/40 to-transparent" />
            
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-pink-500/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-accent-purple/5 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-pink-500/20 bg-pink-500/5">
                <Mail className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-pink-400 text-xs font-semibold tracking-wider uppercase">İletişim</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Bizimle İletişime Geçin
              </h3>
              <p className="text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
                Bu e-posta adresi <strong className="text-white">sadece marka iş birlikleri ve sponsorluklar</strong> için
                geçerlidir. Diğer tüm konular için lütfen Discord topluluğumuza veya sosyal medya üzerinden bize ulaşın.
              </p>

              <a 
                href="mailto:ceren@dolunay.ai" 
                className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-pink-500/20 to-accent-purple/20 border border-pink-500/30 hover:border-pink-500/60 transition-all duration-500 hover:shadow-[0_0_50px_rgba(236,72,153,0.2)] z-10"
              >
                <Mail className="w-5 h-5 text-pink-400" />
                <span>ceren@dolunay.ai</span>
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
