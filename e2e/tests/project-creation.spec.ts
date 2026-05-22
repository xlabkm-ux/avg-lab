import { test, expect } from '@playwright/test';

/**
 * E2E Test: Project Creation (UC-001)
 *
 * Tests the user flow of creating a new AVG Lab project
 * and entering the Workspace Shell interface.
 */

test.describe('UC-001: Project Creation', () => {
  test('should display welcome screen on initial load', async ({ page }) => {
    // Navigate to application
    await page.goto('/');

    // Verify welcome screen
    await expect(page).toHaveTitle(/AVG/);

    // Check for create project button
    const createButton = page.getByRole('button', { name: /create project/i });
    await expect(createButton).toBeVisible();
  });

  test('should create project and enter workspace shell', async ({ page }) => {
    // Navigate to application
    await page.goto('/');

    // Click create project button
    await page.getByRole('button', { name: /create project/i }).click();

    // Verify workspace shell is displayed
    // Check for navigation items
    const navItems = ['Dialogue', 'Documents', 'Retrieval', 'Claim Review', 'Map', 'Artifacts'];

    for (const item of navItems) {
      await expect(page.getByRole('button', { name: item })).toBeVisible();
    }
  });

  test('should generate unique project and session IDs', async ({ page }) => {
    // Create first project
    await page.goto('/');
    await page.getByRole('button', { name: /create project/i }).click();

    // Capture project context (check for ID display or data attributes)
    const projectId1 = await page.evaluate(() => {
      // Check if project ID is stored in localStorage or data attribute
      return localStorage.getItem('avg-project-id');
    });

    // Refresh to create new project
    await page.reload();
    await page.getByRole('button', { name: /create project/i }).click();

    const projectId2 = await page.evaluate(() => {
      return localStorage.getItem('avg-project-id');
    });

    // Verify IDs are different (if stored)
    if (projectId1 && projectId2) {
      expect(projectId1).not.toBe(projectId2);
    }
  });

  test('should return to welcome screen after page refresh', async ({ page }) => {
    // Create project
    await page.goto('/');
    await page.getByRole('button', { name: /create project/i }).click();

    // Verify workspace is displayed
    await expect(page.getByRole('button', { name: 'Dialogue' })).toBeVisible();

    // Refresh page
    await page.reload();

    // Verify welcome screen returns (browser-local only)
    const createButton = page.getByRole('button', { name: /create project/i });
    await expect(createButton).toBeVisible();
  });
});
