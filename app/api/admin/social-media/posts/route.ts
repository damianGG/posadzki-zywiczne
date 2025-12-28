import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/admin/social-media/posts
 * List all social media posts with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);

    const platform = searchParams.get('platform');
    const status = searchParams.get('status');
    const realizacja_id = searchParams.get('realizacja_id');
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '20');

    let query = supabase
      .from('social_media_posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (platform) {
      query = query.eq('platform', platform);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (realizacja_id) {
      query = query.eq('realizacja_id', realizacja_id);
    }

    // Pagination
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    const { data: posts, error, count } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      posts: posts || [],
      pagination: {
        page,
        per_page: perPage,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / perPage),
      },
    });
  } catch (error) {
    console.error('Error in GET /api/admin/social-media/posts:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/social-media/posts
 * Create a new social media post
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();

    const {
      platform,
      content,
      hashtags,
      images,
      title,
      short_description,
      realizacja_id,
      platform_metadata,
      status = 'draft',
      scheduled_at,
    } = body;

    // Validation
    if (!platform) {
      return NextResponse.json(
        { success: false, error: 'Platform is required' },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    // Insert post
    const { data: post, error } = await supabase
      .from('social_media_posts')
      .insert({
        platform,
        content,
        hashtags: hashtags || [],
        images: images || [],
        title,
        short_description,
        realizacja_id,
        platform_metadata: platform_metadata || {},
        status,
        scheduled_at,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create post' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('Error in POST /api/admin/social-media/posts:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
