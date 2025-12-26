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

    const prompt = `Jesteś ekspertem SEO i copywriterem specjalizującym się w posadzkach żywicznych. Wygeneruj kompletny, profesjonalny opis realizacji na podstawie tych informacji:

PODSTAWOWE DANE:
- Lokalizacja: ${location}
- Typ projektu: ${type} (${typeMap[type] || type})
- Kategoria: ${category} (${categoryMap[category] || category})
${area ? `- Powierzchnia: ${area} m²` : ''}
${aiPrompt ? `\nDODATKOWY KONTEKST OD UŻYTKOWNIKA:\n${aiPrompt}\n\nUżyj tego opisu aby lepiej zrozumieć specyfikę projektu i wygenerować bardziej precyzyjną treść.` : ''}

Wygeneruj JSON z następującymi polami (wszystkie po polsku, zoptymalizowane pod SEO):

{
  "title": "SEO-friendly tytuł (50-60 znaków, zawiera lokalizację i typ posadzki)",
  "description": "Szczegółowy opis realizacji (300-500 słów): wprowadzenie, zakres prac, użyte technologie, efekt końcowy, korzyści dla klienta. Naturalny styl, profesjonalny język, słowa kluczowe wplecione naturalnie.",
  "technology": "Nazwa konkretnej technologii/systemu użytego do posadzki (np. 'Epoksyd z posypką kwarcową', 'Poliuretan dekoracyjny')",
  "color": "Konkretny kolor/odcień (np. 'Szary RAL 7037', 'Biały perłowy', 'Betonowy szary')",
  "duration": "Czas realizacji (np. '3 dni', '1 tydzień', '2 tygodnie')",
  "keywords": "10-15 słów kluczowych separated by comma (lokalne SEO, warianty fraz, long-tail)",
  "tags": "5-7 tagów oddzielonych przecinkiem (krótkie, konkretne)",
  "features": "5-8 wypunktowanych cech/zalet projektu, każda w nowej linii z prefixem '- '. Konkretne korzyści (np. '- Odporna na chemikalia', '- Antypoślizgowa powierzchnia')",
  "metaDescription": "Meta opis dla Google (150-160 znaków, zawiera CTA)",
  "ogTitle": "Tytuł dla social media (55-60 znaków, bardziej chwytliwy niż title)",
  "ogDescription": "Opis dla social media (130-150 znaków, bardziej emocjonalny)",
  "altText": "Alt text dla głównego zdjęcia (krótki, opisowy, zawiera słowa kluczowe)",
  "faq": [
    {
      "question": "Pytanie 1 dotyczące tego typu posadzki/projektu",
      "answer": "Szczegółowa odpowiedź (2-3 zdania)"
    },
    {
      "question": "Pytanie 2",
      "answer": "Odpowiedź"
    },
    {
      "question": "Pytanie 3",
      "answer": "Odpowiedź"
    }
  ]
}

WAŻNE:
- Używaj prawdziwych nazw technologii posadzek żywicznych (epoksydowe, poliuretanowe, etc.)
- Optymalizuj pod lokalne SEO (użyj nazwy miasta ${location})
- Pisz naturalnie, unikaj keyword stuffing
- Bądź konkretny i profesjonalny
- Wszystkie teksty po polsku z polskimi znakami
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
    
    // Convert FAQ array to JSON string if present
    if (generatedContent.faq && Array.isArray(generatedContent.faq)) {
      generatedContent.faq = JSON.stringify(generatedContent.faq, null, 2);
    }

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
