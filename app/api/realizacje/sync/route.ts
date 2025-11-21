/**
 * API Route: /api/realizacje/sync
 * 
 * Endpoint do zapisywania/aktualizacji danych realizacji z Google Drive
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Realizacja } from '@/types/realizacje';

export async function POST(request: NextRequest) {
  try {
    const realizacjaData = await request.json() as Partial<Realizacja>;

    // Walidacja wymaganych pól
    if (!realizacjaData.slug || !realizacjaData.title) {
      return NextResponse.json(
        { error: 'Brak wymaganych pól: slug i title' },
        { status: 400 }
      );
    }

    // Ścieżka do katalogu z realizacjami
    const realizacjeDir = path.join(process.cwd(), 'data/realizacje');

    // Upewnij się, że katalog istnieje
    if (!fs.existsSync(realizacjeDir)) {
      fs.mkdirSync(realizacjeDir, { recursive: true });
    }

    // Przygotuj kompletny obiekt realizacji z domyślnymi wartościami
    const fullRealizacja: Realizacja = {
      slug: realizacjaData.slug,
      title: realizacjaData.title,
      description: realizacjaData.description || '',
      category: realizacjaData.category || 'mieszkania-domy',
      type: realizacjaData.type || 'indywidualna',
      location: realizacjaData.location || '',
      date: realizacjaData.date || new Date().toISOString().split('T')[0],
      tags: realizacjaData.tags || [],
      images: realizacjaData.images || { main: '', gallery: [] },
      details: {
        surface: realizacjaData.details?.surface || '',
        system: realizacjaData.details?.system || '',
        color: realizacjaData.details?.color,
        duration: realizacjaData.details?.duration,
      },
      features: realizacjaData.features || [],
      keywords: realizacjaData.keywords || [],
      clientTestimonial: realizacjaData.clientTestimonial,
    };

    // Ścieżka do pliku
    const filePath = path.join(realizacjeDir, `${realizacjaData.slug}.json`);

    // Sprawdź czy plik już istnieje
    const isUpdate = fs.existsSync(filePath);

    // Zapisz plik JSON
    fs.writeFileSync(
      filePath,
      JSON.stringify(fullRealizacja, null, 2),
      'utf-8'
    );

    console.log(`✓ ${isUpdate ? 'Zaktualizowano' : 'Utworzono'} realizację: ${realizacjaData.slug}`);

    return NextResponse.json({
      success: true,
      message: `Realizacja ${isUpdate ? 'zaktualizowana' : 'utworzona'} pomyślnie`,
      slug: realizacjaData.slug,
      isUpdate,
    });
  } catch (error) {
    console.error('Błąd podczas zapisywania realizacji:', error);
    return NextResponse.json(
      { error: 'Błąd serwera podczas zapisywania realizacji' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const realizacjeDir = path.join(process.cwd(), 'data/realizacje');

    // Sprawdź czy katalog istnieje
    if (!fs.existsSync(realizacjeDir)) {
      return NextResponse.json({ realizacje: [] });
    }

    // Pobierz listę plików JSON
    const files = fs.readdirSync(realizacjeDir)
      .filter(file => file.endsWith('.json'));

    const realizacje = files.map(file => {
      const filePath = path.join(realizacjeDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as Realizacja;
    });

    return NextResponse.json({
      success: true,
      count: realizacje.length,
      realizacje,
    });
  } catch (error) {
    console.error('Błąd podczas pobierania realizacji:', error);
    return NextResponse.json(
      { error: 'Błąd serwera podczas pobierania realizacji' },
      { status: 500 }
    );
  }
}
