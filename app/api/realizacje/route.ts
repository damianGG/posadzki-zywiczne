/**
 * Public API Route: /api/realizacje
 * 
 * Returns all realizacje from data/realizacje directory
 * This endpoint works at runtime to serve realizacje dynamically
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllRealizacje } from '@/lib/realizacje';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const realizacje = getAllRealizacje();
    
    return NextResponse.json({
      success: true,
      count: realizacje.length,
      realizacje,
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
