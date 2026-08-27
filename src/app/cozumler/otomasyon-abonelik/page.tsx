import type { Metadata } from 'next'
import { RefreshCw, CreditCard, XCircle, Check, Mail, Star } from 'lucide-react'
import { AbonelikKosullari } from '@/components/AbonelikKosullari'

export const metadata: Metadata = {
  title: 'Otomasyon Aboneliği | dolunay.ai',
  description:
    'Yapay zeka otomasyonlarınız için aylık abonelik paketleri, kapsam ve abonelik koşulları.',
  alternates: { canonical: '/cozumler/otomasyon-abonelik' },
}

type Paket = {
  ad: string
  ozet: string
  icerik: string[]
  one_cikan?: boolean
  rozet?: string
}

const paketler: Paket[] = [
  {
    ad: 'Bakım',
    ozet: 'Kurulu otomasyonunuzun çalışır kalması.',
    icerik: [
      '7/24 çalışma takibi ve kesinti bildirimi',
      'Hata müdahalesi ve onarım',
      'Model ve API güncellemelerinin uygulanması',
      'Aylık performans raporu',
      'E-posta destek, iki iş günü içinde dönüş',
    ],
  },
  {
    ad: 'Yönetilen Otomasyon',
    ozet: 'Bakımın üstüne sürekli geliştirme ve altyapı.',
    one_cikan: true,
    rozet: 'En çok tercih edilen',
    icerik: [
      'Bakım paketindeki her şey',
      'Sunucu, API ve yapay zeka kullanım bedeli dahil',
      'Her ay yeni senaryo ve iyileştirme',
      'Yeni kanal ve entegrasyon eklenmesi',
      'Haftalık performans raporu',
      'WhatsApp destek hattı, aynı gün dönüş',
    ],
  },
  {
    ad: 'Kurumsal',
    ozet: 'Çok lokasyonlu ve yüksek hacimli operasyonlar.',
    icerik: [
      'Yönetilen Otomasyon paketindeki her şey',
      'Birden fazla lokasyon ve ekip',
      'Size özel geliştirme takvimi',
      'Tanımlı yanıt süresi taahhüdü (SLA)',
      'Adanmış proje yöneticisi',
      'Aylık değerlendirme toplantısı',
    ],
  },
]

const rozetler = [
  { ikon: RefreshCw, metin: 'Aylık faturalanır' },
  { ikon: CreditCard, metin: 'Kayıtlı kredi kartından otomatik tahsil edilir' },
  { ikon: XCircle, metin: 'Dilediğiniz zaman iptal edilir' },
]

export default function OtomasyonAbonelikPage() {
  return (
    <div className="pt-32 pb-28 relative min-h-screen bg-[#08090C] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#4F8BFF]/5 blur-[120px] rounded-[100%] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Baslik */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4F8BFF]/10 border border-[#4F8BFF]/20 text-[#4F8BFF] text-sm font-bold tracking-wider mb-6 uppercase">
            <RefreshCw className="w-4 h-4" /> Aylık Abonelik
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
            Yapay Zeka Otomasyon <span className="text-gradient-accent">Aboneliği</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Kurduğumuz otomasyonlar kurulup bırakılmıyor. Her ay izleniyor, güncelleniyor
            ve geliştiriliyor. Bu hizmeti aylık abonelik olarak veriyoruz.
          </p>
        </div>

        {/* Abonelik rozetleri */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {rozetler.map((r) => (
            <span
              key={r.metin}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-gray-300 text-sm"
            >
              <r.ikon className="w-4 h-4 text-[#4F8BFF] shrink-0" />
              {r.metin}
            </span>
          ))}
        </div>

        {/* Paket kartlari */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-14">
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
                </>
              )}

              <div className="relative z-10 flex flex-col h-full">
                {p.one_cikan && (
                  <span className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4F8BFF]/15 border border-[#4F8BFF]/30 text-[#7AA8FF] text-xs font-bold mb-4">
                    <Star className="w-3 h-3 fill-current" /> {p.rozet}
                  </span>
                )}

                <h2 className="text-2xl font-bold text-white mb-2">{p.ad}</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{p.ozet}</p>

                <div className="mb-6">
                  <span className="text-base font-semibold text-white/85">
                    Aylık bedel teklife göre belirlenir
                  </span>
                </div>

                <div className="h-px bg-white/5 mb-6" />

                <ul className="space-y-3">
                  {p.icerik.map((madde, i) => (
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
              </div>
            </div>
          ))}
        </div>

        {/* Fiyatlandirma */}
        <section className="rounded-3xl border border-white/5 bg-[#0a0a0f] p-8 md:p-10 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">Fiyatlandırma</h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              Her işletmenin otomasyon kapsamı farklı olduğu için sabit bir liste fiyatı
              yayınlamıyoruz. Aylık bedel, keşif görüşmesinin ardından size özel teklifte
              belirlenir ve sözleşmede sabitlenir.
            </p>
            <p>
              Abonelik dönemi boyunca tek taraflı değişmez. Aboneliğiniz başlatıldığında
              paketiniz, aylık bedeliniz ve tahsilat gününüz size özel abonelik sayfanızda
              yazılı olarak gösterilir.
            </p>
          </div>
        </section>

        {/* Abonelik kosullari */}
        <div className="mb-14">
          <AbonelikKosullari />
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Kapsamınızı konuşalım
          </h2>
          <p className="text-gray-500 text-base mb-8 max-w-xl mx-auto leading-relaxed">
            İşletmenize hangi paketin uyduğunu keşif görüşmesinde birlikte belirliyoruz.
          </p>
          <a
            href="mailto:dolunay@dolunay.ai?subject=Otomasyon%20Aboneli%C4%9Fi%20Talebi"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-[#4F8BFF] to-[#4F8BFF] hover:from-[#7AA8FF] hover:to-[#4F8BFF] rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(79,139,255,0.3)] hover:shadow-[0_0_50px_rgba(79,139,255,0.5)]"
          >
            <Mail className="w-5 h-5" /> Keşif Görüşmesi Talep Et
          </a>
        </div>

      </div>
    </div>
  )
}
