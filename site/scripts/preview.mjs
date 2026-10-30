import { browserOptions } from "./browser.mjs";
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const browser = await chromium.launch(browserOptions());
await mkdir("test-results", { recursive: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on("pageerror", (e) => console.log("PAGE ERROR", e.message));
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await page.screenshot({ path: "test-results/desktop.png" });
console.log("Title:", await page.title());
console.log(
  "Body width:",
  await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    inner: innerWidth,
    fonts: document.fonts.status,
  })),
);
await page.emulateMedia({ reducedMotion: "reduce" });
await page.reload({ waitUntil: "networkidle" });
await page.screenshot({ path: "test-results/full.png", fullPage: true });
await page.setViewportSize({ width: 375, height: 900 });
await page.reload({ waitUntil: "networkidle" });
await page.screenshot({ path: "test-results/mobile.png" });
console.log(
  "Mobile width:",
  await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    inner: innerWidth,
  })),
);
await browser.close();
