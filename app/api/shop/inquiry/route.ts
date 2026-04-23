import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

import { getCartSummary, getRoomTypeLabel } from "@/lib/shop-engine"
import { getShopCatalog } from "@/lib/supabase-shop"
import type { ShopInquiryPayload } from "@/types/shop"

const formatCurrency = (value: number) => `${value.toFixed(2)} zł`

function isValidEmail(value: string) {
  const trimmed = value.trim()
  const atIndex = trimmed.indexOf("@")
  const lastDotIndex = trimmed.lastIndexOf(".")

  return atIndex > 0 && lastDotIndex > atIndex + 1 && lastDotIndex < trimmed.length - 1
}

function validatePayload(payload: Partial<ShopInquiryPayload>) {
  if (!payload.customerName || payload.customerName.trim().length < 2) {
    return "Podaj imię i nazwisko"
  }

  if (!payload.email || !isValidEmail(payload.email)) {
    return "Podaj poprawny adres email"
  }

  if (!payload.bundleId) {
    return "Wybierz zestaw"
  }

  if (!payload.roomType) {
    return "Wybierz typ pomieszczenia"
  }

  if (!payload.area || Number(payload.area) <= 0 || Number(payload.area) > 1000) {
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
    const customerName = payload.customerName.trim()
    const email = payload.email.trim()
    const phone = (payload.phone || "").trim()
    const notes = (payload.notes || "").trim()
    const roomTypeLabel = getRoomTypeLabel(payload.roomType)

    const addOnsText = summary.selectedAddOns.length
      ? summary.selectedAddOns.map((item) => `- ${item.product.name}: ${formatCurrency(item.total)}`).join("\n")
      : "- Brak dodatkowych produktów"

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: adminRecipient,
      replyTo: email,
      subject: `Nowe zapytanie sklepowe: ${summary.selectedBundle.name}`,
      text: [
        "Nowe zapytanie ze sklepu MVP",
        `Klient: ${customerName}`,
        `Email: ${email}`,
        `Telefon: ${phone || "-"}`,
        `Pomieszczenie: ${roomTypeLabel}`,
        `Metraż: ${Number(payload.area).toFixed(1)} m²`,
        `Zestaw: ${summary.selectedBundle.name} — ${formatCurrency(summary.selectedBundleTotal)}`,
        "",
        "Wybrane dodatki:",
        addOnsText,
        "",
        `Wartość orientacyjna: ${formatCurrency(summary.total)}`,
        `Uwagi klienta: ${notes || "Brak dodatkowych uwag."}`,
      ].join("\n"),
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Potwierdzenie zapytania: ${summary.selectedBundle.name}`,
      text: [
        `Dziękujemy za zapytanie dotyczące zestawu ${summary.selectedBundle.name}.`,
        `Pomieszczenie: ${roomTypeLabel}`,
        `Metraż: ${Number(payload.area).toFixed(1)} m²`,
        `Szacunkowa wartość: ${formatCurrency(summary.total)}`,
        "Skontaktujemy się, aby potwierdzić szczegóły i ustalić finalny zakres zamówienia.",
      ].join("\n"),
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
