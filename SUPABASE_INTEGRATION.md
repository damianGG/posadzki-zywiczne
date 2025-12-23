# Supabase Integration for Contest Feature

This document describes the integration of Supabase database for storing contest entries with email tracking.

## Overview

The contest feature has been upgraded from JSON file storage to Supabase database storage, enabling:
- Persistent cloud storage
- Email tracking (sent/opened status)
- Better scalability and reliability
- Database indexes for fast lookups
- Row Level Security (RLS) for data protection

## Database Schema

### Table: `contest_entries`

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Primary key (auto-increment) |
| `email` | VARCHAR(255) | Participant email (unique) |
| `name` | VARCHAR(255) | Participant name |
| `code` | VARCHAR(50) | Contest code (unique, format: PXZ-XXXXXXXX) |
| `timestamp` | TIMESTAMP | When the code was generated |
| `email_sent` | BOOLEAN | Whether confirmation email was sent |
| `email_opened` | BOOLEAN | Whether email was opened (for future implementation) |
| `created_at` | TIMESTAMP | Database record creation time |

### Indexes
- `idx_contest_entries_email` - Fast email lookups
- `idx_contest_entries_code` - Fast code lookups

## Setup Instructions

### 1. Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create a new project
3. Wait for the project to be ready

### 2. Create Database Table

1. Go to SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the SQL script to create the table with indexes and policies

### 3. Get API Credentials

1. Go to Settings → API in your Supabase dashboard
2. Copy your Project URL
3. Copy your `anon` public key

### 4. Configure Environment Variables

Add these variables to your `.env` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** These are prefixed with `NEXT_PUBLIC_` because they're used in the API routes which run on the server side.

## Features Implemented

### Email Tracking

The system now tracks:
- **`email_sent`**: Set to `true` when the confirmation email is successfully sent, `false` if sending fails
- **`email_opened`**: Reserved for future implementation with email tracking pixels

### Data Flow

1. User submits form with name and email
2. System checks if email already exists in database
3. If exists: resends confirmation email and updates `email_sent` status
4. If new: generates unique code, saves to database, sends email, updates status

### Security

- Row Level Security (RLS) enabled
- Public can only INSERT (participate in contest)
- Only service role can SELECT/UPDATE/DELETE (admin operations)
- Unique constraints on email and code prevent duplicates
- Email validation prevents invalid entries

## Migration from JSON to Supabase

### For Existing Installations

If you have existing contest entries in `data/contest-entries.json`, you can migrate them:

```sql
-- Example migration (adjust values as needed)
INSERT INTO contest_entries (email, name, code, timestamp, email_sent, email_opened)
VALUES 
  ('user@example.com', 'User Name', 'PXZ-ABCD1234', '2025-01-01T10:00:00Z', true, false);
```

Or create a migration script in Node.js to read from JSON and insert into Supabase.

## API Endpoints

### POST /api/generate-code

Generate a new contest code and send confirmation email.

**Request:**
```json
{
  "name": "Jan Kowalski",
  "email": "jan@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "code": "PXZ-A392F5BD",
  "message": "Kod został wygenerowany i wysłany na Twój email!"
}
```

### GET /api/contest-entries

Get all contest entries (admin endpoint).

**Query Parameters:**
- `limit` (optional): Number of entries to return (default: 100, max: 1000)
- `offset` (optional): Offset for pagination (default: 0)
- `orderBy` (optional): Field to sort by (default: created_at)
- `order` (optional): Sort order - 'asc' or 'desc' (default: desc)

**Example:**
```bash
curl http://localhost:3000/api/contest-entries?limit=50&offset=0
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "name": "User Name",
      "code": "PXZ-ABCD1234",
      "timestamp": "2025-12-23T10:00:00Z",
      "email_sent": true,
      "email_opened": false,
      "created_at": "2025-12-23T10:00:01Z"
    }
  ],
  "stats": {
    "total": 100,
    "emailsSent": 95,
    "emailsOpened": 20
  },
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 100,
    "hasMore": true
  }
}
```

### GET /api/contest-entries/export

Export all contest entries to CSV file (admin endpoint).

**Example:**
```bash
curl http://localhost:3000/api/contest-entries/export -o contest-entries.csv
```

**Response:** CSV file download with all entries

## API Changes

### Response Format (Unchanged)

The API response format remains the same for backward compatibility:

```json
{
  "success": true,
  "code": "PXZ-A392F5BD",
  "message": "Kod został wygenerowany i wysłany na Twój email!"
}
```

### Internal Changes

- Replaced `readEntries()` / `writeEntries()` with Supabase queries
- Added `checkExistingEntry()` for database lookups
- Added `createEntry()` for inserting new records
- Added `updateEmailStatus()` for tracking email delivery
- Added `isCodeUnique()` for code validation
- Modified `sendConfirmationEmail()` to return boolean success status

### Admin Endpoints

Two new admin endpoints have been added:
- `GET /api/contest-entries` - View all entries with pagination and statistics
- `GET /api/contest-entries/export` - Export entries to CSV

**⚠️ Security Note:** These admin endpoints are currently unprotected. In production, you should add authentication middleware to protect them. Consider using:
- Next.js middleware with JWT tokens
- Supabase Auth for authentication
- API keys or basic authentication
- IP whitelisting

## Testing

### Test Code Generation

```bash
curl -X POST http://localhost:3000/api/generate-code \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com"}'
```

### Test Duplicate Email

```bash
curl -X POST http://localhost:3000/api/generate-code \
  -H "Content-Type: application/json" \
  -d '{"name": "Another User", "email": "test@example.com"}'
```

### Query Database

In Supabase SQL Editor:

```sql
-- View all entries
SELECT * FROM contest_entries ORDER BY created_at DESC;

-- View email tracking stats
SELECT 
  COUNT(*) as total_entries,
  SUM(CASE WHEN email_sent THEN 1 ELSE 0 END) as emails_sent,
  SUM(CASE WHEN email_opened THEN 1 ELSE 0 END) as emails_opened
FROM contest_entries;
```

## Troubleshooting

### "Supabase credentials not found" Warning

This warning appears if environment variables are missing. Add them to `.env`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Duplicate Key Errors

- Email must be unique
- Code must be unique
- System automatically handles this by checking before insert

### Email Not Sending

- Check EMAIL_USER and EMAIL_PASS environment variables
- Entry is still saved to database even if email fails
- `email_sent` field tracks whether email was successful

## Future Enhancements

### Email Open Tracking

To implement email open tracking:

1. Generate a unique tracking pixel URL for each email
2. Add pixel image to email HTML: `<img src="https://your-domain.com/api/email-track?code={code}" width="1" height="1" />`
3. Create `/api/email-track` endpoint that updates `email_opened` field
4. Track pixel loads to determine email opens

### Admin Dashboard

Create an admin panel to:
- View all contest entries
- Export entries to CSV
- Search by email or code
- View email delivery statistics
- Manually trigger email resends

### Analytics

- Track participation over time
- Monitor email delivery success rate
- Identify popular entry times
- Geographic distribution (if collecting location data)

## Support

For issues or questions:
- Check Supabase dashboard for error logs
- Review Next.js console for API errors
- Contact: biuro@posadzkizywiczne.com
