# Social Media Integration - Dashboard & Database Architecture Addendum

## 🎯 Response to Feedback

This document addresses specific feedback regarding:
1. Admin dashboard with realizacje-to-posts visibility
2. Database structure: single unified table vs separate tables per platform

---

## 1. Admin Dashboard - Realizacje with Social Media Status

### 1.1 Proposed Dashboard Design

**Updated Realizacje List Page** (`/admin/realizacje`)

```typescript
interface RealizacjaWithSocialMedia {
  // Existing realizacja fields
  slug: string;
  title: string;
  description: string;
  location: string;
  images: {...};
  
  // NEW: Social media posts summary
  social_media_summary: {
    google_business: {
      post_count: number;
      latest_status: 'draft' | 'scheduled' | 'published' | 'failed' | null;
      latest_post_date: string | null;
      latest_post_url: string | null;
    };
    instagram: {
      post_count: number;
      latest_status: 'draft' | 'scheduled' | 'published' | 'failed' | null;
      latest_post_date: string | null;
      latest_post_url: string | null;
    };
    facebook: {...};
    tiktok: {...};
    pinterest: {...};
    linkedin: {...};
  };
}
```

### 1.2 Visual Design

```
┌─────────────────────────────────────────────────────────────────┐
│  Realizacje Dashboard                          [+ Dodaj Nową]   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 📸 Garaż Warszawa Mokotów - 40m²                                │
│ Lokalizacja: Warszawa, Mokotów | Data: 2024-10-15              │
│                                                                  │
│ 📱 Posty Social Media:                                          │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ 📍 Google Business  ✅ Opublikowano (2024-12-20)         │   │
│ │ 📷 Instagram        ✅ Opublikowano (2024-12-21)         │   │
│ │ 👥 Facebook         ⏰ Zaplanowano (2024-12-28)          │   │
│ │ 🎵 TikTok           ➖ Nie utworzono                      │   │
│ │ 📌 Pinterest        ➖ Nie utworzono                      │   │
│ │ 💼 LinkedIn         ➖ Nie utworzono                      │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ [Edytuj] [Usuń] [📱 Utwórz Posty] [👁️ Zobacz Posty]           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 📸 Balkon Kraków - 25m²                                         │
│ Lokalizacja: Kraków | Data: 2024-11-05                         │
│                                                                  │
│ 📱 Posty Social Media:                                          │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ 📍 Google Business  ➖ Nie utworzono                      │   │
│ │ 📷 Instagram        ➖ Nie utworzono                      │   │
│ │ 👥 Facebook         ➖ Nie utworzono                      │   │
│ │ 🎵 TikTok           ➖ Nie utworzono                      │   │
│ │ 📌 Pinterest        ➖ Nie utworzono                      │   │
│ │ 💼 LinkedIn         ➖ Nie utworzono                      │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ [Edytuj] [Usuń] [📱 Utwórz Posty]                              │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Status Indicators

| Status | Icon | Color | Description |
|--------|------|-------|-------------|
| Published | ✅ | Green | Post opublikowany na platformie |
| Scheduled | ⏰ | Blue | Post zaplanowany do publikacji |
| Draft | 📝 | Gray | Post zapisany jako draft |
| Failed | ❌ | Red | Publikacja nie powiodła się |
| Not Created | ➖ | Light Gray | Nie utworzono jeszcze posta |

### 1.4 API Endpoint for Dashboard

```typescript
// GET /api/admin/realizacje-with-social-media
// Returns realizacje with aggregated social media post data

export async function GET(request: NextRequest) {
  const supabase = getSupabaseAdmin();
  
  // Query realizacje
  const { data: realizacje, error: realizacjeError } = await supabase
    .from('realizacje')
    .select('*')
    .order('created_at', { ascending: false });

  if (realizacjeError) {
    return NextResponse.json({ error: realizacjeError.message }, { status: 500 });
  }

  // For each realizacja, aggregate social media posts
  const realizacjeWithSocialMedia = await Promise.all(
    realizacje.map(async (realizacja) => {
      // Query posts for this realizacja
      const { data: posts } = await supabase
        .from('social_media_posts')
        .select('platform, status, published_at, platform_url')
        .eq('realizacja_id', realizacja.id)
        .order('created_at', { ascending: false });

      // Aggregate by platform
      const summary: any = {
        google_business: { post_count: 0, latest_status: null, latest_post_date: null, latest_post_url: null },
        instagram: { post_count: 0, latest_status: null, latest_post_date: null, latest_post_url: null },
        facebook: { post_count: 0, latest_status: null, latest_post_date: null, latest_post_url: null },
        tiktok: { post_count: 0, latest_status: null, latest_post_date: null, latest_post_url: null },
        pinterest: { post_count: 0, latest_status: null, latest_post_date: null, latest_post_url: null },
        linkedin: { post_count: 0, latest_status: null, latest_post_date: null, latest_post_url: null },
      };

      posts?.forEach(post => {
        if (summary[post.platform]) {
          summary[post.platform].post_count++;
          if (!summary[post.platform].latest_status) {
            summary[post.platform].latest_status = post.status;
            summary[post.platform].latest_post_date = post.published_at;
            summary[post.platform].latest_post_url = post.platform_url;
          }
        }
      });

      return {
        ...realizacja,
        social_media_summary: summary,
      };
    })
  );

  return NextResponse.json({
    success: true,
    realizacje: realizacjeWithSocialMedia,
  });
}
```

### 1.5 Component Implementation

**File:** `app/admin/realizacje/page.tsx` (enhanced)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  XCircle, 
  Minus,
  Share2
} from 'lucide-react';

const platformIcons = {
  google_business: '📍',
  instagram: '📷',
  facebook: '👥',
  tiktok: '🎵',
  pinterest: '📌',
  linkedin: '💼',
};

const platformNames = {
  google_business: 'Google Business',
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  pinterest: 'Pinterest',
  linkedin: 'LinkedIn',
};

function getStatusIcon(status: string | null) {
  switch (status) {
    case 'published':
      return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    case 'scheduled':
      return <Clock className="w-4 h-4 text-blue-600" />;
    case 'draft':
      return <FileText className="w-4 h-4 text-gray-500" />;
    case 'failed':
      return <XCircle className="w-4 h-4 text-red-600" />;
    default:
      return <Minus className="w-4 h-4 text-gray-300" />;
  }
}

function getStatusText(status: string | null, date: string | null) {
  switch (status) {
    case 'published':
      return `Opublikowano ${date ? `(${new Date(date).toLocaleDateString('pl-PL')})` : ''}`;
    case 'scheduled':
      return `Zaplanowano ${date ? `(${new Date(date).toLocaleDateString('pl-PL')})` : ''}`;
    case 'draft':
      return 'Draft';
    case 'failed':
      return 'Niepowodzenie';
    default:
      return 'Nie utworzono';
  }
}

function getStatusColor(status: string | null) {
  switch (status) {
    case 'published':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'scheduled':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'draft':
      return 'bg-gray-50 text-gray-700 border-gray-200';
    case 'failed':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-gray-50 text-gray-400 border-gray-100';
  }
}

export default function RealizacjeListPageEnhanced() {
  const [realizacje, setRealizacje] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealizacjeWithSocialMedia();
  }, []);

  const fetchRealizacjeWithSocialMedia = async () => {
    try {
      const response = await fetch('/api/admin/realizacje-with-social-media');
      const data = await response.json();
      
      if (response.ok) {
        setRealizacje(data.realizacje || []);
      }
    } catch (err) {
      console.error('Error fetching realizacje:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePosts = async (realizacjaId: string) => {
    // Open modal or redirect to batch creation page
    window.location.href = `/admin/social-media/dodaj?from_realizacja=${realizacjaId}`;
  };

  if (loading) {
    return <div className="p-8">Ładowanie...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Realizacje Dashboard</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Dodaj Nową Realizację
          </Button>
        </div>

        <div className="space-y-6">
          {realizacje.map((realizacja) => (
            <Card key={realizacja.slug} className="overflow-hidden">
              <CardHeader className="bg-white border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">
                      📸 {realizacja.title}
                    </CardTitle>
                    <div className="text-sm text-gray-600">
                      📍 {realizacja.location} | 📅 {realizacja.date}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edytuj
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      Usuń
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Share2 className="w-4 h-4 mr-2" />
                    Posty Social Media
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(realizacja.social_media_summary).map(([platform, data]: [string, any]) => (
                      <div
                        key={platform}
                        className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(data.latest_status)}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{platformIcons[platform as keyof typeof platformIcons]}</span>
                          <div>
                            <div className="text-sm font-medium">
                              {platformNames[platform as keyof typeof platformNames]}
                            </div>
                            <div className="text-xs">
                              {getStatusText(data.latest_status, data.latest_post_date)}
                            </div>
                          </div>
                        </div>
                        <div>
                          {getStatusIcon(data.latest_status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={() => handleCreatePosts(realizacja.id)}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Utwórz Posty
                  </Button>
                  
                  {Object.values(realizacja.social_media_summary).some((s: any) => s.post_count > 0) && (
                    <Button size="sm" variant="outline">
                      👁️ Zobacz Posty ({
                        Object.values(realizacja.social_media_summary)
                          .reduce((acc: number, s: any) => acc + s.post_count, 0)
                      })
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 2. Database Structure Discussion: Single Table vs Separate Tables

### 2.1 Comparison

#### Option A: Single Unified Table (Current Proposal) ✅ RECOMMENDED

**Structure:**
```sql
CREATE TABLE social_media_posts (
  id UUID PRIMARY KEY,
  realizacja_id UUID REFERENCES realizacje(id),
  platform TEXT NOT NULL, -- 'google_business', 'instagram', etc.
  -- ... all fields
);
```

**Pros:**
- ✅ **Simpler queries** - One query to get all posts for a realizacja
- ✅ **Easier aggregation** - Dashboard summary is straightforward
- ✅ **Less code duplication** - One set of CRUD operations
- ✅ **Flexible** - Easy to add new platforms (just new enum value)
- ✅ **Unified API** - Same endpoints for all platforms
- ✅ **Better for analytics** - Cross-platform analytics easier
- ✅ **Foreign keys work well** - Single FK to realizacje table

**Cons:**
- ⚠️ Platform-specific fields in JSONB (less type-safe)
- ⚠️ Can't enforce platform-specific constraints at DB level

**Example Query:**
```sql
-- Get all posts for a realizacja
SELECT * FROM social_media_posts 
WHERE realizacja_id = '...' 
ORDER BY created_at DESC;

-- Get summary by platform
SELECT 
  platform,
  COUNT(*) as post_count,
  MAX(published_at) as latest_post
FROM social_media_posts
WHERE realizacja_id = '...'
GROUP BY platform;
```

#### Option B: Separate Tables Per Platform

**Structure:**
```sql
CREATE TABLE google_business_posts (
  id UUID PRIMARY KEY,
  realizacja_id UUID REFERENCES realizacje(id),
  call_to_action TEXT,
  offer_type TEXT,
  -- Google-specific fields
);

CREATE TABLE instagram_posts (
  id UUID PRIMARY KEY,
  realizacja_id UUID REFERENCES realizacje(id),
  location_tag TEXT,
  is_reel BOOLEAN,
  -- Instagram-specific fields
);

-- ... 4 more tables (facebook, tiktok, pinterest, linkedin)
```

**Pros:**
- ✅ **Type-safe** - Platform-specific fields are proper columns
- ✅ **DB constraints** - Can enforce NOT NULL, CHECK constraints
- ✅ **Clear schema** - Each table's purpose is explicit

**Cons:**
- ❌ **Complex queries** - Need UNION or multiple queries
- ❌ **Code duplication** - 6 sets of CRUD operations
- ❌ **Hard to maintain** - Changes need to be replicated
- ❌ **Difficult aggregation** - Dashboard summary requires 6 queries
- ❌ **More API endpoints** - 6x the code
- ❌ **Harder analytics** - Cross-platform comparison is complex

**Example Query:**
```sql
-- Get all posts for a realizacja (COMPLEX!)
SELECT 'google_business' as platform, id, title, content, published_at 
FROM google_business_posts WHERE realizacja_id = '...'
UNION ALL
SELECT 'instagram' as platform, id, title, content, published_at 
FROM instagram_posts WHERE realizacja_id = '...'
UNION ALL
SELECT 'facebook' as platform, id, title, content, published_at 
FROM facebook_posts WHERE realizacja_id = '...'
-- ... 3 more unions
ORDER BY published_at DESC;

-- Get summary by platform (6 QUERIES!)
-- Need to query each table separately
```

### 2.2 Recommendation: Single Unified Table ✅

**Why Single Table is Better:**

1. **Simplified Dashboard** - The dashboard you requested needs to show posts from ALL platforms for each realizacja. With a single table, this is ONE query. With separate tables, it's 6 queries.

2. **Unified API** - One endpoint handles all platforms:
   ```typescript
   POST /api/admin/social-media/create-post
   // Works for ALL platforms
   ```
   
   vs with separate tables:
   ```typescript
   POST /api/admin/google-business/create-post
   POST /api/admin/instagram/create-post
   POST /api/admin/facebook/create-post
   // ... 3 more endpoints
   ```

3. **AI Integration** - AI generates content that maps cleanly to a single structure:
   ```typescript
   const aiContent = await generateContent(realizacja, platform);
   
   // With single table:
   await createPost({ platform, ...aiContent });
   
   // With separate tables:
   switch(platform) {
     case 'google_business': await createGooglePost(aiContent); break;
     case 'instagram': await createInstagramPost(aiContent); break;
     // ... 4 more cases
   }
   ```

4. **Future-Proof** - Adding a new platform:
   - Single table: Add enum value, update AI prompts (1 hour)
   - Separate tables: Create table, write CRUD, update dashboard (1 day)

### 2.3 Hybrid Approach (Alternative)

If you REALLY want platform-specific tables for type safety:

**Structure:**
```sql
-- Core unified table
CREATE TABLE social_media_posts (
  id UUID PRIMARY KEY,
  realizacja_id UUID REFERENCES realizacje(id),
  platform TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL,
  -- common fields
);

-- Platform-specific metadata tables (optional)
CREATE TABLE google_business_metadata (
  post_id UUID PRIMARY KEY REFERENCES social_media_posts(id) ON DELETE CASCADE,
  call_to_action TEXT,
  offer_type TEXT,
  event_title TEXT
);

CREATE TABLE instagram_metadata (
  post_id UUID PRIMARY KEY REFERENCES social_media_posts(id) ON DELETE CASCADE,
  location_tag TEXT,
  is_reel BOOLEAN,
  share_to_feed BOOLEAN
);
```

**This gives you:**
- ✅ Single source of truth for common data
- ✅ Type-safe platform-specific fields
- ✅ Simple dashboard queries (only query main table)
- ✅ Optional detailed queries (JOIN when needed)

**But:**
- ⚠️ More complex to maintain (7 tables instead of 1)
- ⚠️ Still need 6 metadata tables

### 2.4 Final Recommendation

**Go with Single Unified Table** for these reasons:

1. **Your Use Case** - Dashboard showing all platforms per realizacja = single table wins
2. **AI Integration** - Unified structure matches AI output
3. **Maintenance** - Much easier to maintain 1 table + 1 API
4. **Flexibility** - JSONB handles platform differences well
5. **Performance** - Single table is actually FASTER for your queries

**Platform-specific fields go in `platform_metadata` JSONB column:**
```typescript
// Google Business post
{
  platform: 'google_business',
  content: '...',
  platform_metadata: {
    call_to_action: 'CALL',
    offer_type: 'UPDATE'
  }
}

// Instagram post
{
  platform: 'instagram',
  content: '...',
  platform_metadata: {
    location_tag: 'Warsaw, Poland',
    is_reel: true
  }
}
```

---

## 3. Updated Architecture Decision

### Keep Single Unified Table with Enhanced Dashboard

**Final Structure:**
- ✅ `social_media_posts` (unified table) - as originally proposed
- ✅ `oauth_tokens` (credentials) - as originally proposed
- ✅ `social_media_logs` (audit) - as originally proposed
- ✅ Enhanced dashboard showing per-realizacja social media status
- ✅ "Utwórz Posty" button on each realizacja card
- ✅ Visual indicators for each platform

**Database stays as originally designed**, but **Dashboard UI is enhanced** to show the status you requested.

---

## 4. Summary

### What Changes:
1. ✅ **Add new API endpoint** - `/api/admin/realizacje-with-social-media`
2. ✅ **Enhance dashboard** - Show platform status for each realizacja
3. ✅ **Add "Utwórz Posty" button** - Quick access to batch creation

### What Stays the Same:
1. ✅ **Single unified table** - `social_media_posts` (better for your use case)
2. ✅ **AI integration** - Continues to work as described
3. ✅ **All other architecture** - No changes needed

### Why Single Table is Best:
- ✅ Simpler dashboard implementation
- ✅ Easier to query and aggregate
- ✅ Less code duplication
- ✅ Better for AI integration
- ✅ Future-proof (easy to add platforms)

---

**Decision: Keep single unified table, enhance dashboard UI** ✅

This approach gives you exactly what you asked for (dashboard with platform status) while maintaining a clean, maintainable architecture.
