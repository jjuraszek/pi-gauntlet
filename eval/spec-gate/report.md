# eval report: spec-gate (partial run: all-none)

for: 8b65e167301569e59ea6977c0bb1e0099fe49fe3151238db6cdc6629af06ed8a

wall: 34s

## Change

Resolve bare `approve` from the just-rendered recommendation and print `Taking "approve" as option <n> - <label>` before applying the selected row's bare-digit action. Retain the rendered recommendation rather than recomputing it. Plan and loop approvals inherit the default amendment grant; draft-PR approval publishes and stops instead of starting implementation.

Extend all-none with grounded loop-gate observations and independent plan and draft-PR continuation snapshots. Run only spec-gate/all-none against base 855e872a42f9cac7a795704f3e0b383b182950ab. This text replay checks the echo and narrated actions, not live persistence or publication. Preserve other sample records; coverage is partial. Keep scripts/brainstorming-bare-approve.test.mjs beside its deterministic contract siblings; paid replay stays outside CI.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| all-none | anthropic/claude-opus-5-5 | improved | 11467 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f5: fails -> holds (intended change); plan: fails -> holds (intended change); draft: fails -> holds (intended change) |
| all-none | github-copilot/gpt-6.1-sol | improved | 9575 | f1: holds -> holds (held); f2: holds -> holds (held); f3: holds -> holds (held); f4: holds -> holds (held); f5: fails -> holds (intended change); plan: fails -> holds (intended change); draft: fails -> holds (intended change) |

## Feedback

- all-none / anthropic/claude-opus-5-5: All three expected facts moved, and nothing Before kept was lost. After prints the exact `Taking "approve" as option <n> - <label>` echo ahead of each action. On the primary gate it then writes the full auto-apply grant text with `Engine: loop`, uses the settings allowance of 4, completes brainstorm and invokes loop-implementation. On the plan snapshot it writes the default grant with `Engine: waves` and invokes writing-plans. On the draft snapshot it publishes the draft PR and stops, with no engine or grant written. Before instead treated the primary `approve` as no-grant option 1 and asked a clarifying question on both snapshots. The briefing is still verbatim, the council counts line is intact, row 3 still shows the council audit, and no per-cluster disposition lines appear. Three wording points are fragile. First, the plan snapshot says it persists "the default grant `G` verbatim", which leaks an internal placeholder; have it spell out the grant text or call it the full default auto-apply amendment grant, as the primary reply does. Second, the draft snapshot's "I chose this route because context is at 31.0%" reads close to re-deriving the recommendation; phrase it as following the already-rendered recommendation, for example "row 4 was the rendered recommendation", so retention is unambiguous. Third, row 3 was relabelled "council explanation"; keeping the word "dispositions" in that row would make f3 robust to a stricter reading.
- all-none / github-copilot/gpt-6.1-sol: The three expected facts moved from fails to holds, and nothing Before kept was lost. In After, every bare `approve` prints the exact `Taking "approve" as option <n> - <label>` echo before acting. The primary and plan replies persist the full auto-apply amendment grant with `**Engine:** loop` and `**Engine:** waves`, then invoke loop-implementation and writing-plans respectively. The draft reply publishes and stops without starting either engine, and neither continuation reconsiders its rendered recommendation. Before failed all three: the primary reply persisted `**Amend-grant:** none` with waves and writing-plans, and the plan and draft replies paraphrased the selection without the echo, with no grant in the plan case. The briefing, the Council counts line and the absence of per-cluster lines are unchanged. The one fragile spot is row 3: it is now labelled `council explanation: show the council audit`, which still reads as showing council dispositions but no longer uses that word. Putting "dispositions" back in the row text (for example `show the council dispositions audit`) would make f3 robust, and keeping the echo instruction literal and placed before the action narration protects the three moved facts.

exit: 0
