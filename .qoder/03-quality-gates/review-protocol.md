# Review Protocol

## Mandatory Reviewers

| Change | Required reviewer |
|---|---|
| UI | Frontend Agent + QA Agent |
| API contract | Backend Agent + Architect Agent |
| Prompt | Validation Agent + QA Agent |
| Graph schema | Knowledge Graph Agent + Architect Agent |
| Security | Security Agent |
| Infrastructure | DevOps Agent |
| Eval thresholds | QA Agent + Validation Agent |
| DB migration | Backend Agent + DevOps Agent |

## Review Checklist

- Does this solve the task?
- Is the scope controlled?
- Are contracts stable?
- Are tests meaningful?
- Are AI outputs validated?
- Are prompts versioned?
- Are errors handled?
- Are security risks considered?
- Is rollback possible?
- Would another Codex agent understand this code tomorrow?
