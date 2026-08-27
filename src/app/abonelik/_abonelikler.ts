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
}

export const abonelikler: Abonelik[] = [
  {
    slug: 'cam-termal',
    musteri: 'Öğültürk Turizm',
    isletme: 'Çam Termal Resort',
    paket: 'Yönetilen Otomasyon',
    tutar: '1.000',
    paraBirimi: 'USD',
    periyot: 'ay',
    tahsilatGunu: 3,
    baslangic: '2026-08-03',
    faturaNotu:
      'Aylık fatura, tahsilat günündeki TL karşılığı üzerinden düzenlenir.',
    kapsam: [
      'Yapay zeka müşteri hizmetleri yazılımı',
      'Instagram, WhatsApp ve Messenger mesajlarının 7/24 otomatik cevaplanması',
      'Canlı fiyat ve müsaitlik sorgulama',
      'Oda görseli gönderimi',
      'Sunucu, API ve yapay zeka kullanım bedeli dahil',
      'Haftalık performans raporu',
      'WhatsApp destek hattı',
    ],
  },
]

export function abonelikBul(slug: string): Abonelik | undefined {
  return abonelikler.find((a) => a.slug === slug)
}
