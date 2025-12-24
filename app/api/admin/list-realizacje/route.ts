/**
 * API Route: /api/admin/list-realizacje
 * 
 * Lists all realizacje from data/realizacje/ directory
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const realizacjeDir = path.join(process.cwd(), 'data/realizacje');
    
    // Check if directory exists
    if (!fs.existsSync(realizacjeDir)) {
      return NextResponse.json({
        realizacje: [],
        message: 'Brak katalogu z realizacjami',
      });
    }

    // Read all JSON files
    const files = fs.readdirSync(realizacjeDir).filter(file => file.endsWith('.json') && file !== 'README.md');
    
    const realizacje = files.map(file => {
      const filePath = path.join(realizacjeDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent);
    });

    // Sort by date (newest first)
    realizacje.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json({
      success: true,
      realizacje,
      count: realizacje.length,
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
