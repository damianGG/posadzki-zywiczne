import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Dynamic route - prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 10; // Default timeout - no image analysis needed

// Initialize OpenAI client only if API key is available
let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Get basic input data
    const location = formData.get('location') as string;
    const type = formData.get('type') as string;
    const category = formData.get('category') as string;
    const area = formData.get('area') as string;
    const aiPrompt = formData.get('aiPrompt') as string; // Optional short description for AI

    if (!location || !type || !category) {
      return NextResponse.json(
        { error: 'Lokalizacja, typ projektu i kategoria są wymagane do generowania treści AI' },
        { status: 400 }
      );
    }

    if (!openai || !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    // Generate comprehensive content based on text input only
    const categoryMap: Record<string, string> = {
      'domy-mieszkania': 'domy i mieszkania',
      'garaz-podziemny': 'garaże i parkingi podziemne',
      'lokal-uslugowy': 'lokale usługowe i handlowe',
      'balkon-taras': 'balkony i tarasy',
      'przemysl-magazyn': 'hale przemysłowe i magazyny'
    };

    const typeMap: Record<string, string> = {
      'indywidualna': 'indywidualna',
      'komercyjna': 'komercyjna'
    };

    const prompt = `Jesteś ekspertem SEO i copywriterem specjalizującym się w posadzkach żywicznych. Wygeneruj kompletny, profesjonalny opis realizacji zoptymalizowany pod SEO, zgodnie z najlepszymi praktykami Google.

PODSTAWOWE DANE:
- Lokalizacja: ${location}
- Typ projektu: ${type} (${typeMap[type] || type})
- Kategoria: ${category} (${categoryMap[category] || category})
${area ? `- Powierzchnia: ${area} m²` : ''}
${aiPrompt ? `\nDODATKOWY KONTEKST OD UŻYTKOWNIKA:\n${aiPrompt}\n\nUżyj tego opisu aby lepiej zrozumieć specyfikę projektu i wygenerować bardziej precyzyjną treść.` : ''}

WYMAGANIA SEO:
1. Jedno główne słowo kluczowe (1 artykuł = 1 fraza)
2. Title SEO (≤ 60 znaków, fraza + benefit / lokalizacja)
3. H1 (zbliżony do Title, ale nie identyczny)
4. Długość całkowita: min. 900-1200 słów
5. Naturalne użycie fraz long-tail
6. Bez keyword stuffing
7. Zoptymalizowane pod warunki polskie

Wygeneruj JSON z następującymi polami (wszystkie po polsku):

{
  "title": "SEO-friendly tytuł (50-60 znaków, zawiera lokalizację i typ posadzki + benefit)",
  "h1": "H1 nagłówek (zbliżony do title, ale nie identyczny, 50-65 znaków)",
  "mainKeyword": "Główne słowo kluczowe dla tego artykułu",
  
  "intro": "Krótki wstęp (3-5 zdań, 200-300 słów). Wprowadzenie do realizacji. Użyj głównej frazy dokładnie 1x. Naturalny, angażujący styl.",
  
  "whenToUse": "Sekcja 'Kiedy to rozwiązanie ma sens' (150-200 słów). Opisz problemy klienta, które rozwiązuje ta posadzka. Kiedy warto ją zastosować? Jakie są typowe scenariusze użycia?",
  
  "advantages": "Sekcja 'Zalety rozwiązania' (200-250 słów). Szczegółowo opisz korzyści i zalety tego typu posadzki. Co zyskuje klient? Dlaczego to dobre rozwiązanie?",
  
  "disadvantages": "Sekcja 'Wady i ograniczenia' (100-150 słów). Uczciwie opisz wady i ograniczenia. Kiedy to rozwiązanie może nie być najlepsze? Co należy wziąć pod uwagę?",
  
  "execution": "Sekcja 'Wykonanie krok po kroku' (200-250 słów). Opisz proces wykonania posadzki krok po kroku. Od przygotowania podłoża po wykończenie. Bądź konkretny i techniczny.",
  
  "durability": "Sekcja 'Trwałość i odporność' (150-200 słów). Opisz trwałość w warunkach polskich (zmiany temperatury, wilgoć, mróz). Na co jest odporna ta posadzka? Jak długo wytrzyma?",
  
  "pricing": "Sekcja 'Cena – widełki + czynniki wpływające' (150-200 słów). Podaj orientacyjne widełki cenowe za m². Opisz czynniki wpływające na cenę (powierzchnia, stan podłoża, technologia, lokalizacja). Nie podawaj konkretnych cen, tylko zakresy.",
  
  "commonMistakes": "Sekcja 'Najczęstsze błędy / czego unikać' (150-200 słów). Opisz typowe błędy przy wykonywaniu tego typu posadzek. Czego unikać? Co może pójść nie tak?",
  
  "forWho": "Sekcja 'Dla kogo to rozwiązanie, a dla kogo nie' (150-200 słów). Dla kogo ta posadzka jest idealna? Dla kogo może nie być odpowiednia? Bądź konkretny i pomocny.",
  
  "localService": "Sekcja 'Lokalizacja usług' (100-150 słów). Opisz obszar świadczenia usług z naciskiem na ${location} i okolice. Wymień konkretne miasta/dzielnice. Lokalny SEO - użyj nazw miejscowości.",
  
  "technology": "Nazwa konkretnej technologii/systemu użytego do posadzki (np. 'Epoksyd z posypką kwarcową', 'Poliuretan dekoracyjny')",
  "color": "Konkretny kolor/odcień (np. 'Szary RAL 7037', 'Biały perłowy', 'Betonowy szary')",
  "duration": "Czas realizacji (np. '3 dni', '1 tydzień', '2 tygodnie')",
  
  "keywords": "15-20 słów kluczowych separated by comma (lokalne SEO, warianty fraz, long-tail keywords)",
  "tags": "7-10 tagów oddzielonych przecinkiem (krótkie, konkretne)",
  "features": "8-10 wypunktowanych cech/zalet projektu, każda w nowej linii z prefixem '- '. Konkretne korzyści (np. '- Odporna na chemikalia\\n- Antypoślizgowa powierzchnia')",
  
  "metaDescription": "Meta opis dla Google (150-160 znaków, zawiera CTA i główną frazę)",
  "ogTitle": "Tytuł dla social media (55-60 znaków, bardziej chwytliwy niż title)",
  "ogDescription": "Opis dla social media (130-150 znaków, bardziej emocjonalny)",
  "altText": "Alt text dla głównego zdjęcia (krótki, opisowy, zawiera słowa kluczowe i lokalizację)",
  
  "faq": [
    {
      "question": "Pytanie 1 dotyczące tego typu posadzki/projektu",
      "answer": "Szczegółowa odpowiedź (3-4 zdania, konkretna i pomocna)"
    },
    {
      "question": "Pytanie 2",
      "answer": "Odpowiedź"
    },
    {
      "question": "Pytanie 3",
      "answer": "Odpowiedź"
    },
    {
      "question": "Pytanie 4",
      "answer": "Odpowiedź"
    },
    {
      "question": "Pytanie 5",
      "answer": "Odpowiedź"
    },
    {
      "question": "Pytanie 6",
      "answer": "Odpowiedź"
    }
  ]
}

WAŻNE:
- Całkowita długość wszystkich sekcji content: min. 900-1200 słów
- Używaj prawdziwych nazw technologii posadzek żywicznych (epoksydowe, poliuretanowe, etc.)
- Optymalizuj pod lokalne SEO (użyj nazwy miasta ${location})
- Pisz naturalnie, unikaj keyword stuffing
- Bądź konkretny, profesjonalny i pomocny
- Wszystkie teksty po polsku z polskimi znakami
- FAQ: minimum 4-6 pytań klientów (wygeneruj 6 dla lepszego SEO)
- Każda sekcja content powinna być rzeczowa i wartościowa
- Zwróć tylko czysty JSON, bez markdown`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Jesteś ekspertem SEO i copywriterem specjalizującym się w posadzkach żywicznych. Generujesz profesjonalne, zoptymalizowane pod SEO opisy realizacji. Zwracasz tylko czysty JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const generatedContent = JSON.parse(completion.choices[0]?.message?.content || '{}');
    
    // Structure content sections
    const contentSections = {
      intro: generatedContent.intro,
      whenToUse: generatedContent.whenToUse,
      advantages: generatedContent.advantages,
      disadvantages: generatedContent.disadvantages,
      execution: generatedContent.execution,
      durability: generatedContent.durability,
      pricing: generatedContent.pricing,
      commonMistakes: generatedContent.commonMistakes,
      forWho: generatedContent.forWho,
      localService: generatedContent.localService,
    };
    
    // Convert FAQ array to JSON string if present
    if (generatedContent.faq && Array.isArray(generatedContent.faq)) {
      generatedContent.faq = JSON.stringify(generatedContent.faq, null, 2);
    }
    
    // Add content sections to response
    generatedContent.content = JSON.stringify(contentSections, null, 2);

    return NextResponse.json({
      success: true,
      content: generatedContent
    });

  } catch (error) {
    console.error('AI content generation error:', error);
    
    // Handle timeout errors specifically
    if (error instanceof Error && error.message.includes('timeout')) {
      return NextResponse.json(
        { 
          error: 'Przekroczono limit czasu generowania. Spróbuj ponownie z mniejszą ilością zdjęć lub bez nich.',
          details: 'Function timeout - try with fewer or no images'
        },
        { status: 504 }
      );
    }
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          error: 'Błąd parsowania odpowiedzi AI. Spróbuj ponownie.',
          details: 'AI returned invalid JSON'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Błąd podczas generowania treści AI',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
