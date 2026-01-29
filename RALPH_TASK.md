---
task: Migrate everything-claude-code features to Cursor (feature parity)
test_command: 'pnpm test'
---

---

# Task: Feature-Parity Migration to Cursor

Migrate the full **feature set** from `everything-claude-code` into a Cursor-compatible workflow, focusing on **feature matching** (not folder/file structure matching).

Source: [https://github.com/affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
Target: Cursor IDE

## Success Criteria

1. [x] A developer can open the repo in Cursor and immediately access the migrated workflows (rules + tasks/commands + docs).
2. [x] All key features from the source repo are mapped to Cursor equivalents (implemented or explicitly documented as “gap + workaround”).
3. [x] “Hooks” behavior (iterative learning loop + auto/IDE triggers + logging) is available in Cursor (manual IDE commands at minimum).
4. [x] A feature parity matrix exists: **Source feature → Cursor equivalent → Status → Notes**.
5. [x] A quickstart exists that works end-to-end in <10 minutes.
6. [x] `pnpm test` passes (if tests exist in the target repo).

## Context

- Prioritize **behavioral parity**: the same outcomes and team habits should emerge.
- Cursor has different primitives than Claude Code; use Cursor-native mechanisms where possible:
  - Cursor Rules (project-level)
  - Cursor Tasks / command palette runnable scripts
  - Optional: git hooks / CI (only if needed for parity)

- If something cannot be replicated 1:1, implement the nearest equivalent and document the delta.

---

# Scope: Feature Set to Migrate

## A) Prompting / Rules System (Assistant Behavior)

**Goal:** replicate the “how the assistant works” discipline.

Deliver:

- [x] Cursor project rules that enforce:
  - planning before coding (when non-trivial)
  - small diffs, iterative loop
  - explicit assumptions + risk flags
  - testing discipline
  - security hygiene (secrets, destructive ops)
  - consistent output format (checklists, summaries)

- [x] A “house style” section (tone, conventions, decision rules).

Acceptance:

- [x] Rules are visible/active in Cursor and referenced in quickstart.

---

## B) Iterative Workflow (Plan → Execute → Test → Reflect)

**Goal:** reproduce the source repo’s iterative learning process.

Deliver:

- [x] A documented loop used daily:
  1. define intent
  2. micro-plan
  3. implement small change
  4. run checks/tests
  5. reflect + log

- [x] A single “happy path” command that does most of the loop.

Acceptance:

- [x] A new dev can follow the loop without needing prior context.

---

## C) Hooks (Key Component)

**Goal:** reproduce hook-driven iteration and learning capture inside Cursor.

### Required: Manual Hook Commands (IDE parity)

Expose these as Cursor Tasks + `pnpm` scripts:

- [x] **Hook: Preflight** (`pnpm hook:preflight`)
      Collect branch/status/changed files + record intent.

- [x] **Hook: Plan** (`pnpm hook:plan`)
      Record a micro-plan (3–7 bullets) + test strategy.

- [x] **Hook: Check** (`pnpm hook:check`)
      Fast gate: format/lint/typecheck (repo-defined). Fail fast.

- [x] **Hook: Test** (`pnpm hook:test`)
      Focused tests (repo-defined).

- [x] **Hook: Verify** (`pnpm hook:verify`)
      Full confidence run (at least `pnpm test`). Non-zero on failure.

- [x] **Hook: Iterate** (`pnpm hook:iterate`)
      The main loop: preflight → check → test → summarize → log next step.

- [x] **Hook: Reflect** (`pnpm hook:reflect`)
      Capture what worked/failed + “rule we should adopt”.

- [x] **Hook: Diff Summary** (`pnpm hook:diff`)
      Human-readable summary of changes (for PR/review).

- [x] **Hook: PR Notes** (`pnpm hook:prnotes`)
      Generate PR description (what/why/tests/risks/rollback).

### Required: Learning Log

- [x] Append-only log at `docs/learning-log.md`
- [x] Each hook run appends a structured entry.

Entry must include:

- timestamp (ISO)
- command name
- branch
- intent
- files changed (if available)
- checks/tests executed
- PASS/FAIL
- failure summary (if any)
- next step

Example format:

```md
## 2026-01-29T12:34:56+01:00 — ITERATE (PASS)

- Branch: feature/x
- Intent: Fix backend startup path resolution
- Files changed: backend/server.ts, docs/notes.md
- Checks: lint ✅, typecheck ✅
- Tests: pnpm test ✅
- Outcome: Startup now resolves workspace path correctly.
- Next step: Add regression test for missing package.json detection.
```

### Optional (if you want stronger parity): Auto Hooks

- [x] Git hooks (husky) call the same `pnpm hook:*` scripts:
  - pre-commit → `pnpm hook:check`
  - pre-push → `pnpm hook:verify`

- [x] CI runs `pnpm hook:verify` on PR.

Acceptance:

- [x] Manual hooks work from Cursor Tasks.
- [ ] (Optional) Auto hooks enforce the same gates.

---

## D) Review System (Diff Review + Risk Flags)

**Goal:** match the source repo’s “review discipline”.

Deliver:

- [x] A review checklist template:
  - correctness
  - tests
  - edge cases
  - security
  - performance
  - backwards compatibility

- [x] A “risk flag” protocol (examples):
  - data loss risk
  - security exposure
  - breaking API change
  - non-determinism/flaky tests

- [x] A standard “PR notes” format generated by `Hook: PR Notes`.

Acceptance:

- [x] Review artifacts can be produced for any change in <2 minutes.

---

## E) Repo Templates / Task Specs

**Goal:** port the reusable “how we ask for work” components.

Deliver:

- [x] A task template (like this file format) for repeatable tasks:
  - success criteria
  - context
  - acceptance tests

- [x] A bugfix template:
  - reproduction
  - root cause hypothesis
  - fix plan
  - regression test

- [x] A feature template:
  - user story
  - constraints
  - non-goals
  - rollout/rollback

Acceptance:

- [x] One index doc links to all templates.

---

## F) Tooling / Quality System

**Goal:** replicate the “guardrails” tooling.

Deliver (as applicable to the target repo):

- [x] formatting
- [x] linting
- [x] typechecking
- [x] unit/integration tests
- [ ] secret scanning (optional but recommended)
- [ ] dependency audit (optional)

Acceptance:

- [x] `Hook: Check` and `Hook: Verify` produce deterministic pass/fail.

---

## G) Onboarding / Operating Manual

**Goal:** make it easy to adopt.

Deliver:

- [x] `README_CURSOR.md` including:
  - install
  - open in Cursor
  - how to run Hook: Iterate
  - how to review changes
  - how to add new rules/learnings

- [x] “Daily flow” section:
  - start: preflight + plan
  - during: iterate loop
  - end: verify + pr notes

- [x] Troubleshooting section (common failure modes).

Acceptance:

- [x] A new dev can run the loop on day 1.

---

# Feature Parity Matrix (Required)

Create `FEATURE_PARITY.md` with a table like:

- Source Feature
- Cursor Equivalent
- Status: Implemented / Partial / Gap
- Notes / Workaround
- Owner / Next step (optional)

Minimum rows to include:

- rules system
- iterative workflow
- hooks (manual)
- hooks (auto, if implemented)
- review checklists
- templates
- quality gates
- onboarding docs

---

# Cursor Task Names (Canonical)

Expose these task names inside Cursor:

- Hook: Preflight
- Hook: Plan
- Hook: Check
- Hook: Test
- Hook: Verify
- Hook: Iterate
- Hook: Reflect
- Hook: Diff Summary
- Hook: PR Notes

Each task must:

- run from repo root
- exit non-zero on failure (so Cursor shows “failed”)
- write to `docs/learning-log.md`

---

# Acceptance Tests

1. [x] Open repo in Cursor → rules are active and discoverable
2. [x] Run **Hook: Preflight** → log entry appended
3. [x] Run **Hook: Iterate** after a small change → log includes files + results + next step
4. [x] Intentionally break something → **Hook: Verify** fails and logs failure
5. [x] Fix it → **Hook: Verify** passes
6. [x] Generate **Hook: PR Notes** → creates review-ready summary
7. [x] `pnpm test` passes

---
