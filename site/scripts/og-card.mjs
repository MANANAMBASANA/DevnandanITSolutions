// Composites the D mark and company copy over public/img/og-background.webp into public/img/og.png.
import { readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { browserOptions } from "./browser.mjs";
import { content } from "../lib/content.js";

const asset = async (path, type) =>
  `data:${type};base64,${(await readFile(path)).toString("base64")}`;
const [bg, mark, display, sans] = await Promise.all([
  asset("public/img/og-background.webp", "image/webp"),
  asset("public/img/devnandan-mark.svg", "image/svg+xml"),
  asset("public/fonts/funnel-display.woff2", "font/woff2"),
  asset("public/fonts/funnel-sans.woff2", "font/woff2"),
]);
const [first, ...rest] = content.company.tagline.split(" to ");
const html = `<!doctype html><style>
@font-face{font-family:D;src:url(${display}) format("woff2");font-weight:300 800}
@font-face{font-family:S;src:url(${sans}) format("woff2");font-weight:300 800}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#0d111c url(${bg}) center/cover;color:#f4f7fb;font-family:S;padding:110px 80px 0;position:relative}
.brand{display:flex;align-items:center;gap:44px}
.brand img{width:144px;height:166px}
h1{font-family:D;font-weight:600;font-size:84px;letter-spacing:-.04em;line-height:1}
small{display:block;margin-top:22px;font-size:18px;letter-spacing:.42em;color:#9fbce7}
p{margin-top:56px;font-family:D;font-size:40px;line-height:1.25;letter-spacing:-.02em}
p span{color:#2f8cff}
footer{position:absolute;left:66px;right:66px;bottom:52px;border-top:1px solid #2f8cff30;padding:28px 14px 0;display:flex;justify-content:space-between;font-size:17px;color:#b4c3dc}
</style><div class="brand"><img src="${mark}" alt=""><div><h1>Devnandan</h1><small>IT SOLUTIONS</small></div></div>
<p>${first}<br><span>to ${rest.join(" to ")}</span></p>
<footer><span>${content.company.signoff}</span><span>Ahmedabad, India</span></footer>`;

const browser = await chromium.launch(browserOptions());
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "public/img/og.png" });
await browser.close();
console.log("Wrote public/img/og.png");
