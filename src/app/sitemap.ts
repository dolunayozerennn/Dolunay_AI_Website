import { MetadataRoute } from 'next'
import { getPosts } from '@/lib/mdx'
import { execFileSync } from 'child_process'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-static'

// F7 (seo_geo/BULGULAR.md): statik sayfalarin lastmod'u derleme anina degil,
// KAYNAK dosyanin gercek son degisim tarihine baglanir. Google ayni gunde
// "hepsi degisti" gorunce sinyali cop sayiyordu.
// Zincir: (1) git commit tarihi (asil kaynak) -> (2) dosya mtime -> (3) simdiki
// zaman. Netlify gibi sig (shallow) klonlarda git log bos/hatali donebilir,
// bu yuzden build ASLA patlamasin diye her adim kendi try/catch'inde.
function getLastModified(route: string): Date {
  const filePath = path.join(process.cwd(), 'src', 'app', route, 'page.tsx')

  try {
    // execFileSync (argument dizisiyle) kullanilir: kabuk devreye girmez,
    // filePath'teki ozel karakterler komut enjekte edemez.
    const gitDate = execFileSync('git', ['log', '-1', '--format=%cI', '--', filePath], {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim()
    if (gitDate) return new Date(gitDate)
  } catch {
    // git yok, PATH'te degil ya da sig klonda gecmis bulunamadi -> dosya sistemine dus
  }

  try {
    return fs.statSync(filePath).mtime
  } catch {
    // dosya beklenmedik sekilde okunamiyorsa son care: simdiki zaman
  }

  return new Date()
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dolunay.ai'
  const posts = getPosts()

  // Blog post URLs
  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Static URLs
  const staticUrls = [
    '',
    '/blog',
    '/kaynaklar/scrapeunblocker',
    '/cozumler',
    '/cozumler/otomasyon-abonelik',
    // '/cozumler/hizmetler' artik kendi canonical'ina sahip (layout.tsx'teki
    // 2026-09-17 duzeltmesi), o yuzden sitemap'e de girdi.
    '/cozumler/hizmetler',
    // '/abonelik/<musteri>' bilerek YOK: musteriye ozel bedel iceriyor, noindex.
    '/egitimler/ai-factory',
    '/egitimler/kurumsal-egitimler',
    '/isbirlikleri',
    '/hakkimizda',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: getLastModified(route),
    changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1 : 0.9,
  }))

  // F9 (seo_geo/BULGULAR.md): Ingilizce artik gercek statik rotalar
  // (/en/...). Cevirisi olan yedi sayfa burada; otomasyon-abonelik ve blog
  // gibi EN karsiligi olmayan sayfalar BILEREK yok.
  const englishUrls = [
    '/en',
    '/en/cozumler',
    '/en/cozumler/hizmetler',
    '/en/egitimler/ai-factory',
    '/en/egitimler/kurumsal-egitimler',
    '/en/isbirlikleri',
    '/en/hakkimizda',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: getLastModified(route),
    changeFrequency: route === '/en' ? 'weekly' as const : 'monthly' as const,
    priority: route === '/en' ? 0.9 : 0.8,
  }))

  // Sozlesme sayfalari (KVKK, mesafeli satis vb.): Google'da zaten gorunuyor,
  // dusuk oncelikle sitemap'e eklenir ki tarama onlari da kapsasin.
  const legalUrls = [
    '/sozlesmeler/kvkk',
    '/sozlesmeler/mesafeli-satis',
    '/sozlesmeler/artifex-kosullar',
    '/sozlesmeler/artifex-gizlilik',
    '/sozlesmeler/artifex-acik-riza',
    '/sozlesmeler/artifex-veri-silme',
    '/sozlesmeler/artifex-kvkk-aydinlatma',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: getLastModified(route),
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }))

  return [...staticUrls, ...englishUrls, ...blogUrls, ...legalUrls]
}
