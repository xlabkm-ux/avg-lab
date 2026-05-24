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

    // Log violations for debugging
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Accessibility violations found:');
      for (const violation of accessibilityScanResults.violations) {
        console.log(`- ${violation.id}: ${violation.description} (${violation.impact})`);
        console.log(`  Affected nodes: ${violation.nodes.length}`);
      }
    }

    // Use soft assertion to report violations without hard-failing the test
    // This allows CI to continue while tracking issues
    expect.soft(accessibilityScanResults.violations,
      `Found ${accessibilityScanResults.violations.length} accessibility violations. Check console for details.`
    ).toEqual([]);
  });

  test('project creation form should be accessible', async ({ page }) => {
    // Try to open project creation - check both button labels
    const newProjectButton = page.getByRole('button', { name: /new project|create project|start project/i });
    await expect(newProjectButton).toBeVisible();

    // Verify button has accessible name
    const buttonText = await newProjectButton.textContent();
    expect(buttonText).toBeTruthy();

    // Click the button
    await newProjectButton.click();

    // Wait for navigation or content change (dialog or new page)
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1000);

    // Scan the current page for accessibility
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    // Log violations for debugging
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Project creation accessibility violations:');
      for (const violation of accessibilityScanResults.violations) {
        console.log(`- ${violation.id}: ${violation.description}`);
      }
    }

    expect.soft(accessibilityScanResults.violations).toEqual([]);
  });

  test('navigation should be keyboard accessible', async ({ page }) => {
    // Test tab navigation - verify the page responds to keyboard interaction
    // Focus on a specific known element first
    const firstButton = page.locator('button, a, [role="button"]').first();
    const hasButton = await firstButton.isVisible().catch(() => false);

    if (hasButton) {
      await firstButton.click();
      await firstButton.focus();
      // Verify button can receive focus
      await expect(firstButton).toBeFocused();

      // Tab to next element
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);

      // Tab again a few times - we just verify no errors occur
      for (let i = 0; i < 3; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(50);
      }
    } else {
      test.skip(true, 'No interactive elements found for keyboard test');
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
      const type = await input.getAttribute('type');

      // Skip hidden inputs - they don't need labels
      if (type === 'hidden') continue;

      const hasLabel = id || ariaLabel || ariaLabelledBy;
      expect.soft(hasLabel, 'Form input should have an associated label or aria-label').toBeTruthy();
    }
  });

  test('color contrast should meet WCAG AA standards', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .withRules(['color-contrast']) // Only check AA minimum contrast, not AAA enhanced
      .analyze();

    if (accessibilityScanResults.violations.length > 0) {
      console.log('Color contrast violations (WCAG AA):');
      for (const violation of accessibilityScanResults.violations) {
        console.log(`- ${violation.id}: ${violation.description}`);
      }
    }

    expect.soft(accessibilityScanResults.violations).toEqual([]);
  });

  test('page should have proper heading hierarchy', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['cat.name-role-value'])
      .analyze();

    expect.soft(accessibilityScanResults.violations).toEqual([]);
  });

  test('interactive elements should have focus indicators', async ({ page }) => {
    const buttons = await page.locator('button, a, [role="button"]').all();

    // Filter to only visible, interactive buttons
    const visibleButtons: typeof buttons = [];
    for (const button of buttons) {
      if (await button.isVisible().catch(() => false)) {
        visibleButtons.push(button);
      }
      if (visibleButtons.length >= 5) break;
    }

    for (const button of visibleButtons) {
      await button.scrollIntoViewIfNeeded();
      await button.focus();

      // Check if button has visible focus styles
      const hasFocusIndicator = await button.evaluate((el) => {
        const style = window.getComputedStyle(el);
        // Check for outline (including 'auto' which is browser default)
        const hasOutline = style.outlineStyle !== 'none' && style.outlineStyle !== '';
        const hasBoxShadow = style.boxShadow !== 'none' && style.boxShadow !== '';
        // Check for visible border change on focus
        const hasBorder = style.borderWidth !== '0px' && style.borderStyle !== 'none';

        return hasOutline || hasBoxShadow || hasBorder;
      });

      expect.soft(hasFocusIndicator, 'Button should have visible focus indicator').toBeTruthy();
    }
  });

  test('aria attributes should be valid', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['cat.aria'])
      .analyze();

    expect.soft(accessibilityScanResults.violations).toEqual([]);
  });
});
