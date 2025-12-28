import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

/**
 * GET /api/admin/social-media/oauth/google
 * Initiates Google OAuth flow for Google Business Profile
 */
export async function GET(request: NextRequest) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_BUSINESS_CLIENT_ID,
      process.env.GOOGLE_BUSINESS_CLIENT_SECRET,
      process.env.GOOGLE_BUSINESS_REDIRECT_URI
    );

    const scopes = [
      'https://www.googleapis.com/auth/business.manage',
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent', // Force consent screen to get refresh token
    });

    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Error initiating Google OAuth:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initiate OAuth flow' },
      { status: 500 }
    );
  }
}
