import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /panel: musteri paneli, arama sonuclarinda yeri yok. Sayfalarda ayrica
      // <meta name="robots" content="noindex, nofollow"> ve netlify.toml'da
      // /panel/* icin X-Robots-Tag basligi var.
      disallow: ['/api/', '/r/', '/r', '/panel/'],
    },
    sitemap: 'https://dolunay.ai/sitemap.xml',
  }
}
