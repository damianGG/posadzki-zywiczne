/**
 * Google Drive Browser Agent
 * 
 * Agent działający w przeglądarce do automatycznego pobierania danych z Google Drive
 * i aktualizacji statycznych stron realizacji w Next.js.
 * 
 * FUNKCJONALNOŚĆ:
 * - Autoryzacja OAuth 2.0 z Google Drive API
 * - Pobieranie listy folderów realizacji
 * - Odczyt plików JSON/YAML z opisami
 * - Pobieranie metadanych plików graficznych
 * - Aktualizacja lokalnych plików JSON
 * - Wywoływanie revalidation w Vercel
 */

import { Realizacja } from '@/types/realizacje';

// Typy dla Google Drive API
interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  webContentLink?: string;
  webViewLink?: string;
  thumbnailLink?: string;
}

interface GoogleDriveFileList {
  files: GoogleDriveFile[];
  nextPageToken?: string;
}

interface RealizacjaDescriptor {
  title: string;
  slug: string;
  location: string;
  area: string;
  technology: string;
  description: string;
  category?: string;
  type?: string;
  tags?: string[];
  color?: string;
  duration?: string;
  features?: string[];
  keywords?: string[];
  clientTestimonial?: {
    content: string;
    author: string;
  };
}

// Konfiguracja Google Drive API
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Status autoryzacji
let isInitialized = false;
let isAuthorized = false;

/**
 * Klasa agenta Google Drive
 */
export class GoogleDriveAgent {
  private apiKey: string;
  private clientId: string;
  private rootFolderId: string;
  private tokenClient: any;
  private accessToken: string | null = null;

  constructor(apiKey: string, clientId: string, rootFolderId: string) {
    this.apiKey = apiKey;
    this.clientId = clientId;
    this.rootFolderId = rootFolderId;
  }

  /**
   * Inicjalizacja Google API Client
   */
  async initialize(): Promise<void> {
    if (isInitialized) {
      return;
    }

    try {
      // Ładowanie Google API Client Library
      await this.loadGapiScript();
      await this.loadGsiScript();
      
      // Inicjalizacja gapi client
      await new Promise<void>((resolve, reject) => {
        gapi.load('client', async () => {
          try {
            await gapi.client.init({
              apiKey: this.apiKey,
              discoveryDocs: DISCOVERY_DOCS,
            });
            isInitialized = true;
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });

      console.log('✓ Google Drive API zainicjalizowane');
    } catch (error) {
      console.error('Błąd inicjalizacji Google Drive API:', error);
      throw error;
    }
  }

  /**
   * Ładowanie skryptu Google API
   */
  private async loadGapiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof gapi !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Nie udało się załadować Google API'));
      document.head.appendChild(script);
    });
  }

  /**
   * Ładowanie skryptu Google Sign-In
   */
  private async loadGsiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google.accounts) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Nie udało się załadować Google Sign-In'));
      document.head.appendChild(script);
    });
  }

  /**
   * Autoryzacja użytkownika przez OAuth 2.0
   */
  async authorize(): Promise<void> {
    if (isAuthorized && this.accessToken) {
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        this.tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: this.clientId,
          scope: SCOPES,
          callback: (response: any) => {
            if (response.error) {
              reject(response);
              return;
            }

            this.accessToken = response.access_token;
            gapi.client.setToken({ access_token: this.accessToken });
            isAuthorized = true;
            console.log('✓ Autoryzacja udana');
            resolve();
          },
        });

        this.tokenClient.requestAccessToken({ prompt: 'consent' });
      } catch (error) {
        console.error('Błąd autoryzacji:', error);
        reject(error);
      }
    });
  }

  /**
   * Wylogowanie użytkownika
   */
  signOut(): void {
    if (this.accessToken) {
      google.accounts.oauth2.revoke(this.accessToken, () => {
        console.log('✓ Wylogowano');
      });
      this.accessToken = null;
      isAuthorized = false;
    }
  }

  /**
   * Pobieranie listy folderów realizacji z Google Drive
   */
  async getFolders(): Promise<GoogleDriveFile[]> {
    try {
      const response = await gapi.client.drive.files.list({
        q: `'${this.rootFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)',
        orderBy: 'name',
      });

      const folders = response.result.files || [];
      console.log(`✓ Znaleziono ${folders.length} folderów realizacji`);
      return folders;
    } catch (error) {
      console.error('Błąd pobierania folderów:', error);
      throw error;
    }
  }

  /**
   * Pobieranie podfolderu "media" z folderu realizacji
   */
  async getMediaFolder(parentFolderId: string): Promise<GoogleDriveFile | null> {
    try {
      const response = await gapi.client.drive.files.list({
        q: `'${parentFolderId}' in parents and name='media' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)',
      });

      const folders = response.result.files || [];
      return folders.length > 0 ? folders[0] : null;
    } catch (error) {
      console.error('Błąd pobierania folderu media:', error);
      return null;
    }
  }

  /**
   * Pobieranie pliku opisowego (JSON/YAML) z folderu media
   */
  async getDescriptorFile(mediaFolderId: string): Promise<GoogleDriveFile | null> {
    try {
      const response = await gapi.client.drive.files.list({
        q: `'${mediaFolderId}' in parents and (name contains '.json' or name contains '.yaml' or name contains '.yml') and trashed=false`,
        fields: 'files(id, name, mimeType)',
      });

      const files = response.result.files || [];
      return files.length > 0 ? files[0] : null;
    } catch (error) {
      console.error('Błąd pobierania pliku opisowego:', error);
      return null;
    }
  }

  /**
   * Odczyt zawartości pliku tekstowego
   */
  async readFileContent(fileId: string): Promise<string> {
    try {
      const response = await gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media',
      });

      return response.body;
    } catch (error) {
      console.error('Błąd odczytu pliku:', error);
      throw error;
    }
  }

  /**
   * Pobieranie listy plików graficznych z folderu media
   */
  async getImageFiles(mediaFolderId: string): Promise<GoogleDriveFile[]> {
    try {
      const response = await gapi.client.drive.files.list({
        q: `'${mediaFolderId}' in parents and (mimeType contains 'image/') and trashed=false`,
        fields: 'files(id, name, mimeType, webContentLink, webViewLink, thumbnailLink)',
        orderBy: 'name',
      });

      const images = response.result.files || [];
      console.log(`  ✓ Znaleziono ${images.length} plików graficznych`);
      return images;
    } catch (error) {
      console.error('Błąd pobierania plików graficznych:', error);
      return [];
    }
  }

  /**
   * Parsowanie pliku opisowego (JSON lub YAML)
   */
  parseDescriptor(content: string, fileName: string): RealizacjaDescriptor | null {
    try {
      if (fileName.endsWith('.json')) {
        return JSON.parse(content);
      } else if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) {
        // Prosty parser YAML (dla prostych struktur)
        // W produkcji warto użyć biblioteki js-yaml
        console.warn('YAML parsing - używamy prostego parsera');
        return this.parseSimpleYaml(content);
      }
      return null;
    } catch (error) {
      console.error('Błąd parsowania deskryptora:', error);
      return null;
    }
  }

  /**
   * Prosty parser YAML (tylko dla podstawowych struktur klucz: wartość)
   */
  private parseSimpleYaml(content: string): RealizacjaDescriptor {
    const lines = content.split('\n');
    const result: any = {};
    let currentKey = '';
    let currentArray: string[] = [];
    let inArray = false;

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      // Obsługa array
      if (trimmed.startsWith('- ')) {
        if (inArray) {
          currentArray.push(trimmed.substring(2).trim());
        }
        continue;
      }

      // Koniec array
      if (inArray && !trimmed.startsWith('- ')) {
        result[currentKey] = currentArray;
        inArray = false;
        currentArray = [];
      }

      // Klucz: wartość
      if (trimmed.includes(':')) {
        const [key, ...valueParts] = trimmed.split(':');
        const value = valueParts.join(':').trim();
        
        if (value === '') {
          // Początek array
          currentKey = key.trim();
          inArray = true;
          currentArray = [];
        } else {
          result[key.trim()] = value;
        }
      }
    }

    // Zapisz ostatnią tablicę jeśli jest
    if (inArray) {
      result[currentKey] = currentArray;
    }

    return result as RealizacjaDescriptor;
  }

  /**
   * Konwersja deskryptora na obiekt Realizacja
   */
  convertToRealizacja(
    descriptor: RealizacjaDescriptor,
    images: GoogleDriveFile[]
  ): Partial<Realizacja> {
    // Mapowanie obrazów
    const imageUrls = images.map(img => {
      // W produkcji, obrazy powinny być pobrane i zapisane lokalnie
      // Tutaj używamy thumbnailLink jako placeholder
      return img.thumbnailLink || `/images/realizacje/${descriptor.slug}/${img.name}`;
    });

    const mainImage = imageUrls[0] || '/images/placeholder.jpg';
    const galleryImages = imageUrls.slice(1);

    return {
      slug: descriptor.slug,
      title: descriptor.title,
      description: descriptor.description,
      category: (descriptor.category as any) || 'mieszkania-domy',
      type: (descriptor.type as any) || 'indywidualna',
      location: descriptor.location,
      date: new Date().toISOString().split('T')[0],
      tags: descriptor.tags || [],
      images: {
        main: mainImage,
        gallery: galleryImages,
      },
      details: {
        surface: descriptor.area,
        system: descriptor.technology,
        color: descriptor.color,
        duration: descriptor.duration,
      },
      features: descriptor.features || [],
      keywords: descriptor.keywords || [],
      clientTestimonial: descriptor.clientTestimonial,
    };
  }

  /**
   * Główna metoda synchronizacji - pobiera wszystkie realizacje z Google Drive
   */
  async syncRealizations(): Promise<Array<{ slug: string; data: Partial<Realizacja>; status: string }>> {
    const results: Array<{ slug: string; data: Partial<Realizacja>; status: string }> = [];

    try {
      console.log('🔄 Rozpoczęcie synchronizacji realizacji z Google Drive...');
      
      // Pobierz listę folderów
      const folders = await this.getFolders();

      for (const folder of folders) {
        console.log(`\n📁 Przetwarzanie: ${folder.name}`);

        try {
          // Znajdź folder media
          const mediaFolder = await this.getMediaFolder(folder.id);
          if (!mediaFolder) {
            console.warn(`  ⚠ Brak folderu 'media' w ${folder.name}`);
            results.push({
              slug: folder.name,
              data: {} as any,
              status: 'error: brak folderu media',
            });
            continue;
          }

          // Pobierz plik opisowy
          const descriptorFile = await this.getDescriptorFile(mediaFolder.id);
          if (!descriptorFile) {
            console.warn(`  ⚠ Brak pliku JSON/YAML w ${folder.name}/media`);
            results.push({
              slug: folder.name,
              data: {} as any,
              status: 'error: brak pliku opisowego',
            });
            continue;
          }

          // Odczytaj zawartość pliku opisowego
          console.log(`  📄 Odczyt pliku: ${descriptorFile.name}`);
          const content = await this.readFileContent(descriptorFile.id);
          const descriptor = this.parseDescriptor(content, descriptorFile.name);

          if (!descriptor) {
            console.warn(`  ⚠ Nie udało się sparsować ${descriptorFile.name}`);
            results.push({
              slug: folder.name,
              data: {} as any,
              status: 'error: błąd parsowania',
            });
            continue;
          }

          // Pobierz obrazy
          const images = await this.getImageFiles(mediaFolder.id);

          // Konwertuj na obiekt Realizacja
          const realizacjaData = this.convertToRealizacja(descriptor, images);

          results.push({
            slug: descriptor.slug,
            data: realizacjaData,
            status: 'success',
          });

          console.log(`  ✓ Pomyślnie przetworzono realizację: ${descriptor.title}`);
        } catch (error) {
          console.error(`  ✗ Błąd przetwarzania ${folder.name}:`, error);
          results.push({
            slug: folder.name,
            data: {} as any,
            status: `error: ${error}`,
          });
        }
      }

      console.log(`\n✓ Synchronizacja zakończona. Przetworzono ${results.length} realizacji.`);
      return results;
    } catch (error) {
      console.error('Błąd podczas synchronizacji:', error);
      throw error;
    }
  }

  /**
   * Zapisanie danych realizacji do API
   */
  async saveRealizacja(realizacjaData: Partial<Realizacja>): Promise<boolean> {
    try {
      const response = await fetch('/api/realizacje/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(realizacjaData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Błąd zapisywania realizacji:', error);
      return false;
    }
  }

  /**
   * Wywołanie revalidation w Vercel
   */
  async triggerRevalidation(slug: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/revalidate?path=/realizacje/${slug}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`✓ Revalidation wywołany dla: /realizacje/${slug}`);
      return true;
    } catch (error) {
      console.error('Błąd revalidation:', error);
      return false;
    }
  }
}

/**
 * Funkcja pomocnicza do utworzenia instancji agenta
 */
export function createGoogleDriveAgent(): GoogleDriveAgent | null {
  if (typeof window === 'undefined') {
    console.error('Google Drive Agent może działać tylko w przeglądarce');
    return null;
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY;
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID;
  const rootFolderId = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_ROOT_FOLDER_ID;

  if (!apiKey || !clientId || !rootFolderId) {
    console.error('Brak wymaganych zmiennych środowiskowych Google Drive');
    return null;
  }

  return new GoogleDriveAgent(apiKey, clientId, rootFolderId);
}

// Eksport typu dla deklaracji globalnych
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

declare const gapi: any;
declare const google: any;
