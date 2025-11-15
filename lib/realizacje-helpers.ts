import { RealizacjaCategory, RealizacjaType } from '@/types/realizacje';

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
