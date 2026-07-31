'use client'

import { BlogCard } from './BlogCard'
import type { PostMeta } from '@/lib/mdx'
import { useTranslation } from '@/i18n/i18n'

// Sayfanin cercevesi (baslik, aciklama, bos durum) ziyaretcinin dilinde yazilir.
// Yazilarin kendi icerigi Turkce kalir; onu ceviren bir sey yok.
export function BlogIndex({ posts }: { posts: PostMeta[] }) {
  const { t } = useTranslation()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

      {/* Header Section */}
      <div className="max-w-3xl mb-16 md:mb-24">
        <span className="inline-flex items-center gap-2 text-[#4F8BFF] text-sm font-semibold tracking-[0.2em] uppercase mb-4"><span className="halftone-arc" aria-hidden />DOLUNAY.AI BLOG</span>
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
          {t('blog.title')} <br className="hidden md:block" />
          <span className="text-gradient-accent">{t('blog.titleHighlight')}</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl">
          {t('blog.desc')}
        </p>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
        {posts.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-500 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 text-gray-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8l-4 4"/></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t('blog.emptyTitle')}</h3>
            <p className="max-w-sm mx-auto">{t('blog.emptyDesc')}</p>
          </div>
        )}
      </div>

    </div>
  )
}
