# eval report: spec-gate (partial run: flag-replies)

for: df8a3021dbf793bad56b4e06f74b8d59708e6f5d2bbc9ac33e3146f4c8c1b1d6

wall: 92s

## Change

Migrate full-council's plain plan approval and drafted-rows-block's rendered menu to the four-row contract, preserving briefing, audit, drafted-row and continuation assertions. Leave partial-coverage's case and facts unchanged: its f5 already says reply 2 grants auto-apply amendments. Extend flag-replies with bare defaults, recommended approve with opt-out, label selectors, combined loop opt-out/allowance, and each rejected-reply class. Share exact G definitions and the approval recipe to keep the independent table within the existing target cap; require standalone unwrapped plain-text allowance carriers directly before the loop invocation for digit and label selectors. Include the exact loop engine --allowance=6 reply with the default grant, loop engine and ledger-only allowance; backtick-wrapped carriers do not satisfy these facts. Run only full-council, partial-coverage, drafted-rows-block and flag-replies, seeding baseline first wherever case text changed. Preserve other records and partial-report rows. These selected tool-free narrations do not prove live persistence or target-wide coverage.

Resolve bare `approve` from the just-rendered recommendation and print `Taking "approve" as option <n> - <label>` before applying the selected row's bare-digit action. Retain the rendered recommendation rather than recomputing it. Plan and loop approvals inherit the default amendment grant; draft-PR approval publishes and stops instead of starting implementation.

Extend all-none with grounded loop-gate observations and independent plan and draft-PR continuation snapshots. Run only spec-gate/all-none against base 855e872a42f9cac7a795704f3e0b383b182950ab. This text replay checks the echo and narrated actions, not live persistence or publication. Preserve other sample records; coverage is partial. Keep scripts/brainstorming-bare-approve.test.mjs beside its deterministic contract siblings; paid replay stays outside CI.

Refresh only spec-gate/recommended-row for Design 7: align the single-outcome reading to 12.0 and the PR-subject reading to 31.0, add independent 26.0 and 31.0 draft-PR recommendations, and render the full zero-row council gate at 12.0 with rows 1, 3, 4 and no allowance bullet. Preserve all twelve existing fact IDs, the 25.0/25.1 boundary, zero-row context precedence, first bundled qualifying row, and observation-facet checks. Seed this changed case's baseline first, then compare this sample only against the unchanged candidate skill text. This tool-free replay measures rendered text, not live persistence; retain prior partial-report evidence without rerunning other samples.

Accept row-free approval prose with no amendment, grant, or budget wording through the same recommended-row mapping and literal echo as bare approve. Extend flag-replies with "approved, go ahead" and the contrasting "approved, apply every amend" rejection. Run only spec-gate/flag-replies against base c94a93b6aafb72f059dbd4870cfde2de4f42fc38; preserve the other sample records and partial-report evidence. This tool-free replay checks narrated default approval and rejected worded intent, not live persistence.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| flag-replies | anthropic/claude-opus-5-5 | improved | 23461 | defaults: fails -> holds (unplanned improvement); plain-prose: fails -> holds (intended change); approve-stop: fails -> holds (unplanned improvement); label-funded: fails -> holds (unplanned improvement); loop-stop-allowance: fails -> holds (unplanned improvement); wrong-engine: fails -> holds (unplanned improvement); malformed: fails -> holds (unplanned improvement); missing-row: holds -> holds (held); old-suffix: fails -> holds (unplanned improvement); removed: fails -> holds (unplanned improvement); worded-grant: fails -> holds (unplanned improvement); worded-stop: fails -> holds (unplanned improvement); worded-funding: fails -> holds (unplanned improvement); loop-allowance: fails -> holds (unplanned improvement); loop-label-allowance: fails -> holds (unplanned improvement); plan-stop: fails -> holds (unplanned improvement); loop-stop: fails -> holds (unplanned improvement); plan-stop-funded: fails -> holds (unplanned improvement); plan-funded: fails -> holds (unplanned improvement) |
| flag-replies | github-copilot/gpt-6.1-sol | improved | 27420 | defaults: fails -> holds (unplanned improvement); plain-prose: fails -> holds (intended change); approve-stop: fails -> holds (unplanned improvement); label-funded: fails -> holds (unplanned improvement); loop-stop-allowance: fails -> holds (unplanned improvement); wrong-engine: fails -> holds (unplanned improvement); malformed: holds -> holds (held); missing-row: holds -> holds (held); old-suffix: fails -> holds (unplanned improvement); removed: fails -> holds (unplanned improvement); worded-grant: fails -> holds (unplanned improvement); worded-stop: fails -> holds (unplanned improvement); worded-funding: fails -> holds (unplanned improvement); loop-allowance: fails -> holds (unplanned improvement); loop-label-allowance: fails -> holds (unplanned improvement); plan-stop: fails -> holds (unplanned improvement); loop-stop: fails -> holds (unplanned improvement); plan-stop-funded: fails -> holds (unplanned improvement); plan-funded: fails -> holds (unplanned improvement) |

## Selected repair evidence

Only `flag-replies` ran against base `c94a93b6aafb72f059dbd4870cfde2de4f42fc38` for this repair. Both candidate replies hold all 19 facts, including the new `approved, go ahead` case and the `approved, apply every amend` rejection. The source-contract and saved-reply check passed 3 tests. This is partial, tool-free coverage; it does not prove live persistence or a target-wide pass.

- `timeout -k 30 3600 node eval/run.mjs spec-gate flag-replies --base c94a93b6aafb72f059dbd4870cfde2de4f42fc38`: exit 0, improved, replay 4, judge 2, confirm 0, wall 92s.
- `timeout -k 30 60 node --test scripts/brainstorming-bare-approve.test.mjs`: 3 passed, 0 failed; reuses the saved replies without model calls.

## Retained prior partial-report evidence (not rerun)

The following cells retain the preceding `recommended-row` report at `for: 958814567d03516a4f7f622e366e95465fbad02d1857943813f6ae0055edefae`; that sample and its records did not change.

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| recommended-row | anthropic/claude-opus-5-5 | improved | 17478 | unbundled: fails -> holds (intended change); bundled: fails -> holds (intended change); recommendation: fails -> holds (intended change); zero-rows: fails -> holds (intended change); engine-only: fails -> holds (intended change); context: fails -> holds (intended change); rows: fails -> holds (intended change); sentences: fails -> fails (intended but unchanged); briefing: holds -> holds (held); drafted: holds -> holds (held); flags: fails -> holds (intended change); defaults: fails -> holds (intended change) |
| recommended-row | github-copilot/gpt-6.1-sol | improved | 20010 | unbundled: fails -> holds (intended change); bundled: fails -> holds (intended change); recommendation: fails -> holds (intended change); zero-rows: fails -> holds (intended change); engine-only: fails -> holds (intended change); context: fails -> holds (intended change); rows: fails -> holds (intended change); sentences: fails -> holds (intended change); briefing: holds -> holds (held); drafted: holds -> holds (held); flags: fails -> holds (intended change); defaults: fails -> holds (intended change) |

Prior `recommended-row` evidence: the baseline-only run seeded two replays in 26s; the comparison ran two replays and two judgments in 54s; the strengthened `engine-only` check reused the replies and ran two judgments in 20s. Both baselines held 2/12 facts; candidates held 11/12 and 12/12. All three selected commands exited 0. The final Opus `sentences` judgment rejects the standalone `Pick one:` line required by Design 1. That unresolved judgment remains for reviewer adjudication, not a claimed all-facts pass.

These older rows retain historical evidence, not coverage of this repair. The all-none rows were recorded at `for: 8b65e167301569e59ea6977c0bb1e0099fe49fe3151238db6cdc6629af06ed8a`; the other rows were reported at the preceding bundle SHA above. The old flag-replies rows precede this repair's expanded 19-fact sample.

| sample | model | baseline -> candidate facts held | verdict | prior sample exit |
|---|---|---|---|---|
| flag-replies | anthropic/claude-opus-5-5 | 2/18 -> 18/18 | improved | 0 |
| flag-replies | github-copilot/gpt-6.1-sol | 2/18 -> 18/18 | improved | 0 |
| full-council | anthropic/claude-opus-5-5 | candidate 5/5 | improved | 0 |
| full-council | github-copilot/gpt-6.1-sol | candidate 5/5 | improved | 0 |
| partial-coverage | anthropic/claude-opus-5-5 | candidate 3/5; confirmation 5/5 | inconclusive | 1 |
| partial-coverage | github-copilot/gpt-6.1-sol | candidate 5/5 | unchanged | 1 |
| drafted-rows-block | anthropic/claude-opus-5-5 | candidate 4/4 | improved | 0 |
| drafted-rows-block | github-copilot/gpt-6.1-sol | candidate 4/4 | improved | 0 |
| all-none | anthropic/claude-opus-5-5 | 4/7 -> 7/7 | improved | 0 |
| all-none | github-copilot/gpt-6.1-sol | 4/7 -> 7/7 | improved | 0 |

Prior residual failure, not rerun: partial-coverage / anthropic/claude-opus-5-5 failed f1 and f5 in its primary reply. It did not paste the briefing and refused approval: "**Briefing:** the summary is in hand and will be pasted verbatim." and "I cannot render the gate faithfully, so I am not treating the reply `2` as an approval." It asked for the committed acceptance section, spec/worktree paths and PR-subject status absent from that legacy case. Confirmation held all five facts, so that prior result remains inconclusive, not passing. This repair changes neither that sample nor its records and makes no target-wide pass claim.

## Feedback

- flag-replies / anthropic/claude-opus-5-5: After loses nothing Before had: missing-row is the only fact Before satisfied (one row question each for flag-alone and budget-alone, no writes), and After keeps it. Before decoded every reply against a six-option gate with `;` suffixes, so it gave bare `1` and `approve` a `none` grant, rejected all `--flag` replies, accepted the worded stop/grant replies and `5`/`6`, and never printed the echo or a carrier line. After moves the remaining facts by adopting the four-row grammar: bare and approve replies inherit the shared G, `approve` and plain prose print the literal `Taking "approve" as option 2 - loop engine`, and the three allowance cases print `run allowance: 6` as an unwrapped line directly above `/skill:loop-implementation`. Rejections sit under one no-write statement, each with a single question quoting the offending token and naming the accepting row or flag. Three holds are thin and worth hardening in the wording. For label-funded and plan-stop-funded, `stop on amends` plus `Funding: 3` only implies the distinction; have the skill say outright that the budget funds three extra fix rounds and grants no auto-apply permission. For the allowance cases, `goes to the ledger only` should become an explicit `not written to the spec or settings`. For loop-label-allowance and label-funded, state that the label resolves to row 2 or row 1 rather than leaving it implied.
- flag-replies / github-copilot/gpt-6.1-sol: After moved nearly every fact because it adopts the four-row contract outright, where Before had replied under the old 1/2/4/5/6 numbering and treated the flags as undefined. Row-free approval prose and bare approve now resolve to the rendered recommendation with the literal 'Taking "approve" as option 2 - loop engine' echo, the default grant G and Engine loop. Flags are decoded into exact header values (none, fund 3 fix rounds, G, and Funded G written out in full), and the allowance carrier appears as an unwrapped 'run allowance: 6' line directly above /skill:loop-implementation. Each rejection asks a single question that quotes the offending token and names the accepting row or flag. The two facts Before already kept (malformed, missing-row) held only loosely, since its questions quoted the tokens and asked for an option but in the old syntax; After keeps them cleanly. To keep all of this stable, retain the single shared no-write sentence for rejections, the one-question-per-case form that quotes the exact token, and the full G and Funded G expansions. Three points rest on inference and would be safer stated outright: that 'persist allowance 6 only in the ledger' means never the spec or settings, that 'Permission: none' on the funded-stop cases means no auto-apply permission, and that 'loop engine' resolves to row 2 in loop-label-allowance.

exit: 0
