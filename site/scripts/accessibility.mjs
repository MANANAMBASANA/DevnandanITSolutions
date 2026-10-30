import { browserOptions } from "./browser.mjs";
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch(browserOptions());
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
await page.goto(process.env.TEST_URL || "http://localhost:3000", {
  waitUntil: "networkidle",
});
const all = [];
for (const theme of ["dark", "light"]) {
  await page.evaluate(
    (t) => (document.documentElement.dataset.theme = t),
    theme,
  );
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  const violations = results.violations.map((v) => ({
    id: v.id,
    nodes: v.nodes.map((n) => ({
      target: n.target,
      summary: n.failureSummary,
    })),
  }));
  all.push({ theme, violations });
  await page.screenshot({ path: `test-results/final-${theme}.png` });
}
console.log(JSON.stringify(all, null, 2));
await writeFile(
  "test-results/accessibility.json",
  JSON.stringify(all, null, 2),
);
await browser.close();
if (all.some((r) => r.violations.length)) process.exitCode = 1;
