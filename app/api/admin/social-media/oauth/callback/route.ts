import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/admin/social-media/oauth/callback
 * Handles OAuth callback from Google
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin?oauth=error&message=${error}`);
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin?oauth=error&message=no_code`);
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get account info
    const mybusiness = google.mybusiness({ version: 'v4', auth: oauth2Client });
    let accountId = 'unknown';
    let accountName = 'Unknown';

    try {
      const accounts = await mybusiness.accounts.list();
      if (accounts.data.accounts && accounts.data.accounts.length > 0) {
        const account = accounts.data.accounts[0];
        accountId = account.name?.split('/')[1] || 'unknown';
        accountName = account.accountName || 'Unknown';
      }
    } catch (accountError) {
      console.error('Error fetching account info:', accountError);
      // Continue anyway - we have tokens
    }

    // Save to database
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { error: dbError } = await supabase.from('oauth_tokens').upsert({
      platform: 'google_business',
      access_token: tokens.access_token!,
      refresh_token: tokens.refresh_token!,
      expires_at: new Date(tokens.expiry_date!).toISOString(),
      platform_user_id: accountId,
      platform_username: accountName,
    }, {
      onConflict: 'platform',
    });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin?oauth=error&message=db_error`);
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin?oauth=success&platform=google_business`);
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin?oauth=error&message=${encodeURIComponent(error.message)}`);
  }
}
