# E-commerce Module - Posadzki Żywiczne

This document describes the setup and usage of the e-commerce module for selling resin flooring kits.

## Features

- **Product Kits**: Sell complete resin flooring system kits for garages
- **Guided Configurator**: Step-by-step tool to recommend the right kit based on:
  - Area size (m²)
  - Underfloor heating presence
  - Anti-slip requirements (R10)
  - Color preferences
- **Shopping Cart**: Cookie-based cart management
- **Checkout**: Customer data collection and payment method selection
- **Payment Methods**:
  - Cash on Delivery (COD)
  - Przelewy24 (BLIK, fast transfers, cards)
- **Order Management**: Simple admin dashboard for viewing and managing orders
- **Order Status**: Customer-facing order status page

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Prisma** with PostgreSQL for database
- **Przelewy24** API for online payments
- **Cookie-based** cart storage

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Przelewy24 merchant account (for online payments)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/posadzki_db

# Admin
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password

# Przelewy24 (get from https://przelewy24.pl/)
PRZELEWY24_MERCHANT_ID=your-merchant-id
PRZELEWY24_POS_ID=your-pos-id
PRZELEWY24_CRC=your-crc-key
PRZELEWY24_API_KEY=your-api-key
PRZELEWY24_SANDBOX=true  # Set to false for production

# Base URL (for payment redirects)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Setup Database

Generate Prisma client:

```bash
npm run db:generate
```

Push the schema to your database:

```bash
npm run db:push
```

Seed the database with example kits:

```bash
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Available Routes

### Customer-Facing Pages

- `/sklep` - Browse available product kits
- `/konfigurator` - Guided configurator for kit selection
- `/koszyk` - Shopping cart
- `/checkout` - Checkout and payment
- `/zamowienie/[id]` - Order status page

### Admin Pages

- `/admin/zamowienia` - Order management dashboard (password protected)

### API Routes

- `GET /api/kits` - List all product kits
- `GET /api/cart` - Get current cart
- `POST /api/cart` - Add/update/remove cart items
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order details
- `POST /api/payment/przelewy24` - Initialize Przelewy24 payment
- `POST /api/webhook/przelewy24` - Przelewy24 payment webhook
- `GET /api/admin/orders` - List all orders (admin)
- `PATCH /api/admin/orders/[id]` - Update order status (admin)

## Configurator Logic

The configurator follows these rules:

### 1. Area Rounding
Area is rounded up to the nearest bucket size: 10, 20, 30, 40, 50, 60, 80, 100 m²

### 2. Type Selection
- **Underfloor heating = YES** → PU (Polyurethane)
- **Underfloor heating = NO** → EP (Epoxy)

### 3. SKU Generation
Format: `GAR-{EP|PU}-{BUCKET}[-R10][-COLOR]`

Examples:
- `GAR-EP-30` - Epoxy system for 30m²
- `GAR-PU-30-R10` - Polyurethane system for 30m² with R10 anti-slip
- `GAR-EP-50-R10-GR` - Epoxy system for 50m² with R10 and gray color

### 4. Pricing
- Base price depends on the kit
- R10 anti-slip adds 500 PLN surcharge

## Database Schema

### ProductKit
- `id` - Unique identifier
- `sku` - Product SKU (unique)
- `name` - Product name
- `type` - EP or PU
- `bucketSize` - Coverage area in m²
- `hasR10` - Anti-slip included
- `color` - Color variant (optional)
- `basePrice` - Base price in PLN
- `description` - Product description

### Order
- `id` - Unique identifier
- `orderNumber` - Human-readable order number
- Customer details (name, email, phone, address)
- `paymentMethod` - COD or PRZELEWY24
- `paymentStatus` - pending, paid, failed, cancelled
- `orderStatus` - new, processing, completed, cancelled
- `totalAmount` - Total order amount
- Przelewy24 transaction details

### OrderItem
- Links orders to product kits
- Stores quantity and price at time of order

## Payment Flow

### Cash on Delivery (COD)
1. Customer completes checkout with COD selected
2. Order is created with `paymentMethod: COD` and `paymentStatus: pending`
3. Customer is redirected to order status page
4. Payment is collected upon delivery
5. Admin manually updates order status

### Przelewy24
1. Customer completes checkout with Przelewy24 selected
2. Order is created with `paymentMethod: PRZELEWY24`
3. System registers transaction with Przelewy24 API
4. Customer is redirected to Przelewy24 payment page
5. After payment, customer returns to order status page
6. Przelewy24 sends webhook notification
7. System verifies and updates `paymentStatus: paid`

## Admin Dashboard

Access: `/admin/zamowienia`

Features:
- View all orders
- See order details (customer info, items, payment status)
- Update order status (new → processing → completed)
- Password protected (uses `NEXT_PUBLIC_ADMIN_PASSWORD` from env)

**Note**: The current implementation uses a simple client-side password check. For production, implement proper server-side authentication.

## Seeding Data

The seed script (`prisma/seed.ts`) creates three example kits:

1. **GAR-EP-30** - Epoxy system 30m² (2500 PLN)
2. **GAR-PU-30-R10** - Polyurethane system 30m² with R10 (3200 PLN)
3. **GAR-EP-50** - Epoxy system 50m² (3800 PLN)

To add more kits:
1. Edit `prisma/seed.ts`
2. Run `npm run db:seed`

Or use the Prisma Studio:
```bash
npx prisma studio
```

## Testing

### Test Configurator
1. Go to `/konfigurator`
2. Enter area: 25 m² → Should recommend 30m² bucket
3. Select underfloor heating: Yes → Should select PU type
4. Select anti-slip: R10 → Should add R10 to SKU
5. Result: `GAR-PU-30-R10`

### Test Order Flow (COD)
1. Add product to cart from `/sklep`
2. Go to `/koszyk` and verify cart
3. Proceed to `/checkout`
4. Fill in customer details
5. Select "Płatność przy odbiorze"
6. Submit order
7. Verify redirect to `/zamowienie/[id]`
8. Check order appears in `/admin/zamowienia`

### Test Order Flow (Przelewy24)
**Note**: Requires valid Przelewy24 sandbox credentials

1. Follow steps 1-4 above
2. Select "Przelewy24"
3. Submit order
4. Should redirect to Przelewy24 sandbox payment page
5. Complete test payment
6. Should redirect back to order status page
7. Payment status should update to "paid" (via webhook)

## Production Deployment

### Security Checklist

- [ ] Set `PRZELEWY24_SANDBOX=false`
- [ ] Use production Przelewy24 credentials
- [ ] Change `ADMIN_PASSWORD` to a strong password
- [ ] Implement proper server-side authentication for admin
- [ ] Enable HTTPS (required for Przelewy24)
- [ ] Configure proper CORS settings
- [ ] Set secure cookie flags in production
- [ ] Verify webhook URL is accessible from Przelewy24

### Database

Ensure your PostgreSQL database is properly configured:
- Enable SSL connections
- Set up regular backups
- Configure connection pooling if needed

### Environment Variables

Set all required environment variables in your deployment platform (Vercel, Railway, etc.)

## Troubleshooting

### Prisma Client Not Found
```bash
npm run db:generate
```

### Database Connection Error
- Check `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify database exists and user has permissions

### Przelewy24 Payment Not Working
- Verify all Przelewy24 credentials are correct
- Check `PRZELEWY24_SANDBOX` setting matches your credentials
- Ensure `NEXT_PUBLIC_BASE_URL` is correct
- Check webhook URL is accessible (use ngrok for local testing)

### Cart Not Persisting
- Check browser cookies are enabled
- Verify cookie settings in `lib/cart.ts`

## Support

For issues or questions about the e-commerce module, please check:
1. This README
2. Code comments in `/lib` directory
3. Przelewy24 documentation: https://docs.przelewy24.pl/

## License

This module is part of the Posadzki Żywiczne project.
