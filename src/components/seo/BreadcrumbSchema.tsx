type Crumb = {
  name: string
  // Son eleman (mevcut sayfa) icin url VERILMEZ: Google rehberi son adimin
  // tiklanamaz kalmasina izin verir, boylece "sayfa kendi kendini gosteren
  // link" gibi sahte bir durum olusmaz.
  url?: string
}

/**
 * BreadcrumbList JSON-LD uretir (F11, seo_geo/BULGULAR.md).
 *
 * Her sayfa KENDI hiyerarsisini kendi page.tsx'inde tanimlar; paylasilan bir
 * layout.tsx'e konursa o layout'un sardigi TUM nested route'lar ayni
 * breadcrumb'i miras alir (ornegin /cozumler/layout.tsx, /cozumler/hizmetler
 * ve /cozumler/otomasyon-abonelik'i de sarar) ve yanlis/celiskili breadcrumb
 * uretir. Bu yuzden her cagri noktasi kendi tam zincirini elle verir.
 */
export function BreadcrumbSchema({ items }: { items: Crumb[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            ...(item.url ? { item: item.url } : {}),
          })),
        }),
      }}
    />
  )
}
