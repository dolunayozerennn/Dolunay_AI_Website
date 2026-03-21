'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Bot, Workflow, Brain } from 'lucide-react'
import { useTranslation } from '@/i18n/i18n'
import Image from 'next/image'

export default function ArtifexCampusPage() {
  const { t } = useTranslation()

  const features = [
    {
      icon: <Bot className="w-8 h-8 text-electric-blue" />,
      title: t('solutions.feature1Title'),
      desc: t('solutions.feature1Desc')
    },
    {
      icon: <Workflow className="w-8 h-8 text-accent-purple" />,
      title: t('solutions.feature2Title'),
      desc: t('solutions.feature2Desc')
    },
    {
      icon: <Brain className="w-8 h-8 text-[#f97316]" />,
      title: t('solutions.feature3Title'),
      desc: t('solutions.feature3Desc')
    }
  ]

  const benefits = [
    t('solutions.benefit1'),
    t('solutions.benefit2'),
    t('solutions.benefit3'),
    t('solutions.benefit4'),
  ]

  return (
    <div className="min-h-screen bg-[#050508] relative pt-12 pb-24">
      {/* Background Header Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-electric-blue/5 blur-[120px] rounded-[100%] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-electric-blue/10 border border-electric-blue/20 text-electric-blue text-sm font-bold tracking-wider mb-6">
              ARTIFEX CAMPUS
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
              <span className="text-gradient-accent">Kurumsal</span> <br />
              AI Dönüşümü
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10">
              {t('solutions.heroDesc')}
            </p>
            
            <ul className="space-y-4 mb-12">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-electric-blue" />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            <a 
              href="mailto:savas@dolunay.ai"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all hover:scale-105 active:scale-95"
            >
              Demo Talep Et
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
                alt="Artifex Campus" 
                fill 
                className="object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-[#050508]/20" />
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
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
  )
}
