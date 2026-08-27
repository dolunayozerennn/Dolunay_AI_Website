import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Check, CalendarClock, Mail, Package } from 'lucide-react'
import { AbonelikKosullari } from '@/components/AbonelikKosullari'
import { abonelikler, abonelikBul } from '../_abonelikler'

export const metadata: Metadata = {
  // Kok layout '%s | dolunay.ai' sablonunu BU dala uyguluyor (/cozumler dali
  // kendi layout'unda duz metin title tanimladigi icin uygulamiyordu). Marka adi
  // burada elle yazilirsa baslik 'dolunay.ai | dolunay.ai' olur.
  title: 'Aboneliğiniz',
  description: 'Yapay zeka otomasyon aboneliğinizin kapsamı, aylık bedeli ve koşulları.',
  robots: { index: false, follow: false },
}

export function generateStaticParams() {
  return abonelikler.map((a) => ({ slug: a.slug }))
}

function tarihYaz(iso: string) {
  const aylar = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
  ]
  const [yil, ay, gun] = iso.split('-')
  return `${Number(gun)} ${aylar[Number(ay) - 1]} ${yil}`
}

export default async function AbonelikPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const abonelik = abonelikBul(slug)
  if (!abonelik) notFound()

  return (
    <div className="pt-32 pb-28 relative min-h-screen bg-[#08090C] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#4F8BFF]/5 blur-[120px] rounded-[100%] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Baslik */}
        <div className="mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4F8BFF]/10 border border-[#4F8BFF]/20 text-[#4F8BFF] text-sm font-bold tracking-wider mb-6 uppercase">
            <Package className="w-4 h-4" /> Aboneliğiniz
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3 leading-[1.1]">
            {abonelik.isletme}
          </h1>
          <p className="text-gray-400 text-lg">{abonelik.musteri}</p>
        </div>

        {/* Bedel karti */}
        <section className="rounded-3xl border border-[#4F8BFF]/40 bg-[#0b0e18] p-8 md:p-10 mb-6 relative overflow-hidden">
          <div className="absolute -top-px left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-[#4F8BFF] to-transparent" />
          <div className="absolute -top-10 -right-10 w-[180px] h-[180px] rounded-full blur-[80px] bg-[#4F8BFF]/15 pointer-events-none" />

          <div className="relative z-10">
            <p className="text-sm font-bold text-[#7AA8FF] uppercase tracking-wider mb-2">
              Paket
            </p>
            <p className="text-2xl font-bold text-white mb-8">{abonelik.paket}</p>

            <p className="text-sm font-bold text-[#7AA8FF] uppercase tracking-wider mb-2">
              Aylık bedel
            </p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-bold text-white">{abonelik.tutar}</span>
              <span className="text-2xl font-semibold text-white/70">
                {abonelik.paraBirimi}
              </span>
              <span className="text-gray-500 text-lg">/ {abonelik.periyot}</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">+ KDV</p>

            <div className="h-px bg-white/5 mb-6" />

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 text-gray-300 leading-relaxed">
                <CalendarClock className="w-4 h-4 text-[#4F8BFF] shrink-0 mt-0.5" />
                <span>
                  Her ayın {abonelik.tahsilatGunu}&apos;ünde kayıtlı kredi kartınızdan
                  otomatik tahsil edilir.
                </span>
              </div>
              <div className="flex items-start gap-3 text-gray-400 leading-relaxed">
                <Mail className="w-4 h-4 text-[#4F8BFF] shrink-0 mt-0.5" />
                <span>{abonelik.faturaNotu}</span>
              </div>
            </div>

            <p className="text-gray-500 text-sm mt-6">
              Abonelik başlangıcı: {tarihYaz(abonelik.baslangic)}
            </p>
          </div>
        </section>

        {/* Kapsam */}
        <section className="rounded-3xl border border-white/5 bg-[#0a0a0f] p-8 md:p-10 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">Kapsam</h2>
          <ul className="space-y-3">
            {abonelik.kapsam.map((madde, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-[#4F8BFF]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#4F8BFF]" />
                </span>
                <span>{madde}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Abonelik kosullari */}
        <AbonelikKosullari />

        <p className="text-center text-gray-500 text-sm mt-10 leading-relaxed">
          Aboneliğinizle ilgili her soru için{' '}
          <a href="mailto:dolunay@dolunay.ai" className="text-[#4F8BFF] hover:underline">
            dolunay@dolunay.ai
          </a>{' '}
          adresine yazabilirsiniz.
        </p>

      </div>
    </div>
  )
}
