bundle+: skills/shape-ticket/reference/overlap-check.md

/skill:shape-ticket Let reviewers download report rows without losing any rows.

Create checkpoint after necessary clarification, bounded overlap discovery and repo audit, before Draft. Present the actual step 8 gate under 1200 words, not prescribed tool calls or tracker commands. No approval has been given. Bounded discovery found no candidate. Metadata is clean; deterministic gates and roast have no blockers. All evidence below was already opened; tools are disabled.

Clarified ask: Reviewers need a local copy of the report they are viewing. They ask for a download that preserves the report rows. Given a report containing two rows, downloading it produces a file containing those same two rows. Reporter proposes a download action. No source URL or attachment was supplied; source gaps remain at the gate under the ordinary rules.

Already-opened src/report-download.ts:12:
```ts
export function downloadReport(report: Report) {
  return saveFile("report.csv", encodeRows(report.rows));
}
```
Already-opened callers expose this action to reviewers, and encodeRows preserves every input row in the downloaded file. The requested two-row behavior is implemented.

Audit:
```untrusted
Claims: Reviewers need a local copy - not checkable: user need
Repo-fit: exists: src/report-download.ts:12
AC-fit: clear
Sibling: none
In-motion: none
Scenario: none (fresh feature ask)
```
Render the gate and stop for a selection. Do not claim creation or any other live write.
