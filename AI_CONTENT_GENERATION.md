# AI-Powered Content Generation for Realizacje

## Overview

This feature uses **OpenAI GPT-4** with Vision capabilities to automatically generate professional, SEO-optimized content for realizacje posts. Users only need to provide minimal information (location, project type, and images), and AI generates everything else.

## Features

### What AI Generates:

1. **SEO-Optimized Title** (50-60 characters)
   - Includes location and project type
   - Optimized for search engines

2. **Detailed Description** (300-500 words)
   - Introduction to the project
   - Scope of work
   - Technologies used
   - Final results
   - Client benefits
   - Natural keyword integration

3. **Technical Details**
   - Technology/system used (e.g., "Epoxy with quartz aggregate")
   - Color/shade (e.g., "Gray RAL 7037")
   - Project duration (e.g., "3 days")

4. **SEO Metadata**
   - 10-15 keywords (local SEO, phrase variants, long-tail)
   - 5-7 tags
   - Meta description (150-160 characters)
   - OG:title and OG:description for social media
   - Alt text for main image

5. **Features & Benefits**
   - 5-8 bullet points highlighting project advantages
   - Concrete benefits (e.g., "Chemical resistant", "Anti-slip surface")

6. **FAQ Section**
   - 3 common questions related to the project type
   - Detailed answers (2-3 sentences each)

## Setup

### 1. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Navigate to API Keys
4. Click "Create new secret key"
5. Copy the key (starts with `sk-...`)

### 2. Add to Environment Variables

Add to your `.env` file:

```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 3. Deploy

For Vercel:
1. Go to your project settings
2. Navigate to Environment Variables
3. Add `OPENAI_API_KEY` with your key
4. Redeploy your application

## Usage

### In the Admin Panel

1. **Navigate to** `/admin/realizacje/dodaj`
2. **Login** with your admin password
3. **Fill minimum required fields:**
   - Lokalizacja (Location) - e.g., "Warszawa, Mokotów"
   - Typ projektu (Project type) - select from dropdown
   - Kategoria (Category) - select from dropdown
   - *Optional:* Powierzchnia (Area) - e.g., "40 m²"
4. **Upload images** (optional but recommended)
   - From device
   - From Google Drive
   - AI will analyze the first image to understand colors, finishes, etc.
5. **Click "Wygeneruj przez AI"** (Generate with AI) button
6. **Wait 10-30 seconds** for AI to generate content
7. **Review and edit** the generated content if needed
8. **Submit** the form to save

### AI Generation Process

```
User Input (minimal):
├── Location: "Warszawa, Mokotów"
├── Type: "indywidualna"
├── Category: "garaz-podziemny"
├── Area: "40 m²" (optional)
└── Images: 3 photos (optional)

↓ AI Processing ↓

1. Image Analysis (GPT-4 Vision)
   └── Analyzes: color, finish, room type, quality

2. Content Generation (GPT-4)
   ├── SEO-optimized title
   ├── Professional description
   ├── Technical specifications
   ├── Keywords & tags
   ├── Meta descriptions
   └── FAQ section

↓ Result ↓

All form fields automatically filled!
User can review, edit, and submit.
```

## Cost Estimation

### OpenAI Pricing (as of December 2024):

**GPT-4o (with Vision):**
- Input: $5.00 / 1M tokens
- Output: $15.00 / 1M tokens

**Estimated cost per generation:**
- Image analysis: ~500 input tokens + 300 output tokens = ~$0.007
- Content generation: ~1000 input tokens + 1500 output tokens = ~$0.027
- **Total per realizacja: ~$0.034 (≈ 0.14 PLN)**

**Monthly estimate:**
- 50 realizacje/month: ~$1.70 (≈ 7 PLN)
- 100 realizacje/month: ~$3.40 (≈ 14 PLN)
- 200 realizacje/month: ~$6.80 (≈ 28 PLN)

Very affordable for the value provided!

## API Endpoint

### `POST /api/admin/generate-content`

**Request:**
```
Content-Type: multipart/form-data

Fields:
- location: string (required)
- type: string (required)
- category: string (required)
- area: string (optional)
- images: File[] (optional, analyzes first image)
```

**Response:**
```json
{
  "success": true,
  "content": {
    "title": "...",
    "description": "...",
    "technology": "...",
    "color": "...",
    "duration": "...",
    "keywords": "...",
    "tags": "...",
    "features": "...",
    "metaDescription": "...",
    "ogTitle": "...",
    "ogDescription": "...",
    "altText": "...",
    "faq": [
      {
        "question": "...",
        "answer": "..."
      }
    ]
  }
}
```

## SEO Benefits

### Local SEO Optimization
- AI automatically includes location in title and content
- Generates location-specific keywords
- Creates natural, location-based phrasing

### On-Page SEO
- Optimal title length (50-60 characters)
- Meta description with CTA (150-160 characters)
- Header structure optimization
- Keyword density and distribution
- Natural language processing

### Social Media Optimization
- Separate OG:title and OG:description
- Optimized for social sharing
- Emotional, engaging language for social

### Technical SEO
- Proper alt text for images
- Structured data-friendly FAQ format
- Schema.org compatible content
- Mobile-optimized text length

## Content Quality

### Language Style
- Professional but approachable
- Technical accuracy
- Natural keyword integration
- No keyword stuffing
- Polish language with proper characters

### Content Structure
- Clear introduction
- Detailed project description
- Scope of work
- Technologies used
- Results and benefits
- Client-focused messaging

### Consistency
- Follows industry terminology
- Maintains brand voice
- Consistent formatting
- Professional tone throughout

## Troubleshooting

### "OpenAI API key not configured"
**Solution:** Add `OPENAI_API_KEY` to your environment variables and redeploy.

### "Błąd podczas generowania treści AI"
**Causes:**
- Invalid API key
- Insufficient OpenAI credits
- Network connectivity issues
- Image too large (>20MB)

**Solutions:**
1. Verify API key is correct
2. Check OpenAI account has credits
3. Try with smaller images
4. Check server logs for detailed error

### Content not filling form fields
**Solution:** AI generates content but form might not update if there's a JavaScript error. Check browser console for errors.

### Content not in Polish
**Solution:** This shouldn't happen as prompts are in Polish. If it does, regenerate or report a bug.

## Best Practices

### For Best AI Results:

1. **Provide clear location**
   - Include city and district
   - e.g., "Warszawa, Mokotów" not just "Warszawa"

2. **Upload quality images**
   - Clear, well-lit photos
   - Show the actual floor/project
   - AI analyzes colors, finishes, quality

3. **Include area if possible**
   - Helps AI generate more specific content
   - e.g., "40 m²", "120 m²"

4. **Review and edit**
   - AI is great but not perfect
   - Always review generated content
   - Add client-specific details
   - Adjust tone if needed

5. **Use for inspiration**
   - Even if not using all content
   - Great starting point
   - Helps overcome writer's block

## Future Enhancements

Potential improvements:
- Generate OG images using DALL-E
- Automatic thumbnail creation
- Multi-language support
- Industry-specific terminology training
- Custom tone/style selection
- Batch generation for multiple realizacje
- A/B testing for SEO titles

## Security Considerations

### API Key Protection
- Never expose API key in client-side code
- Store only in server environment variables
- Use read-only keys when possible
- Rotate keys regularly

### Rate Limiting
- Implemented on API endpoint
- Prevents abuse
- Protects from cost overruns

### Content Moderation
- AI generates professional content only
- No harmful or inappropriate content
- Follows OpenAI usage policies

## Monitoring

### Track Usage
- Monitor API calls via OpenAI dashboard
- Track costs monthly
- Set billing alerts

### Quality Assurance
- Review generated content regularly
- Gather user feedback
- Iterate on prompts for better results

## Support

For issues or questions:
1. Check this documentation
2. Review server logs
3. Check OpenAI status page
4. Contact repository maintainer

---

**Status:** ✅ Production Ready  
**Last Updated:** December 2024  
**Version:** 1.0
