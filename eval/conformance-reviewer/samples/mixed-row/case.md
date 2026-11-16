Audit this change against the complete spec and verbatim prompt below. A pull request exists and is open; its title is "Clean up", its body is empty, and it has no reviews. No CI, merge or full-suite result is supplied. No tools are available. The diff, tracked-file list, numbered current file and local check output are the complete delivered evidence.

## Verbatim original prompt

```text
Remove the tracked legacy directory and add a test that checks the full tracked file list for legacy files. Follow the approved spec below.
```

## Spec

```markdown
# Remove tracked legacy files

## Goal
Remove the tracked legacy directory and prevent tracked legacy files from returning.

## Design
Delete every tracked file under `legacy/`.
Add `test/no-legacy.test.mjs` to check the full tracked file list for paths under `legacy/`.
Ship evidence stays green `ci` on the exact PR head.
The pull request title starts with "Remove legacy".
The pull request is approved by a reviewer.

## Acceptance criteria
- [ ] `git ls-files legacy/` returns nothing, and the PR description lists every file the folder held.
  in-scope
- [ ] `node --test test/no-legacy.test.mjs` passes over the full tracked tree, in its venue: the `slow` job on the PR head.
  in-scope

## Errors and edge cases
The PR description carries this step.
The branch is merged before handoff.

## Tests
The root scan time before and after is recorded in the PR body.
The full verification suite passes with `npm test`.
The release workflow run succeeds.
```

## Delivered diff

```diff
diff --git a/legacy/old.mjs b/legacy/old.mjs
deleted file mode 100644
--- a/legacy/old.mjs
+++ /dev/null
@@ -1 +0,0 @@
-export const retired = true;
diff --git a/test/no-legacy.test.mjs b/test/no-legacy.test.mjs
new file mode 100644
--- /dev/null
+++ b/test/no-legacy.test.mjs
@@ -0,0 +1,8 @@
+import assert from "node:assert/strict";
+import { execFileSync } from "node:child_process";
+import test from "node:test";
+
+test("no tracked legacy files", () => {
+  const paths = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0");
+  assert.deepEqual(paths.filter((path) => path.startsWith("legacy/")), []);
+});
```

## Numbered current file and tracked tree

`git ls-files` lists only `README.md`, `package.json`, and `test/no-legacy.test.mjs`. The unchanged README and package contain package metadata only. The new test is committed and reads the full tracked tree without path exclusions.

`test/no-legacy.test.mjs`:
```text
1 import assert from "node:assert/strict";
2 import { execFileSync } from "node:child_process";
3 import test from "node:test";
4
5 test("no tracked legacy files", () => {
6   const paths = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0");
7   assert.deepEqual(paths.filter((path) => path.startsWith("legacy/")), []);
8 });
```

## Supplied local check output

```text
$ git ls-files legacy/
$ node --test test/no-legacy.test.mjs
ok 1 - no tracked legacy files
# tests 1
# pass 1
# fail 0
```
