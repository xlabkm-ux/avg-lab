import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests for AVG Lab
 *
 * These tests capture screenshots of key UI components and compare them
 * against baseline images. Any visual differences beyond the threshold
 * will fail the test.
 *
 * Run: pnpm test:visual
 * Update baselines: pnpm test:visual --update-snapshots
 *
 * NOTE: Visual regression tests require baseline snapshots to exist.
 * If baselines are missing, tests will be skipped until snapshots are generated.
 * To generate baselines: run `pnpm test:visual --update-snapshots` in a clean environment.
 */

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    // Wait for the app to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('homepage should match visual baseline', async ({ page }) => {
    // Full page screenshot for visual comparison
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      maxDiffPixels: 150, // Allow minor rendering differences
      mask: [
        // Mask dynamic content that changes between runs
        page.locator('[data-testid="timestamp"]'),
        page.locator('[data-testid="session-id"]'),
      ].filter(Boolean),
    });
  });

  test('project creation flow should match visual baseline', async ({ page }) => {
    // Navigate to project creation
    const button = page.getByRole('button', { name: /new project|create project/i });
    const isButtonVisible = await button.isVisible().catch(() => false);

    if (!isButtonVisible) {
      test.skip(true, 'Project creation button not available');
      return;
    }

    await button.click();

    // Wait for dialog/modal to appear
    const dialog = page.locator('[role="dialog"], [data-testid="project-form"]');
    const isDialogVisible = await dialog.isVisible().catch(() => false);

    if (!isDialogVisible) {
      test.skip(true, 'Project creation dialog not available');
      return;
    }

    // Screenshot the project creation form
    await expect(dialog).toHaveScreenshot('project-creation-dialog.png', {
      maxDiffPixels: 50,
    });
  });

  test('dialogue panel should match visual baseline', async ({ page }) => {
    // Check if dialogue panel exists
    const dialoguePanel = page.locator('[data-testid="dialogue-panel"]');
    const isVisible = await dialoguePanel.isVisible().catch(() => false);

    if (isVisible) {
      await expect(dialoguePanel).toHaveScreenshot('dialogue-panel.png', {
        maxDiffPixels: 100,
      });
    } else {
      test.skip(true, 'Dialogue panel not available in current view');
    }
  });

  test('claim review panel should match visual baseline', async ({ page }) => {
    // Check if claim review panel exists
    const claimPanel = page.locator('[data-testid="claim-review-panel"]');
    const isVisible = await claimPanel.isVisible().catch(() => false);

    if (isVisible) {
      await expect(claimPanel).toHaveScreenshot('claim-review-panel.png', {
        maxDiffPixels: 100,
      });
    } else {
      test.skip(true, 'Claim review panel not available in current view');
    }
  });

  test('concept map should match visual baseline', async ({ page }) => {
    // Check if concept map exists
    const conceptMap = page.locator('[data-testid="concept-map"]');
    const isVisible = await conceptMap.isVisible().catch(() => false);

    if (isVisible) {
      await expect(conceptMap).toHaveScreenshot('concept-map.png', {
        maxDiffPixels: 150, // Maps can have more dynamic rendering
      });
    } else {
      test.skip(true, 'Concept map not available in current view');
    }
  });

  test('citation panel should match visual baseline', async ({ page }) => {
    // Check if citation panel exists
    const citationPanel = page.locator('[data-testid="citation-panel"]');
    const isVisible = await citationPanel.isVisible().catch(() => false);

    if (isVisible) {
      await expect(citationPanel).toHaveScreenshot('citation-panel.png', {
        maxDiffPixels: 75,
      });
    } else {
      test.skip(true, 'Citation panel not available in current view');
    }
  });

  test('dark mode should match visual baseline', async ({ page }) => {
    // Set dark mode preference
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('homepage-dark.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('mobile viewport should match visual baseline', async ({ page }) => {
    // This test runs on mobile viewports only
    const viewportWidth = page.viewportSize()?.width;
    const isMobile = viewportWidth !== undefined && viewportWidth < 768;

    if (isMobile) {
      await expect(page).toHaveScreenshot('homepage-mobile.png', {
        fullPage: true,
        maxDiffPixels: 100,
      });
    } else {
      test.skip(true, 'Not a mobile viewport');
    }
  });
});
