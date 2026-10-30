import { browserOptions } from "./browser.mjs";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFile, mkdir } from "node:fs/promises";
import { content } from "../lib/content.js";
const base = process.env.TEST_URL || "http://localhost:3000";
const browser = await chromium.launch(browserOptions());
const errors = [];
const results = [];
await mkdir("test-results", { recursive: true });
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
page.on("pageerror", (error) => errors.push(error.message));
for (const width of [375, 768, 1200, 1440]) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto(base, { waitUntil: "networkidle" });
  await expect(page.locator("h1")).toHaveCount(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  expect(
    await page
      .locator("img")
      .evaluateAll((imgs) =>
        imgs.every((img) => !img.complete || img.naturalWidth > 0),
      ),
  ).toBeTruthy();
  await page.screenshot({ path: `test-results/viewport-${width}.png` });
  results.push({ check: `Viewport ${width}`, passed: true });
}
await page.getByRole("button", { name: "Switch to light theme" }).click();
await page.reload({ waitUntil: "networkidle" });
await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
for (const theme of ["light", "dark"]) {
  if (theme === "dark")
    await page.getByRole("button", { name: "Switch to dark theme" }).click();
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  results.push({
    check: `Accessibility ${theme}`,
    violations: axe.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  });
  await page.screenshot({ path: `test-results/theme-${theme}.png` });
}
await page.getByRole("button", { name: "Open menu" }).click();
await expect(page.locator("#dn-menu")).toBeVisible();
await page.getByRole("button", { name: "Services", exact: true }).click();
await expect(page.locator(".dn-submenu")).toBeVisible();
for (let i = 0; i < 30; i++) await page.keyboard.press("Tab");
expect(
  await page.evaluate(
    () => document.activeElement.closest("#dn-menu") !== null,
  ),
).toBeTruthy();
await page.keyboard.press("Escape");
await expect(page.locator("#dn-menu")).not.toBeVisible();
await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
results.push({ check: "Menu accordion, focus trap and Escape", passed: true });
await page.locator("#services-tab-1").click();
await expect(page.locator("#services-panel")).toContainText(
  "Simple Android application",
);
await page.keyboard.press("ArrowRight");
await expect(page.locator("#services-panel")).toContainText(
  "Website security check",
);
await page.locator("#ai-tab-1").click();
await expect(page.locator("#ai-panel")).toContainText("Starter AI Plan");
await page.locator("#ai-tab-2").click();
await expect(page.locator("#ai-panel")).toContainText("Agent Starter");
results.push({
  check: "Service and AI tabs with keyboard navigation",
  passed: true,
});
await page.getByRole("button", { name: "5. Support", exact: true }).click();
await expect(page.locator(".dn-process-card.dn-active h3")).toHaveText(
  "Support",
);
results.push({ check: "Process step navigation", passed: true });
await page.locator("#projects").scrollIntoViewIfNeeded();
for (let i = 0; i < 6; i++) {
  await page.getByRole("button", { name: "Next project", exact: true }).click();
  await page.waitForTimeout(100);
}
await page.waitForTimeout(650);
await expect(page.locator(".dn-project-info h3")).toHaveText(
  "Voice AI Systems",
);
await page.locator(".dn-project-info button").click();
await expect(page.locator(".dn-project-dialog")).toBeVisible();
await page.keyboard.press("Escape");
await expect(page.locator(".dn-project-dialog")).not.toBeVisible();
results.push({
  check: "Project carousel and accessible product dialog",
  passed: true,
});
await page.getByRole("button", { name: "Send message", exact: true }).click();
await expect(page.locator("#error-name")).toBeVisible();
await expect(page.locator("#contact-name")).toBeFocused();
await page.locator("#contact-name").fill("QA Review");
await page.locator("#contact-email").fill("qa@example.com");
await page
  .locator("#contact-service")
  .selectOption({ label: "Website Development" });
await page
  .locator("#contact-message")
  .fill("Please build a company website for our team.");
await page.getByRole("button", { name: "Send message", exact: true }).click();
await expect(page.locator(".dn-form-status")).toContainText(
  "Your email draft is ready",
);
const draft = await page.locator(".dn-form-status a").getAttribute("href");
expect(draft).toContain("mailto:devnandanitsolutions@gmail.com");
expect(decodeURIComponent(draft)).toContain("QA Review");
results.push({ check: "Contact validation and mailto draft", passed: true });
for (const s of content.services.filter((s) => s.slug)) {
  await page.goto(`${base}/services/${s.slug}/`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.locator("h1")).toHaveText(s.name);
}
results.push({ check: "All 12 service detail routes", passed: true });
for (const width of [1440, 375]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`${base}/founder/`, { waitUntil: "networkidle" });
  await expect(page.locator("h1")).toHaveText("Manan Ambasana");
  await expect(page.locator("main")).toContainText("B.Tech IT");
  expect(
    await page
      .locator(".dn-founder-portrait img")
      .evaluate((image) => image.complete && image.naturalWidth > 0),
  ).toBeTruthy();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({ path: `test-results/founder-${width}.png` });
}
results.push({ check: "Founder portrait and responsive page", passed: true });
await page.goto(base + "/not-a-real-page/", { waitUntil: "domcontentloaded" });
await expect(page.locator("h1")).toHaveText("This page took a wrong turn.");
await page.setViewportSize({ width: 375, height: 900 });
await page.goto(base, { waitUntil: "networkidle" });
await page.locator(".dn-mobile-plans summary").nth(2).click();
await expect(page.locator(".dn-mobile-plans details").nth(2)).toHaveAttribute(
  "open",
  "",
);
results.push({ check: "Mobile service accordion", passed: true });
await context.close();
const motion = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "no-preference",
});
const mp = await motion.newPage();
mp.on("pageerror", (e) => errors.push(e.message));
await mp.goto(base, { waitUntil: "networkidle" });
await mp.waitForTimeout(1500);
expect(await mp.evaluate(() => Boolean(window.dnLenis))).toBeTruthy();
expect(await mp.locator(".pin-spacer").count()).toBeGreaterThan(0);
const before = await mp
  .locator(".dn-ticker-track")
  .evaluate((e) => getComputedStyle(e).transform);
await mp.waitForTimeout(1500);
const after = await mp
  .locator(".dn-ticker-track")
  .evaluate((e) => getComputedStyle(e).transform);
expect(before).not.toEqual(after);
await mp.screenshot({ path: "test-results/motion-desktop.png" });
results.push({
  check: "Lenis, GSAP ticker and pinned process active",
  passed: true,
});
await motion.close();
await writeFile(
  "test-results/checks.json",
  JSON.stringify({ results, errors }, null, 2),
);
console.log(JSON.stringify({ results, errors }, null, 2));
await browser.close();
if (errors.length || results.some((r) => r.violations?.length))
  process.exitCode = 1;
