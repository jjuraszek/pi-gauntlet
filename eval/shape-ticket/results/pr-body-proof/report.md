# eval report: shape-ticket (partial run: pr-body-proof)

for: bf5ecb56f43d15c27b757b4e41d3b83cb8f9c7c94e4cf8987ae8a187eda97fe7

wall: 6s

refresh: complete; sample: pr-body-proof; models: anthropic/claude-opus-5-5, github-copilot/gpt-6.1-sol
audit: [candidate.json](results/pr-body-proof/candidate.json)

## Change

Sort ticket rows by the shared definition. Keep the file-delivered functionality under Acceptance Criteria, including environment names that define it and scenarios of the same constraint. Carry external clauses and pipeline results under Integration and retain every displaced original verbatim in the Reporter note, without a retirement label. On repair, carry existing housekeeping entries under Integration. The text replays inspect the proposed body and note, not tracker writes.

Require plain per-ref settlement rows after selected writes, including singleton creates; use the actual returned ticket ref rather than the drafted title on successful creation. Run only per-ref-settlement for this edit, with historical results preserved; this is sample-scoped coverage, not a target-wide pass.

Resolve configured sibling clone URLs beside the primary checkout, with shared stored-origin identity parsing and parent-owned nonblocking report lines. Keep home cwd at the current checkout; cover linked worktrees, external Git directories, submodules and successful worktree-list output without a primary entry. Reject legacy paths with a migration line. Preserve report-only outcomes through missing, empty or malformed scout artifacts and quiet no-op reports without opening a gate. Fold grounded legs from found absolute paths using stored origin names; keep existing grounding and dispatch guards.

Add sibling-primary-anchor and sibling-not-found-hint and extend audit-grounding and audit-dispatch with inline Git facts. Implementation evidence is deterministic structural lint and source/fixture review only; reserve historical before/after model comparison for final verification against audit baseline A=5b97a46a7b0ef331e72077362e92eff4a59e1b77. Do not claim new observed fact moves before inspecting those saved replies; retain the existing evidence-backed moves below.

Add parent-owned obsolete judgments with confirmed citations, gated repair close/create drop choices, and exactly one recommended selectable menu row. Preserve the ordinary body diff and all existing accepted moves; keep target slices and word cap unchanged. Observe the three obsolete/quiet samples before editing instructions and retain genuine baseline failures.

Integrate bounded batch repair and the repository audit into gather for batch-repair, audit-repo-fit, scenario-best-effort, audit-quiet-noop, audit-byte-lock, audit-dispatch and audit-grounding. Prepare all tickets before ref-ordered single-ticket gates, keep hard stops local while splits stay atomic, and apply audit grounding and AC uniqueness with verbatim displaced detail. Preserve raw AC bytes for quiet conformance repairs, singleton integrity stops (including repair-overflow/invalid), the 1,600-word cap, target slices and legacy audit exclusions. Extract examples and the capability ladder without changing their rules except the documented open-PR read verb. Retain baseline A=5b97a46a7b0ef331e72077362e92eff4a59e1b77 and evidence-backed moves below; never promote a post-behavior candidate into A.

Require roast findings to acknowledge detail already retained in the Reporter note and preserve plain-words Problem leads and product-level cause-and-effect sentences against compression or redundancy cuts.
Bound Context, examples and Idea for a product-aware repo stranger; preserve comprehension and accumulate verbatim displaced detail through repair and roast, retaining raw AC bytes for conformance-only repair. Retain existing move decisions below.

Clarify the overlap reference's repeated-defect rule: completion plus compatible same-concern additions does not justify a duplicate without evidence distinguishing a new regression. The closed-concern-additions sample alone bundles that reference and checks supplied-evidence recommendations, allowing useful existing-ticket additions or no write while retaining create-anyway as an override. The member-file-only sample alone bundles the complete skill and selects Roast item 2: add file-only transport on initial/retry member tasks while retaining cheap effort, inline chair, structural quorum and parent split-axis ownership. Retain the Draft behavior and existing sample bundles; Git retains prior intent and historical replay evidence. Apply the shared menu contract at the confirmation gate so options stay separately numbered after concerns and legacy numeric replies name the resolved subset approval before simulated creation.

Carry source provenance in Problem, surface named gaps at the existing gate, require create acknowledgment, and accept repair's displayed missing-at-filing constant with plain yes. Retain baseline facts already holding as guards. Keep bug repro steps and observed-vs-expected in the gate's Evidence list and AC rows, leaving each Problem example at rule 5's one sentence or one number followed by its source footer. Name cwd = repo root on Roast item 2's inline chair Call 2, as on Call 1, preserving the existing chair working-directory requirement.

Mark active clarification and integrity questions, the exact-diff gate, and ended batch settlement. Use fixed-order nonzero counters and stuck only for unfetched, close-failed or close-by-hand outcomes. Keep per-ref reports and exact-diff write authority intact; never reopen an ended stopped item.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| pr-body-proof | anthropic/claude-opus-5-5 | unchanged | 5931 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (held); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |
| pr-body-proof | github-copilot/gpt-6.1-sol | unchanged | 5813 | f1: holds -> holds (intended but unchanged); f2: holds -> holds (held); f3: holds -> holds (intended but unchanged); f4: holds -> holds (intended but unchanged) |

## Feedback

- pr-body-proof / anthropic/claude-opus-5-5: No fact changed state between Before and After: all four hold in both, so the expected fails -> holds move on f1 is not visible in this pair, since Before already dropped the PR-description row from Acceptance Criteria with no equivalent proof row. After delivers the Change as intended: the row moves to a separate Integration section rather than staying under Acceptance Criteria, the Reporter note keeps the original row verbatim (now including its `- [ ]` prefix) without the `retired workflow-stage proof:` label, and both surviving rows are byte-identical. Two risks to guard in the wording: first, f1 depends on a reader treating Integration as outside the drafted Acceptance Criteria, so keep the instruction that Integration is its own heading, never a sub-list or group under Acceptance Criteria, and that displaced rows lose their checkbox there; second, After emitted only the AC and Integration sections rather than the full body, so if you want the full-replacement body shown, say so explicitly, while keeping the rule that surviving rows are copied byte-for-byte and the displaced original is retained verbatim inside the fenced untrusted-data note.
- pr-body-proof / github-copilot/gpt-6.1-sol: All four facts hold in both outputs, so nothing moved on this sample: f1 was expected to go fails -> holds, but Before already dropped the PR-description row from Acceptance Criteria and added no equivalent, so it is a guard here rather than a move. After keeps both surviving rows byte-identical (f3, f4), omits the PR-description row from the Acceptance Criteria list (f1), and retains the original row verbatim in the fenced Reporter note without the 'retired workflow-stage proof' label Before used (f2), which matches the Change. One risk to watch: After places the Integration section inside the same fence as the Acceptance Criteria, and a stricter reader could treat the carried 'The PR description lists every deleted test file' line as an equivalent proof row sitting in the drafted criteria block. To keep f1 safe, the wording should say that Integration is a separate section rendered outside the Acceptance Criteria list (ideally its own fence or clearly its own heading), that Integration entries are never checkbox rows, and that the displaced original goes verbatim, checkbox included and unlabeled, into the Reporter note while surviving AC rows stay byte-identical.

exit: 0
