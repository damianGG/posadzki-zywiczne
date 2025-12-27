/**
 * API Route: /api/admin/create-draft-realizacja
 * 
 * Step 1: Create draft realizacja with AI-generated content (without images)
 * Returns the slug/folder name to be used for Cloudinary uploads
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRealizacja, RealizacjaData } from '@/lib/supabase-realizacje';

// Configure route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 30;

// Helper function to generate slug from title
function generateSlugFromTitle(title: string): string {
  const polishChars: Record<string, string> = {
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
    'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
    'Ą': 'a', 'Ć': 'c', 'Ę': 'e', 'Ł': 'l', 'Ń': 'n',
    'Ó': 'o', 'Ś': 's', 'Ź': 'z', 'Ż': 'z'
  };

  return title
    .toLowerCase()
    .split('')
    .map(char => polishChars[char] || char)
    .join('')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60);
}

// Helper function to determine folder type from category
function getFolderTypeFromCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'domy-mieszkania': 'mieszkanie',
    'balkony-tarasy': 'taras',
    'garaze': 'garaz',
    'kuchnie': 'kuchnia',
    'pomieszczenia-czyste': 'gastronomia',
    'schody': 'schody',
  };
  return categoryMap[category] || 'mieszkanie';
}

// Sanitize location string
function sanitizeString(str: string): string {
  const polishChars: Record<string, string> = {
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
    'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
    'Ą': 'a', 'Ć': 'c', 'Ę': 'e', 'Ł': 'l', 'Ń': 'n',
    'Ó': 'o', 'Ś': 's', 'Ź': 'z', 'Ż': 'z'
  };
  return str
    .split('')
    .map(char => polishChars[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function POST(request: NextRequest) {
  try {
    // Parse JSON body
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.description) {
      return NextResponse.json(
        { error: 'Tytuł i opis są wymagane' },
        { status: 400 }
      );
    }

    // Generate slug and folder name
    const baseSlug = generateSlugFromTitle(data.title);
    const folderType = getFolderTypeFromCategory(data.category);
    const location = data.location 
      ? sanitizeString(data.location.split(',')[0]) 
      : 'polska';
    
    // Create folder name: [miasto]-[slug]-[typ]
    const folderName = `${location}-${baseSlug}-${folderType}`;
    const cloudinaryFolder = `realizacje/${folderName}`;
    
    console.log(`Creating draft realizacja with slug: ${folderName}`);

    // Parse tags (comma-separated)
    const tags = data.tags
      ? data.tags
          .split(',')
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag.length > 0)
      : [];

    // Parse features (line-separated)
    const features = data.features
      ? data.features
          .split('\n')
          .map((feature: string) => feature.trim())
          .filter((feature: string) => feature.length > 0)
      : [];

    // Parse keywords (line-separated)
    const keywords = data.keywords
      ? data.keywords
          .split('\n')
          .map((keyword: string) => keyword.trim())
          .filter((keyword: string) => keyword.length > 0)
      : [];

    // Parse benefits (line-separated)
    const benefits = data.benefits
      ? data.benefits
          .split('\n')
          .map((benefit: string) => benefit.trim())
          .filter((benefit: string) => benefit.length > 0)
      : features;

    // Parse FAQ if provided
    let faq: Array<{ question: string; answer: string }> = [];
    if (data.faq) {
      try {
        if (Array.isArray(data.faq)) {
          faq = data.faq;
        } else if (typeof data.faq === 'string' && data.faq.trim()) {
          faq = JSON.parse(data.faq);
        }
      } catch (parseError) {
        console.warn('Could not parse FAQ, using empty array:', parseError);
        faq = [];
      }
    }

    // Parse content sections if provided
    let content: any = undefined;
    if (data.content) {
      try {
        if (typeof data.content === 'object') {
          content = data.content;
        } else if (typeof data.content === 'string' && data.content.trim()) {
          content = JSON.parse(data.content);
        }
      } catch (parseError) {
        console.warn('Could not parse content sections, using undefined:', parseError);
        content = undefined;
      }
    }

    // Create realizacja data for Supabase (WITHOUT images - they'll be added in Step 2)
    const realizacjaData: RealizacjaData = {
      slug: folderName,
      title: data.title,
      h1: data.h1 || undefined,
      description: data.description,
      short_description: data.shortDescription || data.description.substring(0, 160),
      location: data.location || '',
      surface_area: data.area || '',
      project_type: folderType,
      technology: data.technology || '',
      color: data.color || '',
      duration: data.duration || '',
      keywords,
      tags,
      features,
      benefits,
      meta_description: data.metaDescription || data.description.substring(0, 160),
      og_title: data.ogTitle || data.title,
      og_description: data.ogDescription || data.description.substring(0, 200),
      images: {
        main: '', // Empty - will be filled in Step 2
        gallery: [], // Empty - will be filled in Step 2
      },
      faq,
      content,
      cloudinary_folder: cloudinaryFolder,
    };

    // Save draft to Supabase database
    console.log('Saving draft realizacja to Supabase...');
    const supabaseResult = await createRealizacja(realizacjaData);
    
    if (!supabaseResult.success) {
      console.error('❌ Error saving draft to Supabase:', supabaseResult.error);
      throw new Error(`Nie udało się zapisać draftu: ${supabaseResult.error}`);
    }

    console.log('✅ Successfully saved draft realizacja to Supabase');

    // Return success with slug and folder info
    return NextResponse.json({
      success: true,
      message: 'Draft realizacji utworzony! Teraz możesz dodać zdjęcia.',
      slug: folderName,
      cloudinaryFolder: cloudinaryFolder,
      realizacja: supabaseResult.data,
    });

  } catch (error) {
    console.error('Error creating draft realizacja:', error);
    return NextResponse.json(
      { 
        error: 'Błąd podczas tworzenia draftu realizacji',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
