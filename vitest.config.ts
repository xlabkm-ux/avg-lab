import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

/**
 * Root Vitest Configuration for AVG Lab
 *
 * This configuration provides workspace-wide test coverage reporting.
 * Individual packages may override these settings in their own vite.config.ts files.
 *
 * Usage:
 *   pnpm test:coverage          - Run tests with coverage
 *   pnpm test:coverage -- --reporter=html  - Generate HTML report
 */

export default defineConfig({
  test: {
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],

      // Coverage thresholds - these enforce minimum quality standards
      thresholds: {
        global: {
          branches: 70,    // 70% branch coverage
          functions: 75,   // 75% function coverage
          lines: 75,       // 75% line coverage
          statements: 75,  // 75% statement coverage
        },
      },

      // Files to include in coverage
      include: ['packages/*/src/**/*.{ts,tsx}', 'apps/*/src/**/*.{ts,tsx}'],

      // Files to exclude from coverage
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/tests/**',
        '**/__tests__/**',
        '**/__mocks__/**',
        '**/test-results/**',
        '**/playwright-report/**',
        'coverage/**',
        'artifacts/**',
        '.turbo/**',
      ],

      // Output directory for coverage reports
      reportsDirectory: './coverage',

      // Clean coverage directory before each run
      clean: true,

      // Report on uncovered files
      reportOnFailure: true,

      // Generate coverage even if tests fail
      skipFull: false,
    },
  },
});
