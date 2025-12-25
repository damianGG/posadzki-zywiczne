/**
 * API Route: /api/admin/update-realizacja
 * Updates an existing realizacja with new data and images
 */

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const formDataJson = formData.get('formData') as string;
    const slug = formData.get('slug') as string;
    const imagesToDelete = formData.get('imagesToDelete') as string;
    
    if (!formDataJson || !slug) {
      return NextResponse.json(
        { error: 'Brak wymaganych danych' },
        { status: 400 }
      );
    }

    const data = JSON.parse(formDataJson);
    const deleteImageIds = imagesToDelete ? JSON.parse(imagesToDelete) : [];

    // Get existing realizacja
    const dataPath = path.join(process.cwd(), 'data/realizacje', `${slug}.json`);
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json(
        { error: 'Realizacja nie istnieje' },
        { status: 404 }
      );
    }

    const existingRealizacja = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    // Get existing Cloudinary images
    let existingImages: any[] = [];
    if (existingRealizacja.cloudinary?.images) {
      existingImages = existingRealizacja.cloudinary.images;
    }

    // Delete specified images from Cloudinary
    for (const publicId of deleteImageIds) {
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted from Cloudinary: ${publicId}`);
        existingImages = existingImages.filter(img => img.publicId !== publicId);
      } catch (error) {
        console.warn(`Could not delete: ${publicId}`, error);
      }
    }

    // Upload new images if provided
    const newImages = formData.getAll('newImages') as File[];
    const uploadedImages: { url: string; publicId: string; filename: string }[] = [];
    
    if (newImages.length > 0 && newImages[0].size > 0) {
      const folderName = existingRealizacja.cloudinary?.folderName || slug;
      
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
          publicId: result.public_id,
          filename: `${filename}.${safeExtension}`,
        });
      }
    }

    // Combine existing and new images
    const allImages = [...existingImages, ...uploadedImages];

    // Update realizacja data with correct structure
    const updatedRealizacja = {
      ...existingRealizacja,
      title: data.title,
      description: data.description,
      location: data.location || existingRealizacja.location,
      category: data.category || existingRealizacja.category,
      date: data.date || existingRealizacja.date || new Date().toISOString().split('T')[0],
      images: {
        main: allImages[0]?.url || existingRealizacja.images?.main || '',
        gallery: allImages.map((img: any) => img.url || img),
      },
      details: {
        surface: data.area || existingRealizacja.details?.surface,
        system: data.technology || existingRealizacja.details?.system,
        color: data.color || existingRealizacja.details?.color,
        duration: data.duration || existingRealizacja.details?.duration,
      },
      tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()) : existingRealizacja.tags,
      features: data.features ? data.features.split('\n').map((f: string) => f.trim()).filter(Boolean) : existingRealizacja.features,
      keywords: data.keywords ? data.keywords.split('\n').map((k: string) => k.trim()).filter(Boolean) : existingRealizacja.keywords,
      cloudinary: allImages.length > 0 ? {
        images: allImages,
        folderName: existingRealizacja.cloudinary?.folderName || slug,
      } : existingRealizacja.cloudinary,
    };

    if (data.testimonialContent && data.testimonialAuthor) {
      updatedRealizacja.clientTestimonial = {
        content: data.testimonialContent,
        author: data.testimonialAuthor,
      };
    }

    // Save updated JSON
    fs.writeFileSync(dataPath, JSON.stringify(updatedRealizacja, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Realizacja została zaktualizowana pomyślnie',
      slug,
      updatedImages: {
        added: uploadedImages.length,
        deleted: deleteImageIds.length,
        total: allImages.length,
      },
    });

  } catch (error) {
    console.error('Error updating realizacja:', error);
    return NextResponse.json(
      {
        error: 'Błąd podczas aktualizacji realizacji',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
