# Database Structure - Detailed Analysis for Platform-Specific Data

## 🎯 Addressing the Concern: Can One Table Handle Different Platform Requirements?

### TL;DR: TAK, jedna tabela obsługuje wszystkie różnice między platformami! ✅

---

## 1. Concrete Examples of Platform Differences

### 1.1 Real Data Each Platform Needs

| Platform | Unique Fields Needed | Common Fields |
|----------|---------------------|---------------|
| **Google Business** | • call_to_action (BOOK/CALL/ORDER)<br>• offer_type (EVENT/OFFER/PRODUCT)<br>• event_title, event_start_date, event_end_date<br>• action_url | • content<br>• images<br>• location<br>• published_at<br>• status |
| **Instagram** | • location_id (for geo-tagging)<br>• user_tags (array of @mentions)<br>• is_reel (boolean)<br>• cover_url (for Reels)<br>• share_to_feed (boolean)<br>• alt_text | Same as above |
| **Facebook** | • link (URL)<br>• link_description<br>• feeling (emoji status)<br>• place_id (location)<br>• tags (user IDs)<br>• published (boolean)<br>• target_audience (age/location) | Same as above |
| **TikTok** | • duet_enabled (boolean)<br>• stitch_enabled (boolean)<br>• comment_enabled (boolean)<br>• music_id<br>• privacy_level (PUBLIC/PRIVATE)<br>• video_cover_timestamp_ms | Same as above |
| **Pinterest** | • board_id (which board to post to)<br>• link (destination URL)<br>• note (description)<br>• dominant_color | Same as above |
| **LinkedIn** | • article_url<br>• visibility (PUBLIC/CONNECTIONS)<br>• company_page (boolean)<br>• organization_id<br>• share_commentary | Same as above |

---

## 2. How Single Table Handles This - Concrete Examples

### 2.1 Table Structure with JSONB

```sql
CREATE TABLE social_media_posts (
  id UUID PRIMARY KEY,
  realizacja_id UUID REFERENCES realizacje(id),
  
  -- COMMON FIELDS (same for all platforms)
  platform TEXT NOT NULL,
  post_type TEXT NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  short_description TEXT,
  hashtags TEXT[],
  images JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  location TEXT,
  keywords TEXT[],
  status TEXT DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  
  -- PLATFORM-SPECIFIC FIELDS (different for each platform)
  platform_metadata JSONB DEFAULT '{}'::jsonb,  -- 👈 This is the key!
  
  -- Platform response
  platform_post_id TEXT,
  platform_url TEXT,
  platform_response JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 Real Examples - How Data Looks in Database

#### Example 1: Google Business Post

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "realizacja_id": "123e4567-e89b-12d3-a456-426614174000",
  "platform": "google_business",
  "post_type": "photo",
  "title": "Posadzka żywiczna w garażu - Warszawa Mokotów",
  "content": "Nowa posadzka żywiczna w garażu - 40m² powierzchni pokrytej systemem epoksydowym...",
  "hashtags": ["#posadzkizywiczne", "#WarszawaMokotów", "#garaz"],
  "images": [
    {"url": "https://res.cloudinary.com/.../main.jpg", "alt": "Garaż po renowacji"}
  ],
  "location": "Warszawa, Mokotów",
  "status": "published",
  "published_at": "2024-12-20T10:00:00Z",
  
  // 👇 GOOGLE BUSINESS SPECIFIC DATA
  "platform_metadata": {
    "call_to_action": "CALL",
    "action_url": "tel:+48123456789",
    "offer_type": "UPDATE"
  },
  
  "platform_post_id": "accounts/123/locations/456/localPosts/789",
  "platform_url": "https://www.google.com/maps?cid=123456789"
}
```

#### Example 2: Instagram Post (Same Realizacja)

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "realizacja_id": "123e4567-e89b-12d3-a456-426614174000", // 👈 Same realizacja!
  "platform": "instagram",
  "post_type": "photo",
  "title": null, // Instagram doesn't use titles
  "content": "TRANSFORMACJA garażu w Warszawie! 🏠✨\n\nSzary kolor RAL 7037 to klasyka...",
  "hashtags": ["#posadzkizywiczne", "#posadzkaepoksydowa", "#garaz", "#remont", "#warszawa", ...], // 30 hashtags
  "images": [
    {"url": "https://res.cloudinary.com/.../main-1080x1080.jpg", "alt": "Garage transformation"}
  ],
  "location": "Warszawa, Mokotów",
  "status": "published",
  "published_at": "2024-12-21T11:00:00Z",
  
  // 👇 INSTAGRAM SPECIFIC DATA
  "platform_metadata": {
    "location_id": "213385402", // Warsaw location ID
    "location_tag": "Warsaw, Poland",
    "user_tags": [],
    "alt_text": "Szara posadzka epoksydowa w garażu, widok całości",
    "is_reel": false,
    "share_to_feed": true
  },
  
  "platform_post_id": "18234567890_12345678901234567",
  "platform_url": "https://www.instagram.com/p/ABC123def456/"
}
```

#### Example 3: TikTok Post (Same Realizacja)

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "realizacja_id": "123e4567-e89b-12d3-a456-426614174000", // 👈 Same realizacja!
  "platform": "tiktok",
  "post_type": "video",
  "title": null,
  "content": "POV: Twój garaż przeszedł GLOW UP w 3 DNI! 🔥",
  "hashtags": ["#garaz", "#posadzka", "#transformacja", "#FYP", "#ForYou"],
  "images": [],
  "video_url": "https://res.cloudinary.com/.../transformation-video.mp4",
  "location": "Warsaw",
  "status": "scheduled",
  "scheduled_at": "2024-12-28T19:00:00Z", // Best time for TikTok
  
  // 👇 TIKTOK SPECIFIC DATA
  "platform_metadata": {
    "duet_enabled": true,
    "stitch_enabled": true,
    "comment_enabled": true,
    "privacy_level": "PUBLIC_TO_EVERYONE",
    "video_cover_timestamp_ms": 5000, // Frame at 5 seconds
    "music_id": null // Using original sound
  },
  
  "platform_post_id": null, // Not published yet
  "platform_url": null
}
```

#### Example 4: Facebook Post

```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "realizacja_id": "123e4567-e89b-12d3-a456-426614174000",
  "platform": "facebook",
  "post_type": "photo",
  "content": "Czy warto zainwestować w posadzkę epoksydową w garażu? 🤔\n\nNasz najnowszy projekt...",
  "hashtags": ["#posadzkiżywiczne", "#garaż", "#warszawa"],
  "images": [
    {"url": "https://res.cloudinary.com/.../main-1200x630.jpg"}
  ],
  "status": "published",
  "published_at": "2024-12-21T13:00:00Z",
  
  // 👇 FACEBOOK SPECIFIC DATA
  "platform_metadata": {
    "link": "https://posadzkizywiczne.com/realizacje/garaz-warszawa-2024",
    "link_description": "Zobacz pełną galerię zdjęć",
    "feeling": null,
    "place_id": "123456789", // Facebook place ID for Warsaw
    "tags": [],
    "published": true,
    "target_audience": {
      "age_min": 25,
      "age_max": 55,
      "locations": ["PL"]
    }
  },
  
  "platform_post_id": "123456789_987654321",
  "platform_url": "https://www.facebook.com/yourpage/posts/123456789"
}
```

---

## 3. Query Examples - How It Works in Practice

### 3.1 Get All Posts for a Realizacja (Dashboard)

```sql
SELECT 
  id,
  platform,
  status,
  published_at,
  platform_url,
  platform_metadata
FROM social_media_posts
WHERE realizacja_id = '123e4567-e89b-12d3-a456-426614174000'
ORDER BY created_at DESC;
```

**Result:**
```
id                                   | platform        | status     | published_at        | platform_url
-------------------------------------|-----------------|------------|---------------------|-------------
550e8400-e29b-41d4-a716-446655440000 | google_business | published  | 2024-12-20 10:00:00 | https://...
660e8400-e29b-41d4-a716-446655440001 | instagram       | published  | 2024-12-21 11:00:00 | https://...
880e8400-e29b-41d4-a716-446655440003 | facebook        | published  | 2024-12-21 13:00:00 | https://...
770e8400-e29b-41d4-a716-446655440002 | tiktok          | scheduled  | 2024-12-28 19:00:00 | null
```

**One simple query gives you everything for the dashboard!** ✅

### 3.2 Get Platform-Specific Data When Needed

```sql
-- Get Google Business specific data
SELECT 
  content,
  platform_metadata->>'call_to_action' as call_to_action,
  platform_metadata->>'offer_type' as offer_type
FROM social_media_posts
WHERE platform = 'google_business'
  AND realizacja_id = '123e4567-e89b-12d3-a456-426614174000';
```

```sql
-- Get Instagram specific data
SELECT 
  content,
  platform_metadata->>'location_tag' as location_tag,
  platform_metadata->>'is_reel' as is_reel,
  platform_metadata->>'alt_text' as alt_text
FROM social_media_posts
WHERE platform = 'instagram'
  AND realizacja_id = '123e4567-e89b-12d3-a456-426614174000';
```

**JSONB operators (`->` and `->>`) let you query specific fields easily!** ✅

### 3.3 Dashboard Summary Query (Aggregation)

```sql
SELECT 
  platform,
  COUNT(*) as post_count,
  MAX(published_at) as latest_post_date,
  (SELECT status FROM social_media_posts sp2 
   WHERE sp2.platform = sp.platform 
     AND sp2.realizacja_id = sp.realizacja_id
   ORDER BY created_at DESC LIMIT 1) as latest_status
FROM social_media_posts sp
WHERE realizacja_id = '123e4567-e89b-12d3-a456-426614174000'
GROUP BY platform;
```

**Result:**
```
platform        | post_count | latest_post_date    | latest_status
----------------|------------|---------------------|---------------
google_business | 1          | 2024-12-20 10:00:00 | published
instagram       | 1          | 2024-12-21 11:00:00 | published
facebook        | 1          | 2024-12-21 13:00:00 | published
tiktok          | 1          | null                | scheduled
```

**Perfect for the dashboard you requested!** ✅

---

## 4. TypeScript Type Safety with JSONB

### 4.1 Platform-Specific Metadata Types

```typescript
// types/social-media.ts

export interface GoogleBusinessMetadata {
  call_to_action?: 'BOOK' | 'ORDER' | 'SHOP' | 'LEARN_MORE' | 'SIGN_UP' | 'CALL';
  offer_type?: 'EVENT' | 'OFFER' | 'PRODUCT' | 'UPDATE';
  event_title?: string;
  event_start_date?: string;
  event_end_date?: string;
  action_url?: string;
}

export interface InstagramMetadata {
  location_tag?: string;
  location_id?: string;
  user_tags?: Array<{ username: string; x?: number; y?: number }>;
  alt_text?: string;
  is_reel?: boolean;
  cover_url?: string;
  share_to_feed?: boolean;
}

export interface FacebookMetadata {
  link?: string;
  link_description?: string;
  feeling?: string;
  place_id?: string;
  tags?: string[];
  published?: boolean;
  target_audience?: {
    age_min?: number;
    age_max?: number;
    locations?: string[];
    locales?: string[];
  };
}

export interface TikTokMetadata {
  duet_enabled?: boolean;
  stitch_enabled?: boolean;
  comment_enabled?: boolean;
  music_id?: string;
  privacy_level?: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY';
  video_cover_timestamp_ms?: number;
}

export interface PinterestMetadata {
  board_id?: string;
  link?: string;
  note?: string;
  dominant_color?: string;
}

export interface LinkedInMetadata {
  article_url?: string;
  visibility?: 'PUBLIC' | 'CONNECTIONS';
  company_page?: boolean;
  organization_id?: string;
  share_commentary?: string;
}

// Union type for type safety
export type PlatformMetadata = 
  | GoogleBusinessMetadata 
  | InstagramMetadata 
  | FacebookMetadata 
  | TikTokMetadata 
  | PinterestMetadata 
  | LinkedInMetadata;
```

### 4.2 Type-Safe Helper Functions

```typescript
// lib/social-media-helpers.ts

export function getGoogleBusinessMetadata(post: SocialMediaPost): GoogleBusinessMetadata {
  if (post.platform !== 'google_business') {
    throw new Error('Post is not for Google Business');
  }
  return post.platform_metadata as GoogleBusinessMetadata;
}

export function getInstagramMetadata(post: SocialMediaPost): InstagramMetadata {
  if (post.platform !== 'instagram') {
    throw new Error('Post is not for Instagram');
  }
  return post.platform_metadata as InstagramMetadata;
}

// Usage in code:
const post = await getPost(postId);

if (post.platform === 'google_business') {
  const metadata = getGoogleBusinessMetadata(post);
  console.log(metadata.call_to_action); // TypeScript knows this field exists!
}

if (post.platform === 'instagram') {
  const metadata = getInstagramMetadata(post);
  console.log(metadata.is_reel); // TypeScript knows this field exists!
}
```

**You get full type safety even with JSONB!** ✅

---

## 5. Validation at Application Level

### 5.1 Platform-Specific Validation

```typescript
// lib/validation/social-media.ts

export function validateGoogleBusinessPost(post: Partial<SocialMediaPost>): boolean {
  if (post.platform !== 'google_business') return false;
  
  const metadata = post.platform_metadata as GoogleBusinessMetadata;
  
  // Validate required fields
  if (!post.content || post.content.length > 1500) {
    throw new Error('Google Business posts must be between 1-1500 characters');
  }
  
  // Validate call_to_action if present
  if (metadata?.call_to_action) {
    const validCTAs = ['BOOK', 'ORDER', 'SHOP', 'LEARN_MORE', 'SIGN_UP', 'CALL'];
    if (!validCTAs.includes(metadata.call_to_action)) {
      throw new Error('Invalid call_to_action for Google Business');
    }
  }
  
  return true;
}

export function validateInstagramPost(post: Partial<SocialMediaPost>): boolean {
  if (post.platform !== 'instagram') return false;
  
  const metadata = post.platform_metadata as InstagramMetadata;
  
  // Validate content length
  if (!post.content || post.content.length > 2200) {
    throw new Error('Instagram posts must be between 1-2200 characters');
  }
  
  // Validate hashtags
  if (post.hashtags && post.hashtags.length > 30) {
    throw new Error('Instagram supports max 30 hashtags');
  }
  
  // Validate image aspect ratio for Reels
  if (metadata?.is_reel && post.images.length > 0) {
    // Check if images are 9:16 ratio
  }
  
  return true;
}

// Similar validators for other platforms...
```

**Application-level validation gives you the same control as DB constraints!** ✅

---

## 6. Real-World Comparison: Separate Tables vs Single Table

### 6.1 Scenario: Update Dashboard to Show Post Count

**With Separate Tables (6 tables):**
```typescript
// Need to query 6 different tables!
const googlePosts = await supabase.from('google_business_posts')
  .select('*').eq('realizacja_id', id);
  
const instagramPosts = await supabase.from('instagram_posts')
  .select('*').eq('realizacja_id', id);
  
const facebookPosts = await supabase.from('facebook_posts')
  .select('*').eq('realizacja_id', id);
  
const tiktokPosts = await supabase.from('tiktok_posts')
  .select('*').eq('realizacja_id', id);
  
const pinterestPosts = await supabase.from('pinterest_posts')
  .select('*').eq('realizacja_id', id);
  
const linkedinPosts = await supabase.from('linkedin_posts')
  .select('*').eq('realizacja_id', id);

// Combine results manually
const allPosts = [
  ...googlePosts.data.map(p => ({...p, platform: 'google_business'})),
  ...instagramPosts.data.map(p => ({...p, platform: 'instagram'})),
  ...facebookPosts.data.map(p => ({...p, platform: 'facebook'})),
  ...tiktokPosts.data.map(p => ({...p, platform: 'tiktok'})),
  ...pinterestPosts.data.map(p => ({...p, platform: 'pinterest'})),
  ...linkedinPosts.data.map(p => ({...p, platform: 'linkedin'})),
];

// 6 queries, complex code, slow performance
```

**With Single Table:**
```typescript
// One simple query!
const { data: allPosts } = await supabase
  .from('social_media_posts')
  .select('*')
  .eq('realizacja_id', id);

// Done! Fast and simple.
```

### 6.2 Scenario: Add New Platform (YouTube)

**With Separate Tables:**
1. Create new table `youtube_posts` (write SQL migration)
2. Create new CRUD API routes (6-8 endpoints)
3. Update dashboard to query new table
4. Update TypeScript types
5. Create new form components
6. Test all integrations

**Estimated time: 1-2 days**

**With Single Table:**
1. Add 'youtube' to platform enum
2. Define `YouTubeMetadata` TypeScript interface
3. Add validation function
4. Update AI prompts

**Estimated time: 2-4 hours**

---

## 7. When Separate Tables WOULD Make Sense

Separate tables are only better if:

❌ **Each platform has 20+ unique fields** (not your case - max ~10)
❌ **Platforms are completely different systems** (not your case - all are social media posts)
❌ **You never need cross-platform queries** (not your case - dashboard needs all platforms)
❌ **Each platform has different access patterns** (not your case - all follow same CRUD)

**None of these apply to your social media system!**

---

## 8. Final Recommendation with Evidence

### ✅ STAY WITH SINGLE TABLE

**Why it's perfect for your needs:**

1. **Dashboard requirement** - You want to see ALL platforms per realizacja
   - Single table: 1 query ✅
   - Separate tables: 6 queries ❌

2. **Platform differences** - Yes, platforms need different data, but:
   - All share 80% of fields (content, images, status, dates)
   - Only 20% is platform-specific (handled perfectly by JSONB)
   - JSONB is flexible and fast for this use case

3. **AI integration** - AI generates unified structure
   - Easy to map AI output to single table ✅
   - Complex to route to 6 different tables ❌

4. **Code maintenance** - Adding new platforms
   - Single table: 2-4 hours ✅
   - Separate tables: 1-2 days ❌

5. **Type safety** - TypeScript gives you type safety with JSONB
   - Type unions + helper functions = same safety as separate tables ✅

### PostgreSQL JSONB is PERFECT for this

- ✅ Fast indexing (can index JSONB fields)
- ✅ Queryable (can filter on JSONB fields)
- ✅ Type-safe with TypeScript
- ✅ Flexible for platform differences
- ✅ No performance penalty for your use case

---

## 9. Summary: Your Exact Use Case

**You have:**
- 6 platforms with ~80% shared data, ~20% unique data
- Need to show all platforms together in dashboard
- Will use AI to generate content
- May add more platforms in future

**Perfect fit for single table with JSONB!** ✅

**Not a good fit for separate tables because:**
- Too much code duplication
- Dashboard queries become complex
- Adding platforms is slow
- No real benefits (JSONB handles differences perfectly)

---

## 10. Concrete Decision

### Keep Single Unified Table ✅

```sql
CREATE TABLE social_media_posts (
  -- Common fields for ALL platforms
  id, realizacja_id, platform, content, images, status, dates...
  
  -- Platform-specific fields in JSONB
  platform_metadata JSONB DEFAULT '{}'::jsonb
);
```

**This gives you:**
- ✅ Simple dashboard queries
- ✅ Easy AI integration
- ✅ Fast development
- ✅ Type safety with TypeScript
- ✅ Flexibility for platform differences
- ✅ Future-proof design

**Database schema stays exactly as proposed in original architecture!** 🎯
