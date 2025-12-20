# Quick Start Guide - E-commerce Module

## 🚀 Get Started in 5 Steps

Follow these steps to get your e-commerce module up and running.

---

## Step 1: Setup Database

### Option A: Local PostgreSQL
```bash
# Install PostgreSQL (if not already installed)
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql

# Start PostgreSQL
# macOS
brew services start postgresql

# Create database
createdb posadzki_db
```

### Option B: Cloud Database (Recommended for Production)
Choose one:
- **Supabase**: https://supabase.com (Free tier available)
- **Railway**: https://railway.app (PostgreSQL)
- **Neon**: https://neon.tech (Serverless PostgreSQL)
- **ElephantSQL**: https://www.elephantsql.com

Copy the connection string for Step 2.

---

## Step 2: Configure Environment

```bash
# Create .env file from template
cp .env.example .env

# Edit .env with your values
nano .env  # or use your preferred editor
```

**Minimum Required Configuration:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/posadzki_db
ADMIN_PASSWORD=your-secure-password-here
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password-here
```

**For Przelewy24 (optional for testing):**
```env
PRZELEWY24_SANDBOX=true
PRZELEWY24_MERCHANT_ID=your-test-merchant-id
PRZELEWY24_POS_ID=your-test-pos-id
PRZELEWY24_CRC=your-test-crc
PRZELEWY24_API_KEY=your-test-api-key
```

**For Production:**
```env
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

---

## Step 3: Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Create database tables
npm run db:push

# Seed with example product kits
npm run db:seed
```

Expected output:
```
✅ Created kit: System epoksydowy 30m²
✅ Created kit: System poliuretanowy 30m² z antypoślizgiem R10
✅ Created kit: System epoksydowy 50m²
✨ Seeding completed!
```

---

## Step 4: Test Locally

```bash
# Start development server
npm run dev
```

Visit these URLs to test:

**Customer Pages:**
- http://localhost:3000/sklep - Browse kits
- http://localhost:3000/konfigurator - Try configurator
- http://localhost:3000/koszyk - View empty cart

**Admin Panel:**
- http://localhost:3000/admin/zamowienia
- Password: (from your .env file)

---

## Step 5: Test Complete Flow

### Test 1: Buy via Shop
1. Go to `/sklep`
2. Click "Dodaj do koszyka" on any kit
3. Review cart at `/koszyk`
4. Click "Przejdź do kasy"
5. Fill in customer details
6. Select "Płatność przy odbiorze" (COD)
7. Submit order
8. Note the order number

### Test 2: Use Configurator
1. Go to `/konfigurator`
2. Enter area: **35** m²
3. Underfloor heating: **Yes**
4. Anti-slip: **R10**
5. Color: **Szary**
6. Should recommend: `GAR-PU-40-R10-SZARY`

### Test 3: Check Admin
1. Go to `/admin/zamowienia`
2. Enter your admin password
3. See your test order
4. Try changing order status

---

## ✅ Verification Checklist

- [ ] Database connected successfully
- [ ] Prisma client generated
- [ ] Database seeded with 3 kits
- [ ] Shop page shows products
- [ ] Can add items to cart
- [ ] Cart displays correctly
- [ ] Checkout form works
- [ ] COD order creates successfully
- [ ] Order status page displays
- [ ] Admin login works
- [ ] Admin shows orders
- [ ] Configurator calculates correctly

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: Can't reach database server
```
**Solution:**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Test connection: `psql $DATABASE_URL`

### Prisma Client Not Found
```
Error: @prisma/client not found
```
**Solution:**
```bash
npm run db:generate
```

### Can't Access Admin
**Solution:**
- Clear browser cookies
- Check NEXT_PUBLIC_ADMIN_PASSWORD in .env
- Ensure both ADMIN_PASSWORD and NEXT_PUBLIC_ADMIN_PASSWORD are set

### Configurator Not Working
**Solution:**
- Check browser console for errors
- Ensure API routes are accessible
- Test API: `curl http://localhost:3000/api/kits`

---

## 📚 Next Steps

Once everything works locally:

1. **Read Full Documentation:**
   - `ECOMMERCE_README.md` - Complete guide
   - `ARCHITECTURE.md` - System architecture
   - `IMPLEMENTATION_SUMMARY.md` - Overview

2. **Test Payment Integration:**
   - Get Przelewy24 sandbox credentials
   - Test online payment flow
   - Set up webhook URL (use ngrok for local testing)

3. **Deploy to Production:**
   - Choose hosting platform (Vercel, Railway, etc.)
   - Set up production database
   - Configure environment variables
   - Deploy application
   - Test in production

4. **Enhance Security:**
   - Implement server-side auth for admin
   - Enable HTTPS
   - Review security best practices

---

## 🎯 What You've Built

✅ **Product Catalog** - Browse and display kits
✅ **Smart Configurator** - Guided kit selection
✅ **Shopping Cart** - Add, edit, remove items
✅ **Checkout** - Customer details + payment
✅ **Order Management** - Track status
✅ **Admin Dashboard** - Manage orders
✅ **Payment Integration** - COD + Przelewy24

---

## 📞 Need Help?

1. Check `ECOMMERCE_README.md` - Troubleshooting section
2. Review error messages in terminal
3. Check browser console for client errors
4. Verify environment variables
5. Ensure database is accessible

---

## 🎉 Success!

If all checklist items are complete, your e-commerce module is ready!

**Next**: Deploy to production or add custom features.

---

**Documentation Files:**
- `QUICK_START.md` (this file) - Setup guide
- `ARCHITECTURE.md` - System architecture
- `ECOMMERCE_README.md` - Complete reference
- `IMPLEMENTATION_SUMMARY.md` - What was built

**Test Script:**
- `scripts/test-configurator.ts` - Validate configurator logic
