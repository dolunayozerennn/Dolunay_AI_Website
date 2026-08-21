'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLanguage } from '@/i18n/i18n'
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clipboard,
  Clock3,
  Code2,
  ExternalLink,
  Eye,
  FileText,
  Gauge,
  MapPinned,
  Radar,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  UsersRound,
  Zap,
} from 'lucide-react'

type Language = 'tr' | 'en'

type Product = {
  id: 'social' | 'local' | 'travel'
  index: string
  icon: typeof Radar
  accent: string
  title: Record<Language, string>
  eyebrow: Record<Language, string>
  promise: Record<Language, string>
  payoff: Record<Language, string>
  quick: Record<Language, string>
  deep: Record<Language, string>
  promptUrl: Record<Language, string>
  exampleUrl: string
  highlights: Record<Language, string[]>
}

const products: Product[] = [
  {
    id: 'social',
    index: '01',
    icon: Radar,
    accent: '#7B61FF',
    eyebrow: { tr: 'İÇERİK', en: 'CONTENT' },
    title: { tr: 'İçerik Fırsat Radarı', en: 'Content Opportunity Radar' },
    promise: {
      tr: 'Kendi hesabını rakiplerinle karşılaştırır; sayılardan doğrudan çekilebilir üç içerik briefi çıkarır.',
      en: 'Compares your account with competitors and turns the evidence into three ready-to-shoot content briefs.',
    },
    payoff: {
      tr: 'İlk ekranda: hook, konu, format ve her önerinin dayandığı gerçek rakip verisi.',
      en: 'Above the fold: hook, topic, format, and the exact competitor evidence behind every recommendation.',
    },
    quick: { tr: 'Hızlı mod · en fazla 56 çağrı', en: 'Quick mode · up to 56 calls' },
    deep: { tr: 'Derin mod · geçmiş + haftalık fark', en: 'Deep mode · history + weekly change' },
    promptUrl: {
      tr: '/kaynaklar/scrapeunblocker/prompts/icerik-firsat-radari-tr.txt',
      en: '/kaynaklar/scrapeunblocker/prompts/content-opportunity-radar-en.txt',
    },
    exampleUrl: '/kaynaklar/scrapeunblocker/ornekler/icerik-firsat-radari.html',
    highlights: {
      tr: ['TikTok + Instagram kesin metrikleri', 'Yeni video cache’i', 'Kanıta bağlı 3 brief'],
      en: ['Exact TikTok + Instagram metrics', 'New-video cache', '3 evidence-bound briefs'],
    },
  },
  {
    id: 'local',
    index: '02',
    icon: UsersRound,
    accent: '#45D6A8',
    eyebrow: { tr: 'SATIŞ', en: 'SALES' },
    title: { tr: 'Müşteri Fırsat Radarı', en: 'Client Opportunity Radar' },
    promise: {
      tr: 'Bir bölgedeki işletmeleri bulur; bugün kime, hangi doğrulanmış eksikle ulaşacağını sıralar.',
      en: 'Finds local businesses and ranks who to contact today, using only verified evidence.',
    },
    payoff: {
      tr: 'İlk ekranda: en güçlü beş aday, kanıt, güven puanı ve çelişkisiz kısa mesaj.',
      en: 'Above the fold: top five prospects, evidence, confidence, and a contradiction-safe opener.',
    },
    quick: { tr: 'Hızlı mod · 10 işletme / 30 çağrı', en: 'Quick mode · 10 businesses / 30 attempts' },
    deep: { tr: 'Derin mod · 20 işletme / 70 çağrı', en: 'Deep mode · 20 businesses / 70 attempts' },
    promptUrl: {
      tr: '/kaynaklar/scrapeunblocker/prompts/musteri-firsat-radari-tr.txt',
      en: '/kaynaklar/scrapeunblocker/prompts/client-opportunity-radar-en.txt',
    },
    exampleUrl: '/kaynaklar/scrapeunblocker/ornekler/musteri-firsat-radari.html',
    highlights: {
      tr: ['Kanıt + güven puanı', 'Mesaj çelişki kapısı', 'CSV + kanıt dosyası'],
      en: ['Evidence + confidence score', 'Outreach contradiction gate', 'CSV + evidence file'],
    },
  },
  {
    id: 'travel',
    index: '03',
    icon: MapPinned,
    accent: '#FFB454',
    eyebrow: { tr: 'SEYAHAT', en: 'TRAVEL' },
    title: { tr: 'Seyahat Bütçe Radarı', en: 'Travel Budget Radar' },
    promise: {
      tr: 'Hedef şehir seçmeden bütçene uyan rotaları tarar; yeniden çalıştırınca yalnız fiyat değişimini öne çıkarır.',
      en: 'Scans routes without asking for a destination, then highlights only price changes on later runs.',
    },
    payoff: {
      tr: 'İlk ekranda: bütçe-altı rotalar, kişi başı fiyat, süre/aktarma ve önceki koşuya göre fark.',
      en: 'Above the fold: under-budget routes, per-person price, duration/stops, and change since the last run.',
    },
    quick: { tr: 'Hızlı mod · 8 rota × 1 pencere', en: 'Quick mode · 8 routes × 1 window' },
    deep: { tr: 'Derin mod · 20 rota × 2 pencere', en: 'Deep mode · 20 routes × 2 windows' },
    promptUrl: {
      tr: '/kaynaklar/scrapeunblocker/prompts/seyahat-butce-radari-tr.txt',
      en: '/kaynaklar/scrapeunblocker/prompts/travel-budget-radar-en.txt',
    },
    exampleUrl: '/kaynaklar/scrapeunblocker/ornekler/seyahat-butce-radari.html',
    highlights: {
      tr: ['Kişi başı fiyatı açık etiketler', 'Fiyat geçmişi + fark', 'Bozuk uçta veri uydurmaz'],
      en: ['Explicit per-person pricing', 'Price history + delta', 'Never fabricates on endpoint failure'],
    },
  },
]

const copy: Record<Language, Record<string, string>> = {
  tr: {
    badge: 'SCRAPEUNBLOCKER × DOLUNAY.AI',
    heroLead: 'Yapay zekaya interneti ver.',
    heroDrama: 'Üç gerçek ürün çıkar.',
    heroBody:
      'Tek bir API anahtarıyla rakip içerikleri çöz, satış fırsatlarını sırala ve bütçene uyan rotaları takip et. Kod bilmene gerek yok; ürünü kullandığın kodlama aracı kuruyor.',
    jump: 'Ürünleri ve promptları gör',
    signup: 'Ücretsiz 500 kredi kazan',
    proofOne: 'mini ürün',
    proofTwo: 'Türkçe + İngilizce prompt',
    proofThree: 'tek seferlik başlangıç isteği',
    sectionEyebrow: 'SONUÇ ÖNCE',
    sectionTitle: 'Bir demo değil. Tekrar kullanabileceğin üç araç.',
    sectionBody:
      'Her ürün Hızlı modda düşük bütçeyle ilk değeri gösterir; Derin modda geçmişi ve değişimi açar.',
    copyPrompt: "Master Prompt'u kopyala",
    copying: 'Prompt yükleniyor…',
    copied: "Kopyalandı — aracına yapıştır",
    copyError: 'Kopyalama olmadı · metni aç',
    readPrompt: 'Prompt metnini aç / indir',
    viewExample: 'Örneği gör',
    whatYouGet: 'Çıktı',
    howEyebrow: '3 ADIM',
    howTitle: 'Sıfırdan çalışan ürüne, üç adımda.',
    stepOne: 'Kodlama aracını kur',
    stepOneBody: 'Claude Code ya da Codex, hangisini istersen. İkisi de terminalden çalışır ve kurulumu birkaç dakika sürer.',
    stepTwo: "ScrapeUnblocker'a ücretsiz üye ol",
    stepTwoBody: 'Kayıt olunca 500 istek bir defaya mahsus hesabına düşer. Panelden API anahtarını kopyala.',
    stepThree: 'Promptu kopyala, aracına yapıştır',
    stepThreeBody: 'Aşağıdaki üç üründen beğendiğini seç. Klasörü, sanal ortamı, testleri ve raporu aracın kendisi kurar. Anahtarı sohbete yazma; ürün onu gizli terminal alanında bir kez sorar.',
    truthEyebrow: 'ŞEFFAF KULLANIM',
    truthTitle: '“Bedava” derken neyi kastettiğimiz net.',
    truthBody:
      'Kayıtta 500 istek bir defa verilir; aylık yenilenen ücretsiz plan değildir. Her rapor deneme, başarılı 2xx ve cache sayılarını ayrı gösterir. Kalan bakiyeyi tahmin etmez.',
    pluginEyebrow: 'EKLENTİ VE SDK',
    pluginTitle: 'Eklenti araştırma yüzeyi. SDK ürün motoru.',
    pluginBody:
      'Claude Code kullanıyorsan resmi eklenti hızlı sayfa okuma anı için harika. Buradaki üç ürün ise hangi aracı kullanırsan kullan resmi Python SDK ile kurulur; özel uçlara ve tekrar çalıştırmaya ihtiyaç duyarlar.',
    faqTitle: 'Kısa cevaplar',
    faqOneQ: 'Üçünü birden kurmak zorunda mıyım?',
    faqOneA: 'Hayır. Her Master Prompt bağımsızdır; yalnız ihtiyacın olan ürünü kurabilirsin.',
    faqTwoQ: 'Uzun tarama videoda gerçekten canlı mı?',
    faqTwoA:
      'Hızlı kanarya canlı gösterilir. Uzun Derin taramalar zaman damgalı ön koşuyla açılır; bekleme süresi kesildiyse videoda açıkça söylenir.',
    faqThreeQ: 'Veri gelmezse ne olur?',
    faqThreeA:
      'Ürün kısmi veya bloklu rapor verir. Uçuş, işletme ya da sosyal sayı uydurmaz; hatayı ve hangi ucun çalışmadığını görünür bırakır.',
    finalTitle: 'İlk çalışan ürününü şimdi kur.',
    finalBody: 'Bir prompt seç. Gerisini aracın kursun.',
    disclosure: 'Bu kaynak ScrapeUnblocker iş birliği kapsamında hazırlanmıştır.',
  },
  en: {
    badge: 'SCRAPEUNBLOCKER × DOLUNAY.AI',
    heroLead: 'Give your AI the web.',
    heroDrama: 'Get three real products.',
    heroBody:
      'Use one API key to decode competitor content, rank sales opportunities, and track routes that fit your budget. Your coding agent builds the product for you.',
    jump: 'See the products and prompts',
    signup: 'Get 500 free credits',
    proofOne: 'micro products',
    proofTwo: 'Turkish + English prompts',
    proofThree: 'one-time starter requests',
    sectionEyebrow: 'OUTCOME FIRST',
    sectionTitle: 'Not a demo. Three tools you can run again.',
    sectionBody:
      'Quick mode proves value with a small budget. Deep mode unlocks history and change tracking.',
    copyPrompt: 'Copy the Master Prompt',
    copying: 'Loading prompt…',
    copied: 'Copied — paste into your agent',
    copyError: 'Copy failed · open the text',
    readPrompt: 'Open / download the prompt',
    viewExample: 'See a real example',
    whatYouGet: 'Output',
    howEyebrow: '3 STEPS',
    howTitle: 'From zero to a working product, in three steps.',
    stepOne: 'Install a coding agent',
    stepOneBody: 'Claude Code or Codex, whichever you prefer. Both run in the terminal and install in minutes.',
    stepTwo: 'Create a free ScrapeUnblocker account',
    stepTwoBody: 'Signup drops 500 one-time requests into your account. Copy the API key from the dashboard.',
    stepThree: 'Copy a prompt, paste it into your agent',
    stepThreeBody: 'Pick one of the three products below. Your agent creates the folder, environment, tests, and report. The key never goes into chat; the product asks for it once in a hidden terminal field.',
    truthEyebrow: 'HONEST USAGE',
    truthTitle: '“Free” means one specific thing.',
    truthBody:
      'Signup includes 500 requests once; this is not a monthly free plan. Every report separates attempts, successful 2xx calls, and cache hits. It never guesses your remaining balance.',
    pluginEyebrow: 'PLUGIN AND SDK',
    pluginTitle: 'Plugin for research. SDK for persistent products.',
    pluginBody:
      'If you use Claude Code, the official plugin is ideal for a fast page-reading moment. The three products here use the official Python SDK whatever agent you run, because they need specialist endpoints and repeat runs.',
    faqTitle: 'Short answers',
    faqOneQ: 'Do I have to install all three?',
    faqOneA: 'No. Every Master Prompt is independent; install only the product you need.',
    faqTwoQ: 'Are long scans really live in the video?',
    faqTwoA:
      'The quick canary is live. Long Deep scans open a timestamped pre-run; any cut in waiting time is disclosed.',
    faqThreeQ: 'What happens when data is unavailable?',
    faqThreeA:
      'The product returns a partial or blocked report. It never invents a flight, business, or social metric; the failing endpoint stays visible.',
    finalTitle: 'Build your first working product now.',
    finalBody: 'Choose one prompt. Let your agent build the rest.',
    disclosure: 'This resource was created in partnership with ScrapeUnblocker.',
  },
}

function PromptCard({
  product,
  language,
  onCopy,
  copyState,
}: {
  product: Product
  language: Language
  onCopy: (product: Product) => Promise<void>
  copyState: 'idle' | 'loading' | 'copied' | 'error'
}) {
  const Icon = product.icon
  const t = copy[language]

  // İkincil düğmeler (prompt metni + örnek) kartın kendi vurgu rengiyle
  // parlar; kart ikonundaki 55/14 alfa dili aynen sürer. Renkler CSS
  // değişkeninden gelir, çünkü satır içi style hover sınıflarını ezer.
  const secondaryAction = {
    '--btn-border': `${product.accent}55`,
    '--btn-bg': `${product.accent}14`,
    '--btn-border-hover': `${product.accent}AA`,
    '--btn-bg-hover': `${product.accent}26`,
    '--btn-glow': `${product.accent}55`,
  } as CSSProperties
  const secondaryActionClass =
    'inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--btn-border)] bg-[var(--btn-bg)] px-5 text-sm font-medium text-[#F4F2EC] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--btn-border-hover)] hover:bg-[var(--btn-bg-hover)] hover:shadow-[0_0_26px_-8px_var(--btn-glow)]'

  return (
    <motion.article
      id={product.id}
      initial={{ y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0E0F14] p-6 sm:p-8"
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-10 blur-[90px] transition-opacity duration-500 group-hover:opacity-20"
        style={{ backgroundColor: product.accent }}
      />

      <div className="relative z-10">
        <div className="mb-8 flex items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            <span
              className="grid h-12 w-12 place-items-center rounded-2xl border"
              style={{ borderColor: `${product.accent}55`, backgroundColor: `${product.accent}14` }}
            >
              <Icon className="h-5 w-5" style={{ color: product.accent }} />
            </span>
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] text-[#8A8E99]">
                {product.index} · {product.eyebrow[language]}
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-[#F4F2EC]">{product.title[language]}</h3>
            </div>
          </div>
          <span className="hidden rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] text-[#8A8E99] sm:block">
            V2
          </span>
        </div>

        <p className="max-w-2xl text-base leading-7 text-[#C9CCD4]">{product.promise[language]}</p>

        <div className="my-7 rounded-2xl border border-white/[0.07] bg-black/20 p-5">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8A8E99]">
            {t.whatYouGet}
          </p>
          <p className="leading-6 text-[#F4F2EC]">{product.payoff[language]}</p>
        </div>

        <div className="mb-7 grid gap-2 sm:grid-cols-3">
          {product.highlights[language].map((highlight) => (
            <div key={highlight} className="flex items-start gap-2 rounded-xl bg-white/[0.03] px-3 py-3 text-sm text-[#C9CCD4]">
              <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: product.accent }} />
              <span>{highlight}</span>
            </div>
          ))}
        </div>

        <div className="mb-7 flex flex-wrap gap-2 font-mono text-[11px] text-[#8A8E99]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-3 py-2">
            <Zap className="h-3.5 w-3.5" /> {product.quick[language]}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-3 py-2">
            <Clock3 className="h-3.5 w-3.5" /> {product.deep[language]}
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => onCopy(product)}
            disabled={copyState === 'loading'}
            className="btn-primary inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-5 text-sm disabled:cursor-wait disabled:opacity-70"
          >
            {copyState === 'copied' ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
            {copyState === 'loading'
              ? t.copying
              : copyState === 'copied'
                ? t.copied
                : copyState === 'error'
                  ? t.copyError
                  : t.copyPrompt}
          </button>
          <a
            href={product.promptUrl[language]}
            target="_blank"
            rel="noopener noreferrer"
            style={secondaryAction}
            className={secondaryActionClass}
          >
            <FileText className="h-4 w-4" style={{ color: product.accent }} /> {t.readPrompt}
          </a>
          <a
            href={product.exampleUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={secondaryAction}
            className={secondaryActionClass}
          >
            <Eye className="h-4 w-4" style={{ color: product.accent }} /> {t.viewExample}
          </a>
        </div>
      </div>
    </motion.article>
  )
}

export function PromptExperience() {
  // Dil sitenin KENDİ seçicisinden gelir (navbar). Bu sayfada eskiden ayrı bir
  // TR/EN düğmesi vardı; navbar seçicisiyle aynı sağ hizaya, hemen altına
  // düşüyor ve üst üste biniyordu. Tek dil kontrolü navbar'dakidir.
  // Sayfa metni yalnız TR ve EN taşır, o yüzden zh/es İngilizceye düşer.
  const { language: siteLanguage } = useLanguage()
  const language: Language = siteLanguage === 'tr' ? 'tr' : 'en'
  const [copyStates, setCopyStates] = useState<Record<string, 'idle' | 'loading' | 'copied' | 'error'>>({})
  const reduceMotion = useReducedMotion()
  const t = copy[language]

  const stats = useMemo(
    () => [
      ['3', t.proofOne],
      ['6', t.proofTwo],
      ['500', t.proofThree],
    ],
    [t],
  )

  const steps = useMemo(
    () => [
      {
        icon: TerminalSquare,
        index: '01',
        title: t.stepOne,
        body: t.stepOneBody,
        links: [
          { label: 'Claude Code', href: 'https://claude.com/product/claude-code', sponsored: false },
          { label: 'Codex', href: 'https://chatgpt.com/tr-TR/download/', sponsored: false },
        ],
      },
      {
        icon: ShieldCheck,
        index: '02',
        title: t.stepTwo,
        body: t.stepTwoBody,
        links: [{ label: t.signup, href: '/go/scrapeunblocker-web', sponsored: true }],
      },
      {
        icon: Clipboard,
        index: '03',
        title: t.stepThree,
        body: t.stepThreeBody,
        links: [{ label: t.jump, href: '#products', sponsored: false }],
      },
    ],
    [t],
  )

  // <html lang> artık LanguageProvider'ın işi. Sayfa kendi yazsaydı zh-CN ve
  // es'i sessizce 'en' yapardı; sayfadan çıkarken de dili 'tr'ye zorluyordu.

  async function copyPrompt(product: Product) {
    setCopyStates((current) => ({ ...current, [product.id]: 'loading' }))
    try {
      const response = await fetch(product.promptUrl[language], { cache: 'no-store' })
      if (!response.ok) throw new Error(`Prompt HTTP ${response.status}`)
      const prompt = await response.text()
      if (prompt.trim().length < 1000) throw new Error('Prompt content is unexpectedly short')

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(prompt)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = prompt
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        textarea.remove()
      }

      setCopyStates((current) => ({ ...current, [product.id]: 'copied' }))
      window.setTimeout(
        () => setCopyStates((current) => ({ ...current, [product.id]: 'idle' })),
        4200,
      )
    } catch {
      setCopyStates((current) => ({ ...current, [product.id]: 'error' }))
    }
  }

  return (
    <div className="relative overflow-hidden bg-[#08090C] text-[#F4F2EC]">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:28px_28px]" />

      <section className="relative z-10 flex min-h-[calc(100dvh-5rem)] items-center px-5 pb-20 pt-20 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-[#4F8BFF]/10 blur-[140px]" />
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#4F8BFF]/25 bg-[#4F8BFF]/[0.08] px-4 py-2 font-mono text-[10px] tracking-[0.18em] text-[#7AA8FF]">
              <Sparkles className="h-3.5 w-3.5" /> {t.badge}
            </span>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 38 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-5xl"
          >
            <h1 className="text-[clamp(3rem,7.8vw,7.2rem)] font-semibold leading-[1.04] tracking-[-0.055em]">
              <span className="block text-[#F4F2EC]">{t.heroLead}</span>
              <span className="mt-1 block bg-gradient-to-r from-[#7AA8FF] via-[#B8CBFF] to-[#7B61FF] bg-clip-text pb-[0.14em] text-transparent">
                {t.heroDrama}
              </span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#C9CCD4] sm:text-xl">{t.heroBody}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="#products" className="btn-primary inline-flex min-h-13 items-center justify-center gap-2 rounded-full px-7 text-sm">
                {t.jump} <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/go/scrapeunblocker-web"
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-7 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:border-[#4F8BFF]/40 hover:bg-[#4F8BFF]/10"
              >
                {t.signup} <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          <div className="mt-16 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-3">
            {stats.map(([number, label]) => (
              <div key={label} className="bg-[#0E0F14] px-6 py-5">
                <span className="block text-3xl font-semibold text-white">{number}</span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.15em] text-[#8A8E99]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/[0.08] bg-[#0E0F14] p-7 sm:p-12">
          <p className="mono-label text-[#7AA8FF]">{t.howEyebrow}</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">{t.howTitle}</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {steps.map(({ icon: StepIcon, index, title, body, links }) => (
              <div key={index} className="flex flex-col rounded-[2rem] border border-white/[0.07] bg-white/[0.025] p-6">
                <div className="mb-7 flex items-center justify-between">
                  <StepIcon className="h-5 w-5 text-[#7AA8FF]" />
                  <span className="font-mono text-xs text-[#8A8E99]">{index}</span>
                </div>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 grow leading-7 text-[#8A8E99]">{body}</p>
                {links.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target={link.href.startsWith('#') ? undefined : '_blank'}
                        rel={
                          link.href.startsWith('#')
                            ? undefined
                            : link.sponsored
                              ? 'sponsored noopener noreferrer'
                              : 'noopener noreferrer'
                        }
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition duration-300 hover:border-[#4F8BFF]/40 hover:bg-[#4F8BFF]/10"
                      >
                        {link.label}{
                          link.href.startsWith('#') ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ExternalLink className="h-3.5 w-3.5" />
                          )
                        }
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="relative z-10 px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="mono-label text-[#7AA8FF]">{t.sectionEyebrow}</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <h2 className="text-4xl font-semibold leading-tight text-white sm:text-6xl">{t.sectionTitle}</h2>
            <p className="max-w-xl text-lg leading-8 text-[#8A8E99] lg:justify-self-end">{t.sectionBody}</p>
          </div>

          <div className="mt-14 grid gap-6">
            {products.map((product) => (
              <PromptCard
                key={product.id}
                product={product}
                language={language}
                onCopy={copyPrompt}
                copyState={copyStates[product.id] ?? 'idle'}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <div className="rounded-[2.5rem] border border-[#45D6A8]/20 bg-[#45D6A8]/[0.055] p-7 sm:p-10">
            <p className="mono-label !text-[#45D6A8]">{t.truthEyebrow}</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">{t.truthTitle}</h2>
            <p className="mt-6 text-lg leading-8 text-[#C9CCD4]">{t.truthBody}</p>
            <div className="mt-8 flex items-center gap-3 text-sm text-[#8A8E99]">
              <Gauge className="h-5 w-5 text-[#45D6A8]" /> attempts · billable_2xx · cache_hits
            </div>
          </div>
          <div className="rounded-[2.5rem] border border-[#7B61FF]/20 bg-[#7B61FF]/[0.055] p-7 sm:p-10">
            <p className="mono-label !text-[#A99AFF]">{t.pluginEyebrow}</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">{t.pluginTitle}</h2>
            <p className="mt-6 text-lg leading-8 text-[#C9CCD4]">{t.pluginBody}</p>
            <div className="mt-8 flex items-center gap-3 text-sm text-[#8A8E99]">
              <Code2 className="h-5 w-5 text-[#A99AFF]" /> eklenti → araştır · SDK → tekrar çalıştır
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-4xl font-semibold text-white sm:text-5xl">{t.faqTitle}</h2>
          {[
            [t.faqOneQ, t.faqOneA],
            [t.faqTwoQ, t.faqTwoA],
            [t.faqThreeQ, t.faqThreeA],
          ].map(([question, answer]) => (
            <details key={question} className="group border-t border-white/[0.08] py-6 last:border-b">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-white">
                {question}
                <ChevronDown className="h-5 w-5 shrink-0 text-[#8A8E99] transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="max-w-3xl pt-4 leading-7 text-[#8A8E99]">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-5 pb-28 pt-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[3rem] border border-[#4F8BFF]/20 bg-gradient-to-br from-[#101A32] via-[#0E0F14] to-[#171126] p-8 text-center sm:p-16">
          <SearchCheck className="mx-auto h-8 w-8 text-[#7AA8FF]" />
          <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold text-white sm:text-6xl">{t.finalTitle}</h2>
          <p className="mt-5 text-lg text-[#C9CCD4]">{t.finalBody}</p>
          <a href="#products" className="btn-primary mt-9 inline-flex min-h-13 items-center gap-2 rounded-full px-8 text-sm">
            {t.jump} <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.15em] text-[#8A8E99]">{t.disclosure}</p>
        </div>
      </section>
    </div>
  )
}
