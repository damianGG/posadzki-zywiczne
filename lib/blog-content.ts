export interface BlogPromptContext {
  topic: string;
  targetAudience: string;
  realizationsCount?: string;
  location?: string;
  system?: string;
  surfaceArea?: string;
  cost?: string;
  clientProblems?: string;
  executionMistakes?: string;
  photosDescription?: string;
  yearsInUse?: string;
  observations?: string;
  author?: string;
  company?: string;
  additionalNotes?: string;
}

export interface BlogArticleSections {
  quickAnswer: string;
  whyClientsAsk: string;
  experienceFromProjects: string;
  numbersAndCosts: string;
  whenRecommended: string;
  whenNotRecommended: string;
  alternativesComparison: string;
  investorMistakes: string;
  faqLead: string;
  summaryRecommendation: string;
}

export interface BlogFaqItem {
  id?: string;
  question: string;
  answer: string;
}

export interface BlogImageItem {
  url: string;
  alt?: string;
  caption?: string;
  isMain?: boolean;
}

export const DEFAULT_BLOG_AUTHOR = {
  name: 'Damian',
  avatar: '/profilowe.png?height=40&width=40',
  bio: 'Wykonawca specjalizujący się w posadzkach żywicznych, balkonach, tarasach i garażach',
};

export const DEFAULT_BLOG_PROMPT_TEMPLATE = `Napisz ekspercki artykuł zgodny z aktualnym kierunkiem Google AI Search, AI Overviews i E-E-A-T.

Artykuł ma wyglądać jak wiedza pochodząca od praktyka z wieloletnim doświadczeniem, a nie tekst SEO.

Temat:
[TEMAT]

Firma:
POSADZKIZYWICZNE.COM

Autor:
Wykonawca specjalizujący się w posadzkach żywicznych, balkonach, tarasach i garażach.

Grupa docelowa:
[TYP KLIENTA]

Wykorzystaj poniższe dane:

* liczba wykonanych realizacji: [LICZBA]
* lokalizacja realizacji: [MIASTO]
* zastosowany system: [SYSTEM]
* powierzchnia: [M2]
* koszt wykonania: [KOSZT]
* najczęstsze problemy klientów: [PROBLEMY]
* najczęstsze błędy wykonawcze: [BŁĘDY]
* zdjęcia realizacji: [OPIS]
* czas użytkowania: [LATA]
* obserwacje po latach: [WNIOSKI]

Struktura artykułu:

1. Krótka odpowiedź na pytanie klienta.
2. Dlaczego klienci o to pytają.
3. Co pokazuje nasze doświadczenie z realizacji.
4. Konkretne liczby, parametry i koszty.
5. Kiedy dane rozwiązanie jest dobrym wyborem.
6. Kiedy nie polecamy tego rozwiązania.
7. Alternatywy i porównanie.
8. Najczęstsze błędy inwestorów.
9. Najczęstsze pytania klientów.
10. Podsumowanie i rekomendacja.

W artykule:

* unikaj definicji i ogólników,
* podawaj konkretne liczby,
* podawaj przykłady z realizacji,
* pokazuj zalety i wady,
* nie twórz treści marketingowych,
* pisz jak praktyk z budowy,
* używaj krótkich akapitów,
* odpowiadaj na pytania klienta zanim je zada,
* stosuj język naturalny i konwersacyjny.

Celem artykułu jest bycie najlepszym źródłem wiedzy dla AI Google oraz dla użytkownika szukającego odpowiedzi.`;

export const BLOG_GENERATION_RESPONSE_FORMAT = `{
  "title": "SEO title",
  "excerpt": "2-3 zdania streszczenia",
  "category": "Porady",
  "tags": ["tag1", "tag2"],
  "keywords": ["fraza 1", "fraza 2"],
  "metaTitle": "...",
  "metaDescription": "...",
  "ogTitle": "...",
  "ogDescription": "...",
  "imageAlt": "...",
  "imageCaption": "...",
  "sections": {
    "quickAnswer": "...",
    "whyClientsAsk": "...",
    "experienceFromProjects": "...",
    "numbersAndCosts": "...",
    "whenRecommended": "...",
    "whenNotRecommended": "...",
    "alternativesComparison": "...",
    "investorMistakes": "...",
    "faqLead": "krótkie wprowadzenie do sekcji FAQ",
    "summaryRecommendation": "..."
  },
  "faq": [
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." }
  ]
}`;

// Keep room for numeric suffixes like "-12" while staying comfortably below common URL slug limits.
const MAX_BLOG_SLUG_LENGTH = 96;
const BLOG_READ_WORDS_PER_MINUTE = 180;
const POLISH_CHAR_MAP: Record<string, string> = {
  ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
  Ą: 'a', Ć: 'c', Ę: 'e', Ł: 'l', Ń: 'n', Ó: 'o', Ś: 's', Ź: 'z', Ż: 'z',
};
const POLISH_CHAR_REGEX = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g;

const SECTION_TITLES: Record<keyof BlogArticleSections, string> = {
  quickAnswer: 'Krótka odpowiedź na pytanie klienta',
  whyClientsAsk: 'Dlaczego klienci o to pytają',
  experienceFromProjects: 'Co pokazuje nasze doświadczenie z realizacji',
  numbersAndCosts: 'Konkretne liczby, parametry i koszty',
  whenRecommended: 'Kiedy dane rozwiązanie jest dobrym wyborem',
  whenNotRecommended: 'Kiedy nie polecamy tego rozwiązania',
  alternativesComparison: 'Alternatywy i porównanie',
  investorMistakes: 'Najczęstsze błędy inwestorów',
  faqLead: 'Najczęstsze pytania klientów',
  summaryRecommendation: 'Podsumowanie i rekomendacja',
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderTextBlock(text: string): string {
  const normalized = text.replace(/\r/g, '').trim();

  if (!normalized) {
    return '';
  }

  const blocks = normalized.split(/\n\s*\n/).filter(Boolean);

  return blocks
    .map((block) => {
      const lines = block
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.length === 0) {
        return '';
      }

      if (lines.every((line) => /^[-*]\s+/.test(line))) {
        const items = lines
          .map((line) => line.replace(/^[-*]\s+/, ''))
          .map((line) => `<li>${escapeHtml(line)}</li>`)
          .join('');

        return `<ul>${items}</ul>`;
      }

      if (lines.every((line) => /^\d+[.)]\s+/.test(line))) {
        const items = lines
          .map((line) => line.replace(/^\d+[.)]\s+/, ''))
          .map((line) => `<li>${escapeHtml(line)}</li>`)
          .join('');

        return `<ol>${items}</ol>`;
      }

      return `<p>${lines.map(escapeHtml).join('<br />')}</p>`;
    })
    .join('');
}

export function slugifyBlogText(value: string): string {
  return value
    .replace(POLISH_CHAR_REGEX, (char) => POLISH_CHAR_MAP[char] || char)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, MAX_BLOG_SLUG_LENGTH);
}

export function createBlogFaqId(): string {
  if (!globalThis.crypto) {
    throw new Error('Brak wsparcia dla crypto.randomUUID podczas generowania identyfikatora FAQ');
  }

  if (typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  if (typeof globalThis.crypto.getRandomValues !== 'function') {
    throw new Error('Brak wsparcia Web Crypto podczas generowania identyfikatora FAQ');
  }

  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function buildPromptFromTemplate(template: string, context: BlogPromptContext): string {
  const replacements: Record<string, string> = {
    '[TEMAT]': context.topic || '-',
    '[TYP KLIENTA]': context.targetAudience || '-',
    '[LICZBA]': context.realizationsCount || '-',
    '[MIASTO]': context.location || '-',
    '[SYSTEM]': context.system || '-',
    '[M2]': context.surfaceArea || '-',
    '[KOSZT]': context.cost || '-',
    '[PROBLEMY]': context.clientProblems || '-',
    '[BŁĘDY]': context.executionMistakes || '-',
    '[OPIS]': context.photosDescription || '-',
    '[LATA]': context.yearsInUse || '-',
    '[WNIOSKI]': context.observations || '-',
  };

  return Object.entries(replacements).reduce(
    (result, [placeholder, replacement]) => result.replaceAll(placeholder, replacement),
    template,
  );
}

export function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function normalizeFaqItems(value: unknown): BlogFaqItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const question = 'question' in item ? String(item.question || '').trim() : '';
      const answer = 'answer' in item ? String(item.answer || '').trim() : '';
      const id = 'id' in item && typeof item.id === 'string' && item.id.trim()
        ? item.id.trim()
        : createBlogFaqId();

      if (!question || !answer) {
        return null;
      }

      return { id, question, answer };
    })
    .filter((item): item is BlogFaqItem => item !== null);
}

export function normalizeArticleSections(value: unknown): BlogArticleSections {
  const source = value && typeof value === 'object' ? value as Record<string, unknown> : {};

  return {
    quickAnswer: String(source.quickAnswer || '').trim(),
    whyClientsAsk: String(source.whyClientsAsk || '').trim(),
    experienceFromProjects: String(source.experienceFromProjects || '').trim(),
    numbersAndCosts: String(source.numbersAndCosts || '').trim(),
    whenRecommended: String(source.whenRecommended || '').trim(),
    whenNotRecommended: String(source.whenNotRecommended || '').trim(),
    alternativesComparison: String(source.alternativesComparison || '').trim(),
    investorMistakes: String(source.investorMistakes || '').trim(),
    faqLead: String(source.faqLead || '').trim(),
    summaryRecommendation: String(source.summaryRecommendation || '').trim(),
  };
}

export function renderBlogContent(sections: BlogArticleSections, faqItems: BlogFaqItem[]): string {
  const htmlSections = (Object.entries(sections) as Array<[keyof BlogArticleSections, string]>)
    .filter(([, content]) => content)
    .map(([key, content]) => `<section><h2>${SECTION_TITLES[key]}</h2>${renderTextBlock(content)}</section>`)
    .join('');

  const faqHtml = faqItems.length > 0
    ? `<section><h2>FAQ</h2>${faqItems
        .map((item) => `<h3>${escapeHtml(item.question)}</h3>${renderTextBlock(item.answer)}`)
        .join('')}</section>`
    : '';

  return `${htmlSections}${faqHtml}`;
}

export function estimateReadTime(value: string): string {
  const words = value
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = Math.max(1, Math.ceil(words / BLOG_READ_WORDS_PER_MINUTE));
  return `${minutes} min`;
}

export function buildCanonicalUrl(slug: string): string {
  return `https://posadzkizywiczne.com/blog/${slug}`;
}

export function getMainImage(images: BlogImageItem[]) {
  return images.find((image) => image.isMain) || images[0] || null;
}
