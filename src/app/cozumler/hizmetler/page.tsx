// KOPYA ICERIK KONSOLIDASYONU: bu sayfanin govde metninin tamami /cozumler
// icinde de aynen var (17 cumlenin 15'i ortak). Ikisi de indekslenirse Google
// birini kopya sayip eler ve siralama sinyali ikiye bolunur. Bu yuzden asil
// adres /cozumler ilan edilir. Sayfa ziyaretciye acik kalir, sadece arama
// motoru ikisini tek sayfa sayar. Kendi basina siralanmasi isteniyorsa
// once govde metninin /cozumler'den FARKLILASMASI gerekir.
import { ServicesSection } from '@/components/sections/ServicesSection'
import { AbonelikSeridi } from '@/components/AbonelikSeridi'
import type { Metadata } from 'next'

// Not: '/cozumler' layout'u kendi title'ini duz metin olarak tanimladigi icin
// kokteki '%s | dolunay.ai' sablonu BU alt sayfalara inmez. Marka adi burada
// elle yazilir; kaldirilirsa baslik markasiz kalir.
export const metadata: Metadata = {
  title: 'Yapay Zeka Danışmanlık ve Otomasyon Hizmetleri | dolunay.ai',
  description: 'İşletmeniz için özel yapay zeka ajanları ve otomasyon hizmetleri tasarlıyoruz.',
  alternates: { canonical: '/cozumler' },
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
