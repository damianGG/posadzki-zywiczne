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
  BLOG_POSTS_TABLE_UNAVAILABLE_MESSAGE,
  BlogPostsTableUnavailableError,
  createDatabaseBlogPost,
  getUniqueBlogSlug,
  listDatabaseBlogPosts,
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

export async function GET() {
  try {
    const posts = await listDatabaseBlogPosts({ includeDrafts: true, throwOnMissingTable: true });
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('Error listing admin blog posts:', error);
    const message = error instanceof Error ? error.message : 'Nie udało się pobrać wpisów bloga';
    const status = error instanceof BlogPostsTableUnavailableError ? 503 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const title = String(body.title || '').trim();
    const excerpt = String(body.excerpt || '').trim();
    const promptTemplate = String(body.promptTemplate || '').trim();
    const status = body.status === 'published' ? 'published' : 'draft';
    const promptContext = normalizePromptContext(body.promptContext);
    const articleSections = normalizeArticleSections(body.articleSections);
    const faqItems = normalizeFaqItems(body.faqItems);
    const images = normalizeImages(body.images);
    const mainImage = getMainImage(images);

    if (!title || !excerpt || !promptTemplate || !promptContext.topic) {
      return NextResponse.json(
        { success: false, error: 'Tytuł, excerpt, prompt i temat są wymagane' },
        { status: 400 },
      );
    }

    const baseSlug = slugifyBlogText(String(body.slug || title || promptContext.topic));
    const slug = await getUniqueBlogSlug(baseSlug || 'artykul-blogowy');
    const contentHtml = renderBlogContent(articleSections, faqItems);
    const readTime = estimateReadTime(`${excerpt}\n${contentHtml}`);
    const keywords = normalizeStringArray(body.keywords);

    const result = await createDatabaseBlogPost({
      slug,
      title,
      excerpt,
      content_html: contentHtml,
      author: DEFAULT_BLOG_AUTHOR,
      category: String(body.category || 'Porady').trim() || 'Porady',
      tags: normalizeStringArray(body.tags),
      read_time: readTime,
      image: mainImage || { url: '/placeholder.svg', alt: body.imageAlt || title, caption: body.imageCaption || title },
      gallery: images,
      seo: {
        metaTitle: String(body.metaTitle || title).trim() || title,
        metaDescription: String(body.metaDescription || excerpt).trim() || excerpt,
        keywords,
        canonicalUrl: buildCanonicalUrl(slug),
        ogTitle: String(body.ogTitle || title).trim() || title,
        ogDescription: String(body.ogDescription || excerpt).trim() || excerpt,
      },
      featured: Boolean(body.featured),
      status,
      prompt_template: promptTemplate,
      prompt_context: promptContext,
      article_sections: articleSections,
      faq_items: faqItems,
      published_at: status === 'published' ? new Date().toISOString() : null,
    });

    if (!result.success) {
      const error = result.error || 'Nie udało się zapisać wpisu';
      const status = error === BLOG_POSTS_TABLE_UNAVAILABLE_MESSAGE ? 503 : 500;
      return NextResponse.json({ success: false, error }, { status });
    }

    return NextResponse.json({ success: true, post: result.data });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ success: false, error: 'Błąd podczas zapisywania wpisu blogowego' }, { status: 500 });
  }
}
