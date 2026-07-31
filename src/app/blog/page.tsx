import { getPosts } from '@/lib/mdx'
import { BlogIndex } from '@/components/blog/BlogIndex'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Yapay zeka asistanları, otomasyonlar ve teknoloji dünyasındaki en son yenilikler hakkında makaleler.',
  openGraph: {
    title: 'Blog | dolunay.ai',
    description: 'Yapay zeka asistanları, otomasyonlar ve teknoloji dünyasındaki en son yenilikler hakkında makaleler.',
    url: 'https://dolunay.ai/blog',
  },
}

export default function BlogPage() {
  // Kart listesine yazinin GOVDESI tasinmaz; yoksa tum yazilar sayfanin
  // icine gomulur ve liste sayfasi gereksiz agirlasir.
  const posts = getPosts().map(({ content, ...meta }) => meta)

  return (
    <div className="min-h-screen bg-[#08090C] relative pt-12 pb-24">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#4F8BFF]/5 blur-[120px] rounded-[100%] pointer-events-none" />

      <BlogIndex posts={posts} />
    </div>
  )
}
