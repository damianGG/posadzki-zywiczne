/**
 * API Route: /api/scan-realizacje
 * 
 * Endpoint do skanowania lokalnych folderów realizacji
 * i tworzenia/aktualizacji plików JSON
 */

import { NextRequest, NextResponse } from 'next/server';
import { scanAllRealizacje, findOrphanedRealizacje } from '@/lib/local-realizacje-scanner';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Rozpoczęcie skanowania realizacji...');

    // Skanuj wszystkie foldery
    const results = await scanAllRealizacje();

    // Znajdź osierocone realizacje
    const orphaned = findOrphanedRealizacje();

    // Przygotuj statystyki
    const stats = {
      total: results.length,
      new: results.filter(r => r.status === 'new').length,
      updated: results.filter(r => r.status === 'updated').length,
      unchanged: results.filter(r => r.status === 'unchanged').length,
      errors: results.filter(r => r.status === 'error').length,
      orphaned: orphaned.length,
    };

    // Pobierz szczegóły
    const details = {
      new: results.filter(r => r.status === 'new').map(r => ({
        slug: r.slug,
        folderName: r.folderName,
        title: r.realizacja?.title,
      })),
      updated: results.filter(r => r.status === 'updated').map(r => ({
        slug: r.slug,
        folderName: r.folderName,
        title: r.realizacja?.title,
      })),
      errors: results.filter(r => r.status === 'error').map(r => ({
        folderName: r.folderName,
        message: r.message,
      })),
      orphaned,
    };

    return NextResponse.json({
      success: true,
      message: 'Skanowanie zakończone pomyślnie',
      stats,
      details,
    });

  } catch (error) {
    console.error('Błąd podczas skanowania realizacji:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Błąd serwera podczas skanowania realizacji',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Użyj metody POST aby uruchomić skanowanie realizacji',
    info: 'Endpoint skanuje foldery w public/realizacje/ i tworzy/aktualizuje pliki JSON w data/realizacje/',
  });
}
