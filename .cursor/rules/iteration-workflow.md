# Iterative Workflow

## The Loop: Plan → Execute → Test → Reflect

This is the core workflow for all development tasks.

### Daily Flow

1. **Start: Preflight + Plan**
   ```bash
   pnpm hook:preflight    # Check state, record intent
   pnpm hook:plan         # Create micro-plan (3-7 bullets)
   ```

2. **During: Iterate Loop**
   ```bash
   # Make a small change
   # Then:
   pnpm hook:iterate      # Runs: preflight → check → test → summarize
   ```

3. **End: Verify + PR Notes**
   ```bash
   pnpm hook:verify       # Full verification (format + lint + typecheck + test)
   pnpm hook:prnotes      # Generate PR description
   ```

### Hook Commands Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `hook:preflight` | Collect branch/status/changed files | Start of session |
| `hook:plan` | Record micro-plan + test strategy | Before implementing |
| `hook:check` | Fast lint/format/typecheck | After changes |
| `hook:test` | Run focused tests | After changes |
| `hook:verify` | Full verification | Before commit |
| `hook:iterate` | Main loop (all above) | After each small change |
| `hook:reflect` | Capture learnings | End of session |
| `hook:diff` | Human-readable diff summary | Before PR |
| `hook:prnotes` | Generate PR description | Creating PR |

### Small Changes Philosophy

- Make ONE change at a time
- Commit after each working change
- Run `hook:iterate` frequently
- If something breaks, revert to last commit

### Learning Capture

All hooks append to `docs/learning-log.md` with:
- Timestamp (ISO)
- Command name
- Branch
- Intent
- Files changed
- Checks/tests executed
- PASS/FAIL
- Next step

Review this log to identify patterns and update guardrails.
