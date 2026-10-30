import { browserOptions } from "./browser.mjs";
import { writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import sharp from "sharp";
const ua =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
for (const [family, file] of [
  ["Funnel Display", "funnel-display"],
  ["Funnel Sans", "funnel-sans"],
]) {
  const r = await fetch(
    `https://fonts.googleapis.com/css2?family=${family.replaceAll(" ", "+")}:wght@300..800&display=swap`,
    { headers: { "User-Agent": ua } },
  );
  const css = await r.text();
  console.log(css.slice(-700));
  const urls = [...css.matchAll(/url\((https[^)]+)\)/g)];
  const font = await fetch(urls.at(-1)[1]);
  await writeFile(
    `public/fonts/${file}.woff2`,
    Buffer.from(await font.arrayBuffer()),
  );
}
const browser = await chromium.launch(browserOptions());
const p = await browser.newPage({
  viewport: { width: 1440, height: 960 },
  ignoreHTTPSErrors: true,
});
await p
  .goto("https://kennismarket.devamtechnologies.com/", {
    waitUntil: "networkidle",
    timeout: 45000,
  })
  .catch((e) => console.log(e.message));
await p.waitForTimeout(6000);
console.log(
  "Food website:",
  await p.title(),
  (await p.locator("body").innerText()).slice(0, 800),
);
if ((await p.locator("body").innerText()).trim().length > 50) {
  await sharp(await p.screenshot())
    .webp({ quality: 78 })
    .toFile("public/img/project-05.webp");
  console.log("Food website captured");
} else
  console.log(
    "Food website returned blank content; use original fallback cover.",
  );
await browser.close();
