import { NextResponse } from "next/server";
import { getPublicCalculatorOptions } from "@/lib/public-calculator";

export const runtime = "nodejs";
export async function GET() {
  try {
    const options = await getPublicCalculatorOptions();
    return NextResponse.json(options, { headers: { "Cache-Control": "public, max-age=60" } });
  } catch {
    return NextResponse.json({ error: "Cennik jest obecnie niedostępny." }, { status: 503 });
  }
}
