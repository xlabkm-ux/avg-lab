# Release Quality Gates

A release is blocked if:

- critical tests fail;
- AI eval threshold falls below gate;
- high/critical security issue exists;
- migration rollback is unknown;
- prompt behavior changed without behavior ledger update;
- source-grounding eval fails;
- no monitoring dashboard exists for changed surface.

## Release Checklist

- [ ] CI green.
- [ ] AI evals green.
- [ ] E2E critical path green.
- [ ] Security scan green.
- [ ] Migration dry-run complete.
- [ ] Staging smoke test complete.
- [ ] Rollback plan present.
