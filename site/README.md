# Devnandan IT Solutions

A complete Next.js App Router website with static export, GSAP, ScrollTrigger, Lenis and Swiper. All 14 services, 12 service detail routes, a founder page, six website examples, seven service showcases, three AI pricing groups, contact form, dark/light themes and original brand illustrations are included.

**Docs:** [DEPLOY.md](DEPLOY.md) explains how to put the site live. [KNOWLEDGE.md](KNOWLEDGE.md) covers how everything works. [AGENTS.md](AGENTS.md) holds the rules for AI coding agents; Claude Code also loads it through [CLAUDE.md](CLAUDE.md).

## Run locally

Node.js 20.9 or newer is required.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. From the parent workspace, run `cd site` first.

## Build and deploy

```bash
npm run build
npm run start
```

The `out/` directory is the entire deployable website. Upload its contents to a static host. Preserve directory indexes and serve `404.html` for missing paths. No Node.js server, API key or database is needed in production. For Vercel, the normal Next.js preset also works.

Before building for a custom domain, set `NEXT_PUBLIC_SITE_URL` to its full HTTPS origin. This updates canonical URLs, Open Graph metadata, sitemap and robots.txt. The default is an old preview origin, so always set the variable for production. Step-by-step host instructions are in [DEPLOY.md](DEPLOY.md).

## Edit content

`lib/content.js` contains company and founder details, hero text, services, exact tier bullets, pricing notes, showcase entries, section headings, form labels and validation messages. Edit it and rebuild. The service template automatically generates a route for every service with a `slug`.

- Photography remains an unlinked Coming soon card.
- WhatsApp Marketing Software links to the AI plans section.
- Only WhatsApp Starter displays the supplied monetary price.
- Service tiers with no supplied price display Contact us for pricing.
- Social links are hidden until supplied.
- Original SVG/CSS illustrations are in `components/Artwork.jsx` and `components/Icons.jsx`.
- Theme, type, responsive rules and component styling are in `app/globals.css`.
- Theme preference uses `dn-theme` in localStorage. Storage failures are handled.

## Animation and accessibility

GSAP controls the six-second hero ticker, entrances, text reveals, floating artwork, pointer parallax, looping marquees, counters and fullscreen menu transitions. ScrollTrigger pins the desktop process and swaps its artwork. Lenis provides smooth scrolling. Swiper provides keyboard-operable coverflow navigation. CSS handles button, card and bento hover transitions.

On a full page load, the two halves of the 3D D logo fly in and lock together. A flash and a ring follow, the Devnandan wordmark rises in, and the overlay wipes away into the hero. The loader has matching dark and light versions. Background controls are temporarily inert, then restored when the short entrance finishes. A 4.5-second fallback dismisses the overlay if the client bundle cannot initialize. With JavaScript disabled the overlay is never shown.

Reduced-motion mode disables smooth scrolling, pinning, ticker movement, marquees and decorative animation, and reveals all content. Process steps remain interactive. Mobile service tabs become a native accordion. Native dialogs provide focus containment; Escape closes them and returns focus to the trigger.

## Contact form

The form validates name, email, optional phone, service and message. Until a backend is selected, it opens an encoded email draft and displays an explicit reminder to send it from the email app. It does not claim a message was delivered. The fallback link can reopen the prepared draft. Phone, email and WhatsApp links use the supplied contact information.

The complete image brief is [IMAGE_PROMPTS.md](IMAGE_PROMPTS.md). It includes sizes, filenames and service-focused prompts for optional replacement artwork.

## Images and fonts

Funnel Display and Funnel Sans are self-hosted variable WOFF2 fonts. Google Fonts distributes them under the SIL Open Font License; see the license files in `public/fonts/`.

Five portfolio screenshots were captured at 1440 x 960 and saved as WebP files below 100 KB each. The Food and Parties URL returned an empty page twice, so its live link is retained with a labeled original cover instead of a blank screenshot. Capture status is recorded in `scripts/project-capture-report.json`.

Manan Ambasana is shown on the home page and `/founder/` using the supplied portrait. His name, role and B.Tech IT qualification are owner-editable in `lib/content.js`.

The supplied logo was visible in the chat, but a downloadable JPG was not present in the attachment directory. The site uses a recreated SVG D mark and a live wordmark. Add the owner's original file as `public/img/devnandan-logo.jpg` when available. Do not rename the recreated SVG as the original source. The 1200 x 630 OG card is original brand artwork in `public/img/og.png`.

The hero uses four transparent 3D objects from the first four prompts in `IMAGE_PROMPTS.md`: the D sculpture, security shield, AI conversation bubble and vision viewfinder. PNG originals are in `public/img/`, while the website loads optimized WebP versions. The shield and viewfinder were adapted from artwork supplied in chat. The loader animates two halves of the D sculpture (`loader-d-shell.webp`, `loader-d-wave.webp`). The Tools and Why choose sections reuse the floating D sculpture.

The footer credits the site's designer and developer, Jenis, with a 3D signature (`signature-3d.webp`) that links to WhatsApp, plus WhatsApp and GitHub icons. The links are in `content.credit`.

All supplied artwork for prompts 05 to 38 in `IMAGE_PROMPTS.md` is integrated as optimized WebP files in `public/img/`: the 14 service covers, Build and Grow pillars, five process steps, seven service showcase slides, the Food and Parties fallback cover, three bento illustrations and the footer wave. Image paths are set in `lib/content.js`. `node scripts/og-card.mjs` rebuilds `public/img/og.png` from `og-background.webp` with the live logo and tagline.

`node scripts/assets.mjs` refreshes fonts and captures missing project images. It needs network access and a Playwright browser. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` if using an existing Chromium executable. Otherwise install Playwright's browser with `npx playwright install chromium`.

## Verification

```bash
npm run build
npm run test:browser
node scripts/loader-check.mjs
```

Run the preview server before browser checks. `TEST_URL` overrides localhost:3000. `scripts/check.mjs` checks the four requested widths, theme persistence, keyboard tabs, dialog focus, carousel, form validation, all service routes, mobile accordion, reduced motion and active GSAP/Lenis behavior. `scripts/accessibility.mjs` runs axe checks in both themes. Reports and screenshots go to ignored `test-results/`.

## Owner review before public launch

These are the unresolved items from the supplied brief, not additional implementation requirements:

1. Confirm or reword the zero Chinese-origin software claim against the technology used in previous work. As requested, the supplied claim remains in the hero and Cyber Security page for review.
2. Confirm permission to display all six client projects and screenshots, including the project on devamtechnologies.com. Confirm or repair its blank page.
3. Identify the unrelated smvshospital.com link before adding it. It is not shown as a CA/CPA project.
4. Confirm the WhatsApp platform and Meta billing footnote and worldwide availability statement.
5. Supply additional prices only if they should be public. No prices have been invented.
6. Supply Photography and Videography details, social profiles, the original JPG/transparent logo, and any approved testimonials.
7. Choose the final domain, hosting and form backend.

These review items should be resolved before the site is made public.
