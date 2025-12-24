# Cloudinary Setup Guide for Realizacje Upload

This guide explains how to configure Cloudinary for the realizacje upload feature to work in production.

## Why Cloudinary?

Vercel's serverless functions have a read-only filesystem, which means we can't save uploaded images directly to the `public/` directory in production. Cloudinary provides cloud-based image storage and CDN delivery, making it perfect for this use case.

## Setup Instructions

### 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Sign up for a free account (provides 25GB storage and 25GB bandwidth/month)
3. Verify your email

### 2. Get Your Cloudinary Credentials

1. Log in to your Cloudinary dashboard
2. Go to **Dashboard** (https://cloudinary.com/console)
3. You'll see your credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (click "Reveal" to see it)

### 3. Configure Environment Variables

#### For Vercel (Production):

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4. Make sure to add them for **Production**, **Preview**, and **Development** environments
5. Redeploy your application

#### For Local Development:

1. Create a `.env.local` file in the root directory (or update your existing `.env` file)
2. Add the following:

```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

3. Restart your development server: `npm run dev`

### 4. Test the Integration

1. Go to `/admin/realizacje/dodaj`
2. Login with your admin password
3. Fill out the form and upload some images
4. Submit the form
5. Images should be uploaded to Cloudinary successfully

### 5. Verify Images in Cloudinary

1. Go to your Cloudinary dashboard
2. Navigate to **Media Library**
3. You should see a `realizacje` folder containing your uploaded images
4. Each realizacja will have its own subfolder: `realizacje/[location]-[slug]-[type]/`

## How It Works

### Image Upload Flow:

1. **User uploads images** through the web form
2. **Images sent to API** route at `/api/admin/upload-realizacja`
3. **API uploads to Cloudinary** using the Cloudinary Node.js SDK
4. **Cloudinary returns URLs** for the uploaded images
5. **opis.json created** with Cloudinary URLs and metadata
6. **In development**: JSON file also saved locally for immediate use
7. **In production**: JSON file needs to be committed (see workflow below)

### Folder Structure in Cloudinary:

```
realizacje/
├── warszawa-posadzka-zywiczna-w-garazu-garaz/
│   ├── 0-glowne.jpg    (main image)
│   ├── 1.jpg
│   ├── 2.jpg
│   └── ...
├── krakow-balkon-taras/
│   ├── 0-glowne.jpg
│   └── ...
└── ...
```

### opis.json Structure:

The generated `opis.json` file includes Cloudinary information:

```json
{
  "title": "Posadzka żywiczna w garażu - Warszawa",
  "description": "...",
  "cloudinary": {
    "images": [
      {
        "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234/realizacje/...",
        "publicId": "realizacje/warszawa-posadzka-garaz/0-glowne",
        "filename": "0-glowne.jpg"
      }
    ],
    "folderName": "warszawa-posadzka-garaz"
  },
  // ... other fields
}
```

## Production Workflow

### Quick Upload (Production):

1. Go to `/admin/realizacje/dodaj` on your production site
2. Login and fill out the form
3. Upload images - they go directly to Cloudinary ✅
4. Submit form
5. Clone repo locally
6. You'll find `opis.json` file referenced in the success message
7. Create the folder structure locally: `public/realizacje/[folder-name]/`
8. Add the `opis.json` file with Cloudinary URLs
9. Run scanner: `npx tsx scripts/scan-realizacje.ts`
10. Commit and push
11. Realizacja visible on site! 🎉

### Alternative: Full Local Workflow:

1. Run project locally: `npm run dev`
2. Add realizacja through form
3. Images uploaded to Cloudinary
4. Files also saved locally automatically
5. Commit and push
6. Done! ✨

## Benefits of Cloudinary

✅ **Cloud Storage** - Images stored in the cloud, not on Vercel's filesystem  
✅ **CDN Delivery** - Fast image loading worldwide  
✅ **Image Optimization** - Automatic format conversion and optimization  
✅ **Transformations** - Resize, crop, and transform images on-the-fly  
✅ **Free Tier** - 25GB storage and bandwidth per month  
✅ **Production Ready** - Works perfectly with Vercel's serverless functions  

## Troubleshooting

### "Cloudinary nie jest skonfigurowany" Error:

- **Solution**: Make sure all three environment variables are set:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- Check that they're added in Vercel's environment variables
- Redeploy after adding the variables

### Images Not Appearing:

- **Solution**: Images are in Cloudinary but the realizacja isn't visible on the site yet
- You need to:
  1. Create `opis.json` file locally with the Cloudinary URLs
  2. Run the scanner: `npx tsx scripts/scan-realizacje.ts`
  3. Commit and push the generated JSON files

### Upload Fails:

- **Check Cloudinary dashboard** for quota limits
- **Check browser console** for detailed error messages
- **Verify credentials** are correct and not expired

## Cloudinary Dashboard

Access your uploaded images anytime:
- **Dashboard**: https://cloudinary.com/console
- **Media Library**: https://cloudinary.com/console/media_library
- **Usage Statistics**: https://cloudinary.com/console/usage

## Cost

**Free Tier** (sufficient for most needs):
- 25 GB storage
- 25 GB bandwidth/month
- 25,000 transformations/month

**Paid Plans** (if you need more):
- Start at $99/month
- More storage and bandwidth
- Advanced features

## Security Notes

- ⚠️ **Never commit** `.env` or `.env.local` files with credentials
- ⚠️ **Keep API Secret secure** - it provides full access to your Cloudinary account
- ✅ Use environment variables in Vercel for production
- ✅ Add `.env.local` to `.gitignore`

## Support

For Cloudinary-specific issues:
- Cloudinary Documentation: https://cloudinary.com/documentation
- Cloudinary Support: https://support.cloudinary.com/

For implementation issues:
- Check `MOBILE_UPLOAD_GUIDE.md` for general usage
- Check `IMPLEMENTATION_SUMMARY.md` for technical details
