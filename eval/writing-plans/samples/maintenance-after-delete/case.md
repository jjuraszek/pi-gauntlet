bundle+: agents/plan-writer.md

Role: plan-writer. Compare two independent maintenance dispatches against the same committed plan below. Narrate the reads, writes, baseline handling and checker calls for each pass; show Task 1's resulting Files block in each pass and the mode's final reply. Do not execute live tools.

Home: /workspace/app. Spec: /workspace/app/doc/specs/retire.md. Plan: /workspace/app/doc/plans/retire.md. Plan skill: /workspace/tools/skills/writing-plans/SKILL.md. Plan contract: /workspace/tools/skills/writing-plans/reference/plan-contract.md.

Observed state for both dispatches:
- HEAD is abc1234. Task 1 is completed; its removals and source changes are committed. `git status --porcelain --untracked-files=all` is empty before maintenance. No in-flight source edits or unknown dirty paths exist.
- src/legacy.ts and src/legacy-map.json are absent. They are owned only by Task 1's Delete entries; no task lists either path as Modify or Test. src/current.ts contains exactly `export const mode = "current";` followed by a newline. tests/current.test.mjs and doc/usage.md exist, and their contents are unchanged since the recorded baseline.
- Both home-relative `git show HEAD:doc/plans/retire.md` and `git show HEAD:doc/specs/retire.md` succeed and return the committed originals described here. The spec's Removal section (lines 5-7) requires retiring the two legacy files and keeping current mode. Usage (lines 9-11) requires documenting current mode. The original task anchors cite those sections at those lines except for the explicit stale Task 2 anchor in pass A.
- The plan has valid headers, coverage and baseline provenance. Its verification header is `npm test`. Task 1's exact command has a valid measured baseline at abc1234 (3 tests passed, 0 failed); command text and evidence are unchanged. Endpoint-tree equivalence at abc1234 exits 0. No baseline command needs rerunning in either pass.

Committed task excerpts (all omitted text is valid and unaffected):

```markdown
## Wave 1 - Removal
### Task 1: Retire legacy adapters
**Spec:** doc/specs/retire.md § "Removal" L5-L7
**Files:**
- Delete: `src/legacy.ts`
- Modify: `src/current.ts`
- Delete: `src/legacy-map.json`
- Test: `tests/current.test.mjs`

**Tests:**
- `node --test tests/current.test.mjs`
- baseline: abc1234 pass
- via: `current mode`

- [x] Remove both legacy files and keep current mode.

## Wave 2 - Usage
Depends on Wave 1.
### Task 2: Document current mode
**Spec:** doc/specs/retire.md § "Usage" L9-L11
**Files:**
- Modify: `doc/usage.md`
**Tests:**
- none: docs

- [ ] Document current mode in the usage guide.
```

Pass A - ordinary Findings re-dispatch:
The existing plan's Task 2 anchor alone mistakenly reads L19-L21. Findings contains exactly `anchor-resolution: Task 2: range L19-L21 is outside section "Usage" (L9-L11)`. No files-block, paths-exist, wave-file-disjointness, baseline or other finding exists. Reading the spec confirms L9-L11. After the anchor repair, the self-check returns PASS and no judgment check requests another edit. Describe the maintenance result and final ordinary one-line reply.

Pass B - implement-phase Amend-apply:
Start independently from the valid original plan with Task 2 at L9-L11, not from pass A's typo. The granted item replaces Usage's sentence "Document current mode." with "Document current mode and include a migration example." Change Task 2's matching instruction and coverage; Removal and Task 1's obligation are unchanged. Both committed-original reads succeed. No Tests command changes, and all retained evidence is valid. After these plan/spec edits, the self-check returns PASS with no open questions. Describe the maintenance result and return the Amend-apply object. The parent owns stamping and task reconciliation.
