# E-commerce Module Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CUSTOMER INTERFACE                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  /sklep              Browse product kits                     │
│  /konfigurator       Guided configurator (4 steps)          │
│  /koszyk            View/edit shopping cart                 │
│  /checkout          Enter details + payment method           │
│  /zamowienie/[id]   Track order status                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  /api/kits              GET - List product kits             │
│  /api/cart              GET/POST - Cart operations          │
│  /api/orders            POST - Create order                 │
│  /api/orders/[id]       GET - Get order details             │
│  /api/payment/p24       POST - Init Przelewy24              │
│  /api/webhook/p24       POST - Payment confirmation         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  lib/configurator.ts    SKU generation, pricing             │
│  lib/cart.ts           Cart management (cookies)            │
│  lib/db.ts             Database operations                  │
│  lib/przelewy24.ts     Payment integration                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Prisma Client  →  PostgreSQL Database                      │
│                                                              │
│  Models:                                                     │
│    - ProductKit   (kits for sale)                          │
│    - Order        (customer orders)                         │
│    - OrderItem    (order line items)                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Przelewy24 API     Payment processing                      │
│    - Register transaction                                    │
│    - Handle webhook                                          │
│    - Verify signatures                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    ADMIN INTERFACE                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  /admin/zamowienia      View/manage orders                  │
│    - Password protected                                      │
│    - List all orders                                         │
│    - Update order status                                     │
│    - View customer details                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### 1. Configurator Flow

```
User Input (Area, Heating, R10, Color)
        ↓
Calculate Bucket Size (roundAreaToBucket)
        ↓
Determine Type (EP or PU based on heating)
        ↓
Generate SKU (GAR-{EP|PU}-{BUCKET}[-R10][-COLOR])
        ↓
Find Matching Kit in Database
        ↓
Calculate Final Price (base + R10 surcharge)
        ↓
Add to Cart → Cookie Storage
```

### 2. COD Order Flow

```
Customer fills checkout form
        ↓
POST /api/orders (paymentMethod: COD)
        ↓
Create Order in database
        ↓
Clear cart cookie
        ↓
Redirect to /zamowienie/[id]
        ↓
Display order confirmation
```

### 3. Przelewy24 Payment Flow

```
Customer fills checkout form
        ↓
POST /api/orders (paymentMethod: PRZELEWY24)
        ↓
Create Order in database
        ↓
POST /api/payment/przelewy24
        ↓
Register transaction with P24 API
        ↓
Redirect customer to P24 payment page
        ↓
Customer completes payment
        ↓
P24 sends webhook to /api/webhook/przelewy24
        ↓
Verify signature
        ↓
Update order paymentStatus = "paid"
        ↓
Customer returns to /zamowienie/[id]
```

## File Structure

```
posadzki-zywiczne/
├── app/
│   ├── sklep/
│   │   └── page.tsx                 # Product listing
│   ├── konfigurator/
│   │   └── page.tsx                 # 4-step configurator
│   ├── koszyk/
│   │   └── page.tsx                 # Shopping cart
│   ├── checkout/
│   │   └── page.tsx                 # Checkout form
│   ├── zamowienie/[id]/
│   │   └── page.tsx                 # Order status
│   ├── admin/zamowienia/
│   │   └── page.tsx                 # Admin dashboard
│   └── api/
│       ├── cart/route.ts            # Cart API
│       ├── kits/route.ts            # Kits listing
│       ├── orders/
│       │   ├── route.ts             # Create order
│       │   └── [id]/route.ts        # Get order
│       ├── payment/przelewy24/
│       │   └── route.ts             # Init payment
│       ├── webhook/przelewy24/
│       │   └── route.ts             # Payment webhook
│       └── admin/orders/
│           ├── route.ts             # List orders
│           └── [id]/route.ts        # Update order
│
├── lib/
│   ├── prisma.ts                    # Prisma client
│   ├── configurator.ts              # Business logic
│   ├── cart.ts                      # Cart management
│   ├── db.ts                        # DB operations
│   └── przelewy24.ts                # Payment integration
│
├── prisma/
│   ├── schema.prisma                # Database schema
│   └── seed.ts                      # Seed data
│
├── types/
│   └── ecommerce.ts                 # TypeScript types
│
├── scripts/
│   └── test-configurator.ts        # Test script
│
├── .env.example                     # Environment template
├── ECOMMERCE_README.md              # Detailed guide
└── IMPLEMENTATION_SUMMARY.md        # This summary
```

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Payment**: Przelewy24 API
- **Cart**: Cookie-based storage
- **Styling**: Tailwind CSS (from existing setup)

## Configurator Rules

```
INPUT: area (m²), underfloorHeating, antiSlip, color

STEP 1: Round area to bucket
  area → [10,20,30,40,50,60,80,100]
  Example: 25 → 30, 45 → 50, 95 → 100

STEP 2: Determine type
  underfloorHeating = true  → PU
  underfloorHeating = false → EP

STEP 3: Generate SKU
  Format: GAR-{EP|PU}-{BUCKET}[-R10][-COLOR]
  Examples:
    - GAR-EP-30
    - GAR-PU-30-R10
    - GAR-EP-50-R10-GR

STEP 4: Calculate price
  finalPrice = basePrice + (hasR10 ? 500 : 0)
```

## Database Schema

```sql
ProductKit
├── id            String   @id
├── sku           String   @unique
├── name          String
├── type          String   (EP or PU)
├── bucketSize    Int
├── hasR10        Boolean
├── color         String?
├── basePrice     Float
└── description   String?

Order
├── id                      String   @id
├── orderNumber             String   @unique
├── customerName            String
├── customerEmail           String
├── customerPhone           String
├── customerAddress         String
├── customerCity            String
├── customerZip             String
├── paymentMethod           String   (COD or PRZELEWY24)
├── paymentStatus           String   (pending, paid, failed, cancelled)
├── orderStatus             String   (new, processing, completed, cancelled)
├── totalAmount             Float
├── przelewy24TransactionId String?
└── items                   OrderItem[]

OrderItem
├── id            String   @id
├── orderId       String
├── productKitId  String
├── quantity      Int
└── price         Float
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Admin
ADMIN_PASSWORD=...
NEXT_PUBLIC_ADMIN_PASSWORD=...

# Przelewy24
PRZELEWY24_MERCHANT_ID=...
PRZELEWY24_POS_ID=...
PRZELEWY24_CRC=...
PRZELEWY24_API_KEY=...
PRZELEWY24_SANDBOX=true/false

# App
NEXT_PUBLIC_BASE_URL=https://...
```

## Key Features

✅ **Guided Configurator** - Smart recommendations based on requirements
✅ **Flexible Payments** - COD and online payments
✅ **Cart Management** - Server-side cookie storage
✅ **Order Tracking** - Real-time status updates
✅ **Admin Dashboard** - Simple order management
✅ **Type Safe** - Full TypeScript implementation
✅ **Tested** - Configurator logic validated
✅ **Documented** - Comprehensive guides

## Limitations (MVP)

⚠️ **Admin Authentication** - Client-side only (not production-ready)
⚠️ **Inventory Management** - Not implemented (kits always available)
⚠️ **Email Notifications** - Not implemented
⚠️ **Shipping Calculations** - Not implemented
⚠️ **Tax Calculations** - Not implemented

## Future Enhancements

- Server-side authentication for admin
- Email notifications (order confirmation, status updates)
- Inventory tracking
- Shipping cost calculation
- Multiple currencies
- Invoice generation
- Customer accounts
- Order history
- Reviews and ratings

---

For detailed setup instructions, see `ECOMMERCE_README.md`
