import type { Metadata } from "next"
import { notFound } from "next/navigation"
import AllBlogPosts from "@/components/all-blog-posts"
import { getAllBlogPosts, type BlogPostSummary } from "@/lib/blog"
import { POSTS_PER_PAGE } from "@/lib/blog-pagination"
import { absoluteUrl } from "@/lib/site-config"

type BlogPageProps = {
  searchParams: Promise<{ page?: string | string[] }>
}

function parsePage(value: string | string[] | undefined): number {
  if (value === undefined) return 1
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return NaN
  const page = Number(value)
  return Number.isSafeInteger(page) ? page : NaN
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const { page: rawPage } = await searchParams
  const page = parsePage(rawPage)
  const canonicalPath = page > 1 ? `/blog?page=${page}` : "/blog"

  return {
    title: "Blog o Posadzkach Żywicznych - Wszystkie Artykuły | Posadzki Żywiczne",
    description: "Przeglądaj wszystkie artykuły o posadzkach żywicznych. Porady ekspertów, przewodniki, porównania i praktyczne rozwiązania.",
    alternates: { canonical: absoluteUrl(canonicalPath) },
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const posts: BlogPostSummary[] = getAllBlogPosts().map(post => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    tags: post.tags,
    publishedAt: post.publishedAt,
    readTime: post.readTime,
    image: post.image,
    author: { name: post.author.name },
  }))
  const { page: rawPage } = await searchParams
  const page = parsePage(rawPage)
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE))

  if (!Number.isFinite(page) || page > totalPages) notFound()

  return (
    <main>
      <AllBlogPosts posts={posts} initialPage={page} />
    </main>
  )
}
