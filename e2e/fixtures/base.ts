import { test as base, expect } from '@playwright/test';

/**
 * Base test fixture for AVG Lab E2E tests
 * Provides common setup and teardown for user testing scenarios
 */
export const test = base.extend<{
  /** Navigate to AVG Lab home page */
  goToHome: () => Promise<void>;

  /** Navigate to a specific page */
  goToPage: (path: string) => Promise<void>;
}>({
  goToHome: async ({ page }, use) => {
    await use(async () => {
      await page.goto('/');
      await expect(page).toHaveTitle(/AVG/);
    });
  },

  goToPage: async ({ page }, use) => {
    await use(async (path: string) => {
      await page.goto(path);
    });
  },
});

export { expect };
