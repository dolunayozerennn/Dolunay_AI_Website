'use client'

import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { GraduationCap } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 50, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }
  })
}

const educationClients = [
  {
    name: 'Türkiye Finans Katılım Bankası',
    desc: '2 günlük yapay zeka araçları workshop\'u düzenlendi.',
    gradient: 'from-emerald-500 to-teal-600',
    bgGlow: 'rgba(52, 211, 153, 0.12)',
    logoDomain: 'turkiyefinans.com.tr'
  },
  {
    name: 'Misyon Bankası',
    desc: '6 saatlik online eğitim serisi (5 seans, 120 katılımcı) düzenlendi. Personel ile bire bir danışmanlık gerçekleştirildi.',
    gradient: 'from-slate-400 to-slate-600',
    bgGlow: 'rgba(148, 163, 184, 0.12)',
    logoDomain: 'misyon.com.tr'
  },
  {
    name: 'Başkent Üniversitesi',
    desc: 'Yapay zeka araçları eğitimi düzenlendi.',
    gradient: 'from-red-500 to-rose-600',
    bgGlow: 'rgba(239, 68, 68, 0.12)',
    logoDomain: 'baskent.edu.tr'
  },
  {
    name: 'Udemy',
    desc: '45.000+ öğrenciye ulaşan best-seller yapay zeka eğitimi yayınlandı.',
    gradient: 'from-violet-500 to-purple-700',
    bgGlow: 'rgba(139, 92, 246, 0.12)',
    logoDomain: 'udemy.com'
  },
  {
    name: 'GittiGidiyor',
    desc: 'Yapay zeka ve otomasyon eğitimi gerçekleştirildi.',
    gradient: 'from-orange-500 to-amber-600',
    bgGlow: 'rgba(249, 115, 22, 0.12)',
    logoDomain: 'gittigidiyor.com'
  },
  {
    name: 'Trendyol',
    desc: 'Yapay zeka araçları ve verimlilik eğitimi düzenlendi.',
    gradient: 'from-orange-600 to-red-500',
    bgGlow: 'rgba(234, 88, 12, 0.12)',
    logoDomain: 'trendyol.com'
  },
]

function RefCard({ client, index }: { client: typeof educationClients[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [imgError, setImgError] = useState(false)

  const handleMouse = (e: MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    cardRef.current.style.setProperty('--mouse-x', `${x}%`)
    cardRef.current.style.setProperty('--mouse-y', `${y}%`)
  }

  return (
    <motion.div
      ref={cardRef}
      variants={fadeUp}
      custom={index}
      onMouseMove={handleMouse}
      className="bento-card !rounded-3xl group relative overflow-hidden p-8 border border-white/5 bg-[#0a0a0f] hover:border-white/10"
    >
      {/* Top accent */}
      <div
        className="absolute -top-px left-[15%] right-[15%] h-[1px] opacity-40 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${client.bgGlow.replace('0.12', '0.9')}, transparent)` }}
      />
      {/* Background glow on hover */}
      <div
        className="absolute -top-10 -right-10 w-[180px] h-[180px] rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: client.bgGlow }}
      />

      <div className="relative z-10">
        {/* Icon + Name */}
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${client.gradient} flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 transition-transform duration-500 overflow-hidden`}>
          {!imgError && client.logoDomain ? (
            <img 
              src={`https://www.google.com/s2/favicons?sz=128&domain=${client.logoDomain}`} 
              alt={`${client.name} logo`} 
              className="w-full h-full object-cover bg-white p-1.5"
              onError={() => setImgError(true)}
            />
          ) : (
            <GraduationCap className="w-6 h-6" />
          )}
        </div>
        <h4 className="text-xl font-bold text-white mb-3">{client.name}</h4>
        <p className="text-gray-400 text-base leading-relaxed">{client.desc}</p>
      </div>
    </motion.div>
  )
}

export default function CorporateTrainingsPage() {
  return (
    <div className="pt-32 pb-24 relative min-h-screen bg-[#050508]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mb-20"
        >
          <motion.div variants={fadeUp} custom={0} className="text-center max-w-3xl mx-auto mb-14">
            <div className="flex items-center gap-3 justify-center mb-4">
              <GraduationCap className="w-5 h-5 text-accent-purple" />
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-[0.2em]">Eğitim & Danışmanlık</span>
            </div>
            <motion.h3 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
              Birlikte çalıştığımız{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-electric-blue">kurumlar</span>
            </motion.h3>
            <motion.p variants={fadeUp} custom={2} className="text-gray-400 text-lg leading-relaxed">
              Türkiye'nin önde gelen kurum ve kuruluşlarına yapay zeka eğitimleri ve danışmanlık hizmetleri sunduk.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {educationClients.map((client, i) => (
              <RefCard key={client.name} client={client} index={i} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
