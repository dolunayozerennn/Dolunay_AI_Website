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
// Donusum 2 = ayni sayfada Skool'a giden butonlara ("Topluluga Katil", ust ve
// alt) tiklama. Olay adi Ads Manager'daki donusumle birebir: skoolgitti (ozel
// olay). Butonlar yeni sekmede acildigi icin sayfa kapanmadan olay gider.
// Sayfa goruntulemesi basina EN FAZLA BIR kez gider (cift tik, iki butona
// arka arkaya basma, geri donup tekrar tiklama tek donusum); ayni event_id
// OpenAI tarafinda da tekrari eler. Sag tik sayilmaz.
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

    const eventId = `skoolgitti-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    let gitti = false
    const dinle = (e: MouseEvent) => {
      if (gitti || e.button === 2) return
      const link = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!link?.href.includes('skool.com/')) return
      gitti = true
      olc('measure', 'custom', { type: 'custom' }, { custom_event_name: 'skoolgitti', event_id: eventId })
    }
    // auxclick: orta tusla yeni sekmede acma da sayilsin (sag tik yukarida elenir)
    document.addEventListener('click', dinle, true)
    document.addEventListener('auxclick', dinle, true)
    return () => {
      document.removeEventListener('click', dinle, true)
      document.removeEventListener('auxclick', dinle, true)
    }
  }, [pathname])

  return null
}
