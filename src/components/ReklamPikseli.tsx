'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// ChatGPT reklamlarinin (OpenAI olcum pikseli) olay tarafi. Pikselin kendisi
// layout.tsx <head> icinde yuklenir; burasi yalniz olay gonderir.
//
// Donusum tanimlari Dolunay'in (2026-09-19). Reklam trafigi AI Factory
// sayfasina dusuyor; donusum 1 = o sayfanin goruntulenmesi. page_viewed bu
// yuzden YALNIZ o sayfada gider: her sayfada gitseydi Ads Manager'daki
// donusum sitenin herhangi bir sayfasini da sayardi. SDK init'te kendiliginden
// page_viewed gondermiyor, site de istemci tarafinda sayfa degistiriyor; bu
// yuzden yol degisimini izleyip elle gonderiyoruz.
// Dokuman: https://developers.openai.com/ads/measurement-pixel

declare global {
  interface Window {
    oaiq?: (...args: unknown[]) => void
  }
}

const AI_FACTORY = '/egitimler/ai-factory'

function olc(...args: unknown[]) {
  try {
    window.oaiq?.(...args)
  } catch {
    // reklam engelleyici ya da SDK hatasi siteyi bozmasin
  }
}

export function ReklamPikseli() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.replace(/\/$/, '') !== AI_FACTORY) return
    olc('measure', 'page_viewed', { type: 'contents' })
  }, [pathname])

  return null
}
