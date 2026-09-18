'use client'

import { useLanguage } from '@/i18n/i18n'
import { GeoContentSection } from './GeoContentSection'
import { hizmetlerGeoBlocks } from '@/data/geoContent'

// /cozumler/hizmetler'in GEO bolumu. Neden ayri bir bilesen:
//
// 1. O sayfa kendi `metadata` export'unu tasiyor (canonical + hreflang oradan
//    uretiliyor), bu yuzden 'use client' YAPILAMAZ. `language === 'tr'` kontrolu
//    ise bir client hook'u istiyor. Kontrol bu ince sarmala tasindi; davranis
//    /cozumler/page.tsx'teki `{language === 'tr' && <GeoContentSection .../>}`
//    ile AYNI.
//
// 2. Bloklar sunucu sayfasindan PROP olarak GECIRILMIYOR, bu bilesenin KENDISI
//    import ediyor. Sebebi olculdu: /en/cozumler/hizmetler/page.tsx ayni
//    bileseni re-export ediyor, prop olarak gecen her sey EN sayfanin RSC
//    yukune de serilestiriliyordu ve Turkce metin `language` kontrolune ragmen
//    EN HTML'in icinde duruyordu. Import icerde kalinca metin JS parcasina
//    gidiyor, EN sayfanin HTML'ine hic girmiyor.
export function HizmetlerGeoContent() {
  const { language } = useLanguage()
  return language === 'tr' ? <GeoContentSection blocks={hizmetlerGeoBlocks} /> : null
}
