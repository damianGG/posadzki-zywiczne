#!/bin/bash

# E-commerce Module Setup Script
# This script helps set up the database and seed initial products

set -e

echo "================================================"
echo "E-commerce Module Setup"
echo "================================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please copy .env.example to .env and configure your settings."
    echo ""
    echo "  cp .env.example .env"
    echo ""
    exit 1
fi

# Check if DATABASE_URL is set
if ! grep -q "^DATABASE_URL=" .env; then
    echo "❌ DATABASE_URL not found in .env!"
    echo "Please add your PostgreSQL connection string to .env"
    exit 1
fi

echo "✅ Environment configuration found"
echo ""

# Generate Prisma client
echo "📦 Generating Prisma client..."
npm run db:generate
echo ""

# Run migrations
echo "🔄 Running database migrations..."
read -p "This will create/update database tables. Continue? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run db:migrate
    echo "✅ Migrations completed"
else
    echo "Skipped migrations"
fi
echo ""

# Seed database
echo "🌱 Seeding database with example products..."
read -p "This will add/update example products. Continue? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run db:seed
    echo "✅ Database seeded"
else
    echo "Skipped seeding"
fi
echo ""

echo "================================================"
echo "✅ Setup complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Start development server: npm run dev"
echo "2. Visit the shop: http://localhost:3000/sklep"
echo "3. Visit the configurator: http://localhost:3000/konfigurator"
echo "4. Visit admin panel: http://localhost:3000/admin/zamowienia"
echo ""
echo "See ECOMMERCE_README.md for detailed documentation."
echo ""
