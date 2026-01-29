# Code Review Checklist

Use this checklist when reviewing changes (your own or others').

## Correctness

- [ ] Code does what it claims to do
- [ ] Logic handles all expected inputs
- [ ] Edge cases are handled
- [ ] Error conditions are handled gracefully

## Tests

- [ ] New behavior has tests
- [ ] Tests cover happy path
- [ ] Tests cover edge cases
- [ ] Tests cover error conditions
- [ ] Coverage meets 80% threshold

## Security

- [ ] No hardcoded secrets
- [ ] User input is validated
- [ ] SQL injection is prevented
- [ ] XSS is prevented
- [ ] Authorization is checked

## Performance

- [ ] No N+1 queries
- [ ] No unnecessary network calls
- [ ] No blocking operations in hot paths
- [ ] Large data is paginated

## Maintainability

- [ ] Code is readable
- [ ] Functions are small and focused
- [ ] Naming is clear and consistent
- [ ] No dead code
- [ ] No console.log in production

## Backwards Compatibility

- [ ] API changes are documented
- [ ] Breaking changes are flagged
- [ ] Migration path exists

---

## Risk Flags

Mark any that apply:

- [ ] 🔴 Data loss risk
- [ ] 🔴 Security exposure
- [ ] 🟠 Breaking API change
- [ ] 🟠 Non-deterministic/flaky tests
- [ ] 🟡 Performance impact
- [ ] 🟡 New external dependency

---

## Review Decision

- [ ] **APPROVE** - Ready to merge
- [ ] **REQUEST CHANGES** - Issues must be fixed
- [ ] **COMMENT** - Suggestions, non-blocking
