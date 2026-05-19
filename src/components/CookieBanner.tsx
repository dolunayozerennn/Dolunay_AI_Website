'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/i18n/i18n'

const STORAGE_KEY = 'dolunay_ai_cookie_consent'

export function CookieBanner() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const accepted = localStorage.getItem(STORAGE_KEY)
      if (!accepted) {
        const timer = setTimeout(() => setVisible(true), 800)
        return () => clearTimeout(timer)
      }
    } catch {
      // localStorage disabled — banner skip
    }
  }, [])

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted')
    } catch {
      // localStorage disabled
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('cookie.aria')}
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 rounded-2xl border border-white/15 bg-[#0E0F14]/95 backdrop-blur-md shadow-2xl p-5 transition-opacity duration-500"
    >
      <p className="text-sm text-[#C9CCD4] leading-relaxed mb-4">
        {t('cookie.body')}{' '}
        <Link
          href="/sozlesmeler/kvkk"
          className="text-[#4F8BFF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F8BFF] rounded"
        >
          {t('cookie.link')}
        </Link>
      </p>
      <button
        onClick={handleAccept}
        className="w-full px-4 py-2.5 rounded-full bg-[#4F8BFF] text-white text-sm font-semibold hover:bg-[#3a73e6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F8BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0F14] transition-colors"
      >
        {t('cookie.accept')}
      </button>
    </div>
  )
}
