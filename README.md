# Dolunay AI — Kişisel Marka Web Sitesi

> **Dolunay Özeren**'in kişisel marka web sitesi. Yapay zeka eğitimi, AI otomasyon ve içerik üretimi alanlarındaki uzmanlığı sergileyen premium, fütüristik multi-page landing site.

## 🌐 Canlı Linkler

| Platform | URL |
|---|---|
| **Railway (Ana)** | Railway deploy — `dolunay-ai-website` projesi |
| **GitHub Pages** | https://dolunayozerennn.github.io/Dolunay_AI_Website/ |

## 🏗 Teknoloji Stack

| Katman | Teknoloji | Versiyon |
|---|---|---|
| **Framework** | React + TypeScript | 19.x |
| **Build Tool** | Vite | 5.4.x |
| **Styling** | Tailwind CSS v4 | 4.0.x |
| **Animasyon** | Framer Motion | 11.x |
| **İkonlar** | Lucide React | 0.460.x |
| **Utility** | clsx + tailwind-merge | — |

## 📁 Proje Yapısı (Güncel)

```
Dolunay_AI_Website/
├── public/
│   ├── hero_bg/
│   │   └── hero_Elevate_New_V1.jpg    # Ana hero arka plan fotoğrafı (Flux AI üretimi)
│   ├── images/
│   │   ├── products/                   # ProductsSection kart görselleri
│   │   │   ├── isletme_kobi.png
│   │   │   ├── kurumsal_holding.png
│   │   │   ├── girisimci.png
│   │   │   └── marka_isbirligi.png
│   │   └── logos/                      # Marka logoları (ServicesSection referansları)
│   ├── team/                           # AI takım üyeleri avatarları (AboutPage)
│   │   ├── bobby_ai.png
│   │   ├── daisy_ai.png
│   │   ├── gipsy_ai.png
│   │   └── joshua_ai.png
│   ├── portrait.png                    # CollaborationsPage creator portresi
│   ├── mediakit-banner.png             # CollaborationsPage hero arka plan
│   ├── favicon.svg                     # Site favicon
│   └── icons.svg                       # SVG ikon sprite
├── src/
│   ├── App.tsx                         # Ana uygulama — hash-based routing
│   ├── main.tsx                        # React entry point
│   ├── index.css                       # Global stiller + Tailwind v4 design system
│   ├── pages/
│   │   ├── HomePage.tsx                # Ana sayfa (HeroSectionElevate + ProductsSection)
│   │   ├── SolutionsPage.tsx           # Çözümler sayfası (Artifex Campus + Hizmetler + Eğitimler)
│   │   ├── CollaborationsPage.tsx      # İş Birlikleri sayfası (Media Kit + Viral içerikler)
│   │   └── AboutPage.tsx               # Hakkımızda sayfası (İnsan + AI ekip)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx              # Üst navigasyon — pill-shaped, glassmorphism
│   │   │   └── Footer.tsx              # Site alt bilgi + sosyal medya ikonları
│   │   └── sections/
│   │       ├── HeroSectionElevate.tsx  # ⭐ Full-screen hero (bg fotoğraf + sol overlay metin)
│   │       ├── ProductsSection.tsx     # 4-kart ürün grid (kitle segmentasyonu)
│   │       └── ServicesSection.tsx     # Hizmetler detay + referans logoları
│   └── assets/                         # Statik varlıklar (eski, çoğu kullanılmıyor)
├── index.html                          # HTML giriş noktası
├── vite.config.ts                      # Vite yapılandırması (base: '/Dolunay_AI_Website/')
├── railway.json                        # Railway deploy yapılandırması
├── tsconfig.json                       # TypeScript konfigürasyonu
├── eslint.config.js                    # ESLint kuralları
└── package.json                        # Bağımlılıklar ve script'ler
```

## 🗺 Sayfa Yapısı & Routing

Site **hash-based routing** kullanır (`window.location.hash`):

```
#/                → HomePage
#/cozumler        → SolutionsPage
#/isbirlikleri    → CollaborationsPage
#/hakkimizda      → AboutPage
```

### Sayfa Akış Detayları

```
Navbar (tüm sayfalarda — pill-shaped, glassmorphism, sticky)
│
├── #/ — HomePage
│   ├── HeroSectionElevate  ← Full-screen bg fotoğraf + "Yapay zeka? Dolunay." overlay
│   └── ProductsSection     ← 4 kart: İşletmeler, Kurumsal, Girişimciler, Markalar
│
├── #/cozumler — SolutionsPage
│   ├── Çözümler Bölümü     ← Artifex Campus (hazır) + Danışmanlık (özel)
│   ├── Eğitimler Bölümü    ← AI Factory (Skool) + Udemy Eğitimi
│   └── ServicesSection     ← Detaylı hizmet kartları + marka referans logoları
│
├── #/isbirlikleri — CollaborationsPage
│   ├── Media Kit Hero      ← Paralaks banner + istatistik kartları
│   ├── Kitle Demografisi   ← Cinsiyet, yaş, coğrafya dağılım grafikleri
│   ├── Viral İçerikler     ← Nim AI (9.5M), Emergent AI (3.8M) vb. kartları
│   ├── Platform Erişimi    ← Instagram, TikTok, YouTube, Facebook, Udemy, Skool kartları
│   └── İletişim CTA        ← ceren@dolunay.ai sponsorluk butonu
│
├── #/hakkimizda — AboutPage
│   └── Ekip Bölümü         ← 6 insan + 4 AI takım üyesi kartları
│
Footer (tüm sayfalarda — sosyal medya ikonları + copyright)
```

## ⭐ Hero Section — Mevcut Tasarım (HeroSectionElevate)

- **Yaklaşım:** Full-screen background image + sol tarafta metin overlay
- **Arka Plan:** `/public/hero_bg/hero_Elevate_New_V1.jpg` — Flux AI ile üretilmiş
- **Overlay:** Siyah→şeffaf gradyan (soldan sağa) — opacity 90%
- **İçerik:**
  1. **Başlık:** "Yapay zeka? Dolunay." (gradient accent)
  2. **Alt başlık:** "Bireylerden işletmelere, yapay zekayı gerçek sonuçlara dönüştüren..."
  3. **3 Metrik Kart:** 250K+ takipçi, 1.000+ üye, 10+ kurumsal müşteri
- **Animasyon:** Framer Motion fade-up reveal (sıralı delay)
- **Responsive:** Desktop'ta sol overlay, mobilde tam genişlik

## 🎨 Design System (index.css)

### Tailwind v4 Custom Değişkenler
| Token | Değer | Kullanım |
|---|---|---|
| `--color-electric-blue` | `#00d4ff` | Vurgu mavi |
| `--color-accent-purple` | `#7c3aed` | Vurgu mor |
| `--color-accent-violet` | `#a855f7` | Vurgu açık mor |

### Utility Sınıflar
- `.glass-panel` — Glassmorphism panel efekti
- `.glass-button` — Hover'da gradient gösteren buton
- `.bento-card` — Mouse-tracking glow kartları
- `.text-gradient` / `.text-gradient-accent` / `.text-gradient-warm` — Metin gradyanları
- `.glow-blue` / `.glow-purple` — Box-shadow glow efektleri
- `.section-divider` — Bölümler arası gradient çizgi

### Fontlar
- **Display:** Space Grotesk (başlıklar)
- **Body:** DM Sans (metin)

## 🚀 Çalıştırma

```bash
# Bağımlılıkları kur
npm install

# Geliştirme sunucusu
npm run dev
# → http://localhost:5173/Dolunay_AI_Website/

# Production build
npm run build

# Preview (production build'i test et)
npm run preview
```

## 🚂 Deploy

### Railway
- **Project ID:** `58765514-d122-4653-99c5-e9958330e5a4`
- **Service ID:** `228b5ddb-680d-46d6-af71-761f046e51c7`
- **Start Komutu:** `npm run build && npm run preview -- --host --port $PORT`
- **GitHub Repo:** `dolunayozerennn/Dolunay_AI_Website`

### GitHub Pages
- **Workflow:** `.github/workflows/deploy.yml`
- **Trigger:** Push to `main` branch
- **Build:** `npm run build` → `./dist` → GitHub Pages artifact

## 🖼 Görsel Yönetimi

| Görsel | Konum | Kullanıldığı Yer |
|---|---|---|
| Hero arka plan | `public/hero_bg/hero_Elevate_New_V1.jpg` | HeroSectionElevate |
| Ürün kartları | `public/images/products/*.png` | ProductsSection |
| Marka logoları | `public/images/logos/` | ServicesSection |
| AI ekip avatarları | `public/team/*.png` | AboutPage |
| Creator portre | `public/portrait.png` | CollaborationsPage |
| Media kit banner | `public/mediakit-banner.png` | CollaborationsPage |

---

**Dolunay AI** © 2026 — Dolunay Özeren
