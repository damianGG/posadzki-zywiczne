'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, Loader2, Upload } from 'lucide-react';

interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

interface CloudinaryUploadWidgetProps {
  onUploadComplete: (results: CloudinaryUploadResult[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function CloudinaryUploadWidget({
  onUploadComplete,
  maxFiles = 10,
  disabled = false,
}: CloudinaryUploadWidgetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Load Cloudinary script
  const loadCloudinaryScript = () => {
    return new Promise((resolve, reject) => {
      if (window.cloudinary) {
        resolve(window.cloudinary);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      script.onload = () => {
        setIsScriptLoaded(true);
        resolve(window.cloudinary);
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const openUploadWidget = async () => {
    try {
      setIsLoading(true);
      await loadCloudinaryScript();

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'posadzki-realizacje';

      if (!cloudName) {
        alert('Błąd konfiguracji Cloudinary. Brak NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.');
        setIsLoading(false);
        return;
      }

      const uploadedImages: CloudinaryUploadResult[] = [];

      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: cloudName,
          uploadPreset: uploadPreset,
          multiple: true,
          maxFiles: maxFiles,
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
          maxFileSize: 10485760, // 10MB per file (Cloudinary free tier limit)
          maxImageWidth: 4000,
          maxImageHeight: 4000,
          cropping: false,
          folder: 'realizacje',
          sources: ['local', 'url', 'camera'],
          showAdvancedOptions: false,
          showPoweredBy: false,
          language: 'pl',
          text: {
            pl: {
              or: 'lub',
              back: 'Wstecz',
              advanced: 'Zaawansowane',
              close: 'Zamknij',
              no_results: 'Brak wyników',
              search_placeholder: 'Szukaj...',
              about_uw: 'O Upload Widget',
              menu: {
                files: 'Moje pliki',
                web: 'Adres URL',
                camera: 'Kamera',
              },
              local: {
                browse: 'Przeglądaj',
                dd_title_single: 'Przeciągnij i upuść zdjęcie tutaj',
                dd_title_multi: 'Przeciągnij i upuść zdjęcia tutaj',
                drop_title_single: 'Upuść plik aby przesłać',
                drop_title_multiple: 'Upuść pliki aby przesłać',
              },
              camera: {
                capture: 'Zrób zdjęcie',
                cancel: 'Anuluj',
                take_pic: 'Zrób zdjęcie i prześlij',
                explanation: 'Upewnij się że kamera jest włączona',
              },
            },
          },
        },
        (error: any, result: any) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            alert(`Błąd przesyłania: ${error.message || 'Nieznany błąd'}`);
            setIsLoading(false);
            return;
          }

          if (result.event === 'success') {
            uploadedImages.push({
              url: result.info.secure_url,
              publicId: result.info.public_id,
              width: result.info.width,
              height: result.info.height,
              format: result.info.format,
              bytes: result.info.bytes,
            });
          }

          if (result.event === 'close') {
            setIsLoading(false);
            if (uploadedImages.length > 0) {
              onUploadComplete(uploadedImages);
            }
          }
        }
      );

      widget.open();
    } catch (error) {
      console.error('Error loading Cloudinary widget:', error);
      alert('Nie udało się załadować narzędzia do przesyłania zdjęć.');
      setIsLoading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
      <Button
        type="button"
        onClick={openUploadWidget}
        disabled={disabled || isLoading}
        variant="outline"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Ładowanie...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5 mr-2" />
            Prześlij przez Cloudinary
          </>
        )}
      </Button>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
        ☁️ Bezpośrednie przesyłanie do Cloudinary
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Max {maxFiles} zdjęć, do 10MB każde
      </p>
    </div>
  );
}
