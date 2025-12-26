/**
 * Public API Route: /api/realizacje
 * 
 * Returns all realizacje from Supabase database
 * This endpoint works at runtime to serve realizacje dynamically
 */

import { NextRequest, NextResponse } from 'next/server';
import { listRealizacje } from '@/lib/supabase-realizacje';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const projectType = searchParams.get('projectType') || undefined;

    const result = await listRealizacje({
      limit,
      projectType,
      orderBy: 'created_at',
      orderDirection: 'desc',
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to load realizacje from database',
          details: result.error,
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      count: result.count || 0,
      realizacje: result.data || [],
    });
  } catch (error) {
    console.error('Error fetching realizacje:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load realizacje',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
