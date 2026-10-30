import { chromium } from "@playwright/test";
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export function browserOptions() {
  let executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
  if (!executablePath && !existsSync(chromium.executablePath())) {
    const cache =
      process.env.PLAYWRIGHT_BROWSERS_PATH ||
      join(homedir(), ".cache", "ms-playwright");
    if (existsSync(cache)) {
      const installed = readdirSync(cache)
        .filter((name) => name.startsWith("chromium_headless_shell-"))
        .sort()
        .reverse();
      for (const name of installed) {
        const binary = join(
          cache,
          name,
          "chrome-headless-shell-linux64",
          "chrome-headless-shell",
        );
        if (existsSync(binary)) {
          executablePath = binary;
          break;
        }
      }
    }
  }
  return { headless: true, executablePath, args: ["--no-sandbox"] };
}
