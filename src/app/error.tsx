'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Sayfa hatası:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[#4F8BFF] mb-4">Bir şeyler ters gitti</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Bu sayfayı şu an gösteremiyoruz.</h1>
        <p className="text-base md:text-lg text-gray-300 mb-8">
          Geçici bir teknik aksaklık olabilir. Bir kez daha denemek ya da ana sayfaya dönmek istersen aşağıdaki butonları kullanabilirsin.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-full bg-[#4F8BFF] text-white font-semibold hover:bg-[#3a73e6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F8BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090C] transition-colors"
          >
            Tekrar dene
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 transition-colors"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  )
}
