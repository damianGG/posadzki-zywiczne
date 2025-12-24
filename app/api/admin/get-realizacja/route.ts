/**
 * API Route: /api/admin/get-realizacja
 * Gets a single realizacja for editing
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

    const dataPath = path.join(process.cwd(), 'data/realizacje', `${slug}.json`);
    
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json(
        { error: 'Realizacja nie istnieje' },
        { status: 404 }
      );
    }

    const realizacja = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Also check for local opis.json with Cloudinary info
    const opisPath = path.join(process.cwd(), 'public/realizacje', slug, 'opis.json');
    if (fs.existsSync(opisPath)) {
      const opisData = JSON.parse(fs.readFileSync(opisPath, 'utf-8'));
      realizacja.cloudinary = opisData.cloudinary;
    }

    return NextResponse.json({
      success: true,
      realizacja,
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
