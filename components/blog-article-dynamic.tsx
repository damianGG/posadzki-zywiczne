import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { BlogPost } from "@/lib/blog"

interface BlogArticleDynamicProps {
  post: BlogPost
}

export default function BlogArticleDynamic({ post }: BlogArticleDynamicProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image.url,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: `https://posadzkizywiczne.com/autor/${post.author.name.toLowerCase().replace(/\s+/g, "-")}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Posadzki Żywiczne",
      logo: {
        "@type": "ImageObject",
        url: "https://posadzkizywiczne.pl/logo.png",
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.seo.canonicalUrl,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary">
                Strona główna
              </Link>
            </li>
            <li className="before:content-['/'] before:mx-2">
              <Link href="/blog" className="hover:text-primary">
                Blog
              </Link>
            </li>
            <li className="before:content-['/'] before:mx-2 text-foreground">{post.title}</li>
          </ol>
        </nav>

        {/* Back to blog */}
        <Button variant="ghost" asChild className="mb-8 pl-0">
          <Link href="/blog" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do bloga
          </Link>
        </Button>

        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4">
            <Badge>{post.category}</Badge>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>

          <p className="text-xl text-muted-foreground mb-6 leading-relaxed">{post.excerpt}</p>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b">
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString("pl-PL")}</time>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{post.readTime}</span>
              </div>
            </div>

            <Button variant="ghost" size="sm" className="flex items-center">
              <Share2 className="w-4 h-4 mr-2" />
              Udostępnij
            </Button>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-12">
          <Image
            src={post.image.url || "/placeholder.svg"}
            alt={post.image.alt}
            width={1200}
            height={600}
            className="w-full h-auto rounded-lg"
            priority
          />
          <figcaption className="text-sm text-muted-foreground mt-2 text-center">{post.image.caption}</figcaption>
        </div>

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none dark:prose-invert 
                        prose-headings:text-foreground 
                        prose-p:text-foreground 
                        prose-li:text-foreground 
                        prose-strong:text-foreground
                        prose-a:text-primary
                        prose-blockquote:text-muted-foreground
                        prose-code:text-foreground
                        prose-pre:bg-muted"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t">
          <Card>
            <CardHeader>
              <CardTitle>Potrzebujesz profesjonalnej posadzki żywicznej?</CardTitle>
              <CardDescription>
                Skontaktuj się z naszymi ekspertami i otrzymaj bezpłatną wycenę dla swojego projektu.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href="/kontakt">Skontaktuj się z nami</Link>
              </Button>
            </CardFooter>
          </Card>
        </footer>
      </article>
    </>
  )
}
