import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

import { getCartSummary, getRoomTypeLabel } from "@/lib/shop-engine"
import { getShopCatalog } from "@/lib/supabase-shop"
import { ShopInquiryPayload } from "@/types/shop"

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")

const formatCurrency = (value: number) => `${value.toFixed(2)} zł`

function validatePayload(payload: Partial<ShopInquiryPayload>) {
  if (!payload.customerName || payload.customerName.trim().length < 2) {
    return "Podaj imię i nazwisko"
  }

  if (!payload.email || !/^\S+@\S+\.\S+$/.test(payload.email)) {
    return "Podaj poprawny adres email"
  }

  if (!payload.bundleId) {
    return "Wybierz zestaw"
  }

  if (!payload.roomType) {
    return "Wybierz typ pomieszczenia"
  }

  if (!payload.area || Number(payload.area) <= 0) {
    return "Podaj poprawny metraż"
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as ShopInquiryPayload
    const validationError = validatePayload(payload)

    if (validationError) {
      return NextResponse.json({ success: false, message: validationError }, { status: 400 })
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { success: false, message: "Email nie jest skonfigurowany po stronie serwera." },
        { status: 500 }
      )
    }

    const catalog = await getShopCatalog()
    const summary = getCartSummary(
      catalog,
      payload.roomType,
      Number(payload.area),
      payload.bundleId,
      payload.addOnProductIds ?? []
    )

    if (!summary.selectedBundle) {
      return NextResponse.json({ success: false, message: "Nie znaleziono wybranego zestawu." }, { status: 404 })
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const adminRecipient = process.env.ADMIN_EMAIL || process.env.EMAIL_USER
    const customerName = escapeHtml(payload.customerName.trim())
    const email = escapeHtml(payload.email.trim())
    const phone = escapeHtml((payload.phone || "").trim())
    const notes = escapeHtml((payload.notes || "").trim())
    const roomTypeLabel = getRoomTypeLabel(payload.roomType)

    const addOnsMarkup = summary.selectedAddOns.length
      ? `<ul>${summary.selectedAddOns
          .map(
            (item) => `<li>${escapeHtml(item.product.name)} — ${formatCurrency(item.total)}</li>`
          )
          .join("")}</ul>`
      : "<p>Brak dodatkowych produktów.</p>"

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: adminRecipient,
      replyTo: payload.email,
      subject: `Nowe zapytanie sklepowe: ${summary.selectedBundle.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto;">
          <h2>Nowe zapytanie ze sklepu MVP</h2>
          <p><strong>Klient:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone || "—"}</p>
          <p><strong>Pomieszczenie:</strong> ${roomTypeLabel}</p>
          <p><strong>Metraż:</strong> ${Number(payload.area).toFixed(1)} m²</p>
          <p><strong>Zestaw:</strong> ${escapeHtml(summary.selectedBundle.name)} — ${formatCurrency(summary.selectedBundleTotal)}</p>
          <h3>Polecane dodatki wybrane przez klienta</h3>
          ${addOnsMarkup}
          <p><strong>Wartość orientacyjna:</strong> ${formatCurrency(summary.total)}</p>
          <h3>Notatka klienta</h3>
          <p>${notes || "Brak dodatkowych uwag."}</p>
        </div>
      `,
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: payload.email,
      subject: `Potwierdzenie zapytania: ${summary.selectedBundle.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto;">
          <h2>Dziękujemy za zapytanie</h2>
          <p>Otrzymaliśmy Twoje zgłoszenie dotyczące zestawu <strong>${escapeHtml(summary.selectedBundle.name)}</strong>.</p>
          <p><strong>Pomieszczenie:</strong> ${roomTypeLabel}</p>
          <p><strong>Metraż:</strong> ${Number(payload.area).toFixed(1)} m²</p>
          <p><strong>Szacunkowa wartość:</strong> ${formatCurrency(summary.total)}</p>
          <p>Skontaktujemy się, aby potwierdzić szczegóły i ustalić finalny zakres zamówienia.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true, message: "Zapytanie zostało wysłane." })
  } catch (error) {
    console.error("Error sending shop inquiry", error)
    return NextResponse.json(
      { success: false, message: "Nie udało się wysłać zapytania. Spróbuj ponownie później." },
      { status: 500 }
    )
  }
}
