/**
 * API Route: /api/admin/add-images-to-realizacja
 * 
 * Step 2: Add images to an existing draft realizacja
 * Updates the realizacja with Cloudinary image URLs
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configure route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 30;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    // Update the realizacja in Supabase with images
    const { data: updatedRealizacja, error } = await supabase
      .from('realizacje')
      .update({
        images: {
          main: mainImage,
          gallery: gallery,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('slug', data.slug)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating realizacja with images:', error);
      throw new Error(`Nie udało się zaktualizować realizacji: ${error.message}`);
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
