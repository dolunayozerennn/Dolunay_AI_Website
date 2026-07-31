'use client'

import { useTranslation } from '@/i18n/i18n'

/**
 * Sozlesmeler Turk hukukuna gore yazildi ve CEVRILMEZ. Turkce sayfada hicbir not
 * gorunmez; diger uc dilde tek satirlik uyari basilir.
 */
export function TurkishOnlyDocument() {
  const { t, language } = useTranslation()
  if (language === 'tr') return null

  return (
    <p className="mb-8 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-gray-400">
      {t('legal.turkishOnly')}
    </p>
  )
}
