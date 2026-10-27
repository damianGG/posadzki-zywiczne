import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, updateRow } from '@/lib/db';

/**
 * GET /api/admin/social-media/posts/[id]
 * Get a single social media post
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const post = await queryOne('select * from social_media_posts where id::text = $1', [id]);

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error in GET /api/admin/social-media/posts/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/social-media/posts/[id]
 * Update a social media post
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const {
      content,
      hashtags,
      images,
      title,
      short_description,
      platform_metadata,
      status,
      scheduled_at,
      published_at,
      published_url,
      error_message,
    } = body;

    const updates: Record<string, unknown> = {};
    if (content !== undefined) updates.content = content;
    if (hashtags !== undefined) updates.hashtags = hashtags;
    if (images !== undefined) updates.images = images;
    if (title !== undefined) updates.title = title;
    if (short_description !== undefined) updates.short_description = short_description;
    if (platform_metadata !== undefined) updates.platform_metadata = platform_metadata;
    if (status !== undefined) updates.status = status;
    if (scheduled_at !== undefined) updates.scheduled_at = scheduled_at;
    if (published_at !== undefined) updates.published_at = published_at;
    if (published_url !== undefined) updates.platform_url = published_url;
    if (error_message !== undefined) updates.platform_response = { error: error_message };

    const post = await updateRow('social_media_posts', 'id', id, updates);

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error in PUT /api/admin/social-media/posts/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/social-media/posts/[id]
 * Delete a social media post
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await query('delete from social_media_posts where id::text = $1', [id]);

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/admin/social-media/posts/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
