import fs from 'fs';
import path from 'path';
import { Realizacja, RealizacjaCategory, RealizacjeMetadata } from '@/types/realizacje';

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
    'dom': 0,
    'garaz': 0,
    'balkon-taras': 0,
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
    'dom': 'Domy i mieszkania',
    'garaz': 'Garaże',
    'balkon-taras': 'Balkony i tarasy',
  };
  
  return names[category];
}

/**
 * Get latest realizacje (for homepage/previews)
 */
export function getLatestRealizacje(limit: number = 3): Realizacja[] {
  const allRealizacje = getAllRealizacje();
  return allRealizacje.slice(0, limit);
}
