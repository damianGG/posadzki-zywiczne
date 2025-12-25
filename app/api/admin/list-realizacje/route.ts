/**
 * API Route: /api/admin/list-realizacje
 * 
 * Lists all realizacje from Supabase database
 */

import { NextRequest, NextResponse } from 'next/server';
import { listRealizacje } from '@/lib/supabase-realizacje';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;
    const projectType = searchParams.get('projectType') || undefined;

    const result = await listRealizacje({
      limit,
      offset,
      projectType,
      orderBy: 'created_at',
      orderDirection: 'desc',
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Błąd podczas pobierania listy realizacji',
          details: result.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      realizacje: result.data || [],
      count: result.count || 0,
    });

  } catch (error) {
    console.error('Error listing realizacje:', error);
    return NextResponse.json(
      {
        error: 'Błąd podczas pobierania listy realizacji',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
