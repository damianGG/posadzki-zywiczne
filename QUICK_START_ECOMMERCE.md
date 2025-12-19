# Quick Start Guide - E-commerce Module

Get the e-commerce module up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (we'll use a local instance)

## Step 1: Install PostgreSQL Locally

### macOS (using Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Windows
Download and install from: https://www.postgresql.org/download/windows/

## Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE posadzki_db;

# Create user (optional, use postgres user for quick start)
CREATE USER posadzki_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE posadzki_db TO posadzki_user;

# Exit
\q
```

## Step 3: Configure Environment

Create `.env` file in project root:

```env
# Database (adjust username/password as needed)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/posadzki_db?schema=public

# Admin password for /admin/zamowienia
ADMIN_PASSWORD=admin123

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Przelewy24 (leave as sandbox for testing)
PRZELEWY24_MERCHANT_ID=123456
PRZELEWY24_POS_ID=123456
PRZELEWY24_CRC=your-crc-key
PRZELEWY24_API_KEY=your-api-key
PRZELEWY24_MODE=sandbox
```

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Set Up Database

```bash
# Generate Prisma client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# Seed with example products
npm run prisma:seed
```

You should see output like:
```
Created/Updated kit: Zestaw Epoksydowy 30m²
Created/Updated kit: Zestaw Poliuretanowy 50m² z antypoślizgiem R10 - Grafitowy
Created/Updated kit: Zestaw Epoksydowy 80m² z antypoślizgiem R10 - Beżowy
Seeding completed!
```

## Step 6: Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Step 7: Test the E-commerce Flow

### A. Test Shop Page
1. Go to http://localhost:3000/sklep
2. You should see 3 products
3. Click "Dodaj do koszyka" on any product

### B. Test Configurator
1. Go to http://localhost:3000/konfigurator
2. Follow the 4-step wizard:
   - Enter area: 35
   - Select: No underfloor heating
   - Select: R10 anti-slip
   - Choose: Grafitowy color
3. You should get: `GAR-EP-40-R10-GRAFITOWY`
4. Add to cart

### C. Test Checkout (COD)
1. Go to http://localhost:3000/koszyk
2. Click "Przejdź do kasy"
3. Fill in customer details:
   - Name: Jan Kowalski
   - Email: jan@test.pl
   - Phone: +48 123 456 789
   - Address: ul. Testowa 1
   - City: Warszawa
   - Zip: 00-001
4. Select "Płatność przy odbiorze (COD)"
5. Click "Złóż zamówienie"
6. You should see order confirmation

### D. Test Admin Panel
1. Go to http://localhost:3000/admin/zamowienia
2. Enter credentials:
   - Username: admin
   - Password: admin123 (or what you set in .env)
3. You should see your test order

## Troubleshooting

### Database Connection Error
```
Error: Can't reach database server at `localhost:5432`
```
**Solution**: Make sure PostgreSQL is running:
```bash
# macOS
brew services list

# Ubuntu
sudo systemctl status postgresql
```

### Migration Error
```
Error: P1001: Can't reach database server
```
**Solution**: Check your DATABASE_URL in .env file

### Prisma Generate Error
```
Error: @prisma/client did not initialize yet
```
**Solution**: Run `npm run prisma:generate` again

### Build Error (Google Fonts)
```
Error: Failed to fetch `Inter` from Google Fonts
```
**Solution**: This is a network issue. The build will work in production or with internet access.

## What's Next?

- **Przelewy24 Setup**: Create a sandbox account at https://www.przelewy24.pl/
- **Production Database**: Use Heroku Postgres, Railway, or Supabase
- **Deployment**: Deploy to Vercel, Netlify, or your preferred platform
- **Customize**: Add more products, modify styling, add features

## Common Tasks

### Add New Product
```bash
# Edit prisma/seed.ts and add new product
# Then run:
npm run prisma:seed
```

### View Database
```bash
# Install Prisma Studio
npx prisma studio
```

### Reset Database
```bash
# Warning: This deletes all data!
npx prisma migrate reset
npm run prisma:seed
```

## Support

For detailed documentation, see [ECOMMERCE_README.md](./ECOMMERCE_README.md)

For issues:
1. Check database is running
2. Verify .env configuration
3. Check browser console for errors
4. Review server logs in terminal
