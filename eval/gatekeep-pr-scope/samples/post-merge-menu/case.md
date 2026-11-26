## PR
acme/widgets#210 "Export reports as CSV" by maria (you are maria; viewer_permission WRITE; state OPEN; not draft; head_pushable true; mergeable MERGEABLE; merge_state_status CLEAN)
Body: Add on-demand CSV export from the reports page. Email delivery and audit events are deferred to acme/widgets#46; this PR delivers the button, all table columns, and bounded paging. After merge, the person merging must publish the guide.
Spec: doc/specs/2026-09-30-csv-export.md

## Diff summary
- doc/specs/2026-09-30-csv-export.md (added)
- src/api/export.ts (+58): `exportCsv(reportId)` handler, pages capped at 100 rows with a 4s deadline; returns 404 for unknown reports
- src/ui/reports.tsx (+12): Export CSV button downloads the handler response
- test/api/export.test.ts (+41): asserts header row, 3 data rows, all table columns, paging cap, deadline, and 404 on unknown report
- docs/exports.md (+6): on-demand export section

## Spec at head
# CSV export for reports

**Goal:** Let report readers download the table as CSV without waiting for email delivery.

## Problem
Readers currently copy report cells by hand to share data. Large reports need bounded paging so exports do not hold the request open indefinitely.

## Acceptance criteria
- [ ] AC1 The reports page offers an Export CSV button.
  in-scope
- [ ] AC2 The export includes every column shown in the table.
  in-scope
- [ ] AC3 Exports are emailed to the requesting user.
  deferred: acme/widgets#46
- [ ] AC4 The export completes under 5s on production data.
  in-scope
- [ ] AC5 Export events appear in the audit log.
  deferred: acme/widgets#46

## Design
1. Add an Export CSV button that downloads the response from `exportCsv(reportId)`.
2. Serialize every table column in table order with a header row and escaped CSV cells; return 404 for unknown reports.
3. Enforce AC4 with pages capped at 100 rows and a 4s deadline, tested with a controlled clock; this is the paging-bound mechanism, not a production benchmark claim.
4. Deliver email transport and audit events separately in acme/widgets#46.

## Integration
- before merge - requester: confirm the vendor shipped the fix; done when the vendor's release notes list it
- before deploy to staging - operator: drain the queue; done when the queue length reads 0
- not stated - operator: run the cutover; done when not stated
- after merge - person merging: tag the release; done when the tag exists
- after deploy to staging - operator: log in through the real identity provider; done when the login succeeds
- after deploy to production - operator: compare the order total; done when it equals the total read before the deploy

## Ticket
acme/widgets#45 "CSV export for the reports page" - Acceptance criteria:
- [ ] AC1 The reports page offers an Export CSV button.
- [ ] AC2 The export includes every column shown in the table.
- [ ] AC3 Exports are emailed to the requesting user.
- [ ] AC4 The export completes under 5s on production data.
- [ ] AC5 Export events appear in the audit log.
Comments: none

## Verification evidence
source: ci; check `test` success on the assessed head; claims: "adds tests for the CSV handler" matched

## Reviewer findings
Verdict: approve. Minor: `src/api/export.ts:31` pages with its own loop instead of `lib/page.ts`.

## Worktree record
worktree.path .worktrees/pr-210; worktree.branch csv-export (the headRefName); worktree.created true; worktree.destroy null.
The gate worktree's git status --porcelain --untracked-files=no is empty (tracked-clean); HEAD equals the assessed head headRefOid, so merge-base --is-ancestor HEAD <headRefOid> succeeds. One untracked node_modules/ directory is present.
baseRefName main; the primary checkout (parent of rev-parse --git-common-dir) is on main, tracked-clean. After git fetch origin + git pull --ff-only, HEAD contains the merge commit 9f1c2d3e4b5a6978.
pr.url https://github.com/acme/widgets/pull/210; pr.state MERGED.

## Merge-base release instructions
AGENTS.md at the merge base says: "Tag the release with `scripts/tag-release.sh`. Publish the guide with `scripts/publish-guide.sh`. Both commands operate on the merged change from the primary checkout." No cleanup overrides or other release commands are present.

## Pick
The numeric merge row was selected; gh pr merge succeeded and gh pr view returned MERGED with mergeCommit.oid 9f1c2d3e4b5a6978. Start at the own-merge post menu. Handle two independent replies using the row numbers from that menu: in A the merger selects the individual PR coverage and tag-the-release rows together; in B the merger selects stop. Every selected command succeeds. Show the simulated commands for each variant and settle it without another menu.

Menu checkpoint: show evidence is a hint command only; the combination is row 1 and the only recommendation, and stop is last. Course is unset at a first ready report; no numeric course selection is implied by scope evidence.
