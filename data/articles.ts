export interface Article {
  id: string;
  title: string;
  category: string;
  tags: string[];
  // dodaj inne potrzebne pola
}

export const articles: Record<string, Article> = {
  // tutaj dodaj swoje artykuły
}; 