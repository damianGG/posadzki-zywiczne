// lib/posts-json.ts
import fs from "fs"
import path from "path"

type RawPost = {
  id?: string
  slug?: string
  title?: string
  date?: string
  updated?: string
  featured?: boolean
  [key: string]: any
}

export type Post = RawPost & {
  id?: string
  slug: string
  title: string
  date?: string
  updated?: string
  featured?: boolean
}

function generateSlugFromTitle(title?: string): string {
  if (!title) return `post-${Date.now()}`
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-ąćęłńóśżź]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function getAllPosts(): Post[] {
  const dataPath = path.join(process.cwd(), "data", "posts.json")
  if (!fs.existsSync(dataPath)) {
    console.warn("[getAllPosts] Brak pliku posts.json pod:", dataPath)
    return []
  }

  let raw: RawPost[] = []
  try {
    const file = fs.readFileSync(dataPath, "utf8")
    raw = JSON.parse(file)
    if (!Array.isArray(raw)) {
      console.warn("[getAllPosts] Oczekiwano listy postów w posts.json")
      raw = []
    }
  } catch (err) {
    console.error("[getAllPosts] Błąd podczas parsowania posts.json:", err)
    return []
  }

  const posts: Post[] = raw.map((p) => {
    const derivedSlug = (p.slug && String(p.slug).trim()) || (p.id && String(p.id).trim()) || generateSlugFromTitle(p.title)

    if (!p.slug && p.id) {
      p.slug = String(p.id)
    } else if (!p.slug) {
      p.slug = derivedSlug
    }

    if (!p.slug || !String(p.slug).trim()) {
      p.slug = generateSlugFromTitle(p.title)
      console.warn(`[getAllPosts] Wygenerowano slug dla posta (brak slug/id): ${JSON.stringify(p).slice(0, 200)}`)
    }

    return {
      ...p,
      slug: String(p.slug),
      id: p.id ? String(p.id) : undefined,
    } as Post
  })

  return posts
}