import type { BlogPost } from '@/lib/blog';
import {
  DEFAULT_BLOG_AUTHOR,
  type BlogArticleSections,
  type BlogFaqItem,
  type BlogImageItem,
  type BlogPromptContext,
} from '@/lib/blog-content';
import { getSupabaseAdmin, getSupabasePublic } from '@/lib/supabase-realizacje';

export interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_html: string;
  author: typeof DEFAULT_BLOG_AUTHOR;
  category: string;
  tags: string[];
  read_time: string;
  image: BlogImageItem;
  gallery: BlogImageItem[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl: string;
    ogTitle?: string;
    ogDescription?: string;
  };
  featured: boolean;
  status: 'published' | 'draft';
  prompt_template: string;
  prompt_context: BlogPromptContext;
  article_sections: BlogArticleSections;
  faq_items: BlogFaqItem[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface BlogPostInput {
  slug: string;
  title: string;
  excerpt: string;
  content_html: string;
  author: typeof DEFAULT_BLOG_AUTHOR;
  category: string;
  tags: string[];
  read_time: string;
  image: BlogImageItem;
  gallery: BlogImageItem[];
  seo: BlogPostRow['seo'];
  featured: boolean;
  status: 'published' | 'draft';
  prompt_template: string;
  prompt_context: BlogPromptContext;
  article_sections: BlogArticleSections;
  faq_items: BlogFaqItem[];
  published_at?: string | null;
}

function isBlogPostRow(value: unknown): value is BlogPostRow {
  return Boolean(value && typeof value === 'object' && 'slug' in value && 'title' in value);
}

export function mapBlogRowToPost(row: BlogPostRow): BlogPost {
  return {
    id: row.slug,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content_html,
    author: row.author || DEFAULT_BLOG_AUTHOR,
    publishedAt: row.published_at || row.created_at,
    updatedAt: row.updated_at,
    category: row.category,
    tags: Array.isArray(row.tags) ? row.tags : [],
    readTime: row.read_time || '1 min',
    image: {
      url: row.image?.url || '/placeholder.svg',
      alt: row.image?.alt || row.title,
      caption: row.image?.caption || row.title,
    },
    gallery: Array.isArray(row.gallery) ? row.gallery.map((image) => image.url).filter(Boolean) : [],
    seo: {
      metaTitle: row.seo?.metaTitle || row.title,
      metaDescription: row.seo?.metaDescription || row.excerpt,
      keywords: Array.isArray(row.seo?.keywords) ? row.seo.keywords : [],
      canonicalUrl: row.seo?.canonicalUrl || `https://posadzkizywiczne.com/blog/${row.slug}`,
      ogTitle: row.seo?.ogTitle || row.title,
      ogDescription: row.seo?.ogDescription || row.excerpt,
    },
    featured: Boolean(row.featured),
    status: row.status,
  };
}

export async function listDatabaseBlogPosts(options?: {
  status?: 'published' | 'draft';
  includeDrafts?: boolean;
}): Promise<BlogPostRow[]> {
  const supabase = options?.includeDrafts ? getSupabaseAdmin() : getSupabasePublic();

  if (!supabase) {
    return [];
  }

  let query = supabase.from('blog_posts').select('*').order('published_at', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  } else if (!options?.includeDrafts) {
    query = query.eq('status', 'published');
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error listing database blog posts:', error);
    return [];
  }

  return Array.isArray(data) ? data.filter(isBlogPostRow) : [];
}

export async function getDatabaseBlogPostBySlug(slug: string, includeDrafts = false): Promise<BlogPostRow | null> {
  const supabase = includeDrafts ? getSupabaseAdmin() : getSupabasePublic();

  if (!supabase) {
    return null;
  }

  let query = supabase.from('blog_posts').select('*').eq('slug', slug);

  if (!includeDrafts) {
    query = query.eq('status', 'published');
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error('Error loading blog post by slug:', error);
    return null;
  }

  return isBlogPostRow(data) ? data : null;
}

export async function getDatabaseBlogPostById(id: string): Promise<BlogPostRow | null> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).maybeSingle();

  if (error) {
    console.error('Error loading blog post by id:', error);
    return null;
  }

  return isBlogPostRow(data) ? data : null;
}

export async function createDatabaseBlogPost(input: BlogPostInput): Promise<{ success: boolean; data?: BlogPostRow; error?: string }> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { success: false, error: 'Supabase nie jest skonfigurowany' };
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .insert(input)
    .select('*')
    .single();

  if (error) {
    console.error('Error creating blog post:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data: data as BlogPostRow };
}

export async function updateDatabaseBlogPost(id: string, input: Partial<BlogPostInput>): Promise<{ success: boolean; data?: BlogPostRow; error?: string }> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { success: false, error: 'Supabase nie jest skonfigurowany' };
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating blog post:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data: data as BlogPostRow };
}

export async function deleteDatabaseBlogPost(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { success: false, error: 'Supabase nie jest skonfigurowany' };
  }

  const { error } = await supabase.from('blog_posts').delete().eq('id', id);

  if (error) {
    console.error('Error deleting blog post:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getUniqueBlogSlug(baseSlug: string, excludeId?: string): Promise<string> {
  const supabase = getSupabaseAdmin();
  const maxSlugAttempts = 100;

  if (!supabase) {
    return baseSlug;
  }

  let slug = baseSlug;
  let counter = 2;

  while (counter <= maxSlugAttempts) {
    let query = supabase.from('blog_posts').select('id').eq('slug', slug);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query.maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking blog slug:', error);
      return slug;
    }

    if (!data) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  throw new Error(`Nie udało się wygenerować unikalnego slugu wpisu blogowego po ${maxSlugAttempts} próbach`);
}
