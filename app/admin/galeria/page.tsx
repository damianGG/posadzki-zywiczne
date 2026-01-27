'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Badge } from '@/components/ui/badge';

interface GalleryImage {
  url: string;
  realizacjaTitle: string;
  realizacjaSlug: string;
  category: string;
  hidden: boolean;
}

export default function AdminGaleriaPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [filter, setFilter] = useState<'all' | 'visible' | 'hidden'>('all');
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/realizacje/dodaj');
      return;
    }
    setIsAuthenticated(true);
    fetchGalleryImages();
  }, [router]);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/list-realizacje');
      const data = await response.json();

      if (response.ok && data.realizacje) {
        // Aggregate all images from all realizacje
        const images: GalleryImage[] = [];
        
        data.realizacje.forEach((realizacja: any) => {
          // Add main image
          if (realizacja.images?.main) {
            images.push({
              url: realizacja.images.main,
              realizacjaTitle: realizacja.title,
              realizacjaSlug: realizacja.slug,
              category: realizacja.project_type || 'other',
              hidden: false, // Main images are always visible
            });
          }
          
          // Add gallery images
          if (realizacja.images?.gallery && Array.isArray(realizacja.images.gallery)) {
            realizacja.images.gallery.forEach((img: any) => {
              const imageUrl = typeof img === 'string' ? img : img.url;
              const isHidden = typeof img === 'string' ? false : (img.hidden || false);
              
              if (imageUrl) {
                images.push({
                  url: imageUrl,
                  realizacjaTitle: realizacja.title,
                  realizacjaSlug: realizacja.slug,
                  category: realizacja.project_type || 'other',
                  hidden: isHidden,
                });
              }
            });
          }
        });

        setAllImages(images);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = allImages.filter(img => {
    if (filter === 'visible') return !img.hidden;
    if (filter === 'hidden') return img.hidden;
    return true; // 'all'
  });

  const visibleCount = allImages.filter(img => !img.hidden).length;
  const hiddenCount = allImages.filter(img => img.hidden).length;

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Card className="overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center gap-4 mb-2">
              <Link href="/admin">
                <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Powrót
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Zarządzanie Galerią</h1>
                <p className="text-blue-100 text-sm">Przeglądaj wszystkie zdjęcia z realizacji</p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Wszystkie zdjęcia</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{allImages.length}</p>
                  </div>
                  <ImageIcon className="w-8 h-8 text-blue-600" />
                </div>
              </Card>
              
              <Card className="p-4 bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Widoczne w galerii</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{visibleCount}</p>
                  </div>
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
              </Card>
              
              <Card className="p-4 bg-gray-50 dark:bg-gray-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ukryte</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{hiddenCount}</p>
                  </div>
                  <EyeOff className="w-8 h-8 text-gray-600" />
                </div>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                Wszystkie ({allImages.length})
              </Button>
              <Button
                variant={filter === 'visible' ? 'default' : 'outline'}
                onClick={() => setFilter('visible')}
                size="sm"
              >
                <Eye className="w-4 h-4 mr-1" />
                Widoczne ({visibleCount})
              </Button>
              <Button
                variant={filter === 'hidden' ? 'default' : 'outline'}
                onClick={() => setFilter('hidden')}
                size="sm"
              >
                <EyeOff className="w-4 h-4 mr-1" />
                Ukryte ({hiddenCount})
              </Button>
            </div>

            {/* Info Box */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                💡 <strong>Wskazówka:</strong> Aby edytować widoczność zdjęć lub dodać nowe, przejdź do 
                edycji konkretnej realizacji w sekcji <Link href="/admin/realizacje" className="text-blue-600 hover:underline font-semibold">Realizacje</Link>.
              </p>
            </div>

            {/* Gallery Grid */}
            {filteredImages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Brak zdjęć do wyświetlenia
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredImages.map((image, index) => (
                  <Link
                    key={index}
                    href={`/admin/realizacje/edytuj/${image.realizacjaSlug}`}
                    className="group"
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative aspect-square">
                        <NextImage
                          src={image.url}
                          alt={image.realizacjaTitle}
                          fill
                          className={`object-cover transition-transform group-hover:scale-105 ${
                            image.hidden ? 'opacity-40' : ''
                          }`}
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        {image.hidden && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-gray-800 text-white">
                              <EyeOff className="w-3 h-3 mr-1" />
                              Ukryte
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                          {image.realizacjaTitle}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Kliknij aby edytować
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
