# Architektura Systemu Postów Social Media

## 1. Przegląd Systemu

### 1.1 Cel
Rozszerzenie istniejącego systemu realizacji o możliwość generowania, zarządzania i publikowania postów na platformach społecznościowych:
- **Google Business Profile** (Wizytówka Google) - priorytet 1
- **Instagram** - priorytet 2
- **Facebook** - priorytet 3
- **TikTok** - priorytet 4
- **Pinterest** - priorytet 5
- **LinkedIn** - priorytet 6

### 1.2 Założenia Architektoniczne
- ✅ **Wykorzystanie istniejącej infrastruktury** - Admin panel, Supabase, Cloudinary, OpenAI
- ✅ **Minimalne zmiany** - Rozszerzenie, nie przepisywanie
- ✅ **Modułowa budowa** - Łatwe dodawanie nowych platform
- ✅ **AI-First** - Automatyczne generowanie treści zoptymalizowanych pod każdą platformę
- ✅ **Reużycie realizacji** - Posty mogą być generowane z istniejących realizacji

---

## 2. Architektura Danych

### 2.1 Nowa Tabela Supabase: `social_media_posts`

```sql
-- Create social_media_posts table
CREATE TABLE social_media_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Reference to realizacja (optional - post can be standalone)
  realizacja_id UUID REFERENCES realizacje(id) ON DELETE SET NULL,
  
  -- Platform identification
  platform TEXT NOT NULL, -- 'google_business', 'instagram', 'facebook', 'tiktok', 'pinterest', 'linkedin'
  post_type TEXT NOT NULL, -- 'photo', 'carousel', 'video', 'reel', 'story'
  
  -- Post content
  title TEXT,
  content TEXT NOT NULL, -- Main post text
  short_description TEXT, -- For platforms with character limits
  hashtags TEXT[], -- Platform-specific hashtags
  
  -- Media
  images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs from Cloudinary
  video_url TEXT, -- For video posts
  
  -- Platform-specific metadata
  platform_metadata JSONB DEFAULT '{}'::jsonb, -- Flexible field for platform-specific data
  
  -- Scheduling
  status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'failed', 'archived'
  scheduled_at TIMESTAMPTZ, -- When to publish
  published_at TIMESTAMPTZ, -- When actually published
  
  -- Platform response
  platform_post_id TEXT, -- ID from the platform after publishing
  platform_url TEXT, -- Direct link to published post
  platform_response JSONB, -- Full API response for debugging
  
  -- SEO and tracking
  location TEXT, -- For local SEO
  keywords TEXT[],
  
  -- AI generation tracking
  ai_generated BOOLEAN DEFAULT false,
  ai_prompt TEXT, -- Original prompt used
  ai_model TEXT, -- Model version used
  
  -- Cloudinary folder for cleanup
  cloudinary_folder TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_social_posts_platform ON social_media_posts(platform);
CREATE INDEX idx_social_posts_status ON social_media_posts(status);
CREATE INDEX idx_social_posts_scheduled ON social_media_posts(scheduled_at);
CREATE INDEX idx_social_posts_realizacja ON social_media_posts(realizacja_id);

-- Enable RLS
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;

-- Public read access for published posts
CREATE POLICY "Allow public read access to published posts" ON social_media_posts
  FOR SELECT USING (status = 'published');

-- Service role full access
CREATE POLICY "Allow service role full access" ON social_media_posts
  FOR ALL USING (true);
```

### 2.2 TypeScript Typy

**Nowy plik:** `types/social-media.ts`

```typescript
export type SocialMediaPlatform = 
  | 'google_business' 
  | 'instagram' 
  | 'facebook' 
  | 'tiktok' 
  | 'pinterest' 
  | 'linkedin';

export type PostType = 
  | 'photo' 
  | 'carousel' 
  | 'video' 
  | 'reel' 
  | 'story';

export type PostStatus = 
  | 'draft' 
  | 'scheduled' 
  | 'published' 
  | 'failed' 
  | 'archived';

export interface SocialMediaPost {
  id?: string;
  realizacja_id?: string;
  
  // Platform
  platform: SocialMediaPlatform;
  post_type: PostType;
  
  // Content
  title?: string;
  content: string;
  short_description?: string;
  hashtags: string[];
  
  // Media
  images: Array<{
    url: string;
    alt?: string;
    platform_optimized?: boolean;
  }>;
  video_url?: string;
  
  // Platform-specific
  platform_metadata: PlatformMetadata;
  
  // Scheduling
  status: PostStatus;
  scheduled_at?: string;
  published_at?: string;
  
  // Platform response
  platform_post_id?: string;
  platform_url?: string;
  platform_response?: any;
  
  // SEO
  location?: string;
  keywords?: string[];
  
  // AI tracking
  ai_generated: boolean;
  ai_prompt?: string;
  ai_model?: string;
  
  cloudinary_folder?: string;
  created_at?: string;
  updated_at?: string;
}

// Platform-specific metadata types
export interface GoogleBusinessMetadata {
  call_to_action?: 'BOOK' | 'ORDER' | 'SHOP' | 'LEARN_MORE' | 'SIGN_UP' | 'CALL';
  offer_type?: 'EVENT' | 'OFFER' | 'PRODUCT' | 'UPDATE';
  event_title?: string;
  event_start_date?: string;
  event_end_date?: string;
}

export interface InstagramMetadata {
  location_tag?: string;
  user_tags?: string[];
  alt_text?: string;
  is_reel?: boolean;
  cover_url?: string;
}

export interface FacebookMetadata {
  link?: string;
  link_description?: string;
  feeling?: string;
  target_audience?: {
    age_min?: number;
    age_max?: number;
    locations?: string[];
  };
}

export interface TikTokMetadata {
  duet_enabled?: boolean;
  stitch_enabled?: boolean;
  comment_enabled?: boolean;
  music_id?: string;
  privacy_level?: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
}

export interface PinterestMetadata {
  board_id?: string;
  link?: string;
  alt_text?: string;
  dominant_color?: string;
}

export interface LinkedInMetadata {
  article_url?: string;
  visibility?: 'PUBLIC' | 'CONNECTIONS';
  company_page?: boolean;
}

export type PlatformMetadata = 
  | GoogleBusinessMetadata 
  | InstagramMetadata 
  | FacebookMetadata 
  | TikTokMetadata 
  | PinterestMetadata 
  | LinkedInMetadata;
```

---

## 3. Struktura API

### 3.1 Nowe Endpointy Admin

```
app/api/admin/social-media/
├── generate-post/                 # POST - Generuj post z AI
│   └── route.ts
├── create-post/                   # POST - Utwórz post
│   └── route.ts
├── update-post/                   # PUT - Edytuj post
│   └── route.ts
├── delete-post/                   # DELETE - Usuń post
│   └── route.ts
├── list-posts/                    # GET - Lista postów
│   └── route.ts
├── get-post/                      # GET - Pojedynczy post
│   └── route.ts
├── publish-post/                  # POST - Publikuj post
│   └── route.ts
├── schedule-post/                 # POST - Zaplanuj post
│   └── route.ts
├── optimize-image/                # POST - Optymalizuj zdjęcie pod platformę
│   └── route.ts
└── from-realizacja/               # POST - Generuj posty z realizacji
    └── route.ts
```

### 3.2 Kluczowe Endpointy

#### 3.2.1 Generate Post (`/api/admin/social-media/generate-post`)

**Request:**
```typescript
{
  platform: 'google_business',
  realizacja_id?: 'uuid', // Opcjonalne - generuj z realizacji
  custom_prompt?: string, // Lub własny prompt
  images?: File[], // Nowe zdjęcia
  preferences?: {
    tone: 'professional' | 'casual' | 'friendly',
    length: 'short' | 'medium' | 'long',
    focus: 'technical' | 'benefits' | 'aesthetic'
  }
}
```

**Response:**
```typescript
{
  success: true,
  post: {
    content: "Wygenerowany tekst...",
    hashtags: ["#posadzkizywiczne", "#garaz"],
    title: "Tytuł posta",
    platform_optimized: true,
    character_count: 150,
    suggested_improvements: []
  }
}
```

#### 3.2.2 From Realizacja (`/api/admin/social-media/from-realizacja`)

Generuj posty dla wszystkich platform na podstawie realizacji:

**Request:**
```typescript
{
  realizacja_id: 'uuid',
  platforms: ['google_business', 'instagram', 'facebook'],
  auto_schedule?: boolean,
  schedule_interval_hours?: 24 // Odstęp między postami
}
```

**Response:**
```typescript
{
  success: true,
  posts: [
    { platform: 'google_business', post_id: 'uuid', status: 'draft' },
    { platform: 'instagram', post_id: 'uuid', status: 'draft' },
    { platform: 'facebook', post_id: 'uuid', status: 'draft' }
  ]
}
```

---

## 4. Struktura Komponentów UI

### 4.1 Nowe Strony Admin

```
app/admin/social-media/
├── page.tsx                       # Lista wszystkich postów
├── dodaj/
│   └── page.tsx                   # Formularz tworzenia posta
├── edytuj/
│   └── [id]/
│       └── page.tsx               # Edycja posta
└── kalendarz/
    └── page.tsx                   # Kalendarz postów (harmonogram)
```

### 4.2 Nowe Komponenty

```
components/admin/social-media/
├── post-form.tsx                  # Główny formularz posta
├── platform-selector.tsx          # Wybór platformy
├── content-preview.tsx            # Podgląd jak będzie wyglądał post
├── hashtag-generator.tsx          # Generator hashtagów
├── scheduling-calendar.tsx        # Kalendarz do planowania
├── platform-stats.tsx             # Statystyki per platforma
├── image-optimizer.tsx            # Optymalizacja obrazków
└── ai-content-generator.tsx       # Generator treści AI
```

### 4.3 Komponent Preview dla Każdej Platformy

```typescript
// components/admin/social-media/previews/
├── google-business-preview.tsx    # Podgląd Google Business
├── instagram-preview.tsx          # Podgląd Instagram
├── facebook-preview.tsx           # Podgląd Facebook
├── tiktok-preview.tsx             # Podgląd TikTok
├── pinterest-preview.tsx          # Podgląd Pinterest
└── linkedin-preview.tsx           # Podgląd LinkedIn
```

---

## 5. Generowanie Treści AI

### 5.1 Strategia Promptów

**Nowy plik:** `lib/ai/social-media-prompts.ts`

```typescript
export const platformPrompts = {
  google_business: {
    maxLength: 1500,
    tone: 'professional_local',
    features: ['call_to_action', 'location_focus', 'business_hours'],
    template: `Wygeneruj post dla Wizytówki Google dla firmy posadzek żywicznych.
    
WYMAGANIA:
- Maksymalnie 1500 znaków
- Lokalny focus (lokalizacja: {location})
- Call to action
- Zachęta do kontaktu
- Profesjonalny ton, ale przyjazny
- Konkretne informacje techniczne
- Korzyści dla klienta

DANE PROJEKTU:
{project_details}

Format JSON:
{
  "title": "Krótki tytuł (maks 58 znaków)",
  "content": "Treść posta",
  "call_to_action": "BOOK" | "CALL" | "LEARN_MORE",
  "hashtags": ["#hashtag1", "#hashtag2"] (3-5 lokalnych)
}`
  },
  
  instagram: {
    maxLength: 2200,
    tone: 'inspirational_visual',
    features: ['hashtags', 'emoji', 'line_breaks'],
    template: `Wygeneruj post na Instagram dla firmy posadzek żywicznych.

WYMAGANIA:
- Maksymalnie 2200 znaków
- Storytelling i emocje
- Użyj emoji (ale nie przesadzaj)
- Podział na akapity dla czytelności
- 15-30 hashtagów (mix popularnych i niszowych)
- First line hook (pierwsze 125 znaków przyciągają uwagę)
- Call to action na końcu

DANE PROJEKTU:
{project_details}

Format JSON:
{
  "content": "Treść posta z emoji i formatowaniem",
  "hashtags": ["#hashtag1", ...] (15-30),
  "alt_text": "Opisowy alt text dla accessibility"
}`
  },
  
  facebook: {
    maxLength: 63206,
    tone: 'conversational_community',
    features: ['questions', 'community_engagement', 'links'],
    template: `Wygeneruj post na Facebook dla firmy posadzek żywicznych.

WYMAGANIA:
- Długość: 100-300 znaków (krótkie posty mają lepsze zaangażowanie)
- Ton konwersacyjny
- Pytanie angażujące na końcu
- Może zawierać link
- 3-5 hashtagów (Facebook nie preferuje wielu)

DANE PROJEKTU:
{project_details}

Format JSON:
{
  "content": "Treść posta",
  "hashtags": ["#hashtag1", ...] (3-5),
  "link": "URL strony realizacji (opcjonalnie)",
  "question": "Pytanie angażujące społeczność"
}`
  },
  
  tiktok: {
    maxLength: 2200,
    tone: 'energetic_trendy',
    features: ['short_hooks', 'trends', 'challenges'],
    template: `Wygeneruj opis video na TikTok dla firmy posadzek żywicznych.

WYMAGANIA:
- Hook w pierwszym zdaniu
- Maksymalnie 2200 znaków, ale lepiej 100-150
- Młodzieżowy, energetyczny ton
- Odniesienie do trendów (jeśli pasują)
- 3-5 hashtagów + branżowe
- Call to action

DANE PROJEKTU:
{project_details}

Format JSON:
{
  "content": "Krótki, chwytliwy opis",
  "hashtags": ["#FYP", "#ForYou", "#hashtag3", ...],
  "video_script": "Propozycja scenariusza video (30-60 sec)"
}`
  },
  
  pinterest: {
    maxLength: 500,
    tone: 'inspirational_descriptive',
    features: ['keywords', 'detailed_description'],
    template: `Wygeneruj opis Pina dla firmy posadzek żywicznych.

WYMAGANIA:
- Tytuł: maks 100 znaków
- Opis: maks 500 znaków
- Bogatstwo słów kluczowych (Pinterest = wyszukiwarka)
- Inspirujący ton
- Konkretne korzyści
- 3-5 hashtagów

DANE PROJEKTU:
{project_details}

Format JSON:
{
  "title": "Tytuł Pina",
  "content": "Szczegółowy opis z keywords",
  "hashtags": ["#hashtag1", ...],
  "keywords": ["keyword1", "keyword2", ...],
  "alt_text": "Opisowy alt text"
}`
  },
  
  linkedin: {
    maxLength: 3000,
    tone: 'professional_authoritative',
    features: ['industry_insights', 'expertise', 'data'],
    template: `Wygeneruj post na LinkedIn dla firmy posadzek żywicznych.

WYMAGANIA:
- Profesjonalny, ekspercki ton
- 150-300 słów (sweet spot dla zaangażowania)
- Może zawierać dane, statystyki
- Insight branżowy lub case study
- Call to action biznesowy
- 3-5 branżowych hashtagów

DANE PROJEKTU:
{project_details}

Format JSON:
{
  "content": "Profesjonalna treść z insights",
  "hashtags": ["#hashtag1", ...] (3-5),
  "article_url": "Link do pełnego artykułu (opcjonalnie)"
}`
  }
};
```

### 5.2 Image Optimization dla Platform

**Nowy plik:** `lib/image-optimizer.ts`

```typescript
export const platformImageSpecs = {
  google_business: {
    post: { width: 1200, height: 900, ratio: '4:3' },
    formats: ['jpg', 'png'],
    maxSize: 5 * 1024 * 1024, // 5MB
  },
  instagram: {
    feed: { width: 1080, height: 1080, ratio: '1:1' },
    story: { width: 1080, height: 1920, ratio: '9:16' },
    reel: { width: 1080, height: 1920, ratio: '9:16' },
    carousel: { width: 1080, height: 1080, ratio: '1:1' },
    formats: ['jpg', 'png'],
    maxSize: 8 * 1024 * 1024, // 8MB
  },
  facebook: {
    feed: { width: 1200, height: 630, ratio: '1.91:1' },
    story: { width: 1080, height: 1920, ratio: '9:16' },
    formats: ['jpg', 'png'],
    maxSize: 4 * 1024 * 1024, // 4MB
  },
  tiktok: {
    video: { width: 1080, height: 1920, ratio: '9:16' },
    formats: ['mp4', 'mov'],
    maxSize: 287 * 1024 * 1024, // 287MB
    duration: { min: 3, max: 60 }, // seconds
  },
  pinterest: {
    standard: { width: 1000, height: 1500, ratio: '2:3' },
    square: { width: 1000, height: 1000, ratio: '1:1' },
    formats: ['jpg', 'png'],
    maxSize: 32 * 1024 * 1024, // 32MB
  },
  linkedin: {
    post: { width: 1200, height: 627, ratio: '1.91:1' },
    formats: ['jpg', 'png'],
    maxSize: 5 * 1024 * 1024, // 5MB
  }
};

export async function optimizeImageForPlatform(
  imageUrl: string,
  platform: SocialMediaPlatform,
  postType: PostType = 'photo'
): Promise<string> {
  // Implementation using Cloudinary transformations
  // Example: f_auto,q_auto,w_1080,h_1080,c_fill
}
```

---

## 6. Integracje z Platformami

### 6.1 Priorytet 1: Google Business Profile

**Nowy plik:** `lib/integrations/google-business.ts`

```typescript
import { google } from 'googleapis';

export class GoogleBusinessIntegration {
  private mybusinessbusinessinformation;
  private mybusinessbusinesscalls;
  
  constructor() {
    // OAuth2 setup
    // Use service account or OAuth2 client
  }
  
  async publishPost(post: SocialMediaPost): Promise<PublishResult> {
    // Use Google My Business API
    // POST /v1/{parent}/localPosts
  }
  
  async updatePost(postId: string, post: SocialMediaPost): Promise<void> {
    // PATCH request
  }
  
  async deletePost(postId: string): Promise<void> {
    // DELETE request
  }
  
  async getStats(postId: string): Promise<PostStats> {
    // GET insights
  }
}
```

**Wymagania:**
- Google Cloud Project z włączonym Google My Business API
- OAuth2 lub Service Account credentials
- Verification właściciela Business Profile

**API Dokumentacja:** 
https://developers.google.com/my-business/content/overview

### 6.2 Priorytet 2: Instagram

**Nowy plik:** `lib/integrations/instagram.ts`

```typescript
export class InstagramIntegration {
  private accessToken: string;
  private businessAccountId: string;
  
  async publishPost(post: SocialMediaPost): Promise<PublishResult> {
    // Instagram Graph API
    // 1. Create media container
    // 2. Publish container
    
    // POST /{ig-user-id}/media
    // POST /{ig-user-id}/media_publish
  }
  
  async publishReel(post: SocialMediaPost): Promise<PublishResult> {
    // Different endpoint for reels
  }
  
  async publishCarousel(post: SocialMediaPost): Promise<PublishResult> {
    // Carousel items
  }
  
  async getInsights(postId: string): Promise<InstagramInsights> {
    // GET /{media-id}/insights
  }
}
```

**Wymagania:**
- Facebook Developer Account
- Business Instagram Account linked to Facebook Page
- Instagram Graph API access token
- Permissions: `instagram_basic`, `instagram_content_publish`, `pages_read_engagement`

**API Dokumentacja:**
https://developers.facebook.com/docs/instagram-api

### 6.3 Priorytet 3: Facebook

**Nowy plik:** `lib/integrations/facebook.ts`

```typescript
export class FacebookIntegration {
  private accessToken: string;
  private pageId: string;
  
  async publishPost(post: SocialMediaPost): Promise<PublishResult> {
    // Facebook Graph API
    // POST /{page-id}/photos or /feed
  }
  
  async schedulePost(post: SocialMediaPost, scheduledTime: Date): Promise<void> {
    // scheduled_publish_time parameter
  }
  
  async getInsights(postId: string): Promise<FacebookInsights> {
    // GET /{post-id}/insights
  }
}
```

**Wymagania:**
- Facebook Developer Account
- Facebook Page
- Page Access Token (long-lived)
- Permissions: `pages_manage_posts`, `pages_read_engagement`

**API Dokumentacja:**
https://developers.facebook.com/docs/graph-api

### 6.4 Priorytet 4-6: TikTok, Pinterest, LinkedIn

Podobna struktura, różne API i wymagania.

---

## 7. Workflow i Przepływ Danych

### 7.1 Scenariusz 1: Nowy Post od Zera

```
[Admin Panel] → [Wybór Platformy] → [AI Generator] → [Preview] → [Publikacja]
     ↓                ↓                    ↓             ↓            ↓
  Platforma      Formularz            OpenAI        Edycja      Platform API
                 podstawowy           Prompt        treści      + Cloudinary
                  - Prompt                                      + Supabase
                  - Zdjęcia
```

### 7.2 Scenariusz 2: Posty z Realizacji

```
[Istniejąca Realizacja] → [Button: Utwórz Posty] → [Multi-Platform Generator]
            ↓                                                    ↓
    Dane z Supabase                                    Generuj dla każdej platformy
    - Zdjęcia                                          - Zoptymalizowana treść
    - Opis                                             - Dopasowane zdjęcia
    - Lokalizacja                                      - Hashtagi
                                                               ↓
                                                       [Review & Schedule]
                                                               ↓
                                                       [Batch Publish]
```

### 7.3 Scenariusz 3: Zaplanowane Publikacje

```
[Create Post] → [Set Schedule] → [Supabase Queue] → [Cron Job] → [Platform API]
                                       ↓                            
                            status: 'scheduled'                    
                            scheduled_at: timestamp                
                                       ↓                            
                            [Daily Check at 9:00]                 
                                       ↓                            
                            Find posts due today                   
                                       ↓                            
                            Publish via API                        
                                       ↓                            
                            Update status: 'published'             
```

---

## 8. Harmonogram Publikacji

### 8.1 Cron Job dla Scheduled Posts

**Nowy plik:** `app/api/cron/publish-scheduled-posts/route.ts`

```typescript
// Vercel Cron Job
// Runs every hour: 0 * * * *

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Get posts scheduled for now
  const now = new Date();
  const posts = await getScheduledPosts(now);
  
  // Publish each post
  for (const post of posts) {
    try {
      await publishToplatform(post);
      await updatePostStatus(post.id, 'published');
    } catch (error) {
      await updatePostStatus(post.id, 'failed', error);
    }
  }
  
  return Response.json({ 
    success: true, 
    published: posts.length 
  });
}
```

**Konfiguracja w `vercel.json`:**
```json
{
  "crons": [
    {
      "path": "/api/cron/publish-scheduled-posts",
      "schedule": "0 * * * *"
    }
  ]
}
```

---

## 9. Bezpieczeństwo i Uwierzytelnianie

### 9.1 API Keys Management

**Nowy plik:** `.env` (dodatkowe zmienne)

```bash
# Google Business Profile
GOOGLE_BUSINESS_CLIENT_ID=
GOOGLE_BUSINESS_CLIENT_SECRET=
GOOGLE_BUSINESS_REFRESH_TOKEN=
GOOGLE_BUSINESS_ACCOUNT_ID=

# Instagram (via Facebook)
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_PAGE_ID=
FACEBOOK_PAGE_ACCESS_TOKEN=
INSTAGRAM_BUSINESS_ACCOUNT_ID=

# Facebook
FACEBOOK_PAGE_ACCESS_TOKEN=

# TikTok
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
TIKTOK_ACCESS_TOKEN=

# Pinterest
PINTEREST_APP_ID=
PINTEREST_APP_SECRET=
PINTEREST_ACCESS_TOKEN=

# LinkedIn
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_ACCESS_TOKEN=
LINKEDIN_ORGANIZATION_ID=

# Cron Jobs
CRON_SECRET=
```

### 9.2 OAuth Flow

Dla platform wymagających OAuth (Google, Facebook, etc.):

```
app/api/oauth/
├── google/
│   ├── authorize/route.ts         # Redirect to Google
│   └── callback/route.ts          # Handle callback
├── facebook/
│   ├── authorize/route.ts
│   └── callback/route.ts
└── [platform]/
    ├── authorize/route.ts
    └── callback/route.ts
```

---

## 10. Monitoring i Analytics

### 10.1 Dashboard Statystyk

**Nowy komponent:** `components/admin/social-media/analytics-dashboard.tsx`

Pokazuje:
- Liczba postów per platforma
- Status postów (draft, published, failed)
- Zaplanowane publikacje (kalendarz)
- Engagement metrics (jeśli dostępne z API):
  - Likes/reactions
  - Comments
  - Shares
  - Reach
  - Impressions

### 10.2 Logs i Error Tracking

```typescript
// lib/logger.ts
export function logPublishAttempt(
  postId: string,
  platform: string,
  success: boolean,
  error?: any
) {
  // Log to Supabase logs table or external service (e.g., Sentry)
}
```

---

## 11. Roadmap Implementacji

### Faza 1: Fundament (Tydzień 1-2)
- [ ] Utworzenie tabeli `social_media_posts` w Supabase
- [ ] Dodanie TypeScript typów (`types/social-media.ts`)
- [ ] Podstawowa struktura API routes
- [ ] Formularz dodawania posta (podstawowy)
- [ ] AI generator dla Google Business Profile

### Faza 2: Google Business Profile (Tydzień 2-3)
- [ ] Integracja Google Business Profile API
- [ ] OAuth flow dla Google
- [ ] Publikacja postów
- [ ] Preview komponent dla Google Business
- [ ] Testy końcowe

### Faza 3: Instagram (Tydzień 3-4)
- [ ] Integracja Instagram Graph API
- [ ] OAuth flow via Facebook
- [ ] Feed posts, Reels, Carousel
- [ ] Preview komponent dla Instagram
- [ ] Optymalizacja obrazków (1:1, 9:16)

### Faza 4: Facebook (Tydzień 4-5)
- [ ] Integracja Facebook Graph API
- [ ] Publikacja postów
- [ ] Scheduling funkcjonalność
- [ ] Preview komponent

### Faza 5: TikTok, Pinterest, LinkedIn (Tydzień 5-7)
- [ ] Integracje pozostałych platform
- [ ] Platform-specific features
- [ ] Preview komponenty

### Faza 6: Advanced Features (Tydzień 7-8)
- [ ] Kalendarz publikacji (scheduling UI)
- [ ] Batch creation z realizacji
- [ ] Analytics dashboard
- [ ] Cron job dla scheduled posts
- [ ] Error handling i retry logic

### Faza 7: Polish & Testing (Tydzień 8-9)
- [ ] UI/UX improvements
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] End-to-end testing
- [ ] Documentation

---

## 12. Dodatkowe Funkcjonalności

### 12.1 Bulk Operations
- Wygeneruj posty dla wszystkich platform z jednej realizacji
- Batch scheduling (zaplanuj serie postów)
- Bulk editing (edytuj wiele postów naraz)

### 12.2 Templates
- Zapisz szablon posta
- Reużywaj szablony dla podobnych projektów
- Library szablonów per platforma

### 12.3 A/B Testing
- Testuj różne wersje treści
- Porównuj performance
- Automatyczna optymalizacja

### 12.4 Integration z Realizacjami
- Button "Utwórz posty" na stronie realizacji
- Automatyczne generowanie po publikacji realizacji
- Cross-linking (post → realizacja, realizacja → posty)

---

## 13. Koszty i Zasoby

### 13.1 API Costs (szacunkowe miesięcznie)

**OpenAI GPT-4:**
- ~$5-10 za 100 postów (w zależności od długości)

**Google Business Profile:**
- Free API

**Facebook/Instagram:**
- Free API (wymaga Business Account)

**TikTok:**
- Free API (wymaga Creator/Business Account)

**Pinterest:**
- Free API

**LinkedIn:**
- Free API (Community Management)

**Cloudinary:**
- Free tier: 25GB storage, 25GB bandwidth/month
- Płatny plan jeśli potrzebny: $89/month

**Supabase:**
- Free tier: 500MB database, 1GB bandwidth
- Płatny plan jeśli potrzebny: $25/month

### 13.2 Development Time

**Minimalne MVP (tylko Google Business + Instagram):**
- 2-3 tygodnie dev time

**Pełna implementacja (wszystkie platformy):**
- 6-8 tygodni dev time

---

## 14. Ryzyka i Mitigation

### 14.1 API Rate Limits
**Ryzyko:** Przekroczenie limitów API platform  
**Mitigation:** 
- Implement rate limiting
- Queue system
- Exponential backoff
- Cache responses

### 14.2 OAuth Token Expiration
**Ryzyko:** Tokeny wygasają, posty nie publikują się  
**Mitigation:**
- Automatic token refresh
- Alerting system
- Backup manual publish option

### 14.3 Platform Policy Changes
**Ryzyko:** Platformy zmieniają API lub zasady  
**Mitigation:**
- Modular design (łatwa wymiana)
- Monitor API deprecations
- Flexible error handling

### 14.4 AI Content Quality
**Ryzyko:** AI generuje niskiej jakości treść  
**Mitigation:**
- Always review before publish
- Human-in-the-loop workflow
- Quality scoring system
- User feedback loop

---

## 15. Podsumowanie

### 15.1 Kluczowe Założenia
✅ **Reużycie** - Maksymalne wykorzystanie istniejącej infrastruktury  
✅ **Modularność** - Łatwe dodawanie nowych platform  
✅ **AI-First** - Automatyzacja tworzenia treści  
✅ **Platform-Specific** - Optymalizacja pod każdą platformę  
✅ **Scheduling** - Planowanie publikacji  
✅ **Analytics** - Monitoring i statystyki  

### 15.2 Pierwsza Implementacja (MVP)
**Scope:** Google Business Profile + Instagram  
**Timeline:** 3-4 tygodnie  
**Features:**
- Tworzenie postów z AI
- Publikacja na Google Business
- Publikacja na Instagram
- Podstawowy scheduling
- Dashboard z listą postów

### 15.3 Następne Kroki
1. ✅ **Zatwierdzenie architektury** - Review tego dokumentu
2. 🔄 **Setup Supabase** - Utworzenie tabeli
3. 🔄 **OAuth Setup** - Konfiguracja Google/Facebook OAuth
4. 🔄 **AI Prompts** - Przygotowanie promptów
5. 🔄 **Development** - Start implementacji

---

## 16. Kontakt i Support

**Pytania architektury:**
- Review tego dokumentu przed rozpoczęciem implementacji
- Sugestie i feedback mile widziane

**Implementacja:**
- Start od Fazy 1 (Fundament)
- Iteracyjne podejście
- Regularne review i feedback

---

**Dokument Wersja:** 1.0  
**Data utworzenia:** 27 Grudnia 2024  
**Status:** ✅ Gotowy do review i implementacji
