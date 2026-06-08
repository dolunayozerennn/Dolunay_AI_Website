export type ReklamVideo = {
  id: string
  src: string
  label: string
}

export const videos: ReklamVideo[] = [
  { id: 'ai-donusum', src: '/videos/r1.mp4', label: 'AI Dönüşümünüzü Biz Yapalım' },
  { id: 'musteri-cevap', src: '/videos/r2.mp4', label: 'Müşterilerinize Cevap Yazmayı Bırakın' },
  { id: 'telefon-ai', src: '/videos/r3.mp4', label: 'Telefonlarınıza Yapay Zeka Baksın' },
]
