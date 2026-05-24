import { test, expect } from '@playwright/test';

/**
 * E2E Tests: User-Model Interaction (UC-007)
 *
 * Tests the complete user-model interaction flow including:
 * - User input submission
 * - Model response rendering
 * - Schema validation feedback
 * - Claim status display
 * - Citation and grounding presentation
 * - Risk indicator display
 * - Map-territory boundary preservation
 */

test.describe('UC-007: User-Model Interaction', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home and create a test project
    await page.goto('/');
    await page.getByRole('button', { name: /create project/i }).click();

    // Wait for project creation to complete
    await page.waitForLoadState('networkidle');
  });

  test('should submit user query and receive model response', async ({ page }) => {
    // Mock successful model response
    await page.route('**/api/projects/*/dialogue/page', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: generateMockDialoguePage({
          summary: 'Memory consolidation involves hippocampal-cortical interactions',
          scope: 'cognitive neuroscience research',
          claim_status: 'working_distinction',
          language_mode: 'operational_description',
          validation_risk: 'medium',
          risk_markers: ['requires_empirical_support'],
          map_territory_boundary: 'preserved',
          next_action: 'validate against evidence'
        })
      });
    });

    // Enter query
    const queryInput = page.getByTestId('query-input');
    await expect(queryInput).toBeVisible();
    await queryInput.fill('How does memory consolidation work?');

    // Submit query
    await page.getByTestId('submit-query-btn').click();

    // Wait for response to render
    await page.waitForSelector('[data-page="dialogue-flow-page"]', { timeout: 10000 });

    // Verify response is rendered
    const responsePanel = page.getByTestId('grounded-response-details-panel');
    await expect(responsePanel).toBeVisible();
  });

  test('should display claim status indicators', async ({ page }) => {
    // Mock response with different claim statuses
    const claimStatuses = ['hypothesis', 'metaphor_only', 'boundary_statement', 'definition'];

    for (const status of claimStatuses) {
      await page.route('**/api/projects/*/dialogue/page', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: generateMockDialoguePage({
            summary: `Response with ${status}`,
            scope: 'testing',
            claim_status: status,
            language_mode: 'operational_description',
            validation_risk: 'low',
            risk_markers: [],
            map_territory_boundary: 'preserved',
            next_action: 'continue'
          })
        });
      });

      const queryInput = page.getByTestId('query-input');
      await queryInput.fill(`Test ${status}`);
      await page.getByTestId('submit-query-btn').click();

      await page.waitForSelector('[data-page="dialogue-flow-page"]', { timeout: 10000 });

      // Verify claim status is displayed
      await expect(page.getByTestId('claim-status')).toBeVisible();
    }
  });

  test('should display validation risk indicators', async ({ page }) => {
    const riskLevels = ['low', 'medium', 'high', 'critical'];

    for (const risk of riskLevels) {
      await page.route('**/api/projects/*/dialogue/page', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: generateMockDialoguePage({
            summary: `Response with ${risk} risk`,
            scope: 'testing',
            claim_status: 'boundary_statement',
            language_mode: 'operational_description',
            validation_risk: risk,
            risk_markers: risk === 'critical' ? ['critical_risk'] : ['standard'],
            map_territory_boundary: 'preserved',
            next_action: 'review'
          })
        });
      });

      const queryInput = page.getByTestId('query-input');
      await queryInput.fill(`Test ${risk} risk`);
      await page.getByTestId('submit-query-btn').click();

      await page.waitForSelector('[data-page="dialogue-flow-page"]', { timeout: 10000 });

      // Verify risk indicator is displayed
      await expect(page.getByTestId('validation-risk')).toBeVisible();
    }
  });

  test('should display citations and evidence panel', async ({ page }) => {
    // Mock response with citations
    await page.route('**/api/projects/*/dialogue/page', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: generateMockDialoguePageWithCitations({
          summary: 'Grounded response with evidence',
          scope: 'evidence-based response',
          claim_status: 'working_distinction',
          language_mode: 'operational_description',
          validation_risk: 'low',
          risk_markers: ['retrieval_grounded'],
          map_territory_boundary: 'preserved',
          next_action: 'review citations'
        })
      });
    });

    const queryInput = page.getByTestId('query-input');
    await queryInput.fill('Show me the evidence');
    await page.getByTestId('submit-query-btn').click();

    await page.waitForSelector('[data-page="dialogue-flow-page"]', { timeout: 10000 });

    // Verify citations panel is visible
    const citationsPanel = page.getByTestId('citations-panel');
    await expect(citationsPanel).toBeVisible();

    // Verify citation details
    await expect(page.getByTestId('citation-id')).toBeVisible();
    await expect(page.getByTestId('confidence-level')).toBeVisible();
  });

  test('should handle model error gracefully', async ({ page }) => {
    // Mock model API failure
    await page.route('**/api/projects/*/dialogue/page', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'error',
          code: 'MODEL_ERROR',
          message: 'Model interaction failed. Please try again.'
        })
      });
    });

    const queryInput = page.getByTestId('query-input');
    await queryInput.fill('This should fail');
    await page.getByTestId('submit-query-btn').click();

    // Wait for error state
    await page.waitForTimeout(1000);

    // Verify error state is displayed
    const hasErrorState = await page.evaluate(() => {
      return (
        document.querySelector('[data-error="true"]') !== null ||
        document.querySelector('[data-state="error"]') !== null ||
        document.querySelector('.error') !== null
      );
    });

    expect(hasErrorState).toBeTruthy();
  });

  test('should display loading state during model processing', async ({ page }) => {
    // Mock API with delay to capture loading state
    await page.route('**/api/projects/*/dialogue/page', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: generateMockDialoguePage({
          summary: 'Delayed response',
          scope: 'testing',
          claim_status: 'boundary_statement',
          language_mode: 'operational_description',
          validation_risk: 'low',
          risk_markers: [],
          map_territory_boundary: 'preserved',
          next_action: 'continue'
        })
      });
    });

    const queryInput = page.getByTestId('query-input');
    await queryInput.fill('Test loading state');
    await page.getByTestId('submit-query-btn').click();

    // Wait briefly for loading state to appear
    await page.waitForTimeout(300);

    // Check for loading indicators
    const isLoadingVisible = await page.evaluate(() => {
      return (
        document.querySelector('[data-loading="true"]') !== null ||
        document.querySelector('[aria-busy="true"]') !== null ||
        document.querySelector('.loading') !== null ||
        document.querySelector('.spinner') !== null ||
        document.querySelector('[data-state="loading"]') !== null
      );
    });

    expect(isLoadingVisible).toBeTruthy();
  });

  test('should prevent empty submission', async ({ page }) => {
    const submitButton = page.getByTestId('submit-query-btn');

    // Submit button should be disabled with empty input
    await expect(submitButton).toBeDisabled();
  });

  test('should enable submit button when text is entered', async ({ page }) => {
    const submitButton = page.getByTestId('submit-query-btn');
    const queryInput = page.getByTestId('query-input');

    await expect(submitButton).toBeDisabled();

    await queryInput.fill('Test query');
    await expect(submitButton).toBeEnabled();
  });

  test('should display map-territory boundary indicator', async ({ page }) => {
    await page.route('**/api/projects/*/dialogue/page', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: generateMockDialoguePage({
          summary: 'Response preserving map-territory boundary',
          scope: 'boundary testing',
          claim_status: 'boundary_statement',
          language_mode: 'operational_description',
          validation_risk: 'low',
          risk_markers: ['map_territory_boundary_preserved'],
          map_territory_boundary: 'preserved',
          next_action: 'continue'
        })
      });
    });

    const queryInput = page.getByTestId('query-input');
    await queryInput.fill('Test boundary');
    await page.getByTestId('submit-query-btn').click();

    await page.waitForSelector('[data-page="dialogue-flow-page"]', { timeout: 10000 });

    // Verify boundary indicator is displayed
    await expect(page.getByTestId('map-territory-boundary')).toBeVisible();
  });

  test('should handle metaphor-only claims with appropriate warnings', async ({ page }) => {
    await page.route('**/api/projects/*/dialogue/page', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: generateMockDialoguePage({
          summary: 'The mind is like a computer processing information',
          scope: 'metaphor exploration',
          claim_status: 'metaphor_only',
          language_mode: 'metaphor',
          validation_risk: 'medium',
          risk_markers: ['metaphor_as_literal_warning'],
          map_territory_boundary: 'preserved',
          next_action: 'distinguish metaphor from mechanism'
        })
      });
    });

    const queryInput = page.getByTestId('query-input');
    await queryInput.fill('Use a metaphor');
    await page.getByTestId('submit-query-btn').click();

    await page.waitForSelector('[data-page="dialogue-flow-page"]', { timeout: 10000 });

    // Verify metaphor warning is displayed
    const hasMetaphorWarning = await page.evaluate(() => {
      const text = document.body.innerText;
      return (
        text.includes('metaphor') ||
        document.querySelector('[data-claim-status="metaphor_only"]') !== null
      );
    });

    expect(hasMetaphorWarning).toBeTruthy();
  });

  test('should display language mode indicator', async ({ page }) => {
    const modes = ['direct_description', 'operational_description', 'metaphor'];

    for (const mode of modes) {
      await page.route('**/api/projects/*/dialogue/page', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: generateMockDialoguePage({
            summary: `Response in ${mode} mode`,
            scope: 'testing',
            claim_status: 'boundary_statement',
            language_mode: mode,
            validation_risk: 'low',
            risk_markers: [],
            map_territory_boundary: 'preserved',
            next_action: 'continue'
          })
        });
      });

      const queryInput = page.getByTestId('query-input');
      await queryInput.fill(`Test ${mode}`);
      await page.getByTestId('submit-query-btn').click();

      await page.waitForSelector('[data-page="dialogue-flow-page"]', { timeout: 10000 });

      // Verify language mode is displayed
      await expect(page.getByTestId('language-mode')).toBeVisible();
    }
  });

  test('should handle multiple consecutive queries', async ({ page }) => {
    // Mock sequential responses
    let callCount = 0;
    await page.route('**/api/projects/*/dialogue/page', async (route) => {
      callCount++;
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: generateMockDialoguePage({
          summary: `Response to query ${callCount}`,
          scope: 'multi-query test',
          claim_status: 'boundary_statement',
          language_mode: 'operational_description',
          validation_risk: 'low',
          risk_markers: [],
          map_territory_boundary: 'preserved',
          next_action: 'continue'
        })
      });
    });

    const queryInput = page.getByTestId('query-input');
    const submitButton = page.getByTestId('submit-query-btn');

    // Submit multiple queries
    for (let i = 1; i <= 3; i++) {
      await queryInput.fill(`Query ${i}`);
      await submitButton.click();
      await page.waitForSelector('[data-page="dialogue-flow-page"]', { timeout: 10000 });
      await expect(page.getByTestId('grounded-response-details-panel')).toBeVisible();
    }

    expect(callCount).toBe(3);
  });

  test('should display response scope', async ({ page }) => {
    await page.route('**/api/projects/*/dialogue/page', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: generateMockDialoguePage({
          summary: 'Scoped response',
          scope: 'This response applies only to the specified context',
          claim_status: 'boundary_statement',
          language_mode: 'operational_description',
          validation_risk: 'low',
          risk_markers: ['scope_explicit'],
          map_territory_boundary: 'preserved',
          next_action: 'review scope'
        })
      });
    });

    const queryInput = page.getByTestId('query-input');
    await queryInput.fill('Test scope display');
    await page.getByTestId('submit-query-btn').click();

    await page.waitForSelector('[data-page="dialogue-flow-page"]', { timeout: 10000 });

    // Verify scope is displayed
    await expect(page.getByTestId('response-scope')).toBeVisible();
  });
});

/**
 * Helper: Generate mock dialogue page HTML
 */
function generateMockDialoguePage(response: {
  summary: string;
  scope: string;
  claim_status: string;
  language_mode: string;
  validation_risk: string;
  risk_markers: string[];
  map_territory_boundary: string;
  next_action: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><title>AVG Dialogue</title></head>
    <body>
      <div data-page="dialogue-flow-page">
        <div data-panel="grounded-response-details-panel">
          <h2>${response.summary}</h2>
          <div data-testid="claim-status" data-claim-status="${response.claim_status}">${response.claim_status}</div>
          <div data-testid="language-mode" data-language-mode="${response.language_mode}">${response.language_mode}</div>
          <div data-testid="validation-risk" data-validation-risk="${response.validation_risk}">${response.validation_risk}</div>
          <div data-testid="response-scope">${response.scope}</div>
          <div data-testid="map-territory-boundary" data-boundary="${response.map_territory_boundary}">${response.map_territory_boundary}</div>
          <div data-risk-markers="${response.risk_markers.join(',')}">${response.risk_markers.join(', ')}</div>
          <div data-next-action>${response.next_action}</div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Helper: Generate mock dialogue page with citations
 */
function generateMockDialoguePageWithCitations(response: {
  summary: string;
  scope: string;
  claim_status: string;
  language_mode: string;
  validation_risk: string;
  risk_markers: string[];
  map_territory_boundary: string;
  next_action: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><title>AVG Dialogue</title></head>
    <body>
      <div data-page="dialogue-flow-page">
        <div data-panel="grounded-response-details-panel">
          <h2>${response.summary}</h2>
          <div data-testid="claim-status" data-claim-status="${response.claim_status}">${response.claim_status}</div>
          <div data-testid="language-mode" data-language-mode="${response.language_mode}">${response.language_mode}</div>
          <div data-testid="validation-risk" data-validation-risk="${response.validation_risk}">${response.validation_risk}</div>
          <div data-testid="response-scope">${response.scope}</div>
          <div data-testid="map-territory-boundary" data-boundary="${response.map_territory_boundary}">${response.map_territory_boundary}</div>
        </div>
        <div data-testid="citations-panel">
          <h3>Citations</h3>
          <div data-citation>
            <span data-testid="citation-id">cit_001</span>
            <span data-testid="confidence-level" data-confidence="high">high</span>
            <p>Quoted evidence from registered document</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
