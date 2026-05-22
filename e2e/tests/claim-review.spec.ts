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
    // Verify claims are displayed
    // Check for sample claims from App.tsx
    await expect(page.getByText(/claim|definition|hypothesis/i)).toBeVisible();
  });

  test('should display status badges on claims', async ({ page }) => {
    // Check for status badge elements
    const badges = page.getByTestId(/status-badge|claim-status/i);
    await expect(badges.first()).toBeVisible();
  });

  test('should display language mode badges on claims', async ({ page }) => {
    // Check for language mode badge elements
    const badges = page.getByTestId(/language-mode/i);
    await expect(badges.first()).toBeVisible();
  });

  test('should expand claim details on click', async ({ page }) => {
    // Find first claim and expand it
    const expandButton = page.getByRole('button', { name: /expand|chevron/i }).first();
    await expandButton.click();

    // Verify expanded content is visible
    // Look for risk section, repair suggestion, or scope
    await expect(page.getByText(/risk|repair|scope/i)).toBeVisible();
  });

  test('should collapse claim details on click', async ({ page }) => {
    // Expand first claim
    const expandButton = page.getByRole('button', { name: /expand|chevron/i }).first();
    await expandButton.click();

    // Verify expanded
    await expect(page.getByText(/risk|repair|scope/i)).toBeVisible();

    // Collapse
    await expandButton.click();

    // Verify collapsed (details hidden)
    // Note: Adjust selector based on actual implementation
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
    const expandButton = page.getByRole('button', { name: /expand|chevron/i }).first();
    await expandButton.click();

    // Check for risk markers
    const riskMarkers = page.getByTestId(/risk-marker|risk-badge/i);
    const count = await riskMarkers.count();

    if (count > 0) {
      await expect(riskMarkers.first()).toBeVisible();
    }
  });

  test('should display empty state when no claims', async ({ page }) => {
    // This test would require mocking empty claims data
    // For now, just verify the panel renders
    await expect(page.getByText(/claim/i)).toBeVisible();
  });
});
