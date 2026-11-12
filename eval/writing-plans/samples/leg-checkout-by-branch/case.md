bundle+: skills/writing-plans/SKILL.md
bundle+: skills/brainstorming/reference/legs.md

Evaluate the plan contract as the plan-writer, not the parent orchestrator. This is a text-only exercise: narrate the checkout lookup and path-resolution calls using the supplied observations, then show the single-task plan fragment (home header, Files, Tests, baseline and steps) you would write for A. State what changes for B and what you do for C. Treat the observations as measured; make no live-tool or file-write claims. Keep the whole response under 900 words.

The approved home spec is /workspace/home/active/doc/specs/settings.md; the plan path is /workspace/home/active/doc/plans/settings.md. The session's home worktree is /workspace/home/active, home primary /workspace/home, and companion primary /workspace/widget. Membership is settled as team/home and team/widget; no other siblings exist. Both recorded branches are feature/settings. Home has a keyed home: .worktrees/<name>. The supplied companion block is:

```markdown
### Leg: team/widget
branch: feature/settings
contract:
- create: script/tree add <name> <branch>
- destroy: script/tree drop <name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test
Rules: AGENTS.md
scope: AC 1
design: Replace the legacy settings export with a settings validator.
```

The spec's normative lines (line numbers are citation metadata):
```text
4 ## Design
5 In team/widget, create src/validate.ts exporting isSetting(value), true only for strings; change src/settings.ts to re-export it; delete src/legacy.ts. Extend tests/settings.test.mjs with string and non-string inputs.
7 ## Acceptance criteria
8 - [ ] The companion exposes the validator and no legacy module remains.
```

The following cases are independent observations:

| Case | Companion recorded home | Companion worktree list |
|---|---|---|
| A | omitted as shown | the listing below |
| B | home: trees/fixed-slot is added; that folder does not exist | the same listing below |
| C | omitted as shown | only the first block below; no linked blocks |

```text
worktree /workspace/widget
HEAD 1111111111111111111111111111111111111111
branch refs/heads/main

worktree /workspace/tree-pool/settings-73
HEAD 2222222222222222222222222222222222222222
branch refs/heads/feature/settings

worktree /workspace/tree-pool/other-12
HEAD 3333333333333333333333333333333333333333
branch refs/heads/feature/other
```

For A and B, /workspace/tree-pool/settings-73 exists, its realpath and checkout toplevel equal that path, and its canonical git common dir equals /workspace/widget/.git. It is not the primary. The companion file there carries the exact Home tuple team/home feature/settings doc/specs/settings.md. Home HEAD is aaaaaaa; companion HEAD is 2222222; both status inventories are clean. No path derived from feature-settings or the recorded home exists in either repository.

Recon at /workspace/tree-pool/settings-73 returns: src/settings.ts re-exports only src/legacy.ts, which exports legacySetting; src/validate.ts is absent; tests/settings.test.mjs exercises settings exports with node:test. The future assertion imports isSetting from src/settings.ts and checks string true and number false. The existing file-addressable command node --test tests/settings.test.mjs exits 0 with 2 tests, 0 failures at 2222222 and leaves the tree and HEAD unchanged. AGENTS.md at each member says npm test is full verification, with no other rules or formatter. There is no test observation for C and no plan exists in any case. Source paths under home are unrelated and must not supply companion recon evidence.
