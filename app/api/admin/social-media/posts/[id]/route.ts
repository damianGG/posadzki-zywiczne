import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/admin/social-media/posts/[id]
 * Get a single social media post
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { id } = params;

    const { data: post, error } = await supabase
      .from('social_media_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post,
    });
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
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { id } = params;
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

    // Build update object (only include provided fields)
    const updates: any = {};
    if (content !== undefined) updates.content = content;
    if (hashtags !== undefined) updates.hashtags = hashtags;
    if (images !== undefined) updates.images = images;
    if (title !== undefined) updates.title = title;
    if (short_description !== undefined) updates.short_description = short_description;
    if (platform_metadata !== undefined) updates.platform_metadata = platform_metadata;
    if (status !== undefined) updates.status = status;
    if (scheduled_at !== undefined) updates.scheduled_at = scheduled_at;
    if (published_at !== undefined) updates.published_at = published_at;
    if (published_url !== undefined) updates.published_url = published_url;
    if (error_message !== undefined) updates.error_message = error_message;

    const { data: post, error } = await supabase
      .from('social_media_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating post:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update post' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      post,
    });
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
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { id } = params;

    const { error } = await supabase
      .from('social_media_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete post' },
        { status: 500 }
      );
    }

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
