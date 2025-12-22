# E-commerce Module - Setup Guide

This guide explains how to set up and use the MVP e-commerce module for selling resin flooring kits in the Next.js application.

## Features

- **Product Catalog** (`/sklep`) - Browse available garage flooring kits
- **Configurator** (`/konfigurator`) - Step-based wizard to calculate recommended kits
- **Shopping Cart** (`/koszyk`) - Manage items before checkout
- **Checkout** (`/checkout`) - Customer information and payment method selection
- **Order Status** (`/zamowienie/[id]`) - View order details and status
- **Admin Panel** (`/admin/zamowienia`) - Manage orders (password protected)

## Payment Methods

- **Przelewy24** - Online payments (BLIK, cards, bank transfers)
- **COD (Cash on Delivery)** - Pay on delivery

## Setup Instructions

### 1. Install Dependencies

Dependencies are already installed. The main packages added:
- `@prisma/client` - Database ORM
- `prisma` - Database toolkit
- `ts-node` - TypeScript execution for seed scripts

### 2. Database Configuration

Set up your PostgreSQL database and configure the connection:

```bash
# In .env file
DATABASE_URL="postgresql://user:password@localhost:5432/posadzki_db?schema=public"
```

### 3. Run Database Migrations

Initialize the database schema:

```bash
npm run db:migrate
```

This will create the necessary tables:
- `ProductKit` - Garage flooring kit products
- `Order` - Customer orders
- `OrderItem` - Order line items

### 4. Seed Database

Populate the database with example products:

```bash
npm run db:seed
```

This creates 4 example kits:
- GAR-EP-30 - Epoxy kit for 30m²
- GAR-PU-30-R10-GR - Polyurethane kit with R10 anti-slip
- GAR-EP-50-R10 - Epoxy kit for 50m² with R10
- GAR-PU-50 - Polyurethane kit for 50m²

### 5. Configure Environment Variables

Add the following to your `.env` file:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/posadzki_db?schema=public"

# Admin Panel
ADMIN_PASSWORD=your-secure-password

# Przelewy24 (Optional - for online payments)
PRZELEWY24_MERCHANT_ID=your-merchant-id
PRZELEWY24_POS_ID=your-pos-id
PRZELEWY24_CRC_KEY=your-crc-key
PRZELEWY24_API_KEY=your-api-key
PRZELEWY24_SANDBOX=true

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 6. Run Development Server

```bash
npm run dev
```

Visit:
- Shop: http://localhost:3000/sklep
- Configurator: http://localhost:3000/konfigurator
- Admin: http://localhost:3000/admin/zamowienia

## Configurator Rules

The configurator calculates the recommended kit based on:

1. **Area (m²)** - Rounds up to nearest bucket size: 10, 20, 30, 40, 50, 60, 80, 100
2. **Underfloor Heating** - Determines type:
   - YES = PU (Polyurethane)
   - NO = EP (Epoxy)
3. **Anti-slip** - Option to add R10 coating (+200 PLN surcharge)
4. **Color** - Available colors: gray, graphite, beige

### SKU Format

```
GAR-{EP|PU}-{BUCKET}[-R10][-COLOR]
```

Examples:
- `GAR-EP-30` - Epoxy, 30m², no R10, default color
- `GAR-PU-30-R10-GR` - Polyurethane, 30m², R10, gray
- `GAR-EP-50-R10` - Epoxy, 50m², R10, default color

## Database Schema

### ProductKit
- Product information (SKU, name, description)
- Type (EP or PU)
- Bucket size (10-100 m²)
- R10 anti-slip flag
- Color
- Base price and R10 surcharge
- Stock level

### Order
- Order number (auto-generated)
- Customer contact details
- Delivery address (Poland only)
- Payment method and status
- Order status
- Total amount (PLN)

### OrderItem
- Links products to orders
- Quantity
- Price at time of order

## Admin Panel

Access: `/admin/zamowienia`

Login with the password configured in `ADMIN_PASSWORD` environment variable.

Features:
- View all orders
- See customer details
- Check payment status
- View order items

## Przelewy24 Integration

### Sandbox Testing

1. Set `PRZELEWY24_SANDBOX=true`
2. Use test credentials from Przelewy24 dashboard
3. Payment URL redirects to sandbox environment

### Production

1. Set `PRZELEWY24_SANDBOX=false`
2. Use production credentials
3. Configure webhook URL: `https://yourdomain.com/api/payments/przelewy24/callback`

### Webhook

The webhook at `/api/payments/przelewy24/callback` handles payment confirmations:
- Verifies callback signature
- Updates order payment status to "paid"
- Changes order status to "processing"

## Order Flow

### COD (Cash on Delivery)
1. Customer fills checkout form
2. Selects "Za pobraniem" payment method
3. Order is created with status "new" and payment status "pending"
4. Customer redirected to order status page
5. Admin processes order manually

### Przelewy24
1. Customer fills checkout form
2. Selects "Przelewy24" payment method
3. Order is created with status "new" and payment status "pending"
4. Customer redirected to Przelewy24 payment page
5. After payment, webhook updates order status
6. Customer redirected to order status page

## Cart Storage

Cart items are stored in HTTP-only cookies for 7 days. Features:
- Add items to cart
- Update quantities
- Remove items
- View cart total
- Cart persists across sessions

## API Routes

### Cart
- `GET /api/cart` - Get current cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/update` - Update item quantity
- `POST /api/cart/remove` - Remove item from cart
- `POST /api/cart/clear` - Clear cart

### Products
- `GET /api/products/sku/[sku]` - Get product by SKU

### Orders
- `POST /api/orders/create` - Create new order

### Admin
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout

### Payments
- `POST /api/payments/przelewy24/callback` - Payment webhook

## Testing

### Manual Testing Checklist

1. **Shop Page**
   - [ ] Products display correctly
   - [ ] Add to cart works
   - [ ] Stock levels shown

2. **Configurator**
   - [ ] All 4 steps work
   - [ ] SKU generated correctly
   - [ ] Pricing calculations correct
   - [ ] Add to cart from configurator

3. **Cart**
   - [ ] Items display
   - [ ] Quantity update works
   - [ ] Remove items works
   - [ ] Total calculated correctly

4. **Checkout**
   - [ ] Form validation works
   - [ ] Both payment methods available
   - [ ] Order creation successful

5. **Order Status**
   - [ ] Order details display
   - [ ] Status indicators work

6. **Admin Panel**
   - [ ] Login works
   - [ ] Orders list displays
   - [ ] Order details accessible

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -h localhost -U user -d posadzki_db
```

### Prisma Issues
```bash
# Regenerate Prisma client
npm run db:generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Cart Not Working
- Check cookies are enabled in browser
- Verify `NEXT_PUBLIC_BASE_URL` is set correctly
- Clear browser cookies and try again

## Production Deployment

1. Set up production PostgreSQL database
2. Update `DATABASE_URL` in production environment
3. Run migrations: `npm run db:migrate`
4. Seed initial products: `npm run db:seed`
5. Configure Przelewy24 production credentials
6. Set secure `ADMIN_PASSWORD`
7. Update `NEXT_PUBLIC_BASE_URL` to production domain
8. Configure Przelewy24 webhook in merchant panel

## Security Considerations

- Admin password stored in environment variable only
- HTTP-only cookies for cart storage
- CSRF protection on forms
- Input validation on all endpoints
- SQL injection prevention via Prisma
- Webhook signature verification for payments

## Future Enhancements

- Email notifications for orders
- Invoice generation (PDF)
- Inventory management
- Order status updates via admin
- Customer accounts
- Multiple currencies
- Discount codes
- Shipping cost calculation
