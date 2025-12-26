# Supabase Schema for Realizacje

## Table: `realizacje`

Create this table in your Supabase dashboard (SQL Editor):

```sql
-- Create realizacje table
CREATE TABLE realizacje (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  
  -- Location and project details
  location TEXT NOT NULL,
  surface_area TEXT,
  project_type TEXT NOT NULL,
  
  -- Technical details
  technology TEXT,
  color TEXT,
  duration TEXT,
  
  -- SEO and metadata
  keywords TEXT[],
  tags TEXT[],
  features TEXT[],
  benefits TEXT[],
  
  -- Meta tags
  meta_description TEXT,
  og_title TEXT,
  og_description TEXT,
  
  -- Images (stored as JSON array of objects with url, alt, etc.)
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- FAQ
  faq JSONB DEFAULT '[]'::jsonb,
  
  -- Cloudinary folder for cleanup
  cloudinary_folder TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX idx_realizacje_slug ON realizacje(slug);

-- Create index on created_at for sorting
CREATE INDEX idx_realizacje_created_at ON realizacje(created_at DESC);

-- Create index on project_type for filtering
CREATE INDEX idx_realizacje_project_type ON realizacje(project_type);

-- Enable Row Level Security (RLS)
ALTER TABLE realizacje ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON realizacje
  FOR SELECT USING (true);

-- Create policy to allow authenticated insert (for admin API)
-- Note: Use service role key in API for full access
CREATE POLICY "Allow service role full access" ON realizacje
  FOR ALL USING (true);
```

## Setup Instructions

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the SQL above
4. Click **Run** to create the table

5. Verify your environment variables are set in Vercel:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## Migration from File System

To migrate existing realizacje from `data/realizacje/*.json` to Supabase:

1. Run the migration script: `npx tsx scripts/migrate-realizacje-to-supabase.ts`
2. This will read all JSON files and insert them into Supabase
3. Existing files will remain as backup

## Data Structure

### Images JSONB Format
```json
{
  "main": "https://res.cloudinary.com/...",
  "gallery": [
    {
      "url": "https://res.cloudinary.com/...",
      "alt": "Description of image"
    }
  ]
}
```

### FAQ JSONB Format
```json
[
  {
    "question": "Question text?",
    "answer": "Answer text."
  }
]
```

## API Endpoints

All admin endpoints will use Supabase:
- `POST /api/admin/upload-realizacja` - Save to Supabase + Cloudinary
- `PUT /api/admin/update-realizacja` - Update in Supabase
- `DELETE /api/admin/delete-realizacja` - Delete from Supabase + Cloudinary
- `GET /api/admin/list-realizacje` - List from Supabase
- `GET /api/admin/get-realizacja` - Get single from Supabase

Public API:
- `GET /api/realizacje` - Public list (with caching)
- `GET /api/realizacje/[slug]` - Public single realizacja

## Benefits

✅ **Works on Vercel** - No filesystem limitations
✅ **Fast queries** - Indexed database lookups
✅ **Scalable** - No filesystem size limits
✅ **Backup** - Automatic Supabase backups
✅ **Real-time** - Optional real-time subscriptions
✅ **SEO preserved** - All metadata in database
