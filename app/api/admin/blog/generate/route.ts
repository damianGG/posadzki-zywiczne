import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import {
  BLOG_GENERATION_RESPONSE_FORMAT,
  buildPromptFromTemplate,
  normalizeArticleSections,
  normalizeFaqItems,
  normalizeStringArray,
  type BlogPromptContext,
} from '@/lib/blog-content';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST(request: NextRequest) {
  try {
    if (!openai) {
      return NextResponse.json({ success: false, error: 'Brak konfiguracji OPENAI_API_KEY' }, { status: 500 });
    }

    const { promptTemplate, promptContext } = await request.json() as {
      promptTemplate: string;
      promptContext: BlogPromptContext;
    };

    if (!promptTemplate?.trim() || !promptContext?.topic?.trim() || !promptContext?.targetAudience?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Szablon promptu, temat i grupa docelowa są wymagane' },
        { status: 400 },
      );
    }

    const resolvedPrompt = buildPromptFromTemplate(promptTemplate, promptContext);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `Jesteś praktykiem wykonującym posadzki żywiczne. Zwracasz wyłącznie poprawny JSON po polsku. Nie używasz markdown ani HTML w polach tekstowych. Zadbaj o konkret, liczby i styl ekspercki.`,
        },
        {
          role: 'user',
          content: `${resolvedPrompt}\n\nZwróć JSON w formacie:\n${BLOG_GENERATION_RESPONSE_FORMAT}`,
        },
      ],
    });

    const raw = JSON.parse(completion.choices[0]?.message?.content || '{}') as Record<string, unknown>;

    return NextResponse.json({
      success: true,
      data: {
        title: String(raw.title || '').trim(),
        excerpt: String(raw.excerpt || '').trim(),
        category: String(raw.category || 'Porady').trim(),
        tags: normalizeStringArray(raw.tags),
        keywords: normalizeStringArray(raw.keywords),
        metaTitle: String(raw.metaTitle || '').trim(),
        metaDescription: String(raw.metaDescription || '').trim(),
        ogTitle: String(raw.ogTitle || '').trim(),
        ogDescription: String(raw.ogDescription || '').trim(),
        imageAlt: String(raw.imageAlt || '').trim(),
        imageCaption: String(raw.imageCaption || '').trim(),
        sections: normalizeArticleSections(raw.sections),
        faq: normalizeFaqItems(raw.faq),
        resolvedPrompt,
      },
    });
  } catch (error) {
    console.error('Blog AI generation error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Błąd generowania treści bloga' },
      { status: 500 },
    );
  }
}
