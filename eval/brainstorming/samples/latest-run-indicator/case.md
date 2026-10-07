## Ask
T-1 asks to assess a file hover showing producer revision and a badge on each top-level item. The binding outcome is a visible workspace processing date with the same run's producer revision reachable from that indicator, using persisted data only.

## Gather draft
Completed runs persist the completion date and svc-b revision. A workspace's latest run does not establish the provenance of every file or item. Existing joins connect runs to file placements and candidate targets; a root item's last touch includes descendants. svc-a's release identity is available at processing time but is absent from historical run metadata.
Framing: A workspace-wide revision on a file or item can imply false provenance, and revision alone omits the required visible date. Keep all three chosen surfaces, derive their appropriate provenance from existing joins, and persist svc-a's release identity on the run instead of stamping items or displaying only a producer revision.
Pattern: svc-a/file-chip.md reuses the shared hover renderer; svc-a/run-store.md supplies persisted completion metadata.

## Recorded answers
Q: Which surfaces? A: All three: document card, file tooltip, and root item badge.
Q: Is producer revision enough? A: Also show svc-a's release tag when available, since the services deploy together.
Q: How should the tag survive future releases? A: Persist release identity on the run during processing; historical runs use the producer revision if available and tolerate missing versions.
Q: Stamp each item or derive its provenance? A: Use existing joins at read time, without active syncing or duplicated item state.
Q: Which run for a root with several contributing runs? A: The last touch on the root or its descendants.
Q: How should it look? A: Quiet badges with proper spacing and browser-local date-time alongside the version.

## Fixture files
### svc-a/file-chip.md
```text
file-chip uses shared hover renderer
placement provenance selects latest succeeded run for (file, destination)
never borrow a run from another placement
```
### svc-a/run-store.md
```text
run has completion date and persisted persisted producer version
successful completion stores svc-a release identity on the run
latest succeeded run ordered by completion date descending, id descending
persisted producer version is optional; missing version displays unknown version
release tag displays only when svc-a revision matches producer revision
```
### svc-b/response-contract.md
```text
version: producer commit revision
items: processed records
rendering reads persisted data, never calls svc-b
```
### svc-a/workspace.md
```text
document card shows workspace-wide latest succeeded run date and version
file tooltip uses placement provenance
root item badge uses latest succeeded run touching root or descendants via candidates
no child badges; no provenance stamped on files or items
browser-local date-time; quiet badges with spacing
```
