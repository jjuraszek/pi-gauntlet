## Spec
# Lantern release notes

**Goal:** Publish release notes with the required integrity manifest.

## Acceptance criteria
- [ ] Attach an integrity manifest (sha256 table) to the release notes.
  in-scope

## Design
Append the build log's sha256 table to the release notes.

## Reviewer report
audited-base: 4c1e8f0a9b2d7c6e5f4a3b2c1d0e9f8a7b6c5d4e
Happy path: not run - no row configured
Requirements:
- R1 (AC1 integrity manifest; Design) MISSING - G1; release notes contain no sha256 table
Origin drift: none
Gaps:
```
G1:
  verdict: MISSING
  origin: spec "Acceptance criteria / AC1" - "Attach an integrity manifest (sha256 table) to the release notes."
  evidence: absent
  remediation: Append the sha256 table from the build log to the release notes.
  touched-files: unknown
  touched-resources: none
  recommended: fix
```
Verdict: GAPS
Parallel-safe: G1 disjoint

Session-observed prerequisites: A named-branch worktree exists, maxFixRounds is 3, and the spec is writable. File ownership has not been established, so fix-now is unavailable. The release-note publication behavior exists, but the required manifest does not. The concern stands alone and the project has an executable issue-tracker convention, but no separate owner exists: this artifact belongs to this change. Accept, rescope, and follow-up are table-available, but current evidence supports none as an executable recommendation: accept cannot ratify a nonexistent manifest; dropping the spec requirement is a human scope call; follow-up has no separate owner. Carry G1 OPEN as one concern with recommended: none. Its rationale names those missing prerequisites and the concrete effect still required: custom(append the sha256 table from the build log to the release notes). No fix round has run. Freshness checks found no changes. Whole-diff minors: none.

## Diff summary
- Published release notes without the required integrity manifest.
- The build log contains the sha256 table; no attachment was made.
