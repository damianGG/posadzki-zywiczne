/**
 * API Route: /api/admin/delete-realizacja
 * 
 * Deletes a realizacja and its images from Cloudinary
 */

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

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

    // Read realizacja data
    const dataPath = path.join(process.cwd(), 'data/realizacje', `${slug}.json`);
    
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json(
        { error: 'Realizacja nie istnieje' },
        { status: 404 }
      );
    }

    const realizacjaData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Delete images from Cloudinary if they exist
    if (realizacjaData.cloudinary?.images) {
      for (const image of realizacjaData.cloudinary.images) {
        try {
          await cloudinary.uploader.destroy(image.publicId);
          console.log(`Deleted from Cloudinary: ${image.publicId}`);
        } catch (cloudinaryError) {
          console.warn(`Could not delete from Cloudinary: ${image.publicId}`, cloudinaryError);
        }
      }

      // Try to delete the folder from Cloudinary
      if (realizacjaData.cloudinary.folderName) {
        try {
          await cloudinary.api.delete_folder(`realizacje/${realizacjaData.cloudinary.folderName}`);
        } catch (err) {
          console.warn('Could not delete Cloudinary folder:', err);
        }
      }
    }

    // Delete local files if they exist
    const publicPath = path.join(process.cwd(), 'public/realizacje', slug);
    if (fs.existsSync(publicPath)) {
      fs.rmSync(publicPath, { recursive: true, force: true });
    }

    // Delete JSON file
    fs.unlinkSync(dataPath);

    return NextResponse.json({
      success: true,
      message: 'Realizacja została usunięta pomyślnie',
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
