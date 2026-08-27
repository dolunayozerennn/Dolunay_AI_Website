// Musteriye ozel abonelik kayitlari.
// Her musteri kendi adresinde KENDI bedelini gorur; herkese acik paket sayfasi
// (/cozumler/otomasyon-abonelik) fiyat yayinlamaz. Bu sayfalar arama motorlarina
// kapalidir, adresi yalniz musteriye ve odeme saglayicisina verilir.
export type Abonelik = {
  slug: string
  musteri: string
  isletme: string
  paket: string
  tutar: string
  paraBirimi: string
  periyot: string
  tahsilatGunu: number
  baslangic: string
  faturaNotu: string
  kapsam: string[]
  // true ise sayfanin tepesinde "bu bir ornektir" uyarisi cikar. Uyari sayfanin
  // KENDI icinde durur; kaynak yorumuna yazilsa disaridan bakan goremezdi.
  ornek?: boolean
}

// GERCEK musteri kaydi yalnizca karttan otomatik tahsilati kabul edenler icin
// acilir. Klasik fatura usulu calisan musteri buraya YAZILMAZ (Cam Termal
// 2026-08-27'de bu sebeple cikarildi).
//
// Asagidaki tek kayit gercek musteri degil, ORNEKTIR. Iki isi var: odeme
// saglayicisi (iyzico) abonelik ekranini gormek istiyor, ve Next.js
// output:export dinamik rotayi bos parametre listesiyle derlemiyor. Gercek
// musteri eklenince ornek silinebilir.
export const abonelikler: Abonelik[] = [
  {
    slug: 'ornek',
    musteri: 'Örnek Müşteri',
    isletme: 'Örnek İşletme',
    paket: 'Yönetilen Otomasyon',
    tutar: '40.000',
    paraBirimi: 'TL',
    periyot: 'ay',
    tahsilatGunu: 5,
    baslangic: '2026-09-05',
    faturaNotu:
      'Aylık fatura, tahsilat gününde düzenlenir ve kayıtlı e-posta adresine gönderilir.',
    kapsam: [
      'Yapay zeka müşteri hizmetleri yazılımı',
      'Instagram, WhatsApp ve Messenger mesajlarının 7/24 otomatik cevaplanması',
      'Canlı fiyat ve müsaitlik sorgulama',
      'Sunucu, API ve yapay zeka kullanım bedeli dahil',
      'Haftalık performans raporu',
      'WhatsApp destek hattı',
    ],
    ornek: true,
  },
]

export function abonelikBul(slug: string): Abonelik | undefined {
  return abonelikler.find((a) => a.slug === slug)
}
