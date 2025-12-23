import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import crypto from "crypto"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
let supabaseClient: SupabaseClient | null = null
const MAX_CODE_GENERATION_ATTEMPTS = 5
// PostgreSQL error code for unique constraint violations
const POSTGRES_UNIQUE_VIOLATION_CODE = "23505"

function generateUniqueCode(): string {
  const randomString = crypto.randomBytes(4).toString("hex").toUpperCase()
  return `PXZ-${randomString}`
}

function getSupabase(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return null
  }

  supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  return supabaseClient
}

async function ensureSupabaseConnection(client: SupabaseClient) {
  const { error } = await client.from("contest_entries").select("code", { head: true }).limit(1)
  if (error) {
    return {
      ok: false as const,
      message: `Brak połączenia z bazą danych Supabase: ${error.message}`,
    }
  }
  return { ok: true as const }
}

async function sendConfirmationEmail(email: string, name: string, code: string): Promise<void> {
  const transporter = nodemailer.createTransporter({
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
    const supabase = getSupabase()

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

    if (!supabase) {
      return NextResponse.json(
        { success: false, message: "Supabase nie jest skonfigurowany (brak SUPABASE_URL lub SUPABASE_SERVICE_ROLE_KEY)." },
        { status: 500 }
      )
    }

    const connectionStatus = await ensureSupabaseConnection(supabase)
    if (!connectionStatus.ok) {
      return NextResponse.json({ success: false, message: connectionStatus.message }, { status: 500 })
    }

    // Check if email already exists
    const { data: existingEntry, error: existingError } = await supabase
      .from("contest_entries")
      .select("code")
      .eq("email", email)
      .maybeSingle()

    if (existingError) {
      console.error("Error checking existing entry:", existingError)
      return NextResponse.json(
        { success: false, message: "Błąd podczas sprawdzania istniejącego wpisu w bazie danych." },
        { status: 500 }
      )
    }

    if (existingEntry) {
      return NextResponse.json({
        success: true,
        code: existingEntry.code,
        message: "Ten email był już użyty. Twój kod pozostaje bez zmian.",
        alreadyExists: true,
      })
    }

    let code = ""
    let entrySaved = false
    let lastInsertErrorMessage: string | null = null
    for (let attempt = 0; attempt < MAX_CODE_GENERATION_ATTEMPTS; attempt++) {
      code = generateUniqueCode()
      const { error: insertError } = await supabase.from("contest_entries").insert({
        email,
        name,
        code,
      })

      if (!insertError) {
        entrySaved = true
        break
      }

      if (insertError.code === POSTGRES_UNIQUE_VIOLATION_CODE) {
        const { data: racedEntry } = await supabase
          .from("contest_entries")
          .select("code")
          .eq("email", email)
          .maybeSingle()

        if (racedEntry) {
          return NextResponse.json({
            success: true,
            code: racedEntry.code,
            message: "Ten email był już użyty. Twój kod pozostaje bez zmian.",
            alreadyExists: true,
          })
        }

        // Unique constraint triggered by code collision - try again with a new code
        continue
      }

      lastInsertErrorMessage = insertError.message
      break
    }

    if (!entrySaved) {
      if (lastInsertErrorMessage) {
        console.error("Error saving contest entry to Supabase:", lastInsertErrorMessage)
        return NextResponse.json(
          { success: false, message: "Nie udało się zapisać zgłoszenia w bazie danych. Spróbuj ponownie później." },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { success: false, message: "Nie udało się wygenerować unikalnego kodu. Spróbuj ponownie później." },
        { status: 500 }
      )
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
