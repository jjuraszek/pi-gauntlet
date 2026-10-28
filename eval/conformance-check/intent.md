for: 0520d3c0b96de923e1884d225da8a91aebc913143e9fc7edf77c33876e7daa8d

## Change
Start proactive cap-exhaustion escalation with the step-6 gate marker and ask for additional funding, including Convergence exhaustion; keep verification incomplete. Carried-open menus put their marker before item 1; clean closure uses the Step 4 marker before summaries.

Replace carried-open token menus with numbered decision briefs: place the unresolved problem immediately after the gate marker, letter available named options with consequences, and show either a lettered recommendation or No recommendation - pick one. Bare 1 applies recommendations and re-asks unanswered no-recommendation items by number. Continuation cases replay only the next response: no-recommendation-reask stops at the focused re-ask, and no-recommendation-execute continues after the custom answer through execution scheduling and the re-audit barrier. Follow-up wording fixes keep the Custom line numberless, pluralize the count, include the re-ask clause in the reply instruction, echo custom free text verbatim in Recorded, and make the zero-gap CONFORMS fall-through render Step 4's menu in full, options included, without stopping at Step 4's question line. In in-scope-gap, f4 now pins the clarify-before-execute and decide-everything-first properties. The re-audit barrier's render-level mention left the menu because Custom shows a one-line consequence by design; its behavior coverage moves to no-recommendation-execute, which requires re-auditing the updated state before any CONFORMS claim or Step 4 menu. The execute-order barrier remains required. The lettered-pick fix preserves named dispositions on recommended: none items: a letter selects the shown option, while only free text records custom(<text>).

All existing samples (deferred-with-ref, deviates, directional-dependency, elsewhere-settled, in-scope-gap, mixed, no-dispositions, no-recommendation-render, no-recommendation-reask, no-recommendation-execute) regenerate against the new assembly and replay instruction. Their existing conformance facts remain required; changed menu wording alone does not imply a fact transition.

## Expected to move
- gate-line-first/gate-first: fails -> holds - Cap exhaustion opens the funding gate independently of runtime errors.

- deferred-with-ref/f1: holds -> holds - Settled deferrals still produce no decisions under the new assembly.
- deviates/f5: fails -> holds - the zero-gap fall-through strengthening (Step 4 menu renders in full, options included, never stopping at the question line) fixes the baseline's truncation at the question line; the candidate renders the full option list.
- directional-dependency/f5: holds -> holds - The delivered disabled-button clause still creates no additional gap.
- elsewhere-settled/f1: holds -> holds - Recorded elsewhere attribution still produces no decisions.
- in-scope-gap/f3: fails -> holds - Unavailable fix prerequisites are named rather than silently replacing the reviewer's recommendation.
- in-scope-gap/f4: fails -> holds - The render-level fact pins clarification before execution and no execution before every item is decided; no-recommendation-execute/f3 preserves the post-fix re-audit barrier at the execution boundary.
- mixed/f4: holds -> holds - The pluralized count header still reports exactly one decision.
- no-dispositions/f3: holds -> holds - A conforming report still produces no decisions.

- no-recommendation-render/f1: fails -> holds - The first sentence after the gate marker states the unresolved problem instead of metadata.
- no-recommendation-render/f2: fails -> holds - Available options receive letters and consequences even without a recommendation.
- no-recommendation-render/f3: fails -> holds - The menu explicitly names the absent recommendation.
- no-recommendation-render/f4: fails -> holds - The prompt replaces bare tokens and handle assignments with numbered replies.
- no-recommendation-reask/f1: fails -> holds - Bare 1 re-asks the unanswered item by number instead of rejecting it.
- no-recommendation-reask/f2: fails -> holds - The undecided item blocks execution and Step 4.
- no-recommendation-reask/f3: fails -> holds - The focused re-ask uses numbered replies, not handle assignments.
- no-recommendation-execute/f1: holds -> holds - A concrete numbered free-text answer is accepted as the custom disposition without another choice prompt.
- no-recommendation-execute/f2: fails -> holds - The custom disposition record echoes the user's free text verbatim.
- no-recommendation-execute/f3: holds -> holds - The execution continuation preserves the re-audit barrier after state-changing work and before conformance or Step 4.
- no-recommendation-execute/f4: holds -> holds - Handle assignments stay confined to the record, never the operator prompt.
- no-recommendation-letter/f1: holds -> holds - The focused re-ask accepts option B without demanding a custom effect.
- no-recommendation-letter/f2: holds -> holds - A lettered rescope pick records the named disposition, never custom.
- no-recommendation-letter/f3: holds -> holds - Rescoping amends the spec and re-audits against it before conformance or Step 4.
- no-recommendation-letter/f4: holds -> holds - Handle assignments remain record-only.
