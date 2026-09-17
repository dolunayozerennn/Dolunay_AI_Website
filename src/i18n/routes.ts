// F9 (seo_geo/BULGULAR.md): Ingilizce artik GERCEK ayri adreslerde yasiyor
// (/en/...). Bu dosya TR<->EN adres eslemesinin TEK kaynagidir; Navbar,
// Footer ve LanguageSwitcher ayni listeyi kullanir ki bir sayfa EN'e
// eklendiginde tek yerden acilsin.
//
// Kapsam BILEREK dar: yalnizca gercekten EN cevirisi olan (useTranslation
// ile beslenen) pazarlama sayfalari burada. Blog, sozlesmeler, kaynaklar,
// abonelik/panel/r gibi TR-only sayfalar burada YOK -> bu sayfalardayken
// dil degistirici EN'e basinca /en ana sayfasina duser (bilerek, cevirisi
// olmayan sayfa icin uydurma adres yaratilmaz).
export const EN_MIRRORED_PATHS = [
  '/',
  '/cozumler',
  '/cozumler/hizmetler',
  '/egitimler/ai-factory',
  '/egitimler/kurumsal-egitimler',
  '/hakkimizda',
  '/isbirlikleri',
] as const

export type MirroredPath = (typeof EN_MIRRORED_PATHS)[number]

function isMirrored(path: string): path is MirroredPath {
  return (EN_MIRRORED_PATHS as readonly string[]).includes(path)
}

/**
 * TR-taraflı bir href'i, o an İngilizce tarafında olunuyorsa /en'e tasir.
 * Navbar/Footer'daki sabit href'ler icin: href karsilikli EN sayfasi VARSA
 * /en altina gecer, yoksa (blog, otomasyon-abonelik, sozlesmeler...) TR
 * adresinde kalir -- ic linkler boylece hicbir zaman kirik EN adresine
 * gitmez.
 */
export function withLocale(href: string, isEnglish: boolean): string {
  if (!isEnglish) return href
  if (!isMirrored(href)) return href
  return href === '/' ? '/en' : `/en${href}`
}

/**
 * Dil degistiricinin ihtiyaci olan iki adresi de hesaplar: su anki
 * pathname'den TR karsiligi ve EN karsiligi. /en altinda olmayan bir TR
 * sayfasinin cevirisi yoksa EN karsiligi /en (ana sayfa) olur.
 */
export function counterpartPaths(pathname: string): { tr: string; en: string } {
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const trPath = pathname === '/en' ? '/' : pathname.slice('/en'.length)
    return { tr: trPath, en: pathname }
  }
  return { tr: pathname, en: withLocale(pathname, true) }
}
