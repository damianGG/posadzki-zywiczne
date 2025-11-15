export type RealizacjaCategory = 'mieszkania-domy' | 'balkony-tarasy' | 'kuchnie' | 'pomieszczenia-czyste' | 'schody';
export type RealizacjaType = 'indywidualna' | 'komercyjna';

export interface Realizacja {
  slug: string;
  title: string;
  description: string;
  category: RealizacjaCategory;
  type: RealizacjaType; // indywidualna (private) or komercyjna (commercial)
  location: string;
  date: string;
  tags: string[]; // e.g., ["garaż", "epoksyd", "antypoślizg"]
  images: {
    main: string;
    gallery: string[];
  };
  details: {
    surface: string; // e.g., "50 m²"
    system: string; // e.g., "Epoksyd/Poliuretan"
    color?: string;
    duration?: string; // e.g., "2 dni"
  };
  features: string[];
  keywords: string[];
  clientTestimonial?: {
    content: string;
    author: string;
  };
}

export interface RealizacjeMetadata {
  totalCount: number;
  byCategory: Record<RealizacjaCategory, number>;
}
