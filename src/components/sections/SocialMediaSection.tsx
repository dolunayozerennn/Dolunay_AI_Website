import { motion } from 'framer-motion';
import { Instagram, Youtube, PlayCircle, Download, ExternalLink } from 'lucide-react';

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

export function SocialMediaSection() {
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
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Brand Collabs Info */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h3 variants={fadeUp} custom={0} className="text-3xl font-bold mb-6 text-white tracking-tight">
              Marka İş Birlikleri
            </motion.h3>
            <motion.p variants={fadeUp} custom={1} className="text-gray-400 text-lg mb-10 leading-relaxed">
              Her ay onlarca yapay zeka ve teknoloji markasıyla sponsorlu içerikler üretiyor, 
              hedef kitlenize en samimi ve güvenilir yoldan birlikte ulaşıyoruz.
            </motion.p>
            
            <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-3">
              <button className="glass-button px-7 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm">
                <Download className="w-4 h-4" />
                <span>Medya Kitini İndir</span>
              </button>
              <a href="#contact" className="px-7 py-3.5 rounded-xl font-semibold border border-white/10 hover:bg-white/[0.03] hover:border-white/20 transition-all duration-300 text-center text-sm flex items-center justify-center gap-2">
                <span>Sponsorluk İçin Başvur</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>

          {/* Content Preview Grid */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 gap-3 h-[400px]"
          >
            <div className="bento-card !rounded-3xl !p-0 overflow-hidden relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <div className="absolute inset-0 bg-gray-800/60 flex items-center justify-center">
                <PlayCircle className="w-12 h-12 text-white/30 group-hover:text-white/80 transition-all duration-500 group-hover:scale-110" />
              </div>
              <div className="absolute bottom-3 left-3 text-xs font-medium bg-black/50 px-2.5 py-1 rounded-lg backdrop-blur-sm z-20 text-gray-300">
                1.2M İzlenme
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="bento-card !rounded-3xl !p-0 flex-1 overflow-hidden relative group cursor-pointer">
                <div className="absolute inset-0 bg-gray-800/60 flex items-center justify-center">
                  <PlayCircle className="w-10 h-10 text-white/30 group-hover:text-white/80 transition-all duration-500 group-hover:scale-110" />
                </div>
              </div>
              <div className="bento-card !rounded-3xl !p-0 flex-1 overflow-hidden relative group cursor-pointer">
                <div className="absolute inset-0 bg-gray-800/60 flex items-center justify-center">
                  <PlayCircle className="w-10 h-10 text-white/30 group-hover:text-white/80 transition-all duration-500 group-hover:scale-110" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
