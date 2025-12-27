// Social Media Integration Types
// Based on SOCIAL_MEDIA_ARCHITECTURE.md

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

// Platform-specific metadata types
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

export type PlatformMetadata = 
  | GoogleBusinessMetadata 
  | InstagramMetadata 
  | FacebookMetadata 
  | TikTokMetadata 
  | PinterestMetadata 
  | LinkedInMetadata;

// Main social media post interface
export interface SocialMediaPost {
  id: string;
  realizacja_id?: string; // Optional - can be standalone post
  
  // Platform identification
  platform: SocialMediaPlatform;
  post_type: PostType;
  
  // Post content
  title?: string;
  content: string;
  short_description?: string;
  hashtags?: string[];
  
  // Media
  images?: Array<{
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  }>;
  video_url?: string;
  
  // Platform-specific metadata
  platform_metadata?: PlatformMetadata;
  
  // Scheduling
  status: PostStatus;
  scheduled_at?: string; // ISO timestamp
  published_at?: string; // ISO timestamp
  
  // Platform response
  platform_post_id?: string;
  platform_url?: string;
  platform_response?: Record<string, any>;
  
  // SEO and tracking
  location?: string;
  keywords?: string[];
  
  // AI generation tracking
  ai_generated?: boolean;
  ai_prompt?: string;
  ai_model?: string;
  
  // Cloudinary folder for cleanup
  cloudinary_folder?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// OAuth tokens for platforms
export interface OAuthToken {
  id: string;
  platform: SocialMediaPlatform;
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_at?: string; // ISO timestamp
  scope?: string;
  created_at: string;
  updated_at: string;
}

// Social media logs for audit trail
export interface SocialMediaLog {
  id: string;
  post_id: string;
  action: 'created' | 'updated' | 'published' | 'failed' | 'deleted';
  details?: Record<string, any>;
  error_message?: string;
  created_at: string;
}

// API request/response types
export interface GeneratePostRequest {
  platform: SocialMediaPlatform;
  realizacja_id?: string;
  preferences?: {
    tone?: 'professional' | 'casual' | 'friendly' | 'formal';
    length?: 'short' | 'medium' | 'long';
    focus?: string; // e.g., "emphasize durability", "local SEO"
  };
  custom_prompt?: string;
}

export interface GeneratePostResponse {
  success: boolean;
  content: string;
  hashtags: string[];
  title?: string;
  short_description?: string;
  platform_metadata?: PlatformMetadata;
  ai_model: string;
  error?: string;
}

export interface CreatePostRequest {
  realizacja_id?: string;
  platform: SocialMediaPlatform;
  post_type: PostType;
  content: string;
  title?: string;
  short_description?: string;
  hashtags?: string[];
  images?: Array<{ url: string; alt?: string }>;
  video_url?: string;
  platform_metadata?: PlatformMetadata;
  location?: string;
  keywords?: string[];
  status?: PostStatus;
  scheduled_at?: string;
  ai_generated?: boolean;
  ai_prompt?: string;
  ai_model?: string;
}

export interface CreatePostResponse {
  success: boolean;
  post?: SocialMediaPost;
  error?: string;
}

export interface BatchCreateFromRealizacjaRequest {
  realizacja_id: string;
  platforms: SocialMediaPlatform[];
  auto_schedule?: boolean;
  schedule_interval_hours?: number; // Hours between each platform's post
  preferences?: {
    tone?: 'professional' | 'casual' | 'friendly' | 'formal';
    length?: 'short' | 'medium' | 'long';
  };
}

export interface BatchCreateFromRealizacjaResponse {
  success: boolean;
  posts?: SocialMediaPost[];
  errors?: Array<{ platform: SocialMediaPlatform; error: string }>;
}

export interface PublishPostRequest {
  post_id: string;
}

export interface PublishPostResponse {
  success: boolean;
  platform_post_id?: string;
  platform_url?: string;
  error?: string;
}

export interface ListPostsQuery {
  realizacja_id?: string;
  platform?: SocialMediaPlatform;
  status?: PostStatus;
  limit?: number;
  offset?: number;
}

export interface ListPostsResponse {
  success: boolean;
  posts?: SocialMediaPost[];
  total?: number;
  error?: string;
}

// Dashboard types
export interface RealizacjaWithSocialMedia {
  // All realizacja fields
  slug: string;
  title: string;
  description: string;
  location: string;
  date: string;
  images: {
    main: string;
    gallery: string[];
  };
  
  // Social media summary
  social_media_summary: {
    google_business: PlatformSummary;
    instagram: PlatformSummary;
    facebook: PlatformSummary;
    tiktok: PlatformSummary;
    pinterest: PlatformSummary;
    linkedin: PlatformSummary;
  };
}

export interface PlatformSummary {
  post_count: number;
  latest_status: PostStatus | null;
  latest_post_date: string | null;
  latest_post_url: string | null;
}

// Helper types for validation
export interface PlatformConstraints {
  max_content_length: number;
  max_hashtags: number;
  max_images: number;
  supports_video: boolean;
  supports_carousel: boolean;
  required_image_ratio?: string; // e.g., "1:1", "9:16"
}

export const PLATFORM_CONSTRAINTS: Record<SocialMediaPlatform, PlatformConstraints> = {
  google_business: {
    max_content_length: 1500,
    max_hashtags: 10,
    max_images: 10,
    supports_video: true,
    supports_carousel: false,
  },
  instagram: {
    max_content_length: 2200,
    max_hashtags: 30,
    max_images: 10,
    supports_video: true,
    supports_carousel: true,
    required_image_ratio: '1:1', // or 4:5
  },
  facebook: {
    max_content_length: 63206, // Very high, but optimal is 100-300
    max_hashtags: 30,
    max_images: 10,
    supports_video: true,
    supports_carousel: true,
  },
  tiktok: {
    max_content_length: 2200,
    max_hashtags: 30,
    max_images: 0,
    supports_video: true,
    supports_carousel: false,
    required_image_ratio: '9:16',
  },
  pinterest: {
    max_content_length: 500,
    max_hashtags: 20,
    max_images: 1,
    supports_video: true,
    supports_carousel: false,
    required_image_ratio: '2:3',
  },
  linkedin: {
    max_content_length: 3000,
    max_hashtags: 3,
    max_images: 9,
    supports_video: true,
    supports_carousel: false,
  },
};
