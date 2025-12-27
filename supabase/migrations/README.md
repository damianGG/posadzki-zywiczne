# Supabase Migrations for Social Media Integration

This directory contains SQL migrations for the social media integration feature.

## Migrations

### 001_social_media_tables.sql
Creates the core tables for social media functionality:
- `social_media_posts` - Stores all social media posts
- `oauth_tokens` - Stores OAuth authentication tokens
- `social_media_logs` - Audit log for all operations

## How to Apply Migrations

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `001_social_media_tables.sql`
4. Paste into the SQL Editor
5. Click **Run** to execute the migration

### Option 2: Supabase CLI

If you have Supabase CLI installed:

```bash
# Link your project
supabase link --project-ref your-project-ref

# Apply migration
supabase db push
```

### Option 3: Manual psql

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" < supabase/migrations/001_social_media_tables.sql
```

## Verification

After running the migration, verify the tables were created:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('social_media_posts', 'oauth_tokens', 'social_media_logs');

-- Check social_media_posts structure
\d social_media_posts

-- Check views
SELECT * FROM platform_stats;
```

## Tables Overview

### social_media_posts
Main table storing all social media posts across platforms.

**Key columns:**
- `id` - UUID primary key
- `realizacja_id` - Optional FK to realizacje table
- `platform` - Platform type (google_business, instagram, etc.)
- `content` - Post text content
- `platform_metadata` - JSONB for platform-specific data
- `status` - Post status (draft, scheduled, published, failed)
- `scheduled_at` / `published_at` - Timing information

**Indexes:**
- Platform, status, scheduled_at for fast queries
- GIN index on platform_metadata for JSONB queries

### oauth_tokens
Stores OAuth authentication tokens for each platform.

**Key columns:**
- `platform` - Platform identifier (unique)
- `access_token` - OAuth access token
- `refresh_token` - OAuth refresh token
- `expires_at` - Token expiration timestamp

**Features:**
- Automatic updated_at timestamp
- Unique constraint on platform (one token per platform)

### social_media_logs
Audit log for tracking all operations.

**Key columns:**
- `post_id` - FK to social_media_posts
- `action` - Action type (created, updated, published, failed, deleted)
- `details` - JSONB with action details
- `error_message` - Error details for failed actions

**Features:**
- Automatic logging via triggers
- Cascade delete with posts

## Row Level Security (RLS)

RLS is enabled on all tables:
- **Public access:** Read-only access to published posts
- **Service role:** Full access to all operations
- **Authenticated users:** (customize based on your needs)

## Triggers

### Auto-update timestamps
- `update_social_media_posts_updated_at` - Updates `updated_at` on post changes
- `update_oauth_tokens_updated_at` - Updates `updated_at` on token changes

### Auto-logging
- `log_social_media_post_actions` - Automatically logs all post operations to `social_media_logs`

## Views

### social_posts_with_realizacja
Joins posts with realizacja details for easier querying.

```sql
SELECT * FROM social_posts_with_realizacja WHERE platform = 'instagram';
```

### platform_stats
Aggregated statistics per platform.

```sql
SELECT * FROM platform_stats ORDER BY total_posts DESC;
```

## Rollback

To rollback this migration (⚠️ **WARNING: This will delete all data**):

```sql
-- Drop views
DROP VIEW IF EXISTS platform_stats;
DROP VIEW IF EXISTS social_posts_with_realizacja;

-- Drop triggers
DROP TRIGGER IF EXISTS log_social_media_post_actions ON social_media_posts;
DROP TRIGGER IF EXISTS update_oauth_tokens_updated_at ON oauth_tokens;
DROP TRIGGER IF EXISTS update_social_media_posts_updated_at ON social_media_posts;

-- Drop functions
DROP FUNCTION IF EXISTS log_post_action();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop tables (cascade to remove dependencies)
DROP TABLE IF EXISTS social_media_logs CASCADE;
DROP TABLE IF EXISTS oauth_tokens CASCADE;
DROP TABLE IF EXISTS social_media_posts CASCADE;
```

## Next Steps

After applying this migration:

1. Verify tables exist and are properly indexed
2. Configure OAuth applications for each platform
3. Add OAuth tokens to `oauth_tokens` table
4. Start creating posts via the API endpoints
5. Monitor `social_media_logs` for audit trail

## Support

For issues or questions:
- Check Supabase logs in dashboard
- Review `social_media_logs` table for operation history
- Verify RLS policies match your security requirements
