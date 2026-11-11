import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { findLook, findPlace } from "@/lib/visual-offers";

export const dynamic = "force-dynamic";

const MAX_NOTE = 1000;

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function validEmail(value: string) {
  if (!value) return true;
  const parts = value.split("@");
  if (parts.length !== 2 || !parts[0] || parts[1].split(".").some((part) => !part)) return false;
  return !value.includes(" ");
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Nieczytelne zapytanie." }, { status: 400 });
  }

  if (clean(body.companyWebsite, 200)) {
    return NextResponse.json({ success: true });
  }

  const place = findPlace(clean(body.placeId, 20));
  const look = findLook(place, clean(body.lookId, 40));
  const name = clean(body.name, 80);
  const phone = clean(body.phone, 40);
  const email = clean(body.email, 120);
  const city = clean(body.city, 80);
  const note = typeof body.note === "string" ? body.note.trim().slice(0, MAX_NOTE) : "";
  const area = Number(body.area);
  const digits = phone.replace(/\D/g, "");

  if (!place || !look) {
    return NextResponse.json({ message: "Wybierz miejsce i wygląd jeszcze raz." }, { status: 400 });
  }
  if (name.length < 2) {
    return NextResponse.json({ message: "Podaj imię." }, { status: 400 });
  }
  if (digits.length < 9 || digits.length > 15) {
    return NextResponse.json({ message: "Podaj poprawny numer telefonu." }, { status: 400 });
  }
  if (!validEmail(email)) {
    return NextResponse.json({ message: "E-mail wygląda na niepełny." }, { status: 400 });
  }
  if (city.length < 2) {
    return NextResponse.json({ message: "Podaj miejscowość." }, { status: 400 });
  }
  if (!Number.isFinite(area) || area < 1 || area > 20000) {
    return NextResponse.json({ message: "Podaj metraż od 1 do 20 000 m²." }, { status: 400 });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return NextResponse.json(
      { message: "Wysyłka z formularza jest chwilowo niedostępna. Napisz maila albo zadzwoń." },
      { status: 503 },
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const lines = [
    "Nowe zapytanie ze strony — ścieżka ze zdjęciami",
    `Miejsce: ${place.title}`,
    `Wygląd: ${look.title}`,
    `Imię: ${name}`,
    `Telefon: ${phone}`,
    `E-mail: ${email || "-"}`,
    `Miejscowość: ${city}`,
    `Metraż: ${area} m²`,
    `Uwagi: ${note || "-"}`,
  ];

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      replyTo: email || undefined,
      subject: `Wycena: ${place.title} · ${look.title} · ${city} · ${area} m²`,
      text: lines.join("\n"),
    });
  } catch (error) {
    console.error("Quote email failed", error);
    return NextResponse.json({ message: "Nie udało się wysłać. Zadzwoń: 507 384 619." }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
