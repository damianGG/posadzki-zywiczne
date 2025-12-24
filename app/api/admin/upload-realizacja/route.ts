/**
 * API Route: /api/admin/upload-realizacja
 * 
 * Handles uploading new realizacja with images from mobile/web form
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { scanAllRealizacje } from '@/lib/local-realizacje-scanner';

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

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const formDataJson = formData.get('formData') as string;
    
    if (!formDataJson) {
      return NextResponse.json(
        { error: 'Brak danych formularza' },
        { status: 400 }
      );
    }

    const data = JSON.parse(formDataJson);
    
    // Validate required fields
    if (!data.title || !data.description) {
      return NextResponse.json(
        { error: 'Tytuł i opis są wymagane' },
        { status: 400 }
      );
    }

    // Get images
    const images = formData.getAll('images') as File[];
    
    if (images.length === 0) {
      return NextResponse.json(
        { error: 'Dodaj co najmniej jedno zdjęcie' },
        { status: 400 }
      );
    }

    // Generate slug and folder name
    const baseSlug = generateSlugFromTitle(data.title);
    const folderType = getFolderTypeFromCategory(data.category);
    const location = data.location ? data.location.split(',')[0].toLowerCase().replace(/\s+/g, '-') : 'polska';
    
    // Create folder name: [miasto]-[slug]-[typ]
    const folderName = `${location}-${baseSlug}-${folderType}`;
    const folderPath = path.join(process.cwd(), 'public', 'realizacje', folderName);

    // Create folder if it doesn't exist
    if (!existsSync(folderPath)) {
      await mkdir(folderPath, { recursive: true });
    }

    // Save images
    const imageFiles: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate filename
      const extension = image.name.split('.').pop() || 'jpg';
      const filename = i === 0 ? `0-glowne.${extension}` : `${i}.${extension}`;
      const imagePath = path.join(folderPath, filename);
      
      await writeFile(imagePath, buffer);
      imageFiles.push(filename);
    }

    // Create opis.json - Define the type for opisData
    interface OpisData {
      title: string;
      description: string;
      location?: string;
      area?: string;
      technology?: string;
      color?: string;
      duration?: string;
      tags?: string[];
      features?: string[];
      keywords?: string[];
      clientTestimonial?: {
        content: string;
        author: string;
      };
      type?: string;
    }

    const opisData: OpisData = {
      title: data.title,
      description: data.description,
    };

    // Add optional fields
    if (data.location) opisData.location = data.location;
    if (data.area) opisData.area = data.area;
    if (data.technology) opisData.technology = data.technology;
    if (data.color) opisData.color = data.color;
    if (data.duration) opisData.duration = data.duration;

    // Parse tags (comma-separated)
    if (data.tags) {
      opisData.tags = data.tags
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0);
    }

    // Parse features (line-separated)
    if (data.features) {
      opisData.features = data.features
        .split('\n')
        .map((feature: string) => feature.trim())
        .filter((feature: string) => feature.length > 0);
    }

    // Parse keywords (line-separated)
    if (data.keywords) {
      opisData.keywords = data.keywords
        .split('\n')
        .map((keyword: string) => keyword.trim())
        .filter((keyword: string) => keyword.length > 0);
    }

    // Add testimonial if provided
    if (data.testimonialContent && data.testimonialAuthor) {
      opisData.clientTestimonial = {
        content: data.testimonialContent,
        author: data.testimonialAuthor,
      };
    }

    // Add type (indywidualna/komercyjna)
    opisData.type = data.type || 'indywidualna';

    // Save opis.json
    const opisPath = path.join(folderPath, 'opis.json');
    await writeFile(opisPath, JSON.stringify(opisData, null, 2));

    // Run scanner to update data/realizacje/
    console.log('Running scanner to update realizacje data...');
    await scanAllRealizacje();

    return NextResponse.json({
      success: true,
      message: 'Realizacja została dodana pomyślnie',
      folderName,
      slug: folderName,
    });

  } catch (error) {
    console.error('Error uploading realizacja:', error);
    return NextResponse.json(
      {
        error: 'Błąd serwera podczas dodawania realizacji',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Użyj metody POST aby dodać nową realizację',
    info: 'Endpoint do dodawania realizacji przez formularz webowy',
  });
}
