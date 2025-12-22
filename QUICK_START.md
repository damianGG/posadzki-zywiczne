# Quick Start Guide - E-commerce Module

This is a quick reference guide to get the e-commerce module up and running.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- npm or pnpm package manager

## Setup (5 minutes)

### 1. Install Dependencies (if not already done)
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your configuration:
# - DATABASE_URL: Your PostgreSQL connection string
# - ADMIN_PASSWORD: A secure password for the admin panel
# - (Optional) Przelewy24 credentials for payment processing
```

Example `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/posadzki_db?schema=public"
ADMIN_PASSWORD=your-secure-password-here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Run Setup Script
```bash
./scripts/setup-ecommerce.sh
```

This will:
- Generate Prisma client
- Run database migrations
- Seed example products

### 4. Start Development Server
```bash
npm run dev
```

### 5. Access the Application

Open your browser and visit:

- **Shop**: http://localhost:3000/sklep
- **Configurator**: http://localhost:3000/konfigurator
- **Admin Panel**: http://localhost:3000/admin/zamowienia

## Test the Flow

### Customer Flow
1. Visit `/sklep` or `/konfigurator`
2. Add a product to cart
3. Go to `/koszyk` to view cart
4. Proceed to `/checkout`
5. Fill in customer details
6. Choose payment method (COD for testing)
7. Complete order
8. View order status at `/zamowienie/[id]`

### Admin Flow
1. Visit `/admin/zamowienia`
2. Login with your `ADMIN_PASSWORD`
3. View all orders
4. Click on an order to see details

## Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Create/apply migrations
npm run db:migrate

# Seed database with example products
npm run db:seed

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -h localhost -U your_user -d posadzki_db
```

### Cart Not Working
- Clear browser cookies
- Check `NEXT_PUBLIC_BASE_URL` is set correctly
- Verify API routes are accessible

### Admin Login Not Working
- Check `ADMIN_PASSWORD` is set in `.env`
- Try clearing browser cookies
- Restart development server

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma client
npm run db:generate
```

## Default Products

After seeding, you'll have these products:

1. **GAR-EP-30** - Epoxy, 30m² (899.99 PLN)
2. **GAR-PU-30-R10-GR** - Polyurethane, 30m², R10, Gray (1,299.99 PLN)
3. **GAR-EP-50-R10** - Epoxy, 50m², R10 (1,499.99 PLN)
4. **GAR-PU-50** - Polyurethane, 50m² (1,699.99 PLN)

## Adding More Products

### Via Database
```bash
# Open Prisma Studio (GUI)
npx prisma studio
```

### Via Seed Script
Edit `prisma/seed.ts` and add more products, then run:
```bash
npm run db:seed
```

## Payment Testing

### Cash on Delivery (COD)
- No additional setup needed
- Orders are created with "pending" status
- Admin can process manually

### Przelewy24 (Sandbox)
1. Get sandbox credentials from Przelewy24
2. Add to `.env`:
   ```env
   PRZELEWY24_MERCHANT_ID=your-merchant-id
   PRZELEWY24_POS_ID=your-pos-id
   PRZELEWY24_CRC_KEY=your-crc-key
   PRZELEWY24_API_KEY=your-api-key
   PRZELEWY24_SANDBOX=true
   ```
3. Test payment flow with test cards

## Production Deployment

Before deploying to production:

1. ✅ Set up production PostgreSQL database
2. ✅ Update `DATABASE_URL` with production credentials
3. ✅ Set secure `ADMIN_PASSWORD`
4. ✅ Configure Przelewy24 production credentials
5. ✅ Update `NEXT_PUBLIC_BASE_URL` to production domain
6. ✅ Run migrations on production database
7. ✅ Seed initial products
8. ✅ Configure Przelewy24 webhook in merchant panel
9. ✅ Test all flows thoroughly
10. ✅ Set up database backups

## Support & Documentation

- **Full Setup Guide**: See `ECOMMERCE_README.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **API Documentation**: In `ECOMMERCE_README.md`
- **Prisma Docs**: https://www.prisma.io/docs

## Need Help?

Common issues and solutions are documented in `ECOMMERCE_README.md` under the "Troubleshooting" section.

## What's Next?

After verifying everything works:

1. Customize product data in seed script
2. Update prices and descriptions
3. Configure real payment credentials
4. Test complete order flows
5. Deploy to production
6. Monitor orders and payments

---

**Remember**: Keep your `.env` file private and never commit it to version control!
