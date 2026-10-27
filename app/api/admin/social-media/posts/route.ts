import { NextRequest, NextResponse } from 'next/server';
import { insertRow, query, queryOne } from '@/lib/db';

/**
 * GET /api/admin/social-media/posts
 * List all social media posts with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const platform = searchParams.get('platform');
    const status = searchParams.get('status');
    const realizacja_id = searchParams.get('realizacja_id');
    const page = Math.max(parseInt(searchParams.get('page') || '1') || 1, 1);
    const perPage = Math.min(Math.max(parseInt(searchParams.get('per_page') || '20') || 20, 1), 100);

    const conditions: string[] = [];
    const params: unknown[] = [];
    if (platform) {
      params.push(platform);
      conditions.push(`platform = $${params.length}`);
    }
    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }
    if (realizacja_id) {
      params.push(realizacja_id);
      conditions.push(`realizacja_id = $${params.length}`);
    }
    const where = conditions.length ? `where ${conditions.join(' and ')}` : '';

    const countRow = await queryOne<{ count: number }>(
      `select count(*) as count from social_media_posts ${where}`,
      params
    );
    const count = countRow?.count ?? 0;

    const posts = await query(
      `select * from social_media_posts ${where} order by created_at desc limit $${params.length + 1} offset $${params.length + 2}`,
      [...params, perPage, (page - 1) * perPage]
    );

    return NextResponse.json({
      success: true,
      posts,
      pagination: {
        page,
        per_page: perPage,
        total: count,
        total_pages: Math.ceil(count / perPage),
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

    try {
      const post = await insertRow('social_media_posts', {
        platform,
        post_type: body.post_type || 'photo',
        content,
        hashtags: hashtags || [],
        images: images || [],
        title,
        short_description,
        realizacja_id,
        platform_metadata: platform_metadata || {},
        status,
        scheduled_at,
      });

      return NextResponse.json({ success: true, post });
    } catch (error) {
      console.error('Error creating post:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create post' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/admin/social-media/posts:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
