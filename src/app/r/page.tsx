import type { Metadata } from 'next'
import { videos } from './_videos'

export const metadata: Metadata = {
  title: 'Reklam Videoları',
  robots: { index: false, follow: false },
}

export default function ReklamlarTopluPage() {
  return (
    <div className="min-h-screen pt-24 pb-24 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-purple/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-electric-blue/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block text-electric-blue text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Görüştüğümüz Reklamlar
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Hatırlatma
          </h1>
          <p className="mt-6 text-zinc-400 max-w-md mx-auto">
            Aşağıdaki videolardan birini izleyip formumuzu doldurmuştun. Birlikte konuştuğumuz reklam bunlardan biri.
          </p>
        </div>

        <div className="space-y-16">
          {videos.map((v) => (
            <div key={v.id} className="space-y-4">
              <div className="text-sm text-electric-blue font-medium tracking-wide text-center">
                {v.label}
              </div>
              <div className="mx-auto w-full max-w-sm">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full rounded-2xl shadow-2xl bg-black aspect-[9/16] object-cover"
                >
                  <source src={v.src} type="video/mp4" />
                </video>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
