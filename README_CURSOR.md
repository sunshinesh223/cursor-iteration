# Cursor Iteration Workflow

> Feature-parity migration of everything-claude-code to Cursor IDE.
> Get started in <10 minutes.

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Open in Cursor

Open this repo in Cursor IDE. The rules in `.cursor/rules/` will automatically apply.

### 3. Run Your First Iteration

```bash
# Check current state
pnpm hook:preflight

# Create a plan
pnpm hook:plan

# Make a change, then iterate
pnpm hook:iterate

# When ready, verify
pnpm hook:verify
```

That's it! You're now using the iterative workflow.

---

## How to Run Hook: Iterate

The main command for daily work:

```bash
pnpm hook:iterate
```

This runs:

1. **Preflight** - Check branch, status, changed files
2. **Check** - Format, lint, typecheck (fast)
3. **Test** - Run test suite
4. **Summarize** - Log results and suggest next step

Run this after every small change to catch issues early.

---

## How to Review Changes

### Before Committing

```bash
# Generate diff summary
pnpm hook:diff

# Full verification
pnpm hook:verify
```

### Creating a PR

```bash
# Generate PR description
pnpm hook:prnotes

# Then create PR with the generated template
```

---

## How to Add New Rules/Learnings

### Adding Cursor Rules

1. Create a new `.md` file in `.cursor/rules/`
2. Use clear headings and examples
3. Rules are automatically active in Cursor

### Updating Guardrails

After learning from a failure:

1. Edit `.ralph/guardrails.md`
2. Add a new Sign using this format:

```markdown
### Sign: [Name]

- **Trigger**: When this happens
- **Instruction**: What to do instead
- **Added after**: Failure description
```

---

## Daily Flow

### Start of Day

```bash
pnpm hook:preflight    # What's the state?
pnpm hook:plan         # What am I doing today?
```

### During Work

```bash
# Make a small change
# Then:
pnpm hook:iterate      # Check and test
# Repeat
```

### End of Day

```bash
pnpm hook:verify       # Full verification
pnpm hook:reflect      # Capture learnings
pnpm hook:prnotes      # Generate PR notes if needed
```

---

## All Hook Commands

| Command               | Purpose                         | When to Use         |
| --------------------- | ------------------------------- | ------------------- |
| `pnpm hook:preflight` | Collect branch/status/files     | Start of session    |
| `pnpm hook:plan`      | Create micro-plan (3-7 bullets) | Before implementing |
| `pnpm hook:check`     | Fast lint/format/typecheck      | Quick validation    |
| `pnpm hook:test`      | Run test suite                  | After changes       |
| `pnpm hook:verify`    | Full verification               | Before commit       |
| `pnpm hook:iterate`   | Main loop (all checks)          | After each change   |
| `pnpm hook:reflect`   | Capture learnings               | End of session      |
| `pnpm hook:diff`      | Human-readable diff summary     | Before PR           |
| `pnpm hook:prnotes`   | Generate PR description         | Creating PR         |

---

## Troubleshooting

### "No node_modules found"

Run `pnpm install` first.

### Tests failing

1. Run `pnpm test` to see detailed output
2. Fix failing tests
3. Run `pnpm hook:iterate` again

### Formatting issues

```bash
pnpm format    # Auto-fix formatting
```

### Lint errors

```bash
pnpm lint:fix  # Auto-fix lint issues
```

### TypeScript errors

```bash
pnpm typecheck  # See detailed errors
```

### Hook not logging

Check that `docs/learning-log.md` exists and is writable.

---

## Project Structure

```
.cursor/
  rules/           # Cursor project rules (auto-loaded)
    coding-style.md
    security.md
    testing.md
    git-workflow.md
    iteration-workflow.md
    planning.md

scripts/
  hooks/           # Hook implementations
  lib/             # Shared utilities

templates/         # Task/bugfix/feature templates
docs/
  learning-log.md  # Append-only log of hook runs

FEATURE_PARITY.md  # Source → Cursor mapping
README_CURSOR.md   # This file
```

---

## Further Reading

- [Templates Index](./templates/index.md)
- [Feature Parity Matrix](./FEATURE_PARITY.md)
- [Learning Log](./docs/learning-log.md)
