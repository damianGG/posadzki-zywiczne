# Świąteczny Konkurs - Christmas Contest Feature

## Recent Updates (January 2026)
- ✅ **Draw date changed**: January 30, 2026 (previously January 3, 2026)
- ✅ **Bot protection added**: Google reCAPTCHA v3 integration
- ✅ **Enhanced security**: Score-based bot detection (threshold: 0.5)

## Overview
A complete Christmas contest landing page that allows users to participate in a contest to win a 5000 zł resin floor by generating and receiving a unique contest code via email.

## Features

### Landing Page (`/konkurs`)
- Modern, festive Christmas-themed design with gradient backgrounds
- Responsive layout optimized for mobile and desktop devices
- Clear contest information and prize details
- Step-by-step participation instructions
- Complete RODO compliance and regulations section

### Contest Form
- **Name field**: Minimum 2 characters required
- **Email field**: Valid email format validation
- **Bot protection**: Google reCAPTCHA v3 (invisible, score-based)
- **Duplicate prevention**: One email = one unique code
- **Real-time validation**: Client and server-side checks
- **Success feedback**: Displays generated code immediately

### Code Generation System
- **Format**: `PXZ-XXXXXXXX` (e.g., PXZ-A392F5BD)
- **Method**: Cryptographically secure random bytes
- **Uniqueness**: Guaranteed unique codes checked against database
- **Storage**: JSON file persistence at `data/contest-entries.json`

### Email Notification
- Automatic email sent upon code generation
- Beautiful HTML email template with Christmas theme
- Contains contest code and prize information
- Email delivery via nodemailer with SMTP support

## Technical Implementation

### API Endpoint
**POST** `/api/generate-code`

**Request Body:**
```json
{
  "name": "Jan Kowalski",
  "email": "jan@example.com"
}
```

**Success Response:**
```json
{
  "success": true,
  "code": "PXZ-A392F5BD",
  "message": "Kod został wygenerowany i wysłany na Twój email!"
}
```

**Duplicate Email Response:**
```json
{
  "success": true,
  "code": "PXZ-A392F5BD",
  "message": "Ten email był już użyty. Wysłaliśmy ponownie Twój kod.",
  "alreadyExists": true
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Podaj prawidłowy adres email"
}
```

### Data Storage
Contest entries are stored in JSON format at `data/contest-entries.json`:

```json
[
  {
    "email": "jan@example.com",
    "name": "Jan Kowalski",
    "code": "PXZ-A392F5BD",
    "timestamp": "2025-11-19T13:03:24.346Z"
  }
]
```

**Note**: This file is excluded from version control via `.gitignore`.

## Configuration

### Environment Variables
Create a `.env` file with the following variables:

```env
# Email Configuration (for contest emails)
# Gmail: Use App Password (https://myaccount.google.com/apppasswords)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
ADMIN_EMAIL=biuro@posadzkizywiczne.com

# Google reCAPTCHA v3 Configuration
# Get your credentials from: https://www.google.com/recaptcha/admin
# Create a reCAPTCHA v3 site key and secret key
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
```

### Setting up Gmail App Password
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Visit https://myaccount.google.com/apppasswords
4. Generate a new app password for "Mail"
5. Use this password in the `EMAIL_PASS` environment variable

### Setting up Google reCAPTCHA v3
1. Go to https://www.google.com/recaptcha/admin
2. Register a new site with reCAPTCHA v3
3. Add your domain(s) (for development, you can use `localhost`)
4. Copy the Site Key and use it in `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
5. Copy the Secret Key and use it in `RECAPTCHA_SECRET_KEY`
6. reCAPTCHA v3 runs invisibly in the background and returns a score (0.0-1.0)
7. The implementation rejects submissions with a score below 0.5

## Contest Details

### Prize
- **Value**: 5000 zł resin floor
- **Valid for**: 6 months from draw date
- **Applicable to**: Garage, boiler room, or residential room

### Draw Information
- **End date**: January 30, 2026
- **Draw date**: January 30, 2026
- **Draw method**: Physical drawing of printed codes
- **Winner notification**: Email and phone call

### Rules
- Contest runs until January 30, 2026
- Open to adults only (18+)
- One email = one contest code
- Prize cannot be exchanged for cash equivalent
- Winner will be notified via email and phone
- Bot protection via Google reCAPTCHA v3

## Testing

### Manual Testing Checklist
- [x] Form validation (name min 2 chars)
- [x] Email format validation
- [x] Duplicate email prevention
- [x] Code generation uniqueness
- [x] Data persistence to Supabase
- [x] Success message display
- [x] Error message display
- [x] Mobile responsiveness
- [x] Desktop layout
- [x] reCAPTCHA v3 integration
- [ ] Email delivery (requires SMTP credentials)
- [ ] reCAPTCHA bot detection (requires production keys)

### API Testing Examples

**Test code generation:**
```bash
curl -X POST http://localhost:3000/api/generate-code \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com"}'
```

**Test duplicate email:**
```bash
curl -X POST http://localhost:3000/api/generate-code \
  -H "Content-Type: application/json" \
  -d '{"name": "Another User", "email": "test@example.com"}'
```

**Test validation (short name):**
```bash
curl -X POST http://localhost:3000/api/generate-code \
  -H "Content-Type: application/json" \
  -d '{"name": "A", "email": "test@example.com"}'
```

**Test validation (invalid email):**
```bash
curl -X POST http://localhost:3000/api/generate-code \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "invalid-email"}'
```

## Security Considerations

### Implemented Security Measures
- ✅ Input validation (server-side and client-side)
- ✅ Email format validation with regex
- ✅ **Google reCAPTCHA v3 bot protection**
- ✅ Cryptographically secure random code generation
- ✅ No SQL injection risk (using Supabase with proper parameterization)
- ✅ No XSS vulnerabilities (React escapes output by default)
- ✅ Environment variables for sensitive data
- ✅ Contest data excluded from version control

### reCAPTCHA v3 Implementation
- **Score-based protection**: Submissions with score < 0.5 are rejected
- **Invisible operation**: No user interaction required (no checkboxes)
- **Action-based**: Each submission tagged as "submit_contest" for analytics
- **Fallback handling**: Clear error messages if reCAPTCHA fails
- **Environment check**: Site key validation before rendering form

### CodeQL Security Scan
- **Status**: ✅ Passed
- **Alerts**: 0 security issues found

## Future Improvements

### Potential Enhancements
1. **Database**: ✅ Already using Supabase for reliable storage
2. **Admin Panel**: View all entries, export codes, select winner
3. **Email Service**: Use dedicated service like Resend.com for better deliverability
4. **Analytics**: Track conversion rates, popular entry times
5. **Social Sharing**: Allow users to share contest on social media
6. **Multi-language**: Support for English version
7. **Bot Protection**: ✅ Implemented with Google reCAPTCHA v3
8. **Rate Limiting**: Add request throttling per IP address

## Support

For questions or issues, contact:
- **Email**: biuro@posadzkizywiczne.com
- **Phone**: +48 507 384 619

## License

This feature is part of the PosadzkiZywiczne.com website project.
