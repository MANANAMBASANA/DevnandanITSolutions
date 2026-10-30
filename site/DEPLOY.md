# Deploying the Devnandan website

The site builds to plain static files in `out/`. Any static host works. No server, database or API key is needed.

## 1. Requirements

- Node.js **20.9 or newer** (`node -v`)
- npm (comes with Node)

## 2. Install and test locally

```bash
cd site
npm ci
npm run dev        # open http://localhost:3000
```

## 3. Set the real domain (important)

Canonical URLs, Open Graph share previews, `sitemap.xml` and `robots.txt` all use `NEXT_PUBLIC_SITE_URL`. Without it they point at an old preview address.

Set it to the full HTTPS origin, with no trailing slash, **before building**:

```bash
# macOS / Linux
NEXT_PUBLIC_SITE_URL=https://www.example.com npm run build

# Windows PowerShell
$env:NEXT_PUBLIC_SITE_URL="https://www.example.com"; npm run build
```

Or create `site/.env.production.local` (git-ignored):

```
NEXT_PUBLIC_SITE_URL=https://www.example.com
```

On Vercel, Netlify or Cloudflare, add it as an environment variable in the project settings instead.

## 4. Build

```bash
npm run build      # writes out/
npm run start      # optional: preview out/ at http://localhost:3000
```

Upload the **contents** of `out/`, not the folder itself. The output includes `404.html` for missing pages and uses folder URLs such as `/founder/` and `/services/website-development/`.

## 5. Pick a host

### Vercel (easiest)
1. Push the `site/` folder to a GitHub repo, or run `npx vercel` inside `site/`.
2. Framework preset: **Next.js**. Root directory: `site` (if the repo root is above it).
3. Add the environment variable `NEXT_PUBLIC_SITE_URL`.
4. Deploy, then add the custom domain under Settings → Domains.

### Netlify
1. New site from Git (base directory `site`), or drag and drop the built `out/` folder in the Netlify dashboard.
2. Build command `npm run build`, publish directory `out`.
3. Add `NEXT_PUBLIC_SITE_URL` under Site configuration → Environment variables.

### Cloudflare Pages
1. Connect the repo. Root directory `site`, build command `npm run build`, output directory `out`.
2. Set `NEXT_PUBLIC_SITE_URL` and `NODE_VERSION=20` (or newer).

### Shared hosting (Hostinger, cPanel, GoDaddy and similar)
1. Build locally with `NEXT_PUBLIC_SITE_URL` set (step 3).
2. Upload everything **inside** `out/` to `public_html/`.
3. Missing pages should show `404.html`. If they do not, add this to `public_html/.htaccess`:
   ```
   ErrorDocument 404 /404.html
   ```
4. Turn on SSL (HTTPS) in the hosting panel.

## 6. After going live

- Open the site on a phone and a desktop, and try dark and light themes (toggle in the header).
- Check that `https://your-domain/sitemap.xml` and `/robots.txt` show the real domain.
- Paste the URL into a WhatsApp chat or https://www.opengraph.xyz to check the share preview image.
- Submit the sitemap in Google Search Console.

## Contact form

The form does **not** send email by itself. It opens the visitor's email app with a prefilled message to devnandanitsolutions@gmail.com. To receive submissions directly, connect a form service such as Formspree, Web3Forms or Netlify Forms in `components/Interactive.jsx` (`ContactForm`). The site is static, so it cannot use a Next.js API route.

## Before making it public

The business owner should confirm the items in "Owner review before public launch" in `README.md`: public claims, client permission for project screenshots, prices, social links, the original logo and the form backend.

## Updating the site later

Change text, prices or links in `lib/content.js`. Rebuild and upload `out/` again, or push to Git if the host builds automatically. See `AGENTS.md` and `KNOWLEDGE.md` before bigger changes. AI coding agents (Claude Code, Codex) read those files automatically.
