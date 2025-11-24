import { defineConfig } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Reporter
  reporter: 'html',

  // Global test settings
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL,

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
  },
});