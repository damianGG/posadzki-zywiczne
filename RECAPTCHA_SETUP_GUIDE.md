# Google reCAPTCHA v3 Setup Guide

## Overview
This guide will help you set up Google reCAPTCHA v3 for the contest form to prevent bot submissions.

## What is reCAPTCHA v3?
- **Invisible protection**: No checkboxes or challenges for users
- **Score-based**: Returns a score from 0.0 (bot) to 1.0 (human)
- **Seamless UX**: Works in the background without user interaction
- **Smart detection**: Uses advanced risk analysis

## Step-by-Step Setup

### 1. Create a Google reCAPTCHA Account
1. Go to https://www.google.com/recaptcha/admin
2. Sign in with your Google account
3. Click the **+** button to register a new site

### 2. Configure Your Site
Fill in the registration form:

- **Label**: `Posadzki Zywiczne Contest` (or any name you prefer)
- **reCAPTCHA type**: Select **reCAPTCHA v3**
- **Domains**: Add your domains
  - For production: `posadzkizywiczne.com`
  - For development: `localhost`
  - You can add multiple domains
- **Accept the reCAPTCHA Terms of Service**
- Click **Submit**

### 3. Get Your Keys
After registration, you'll see two keys:

#### Site Key (Public)
- This key is used in the frontend (client-side)
- It's safe to expose in your JavaScript code
- Example: `6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

#### Secret Key (Private)
- This key is used in the backend (server-side)
- **Keep this secret!** Never expose it in client-side code
- Example: `6LcYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY`

### 4. Add Keys to Environment Variables

Add these keys to your `.env` file:

```env
# Google reCAPTCHA v3 Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key-here
RECAPTCHA_SECRET_KEY=your-secret-key-here
```

**Important Notes:**
- The site key MUST be prefixed with `NEXT_PUBLIC_` to be accessible in the browser
- The secret key should NOT have the `NEXT_PUBLIC_` prefix
- Never commit the `.env` file to version control

### 5. Restart Your Development Server

After adding the keys, restart your Next.js development server:

```bash
npm run dev
```

### 6. Test the Integration

1. Open your contest page: `http://localhost:3000/konkurs`
2. Fill in the form and submit
3. Check the browser console for reCAPTCHA messages (should see "reCAPTCHA loaded")
4. Check your server logs to see the reCAPTCHA score

## How It Works

### Frontend (Contest Page)
1. The page loads with `GoogleReCaptchaProvider` wrapper
2. When user submits the form, it calls `executeRecaptcha("submit_contest")`
3. This generates a token that's sent to the server

### Backend (API Route)
1. Server receives the token from the client
2. Sends token to Google's verification API
3. Google returns a response with:
   - `success`: true/false
   - `score`: 0.0 to 1.0
   - `action`: "submit_contest"
   - `challenge_ts`: timestamp
4. If score is below 0.5, submission is rejected

## Score Interpretation

| Score Range | Interpretation | Action |
|-------------|----------------|--------|
| 0.9 - 1.0 | Very likely human | ✅ Accept |
| 0.7 - 0.9 | Likely human | ✅ Accept |
| 0.5 - 0.7 | Neutral | ✅ Accept |
| 0.3 - 0.5 | Suspicious | ❌ Reject |
| 0.0 - 0.3 | Very likely bot | ❌ Reject |

**Our threshold**: 0.5 (configurable in the code)

## Monitoring and Analytics

### View reCAPTCHA Analytics
1. Go to https://www.google.com/recaptcha/admin
2. Select your site
3. View the **Analytics** tab to see:
   - Number of requests
   - Score distribution
   - Action breakdown
   - Potential threats blocked

### Adjust Settings
You can adjust the score threshold in the API route if needed:
- File: `app/api/generate-code/route.ts`
- Line: `if (!recaptchaData.success || recaptchaData.score < 0.5)`
- Change `0.5` to a higher value for stricter protection
- Change to a lower value for more lenient protection

## Troubleshooting

### "reCAPTCHA is not ready" Error
**Cause**: Site key not configured or invalid
**Solution**: Check that `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set correctly in `.env`

### "Verification failed" Error
**Cause**: Token verification failed on the server
**Possible reasons:**
1. Secret key is missing or invalid
2. Token has expired (tokens are valid for 2 minutes)
3. Token was used on wrong domain
4. Network issues connecting to Google

**Solution**: 
- Check that `RECAPTCHA_SECRET_KEY` is set correctly
- Ensure your domain is registered in reCAPTCHA admin
- Check server logs for detailed error messages

### Score Always Below Threshold
**Cause**: Legitimate users getting low scores
**Solutions:**
1. Lower the threshold (e.g., from 0.5 to 0.3)
2. Check reCAPTCHA analytics for patterns
3. Ensure proper integration (no duplicate calls)
4. Wait a few days for Google's ML to learn your traffic patterns

### localhost Testing Issues
**Cause**: reCAPTCHA may give low scores to localhost
**Solution**: 
- Add `localhost` to your registered domains
- Use a testing/development site key for local development
- Consider using score threshold of 0.0 for development

## Best Practices

1. **Keep keys secure**: Never commit secret keys to version control
2. **Monitor scores**: Regularly check the analytics dashboard
3. **Adjust threshold**: Fine-tune based on your traffic patterns
4. **Multiple domains**: Register all domains where the form will be used
5. **Rate limiting**: Consider adding additional rate limiting for extra protection
6. **Logging**: Log reCAPTCHA scores for analysis and debugging

## Additional Resources

- [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha/docs/v3)
- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [react-google-recaptcha-v3 Library](https://www.npmjs.com/package/react-google-recaptcha-v3)

## Support

If you encounter issues:
1. Check the [KONKURS_README.md](./KONKURS_README.md) for contest-specific documentation
2. Review the reCAPTCHA admin console for errors
3. Check server logs for detailed error messages
4. Contact the development team

---

Last updated: January 2026
