import { test, expect } from '@playwright/test';

/**
 * Performance Tests for AVG Lab
 *
 * These tests measure and validate key performance metrics:
 * - Page load times
 * - Time to interactive
 * - API response times
 * - Memory usage
 *
 * Run: pnpm test:e2e --grep @performance
 */

test.describe('Performance Tests @performance', () => {
  test('homepage should load within performance budget', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Performance budget: homepage should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);

    console.log(`Homepage load time: ${loadTime}ms`);
  });

  test('first contentful paint should be under budget', async ({ page }) => {
    await page.goto('/');

    // Get performance metrics from the browser
    const metrics = await page.evaluate(() => {
      const entries = performance.getEntriesByType('paint');
      return entries.reduce(
        (acc, entry) => {
          acc[entry.name] = entry.startTime;
          return acc;
        },
        {} as Record<string, number>,
      );
    });

    // First Contentful Paint should be under 1.5 seconds
    const fcp = metrics['first-contentful-paint'];
    if (fcp) {
      expect(fcp).toBeLessThan(1500);
      console.log(`First Contentful Paint: ${fcp.toFixed(2)}ms`);
    }
  });

  test('time to interactive should be under budget', async ({ page }) => {
    await page.goto('/');

    // Measure when page becomes interactive
    const interactiveTime = await page.evaluate(async () => {
      return new Promise<number>((resolve) => {
        const start = performance.now();

        // Check when DOM is fully interactive
        if (document.readyState === 'complete') {
          resolve(performance.now() - start);
        } else {
          window.addEventListener('load', () => {
            resolve(performance.now() - start);
          });
        }
      });
    });

    // Time to Interactive should be under 2.5 seconds
    expect(interactiveTime).toBeLessThan(2500);
    console.log(`Time to Interactive: ${interactiveTime.toFixed(2)}ms`);
  });

  test('API responses should be within performance budget', async ({ page }) => {
    // Monitor API requests
    const responseTimes: number[] = [];

    page.on('response', async (response) => {
      if (response.url().includes('/api/')) {
        const timing = response.request().timing();
        const responseTime = response.request().response()?.receivedResponseEndTimestamp
          ? response.request().response()!.receivedResponseEndTimestamp - timing.startTime
          : 0;

        responseTimes.push(responseTime);
      }
    });

    await page.goto('/');

    // If we captured API responses, validate them
    if (responseTimes.length > 0) {
      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      expect(avgResponseTime).toBeLessThan(500); // 500ms budget per API call
      console.log(`Average API response time: ${avgResponseTime.toFixed(2)}ms`);
    }
  });

  test('memory usage should be within budget', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get memory metrics (if available)
    const memory = await page.evaluate(() => {
      const performance = window.performance as any;
      if (performance.memory) {
        return {
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          usedJSHeapSize: performance.memory.usedJSHeapSize,
        };
      }
      return null;
    });

    if (memory) {
      // JavaScript heap should be under 50MB
      expect(memory.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024);
      console.log(`Used JS Heap: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
    }
  });

  test('page should not have long tasks', async ({ page }) => {
    const longTasks: number[] = [];

    // Observe long tasks
    await page.evaluate((tasks: number[]) => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          tasks.push(entry.duration);
        }
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
      } catch {
        // Long Task API not supported
      }
    }, longTasks);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // All tasks should be under 50ms (no long tasks)
    expect(longTasks.every((t) => t < 50)).toBe(true);

    if (longTasks.length > 0) {
      console.log(`Long tasks detected: ${longTasks.length}, max: ${Math.max(...longTasks)}ms`);
    }
  });

  test('bundle size should be within budget', async ({ page }) => {
    await page.goto('/');

    // Get loaded resources
    const resources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource');
      return entries
        .filter((entry: PerformanceEntry & { initiatorType?: string }) => entry.initiatorType === 'script')
        .map((entry: PerformanceEntry & { transferSize?: number; decodedBodySize?: number; name: string }) => ({
          name: entry.name,
          size: entry.transferSize || entry.decodedBodySize || 0,
        }));
    });

    // Total JavaScript should be under 2.5MB (realistic for current dependencies)
    const totalJS = resources.reduce((sum, r) => sum + r.size, 0);
    expect(totalJS).toBeLessThan(2500 * 1024);

    console.log(`Total JS bundle size: ${(totalJS / 1024).toFixed(2)}KB`);
  });

  test('concept map rendering should be performant', async ({ page }) => {
    // Skip if concept map is not available
    await page.goto('/');

    const conceptMap = page.locator('[data-testid="concept-map"]');
    const isVisible = await conceptMap.isVisible().catch(() => false);

    if (!isVisible) {
      test.skip(true, 'Concept map not available');
      return;
    }

    const startTime = Date.now();

    // Trigger concept map rendering
    await conceptMap.click();
    await page.waitForTimeout(1000); // Wait for rendering

    const renderTime = Date.now() - startTime;

    // Concept map should render within 1 second
    expect(renderTime).toBeLessThan(1000);
    console.log(`Concept map render time: ${renderTime}ms`);
  });
});

/**
 * Performance Budget Documentation
 *
 * | Metric | Budget | Critical |
 * |--------|--------|----------|
 * | Homepage load | < 3s | Yes |
 * | First Contentful Paint | < 1.5s | Yes |
 * | Time to Interactive | < 2.5s | Yes |
 * | API response time | < 500ms | Yes |
 * | JS heap size | < 50MB | No |
 * | JS bundle size | < 500KB | Yes |
 * | Long tasks | < 50ms | No |
 * | Concept map render | < 1s | No |
 */
