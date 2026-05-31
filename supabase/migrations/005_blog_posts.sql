-- Blog posts database schema for admin-generated articles

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content_html TEXT NOT NULL DEFAULT '',
  author JSONB NOT NULL DEFAULT '{}'::jsonb,
  category TEXT NOT NULL DEFAULT 'Porady',
  tags TEXT[] NOT NULL DEFAULT '{}',
  read_time TEXT NOT NULL DEFAULT '1 min',
  image JSONB NOT NULL DEFAULT '{}'::jsonb,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  seo JSONB NOT NULL DEFAULT '{}'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  prompt_template TEXT NOT NULL,
  prompt_context JSONB NOT NULL DEFAULT '{}'::jsonb,
  article_sections JSONB NOT NULL DEFAULT '{}'::jsonb,
  faq_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to published blog posts"
  ON blog_posts
  FOR SELECT
  USING (status = 'published');

-- Admin CRUD goes through Next.js server routes using the Supabase service role key,
-- so we intentionally keep write access limited to the service role instead of browser auth.
CREATE POLICY "Allow service role full access to blog posts"
  ON blog_posts
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
