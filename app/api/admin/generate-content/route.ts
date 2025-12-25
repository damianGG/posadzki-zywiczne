import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Get basic input data
    const location = formData.get('location') as string;
    const type = formData.get('type') as string;
    const category = formData.get('category') as string;
    const area = formData.get('area') as string;
    const images = formData.getAll('images') as File[];

    if (!location || !type) {
      return NextResponse.json(
        { error: 'Lokalizacja i typ projektu są wymagane' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    // Step 1: Analyze images using Vision API (if images provided)
    let imageAnalysis = '';
    if (images.length > 0) {
      try {
        // Convert first image to base64
        const firstImage = images[0];
        const arrayBuffer = await firstImage.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString('base64');
        const mimeType = firstImage.type;

        const visionResponse = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Przeanalizuj to zdjęcie realizacji posadzki żywicznej. Opisz: kolor, wykończenie, rodzaj pomieszczenia, widoczne elementy, jakość wykonania. Odpowiedz po polsku, krótko i konkretnie.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${mimeType};base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 500
        });

        imageAnalysis = visionResponse.choices[0]?.message?.content || '';
      } catch (error) {
        console.error('Vision API error:', error);
        // Continue without image analysis
      }
    }

    // Step 2: Generate comprehensive content
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
${imageAnalysis ? `\nANALIZA ZDJĘĆ:\n${imageAnalysis}` : ''}

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

    return NextResponse.json({
      success: true,
      content: generatedContent
    });

  } catch (error) {
    console.error('AI content generation error:', error);
    return NextResponse.json(
      { 
        error: 'Błąd podczas generowania treści AI',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
