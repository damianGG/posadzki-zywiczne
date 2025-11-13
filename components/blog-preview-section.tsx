import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight, Clock } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { BlogPost } from "@/lib/blog"

interface BlogPreviewSectionProps {
  posts: BlogPost[]
  title?: string
  subtitle?: string
  showCategory?: boolean
  limit?: number
}

export default function BlogPreviewSection({
  posts,
  title = "Najnowsze Artykuły",
  subtitle = "Poznaj najnowsze trendy, porady ekspertów i praktyczne rozwiązania w świecie posadzek żywicznych",
  showCategory = true,
  limit = 3,
}: BlogPreviewSectionProps) {
  const displayPosts = posts.slice(0, limit)

  if (displayPosts.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayPosts.map((post, index) => (
            <Card
              key={post.id}
              className={`overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${index === 0 && limit === 3 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
            >
              <div className="relative">
                <Image
                  src={post.image.url || "/placeholder.svg"}
                  alt={post.image.alt}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                {showCategory && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                )}
                {index === 0 && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground">Najnowsze</Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pt-6">
                <h3 className="text-xl font-bold line-clamp-2 hover:text-primary transition-colors">
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </h3>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span className="truncate">{post.author.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString("pl-PL")}</time>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button variant="link" asChild className="px-0 group">
                  <Link href={`/blog/${post.id}`} className="flex items-center">
                    Czytaj więcej
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button asChild size="lg" className="group">
            <Link href="/blog" className="flex items-center">
              Zobacz wszystkie artykuły
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Mamy już <span className="font-semibold text-foreground">{posts.length}</span> artykułów o posadzkach
            żywicznych
          </p>
        </div>
      </div>
    </section>
  )
}
