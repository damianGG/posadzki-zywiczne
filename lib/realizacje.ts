import fs from 'fs';
import path from 'path';
import { Realizacja, RealizacjaCategory, RealizacjaType, RealizacjeMetadata } from '@/types/realizacje';

const realizacjeDirectory = path.join(process.cwd(), 'data/realizacje');

/**
 * Get all realizacje from JSON files
 */
export function getAllRealizacje(): Realizacja[] {
  try {
    const fileNames = fs.readdirSync(realizacjeDirectory);
    const realizacje = fileNames
      .filter((fileName) => fileName.endsWith('.json'))
      .map((fileName) => {
        const filePath = path.join(realizacjeDirectory, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContents) as Realizacja;
      })
      .sort((a, b) => {
        // Sort by date, newest first
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

    return realizacje;
  } catch (error) {
    console.error('Error loading realizacje:', error);
    return [];
  }
}

/**
 * Get realizacje filtered by category
 */
export function getRealizacjeByCategory(category: RealizacjaCategory): Realizacja[] {
  const allRealizacje = getAllRealizacje();
  return allRealizacje.filter((realizacja) => realizacja.category === category);
}

/**
 * Get realizacje filtered by type
 */
export function getRealizacjeByType(type: RealizacjaType): Realizacja[] {
  const allRealizacje = getAllRealizacje();
  return allRealizacje.filter((realizacja) => realizacja.type === type);
}

/**
 * Search realizacje by tags, title, or description
 */
export function searchRealizacje(query: string): Realizacja[] {
  const allRealizacje = getAllRealizacje();
  const lowerQuery = query.toLowerCase();
  
  return allRealizacje.filter((realizacja) => {
    // Search in title, description, tags
    const matchesTitle = realizacja.title.toLowerCase().includes(lowerQuery);
    const matchesDescription = realizacja.description.toLowerCase().includes(lowerQuery);
    const matchesTags = realizacja.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
    const matchesLocation = realizacja.location.toLowerCase().includes(lowerQuery);
    
    return matchesTitle || matchesDescription || matchesTags || matchesLocation;
  });
}

/**
 * Get all unique tags from all realizacje
 */
export function getAllTags(): string[] {
  const allRealizacje = getAllRealizacje();
  const tagsSet = new Set<string>();
  
  allRealizacje.forEach((realizacja) => {
    realizacja.tags.forEach(tag => tagsSet.add(tag));
  });
  
  return Array.from(tagsSet).sort();
}

/**
 * Get realizacje filtered by tag
 */
export function getRealizacjeByTag(tag: string): Realizacja[] {
  const allRealizacje = getAllRealizacje();
  return allRealizacje.filter((realizacja) => 
    realizacja.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Get a single realizacja by slug
 */
export function getRealizacjaBySlug(slug: string): Realizacja | null {
  try {
    const filePath = path.join(realizacjeDirectory, `${slug}.json`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents) as Realizacja;
  } catch (error) {
    console.error(`Error loading realizacja with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get metadata about realizacje
 */
export function getRealizacjeMetadata(): RealizacjeMetadata {
  const allRealizacje = getAllRealizacje();
  
  const byCategory: Record<RealizacjaCategory, number> = {
    'mieszkania-domy': 0,
    'balkony-tarasy': 0,
    'kuchnie': 0,
    'pomieszczenia-czyste': 0,
    'schody': 0,
  };

  allRealizacje.forEach((realizacja) => {
    byCategory[realizacja.category]++;
  });

  return {
    totalCount: allRealizacje.length,
    byCategory,
  };
}

/**
 * Get category display name in Polish
 */
export function getCategoryDisplayName(category: RealizacjaCategory): string {
  const names: Record<RealizacjaCategory, string> = {
    'mieszkania-domy': 'Mieszkania i Domy',
    'balkony-tarasy': 'Balkony i Tarasy',
    'kuchnie': 'Kuchnie',
    'pomieszczenia-czyste': 'Pomieszczenia Czyste',
    'schody': 'Schody',
  };
  
  return names[category];
}

/**
 * Get type display name in Polish
 */
export function getTypeDisplayName(type: RealizacjaType): string {
  const names: Record<RealizacjaType, string> = {
    'indywidualna': 'Projekt Indywidualny',
    'komercyjna': 'Projekt Komercyjny',
  };
  
  return names[type];
}

/**
 * Get latest realizacje (for homepage/previews)
 */
export function getLatestRealizacje(limit: number = 3): Realizacja[] {
  const allRealizacje = getAllRealizacje();
  return allRealizacje.slice(0, limit);
}
