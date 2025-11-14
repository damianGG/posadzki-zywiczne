"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  User,
  ArrowRight,
  Search,
  Home,
  ChefHat,
  Car,
  TreePine,
  Building,
  Wrench,
  Palette,
  DollarSign,
  Shield,
  X,
} from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import type { BlogPost } from "@/lib/blog"

const tagIcons = {
  dom: { icon: Home, label: "Dom", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
  kuchnia: { icon: ChefHat, label: "Kuchnia", color: "bg-orange-100 text-orange-700 hover:bg-orange-200" },
  garaż: { icon: Car, label: "Garaż", color: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
  balkon: { icon: TreePine, label: "Balkon/Taras", color: "bg-green-100 text-green-700 hover:bg-green-200" },
  przemysł: { icon: Building, label: "Przemysł", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
  warsztat: { icon: Wrench, label: "Warsztat", color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
  design: { icon: Palette, label: "Design", color: "bg-pink-100 text-pink-700 hover:bg-pink-200" },
  koszty: { icon: DollarSign, label: "Koszty", color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" },
  wytrzymałość: { icon: Shield, label: "Wytrzymałość", color: "bg-red-100 text-red-700 hover:bg-red-200" },
}

const POSTS_PER_PAGE = 6

interface AllBlogPostsProps {
  posts: BlogPost[]
}

export default function AllBlogPosts({ posts }: AllBlogPostsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => post.tags.includes(tag))

      return matchesSearch && matchesTags
    })
  }, [posts, searchTerm, selectedTags])

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedTags([])
    setCurrentPage(1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Wszystkie Artykuły o Posadzkach</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Przeglądaj naszą kompletną bibliotekę artykułów o posadzkach żywicznych. Znajdź odpowiedzi na wszystkie
          pytania dotyczące nowoczesnych rozwiązań podłogowych.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Szukaj artykułów..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Visual Tag Filters */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-center">Wybierz obszar zastosowania:</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {Object.entries(tagIcons).map(([tag, { icon: Icon, label, color }]) => {
            const isSelected = selectedTags.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`
                  flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 min-w-[100px]
                  ${isSelected
                    ? "border-primary bg-primary/10 shadow-md scale-105"
                    : `border-border ${color} hover:shadow-md hover:scale-105`
                  }
                `}
              >
                <Icon className={`w-8 h-8 mb-2 ${isSelected ? "text-primary" : ""}`} />
                <span className={`text-sm font-medium ${isSelected ? "text-primary" : ""}`}>{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Filters */}
      {(selectedTags.length > 0 || searchTerm) && (
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 justify-center">
            <span className="text-sm text-muted-foreground">Aktywne filtry:</span>
            {selectedTags.map((tag) => {
              const tagInfo = tagIcons[tag]
              if (!tagInfo) return null
              const { icon: Icon, label } = tagInfo
              return (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  <Icon className="w-3 h-3" />
                  {label}
                  <button onClick={() => handleTagToggle(tag)} className="ml-1 hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )
            })}
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Search className="w-3 h-3" />{searchTerm}
                <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Wyczyść wszystko
            </Button>
          </div>
        </div>
      )}

      {/* Results info */}
      <div className="mb-6 text-center">
        <span className="text-sm text-muted-foreground">
          Znaleziono {filteredPosts.length} {filteredPosts.length === 1 ? "artykuł" : "artykułów"}
        </span>
      </div>

      <Separator className="mb-8" />

      {/* Articles Grid */}
      {paginatedPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {paginatedPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <Image
                    src={post.image.url || "/placeholder.svg"}
                    alt={post.image.alt}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                </div>

                <CardHeader className="pt-6">
                  <h2 className="text-xl font-bold line-clamp-2">{post.title}</h2>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>

                  {/* Visual Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => {
                      const tagInfo = tagIcons[tag]
                      if (!tagInfo) return null
                      const { icon: Icon, color } = tagInfo
                      return (
                        <div key={tag} className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${color}`}>
                          <Icon className="w-3 h-3" />
                          <span>{tagInfo.label}</span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {post.author.name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString("pl-PL")}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Poprzednia
              </Button>

              <div className="flex space-x-1">
                {(() => {
                  const pages = []
                  const maxVisible = 5
                  
                  if (totalPages <= maxVisible + 2) {
                    // Show all pages if total is small
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i)
                    }
                  } else {
                    // Always show first page
                    pages.push(1)
                    
                    let start = Math.max(2, currentPage - 1)
                    let end = Math.min(totalPages - 1, currentPage + 1)
                    
                    // Adjust if at the beginning
                    if (currentPage <= 3) {
                      end = maxVisible - 1
                    }
                    
                    // Adjust if at the end
                    if (currentPage >= totalPages - 2) {
                      start = totalPages - maxVisible + 2
                    }
                    
                    // Add ellipsis before middle pages
                    if (start > 2) {
                      pages.push('...')
                    }
                    
                    // Add middle pages
                    for (let i = start; i <= end; i++) {
                      pages.push(i)
                    }
                    
                    // Add ellipsis after middle pages
                    if (end < totalPages - 1) {
                      pages.push('...')
                    }
                    
                    // Always show last page
                    pages.push(totalPages)
                  }
                  
                  return pages.map((page, index) => {
                    if (page === '...') {
                      return (
                        <span key={`ellipsis-${index}`} className="px-2 py-1 text-muted-foreground">
                          ...
                        </span>
                      )
                    }
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page as number)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    )
                  })
                })()}
              </div>

              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Następna
              </Button>
            </div>
          )}
        </>
      ) : (
        /* No results */
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Nie znaleziono artykułów</h3>
            <p>Spróbuj zmienić kryteria wyszukiwania lub wybierz inne tagi.</p>
          </div>
          <Button variant="outline" onClick={clearAllFilters}>
            Wyczyść filtry
          </Button>
        </div>
      )}

      {/* Newsletter CTA */}
      <Separator className="my-12" />

      <Card className="text-center">
        <CardHeader>
          <h3 className="text-2xl font-bold">Nie przegap najnowszych artykułów</h3>
          <p className="text-muted-foreground">
            Zapisz się do naszego newslettera i otrzymuj powiadomienia o nowych artykułach o posadzkach żywicznych.
          </p>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button size="lg">Zapisz się do newslettera</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
