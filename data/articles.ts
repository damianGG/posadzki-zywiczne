export interface Article {
  id: string;
  title: string;
  category: string;
  tags: string[];
  // dodaj inne potrzebne pola
}

export const articles: Record<string, Article> = {
  'porownanie-systemow-producentow-balkony': {
    id: 'porownanie-systemow-producentow-balkony',
    title: 'Porównanie systemów dla balkonów i tarasów – Sika, Remmers, Flowcrete',
    category: 'Porady',
    tags: ['porównanie systemów', 'Sika', 'Remmers', 'Flowcrete', 'balkony', 'tarasy', 'hydroizolacja']
  },
  'porownanie-systemow-producentow-garaz': {
    id: 'porownanie-systemow-producentow-garaz',
    title: 'Porównanie systemów producentów dla garaży – Sika, Remmers, Sicon, Flowcrete',
    category: 'Porady',
    tags: ['porównanie systemów', 'Sika', 'Remmers', 'Sicon', 'Flowcrete', 'garaż']
  },
  'systemy-flowcrete-do-garaży': {
    id: 'systemy-flowcrete-do-garaży',
    title: 'Systemy Flowcrete do garażu – przemysłowa jakość dla najbardziej wymagających',
    category: 'Producenci',
    tags: ['Flowcrete', 'systemy posadzkowe', 'garaż', 'Deckshield', 'premium', 'przemysłowe']
  },
  'systemy-flowcrete-na-balkony-tarasy': {
    id: 'systemy-flowcrete-na-balkony-tarasy',
    title: 'Systemy Flowcrete na balkony i tarasy – premium hydroizolacja i wykończenie',
    category: 'Producenci',
    tags: ['Flowcrete', 'balkony', 'tarasy', 'hydroizolacja', 'Deckshield', 'premium']
  },
  'systemy-remmers-do-garaży': {
    id: 'systemy-remmers-do-garaży',
    title: 'Systemy Remmers do garażu – niemiecka jakość w posadzkach żywicznych',
    category: 'Producenci',
    tags: ['Remmers', 'systemy posadzkowe', 'garaż', 'epoksyd', 'poliuretan', 'Remmers Polska']
  },
  'systemy-remmers-na-balkony-tarasy': {
    id: 'systemy-remmers-na-balkony-tarasy',
    title: 'Systemy Remmers na balkony i tarasy – hydroizolacja i ochrona UV',
    category: 'Producenci',
    tags: ['Remmers', 'balkony', 'tarasy', 'hydroizolacja', 'Multi-Top', 'PUR Aqua']
  },
  'systemy-sicon-do-garaży': {
    id: 'systemy-sicon-do-garaży',
    title: 'Systemy Sicon do garażu – polskie rozwiązania żywiczne',
    category: 'Producenci',
    tags: ['Sicon', 'systemy posadzkowe', 'garaż', 'epoksyd', 'poliuretan', 'polski producent']
  },
  'systemy-sicon-pomieszczenia-mieszkalne': {
    id: 'systemy-sicon-pomieszczenia-mieszkalne',
    title: 'Systemy Sicon do pomieszczeń mieszkalnych – żywica w salonie i kuchni',
    category: 'Producenci',
    tags: ['Sicon', 'pomieszczenia mieszkalne', 'salon', 'kuchnia', 'żywica w domu', 'epoksyd mieszkalny']
  },
  'systemy-sika-do-garaży': {
    id: 'systemy-sika-do-garaży',
    title: 'Systemy Sika do garażu – przegląd rozwiązań epoksydowych i poliuretanowych',
    category: 'Producenci',
    tags: ['Sika', 'systemy posadzkowe', 'garaż', 'SikaFloor', 'epoksyd', 'poliuretan']
  },
  'systemy-sika-na-balkony-tarasy': {
    id: 'systemy-sika-na-balkony-tarasy',
    title: 'Systemy Sika na balkony i tarasy – hydroizolacja i posadzki żywiczne',
    category: 'Producenci',
    tags: ['Sika', 'balkony', 'tarasy', 'hydroizolacja', 'Sika Balcony', 'poliuretan']
  }
}; 