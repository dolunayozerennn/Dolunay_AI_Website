import type { Metadata } from 'next'
import { Sparkles, Users, Clock, Check, Mail, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kurumsal Eğitim Paketleri 2026 | dolunay.ai',
  description: 'Şirketlere özel yapay zeka eğitim paketleri ve güncel fiyat listesi.',
  robots: { index: false, follow: false },
}

type Paket = {
  ad: string
  fiyat: string
  sure: string
  limit: string
  icerik: string[]
  one_cikan?: boolean
  rozet?: string
}

const paketler: Paket[] = [
  {
    ad: 'Starter',
    fiyat: '35.000',
    sure: '3 saat online (Zoom)',
    limit: '50 kişiye kadar',
    icerik: [
      'Hızlı yapay zeka farkındalığı',
      'Temel AI araçlarının etkili kullanımı',
      'Etkili prompt yazımı',
    ],
  },
  {
    ad: 'Pro',
    fiyat: '55.000',
    sure: '6 saat online (Zoom)',
    limit: 'Sınırsız katılımcı',
    one_cikan: true,
    rozet: 'En çok tercih edilen',
    icerik: [
      'Temelden ileriye üretken AI pratiği',
      'Gerçek zamanlı canlı demolar',
      'Sektöre özel mini atölyeler',
    ],
  },
  {
    ad: 'Premium',
    fiyat: '60.000',
    sure: '1 tam gün yüz yüze (8 saat)',
    limit: 'Sınırsız katılımcı',
    icerik: [
      'Sektöre özel uygulamalı workshop',
      'Yerinde otomasyon kurulumu',
      'Konaklama ve ulaşım dahil',
    ],
  },
  {
    ad: 'Bire Bir Danışmanlık',
    fiyat: '95.000',
    sure: '8 × 1 saat birebir seans',
    limit: '8 kişiye kadar',
    icerik: [
      'Departman bazlı proje koçluğu',
      'Birebir uygulamalı yönlendirme',
      'Konaklama ve ulaşım dahil',
    ],
  },
]

export default function KurumsalPaketlerPage() {
  return (
    <div className="pt-32 pb-28 relative min-h-screen bg-[#08090C] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#4F8BFF]/5 blur-[120px] rounded-[100%] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4F8BFF]/10 border border-[#4F8BFF]/20 text-[#4F8BFF] text-sm font-bold tracking-wider mb-6 uppercase">
            <Sparkles className="w-4 h-4" /> Kurumsal Eğitim
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
            Kurumsal Eğitim <span className="text-gradient-accent">Paketleri</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Şirketinize özel yapay zeka eğitim programları. 2026 güncel liste.
          </p>
        </div>

        {/* Paket kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {paketler.map((p) => (
            <div
              key={p.ad}
              className={`bento-card !rounded-3xl relative overflow-hidden p-8 flex flex-col ${
                p.one_cikan
                  ? 'border border-[#4F8BFF]/40 bg-[#0b0e18]'
                  : 'border border-white/5 bg-[#0a0a0f]'
              }`}
            >
              {p.one_cikan && (
                <>
                  <div className="absolute -top-px left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-[#4F8BFF] to-transparent" />
                  <div className="absolute -top-10 -right-10 w-[180px] h-[180px] rounded-full blur-[80px] bg-[#4F8BFF]/15 pointer-events-none" />
                  <span className="absolute top-6 right-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4F8BFF]/15 border border-[#4F8BFF]/30 text-[#7AA8FF] text-xs font-bold">
                    <Star className="w-3 h-3 fill-current" /> {p.rozet}
                  </span>
                </>
              )}

              <div className="relative z-10 flex flex-col h-full">
                <h2 className="text-2xl font-bold text-white mb-4">{p.ad}</h2>

                <div className="flex items-baseline gap-1.5 mb-6">
                  <span className="text-xl font-semibold text-white/85">
                    ₺{p.fiyat}
                  </span>
                  <span className="text-gray-500 text-xs">+ KDV</span>
                </div>

                <div className="space-y-2.5 mb-6 text-sm">
                  <div className="flex items-center gap-2.5 text-gray-300">
                    <Clock className="w-4 h-4 text-[#4F8BFF] shrink-0" />
                    <span>{p.sure}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-gray-300">
                    <Users className="w-4 h-4 text-[#4F8BFF] shrink-0" />
                    <span>{p.limit}</span>
                  </div>
                </div>

                <div className="h-px bg-white/5 mb-6" />

                <ul className="space-y-3 mb-2">
                  {p.icerik.map((madde, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-[#4F8BFF]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#4F8BFF]" />
                      </span>
                      <span>{madde}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Not + CTA */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-8">
            Fiyatlar şirketin ihtiyacına göre özelleştirilebilir. Detaylı teklif için bizimle iletişime geçin.
          </p>
          <a
            href="mailto:dolunay@dolunay.ai?subject=Kurumsal%20Eğitim%20Paketi%20Talebi"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-[#4F8BFF] to-[#4F8BFF] hover:from-[#7AA8FF] hover:to-[#4F8BFF] rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(79,139,255,0.3)] hover:shadow-[0_0_50px_rgba(79,139,255,0.5)]"
          >
            <Mail className="w-5 h-5" /> Teklif Al
          </a>
        </div>

      </div>
    </div>
  )
}
