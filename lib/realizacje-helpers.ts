import { RealizacjaCategory } from '@/types/realizacje';

/**
 * Get category display name in Polish
 */
export function getCategoryDisplayName(category: RealizacjaCategory): string {
  const names: Record<RealizacjaCategory, string> = {
    'schody': 'Schody',
    'garaze': 'Garaże',
    'kuchnie': 'Kuchnie',
    'balkony-tarasy': 'Balkony i Tarasy',
    'domy-mieszkania': 'Domy i Mieszkania',
    'pomieszczenia-czyste': 'Pomieszczenia Czyste',
  };
  
  return names[category];
}
