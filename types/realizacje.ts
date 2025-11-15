export type RealizacjaCategory = 'dom' | 'garaz' | 'balkon-taras';

export interface Realizacja {
  slug: string;
  title: string;
  description: string;
  category: RealizacjaCategory;
  location: string;
  date: string;
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
