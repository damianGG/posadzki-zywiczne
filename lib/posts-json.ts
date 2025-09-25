import fs from "fs"
import path from "path"

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar: string
    bio: string
  }
  publishedAt: string
  updatedAt: string
  category: string
  tags: string[]
  readTime: string
  image: {
    url: string
    alt: string
    caption: string
  }
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
    canonicalUrl: string
  }
  featured: boolean
  status: string
}

export function getAllPosts(): BlogPost[] {
  const postsDirectory = path.join(process.cwd(), "data/nlod")

  // Check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    console.warn("Blog posts directory not found:", postsDirectory)
    return []
  }

  const filenames = fs.readdirSync(postsDirectory)
  const posts = filenames
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      const filePath = path.join(postsDirectory, name)
      const fileContents = fs.readFileSync(filePath, "utf8")

      try {
        const post: BlogPost = JSON.parse(fileContents)
        return post.status === "published" ? post : null
      } catch (error) {
        console.error(`Error parsing ${name}:`, error)
        return null
      }
    })
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  return posts
}

export function getPostById(id: string): BlogPost | null {
  const posts = getAllPosts()
  return posts.find((post) => post.id === id) || null
}

export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter((post) => post.featured)
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter((post) => post.tags.some((postTag) => postTag.toLowerCase() === tag.toLowerCase()))
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((post) => post.category.toLowerCase() === category.toLowerCase())
}
