/**
 * API Route: /api/admin/update-realizacja
 * Updates an existing realizacja with new data and images in Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { updateRealizacja, getRealizacjaBySlug } from '@/lib/supabase-realizacje';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(request: NextRequest) {
  let slug: string | undefined;
  
  try {
    // Parse form data
    const formData = await request.formData();
    const formDataJson = formData.get('formData') as string;
    slug = formData.get('slug') as string;
    const imagesToDelete = formData.get('imagesToDelete') as string;
    
    if (!formDataJson || !slug) {
      return NextResponse.json(
        { error: 'Brak wymaganych danych' },
        { status: 400 }
      );
    }

    const data = JSON.parse(formDataJson);
    const deleteImageIds = imagesToDelete ? JSON.parse(imagesToDelete) : [];

    // Get existing realizacja from Supabase
    const existingResult = await getRealizacjaBySlug(slug);
    if (!existingResult.success || !existingResult.data) {
      return NextResponse.json(
        { error: 'Realizacja nie istnieje' },
        { status: 404 }
      );
    }

    const existingRealizacja = existingResult.data;
    
    // Get existing images
    let existingGallery = existingRealizacja.images?.gallery || [];

    // Delete specified images from Cloudinary
    for (const publicId of deleteImageIds) {
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted from Cloudinary: ${publicId}`);
        existingGallery = existingGallery.filter(img => !img.url.includes(publicId));
      } catch (error) {
        console.warn(`Could not delete: ${publicId}`, error);
      }
    }

    // Upload new images if provided
    const newImages = formData.getAll('newImages') as File[];
    const uploadedImages: Array<{ url: string; alt: string }> = [];
    
    if (newImages.length > 0 && newImages[0].size > 0) {
      const folderName = existingRealizacja.cloudinary_folder?.replace('realizacje/', '') || slug;
      
      for (let i = 0; i < newImages.length; i++) {
        const image = newImages[i];
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const nameParts = image.name.split('.');
        const extension = nameParts.length > 1 
          ? nameParts.pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
          : 'jpg';
        const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        const safeExtension = validExtensions.includes(extension) ? extension : 'jpg';
        
        const timestamp = Date.now();
        const filename = `${timestamp}-${i}`;
        
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
          alt: `${data.title} - ${data.location || 'realizacja'}`,
        });
      }
    }

    // Combine existing and new images
    const allGallery = [...existingGallery, ...uploadedImages];

    // Parse arrays from form data
    const tags = data.tags ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : existingRealizacja.tags;
    const features = data.features ? data.features.split('\n').map((f: string) => f.trim()).filter(Boolean) : existingRealizacja.features;
    const keywords = data.keywords ? data.keywords.split('\n').map((k: string) => k.trim()).filter(Boolean) : existingRealizacja.keywords;
    const benefits = data.benefits ? data.benefits.split('\n').map((b: string) => b.trim()).filter(Boolean) : existingRealizacja.benefits;

    // Update realizacja in Supabase
    const updateData = {
      title: data.title,
      description: data.description,
      short_description: data.shortDescription || data.description.substring(0, 160),
      location: data.location || existingRealizacja.location,
      surface_area: data.area || existingRealizacja.surface_area,
      project_type: data.category || existingRealizacja.project_type,
      technology: data.technology || existingRealizacja.technology,
      color: data.color || existingRealizacja.color,
      duration: data.duration || existingRealizacja.duration,
      tags,
      features,
      keywords,
      benefits,
      meta_description: data.metaDescription || existingRealizacja.meta_description,
      og_title: data.ogTitle || existingRealizacja.og_title,
      og_description: data.ogDescription || existingRealizacja.og_description,
      cloudinary_folder: existingRealizacja.cloudinary_folder || `realizacje/${slug}`,
      images: {
        main: allGallery[0]?.url || existingRealizacja.images?.main,
        gallery: allGallery,
      },
    };

    const updateResult = await updateRealizacja(slug, updateData);

    if (!updateResult.success) {
      console.error('Update failed:', {
        slug,
        error: updateResult.error,
        updateData: JSON.stringify(updateData, null, 2),
      });
      
      return NextResponse.json(
        { 
          error: 'Błąd podczas aktualizacji', 
          details: updateResult.error,
          debugInfo: {
            slug,
            hasImages: !!updateData.images,
            imageCount: updateData.images?.gallery?.length || 0,
            fields: Object.keys(updateData),
          }
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Realizacja została zaktualizowana pomyślnie w bazie Supabase',
      slug,
      updatedImages: {
        added: uploadedImages.length,
        deleted: deleteImageIds.length,
        total: allGallery.length,
      },
      realizacja: updateResult.data,
    });

  } catch (error) {
    console.error('Error updating realizacja:', error);
    
    // Log more details for debugging
    const errorDetails = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      slug,
    };
    console.error('Detailed error:', errorDetails);
    
    return NextResponse.json(
      {
        error: 'Błąd podczas aktualizacji realizacji',
        details: error instanceof Error ? error.message : String(error),
        debugInfo: errorDetails,
      },
      { status: 500 }
    );
  }
}
