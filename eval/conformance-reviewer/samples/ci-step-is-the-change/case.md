Audit this synthetic change. The spec, verbatim prompt, diff and numbered current files below are the complete inputs. No tools are available. Stop at the conformance report.

## Verbatim prompt

Make the label formatter trim surrounding whitespace. Remove the CI step in `.github/workflows/ci.yml` that installs the browser. Commit the regenerated label bundle too.

## Spec

# Trim labels without installing a browser

## Goal

Trim surrounding whitespace from labels without installing a browser in CI.

## Design

The label formatter trims surrounding whitespace.

Remove the CI step in `.github/workflows/ci.yml` that installs the browser.

## Legs

### Leg: widget-tools
contract:
- verification: node --test test/label.test.mjs; regenerated bundles committed

The tracked bundle `bin/label.mjs` is generated from `src/label.mjs`.

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

This is the entire diff. The workflow and tracked bundle below remain unchanged; no regenerated bundle is committed.

## Numbered current files

`src/label.mjs`:
```text
1 export function label(value) {
2   return value.trim();
3 }
```

`.github/workflows/ci.yml`:
```text
1 name: CI
2 on: [push, pull_request]
3 jobs:
4   test:
5     runs-on: ubuntu-latest
6     steps:
7       - uses: actions/checkout@v4
8       - name: Install browser
9         run: npm run install-browser
10       - name: Test labels
11         run: node --test test/label.test.mjs
```

`bin/label.mjs`:
```text
1 export function label(value) {
2   return value;
3 }
```
