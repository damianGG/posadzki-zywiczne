import { NextRequest, NextResponse } from "next/server";
import { CalculatorInputError, createPublicEstimate } from "@/lib/public-calculator";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    const raw = await request.text();
    if (raw.length > 8192) return NextResponse.json({ error: "Zbyt duże żądanie." }, { status: 413 });
    const data = JSON.parse(raw);
    const estimate = await createPublicEstimate(data);
    return NextResponse.json(estimate, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof CalculatorInputError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    if (error instanceof SyntaxError) return NextResponse.json({ error: "Nieprawidłowy JSON." }, { status: 400 });
    return NextResponse.json({ error: "Kalkulator jest chwilowo niedostępny." }, { status: 503 });
  }
}
