'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { getCategoryDisplayName } from '@/lib/realizacje-helpers';
import { Badge } from '@/components/ui/badge';
import cloudinaryLoader, { cloudinaryLoaderMobile, isCloudinaryUrl } from '@/lib/cloudinary-loader';
import useEmblaCarousel from 'embla-carousel-react';

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
  
  // Embla carousel for mobile - vertical axis
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    axis: 'y',
    loop: true,
    skipSnaps: false,
    duration: 20,
  });

  // Pre-compute which images are Cloudinary URLs to avoid repeated checks
  const imageCloudinaryStatus = useMemo(() => {
    return images.map(img => isCloudinaryUrl(img.url));
  }, [images]);

  // Generate tiny blur placeholder for Cloudinary images
  const getBlurDataURL = useCallback((url: string, isCloudinary: boolean) => {
    if (!isCloudinary) return undefined;
    
    // Generate a tiny 10px wide blurred version for placeholder
    try {
      const loader = cloudinaryLoader({
        src: url,
        width: 10,
        quality: 10
      });
      return loader;
    } catch {
      return undefined;
    }
  }, []);

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

  // Sync embla carousel with current index
  useEffect(() => {
    if (emblaApi && isOpen) {
      emblaApi.scrollTo(currentIndex, true);
    }
  }, [emblaApi, currentIndex, isOpen]);

  // Update current index when embla slide changes
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeGallery = () => {
    setIsOpen(false);
  };

  const goToPrevious = useCallback(() => {
    if (emblaApi && isMobile) {
      emblaApi.scrollPrev();
    } else {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  }, [emblaApi, isMobile, images.length]);

  const goToNext = useCallback(() => {
    if (emblaApi && isMobile) {
      emblaApi.scrollNext();
    } else {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  }, [emblaApi, isMobile, images.length]);

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

  // Preload adjacent images for smoother transitions
  useEffect(() => {
    if (!isOpen) return;

    const preloadImage = (index: number) => {
      // Handle wrap-around for circular navigation
      let wrappedIndex = index;
      if (index < 0) {
        wrappedIndex = images.length - 1;
      } else if (index >= images.length) {
        wrappedIndex = 0;
      }
      
      const img = new Image();
      const imageUrl = images[wrappedIndex].url;
      
      // Use Cloudinary loader for optimization if applicable
      if (imageCloudinaryStatus[wrappedIndex]) {
        const loader = isMobile ? cloudinaryLoaderMobile : cloudinaryLoader;
        img.src = loader({ 
          src: imageUrl, 
          width: isMobile ? 800 : 1920,
          quality: 80 
        });
      } else {
        img.src = imageUrl;
      }
    };

    // Preload previous image
    preloadImage(currentIndex - 1);
    
    // Preload next 5 images for seamless scrolling
    for (let i = 1; i <= 5; i++) {
      preloadImage(currentIndex + i);
    }
  }, [currentIndex, isOpen, images, imageCloudinaryStatus, isMobile]);

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
                <NextImage
                  src={image.url}
                  alt={image.realizacjaTitle}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  quality={75}
                  loading={index < 8 ? "eager" : "lazy"}
                  placeholder={imageCloudinaryStatus[index] ? "blur" : "empty"}
                  blurDataURL={getBlurDataURL(image.url, imageCloudinaryStatus[index])}
                  loader={imageCloudinaryStatus[index] ? cloudinaryLoader : undefined}
                  unoptimized={!imageCloudinaryStatus[index]}
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

      {/* Fullscreen Viewer - With Embla Carousel for mobile */}
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

          {/* Mobile: Embla Carousel with vertical scroll */}
          {isMobile ? (
            <div className="overflow-hidden h-full w-full" ref={emblaRef}>
              <div className="flex flex-col h-full">
                {images.map((image, index) => (
                  <div 
                    key={index} 
                    className="flex-[0_0_100%] min-h-0 relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <NextImage
                      src={image.url}
                      alt={image.realizacjaTitle}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      quality={80}
                      priority={index === currentIndex}
                      loader={imageCloudinaryStatus[index] ? cloudinaryLoaderMobile : undefined}
                      unoptimized={!imageCloudinaryStatus[index]}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Desktop: Simple image viewer */
            <div 
              className="relative w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <NextImage
                src={currentImage.url}
                alt={currentImage.realizacjaTitle}
                fill
                className="object-contain"
                sizes="100vw"
                quality={80}
                priority
                loader={imageCloudinaryStatus[currentIndex] ? cloudinaryLoader : undefined}
                unoptimized={!imageCloudinaryStatus[currentIndex]}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
