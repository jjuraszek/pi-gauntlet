# Case: plain-payloads

## Entry

Override replay.md's command narration and first-menu stop. These are three independent payload-writing snapshots from PR #42 in acme/widgets. All picks, freshness checks and source reviews stated below succeeded. Render the exact body sent by each simulated write, separated by the labels Review body, Thread reply and Coverage comment outside the payloads. Print no commands, reports, menus, tool calls or invented results. Use the supplied skill's wording rules, not a new presentation convention for this exercise. No live write runs.

## Review body

The human selected assess on another author's PR. The viewer can request changes. Two source-backed blockers remain: src/export.ts:31 omits the CSV header, so a spreadsheet treats the first data row as column names; docs/export.md:8 promises nightly exports, but the code only exports on a button click, so readers expect a job that does not exist. Draft repairs add the header and correct the guide to say exports run on demand. No previous failed repair or carried decision line exists. Compose the body for the selected review, retaining both findings and their locators.

## Thread reply

In a later independent snapshot the header repair is pushed and the human selected the drafted reply to maria's question, "Does the export include column names now?" Source review confirms the export includes a header and the export_header test passed in CI. The internal record says headRefOid 9c1e4f2, workflow run id 7001, source: ci, mergeStateStatus BLOCKED, repair rounds_used 1. The reply acknowledges the question and explains the header fix using those gathered facts; it is not an evidence dump or a promise to merge. Compose only the posted thread body.

## Coverage comment

In a third snapshot all in-scope mechanisms passed and the PR merged. The human picked the ticket copy of the drafted coverage block. The saved payload at /tmp/gate-coverage.md contains these exact lines, with a final newline:

## AC coverage
Informational - the ticket's rows are unchanged. PR https://github.com/acme/widgets/pull/42, merged 7d8e9f0, spec doc/specs/csv-export.md
- [ ] Export includes a header row. - covered
- [ ] Schedule nightly exports. - deferred per spec to acme/widgets#46
- [ ] Stream large exports. - deviates per spec: buffer CSV in memory

Render the posted comment body using that payload. The coverage header's merge commit is protocol text, not thread-reply prose.
