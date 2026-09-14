import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
  },
  webServer: {
    // Let Playwright own the process even when Astro detects an agent environment.
    env: { ASTRO_PREVIEW_BACKGROUND: '1' },
    command: 'npm run preview -- --host 127.0.0.1 --port 4321',
    port: 4321,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
