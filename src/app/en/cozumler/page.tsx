// F9: TR sayfasinin (src/app/cozumler/page.tsx) AYNI bileseni yeniden
// kullanilir -- govde zaten useTranslation() ile beslendigi ve dil artik
// /en rotasindan otomatik cozuldugu icin ikinci bir kopya JSX'e gerek yok.
// (Sayfa icindeki BreadcrumbSchema JSON-LD'si TR etiket/URL'lerle kalir;
// bu script-only bir yapisal veri, gorunur/tiklanabilir bir link degil,
// bilerek cevrilmedi -- bkz. seo_geo/BULGULAR.md F9 notu.)
export { default } from '../../cozumler/page'
