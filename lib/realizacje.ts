import { Realizacja, RealizacjaCategory, RealizacjeMetadata } from '@/types/realizacje';
import { listRealizacje, getRealizacjaBySlug as getRealizacjaBySlugFromDB, RealizacjaData } from './supabase-realizacje';

/**
 * Map RealizacjaData from Supabase to Realizacja type
 */
function mapToRealizacja(data: RealizacjaData): Realizacja {
  // Map project_type to category
  const categoryMap: Record<string, RealizacjaCategory> = {
    // Full format (new, correct format)
    'posadzka-w-garażu': 'garaze',
    'posadzka-w-kuchni': 'kuchnie',
    'posadzka-na-balkonie': 'balkony-tarasy',
    'posadzka-na-tarasie': 'balkony-tarasy',
    'posadzka-na-schodach': 'schody',
    'posadzka-w-domu': 'domy-mieszkania',
    'posadzka-w-mieszkaniu': 'domy-mieszkania',
    'posadzka-w-gastronomii': 'pomieszczenia-czyste',
    // Short format (old, for backward compatibility)
    'garaz': 'garaze',
    'kuchnia': 'kuchnie',
    'taras': 'balkony-tarasy',
    'balkon': 'balkony-tarasy',
    'schody': 'schody',
    'mieszkanie': 'domy-mieszkania',
    'gastronomia': 'pomieszczenia-czyste',
  };

  const category = categoryMap[data.project_type] || 'domy-mieszkania' as RealizacjaCategory;

  // Process images - extract URLs from database structure
  // Database structure: { main: "url", gallery: [{url: "...", alt: "..."}] }
  console.log('[Image Debug] Raw images data:', JSON.stringify(data.images, null, 2));
  
  const mainImage = typeof data.images?.main === 'string' && data.images.main.trim() !== '' 
    ? data.images.main.trim() 
    : '';
  
  console.log('[Image Debug] Main image extracted:', mainImage);
  
  const galleryImages = Array.isArray(data.images?.gallery) 
    ? data.images.gallery
        .map((img: any, index: number) => {
          console.log(`[Image Debug] Gallery item ${index}:`, typeof img, img);
          
          // Fallback for string URLs (check this first)
          if (typeof img === 'string') {
            const url = img.trim();
            console.log(`[Image Debug] Using string URL:`, url);
            return url;
          }
          
          // Database stores images as objects: { url: string, alt?: string }
          if (typeof img === 'object' && img !== null && 'url' in img) {
            const url = typeof img.url === 'string' ? img.url.trim() : '';
            console.log(`[Image Debug] Extracted URL from object:`, url);
            return url;
          }
          
          console.log(`[Image Debug] Invalid image format, returning empty`);
          return '';
        })
        .filter((url: string) => url && url.trim() !== '')
    : [];

  console.log('[Image Debug] Gallery images extracted:', galleryImages);

  // Use mainImage if available, otherwise use first gallery image, otherwise empty string
  const finalMainImage = mainImage || (galleryImages.length > 0 ? galleryImages[0] : '');
  
  console.log('[Image Debug] Final main image:', finalMainImage);
  
  // If mainImage is same as first gallery image, don't duplicate it
  const finalGallery = mainImage && galleryImages[0] === mainImage 
    ? galleryImages.slice(1) 
    : galleryImages;
    
  console.log('[Image Debug] Final gallery:', finalGallery);

  return {
    slug: data.slug,
    title: data.title,
    h1: data.h1,
    description: data.description,
    category,
    location: data.location,
    date: data.created_at || new Date().toISOString(),
    tags: data.tags || [],
    images: {
      main: finalMainImage,
      gallery: finalGallery,
    },
    details: {
      surface: data.surface_area || '',
      system: data.technology || '',
      color: data.color,
      duration: data.duration,
    },
    features: data.features || [],
    keywords: data.keywords || [],
    content: data.content,
    faq: data.faq,
  };
}

/**
 * Get all realizacje from Supabase database
 * This function is async and fetches from the database
 */
export async function getAllRealizacje(): Promise<Realizacja[]> {
  try {
    const result = await listRealizacje({
      orderBy: 'created_at',
      orderDirection: 'desc',
    });

    if (!result.success || !result.data) {
      console.error('Error loading realizacje from database:', result.error);
      return [];
    }

    return result.data.map(mapToRealizacja);
  } catch (error) {
    console.error('Error loading realizacje:', error);
    return [];
  }
}

/**
 * Get realizacje filtered by category
 */
export async function getRealizacjeByCategory(category: RealizacjaCategory): Promise<Realizacja[]> {
  const allRealizacje = await getAllRealizacje();
  return allRealizacje.filter((realizacja) => realizacja.category === category);
}

/**
 * Search realizacje by tags, title, or description
 */
export async function searchRealizacje(query: string): Promise<Realizacja[]> {
  const allRealizacje = await getAllRealizacje();
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
export async function getAllTags(): Promise<string[]> {
  const allRealizacje = await getAllRealizacje();
  const tagsSet = new Set<string>();
  
  allRealizacje.forEach((realizacja) => {
    realizacja.tags.forEach(tag => tagsSet.add(tag));
  });
  
  return Array.from(tagsSet).sort();
}

/**
 * Get realizacje filtered by tag
 */
export async function getRealizacjeByTag(tag: string): Promise<Realizacja[]> {
  const allRealizacje = await getAllRealizacje();
  return allRealizacje.filter((realizacja) => 
    realizacja.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Get a single realizacja by slug from Supabase
 */
export async function getRealizacjaBySlug(slug: string): Promise<Realizacja | null> {
  try {
    const result = await getRealizacjaBySlugFromDB(slug);
    
    if (!result.success || !result.data) {
      return null;
    }
    
    return mapToRealizacja(result.data);
  } catch (error) {
    console.error(`Error loading realizacja with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get metadata about realizacje
 */
export async function getRealizacjeMetadata(): Promise<RealizacjeMetadata> {
  const allRealizacje = await getAllRealizacje();
  
  const byCategory: Record<RealizacjaCategory, number> = {
    'schody': 0,
    'garaze': 0,
    'kuchnie': 0,
    'balkony-tarasy': 0,
    'domy-mieszkania': 0,
    'pomieszczenia-czyste': 0,
  };

  allRealizacje.forEach((realizacja) => {
    byCategory[realizacja.category]++;
  });

  return {
    totalCount: allRealizacje.length,
    byCategory,
  };
}

// Re-export helper functions that can be used in client components
export { getCategoryDisplayName } from './realizacje-helpers';

/**
 * Get latest realizacje (for homepage/previews)
 */
export async function getLatestRealizacje(limit: number = 3): Promise<Realizacja[]> {
  const allRealizacje = await getAllRealizacje();
  return allRealizacje.slice(0, limit);
}
