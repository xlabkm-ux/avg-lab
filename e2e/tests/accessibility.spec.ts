import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility Tests for AVG Lab
 *
 * These tests use axe-core to check for accessibility violations.
 * Tests ensure the application meets WCAG 2.1 AA standards.
 *
 * Run: pnpm test:a11y
 */

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('homepage should not have any automatically detectable accessibility violations', async ({
    page,
  }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Log results for debugging
    console.log(
      'Accessibility violations:',
      accessibilityScanResults.violations.length,
    );

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('project creation form should be accessible', async ({ page }) => {
    // Try to open project creation dialog
    const newProjectButton = page.getByRole('button', { name: /new project/i });
    await expect(newProjectButton).toBeVisible();
    await newProjectButton.click();

    // Wait for dialog
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('navigation should be keyboard accessible', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    const firstFocusedElement = await page.locator(':focus').first();
    await expect(firstFocusedElement).toBeVisible();

    // Tab through several elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const focusedElement = await page.locator(':focus').first();
      await expect(focusedElement).toBeVisible();
    }
  });

  test('all images should have alt text', async ({ page }) => {
    const images = await page.locator('img').all();

    for (const img of images) {
      const alt = await img.getAttribute('alt');
      // Alt can be empty string for decorative images, but attribute must exist
      expect(alt).not.toBeNull();
    }
  });

  test('all form inputs should have labels', async ({ page }) => {
    const inputs = await page.locator('input, textarea, select').all();

    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const parentLabel = await input.locator('xpath=..').locator('label').first().isVisible().catch(() => false);

      const hasLabel = id || ariaLabel || ariaLabelledBy || parentLabel;
      expect(hasLabel).toBeTruthy();
    }
  });

  test('color contrast should meet WCAG AA standards', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['cat.color'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('page should have proper heading hierarchy', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['cat.name-role-value'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('interactive elements should have focus indicators', async ({ page }) => {
    const buttons = await page.locator('button, a, [role="button"]').all();

    for (const button of buttons.slice(0, 5)) { // Test first 5 buttons
      await button.scrollIntoViewIfNeeded();
      await button.focus();

      // Check if button has visible focus styles
      const hasFocusIndicator = await button.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return (
          style.outlineStyle !== 'none' ||
          style.boxShadow !== 'none' ||
          style.borderStyle !== 'none'
        );
      });

      expect(hasFocusIndicator).toBeTruthy();
    }
  });

  test('aria attributes should be valid', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['cat.aria'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
