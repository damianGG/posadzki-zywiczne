'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { getCategoryDisplayName } from '@/lib/realizacje-helpers';
import { Badge } from '@/components/ui/badge';

import { RealizacjaCategory } from '@/types/realizacje';

interface GalleryImage {
  url: string;
  realizacjaTitle: string;
  realizacjaSlug: string;
  category: RealizacjaCategory;
}

interface GaleriaClientProps {
  images: GalleryImage[];
}

export default function GaleriaClient({ images }: GaleriaClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if device is mobile
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };
    
    handleChange(mediaQuery);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeGallery = () => {
    setIsOpen(false);
  };

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        closeGallery();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToPrevious, goToNext]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle touch swipe for mobile
  useEffect(() => {
    if (!isOpen || !isMobile) return;

    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndY = e.changedTouches[0].clientY;
      const swipeDistance = touchStartY - touchEndY;
      
      // Minimum swipe distance of 50px
      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
          // Swiped up - show next
          goToNext();
        } else {
          // Swiped down - show previous
          goToPrevious();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, isMobile, goToNext, goToPrevious]);

  if (images.length === 0) {
    return (
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500">
            Brak zdjęć w galerii
          </div>
        </div>
      </section>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <>
      {/* Gallery Grid */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden shadow-md cursor-pointer group"
                onClick={() => openGallery(index)}
              >
                <Image
                  src={image.url}
                  alt={image.realizacjaTitle}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  quality={85}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-3">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Badge className="text-xs">
                      {getCategoryDisplayName(image.category)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen Viewer - Vertical Scroll (TikTok style) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={closeGallery}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-20 bg-black/50 backdrop-blur-sm p-2 rounded-full"
            onClick={closeGallery}
            aria-label="Zamknij galerię"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 text-white text-sm md:text-base z-20 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Image info - bottom left */}
          <div className="absolute bottom-4 left-4 right-4 md:right-auto text-white z-20 max-w-xs md:max-w-md bg-black/50 backdrop-blur-sm p-3 rounded-lg">
            <Link 
              href={`/realizacje/${currentImage.realizacjaSlug}`}
              className="hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-sm md:text-base font-semibold mb-2">
                {currentImage.realizacjaTitle}
              </h3>
            </Link>
            <Badge className="text-xs">
              {getCategoryDisplayName(currentImage.category)}
            </Badge>
          </div>

          {/* Previous/Up button */}
          <button
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[calc(50%+100px)] md:top-8 md:left-1/2 md:transform md:-translate-x-1/2 md:translate-y-0 text-white hover:text-gray-300 transition-colors z-20 p-3 hover:bg-white/20 rounded-full backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            aria-label="Poprzednie zdjęcie"
          >
            <ChevronUp className="w-8 h-8 md:w-8 md:h-8" />
          </button>

          {/* Current image */}
          <div 
            className="relative w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage.url}
              alt={currentImage.realizacjaTitle}
              fill
              className={isMobile ? "object-cover" : "object-contain"}
              sizes="100vw"
              quality={95}
              priority
            />
          </div>

          {/* Next/Down button */}
          <button
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-[calc(50%+100px)] md:bottom-8 md:left-1/2 md:top-auto md:transform md:-translate-x-1/2 md:translate-y-0 text-white hover:text-gray-300 transition-colors z-20 p-3 hover:bg-white/20 rounded-full backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Następne zdjęcie"
          >
            <ChevronDown className="w-8 h-8 md:w-8 md:h-8" />
          </button>
        </div>
      )}
    </>
  );
}
