import type { Metadata } from "next"
import { notFound } from "next/navigation"
import AllBlogPosts from "@/components/all-blog-posts"
import { getAllBlogPosts } from "@/lib/blog"
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
  const posts = getAllBlogPosts()
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
