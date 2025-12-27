# Social Media Integration - Przewodnik Implementacji

## Spis Treści
1. [Przygotowanie Środowiska](#1-przygotowanie-środowiska)
2. [Database Setup](#2-database-setup)
3. [TypeScript Types](#3-typescript-types)
4. [Przykłady API Endpoints](#4-przykłady-api-endpoints)
5. [Przykładowe Komponenty UI](#5-przykładowe-komponenty-ui)
6. [Przykłady AI Prompts](#6-przykłady-ai-prompts)
7. [OAuth Flows](#7-oauth-flows)
8. [Testing Strategy](#8-testing-strategy)

---

## 1. Przygotowanie Środowiska

### 1.1 Prerekvizity

**Wymagane:**
- ✅ Działający system realizacji (już jest)
- ✅ Supabase account i project (już jest)
- ✅ Cloudinary account (już jest)
- ✅ OpenAI API key (już jest)

**Nowe wymagania:**
- 🔲 Google Cloud Project (dla Google Business Profile)
- 🔲 Facebook Developer Account (dla Instagram/Facebook)
- 🔲 TikTok Developer Account (opcjonalnie)
- 🔲 Pinterest Developer Account (opcjonalnie)
- 🔲 LinkedIn Developer Account (opcjonalnie)

### 1.2 Konfiguracja Google Business Profile

#### Krok 1: Utwórz Google Cloud Project
```bash
1. Idź do https://console.cloud.google.com
2. Utwórz nowy project: "posadzki-social-media"
3. Włącz API:
   - Google My Business API (My Business Business Information API)
   - Google My Business Account Management API
```

#### Krok 2: Utwórz OAuth Credentials
```bash
1. W Google Cloud Console → APIs & Services → Credentials
2. CREATE CREDENTIALS → OAuth 2.0 Client ID
3. Application type: Web application
4. Authorized redirect URIs:
   - http://localhost:3000/api/oauth/google/callback (development)
   - https://yourdomain.com/api/oauth/google/callback (production)
5. Zapisz Client ID i Client Secret
```

#### Krok 3: Uzyskaj Access Token
```bash
# Use OAuth Playground or implement OAuth flow
# Endpoint: https://accounts.google.com/o/oauth2/v2/auth
# Scopes:
#   - https://www.googleapis.com/auth/business.manage
```

### 1.3 Konfiguracja Facebook/Instagram

#### Krok 1: Utwórz Facebook App
```bash
1. Idź do https://developers.facebook.com
2. My Apps → Create App
3. Use case: Business
4. Add Instagram Basic Display API
5. Add Instagram Graph API
```

#### Krok 2: Połącz Instagram Business Account
```bash
1. Instagram account musi być Business lub Creator
2. Połącz z Facebook Page
3. W Facebook App Settings:
   - Add Instagram Business Account
   - Uzyskaj Instagram Business Account ID
```

#### Krok 3: Uzyskaj Page Access Token
```bash
1. W Facebook Graph API Explorer
2. Wybierz swoją aplikację
3. Generate Access Token z permissions:
   - pages_manage_posts
   - pages_read_engagement
   - instagram_basic
   - instagram_content_publish
4. Zamień na Long-Lived Token (60 dni)
```

**Przykładowy request do zamiany na long-lived token:**
```bash
curl -i -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={short-lived-token}"
```

---

## 2. Database Setup

### 2.1 Utworzenie Tabeli w Supabase

```sql
-- Otwórz Supabase Dashboard → SQL Editor → New Query
-- Wklej poniższy kod i uruchom

-- Create social_media_posts table
CREATE TABLE social_media_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Reference to realizacja (optional)
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
  
  -- Media
  images JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  
  -- Platform-specific metadata
  platform_metadata JSONB DEFAULT '{}'::jsonb,
  
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
  ai_model TEXT DEFAULT 'gpt-4o',
  
  -- Cloudinary folder
  cloudinary_folder TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_social_posts_platform ON social_media_posts(platform);
CREATE INDEX idx_social_posts_status ON social_media_posts(status);
CREATE INDEX idx_social_posts_scheduled ON social_media_posts(scheduled_at);
CREATE INDEX idx_social_posts_realizacja ON social_media_posts(realizacja_id);
CREATE INDEX idx_social_posts_created ON social_media_posts(created_at DESC);

-- Enable Row Level Security
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access for published posts only
CREATE POLICY "Allow public read published posts" 
ON social_media_posts
FOR SELECT 
USING (status = 'published');

-- Policy: Service role full access (for admin operations)
CREATE POLICY "Allow service role full access" 
ON social_media_posts
FOR ALL 
USING (true);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_social_media_posts_updated_at
BEFORE UPDATE ON social_media_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Verify table creation
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'social_media_posts'
ORDER BY ordinal_position;
```

### 2.2 Dodatkowa Tabela: OAuth Tokens

```sql
-- Store OAuth tokens securely
CREATE TABLE oauth_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  scope TEXT,
  token_type TEXT DEFAULT 'Bearer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE oauth_tokens ENABLE ROW LEVEL SECURITY;

-- Only service role can access tokens
CREATE POLICY "Service role only" 
ON oauth_tokens
FOR ALL 
USING (true);

-- Update trigger
CREATE TRIGGER update_oauth_tokens_updated_at
BEFORE UPDATE ON oauth_tokens
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### 2.3 Logs Table (Optional but Recommended)

```sql
-- Track all publish attempts for debugging
CREATE TABLE social_media_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES social_media_posts(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'create', 'update', 'publish', 'delete'
  platform TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  request_data JSONB,
  response_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_logs_post_id ON social_media_logs(post_id);
CREATE INDEX idx_logs_created ON social_media_logs(created_at DESC);

ALTER TABLE social_media_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON social_media_logs FOR ALL USING (true);
```

---

## 3. TypeScript Types

### 3.1 Plik: `types/social-media.ts`

```typescript
// types/social-media.ts

/**
 * Social Media Platform Types
 */
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

/**
 * Main Social Media Post Interface
 */
export interface SocialMediaPost {
  id?: string;
  realizacja_id?: string | null;
  
  // Platform
  platform: SocialMediaPlatform;
  post_type: PostType;
  
  // Content
  title?: string;
  content: string;
  short_description?: string;
  hashtags: string[];
  
  // Media
  images: PostImage[];
  video_url?: string;
  
  // Platform-specific
  platform_metadata: PlatformMetadata;
  
  // Scheduling
  status: PostStatus;
  scheduled_at?: string | null;
  published_at?: string | null;
  
  // Platform response
  platform_post_id?: string | null;
  platform_url?: string | null;
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

/**
 * Image Interface
 */
export interface PostImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  platform_optimized?: boolean;
  cloudinary_public_id?: string;
}

/**
 * Platform-Specific Metadata
 */
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
  share_to_feed?: boolean; // For reels
}

export interface FacebookMetadata {
  link?: string;
  link_description?: string;
  feeling?: string;
  place_id?: string;
  tags?: string[]; // User IDs to tag
  target_audience?: {
    age_min?: number;
    age_max?: number;
    locations?: string[];
    locales?: string[];
  };
  published?: boolean;
}

export interface TikTokMetadata {
  duet_enabled?: boolean;
  stitch_enabled?: boolean;
  comment_enabled?: boolean;
  music_id?: string;
  privacy_level?: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY';
  disable_duet?: boolean;
  disable_stitch?: boolean;
  disable_comment?: boolean;
  video_cover_timestamp_ms?: number;
}

export interface PinterestMetadata {
  board_id?: string;
  link?: string;
  alt_text?: string;
  dominant_color?: string;
  note?: string; // Pinterest description
}

export interface LinkedInMetadata {
  article_url?: string;
  visibility?: 'PUBLIC' | 'CONNECTIONS';
  company_page?: boolean;
  organization_id?: string;
  share_commentary?: string;
}

export type PlatformMetadata = 
  | GoogleBusinessMetadata 
  | InstagramMetadata 
  | FacebookMetadata 
  | TikTokMetadata 
  | PinterestMetadata 
  | LinkedInMetadata;

/**
 * API Response Types
 */
export interface PublishResult {
  success: boolean;
  platform_post_id?: string;
  platform_url?: string;
  error?: string;
  raw_response?: any;
}

export interface PostStats {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  reach?: number;
  impressions?: number;
  engagement_rate?: number;
}

/**
 * AI Generation Types
 */
export interface AIGenerationRequest {
  platform: SocialMediaPlatform;
  realizacja_id?: string;
  custom_prompt?: string;
  images?: File[] | string[];
  preferences?: {
    tone?: 'professional' | 'casual' | 'friendly' | 'energetic';
    length?: 'short' | 'medium' | 'long';
    focus?: 'technical' | 'benefits' | 'aesthetic' | 'emotional';
    include_hashtags?: boolean;
    include_emojis?: boolean;
  };
}

export interface AIGenerationResponse {
  success: boolean;
  content?: string;
  title?: string;
  hashtags?: string[];
  short_description?: string;
  platform_metadata?: Partial<PlatformMetadata>;
  character_count?: number;
  suggested_improvements?: string[];
  error?: string;
}

/**
 * Form Data Types (for admin UI)
 */
export interface SocialMediaPostFormData {
  platform: SocialMediaPlatform;
  post_type: PostType;
  realizacja_id?: string;
  title?: string;
  content: string;
  short_description?: string;
  hashtags: string;
  location?: string;
  keywords?: string;
  scheduled_at?: Date | null;
  
  // Platform-specific fields
  call_to_action?: string;
  event_title?: string;
  event_start_date?: Date;
  event_end_date?: Date;
  link?: string;
  
  // AI generation
  ai_prompt?: string;
  use_ai?: boolean;
}
```

---

## 4. Przykłady API Endpoints

### 4.1 Generate Post with AI

**Plik:** `app/api/admin/social-media/generate-post/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { SocialMediaPlatform, AIGenerationResponse } from '@/types/social-media';
import { getSupabaseAdmin } from '@/lib/supabase-realizacje';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Platform-specific prompts
const platformPrompts = {
  google_business: `Wygeneruj post dla Wizytówki Google (Google Business Profile).

WYMAGANIA:
- Maksymalnie 1500 znaków
- Profesjonalny ton, ale przyjazny i zachęcający
- Podkreśl lokalizację i lokalną obsługę
- Konkretne informacje techniczne
- Korzyści dla klienta
- Call to action (wezwanie do działania)
- 3-5 hashtagów lokalnych

Format odpowiedzi (JSON):
{
  "title": "Krótki tytuł (maks 58 znaków)",
  "content": "Treść posta (opisowy, konkretny, z korzyściami)",
  "hashtags": ["#posadzkizywiczne", "#lokalizacja", ...],
  "call_to_action": "BOOK" | "CALL" | "LEARN_MORE",
  "short_description": "Krótki opis do 120 znaków"
}`,

  instagram: `Wygeneruj post na Instagram.

WYMAGANIA:
- Maksymalnie 2200 znaków
- Hook w pierwszych 125 znakach (przyciąga uwagę)
- Storytelling i emocje
- Emoji (umiarkowanie)
- Podział na akapity dla czytelności
- 20-30 hashtagów (mix popularnych i niszowych)
- Call to action na końcu

Format odpowiedzi (JSON):
{
  "content": "Treść z emoji i formatowaniem\n\n---\n\n#hashtagi na końcu",
  "hashtags": ["#posadzkizywiczne", "#design", "#remont", ...],
  "alt_text": "Opisowy alt text dla accessibility",
  "short_description": "Hook/First line (125 znaków)"
}`,

  facebook: `Wygeneruj post na Facebook.

WYMAGANIA:
- Długość: 100-300 znaków (krótkie posty = lepsze zaangażowanie)
- Ton konwersacyjny, przyjazny
- Pytanie angażujące na końcu
- 3-5 hashtagów (Facebook nie preferuje wielu)
- Może zawierać link

Format odpowiedzi (JSON):
{
  "content": "Treść posta + pytanie angażujące?",
  "hashtags": ["#posadzki", "#remont", "#design"],
  "link": "URL (opcjonalnie)",
  "short_description": "Krótki opis do 120 znaków"
}`,

  // Add other platforms...
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { 
      platform, 
      realizacja_id, 
      custom_prompt, 
      preferences 
    } = data;

    if (!platform) {
      return NextResponse.json(
        { success: false, error: 'Platform jest wymagany' },
        { status: 400 }
      );
    }

    // Get realizacja data if provided
    let realizacjaData = null;
    if (realizacja_id) {
      const supabase = getSupabaseAdmin();
      if (!supabase) {
        return NextResponse.json(
          { success: false, error: 'Database connection error' },
          { status: 500 }
        );
      }

      const { data, error } = await supabase
        .from('realizacje')
        .select('*')
        .eq('id', realizacja_id)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { success: false, error: 'Realizacja not found' },
          { status: 404 }
        );
      }

      realizacjaData = data;
    }

    // Build AI prompt
    const systemPrompt = platformPrompts[platform as SocialMediaPlatform] || platformPrompts.google_business;
    
    let userPrompt = custom_prompt || '';
    
    if (realizacjaData) {
      userPrompt += `\n\nDane realizacji:\n`;
      userPrompt += `- Tytuł: ${realizacjaData.title}\n`;
      userPrompt += `- Lokalizacja: ${realizacjaData.location}\n`;
      userPrompt += `- Opis: ${realizacjaData.description}\n`;
      userPrompt += `- Powierzchnia: ${realizacjaData.surface_area || 'brak'}\n`;
      userPrompt += `- Technologia: ${realizacjaData.technology || 'brak'}\n`;
      if (realizacjaData.features && realizacjaData.features.length > 0) {
        userPrompt += `- Cechy: ${realizacjaData.features.join(', ')}\n`;
      }
    }

    if (preferences) {
      userPrompt += `\n\nPreferencje:\n`;
      userPrompt += `- Ton: ${preferences.tone || 'professional'}\n`;
      userPrompt += `- Długość: ${preferences.length || 'medium'}\n`;
      userPrompt += `- Focus: ${preferences.focus || 'benefits'}\n`;
    }

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error('Empty response from OpenAI');
    }

    const generatedContent = JSON.parse(responseText);

    // Calculate character count
    const characterCount = generatedContent.content?.length || 0;

    const response: AIGenerationResponse = {
      success: true,
      content: generatedContent.content,
      title: generatedContent.title,
      hashtags: generatedContent.hashtags || [],
      short_description: generatedContent.short_description,
      platform_metadata: {
        call_to_action: generatedContent.call_to_action,
        alt_text: generatedContent.alt_text,
        link: generatedContent.link,
      },
      character_count: characterCount,
      suggested_improvements: [],
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'AI generation failed' },
      { status: 500 }
    );
  }
}
```

### 4.2 Create Post

**Plik:** `app/api/admin/social-media/create-post/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-realizacje';
import { SocialMediaPost } from '@/types/social-media';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const postData: Partial<SocialMediaPost> = await request.json();

    // Validate required fields
    if (!postData.platform || !postData.content) {
      return NextResponse.json(
        { success: false, error: 'Platform and content are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database connection error' },
        { status: 500 }
      );
    }

    // Insert into database
    const { data, error } = await supabase
      .from('social_media_posts')
      .insert([{
        platform: postData.platform,
        post_type: postData.post_type || 'photo',
        content: postData.content,
        title: postData.title,
        short_description: postData.short_description,
        hashtags: postData.hashtags || [],
        images: postData.images || [],
        video_url: postData.video_url,
        platform_metadata: postData.platform_metadata || {},
        status: postData.status || 'draft',
        scheduled_at: postData.scheduled_at,
        location: postData.location,
        keywords: postData.keywords,
        realizacja_id: postData.realizacja_id,
        ai_generated: postData.ai_generated || false,
        ai_prompt: postData.ai_prompt,
        ai_model: postData.ai_model || 'gpt-4o',
        cloudinary_folder: postData.cloudinary_folder,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase Insert Error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      post: data,
    });

  } catch (error: any) {
    console.error('Create Post Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### 4.3 Publish to Google Business

**Plik:** `app/api/admin/social-media/publish/google-business/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getSupabaseAdmin } from '@/lib/supabase-realizacje';

export const dynamic = 'force-dynamic';

// Initialize Google API client
function getGoogleClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_BUSINESS_CLIENT_ID,
    process.env.GOOGLE_BUSINESS_CLIENT_SECRET,
    process.env.GOOGLE_BUSINESS_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: process.env.GOOGLE_BUSINESS_ACCESS_TOKEN,
    refresh_token: process.env.GOOGLE_BUSINESS_REFRESH_TOKEN,
  });

  return oauth2Client;
}

export async function POST(request: NextRequest) {
  try {
    const { post_id } = await request.json();

    if (!post_id) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Get post from database
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database connection error' },
        { status: 500 }
      );
    }

    const { data: post, error: fetchError } = await supabase
      .from('social_media_posts')
      .select('*')
      .eq('id', post_id)
      .single();

    if (fetchError || !post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Publish to Google Business Profile
    const auth = getGoogleClient();
    const mybusiness = google.mybusinessbusinessinformation('v1');

    // Build post data
    const postData: any = {
      languageCode: 'pl',
      summary: post.content,
      media: post.images.map((img: any) => ({
        mediaFormat: 'PHOTO',
        sourceUrl: img.url,
      })),
    };

    // Add call to action if provided
    if (post.platform_metadata?.call_to_action) {
      postData.callToAction = {
        actionType: post.platform_metadata.call_to_action,
        url: post.platform_metadata.action_url || process.env.NEXT_PUBLIC_SITE_URL,
      };
    }

    // Add topic type
    if (post.platform_metadata?.offer_type) {
      postData.topicType = post.platform_metadata.offer_type;
    }

    // Publish
    const accountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID;
    const locationId = process.env.GOOGLE_BUSINESS_LOCATION_ID;

    const response = await mybusiness.accounts.locations.localPosts.create({
      auth,
      parent: `accounts/${accountId}/locations/${locationId}`,
      requestBody: postData,
    });

    // Update post in database
    const { error: updateError } = await supabase
      .from('social_media_posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        platform_post_id: response.data.name,
        platform_url: `https://www.google.com/maps?cid=${locationId}`,
        platform_response: response.data,
      })
      .eq('id', post_id);

    if (updateError) {
      console.error('Database Update Error:', updateError);
    }

    return NextResponse.json({
      success: true,
      platform_post_id: response.data.name,
      platform_url: `https://www.google.com/maps?cid=${locationId}`,
    });

  } catch (error: any) {
    console.error('Google Business Publish Error:', error);
    
    // Update post status to failed
    const { post_id } = await request.json();
    if (post_id) {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        await supabase
          .from('social_media_posts')
          .update({
            status: 'failed',
            platform_response: { error: error.message },
          })
          .eq('id', post_id);
      }
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## 5. Przykładowe Komponenty UI

### 5.1 Social Media Post Form

**Plik:** `components/admin/social-media/post-form.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { SocialMediaPlatform, PostType } from '@/types/social-media';

interface PostFormProps {
  realizacjaId?: string;
  onSubmit: (data: any) => void;
}

export default function SocialMediaPostForm({ realizacjaId, onSubmit }: PostFormProps) {
  const [platform, setPlatform] = useState<SocialMediaPlatform>('google_business');
  const [postType, setPostType] = useState<PostType>('photo');
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/admin/social-media/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          realizacja_id: realizacjaId,
          preferences: {
            tone: 'professional',
            length: 'medium',
            focus: 'benefits',
          },
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setContent(data.content || '');
        setHashtags(data.hashtags?.join(' ') || '');
        alert('✅ Treść wygenerowana przez AI!');
      } else {
        alert('❌ Błąd: ' + data.error);
      }
    } catch (error: any) {
      alert('❌ Błąd: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      platform,
      post_type: postType,
      content,
      hashtags: hashtags.split(/\s+/).filter(h => h.startsWith('#')),
      realizacja_id: realizacjaId,
      status: 'draft',
      ai_generated: false,
    };

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nowy Post Social Media</CardTitle>
          <CardDescription>
            Utwórz post dla wybranej platformy społecznościowej
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Platform Selection */}
          <div>
            <Label htmlFor="platform">Platforma</Label>
            <Select value={platform} onValueChange={(v) => setPlatform(v as SocialMediaPlatform)}>
              <SelectTrigger id="platform">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google_business">📍 Google Business Profile</SelectItem>
                <SelectItem value="instagram">📷 Instagram</SelectItem>
                <SelectItem value="facebook">👥 Facebook</SelectItem>
                <SelectItem value="tiktok">🎵 TikTok</SelectItem>
                <SelectItem value="pinterest">📌 Pinterest</SelectItem>
                <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Post Type */}
          <div>
            <Label htmlFor="post_type">Typ Posta</Label>
            <Select value={postType} onValueChange={(v) => setPostType(v as PostType)}>
              <SelectTrigger id="post_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="photo">📸 Zdjęcie</SelectItem>
                <SelectItem value="carousel">🎠 Karuzela</SelectItem>
                <SelectItem value="video">🎥 Video</SelectItem>
                <SelectItem value="reel">🎬 Reel</SelectItem>
                <SelectItem value="story">📖 Story</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* AI Generate Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleAIGenerate}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generowanie...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Wygeneruj Treść przez AI
              </>
            )}
          </Button>

          {/* Content */}
          <div>
            <Label htmlFor="content">Treść Posta</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Wprowadź treść posta lub wygeneruj przez AI..."
              rows={10}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              Znaków: {content.length}
            </p>
          </div>

          {/* Hashtags */}
          <div>
            <Label htmlFor="hashtags">Hashtagi</Label>
            <Input
              id="hashtags"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#posadzkizywiczne #garaz #remont"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Oddziel spacjami, np. #tag1 #tag2 #tag3
            </p>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full">
            Zapisz jako Draft
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
```

---

## 6. Przykłady AI Prompts

(Zobacz SOCIAL_MEDIA_ARCHITECTURE.md sekcja 5.1)

---

## 7. OAuth Flows

### 7.1 Google OAuth Implementation

**Plik:** `app/api/oauth/google/authorize/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_BUSINESS_CLIENT_ID,
    process.env.GOOGLE_BUSINESS_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/oauth/google/callback`
  );

  const scopes = [
    'https://www.googleapis.com/auth/business.manage',
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });

  return NextResponse.redirect(url);
}
```

**Plik:** `app/api/oauth/google/callback/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getSupabaseAdmin } from '@/lib/supabase-realizacje';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code provided' },
      { status: 400 }
    );
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_BUSINESS_CLIENT_ID,
      process.env.GOOGLE_BUSINESS_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/oauth/google/callback`
    );

    const { tokens } = await oauth2Client.getToken(code);

    // Store tokens in database
    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase
        .from('oauth_tokens')
        .upsert({
          platform: 'google_business',
          access_token: tokens.access_token!,
          refresh_token: tokens.refresh_token,
          expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
          scope: tokens.scope,
          token_type: tokens.token_type,
        });
    }

    // Redirect to admin panel
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/admin/social-media?oauth=success`);

  } catch (error: any) {
    console.error('OAuth Error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/admin/social-media?oauth=error`);
  }
}
```

---

## 8. Testing Strategy

### 8.1 Manual Testing Checklist

**Google Business Profile:**
- [ ] OAuth flow działa
- [ ] Post publikuje się na wizytówce
- [ ] Zdjęcia są poprawnie przesłane
- [ ] Call to action działa
- [ ] Post jest widoczny publicznie

**Instagram:**
- [ ] OAuth flow działa
- [ ] Feed post publikuje się
- [ ] Reel publikuje się
- [ ] Carousel działa
- [ ] Hashtagi są dodawane
- [ ] Alt text jest ustawiony

**Facebook:**
- [ ] OAuth flow działa
- [ ] Post publikuje się na stronie
- [ ] Link preview działa
- [ ] Scheduled posts działają

### 8.2 E2E Test Example (Optional)

```typescript
// tests/social-media.test.ts (pseudo-code)

import { test, expect } from '@playwright/test';

test('Create and publish Google Business post', async ({ page }) => {
  // Login to admin
  await page.goto('/admin');
  await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD!);
  await page.click('button[type="submit"]');

  // Navigate to social media
  await page.goto('/admin/social-media/dodaj');

  // Select platform
  await page.selectOption('select[id="platform"]', 'google_business');

  // Generate content with AI
  await page.click('button:has-text("Wygeneruj przez AI")');
  await page.waitForSelector('textarea[id="content"]:not(:empty)');

  // Verify content is generated
  const content = await page.inputValue('textarea[id="content"]');
  expect(content.length).toBeGreaterThan(100);

  // Save as draft
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/admin\/social-media$/);

  // Verify post appears in list
  await expect(page.locator('text="Draft"')).toBeVisible();
});
```

---

## 9. Deployment Checklist

### 9.1 Environment Variables (Production)

```bash
# Add to Vercel Environment Variables:

# OpenAI (existing)
OPENAI_API_KEY=sk-...

# Google Business Profile
GOOGLE_BUSINESS_CLIENT_ID=...
GOOGLE_BUSINESS_CLIENT_SECRET=...
GOOGLE_BUSINESS_REFRESH_TOKEN=...
GOOGLE_BUSINESS_ACCOUNT_ID=...
GOOGLE_BUSINESS_LOCATION_ID=...

# Facebook/Instagram
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
FACEBOOK_PAGE_ID=...
FACEBOOK_PAGE_ACCESS_TOKEN=...
INSTAGRAM_BUSINESS_ACCOUNT_ID=...

# Cron Secret
CRON_SECRET=... (generate random string)

# Supabase (existing)
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### 9.2 Deployment Steps

1. **Database:**
   ```bash
   - Run SQL scripts in Supabase Dashboard
   - Verify tables created
   - Test RLS policies
   ```

2. **OAuth:**
   ```bash
   - Set up OAuth apps in Google/Facebook
   - Add redirect URIs
   - Test OAuth flows in production
   ```

3. **API:**
   ```bash
   - Deploy to Vercel
   - Test API endpoints
   - Check logs for errors
   ```

4. **Cron Jobs:**
   ```bash
   - Add cron configuration to vercel.json
   - Verify cron secret
   - Test scheduled publications
   ```

5. **Monitoring:**
   ```bash
   - Set up error tracking (Sentry)
   - Monitor API usage (OpenAI, Google, Facebook)
   - Set up alerts for failures
   ```

---

## 10. Troubleshooting

### Common Issues:

**Issue:** OAuth redirect fails  
**Solution:** Check redirect URI matches exactly (http vs https, trailing slash)

**Issue:** Google Business API returns 403  
**Solution:** Verify API is enabled in Google Cloud Console and account has permissions

**Issue:** Instagram posts fail  
**Solution:** Verify Instagram account is Business type and linked to Facebook Page

**Issue:** AI generation fails  
**Solution:** Check OpenAI API key and credits balance

**Issue:** Scheduled posts don't publish  
**Solution:** Verify cron job is configured and CRON_SECRET is set

---

**Document Version:** 1.0  
**Last Updated:** 27 December 2024  
**Status:** ✅ Ready for Implementation
