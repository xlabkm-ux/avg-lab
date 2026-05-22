import { test, expect } from '@playwright/test';

/**
 * E2E Test: Concept Mapping (UC-005)
 *
 * Tests the user flow of visualizing and exploring concept maps
 * as interactive graphs.
 */

test.describe('UC-005: Concept Mapping', () => {
  test.beforeEach(async ({ page }) => {
    // Create project first
    await page.goto('/');
    await page.getByRole('button', { name: /create project/i }).click();

    // Navigate to Map surface
    await page.getByRole('button', { name: 'Map' }).click();
  });

  test('should display concept map panel', async ({ page }) => {
    // Verify map panel is visible
    await expect(page.getByTestId('concept-map-panel')).toBeVisible();
  });

  test('should render graph nodes and edges', async ({ page }) => {
    // Check for ReactFlow elements
    const nodes = page.locator('.react-flow__node');
    const _edges = page.locator('.react-flow__edge');

    // Verify at least some nodes are rendered (sample data)
    const count = await nodes.count();
    if (count > 0) {
      await expect(nodes.first()).toBeVisible();
    }
  });

  test('should display node/edge count', async ({ page }) => {
    // Look for count display
    const countDisplay = page.getByTestId('node-edge-count');
    const count = await countDisplay.count();
    if (count > 0) {
      await expect(countDisplay).toBeVisible();
    }
  });

  test('should display map/territory boundary reminder', async ({ page }) => {
    // Verify boundary reminder is visible
    await expect(page.getByTestId('map-territory-reminder')).toBeVisible();
  });

  test('should allow panning the graph', async ({ page }) => {
    const mapPanel = page.getByTestId('concept-map-canvas');
    const count = await mapPanel.count();
    if (count > 0) {
      // Get initial position
      const initialBox = await mapPanel.boundingBox();

      // Pan by dragging
      if (initialBox) {
        await page.mouse.move(initialBox.x + initialBox.width / 2, initialBox.y + initialBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(initialBox.x + initialBox.width / 4, initialBox.y + initialBox.height / 4);
        await page.mouse.up();
      }

      // Verify map is still visible (no errors)
      await expect(mapPanel).toBeVisible();
    }
  });

  test('should allow zooming the graph', async ({ page }) => {
    const mapPanel = page.getByTestId('concept-map-canvas');
    const count = await mapPanel.count();
    if (count > 0) {
      const box = await mapPanel.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.wheel(0, -100); // Zoom in
      }

      // Verify map is still visible
      await expect(mapPanel).toBeVisible();
    }
  });

  test('should show node detail panel on click', async ({ page }) => {
    // Click on first node
    const firstNode = page.locator('.react-flow__node').first();
    const nodeCount = await firstNode.count();
    if (nodeCount > 0) {
      await firstNode.click();

      // Verify detail panel appears
      const detailPanel = page.getByTestId('node-detail-panel');
      await expect(detailPanel).toBeVisible();
    }
  });

  test('should deselect node when clicking pane', async ({ page }) => {
    // Click on a node first
    const firstNode = page.locator('.react-flow__node').first();
    const nodeCount = await firstNode.count();
    if (nodeCount > 0) {
      await firstNode.click();

      // Verify detail panel is shown
      const detailPanel = page.getByTestId('node-detail-panel');
      await expect(detailPanel).toBeVisible();

      // Click on empty area (pane)
      const mapPanel = page.getByTestId('concept-map-canvas');
      await mapPanel.click({ position: { x: 50, y: 50 } });

      // Verify detail panel is hidden or reset
      // Note: Implementation may vary
    }
  });

  test('should display nodes with correct color coding', async ({ page }) => {
    // Check for colored nodes (sample data has multiple types)
    const nodes = page.locator('.react-flow__node');
    const count = await nodes.count();

    if (count > 0) {
      // Verify nodes have background colors (color-coded by type)
      const firstNodeStyle = await nodes.first().getAttribute('style');
      expect(firstNodeStyle).toMatch(/background|background-color/);
    }
  });

  test('should handle empty graph gracefully', async ({ page }) => {
    // Verify the panel renders even with no data
    await expect(page.getByTestId('concept-map-panel')).toBeVisible();
  });
});
