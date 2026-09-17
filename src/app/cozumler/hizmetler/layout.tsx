// DUZELTME (2026-09-17): bu sayfa kendi H1'ine, kendi basligina ve 293
// kelimelik kendi govde metnine sahip; canonical'i /cozumler'e gosterince
// Google bu adresi hic kendi adina siralamiyordu. Kendi kanonikligini alsin
// diye canonical KENDI adresine cevrildi. './' relative kalibi projede
// varsayilan (bkz. kok layout.tsx) — metadataBase + o anki yol olarak
// cozulup https://dolunay.ai/cozumler/hizmetler verir.
import { Metadata } from 'next'

// Not: '/cozumler' layout'u kendi title'ini duz metin olarak tanimladigi icin
// kokteki '%s | dolunay.ai' sablonu BU alt sayfalara inmez. Marka adi burada
// elle yazilir; kaldirilirsa baslik markasiz kalir.
export const metadata: Metadata = {
  title: 'Yapay Zeka Danışmanlık ve Otomasyon Hizmetleri | dolunay.ai',
  description: 'Dolunay.ai işletmelere yönelik profesyonel yapay zeka çözümleri ve hizmetleri.',
  alternates: { canonical: './' },
  openGraph: {
    title: 'Hizmetler | dolunay.ai',
    description: 'Dolunay.ai işletmelere yönelik profesyonel yapay zeka çözümleri ve hizmetleri.',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
