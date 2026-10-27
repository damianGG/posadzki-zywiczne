import Link from "next/link"
import { ArrowUpRight, BookOpen } from "lucide-react"
import type { BlogPost } from "@/lib/blog"
import { getRelatedArticles, getRelatedService } from "@/lib/related-content"

type RelatedContentProps = {
  post: BlogPost
  allPosts: BlogPost[]
}

/** Editorial links: show only when an actual topical relationship exists. */
export default function RelatedContent({ post, allPosts }: RelatedContentProps) {
  const related = getRelatedArticles(post, allPosts)
  const service = getRelatedService(post)

  if (!related.length && !service) return null

  return (
    <aside aria-labelledby="related-content-title" className="my-10 rounded-xl border border-border bg-muted/30 p-6 not-prose">
      <div className="mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 id="related-content-title" className="text-lg font-semibold">W tym temacie przeczytaj także</h2>
      </div>
      <ul className="grid gap-4 md:grid-cols-2">
        {related.map((article) => (
          <li key={article.id}>
            <Link href={`/blog/${article.id}`} className="group block rounded-lg border bg-background p-4 hover:border-primary/50">
              <span className="font-semibold group-hover:text-primary">{article.title}</span>
              <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">{article.excerpt}</span>
              <span className="mt-2 inline-flex items-center gap-1 text-sm text-primary">
                Czytaj artykuł <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
        {service && (
          <li>
            <Link href={service.href} className="group block rounded-lg border bg-background p-4 hover:border-primary/50">
              <span className="font-semibold group-hover:text-primary">{service.title}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{service.description}</span>
              <span className="mt-2 inline-flex items-center gap-1 text-sm text-primary">
                Zobacz ofertę <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          </li>
        )}
      </ul>
    </aside>
  )
}
