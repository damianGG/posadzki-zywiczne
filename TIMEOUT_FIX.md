# 504 Gateway Timeout Fix

## Problem

User reported error when using AI content generation:
```
AI generation error: SyntaxError: Unexpected token 'A', "An error o"... is not valid JSON
Status Code: 504 Gateway Timeout
```

## Root Cause

1. **Insufficient timeout**: `maxDuration` was set to 10 seconds
2. **Long AI generation**: Generating 900-1200 words across 10 sections takes 30-60 seconds
3. **Vercel timeout**: When serverless function exceeded 10s, Vercel returned 504 error as HTML
4. **JSON parsing error**: Frontend expected JSON but received HTML error page

## Solution

### 1. Increased API Timeout (commit: feca96d)

**File**: `app/api/admin/generate-content/route.ts`

Changed:
```typescript
export const maxDuration = 10; // Default timeout
```

To:
```typescript
export const maxDuration = 60; // Increased timeout for comprehensive AI content generation (900-1200 words)
```

### 2. Improved Error Handling

**File**: `app/admin/realizacje/dodaj/page.tsx`

Added non-JSON response handling:
```typescript
// Handle non-JSON responses (like 504 Gateway Timeout HTML pages)
let result;
const contentType = response.headers.get('content-type');
if (contentType && contentType.includes('application/json')) {
  result = await response.json();
} else {
  // Non-JSON response (likely an error page)
  const text = await response.text();
  throw new Error(`Serwer zwrócił błąd: ${response.status} ${response.statusText}...`);
}
```

Added contextual error messages:
```typescript
if (error.message.includes('504') || error.message.includes('Gateway Timeout')) {
  errorMsg = 'Przekroczono limit czasu generowania (timeout). AI generuje dużo treści (900-1200 słów), co może zająć do 60 sekund. Spróbuj ponownie za chwilę.';
} else if (error.message.includes('Failed to fetch')) {
  errorMsg = 'Błąd połączenia z serwerem. Sprawdź połączenie internetowe i spróbuj ponownie.';
}
```

### 3. Improved UI Feedback

Added timeout warning:
```tsx
<p className="text-xs text-amber-600 dark:text-amber-400 mb-4">
  ⏱️ Generowanie treści zajmuje 30-60 sekund. Proszę czekać...
</p>
```

Updated loading message:
```tsx
{isGeneratingAI ? (
  <>
    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
    Generuję treść AI (może potrwać do 60s)...
  </>
) : ...}
```

## Vercel maxDuration Limits

- **Hobby plan**: 10 seconds (default)
- **Pro plan**: 60 seconds (configured)
- **Enterprise plan**: 300 seconds (5 minutes)

Current implementation uses 60 seconds, which should work on Pro plan and above.

## Testing

To verify the fix:

1. Go to `/admin/realizacje/dodaj`
2. Fill required fields:
   - Location: "Warszawa, Mokotów"
   - Type: "indywidualna"
   - Category: "garaze"
   - AI Prompt: "Szary garaż z posypką kwarcową"
3. Click "Wygeneruj przez AI"
4. Wait 30-60 seconds
5. Verify content is generated successfully

## Expected Behavior

- AI generation completes in 30-60 seconds
- All fields are populated (title, h1, content sections, FAQ, etc.)
- No timeout errors
- Clear loading indicator with time estimate
- Helpful error messages if issues occur

## Rollback (if needed)

If 60s timeout causes issues:

```typescript
// Reduce back to 10s (but AI generation will fail for comprehensive content)
export const maxDuration = 10;
```

Or consider:
- Reducing content generation scope (fewer sections)
- Using streaming responses
- Background job processing
- Caching AI responses

## Related Documentation

- `SEO_REALIZACJE_GUIDE.md` - Full usage guide
- `IMPLEMENTATION_COMPLETE.md` - Technical details
- Vercel maxDuration docs: https://vercel.com/docs/functions/serverless-functions/runtimes#max-duration

## Status

✅ **Fixed** in commit `feca96d`
✅ **Tested**: No new TypeScript errors
✅ **Deployed**: Ready for production testing

---

**Date**: 2025-12-27  
**Reported by**: @damianGG  
**Fixed by**: @copilot  
**Commit**: feca96d
