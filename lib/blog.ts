import fs from "fs"
import path from "path"

export interface BlogPost {
  id: string
  slug?: string
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
  cover?: string
  gallery?: string[]
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
    canonicalUrl: string
  }
  featured: boolean
  status: "published" | "draft"
}

const dataBlogDirectory = path.join(process.cwd(), "data/blog")
const contentPostsDirectory = path.join(process.cwd(), "content/posts")

export function getAllBlogPosts(): BlogPost[] {
  try {
    const allPostsData: BlogPost[] = []
    
    // Read from data/blog directory
    if (fs.existsSync(dataBlogDirectory)) {
      const dataFileNames = fs.readdirSync(dataBlogDirectory)
      const dataPosts = dataFileNames
        .filter((fileName) => fileName.endsWith(".json"))
        .map((fileName) => {
          const id = fileName.replace(/\.json$/, "")
          const fullPath = path.join(dataBlogDirectory, fileName)
          const fileContents = fs.readFileSync(fullPath, "utf8")
          const postData = JSON.parse(fileContents) as BlogPost

          return {
            ...postData,
            id,
          }
        })
      allPostsData.push(...dataPosts)
    }
    
    // Read from content/posts directory
    if (fs.existsSync(contentPostsDirectory)) {
      const contentFileNames = fs.readdirSync(contentPostsDirectory)
      const contentPosts = contentFileNames
        .filter((fileName) => fileName.endsWith(".json"))
        .map((fileName) => {
          const id = fileName.replace(/\.json$/, "")
          const fullPath = path.join(contentPostsDirectory, fileName)
          const fileContents = fs.readFileSync(fullPath, "utf8")
          const postData = JSON.parse(fileContents) as BlogPost

          return {
            ...postData,
            id,
          }
        })
      allPostsData.push(...contentPosts)
    }
    
    return allPostsData
      .filter((post) => post.status === "published")
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  } catch (error) {
    console.error("Error reading blog posts:", error)
    return []
  }
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    // Try to find in data/blog first
    let fullPath = path.join(dataBlogDirectory, `${slug}.json`)
    
    if (!fs.existsSync(fullPath)) {
      // Try to find in content/posts
      fullPath = path.join(contentPostsDirectory, `${slug}.json`)
      
      // Also try with date prefix in content/posts (YYYY-MM-DD-slug.json)
      if (!fs.existsSync(fullPath)) {
        const contentFiles = fs.readdirSync(contentPostsDirectory)
        const matchingFile = contentFiles.find(file => 
          file.endsWith(`-${slug}.json`) || file === `${slug}.json`
        )
        
        if (matchingFile) {
          fullPath = path.join(contentPostsDirectory, matchingFile)
        }
      }
    }
    
    if (!fs.existsSync(fullPath)) {
      return null
    }
    
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const postData = JSON.parse(fileContents) as BlogPost

    if (postData.status !== "published") {
      return null
    }

    return {
      ...postData,
      id: slug,
    }
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error)
    return null
  }
}

export function getFeaturedBlogPosts(limit = 3): BlogPost[] {
  const allPosts = getAllBlogPosts()
  return allPosts.filter((post) => post.featured).slice(0, limit)
}

export function getLatestBlogPosts(limit = 3): BlogPost[] {
  const allPosts = getAllBlogPosts()
  return allPosts.slice(0, limit)
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  const allPosts = getAllBlogPosts()
  return allPosts.filter((post) => post.tags.includes(tag))
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  const allPosts = getAllBlogPosts()
  return allPosts.filter((post) => post.category === category)
}

export function getAllCategories(): string[] {
  const allPosts = getAllBlogPosts()
  const categories = allPosts.map((post) => post.category)
  return Array.from(new Set(categories))
}

export function getAllTags(): string[] {
  const allPosts = getAllBlogPosts()
  const tags = allPosts.flatMap((post) => post.tags)
  return Array.from(new Set(tags))
}

export function getBlogPostsByCategories(): Record<string, BlogPost[]> {
  const allPosts = getAllBlogPosts()
  const categories = getAllCategories()

  return categories.reduce(
    (acc, category) => {
      acc[category] = allPosts.filter((post) => post.category === category)
      return acc
    },
    {} as Record<string, BlogPost[]>,
  )
}
