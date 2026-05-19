'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

type LogoEntry = {
  name: string
  src?: string
}

const LOGOS: LogoEntry[] = [
  { name: 'Türkiye Finans', src: '/images/logos/turkiye-finans-logo.png' },
  { name: 'Udemy', src: '/images/logos/udemy-logo.png' },
  { name: 'Trendyol' },
  { name: 'GittiGidiyor', src: '/images/logos/gittigidiyor-logo.png' },
  { name: 'Başkent Üniversitesi' },
  { name: 'Misyon Yayınları' },
]

export function LogoStrip() {
  return (
    <section
      className="relative py-16 md:py-20 bg-[#08090C] border-t border-b border-white/[0.06]"
      aria-label="Çalışılan kurumlar"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] text-[#4F8BFF]/80 uppercase">
            Eğitim verdiği kurumlar
          </span>
          <p className="mt-3 text-lg md:text-xl text-[#C9CCD4] font-light max-w-2xl mx-auto leading-relaxed">
            Türkiye'nin önde gelen kurumları yapay zeka eğitimlerini Dolunay'dan aldı.
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center"
        >
          {LOGOS.map((logo) => (
            <li
              key={logo.name}
              className="flex items-center justify-center h-16 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.05] transition-colors"
              title={logo.name}
            >
              {logo.src ? (
                <div className="relative w-full h-10">
                  <Image
                    src={logo.src}
                    alt={`${logo.name} logosu`}
                    fill
                    className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                    sizes="(max-width: 768px) 50vw, 16vw"
                  />
                </div>
              ) : (
                <span className="text-sm md:text-base font-semibold text-[#C9CCD4]/70 hover:text-white transition-colors text-center leading-tight">
                  {logo.name}
                </span>
              )}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
