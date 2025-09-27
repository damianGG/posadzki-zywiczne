import type { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/posts-json"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://posadzkizywiczne.com"
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://posadzkizywiczne.com"

  const allPosts = getAllPosts()
  console.log("[v0] getAllPosts returned:", allPosts.length, "posts")
  console.log("[v0] First post:", allPosts[0])

  const posts = allPosts.map((post) => {
    console.log("[v0] Processing post:", post.slug, post.title)

    // Validate and create date objects safely
    let lastModified = new Date()

    try {
      if (post.updated && post.updated.trim()) {
        const updatedDate = new Date(post.updated)
        if (!isNaN(updatedDate.getTime())) {
          lastModified = updatedDate
        }
      } else if (post.date && post.date.trim()) {
        const dateObj = new Date(post.date)
        if (!isNaN(dateObj.getTime())) {
          lastModified = dateObj
        }
      }
    } catch (error) {
      console.warn(`Invalid date for post ${post.slug}:`, error)
      // fallback to current date
      lastModified = new Date()
    }

    const sitemapEntry = {
      url: `${base}/blog/${post.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: post.featured ? 0.8 : 0.7,
    }

    console.log("[v0] Sitemap entry:", sitemapEntry)

    return sitemapEntry
  })

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/posadzki-zywiczne-na-balkony`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/garaze`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kuchnia-salon`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pomieszczenia-czyste`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/blog/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts,
  ]
}
