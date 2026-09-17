// DUZELTME (2026-09-17): bu sayfa kendi H1'ine, kendi basligina ve 293
// kelimelik kendi govde metnine sahip; canonical'i /cozumler'e gosterince
// Google bu adresi hic kendi adina siralamiyordu. Kendi kanonikligini alsin
// diye canonical KENDI adresine cevrildi (bkz. layout.tsx'teki ayni not).
import { ServicesSection } from '@/components/sections/ServicesSection'
import { AbonelikSeridi } from '@/components/AbonelikSeridi'
import type { Metadata } from 'next'

// Not: '/cozumler' layout'u kendi title'ini duz metin olarak tanimladigi icin
// kokteki '%s | dolunay.ai' sablonu BU alt sayfalara inmez. Marka adi burada
// elle yazilir; kaldirilirsa baslik markasiz kalir.
export const metadata: Metadata = {
  title: 'Yapay Zeka Danışmanlık ve Otomasyon Hizmetleri | dolunay.ai',
  description: 'İşletmeniz için özel yapay zeka ajanları ve otomasyon hizmetleri tasarlıyoruz.',
  alternates: { canonical: './' },
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#08090C]">
      {/* Sayfanın tek içeriği bu blok, o yüzden başlığı h1 olarak render edilir. */}
      <ServicesSection asHeading="h1" />
      <AbonelikSeridi />
    </div>
  )
}
