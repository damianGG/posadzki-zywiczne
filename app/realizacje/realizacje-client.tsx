'use client';

import { useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCategoryDisplayName } from '@/lib/realizacje-helpers';
import { Realizacja, RealizacjaCategory } from '@/types/realizacje';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface RealizacjeClientProps {
  realizacje: Realizacja[];
}

const categories: RealizacjaCategory[] = ['schody', 'garaze', 'kuchnie', 'balkony-tarasy', 'domy-mieszkania'];

export default function RealizacjeClient({ realizacje }: RealizacjeClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get category from URL, validate it's a valid category
  const categoryParam = searchParams.get('kategoria');
  const selectedCategory: RealizacjaCategory | 'all' = 
    categoryParam && categories.includes(categoryParam as RealizacjaCategory) 
      ? (categoryParam as RealizacjaCategory) 
      : 'all';

  // Update URL when category changes
  const setSelectedCategory = useCallback((category: RealizacjaCategory | 'all') => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'all') {
      params.delete('kategoria');
    } else {
      params.set('kategoria', category);
    }
    const newUrl = params.toString() ? `?${params.toString()}` : '/realizacje';
    router.push(newUrl, { scroll: false });
  }, [router, searchParams]);

  // Filter logic
  const filteredRealizacje = useMemo(() => {
    return realizacje.filter((realizacja) => {
      return selectedCategory === 'all' || realizacja.category === selectedCategory;
    });
  }, [realizacje, selectedCategory]);

  const clearFilters = () => {
    setSelectedCategory('all');
  };

  const hasActiveFilters = selectedCategory !== 'all';

  return (
    <>
      {/* Filters */}
      <section className="w-full py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 self-center">Kategoria:</span>
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="rounded-full"
              >
                Wszystkie
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {getCategoryDisplayName(category)}
                </Button>
              ))}
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-600"
                >
                  <X className="h-4 w-4 mr-2" />
                  Wyczyść filtry
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-gray-600 mb-8">
              Znaleziono: <span className="font-semibold">{filteredRealizacje.length}</span> {filteredRealizacje.length === 1 ? 'projekt' : 'projektów'}
            </p>

            {filteredRealizacje.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600">
                  Nie znaleziono projektów spełniających kryteria filtrowania.
                </p>
                <Button onClick={clearFilters} className="mt-4">
                  Wyczyść filtry
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRealizacje.map((realizacja) => (
                  <Link
                    key={realizacja.slug}
                    href={`/realizacje/${realizacja.slug}`}
                    className="group block"
                  >
                    <article className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={realizacja.images.main}
                          alt={realizacja.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                            {getCategoryDisplayName(realizacja.category)}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
                          {realizacja.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2 flex-1">
                          {realizacja.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {realizacja.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-2 text-sm text-gray-500 mt-auto">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{realizacja.location}</span>
                          </div>
                          <span>•</span>
                          <span>{realizacja.details.surface}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
