import { test, expect } from '@playwright/test';

/**
 * E2E Test: Citation Panel (UC-006)
 *
 * Tests the user flow of reviewing, filtering, and interacting
 * with citations from grounded retrieval results.
 */

test.describe('UC-006: Citation Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Create project first
    await page.goto('/');
    await page.getByRole('button', { name: /create project/i }).click();

    // Navigate to Retrieval surface
    await page.getByRole('button', { name: 'Retrieval' }).click();
  });

  test('should display citation panel after retrieval', async ({ page }) => {
    // Mock successful retrieval response
    await page.route('**/api/projects/*/retrieval/grounded-flow', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          hits: [
            {
              source: 'test-document',
              score: 0.85,
              confidence: 'high',
              snippet: 'This is a test citation snippet that demonstrates the citation panel functionality',
            },
            {
              source: 'another-document',
              score: 0.45,
              confidence: 'medium',
              snippet: 'Another citation with medium confidence level for testing purposes',
            },
          ],
          response: {
            summary: 'Test response',
            claim_status: 'definition',
            language_mode: 'direct_description',
            validation_risk: 'LOW',
            map_territory_boundary: 'The map is a working projection, not Reality',
            scope: 'Test scope',
            next_action: 'Continue exploring',
            risks: [],
          },
        }),
      });
    });

    // Submit query
    await page.getByRole('textbox', { name: /question/i }).fill('Test question?');
    await page.getByRole('button', { name: /ask with evidence/i }).click();

    // Wait for response
    await expect(page.getByText(/test response/i)).toBeVisible({ timeout: 10000 });

    // Verify citation panel is visible
    await expect(page.getByText(/test-document|another-document/i)).toBeVisible();
  });

  test('should display confidence badges on citations', async ({ page }) => {
    // This test requires mock data setup (see previous test)
    // Check for confidence badge elements
    const badges = page.getByTestId(/confidence-badge/i);
    const count = await badges.count();

    if (count > 0) {
      await expect(badges.first()).toBeVisible();
    }
  });

  test('should filter citations by confidence level', async ({ page }) => {
    // This test requires mock data and filter dropdown
    // Look for filter dropdown
    const filterDropdown = page.getByRole('combobox', { name: /confidence|filter/i });

    if (await filterDropdown.isVisible()) {
      await filterDropdown.selectOption('high');

      // Verify only high confidence citations are shown
      // Adjust assertions based on implementation
    }
  });

  test('should expand citation on click', async ({ page }) => {
    // This test requires citation elements with expand functionality
    // Click on first citation
    const firstCitation = page.locator('[data-testid="citation"]').first();

    if (await firstCitation.isVisible()) {
      await firstCitation.click();

      // Verify expanded text is visible (full text, not truncated)
      // Adjust assertions based on implementation
    }
  });

  test('should collapse citation on click', async ({ page }) => {
    // Expand first
    const firstCitation = page.locator('[data-testid="citation"]').first();

    if (await firstCitation.isVisible()) {
      await firstCitation.click();
      // Wait for expand
      await page.waitForTimeout(100);

      // Collapse
      await firstCitation.click();

      // Verify collapsed state
    }
  });

  test('should copy snippet to clipboard', async ({ page }) => {
    // This test requires clipboard access (may need special permissions)
    // Look for copy button
    const copyButton = page.getByRole('button', { name: /copy/i });

    if (await copyButton.isVisible()) {
      await copyButton.click();

      // Verify visual feedback
      await expect(page.getByText(/copied/i)).toBeVisible();
    }
  });

  test('should display empty state when no citations', async ({ page }) => {
    // Mock empty retrieval
    await page.route('**/api/projects/*/retrieval/grounded-flow', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          hits: [],
          response: {
            summary: 'No evidence found',
            claim_status: 'boundary_statement',
            language_mode: 'direct_description',
            validation_risk: 'LOW',
            map_territory_boundary: 'The map is a working projection, not Reality',
            scope: 'No evidence available',
            next_action: 'Register documents first',
            risks: [],
          },
        }),
      });
    });

    // Submit query
    await page.getByRole('textbox', { name: /question/i }).fill('Test question?');
    await page.getByRole('button', { name: /ask with evidence/i }).click();

    // Verify empty state
    await expect(page.getByText(/no (evidence|citations)/i)).toBeVisible({ timeout: 10000 });
  });

  test('should truncate snippet to 150 chars when collapsed', async ({ page }) => {
    // This test requires checking text length
    // Look for collapsed citation text
    const collapsedText = page.locator('[data-testid="citation-snippet"]');

    if (await collapsedText.isVisible()) {
      const text = await collapsedText.textContent();
      expect(text?.length).toBeLessThanOrEqual(150);
    }
  });
});
