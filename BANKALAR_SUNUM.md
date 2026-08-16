# /bankalar — Bankalar için Yapay Zeka sunumu

Canlı: https://dolunay.ai/bankalar/ — menüde YOK, `noindex, nofollow`. Sadece linki bilen görür.

Ne: bankalara gönderilecek kurumsal eğitim sunumu. 8 slayt, tek kendine yeten HTML.
Next.js build'ine girmez; `public/` altındaki dosya statik export'a olduğu gibi kopyalanır.

## Kaynaklar (uydurma yok, hepsi kayıtlı)

- **Referans metinleri:** `src/i18n/locales/tr.json` (`client1Desc`, `client2Desc`) — Türkiye
  Finans Katılım Bankası ve Misyon Bankası satırları birebir oradan alındı.
- **Müfredat:** Dolunay'ın verdiği `Kurumsal_Yapay_Zeka_Egitimleri_Genel_Mufredat.docx`.
  İki eğitimin bölüm başlıkları o dosyadan.
- **Fiyatlar:** Notion "📦 Kurumsal Eğitim Paketleri 2026". Starter 35.000 · Pro 55.000 ·
  Premium 60.000 · Bire Bir 95.000 (hepsi + KDV). Notion değişirse burası elle güncellenir.

## Slaytlar

0 kapak · 1 referanslar · 2 iki eğitim · 3 müfredat 1 · 4 müfredat 2 · **5 animasyon** ·
6 paketler · 7 nasıl ilerleriz

Slayt 5, eğitimde katılımcının kendi kurduğu Telegram asistanını canlandırır (bilgi bankası +
hafıza + dış servisler). Gerçek bir banka otomasyonu değil, "örnek senaryo" diye etiketli —
varsayımla gerçek müşteri işi çizilmedi.

## Gezinme

Masaüstü: Space/→ ileri, ← geri, `F` tam ekran. Mobil: sağa/sola kaydırma + alttaki oklar.
Denetim için derin bağlantı: `?s=<slayt>&b=<beat>` (ör. `?s=5&b=5`).

## Doğrulama (2026-08-16)

Masaüstü 1440×900 headless Chrome ile 8 slayt + animasyonun 6 beat'i, mobil 390×844
Playwright ile 8 slayt tek tek gözle denetlendi. `npm run build` yeşil, `out/bankalar/`
üretiliyor. Logolar `file://` altında görünmez (mutlak yol), HTTP üzerinde yükleniyor.
