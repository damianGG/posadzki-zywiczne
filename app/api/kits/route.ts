import { NextRequest, NextResponse } from 'next/server';
import { getProductKits } from '@/lib/db';

export async function GET() {
  try {
    const kits = await getProductKits();
    return NextResponse.json({ kits });
  } catch (error) {
    console.error('Error fetching product kits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product kits' },
      { status: 500 }
    );
  }
}
