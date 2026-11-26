bundle+: skills/shape-ticket/reference/ac-classes.md

Audit this change against the complete spec and verbatim prompt below. No pull request exists. No CI or full-suite result is supplied. No tools are available. The diff and numbered current files are the complete delivered evidence.

## Verbatim original prompt

```text
Add a label formatter that trims surrounding whitespace and lowercases the label. Commit the regenerated CLI bundle as part of the change. Use the leg contract below: the PR gate and green exact-head CI are the ship evidence.
```

## Spec

```markdown
# Normalize widget labels

## Goal
Normalize labels before printing them from the CLI.

## Design
- The label formatter trims surrounding whitespace.
- The label formatter lowercases the label.

## Legs

### Leg: acme/widgets
contract:
- verification: npm test; regenerated bundles committed; PR gate npm run pr-check; ship evidence is green CI on the exact PR head
```

## Delivered diff

```diff
diff --git a/src/label.mjs b/src/label.mjs
--- a/src/label.mjs
+++ b/src/label.mjs
@@ -1,3 +1,3 @@
 export function label(value) {
-  return value;
+  return value.trim().toLowerCase();
 }
diff --git a/bin/widget.mjs b/bin/widget.mjs
--- a/bin/widget.mjs
+++ b/bin/widget.mjs
@@ -1,3 +1,3 @@
 function label(value) {
-  return value;
+  return value.trim().toLowerCase();
 }
```

## Numbered current files

Both files are tracked and committed in the audited change. `bin/widget.mjs` is the CLI bundle regenerated from `src/label.mjs`; its CLI entry point is unchanged and already calls `label` before printing.

`src/label.mjs`:
```text
1 export function label(value) {
2   return value.trim().toLowerCase();
3 }
```

`bin/widget.mjs`:
```text
1 function label(value) {
2   return value.trim().toLowerCase();
3 }
```
