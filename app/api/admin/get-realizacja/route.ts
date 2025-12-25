/**
 * API Route: /api/admin/get-realizacja
 * Gets a single realizacja for editing from Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRealizacjaBySlug } from '@/lib/supabase-realizacje';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Brak parametru slug' },
        { status: 400 }
      );
    }

    const result = await getRealizacjaBySlug(slug);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Realizacja nie znaleziona' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      realizacja: result.data,
    });

  } catch (error) {
    console.error('Error getting realizacja:', error);
    return NextResponse.json(
      {
        error: 'Błąd podczas pobierania realizacji',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
