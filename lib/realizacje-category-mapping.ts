/**
 * Shared utility functions for realizacje category/project_type mapping
 * Used across API routes to ensure consistent category handling
 */

/**
 * Helper function to determine project type from category
 * Returns the full project type name that matches the expected format in realizacje.ts
 * 
 * @param category - The category selected in the form (e.g., 'garaze', 'schody', 'domy-mieszkania')
 * @returns The full project type name for database storage (e.g., 'posadzka-w-garażu', 'posadzka-na-schodach')
 * 
 * Note: 'balkony-tarasy' uses 'posadzka-na-tarasie' as the canonical form.
 * Both 'balkon' and 'taras' map to the same category 'balkony-tarasy', and 'taras' (terrace)
 * is chosen as more general. The backward compatibility mapping in realizacje.ts handles both.
 * 
 * @example
 * getProjectTypeFromCategory('garaze') // returns 'posadzka-w-garażu'
 * getProjectTypeFromCategory('schody') // returns 'posadzka-na-schodach'
 */
export function getProjectTypeFromCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'domy-mieszkania': 'posadzka-w-mieszkaniu',
    'balkony-tarasy': 'posadzka-na-tarasie',
    'garaze': 'posadzka-w-garażu',
    'kuchnie': 'posadzka-w-kuchni',
    'pomieszczenia-czyste': 'posadzka-w-gastronomii',
    'schody': 'posadzka-na-schodach',
  };
  return categoryMap[category] || 'posadzka-w-mieszkaniu';
}

/**
 * Helper function to determine folder type from category (for folder names only)
 * Returns a simplified folder name for Cloudinary storage
 * 
 * @param category - The category selected in the form
 * @returns The simplified folder type name (e.g., 'garaz', 'schody', 'mieszkanie')
 * 
 * @example
 * getFolderTypeFromCategory('garaze') // returns 'garaz'
 * getFolderTypeFromCategory('schody') // returns 'schody'
 */
export function getFolderTypeFromCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'domy-mieszkania': 'mieszkanie',
    'balkony-tarasy': 'taras',
    'garaze': 'garaz',
    'kuchnie': 'kuchnia',
    'pomieszczenia-czyste': 'gastronomia',
    'schody': 'schody',
  };
  return categoryMap[category] || 'mieszkanie';
}
