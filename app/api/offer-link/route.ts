import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin, getSupabasePublic } from "@/lib/supabase-calculator"

// POST /api/offer-link - Create a new shareable offer link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { offerData, customerEmail, customerName, notes } = body

    if (!offerData) {
      return NextResponse.json(
        { success: false, message: "Brak danych oferty" },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json(
        { success: false, message: "Błąd konfiguracji bazy danych" },
        { status: 500 }
      )
    }

    // Generate a unique link ID using the database function
    const { data: linkData, error: linkError } = await supabase.rpc('generate_link_id')
    
    if (linkError) {
      console.error("Error generating link ID:", linkError)
      return NextResponse.json(
        { success: false, message: "Błąd generowania unikalnego ID" },
        { status: 500 }
      )
    }

    const linkId = linkData

    // Insert the offer link
    const { data: offerLink, error: insertError } = await supabase
      .from('offer_links')
      .insert({
        link_id: linkId,
        offer_data: offerData,
        customer_email: customerEmail,
        customer_name: customerName,
        notes: notes,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error inserting offer link:", insertError)
      return NextResponse.json(
        { success: false, message: "Błąd zapisywania linku oferty" },
        { status: 500 }
      )
    }

    // Generate the full URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
    
    if (!baseUrl) {
      console.error("Base URL not configured. Set NEXT_PUBLIC_BASE_URL or deploy on Vercel")
      return NextResponse.json(
        { success: false, message: "Konfiguracja URL nie jest dostępna" },
        { status: 500 }
      )
    }
    
    const shareableUrl = `${baseUrl}/oferta/${linkId}`

    return NextResponse.json({
      success: true,
      linkId,
      url: shareableUrl,
      offerLink,
    })
  } catch (error) {
    console.error("Error creating offer link:", error)
    return NextResponse.json(
      { success: false, message: "Błąd tworzenia linku oferty" },
      { status: 500 }
    )
  }
}

// GET /api/offer-link?linkId=xxx - Get an offer by link ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const linkId = searchParams.get('linkId')

    if (!linkId) {
      return NextResponse.json(
        { success: false, message: "Brak ID linku" },
        { status: 400 }
      )
    }

    const supabase = getSupabasePublic()
    if (!supabase) {
      return NextResponse.json(
        { success: false, message: "Błąd konfiguracji bazy danych" },
        { status: 500 }
      )
    }

    // Get the offer link
    const { data: offerLink, error: fetchError } = await supabase
      .from('offer_links')
      .select('*')
      .eq('link_id', linkId)
      .eq('is_active', true)
      .single()

    if (fetchError || !offerLink) {
      return NextResponse.json(
        { success: false, message: "Link nie został znaleziony lub wygasł" },
        { status: 404 }
      )
    }

    // Track the visit (async, don't wait for response)
    trackVisit(linkId, request).catch(err => {
      console.error("Error tracking visit:", err)
    })

    return NextResponse.json({
      success: true,
      offerLink,
    })
  } catch (error) {
    console.error("Error fetching offer link:", error)
    return NextResponse.json(
      { success: false, message: "Błąd pobierania oferty" },
      { status: 500 }
    )
  }
}

// Helper function to track visits
async function trackVisit(linkId: string, request: NextRequest) {
  const supabase = getSupabasePublic()
  if (!supabase) return

  // Get tracking metadata
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  
  // Extract first IP from x-forwarded-for if present (client's original IP)
  let ip = 'unknown'
  if (forwardedFor) {
    ip = forwardedFor.split(',')[0].trim()
  } else if (realIp) {
    ip = realIp
  }
  
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const referrer = request.headers.get('referer') || request.headers.get('referrer') || null

  // Insert visit record with error logging
  try {
    const { error } = await supabase
      .from('offer_visits')
      .insert({
        link_id: linkId,
        ip_address: ip,
        user_agent: userAgent,
        referrer: referrer,
      })
    
    if (error) {
      console.error('Failed to track visit:', error.message)
    }
  } catch (err) {
    console.error('Error tracking visit:', err)
  }
}
