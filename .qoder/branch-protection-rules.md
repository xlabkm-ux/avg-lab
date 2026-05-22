# Branch Protection Rules

This document defines the branch protection rules for the AVG Lab repository. These rules ensure code quality and prevent accidental changes to critical branches.

## Protected Branches

### `main` Branch

The `main` branch is the primary production branch and MUST be protected with the following rules:

#### Required Status Checks

All of the following checks MUST pass before merging:

1. **Code Quality**
   - `pnpm lint` - ESLint TypeScript linting
   - `pnpm format` - Prettier formatting check

2. **Type Safety**
   - `pnpm typecheck` - TypeScript type checking

3. **Schema Validation**
   - `pnpm validate:schemas` - JSON schema validation

4. **Testing**
   - `pnpm test` - Unit tests (Vitest)
   - `pnpm test:contract` - Contract tests
   - `pnpm test:integration` - Integration tests
   - `pnpm test:security` - Security tests

5. **AI Evaluation**
   - `pnpm test:ai` - AI behavior tests
   - `pnpm test:claim-safety` - Claim safety evals
   - `pnpm test:no-fairy-tale` - No fairy tale evals
   - `pnpm test:prompt-regression` - Prompt regression tests

6. **Visual & Accessibility** (when implemented)
   - `pnpm test:visual` - Visual regression tests
   - `pnpm test:a11y` - Accessibility tests (axe-core)

7. **Build**
   - `pnpm build` - Production build

#### Pull Request Requirements

- **Minimum approvals**: 1 reviewer approval required
- **Dismiss stale approvals**: Enabled (new commits invalidate previous approvals)
- **Require conversation resolution**: Enabled (resolve all review comments before merge)
- **Restrict pushes**: Only authorized maintainers can push directly

#### Additional Rules

- **No force pushes**: Force pushes to `main` are prohibited
- **No deletions**: The `main` branch cannot be deleted
- **Linear history**: Require squash merge to maintain clean history
- **Signed commits**: Recommended but not required

## How to Configure Branch Protection

### GitHub UI Setup

1. Go to **Settings** → **Branches** → **Branch protection rules**
2. Click **Add rule**
3. Branch name pattern: `main`
4. Enable the following options:
   - [x] Require a pull request before merging
   - [x] Require approvals (1)
   - [x] Dismiss stale pull request approvals when new commits are pushed
   - [x] Require review from Code Owners
   - [x] Require status checks to pass before merging
   - [x] Require branches to be up to date before merging
   - [x] Require conversation resolution before merging
   - [x] Include administrators
   - [x] Restrict pushes that match file paths
   - [x] Allow force pushes (NO)
   - [x] Allow deletions (NO)

### Required Status Checks

Select the following checks in the "Status checks that are required" section:

```
- lint
- typecheck
- validate-schemas
- test
- test-contract
- test-integration
- test-security
- test-ai
- test-claim-safety
- test-no-fairy-tale
- test-prompt-regression
- build
```

## Critical Paths Protection

Certain files require additional protection:

### Schema Files

Files matching `packages/avg-schemas/**` require:
- Approval from schema owners
- Contract tests must pass
- No breaking changes without migration

### Security Files

Files matching `packages/avg-security/**` or `.github/workflows/**` require:
- Approval from security team
- All security tests must pass

### Prompt/Agent Files

Files matching `packages/avg-agents/**` or `**/prompts/**` require:
- AI evals must pass
- No regression in AI behavior

### Database Migrations

Files matching `**/migrations/**` require:
- Migration tested locally
- Rollback plan documented

## Enforcement

- Auto-merge requires at least 1 approval (configured in `.github/workflows/auto-merge.yml`)
- CI pipeline enforces all quality gates (configured in `.github/workflows/ci.yml`)
- Branch protection rules should be configured in repository settings
- Violations should be reported to the team lead

## Exceptions

Emergency hotfixes may bypass these rules with:
1. Explicit approval from 2 maintainers
2. Documented justification
3. Post-merge audit within 24 hours

## Review

Branch protection rules should be reviewed:
- When new quality gates are added
- When CI pipeline changes
- Quarterly as part of security audit
