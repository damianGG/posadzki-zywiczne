/**
 * Local Realizacje Scanner
 * 
 * Scans local filesystem for realizacje folders in public/realizacje/
 * and creates/updates JSON files in data/realizacje/
 * 
 * Expected folder structure:
 * public/realizacje/[miasto]-[ulica]-[typ]/
 *   - opis.json (descriptor file with project details)
 *   - *.jpg, *.png, *.webp (image files)
 * 
 * Where [typ] can be: taras, balkon, garaz, mieszkanie, gastronomia
 */

import fs from 'fs';
import path from 'path';
import { Realizacja, RealizacjaCategory, RealizacjaType } from '@/types/realizacje';

// Mapowanie typów z nazwy folderu na kategorie
const TYPE_TO_CATEGORY_MAP: Record<string, RealizacjaCategory> = {
  'taras': 'balkony-tarasy',
  'balkon': 'balkony-tarasy',
  'garaz': 'mieszkania-domy',
  'mieszkanie': 'mieszkania-domy',
  'dom': 'mieszkania-domy',
  'gastronomia': 'pomieszczenia-czyste',
  'kuchnia': 'kuchnie',
  'schody': 'schody',
};

interface LocalDescriptor {
  title: string;
  description: string;
  location?: string;
  area?: string;
  technology?: string;
  type?: 'indywidualna' | 'komercyjna';
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

interface ScanResult {
  folderName: string;
  slug: string;
  status: 'new' | 'updated' | 'unchanged' | 'error';
  message?: string;
  realizacja?: Realizacja;
}

/**
 * Extrakcja typu z nazwy folderu
 * Format: [miasto]-[ulica]-[typ]
 */
function extractTypeFromFolderName(folderName: string): string | null {
  const parts = folderName.split('-');
  const lastPart = parts[parts.length - 1].toLowerCase();
  
  // Sprawdź czy ostatnia część to znany typ
  if (TYPE_TO_CATEGORY_MAP[lastPart]) {
    return lastPart;
  }
  
  return null;
}

/**
 * Generowanie slug z nazwy folderu
 * Obsługuje polskie znaki specjalne
 */
function generateSlug(folderName: string): string {
  // Mapowanie polskich znaków
  const polishChars: Record<string, string> = {
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
    'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
    'Ą': 'a', 'Ć': 'c', 'Ę': 'e', 'Ł': 'l', 'Ń': 'n',
    'Ó': 'o', 'Ś': 's', 'Ź': 'z', 'Ż': 'z'
  };

  return folderName
    .toLowerCase()
    .split('')
    .map(char => polishChars[char] || char)
    .join('')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Pobranie kategorii na podstawie typu
 */
function getCategoryFromType(type: string): RealizacjaCategory {
  return TYPE_TO_CATEGORY_MAP[type] || 'mieszkania-domy';
}

/**
 * Sprawdzenie czy plik jest obrazem
 */
function isImageFile(filename: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const ext = path.extname(filename).toLowerCase();
  return imageExtensions.includes(ext);
}

/**
 * Skanowanie pojedynczego folderu realizacji
 */
export async function scanRealizacjaFolder(folderPath: string, folderName: string): Promise<ScanResult> {
  const result: ScanResult = {
    folderName,
    slug: generateSlug(folderName),
    status: 'error',
  };

  try {
    // Sprawdź czy folder istnieje
    if (!fs.existsSync(folderPath)) {
      result.message = 'Folder nie istnieje';
      return result;
    }

    // Szukaj pliku opis.json
    const descriptorPath = path.join(folderPath, 'opis.json');
    if (!fs.existsSync(descriptorPath)) {
      result.message = 'Brak pliku opis.json w folderze';
      return result;
    }

    // Odczytaj deskryptor
    const descriptorContent = fs.readFileSync(descriptorPath, 'utf-8');
    const descriptor: LocalDescriptor = JSON.parse(descriptorContent);

    // Walidacja wymaganych pól
    if (!descriptor.title || !descriptor.description) {
      result.message = 'Brak wymaganych pól (title, description) w opis.json';
      return result;
    }

    // Pobierz typ z nazwy folderu
    const typeFromFolder = extractTypeFromFolderName(folderName);
    const category = typeFromFolder ? getCategoryFromType(typeFromFolder) : 'mieszkania-domy';

    // Pobierz listę plików obrazów
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(isImageFile);

    // Przygotuj ścieżki do obrazów (relatywne do public/)
    const imageUrls = imageFiles.map(filename => 
      `/realizacje/${folderName}/${filename}`
    );

    const mainImage = imageUrls[0] || '';
    const galleryImages = imageUrls.slice(1);

    // Utwórz obiekt Realizacja
    const realizacja: Realizacja = {
      slug: result.slug,
      title: descriptor.title,
      description: descriptor.description,
      category: category,
      type: descriptor.type || 'indywidualna',
      location: descriptor.location || folderName.split('-')[0] || '',
      date: new Date().toISOString().split('T')[0],
      tags: descriptor.tags || [],
      images: {
        main: mainImage,
        gallery: galleryImages,
      },
      details: {
        surface: descriptor.area || '',
        system: descriptor.technology || '',
        color: descriptor.color,
        duration: descriptor.duration,
      },
      features: descriptor.features || [],
      keywords: descriptor.keywords || [],
      clientTestimonial: descriptor.clientTestimonial,
    };

    // Sprawdź czy plik JSON już istnieje w data/realizacje/
    const dataPath = path.join(process.cwd(), 'data/realizacje', `${result.slug}.json`);
    const isExisting = fs.existsSync(dataPath);

    // Jeśli istnieje, sprawdź czy są różnice
    if (isExisting) {
      const existingContent = fs.readFileSync(dataPath, 'utf-8');
      const existingData = JSON.parse(existingContent);
      
      // Porównaj kluczowe pola
      const fieldsToCompare = ['title', 'description', 'location', 'area', 'technology'];
      const hasChanges = fieldsToCompare.some(field => {
        const existingValue = field === 'area' ? existingData.details?.surface : 
                             field === 'technology' ? existingData.details?.system :
                             existingData[field as keyof typeof existingData];
        const newValue = field === 'area' ? descriptor.area :
                        field === 'technology' ? descriptor.technology :
                        (descriptor as any)[field];
        return existingValue !== newValue;
      });
      
      if (!hasChanges) {
        result.status = 'unchanged';
        result.message = 'Realizacja już istnieje i nie wymaga aktualizacji';
      } else {
        result.status = 'updated';
        result.message = 'Realizacja została zaktualizowana';
      }
    } else {
      result.status = 'new';
      result.message = 'Nowa realizacja utworzona';
    }

    // Zapisz plik JSON
    if (result.status !== 'unchanged') {
      const dataDir = path.join(process.cwd(), 'data/realizacje');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      fs.writeFileSync(
        dataPath,
        JSON.stringify(realizacja, null, 2),
        'utf-8'
      );
    }

    result.realizacja = realizacja;
    return result;

  } catch (error) {
    result.message = `Błąd: ${error instanceof Error ? error.message : String(error)}`;
    return result;
  }
}

/**
 * Skanowanie wszystkich folderów w public/realizacje/
 */
export async function scanAllRealizacje(): Promise<ScanResult[]> {
  const results: ScanResult[] = [];
  const realizacjeDir = path.join(process.cwd(), 'public/realizacje');

  // Sprawdź czy katalog istnieje
  if (!fs.existsSync(realizacjeDir)) {
    console.log('Katalog public/realizacje/ nie istnieje. Tworzenie...');
    fs.mkdirSync(realizacjeDir, { recursive: true });
    return results;
  }

  // Pobierz listę folderów
  const items = fs.readdirSync(realizacjeDir, { withFileTypes: true });
  const folders = items.filter(item => item.isDirectory());

  console.log(`\n🔍 Znaleziono ${folders.length} folderów do przetworzenia...\n`);

  // Przetwórz każdy folder
  for (const folder of folders) {
    const folderPath = path.join(realizacjeDir, folder.name);
    console.log(`📁 Przetwarzanie: ${folder.name}`);
    
    const result = await scanRealizacjaFolder(folderPath, folder.name);
    results.push(result);

    // Wyświetl wynik
    const statusIcon = {
      'new': '✨',
      'updated': '🔄',
      'unchanged': '✓',
      'error': '❌'
    }[result.status];

    console.log(`   ${statusIcon} ${result.status.toUpperCase()}: ${result.message}`);
  }

  // Podsumowanie
  console.log('\n' + '='.repeat(50));
  console.log('📊 Podsumowanie:');
  console.log(`   Nowe: ${results.filter(r => r.status === 'new').length}`);
  console.log(`   Zaktualizowane: ${results.filter(r => r.status === 'updated').length}`);
  console.log(`   Bez zmian: ${results.filter(r => r.status === 'unchanged').length}`);
  console.log(`   Błędy: ${results.filter(r => r.status === 'error').length}`);
  console.log('='.repeat(50) + '\n');

  return results;
}

/**
 * Pobranie listy realizacji bez odpowiadających folderów
 * (realizacje które istnieją w data/ ale nie mają folderu w public/)
 */
export function findOrphanedRealizacje(): string[] {
  const dataDir = path.join(process.cwd(), 'data/realizacje');
  const publicDir = path.join(process.cwd(), 'public/realizacje');

  if (!fs.existsSync(dataDir)) {
    return [];
  }

  const dataFiles = fs.readdirSync(dataDir)
    .filter(f => f.endsWith('.json') && f !== 'README.md');

  if (!fs.existsSync(publicDir)) {
    // Wszystkie pliki są osierocone jeśli nie ma katalogu public/realizacje
    return dataFiles.map(f => f.replace('.json', ''));
  }

  const publicFolders = fs.readdirSync(publicDir, { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(item => generateSlug(item.name));

  const orphaned = dataFiles
    .map(f => f.replace('.json', ''))
    .filter(slug => !publicFolders.includes(slug));

  return orphaned;
}
