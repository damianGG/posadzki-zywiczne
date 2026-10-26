import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface OAuthTokenRow {
  id: string;
  platform: string;
  platform_user_id: string | null;
  platform_user_info: { account_name?: string; email?: string } | null;
  created_at: string;
}

/**
 * GET /api/admin/social-media/oauth/accounts
 * Fetch all connected OAuth accounts for a platform
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform') || 'google_business';

    const tokens = await query<OAuthTokenRow & Record<string, unknown>>(
      `select id, platform, platform_user_id, platform_user_info, created_at
       from oauth_tokens where platform = $1 order by created_at desc`,
      [platform]
    );

    const accounts = tokens.map((token) => ({
      id: token.id,
      platform: token.platform,
      account_id: token.platform_user_id || 'unknown',
      account_name: token.platform_user_info?.account_name || 'Nieznane konto',
      email: token.platform_user_info?.email || '',
      connected_at: token.created_at,
    }));

    return NextResponse.json({
      success: true,
      accounts,
      count: accounts.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
