import { type NextRequest, NextResponse } from "next/server"
import { type SupabaseClient, createClient } from "@supabase/supabase-js"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "contest-entries.json")
let cachedNormalizedEntries: string[] | null = null

function getSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

async function readNormalizedEntries(): Promise<string[]> {
  if (cachedNormalizedEntries) {
    return cachedNormalizedEntries
  }
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8")
    const entries = JSON.parse(data) as Array<{ code?: string }>
    cachedNormalizedEntries = entries
      .map((entry) => entry.code?.trim().toUpperCase())
      .filter((entry): entry is string => Boolean(entry))
    return cachedNormalizedEntries
  } catch (error) {
    console.error("Discount verification fallback read failed:", error)
    cachedNormalizedEntries = null
    return []
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

    const supabase = getSupabaseClient()

    if (supabase) {
      const { data, error } = await supabase
        .from("contest_entries")
        .select("code")
        .eq("code", normalizedCode)
        .limit(1)

      if (error) {
        console.error("Discount verification failed (supabase):", error)
        return NextResponse.json({ valid: false }, { status: 500 })
      }

      return NextResponse.json({ valid: (data ?? []).length > 0 })
    }

    const normalizedEntries = await readNormalizedEntries()
    const valid = normalizedEntries.includes(normalizedCode)
    return NextResponse.json({ valid })
  } catch (error) {
    console.error("Discount verification failed (unexpected):", error)
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}
