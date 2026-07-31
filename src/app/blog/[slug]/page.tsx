import { getPostBySlug, getPosts } from '@/lib/mdx'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import { BackToBlog, PostMetaLine, PostCta, TurkishOnlyNotice } from '@/components/blog/BlogChrome'
import type { Metadata } from 'next'

// Next.js params type for Next.js 15+ dynamic routes (often requires resolution)
export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    return { title: 'Bulunamadı' }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      url: `https://dolunay.ai/blog/${post.slug}`,
      images: post.coverImage ? [
        {
          url: `https://dolunay.ai${post.coverImage}`,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [`https://dolunay.ai${post.coverImage}`] : [],
    }
  }
}

export const dynamicParams = false

export async function generateStaticParams() {
  const posts = getPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

const components = {
  // Custom MDX Components can be added here
  img: (props: any) => (
    <span className="block relative w-full mt-10 mb-10 overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
      <Image 
        {...props} 
        width={1200}
        height={675}
        style={{ width: '100%', height: 'auto' }}
        className="object-cover m-0 rounded-2xl" 
        alt={props.alt || ''} 
        unoptimized
      />
    </span>
  ),
  a: (props: any) => (
    <a {...props} className="text-[#4F8BFF] hover:text-[#4F8BFF] transition-colors border-b border-[#4F8BFF]/30 hover:border-[#4F8BFF]" target="_blank" rel="noopener noreferrer" />
  ),
  h2: (props: any) => (
    <h2 {...props} className="text-3xl font-bold text-white mt-16 mb-6 tracking-tight flex items-center gap-3">
      <span className="text-[#4F8BFF] opacity-50 text-2xl font-normal select-none">#</span>
      {props.children}
    </h2>
  ),
  h3: (props: any) => (
    <h3 {...props} className="text-2xl font-bold text-gray-100 mt-12 mb-4 tracking-tight" />
  ),
  ul: (props: any) => (
    <ul {...props} className="space-y-3 my-6 text-gray-300 list-none pl-0" />
  ),
  li: (props: any) => (
    <li {...props} className="flex gap-3 items-start relative before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#4F8BFF] before:top-2.5 before:relative before:shrink-0" />
  ),
  blockquote: (props: any) => (
    <blockquote {...props} className="border-l-4 border-[#4F8BFF] bg-[#4F8BFF]/5 p-6 rounded-r-xl my-8 italic text-gray-300 font-medium" />
  ),
  pre: (props: any) => (
    <div className="relative group my-8">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4F8BFF]/20 to-[#4F8BFF]/20 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
      <pre {...props} className="relative bg-[#08090C] p-6 rounded-xl border border-white/10 overflow-x-auto text-sm" />
    </div>
  )
}

export default async function BlogPost(
    props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="min-h-screen bg-[#08090C] pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            image: post.coverImage ? [`https://dolunay.ai${post.coverImage}`] : [],
            datePublished: post.date,
            dateModified: post.date,
            author: [{
              '@type': 'Person',
              name: 'Dolunay Özeren',
              url: 'https://dolunay.ai/hakkimizda'
            }]
          })
        }}
      />
      {/* Blog Article Progress Bar Component (Optional for future) */}
      
      {/* Hero Header Section */}
      <div className="relative w-full border-b border-white/5 bg-[#0a0a14] overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#4F8BFF]/10 blur-[120px] rounded-[100%] pointer-events-none" />
        
        {/* Cover Image Background (Heavy Blur) */}
        {post.coverImage && (
          <div className="absolute inset-0 opacity-20 hidden md:block select-none pointer-events-none">
            <Image src={post.coverImage} alt="" fill className="object-cover blur-3xl scale-110" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a14]/50 via-[#0a0a14]/80 to-[#08090C]" />
          </div>
        )}

        <div className="max-w-[900px] mx-auto px-4 sm:px-6 relative z-10 pt-20 pb-12">
          
          <BackToBlog />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 text-[#4F8BFF] rounded-full text-xs font-semibold uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-400 border-t border-white/10 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F8BFF] to-[#4F8BFF] p-[1px]">
                {/* Minimal Author Avatar Fallback */}
                <div className="w-full h-full rounded-full bg-[#08090C] flex items-center justify-center font-bold text-white text-xs">
                  DÖ
                </div>
              </div>
              <div>
                <div className="text-white">Dolunay Özeren</div>
                <div className="text-xs text-gray-500">AI Architect</div>
              </div>
            </div>

            <div className="w-px h-8 bg-white/10 hidden md:block" />

            <PostMetaLine date={post.date} minutes={post.readingMinutes} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-12">
        {/* Cover Image Feature (Optional render if it exists) */}
        {post.coverImage && (
          <div className="relative w-full aspect-[21/9] md:aspect-[2.35/1] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 mb-16 border border-white/10">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            {/* Subtle inner shadow for depth */}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />
          </div>
        )}

        <TurkishOnlyNotice />

        <div className="prose-blog prose-lg w-full max-w-none">
          <MDXRemote source={post.content} components={components} />
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-20 pt-10 border-t border-white/10">
          <PostCta />
        </div>
      </div>
    </article>
  )
}
