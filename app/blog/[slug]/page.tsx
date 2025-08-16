import type { Metadata } from "next"
import { notFound } from "next/navigation"
import BlogArticleDynamic from "@/components/blog-article-dynamic"
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/blog"

interface BlogPostPageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateStaticParams() {
    const posts = getAllBlogPosts()
    return posts.map((post) => ({
        slug: post.id,
    }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params
    const post = getBlogPostBySlug(slug)

    if (!post) {
        return {
            title: "Artykuł nie znaleziony",
        }
    }

    return {
        title: post.seo.metaTitle,
        description: post.seo.metaDescription,
        keywords: post.seo.keywords.join(", "),
        authors: [{ name: post.author.name }],
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            publishedTime: post.publishedAt,
            authors: [post.author.name],
            url: post.seo.canonicalUrl,
            images: [
                {
                    url: post.image.url,
                    width: 1200,
                    height: 630,
                    alt: post.image.alt,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
            images: [post.image.url],
        },
        alternates: {
            canonical: post.seo.canonicalUrl,
        },
    }
}
export const dynamic = "force-static"

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params
    const post = getBlogPostBySlug(slug)

    if (!post) {
        notFound()
    }

    return (
        <main>
            <BlogArticleDynamic post={post} />
        </main>
    )
}
