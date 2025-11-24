import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Proszę podać imię i email" },
        { status: 400 }
      );
    }

    // Generate unique contest code
    const contestCode = crypto.randomBytes(4).toString("hex").toUpperCase();
    const timestamp = new Date().toISOString();

    // Configure email transporter
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email to participant
    const participantMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Twój kod do konkursu - ${contestCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Dziękujemy za udział w konkursie!</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              Cześć <strong>${name}</strong>!
            </p>
            
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              Dziękujemy za zgłoszenie się do konkursu. Twój kod uczestnictwa to:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border: 3px dashed #667eea; margin: 20px 0;">
              <p style="margin: 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Twój kod konkursowy</p>
              <p style="margin: 10px 0; color: #667eea; font-size: 32px; font-weight: bold; letter-spacing: 3px;">${contestCode}</p>
            </div>
            
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
              <h3 style="color: #065f46; margin-top: 0; font-size: 18px;">🏆 Do wygrania: 5 000 zł</h3>
              <p style="color: #065f46; margin: 0; font-size: 14px;">
                Voucher o wartości 5 000 zł na wykonanie posadzki żywicznej w miejscu Twojego wyboru - garaż, kuchnia, balkon lub taras.
              </p>
            </div>
            
            <div style="background: #fff7ed; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <h3 style="color: #92400e; margin-top: 0; font-size: 18px;">📅 Ważne informacje</h3>
              <p style="color: #92400e; margin: 5px 0; font-size: 14px;">
                <strong>Data losowania:</strong> 6 grudnia 2024
              </p>
              <p style="color: #92400e; margin: 5px 0; font-size: 14px;">
                <strong>Gdzie:</strong> Na żywo na naszym profilu Instagram
              </p>
              <p style="color: #92400e; margin: 5px 0; font-size: 14px;">
                <strong>Wyniki:</strong> Zostaną opublikowane na stronie konkurs oraz na Instagramie
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">
                Śledź nas na Instagram, aby nie przegapić losowania!
              </p>
              <a href="https://www.instagram.com/posadzkizywiczne/" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Obserwuj nas na Instagram
              </a>
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; text-align: center;">
            <p style="margin: 5px 0;">W razie pytań prosimy o kontakt:</p>
            <p style="margin: 5px 0;">📧 <a href="mailto:biuro@posadzkizywiczne.com" style="color: #667eea;">biuro@posadzkizywiczne.com</a></p>
            <p style="margin: 5px 0;">📞 <a href="tel:+48507384619" style="color: #667eea;">+48 507 384 619</a></p>
          </div>
          
          <div style="margin-top: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
            <p>PosadzkiŻywiczne.com - Profesjonalne posadzki żywiczne</p>
          </div>
        </div>
      `,
    };

    // Send notification to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Nowe zgłoszenie do konkursu - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Nowe zgłoszenie do konkursu</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Dane uczestnika:</h3>
            <p><strong>Imię:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Kod konkursowy:</strong> <span style="font-size: 18px; color: #667eea; font-weight: bold;">${contestCode}</span></p>
            <p><strong>Data zgłoszenia:</strong> ${new Date(timestamp).toLocaleString('pl-PL')}</p>
          </div>
        </div>
      `,
    };

    // Send both emails
    await transporter.sendMail(participantMailOptions);
    await transporter.sendMail(adminMailOptions);

    return NextResponse.json({
      success: true,
      message: "Zgłoszenie zostało przyjęte. Sprawdź swoją skrzynkę email!",
    });
  } catch (error) {
    console.error("Błąd wysyłania emaila:", error);
    return NextResponse.json(
      { success: false, message: "Wystąpił błąd. Spróbuj ponownie później." },
      { status: 500 }
    );
  }
}
