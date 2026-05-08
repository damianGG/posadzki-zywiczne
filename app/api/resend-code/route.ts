import { type NextRequest, NextResponse } from "next/server"
import {
  getSupabaseClient,
  sendConfirmationEmail,
  RECAPTCHA_VERIFY_URL,
  RECAPTCHA_SCORE_THRESHOLD,
} from "@/lib/contest/utils"

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
      await sendConfirmationEmail(email, existingEntry.name, existingEntry.code, true)
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
