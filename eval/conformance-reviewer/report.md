# eval report: conformance-reviewer (partial run: prompt-stage-sentence)

for: 45d48bd3ee0afb7ecc98812c2f6e7bc614d3ef12927593316fbdc0dd0f55a965

wall: 19s

## Change

Exclude delivery-stage clauses from conformance requirements without excluding file deliverables on the same leg verification line. The leg sample keeps two delivered behaviors and a delivered bundle clause in coverage, and reports CONFORMS without quoting or commenting on the PR gate or ship evidence.

Exclude standalone stage sentences from Design, Errors and edge cases, and Tests whether a pull request exists or not. Keep one delivered requirement for the behavior half of each mixed acceptance row, with only the behavior in its origin quote. The stage-only-sentences and mixed-row samples exercise semantic classification and report omission, which token checks alone cannot prove. The prompt-stage-sentence sample omits a prompt-only CI sentence from the spec and requires no prompt-origin requirement, drift entry or skip note for it. Coverage is limited to these four samples.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| prompt-stage-sentence | anthropic/claude-opus-5-5 | improved | 5767 | f1: fails -> holds (intended change); f3: fails -> holds (intended change); f2: fails -> holds (intended change); f4: holds -> holds (held) |
| prompt-stage-sentence | github-copilot/gpt-6.1-sol | improved | 4228 | f1: fails -> holds (intended change); f3: holds -> holds (intended but unchanged); f2: holds -> holds (intended but unchanged); f4: holds -> holds (held) |

## Feedback

- prompt-stage-sentence / anthropic/claude-opus-5-5: The After wording moved both facts as intended. Before turned the prompt's "Both pull requests pass CI." into a MISSING gap G1 with a prompt-origin quote, a gap block, a GAPS verdict, a confidence note about CI and an origin-drift entry, so f1 and f3 both failed. After contains no row, gap, quote, paraphrase or skip note for that sentence and reports origin drift as none, while the trimming behavior stays DELIVERED with evidence at src/label.mjs:2, so both hold. One small side effect: After splits the single trimming behavior into two rows (R1 from Design, R2 from Goal) with spec-only origins, where Before had one row that also cited the prompt's trimming sentence. This breaks neither fact, but if you want one requirement per behavior, add wording that Goal and Design statements of the same behavior merge into one requirement, and that the behavior clause of the prompt may still be cited as a co-origin while stage sentences are never quoted. Keep the current exclusion wording for standalone stage sentences in the prompt, since that is what removed the gap, the drift entry and all mention of the CI sentence.
- prompt-stage-sentence / github-copilot/gpt-6.1-sol: In Before, the report added a trailing note that quoted the prompt's "Both pull requests pass CI" sentence and explained it as context with CI unverified, which breaks f1's requirement that the excluded sentence is not quoted, paraphrased or explained anywhere; After drops that note entirely, so f1 now holds. f3 holds in both: origin drift is "none" and the trimming requirement is DELIVERED with evidence at src/label.mjs:2. To keep this, the After wording should continue to state that delivery-stage sentences are silently excluded (no coverage row, no drift entry, no skip note, no commentary) while explicitly keeping the behavior requirement with its spec origin quote and file:line evidence; avoid any instruction that invites a "not verified" or "treated as context" remark, since that reintroduces the mention that failed in Before.

exit: 0
