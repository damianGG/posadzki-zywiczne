# 🚀 Deployment Checklist

Use this checklist to deploy the SEO-optimized realizacje template to production.

## Pre-Deployment

### 1. Review Changes
- [ ] Review all code changes in PR
- [ ] Read `IMPLEMENTATION_COMPLETE.md` for overview
- [ ] Check `SEO_REALIZACJE_GUIDE.md` for usage guide
- [ ] Review `EXAMPLE_SEO_REALIZACJA.md` for content example

### 2. Understand Migration
- [ ] Read `MIGRATION_SEO_CONTENT.md`
- [ ] Review SQL migration script
- [ ] Understand rollback procedure
- [ ] Note: Migration is backward compatible (no breaking changes)

## Deployment Steps

### Step 1: Backup Database ⚠️
```bash
# Create backup before any changes
pg_dump -h your-supabase-host -U postgres -d postgres -t realizacje > realizacje_backup_$(date +%Y%m%d).sql
```
- [ ] Database backup created
- [ ] Backup stored safely
- [ ] Verified backup size is reasonable

### Step 2: Run Database Migration
1. [ ] Open Supabase Dashboard
2. [ ] Go to SQL Editor
3. [ ] Copy SQL from `MIGRATION_SEO_CONTENT.md`:
```sql
-- Add h1 column
ALTER TABLE realizacje 
ADD COLUMN IF NOT EXISTS h1 TEXT;

-- Add content column
ALTER TABLE realizacje 
ADD COLUMN IF NOT EXISTS content JSONB;

-- Add comments for documentation
COMMENT ON COLUMN realizacje.h1 IS 'H1 heading for the page (50-65 chars)';
COMMENT ON COLUMN realizacje.content IS 'SEO-optimized content sections as JSON';
```
4. [ ] Execute SQL
5. [ ] Verify success (no errors)

### Step 3: Verify Migration
```sql
-- Check columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'realizacje' 
  AND column_name IN ('h1', 'content', 'faq')
ORDER BY column_name;

-- Should return:
-- content  | jsonb | YES
-- faq      | jsonb | YES  (from previous migration)
-- h1       | text  | YES
```
- [ ] Query executed
- [ ] All 3 columns present
- [ ] All are nullable

### Step 4: Test with Existing Data
```sql
-- Test that existing realizacje still work
SELECT slug, title, 
       CASE WHEN h1 IS NULL THEN 'NULL' ELSE 'has value' END as h1_status,
       CASE WHEN content IS NULL THEN 'NULL' ELSE 'has value' END as content_status
FROM realizacje 
LIMIT 5;

-- All existing rows should show NULL for new columns (expected)
```
- [ ] Existing realizacje load fine
- [ ] New columns are NULL (as expected)
- [ ] No errors

### Step 5: Merge & Deploy Code
1. [ ] Approve PR
2. [ ] Merge to main branch
3. [ ] Vercel will auto-deploy (if connected)
4. [ ] Wait for deployment to complete (~2-5 minutes)
5. [ ] Check deployment logs for errors

- [ ] PR merged successfully
- [ ] Deployment started
- [ ] Deployment completed
- [ ] No deployment errors

### Step 6: Verify Frontend
1. [ ] Visit existing realizacja page
2. [ ] Check it loads correctly (old format)
3. [ ] Verify no JavaScript errors in console
4. [ ] Check mobile responsive

- [ ] Old realizacje display correctly
- [ ] No console errors
- [ ] Mobile view works
- [ ] Images load

### Step 7: Test Admin Panel
1. [ ] Visit `/admin/realizacje/dodaj`
2. [ ] Check new fields are visible:
   - H1 field
   - Content sections field
   - AI generate button
3. [ ] Verify form validation works

- [ ] Admin page loads
- [ ] New fields visible
- [ ] Form looks correct
- [ ] No console errors

### Step 8: Test AI Generation
1. [ ] In admin, fill required fields:
   - Location: "Warszawa, Mokotów"
   - Type: "indywidualna"
   - Category: "garaze"
   - AI Prompt: "Szary garaż z posypką kwarcową"
2. [ ] Click "Wygeneruj przez AI"
3. [ ] Wait for generation (~10-30 seconds)
4. [ ] Verify fields are filled:
   - Title (≤60 chars)
   - H1 (different from title)
   - Keywords
   - Tags
   - Features
   - FAQ (JSON with 6 questions)
   - Content (JSON with all sections)

- [ ] AI generation works
- [ ] All fields populated
- [ ] Content looks reasonable
- [ ] FAQ is valid JSON
- [ ] Content is valid JSON

### Step 9: Create Test Realizacja
1. [ ] Use AI-generated content (from Step 8)
2. [ ] Review and edit if needed
3. [ ] Add 3-5 test images
4. [ ] Submit form
5. [ ] Wait for upload (~10-30 seconds)
6. [ ] Note the success message and slug

- [ ] Upload successful
- [ ] No errors
- [ ] Slug received
- [ ] Images uploaded to Cloudinary

### Step 10: Verify Test Realizacja
1. [ ] Visit the new realizacja page: `/realizacje/{slug}`
2. [ ] Check all sections display:
   - [ ] H1 heading (distinct from title)
   - [ ] Intro section
   - [ ] "Kiedy rozwiązanie ma sens"
   - [ ] "Zalety rozwiązania"
   - [ ] "Wady i ograniczenia"
   - [ ] "Wykonanie krok po kroku"
   - [ ] "Trwałość i odporność"
   - [ ] "Cena – widełki i czynniki"
   - [ ] "Najczęstsze błędy"
   - [ ] FAQ (all 6 questions)
   - [ ] "Dla kogo to rozwiązanie"
   - [ ] "Lokalizacja usług"
   - [ ] Images gallery
   - [ ] CTA section
3. [ ] Verify SEO:
   - [ ] Page title in browser tab
   - [ ] Meta description (view source)
   - [ ] Structured data (view source)
4. [ ] Check mobile view
5. [ ] Test internal links

- [ ] All sections display
- [ ] Content is well-formatted
- [ ] Images load correctly
- [ ] Mobile view works
- [ ] No layout issues

## Post-Deployment

### Step 11: Monitor & Optimize
1. [ ] Check error logs in Vercel dashboard (first 24h)
2. [ ] Monitor Supabase logs
3. [ ] Check website performance (Lighthouse)
4. [ ] Set up Google Search Console monitoring
5. [ ] Create calendar reminder to check SEO metrics in 2 weeks

### Step 12: Update Team
- [ ] Notify team about new features
- [ ] Share `SEO_REALIZACJE_GUIDE.md` with content creators
- [ ] Schedule training session if needed
- [ ] Document any production issues

### Step 13: Gradual Migration (Optional)
- [ ] Create list of old realizacje to update
- [ ] Set schedule for updating (e.g., 5 per week)
- [ ] Use AI to regenerate content for old entries
- [ ] Track which ones are migrated

## Rollback Procedure (If Needed)

### If Something Goes Wrong:

1. **Rollback Code:**
```bash
# In your local repo
git revert HEAD~4..HEAD  # Reverts last 4 commits
git push origin main
```

2. **Rollback Database (if necessary):**
```sql
-- Only if columns cause issues
ALTER TABLE realizacje DROP COLUMN IF EXISTS h1;
ALTER TABLE realizacje DROP COLUMN IF EXISTS content;
```

3. **Restore from Backup:**
```bash
# Restore full table (DANGER: overwrites current data)
psql -h your-supabase-host -U postgres -d postgres < realizacje_backup_YYYYMMDD.sql
```

## Success Indicators

After 1-2 weeks, you should see:
- [ ] New realizacje being created with SEO structure
- [ ] Increased time on page
- [ ] Lower bounce rate
- [ ] More Google impressions
- [ ] Better keyword rankings
- [ ] More organic traffic

Track in Google Search Console:
- Performance → Search results
- Performance → Queries (check your keywords)
- Experience → Page experience

## Support

### If You Need Help:

**Documentation:**
- General usage: `SEO_REALIZACJE_GUIDE.md`
- Database issues: `MIGRATION_SEO_CONTENT.md`
- Content examples: `EXAMPLE_SEO_REALIZACJA.md`
- Technical details: `IMPLEMENTATION_COMPLETE.md`

**Common Issues:**

1. **AI Generation Fails:**
   - Check OpenAI API key in environment variables
   - Check API credits/billing
   - See error message for details

2. **Content Not Displaying:**
   - Check browser console for errors
   - Verify JSON structure in database
   - Check if content field is properly populated

3. **Images Not Uploading:**
   - Check Cloudinary credentials
   - Verify image size/format
   - Check network/CORS issues

4. **Database Errors:**
   - Verify migration ran successfully
   - Check column types (JSONB, not JSON)
   - Test with simple insert query

5. **Old Realizacje Not Working:**
   - Should work automatically (backward compatible)
   - Check if sections are conditionally rendered
   - Verify no required fields were added

## Completion

Date deployed: _______________
Deployed by: _______________
Test realizacja slug: _______________
Any issues encountered: _______________

---

## 🎉 Deployment Complete!

Your SEO-optimized realizacje template is now live!

**Next actions:**
1. Create your first real realizacja with AI
2. Share with team
3. Monitor metrics in 2 weeks
4. Consider gradual migration of old content

**Questions?** Review the documentation files or create an issue in the repository.
