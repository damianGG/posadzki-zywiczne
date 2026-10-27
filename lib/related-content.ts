import type { BlogPost } from "@/lib/blog"

const STOPWORDS = new Set([
  "posadzki", "posadzka", "zywiczna", "zywiczne", "zywicznych", "oraz",
  "czy", "jak", "dla", "jest", "sie", "nie", "nad", "pod", "tez",
  "ktory", "ktora", "ktore", "przy", "bez", "poradnik", "sprawdz",
])

function normalize(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
}

function words(value: string): Set<string> {
  return new Set(normalize(value).match(/[a-z0-9]{4,}/g)?.filter((word) => !STOPWORDS.has(word)) ?? [])
}

function topicTags(post: BlogPost): Set<string> {
  return new Set(post.tags.map(normalize))
}

/** Only links to published, existing blog posts; deterministic for server rendering. */
export function getRelatedArticles(post: BlogPost, allPosts: BlogPost[], limit = 3): BlogPost[] {
  const tags = topicTags(post)
  const titleWords = words(post.title)
  const category = normalize(post.category)

  return allPosts
    .filter((candidate) => candidate.id !== post.id && candidate.status === "published")
    .map((candidate) => {
      const candidateTags = topicTags(candidate)
      const sharedTags = [...tags].filter((tag) => candidateTags.has(tag)).length
      const sharedWords = [...titleWords].filter((word) => words(candidate.title).has(word)).length
      const sameCategory = category && category === normalize(candidate.category) ? 3 : 0
      const score = sharedTags * 4 + sharedWords * 2 + sameCategory
      return { candidate, score }
    })
    .filter(({ score }) => score >= 3)
    .sort((a, b) => b.score - a.score || b.candidate.publishedAt.localeCompare(a.candidate.publishedAt))
    .slice(0, limit)
    .map(({ candidate }) => candidate)
}

export function getRelatedService(post: BlogPost): { href: string; title: string; description: string } | null {
  const topic = normalize([post.title, post.category, ...post.tags].join(" "))
  if (/balkon|taras|kamienny dywan/.test(topic)) {
    return {
      href: "/posadzki-zywiczne-na-balkony",
      title: "Systemy żywiczne na balkony i tarasy",
      description: "Poznaj możliwości wykonania nawierzchni zewnętrznych i poproś o dobór systemu.",
    }
  }
  if (/garaz|parking|samochod/.test(topic)) {
    return {
      href: "/garaze",
      title: "Posadzki żywiczne do garażu",
      description: "Sprawdź rozwiązania do garaży i umów wycenę na podstawie stanu podłoża.",
    }
  }
  return null
}
