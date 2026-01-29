# Testing Requirements

## Minimum Test Coverage: 80%

Test Types (ALL required for behavior changes):
1. **Unit Tests** - Individual functions, utilities, components
2. **Integration Tests** - API endpoints, database operations
3. **E2E Tests** - Critical user flows (when applicable)

## Test-Driven Development

MANDATORY workflow for new features:
1. Write test first (RED)
2. Run test - it should FAIL
3. Write minimal implementation (GREEN)
4. Run test - it should PASS
5. Refactor (IMPROVE)
6. Verify coverage (80%+)

## Test File Naming

- Unit tests: `*.test.ts` or `*.spec.ts`
- Integration tests: `*.integration.test.ts`
- E2E tests: `*.e2e.test.ts`

## Test Structure

```typescript
describe('FeatureName', () => {
  describe('methodName', () => {
    it('should handle normal case', () => {
      // Arrange
      // Act
      // Assert
    })

    it('should handle edge case', () => {
      // ...
    })

    it('should throw on invalid input', () => {
      // ...
    })
  })
})
```

## Troubleshooting Test Failures

1. Check test isolation (no shared state)
2. Verify mocks are correct
3. Fix implementation, not tests (unless tests are wrong)
4. Run tests in verbose mode for more details
