import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

/**
 * Admin API endpoint to view contest entries
 * GET /api/contest-entries
 * 
 * Query parameters:
 * - limit: number of entries to return (default: 100)
 * - offset: offset for pagination (default: 0)
 * - orderBy: field to order by (default: created_at)
 * - order: asc or desc (default: desc)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const orderBy = searchParams.get('orderBy') || 'created_at'
    const order = searchParams.get('order') || 'desc'

    // Validate parameters
    if (limit < 1 || limit > 1000) {
      return NextResponse.json(
        { success: false, message: "Limit must be between 1 and 1000" },
        { status: 400 }
      )
    }

    if (offset < 0) {
      return NextResponse.json(
        { success: false, message: "Offset must be non-negative" },
        { status: 400 }
      )
    }

    // Get entries from database
    const { data, error, count } = await supabase
      .from('contest_entries')
      .select('*', { count: 'exact' })
      .order(orderBy, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching entries:', error)
      return NextResponse.json(
        { success: false, message: "Błąd podczas pobierania danych" },
        { status: 500 }
      )
    }

    // Get statistics
    const statsQuery = await supabase
      .from('contest_entries')
      .select('email_sent, email_opened')

    const stats = {
      total: count || 0,
      emailsSent: statsQuery.data?.filter(e => e.email_sent).length || 0,
      emailsOpened: statsQuery.data?.filter(e => e.email_opened).length || 0,
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      stats,
      pagination: {
        limit,
        offset,
        total: count || 0,
        hasMore: (offset + limit) < (count || 0)
      }
    })
  } catch (error) {
    console.error("Error in contest-entries:", error)
    return NextResponse.json(
      { success: false, message: "Wystąpił błąd. Spróbuj ponownie później." },
      { status: 500 }
    )
  }
}
