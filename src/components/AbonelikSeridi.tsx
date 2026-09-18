'use client'

import Link from 'next/link'
import { RefreshCw, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/i18n/i18n'

// Kurulan otomasyonlarin aylik abonelikle surdurulduğu, hizmet sayfalarinin
// hicbirinde yaziyordu. Odeme saglayicisi bu yuzden abonelik ekranini goremedi.
// Serit, hizmet anlatan her sayfadan abonelik sayfasina gorunur bir kapi acar.
//
// Metin BURADA duruyor, locale JSON'larinda degil: en.json'da karsiligi
// bulunmayan anahtar tr.json'a dusuyor ve Ingilizce sayfaya Turkce metin
// siziyor (canlida oldu — /en/cozumler ve /en/cozumler/hizmetler). Sozlugu
// bilesenin icinde tutunca eksik ceviri derleme aninda belli olur.
//
// Baglanti hedefi iki dilde de Turkce kaliyor: /cozumler/otomasyon-abonelik
// sayfasinin Ingilizcesi YOK ve odeme akisi zaten Turkce isliyor.
const METIN = {
  tr: {
    baslik: 'Otomasyon abonelik paketlerini inceleyin',
    govde: 'Kurduğumuz otomasyonları aylık abonelikle işletiyoruz. Paketlerin kapsamını ve abonelik koşullarını buradan görebilirsiniz.',
    eylem: 'Paketleri gör',
  },
  en: {
    baslik: 'See the automation subscription plans',
    govde: 'We keep the automations we build running on a monthly subscription. Plan coverage and subscription terms are listed here.',
    eylem: 'View plans',
  },
} as const

export function AbonelikSeridi() {
  const { language } = useTranslation()
  const m = language === 'en' ? METIN.en : METIN.tr

  return (
    <section className="bg-[#08090C] pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/cozumler/otomasyon-abonelik"
          className="group flex flex-col md:flex-row md:items-center gap-6 rounded-3xl border border-[#4F8BFF]/25 bg-[#0b0e18] p-8 hover:border-[#4F8BFF]/50 transition-colors"
        >
          <span className="w-12 h-12 rounded-2xl bg-[#4F8BFF]/10 border border-[#4F8BFF]/20 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5 text-[#4F8BFF]" />
          </span>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-2">
              {m.baslik}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              {m.govde}
            </p>
          </div>

          <span className="inline-flex items-center gap-2 text-[#4F8BFF] font-semibold text-sm shrink-0">
            {m.eylem}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>
    </section>
  )
}
