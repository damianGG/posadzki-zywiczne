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
  const attachments: Array<{filename: string; content: Buffer; contentType: string}> = [];
  try {
    const size = Number(request.headers.get("content-length") ?? 0);
    if (size > 4 * 1024 * 1024) return NextResponse.json({message: "Zapytanie jest za duże."}, {status: 413});
    if (request.headers.get("content-type")?.includes("multipart/form-data")) {
      const form = await request.formData();
      body = JSON.parse(String(form.get("payload") ?? "{}"));
      const files = form.getAll("photos");
      if (files.length > 3 || files.some(file => typeof file === "string") || files.reduce((sum, file) => sum + (typeof file === "string" ? 0 : file.size), 0) > 3 * 1024 * 1024) {
        return NextResponse.json({message: "Dodaj maksymalnie 3 zdjęcia, łącznie do 3 MB."}, {status: 400});
      }
      for (const file of files) {
        if (typeof file === "string") continue;
        const content = Buffer.from(await file.arrayBuffer());
        const ext = content[0] === 0xff && content[1] === 0xd8 && content[2] === 0xff ? "jpg" :
          content.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? "png" :
          content.toString("ascii",0,4) === "RIFF" && content.toString("ascii",8,12) === "WEBP" ? "webp" : null;
        if (!ext) return NextResponse.json({message: "Dozwolone są zdjęcia JPG, PNG i WebP."}, {status: 400});
        attachments.push({filename: "podloze-" + (attachments.length + 1) + "." + ext, content, contentType: ext === "jpg" ? "image/jpeg" : "image/" + ext});
      }
    } else {
      body = await request.json();
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("invalid body");
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
      attachments,
    });
  } catch (error) {
    console.error("Quote email failed", error);
    return NextResponse.json({ message: "Nie udało się wysłać. Zadzwoń: 507 384 619." }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
