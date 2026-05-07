export type ReklamVideo = {
  id: string
  src: string
  label: string
}

export const videos: ReklamVideo[] = [
  { id: '1', src: '/videos/r1.mp4', label: 'Reklam 1' },
  { id: '2', src: '/videos/r2.mp4', label: 'Reklam 2' },
  { id: '3', src: '/videos/r3.mp4', label: 'Reklam 3' },
]
