bundle+: skills/shape-ticket/reference/ac-classes.md

AC definition: /package/skills/shape-ticket/reference/ac-classes.md (bundled above)

Audit the delivered change against the spec, the fetched ticket snapshot and the original prompt. No pull request exists. The diff and numbered current file below are the complete delivered evidence.

## Verbatim original prompt

```text
Implement the importer change described by the ticket.
```

## Fetched ticket (verbatim)

```markdown
## Acceptance Criteria
- [ ] the importer rejects a row without an id
- [ ] the cutover steps are posted as a comment on the ticket
- [ ] the operator runs the cutover
- [ ] the change merges only after the vendor confirms the fix
- [ ] the staging queue is empty before the deploy
- [ ] after deploy to staging, login succeeds against the real identity provider
- [ ] the ticket is moved to In Review
```

## Spec

```markdown
# Require an id for imports

## Acceptance criteria
- [ ] the importer rejects a row without an id
  in-scope
- [ ] the cutover steps are posted as a comment on the ticket
  in-scope

## Integration
- before merge - requester: confirm the vendor shipped the fix; done when the vendor's release notes list it
- before deploy to staging - operator: drain the queue; done when the queue length reads 0
- `not stated` - operator: run the cutover; done when `not stated`
- after merge - person merging: tag the release; done when the tag exists
- after deploy to staging - operator: log in through the real identity provider; done when the login succeeds
- after deploy to production - operator: compare the order total; done when it equals the total read before the deploy
```

## Delivered diff

```diff
diff --git a/src/importer.mjs b/src/importer.mjs
--- a/src/importer.mjs
+++ b/src/importer.mjs
@@ -1,3 +1,4 @@
 export function importRow(row) {
+  if (!row.id) throw new Error("missing id");
   return { ...row };
 }
```

## Numbered current file

`src/importer.mjs` is tracked and committed in the audited change:
```text
1 export function importRow(row) {
2   if (!row.id) throw new Error("missing id");
3   return { ...row };
4 }
```
