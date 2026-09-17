import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const postsDirectory = path.join(process.cwd(), 'src/content/blog')

// Meta description sinirini asan excerpt'i KELIME SINIRINDA kesip "..." ekler.
// Frontmatter'a elle 160 karakterde ham kesilmis bir excerpt yazilirsa (ör.
// "...v", "...yep" gibi kelime ortasi kesimler) canliya boyle cikiyordu; bu
// fonksiyon hem gecmisteki hem gelecekteki uzun excerpt'leri guvenli hale
// getirir.
function truncateExcerpt(excerpt: string, maxLen = 155): string {
  const trimmed = excerpt.trim()
  if (trimmed.length <= maxLen) {
    return trimmed
  }
  const cut = trimmed.slice(0, maxLen)
  const lastSpace = cut.lastIndexOf(' ')
  const safeCut = lastSpace > 0 ? cut.slice(0, lastSpace) : cut
  return `${safeCut.replace(/[.,;:\s]+$/, '')}...`
}

export interface Post {
  slug: string
  title: string
  date: string
  coverImage?: string
  excerpt: string
  content: string
  /** Ham dakika. Ekranda "5 dk okuma" / "5 min read" olarak ziyaretcinin dilinde yazilir. */
  readingMinutes: number
  tags?: string[]
}

/** Liste kartlari icin: yazinin tam govdesi tasinmadan basliklar. */
export type PostMeta = Omit<Post, 'content'>

// Get all posts, sorted by date
export function getPosts(): Post[] {
  // Check if directory exists, if not create it returning empty array
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      // Remove ".mdx" from file name to get slug
      const slug = fileName.replace(/\.mdx?$/, '')

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents)

      // Calculate reading time
      const stats = readingTime(matterResult.content)

      return {
        slug,
        title: matterResult.data.title || slug.replace(/-/g, ' '),
        date: matterResult.data.date || new Date().toISOString(),
        coverImage: matterResult.data.coverImage,
        excerpt: truncateExcerpt(matterResult.data.excerpt || ''),
        tags: matterResult.data.tags || [],
        content: matterResult.content,
        readingMinutes: Math.ceil(stats.minutes),
      } as Post
    })

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

// Get single post by slug
export function getPostBySlug(slug: string): Post | null {
  try {
    let fullPath = path.join(postsDirectory, `${slug}.mdx`)
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(postsDirectory, `${slug}.md`)
    }
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)
    const stats = readingTime(matterResult.content)

    return {
      slug,
      title: matterResult.data.title || slug.replace(/-/g, ' '),
      date: matterResult.data.date || new Date().toISOString(),
      coverImage: matterResult.data.coverImage,
      excerpt: truncateExcerpt(matterResult.data.excerpt || ''),
      tags: matterResult.data.tags || [],
      content: matterResult.content,
      readingMinutes: Math.ceil(stats.minutes),
    } as Post
  } catch (e) {
    return null
  }
}
