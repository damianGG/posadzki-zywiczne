import { NextRequest, NextResponse } from 'next/server';
import {
  buildCanonicalUrl,
  DEFAULT_BLOG_AUTHOR,
  estimateReadTime,
  getMainImage,
  normalizeArticleSections,
  normalizeFaqItems,
  normalizeStringArray,
  renderBlogContent,
  slugifyBlogText,
  type BlogImageItem,
  type BlogPromptContext,
} from '@/lib/blog-content';
import {
  deleteDatabaseBlogPost,
  getDatabaseBlogPostById,
  getUniqueBlogSlug,
  updateDatabaseBlogPost,
} from '@/lib/supabase-blog';

function normalizeImages(value: unknown): BlogImageItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map<BlogImageItem | null>((image) => {
      if (!image || typeof image !== 'object') {
        return null;
      }

      const source = image as Record<string, unknown>;
      const url = String(source.url || '').trim();
      if (!url) {
        return null;
      }

      return {
        url,
        alt: String(source.alt || '').trim(),
        caption: String(source.caption || '').trim(),
        isMain: Boolean(source.isMain),
      };
    })
    .filter((image): image is BlogImageItem => image !== null);
}

function normalizePromptContext(value: unknown): BlogPromptContext {
  const source = value && typeof value === 'object' ? value as Record<string, unknown> : {};

  return {
    topic: String(source.topic || '').trim(),
    targetAudience: String(source.targetAudience || '').trim(),
    realizationsCount: String(source.realizationsCount || '').trim(),
    location: String(source.location || '').trim(),
    system: String(source.system || '').trim(),
    surfaceArea: String(source.surfaceArea || '').trim(),
    cost: String(source.cost || '').trim(),
    clientProblems: String(source.clientProblems || '').trim(),
    executionMistakes: String(source.executionMistakes || '').trim(),
    photosDescription: String(source.photosDescription || '').trim(),
    yearsInUse: String(source.yearsInUse || '').trim(),
    observations: String(source.observations || '').trim(),
    author: String(source.author || '').trim(),
    company: String(source.company || '').trim(),
    additionalNotes: String(source.additionalNotes || '').trim(),
  };
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getDatabaseBlogPostById(id);

  if (!post) {
    return NextResponse.json({ success: false, error: 'Nie znaleziono wpisu' }, { status: 404 });
  }

  return NextResponse.json({ success: true, post });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await getDatabaseBlogPostById(id);

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Nie znaleziono wpisu' }, { status: 404 });
    }

    const body = await request.json();
    const title = String(body.title || existing.title).trim();
    const excerpt = String(body.excerpt || existing.excerpt).trim();
    const promptTemplate = String(body.promptTemplate || existing.prompt_template).trim();
    const status = body.status === 'published' ? 'published' : 'draft';
    const promptContext = normalizePromptContext(body.promptContext || existing.prompt_context);
    const articleSections = normalizeArticleSections(body.articleSections || existing.article_sections);
    const faqItems = normalizeFaqItems(body.faqItems || existing.faq_items);
    const images = normalizeImages(body.images || existing.gallery);
    const mainImage = getMainImage(images);

    if (!title || !excerpt || !promptTemplate || !promptContext.topic) {
      return NextResponse.json(
        { success: false, error: 'Tytuł, excerpt, prompt i temat są wymagane' },
        { status: 400 },
      );
    }

    const requestedSlug = slugifyBlogText(String(body.slug || title || promptContext.topic));
    const slug = await getUniqueBlogSlug(requestedSlug || existing.slug, id);
    const contentHtml = renderBlogContent(articleSections, faqItems);

    const result = await updateDatabaseBlogPost(id, {
      slug,
      title,
      excerpt,
      content_html: contentHtml,
      author: DEFAULT_BLOG_AUTHOR,
      category: String(body.category || existing.category || 'Porady').trim() || 'Porady',
      tags: normalizeStringArray(body.tags ?? existing.tags),
      read_time: estimateReadTime(`${excerpt}\n${contentHtml}`),
      image: mainImage || existing.image,
      gallery: images,
      seo: {
        metaTitle: String(body.metaTitle || existing.seo?.metaTitle || title).trim() || title,
        metaDescription: String(body.metaDescription || existing.seo?.metaDescription || excerpt).trim() || excerpt,
        keywords: normalizeStringArray(body.keywords ?? existing.seo?.keywords),
        canonicalUrl: buildCanonicalUrl(slug),
        ogTitle: String(body.ogTitle || existing.seo?.ogTitle || title).trim() || title,
        ogDescription: String(body.ogDescription || existing.seo?.ogDescription || excerpt).trim() || excerpt,
      },
      featured: Boolean(body.featured),
      status,
      prompt_template: promptTemplate,
      prompt_context: promptContext,
      article_sections: articleSections,
      faq_items: faqItems,
      published_at: status === 'published' ? existing.published_at || new Date().toISOString() : null,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || 'Nie udało się zaktualizować wpisu' }, { status: 500 });
    }

    return NextResponse.json({ success: true, post: result.data });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ success: false, error: 'Błąd podczas aktualizacji wpisu blogowego' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await deleteDatabaseBlogPost(id);

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error || 'Nie udało się usunąć wpisu' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
