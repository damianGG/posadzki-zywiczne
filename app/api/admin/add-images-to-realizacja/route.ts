/**
 * API Route: /api/admin/add-images-to-realizacja
 * 
 * Step 2: Add images to an existing draft realizacja
 * Updates the realizacja with Cloudinary image URLs
 */

import { NextRequest, NextResponse } from 'next/server';
import { updateRow } from '@/lib/db';

// Configure route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    // Parse JSON body
    const data = await request.json();
    
    // Validate required fields
    if (!data.slug) {
      return NextResponse.json(
        { error: 'Slug realizacji jest wymagany' },
        { status: 400 }
      );
    }

    if (!data.cloudinaryImages || data.cloudinaryImages.length === 0) {
      return NextResponse.json(
        { error: 'Dodaj co najmniej jedno zdjęcie' },
        { status: 400 }
      );
    }

    console.log(`Adding ${data.cloudinaryImages.length} images to realizacja: ${data.slug}`);

    // Prepare images data
    const mainImage = data.cloudinaryImages[0]?.url || '';
    const gallery = data.cloudinaryImages.map((img: any) => ({
      url: img.url,
      alt: img.alt || `${data.slug} - zdjęcie realizacji`,
    }));

    const updatedRealizacja = await updateRow('realizacje', 'slug', data.slug, {
      images: {
        main: mainImage,
        gallery: gallery,
      },
    });

    if (!updatedRealizacja) {
      throw new Error('Nie udało się zaktualizować realizacji: nie znaleziono wpisu');
    }

    console.log('✅ Successfully added images to realizacja');

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Zdjęcia zostały dodane pomyślnie! Realizacja jest gotowa.',
      slug: data.slug,
      images: gallery.map((img: any) => img.url),
      realizacja: updatedRealizacja,
    });

  } catch (error) {
    console.error('Error adding images to realizacja:', error);
    return NextResponse.json(
      { 
        error: 'Błąd podczas dodawania zdjęć',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
