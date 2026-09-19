# dolunay.ai · SEO + GEO denetim defteri
Son güncelleme: 2026-09-17. Bu dosya ajanların ORTAK HAFIZASIDIR.
Yeni bir SEO/GEO görevi alan ajan ÖNCE burayı okur, işi bitince "DURUM" tablosunu günceller.

## Site künyesi
- Kök: `Projeler/Dolunay_AI_Website` (KENDİ git deposu, monorepo'dan ayrı)
- Next.js 15 App Router, `output: 'export'` (statik), Netlify, build `npm run build` -> `out/`
- Faz 1+2 `main`e girdi ve CANLIDA doğrulandı (595e81f). Yeni iş kendi dalında açılır.
- Çıktı Nöbeti kaydı YOK.

## ÖLÇÜLMÜŞ GERÇEKLER (tekrar ölçme, bunlara güven)

### Sağlam olan (dokunma, bozma)
- Lighthouse SEO 100/100 (ana sayfa, /egitimler/ai-factory, /blog/lawchat-3)
- Masaüstü performans 96-100, CLS 0, TBT 0 ms
- robots.txt tüm AI botlarına açık; yanlışlıkla engellenen bot YOK
- Statik export sayesinde içerik JS'siz TAM okunuyor (GPTBot ile normal tarayıcı aynı kelime sayısını görüyor) — GEO'nun ön şartı sağlanmış
- Canonical her sayfada doğru (tek istisna /cozumler/hizmetler, madde F3)
- JSON-LD ŞEMALARI GEÇERLİ: Organization, Person, Course, FAQPage, Article — bozuk JSON, eksik zorunlu alan, kırık @id YOK. Bağımsız ayrıştırmayla doğrulandı.
- Gerçek 404 dönüyor (soft-404 yok)
- next/image tutarlı, çıplak <img> sıfır, görseller webp ve hafif (hero 61 KB)
- Güvenlik başlıkları + statik varlıklarda 1 yıl immutable cache kurulu
- Gizli sayfalar bilerek noindex: /r/, /abonelik/, /panel/

### Kırık / eksik olan
| # | Bulgu | Kanıt | Durum |
|---|---|---|---|
| F1 | Ödeme logosu her sayfada 404 | netlify.toml `/odeme/*` force=true statik dosyayı yutuyor; canlıda "Ödeme açılamadı" 404 dönüyor | Faz 1'de |
| F2 | favicon.ico 404 | curl 404 (favicon.svg var) | Faz 1'de |
| F3 | /cozumler/hizmetler canonical'ı /cozumler'i gösteriyor | 293 kelimelik kendi içeriği var, kendi adına sıralanamaz | Faz 1'de |
| F4 | Blog meta description kelime ortasından kesik | 9 yazıda 160 karakterde ham kesim ("...v", "...yep") | Faz 1'de |
| F5 | Sitemap'te 7 sözleşme sayfası + /cozumler/hizmetler yok | sitemap 18 URL | Faz 1'de |
| F6 | Mobil LCP eşiğin üstünde | ana sayfa 3,1 sn / ai-factory 4,0 sn (Google eşiği 2,5). Masaüstü 0,6 / 1,2 | AÇIK — 2 tur denendi (görsel + animasyon), ikisi de ölçülebilir kazanç vermedi; ayrıntı aşağıda |
| F7 | Sitemap lastmod = derleme tarihi | 9 statik sayfanın hepsi 2026-09-16; her yayında hepsi değişmiş görünüyor, Google sinyali çöpe atar | TAMAM — git commit tarihine bağlandı, fallback: mtime -> now |
| F8 | Satış sayfaları Google'da yok | 33 adresin 13'ü indexli, 13'ü "URL is unknown to Google", 7'si "Discovered - currently not indexed" (URL Inspection API, 2026-09-18) | AÇIK — 2026-09-19: dizin dışı 20 adresin 19'unu Google hiç taramamış, incelik hükmü çürüdü (F8 üçüncü tur). Sayfalar yine de ağırlaştırıldı: `/cozumler/hizmetler` 293→1013, `/egitimler/kurumsal-egitimler` 267→999 kelime, üçer GEO bloğu canlıda. Site haritası yeniden gönderildi. Request Indexing iki satış sayfası için 2026-09-19'da Dolunay'ın elinden yapıldı. Ekim başında tarama tarihiyle yeniden oku |
| F9 | 4 dil görünüyor, gerçekte 1 dil var | dil değiştirici sadece localStorage; hreflang yok; arama motoru yalnız TR görüyor | TAMAM — /en altinda 7 gercek sayfa, karsilikli hreflang, gercek link switcher; ES/ZH kaldirildi |
| F10 | GEO içerik biçimi yok | blog yazılarında soru-başlık, doğrudan cevap, istatistik/kaynak yapısı yok | TAMAM — `geo-icerik` dalı: 7 onaylı blok (3 `/egitimler/ai-factory`, 4 `/cozumler`) `src/data/geoContent.ts`'te, `GeoContentSection` ile yalnız TR'de (`language === 'tr'`) render ediliyor; EN sayfalarda görünmüyor (doğrulandı). "Ortalama teslim süresi" cümlesi Dolunay'dan sayı gelene kadar dışarıda. 2026-09-18'de `main`e girdi ve CANLIDA doğrulandı: TR sayfalarda 7 blok `<h2>` olarak var, 7 İngilizce sayfanın hiçbirinde yok. |
| F11 | Breadcrumb / WebSite / Service şeması yok | grep | TAMAM — BreadcrumbList tüm iç sayfalarda (5 tane Artifex hukuki sayfası HARİÇ: `Projeler/Artifex_Hukuki_Sayfalar/uret_nextjs.py` ile üretiliyor, elle dokunulmaz), WebSite ana sayfada, Service /cozumler + /cozumler/hizmetler + /cozumler/otomasyon-abonelik'te |
| F12 | Article'da publisher yok, Course'ta aggregateRating yok | opsiyonel alanlar | Article publisher TAMAM; Course aggregateRating ATLANDI — gerçek puanlama verisi yok, uydurma risk |
| F13 | AI bot trafiği ölçülemiyor | Netlify Analytics kapalı, log drain yok | AÇIK |

### F6 teşhisi (yeniden ölçme, sebep bu)
- Ana sayfa LCP elemanı: hero görseli `/hero_bg/hero_Elevate_New_V1.webp` (61 KB, next/image fill).
  Faz: TTFB 715ms · Load Delay 270ms · Load Time 909ms · **Render Delay 1221ms (%39)**
- /egitimler/ai-factory LCP elemanı: Cloudinary `<video>` (poster 114 KB jpg).
  Faz: TTFB 612ms · Load Delay 533ms · Load Time 947ms · **Render Delay 1924ms (%48)**
- Her iki sayfa: 88 KB + 44 KB iki woff2 font (132 KB). Render-blocking CSS ~150-160ms.

### F6 — 2026-09-17 hız turu (`hiz-mobil` dalı, kendi lokal build+Lighthouse@12 mobil simulate, 3-6 koşu medyanı)
- Metodoloji notu: `npx serve out -s` (SPA fallback) TÜM rotalara `index.html` döndürüyor —
  ai-factory ölçümü yanlışlıkla ana sayfayı ölçüyordu. `-s` bayrağı OLMADAN doğrulandı.
- Ana sayfa baseline (6 koşu): LCP medyan 3754ms, **Render Delay medyan 2632ms (%70)**. LCP
  elemanı yine hero görseli. TTFB Lighthouse'ta sabit ~452ms (throttle profilinin tabanı).
  Gerçek (throttle'sız) ana thread işi: scriptEval 204ms, styleLayout 111ms, bootup 213ms.
- **Denendi ve GERİ ALINDI:** HeroSectionElevate'teki 6 adet framer-motion `<Reveal>`
  (motion.div, initial/animate) saf CSS keyframe'e (`.hero-reveal`, globals.css) çevrildi —
  LCP elemanının kendisi zaten animasyonun dışında ama hydration'da 6 motion.div'in
  ölçüm/stil işi ana thread'i meşgul ediyordu. Sonuç: gerçek ana thread işi düştü
  (scriptEval 204→153ms, styleLayout 111→79ms, bootup 213→130ms, %25-39 kazanç) AMA
  Lighthouse'un simüle LCP faz hesabında **Render Delay medyanı 2632→2820ms'ye çıktı**
  (6/6 koşu regresyon yönünde, gürültü değil). Sebep: Lantern'in simülasyonu CSS dosya
  boyutu/ağ bağımlılık grafiğine gerçek ana-thread kazancından daha duyarlı davranıyor;
  gerçek kullanıcı deneyimi muhtemelen iyileşti ama ÖLÇÜLEBİLİR LCP kazancı çıkmadı, KATI
  bütçe kuralına göre geri alındı (`git stash drop`, kod baseline'a döndü).
- /egitimler/ai-factory baseline (aynı yöntem): yerel testte darboğaz **Render Delay değil,
  Load Time** (~2,5-3s) — video/poster gerçek Cloudinary CDN'inden çekiliyor, bu da yerel
  headless testte dış ağ gecikmesine bağlı ve önceki turun `preload`+`fetchPriority`
  denemesiyle (BULGULAR'daki "ölçülebilir kazanç ÇIKMADI" notu) aynı alanı tekrar yokluyor.
  Bu turda tekrar denenmedi.
- **Kalan gerçek darboğaz:** ana sayfanın render-blocking Tailwind CSS'i (~14,8 KB, tek
  dosya) + next/font @font-face CSS'i (~1,3 KB, gerekli/dokunulmaz). İkisi de sayfa için
  zorunlu; ucuza küçültülemiyor (critical-CSS inline etme gibi bir çözüm gerekir, bu ölçekte
  "ucuz" değil). **Sonraki turun ai-factory'nin ANA SAYFAYI ÖLÇMEDİĞİNDEN emin olması
  şart** (yukarıdaki `-s` bayrağı tuzağı).
- Durum: **AÇIK** — F6 hedefe ulaşmadı, 80/20 sınırı içinde kaldı, kovalanmadı.

### F8 teşhisi — teknik engel YOK
- /egitimler/ai-factory ve /blog/lawchat-3: "URL is unknown to Google", 7 haftadır hiç taranmamış
- Menüden linkli (7 sayfanın hepsinden), sitemap'te, robots.txt engellemiyor, noindex yok, canonical doğru
- Yani sebep teknik değil: site otoritesi düşük, Google ana sayfadan öteye geçmiyor
- Çözüm: F7 düzeltmesi + GSC'den elle "Request Indexing" (yalnız arayüzde var, API yok)

### F8 ikinci tur teşhis — sebep incelik (2026-09-18) — ÇÜRÜDÜ, bkz. üçüncü tur
- 33 sitemap adresinin tamamı URL Inspection ile okundu: 13 indexed, 13 unknown, 7 discovered-not-indexed
- Teşhis sırası: (1) iç linkleme, (2) sayfa ağırlığı. İlki elendi, ikincisi tuttu.
- Orphan DEĞİL: `/egitimler/ai-factory`, `/egitimler/kurumsal-egitimler`, `/cozumler/hizmetler` üçü de
  6 ayrı sayfadan linkli (`/`, `/cozumler`, `/egitimler/ai-factory`, `/hakkimizda`, `/isbirlikleri`, `/blog`)
- Görünür kelime sayısı: Google'ın ALDIĞI `/cozumler` 1256, `/egitimler/ai-factory` 1064;
  ALMADIĞI `/cozumler/hizmetler` 293, `/egitimler/kurumsal-egitimler` 267
- Hüküm: teknik engel değil ince içerik. Aynı GEO blok biçimi bu iki sayfaya da yazıldı.
- URL Inspection ucu `/webmasters/v3` DEĞİL: `https://searchconsole.googleapis.com/v1/urlInspection/index:inspect` (POST)
- Indexing API normal sayfaları kabul etmiyor (yalnız JobPosting/BroadcastEvent); API'den yapılabilen tek adım sitemap yeniden gönderimi

### F8 üçüncü tur — tarama tarihi (2026-09-19)
- Aynı 33 adres `lastCrawlTime` alanıyla okundu: 13 dizinde (hepsinin tarama tarihi var), 1 taranmış ama dizin dışı (`/en`, 2026-09-18), 19 HİÇ taranmamış.
- Taranmamışlar: iki satış sayfası, `/egitimler/ai-factory`, EN sayfalarının çoğu, beş blog yazısı, beş hukuki metin sayfası.
- İkinci turun kıyası iki yerden kırık: (a) "almadığı" sayfaları Google hiç okumamış, incelik sebep olamaz; (b) "aldığı" grupta sayılan `/egitimler/ai-factory` bu ölçümde dizinde değil ve taranmamış.
- "Discovered" ile "URL is unknown" aynı adres için dakikalar arayla gidip geliyor; ikisi de taranmamış demek. Durum etiketini tarama tarihiyle birlikte oku.
- Site haritası 2026-09-18 11:13'te gönderildi, bir saniye sonra indirildi, hata 0. Sorun keşifte değil tarama önceliğinde (site otoritesi, dış link azlığı).
- Sonraki okuma Ekim başında: `searchconsole_client.py durum dolunay.ai` (tarama tarihi sütunuyla).

## ARAMADA GERÇEK DURUM (Search Console, 17 Haz - 15 Eyl)
- 275 tıklama / 3272 gösterim / CTR %8,4 / ort. pozisyon 5,7
- **275 tıklamanın 268'i marka aramasından** (dolunay özeren, dolunay ai, ai factory dolunay)
- Jenerik/konu bazlı arama trafiği ~sıfır
- TR %83 · masaüstü %59, mobil %39
- searchAppearance: SIFIR satır (beklenen — Organization/Person zengin sonuç üretmez, FAQ zengin sonucu Mayıs 2026'da kaldırıldı)

## GEO ARAŞTIRMA HÜKÜMLERİ (2026, kaynaklı)
- **Ön şart:** AI Overviews/AI Mode'da görünmek için önce klasik aramada indexlenip snippet alabilmek gerek. Ekstra numara yok.
- **En yüksek etkili taktikler** (Princeton/Georgia Tech KDD 2024, 10.000 sorgu): istatistik ekleme, kaynak gösterme, doğrudan alıntı -> %30-40 görünürlük artışı
- **RAG biçimi:** motorlar sayfayı 200-400 kelimelik parçalara bölüyor; soru-başlık + altında 2-4 cümlelik doğrudan cevap kazanıyor
- AI Overview alıntılarının yalnız %38'i top-10 sıralamadan geliyor (eskiden %76)

### YAPILMAYACAKLAR (kanıtlı)
- **llms.txt** — hiçbir büyük motor production'da okumuyor, adoption %10 ve büyümüyor, Google 15 May 2026 rehberinde "gerekli değil" diyor. Kargo kültü. YAPMA.
- **Yeni FAQPage yatırımı** — Google 7 May 2026'da FAQ zengin sonucunu tamamen kaldırdı. Mevcut şemayı silmeye gerek yok, yeni yatırım yapma.
- **HowTo şeması** — 2023'te kaldırıldı, tamamen ölü.
- **Anahtar kelime doldurma** — LLM'ler akıcılığı ödüllendiriyor.
- **Eğitim botlarını topluca engelleme** — arama/alıntı botunu da kapatıp AI cevaplarından silinirsin.

### AI bot politikası (doğru varsayılan)
- MUTLAKA AÇIK: OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User
- Tercihe bağlı (GEO'yu etkilemez, saf eğitim): GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, Bytespider, CCBot, Meta-ExternalAgent, Amazonbot
- Şu an dolunay.ai hepsine açık — doğru durum.

## ÖLÇÜM YOLU (kanıtlandı)
- GSC "Generative AI performance" raporu YALNIZ ARAYÜZDE. API'de yok: `type` parametresi sadece web/image/video/news/discover/googleNews kabul ediyor, AI varyasyonlarının hepsi 400 döndü.
- Tekrarlanabilir ücretsiz yol: GSC arayüzünden haftalık elle bakmak + normal tıklama/gösterim trendi
- AI bot isabetini ölçmek için Netlify Edge Function ya da Cloudflare gerekir — şu an KURULU DEĞİL

## DOLUNAY'IN KARARLARI (2026-09-17)
- Dil: **İngilizce gerçek yapılacak** (ayrı adresler + hreflang). ZH ve ES sahte kalmasın -> switcher'dan çıkar.
- Sıra: **önce site düzelir, sonra öğrenci kutusu hazırlanır.**
- 80/20: elzem olan yapılır, son %20 kovalanmaz.

### F9 uygulaması (dal: `en-dil`)
- Yaklaşım: fiziksel `/en` klasörü + `usePathname`'den dil türeten `LanguageProvider`. `[locale]`
  dinamik segmentine ya da route-group'a GİDİLMEDİ; NON-GOAL dosyalara (sozlesmeler, blog, panel,
  abonelik, r) hiç dokunmadan yürüyen tek yol buydu.
- EN cevirisi olan 7 sayfa gercek statik rota oldu: `/en`, `/en/cozumler`,
  `/en/cozumler/hizmetler`, `/en/egitimler/ai-factory`, `/en/egitimler/kurumsal-egitimler`,
  `/en/hakkimizda`, `/en/isbirlikleri`. Her biri kendi title/canonical/hreflang'ini tasir (tr/en/
  x-default ucu), sitemap'e girdi, build `out/` altinda fiziksel HTML uretiyor.
- Dil degistirici artik gercek `<Link>` navigasyonu (TR<->EN eslemesi `src/i18n/routes.ts`); ES ve
  ZH yalnizca degistirici listesinden cikti, `es.json`/`zh.json` diskte DOKUNULMADAN duruyor.
  Navbar/Footer/sayfa icindeki tum ic linkler (ornegin ana sayfadaki "Isbirlikleri" karti,
  hakkimizda'daki uc sutun) EN tarafinda TR'ye sizmayacak sekilde /en altina baglandi.
  Ceviri iceriginde YENI string YAZILMADI (`en.json` zaten tamdi); eksik cikan tek sey meta
  keywords alaniydi, o da mevcut TR listenin sade Ingilizce karsiligiyla dolduruldu.
- Bilerek YAPILMAYAN: `/cozumler/otomasyon-abonelik` sayfasi ve ana sayfadaki abonelik serit
  bileseni (`AbonelikSeridi`) EN'de de Turkce kaliyor, cunku bu ikisinin cevirisi `en.json`'da
  hic yok ve uydurma metin yazilmadi; bu sayfaya EN rota da acilmadi. `BreadcrumbSchema` gibi
  gorunmez JSON-LD etiketlerindeki bazi Turkce alan adlari da degistirilmedi (kullanicidan
  gizli, tiklanamaz).
- Sonuc henuz `main`de degil; Dolunay inceleyip birlestirecek.

## NİHAİ AMAÇ
Bu iş yalnız dolunay.ai'yi düzeltmek için değil: çıkan yöntem `ogrenci-kiti` ajanıyla
öğrencilere satılabilir "her siteye uygulanabilir SEO/GEO/hız optimizasyon paketi" olacak.
Mevcut `Paylasilan_Projeler/Web_Sitesi_Starter` kutusu aynı teknolojide — paket onun üstüne oturur.

## DURUM (2026-09-18)
- Faz 1 (F1-F6): TAMAM ve canlıda
- Faz 2 (F7, F11, F12): TAMAM (F12'de Course aggregateRating bilerek ATLANDI)
- Faz 3 (F9 İngilizce): TAMAM, `main`de ve CANLIDA
- Faz 4 (F10 GEO içerik): TAMAM, `main`de ve CANLIDA
- Faz 5 (öğrenci kutusu): TAMAM — `Paylasilan_Projeler/SEO_GEO_AEO_Site_Kiti.zip`
- Faz 6 (F8 ince içerik düzeltmesi): TAMAM, `main`de ve CANLIDA doğrulandı (içerik canlıda; dizine etkisi kanıtsız, bkz. F8 üçüncü tur)
- AÇIK KALAN: (a) Search Console arayüzünden tek tek "Request Indexing" — bu kokpitte
  tarayıcı bağlı değil, Dolunay'a bildirildi; (b) Dolunay'dan "ortalama teslim süresi"
  cümlesi; (c) eğitim anekdotlarının doğruluğu Dolunay'a soruldu, cevap gelene kadar
  metin yalnız referans listesindeki belgeli işle sınırlı tutuldu.

### Yayın engeli — Netlify kredisi (2026-09-18, çözüldü)
17 Eylül akşamından 18 Eylül öğlenine kadar HİÇBİR değişiklik yayına çıkamadı:
`Skipped due to account credit usage exceeded`. Site ayaktaydı, yalnız yeni deploy
reddediliyordu. Ölçüldü: dönemde 260,5 build dakikası yandı (önceki dönem 64,7) ve
bunun 200,4 dakikası Yumu'nun İKİ Netlify sitesinden geliyordu — ikisi de aynı depoya
bağlı, her commit ikisini birden kuruyor, YumuClip'in 202 build'inin 199'u "değişen bir
şey yok" diye iptal olup dakikayı yine de yakıyordu. dolunay.ai kendi payı 60 dakika.
Yapay zeka / Agent Runner ve trafik sebep DEĞİL (ölçüldü). Dolunay 10 dolar kredi
yükledi, yayın açıldı; israfın kaynağı Yumu tarafında ayrıca kısılıyor.

### Canlı doğrulama — 2026-09-18
- `/en`, `/en/cozumler`, `/en/hakkimizda` ve diğer 4 İngilizce sayfa 200 dönüyor.
- Sitemap 26 -> 33 adres.
- hreflang taşıyan sayfa: tam 14 (7 TR + 7 EN), hepsi karşılıklı, x-default TR.
- GEO blokları: `/egitimler/ai-factory` 3, `/cozumler` 4, hepsi gerçek `<h2>`.
- **Sonradan yakalanan sızıntı:** abonelik şeridi bileşeni sabit Türkçe metinle
  yazılmıştı; `/en/cozumler` ve `/en/cozumler/hizmetler` sayfalarında Türkçe duruyordu.
  Metin bileşen içinde iki dilli sözlüğe alındı — locale JSON'una DEĞİL, çünkü `en.json`'da
  eksik anahtar `tr.json`'a düşüp İngilizce sayfaya Türkçe sızdırıyor. 7 İngilizce sayfanın
  tamamı yeniden tarandı, başka kalıntı yok.
- Karnede kırık diye duran dört madde canlıda ölçüldü ve artık kırık DEĞİL: favicon.ico ve
  iyzico güven bandı 200, hizmetler canonical'ı kendini gösteriyor, 9 blog meta açıklamasının
  hiçbiri kelime ortasından kesilmiyor. `karne.html` buna göre güncellendi.

### F9 uygulamasi — 2026-09-18
- Yaklasim: dinamik `[locale]` segmenti DEGIL, fiziksel `/en` klasoru. Sebep: sozlesme sayfalari,
  blog ve panel gibi dokunulmamasi gereken alanlara hic el surmeden yuruyen tek yol.
- TR<->EN adres eslemesi TEK kaynakta: `src/i18n/routes.ts` (`EN_MIRRORED_PATHS`). Navbar, Footer
  ve LanguageSwitcher ayni listeyi okur; yeni sayfa EN'e acilinca tek yerden acilir.
- Dil degistirici artik `<Link>`, localStorage toggle degil. Sayfa bazli: `/cozumler` uzerindeyken
  EN'e basinca `/en/cozumler` acilir.
- **TUZAK (bu turda yakalandi, tekrar etmesin):** hreflang'i kok `src/app/layout.tsx` metadata'sina
  yazmak YANLIS. Kok `alternates`, kendi `alternates`'ini tanimlamayan HER sayfaya miras kalir;
  blog, sozlesmeler, `/r` ve abonelik sayfalari da "benim Ingilizce surumum /en" demeye basladi
  (20 sayfa, hepsi tek yonlu ve karsiliksiz vaat). Duzeltme: kokten `languages` kaldirildi, TR ana
  sayfa kendi hreflang'ini `src/app/page.tsx`'te yaziyor. Olculdu: hreflang tasiyan sayfa 34 -> 14
  (7 TR + 7 EN, hepsi karsilikli). Defter kaydi `_olcum_defteri.jsonl`.
- Bilerek disarida: `/cozumler/otomasyon-abonelik` (EN cevirisi yok), blog yazilari, 7 sozlesme
  sayfasi. ES ve ZH switcher'dan kalkti, locale JSON dosyalari diskte duruyor.

### Canlı doğrulama — 2026-09-18, ince sayfa turu
Ölçüm komutu: `bash seo_geo/olc_canli.sh` (ölçüm defterine yazıldı).

| Adres | Kod | Görünür kelime | TR blok |
|---|---|---|---|
| /cozumler | 200 | 1256 | 0 |
| /egitimler/ai-factory | 200 | 1064 | 0 |
| /cozumler/hizmetler | 200 | 1013 (önce 293) | 1 |
| /egitimler/kurumsal-egitimler | 200 | 995 (önce 267) | 1 |
| /en/cozumler | 200 | 426 | 0 |
| /en/egitimler/ai-factory | 200 | 567 | 0 |
| /en/cozumler/hizmetler | 200 | 316 | 0 |
| /en/egitimler/kurumsal-egitimler | 200 | 281 | 0 |

Yeni 6 sorunun 6'sı da gerçek `<h2>`. Yeni metinde em-dash 0, şapkalı harf 0,
15 kelimeyi geçen cümle 0.

**RSC sızıntısı (yakalandı, düzeltildi).** `/cozumler/hizmetler` server component olduğu için
dil kapısı ince bir client sarmala taşındı. Bloklar sarmala PROP olarak geçilince, EN sayfa
aynı bileşeni `export { default }` ile yeniden dışa aktardığı için Türkçe metnin tamamı EN
sayfanın RSC yüküne serileşti (HTML'de görünmüyor, kaynakta duruyor; ölçüldü: 3 iz). Düzeltme:
sarmal prop almaz, veriyi kendisi import eder. Ders: çalışma anındaki koşul build anındaki
serileştirmeyi engellemez.

**Metin düzeltmeleri (ana kokpit).** (1) Abonelik kapsamı `/cozumler/otomasyon-abonelik`
kademeleriyle hizalandı: taslak "araç maliyeti abonelik içinde" diyordu, o üst kademede.
(2) Eğitim anekdotu referans listesindeki belgeli işle sınırlandı (Türkiye Finans iki kez iki
günlük atölye, Misyon Bankası 5 seans 120 katılımcı + bire bir danışmanlık, Başkent Üniversitesi,
e-ticaret satıcı eğitimleri). Doğrulanamayan mikro anekdotlar çıkarıldı.
