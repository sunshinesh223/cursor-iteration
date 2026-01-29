# Bugfix: [Title]

> Template for fixing bugs systematically.

---

## Summary

Brief description of the bug and its impact.

## Reproduction Steps

1. Step to reproduce
2. Step to reproduce
3. Expected vs actual behavior

**Environment:**
- OS: 
- Node version:
- Browser (if applicable):

## Root Cause Hypothesis

What we think is causing the bug:

- [ ] Hypothesis 1: Description
- [ ] Hypothesis 2: Description

## Investigation

### Evidence

- Log snippets
- Stack traces
- Screenshots

### Confirmed Cause

The actual root cause after investigation.

## Fix Plan

1. **Change 1**: What and why
2. **Change 2**: What and why
3. **Change 3**: What and why

## Regression Test

Write a test that:
1. Fails before the fix
2. Passes after the fix

```typescript
it('should not [bug behavior]', () => {
  // Test that prevents regression
})
```

## Verification

- [ ] Bug no longer reproduces
- [ ] Regression test passes
- [ ] No new bugs introduced
- [ ] `pnpm test` passes
- [ ] `pnpm hook:verify` passes

## Post-Mortem

- **What went wrong?**
- **Why wasn't it caught earlier?**
- **What can we do to prevent similar bugs?**
