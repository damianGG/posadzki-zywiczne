'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import cloudinaryLoader, { cloudinaryLoaderMobile, isCloudinaryUrl } from '@/lib/cloudinary-loader';

interface ImageGalleryProps {
  images: string[];
  mainImage: string;
  title: string;
}

export function ImageGallery({ images, mainImage, title }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect if device is mobile using matchMedia for better performance
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };
    
    // Set initial value
    handleChange(mediaQuery);
    
    // Listen for changes (modern browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);
  
  // Combine main image with gallery images, filter out empty strings and duplicates
  const allImages = useMemo(() => {
    const combined = mainImage ? [mainImage, ...images] : images;
    return [...new Set(combined)].filter(Boolean);
  }, [mainImage, images]);

  // Pre-compute which images are Cloudinary URLs to avoid repeated checks
  const imageCloudinaryStatus = useMemo(() => {
    return allImages.map(img => isCloudinaryUrl(img));
  }, [allImages]);

  const openGallery = (index: number) => {
    if (allImages.length === 0) return;
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeGallery = () => {
    setIsOpen(false);
  };

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        closeGallery();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
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

  // If no images available, show placeholder
  if (allImages.length === 0) {
    return (
      <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400">Brak zdjęć</span>
      </div>
    );
  }

  return (
    <>
      {/* Main Image - clickable to open gallery */}
      <div 
        className="relative aspect-video rounded-lg overflow-hidden shadow-xl cursor-pointer group"
        onClick={() => openGallery(0)}
      >
        <Image
          src={allImages[0]}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
          quality={95}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
        />
        {allImages.length > 1 && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 px-4 py-2 rounded-lg">
              Kliknij aby otworzyć galerię ({allImages.length} zdjęć)
            </span>
          </div>
        )}
      </div>

      {/* Thumbnail Gallery - visible below main image */}
      {allImages.length > 1 && (
        <div className="mt-4">
          {/* Desktop: grid layout */}
          <div className="hidden md:grid grid-cols-4 lg:grid-cols-5 gap-3">
            {allImages.slice(1).map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden shadow-md cursor-pointer group"
                onClick={() => openGallery(index + 1)}
              >
                <Image
                  src={image}
                  alt={`${title} - miniatura ${index + 2}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  quality={85}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="md:hidden flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
            {allImages.slice(1).map((image, index) => (
              <div
                key={index}
                className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden shadow-md cursor-pointer snap-start"
                onClick={() => openGallery(index + 1)}
              >
                <Image
                  src={image}
                  alt={`${title} - miniatura ${index + 2}`}
                  fill
                  className="object-cover"
                  sizes="128px"
                  quality={85}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeGallery}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            onClick={closeGallery}
            aria-label="Zamknij galerię"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 text-white text-sm md:text-base z-10">
            {currentIndex + 1} / {allImages.length}
          </div>

          {/* Previous button */}
          {allImages.length > 1 && (
            <button
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 p-2 hover:bg-white/10 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              aria-label="Poprzednie zdjęcie"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          )}

          {/* Current image */}
          <div 
            className="relative w-full h-full mx-0 px-12 md:max-w-5xl md:max-h-[80vh] md:mx-16 md:px-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allImages[currentIndex]}
              alt={`${title} - zdjęcie ${currentIndex + 1}`}
              fill
              className={isMobile ? "object-cover" : "object-contain"}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1200px"
              quality={95}
              loader={imageCloudinaryStatus[currentIndex] ? (isMobile ? cloudinaryLoaderMobile : cloudinaryLoader) : undefined}
              unoptimized={!imageCloudinaryStatus[currentIndex]}
            />
          </div>

          {/* Next button */}
          {allImages.length > 1 && (
            <button
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 p-2 hover:bg-white/10 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Następne zdjęcie"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          )}

          {/* Thumbnails - hidden on mobile for better viewing experience */}
          {allImages.length > 1 && (
            <div className="hidden md:flex absolute bottom-4 left-1/2 transform -translate-x-1/2 gap-2 overflow-x-auto max-w-full px-4">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  className={`relative w-16 h-16 rounded overflow-hidden flex-shrink-0 ${
                    index === currentIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                  } transition-opacity`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                >
                  <Image
                    src={image}
                    alt={`Miniatura ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                    quality={80}
                    loader={imageCloudinaryStatus[index] ? cloudinaryLoader : undefined}
                    unoptimized={!imageCloudinaryStatus[index]}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
