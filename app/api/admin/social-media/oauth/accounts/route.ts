import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/admin/social-media/oauth/accounts
 * Fetch all connected OAuth accounts for a platform
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform') || 'google_business';

    // Fetch all tokens for the platform
    const { data: tokens, error } = await supabase
      .from('oauth_tokens')
      .select('id, platform, account_info, created_at')
      .eq('platform', platform)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Format accounts with user-friendly info
    const accounts = (tokens || []).map((token) => ({
      id: token.id,
      platform: token.platform,
      account_id: token.account_info?.account_id || 'unknown',
      account_name: token.account_info?.account_name || 'Nieznane konto',
      email: token.account_info?.email || '',
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
