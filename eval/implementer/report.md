# eval report: implementer (partial run: anchored-task)

for: 7db4b1eebec6f602d87a36fa2fc68b1e4cc2f4f74914493c42eec0e7c53eb771

wall: 16s

## Change

Load task text conditionally from planPath and exact task anchors, including the union for multi-task repairs; derive Spec/Files/Tests and combined task/home-leg Rules in the worker checkout. Preserve inline callers, TDD, direct-seam/exact-Create test-contract evidence and scoped-command discipline. Mirror the written status into structured output and fail unreadable anchors with BLOCKED plus anchorUnreadable. The replay routes only the two new cases through supplied file observations and report/JSON output; legacy cases keep their existing response formats.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| anchored-task | anthropic/claude-opus-5-5 | improved | 15865 | next-read: holds -> holds (intended but unchanged); task-slice: holds -> holds (intended but unchanged); rules: fails -> holds (intended change); mirror: holds -> holds (intended but unchanged); inline: holds -> holds (held) |
| anchored-task | github-copilot/gpt-6.1-sol | unchanged | 11175 | next-read: holds -> holds (intended but unchanged); task-slice: holds -> holds (intended but unchanged); rules: fails -> fails (intended but unchanged); mirror: holds -> holds (intended but unchanged); inline: holds -> holds (held) |

## Feedback

- anchored-task / anthropic/claude-opus-5-5: After gains the rules fact by explicitly deriving home-rules.md from the first `### Leg:` entry (project) because Task 4 carries no `Leg:` line, and by resolving both files in /workspace/project; Before only said `from ### Leg: project` without the no-Leg derivation. Nothing regressed, but two things in After are weaker than Before and could slip under a stricter reading: the `Next read requested` line names only `/workspace/project/plan.md` without the `### Task 4:` anchor (Before stated the anchor in the read request itself), and the JSON shrank to `status` plus free-text `reasoning`, dropping `files_changed`, `commands_run`, `test_contract`, and `rules_applied`, so the structured mirror now carries less than the written report. To keep every fact robustly while delivering the Change, phrase the read request as `plan.md at anchor "### Task 4:"` and keep Before's richer JSON fields (files_changed, commands_run, test_contract, rules_applied) alongside the leg-derivation sentence you added.
- anchored-task / github-copilot/gpt-6.1-sol: After keeps next-read, task-slice, mirror, and inline, but it regresses on the rules fact relative to Before: Before at least named `task-rules.md` and `home-rules.md`, said both resolve in `/workspace/project`, and mentioned the mapped leg `project`, whereas After collapses this to "both rules files", which the fact explicitly says is insufficient. Neither output states the derivation the Change is meant to deliver — that home-rules.md comes from the first spec leg (`project`) because Task 4 declares no Leg. To hold the rules fact while delivering the Change, the After wording should instruct the worker to write out a Rules line like: "Rules: task-rules.md (from Task 4) + home-rules.md (from spec leg `project`, the first leg, since Task 4 has no Leg); both resolve in /workspace/project" — i.e., require naming each rules file, its source (task vs. home leg with the no-Leg fallback), and the checkout path, rather than summarizing them collectively.

exit: 0
