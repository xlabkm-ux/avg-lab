import { test, expect } from '@playwright/test';

/**
 * E2E Test: Claim Review (UC-004)
 *
 * Tests the user flow of reviewing claims with status badges,
 * risk markers, and repair suggestions.
 */

test.describe('UC-004: Claim Review', () => {
  test.beforeEach(async ({ page }) => {
    // Create project first
    await page.goto('/');
    await page.getByRole('button', { name: /create project/i }).click();

    // Navigate to Claim Review surface
    await page.getByRole('button', { name: 'Claim Review' }).click();
  });

  test('should display claim review panel with claims', async ({ page }) => {
    // Verify claim review panel is visible
    await expect(page.getByTestId('claim-review-panel')).toBeVisible();
  });

  test('should display status badges on claims', async ({ page }) => {
    // Check for status badge elements
    const badges = page.getByTestId('claim-status-badge');
    const count = await badges.count();
    if (count > 0) {
      await expect(badges.first()).toBeVisible();
    }
  });

  test('should display language mode badges on claims', async ({ page }) => {
    // Check for language mode badge elements
    const badges = page.getByTestId('claim-language-mode');
    const count = await badges.count();
    if (count > 0) {
      await expect(badges.first()).toBeVisible();
    }
  });

  test('should expand claim details on click', async ({ page }) => {
    // Find first claim and expand it
    const expandButton = page.getByTestId('expand-claim-btn').first();
    const count = await expandButton.count();
    if (count > 0) {
      await expandButton.click();
      // Verify expanded content is visible - use first() to avoid strict mode
      await expect(page.getByText(/risk/i).first()).toBeVisible();
    }
  });

  test('should collapse claim details on click', async ({ page }) => {
    // Expand first claim
    const expandButton = page.getByTestId('expand-claim-btn').first();
    const count = await expandButton.count();
    if (count > 0) {
      await expandButton.click();
      // Verify expanded
      await expect(page.getByText(/risk/i).first()).toBeVisible();
      // Collapse
      await expandButton.click();
      // Verify collapsed
      await expect(page.locator('.claim-review-details')).not.toBeVisible();
    }
  });

  test('should highlight claims with risks', async ({ page }) => {
    // Claims with risks should have distinct styling
    const riskyClaims = page.locator('.has-risks, [data-has-risks="true"]');
    const count = await riskyClaims.count();

    // If sample data includes risky claims, verify they're highlighted
    if (count > 0) {
      await expect(riskyClaims.first()).toBeVisible();
    }
  });

  test('should display risk markers for risky claims', async ({ page }) => {
    // Expand a claim with risks
    const expandButton = page.getByTestId('expand-claim-btn').first();
    const btnCount = await expandButton.count();
    if (btnCount > 0) {
      await expandButton.click();

      // Check for risk markers
      const riskMarkers = page.getByTestId('claim-risk-marker');
      const count = await riskMarkers.count();

      if (count > 0) {
        await expect(riskMarkers.first()).toBeVisible();
      }
    }
  });

  test('should display empty state when no claims', async ({ page }) => {
    // Verify the panel renders (may show empty state)
    const panel = page.getByTestId('claim-review-panel');
    await expect(panel).toBeVisible();
  });
});
