'use client';

import { useState, useMemo } from 'react';
import { getAllRealizacje, getCategoryDisplayName, getTypeDisplayName, getAllTags } from '@/lib/realizacje';
import { RealizacjaCategory, RealizacjaType } from '@/types/realizacje';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Contact1 } from '@/blocks/contact/contact1';
import { CTA2 } from '@/blocks/cta/cta2';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

export default function RealizacjePage() {
  const allRealizacje = getAllRealizacje();
  const allTags = getAllTags();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RealizacjaCategory | 'all'>('all');
  const [selectedType, setSelectedType] = useState<RealizacjaType | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const categories: RealizacjaCategory[] = ['mieszkania-domy', 'balkony-tarasy', 'kuchnie', 'pomieszczenia-czyste', 'schody'];
  const types: (RealizacjaType | 'all')[] = ['all', 'indywidualna', 'komercyjna'];

  // Filter and search logic
  const filteredRealizacje = useMemo(() => {
    return allRealizacje.filter((realizacja) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' || 
        realizacja.title.toLowerCase().includes(searchLower) ||
        realizacja.description.toLowerCase().includes(searchLower) ||
        realizacja.location.toLowerCase().includes(searchLower) ||
        realizacja.tags.some(tag => tag.toLowerCase().includes(searchLower));

      // Category filter
      const matchesCategory = selectedCategory === 'all' || realizacja.category === selectedCategory;

      // Type filter
      const matchesType = selectedType === 'all' || realizacja.type === selectedType;

      // Tags filter
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => realizacja.tags.includes(tag));

      return matchesSearch && matchesCategory && matchesType && matchesTags;
    });
  }, [allRealizacje, searchQuery, selectedCategory, selectedType, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedTags([]);
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedType !== 'all' || selectedTags.length > 0;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Nasze Realizacje Posadzek Żywicznych
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Zobacz ostatnio zrealizowane projekty posadzek żywicznych. 
              Każda realizacja to unikalne rozwiązanie dostosowane do potrzeb klienta.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="w-full py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Szukaj po nazwie, lokalizacji, tagach..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-12 text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 self-center">Typ projektu:</span>
              {types.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className="rounded-full"
                >
                  {type === 'all' ? 'Wszystkie' : getTypeDisplayName(type)}
                </Button>
              ))}
            </div>

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

            {/* Tags Filter */}
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Tagi:</span>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 15).map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
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
                  Nie znaleziono projektów spełniających kryteria wyszukiwania.
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
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                          <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                            {getCategoryDisplayName(realizacja.category)}
                          </Badge>
                          <Badge variant="secondary" className="bg-white/90 text-gray-900">
                            {getTypeDisplayName(realizacja.type)}
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

      {/* CTA Section */}
      <CTA2 />
      
      {/* Contact Section */}
      <Contact1 />
    </div>
  );
}
