/**
 * API Route: /api/revalidate
 * 
 * Endpoint do wywoływania revalidation dla Next.js ISR
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json(
        { error: 'Brak parametru path' },
        { status: 400 }
      );
    }

    // Wywołaj revalidation dla podanej ścieżki
    revalidatePath(path);
    
    // Dodatkowo revaliduj stronę główną realizacji
    if (path.startsWith('/realizacje/')) {
      revalidatePath('/realizacje');
    }

    console.log(`✓ Revalidation wywołany dla: ${path}`);

    return NextResponse.json({
      success: true,
      message: `Revalidation dla ${path} zakończony`,
      revalidated: true,
      now: Date.now(),
    });
  } catch (error) {
    console.error('Błąd podczas revalidation:', error);
    return NextResponse.json(
      { error: 'Błąd serwera podczas revalidation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Metoda GET nie jest wspierana. Użyj POST.' },
    { status: 405 }
  );
}
