import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { type SupabaseClient, createClient } from "@supabase/supabase-js"
import { promises as fs } from "fs"
import path from "path"
import crypto from "crypto"

interface ContestEntry {
  email: string
  name: string
  code: string
  timestamp: string
}

const DATA_FILE = path.join(process.cwd(), "data", "contest-entries.json")
const MAX_CODE_GENERATION_ATTEMPTS = 10

function getSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey)
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

async function sendConfirmationEmail(email: string, name: string, code: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Twój kod konkursowy – Świąteczny Konkurs Posadzki Żywiczne",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎄 Świąteczny Konkurs 🎄</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Posadzki Żywiczne</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Witaj ${name}!</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Dziękujemy za udział w Świątecznym Konkursie!
          </p>
          
          <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
            <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Twój kod konkursowy to:</p>
            <p style="color: #667eea; font-size: 32px; font-weight: bold; margin: 0; letter-spacing: 2px; font-family: 'Courier New', monospace;">
              ${code}
            </p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>⚠️ Ważne!</strong><br>
              Przechowaj ten kod – będzie wykorzystany podczas losowania.
            </p>
          </div>
          
          <div style="margin-top: 25px; padding: 20px; background: #e8f5e9; border-radius: 8px; border-left: 4px solid #4caf50;">
            <h3 style="color: #2e7d32; margin: 0 0 10px 0; font-size: 18px;">🎁 Nagroda</h3>
            <p style="color: #1b5e20; margin: 0; font-size: 14px; line-height: 1.6;">
              Posadzka żywiczna o wartości <strong>5000 zł</strong><br>
              Możliwość realizacji w garażu, kotłowni lub pomieszczeniu mieszkalnym<br>
              Ważność nagrody: 6 miesięcy
            </p>
          </div>
          
          <p style="color: #555; font-size: 14px; margin-top: 25px; line-height: 1.6;">
            Powodzenia! 🎄🎁
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px;">
            <p style="margin: 5px 0;">📧 Email: biuro@posadzkizywiczne.com</p>
            <p style="margin: 5px 0;">📞 Telefon: +48 507 384 619</p>
          </div>
        </div>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json()

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
      let existingEntryMessage =
        "Cześć, ten mail został już wykorzystany. Jeśli nie dotarł do Ciebie kod konkursowy, napisz do nas na biuro@posadzkizywiczne.com."
      try {
        await sendConfirmationEmail(email, name, existingEntry.code)
      } catch (emailError) {
        console.warn("Error sending email to existing entry:", emailError)
        existingEntryMessage =
          "Cześć, ten mail został już wykorzystany. Nie udało się ponownie wysłać wiadomości – jeśli nie dotarł do Ciebie kod, napisz do nas na biuro@posadzkizywiczne.com. Poniżej masz swój kod."
      }

      return NextResponse.json({
        success: true,
        code: existingEntry.code,
        message: existingEntryMessage,
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

    // Save locally as fallback
    try {
      const entries = await readEntries()
      entries.push(newEntry)
      await writeEntries(entries)
    } catch (localError) {
      console.error("Error writing local contest entry backup:", localError)
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
