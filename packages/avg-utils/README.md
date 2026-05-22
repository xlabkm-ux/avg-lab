# @avg/utils

Shared utility functions for AVG Codex Lab.

## Purpose

This package eliminates code duplication across the monorepo by providing common pure functions used throughout the project.

## Installation

This is a workspace package. Use it via:

```typescript
import { normalizeText, dedupe } from '@avg/utils';
```

## Available Utilities

### Text Processing
- `normalizeText(value)` - Trim and lowercase
- `truncate(text, maxLength, suffix)` - Truncate with ellipsis
- `collectStrongWordMarkers(text)` - Detect strong/absolute words
- `collectStrongWordHits(text)` - Find strong word occurrences with positions
- `hasUncertaintyMarkers(text)` - Check for epistemic humility markers

### Array Operations
- `dedupe(values)` - Remove duplicates while preserving order

### Comparison
- `deepEqual(a, b)` - Deep equality check (JSON-based)

### Utilities
- `generateId(prefix)` - Generate unique IDs
- `sleep(ms)` - Async delay
- `clamp(value, min, max)` - Clamp number to range
- `formatPercentage(value, decimals)` - Format as percentage

## Ownership

See `.codex/agent-registry.md`.

## Required Quality

- TypeScript strict mode.
- Unit tests for all pure functions.
- No side effects in utilities.
- JSDoc comments for all exports.
