'use client'

import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { useTranslation, type Language } from '@/i18n/i18n'

// Tarih ziyaretcinin dilinde yazilir: "16 Mart 2026" / "March 16, 2026".
const DATE_LOCALE: Record<Language, string> = {
  tr: 'tr-TR',
  en: 'en-US',
  es: 'es-ES',
  zh: 'zh-CN',
}

export function useDateFormatter() {
  const { language } = useTranslation()
  return (iso: string) =>
    new Date(iso).toLocaleDateString(DATE_LOCALE[language] || 'tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
}

export function BackToBlog() {
  const { t } = useTranslation()
  return (
    <Link
      href="/blog"
      className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors mb-12 group p-2 -ml-2 rounded-lg hover:bg-white/5"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      {t('blog.backToBlog')}
    </Link>
  )
}

export function PostMetaLine({ date, minutes }: { date: string; minutes: number }) {
  const { t } = useTranslation()
  const bicimle = useDateFormatter()
  return (
    <>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-[#4F8BFF]/80" />
        <span>{bicimle(date)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-[#4F8BFF]/80" />
        <span>{minutes} {t('blog.readMinutes')}</span>
      </div>
    </>
  )
}

/** Yazi govdesi yalnizca Turkce; diger dillerde tek satirlik uyari gorunur. */
export function TurkishOnlyNotice() {
  const { t, language } = useTranslation()
  if (language === 'tr') return null
  return (
    <p className="mb-10 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-gray-400">
      {t('blog.turkishOnly')}
    </p>
  )
}

export function PostCta() {
  const { t } = useTranslation()
  return (
    <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[100px] bg-[#4F8BFF]/10 blur-[50px] pointer-events-none" />
      <h4 className="text-2xl font-bold text-white mb-4 relative z-10">{t('blog.ctaTitle')}</h4>
      {/* Eskiden bu buton ana sayfaya donuyordu: satis sorusu sorulup cevap
          olarak ziyaretci basa gonderiliyordu. Artik hizmet sayfasina gidiyor. */}
      <Link
        href="/cozumler/hizmetler"
        className="relative z-10 inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all hover:scale-105 active:scale-95"
      >
        {t('blog.ctaBtn')}
      </Link>
    </div>
  )
}
