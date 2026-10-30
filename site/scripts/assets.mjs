import { browserOptions } from "./browser.mjs";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir, writeFile, readFile, access } from "node:fs/promises";
import { content } from "../lib/content.js";
await mkdir("public/fonts", { recursive: true });
await mkdir("public/img", { recursive: true });
for (const [family, file] of [
  ["Funnel Display", "funnel-display"],
  ["Funnel Sans", "funnel-sans"],
]) {
  const response = await fetch(
    `https://fonts.googleapis.com/css2?family=${family.replaceAll(" ", "+")}:wght@300..800&display=swap`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      },
    },
  );
  if (!response.ok) throw new Error(`Font CSS: ${response.status}`);
  const css = await response.text();
  const links = [...css.matchAll(/url\((https[^)]+)\)/g)];
  const font = await fetch(links.at(-1)[1]);
  await writeFile(
    `public/fonts/${file}.woff2`,
    Buffer.from(await font.arrayBuffer()),
  );
  console.log(`Downloaded ${family}`);
}
const browser = await chromium.launch(browserOptions());
const context = await browser.newContext({
  viewport: { width: 1440, height: 960 },
  deviceScaleFactor: 1,
  ignoreHTTPSErrors: true,
});
const results = [];
for (const [i, project] of content.projects.slice(0, 6).entries()) {
  const file = `public${project.image || `/img/project-${String(i + 1).padStart(2, "0")}.webp`}`;
  try {
    await access(file);
    results.push({
      name: project.name,
      url: project.url,
      status: "existing",
      file,
    });
    continue;
  } catch {}
  const page = await context.newPage();
  try {
    const response = await page.goto(project.url, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForTimeout(3500);
    await page.evaluate(() => {
      document
        .querySelectorAll('[class*="cookie-banner"],[id*="cookie-banner"]')
        .forEach((e) => e.remove());
    });
    if (response && response.status() >= 400)
      throw new Error(`HTTP ${response.status()}`);
    const title = await page.title();
    if (/just a moment|access denied|attention required/i.test(title))
      throw new Error("Site challenge page");
    if ((await page.locator("body").innerText()).trim().length < 50)
      throw new Error("Page returned blank content");
    const png = await page.screenshot({ fullPage: false });
    await sharp(png).webp({ quality: 78 }).toFile(file);
    results.push({
      name: project.name,
      url: project.url,
      status: "captured",
      file,
      title: title
        .replaceAll(String.fromCharCode(8212), ",")
        .replaceAll(String.fromCharCode(8211), "-"),
    });
    console.log(`Captured ${project.url}`);
  } catch (error) {
    results.push({
      name: project.name,
      url: project.url,
      status: "unavailable",
      error: error.message,
    });
    console.log(`Unavailable ${project.url}: ${error.message}`);
  } finally {
    await page.close();
  }
}
await browser.close();
await writeFile(
  "scripts/project-capture-report.json",
  JSON.stringify(results, null, 2),
);
const mark = `<path d="M4 2h40c29 0 50 22 50 50 0 11-3 20-8 28-4-10-10-16-20-22 2-5 3-9 3-14 0-14-11-24-25-24H23C12 20 5 13 4 2Z" fill="#fff"/><path d="M4 20C25 28 27 47 50 57c26 11 33 22 27 35-7 7-15 11-25 14 4-18-3-28-21-33C12 68 4 59 4 43V20Z" fill="#2f8cff"/>`;
await writeFile(
  "public/img/devnandan-mark.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94 106">${mark}</svg>`,
);
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><radialGradient id="g"><stop stop-color="#173e7a"/><stop offset="1" stop-color="#0d111c"/></radialGradient></defs><rect width="1200" height="630" fill="#0d111c"/><circle cx="1100" cy="250" r="450" fill="url(#g)"/><path d="M65 520h1070" stroke="#273b59"/><g transform="translate(75 110) scale(1.6)">${mark}</g><text x="270" y="202" fill="#ffffff" font-family="sans-serif" font-weight="600" font-size="74" letter-spacing="-3">Devnandan</text><text x="275" y="248" fill="#a8c3e8" font-family="sans-serif" font-size="19" letter-spacing="11">IT SOLUTIONS</text><text x="80" y="370" fill="#f4f7fb" font-family="sans-serif" font-size="38">Empowering Your Business</text><text x="80" y="420" fill="#2f8cff" font-family="sans-serif" font-size="38">to Digital Growth</text><text x="80" y="565" fill="#acb6c8" font-family="sans-serif" font-size="18">Innovate. Transform. Grow.</text><text x="900" y="565" fill="#acb6c8" font-family="sans-serif" font-size="16">Ahmedabad, India</text></svg>`;
await sharp(Buffer.from(og)).png().toFile("public/img/og.png");
console.log("Created OG image and SVG brand mark");
