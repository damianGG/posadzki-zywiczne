import type { Metadata } from "next"
import AllBlogPosts from "@/components/all-blog-posts"
import { getAllBlogPosts } from "@/lib/blog"

export const metadata: Metadata = {
    title: "Blog o Posadzkach Żywicznych - Wszystkie Artykuły | Posadzki Żywiczne",
    description:
        "Przeglądaj wszystkie artykuły o posadzkach żywicznych. Porady ekspertów, przewodniki, porównania i praktyczne rozwiązania.",
    keywords:
        "blog posadzki żywiczne, artykuły o posadzkach, porady ekspertów, przewodniki posadzki, posadzki epoksydowe",
    alternates: {
        canonical: "https://posadzkizywiczne.com/blog",
    },
}

export const revalidate = 30

export default async function BlogPage() {
    const posts = await getAllBlogPosts()

    return (
        <main>
            <AllBlogPosts posts={posts} />
        </main>
    )
}
