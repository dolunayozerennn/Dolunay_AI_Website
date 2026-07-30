'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Check, X, Download, Users, Video, MessageCircle, Wrench, Send } from 'lucide-react'
import { useTranslation } from '@/i18n/i18n'

// İçerik kaynağı: Skool topluluk sayfasının kendi metni (skool.com/yapay-zeka-factory/about).
// Buradaki hiçbir vaat uydurulmadı; sayısal bilgiler (fiyat, üye sayısı, yayın sıklığı)
// oradan alındı. Skool'da değişirse burası da güncellenmeli.
const SKOOL_URL = 'https://www.skool.com/yapay-zeka-factory/about?ref=044f39496d4f45fab11775bcefe4b7f4'

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const }
  })
}

const iceridekiler = [
  {
    icon: <Wrench className="w-6 h-6" />,
    baslik: 'Ticarileştirdiğim sistemler',
    metin: 'Müşterilere kurduğum ve para kazandıran otomasyonların aynısına erişiyorsun. Vitrin değil, sahada çalışan sistemler.',
  },
  {
    icon: <Download className="w-6 h-6" />,
    baslik: 'Hazır otomasyonlar',
    metin: 'İndir ve anında çalıştır. Sıfırdan kurmakla uğraşmıyorsun, çalışan bir sistemi kendi işine uyarlıyorsun.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    baslik: 'İş fırsatları ve müşteri paylaşımı',
    metin: 'Topluluğa gelen işleri paylaşıyoruz. Öğrendiğin sistemi satabileceğin yer de aynı yerde.',
  },
  {
    icon: <Video className="w-6 h-6" />,
    baslik: 'Haftada iki canlı yayın',
    metin: 'Kayıttan izlenen ders değil. Canlı kurulum, canlı soru, canlı çözüm.',
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    baslik: 'Birebir soru cevap',
    metin: 'Takıldığın yeri sorarsın, cevabını alırsın. Forumda kaybolmuş bir soru olarak kalmaz.',
  },
]

const olmayanlar = [
  { baslik: 'Teorik eğitim yok', metin: 'Yapay zekanın tarihini anlatmıyoruz. Çalışan sistem kuruyoruz.' },
  { baslik: 'Saatler süren video yok', metin: 'İzlemesi bir hafta süren müfredat yok. Kurulan şeyi görürsün, kendin kurarsın.' },
]

const adimlar = [
  { num: '01', baslik: 'Katıl', metin: 'Skool üzerinden topluluğa girersin. Tüm arşiv aynı gün açılır.' },
  { num: '02', baslik: 'İndir', metin: 'Hazır otomasyonlardan işine uyanı seçip indirirsin.' },
  { num: '03', baslik: 'Çalıştır', metin: 'Kendi hesaplarına bağlarsın. Takıldığın yerde canlı yayında ya da birebir sorarsın.' },
  { num: '04', baslik: 'Sat', metin: 'Çalışan sistemi bir işletmeye kurarsın. Gelen işleri toplulukta paylaşıyoruz.' },
]

const sorular = [
  {
    soru: 'AI Factory nedir?',
    cevap: 'Yapay zeka otomasyonlarını kopyalayıp kendi işinde ya da müşterinde çalıştırman için kurulmuş bir topluluk. İçinde ticarileştirilmiş hazır sistemler, haftada iki canlı yayın ve birebir soru cevap var.',
  },
  {
    soru: 'Ücreti ne kadar?',
    cevap: 'Aylık 39 dolar. Skool üzerinden ödenir, üyelik oradan yönetilir.',
  },
  {
    soru: 'Yazılım bilmem gerekiyor mu?',
    cevap: 'Sistemler kurulmaya hazır geliyor. Sıfırdan kod yazmıyorsun, çalışan bir otomasyonu kendi hesaplarına bağlıyorsun. Takıldığın yerde canlı yayında ve birebir soru cevapta destek alırsın.',
  },
  {
    soru: 'Katılmadan önce soru sorabilir miyim?',
    cevap: 'Evet. Skool sayfasındaki WhatsApp ön danışma hattından yazabilirsin.',
  },
  {
    soru: 'Canlı yayınlara katılamazsam ne olur?',
    cevap: 'Toplulukta arşiv duruyor. Ayrıca sorunu birebir sorabilirsin, yayını beklemen gerekmez.',
  },
  {
    soru: 'Kimler için uygun değil?',
    cevap: 'Teorik yapay zeka eğitimi arıyorsan burası değil. Akademik müfredat ve saatler süren ders videosu yok.',
  },
]

export default function AIFactoryPage() {
  const { t } = useTranslation();

  return (
    <div className="relative">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-32 pb-24 relative flex flex-col items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-blue-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4"><span className="halftone-arc" aria-hidden />{t('aiFactory.badge')}</span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
              {t('aiFactory.title')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">{t('aiFactory.titleHighlight')}</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
              {t('aiFactory.desc')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-10">
              <span>400+ üye</span>
              <span aria-hidden className="text-white/15">•</span>
              <span>Aylık 39 dolar</span>
              <span aria-hidden className="text-white/15">•</span>
              <span>Haftada 2 canlı yayın</span>
            </div>
            <a
              href={SKOOL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-blue-500/25"
            >
              {t('aiFactory.btn')} <ArrowUpRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── İçeride ne var ───────────────────────────────────── */}
      <section className="pb-28 relative">
        <div className="halftone-divider max-w-5xl mx-auto mb-28" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold mb-5 tracking-tight text-white">
              İçeride <span className="text-gradient-accent">ne var</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-gray-400 text-lg leading-relaxed">
              Bana kazandıran sistemleri kopyalayıp çalıştırıyorsun. Sıfırdan öğrenmiyorsun, çalışanı alıyorsun.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {iceridekiler.map((k, i) => (
              <motion.div
                key={k.baslik}
                variants={fadeUp}
                custom={i}
                className="bento-card !rounded-3xl p-8 border border-white/5 bg-[#0a0a0f] hover:border-white/10 transition-colors duration-500 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 transition-transform duration-500">
                  {k.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{k.baslik}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{k.metin}</p>
              </motion.div>
            ))}

            <motion.div
              variants={fadeUp}
              custom={iceridekiler.length}
              className="bento-card !rounded-3xl p-8 border border-white/5 bg-[#0a0a0f]"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mb-5">
                <X className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-4">Burada olmayanlar</h3>
              <ul className="space-y-3">
                {olmayanlar.map((o) => (
                  <li key={o.baslik}>
                    <p className="text-gray-300 text-sm font-medium">{o.baslik}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{o.metin}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Nasıl işliyor ────────────────────────────────────── */}
      <section className="pb-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold mb-5 tracking-tight text-white">
              Nasıl <span className="text-gradient-accent">işliyor</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-gray-400 text-lg leading-relaxed">
              Dört adım. Katıldığın gün ilk sistemi çalıştırabilirsin.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {adimlar.map((a, i) => (
              <motion.div
                key={a.num}
                variants={fadeUp}
                custom={i}
                className="bento-card !rounded-3xl p-8 border border-white/5 bg-[#0a0a0f] relative overflow-hidden group"
              >
                <span className="absolute top-4 right-5 text-5xl font-bold text-white/[0.04] group-hover:text-white/[0.07] transition-colors duration-500">
                  {a.num}
                </span>
                <h3 className="text-lg font-bold text-white mb-2 relative z-10">{a.baslik}</h3>
                <p className="text-gray-500 text-sm leading-relaxed relative z-10">{a.metin}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Sık sorulanlar ───────────────────────────────────── */}
      <section className="pb-28 relative">
        <div className="halftone-divider max-w-5xl mx-auto mb-28" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
            className="text-3xl md:text-5xl font-bold mb-14 tracking-tight text-white text-center"
          >
            Sık sorulan <span className="text-gradient-accent">sorular</span>
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-4"
          >
            {sorular.map((s, i) => (
              <motion.div
                key={s.soru}
                variants={fadeUp}
                custom={i}
                className="bento-card !rounded-2xl p-6 md:p-7 border border-white/5 bg-[#0a0a0f]"
              >
                <h3 className="text-white font-semibold mb-2 flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" aria-hidden />
                  {s.soru}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed pl-8">{s.cevap}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Kapanış ──────────────────────────────────────────── */}
      <section className="pb-32 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
            className="bento-card !rounded-3xl p-10 md:p-14 border border-white/5 bg-[#0a0a0f] text-center relative overflow-hidden"
          >
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-blue-500/10 blur-[100px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Bana kazandıran sistemleri <span className="text-gradient-accent">kopyala</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8 max-w-xl mx-auto">
                Aylık 39 dolar. 400 üzerinde kişi içeride. Emin değilsen önce WhatsApp ön danışma hattından sorabilirsin.
              </p>
              <a
                href={SKOOL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-blue-500/25"
              >
                Topluluğa katıl <Send className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
