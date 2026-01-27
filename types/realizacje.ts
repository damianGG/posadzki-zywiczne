export type RealizacjaCategory = 'schody' | 'garaze' | 'kuchnie' | 'balkony-tarasy' | 'domy-mieszkania' | 'pomieszczenia-czyste';

export interface Realizacja {
  slug: string;
  title: string; // SEO title (≤ 60 characters)
  h1?: string; // H1 heading (similar to title but not identical)
  description: string;
  category: RealizacjaCategory;
  location: string;
  date: string;
  tags: string[]; // e.g., ["garaż", "epoksyd", "antypoślizg"]
  images: {
    main: string;
    gallery: Array<string | { url: string; alt?: string; hidden?: boolean }>;
  };
  details: {
    surface: string; // e.g., "50 m²"
    system: string; // e.g., "Epoksyd/Poliuretan"
    color?: string;
    duration?: string; // e.g., "2 dni"
  };
  features: string[];
  keywords: string[];
  
  // SEO-optimized content sections
  content?: {
    intro?: string; // 3-5 sentences introduction with main keyword
    whenToUse?: string; // "Kiedy rozwiązanie ma sens" - customer problems
    advantages?: string; // "Zalety rozwiązania"
    disadvantages?: string; // "Wady i ograniczenia" - honest assessment
    execution?: string; // "Wykonanie krok po kroku"
    durability?: string; // "Trwałość i odporność" (Polish conditions)
    pricing?: string; // "Cena – widełki + czynniki wpływające"
    commonMistakes?: string; // "Najczęstsze błędy / czego unikać"
    forWho?: string; // "Dla kogo to rozwiązanie, a dla kogo nie"
    localService?: string; // "Lokalizacja usług" (local SEO)
  };
  
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  
  clientTestimonial?: {
    content: string;
    author: string;
  };
}

export interface RealizacjeMetadata {
  totalCount: number;
  byCategory: Record<RealizacjaCategory, number>;
}
