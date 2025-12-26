/**
 * API Route: /api/admin/delete-realizacja
 * 
 * Deletes a realizacja from Supabase and its images from Cloudinary
 */

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { deleteRealizacja, getRealizacjaBySlug } from '@/lib/supabase-realizacje';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Brak parametru slug' },
        { status: 400 }
      );
    }

    // Get realizacja data first
    const realizacjaResult = await getRealizacjaBySlug(slug);
    
    if (!realizacjaResult.success || !realizacjaResult.data) {
      return NextResponse.json(
        { error: 'Realizacja nie istnieje' },
        { status: 404 }
      );
    }

    const realizacjaData = realizacjaResult.data;

    // Delete images from Cloudinary
    if (realizacjaData.images?.gallery) {
      for (const image of realizacjaData.images.gallery) {
        try {
          // Extract public_id from Cloudinary URL
          const urlParts = image.url.split('/');
          const versionIndex = urlParts.findIndex(part => part.startsWith('v'));
          if (versionIndex > 0) {
            const pathAfterVersion = urlParts.slice(versionIndex + 1).join('/');
            const publicId = pathAfterVersion.replace(/\.[^.]+$/, ''); // Remove extension
            
            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted from Cloudinary: ${publicId}`);
          }
        } catch (cloudinaryError) {
          console.warn(`Could not delete from Cloudinary:`, cloudinaryError);
        }
      }

      // Try to delete the folder from Cloudinary
      if (realizacjaData.cloudinary_folder) {
        try {
          await cloudinary.api.delete_folder(realizacjaData.cloudinary_folder);
        } catch (err) {
          console.warn('Could not delete Cloudinary folder:', err);
        }
      }
    }

    // Delete from Supabase database
    const deleteResult = await deleteRealizacja(slug);

    if (!deleteResult.success) {
      return NextResponse.json(
        { error: 'Błąd podczas usuwania z bazy', details: deleteResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Realizacja została usunięta pomyślnie z Supabase i Cloudinary',
      slug,
    });

  } catch (error) {
    console.error('Error deleting realizacja:', error);
    return NextResponse.json(
      {
        error: 'Błąd podczas usuwania realizacji',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
