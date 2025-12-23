# Świąteczny Konkurs - Christmas Contest Feature

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
Contest entries are stored in **Supabase** cloud database in the `contest_entries` table:

| Field | Type | Description |
|-------|------|-------------|
| `id` | BIGSERIAL | Auto-increment primary key |
| `email` | VARCHAR(255) | Participant email (unique) |
| `name` | VARCHAR(255) | Participant name |
| `code` | VARCHAR(50) | Contest code (unique) |
| `timestamp` | TIMESTAMP | Code generation time |
| `email_sent` | BOOLEAN | Email delivery status |
| `email_opened` | BOOLEAN | Email open tracking |
| `created_at` | TIMESTAMP | Record creation time |

**Benefits:**
- ✅ Cloud-hosted persistent storage
- ✅ Email tracking (sent/opened status)
- ✅ Fast indexed lookups
- ✅ Row Level Security (RLS)
- ✅ Scalable and reliable

**Previous:** Data was stored in `data/contest-entries.json` (deprecated)

## Configuration

### Environment Variables
Create a `.env` file with the following variables:

```env
# Supabase Configuration (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Email Configuration (for contest emails)
# Gmail: Use App Password (https://myaccount.google.com/apppasswords)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
ADMIN_EMAIL=biuro@posadzkizywiczne.com
```

### Setting up Supabase

1. Create account at https://app.supabase.com
2. Create a new project
3. Go to SQL Editor and run `supabase-schema.sql`
4. Go to Settings → API to get your credentials
5. Add credentials to `.env` file

See **[SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md)** for detailed setup instructions.

### Setting up Gmail App Password
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Visit https://myaccount.google.com/apppasswords
4. Generate a new app password for "Mail"
5. Use this password in the `EMAIL_PASS` environment variable

## Contest Details

### Prize
- **Value**: 5000 zł resin floor
- **Valid for**: 6 months from draw date
- **Applicable to**: Garage, boiler room, or residential room

### Draw Information
- **End date**: December 20, 2025
- **Draw method**: Physical drawing of printed codes
- **Winner notification**: Email and phone call

### Rules
- Contest runs until December 20, 2025
- Open to adults only (18+)
- One email = one contest code
- Prize cannot be exchanged for cash equivalent
- Winner will be notified via email and phone

## Testing

### Manual Testing Checklist
- [x] Form validation (name min 2 chars)
- [x] Email format validation
- [x] Duplicate email prevention
- [x] Code generation uniqueness
- [x] Data persistence to JSON file
- [x] Success message display
- [x] Error message display
- [x] Mobile responsiveness
- [x] Desktop layout
- [ ] Email delivery (requires SMTP credentials)

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
- ✅ Cryptographically secure random code generation
- ✅ No SQL injection risk (using JSON file storage)
- ✅ No XSS vulnerabilities (React escapes output by default)
- ✅ Environment variables for sensitive data
- ✅ Contest data excluded from version control

### CodeQL Security Scan
- **Status**: ✅ Passed
- **Alerts**: 0 security issues found

## Future Improvements

### Potential Enhancements
1. ~~**Database**: Migrate from JSON to proper database (PostgreSQL, Supabase)~~ ✅ **Completed!**
2. **Email Open Tracking**: Implement tracking pixels to detect when emails are opened
3. **Admin Panel**: View all entries, export codes, select winner
4. **Email Service**: Use dedicated service like Resend.com for better deliverability
5. **Analytics**: Track conversion rates, popular entry times
6. **Social Sharing**: Allow users to share contest on social media
7. **Multi-language**: Support for English version
8. **Captcha**: Add reCAPTCHA to prevent bot submissions
9. **Rate Limiting**: Prevent abuse with request throttling

## Support

For questions or issues, contact:
- **Email**: biuro@posadzkizywiczne.com
- **Phone**: +48 507 384 619

## License

This feature is part of the PosadzkiZywiczne.com website project.
