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
  title?: string
  date?: string
  updated?: string
  featured?: boolean
}

/**
 * Generate slug from title (basic PL-friendly normalization)
 */
function generateSlugFromTitle(title?: string): string {
  if (!title) return `post-${Date.now()}`
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-ąćęłńóśżź]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

/**
 * Safely parse JSON file, return null on error
 */
function readJsonSafe(filePath: string): RawPost | null {
  try {
    const raw = fs.readFileSync(filePath, "utf8")
    return JSON.parse(raw)
  } catch (err) {
    console.warn(`[getAllPosts] Nie można wczytać/parować pliku ${filePath}:`, err && (err as Error).message)
    return null
  }
}

/**
 * Read all JSON files from data/blog and return normalized posts with slug guaranteed.
 */
export function getAllPosts(): Post[] {
  const blogDir = path.join(process.cwd(), "data", "blog")

  if (!fs.existsSync(blogDir)) {
    console.warn("[getAllPosts] Brak katalogu data/blog pod:", blogDir)
    return []
  }

  const files = fs.readdirSync(blogDir).filter((f) => f.toLowerCase().endsWith(".json"))
  if (files.length === 0) {
    console.warn("[getAllPosts] Brak plików .json w katalogu data/blog:", blogDir)
    return []
  }

  const posts: Post[] = []

  for (const file of files) {
    const filePath = path.join(blogDir, file)
    const raw = readJsonSafe(filePath)
    if (!raw) continue

    // Determine slug: prefer raw.slug, then raw.id, then filename without extension, then generated from title
    const filenameSlug = file.replace(/\.json$/i, "")
    const derivedSlug =
      (raw.slug && String(raw.slug).trim()) ||
      (raw.id && String(raw.id).trim()) ||
      (filenameSlug && String(filenameSlug).trim()) ||
      generateSlugFromTitle(raw.title)

    const slug = derivedSlug || generateSlugFromTitle(raw.title)

    if (!raw.slug && !raw.id) {
      console.warn(`[getAllPosts] Plik ${file} nie zawiera slug/id — używam: ${slug}`)
    }

    const post: Post = {
      ...raw,
      slug: String(slug),
      id: raw.id ? String(raw.id) : raw.id,
    }

    posts.push(post)
  }

  // opcjonalnie: posortuj po dacie malejąco jeśli chcesz
  // posts.sort((a,b) => (b.date || b.updated || "").localeCompare(a.date || a.updated || ""))

  console.log(`[getAllPosts] Wczytano ${posts.length} postów z data/blog`)
  return posts
}