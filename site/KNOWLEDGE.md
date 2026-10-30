# Project knowledge: Devnandan IT Solutions website

This file explains how the site works and why it is built this way. Read it with `AGENTS.md`, which has the rules and commands. Deployment is in `DEPLOY.md`.

## What the site is

A one-page marketing site for **Devnandan IT Solutions**, an IT and digital agency in Ahmedabad, India, with a few extra routes. It lists 14 services with tiered plans, AI plan pricing, client projects, a founder section and a contact form. It has dark (default) and light themes.

- Company contact: +91 91733 40223, devnandanitsolutions@gmail.com. Both are in `lib/content.js`.
- Founder: Manan Ambasana (`founder` export in `lib/content.js`, page `/founder/`).
- The site was designed and built by **Jenis**. The footer credit shows Jenis's 3D signature with links to Jenis's WhatsApp and GitHub (`content.credit`). Keep it.

## Tech stack

| Piece | Version / notes |
| --- | --- |
| Next.js | 16.x, App Router, `output: "export"`, `trailingSlash: true`, `images.unoptimized` (`next.config.mjs`) |
| Build | `next build --webpack` writes static HTML to `out/` |
| React | 19, plain `.jsx`, no TypeScript |
| CSS | one file, `app/globals.css` (~4,000 lines), no Tailwind, no CSS modules |
| Animation | GSAP 3 + ScrollTrigger |
| Smooth scroll | Lenis, exposed as `window.dnLenis` |
| Carousel | Swiper 12 (Projects coverflow) |
| Fonts | Funnel Display (headings) and Funnel Sans (body), self-hosted WOFF2 in `public/fonts/` (SIL OFL) |
| Tests | Playwright + axe-core scripts in `scripts/` (not a test runner, plain Node scripts) |

Production needs no server, database or API key. `out/` is a folder of static files.

## File map

```
site/
├── app/
│   ├── layout.jsx           Root layout: metadata, theme + loader inline script, Header, Loader, Motion, Footer
│   ├── page.jsx             Home page, all sections in order (see below)
│   ├── globals.css          ALL styles, both themes, all breakpoints
│   ├── founder/page.jsx     /founder/
│   ├── services/[slug]/page.jsx  /services/<slug>/, one per service with a slug (generateStaticParams)
│   ├── not-found.jsx        Becomes out/404.html
│   ├── robots.js, sitemap.js  Use siteUrl
│   └── icon.svg             Favicon
├── components/
│   ├── Shell.jsx            Button, Chips, SectionHeading, RevealText, Header (nav, menu dialog, theme toggle),
│   │                        Motion (all global GSAP/Lenis setup), Footer (incl. the "Designed & built by" credit)
│   ├── Loader.jsx           Full-screen intro loader (3D D logo assembly)
│   ├── Interactive.jsx      Client components: TierCards, ServicePlans, AIPlans, Process (pinned), Projects (Swiper), ContactForm
│   ├── Artwork.jsx          Inline SVG/CSS illustrations
│   └── Icons.jsx            Icon (by name), Mark (SVG D), Brand (mark + wordmark), Ribbon
├── lib/content.js           ALL text, prices, links, image paths. Exports: content, copy, ui, founder, siteUrl, serviceHref
├── public/img/              WebP images (+ PNG originals of transparent 3D objects), og.png
├── public/fonts/            WOFF2 + licenses
├── scripts/                 Test and asset scripts (see "Scripts")
├── IMAGE_PROMPTS.md         Prompts used to generate every image (sizes, filenames)
├── VALIDATION.md            Older validation notes
└── README.md                Overview + owner review list
```

## Home page section order (`app/page.jsx`)

1. Hero: rotating word ticker, 3D objects (D ribbon, shield, AI bubble, viewfinder)
2. `#services`: service tabs (mobile: native accordion) with tier cards
3. Pillars (Build / Grow)
4. `#plans`: service plans
5. `#process`: five steps, pinned with ScrollTrigger on desktop
6. `#projects`: Swiper coverflow of client sites and showcases
7. Tools: "Tools we use to deliver", with the 3D D logo and 3D shield floating by the heading
8. `#why-us`: "Why choose Devnandan", bento grid, 3D D logo
9. `#founder`
10. `#ai-plans`: AI plan pricing groups
11. CTA
12. `#contact`: contact form

Header nav links point at these hash IDs. If you rename an ID, update `copy.nav` and `copy.menuGroups` in `lib/content.js`.

## Content model (`lib/content.js`)

- `content.company`: name, tagline, phone, email, WhatsApp, location, copyright.
- `content.credit`: footer credit (label, name, WhatsApp link with prefilled message, GitHub).
- `content.hero`: ticker words, description, trust line.
- `content.services[]`: each has `id`, `slug` (no slug means no detail page, for example Photography "Coming soon"), `name`, `description`, `icon`, `image`, `tiers`. A tier with no supplied price shows "Contact us for pricing". **Never invent prices.**
- `content.aiGroups[]`: AI plan groups.
- `content.projects[]`: portfolio entries (screenshot, live URL).
- `copy`: labels, nav, section headings, pillars, tabs, process steps, tools, reasons, stats, add-ons, CTA, form labels and errors, marquee, misc, page meta.
- `ui`: small UI strings and visual config.
- `founder`: founder details for the home section and `/founder/`.
- `siteUrl`: `process.env.NEXT_PUBLIC_SITE_URL` or a fallback preview origin. Used for canonical URLs, Open Graph, sitemap and robots. **Set the env var to the real domain before a production build.**
- `serviceHref(service)`: link helper for service cards.

The `TODO(owner)` comments in `lib/content.js` and the HTML comments in JSX mark items waiting on the business owner.

## Theming

- CSS variables are on `:root` (dark). Light overrides are under `html[data-theme="light"]`. Main tokens: `--base`, `--base-tint`, `--base-shade`, `--accent` (#2f8cff dark / #0b5bd3 light), `--t-bright`, `--t-medium`, `--t-muted`, `--st-medium`, `--st-muted` (stroke colors), `--radius-*`, `--display`, `--body`.
- Theme is saved in localStorage as `dn-theme` (`"light"` or `"dark"`). An inline script in `layout.jsx` applies it before paint, so the page does not flash. Default is dark.
- Breakpoints used: 420, 768, 999, 1200, 1600px. Tested widths: 375, 768, 1200, 1440.

## Animation system

All global motion is in `Motion()` in `components/Shell.jsx`, inside `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)`. Under reduced motion none of it runs and all content is visible.

- **Lenis** smooth scroll is driven by `gsap.ticker`, stored as `window.dnLenis` (stopped while the loader or menu is open).
- **`.dn-float`**: any element with this class gets a gentle up and down yoyo float.
- **`.dn-parallax`**: any element with this class follows the pointer slightly (fine pointers only).
- Pattern for a floating 3D object:
  ```jsx
  <div className="dn-tools-object dn-parallax" aria-hidden="true">
    <div className="dn-float">
      <img src="/img/hero-d-ribbon.webp" width="1024" height="1024" alt="" loading="lazy" />
    </div>
  </div>
  ```
  Under reduced motion, CSS forces `.dn-float, .dn-parallax { transform: none !important }`. For a static tilt on those elements, use the separate CSS `rotate:` property (for example `rotate: 15deg`), not `transform: rotate()`.
- Also in Motion: the hero word ticker, text reveals, counters, looping marquees and the footer signature reveal.
- `Process` (Interactive.jsx) pins on desktop with ScrollTrigger and swaps artwork per step.

### Loader (`components/Loader.jsx`)

1. The inline script in `layout.jsx` sets `html[data-dn-loading]` (only when motion is allowed) and a **4.5 s safety timeout**. The timeout removes it and fires `dn:loaded` if the JS bundle never runs. `#main` is inert while loading.
2. `layout.jsx` preloads `/img/loader-d-shell.webp` and `/img/loader-d-wave.webp` at high priority.
3. Loader waits for both images to decode (max 600 ms), then plays a GSAP timeline of about 2.6 s: the two halves of the 3D "D" fly in and lock together, then a flash, an expanding ring, the "Devnandan" letters rise in and "IT SOLUTIONS" letter-spaces out. The content lifts away and the overlay wipes up with a `clip-path`.
4. `finish()` removes the loader, clears `data-dn-loading`, and dispatches `dn:loaded`. The hero entrance waits for that event.
- The loader has a dark look and a light look (`html[data-theme="light"] .dn-loader...` overrides).
- With JavaScript disabled or reduced motion the loader is never shown.

### Footer signature reveal

`.dn-credit img` (the 3D signature) starts clipped with `clip-path: inset(-20% 100% -20% 0%)`. An IntersectionObserver on **the parent `.dn-credit`** waits until 60% of it is visible, then GSAP wipes the clip to full width over 1.4 s and clears it. Cleanup restores everything.

## Images and assets

- All images are in `public/img/`. Use WebP, about 200 KB or less. Give every image explicit `width`/`height`, and use `alt=""` plus `aria-hidden` for decorative art.
- Transparent 3D hero objects have PNG originals (`hero-*.png`) and WebP versions the site loads.
- `loader-d-shell.webp` and `loader-d-wave.webp` are the two halves of `hero-d-ribbon.png`, split so the loader can assemble them. They must keep the same canvas size so they line up.
- `signature-3d.webp` (900×459) is Jenis's 3D signature for the footer credit.
- `og.png` (1200×630) is the social share card, rebuilt with `node scripts/og-card.mjs`.
- `IMAGE_PROMPTS.md` lists the prompt and filename for every generated image.
- The real company logo file (JPG) was never supplied. The site uses a recreated SVG D mark (`Mark` in Icons.jsx, `public/img/devnandan-mark.svg`) and 3D renders.

## Scripts (`scripts/`)

| Script | Purpose |
| --- | --- |
| `check.mjs` (`npm run test:browser`) | Full browser test: 4 widths, theme persistence, tabs, dialogs, carousel, form validation, all service routes, accordion, reduced motion, GSAP/Lenis active |
| `accessibility.mjs` | axe WCAG A/AA in both themes |
| `loader-check.mjs` | Loader shows, dismisses, restores interaction; reduced-motion / no-JS / blocked-bundle fallbacks |
| `browser.mjs` | Shared Playwright launch options (`PLAYWRIGHT_CHROMIUM_EXECUTABLE` override) |
| `preview.mjs` | Screenshot helper |
| `assets.mjs`, `refine-assets.mjs` | Fetch fonts, capture project screenshots, optimize images (needs network) |
| `og-card.mjs` | Rebuild `public/img/og.png` |

All browser scripts need a running server (`npm run start` or `npm run dev`) and use `TEST_URL` (default `http://localhost:3000`). Output goes to `test-results/` (git-ignored).

## Contact form

`ContactForm` in `Interactive.jsx` validates input and then opens a **mailto email draft** to the company email. It does not send anything to a server. To get real submissions, add a static-friendly form service (Formspree, Web3Forms, Netlify Forms, or a serverless function on the host) and update the success message so it never claims delivery that did not happen.

## Known pitfalls (learned the hard way)

- **GSAP vs CSS transforms:** if GSAP animates `y`/`yPercent` on an element, do not set a CSS `transform` on it as its initial state, because GSAP takes over the transform and the two conflict. Hide it with `opacity: 0` in CSS and let GSAP animate opacity and position.
- **`gsap.fromTo` renders its "from" state immediately**, even when placed later in a timeline. Use `immediateRender: false` for later tweens or the element shows its start state too early.
- **IntersectionObserver never fires for a fully clip-pathed element** (it has no visible area). Observe its parent.
- **CSS `animation-timeline: view()` near the page bottom may never finish**, because the element cannot scroll far enough. That is why the signature reveal uses GSAP and an observer.
- **Static export limits:** no `next/image` optimization, no API routes, no middleware, no server actions, no dynamic routes without `generateStaticParams`.
- **Keep `--webpack`** in the build script. The project is set up and tested with webpack.
- **Next.js 16 differs from older versions.** Check `node_modules/next/dist/docs/` before using an API you are unsure of.
- `next dev` rewrites the `nextjs-agent-rules` block at the top of `AGENTS.md`. That is expected.

## Open business items

See "Owner review before public launch" in `README.md`. In short: confirm the "zero Chinese-origin software" claim, client permission for project screenshots, WhatsApp billing note, any extra public prices, Photography details, social links, the original logo, the final domain and a form backend. Do not resolve these by guessing. Ask the owner.
