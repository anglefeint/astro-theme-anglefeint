import process from 'node:process';
import { defineConfig } from '@playwright/test';
const existingServer = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: existingServer || 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: existingServer
    ? undefined
    : {
        // Let Playwright own the process even when Astro detects an agent environment.
        env: { ASTRO_PREVIEW_BACKGROUND: '1' },
        command: 'npm run preview -- --host 127.0.0.1 --port 4321',
        port: 4321,
        reuseExistingServer: false,
        timeout: 30_000,
      },
});
