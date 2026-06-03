import { defineConfig } from '@playwright/test';

export default defineConfig({
  retries: 0,
  testDir: './tests/e2e',
  timeout: 60000,
  use: {
    trace: 'on-first-retry',
  }
});
