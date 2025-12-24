'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Cloud, Loader2 } from 'lucide-react';

interface GoogleDrivePickerProps {
  onFilesPicked: (files: File[]) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

export default function GoogleDrivePicker({ onFilesPicked, disabled }: GoogleDrivePickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [error, setError] = useState<string>('');

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const appId = process.env.NEXT_PUBLIC_GOOGLE_APP_ID;

  useEffect(() => {
    // Check if API credentials are configured
    if (!apiKey || !clientId || !appId) {
      console.warn('Google Drive Picker: API credentials not configured');
      return;
    }

    // Load Google API scripts
    const loadGoogleApi = () => {
      // Load Google API script
      if (!document.getElementById('google-api-script')) {
        const gapiScript = document.createElement('script');
        gapiScript.id = 'google-api-script';
        gapiScript.src = 'https://apis.google.com/js/api.js';
        gapiScript.async = true;
        gapiScript.defer = true;
        gapiScript.onload = () => {
          window.gapi.load('client:picker', () => {
            window.gapi.client.load('drive', 'v3', () => {
              setIsApiLoaded(true);
            });
          });
        };
        document.body.appendChild(gapiScript);
      }

      // Load Google Sign-In script
      if (!document.getElementById('google-signin-script')) {
        const gsiScript = document.createElement('script');
        gsiScript.id = 'google-signin-script';
        gsiScript.src = 'https://accounts.google.com/gsi/client';
        gsiScript.async = true;
        gsiScript.defer = true;
        document.body.appendChild(gsiScript);
      }
    };

    loadGoogleApi();
  }, [apiKey, clientId, appId]);

  const handleAuthClick = () => {
    if (!apiKey || !clientId || !appId) {
      setError('Google Drive Picker nie jest skonfigurowany. Skontaktuj się z administratorem.');
      return;
    }

    setIsLoading(true);
    setError('');

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId!,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      callback: (response: any) => {
        if (response.error) {
          setError('Nie udało się zalogować do Google Drive');
          setIsLoading(false);
          return;
        }
        createPicker(response.access_token);
      },
    });

    tokenClient.requestAccessToken();
  };

  const createPicker = (accessToken: string) => {
    const picker = new window.google.picker.PickerBuilder()
      .setAppId(appId!)
      .setOAuthToken(accessToken)
      .addView(
        new window.google.picker.DocsView(window.google.picker.ViewId.DOCS_IMAGES)
          .setIncludeFolders(true)
          .setSelectFolderEnabled(false)
      )
      .addView(
        new window.google.picker.DocsView(window.google.picker.ViewId.DOCS_IMAGES_AND_VIDEOS)
          .setIncludeFolders(true)
      )
      .addView(
        new window.google.picker.PhotosView()
          .setType(window.google.picker.PhotosView.Type.FLAT)
      )
      .setCallback(async (data: any) => {
        if (data.action === window.google.picker.Action.PICKED) {
          const files = data.docs;
          await downloadFilesFromDrive(files, accessToken);
        } else if (data.action === window.google.picker.Action.CANCEL) {
          setIsLoading(false);
        }
      })
      .setTitle('Wybierz zdjęcia')
      .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
      .build();

    picker.setVisible(true);
  };

  const downloadFilesFromDrive = async (files: any[], accessToken: string) => {
    try {
      const downloadedFiles: File[] = [];

      for (const file of files) {
        // Only process image files
        if (!file.mimeType?.startsWith('image/')) {
          continue;
        }

        try {
          // Download file from Google Drive
          const response = await fetch(
            `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (!response.ok) {
            console.error(`Failed to download ${file.name}`);
            continue;
          }

          const blob = await response.blob();
          
          // Convert blob to File
          const downloadedFile = new File([blob], file.name, {
            type: file.mimeType,
          });

          downloadedFiles.push(downloadedFile);
        } catch (err) {
          console.error(`Error downloading ${file.name}:`, err);
        }
      }

      if (downloadedFiles.length > 0) {
        onFilesPicked(downloadedFiles);
      } else {
        setError('Nie udało się pobrać żadnych zdjęć');
      }
    } catch (err) {
      console.error('Error downloading files:', err);
      setError('Wystąpił błąd podczas pobierania zdjęć');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if API is not configured
  if (!apiKey || !clientId || !appId) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleAuthClick}
        disabled={disabled || isLoading || !isApiLoaded}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Ładowanie...
          </>
        ) : (
          <>
            <Cloud className="w-4 h-4 mr-2" />
            Wybierz z Dysku Google
          </>
        )}
      </Button>
      
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}

      {!isApiLoaded && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Ładowanie Google Drive API...
        </p>
      )}
    </div>
  );
}
