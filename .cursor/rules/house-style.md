# House Style

> Tone, conventions, and decision rules for this project.

## Tone

- **Be direct**: Say what you mean. Avoid hedging language.
- **Be concise**: Shorter is better. Cut unnecessary words.
- **Be technical**: Use precise terminology. Define jargon when needed.
- **Be helpful**: Assume good intent. Offer alternatives when saying no.

## Code Conventions

### Naming

- **Variables**: camelCase, descriptive (`userCount` not `uc`)
- **Functions**: camelCase, verb-first (`getUserById`, `validateInput`)
- **Classes/Types**: PascalCase (`UserService`, `ValidationError`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`, `DEFAULT_TIMEOUT`)
- **Files**: kebab-case for most (`user-service.ts`), PascalCase for components (`UserCard.tsx`)

### Structure

- **One export per file** for modules (prefer named exports)
- **Group imports**: external → internal → relative → types
- **Order functions**: public first, private last
- **Keep files focused**: single responsibility per file

### Comments

- **Don't comment obvious code**: Good code is self-documenting
- **Do comment why**: Explain non-obvious decisions
- **Use JSDoc for public APIs**: Document parameters, returns, throws

```typescript
/**
 * Calculate the discount for a user based on their tier.
 * Note: VIP discount stacks with seasonal promotions.
 */
function calculateDiscount(user: User, cart: Cart): number {
  // Business rule: VIP users get base 20% off
  const vipDiscount = user.isVip ? 0.2 : 0;
  // ...
}
```

## Decision Rules

### When to Write Tests

- **Always**: New logic, bug fixes, refactors of critical paths
- **Skip**: Pure configuration, generated code, one-off scripts
- **Coverage target**: 80% minimum, 95% for critical paths

### When to Add Types

- **Always**: Function signatures, module exports, API boundaries
- **Consider**: Internal variables where inference is unclear
- **Skip**: Obvious literals, loop variables, obvious callbacks

### When to Refactor

- **Do**: Before adding features to messy code (Boy Scout Rule)
- **Don't**: During unrelated feature work (scope creep)
- **Consider**: When you touch the same code 3+ times

### When to Abstract

- **Wait for duplication**: Don't abstract until you have 3+ similar instances
- **Prefer composition**: Small functions over class hierarchies
- **Keep it simple**: If abstraction is harder to understand than duplication, don't abstract

### When to Add Dependencies

- **Check first**: Can we do this with existing tools?
- **Evaluate**: Maintenance burden, bundle size, security
- **Prefer**: Well-maintained, minimal dependencies, TypeScript support

## Communication Style

### Commit Messages

```
type(scope): short description

- Bullet points for details
- Focus on "why" not "what"
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`

### PR Descriptions

- **What**: 1-2 sentence summary
- **Why**: Motivation, link to issue
- **How**: Key implementation choices
- **Test**: How to verify it works
- **Risk**: What could go wrong

### Code Review Comments

- **Be specific**: Point to exact lines
- **Explain why**: Not just "this is wrong"
- **Suggest alternatives**: Don't just criticize
- **Use conventional comments**: `nit:`, `suggestion:`, `question:`, `blocker:`

## Error Messages

- **Be specific**: "User 123 not found" not "Error"
- **Be actionable**: Tell the user what to do next
- **Include context**: IDs, timestamps, relevant data
- **Keep secrets out**: No tokens, passwords, or PII in logs
