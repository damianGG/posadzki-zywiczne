# Google Business Profile - Testing Guide

## Complete Setup & Testing Instructions

This guide walks you through setting up and testing Google Business Profile integration from scratch.

---

## Prerequisites

- Google Business Profile account (free at https://business.google.com)
- Google Cloud Console access
- Business location verified on Google
- Node.js and access to your application

---

## Part 1: Google Cloud Setup (15 minutes)

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Name: `posadzki-zywiczne-social-media`
4. Click "Create"

### Step 2: Enable APIs

1. In Google Cloud Console, go to "APIs & Services" → "Library"
2. Search and enable these APIs:
   - **Google My Business API**
   - **Google My Business Account Management API**
   
3. Click "Enable" for each

### Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure OAuth consent screen first:
   - User Type: External
   - App name: `Posadzki Zywiczne Social Media`
   - User support email: your email
   - Developer contact: your email
   - Scopes: Add `https://www.googleapis.com/auth/business.manage`
   - Test users: Add your Google account email
   - Save and continue

4. Create OAuth client ID:
   - Application type: **Web application**
   - Name: `Posadzki Zywiczne OAuth`
   - Authorized redirect URIs: Add your callback URL:
     - Development: `http://localhost:3000/api/admin/social-media/oauth/callback`
     - Production: `https://your-domain.com/api/admin/social-media/oauth/callback`
   
5. Click "Create"
6. **Save the Client ID and Client Secret** - you'll need them!

---

## Part 2: Application Setup (10 minutes)

### Step 1: Add Environment Variables

Add to your `.env.local` file:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/admin/social-media/oauth/callback

# Enable Google Business
ENABLE_GOOGLE_BUSINESS=true
```

### Step 2: Install Dependencies

```bash
npm install googleapis
```

### Step 3: Run Database Migration

1. Open Supabase Dashboard → SQL Editor
2. Copy and paste the SQL from `supabase/migrations/001_social_media_tables.sql`
3. Click "Run"
4. Verify tables created:
   - `social_media_posts`
   - `oauth_tokens`
   - `social_media_logs`

---

## Part 3: OAuth Connection (5 minutes)

### Step 1: Start Your Application

```bash
npm run dev
```

### Step 2: Connect Google Business Profile

1. Create OAuth connection endpoint (temporary for testing):

Create `app/api/admin/social-media/oauth/google/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
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

2. Create callback endpoint `app/api/admin/social-media/oauth/callback/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get account info
    const mybusiness = google.mybusiness({ version: 'v4', auth: oauth2Client });
    const accounts = await mybusiness.accounts.list();
    const accountId = accounts.data.accounts?.[0]?.name?.split('/')[1];

    // Save to database
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    await supabase.from('oauth_tokens').upsert({
      platform: 'google_business',
      access_token: tokens.access_token!,
      refresh_token: tokens.refresh_token!,
      expires_at: new Date(tokens.expiry_date!).toISOString(),
      platform_user_id: accountId,
      platform_username: accounts.data.accounts?.[0]?.accountName || 'Unknown',
    });

    return NextResponse.redirect('http://localhost:3000/admin?oauth=success');
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

3. Visit in browser: `http://localhost:3000/api/admin/social-media/oauth/google`
4. Sign in with Google account that owns your business
5. Grant permissions
6. You'll be redirected back with success message

### Step 3: Verify Connection

Check Supabase Dashboard → Table Editor → oauth_tokens table. You should see a row with:
- platform: `google_business`
- access_token: (encrypted value)
- refresh_token: (encrypted value)
- expires_at: (future date)

---

## Part 4: Create & Publish a Test Post (10 minutes)

### Test 1: Generate AI Content

```bash
curl -X POST http://localhost:3000/api/admin/social-media/generate-post \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "google_business",
    "preferences": {
      "tone": "professional",
      "length": "medium"
    },
    "custom_prompt": "Write about our new epoxy garage floor installation in Warsaw"
  }'
```

Expected response:
```json
{
  "success": true,
  "content": "🏠 NOWA POSADZKA ŻYWICZNA W GARAŻU - WARSZAWA...",
  "hashtags": ["#posadzkizywiczne", "#garaz", "#warszawa", ...],
  "platform_metadata": {
    "call_to_action": "CALL"
  }
}
```

### Test 2: Create Draft Post

```bash
curl -X POST http://localhost:3000/api/admin/social-media/posts \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "google_business",
    "content": "🏠 Test post for Google Business Profile",
    "hashtags": ["#posadzkizywiczne", "#test"],
    "images": ["https://your-image-url.jpg"],
    "platform_metadata": {
      "call_to_action": "CALL"
    },
    "status": "draft"
  }'
```

Expected response:
```json
{
  "success": true,
  "post": {
    "id": "uuid-here",
    "platform": "google_business",
    "content": "...",
    "status": "draft",
    ...
  }
}
```

Save the `post.id` for next step!

### Test 3: Publish to Google Business Profile

```bash
curl -X POST http://localhost:3000/api/admin/social-media/publish \
  -H "Content-Type: application/json" \
  -d '{
    "post_id": "uuid-from-previous-step"
  }'
```

Expected response:
```json
{
  "success": true,
  "post": {
    "id": "...",
    "status": "published",
    "published_at": "2024-12-27T...",
    "published_url": "https://business.google.com/posts/l/..."
  },
  "published_url": "https://business.google.com/posts/l/..."
}
```

### Test 4: Verify on Google Business

1. Go to https://business.google.com
2. Select your business location
3. Click "Posts" in left sidebar
4. You should see your test post! 🎉

---

## Part 5: End-to-End Workflow Test

### Complete Workflow: Generate → Create → Publish

```bash
# Step 1: Generate content with AI
CONTENT=$(curl -s -X POST http://localhost:3000/api/admin/social-media/generate-post \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "google_business",
    "preferences": {
      "tone": "professional",
      "length": "short"
    },
    "custom_prompt": "Announce special offer for epoxy floors in December"
  }' | jq -r '.content')

# Step 2: Create post
POST_ID=$(curl -s -X POST http://localhost:3000/api/admin/social-media/posts \
  -H "Content-Type: application/json" \
  -d "{
    \"platform\": \"google_business\",
    \"content\": \"$CONTENT\",
    \"platform_metadata\": {
      \"call_to_action\": \"CALL\"
    },
    \"status\": \"draft\"
  }" | jq -r '.post.id')

echo "Created post: $POST_ID"

# Step 3: Publish
curl -X POST http://localhost:3000/api/admin/social-media/publish \
  -H "Content-Type: application/json" \
  -d "{
    \"post_id\": \"$POST_ID\"
  }"
```

---

## Troubleshooting

### Error: "Google Business Profile not connected"

**Solution:** Run OAuth flow again (Part 3, Step 2)

### Error: "Failed to refresh Google token"

**Solution:** 
1. Delete row from `oauth_tokens` table
2. Run OAuth flow again
3. Make sure `refresh_token` is saved

### Error: "Insufficient permissions"

**Solution:**
1. Google Cloud Console → APIs & Services → OAuth consent screen
2. Add scope: `https://www.googleapis.com/auth/business.manage`
3. Re-run OAuth flow

### Post created but not visible on Google

**Possible causes:**
- Location not verified on Google Business
- Account doesn't have posting permissions
- API quota exceeded (check Google Cloud Console)

**Solution:**
1. Verify your business location at https://business.google.com
2. Check API quotas in Google Cloud Console
3. Wait 5-10 minutes for post to appear

### Error: "Location not found"

**Solution:**
Get your location ID:
```bash
# This requires authenticated API call
# You can find location ID in Google Business dashboard URL
```

---

## Testing Checklist

- [ ] Google Cloud project created
- [ ] APIs enabled (My Business, Account Management)
- [ ] OAuth credentials created
- [ ] Environment variables added
- [ ] Database migrated
- [ ] OAuth connection successful
- [ ] Token saved in database
- [ ] AI content generation works
- [ ] Post creation works
- [ ] Publishing to Google works
- [ ] Post visible on Google Business Profile

---

## Next Steps

Once Google Business Profile is working:

1. **Add more platforms**: Instagram, Facebook (similar OAuth flow)
2. **Build admin UI**: Create React components for post management
3. **Add scheduling**: Implement cron job for scheduled posts
4. **Batch creation**: Generate posts for multiple platforms from realizacje

---

## Production Deployment

Before going live:

1. Update `GOOGLE_REDIRECT_URI` to production URL
2. Add production URL to Google OAuth authorized URIs
3. Verify OAuth consent screen is published
4. Test OAuth flow on production
5. Monitor API quotas and errors

---

## Support

If you encounter issues:

1. Check Supabase logs for database errors
2. Check Vercel logs for API errors
3. Check Google Cloud Console → APIs & Services → Credentials for OAuth issues
4. Verify all environment variables are set correctly

---

**You're all set!** 🚀 You can now publish posts to Google Business Profile using AI-generated content.
