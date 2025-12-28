'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { getCategoryDisplayName } from '@/lib/realizacje-helpers';
import { Badge } from '@/components/ui/badge';
import cloudinaryLoader, { cloudinaryLoaderMobile, isCloudinaryUrl } from '@/lib/cloudinary-loader';

import { RealizacjaCategory } from '@/types/realizacje';

// Cookie helper functions
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days: number = 365) => {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

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
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Ref for the fullscreen viewer container
  const viewerRef = useRef<HTMLDivElement>(null);

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

  // Check if user has seen swipe hint before
  useEffect(() => {
    if (isOpen) {
      const hasSeenHint = getCookie('gallery_swipe_hint_seen');
      if (!hasSeenHint) {
        setShowSwipeHint(true);
        // Auto-hide after 3 seconds
        const timer = setTimeout(() => {
          setShowSwipeHint(false);
          setCookie('gallery_swipe_hint_seen', 'true', 365);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen]);

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeGallery = () => {
    setIsOpen(false);
  };

  const dismissSwipeHint = () => {
    setShowSwipeHint(false);
    setCookie('gallery_swipe_hint_seen', 'true', 365);
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

  // Handle touch swipe for mobile with continuous preview
  useEffect(() => {
    if (!isOpen || !isMobile) return;
    
    const viewer = viewerRef.current;
    if (!viewer) return;

    let touchStartY = 0;
    let hasMoved = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      hasMoved = false;
      // Don't set isDragging here - wait for actual movement
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent page scroll
      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartY;
      
      // Only start dragging if moved more than 5px (prevents accidental drags)
      if (!hasMoved && Math.abs(diff) > 5) {
        hasMoved = true;
        setIsDragging(true);
      }
      
      if (hasMoved) {
        // Apply drag with some resistance for better feel
        setDragOffset(diff * 0.8);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!hasMoved) {
        // No movement, just a tap
        return;
      }
      
      setIsDragging(false);
      const swipeDistance = dragOffset;
      
      // Threshold for switching images (30% of screen height)
      const threshold = window.innerHeight * 0.3;
      
      if (Math.abs(swipeDistance) > threshold) {
        // Swipe direction: positive dragOffset = finger moved down (previous)
        //                  negative dragOffset = finger moved up (next)
        if (swipeDistance < 0) {
          // Swiped up - show next (increase slide number)
          goToNext();
        } else {
          // Swiped down - show previous (decrease slide number)
          goToPrevious();
        }
      }
      
      // Reset drag offset
      setDragOffset(0);
      hasMoved = false;
    };

    viewer.addEventListener('touchstart', handleTouchStart, { passive: true });
    viewer.addEventListener('touchmove', handleTouchMove, { passive: false });
    viewer.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      viewer.removeEventListener('touchstart', handleTouchStart);
      viewer.removeEventListener('touchmove', handleTouchMove);
      viewer.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, isMobile, goToNext, goToPrevious, dragOffset]);

  // Preload adjacent images for smoother transitions
  // Preload up to 5 images ahead and 1 behind for optimal experience
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

      {/* Fullscreen Viewer - Vertical Scroll (TikTok style) */}
      {isOpen && (
        <div 
          ref={viewerRef}
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

          {/* Swipe hint overlay - shown on first visit */}
          {showSwipeHint && (
            <div 
              className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={dismissSwipeHint}
            >
              <div className="text-center text-white px-6">
                <div className="mb-4">
                  <ChevronUp className="w-12 h-12 mx-auto mb-2 animate-bounce" />
                  <p className="text-lg font-semibold mb-2">Przesuń w górę lub w dół</p>
                  <p className="text-sm opacity-80">aby przeglądać zdjęcia</p>
                  <ChevronDown className="w-12 h-12 mx-auto mt-2 animate-bounce" style={{ animationDelay: '0.5s' }} />
                </div>
                <p className="text-xs opacity-60 mt-6">Kliknij aby zamknąć</p>
              </div>
            </div>
          )}

          {/* Continuous scroll container - shows current and adjacent images */}
          <div 
            className="relative w-full h-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="absolute w-full"
              style={{
                height: '300%',
                top: '-100%',
                transform: `translateY(${dragOffset}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease-out'
              }}
            >
              {/* Previous image */}
              <div className="absolute top-0 left-0 w-full h-1/3">
                <NextImage
                  src={images[(currentIndex - 1 + images.length) % images.length].url}
                  alt={images[(currentIndex - 1 + images.length) % images.length].realizacjaTitle}
                  fill
                  className={isMobile ? "object-cover" : "object-contain"}
                  sizes="100vw"
                  quality={80}
                  loader={imageCloudinaryStatus[(currentIndex - 1 + images.length) % images.length] ? (isMobile ? cloudinaryLoaderMobile : cloudinaryLoader) : undefined}
                  unoptimized={!imageCloudinaryStatus[(currentIndex - 1 + images.length) % images.length]}
                />
              </div>

              {/* Current image */}
              <div className="absolute top-1/3 left-0 w-full h-1/3">
                <NextImage
                  src={currentImage.url}
                  alt={currentImage.realizacjaTitle}
                  fill
                  className={isMobile ? "object-cover" : "object-contain"}
                  sizes="100vw"
                  quality={80}
                  priority
                  loader={imageCloudinaryStatus[currentIndex] ? (isMobile ? cloudinaryLoaderMobile : cloudinaryLoader) : undefined}
                  unoptimized={!imageCloudinaryStatus[currentIndex]}
                />
              </div>

              {/* Next image */}
              <div className="absolute top-2/3 left-0 w-full h-1/3">
                <NextImage
                  src={images[(currentIndex + 1) % images.length].url}
                  alt={images[(currentIndex + 1) % images.length].realizacjaTitle}
                  fill
                  className={isMobile ? "object-cover" : "object-contain"}
                  sizes="100vw"
                  quality={80}
                  loader={imageCloudinaryStatus[(currentIndex + 1) % images.length] ? (isMobile ? cloudinaryLoaderMobile : cloudinaryLoader) : undefined}
                  unoptimized={!imageCloudinaryStatus[(currentIndex + 1) % images.length]}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
