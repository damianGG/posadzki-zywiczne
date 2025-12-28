import { getAllRealizacje } from '@/lib/realizacje';
import { Contact1 } from '@/blocks/contact/contact1';
import { CTA2 } from '@/blocks/cta/cta2';
import { Metadata } from 'next';
import { Suspense } from 'react';
import GaleriaClient from './galeria-client';

// Revalidate every 60 seconds to show new images
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Galeria Zdjęć - Posadzki Żywiczne | Wszystkie Realizacje',
  description: 'Zobacz pełną galerię zdjęć naszych realizacji posadzek żywicznych. Garaże, kuchnie, balkony, tarasy i więcej - wszystkie projekty w jednym miejscu.',
  keywords: 'galeria posadzki żywiczne, zdjęcia posadzek, portfolio posadzek epoksydowych, realizacje garaż zdjęcia, posadzki żywiczne galeria',
  openGraph: {
    title: 'Galeria Zdjęć - Posadzki Żywiczne | Wszystkie Realizacje',
    description: 'Zobacz pełną galerię zdjęć naszych realizacji posadzek żywicznych.',
    url: 'https://posadzkizywiczne.com/galeria',
    images: [
      {
        url: 'https://posadzkizywiczne.com/garaz/garaz-zywica-2.jpg',
        width: 1200,
        height: 630,
        alt: 'Galeria posadzek żywicznych',
      },
    ],
  },
  alternates: {
    canonical: 'https://posadzkizywiczne.com/galeria',
  },
};

interface GalleryImage {
  url: string;
  realizacjaTitle: string;
  realizacjaSlug: string;
  category: string;
}

export default async function GaleriaPage() {
  const allRealizacje = await getAllRealizacje();

  // Aggregate all images from all realizacje
  const allImages: GalleryImage[] = [];
  
  allRealizacje.forEach((realizacja) => {
    // Add main image
    if (realizacja.images.main) {
      allImages.push({
        url: realizacja.images.main,
        realizacjaTitle: realizacja.title,
        realizacjaSlug: realizacja.slug,
        category: realizacja.category,
      });
    }
    
    // Add gallery images
    realizacja.images.gallery.forEach((imageUrl) => {
      if (imageUrl) {
        allImages.push({
          url: imageUrl,
          realizacjaTitle: realizacja.title,
          realizacjaSlug: realizacja.slug,
          category: realizacja.category,
        });
      }
    });
  });

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Galeria Zdjęć Posadzek Żywicznych
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Kompletna kolekcja zdjęć z naszych realizacji. 
              Zobacz wszystkie projekty posadzek żywicznych w jednym miejscu.
            </p>
            <p className="text-lg text-gray-500">
              {allImages.length} zdjęć z {allRealizacje.length} realizacji
            </p>
          </div>
        </div>
      </section>

      {/* Client-side gallery component */}
      <Suspense fallback={<div className="w-full py-8 text-center">Ładowanie galerii...</div>}>
        <GaleriaClient images={allImages} />
      </Suspense>

      {/* CTA Section */}
      <CTA2 />
      
      {/* Contact Section */}
      <Contact1 />
    </div>
  );
}
