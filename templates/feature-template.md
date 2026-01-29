# Feature: [Title]

> Template for implementing new features.

---

## Summary

Brief description of the feature.

## User Story

As a [type of user],
I want [goal],
So that [benefit].

## Acceptance Criteria

1. [ ] Given [context], when [action], then [outcome]
2. [ ] Given [context], when [action], then [outcome]
3. [ ] Given [context], when [action], then [outcome]

## Constraints

- Must work with existing [system]
- Must not break [functionality]
- Must complete within [scope limit]

## Non-Goals

What this feature explicitly does NOT do:

- Not included: X
- Not included: Y
- Future consideration: Z

## Technical Design

### Components Affected

- `path/to/file1.ts` - Changes needed
- `path/to/file2.ts` - Changes needed

### Data Model Changes

```typescript
// New or modified types
interface NewType {
  field: string
}
```

### API Changes

```
POST /api/endpoint
Request: { ... }
Response: { ... }
```

## Implementation Plan

### Phase 1: Foundation

1. [ ] Set up basic structure
2. [ ] Create types/interfaces

### Phase 2: Core Logic

1. [ ] Implement main functionality
2. [ ] Add error handling

### Phase 3: Testing

1. [ ] Write unit tests
2. [ ] Write integration tests
3. [ ] Manual testing

## Test Plan

- [ ] Unit tests cover all branches
- [ ] Integration tests cover API
- [ ] Manual testing checklist:
  - [ ] Happy path works
  - [ ] Edge cases handled
  - [ ] Error states shown correctly

## Rollout Plan

1. **Development**: Feature flag disabled
2. **Staging**: Enable for testing
3. **Production**: Gradual rollout (10% → 50% → 100%)

## Rollback Plan

If issues occur:

1. Disable feature flag
2. Investigate root cause
3. Fix and re-deploy

## Documentation

- [ ] Update README if needed
- [ ] Add API documentation
- [ ] Update user-facing docs
