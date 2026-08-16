# /bankalar — Bankalar için Yapay Zeka sunumu

Canlı: https://dolunay.ai/bankalar/ — menüde YOK, `noindex, nofollow`. Sadece linki bilen görür.

Ne: bankalara gönderilecek kurumsal eğitim sunumu. 9 slayt, tek kendine yeten HTML.
Next.js build'ine girmez; `public/` altındaki dosya statik export'a olduğu gibi kopyalanır.

Sunum **Artifex** markasıyla konuşur: sol üstte sabit ARTIFEX künyesi, kapakta rozet,
son slaytta ticari ünvan ve Dijitalpark Teknokent adresi. IBAN, VKN ve MERSİS bilerek
YAZILMADI — sayfa herkese açık bir URL'de duruyor, o bilgiler yalnız fatura bağlamında
kullanılır (`_knowledge/artifex-sirket-bilgileri.md`).

## Kaynaklar (uydurma yok, hepsi kayıtlı)

- **Referans metinleri:** `src/i18n/locales/tr.json` (`client1Desc`, `client2Desc`) — Türkiye
  Finans Katılım Bankası ve Misyon Bankası satırları birebir oradan alındı.
- **Müfredat:** Dolunay'ın verdiği `Kurumsal_Yapay_Zeka_Egitimleri_Genel_Mufredat.docx`.
  İki eğitimin bölüm başlıkları o dosyadan.
- **Fiyatlar:** Notion "📦 Kurumsal Eğitim Paketleri 2026". Starter 35.000 · Pro 55.000 ·
  Premium 60.000 · Bire Bir 95.000 (hepsi + KDV). Notion değişirse burası elle güncellenir.
- **Fotoğraflar:** `public/images/egitimler/egitim1-3.webp` — sitede zaten yayında olan
  gerçek eğitim kareleri. egitim2 dikey (1200×1600), 4/3 hücrede `object-position:center 42%`
  ile kırpılıyor; ekrandaki n8n akışı görünür kalsın diye o değer ölçülerek seçildi.

## Slaytlar

0 kapak · 1 referanslar · **2 sahadan (fotoğraflar)** · 3 iki eğitim · 4 müfredat 1 ·
5 müfredat 2 · **6 animasyon** · 7 paketler · 8 nasıl ilerleriz

Slayt 6, **katılımcıların eğitimde kendi kurduğu** Telegram asistanını canlandırır (bilgi
bankası + hafıza + dış servisler) ve "bunu biz kurmadık" notuyla kapanır. Gerçek bir banka
otomasyonu değil, örnek senaryo — varsayımla gerçek müşteri işi çizilmedi.
JS'teki `ANIM_SLIDE` sabiti bu slaytın indeksidir; slayt sırası değişirse orası da değişir.

## Gezinme

Masaüstü: Space/→ ileri, ← geri, `F` tam ekran. Mobil: sağa/sola kaydırma + alttaki oklar.
Denetim için derin bağlantı: `?s=<slayt>&b=<beat>` (ör. `?s=6&b=9` = animasyon, tüm beat'ler).

## Mobil kararlar (2026-08-16 revizyonu)

- Telefonda punto **küçülmez, büyür**: 820px kırılımında yaklaşık 25 metin sınıfı masaüstü
  değerinin üstüne çıkarılır. Eski davranış (mobilde küçültme) kaldırıldı.
- Slayt telefonda dikey kayar. Kayan metin üstteki künye ve alttaki gezinme pastilinin altına
  girip okunmaz hale geliyordu; `.edgefade` üst/alt degrade katmanları bunu temizler.
- `.wrap{margin:auto 0}` mobilde de korunur: sığan slayt ortalanır, taşan slayt tepeden
  kayar (flexbox'ın "center + overflow" kırpma tuzağına düşmez).
- Animasyon slaytında telefon çerçevesi sabit yükseklikten `height:auto`ya alındı. Sabit
  yükseklikte ilk soru `overflow:hidden` altında kalıyor ve hikaye baştan kopuyordu.

## Doğrulama (2026-08-16)

Masaüstü 1440×900 ve mobil 390×844, ikisi de Playwright ile. Ölçüm: her slayt tek tek aktif
edilip `scrollWidth-clientWidth` okundu → **9 slaytın hepsinde yatay taşma 0** (mobil ve
masaüstü). Gözle görülen kareler: mobilde 0,1,2,3,4,5,6,7,8 ve slayt 2 ile 6'nın kaydırılmış
halleri; masaüstünde 0,2,4,6,7,8. Animasyonun son beat'inde dört baloncuğun tamamı ve üç
kutunun üçü de görünür durumda (mobil + masaüstü ayrı ayrı).
Türkçe kuralları: em-dash 0, şapkalı harf 0 (grep ile sayıldı).
`npm run build` yeşil, `out/bankalar/index.html` üretiliyor. Logolar `file://` altında
görünmez (mutlak yol), HTTP üzerinde yükleniyor.
