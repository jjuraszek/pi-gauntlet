# eval report: loop-implementer (partial run: row-and-evidence)

for: c3487bb7091d42bd38279fe28bb563606b2ece82177d50b8dcf161904fbae33c

wall: 64s

## Change

Make done decisions hand off reusable artifacts and say what later rows can build on, explicitly saying nothing new to build on when no reusable artifact was added. Keep failed decisions as retry guidance and the seed decision grammar unchanged. Add done-handoff and failed-handoff facts to the existing row-and-evidence sample without changing its prior facts or scenarios.

Let a worker finish its target first, then prove same-leg open extras one at a time in the files or helper it just changed. Each extra keeps its attempts and carries its own command-first evidence and decision, target first; unfinished extras are reverted before the single commit. Extend row-and-evidence with a supplied-fixture success case that closes the shared-label extra, retaining the missing-fixture failed-target case separately.

Preserve frontmatter, spec-first reads, selective checks, RED/GREEN/REFACTOR, test economy, commit attribution and seed behavior. A failed target permits no extras. Home and companion ordinary results carry one decision per changed row, while seed retains its single row 0 decision.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| row-and-evidence | anthropic/claude-opus-5-5 | improved | 33270 | target-and-extra: fails -> holds (intended change); multirow-output: fails -> holds (intended change); failure-scope: holds -> holds (held); bounded-evidence: holds -> holds (held); failure-decision: holds -> holds (held); seed-exception: holds -> holds (held); seed-commit: holds -> holds (held); done-handoff: fails -> holds (intended change); failed-handoff: holds -> holds (held); verification-boundary: holds -> holds (held) |
| row-and-evidence | github-copilot/gpt-6.1-sol | improved | 21423 | target-and-extra: fails -> holds (intended change); multirow-output: fails -> holds (intended change); failure-scope: holds -> holds (held); bounded-evidence: holds -> holds (held); failure-decision: holds -> holds (held); seed-exception: holds -> holds (held); seed-commit: holds -> holds (held); done-handoff: fails -> holds (intended change); failed-handoff: holds -> holds (held); verification-boundary: holds -> holds (held) |

## Feedback

- row-and-evidence / anthropic/claude-opus-5-5: After delivers the intended change cleanly: Snapshot A now proves row 2 after the target passes (step 12), keeps attempts 0, emits two command-first evidence cells within the three-result bound, appends row 1 then row 2 decisions, and commits once as `loop: row 1 done`; the row 1 decision names the reusable src/label.mjs export and chart check and the row 2 decision says `nothing new to build on`, so done-handoff, target-and-extra and multirow-output all flip to holds while C stays a retry-guidance failure with only row 1 cells changed. The one drift to watch is Snapshot B's seed reply: Before was `row 0 done | seeded 2 rows, closed 1 on baseline | row 1`, but After's third field became `row 1, once the externally supplied measurements.csv fixture exists; run node scripts/chart-check.mjs.` — still reports row 1 next so seed-commit holds, but it contradicts the Change's requirement that the seed decision grammar stay unchanged, suggesting the new handoff wording is bleeding into the seed path. Scope the artifact-handoff sentence explicitly to done decisions for rows ≥1 (e.g. 'the seed decision keeps its fixed third field: the next row number only') so B's third field returns to the bare `row 1` while A and C stay as they are in After.
- row-and-evidence / github-copilot/gpt-6.1-sol: After delivers the Change cleanly: A now finishes the target first, then proves the shared-label extra with its own command-first evidence and attempts left at 0, emits row 1 then row 2 decisions under a single `loop: row 1 done` commit, and the row 1 decision names src/label.mjs and measurements.csv as reusable while row 2 explicitly says 'nothing new to build on'. B and C are unchanged in substance, so every fact Before kept is still kept. One soft edge worth tightening: C's failed decision now opens with 'Keep the existing ready label and chart check; retry only when…', which leans toward the done artifact-handoff grammar; it still passes because the retry-for-fixture guidance is present, but a wording like 'Retry only after the externally supplied measurements.csv is provided; do not fabricate it or close row 2 here' would keep failed decisions purely as retry guidance and avoid any drift toward the handoff format the Change reserves for done rows.

exit: 0
