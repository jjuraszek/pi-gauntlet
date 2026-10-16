# gatekeep-pr sync and decision-grants eval

Forty-three synthetic digest samples test command and helper narration through the first menu or an `## Entry` continuation state. The inventory covers sync and scoped-test push holds; permissions, helpers, and other-author confirmation; blocker-only and one-shot nit fixes; reviewed carried-set retries; separate fix/base grants and named-fix limits; missing, mismatched, revoked, and Claude Code continuation state; shared repair budgets, no-progress stops, contract decisions, and bounded polling; exact description corrections, uncertainty, independent test/scope blockers, stale proposals, concurrent edits, write failures, and mixed file/body progress. Samples and must-hold facts live under `samples/`; the current change intent is in `intent.md`.

| Skill file loaded |
|---|
| `skills/gatekeep-pr/SKILL.md` |
| `skills/gatekeep-pr/reference/sync.md` |
| `skills/gatekeep-pr/reference/decision-menu.md` |
| `skills/gatekeep-pr/reference/findings.md` |
| `skills/gatekeep-pr/reference/post-selection-loop.md` |
| `skills/gatekeep-pr/reference/cleanup.md` |
| `skills/gatekeep-pr/reference/fix-wave.md` |
| `skills/gatekeep-pr/reference/report.md` |
| `skills/gatekeep-pr/verification-brief.md` |
| `skills/gatekeep-pr/reference/assessment.md` |

Baseline capture with `node eval/run.mjs gatekeep-pr --baseline-only --base <ref>` succeeds when baseline replay outputs are usable; it does not check intent, judge facts, or write `report.md`. Run the target-wide candidate comparison with `node eval/run.mjs gatekeep-pr --base <ref>` against the same pinned baseline. Delivery requires every new or changed must-hold fact to have `after: holds` for both frozen replay models in the committed candidate results, with no regression, error, or inconclusive outcome. A successful exit or aggregate `improved`/`unchanged` verdict is not sufficient: unchanged failures can be labeled `pre-existing` or `intended but unchanged`.

Samples use `bundle-` lines in `case.md` to drop the reference files their facts never exercise (`sync.md` outside `--rebase` digests, `assessment.md` and `fix-wave.md` where no config or fix-wave fact exists); samples whose facts span the whole workflow keep the complete assembly and carry no `bundle-` line, so a reference edit replays only the samples that keep it.

Process, commands, and record schema: [eval process](../README.md).
