'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Building, Target, Presentation, Briefcase, Zap } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from '@/i18n/i18n'

const fadeUp = {
  hidden: { opacity: 0, y: 50, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
}

export default function KurumsalEgitimlerPage() {
  const { t } = useTranslation()

  const benefits = [
    "Çalışan verimliliğinde 3 kata varan artış",
    "Operasyonel süreçlerde yapay zekâ entegrasyonu",
    "Maliyetleri düşüren otomasyon sistemleri",
    "Sektörünüze özel AI kullanım haritaları",
  ]

  const features = [
    {
      icon: <Building className="w-8 h-8 text-electric-blue" />,
      title: "Şirkete Özel Müfredat",
      desc: "Standart eğitimler yerine şirketinize, departmanlarınıza ve hedeflerinize özel bir içerik hazırlıyoruz."
    },
    {
      icon: <Target className="w-8 h-8 text-[#f97316]" />,
      title: "Uygulamalı Dönüşüm",
      desc: "Sadece teorik anlatım değil, çalışanlarınızın anında kullanabileceği pratik araçlarla sahaya iniyoruz."
    },
    {
      icon: <Presentation className="w-8 h-8 text-accent-purple" />,
      title: "Yönetici Vizyonu",
      desc: "Karar alıcılar için yapay zekâyı stratejik bir büyüme argümanı olarak nasıl kullanacaklarını aktarıyoruz."
    }
  ]

  return (
    <div className="min-h-screen bg-[#050508] relative pt-12 pb-24 overflow-hidden">
      {/* Background Header Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-accent-purple/5 blur-[120px] rounded-[100%] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        
        {/* Header content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-sm font-bold tracking-wider mb-6 uppercase">
              {t('nav.corporateTrainings')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
              Şirketinizi <span className="text-gradient-accent">Yapay Zekâ</span> <br />
              Çağına Taşıyın
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10">
              Uluslararası holdinglerden KOBİ'lere kadar her ölçekte şirketin yapay zekâ entegrasyonu sürecine liderlik ediyoruz. Ekibinizi AI ile tanıştırın, rekabette yıllarca öne geçin.
            </p>
            
            <ul className="space-y-4 mb-12">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-accent-purple" />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            <a 
              href="mailto:savas@dolunay.ai"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-accent-purple to-electric-blue hover:from-accent-violet hover:to-electric-blue border border-transparent rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_50px_rgba(124,58,237,0.5)]"
            >
              Kurumsal Talep Oluştur
            </a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative aspect-square w-full max-w-[500px] mx-auto rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(124,58,237,0.15)] bg-[#0c0c14]">
              <Image 
                src="/images/products/kurumsal_holding.jpg" 
                alt="Kurumsal AI Eğitimi" 
                fill 
                className="object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-[#050508]/20" />
              
              <div className="absolute bottom-10 left-10 right-10 flex flex-col items-center p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
                <div className="flex -space-x-4 mb-3">
                  <div className="w-12 h-12 rounded-full border-2 border-black bg-gradient-to-br from-electric-blue to-accent-purple flex items-center justify-center text-white"><Briefcase size={20} /></div>
                  <div className="w-12 h-12 rounded-full border-2 border-black bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white"><Zap size={20} /></div>
                  <div className="w-12 h-12 rounded-full border-2 border-black bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white"><Target size={20} /></div>
                </div>
                <p className="text-white text-sm font-semibold text-center">Geleceğin organizasyon yapısını birlikte kuralım.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <motion.h3 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-3xl font-bold text-white mb-16"
          >
            Neden Bizi Seçmelisiniz?
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="bento-card group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
