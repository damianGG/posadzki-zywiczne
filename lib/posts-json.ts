import fs from "fs"
import path from "path"

export interface BlogPost {
  category: any
  slug: string
  title: string
  excerpt: string
  date: string
  updated: string
  author: string
  tags: string[]
  featured: boolean
}

export function getAllPosts(): BlogPost[] {
  const postsDirectory = path.join(process.cwd(), "data/blog")

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
        return post
      } catch (error) {
        console.error(`Error parsing ${name}:`, error)
        return null
      }
    })
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts()
  return posts.find((post) => post.slug === slug) || null
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
