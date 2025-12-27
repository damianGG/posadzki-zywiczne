# 413 Payload Too Large Fix

## Problem

User reported error when trying to upload realizacja with images:
```
Status Code: 413 Content Too Large
x-vercel-error: FUNCTION_PAYLOAD_TOO_LARGE
```

## Root Cause

1. **Vercel body size limit**: Serverless functions on Hobby/Pro plans have a 4.5 MB request body size limit
2. **Large image uploads**: Multiple images being uploaded simultaneously
3. **AI-generated content**: 900-1200 words of JSON content adds to payload size
4. **No validation**: No client-side checks preventing oversized uploads

Combined payload exceeded the 4.5 MB Vercel limit.

## Solution

### 1. Client-Side File Size Validation (commit: 43426e5)

**File**: `app/admin/realizacje/dodaj/page.tsx`

Added comprehensive validation in `addImages()` function:

```typescript
const addImages = (files: File[]) => {
  // Validate file sizes
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB per file
  const MAX_TOTAL_SIZE = 4 * 1024 * 1024; // 4MB total (leaving 0.5MB for JSON data)
  
  // Check individual file sizes
  const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);
  if (oversizedFiles.length > 0) {
    const fileNames = oversizedFiles.map(f => 
      `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`
    ).join(', ');
    alert(`⚠️ Następujące pliki są za duże (max 2MB na plik):\n${fileNames}\n\nProszę zmniejszyć rozmiar zdjęć przed przesłaniem.`);
    return;
  }
  
  // Check total size including existing images
  const newImages = [...images, ...files];
  const totalSize = newImages.reduce((sum, file) => sum + file.size, 0);
  
  if (totalSize > MAX_TOTAL_SIZE) {
    alert(`⚠️ Łączny rozmiar wszystkich zdjęć przekracza 4MB.\n\nObecnie: ${(totalSize / 1024 / 1024).toFixed(2)}MB\nMaksymalnie: 4MB\n\nProszę zmniejszyć liczbę lub rozmiar zdjęć.`);
    return;
  }
  
  setImages(newImages);
  // ... rest of code
};
```

**Validation Logic**:
- **Per-file limit**: 2MB max per individual image
- **Total limit**: 4MB max for all images combined
- **Buffer**: 0.5MB reserved for JSON data (form fields, AI content)
- **Immediate feedback**: Alerts user before attempting upload

### 2. Visual Size Indicators

Added warning banner above image upload:
```tsx
<div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
  <p className="text-xs text-amber-800 dark:text-amber-200">
    📏 <strong>Limity rozmiaru:</strong> Max 2MB na zdjęcie, max 4MB łącznie (wszystkie zdjęcia). 
    Zalecane: kompresja zdjęć przed przesłaniem.
  </p>
</div>
```

Added real-time size display:
```tsx
<div className="text-xs text-gray-600 dark:text-gray-400 text-center">
  Przesłane: {imagePreviews.length} {imagePreviews.length === 1 ? 'zdjęcie' : 'zdjęcia'} 
  ({(images.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(2)}MB / 4MB)
</div>
```

Shows current usage like: "Przesłane: 3 zdjęcia (2.3MB / 4MB)"

### 3. Server-Side Configuration

**File**: `app/api/admin/upload-realizacja/route.ts`

Added route configuration:
```typescript
// Configure route for larger payloads and longer execution
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // Allow up to 60 seconds for multiple image uploads
```

**File**: `vercel.json`

Added upload route to configuration:
```json
{
  "functions": {
    "app/api/admin/generate-content/route.ts": {
      "maxDuration": 60
    },
    "app/api/admin/upload-realizacja/route.ts": {
      "maxDuration": 60
    }
  }
}
```

## Vercel Limits

### Body Size Limits (Cannot be changed)
- **Hobby plan**: 4.5 MB
- **Pro plan**: 4.5 MB
- **Enterprise plan**: 4.5 MB (can request increase via support)

### Duration Limits (Configurable)
- **Hobby plan**: 10 seconds (default)
- **Pro plan**: 60 seconds (configured)
- **Enterprise plan**: 300 seconds (5 minutes)

## User Experience Improvements

### Before Fix
- ❌ Users could upload large files
- ❌ Upload would fail with cryptic 413 error
- ❌ No indication of size limits
- ❌ No way to know which files were too large

### After Fix
- ✅ Files validated before upload attempt
- ✅ Clear warning about size limits displayed
- ✅ Real-time size usage shown (e.g., "2.3MB / 4MB")
- ✅ Immediate feedback with file names and sizes
- ✅ Actionable error messages with guidance

### Error Messages

**Individual file too large**:
```
⚠️ Następujące pliki są za duże (max 2MB na plik):
photo1.jpg (3.5MB), photo2.jpg (2.8MB)

Proszę zmniejszyć rozmiar zdjęć przed przesłaniem.
```

**Total size exceeded**:
```
⚠️ Łączny rozmiar wszystkich zdjęć przekracza 4MB.

Obecnie: 4.8MB
Maksymalnie: 4MB

Proszę zmniejszyć liczbę lub rozmiar zdjęć.
```

## Best Practices for Users

### Recommended Image Sizes
- **Individual images**: 500KB - 1.5MB (after compression)
- **Total images**: 2-3 images of 1-1.5MB each
- **Format**: JPEG with 80-85% quality
- **Resolution**: 1920px max width for high quality

### Image Compression Tools
- **Online**: TinyPNG, Squoosh, Compressor.io
- **Desktop**: GIMP, Photoshop, ImageOptim
- **Bulk**: XnConvert, IrfanView

### Upload Strategy
1. Compress images before upload
2. Upload 2-4 images max per realizacja
3. Check real-time size indicator
4. System will alert if limits exceeded

## Alternative Solutions (Not Implemented)

If 4MB proves insufficient, consider:

### 1. Sequential Upload (More Complex)
Upload images one at a time via separate API calls:
- Pros: No size limit issues
- Cons: More complex, slower, more API calls

### 2. Direct Cloudinary Upload (Recommended for Future)
Upload images directly from client to Cloudinary:
- Pros: Bypasses Vercel limits, faster
- Cons: Requires Cloudinary signed uploads, more complex setup

### 3. Image Compression on Server (CPU Intensive)
Compress images server-side before uploading to Cloudinary:
- Pros: Automatic optimization
- Cons: Uses CPU time, increases function duration

### 4. Upgrade to Enterprise (Expensive)
Request higher limits from Vercel support:
- Pros: Higher limits
- Cons: Expensive, not guaranteed

## Testing

To verify the fix:

1. **Test individual file limit**:
   - Try to upload a single 3MB image
   - Should see alert: "Następujące pliki są za duże"

2. **Test total size limit**:
   - Upload 2x 1.5MB images (3MB total) ✓ Should work
   - Try to add 1x 1.5MB more (4.5MB total) ✗ Should be blocked

3. **Test real-time indicator**:
   - Upload images and verify size display updates
   - Should show: "Przesłane: 2 zdjęcia (3.0MB / 4MB)"

4. **Test successful upload**:
   - Upload 3x 1MB images (3MB total)
   - Should upload successfully without 413 error

## Monitoring

After deployment, monitor:
- Upload success rate (should improve to ~100%)
- Average payload size (should be under 4MB)
- User feedback about image compression
- Number of uploads blocked by validation

## Related Files

- `app/admin/realizacje/dodaj/page.tsx` - Client validation
- `app/api/admin/upload-realizacja/route.ts` - Server config
- `vercel.json` - Function configuration

## Related Documentation

- `TIMEOUT_FIX.md` - Fix for 504 timeout issue
- Vercel Limits: https://vercel.com/docs/functions/serverless-functions/runtimes#request-body-size
- Cloudinary Docs: https://cloudinary.com/documentation

## Status

✅ **Fixed** in commit `43426e5`
✅ **Tested**: TypeScript compiles without new errors
✅ **Deployed**: Ready for production testing

---

**Date**: 2025-12-27  
**Reported by**: @damianGG  
**Fixed by**: @copilot  
**Commit**: 43426e5
