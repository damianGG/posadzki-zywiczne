# Deployment Notes - Realizacje System

## Recent Changes

### Simplified Filtering (Commit 9704b85)
- Removed search bar functionality
- Removed tag cloud filter
- Kept category and type filters only
- Cleaner UI, easier navigation

## Potential Deployment Issues & Solutions

### 1. Build Process
The realizacje system uses server-side file system access for reading JSON files:
- `lib/realizacje.ts` uses `fs` and `path` modules
- This is **correct** for Next.js - these functions run at build time
- JSON files in `data/realizacje/` are read during static generation

### 2. Static Generation
All realizacje pages are statically generated:
- Main page (`/realizacje`) uses 'use client' for filter interactivity
- Detail pages (`/realizacje/[slug]`) have `generateStaticParams`
- This should work correctly in deployment

### 3. Environment Variables
Required variables (already set in .env):
```
EMAIL_USER=mailgun24na7@gmail.com
EMAIL_PASS=izns pgsp llwd mkrj
ADMIN_EMAIL=biuro@posadzkizywiczne.com
```

**For deployment platform (Vercel/Netlify/etc):**
Make sure these are also set in the deployment environment.

### 4. External Dependencies
Check package.json for all dependencies:
- Next.js and React are standard
- lucide-react for icons
- UI components from shadcn/ui

### 5. Common Build Errors

**Issue: "Cannot find module 'fs'"**
- Solution: This is normal in browser context. The `lib/realizacje.ts` functions should only be called server-side or at build time.

**Issue: "getaddrinfo ENOTFOUND fonts.googleapis.com"**
- Solution: Network issue accessing Google Fonts. Usually temporary.
- If persistent, check if fonts are properly configured in layout or CSS.

**Issue: Type errors**
- Solution: Run `npm run build` locally first to catch TypeScript issues
- The realizacje types are properly defined in `types/realizacje.ts`

### 6. File Structure Check

Ensure these files exist:
```
data/realizacje/
├── README.md
├── balkon-krakow-2024.json
├── dom-krakow-2024.json
├── garaz-nowy-sacz-2024.json
├── garaz-warszawa-2024.json
├── mieszkanie-rzeszow-2024.json
├── schody-warszawa-2024.json
└── taras-wieliczka-2024.json
```

All JSON files should be committed to the repository.

### 7. Deployment Commands

Standard Next.js deployment:
```bash
npm install
npm run build
npm run start
```

Or for static export (if needed):
```bash
npm install
npm run build
# Next.js will generate static pages in .next/ directory
```

### 8. Vercel-Specific

If deploying to Vercel:
- Framework preset: Next.js
- Build command: `npm run build`
- Output directory: `.next`
- Install command: `npm install`
- Node version: 18.x or higher

Environment variables must be set in Vercel dashboard.

### 9. Image Optimization

Images are referenced from `/public/` directory:
- `/garaz/` folder
- `/mieszkanie/` folder
- `/remont-balkon.webp`
- etc.

Ensure all referenced images exist in the repository.

## Testing Deployment Locally

To test the build process:

```bash
# Install dependencies
npm install

# Run build
npm run build

# Start production server
npm run start
```

Access at http://localhost:3000/realizacje

## Troubleshooting Checklist

- [ ] All JSON files in `data/realizacje/` are valid JSON
- [ ] All image paths in JSON files point to existing files
- [ ] Environment variables are set in deployment platform
- [ ] Node version is 18.x or higher
- [ ] `npm install` completes successfully
- [ ] `npm run build` completes without errors
- [ ] TypeScript types are correct (no TS errors)

## Contact

If deployment issues persist, check:
1. Build logs for specific error messages
2. Verify all dependencies are installed
3. Check Node.js version compatibility
4. Ensure environment variables are properly configured
