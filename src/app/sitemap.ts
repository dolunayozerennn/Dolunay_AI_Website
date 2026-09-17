import { MetadataRoute } from 'next'
import { getPosts } from '@/lib/mdx'

export const dynamic = 'force-static'

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
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1 : 0.9,
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
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }))

  return [...staticUrls, ...blogUrls, ...legalUrls]
}
