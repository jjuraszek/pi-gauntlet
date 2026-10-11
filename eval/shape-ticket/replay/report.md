# Historical overlap evidence report

## Outcome and delivery boundary

Both saved full comparisons completed 16 cells and failed strict acceptance (exit 1): initial candidate 2/8 passing, revised candidate 4/8 passing. Neither is a passing historical evaluation. The revised run uses an amended action-versus-readiness rubric and repaired fixture behavior; its score is not a statistically measured improvement over the initial run. Frozen labels, failed facts, invalid judgments, and original outputs remain unchanged.

The approved first-version delivery bar is separate: source-based review of four saved revised candidate overlap responses, repair of clear recommended duplication, a focused supplied-evidence regression, and normal package checks. That review found one clear duplicate recommendation and three acceptable useful enrichments. Commit `f91bb2ecc9339143e944e869135cb234ae176b97` clarifies the owning rule sentence and has a COMPLIANT source/spec review. The focused regression holds before and after on both models; it is a guard, not measured improvement. Historical responses were not regenerated after this fix. Package verification remains a separate delivery requirement; this documentation task neither runs nor attests it.

## Frozen binding and exposure

| Setting | Observed value |
|---|---|
| Raw manifest SHA-256 (independently checked against file bytes) | `e788684e4755609836de92d24e67ccb7b76172f5ffd357c965fcb3e44b54a85d` |
| Baseline source | `c10ba7c5eaf867280a2b21d70d612c2579ecafcf` |
| Initial source observed at run | `b580e6dce120b3c342c60f36e5790926c5c105b7` |
| Revised source recorded in enclosing run metadata | `9287ab368d8a5a2ed71c16a4465de15cf2fb83f6` |
| Baseline instruction SHA-256, both runs | `e65944321e6f8139bc833e60561f1c7501ed8089786b412e69e4bc9fa7e2f993` |
| Candidate instruction SHA-256, both runs | `ca0a0e50d9790e5cefa7c386597115796a79c273a57e0ecb9776cfd4154b8608` |
| Replay models | `anthropic/claude-opus-5-5` (Opus); `github-copilot/gpt-6.1-sol` (GPT) |
| Judge | `anthropic-fable/claude-fable-5-1` |
| Thinking / repetitions | medium / 1 per case, model, arm |
| Matrix per run | 4 cases x 2 models x 2 arms = 16 completed cells; not partial |
| Initial summed cell elapsed | 1,262,385 ms = 21.04 minutes |
| Revised summed cell elapsed | 1,183,307 ms = 19.72 minutes |

The earlier private binding intended two repetitions; the approved redraw and actual run metadata use one. Source revisions identify different harness/rubric states even though the assembled instruction hashes match. The revised run was a separately authorized additional comparison after exposure to the initial results, not an old-score regrade. No fresh matrix is reported or proposed here.

Cases are current-snapshot re-filing exercises, not reconstruction of the original historical backlog. All four share one workspace and are not independent populations. Pools contain 3, 5, 3, and 5 snapshots respectively; the incoming ticket is excluded from its own pool. One independent bug incoming is already completed: create describes the bounded exercise, not an instruction to file a duplicate live ticket. An independent feature prompt retains a dangling attached-plan reference and unrelated source identifiers; neither was silently repaired. Prior selection/review and replay exposure preclude an unbiased holdout claim.

## Strict results, unchanged

Aliases A-overlap, A-independent, B-overlap, B-independent below mean `history-a-overlap`, `history-a-independent`, `history-b-overlap`, `history-b-independent`. Frozen expectations remain no-write for both overlaps and create for both independent cases. Facts are recorded in original order: concern-identity, then no-new-evidence for A-overlap; all other cases have concern-identity alone. H = holds, F = fails, I = invalid. These historical fact judgments are diagnostics, not new product judgments.

Failure codes preserve the saved categories: R = recommendation-outcome; F = fact; G = regression; O = search-read-recommendation-order; C = invariant-failure; I = invalid-cell. OK means saved strict cell pass. Usage is available replay numeric usage in the order input/output/cacheRead/cacheWrite/totalTokens; it is not billing or complete judge usage. Elapsed includes the cell's judging boundary, not just generation. All cells completed within the ten-minute cell deadline.

### Initial comparison

| Cell | Case | Model | Arm | Action | Facts | Strict result | Elapsed ms | Usage |
|---|---|---|---|---|---|---|---|---|
| 1 | A-overlap | Opus | baseline | create | H,H | R | 62768 | 2/1778/31164/656/33600 |
| 2 | A-overlap | Opus | candidate | park | H,F | R,F,G | 98642 | 2/4809/23739/2168/30718 |
| 3 | A-overlap | GPT | baseline | park | H,H | R,O | 46644 | 3/295/11860/5999/18157 |
| 4 | A-overlap | GPT | candidate | create | F,F | R,F,O,G | 66378 | 3/828/14381/32/15244 |
| 5 | A-independent | Opus | baseline | create | H | C | 150678 | 2/5435/45004/5059/55500 |
| 6 | A-independent | Opus | candidate | park | H | R | 142490 | 2/9899/31176/585/41662 |
| 7 | A-independent | GPT | baseline | create | H | C | 37873 | 3/424/30114/536/31077 |
| 8 | A-independent | GPT | candidate | park | H | R | 45998 | 3/141/13836/8815/22795 |
| 9 | B-overlap | Opus | baseline | enrich | H | R | 57235 | 2/1840/30529/480/32851 |
| 10 | B-overlap | Opus | candidate | no-write | H | OK | 109137 | 2/6640/34188/267/41097 |
| 11 | B-overlap | GPT | baseline | enrich | H | R | 42240 | 3/394/18628/53/19078 |
| 12 | B-overlap | GPT | candidate | create | H | R,O | 68424 | 3/1385/14282/8702/24372 |
| 13 | B-independent | Opus | baseline | enrich | H | R | 108139 | 2/7482/21522/11511/40517 |
| 14 | B-independent | Opus | candidate | create | H | OK | 86946 | 2/6185/22752/128/29067 |
| 15 | B-independent | GPT | baseline | park | H | R | 49275 | 3/478/14656/5551/20688 |
| 16 | B-independent | GPT | candidate | park | H | R | 89518 | 3/1260/22199/269/23731 |

Aggregate available usage: 40 input, 49,273 output, 380,030 cacheRead, 50,811 cacheWrite, 480,154 totalTokens. Complete = true; accepted = false; passingCandidateCells = 2; exit = 1.

### Revised comparison

The rubric grades recommended ticket action independently of filing readiness and requires successful search. A blocked new-ticket proposal is still create; a compatible existing-ticket addition is still enrich. The repaired fixture removes unsupported-call failures, not every other read error. All eight candidate concern-identity facts hold, while A-overlap's two no-new-evidence facts still fail. Baseline cell 3 has invalid fact judgments; it remains invalid and is not inferred to pass.

| Cell | Case | Model | Arm | Action | Facts | Strict result | Elapsed ms | Usage |
|---|---|---|---|---|---|---|---|---|
| 1 | A-overlap | Opus | baseline | create | H,H | R | 50855 | 2/1925/19037/1375/22339 |
| 2 | A-overlap | Opus | candidate | create | H,F | R,F,G | 89941 | 2/6718/22286/1407/30413 |
| 3 | A-overlap | GPT | baseline | create | I,I | R,F,I | 35653 | 3/293/27293/484/28073 |
| 4 | A-overlap | GPT | candidate | enrich | H,F | R,F | 81698 | 3/1169/15659/112/16943 |
| 5 | A-independent | Opus | baseline | create | H | C | 125757 | 2/10181/28515/1155/39853 |
| 6 | A-independent | Opus | candidate | create | H | OK | 109530 | 2/7937/28041/545/36525 |
| 7 | A-independent | GPT | baseline | create | H | OK | 37812 | 3/420/24535/2266/27224 |
| 8 | A-independent | GPT | candidate | create | H | OK | 57475 | 3/339/22766/147/23255 |
| 9 | B-overlap | Opus | baseline | no-write | H | OK | 46466 | 2/1565/30454/527/32548 |
| 10 | B-overlap | Opus | candidate | enrich | H | R | 107220 | 2/6726/33721/220/40669 |
| 11 | B-overlap | GPT | baseline | enrich | H | R | 33634 | 3/234/27299/119/27655 |
| 12 | B-overlap | GPT | candidate | enrich | H | R | 81826 | 3/1662/20945/316/22926 |
| 13 | B-independent | Opus | baseline | enrich | H | R,C | 77794 | 2/2141/26885/7578/36606 |
| 14 | B-independent | Opus | candidate | create | H | OK | 121419 | 2/7752/41823/7723/57300 |
| 15 | B-independent | GPT | baseline | enrich | H | R,C | 42796 | 3/376/29843/746/30968 |
| 16 | B-independent | GPT | candidate | create | H | OK | 83431 | 3/1032/31942/97/33074 |

Aggregate available usage: 40 input, 50,470 output, 431,044 cacheRead, 24,817 cacheWrite, 506,371 totalTokens. Complete = true; accepted = false; passingCandidateCells = 4; exit = 1.

## Retrieval and protected tool surface

Both runs inventory caps and search-before-read as evaluated, no-live-writers as evaluated probe isolation, and approved-payload as not-evaluated. The initial run retains ordering failures in cells 3, 4, and 12 and invariant failures in cells 5 and 7. The revised run has no saved ordering failure, and every candidate satisfies the retained read-only invariants; baseline cells 5, 13, and 15 still fail caps. Their search counts are 7, 9, and 8 against the six-search bound. Limits are first-iteration choices, not calibrated measurements. Summed cell time includes output and judging and must not be confused with the 120-second discovery budget.

Revised raw traces contain zero unsupported results, but retain invalid-body-bytes and not-discovered read failures. Retrieval is not the recommendation verdict: the four revised candidate overlap traces successfully searched and read the covering source before the final response, yet all four fail strict no-write expectations. The source reviewer verified full matching body/comments/metadata without truncation for the successful covering reads and matching frozen prompts/outputs. There was no recorded mutation attempt in these four reviewed traces.

Only instruction-map reads, fixture search/read/read-document, controlled clock, and an unavailable roast stub are exposed. Builtin shell/filesystem/network tools, MCP, extensions, and resource discovery are isolated. Writes are unavailable/rejected rather than simulated. This establishes a protected read-only probe surface, not live approval/write sequence safety, source revalidation, or concurrency uniqueness.

## Source-based four-response delivery review

This review uses the saved revised responses and full frozen source, not the strict labels as product truth. The independent reviewer checked complete prompts, complete responses, covering bodies and comments, related consolidation evidence, and trace/source bindings. The original folded source was not separately readable; its unavailable discussion is not presumed known. Baseline and independent responses were not newly source-reviewed in this four-response review.

| Revised cell | Actual recommendation | Supported addition / unresolved evidence | Disposition |
|---|---|---|---|
| 2 / A-overlap / Opus | Recommend a new sibling because the existing work is closed and the ask adds scope | Core rule and examples already covered; companion-checker parity, empty-input behavior, and documentation are compatible additions. No new run/version establishes a post-completion regression. | Major: clear recommended duplication. Repair owning rule sentence; not merely a create-anyway alternative. |
| 4 / A-overlap / GPT | Recommend an existing-ticket evidence comment, preserving body/status | Useful parity, empty-input, and documentation questions; current regression remains unverified. Closing note does not establish the requested empty-input result. | Acceptable; redundant threshold question is a minor nit, not a blocker. |
| 10 / B-overlap / Opus | Recommend additive verification checks and an evidence comment on the unstarted umbrella | Concrete summary wording, regression setup, transcript and code pointers make the covered incident actionable; recorded implementation dependency remains intact. | Acceptable; some repeated verification wording is harmless. No recommended sibling. |
| 12 / B-overlap / GPT | Recommend an evidence comment if useful, otherwise no write | Preserve additional summary/regression detail and guard, without changing the body or implementation dependency. | Acceptable; duplicate-scope create-anyway is explicitly an override. |

The frozen A-overlap fact about a blind no-write settlement is a test assertion, not proof that all requested additions exist in the covering source. Both strict fact failures remain recorded; the practical review does not regrade them. Compatible useful additions on the existing ticket meet the approved delivery bar even when the strict action enum is enrich instead of no-write.

## Focused repair and regression

The only product defect selected for repair is the cell 2 recommendation. The owning sentence in `skills/shape-ticket/reference/overlap-check.md` now says: "For a repeated defect, neither completion nor compatible same-concern additions establishes a new concern. Without evidence distinguishing a new regression, recommend useful existing-ticket additions or no write, retaining create-anyway as an override."

The committed focused `closed-concern-additions` sample supplies synthetic closed-work evidence plus parity, empty-input, and documentation additions, without a new run/version. Existing-concern, unverified-regression, and create-override all hold before and after for both frozen models. The complete six-cell shape-ticket text-target report is unchanged with exit 0, and both older samples retain all facts. Its bundle-free assembly hash is `71d84d8b0445a755f89926c0fb2706f2c373fba8ef3a5416c75261dde14ee89a`; only the new sample bundles the overlap reference. See `eval/shape-ticket/report.md` and its committed results for this distinct no-tool evidence.

The first baseline capture exceeded the existing word cap; a response budget was added to the new synthetic case before successful recapture. This is disclosed preparation, not a historical rerun. The focused baseline already holds, so no historical miss reproduction or measured behavioral improvement is claimed. A minor residual wording risk remains in the first model's non-recommended create-anyway payload: it restates the completed defect in present tense and repeats completed criteria. Its recommended action preserves the lack of distinguishing regression evidence, and the judge still holds the fact. No tuning to perfect strict scores followed.

## Native evidence and residual proof limits

Captured GitHub evidence contains one title-disjoint body-restricted search hit; the separately fetched known issue confirms the term in its body and absent from its title. Captured dedicated Linear evidence contains one non-title hit, no next page, and a separate current full read confirming the term in the description but not the title or returned comments. The captured command/precondition/search/read/help artifacts were read, not recollected. Linear full-text help does not enumerate indexed fields: hidden/unreturned fields, comments, and attachment text remain possible explanations. Body-only indexed-field attribution and full-body recall remain inconclusive. Custom native mapping behavior is untested; the four replay cases all use the frozen Linear mapping, not native search.

Selection preparation consumed seven searches and 17 fetches; the separate GitHub and dedicated Linear probes each add one search and one fetch, totaling nine searches and 19 fetches. Local help/version captures are not retrieval calls. This exceeded the initial allowance and is not described as within it. No sweep or export occurred.

B-independent retains Moderate-high confidence and the weaker umbrella-enrichment alternative; settlement does not erase that uncertainty. A-overlap retains uncertainty around minor extras, and the feature case retains its missing-plan/source-identifier limitations. The small shared-workspace pools and prior exposure support neither whole-backlog recall nor unbiased holdout, variance, production accuracy, or statistical superiority claims.

No underlying application reproduction proves persistence of the closed defect. Read-only evidence does not execute approved enrichment, create-anyway selection, repair/continuation, mid-review edits, lost-response handling, live source revalidation, partial-write recovery, or cross-session locking. Independent sessions can still propose create before either writes. Protected workflows, bypass, menu payloads, and write-related instructions require source review rather than being inferred from these cells. Approved-payload remains not evaluated, never a pass.

All raw traces, ticket material, identifiers, query text, private provenance and runtime input locations remain outside the checkout. This report publishes only synthetic aliases, public source/instruction hashes, model identifiers, and aggregate or sanitized observations. It introduces no public runtime path to private inputs. No tests, model/judge calls, native tracker calls, or package checks were run to write this report.
