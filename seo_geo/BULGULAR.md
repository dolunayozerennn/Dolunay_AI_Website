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
| F8 | 18 sayfanın 7'si Google'da yok | 11 indexli, 4 keşfedildi-indexlenmedi, 3 "URL is unknown to Google" | AÇIK |
| F9 | 4 dil görünüyor, gerçekte 1 dil var | dil değiştirici sadece localStorage; hreflang yok; arama motoru yalnız TR görüyor | TAMAM (dal: `en-dil`, henüz main'e girmedi) — EN 7 sayfada gerçek statik rota oldu, ES/ZH değiştiriciden kaldırıldı |
| F10 | GEO içerik biçimi yok | blog yazılarında soru-başlık, doğrudan cevap, istatistik/kaynak yapısı yok | AÇIK |
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

## DURUM
- Faz 1 (F1-F6): ajan koşuyor
- Faz 2 (F7, F11, F12): TAMAM (F12'de Course aggregateRating bilerek ATLANDI)
- Faz 3 (F9 İngilizce): TAMAM, dal `en-dil`'de bekliyor (main'e henüz girmedi)
- Faz 4 (F10 GEO içerik): açık
- Faz 5 (öğrenci kutusu): site bitince
