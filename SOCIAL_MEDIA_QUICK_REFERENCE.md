# Social Media Integration - Quick Reference

## 🎯 Quick Start Guide

### Dla Użytkownika (Admin Panel)

1. **Zaloguj się** do panelu admin: `/admin/social-media`
2. **Kliknij** "Dodaj Nowy Post"
3. **Wybierz** platformę (Google Business, Instagram, etc.)
4. **Wygeneruj** treść przez AI lub wprowadź ręcznie
5. **Przeglądnij** preview jak post będzie wyglądał
6. **Opublikuj** natychmiast lub zaplanuj na później

### Dla Developera

```bash
# 1. Setup database
psql [supabase-url] < scripts/social-media-schema.sql

# 2. Add environment variables
cp .env.example .env
# Edit .env with your credentials

# 3. Run development server
npm run dev

# 4. Access admin panel
http://localhost:3000/admin/social-media
```

---

## 📊 Platform Quick Specs

### Google Business Profile
- **Max Length:** 1,500 characters
- **Images:** 1-10, 720x720px minimum
- **Video:** Up to 30 seconds
- **Call to Action:** BOOK, ORDER, LEARN_MORE, CALL, SIGN_UP, SHOP
- **Best Time:** Mon-Fri, 9 AM - 5 PM
- **Hashtags:** 3-5 local hashtags

### Instagram
- **Feed Post:** 2,200 characters max
- **Reel:** 2,200 characters, 15-90 seconds video
- **Story:** Text on image, 15 seconds
- **Image Size:** 1080x1080px (square), 1080x1350px (portrait)
- **Hashtags:** 20-30 (mix popular and niche)
- **Best Time:** Tue-Fri, 11 AM - 2 PM

### Facebook
- **Max Length:** 63,206 characters (but 100-300 optimal)
- **Images:** 1200x630px
- **Video:** Up to 240 minutes
- **Hashtags:** 3-5 (less is more)
- **Best Time:** Wed-Thu, 1 PM - 3 PM
- **Engagement:** Posts with questions get 100% more comments

### TikTok
- **Max Length:** 2,200 characters (but 100-150 optimal)
- **Video:** 15-60 seconds (3 min max for verified)
- **Aspect Ratio:** 9:16 (vertical)
- **Hashtags:** 3-5 + #FYP #ForYou
- **Best Time:** Tue-Thu, 6 PM - 10 PM
- **Trends:** Use trending sounds/effects

### Pinterest
- **Title:** 100 characters max
- **Description:** 500 characters max
- **Image:** 1000x1500px (2:3 ratio)
- **Hashtags:** 3-5 relevant
- **Best Time:** Sat-Sun, 8 PM - 11 PM
- **SEO:** Keywords in title and description

### LinkedIn
- **Max Length:** 3,000 characters (but 150-300 optimal)
- **Images:** 1200x627px
- **Video:** Up to 10 minutes
- **Hashtags:** 3-5 professional
- **Best Time:** Tue-Wed, 9 AM - 12 PM
- **Tone:** Professional, data-driven

---

## 🚀 API Endpoints Reference

### Admin Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/social-media/generate-post` | POST | Generate content with AI |
| `/api/admin/social-media/create-post` | POST | Create new post (draft) |
| `/api/admin/social-media/update-post` | PUT | Update existing post |
| `/api/admin/social-media/delete-post` | DELETE | Delete post |
| `/api/admin/social-media/list-posts` | GET | List all posts |
| `/api/admin/social-media/get-post` | GET | Get single post |
| `/api/admin/social-media/publish-post` | POST | Publish post to platform |
| `/api/admin/social-media/schedule-post` | POST | Schedule post |
| `/api/admin/social-media/from-realizacja` | POST | Generate posts from realizacja |

### Publishing Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/social-media/publish/google-business` | POST | Publish to Google |
| `/api/admin/social-media/publish/instagram` | POST | Publish to Instagram |
| `/api/admin/social-media/publish/facebook` | POST | Publish to Facebook |
| `/api/admin/social-media/publish/tiktok` | POST | Publish to TikTok |
| `/api/admin/social-media/publish/pinterest` | POST | Publish to Pinterest |
| `/api/admin/social-media/publish/linkedin` | POST | Publish to LinkedIn |

---

## 🔐 OAuth Setup Quick Guide

### Google Business Profile

```bash
# 1. Create project: https://console.cloud.google.com
# 2. Enable APIs:
#    - Google My Business API
#    - Google My Business Account Management API
# 3. Create OAuth 2.0 Client ID (Web application)
# 4. Add redirect URI: https://yourdomain.com/api/oauth/google/callback
# 5. Get Client ID and Secret
# 6. Authorize: https://yourdomain.com/api/oauth/google/authorize
```

### Facebook/Instagram

```bash
# 1. Create app: https://developers.facebook.com
# 2. Add Instagram product
# 3. Get App ID and App Secret
# 4. Get Page Access Token (Graph API Explorer)
# 5. Convert to Long-Lived Token (60 days)
# 6. Get Instagram Business Account ID
```

---

## 💾 Database Schema Quick View

### Table: `social_media_posts`

```sql
Key Columns:
- id (UUID, Primary Key)
- platform (TEXT: google_business, instagram, facebook, etc.)
- post_type (TEXT: photo, carousel, video, reel, story)
- content (TEXT: main post text)
- hashtags (TEXT ARRAY)
- images (JSONB: array of image objects)
- status (TEXT: draft, scheduled, published, failed)
- scheduled_at (TIMESTAMPTZ)
- published_at (TIMESTAMPTZ)
- platform_post_id (TEXT: ID from platform)
- platform_url (TEXT: link to published post)
- realizacja_id (UUID: optional reference)
```

---

## 🎨 AI Prompt Templates

### Google Business

```
Tone: Professional but friendly
Length: 500-1000 characters
Include:
- Location emphasis
- Technical details
- Customer benefits
- Call to action
- 3-5 local hashtags
```

### Instagram

```
Tone: Inspirational, visual
Length: 500-1500 characters
Include:
- Hook in first 125 characters
- Storytelling
- Emoji (moderate use)
- 20-30 hashtags
- Call to action at end
```

### Facebook

```
Tone: Conversational, community-focused
Length: 100-300 characters
Include:
- Engaging question at end
- Conversational language
- 3-5 hashtags
- Optional link
```

---

## 📅 Posting Schedule Recommendations

### Optimal Posting Times (Poland Time)

| Platform | Best Days | Best Times |
|----------|-----------|------------|
| Google Business | Mon-Fri | 9 AM - 5 PM |
| Instagram | Tue-Fri | 11 AM - 2 PM, 7 PM - 9 PM |
| Facebook | Wed-Thu | 1 PM - 3 PM |
| TikTok | Tue-Thu | 6 PM - 10 PM |
| Pinterest | Sat-Sun | 8 PM - 11 PM |
| LinkedIn | Tue-Wed | 9 AM - 12 PM |

### Posting Frequency

| Platform | Recommended Frequency |
|----------|----------------------|
| Google Business | 2-3 times per week |
| Instagram | Daily (1-2 posts) |
| Facebook | 1-2 times per day |
| TikTok | 1-3 times per day |
| Pinterest | 5-10 Pins per day |
| LinkedIn | 3-5 times per week |

---

## 🐛 Troubleshooting Quick Fixes

### "OAuth redirect failed"
```bash
✅ Check redirect URI matches exactly (http vs https)
✅ Verify no trailing slashes
✅ Check environment variables are set
```

### "API returns 403 Forbidden"
```bash
✅ Verify API is enabled in console
✅ Check OAuth scopes are correct
✅ Verify account has necessary permissions
```

### "Post failed to publish"
```bash
✅ Check access token is valid (not expired)
✅ Verify image sizes meet platform requirements
✅ Check character limits
✅ Review platform API status page
```

### "AI generation not working"
```bash
✅ Verify OPENAI_API_KEY is set
✅ Check OpenAI account has credits
✅ Verify API endpoint is accessible
✅ Check request payload format
```

---

## 🔧 Environment Variables Checklist

```bash
# Required for MVP (Google Business + Instagram)
✅ OPENAI_API_KEY
✅ GOOGLE_BUSINESS_CLIENT_ID
✅ GOOGLE_BUSINESS_CLIENT_SECRET
✅ GOOGLE_BUSINESS_REFRESH_TOKEN
✅ GOOGLE_BUSINESS_ACCOUNT_ID
✅ GOOGLE_BUSINESS_LOCATION_ID
✅ FACEBOOK_APP_ID
✅ FACEBOOK_APP_SECRET
✅ FACEBOOK_PAGE_ID
✅ FACEBOOK_PAGE_ACCESS_TOKEN
✅ INSTAGRAM_BUSINESS_ACCOUNT_ID
✅ SUPABASE_URL
✅ SUPABASE_SERVICE_ROLE_KEY
✅ CRON_SECRET
✅ ADMIN_PASSWORD

# Optional (other platforms)
⬜ TIKTOK_CLIENT_KEY
⬜ TIKTOK_CLIENT_SECRET
⬜ TIKTOK_ACCESS_TOKEN
⬜ PINTEREST_APP_ID
⬜ PINTEREST_APP_SECRET
⬜ PINTEREST_ACCESS_TOKEN
⬜ LINKEDIN_CLIENT_ID
⬜ LINKEDIN_CLIENT_SECRET
⬜ LINKEDIN_ACCESS_TOKEN
```

---

## 📚 Useful Resources

### API Documentation
- **Google My Business:** https://developers.google.com/my-business
- **Instagram Graph API:** https://developers.facebook.com/docs/instagram-api
- **Facebook Graph API:** https://developers.facebook.com/docs/graph-api
- **TikTok API:** https://developers.tiktok.com
- **Pinterest API:** https://developers.pinterest.com
- **LinkedIn API:** https://docs.microsoft.com/en-us/linkedin

### Image Optimization
- **Cloudinary:** https://cloudinary.com/documentation
- **Image Specs:** See SOCIAL_MEDIA_ARCHITECTURE.md Section 5.2

### AI Content
- **OpenAI Docs:** https://platform.openai.com/docs
- **Prompt Engineering:** https://platform.openai.com/docs/guides/prompt-engineering

---

## 🎯 MVP Checklist (Week 1-3)

### Week 1: Setup
- [ ] Create Supabase tables
- [ ] Add TypeScript types
- [ ] Setup Google OAuth
- [ ] Setup Facebook OAuth
- [ ] Add environment variables

### Week 2: Core Features
- [ ] Implement AI generation endpoint
- [ ] Create post form UI
- [ ] Build Google Business integration
- [ ] Build Instagram integration
- [ ] Add preview components

### Week 3: Polish & Test
- [ ] Test Google Business publishing
- [ ] Test Instagram publishing
- [ ] Add error handling
- [ ] Write documentation
- [ ] Deploy to production

---

## 💡 Pro Tips

### Content Creation
- ✨ **Always review AI-generated content** before publishing
- 📸 **Use high-quality images** - they get 2x more engagement
- 🎯 **First 3 words matter** - hook readers immediately
- 💬 **Ask questions** - increase engagement by 100%
- 📱 **Think mobile-first** - 80% of users are on mobile

### Hashtag Strategy
- 🔍 **Research** - use platform's search to find popular hashtags
- 🎯 **Mix sizes** - combine popular (1M+) and niche (10K-100K)
- 🏷️ **Brand hashtags** - create unique hashtag for your business
- 📍 **Location tags** - essential for local SEO
- 🔢 **Optimal count** - varies by platform (see specs above)

### Scheduling
- ⏰ **Consistency** - post regularly, same times
- 📊 **Analyze** - track when your audience is most active
- 🌍 **Time zones** - consider your target audience location
- 🎨 **Content mix** - 80% value, 20% promotional
- 📅 **Plan ahead** - schedule at least 1 week in advance

### Optimization
- 📈 **Track metrics** - views, engagement, clicks
- 🧪 **A/B test** - try different content styles
- 🔄 **Iterate** - improve based on performance
- 👥 **Engage** - respond to comments and messages
- 🎁 **Incentivize** - use CTAs, offers, contests

---

## 📞 Support

**For Technical Issues:**
- Check logs in Supabase Dashboard
- Review platform API status pages
- Check environment variables are set correctly

**For Content Questions:**
- Review platform best practices
- Analyze competitor posts
- Use AI for inspiration, human for finalization

**For API Rate Limits:**
- Implement exponential backoff
- Use queue system for bulk operations
- Monitor API usage dashboards

---

**Quick Reference Version:** 1.0  
**Last Updated:** 27 December 2024  
**Status:** ✅ Ready to Use
