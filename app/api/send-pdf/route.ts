import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

async function sendPDFEmail(email: string, pdfData: string, kosztorysData: any): Promise<void> {
  const transporter = nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  // Konwersja base64 PDF do buffera
  const pdfBuffer = Buffer.from(pdfData.split(",")[1], "base64")

  // Build recipient list - always include customer, optionally include admin
  const recipients = [email]
  if (process.env.ADMIN_EMAIL) {
    recipients.push(process.env.ADMIN_EMAIL)
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipients,
    subject: `Kosztorys posadzki żywicznej - ${kosztorysData.numer}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Kosztorys Posadzki Żywicznej</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Szczegóły zamówienia:</h3>
          <p><strong>Numer kosztorysu:</strong> ${kosztorysData.numer}</p>
          <p><strong>Data:</strong> ${kosztorysData.data}</p>
          <p><strong>Powierzchnia:</strong> ${kosztorysData.powierzchnia} m²</p>
          <p><strong>Rodzaj powierzchni:</strong> ${kosztorysData.rodzajPowierzchni}</p>
          <p><strong>Kolor:</strong> ${kosztorysData.kolor}</p>
          <p><strong>Koszt całkowity:</strong> <span style="color: #059669; font-size: 18px; font-weight: bold;">${kosztorysData.kosztCalkowity} zł</span></p>
        </div>

        <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
          <p style="margin: 0; color: #065f46;">
            <strong>Dziękujemy za zainteresowanie naszymi usługami!</strong><br>
            Szczegółowy kosztorys znajdziesz w załączniku PDF.
          </p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>W razie pytań prosimy o kontakt:</p>
          <p>📧 Email: biuro@posadzkizywiczne.com</p>
          <p>📞 Telefon: +48 507 384 619</p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `kosztorys-${kosztorysData.numer}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  }

  await transporter.sendMail(mailOptions)
}

export async function POST(request: NextRequest) {
  try {
    const { email, pdfData, kosztorysData } = await request.json()

    console.log("=== Email Send Request ===")
    console.log("Customer email:", email)
    console.log("PDF data length:", pdfData?.length || 0)
    console.log("Quote data:", kosztorysData)

    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email configuration missing. Set EMAIL_USER and EMAIL_PASS in .env")
      return NextResponse.json(
        { success: false, message: "Email nie jest skonfigurowany. Skontaktuj się z administratorem." },
        { status: 500 }
      )
    }

    // Validate input data
    if (!email || !pdfData || !kosztorysData) {
      console.error("Missing required data:", { hasEmail: !!email, hasPdfData: !!pdfData, hasKosztorysData: !!kosztorysData })
      return NextResponse.json(
        { success: false, message: "Brakujące dane wymagane do wysłania emaila" },
        { status: 400 }
      )
    }

    const recipients = process.env.ADMIN_EMAIL ? `${email} and ${process.env.ADMIN_EMAIL}` : email
    console.log("Sending email to:", recipients)

    // Send email using the same pattern as contest
    try {
      await sendPDFEmail(email, pdfData, kosztorysData)
    } catch (emailError) {
      console.error("Error sending email:", emailError)
      const errorMsg = emailError instanceof Error ? emailError.message : "Unknown error"
      return NextResponse.json(
        {
          success: false,
          message: `Błąd wysyłania emaila: ${errorMsg}. Sprawdź konfigurację EMAIL_USER i EMAIL_PASS w .env`,
        },
        { status: 500 }
      )
    }

    console.log(`Email sent successfully to: ${recipients}`)
    console.log("=== Email Send Complete ===")

    return NextResponse.json({ success: true, message: "Email wysłany pomyślnie" })
  } catch (error) {
    console.error("=== Email Send Error ===")
    console.error("Błąd wysyłania emaila:", error)
    
    const errorMessage = error instanceof Error ? error.message : "Nieznany błąd"
    console.error("Error message:", errorMessage)
    
    return NextResponse.json(
      {
        success: false,
        message: `Błąd wysyłania emaila: ${errorMessage}. Sprawdź konfigurację EMAIL_USER i EMAIL_PASS w .env`,
      },
      { status: 500 }
    )
  }
}
