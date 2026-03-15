import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, PlayCircle, Download, ExternalLink, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 50, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
};

const stats = [
  { platform: "Instagram", followers: "180K+", icon: <Instagram className="w-7 h-7" />, color: "from-pink-500/20 to-purple-500/20 border-pink-500/20" },
  { platform: "TikTok", followers: "50K+", icon: <PlayCircle className="w-7 h-7" />, color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/20" },
  { platform: "YouTube", followers: "20K+", icon: <Youtube className="w-7 h-7" />, color: "from-red-500/20 to-orange-500/20 border-red-500/20" },
];

const referenceVideos = [
  {
    id: 1,
    title: "Yapay zeka araçlarıyla iş süreçlerinizi 10 kat hızlandırın.",
    brand: "Yapay Zeka Eğitim",
    views: "1.2M",
    thumbnail: "/hero_bg/hero_Cyberpunk_Neon_356a4f52.jpg",
    url: "https://www.instagram.com/dolunayozeren/"
  },
  {
    id: 2,
    title: "Bu otonom sistem sayesinde pasif gelir oluşturmak mümkün.",
    brand: "Otonom Sistemler",
    views: "850K",
    thumbnail: "/hero_bg/hero_Authentic_Warm_5ff602c3.jpg",
    url: "https://www.instagram.com/dolunayozeren/"
  },
  {
    id: 3,
    title: "Dijital pazarın yeni dinamikleri ve teknoloji trendleri.",
    brand: "Gelecek Trendleri",
    views: "2.4M",
    thumbnail: "/hero_bg/hero_Trust_Scale_dd768729.jpg",
    url: "https://www.instagram.com/dolunayozeren/"
  },
  {
    id: 4,
    title: "Kurumsal yapılar için yapay zeka otomasyon çözümleri.",
    brand: "Tele-Satış CRM",
    views: "640K",
    thumbnail: "/creator-portrait-v2.png",
    url: "https://www.instagram.com/dolunayozeren/"
  }
];

export function SocialMediaSection() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  return (
    <section id="social" className="py-32 relative">
      <div className="section-divider max-w-5xl mx-auto mb-32" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.span variants={fadeUp} custom={0} className="inline-block text-pink-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Medya & İş Birlikleri
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Türkiye'nin En Büyük{' '}
            <span className="text-gradient-accent">Yapay Zeka Topluluğu</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-gray-400 text-lg leading-relaxed">
            Yapay zekanın karmaşık dünyasını herkesin anlayabileceği, 
            uygulanabilir ve kârlı bir formata birlikte dönüştürüyoruz.
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-32"
        >
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.platform}
              variants={fadeUp}
              custom={i}
              className={`bento-card !rounded-3xl flex flex-col items-center justify-center text-center py-10 group bg-gradient-to-br ${stat.color} border`}
            >
              <div className="text-gray-400 group-hover:text-white mb-4 transition-all duration-500 group-hover:scale-110">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold text-white mb-1">{stat.followers}</h3>
              <p className="text-gray-500 uppercase tracking-[0.15em] text-xs font-medium">{stat.platform}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Brand Collabs Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-2xl"
          >
            <motion.h3 variants={fadeUp} custom={0} className="text-3xl font-bold mb-4 text-white tracking-tight">
              Marka İş Birlikleri
            </motion.h3>
            <motion.p variants={fadeUp} custom={1} className="text-gray-400 text-lg leading-relaxed mb-6">
              Her ay onlarca yapay zeka ve teknoloji markasıyla sponsorlu içerikler üretiyor, 
              hedef kitlenize en samimi ve güvenilir yoldan birlikte ulaşıyoruz.
            </motion.p>
            
            <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-3">
              <button className="glass-button px-7 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm">
                <Download className="w-4 h-4" />
                <span>Medya Kitini İndir</span>
              </button>
              <a href="#contact" className="px-7 py-3.5 rounded-xl font-semibold border border-white/10 hover:bg-white/[0.03] hover:border-white/20 transition-all duration-300 text-center text-sm flex items-center justify-center gap-2 text-white">
                <span>Sponsorluk İçin Başvur</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 self-start md:self-end pt-4 md:pt-0"
          >
            <span className="text-sm font-medium text-gray-400 hidden sm:block tracking-wider uppercase">Öne Çıkan Videolar</span>
            <div className="flex gap-2">
              <button 
                onClick={scrollLeft}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={scrollRight}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Video Carousel */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8"
        >
          <div 
            ref={carouselRef}
            className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 pt-4"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none' 
            }}
          >
            {referenceVideos.map((video) => (
              <div 
                key={video.id} 
                className="relative w-[300px] sm:w-[340px] md:w-[380px] h-[540px] md:h-[640px] shrink-0 snap-center sm:snap-start rounded-[32px] sm:rounded-[40px] overflow-hidden group cursor-pointer border border-white/10"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${video.thumbnail})` }}
                />
                
                {/* Gradient Overlay for better contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/90" />
                
                {/* Top Section: Views & Brand */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10 shadow-lg">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-semibold text-white tracking-wide">{video.views}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                    <span className="font-bold text-white text-sm">{video.brand[0]}</span>
                  </div>
                </div>

                {/* Center Content Component (Play button) */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transform transition-all duration-500 group-hover:scale-110 group-hover:bg-white/30 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] pointer-events-none">
                    <PlayCircle className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="absolute bottom-8 left-6 right-6 z-10 flex flex-col items-center justify-end h-1/2">
                  <h4 className="text-3xl font-bold text-white mb-2 tracking-tight drop-shadow-lg text-center">{video.brand}</h4>
                  <p className="text-gray-200 text-sm mb-8 text-center drop-shadow-md font-medium px-2 leading-relaxed">{video.title}</p>
                  
                  <a 
                    href={video.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-white text-black hover:bg-gray-100 font-bold py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                  >
                    <span>Instagram'da İzle</span>
                    <Instagram className="w-4 h-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
      </div>
      
      {/* Dynamic CSS for hiding scrollbar fully */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
