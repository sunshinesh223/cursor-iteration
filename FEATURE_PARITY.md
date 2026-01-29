# Feature Parity Matrix

> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code)
> Target: Cursor IDE

## Status Legend

- ✅ **Implemented** - Full feature parity
- 🟡 **Partial** - Core functionality, some gaps
- ⏭️ **Gap** - Not implemented, workaround documented
- 📋 **Planned** - On roadmap

---

## Feature Mapping

| Source Feature          | Cursor Equivalent               | Status         | Notes                                             |
| ----------------------- | ------------------------------- | -------------- | ------------------------------------------------- |
| **Rules System**        | `.cursor/rules/*.md`            | ✅ Implemented | Auto-loaded by Cursor                             |
| **Iterative Workflow**  | `pnpm hook:*` scripts           | ✅ Implemented | Same loop: plan → execute → test → reflect        |
| **Hooks (Manual)**      | `pnpm hook:*` commands          | ✅ Implemented | All 9 hooks available                             |
| **Hooks (Auto/Git)**    | Husky + lint-staged             | ⏭️ Gap         | Can add husky for pre-commit hooks                |
| **Review Checklists**   | `templates/review-checklist.md` | ✅ Implemented | Manual checklist usage                            |
| **Task Templates**      | `templates/*.md`                | ✅ Implemented | Task, bugfix, feature templates                   |
| **Quality Gates**       | `hook:check`, `hook:verify`     | ✅ Implemented | Format, lint, typecheck, test                     |
| **Onboarding Docs**     | `README_CURSOR.md`              | ✅ Implemented | Quickstart in <10 minutes                         |
| **Learning Log**        | `docs/learning-log.md`          | ✅ Implemented | Auto-appended by hooks                            |
| **Agents**              | Cursor AI + Rules               | 🟡 Partial     | Use rules to guide behavior; no subagent dispatch |
| **Skills**              | `.cursor/rules/*.md`            | 🟡 Partial     | Encoded as rules; no dynamic loading              |
| **Commands (/)**        | `pnpm hook:*`                   | ✅ Implemented | CLI commands vs. slash commands                   |
| **MCP Configs**         | Cursor MCP settings             | ⏭️ Gap         | Configure in Cursor settings directly             |
| **Contexts**            | Cursor Rules                    | 🟡 Partial     | No dynamic context injection                      |
| **Session Persistence** | Git commits                     | 🟡 Partial     | State in git, not session memory                  |
| **Continuous Learning** | `.ralph/guardrails.md`          | 🟡 Partial     | Manual guardrail updates                          |

---

## Detailed Notes

### Rules System ✅

**Source**: `rules/*.md` - Always-follow guidelines loaded into Claude Code
**Cursor**: `.cursor/rules/*.md` - Auto-loaded by Cursor IDE

Implemented rules:

- `security.md` - Secret management, security checks
- `coding-style.md` - Immutability, file organization
- `testing.md` - TDD workflow, coverage requirements
- `git-workflow.md` - Commit format, PR process
- `iteration-workflow.md` - The iterate loop
- `planning.md` - When and how to plan

### Hooks (Manual) ✅

| Source Hook  | Cursor Command   | Description                |
| ------------ | ---------------- | -------------------------- |
| PreToolUse   | -                | Not applicable in Cursor   |
| PostToolUse  | -                | Not applicable in Cursor   |
| SessionStart | `hook:preflight` | Check state at start       |
| SessionEnd   | `hook:reflect`   | Capture learnings          |
| Custom       | `hook:plan`      | Record micro-plan          |
| Custom       | `hook:check`     | Fast lint/format/typecheck |
| Custom       | `hook:test`      | Run test suite             |
| Custom       | `hook:verify`    | Full verification          |
| Custom       | `hook:iterate`   | Main loop                  |
| Custom       | `hook:diff`      | Diff summary               |
| Custom       | `hook:prnotes`   | PR description             |

### Hooks (Auto) ⏭️

**Gap**: Claude Code has automatic hooks (PreToolUse, PostToolUse) that run on specific events.

**Workaround**:

1. Use `husky` for git hooks (pre-commit, pre-push)
2. Run hooks manually via `pnpm hook:*`
3. Add to CI pipeline for enforcement

### Agents 🟡

**Source**: Subagents (`planner.md`, `code-reviewer.md`, etc.) with specific tools/models
**Cursor**: Use rules to guide AI behavior

**Partial Implementation**:

- Rules encode agent-like behavior
- No automatic subagent dispatch
- Manual invocation of specialized behaviors

**Workaround**: Create rule files that describe agent-like personas and invoke them contextually.

### MCP Configs ⏭️

**Source**: `mcp-configs/mcp-servers.json` with GitHub, Supabase, etc.
**Cursor**: Configure MCP servers in Cursor settings

**Workaround**: Configure MCP servers directly in Cursor IDE preferences.

---

## Implementation Checklist

### Completed ✅

- [x] Cursor rules in `.cursor/rules/`
- [x] All 9 hook commands (`pnpm hook:*`)
- [x] Learning log infrastructure
- [x] Review checklist template
- [x] Task/bugfix/feature templates
- [x] Onboarding documentation
- [x] Quality gate scripts

### Future Improvements 📋

- [ ] Add husky for automatic git hooks
- [ ] Create agent-like rule files for specialized tasks
- [ ] Add CI configuration (GitHub Actions)
- [ ] Create MCP configuration guide for Cursor
- [ ] Add more language-specific rules (Python, Go, etc.)

---

## Migration Notes

The source repo (`everything-claude-code`) is designed for Claude Code CLI with specific primitives:

- Plugin system
- Hook events (PreToolUse, PostToolUse, etc.)
- Slash commands
- Subagent dispatch

Cursor has different primitives:

- Project rules (`.cursor/rules/`)
- Command palette / scripts
- Built-in AI assistance

This migration focuses on **behavioral parity** - achieving the same outcomes and habits through Cursor-native mechanisms.
