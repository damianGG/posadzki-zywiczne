import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

/**
 * Export contest entries to CSV
 * GET /api/contest-entries/export
 */
export async function GET(request: NextRequest) {
  try {
    // Get all entries from database
    const { data, error } = await supabase
      .from('contest_entries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching entries:', error)
      return NextResponse.json(
        { success: false, message: "Błąd podczas pobierania danych" },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, message: "Brak danych do wyeksportowania" },
        { status: 404 }
      )
    }

    // Convert to CSV
    const headers = ['ID', 'Email', 'Name', 'Code', 'Timestamp', 'Email Sent', 'Email Opened', 'Created At']
    const csvRows = [headers.join(',')]

    for (const entry of data) {
      const row = [
        entry.id,
        `"${entry.email}"`, // Quote email to handle commas
        `"${entry.name}"`,   // Quote name to handle commas
        entry.code,
        entry.timestamp,
        entry.email_sent ? 'Yes' : 'No',
        entry.email_opened ? 'Yes' : 'No',
        entry.created_at
      ]
      csvRows.push(row.join(','))
    }

    const csv = csvRows.join('\n')

    // Return CSV file
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="contest-entries-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error in contest-entries/export:", error)
    return NextResponse.json(
      { success: false, message: "Wystąpił błąd. Spróbuj ponownie później." },
      { status: 500 }
    )
  }
}
