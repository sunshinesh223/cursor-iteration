# Planning Before Coding

## When to Plan

ALWAYS plan when:
- Task involves 3+ steps
- Task touches multiple files
- Task involves risky operations
- You're unsure about the approach

Skip planning only for:
- Single-line fixes
- Trivial typo corrections
- Minor documentation updates

## Micro-Plan Template

Before implementing, create a plan with 3-7 bullets:

```markdown
## Plan: [Task Description]

Intent: [What you're trying to achieve]

Steps:
1. [ ] First thing to do
2. [ ] Second thing to do
3. [ ] Third thing to do

Test Strategy:
- [ ] What tests to write
- [ ] How to verify manually

Risks:
- Potential issue and mitigation

Rollback:
- How to undo if something goes wrong
```

## Assumptions

ALWAYS state assumptions explicitly:
- "Assuming the API returns JSON"
- "Assuming the database is already migrated"
- "Assuming user is authenticated"

## Risk Flags

Flag any of these explicitly:
- 🔴 Data loss risk
- 🔴 Security exposure
- 🟠 Breaking API change
- 🟠 Non-deterministic/flaky behavior
- 🟡 Performance impact
- 🟡 External dependency

## Output Format

End each task with:
1. Summary of what was done
2. Commands run and results
3. Verification status
4. Known issues or follow-ups
