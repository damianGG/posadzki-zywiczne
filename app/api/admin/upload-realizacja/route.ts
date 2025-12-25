/**
 * API Route: /api/admin/upload-realizacja
 * 
 * Handles uploading new realizacja with images using Cloudinary
 * Works in both development and production environments
 */

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    // Check Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { 
          error: 'Cloudinary nie jest skonfigurowany',
          details: 'Brak zmiennych środowiskowych Cloudinary. Dodaj CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY i CLOUDINARY_API_SECRET w ustawieniach środowiska.',
          instructions: 'Skonfiguruj zmienne środowiskowe w Vercel lub lokalnie w pliku .env'
        },
        { status: 500 }
      );
    }

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
    const location = data.location 
      ? sanitizeString(data.location.split(',')[0]) 
      : 'polska';
    
    // Create folder name: [miasto]-[slug]-[typ]
    const folderName = `${location}-${baseSlug}-${folderType}`;
    
    // Upload images to Cloudinary
    console.log(`Uploading ${images.length} images to Cloudinary...`);
    const uploadedImages: { url: string; publicId: string; filename: string }[] = [];
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate filename - sanitize extension
      const nameParts = image.name.split('.');
      const extension = nameParts.length > 1 
        ? nameParts.pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
        : 'jpg';
      // Ensure extension is valid image format
      const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
      const safeExtension = validExtensions.includes(extension) ? extension : 'jpg';
      
      const filename = i === 0 ? `0-glowne` : `${i}`;
      const publicId = `realizacje/${folderName}/${filename}`;
      
      // Upload to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: `realizacje/${folderName}`,
            public_id: filename,
            resource_type: 'image',
            format: safeExtension,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
      
      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
        filename: `${filename}.${safeExtension}`,
      });
      
      console.log(`Uploaded image ${i + 1}/${images.length}: ${result.secure_url}`);
    }

    // Create opis.json structure
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
      cloudinary?: {
        images: { url: string; publicId: string; filename: string }[];
        folderName: string;
      };
    }

    const opisData: OpisData = {
      title: data.title,
      description: data.description,
      cloudinary: {
        images: uploadedImages,
        folderName,
      },
    };

    // Add optional fields
    if (data.location) opisData.location = data.location;
    if (data.area) opisData.area = data.area;
    if (data.technology) opisData.technology = data.technology;
    if (data.color) opisData.color = data.color;
    if (data.duration) opisData.duration = data.duration;

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

    // Create realizacja data structure for data/realizacje/ (public page format)
    const realizacjaData: any = {
      slug: folderName,
      title: data.title,
      description: data.description,
      category: data.category,
      location: data.location || '',
      date: new Date().toISOString().split('T')[0],
      tags,
      images: {
        main: uploadedImages[0]?.url || '',
        gallery: uploadedImages.map(img => img.url),
      },
      details: {
        surface: data.area || '',
        system: data.technology || '',
        color: data.color || '',
        duration: data.duration || '',
      },
      features,
      keywords,
    };

    // Add testimonial if provided
    if (data.testimonialContent && data.testimonialAuthor) {
      realizacjaData.clientTestimonial = {
        content: data.testimonialContent,
        author: data.testimonialAuthor,
      };
    }

    // Save to data/realizacje/ directory (where the public page reads from)
    try {
      const dataDir = path.join(process.cwd(), 'data', 'realizacje');
      if (!existsSync(dataDir)) {
        await mkdir(dataDir, { recursive: true });
      }
      
      const jsonPath = path.join(dataDir, `${folderName}.json`);
      await writeFile(jsonPath, JSON.stringify(realizacjaData, null, 2));
      
      console.log('Saved realizacja JSON to data/realizacje/:', jsonPath);
    } catch (saveError) {
      console.error('Error saving realizacja JSON:', saveError);
      throw new Error('Failed to save realizacja data');
    }

    // Also save to old format for backward compatibility (optional)
    if (data.tags) {
      opisData.tags = tags;
    }
    if (data.features) {
      opisData.features = features;
    }
    if (data.keywords) {
      opisData.keywords = keywords;
    }
    if (data.testimonialContent && data.testimonialAuthor) {
      opisData.clientTestimonial = {
        content: data.testimonialContent,
        author: data.testimonialAuthor,
      };
    }
    opisData.type = data.type || 'indywidualna';

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Realizacja została dodana pomyślnie! Zdjęcia zapisane w Cloudinary i realizacja jest już widoczna na stronie.',
      folderName,
      slug: folderName,
      images: uploadedImages.map(img => img.url),
      cloudinaryFolder: `realizacje/${folderName}`,
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
    info: 'Endpoint do dodawania realizacji przez formularz webowy z Cloudinary',
    cloudinaryConfigured: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
  });
}
