import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { queryOne } from '@/lib/db';
import type { GeneratePostRequest, GeneratePostResponse, SocialMediaPlatform } from '@/types/social-media';

// Dynamic route configuration
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // Extended timeout for AI generation

// Initialize OpenAI client
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Platform-specific content guidelines
const PLATFORM_GUIDELINES = {
  google_business: {
    maxChars: 1500,
    tone: 'profesjonalny i lokalny',
    focus: 'lokalne SEO, call-to-action, konkretne benefity',
    hashtags: 5-10,
    example: 'Posadzka epoksydowa w garażu - Warszawa Mokotów. Trwała, odporna, antypoślizgowa. ☎️ Bezpłatna wycena!'
  },
  instagram: {
    maxChars: 2200,
    tone: 'przyjazny, storytelling, wizualny',
    focus: 'historia transformacji, emocje, za kulisami',
    hashtags: 20-30,
    example: 'TRANSFORMACJA garażu w Warszawie! 🏠✨\n\nSzary kolor RAL 7037 to klasyka...'
  },
  facebook: {
    maxChars: 300,
    tone: 'konwersacyjny, angażujący',
    focus: 'pytanie na końcu, interakcja, social proof',
    hashtags: 3-5,
    example: 'Jak długo posadzka epoksydowa może służyć w garażu? 🤔\n\nNasz najnowszy projekt...'
  },
  tiktok: {
    maxChars: 150,
    tone: 'dynamiczny, młodzieżowy, hook na początku',
    focus: 'POV, przed/po, szybkie fakty',
    hashtags: 5-10,
    example: 'POV: Twój garaż przeszedł GLOW UP w 3 DNI! 🔥'
  },
  pinterest: {
    maxChars: 500,
    tone: 'inspirujący, praktyczny, SEO',
    focus: 'pomysły, inspiracje, tutorial',
    hashtags: 10-15,
    example: '15 Pomysłów na Posadzki Epoksydowe w Garażu | Inspiracje 2024'
  },
  linkedin: {
    maxChars: 1300,
    tone: 'profesjonalny, ekspert, B2B',
    focus: 'case study, ROI, technical details',
    hashtags: 3-5,
    example: 'Case Study: Kompleksowa modernizacja posadzki w garażu wielostanowiskowym...'
  },
};

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: GeneratePostRequest = await request.json();
    const { platform, realizacja_id, preferences, custom_prompt } = body;

    // Validation
    if (!platform) {
      return NextResponse.json(
        { success: false, error: 'Platform is required' },
        { status: 400 }
      );
    }

    if (!openai) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API not configured. Add OPENAI_API_KEY to environment.' },
        { status: 500 }
      );
    }

    // Get realizacja data if provided
    let realizacjaData: any = null;
    if (realizacja_id) {
      try {
        realizacjaData = await queryOne('select * from realizacje where id::text = $1', [realizacja_id]);
      } catch (error: any) {
        return NextResponse.json(
          { success: false, error: `Failed to fetch realizacja: ${error.message}` },
          { status: 500 }
        );
      }

      if (!realizacjaData) {
        return NextResponse.json(
          { success: false, error: 'Failed to fetch realizacja: not found' },
          { status: 404 }
        );
      }
    }

    // Get platform guidelines
    const guidelines = PLATFORM_GUIDELINES[platform as SocialMediaPlatform];
    if (!guidelines) {
      return NextResponse.json(
        { success: false, error: `Unsupported platform: ${platform}` },
        { status: 400 }
      );
    }

    // Build AI prompt
    const systemPrompt = `Jesteś ekspertem od content marketingu i social media dla firmy zajmującej się posadzkami żywicznymi (epoksydowymi).

Twój zadaniem jest generowanie angażujących postów na ${platform} w języku polskim.

WYTYCZNE DLA ${platform.toUpperCase()}:
- Maksymalna długość: ${guidelines.maxChars} znaków
- Ton: ${guidelines.tone}
- Focus: ${guidelines.focus}
- Liczba hashtagów: ${guidelines.hashtags}

PRZYKŁAD DOBREGO POSTA:
${guidelines.example}

ZASADY:
1. Pisz naturalnie po polsku, bez keyword stuffing
2. Używaj emoji tam gdzie pasują (ale nie przesadzaj)
3. Zawsze dodaj call-to-action na końcu
4. Hashtagi: po polsku + angielsku, relevantne do branży
5. Dla lokalnego biznesu: zawsze wspominaj lokalizację (Warszawa, okolice)
6. Skup się na benefitach dla klienta, nie technicznych szczegółach

${realizacjaData ? `
DANE Z REALIZACJI (użyj ich do stworzenia posta):
- Tytuł: ${realizacjaData.title}
- Lokalizacja: ${realizacjaData.location}
- Kategoria: ${realizacjaData.category}
- Powierzchnia: ${realizacjaData.details?.surface || 'brak danych'}
- System: ${realizacjaData.details?.system || 'brak danych'}
- Kolor: ${realizacjaData.details?.color || 'brak danych'}
- Czas trwania: ${realizacjaData.details?.duration || 'brak danych'}
- Opis: ${realizacjaData.description}
${realizacjaData.content?.intro ? `- Wstęp: ${realizacjaData.content.intro.substring(0, 200)}...` : ''}
` : ''}

${custom_prompt ? `\nDODATKOWE INSTRUKCJE OD UŻYTKOWNIKA:\n${custom_prompt}` : ''}

WYGENERUJ POST W FORMACIE JSON:
{
  "content": "Treść posta (maksymalnie ${guidelines.maxChars} znaków)",
  "hashtags": ["hashtag1", "hashtag2", ...],
  "title": "Opcjonalny tytuł (tylko dla LinkedIn/Pinterest)",
  "short_description": "Krótki opis 40-60 znaków (meta description)",
  "platform_metadata": {
    // Platform-specific data, np:
    // Google Business: { "call_to_action": "CALL" }
    // Instagram: { "is_reel": false }
  }
}`;

    const userPrompt = preferences?.focus 
      ? `Wygeneruj post z naciskiem na: ${preferences.focus}`
      : `Wygeneruj angażujący post na podstawie podanych danych.`;

    // Generate content with OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: preferences?.tone === 'formal' ? 0.5 : 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse AI response
    const aiResponse = JSON.parse(responseText);

    // Prepare response
    const response: GeneratePostResponse = {
      success: true,
      content: aiResponse.content || '',
      hashtags: aiResponse.hashtags || [],
      title: aiResponse.title,
      short_description: aiResponse.short_description,
      platform_metadata: aiResponse.platform_metadata || {},
      ai_model: 'gpt-4o',
    };

    // Validate content length
    if (response.content.length > guidelines.maxChars) {
      console.warn(`Content length (${response.content.length}) exceeds platform limit (${guidelines.maxChars})`);
      // Truncate if needed
      response.content = response.content.substring(0, guidelines.maxChars - 3) + '...';
    }

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Error generating social media content:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate content',
        ai_model: 'gpt-4o'
      },
      { status: 500 }
    );
  }
}
