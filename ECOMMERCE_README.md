# E-commerce MVP - Setup Guide

This guide explains how to set up and use the e-commerce module for selling resin flooring kits.

## Overview

The e-commerce module enables you to:
- Sell complete resin flooring system kits for garages
- Use a guided configurator to recommend the right kit based on customer needs
- Accept payments via Przelewy24 (BLIK, fast transfers, cards) or Cash on Delivery (COD)
- Manage orders through an admin panel

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Przelewy24 merchant account (optional, for online payments)

## Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

### Database
```env
DATABASE_URL=postgresql://user:password@localhost:5432/posadzki_db?schema=public
```

### Przelewy24 (Optional - for online payments)
```env
PRZELEWY24_MERCHANT_ID=your-merchant-id
PRZELEWY24_POS_ID=your-pos-id
PRZELEWY24_CRC=your-crc-key
PRZELEWY24_API_KEY=your-api-key
PRZELEWY24_MODE=sandbox  # or "production"
```

Get your Przelewy24 credentials from: https://www.przelewy24.pl/

### Admin Access
```env
ADMIN_PASSWORD=your-secure-admin-password
```

### Site Configuration
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # or your production URL
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with example products
npm run prisma:seed
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Database Schema

### ProductKit
Stores complete flooring kit products:
- `sku`: Unique product identifier (e.g., GAR-EP-30-R10-GR)
- `name`: Product name
- `type`: EP (Epoxy) or PU (Polyurethane)
- `bucket`: Area coverage in m² (10, 20, 30, 40, 50, 60, 80, 100)
- `hasR10`: Anti-slip coating
- `color`: Product color
- `basePrice`: Base price in PLN
- `r10Surcharge`: Additional price for R10 coating

### Order
Stores customer orders:
- Order details (number, status, payment method)
- Customer information (name, email, phone, address)
- Payment status and Przelewy24 transaction ID
- Order totals

### OrderItem
Links orders to products with quantities and prices

## Available Routes

### Customer-Facing Pages

- **`/sklep`** - Shop page listing all available kits
- **`/konfigurator`** - Step-by-step configurator to find the perfect kit
- **`/koszyk`** - Shopping cart
- **`/checkout`** - Checkout page with customer details and payment selection
- **`/zamowienie/[id]`** - Order status and confirmation page

### Admin Pages

- **`/admin/zamowienia`** - Admin panel for viewing all orders (requires password)

### API Endpoints

- **`POST /api/cart`** - Manage shopping cart (add, remove, update, clear)
- **`POST /api/orders`** - Create new order
- **`POST /api/payment`** - Initialize Przelewy24 payment
- **`POST /api/payment/webhook`** - Przelewy24 payment confirmation webhook
- **`GET /api/admin/orders`** - List all orders (requires Basic Auth)

## Configurator Logic

The configurator guides customers through 4 steps:

1. **Area (m²)**: Rounds up to nearest bucket size [10, 20, 30, 40, 50, 60, 80, 100]
2. **Underfloor Heating**: If yes → PU type, if no → EP type
3. **Anti-slip**: Optional R10 coating
4. **Color**: Choice of available colors

### SKU Format
```
GAR-{EP|PU}-{BUCKET}[-R10][-COLOR]
```

Examples:
- `GAR-EP-30` - Epoxy 30m², gray, no R10
- `GAR-PU-50-R10-GR` - Polyurethane 50m², graphite, with R10
- `GAR-EP-80-R10-BEZ` - Epoxy 80m², beige, with R10

## Payment Methods

### Cash on Delivery (COD)
- No upfront payment required
- Customer pays upon delivery
- Order status: "pending"

### Przelewy24
- Online payment gateway
- Supports BLIK, fast transfers, and cards
- Redirects to Przelewy24 for payment
- Uses webhook for payment confirmation
- Order status: "pending" → "paid" after successful payment

## Testing

### Test COD Flow
1. Add products to cart
2. Go to checkout
3. Fill in customer details
4. Select "Cash on Delivery"
5. Submit order
6. Verify order appears in admin panel

### Test Przelewy24 Flow (Sandbox)
1. Set `PRZELEWY24_MODE=sandbox` in `.env`
2. Add products to cart
3. Go to checkout
4. Fill in customer details
5. Select "Przelewy24"
6. Submit order
7. Complete payment in Przelewy24 sandbox
8. Verify webhook updates order status

### Test Configurator
1. Visit `/konfigurator`
2. Enter area (e.g., 35m²)
3. Select underfloor heating (yes/no)
4. Select anti-slip option
5. Choose color
6. Verify correct SKU is generated
7. Add to cart

## Admin Panel

Access the admin panel at `/admin/zamowienia`

- Username: `admin`
- Password: Set in `ADMIN_PASSWORD` environment variable

Features:
- View all orders
- See order details, customer info, and payment status
- Filter and search orders

## Seeded Products

The seed script creates 3 example products:

1. **GAR-EP-30** - Epoxy 30m², gray, 2499 PLN
2. **GAR-PU-50-R10-GR** - Polyurethane 50m² with R10, graphite, 4649 PLN (4299 + 350)
3. **GAR-EP-80-R10-BEZ** - Epoxy 80m² with R10, beige, 7349 PLN (6899 + 450)

## Deployment Checklist

Before deploying to production:

1. ✓ Set up production PostgreSQL database
2. ✓ Update `DATABASE_URL` in production environment
3. ✓ Run migrations: `npm run prisma:migrate`
4. ✓ Run seed: `npm run prisma:seed`
5. ✓ Set `PRZELEWY24_MODE=production`
6. ✓ Update Przelewy24 credentials with production keys
7. ✓ Set strong `ADMIN_PASSWORD`
8. ✓ Update `NEXT_PUBLIC_SITE_URL` to production domain
9. ✓ Configure Przelewy24 webhook URL: `https://yourdomain.com/api/payment/webhook`
10. ✓ Test complete checkout flows

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check database user permissions

### Przelewy24 Errors
- Verify credentials are correct
- Check if webhook URL is accessible
- Ensure signature verification is working
- Check Przelewy24 logs in merchant panel

### Cart Not Persisting
- Check if cookies are enabled
- Verify cookie settings in `lib/cart.ts`
- Clear browser cookies and try again

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Run `npm run prisma:generate` to generate Prisma client
- Clear `.next` folder and rebuild

## Support

For issues or questions:
1. Check the logs in terminal
2. Verify environment variables are set correctly
3. Review API responses in browser DevTools
4. Check database for data consistency

## License

This e-commerce module is part of the posadzki-zywiczne project.
