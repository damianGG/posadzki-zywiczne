import { NextRequest, NextResponse } from "next/server";
import { CalculatorInputError, createPublicEstimate, getPublicCalculatorOptions } from "@/lib/public-calculator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Anonymous, read-only, stateless MCP Streamable HTTP endpoint.
 * Compatible with JSON responses over POST (2026-07-28 protocol).
 * No lead creation, email sending, discount codes or private admin data.
 */
const VERSION = "2026-07-28";
const tools = [
  {
    name: "get_floor_calculator_options",
    title: "Dostępne posadzki i aktualny cennik",
    description: "Odczytaj aktywne opcje kalkulatora posadzek żywicznych (typ pomieszczenia, powierzchnia, kolor, stan podłoża, usługi). Użyj przed kalkulacją, aby poznać identyfikatory.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
  {
    name: "calculate_resin_floor_estimate",
    title: "Oblicz orientacyjną wycenę posadzki żywicznej",
    description: "Oblicz niewiążącą wycenę na podstawie AKTUALNEGO cennika. Najpierw pobierz opcje. Przy nieznanym obwodzie zwraca część znanej sumy i brakujące dane, a nie zaniżoną cenę całkowitą. Bez VAT i rabatów.",
    inputSchema: {
      type: "object",
      properties: {
        area_m2: { type: "number", minimum: 1, maximum: 2500, description: "Powierzchnia posadzki m²" },
        perimeter_m: { type: "number", exclusiveMinimum: 0, maximum: 1000, description: "Obwód w metrach bieżących; potrzebny do cokołów i uszczelnień" },
        room_id: { type: "string", description: "ID pomieszczenia z get_floor_calculator_options" },
        surface_id: { type: "string", description: "ID rodzaju powierzchni z get_floor_calculator_options" },
        color_id: { type: "string", description: "ID koloru z get_floor_calculator_options" },
        concrete_state_id: { type: "string", description: "ID stanu podłoża dla garażu, jeśli wymagane" },
        service_ids: { type: "array", maxItems: 30, items: { type: "string" }, description: "Opcjonalne usługi; obowiązkowe zawsze zostaną doliczone" },
      },
      required: ["area_m2", "room_id", "surface_id", "color_id"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
];

function jsonRpc(id: number | string | null, result?: unknown, error?: { code: number; message: string }) {
  return NextResponse.json({
    jsonrpc: "2.0", id,
    ...(error ? { error } : { result }),
  }, { headers: { "Cache-Control": "no-store" } });
}

function allowedOrigin(origin: string | null, requestUrl: string) {
  if (!origin) return true;
  try {
    const u = new URL(origin);
    if (u.protocol !== "https:") return false;
    const allowed = ["chatgpt.com", "chat.openai.com", "www.posadzkizywiczne.com", "posadzkizywiczne.com"];
    if (allowed.includes(u.hostname)) return true;
    const currentHost = new URL(requestUrl).hostname;
    return u.hostname === currentHost && currentHost.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!allowedOrigin(request.headers.get("origin"), request.url)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Content-Type application/json required" }, { status: 415 });
  }
  const accepts = request.headers.get("accept") || "";
  if (!accepts.includes("application/json") || !accepts.includes("text/event-stream")) {
    return NextResponse.json({ error: "Accept must include application/json and text/event-stream" }, { status: 406 });
  }

  let message: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 8192) return NextResponse.json({ error: "Request too large" }, { status: 413 });
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) ||
        parsed.jsonrpc !== "2.0" || typeof parsed.method !== "string") {
      return jsonRpc(null, undefined, { code: -32600, message: "Invalid JSON-RPC request" });
    }
    message = parsed;
  } catch {
    return jsonRpc(null, undefined, { code: -32700, message: "Parse error" });
  }
  if (message.id === undefined) return new Response(null, { status: 202 });
  const id = typeof message.id === "string" || typeof message.id === "number" ? message.id : null;
  const params = (message.params && typeof message.params === "object" && !Array.isArray(message.params))
    ? message.params as Record<string, unknown> : {};
  try {
    if (message.method === "initialize") {
      const requested = typeof params.protocolVersion === "string" ? params.protocolVersion : VERSION;
      return jsonRpc(id, {
        protocolVersion: ["2026-07-28", "2025-11-25"].includes(requested) ? requested : VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "posadzki-zywiczne-calculator", version: "1.0.0" },
      });
    }
    if (message.method === "ping") return jsonRpc(id, {});
    if (message.method === "tools/list") return jsonRpc(id, { tools });
    if (message.method === "tools/call") {
      const name = params.name;
      const args = params.arguments ?? {};
      if (name !== "get_floor_calculator_options" && name !== "calculate_resin_floor_estimate") {
        return jsonRpc(id, undefined, { code: -32602, message: "Unknown tool" });
      }
      try {
        const data = name === "get_floor_calculator_options"
          ? await getPublicCalculatorOptions()
          : await createPublicEstimate(args);
        return jsonRpc(id, {
          content: [{ type: "text", text: JSON.stringify(data) }],
          structuredContent: data,
          isError: false,
        });
      } catch (error) {
        const msg = error instanceof CalculatorInputError ? error.message : "Kalkulator chwilowo niedostępny.";
        return jsonRpc(id, {
          content: [{ type: "text", text: msg }], isError: true,
        });
      }
    }
    return jsonRpc(id, undefined, { code: -32601, message: "Method not found" });
  } catch {
    return jsonRpc(id, undefined, { code: -32603, message: "Internal error" });
  }
}

export async function GET() { return new Response(null, { status: 405, headers: { Allow: "POST" } }); }
export async function DELETE() { return new Response(null, { status: 405, headers: { Allow: "POST" } }); }
