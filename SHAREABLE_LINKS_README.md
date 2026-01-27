# Shareable Offer Links Feature

## Overview

This feature allows users to generate unique, shareable links for calculator offers. These links can be sent to customers, allowing them to view the offer details at any time. The system also tracks visits to these links, enabling analytics on customer engagement.

## Features

### 1. Generate Shareable Links

Users can generate a unique link for any completed calculator configuration by clicking the "Wygeneruj link do udostępnienia" button. The link is:
- **Unique**: Each offer gets a unique 8-character identifier
- **Persistent**: Links remain active until manually deactivated
- **Trackable**: Every visit to the link is recorded

### 2. Offer Display Page

When customers visit the shareable link (`/oferta/{linkId}`), they see:
- Complete offer configuration
- Room type and dimensions
- Surface type and color selection
- Additional services chosen
- Total cost breakdown
- Contact information
- Options to print or create their own offer

### 3. Visit Tracking

The system automatically tracks:
- **Visit timestamps**: When the offer was viewed
- **IP addresses**: For basic analytics (privacy-compliant)
- **User agents**: Browser and device information
- **Referrers**: How the customer arrived at the link

## Technical Implementation

### Database Schema

Two new tables were added via migration `003_offer_links.sql`:

#### `offer_links` Table
- `id` (UUID): Primary key
- `link_id` (TEXT): Unique 8-character identifier for the URL
- `offer_data` (JSONB): Complete offer configuration
- `created_at`: Timestamp of link creation
- `expires_at`: Optional expiration date
- `is_active`: Boolean flag for active/inactive links
- `customer_email`: Optional customer email
- `customer_name`: Optional customer name
- `notes`: Optional internal notes

#### `offer_visits` Table
- `id` (UUID): Primary key
- `link_id` (TEXT): Reference to the offer link
- `visited_at`: Timestamp of the visit
- `ip_address`: Visitor's IP address
- `user_agent`: Browser/device information
- `referrer`: Where the visitor came from

### API Endpoints

#### POST `/api/offer-link`
Creates a new shareable offer link.

**Request Body:**
```json
{
  "offerData": {
    "rodzajPomieszczenia": "Garaż / Piwnica",
    "powierzchnia": 50,
    "kosztCalkowity": 10000,
    // ... other offer details
  },
  "customerEmail": "customer@example.com",
  "customerName": "Jan Kowalski",
  "notes": "Optional internal notes"
}
```

**Response:**
```json
{
  "success": true,
  "linkId": "aB3dE7gH",
  "url": "https://yourdomain.com/oferta/aB3dE7gH",
  "offerLink": { /* full offer link object */ }
}
```

#### GET `/api/offer-link?linkId={linkId}`
Retrieves an offer by its link ID and tracks the visit.

**Response:**
```json
{
  "success": true,
  "offerLink": {
    "id": "uuid",
    "link_id": "aB3dE7gH",
    "offer_data": { /* offer configuration */ },
    "created_at": "2024-01-27T12:00:00Z",
    // ... other fields
  }
}
```

### Frontend Components

#### Calculator Enhancement
The calculator (`kalkulator-posadzki-client.tsx`) now includes:
- New state variables for link generation
- `generateShareableLink()` function to create links
- UI elements for displaying generated links
- Copy-to-clipboard functionality

#### Offer Display Page
New page at `/app/oferta/[linkId]/page.tsx` that:
- Fetches offer data from the API
- Displays a beautiful, print-friendly offer layout
- Provides actions (print, create new offer)
- Shows company contact information

## Usage

### For Administrators

1. Complete the calculator as normal
2. Click "Wygeneruj link do udostępnienia"
3. Wait for the link to be generated
4. Copy the link using the copy button
5. Share the link with the customer via email, SMS, or other channels

### For Customers

1. Receive the shareable link
2. Click the link to view the offer
3. Review all offer details
4. Print the offer if needed
5. Contact the company for questions or to proceed

## Benefits

### Business Benefits
- **Better Customer Engagement**: Customers can review offers at their convenience
- **Analytics**: Track which offers are viewed and how often
- **Professional**: Clean, shareable links look more professional than PDF attachments
- **Persistent**: Links don't expire, customers can return to review
- **Tracking**: See if customers return to the offer (indicating interest)

### Customer Benefits
- **Easy Access**: Simple URL, no need to download files
- **Mobile Friendly**: Works on all devices
- **Always Available**: Can revisit the link anytime
- **Printable**: Can print from the browser if needed
- **No Registration**: No need to create an account to view offers

## Security & Privacy

- Links are read-only; customers cannot modify offers
- RLS (Row Level Security) policies ensure data integrity
- Visit tracking is anonymous (IP addresses are stored but not linked to personal data)
- Links can be deactivated if needed
- All data is stored securely in Supabase

## Future Enhancements

Potential improvements for future versions:

- [ ] Link expiration feature (set expiration dates)
- [ ] Admin dashboard to view all generated links and their analytics
- [ ] Ability to edit/regenerate links for existing offers
- [ ] Email notifications when links are visited
- [ ] QR code generation for links
- [ ] Social media sharing buttons
- [ ] Link performance analytics (conversion tracking)
- [ ] Ability to add custom messages to shared offers
- [ ] White-labeling options for different sales teams

## Environment Variables

Required variables in `.env`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Base URL (for generating full URLs)
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
# OR on Vercel (automatically set)
VERCEL_URL=yourdomain.vercel.app
```

## Database Migration

To apply the database schema:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/003_offer_links.sql`
4. Paste and execute the SQL
5. Verify tables are created in Table Editor

## Testing

### Manual Testing Checklist

- [ ] Generate a link from the calculator
- [ ] Verify the link is displayed correctly
- [ ] Copy the link to clipboard
- [ ] Open the link in a new tab/window
- [ ] Verify offer details are displayed correctly
- [ ] Test on mobile devices
- [ ] Verify visit is tracked in the database
- [ ] Test with different offer configurations
- [ ] Verify print functionality works
- [ ] Test error handling (invalid link ID)

## Support

For issues or questions about this feature, please:
1. Check the database migrations are applied
2. Verify environment variables are set
3. Check Supabase connection and policies
4. Review browser console for errors
5. Check API route responses

## Author

Implementation by GitHub Copilot for damianGG/posadzki-zywiczne
Date: January 27, 2026
