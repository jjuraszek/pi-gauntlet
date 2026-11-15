# eval report: spec-gate (partial run: flag-replies)

for: 958814567d03516a4f7f622e366e95465fbad02d1857943813f6ae0055edefae

wall: 86s

## Change

Migrate full-council's plain plan approval and drafted-rows-block's rendered menu to the four-row contract, preserving briefing, audit, drafted-row and continuation assertions. Leave partial-coverage's case and facts unchanged: its f5 already says reply 2 grants auto-apply amendments. Extend flag-replies with bare defaults, recommended approve with opt-out, label selectors, combined loop opt-out/allowance, and each rejected-reply class. Share exact G definitions and the approval recipe to keep the independent table within the existing target cap; require standalone unwrapped plain-text allowance carriers directly before the loop invocation for digit and label selectors. Include the exact loop engine --allowance=6 reply with the default grant, loop engine and ledger-only allowance; backtick-wrapped carriers do not satisfy these facts. Run only full-council, partial-coverage, drafted-rows-block and flag-replies, seeding baseline first wherever case text changed. Preserve other records and partial-report rows. These selected tool-free narrations do not prove live persistence or target-wide coverage.

Resolve bare `approve` from the just-rendered recommendation and print `Taking "approve" as option <n> - <label>` before applying the selected row's bare-digit action. Retain the rendered recommendation rather than recomputing it. Plan and loop approvals inherit the default amendment grant; draft-PR approval publishes and stops instead of starting implementation.

Extend all-none with grounded loop-gate observations and independent plan and draft-PR continuation snapshots. Run only spec-gate/all-none against base 855e872a42f9cac7a795704f3e0b383b182950ab. This text replay checks the echo and narrated actions, not live persistence or publication. Preserve other sample records; coverage is partial. Keep scripts/brainstorming-bare-approve.test.mjs beside its deterministic contract siblings; paid replay stays outside CI.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| flag-replies | anthropic/claude-opus-5-5 | improved | 26446 | defaults: fails -> holds (unplanned improvement); approve-stop: fails -> holds (unplanned improvement); label-funded: fails -> holds (unplanned improvement); loop-stop-allowance: fails -> holds (unplanned improvement); wrong-engine: fails -> holds (unplanned improvement); malformed: holds -> holds (held); missing-row: holds -> holds (held); old-suffix: fails -> holds (unplanned improvement); removed: fails -> holds (unplanned improvement); worded-grant: fails -> holds (unplanned improvement); worded-stop: fails -> holds (unplanned improvement); worded-funding: fails -> holds (unplanned improvement); loop-allowance: fails -> holds (unplanned improvement); loop-label-allowance: fails -> holds (unplanned improvement); plan-stop: fails -> holds (unplanned improvement); loop-stop: fails -> holds (unplanned improvement); plan-stop-funded: fails -> holds (unplanned improvement); plan-funded: fails -> holds (unplanned improvement) |
| flag-replies | github-copilot/gpt-6.1-sol | improved | 23238 | defaults: fails -> holds (unplanned improvement); approve-stop: fails -> holds (unplanned improvement); label-funded: fails -> holds (unplanned improvement); loop-stop-allowance: fails -> holds (unplanned improvement); wrong-engine: fails -> holds (unplanned improvement); malformed: holds -> holds (held); missing-row: holds -> holds (held); old-suffix: fails -> holds (unplanned improvement); removed: fails -> holds (unplanned improvement); worded-grant: fails -> holds (unplanned improvement); worded-stop: fails -> holds (unplanned improvement); worded-funding: fails -> holds (unplanned improvement); loop-allowance: fails -> holds (unplanned improvement); loop-label-allowance: fails -> holds (unplanned improvement); plan-stop: fails -> holds (unplanned improvement); loop-stop: fails -> holds (unplanned improvement); plan-stop-funded: fails -> holds (unplanned improvement); plan-funded: fails -> holds (unplanned improvement) |

## Selected repair evidence

Only `flag-replies` ran for this repair. Its case adds `loop engine --allowance=6` and requires an unwrapped plain-text carrier immediately before the loop invocation for every allowance reply. Both candidates hold 18/18 facts; both baselines hold 2/18. The literal deterministic carrier assertions pass without optional backticks. The run refreshed both arms because the case input changed; no bundle changed, so neither baseline-only seeding nor judgment-only refresh was needed.

Observed command: `timeout -k 30 600 node eval/run.mjs spec-gate flag-replies`.
Observed output: `spec-gate: improved (report.md written; replay 4, judge 2, confirm 0, wall 86s)`; exit 0.

## Retained prior partial-report rows (not rerun)

These rows preserve the preceding report's evidence, not coverage of this repair. Their result records are unchanged. The all-none rows retain their prior evidence at `for: 8b65e167301569e59ea6977c0bb1e0099fe49fe3151238db6cdc6629af06ed8a`; the other rows were reported at the current bundle SHA.

| sample | model | facts held | verdict | prior sample exit |
|---|---|---|---|---|
| full-council | anthropic/claude-opus-5-5 | 5/5 | improved | 0 |
| full-council | github-copilot/gpt-6.1-sol | 5/5 | improved | 0 |
| partial-coverage | anthropic/claude-opus-5-5 | 3/5; confirmation 5/5 | inconclusive | 1 |
| partial-coverage | github-copilot/gpt-6.1-sol | 5/5 | unchanged | 1 |
| drafted-rows-block | anthropic/claude-opus-5-5 | 4/4 | improved | 0 |
| drafted-rows-block | github-copilot/gpt-6.1-sol | 4/4 | improved | 0 |

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| all-none | anthropic/claude-opus-5-5 | improved | 11467 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f5: fails -> holds (intended change); plan: fails -> holds (intended change); draft: fails -> holds (intended change) |
| all-none | github-copilot/gpt-6.1-sol | improved | 9575 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f5: fails -> holds (intended change); plan: fails -> holds (intended change); draft: fails -> holds (intended change) |

Prior residual failure, not rerun: partial-coverage / anthropic/claude-opus-5-5 failed f1 and f5 in its primary reply. It did not paste the briefing and refused approval: "**Briefing:** the summary is in hand and will be pasted verbatim." and "I cannot render the gate faithfully, so I am not treating the reply `2` as an approval." It asked for the committed acceptance section, spec/worktree paths and PR-subject status absent from that legacy case. Confirmation held all five facts, so that prior result remains inconclusive, not passing. This repair changes neither that sample nor its records and makes no target-wide pass claim.

## Feedback

- flag-replies / anthropic/claude-opus-5-5: No fact that Before kept was lost in After: malformed and missing-row hold in both, and the other sixteen move from fails to holds. Before decoded every reply against a six-option gate with `;` suffixes and no recommendation, so it rejected the flag replies, gave bare `1` and `approve` no grant, accepted the worded and removed-row replies, and never emitted a carrier line. After decodes against the four-row flag contract: bare and approve replies inherit the full quoted G, the `Taking "approve" as option 2 - loop engine` echo is printed, `--amends-stop` persists `none`, funded G is quoted in full once, and `run allowance: 6` sits as a bare line directly above `/skill:loop-implementation`. Each rejection asks one question that quotes the offending token and names the accepting row or flag. Three passes are thin and worth making explicit in the wording. First, loop-label-allowance never says the label `loop engine` resolves to row 2. Second, label-funded and plan-stop-funded say only "Permission is none" rather than stating that funding grants no auto-apply permission. Third, the no-write-of-allowance statement is scoped to "a bare loop approval", so loop-stop relies on the reader extending it. Note that the Expected to move list names all-none facts (f5, plan, draft) that are not among this case's facts, so this case says nothing about them.
- flag-replies / github-copilot/gpt-6.1-sol: After moved sixteen facts from fails to holds and lost none: Before still read the replies against the old 1/2/4/5/6 menu, so it treated every flag as a typo, accepted old suffixes, removed digits and prose grants, and gave bare 1 and approve no grant. After adopts the four-row contract: bare plan, bare loop and approve inherit the shared G, approve prints the echo line, and --amends-stop, --fund-rounds and --allowance decode to the right header values. It shows the full G and funded G once, puts the bare run allowance: 6 line directly above /skill:loop-implementation, and gives each rejection one question quoting the offending token and naming the accepting row or flag under a single no-writes statement. The two facts Before already kept (malformed, missing-row) still hold. Several passes rest on terse wording that a stricter reader could dispute, so tighten three spots: in loop-label-allowance, say that the label loop engine resolves to row 2; in label-funded and plan-stop-funded, replace "Permission: none" with "no auto-apply amendment permission; budget only"; and restate in the loop-allowance cases that the allowance is never written to spec or settings rather than relying only on the shared paragraph. Keep the G3 shorthand accompanied by the note that it is substituted as one physical line, and keep the carrier lines free of bullets, backticks and blank lines.

exit: 0
