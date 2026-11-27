# Performance checklist (P0–P4)

## CI
Lighthouse mobile runs three times per marketing route on each PR targeting main.
Reports are saved as GitHub Actions artifacts (not uploaded to public temporary storage).
Initial thresholds: 90 performance, 95 SEO/accessibility, LCP 2500 ms, TBT 200 ms, CLS 0.1 (warnings until a baseline is collected).
Hard transfer ceilings: 1.5 MB scripts and 3 MB total per route. Tighten per-route after baseline.
Local build has no Neon production credentials. Calculator engine tests run in prebuild; local fallback is intentionally excluded from Lighthouse.
Run Actions > Lighthouse mobile > Run workflow > production after the Vercel deployment is READY to include the real calculator. Compare repeated production reports with PageSpeed/CrUX. Lab TBT is not field INP.

## Manual acceptance before release
- Mobile/desktop: main image loads directly from Cloudinary, correct currentSrc, preload, alt text and no layout shift.
- All navigation, menu, CTA, in-page anchors, gallery enlargement, review scrolling/buttons, keyboard interaction, reduced motion.
- Garage calculator: preset, area, material/installation totals, PDF with Polish characters, email delivery.
- Vercel build and route cache/TTFB; compare three runs on the same origin/device/throttle and inspect trace for forced reflow and blocking CSS.
- Verify GTM in Tag Assistant: GA4 measurement ID and each lead conversion, check for duplicate page_view. Only then set GA4_MANAGED_BY_GTM=true in Vercel and redeploy. Default preserves both existing integrations. Clarity remains lazyOnload.
- Do not disable critical Tailwind CSS or alter third-party cache headers based solely on a collapsed PageSpeed warning.
- Check ESD page and internal links, metadata/JSON-LD and crawlability.
