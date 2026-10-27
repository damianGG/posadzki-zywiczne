import { type NextRequest, NextResponse } from "next/server"
import { isDatabaseConfigured, query } from "@/lib/db"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "contest-entries.json")
const ENTRIES_CACHE_TTL_MS = 60_000
let cachedNormalizedEntries: string[] | null = null
let cachedEntriesMtimeMs: number | null = null
let cachedEntriesCheckedAt = 0

async function readNormalizedEntries(): Promise<string[]> {
  const now = Date.now()
  if (cachedNormalizedEntries && now - cachedEntriesCheckedAt < ENTRIES_CACHE_TTL_MS) {
    return cachedNormalizedEntries
  }
  try {
    const stat = await fs.stat(DATA_FILE)
    if (cachedNormalizedEntries && cachedEntriesMtimeMs === stat.mtimeMs) {
      cachedEntriesCheckedAt = now
      return cachedNormalizedEntries
    }
    const data = await fs.readFile(DATA_FILE, "utf-8")
    const entries = JSON.parse(data) as Array<{ code?: string }>
    cachedNormalizedEntries = entries
      .map((entry) => entry.code?.trim().toUpperCase())
      .filter((entry): entry is string => Boolean(entry))
    cachedEntriesMtimeMs = stat.mtimeMs
    cachedEntriesCheckedAt = now
    return cachedNormalizedEntries
  } catch (error) {
    console.error("Failed to read contest entries from file:", error)
    cachedNormalizedEntries = []
    cachedEntriesMtimeMs = null
    cachedEntriesCheckedAt = now
    return cachedNormalizedEntries
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const rawCode = typeof body?.code === "string" ? body.code : ""
    const normalizedCode = rawCode.trim().toUpperCase()

    if (!normalizedCode) {
      return NextResponse.json({ valid: false }, { status: 400 })
    }

    if (isDatabaseConfigured()) {
      try {
        const rows = await query("select code from contest_entries where code = $1 limit 1", [normalizedCode])
        return NextResponse.json({ valid: rows.length > 0 })
      } catch (error) {
        console.error("Discount verification failed (database query error):", error)
        return NextResponse.json({ valid: false }, { status: 500 })
      }
    }

    const normalizedEntries = await readNormalizedEntries()
    const valid = normalizedEntries.includes(normalizedCode)
    return NextResponse.json({ valid })
  } catch (error) {
    console.error("Discount verification failed (unexpected):", error)
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}
