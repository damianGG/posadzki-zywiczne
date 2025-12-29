import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { createRealizacja, RealizacjaData } from '@/lib/supabase-realizacje';
import { getProjectTypeFromCategory, getFolderTypeFromCategory } from '@/lib/realizacje-category-mapping';

// Configure route for larger payloads and longer execution
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // Allow up to 60 seconds for multiple image uploads

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
    const projectType = getProjectTypeFromCategory(data.category);
    const location = data.location 
      ? sanitizeString(data.location.split(',')[0]) 
      : 'polska';
    
    // Create folder name: [miasto]-[slug]-[typ]
    const folderName = `${location}-${baseSlug}-${folderType}`;
    
    // Upload images to Cloudinary
    console.log(`Uploading ${images.length} images to Cloudinary, project_type: ${projectType}...`);
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

    // Parse benefits (line-separated) - from features or separate field
    const benefits = data.benefits
      ? data.benefits
          .split('\n')
          .map((benefit: string) => benefit.trim())
          .filter((benefit: string) => benefit.length > 0)
      : features; // Use features as benefits if not provided separately

    // Parse FAQ if provided - handle both string and already parsed array
    let faq: Array<{ question: string; answer: string }> = [];
    if (data.faq) {
      try {
        // If it's already an array, use it directly
        if (Array.isArray(data.faq)) {
          faq = data.faq;
        } else if (typeof data.faq === 'string' && data.faq.trim()) {
          // If it's a string, try to parse it
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
        // If it's already an object, use it directly
        if (typeof data.content === 'object') {
          content = data.content;
        } else if (typeof data.content === 'string' && data.content.trim()) {
          // If it's a string, try to parse it
          content = JSON.parse(data.content);
        }
      } catch (parseError) {
        console.warn('Could not parse content sections, using undefined:', parseError);
        content = undefined;
      }
    }

    // Create realizacja data for Supabase
    const realizacjaData: RealizacjaData = {
      slug: folderName,
      title: data.title,
      h1: data.h1 || undefined,
      description: data.description,
      short_description: data.shortDescription || data.description.substring(0, 160),
      location: data.location || '',
      surface_area: data.area || '',
      project_type: projectType,
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
        main: uploadedImages[0]?.url || '',
        gallery: uploadedImages.map(img => ({
          url: img.url,
          alt: `${data.title} - ${data.location || 'realizacja'}`,
        })),
      },
      faq,
      content,
      cloudinary_folder: `realizacje/${folderName}`,
    };

    // Save to Supabase database
    console.log('Saving realizacja to Supabase database...');
    const supabaseResult = await createRealizacja(realizacjaData);
    
    if (!supabaseResult.success) {
      console.error('❌ Error saving to Supabase:', supabaseResult.error);
      // Clean up uploaded Cloudinary images if database save fails
      for (const img of uploadedImages) {
        try {
          await cloudinary.uploader.destroy(img.publicId);
        } catch (cleanupError) {
          console.error('Error cleaning up image:', img.publicId, cleanupError);
        }
      }
      throw new Error(`Nie udało się zapisać do bazy danych: ${supabaseResult.error}`);
    }

    console.log('✅ Successfully saved realizacja to Supabase');

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Realizacja została dodana pomyślnie! Dane zapisane w bazie Supabase, zdjęcia w Cloudinary.',
      folderName,
      slug: folderName,
      images: uploadedImages.map(img => img.url),
      cloudinaryFolder: `realizacje/${folderName}`,
      realizacja: supabaseResult.data,
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
