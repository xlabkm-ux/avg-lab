import { test, expect } from '@playwright/test';

/**
 * E2E Test: Grounded Retrieval (UC-003)
 *
 * Tests the user flow of submitting queries via grounded retrieval
 * and viewing evidence-backed answers with citations.
 */

test.describe('UC-003: Grounded Retrieval', () => {
  test.beforeEach(async ({ page }) => {
    // Create project first
    await page.goto('/');
    await page.getByRole('button', { name: /create project/i }).click();

    // Navigate to Retrieval surface
    await page.getByRole('button', { name: 'Retrieval' }).click();
  });

  test('should display retrieval interface', async ({ page }) => {
    // Verify retrieval interface is visible
    await expect(page.getByRole('textbox', { name: /question/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /ask with evidence/i })).toBeVisible();
  });

  test('should enable submit button when text is entered', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /ask with evidence/i });
    const textArea = page.getByRole('textbox', { name: /question/i });

    // Submit button should be disabled initially
    await expect(submitButton).toBeDisabled();

    // Enter text
    await textArea.fill('How does memory work?');

    // Submit button should be enabled
    await expect(submitButton).toBeEnabled();
  });

  test('should prevent empty submission', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /ask with evidence/i });

    // Submit button should be disabled with empty text
    await expect(submitButton).toBeDisabled();
  });

  test('should show loading state during query', async ({ page }) => {
    const textArea = page.getByRole('textbox', { name: /question/i });
    const submitButton = page.getByRole('button', { name: /ask with evidence/i });

    // Enter text
    await textArea.fill('How does memory work?');

    // Submit
    await submitButton.click();

    // Verify loading state (may transition quickly)
    // Check for loading indicator or disabled button
    await expect(submitButton).toBeDisabled();
  });

  test('should handle API error gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/projects/*/retrieval/grounded-flow', async (route) => {
      await route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    const textArea = page.getByRole('textbox', { name: /question/i });
    const submitButton = page.getByRole('button', { name: /ask with evidence/i });

    // Enter text and submit
    await textArea.fill('How does memory work?');
    await submitButton.click();

    // Verify error state
    await expect(page.getByText(/failed|error/i)).toBeVisible({ timeout: 10000 });
  });
});
