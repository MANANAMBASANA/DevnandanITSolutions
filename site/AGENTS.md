<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Devnandan IT Solutions website: agent rules

Marketing site for Devnandan IT Solutions (Ahmedabad, India). Next.js 16 App Router, React 19, **static export** (`output: "export"`), GSAP + ScrollTrigger, Lenis smooth scroll, Swiper. Plain JavaScript (JSX), no TypeScript, no Tailwind, one global stylesheet.

Read `KNOWLEDGE.md` before non-trivial changes. It has the file map, animation system, theming, asset pipeline and known pitfalls. Deployment steps are in `DEPLOY.md`.

## Commands

Run all commands from this directory (`site/`). Node.js 20.9 or newer is required.

| Task | Command |
| --- | --- |
| Install | `npm ci` |
| Dev server (http://localhost:3000) | `npm run dev` |
| Production build, writes `out/` | `npm run build` (uses `--webpack`, keep it) |
| Serve the built `out/` locally | `npm run start` |
| Browser test suite (needs a running server) | `npm run test:browser` (set `TEST_URL` if not :3000) |
| Loader check | `node scripts/loader-check.mjs` |

Playwright needs Chromium: `npx playwright install chromium`.

## Rules

- **Text lives in `lib/content.js`.** Company details, services, prices, section headings, form labels and the footer credit are all there. Change copy there, not in JSX.
- **Static export only.** No API routes, route handlers that need a server, middleware, server actions, `next/image` optimization, cookies or ISR. Everything must render at build time into `out/`.
- **Styles go in `app/globals.css`.** Class names use the `dn-` prefix. Use the CSS variables (`--base`, `--accent`, `--t-bright` and so on). Light theme overrides live under `html[data-theme="light"]`. Every visual change must look right in **both** themes.
- **Motion respects `prefers-reduced-motion`.** GSAP work goes inside the `gsap.matchMedia()` `(prefers-reduced-motion: no-preference)` block in `components/Shell.jsx` (`Motion`). Content must be fully visible with motion off.
- **Do not invent business facts**, prices, client names, testimonials, certifications or metrics. Unconfirmed items are listed under "Owner review before launch" in `README.md`.
- **Images:** WebP in `public/img/`, about 200 KB or less each, with explicit `width`/`height` and empty `alt=""` for decorative art. Keep PNG originals for transparent 3D objects.
- **Accessibility is tested** (axe WCAG A/AA, zero violations). Keep one `h1` per page, labelled controls, visible focus and no horizontal overflow at 375, 768, 1200 and 1440px.
- Keep the `<!-- BEGIN/END:nextjs-agent-rules -->` block above. `next dev` rewrites it.

## Before you finish a change

1. `npm run build` passes.
2. Check the change in the browser in dark and light themes, on desktop and at 375px wide.
3. For behavior changes, run `npm run start` and then `npm run test:browser`.
