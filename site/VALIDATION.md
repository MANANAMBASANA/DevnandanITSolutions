# Validation

Checked on 27 October 2026 against the Next.js production static export served locally.

| Desktop Lighthouse category | Score |
| --------------------------- | ----: |
| Performance                 |   100 |
| Accessibility               |   100 |
| Best Practices              |   100 |
| SEO                         |   100 |

Lighthouse 13.5.0 desktop preset. Total blocking time: 60 ms. These are local lab results, not a guarantee of field performance on a particular host or network. The generated report is in `test-results/lighthouse.json`.

Additional checks passed:

- Production build exports the home page, 12 service routes, custom 404, sitemap, robots and metadata assets.
- No horizontal overflow at 375, 768, 1200 and 1440 pixels.
- Zero axe WCAG A/AA violations in dark and light reduced-motion views.
- Theme persists after reload.
- Menu accordion, native dialog focus trap, Escape dismissal and focus restoration.
- Service and AI tabs, keyboard selection, mobile accordion.
- Process buttons, GSAP ticker, desktop process pin and Lenis initialization.
- Carousel navigation and product detail dialogs.
- Contact validation, invalid-field focus and correctly encoded email draft.
- All 12 service detail routes and the custom 404.
- No browser runtime errors during the checks.
- No known production dependency vulnerabilities in npm audit.
- One H1 on each checked page. No em dashes in exported home or 404 copy.
- Five project screenshots, all below 100 KB. Every raster asset is below 200 KB.

The supplied Food and Parties URL returned a blank page on two attempts. Its link and a labeled original fallback cover remain. See `README.md` for source-logo availability and the owner's pre-launch review list.

## D-logo loader update, 28 October 2026

The production build and the focused loader browser checks passed. The loader uses exactly one SVG with the two company-mark paths and no visible text. Verified dark and light desktop views, a 375px mobile view, completion and restored controls, reduced motion, JavaScript disabled, and a blocked client bundle. No browser runtime errors were reported.

Desktop Lighthouse after the loader update: Performance 100, Accessibility 100, Best Practices 100, SEO 100. Total blocking time remained 60 ms. The local lab report is `test-results/lighthouse-loader.json`.

## Founder and service showcase update, 28 October 2026

The static export includes `/founder/` with the supplied portrait of Manan Ambasana, his founder role and B.Tech IT qualification. The portrait is 56 KB in WebP format. The home page, menu, footer and sitemap link to the founder page. The seven conceptual carousel entries use service titles. The 38 image prompts and their required dimensions are in `IMAGE_PROMPTS.md`.

The production server returned HTTP 200 for the home and founder pages. Browser checks passed at 375, 768, 1200 and 1440 pixels with zero horizontal overflow, no axe WCAG A/AA violations in either theme, all 12 service routes, the founder image and responsive founder layout, the carousel, navigation, pricing tabs, contact validation and active motion. No browser runtime errors were reported.
