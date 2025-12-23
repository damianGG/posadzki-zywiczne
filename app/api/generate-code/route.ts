import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import crypto from "crypto"
import { supabase, type ContestEntry } from "@/lib/supabase"

async function checkExistingEntry(email: string): Promise<ContestEntry | null> {
  const { data, error } = await supabase
    .from('contest_entries')
    .select('*')
    .eq('email', email)
    .single()
  
  if (error) {
    // No entry found or other error
    return null
  }
  
  return data
}

async function createEntry(entry: Omit<ContestEntry, 'id' | 'created_at'>): Promise<ContestEntry | null> {
  const { data, error } = await supabase
    .from('contest_entries')
    .insert([entry])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating entry:', error)
    return null
  }
  
  return data
}

async function updateEmailStatus(email: string, emailSent: boolean, emailOpened: boolean = false): Promise<void> {
  const { error } = await supabase
    .from('contest_entries')
    .update({ email_sent: emailSent, email_opened: emailOpened })
    .eq('email', email)
  
  if (error) {
    console.error('Error updating email status:', error)
  }
}

async function isCodeUnique(code: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('contest_entries')
    .select('code')
    .eq('code', code)
    .single()
  
  // If error and no data, code is unique
  return !data
}

function generateUniqueCode(): string {
  const randomString = crypto.randomBytes(4).toString("hex").toUpperCase()
  return `PXZ-${randomString}`
}

async function sendConfirmationEmail(email: string, name: string, code: string): Promise<boolean> {
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

  try {
    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Email sending error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json()

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

    // Check if email already exists
    const existingEntry = await checkExistingEntry(email)
    if (existingEntry) {
      // Resend email
      const emailSent = await sendConfirmationEmail(email, existingEntry.name, existingEntry.code)
      await updateEmailStatus(email, emailSent)
      
      return NextResponse.json({
        success: true,
        code: existingEntry.code,
        message: "Ten email był już użyty. Wysłaliśmy ponownie Twój kod.",
        alreadyExists: true,
      })
    }

    // Generate unique code
    let code = generateUniqueCode()
    // Ensure code is unique
    while (!(await isCodeUnique(code))) {
      code = generateUniqueCode()
    }

    // Create new entry in database
    const newEntry = await createEntry({
      email,
      name,
      code,
      timestamp: new Date().toISOString(),
      email_sent: false,
      email_opened: false,
    })

    if (!newEntry) {
      return NextResponse.json(
        { success: false, message: "Wystąpił błąd podczas zapisywania danych. Spróbuj ponownie." },
        { status: 500 }
      )
    }

    // Send confirmation email
    const emailSent = await sendConfirmationEmail(email, name, code)
    
    // Update email status
    await updateEmailStatus(email, emailSent)

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
