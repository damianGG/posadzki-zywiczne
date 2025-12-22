# Deployment Troubleshooting Guide

## Issue Resolved ✅

The lockfile mismatch has been fixed in commit `83c71e9`. Both `package-lock.json` and `pnpm-lock.yaml` are now synchronized with `package.json`.

## For Successful Deployment

### 1. Platform Configuration

#### Vercel
```
Build Command: pnpm install && pnpm run build
Install Command: pnpm install
Node Version: 18.x or higher
```

**Important**: Make sure to clear build cache:
- Go to Project Settings → General
- Click "Clear Cache and Deploy"

#### Netlify
```
Build command: pnpm install && pnpm run build
Publish directory: .next
Node version: 18
```

Add to `netlify.toml`:
```toml
[build]
  command = "pnpm install && pnpm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
```

### 2. Environment Variables Required

Add these to your deployment platform:

```bash
# Database (Required for build if using in components)
DATABASE_URL="your-postgresql-connection-string"

# Admin (Required)
ADMIN_PASSWORD=your-secure-password

# Base URL (Required)
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Przelewy24 (Optional - for payments)
PRZELEWY24_MERCHANT_ID=your-merchant-id
PRZELEWY24_POS_ID=your-pos-id
PRZELEWY24_CRC_KEY=your-crc-key
PRZELEWY24_API_KEY=your-api-key
PRZELEWY24_SANDBOX=false
```

### 3. Build Process

The deployment should:

1. **Install dependencies** with pnpm:
   ```bash
   pnpm install --frozen-lockfile
   ```

2. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

3. **Build Next.js**:
   ```bash
   next build
   ```

### 4. Common Issues

#### "Specifiers don't match" Error
✅ **Fixed** in commit 83c71e9. Pull the latest changes.

#### Build Cache Issues
Clear the deployment platform's build cache and redeploy.

#### Missing Dependencies
Ensure the platform is using pnpm, not npm or yarn. Check the platform's package manager setting.

#### Database Connection Error
If using Prisma in page components (not just API routes), you need a valid `DATABASE_URL` at build time.

### 5. Verification

After deployment, verify:

- ✅ Shop page loads: `/sklep`
- ✅ Configurator works: `/konfigurator`
- ✅ Cart functions: `/koszyk`
- ✅ Admin accessible: `/admin/zamowienia`

### 6. Post-Deployment

1. Run database migrations:
   ```bash
   # Connect to production database
   npx prisma migrate deploy
   ```

2. Seed initial products:
   ```bash
   npx prisma db seed
   ```

## Need Help?

If deployment still fails, provide:
1. Full error message from build logs
2. Deployment platform (Vercel/Netlify/etc.)
3. Node.js version being used
