// url: add to repo as scripts/generate-blog-list.js
// Uruchom: node scripts/generate-blog-list.js
// Skrypt czyta katalog data/blog i generuje:
// - sitemap-local.xml
// - blog-pages.txt (lista URL po jednej linii)

const fs = require("fs")
const path = require("path")

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://posadzkizywiczne.com"
const blogDir = path.join(process.cwd(), "data", "blog")
if (!fs.existsSync(blogDir)) {
    console.error("Nie znaleziono katalogu data/blog pod:", blogDir)
    process.exit(1)
}

function safeSlugFromFilename(filename) {
    // plik wygląda: posadzki-zywiczne-krakow.json -> slug = posadzki-zywiczne-krakow
    return filename.replace(/\.json$/i, "")
}

function readJsonSafe(filePath) {
    try {
        const raw = fs.readFileSync(filePath, "utf8")
        return JSON.parse(raw)
    } catch (err) {
        console.warn("Nie można wczytać/parsować pliku:", filePath, err.message)
        return null
    }
}

const files = fs.readdirSync(blogDir).filter((f) => f.toLowerCase().endsWith(".json"))
if (files.length === 0) {
    console.error("Brak plików .json w katalogu data/blog")
    process.exit(1)
}

const urls = []
const listLines = []

for (const file of files) {
    const filePath = path.join(blogDir, file)
    const json = readJsonSafe(filePath)
    const slug = (json && (json.slug || json.id)) || safeSlugFromFilename(file)
    const title = json && (json.title || json.titlePlain || json.name) ? (json.title || json.titlePlain || json.name) : null

    const loc = `${base}/blog/${slug}`
    const lastmod = json && (json.updated || json.date || json.publishedAt) ? (json.updated || json.date || json.publishedAt) : null
    urls.push({ loc, lastmod, changefreq: "monthly", priority: json && json.featured ? "0.8" : "0.7", title })
    listLines.push(loc + (title ? ` | ${title}` : ""))
}

// Zapis blog-pages.txt
const outListPath = path.join(process.cwd(), "blog-pages.txt")
fs.writeFileSync(outListPath, listLines.join("\n"), "utf8")
console.log("Wygenerowano:", outListPath)

// Zapis sitemap-local.xml
const xmlParts = []
xmlParts.push('<?xml version="1.0" encoding="UTF-8"?>')
xmlParts.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

for (const u of urls) {
    xmlParts.push("  <url>")
    xmlParts.push(`    <loc>${u.loc}</loc>`)
    if (u.lastmod) {
        try {
            xmlParts.push(`    <lastmod>${new Date(u.lastmod).toISOString()}</lastmod>`)
        } catch {
            // ignoruj nieprawidłowe daty
        }
    }
    xmlParts.push(`    <changefreq>${u.changefreq}</changefreq>`)
    xmlParts.push(`    <priority>${u.priority}</priority>`)
    xmlParts.push("  </url>")
}

xmlParts.push("</urlset>")

const outXmlPath = path.join(process.cwd(), "sitemap-local.xml")
fs.writeFileSync(outXmlPath, xmlParts.join("\n"), "utf8")
console.log("Wygenerowano:", outXmlPath)