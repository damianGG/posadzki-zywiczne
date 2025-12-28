-- Social Media Integration Database Schema
-- Migration: 001_social_media_tables
-- Description: Creates tables for social media posts, OAuth tokens, and audit logs

-- =============================================================================
-- Table 1: social_media_posts
-- =============================================================================
CREATE TABLE IF NOT EXISTS social_media_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Reference to realizacja (optional - post can be standalone)
  realizacja_id UUID REFERENCES realizacje(id) ON DELETE SET NULL,
  
  -- Platform identification
  platform TEXT NOT NULL CHECK (platform IN (
    'google_business',
    'instagram',
    'facebook',
    'tiktok',
    'pinterest',
    'linkedin'
  )),
  post_type TEXT NOT NULL CHECK (post_type IN (
    'photo',
    'carousel',
    'video',
    'reel',
    'story'
  )),
  
  -- Post content
  title TEXT,
  content TEXT NOT NULL,
  short_description TEXT,
  hashtags TEXT[] DEFAULT '{}',
  
  -- Media (stored as JSONB for flexibility)
  images JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  
  -- Platform-specific metadata (JSONB for flexibility)
  platform_metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Target accounts for multi-account publishing
  target_accounts TEXT[] DEFAULT '{}',
  
  -- Scheduling
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft',
    'scheduled',
    'published',
    'failed',
    'archived'
  )),
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  
  -- Platform response
  platform_post_id TEXT,
  platform_url TEXT,
  platform_response JSONB,
  
  -- SEO and tracking
  location TEXT,
  keywords TEXT[] DEFAULT '{}',
  
  -- AI generation tracking
  ai_generated BOOLEAN DEFAULT false,
  ai_prompt TEXT,
  ai_model TEXT,
  
  -- Cloudinary folder for cleanup
  cloudinary_folder TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_media_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_media_posts(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_scheduled ON social_media_posts(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_social_posts_realizacja ON social_media_posts(realizacja_id) WHERE realizacja_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_social_posts_created ON social_media_posts(created_at DESC);

-- Index for platform_metadata JSONB queries (example for common fields)
CREATE INDEX IF NOT EXISTS idx_social_posts_metadata ON social_media_posts USING GIN (platform_metadata);

-- =============================================================================
-- Table 2: oauth_tokens
-- =============================================================================
CREATE TABLE IF NOT EXISTS oauth_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Platform identification
  platform TEXT NOT NULL CHECK (platform IN (
    'google_business',
    'instagram',
    'facebook',
    'tiktok',
    'pinterest',
    'linkedin'
  )),
  
  -- OAuth credentials
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_type TEXT NOT NULL DEFAULT 'Bearer',
  expires_at TIMESTAMPTZ,
  scope TEXT,
  
  -- Additional platform-specific data
  platform_user_id TEXT,
  platform_user_info JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure only one active token per platform
  UNIQUE(platform)
);

-- Index for token expiration checks
CREATE INDEX IF NOT EXISTS idx_oauth_tokens_expires ON oauth_tokens(expires_at);

-- =============================================================================
-- Table 3: social_media_logs
-- =============================================================================
CREATE TABLE IF NOT EXISTS social_media_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Reference to post
  post_id UUID REFERENCES social_media_posts(id) ON DELETE CASCADE,
  
  -- Action type
  action TEXT NOT NULL CHECK (action IN (
    'created',
    'updated',
    'published',
    'failed',
    'deleted',
    'scheduled',
    'rescheduled'
  )),
  
  -- Details
  details JSONB,
  error_message TEXT,
  
  -- User info (if applicable)
  user_email TEXT,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for logs
CREATE INDEX IF NOT EXISTS idx_social_logs_post ON social_media_logs(post_id);
CREATE INDEX IF NOT EXISTS idx_social_logs_action ON social_media_logs(action);
CREATE INDEX IF NOT EXISTS idx_social_logs_created ON social_media_logs(created_at DESC);

-- =============================================================================
-- Row Level Security (RLS) Policies
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access to published posts
CREATE POLICY "Allow public read access to published posts"
  ON social_media_posts
  FOR SELECT
  USING (status = 'published');

-- Policy: Service role full access to social_media_posts
CREATE POLICY "Allow service role full access to posts"
  ON social_media_posts
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Service role full access to oauth_tokens
CREATE POLICY "Allow service role full access to oauth_tokens"
  ON oauth_tokens
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Service role full access to social_media_logs
CREATE POLICY "Allow service role full access to logs"
  ON social_media_logs
  FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================================================
-- Functions
-- =============================================================================

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for social_media_posts
CREATE TRIGGER update_social_media_posts_updated_at
  BEFORE UPDATE ON social_media_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for oauth_tokens
CREATE TRIGGER update_oauth_tokens_updated_at
  BEFORE UPDATE ON oauth_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to log post actions automatically
CREATE OR REPLACE FUNCTION log_post_action()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO social_media_logs (post_id, action, details)
    VALUES (NEW.id, 'created', jsonb_build_object(
      'platform', NEW.platform,
      'status', NEW.status
    ));
  ELSIF TG_OP = 'UPDATE' THEN
    -- Log status changes
    IF OLD.status != NEW.status THEN
      IF NEW.status = 'published' THEN
        INSERT INTO social_media_logs (post_id, action, details)
        VALUES (NEW.id, 'published', jsonb_build_object(
          'platform', NEW.platform,
          'platform_post_id', NEW.platform_post_id,
          'platform_url', NEW.platform_url
        ));
      ELSIF NEW.status = 'failed' THEN
        INSERT INTO social_media_logs (post_id, action, error_message)
        VALUES (NEW.id, 'failed', 'Publication failed');
      ELSIF NEW.status = 'scheduled' THEN
        INSERT INTO social_media_logs (post_id, action, details)
        VALUES (NEW.id, 'scheduled', jsonb_build_object(
          'scheduled_at', NEW.scheduled_at
        ));
      END IF;
    ELSE
      -- Log regular updates
      INSERT INTO social_media_logs (post_id, action, details)
      VALUES (NEW.id, 'updated', jsonb_build_object(
        'platform', NEW.platform,
        'status', NEW.status
      ));
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO social_media_logs (post_id, action, details)
    VALUES (OLD.id, 'deleted', jsonb_build_object(
      'platform', OLD.platform
    ));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic logging
CREATE TRIGGER log_social_media_post_actions
  AFTER INSERT OR UPDATE OR DELETE ON social_media_posts
  FOR EACH ROW
  EXECUTE FUNCTION log_post_action();

-- =============================================================================
-- Helper Views
-- =============================================================================

-- View: Posts with realizacja details
CREATE OR REPLACE VIEW social_posts_with_realizacja AS
SELECT 
  smp.*,
  r.title as realizacja_title,
  r.location as realizacja_location,
  r.slug as realizacja_slug
FROM social_media_posts smp
LEFT JOIN realizacje r ON r.id = smp.realizacja_id;

-- View: Platform summary statistics
CREATE OR REPLACE VIEW platform_stats AS
SELECT 
  platform,
  COUNT(*) as total_posts,
  COUNT(*) FILTER (WHERE status = 'published') as published_count,
  COUNT(*) FILTER (WHERE status = 'scheduled') as scheduled_count,
  COUNT(*) FILTER (WHERE status = 'draft') as draft_count,
  COUNT(*) FILTER (WHERE status = 'failed') as failed_count,
  MAX(published_at) as last_published_at
FROM social_media_posts
GROUP BY platform;

-- =============================================================================
-- Comments
-- =============================================================================

COMMENT ON TABLE social_media_posts IS 'Social media posts for all platforms';
COMMENT ON TABLE oauth_tokens IS 'OAuth tokens for platform authentication';
COMMENT ON TABLE social_media_logs IS 'Audit log for social media operations';

COMMENT ON COLUMN social_media_posts.platform_metadata IS 'Platform-specific data stored as JSONB (call_to_action for Google Business, is_reel for Instagram, etc.)';
COMMENT ON COLUMN social_media_posts.images IS 'Array of image objects with url, alt, width, height';
COMMENT ON COLUMN social_media_posts.status IS 'Post lifecycle: draft -> scheduled -> published | failed';

-- =============================================================================
-- Grant Permissions
-- =============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant access to tables
GRANT SELECT ON social_media_posts TO anon, authenticated;
GRANT ALL ON social_media_posts TO service_role;
GRANT ALL ON oauth_tokens TO service_role;
GRANT ALL ON social_media_logs TO service_role;

-- Grant access to views
GRANT SELECT ON social_posts_with_realizacja TO anon, authenticated, service_role;
GRANT SELECT ON platform_stats TO anon, authenticated, service_role;

-- =============================================================================
-- Migration Complete
-- =============================================================================

-- Verify tables were created
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'social_media_posts') THEN
    RAISE NOTICE 'Migration successful: social_media_posts table created';
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'oauth_tokens') THEN
    RAISE NOTICE 'Migration successful: oauth_tokens table created';
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'social_media_logs') THEN
    RAISE NOTICE 'Migration successful: social_media_logs table created';
  END IF;
END $$;
