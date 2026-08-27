import Link from 'next/link'
import { RefreshCw, ArrowRight } from 'lucide-react'

// Kurulan otomasyonlarin aylik abonelikle surdurulduğu, hizmet sayfalarinin
// hicbirinde yaziyordu. Odeme saglayicisi bu yuzden abonelik ekranini goremedi.
// Serit, hizmet anlatan her sayfadan abonelik sayfasina gorunur bir kapi acar.
export function AbonelikSeridi() {
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
              Otomasyon abonelik paketlerini inceleyin
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Kurduğumuz otomasyonları aylık abonelikle işletiyoruz. Paketlerin kapsamını
              ve abonelik koşullarını buradan görebilirsiniz.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 text-[#4F8BFF] font-semibold text-sm shrink-0">
            Paketleri gör
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>
    </section>
  )
}
