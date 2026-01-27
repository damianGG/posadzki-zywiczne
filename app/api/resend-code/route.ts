import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { type SupabaseClient, createClient } from "@supabase/supabase-js"

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"
const RECAPTCHA_SCORE_THRESHOLD = 0.5

function getSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey)
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
    subject: "Twój kod konkursowy – Noworoczny Konkurs Posadzki Żywiczne",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
           <h1 style="color: white; margin: 0; font-size: 28px;">🎆 Noworoczny Konkurs 🎆</h1>
           <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Posadzki Żywiczne</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Witaj ${name}!</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
             Wysyłamy ponownie Twój kod konkursowy zgodnie z Twoją prośbą.
          </p>
          
          <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
             <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Twój kod konkursowy (losowanie 30 stycznia 2026) to:</p>
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
             Powodzenia w noworocznym losowaniu! 🎆🎁
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
    const { email, recaptchaToken } = await request.json()

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

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Podaj prawidłowy adres email" },
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

    // Check if email exists in Supabase
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

    if (!existingEntry) {
      return NextResponse.json(
        {
          success: false,
          message: "Ten adres email nie jest zarejestrowany w konkursie.",
        },
        { status: 404 }
      )
    }

    // Send confirmation email
    try {
      await sendConfirmationEmail(email, existingEntry.name, existingEntry.code)
    } catch (emailError) {
      console.error("Error sending email:", emailError)
      return NextResponse.json(
        {
          success: false,
          message:
            "Nie udało się wysłać emaila. Spróbuj ponownie później lub skontaktuj się z nami: biuro@posadzkizywiczne.com",
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      code: existingEntry.code,
      message: "Email został wysłany ponownie na Twój adres!",
    })
  } catch (error) {
    console.error("Error in resend-code:", error)
    return NextResponse.json(
      { success: false, message: "Wystąpił błąd. Spróbuj ponownie później." },
      { status: 500 }
    )
  }
}
