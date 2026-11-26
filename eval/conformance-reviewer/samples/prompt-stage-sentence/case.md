bundle+: skills/shape-ticket/reference/ac-classes.md

Audit this change against the complete spec and verbatim prompt below. No pull requests exist, and no CI results are supplied. No tools are available. The diff and numbered current file are the complete delivered evidence. No test files exist.

## Verbatim original prompt

```text
Make the label formatter trim surrounding whitespace. Make the label formatter lowercase its output. Both pull requests pass CI.
```

## Spec

```markdown
# Trim widget labels

## Goal
Trim surrounding whitespace from labels.

## Design
The label formatter returns the input with surrounding whitespace removed.

## Tests
Trimming regression - `test/label.test.mjs`, under `npm test`.
```

## Delivered diff

```diff
diff --git a/src/label.mjs b/src/label.mjs
--- a/src/label.mjs
+++ b/src/label.mjs
@@ -1,3 +1,3 @@
 export function label(value) {
-  return value;
+  return value.trim();
 }
```

## Numbered current file

`src/label.mjs` is tracked and committed in the audited change:
```text
1 export function label(value) {
2   return value.trim();
3 }
```
