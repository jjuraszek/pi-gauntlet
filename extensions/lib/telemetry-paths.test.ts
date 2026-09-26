import assert from "node:assert/strict";
import { test } from "node:test";
import {
  classifyBucket,
  isPlanPath,
  isSpecPath,
  isSupersededByBanner,
  matchShipStatement,
  matchTestStatement,
  parsePatchNumstat,
  parseSpecLinks,
  planSpecHeader,
  recordPathFor,
  repoRelativeToolPath,
  truncateCommand,
} from "./telemetry-paths.ts";
import { DEFAULT_TELEMETRY_BUCKETS, DEFAULT_TEST_COMMANDS } from "./gauntlet-settings.ts";

test("recordPathFor maps <dir>/<spec .md -> .yaml> preserving nesting", () => {
  assert.equal(recordPathFor(".pi/gauntlet/telemetry", "doc/specs/x.md"), ".pi/gauntlet/telemetry/doc/specs/x.yaml");
  assert.equal(recordPathFor("t", "svc/doc/specs/2026-01-01-a.md"), "t/svc/doc/specs/2026-01-01-a.yaml");
});

test("repoRelativeToolPath resolves like pi tools: relative to cwd, then repo-relative", () => {
  assert.equal(repoRelativeToolPath("/repo", "/repo", "doc/specs/a.md"), "doc/specs/a.md");
  assert.equal(repoRelativeToolPath("/repo", "/repo/svc", "doc/specs/a.md"), "svc/doc/specs/a.md");
  assert.equal(repoRelativeToolPath("/repo", "/repo/svc", "/repo/doc/specs/a.md"), "doc/specs/a.md");
  assert.equal(repoRelativeToolPath("/repo", "/repo", "/elsewhere/x.md"), undefined);
});

test("isSpecPath / isPlanPath match **/doc/specs/*.md and **/doc/plans/*.md only", () => {
  assert.ok(isSpecPath("doc/specs/a.md"));
  assert.ok(isSpecPath("svc/doc/specs/a.md"));
  assert.equal(isSpecPath("doc/specs/sub/a.md"), false);
  assert.equal(isSpecPath("doc/plans/a.md"), false);
  assert.ok(isPlanPath("doc/plans/a.md"));
});

test("planSpecHeader extracts the **Spec:** path", () => {
  assert.equal(planSpecHeader("# P\n\n**Spec:** `doc/specs/a.md`\n"), "doc/specs/a.md");
  assert.equal(planSpecHeader("**Spec:** doc/specs/a.md"), "doc/specs/a.md");
  assert.equal(planSpecHeader("no header"), undefined);
});

test("matchTestStatement returns the first statement matching a test fragment", () => {
  assert.equal(matchTestStatement("cd repo && npm test -- --grep x", DEFAULT_TEST_COMMANDS), "npm test -- --grep x");
  assert.equal(matchTestStatement("make test-smoke", DEFAULT_TEST_COMMANDS), undefined);
  assert.equal(matchTestStatement("ls", DEFAULT_TEST_COMMANDS), undefined);
});

test("truncateCommand cuts at 120 chars", () => {
  assert.equal(truncateCommand("a".repeat(200)).length, 120);
  assert.equal(truncateCommand("short"), "short");
});

test("classifyBucket: first match wins, else code", () => {
  assert.equal(classifyBucket("extensions/lib/telemetry-paths.test.ts", DEFAULT_TELEMETRY_BUCKETS), "test");
  assert.equal(classifyBucket("doc/configuration.md", DEFAULT_TELEMETRY_BUCKETS), "docs");
  assert.equal(classifyBucket("package.json", DEFAULT_TELEMETRY_BUCKETS), "config");
  assert.equal(classifyBucket("extensions/telemetry.ts", DEFAULT_TELEMETRY_BUCKETS), "code");
  assert.equal(classifyBucket("doc/specs/a.md", [["spec", ["doc/specs/**"]], ["docs", ["**/*.md"]]]), "spec");
});

const patch = (...blocks: string[][]) => blocks.map((b) => b.join("\n")).join("\n") + "\n";

test("parsePatchNumstat counts hunk lines and paths with spaces", () => {
  const p = patch(
    ["diff --git a/src/a.ts b/src/a.ts", "--- a/src/a.ts", "+++ b/src/a.ts", "@@ -1 +1 @@", "+a", "+b", "-c", "\\ No newline at end of file"],
    ["diff --git a/sp ace.txt b/sp ace.txt", "--- a/sp ace.txt", "+++ b/sp ace.txt", "@@ -1 +1 @@", "-x", "+y"],
  );
  assert.deepEqual(parsePatchNumstat(p), [{ added: 2, removed: 1, path: "src/a.ts" }, { added: 1, removed: 1, path: "sp ace.txt" }]);
});

test("parsePatchNumstat handles renames and delete/add pairs", () => {
  assert.deepEqual(parsePatchNumstat(patch(
    ["diff --git a/old.ts b/new.ts", "rename from old.ts", "rename to new.ts"],
    ["diff --git a/o2.ts b/n2.ts", "rename from o2.ts", "rename to n2.ts", "--- a/o2.ts", "+++ b/n2.ts", "@@ -1 +1,2 @@", " k", "+extra"],
    ["diff --git a/gone.ts b/gone.ts", "deleted file mode 100644", "--- a/gone.ts", "+++ /dev/null", "@@ -1 +0,0 @@", "-old"],
    ["diff --git a/newer.ts b/newer.ts", "new file mode 100644", "--- /dev/null", "+++ b/newer.ts", "@@ -0,0 +1 @@", "+new"],
  )), [
    { added: 0, removed: 0, path: "new.ts" }, { added: 1, removed: 0, path: "n2.ts" },
    { added: 0, removed: 1, path: "gone.ts" }, { added: 1, removed: 0, path: "newer.ts" },
  ]);
});

test("parsePatchNumstat handles binary, mode-only and positional hunk headers", () => {
  assert.deepEqual(parsePatchNumstat(patch(
    ["diff --git a/dir b/icon.png b/dir b/icon.png", "Binary files a/dir b/icon.png and b/dir b/icon.png differ"],
    ["diff --git a/run.sh b/run.sh", "old mode 100644", "new mode 100755"],
    ["diff --git a/image.png b/image.png", "GIT binary patch", "literal 4"],
    ["diff --git a/test/fm.md b/test/fm.md", "--- a/test/fm.md", "+++ b/test/fm.md", "@@ -1 +1 @@", "----", "++text"],
  )), [
    { added: 0, removed: 0, path: "dir b/icon.png" }, { added: 0, removed: 0, path: "run.sh" },
    { added: 0, removed: 0, path: "image.png" }, { added: 1, removed: 1, path: "test/fm.md" },
  ]);
});

test("parsePatchNumstat rejects malformed input and accepts empty patches", () => {
  assert.deepEqual(parsePatchNumstat(""), []);
  assert.deepEqual(parsePatchNumstat("  \n\n"), []);
  assert.equal(parsePatchNumstat("garbage\n"), null);
  assert.equal(parsePatchNumstat("diff --git a/x b/y\nindex 1..2\n"), null);
  assert.equal(parsePatchNumstat("diff --git c/x b/x\n"), null);
});

test("parseSpecLinks reads Supersedes/Fixes banners as paths or markdown links", () => {
  const body = "# T\n\n> **Supersedes:** [doc/specs/a.md](./a.md), doc/specs/b.md\n> **Fixes:** [doc/specs/c.md](./c.md)\n";
  assert.deepEqual(parseSpecLinks(body), { supersedes: ["doc/specs/a.md", "doc/specs/b.md"], fixes: ["doc/specs/c.md"] });
  assert.deepEqual(parseSpecLinks("# T\n"), { supersedes: [], fixes: [] });
});

test("isSupersededByBanner detects the predecessor banner and its successor label", () => {
  assert.equal(isSupersededByBanner("> **Superseded by:** [doc/specs/new.md](./new.md) - fully", "doc/specs/new.md"), true);
  assert.equal(isSupersededByBanner("> **Superseded by:** [doc/specs/other.md](./other.md)", "doc/specs/new.md"), false);
  assert.equal(isSupersededByBanner("plain text", "doc/specs/new.md"), false);
});

test("matchShipStatement needs a statement start (STMT_START) and accepts git global flags", () => {
  assert.deepEqual(matchShipStatement("git merge --squash gh-33 && git commit"), { option: "squash", statement: "git merge --squash gh-33" });
  assert.deepEqual(matchShipStatement("cd x; git push -u origin HEAD"), { option: "pr", statement: "git push -u origin HEAD" });
  assert.equal(matchShipStatement("gh pr create --fill")?.option, "pr");
  assert.equal(matchShipStatement('rg "git push" skills/'), undefined);
  assert.equal(matchShipStatement("echo git push"), undefined);
  assert.deepEqual(matchShipStatement("git -C /p merge --squash f"), { option: "squash", statement: "git -C /p merge --squash f" });
  assert.equal(matchShipStatement("git -c user.name=t -C /p merge --squash f")?.option, "squash");
  assert.equal(matchShipStatement("git -C /p log"), undefined);
});
