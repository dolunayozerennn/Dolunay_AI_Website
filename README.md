# Dolunay AI — Kişisel Marka Web Sitesi

> **Dolunay Özeren**'in kişisel marka web sitesi. Yapay zeka eğitimi, AI otomasyon ve içerik üretimi alanlarındaki uzmanlığı sergileyen premium, fütüristik landing page.

## 🌐 Proje Hakkında

Bu web sitesi, Dolunay Özeren'in üç temel markasını (Content Creator, AI Factory, Artifex Campus) tek bir premium dijital kimlik altında birleştirmek amacıyla oluşturulmuştur.

**Hedef mesaj:** *"Yapay zeka? Dolunay. — Yapay zekadan gerçekten faydalanmayı öğren."*

## 🏗 Teknoloji Stack

| Katman | Teknoloji | Versiyon |
|---|---|---|
| **Framework** | React + TypeScript | 19.x |
| **Build Tool** | Vite | 5.4.x |
| **Styling** | Tailwind CSS v4 | 4.0.x |
| **Animasyon** | Framer Motion | 11.x |
| **İkonlar** | Lucide React | 0.460.x |
| **Utility** | clsx + tailwind-merge | — |

## 📁 Proje Yapısı

```
dolunay-ai-website/
├── public/
│   ├── dolunay-hero.png       # Hero bölümü fotoğrafı (Flux ile üretilmiş)
│   ├── hero-hands.png         # Alternatif hero görseli
│   ├── favicon.svg            # Site favicon
│   └── icons.svg              # SVG ikon sprite
├── src/
│   ├── App.tsx                # Ana uygulama bileşeni (sayfa rotası)
│   ├── main.tsx               # React entry point
│   ├── index.css              # Global stiller + design system (Tailwind v4)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx     # Üst navigasyon çubuğu
│   │   │   └── Footer.tsx     # Site alt bilgi bölümü
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx          # ⭐ Ana hero bölümü (split layout)
│   │   │   ├── AIFactorySection.tsx     # AI Factory tanıtım bölümü
│   │   │   ├── ArtifexCampusSection.tsx # Artifex Campus tanıtım bölümü
│   │   │   ├── SocialMediaSection.tsx   # Sosyal medya/içerik üretimi bölümü
│   │   │   └── ServicesSection.tsx      # Hizmetler özet bölümü
│   │   └── ui/                # (Paylaşılan UI bileşenleri — şu an boş)
│   └── assets/                # Statik varlıklar
├── index.html                 # HTML giriş noktası
├── vite.config.ts             # Vite yapılandırması
├── tsconfig.json              # TypeScript konfigürasyonu
├── eslint.config.js           # ESLint kuralları
└── package.json               # Bağımlılıklar ve script'ler
```

## ⭐ Hero Section — Tasarım Detayları

Hero bölümü sitenin en kritik bileşenidir. **Split layout** yaklaşımıyla tasarlanmıştır:

### Layout
- **Desktop (lg+):** Sol tarafta metin içeriği, sağ tarafta fotoğraf — CSS Grid 2 sütun
- **Mobil:** Dikey yığılma — önce fotoğraf, sonra metin
- `min-h-screen` ile tüm içerik viewport'a sığar

### Bileşenler (yukarıdan aşağıya)
1. **Badge** — "AI Eğitmen & Builder" (animasyonlu mavi dot)
2. **Başlık** — "Yapay zeka?" / "Dolunay." (mavi→mor gradient)
3. **Alt Başlık** — "Yapay zekadan *gerçekten* faydalanmayı öğren."
4. **CTA Butonları** — "Keşfet" (gradient border) + "İletişime Geç" (ghost)
5. **Brand Pillars** — 🎬 Content Creator · ⚡ AI Factory · 🏢 Artifex Campus
6. **Fotoğraf** — Flux AI ile üretilmiş, lacivert blazer portre (radial vignette mask)
7. **Orbit Halkaları** — Fotoğraf etrafında dönen CSS animasyonları
8. **Kaydır İndikatörü** — Sayfa sonunda

### Arka Plan Efektleri
- **Canvas Particle Field** — 50 partikül, bağlantı çizgileri, düşük opacity
- **Ambient Glow** — Mouse paralaks ile hareket eden mavi/mor blur'lar
- **Subtle Grid** — 80x80px ızgara overlay
- **Bottom Gradient** — Hero→sonraki bölüm geçiş gradyanı

### Animasyonlar
- **Reveal** — Her element sırayla blur'dan netliğe, aşağıdan yukarıya
- **Scroll Transform** — İçerik yukarı kayarken fotoğraf aşağı kayar (paralaks)
- **Orbit Spin** — 35s ve 50s döngü (ters yönler)
- **Ping** — Badge dot animasyonu

## 🎨 Design System (index.css)

### Renk Paleti
| Token | Değer | Kullanım |
|---|---|---|
| `--color-dark-bg` | `#050508` | Ana arka plan |
| `--color-dark-surface` | `#0c0c14` | Kart/yüzey arka planı |
| `--color-electric-blue` | `#00d4ff` | Vurgu mavi |
| `--color-accent-purple` | `#7c3aed` | Vurgu mor |
| `--color-accent-violet` | `#a855f7` | Vurgu açık mor |
| `--color-silver` | `#94a3b8` | İkincil metin |

### Utility Sınıflar
- `.glass-panel` — Glassmorphism panel efekti
- `.glass-button` — Hover'da gradient gösteren buton
- `.bento-card` — Mouse-tracking glow kartları
- `.text-gradient` / `.text-gradient-accent` / `.text-gradient-warm` — Metin gradyanları
- `.glow-blue` / `.glow-purple` — Box-shadow glow efektleri
- `.floating` / `.floating-slow` — Keyframe float animasyonu

## 🚀 Çalıştırma

```bash
# Bağımlılıkları kur
npm install

# Geliştirme sunucusu
npm run dev
# → http://localhost:5173/

# Production build
npm run build
```

## 📝 Sayfa Akışı

```
Navbar
  └── HeroSection        ← "Yapay zeka? Dolunay." + fotoğraf
  └── AIFactorySection   ← AI otomasyon hizmetleri
  └── ArtifexCampusSection ← Yapay zeka eğitim platformu
  └── SocialMediaSection ← Sosyal medya ve içerik üretimi
  └── ServicesSection    ← Tüm hizmet özeti
Footer
```

## 🖼 Fotoğraf Yönetimi

Hero fotoğrafı (`public/dolunay-hero.png`) **Flux AI** ile üretilmiştir:
- **Stil:** Lacivert blazer + siyah tişört, koyu stüdyo arka plan
- **Neden bu stil:** Koyu arka plan sitenin karanlık temasıyla doğal kaynaşır, ekstra cutout gerekmez
- **CSS Mask:** `radial-gradient(ellipse at center, black 50%, transparent 85%)` — yumuşak vignette

Orijinal fotoğraf yedeği: `hero-hands.png`

## 🔮 Gelecek Adımlar

- [ ] Sitenin genel yapısı hakkında bilgilendirme (kullanıcıdan bekleniyor)
- [ ] Diğer section'ların detaylı tasarımı
- [ ] Mobil responsive ince ayarları
- [ ] SEO meta tag'leri ve Open Graph
- [ ] Domain bağlama ve deployment
- [ ] Form entegrasyonu (İletişime Geç)
- [ ] Analytics entegrasyonu

---

**Dolunay AI** © 2026 — Dolunay Özeren
