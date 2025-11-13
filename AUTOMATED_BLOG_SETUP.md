# Automated Daily Blog Article Generator

This system automatically generates blog articles daily using OpenAI's GPT-4 and DALL-E 3, with images stored in Cloudinary.

## File Structure

```
posadzki-zywiczne/
├── content/posts/              # Auto-generated blog articles
│   └── YYYY-MM-DD-slug.json
├── scripts/
│   └── generate-article.js     # Main generation script
├── lib/
│   ├── openai.js              # OpenAI API helpers
│   └── cloudinary.js          # Cloudinary upload helpers
└── .github/workflows/
    └── daily-articles.yml     # GitHub Actions workflow
```

## Features

- ✅ Daily automated article generation (6:00 AM UTC)
- ✅ AI-generated content (2000-4000 words in Polish)
- ✅ Realistic images using DALL-E 3 (1-3 per article)
- ✅ Automatic image upload to Cloudinary
- ✅ SEO-optimized JSON structure
- ✅ Prevents duplicate articles for the same day
- ✅ Automatic commit and push to repository

## Required Environment Variables

You need to set the following secrets in your GitHub repository:

### 1. OpenAI API Key
- **Name:** `OPENAI_API_KEY`
- **Get it from:** https://platform.openai.com/api-keys
- **Required for:** Article content generation and image generation

### 2. Cloudinary Configuration
- **Name:** `CLOUDINARY_CLOUD`
- **Value:** Your Cloudinary cloud name (e.g., `your-cloud-name`)
- **Get it from:** Cloudinary Dashboard > Settings

- **Name:** `CLOUDINARY_PRESET`
- **Value:** Your upload preset name (e.g., `blog-images`)
- **Setup:**
  1. Go to Cloudinary Dashboard > Settings > Upload
  2. Scroll to "Upload presets"
  3. Click "Add upload preset"
  4. Set "Signing Mode" to "Unsigned"
  5. Configure folder and transformations as needed
  6. Save and note the preset name

## Setup Instructions

### 1. Add GitHub Secrets

Go to your repository on GitHub:
```
Settings > Secrets and variables > Actions > New repository secret
```

Add these three secrets:
- `OPENAI_API_KEY`
- `CLOUDINARY_CLOUD`
- `CLOUDINARY_PRESET`

### 2. Enable GitHub Actions

The workflow is already configured in `.github/workflows/daily-articles.yml`.

GitHub Actions should be enabled by default. The workflow will:
- Run daily at 6:00 AM UTC
- Can also be triggered manually from the Actions tab

### 3. Manual Testing

To test the script locally:

```bash
# Set environment variables
export OPENAI_API_KEY="your-key"
export CLOUDINARY_CLOUD="your-cloud-name"
export CLOUDINARY_PRESET="your-preset"

# Run the script
node scripts/generate-article.js
```

### 4. Manual Trigger via GitHub

1. Go to your repository on GitHub
2. Click on "Actions" tab
3. Select "Generate Daily Blog Article" workflow
4. Click "Run workflow" button
5. Confirm and run

## How It Works

### Article Generation Process

1. **Check for existing article:** Prevents duplicate generation for the same day
2. **Generate topic:** Randomly selects from 15+ topics related to resin flooring
3. **Create content:** Uses GPT-4o-mini to generate 2000-4000 word article in Polish
4. **Generate images:** Creates 1-3 realistic photos using DALL-E 3
5. **Upload to Cloudinary:** Stores images with organized naming
6. **Save JSON:** Creates structured blog post file in `content/posts/`
7. **Commit & Push:** Automatically commits and pushes to repository

### JSON Structure

Each generated article follows this structure:

```json
{
  "id": "2025-01-15-article-slug",
  "slug": "article-slug",
  "title": "Article Title in Polish",
  "excerpt": "Brief description...",
  "content": "<h2>Full HTML content...</h2>",
  "author": {
    "name": "Damian",
    "avatar": "/profilowe.png",
    "bio": "Specjalista ds. posadzek przemysłowych"
  },
  "publishedAt": "2025-01-15",
  "updatedAt": "2025-01-15",
  "category": "Porady",
  "tags": ["tag1", "tag2"],
  "readTime": "8 min",
  "image": {
    "url": "https://res.cloudinary.com/...",
    "alt": "Article title",
    "caption": "Ilustracja do artykułu"
  },
  "cover": "https://res.cloudinary.com/...",
  "gallery": ["url1", "url2"],
  "seo": {
    "metaTitle": "SEO title",
    "metaDescription": "SEO description",
    "keywords": ["keyword1", "keyword2"],
    "canonicalUrl": "https://posadzkizywiczne.com/blog/slug"
  },
  "featured": false,
  "status": "published"
}
```

## Next.js Integration

The blog loader (`lib/blog.ts`) has been updated to:
- ✅ Support both `data/blog/` and `content/posts/` directories
- ✅ Handle new fields: `slug`, `cover`, `gallery`
- ✅ Search for posts with date prefixes (YYYY-MM-DD-slug.json)

## Monitoring

### Check Workflow Status
1. Go to repository > Actions tab
2. View workflow runs and logs
3. Check for errors or successful generations

### View Generated Articles
Check `content/posts/` directory for new JSON files

### Verify Deployment
After GitHub Actions commits:
1. Vercel will automatically deploy the changes
2. New article will be available at: `https://posadzkizywiczne.com/blog/[slug]`

## Troubleshooting

### Common Issues

**1. No article generated**
- Check GitHub Actions logs
- Verify environment variables are set
- Ensure OpenAI API key has credits

**2. Image upload fails**
- Verify Cloudinary preset is "unsigned"
- Check CLOUDINARY_CLOUD and CLOUDINARY_PRESET values
- Review Cloudinary upload settings

**3. Duplicate articles**
- Script automatically skips if article for today exists
- Check `content/posts/` for files starting with today's date

**4. Workflow not running**
- Verify GitHub Actions is enabled
- Check workflow file syntax
- Review repository permissions

## Cost Considerations

### OpenAI API Costs (approximate)
- **GPT-4o-mini:** ~$0.15-0.30 per article (2000-4000 words)
- **DALL-E 3:** ~$0.04-0.12 per image (1-3 images)
- **Total per day:** ~$0.20-0.50
- **Monthly:** ~$6-15

### Cloudinary
- Free tier: 25 GB storage, 25 GB bandwidth
- Should be sufficient for daily article images

## Customization

### Change Generation Time
Edit `.github/workflows/daily-articles.yml`:
```yaml
schedule:
  - cron: '0 6 * * *'  # Change time here (UTC)
```

### Modify Topics
Edit `lib/openai.js` > `generateRandomTopic()` function

### Adjust Image Count
Edit `scripts/generate-article.js`:
```javascript
const numImages = Math.floor(Math.random() * 3) + 1; // Change range
```

### Update Image Style
Edit `lib/openai.js` > `generateImages()` function to modify the prompt

## Support

For issues or questions:
1. Check workflow logs in GitHub Actions
2. Review error messages in the logs
3. Verify all environment variables are correctly set
4. Test locally first before debugging GitHub Actions

---

**Status:** ✅ System ready for deployment
**Next Step:** Add GitHub secrets and enable workflow
