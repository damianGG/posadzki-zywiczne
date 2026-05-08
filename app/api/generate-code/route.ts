import { type NextRequest, NextResponse } from "next/server"
import { type SupabaseClient } from "@supabase/supabase-js"
import { promises as fs } from "fs"
import path from "path"
import crypto from "crypto"
import {
  getSupabaseClient,
  sendConfirmationEmail,
  RECAPTCHA_VERIFY_URL,
  RECAPTCHA_SCORE_THRESHOLD,
} from "@/lib/contest/utils"

const DATA_FILE = path.join(process.cwd(), "data", "contest-entries.json")
const MAX_CODE_GENERATION_ATTEMPTS = 10

// Detect if running in serverless environment (Vercel/AWS Lambda)
// where filesystem is read-only except for /tmp
const isServerless = () => {
  return (
    process.env.VERCEL === "1" ||
    process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined ||
    process.env.LAMBDA_TASK_ROOT !== undefined
  )
}

interface ContestEntry {
  email: string
  name: string
  code: string
  timestamp: string
}

async function verifySupabaseConnection(client: SupabaseClient) {
  const { error } = await client.from("contest_entries").select("code").limit(1)

  if (error?.code === "42P01") {
    throw new Error(
      "Brak tabeli contest_entries w Supabase. Utwórz ją (kolumny: email text, name text, code text, timestamp text) lub zaktualizuj migracje."
    )
  }

  if (error) {
    throw error
  }
}

async function readEntries(): Promise<ContestEntry[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, return empty array
    return []
  }
}

async function writeEntries(entries: ContestEntry[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2))
}

function generateUniqueCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 5; i++) {
    const randomIndex = crypto.randomInt(0, alphabet.length)
    code += alphabet[randomIndex]
  }
  return code
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, recaptchaToken } = await request.json()

    // Verify reCAPTCHA token
    if (!recaptchaToken) {
      return NextResponse.json(
        { success: false, message: "Weryfikacja reCAPTCHA nie powiodła się. Spróbuj ponownie." },
        { status: 400 }
      )
    }

    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY
    if (!recaptchaSecretKey) {
      console.error("RECAPTCHA_SECRET_KEY is not configured")
      return NextResponse.json(
        { success: false, message: "Błąd konfiguracji serwera. Skontaktuj się z administratorem." },
        { status: 500 }
      )
    }

    // Verify the reCAPTCHA token with Google
    const recaptchaResponse = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${recaptchaSecretKey}&response=${recaptchaToken}`,
    })

    const recaptchaData = await recaptchaResponse.json()

    if (!recaptchaData.success || recaptchaData.score < RECAPTCHA_SCORE_THRESHOLD) {
      console.warn("reCAPTCHA verification failed:", recaptchaData)
      return NextResponse.json(
        {
          success: false,
          message:
            "Weryfikacja reCAPTCHA nie powiodła się. Jeśli jesteś człowiekiem, spróbuj ponownie za chwilę.",
        },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()

    if (!supabase) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Brak konfiguracji Supabase. Ustaw SUPABASE_URL oraz SUPABASE_SERVICE_ROLE_KEY i spróbuj ponownie.",
        },
        { status: 500 }
      )
    }

    try {
      await verifySupabaseConnection(supabase)
    } catch (connectionError) {
      console.error("Supabase connection error:", connectionError)
      const detailedMessage =
        connectionError instanceof Error ? connectionError.message : "Nieznany błąd połączenia z Supabase."
      return NextResponse.json(
        {
          success: false,
          message: `Nie udało się nawiązać połączenia z bazą danych Supabase: ${detailedMessage}`,
        },
        { status: 500 }
      )
    }

    // Validate input
    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, message: "Imię musi mieć minimum 2 znaki" },
        { status: 400 }
      )
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Podaj prawidłowy adres email" },
        { status: 400 }
      )
    }

    // Check if email already exists in Supabase
    const { data: existingEntry, error: existingEntryError } = await supabase
      .from("contest_entries")
      .select("email, name, code")
      .eq("email", email)
      .maybeSingle()

    if (existingEntryError) {
      console.error("Error checking existing entry in Supabase:", existingEntryError)
      return NextResponse.json(
        { success: false, message: "Wystąpił błąd podczas sprawdzania zgłoszenia. Spróbuj ponownie." },
        { status: 500 }
      )
    }

    if (existingEntry) {
      return NextResponse.json({
        success: true,
        code: existingEntry.code,
        message:
          "Ten adres email ma już przypisany kod konkursowy. Jeśli nie otrzymałeś emaila, użyj opcji wysłania ponownie poniżej.",
        alreadyExists: true,
      })
    }

    // Generate unique code
    let code = generateUniqueCode()
    let attempts = 0

    // Ensure code is unique in Supabase
    while (attempts < MAX_CODE_GENERATION_ATTEMPTS) {
      const { data: codeCheck, error: codeError } = await supabase
        .from("contest_entries")
        .select("code")
        .eq("code", code)
        .maybeSingle()

      if (codeError) {
        console.error("Error checking code uniqueness:", codeError)
        return NextResponse.json(
          { success: false, message: "Wystąpił błąd podczas generowania kodu. Spróbuj ponownie." },
          { status: 500 }
        )
      }

      if (!codeCheck) {
        break
      }

      code = generateUniqueCode()
      attempts += 1
    }

    if (attempts >= MAX_CODE_GENERATION_ATTEMPTS) {
      return NextResponse.json(
        { success: false, message: "Nie udało się wygenerować unikalnego kodu. Spróbuj ponownie." },
        { status: 500 }
      )
    }

    // Create new entry
    const newEntry: ContestEntry = {
      email,
      name,
      code,
      timestamp: new Date().toISOString(),
    }

    // Save to Supabase
    const { error: insertError } = await supabase.from("contest_entries").insert(newEntry)

    if (insertError) {
      console.error("Error inserting entry to Supabase:", insertError)
      return NextResponse.json(
        { success: false, message: "Wystąpił błąd podczas zapisywania zgłoszenia. Spróbuj ponownie." },
        { status: 500 }
      )
    }

    // Save locally as fallback (only in non-serverless environments)
    // In serverless environments (Vercel, AWS Lambda), the filesystem is read-only
    // and Supabase is the primary/only storage
    if (!isServerless()) {
      try {
        const entries = await readEntries()
        entries.push(newEntry)
        await writeEntries(entries)
      } catch (localError) {
        console.error("Error writing local contest entry backup:", localError)
      }
    }

    // Send confirmation email
    try {
      await sendConfirmationEmail(email, name, code)
    } catch (emailError) {
      console.error("Error sending email:", emailError)
      // Continue even if email fails - user got the code in response
    }

    return NextResponse.json({
      success: true,
      code,
      message: "Kod został wygenerowany i wysłany na Twój email!",
    })
  } catch (error) {
    console.error("Error in generate-code:", error)
    return NextResponse.json(
      { success: false, message: "Wystąpił błąd. Spróbuj ponownie później." },
      { status: 500 }
    )
  }
}
