'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check, X, Download, Users, Video, MessageCircle, Wrench, Send, Play } from 'lucide-react'
import { useTranslation } from '@/i18n/i18n'

// İçerik kaynağı: Skool topluluk sayfasının kendi metni (skool.com/yapay-zeka-factory/about).
// Buradaki hiçbir vaat uydurulmadı; sayısal bilgiler (fiyat, üye sayısı, yayın sıklığı)
// oradan alındı. Skool'da değişirse burası da güncellenmeli.
const SKOOL_URL = 'https://www.skool.com/yapay-zeka-factory/about?ref=044f39496d4f45fab11775bcefe4b7f4'

// Tanitim videosu Cloudinary'de durur (repo karari: video barindirma Cloudinary,
// Supabase Storage'a video yuklenmez). Kaynak dosya Drive'daki
// "skool tanitim 13 agustos.mp4"; web icin 1080p30 / ~39 MB'a indirildi.
const TANITIM_VIDEO = 'https://res.cloudinary.com/ddh9eoasc/video/upload/v1788604237/ai-factory/tanitim-2025-08.mp4'
const TANITIM_KAPAK = 'https://res.cloudinary.com/ddh9eoasc/image/upload/v1788604751/ai-factory/tanitim-2025-08-kapak-v2.jpg'

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const }
  })
}

// Butun metinler ceviri paketinden gelir (aiFactory.*). Buradaki listeler yalnizca
// ikonu, sirayi ve hangi anahtarin okunacagini tutar.
const iceridekiler = [
  { icon: <Wrench className="w-6 h-6" />, key: 'item1' },
  { icon: <Download className="w-6 h-6" />, key: 'item2' },
  { icon: <Users className="w-6 h-6" />, key: 'item3' },
  { icon: <Video className="w-6 h-6" />, key: 'item4' },
  { icon: <MessageCircle className="w-6 h-6" />, key: 'item5' },
]

const olmayanlar = ['not1', 'not2']

const adimlar = [
  { num: '01', key: 'step1' },
  { num: '02', key: 'step2' },
  { num: '03', key: 'step3' },
  { num: '04', key: 'step4' },
]

const sorular = ['1', '2', '3', '4', '5', '6']

export default function AIFactoryPage() {
  const { t } = useTranslation();
  const [videoOynadi, setVideoOynadi] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <div className="relative">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-32 pb-24 relative flex flex-col items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-blue-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4"><span className="halftone-arc" aria-hidden />{t('aiFactory.badge')}</span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
              {t('aiFactory.title')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">{t('aiFactory.titleHighlight')}</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
              {t('aiFactory.desc')}
            </p>

            {/* Tanitim videosu. Skool sayfasindaki gibi katilma butonundan ONCE durur.
                preload="none": sayfa acilirken 39 MB inmez, once yalniz kapak gorunur. */}
            <div className="max-w-3xl mx-auto mb-10">
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-blue-500/10">
                <video
                  ref={videoRef}
                  src={TANITIM_VIDEO}
                  poster={TANITIM_KAPAK}
                  preload="none"
                  playsInline
                  controls={videoOynadi}
                  onPlay={() => setVideoOynadi(true)}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {!videoOynadi && (
                  <button
                    type="button"
                    onClick={() => { void videoRef.current?.play(); setVideoOynadi(true) }}
                    aria-label={t('aiFactory.videoLabel')}
                    className="group absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors duration-300"
                  >
                    <span className="flex items-center justify-center w-20 h-20 rounded-full bg-white/95 text-black shadow-xl transition-transform duration-300 group-hover:scale-110">
                      <Play className="w-8 h-8 ml-1 fill-current" />
                    </span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-10">
              <span>{t('aiFactory.factMembers')}</span>
              <span aria-hidden className="text-white/15">•</span>
              <span>{t('aiFactory.factPrice')}</span>
              <span aria-hidden className="text-white/15">•</span>
              <span>{t('aiFactory.factLive')}</span>
            </div>
            <a
              href={SKOOL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-blue-500/25"
            >
              {t('aiFactory.btn')} <ArrowUpRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── İçeride ne var ───────────────────────────────────── */}
      <section className="pb-28 relative">
        <div className="halftone-divider max-w-5xl mx-auto mb-28" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold mb-5 tracking-tight text-white">
              {t('aiFactory.insideTitle')} <span className="text-gradient-accent">{t('aiFactory.insideTitleHighlight')}</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-gray-400 text-lg leading-relaxed">
              {t('aiFactory.insideDesc')}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {iceridekiler.map((k, i) => (
              <motion.div
                key={k.key}
                variants={fadeUp}
                custom={i}
                className="bento-card !rounded-3xl p-8 border border-white/5 bg-[#0a0a0f] hover:border-white/10 transition-colors duration-500 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 transition-transform duration-500">
                  {k.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{t(`aiFactory.${k.key}Title`)}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{t(`aiFactory.${k.key}Desc`)}</p>
              </motion.div>
            ))}

            <motion.div
              variants={fadeUp}
              custom={iceridekiler.length}
              className="bento-card !rounded-3xl p-8 border border-white/5 bg-[#0a0a0f]"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mb-5">
                <X className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-4">{t('aiFactory.notHereTitle')}</h3>
              <ul className="space-y-3">
                {olmayanlar.map((o) => (
                  <li key={o}>
                    <p className="text-gray-300 text-sm font-medium">{t(`aiFactory.${o}Title`)}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{t(`aiFactory.${o}Desc`)}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Nasıl işliyor ────────────────────────────────────── */}
      <section className="pb-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold mb-5 tracking-tight text-white">
              {t('aiFactory.howTitle')} <span className="text-gradient-accent">{t('aiFactory.howTitleHighlight')}</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-gray-400 text-lg leading-relaxed">
              {t('aiFactory.howDesc')}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {adimlar.map((a, i) => (
              <motion.div
                key={a.num}
                variants={fadeUp}
                custom={i}
                className="bento-card !rounded-3xl p-8 border border-white/5 bg-[#0a0a0f] relative overflow-hidden group"
              >
                <span className="absolute top-4 right-5 text-5xl font-bold text-white/[0.04] group-hover:text-white/[0.07] transition-colors duration-500">
                  {a.num}
                </span>
                <h3 className="text-lg font-bold text-white mb-2 relative z-10">{t(`aiFactory.${a.key}Title`)}</h3>
                <p className="text-gray-500 text-sm leading-relaxed relative z-10">{t(`aiFactory.${a.key}Desc`)}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Sık sorulanlar ───────────────────────────────────── */}
      <section className="pb-28 relative">
        <div className="halftone-divider max-w-5xl mx-auto mb-28" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
            className="text-3xl md:text-5xl font-bold mb-14 tracking-tight text-white text-center"
          >
            {t('aiFactory.faqTitle')} <span className="text-gradient-accent">{t('aiFactory.faqTitleHighlight')}</span>
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-4"
          >
            {sorular.map((s, i) => (
              <motion.div
                key={s}
                variants={fadeUp}
                custom={i}
                className="bento-card !rounded-2xl p-6 md:p-7 border border-white/5 bg-[#0a0a0f]"
              >
                <h3 className="text-white font-semibold mb-2 flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" aria-hidden />
                  {t(`aiFactory.q${s}`)}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed pl-8">{t(`aiFactory.a${s}`)}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Kapanış ──────────────────────────────────────────── */}
      <section className="pb-32 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
            className="bento-card !rounded-3xl p-10 md:p-14 border border-white/5 bg-[#0a0a0f] text-center relative overflow-hidden"
          >
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-blue-500/10 blur-[100px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                {t('aiFactory.closingTitle')} <span className="text-gradient-accent">{t('aiFactory.closingHighlight')}</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8 max-w-xl mx-auto">
                {t('aiFactory.closingDesc')}
              </p>
              <a
                href={SKOOL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-blue-500/25"
              >
                {t('aiFactory.btn')} <Send className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
