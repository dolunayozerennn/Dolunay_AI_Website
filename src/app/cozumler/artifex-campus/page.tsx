'use client'

import { motion } from 'framer-motion'
import { Sparkles, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

const FEATURES = [
  {
    title: 'Hazır kurulum paketleri',
    desc: 'KOBİ ve orta ölçekli işletmeler için ön-tasarlanmış AI ajanları. İlk hafta üretime girer.',
  },
  {
    title: '7/24 otonom operasyon',
    desc: 'Müşteri hizmetleri, satış takibi, içerik üretimi. İnsan gözetimi azaltılmış, sonuç odaklı sistem.',
  },
  {
    title: 'Ölçeklenebilir mimari',
    desc: 'Operasyon büyüdükçe ajan sayısı artar. Aylık abonelik, taahhüt yok.',
  },
  {
    title: 'Türkçe-öncelikli',
    desc: 'Türk müşterinin dilini, kültürünü, alışkanlığını bilen ajanlar. Yurt dışı template değil.',
  },
]

export default function ArtifexCampusPage() {
  return (
    <div className="pt-32 pb-24 relative min-h-screen bg-[#08090C]">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#4F8BFF]/10 border border-[#4F8BFF]/20 flex items-center justify-center text-[#4F8BFF] mx-auto mb-6">
            <Sparkles className="w-8 h-8" />
          </div>

          <span className="inline-block px-4 py-2 rounded-full border border-[#4F8BFF]/30 text-[#4F8BFF] text-sm font-semibold tracking-wider mb-6 bg-[#4F8BFF]/5 backdrop-blur-sm">
            Yakında Açılıyor
          </span>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#4F8BFF]">
              Artifex Campus
            </span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-4 max-w-2xl mx-auto">
            İşletmenizi yapay zeka ile dönüştüren hazır çözüm paketleri.
          </p>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            Personel maliyetini düşüren, operasyonel yükü sıfıra indiren, sonuç üreten B2B yapay zeka otomasyonları. Hazır kuruluyor, anında çalışıyor.
          </p>
        </motion.div>

        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 max-w-3xl mx-auto"
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#4F8BFF]/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#4F8BFF] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-1">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-3xl border border-[#4F8BFF]/20 bg-gradient-to-br from-[#4F8BFF]/[0.08] to-transparent p-8 md:p-10 max-w-3xl mx-auto text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Erken erişim listesine yazıl
          </h2>
          <p className="text-gray-300 text-base md:text-lg mb-6 leading-relaxed">
            Artifex Campus açıldığında ilk haberi alanlar arasında ol. Erken erişim fiyatları sadece liste üyeleri için.
          </p>
          <a
            href="mailto:dolunay@dolunay.ai?subject=Artifex%20Campus%20erken%20eri%C5%9Fim&body=Merhaba%2C%20Artifex%20Campus%20a%C3%A7%C4%B1ld%C4%B1%C4%9F%C4%B1nda%20haber%20almak%20istiyorum."
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white bg-[#4F8BFF] hover:bg-[#3a73e6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F8BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090C] transition-colors"
          >
            <Mail className="w-4 h-4" /> Erken erişim için yaz
          </a>
        </motion.div>

        <div className="flex justify-center mt-12">
          <Link
            href="/cozumler"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Çözümlere dön
          </Link>
        </div>
      </div>
    </div>
  )
}
