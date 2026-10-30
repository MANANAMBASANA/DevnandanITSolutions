import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { browserOptions } from "./browser.mjs";
const browser = await chromium.launch(browserOptions());
const base = process.env.TEST_URL || "http://localhost:3000";
await mkdir("test-results", { recursive: true });
const errors = [];
for (const [theme, width] of [
  ["dark", 1440],
  ["light", 1440],
  ["dark", 375],
]) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    reducedMotion: "no-preference",
  });
  await context.addInitScript(
    (t) => localStorage.setItem("dn-theme", t),
    theme,
  );
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base, { waitUntil: "domcontentloaded" });
  const loader = page.locator(".dn-loader");
  await expect(loader).toBeVisible();
  await expect(loader.locator("img.dn-loader-shell")).toHaveCount(1);
  await expect(loader.locator("img.dn-loader-wave")).toHaveCount(1);
  // The wordmark is decorative; screen readers skip the whole loader.
  await expect(loader.locator(".dn-loader-content")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await page.waitForFunction(() => document.querySelector("#main").inert);
  await page.waitForTimeout(650);
  await page.screenshot({ path: `test-results/loader-${theme}-${width}.png` });
  await expect(loader).toHaveCount(0, { timeout: 4000 });
  expect(
    await page.evaluate(
      () =>
        !document.documentElement.hasAttribute("data-dn-loading") &&
        !document.querySelector("#main").inert,
    ),
  ).toBeTruthy();
  await expect(page.locator("h1")).toBeVisible();
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.locator("#dn-menu")).toBeVisible();
  await page.keyboard.press("Escape");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  console.log(
    `${theme}, ${width}px: 3D logo animation, dismissal and interactions passed`,
  );
  await context.close();
}
for (const mode of ["reduced-motion", "no-javascript", "blocked-bundle"]) {
  const context = await browser.newContext({
    reducedMotion: mode === "reduced-motion" ? "reduce" : "no-preference",
    javaScriptEnabled: mode !== "no-javascript",
  });
  const page = await context.newPage();
  if (mode === "blocked-bundle")
    await page.route("**/_next/static/**/*.js", (route) => route.abort());
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await expect(page.locator(".dn-loader")).not.toBeVisible({ timeout: 7000 });
  await expect(page.locator("h1")).toBeVisible();
  expect(await page.locator("#main").getAttribute("inert")).toBeNull();
  console.log(`${mode}: page remains available`);
  await context.close();
}
await browser.close();
expect(errors).toEqual([]);
console.log("All loader checks passed.");
