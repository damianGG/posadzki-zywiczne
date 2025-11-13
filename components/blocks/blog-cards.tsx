import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const blogPosts = [
  {
    id: 1,
    title: "Nowoczesne Posadzki Żywiczne - Przewodnik 2024",
    excerpt:
      "Odkryj zalety posadzek żywicznych i dowiedz się, dlaczego są idealnym wyborem dla nowoczesnych wnętrz. Kompletny przewodnik po rodzajach i zastosowaniach.",
    image: "/placeholder.svg?height=300&width=400",
    author: "Jan Kowalski",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "2024-01-15",
    category: "Poradniki",
    readTime: "5 min",
  },
  {
    id: 2,
    title: "Jak Wybrać Idealną Posadzkę do Garażu?",
    excerpt:
      "Praktyczny poradnik wyboru posadzki garażowej. Poznaj najlepsze rozwiązania odporne na oleje, sole drogowe i intensywne użytkowanie.",
    image: "/placeholder.svg?height=300&width=400",
    author: "Anna Nowak",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "2024-01-10",
    category: "Porady",
    readTime: "7 min",
  },
  {
    id: 3,
    title: "Posadzki Przemysłowe - Wytrzymałość na Lata",
    excerpt:
      "Wszystko o posadzkach przemysłowych: od wyboru materiału po proces aplikacji. Dowiedz się, jak zapewnić długotrwałą wytrzymałość.",
    image: "/placeholder.svg?height=300&width=400",
    author: "Marek Wiśniewski",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "2024-01-05",
    category: "Przemysł",
    readTime: "6 min",
  },
]

export default function BlogCards() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Najnowsze Artykuły o Posadzkach</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Poznaj najnowsze trendy, porady ekspertów i praktyczne rozwiązania w świecie posadzek żywicznych
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="relative">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">{post.category}</Badge>
                </div>
              </div>

              <CardHeader className="pt-6">
                <h3 className="text-xl font-bold line-clamp-2">{post.title}</h3>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.date).toLocaleDateString("pl-PL")}
                    </div>
                  </div>
                  <span>{post.readTime}</span>
                </div>
              </CardContent>

              <CardFooter>
                <Button variant="link" asChild className="px-0">
                  <Link href={`/blog/${post.id}`} className="flex items-center">
                    Czytaj więcej
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/blog" className="flex items-center">
              Zobacz wszystkie artykuły
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
