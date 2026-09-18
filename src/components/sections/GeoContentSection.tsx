'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { GeoBlock } from '@/data/geoContent'

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const }
  })
}

// GEO icerik bloklari (F10, seo_geo/GEO_ICERIK_TASLAK.md). Gorsel dil sayfadan
// gelir: /egitimler/ai-factory'deki FAQ kartlariyla AYNI siniflar (bento-card,
// border-white/5, bg-[#0a0a0f], Check ikonu). Yeni bir bilesen/renk tasarimi
// UYDURULMADI. Yalniz `language === 'tr'` iken cagirilir (bkz. src/data/geoContent.ts).
export function GeoContentSection({ blocks }: { blocks: GeoBlock[] }) {
  return (
    <section className="pb-28 relative">
      <div className="halftone-divider max-w-5xl mx-auto mb-28" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-4"
        >
          {blocks.map((block, i) => (
            <motion.article
              key={block.title}
              variants={fadeUp}
              custom={i}
              className="bento-card !rounded-2xl p-6 md:p-7 border border-white/5 bg-[#0a0a0f]"
            >
              <h2 className="text-white font-semibold mb-3 flex items-start gap-3 text-lg">
                <Check className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" aria-hidden />
                {block.title}
              </h2>
              <div className="pl-8 space-y-3 text-gray-400 text-sm leading-relaxed">
                {block.paragraphs.map((p, pi) => (
                  <p key={pi}>{p}</p>
                ))}
                {block.source && <p className="text-gray-500">{block.source}</p>}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
