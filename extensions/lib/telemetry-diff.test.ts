import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULT_TELEMETRY_BUCKETS } from "./gauntlet-settings.ts";
import { JJ_MAINLINE, aggregateNumstat, computeGitDiff, computeJjDiff, type RunResult } from "./telemetry-diff.ts";

const ok = (stdout: string): RunResult => ({ code: 0, stdout, stderr: "" });
const DIR = ".pi/gauntlet/telemetry";

test("aggregateNumstat sums per bucket over the given file set; binary rows count 0 lines", () => {
  const numstat = ["10\t2\textensions/telemetry.ts", "5\t0\textensions/lib/telemetry-paths.test.ts", "-\t-\timg.png", "3\t3\tdoc/specs/a.md", "1\t1\t{old => new}/x.ts"].join("\n");
  const files = new Set(["extensions/telemetry.ts", "extensions/lib/telemetry-paths.test.ts", "img.png", "new/x.ts"]);
  assert.deepEqual(aggregateNumstat(numstat, files, DEFAULT_TELEMETRY_BUCKETS), {
    code: { files: 3, insertions: 11, deletions: 3 },
    test: { files: 1, insertions: 5, deletions: 0 },
  });
});

test("computeGitDiff: merge-base, name-only minus spec/plan/dir, numstat buckets, telemetry-free commit count", async () => {
  const calls: string[][] = [];
  const git = (args: string[]) => {
    calls.push(args);
    if (args[0] === "merge-base") return ok("abc123\n");
    if (args[0] === "diff" && args.includes("--name-only")) return ok("extensions/telemetry.ts\nextensions/telemetry.test.ts\ndoc/specs/a.md\ndoc/plans/a.md\n.pi/gauntlet/telemetry/doc/specs/a.yaml\nREADME.md\n");
    if (args[0] === "diff" && args.includes("--numstat")) return ok("100\t5\textensions/telemetry.ts\n40\t0\textensions/telemetry.test.ts\n9\t9\tdoc/specs/a.md\n2\t1\tREADME.md\n");
    if (args[0] === "rev-list") return ok("9\n");
    return { code: 1, stdout: "", stderr: `unexpected ${args.join(" ")}` };
  };
  const out = await computeGitDiff({ git, cwd: "/repo", spec: "doc/specs/a.md", dir: DIR, buckets: DEFAULT_TELEMETRY_BUCKETS, base: "main" });
  assert.deepEqual(out.modified_files, ["README.md", "extensions/telemetry.test.ts", "extensions/telemetry.ts"]);
  assert.deepEqual(out.diff, { base: "abc123", commits: 9, buckets: { code: { files: 1, insertions: 100, deletions: 5 }, test: { files: 1, insertions: 40, deletions: 0 }, docs: { files: 1, insertions: 2, deletions: 1 } } });
  assert.equal(out.warning, undefined);
  assert.deepEqual(calls[0], ["merge-base", "HEAD", "main"]);
  assert.deepEqual(calls.at(-1), ["rev-list", "--count", "--invert-grep", "--grep=^telemetry: ", "abc123..HEAD"]);
});

test("computeGitDiff: merge-base failure -> warning, both fields absent", async () => {
  const out = await computeGitDiff({ git: () => ({ code: 128, stdout: "", stderr: "fatal: no merge base\nmore" }), cwd: "/repo", spec: "doc/specs/a.md", dir: DIR, buckets: DEFAULT_TELEMETRY_BUCKETS, base: "main" });
  assert.deepEqual(out, { warning: "diff omitted: merge-base failed: fatal: no merge base" });
});

const JJ_PATCH = [
  "diff --git a/src/a.ts b/src/a.ts",
  "index 1111111..2222222 100644",
  "--- a/src/a.ts",
  "+++ b/src/a.ts",
  "@@ -1,4 +1,12 @@",
  ...Array.from({ length: 10 }, (_, i) => `+added ${i}`),
  "-removed 1",
  "-removed 2",
  " context",
  "diff --git a/test/a.test.ts b/test/a.test.ts",
  "new file mode 100644",
  "index 0000000..3333333",
  "--- /dev/null",
  "+++ b/test/a.test.ts",
  "@@ -0,0 +1,5 @@",
  ...Array.from({ length: 5 }, (_, i) => `+t ${i}`),
  "",
].join("\n");

const jjStub = (over?: (args: string[]) => RunResult | undefined) => {
  const calls: string[][] = [];
  const jj = async (args: string[]): Promise<RunResult> => {
    calls.push(args);
    const forced = over?.(args);
    if (forced) return forced;
    if (args.includes("--count")) return ok(args.some((a) => a.includes(`files(~glob:"${DIR}/**")`)) ? "2\n" : "3\n");
    if (args.includes("log")) return ok("jjbase0001\n");
    if (args.includes("diff")) return ok(JJ_PATCH);
    return { code: 1, stdout: "", stderr: `unexpected ${args.join(" ")}` };
  };
  return { jj, calls };
};
const runJj = (over?: (args: string[]) => RunResult | undefined) => {
  const s = jjStub(over);
  return computeJjDiff({ jj: s.jj, cwd: "/ws", spec: "doc/specs/a.md", dir: DIR, buckets: DEFAULT_TELEMETRY_BUCKETS }).then((out) => ({ out, calls: s.calls }));
};
const isBaseLog = (args: string[]) => args.includes("log") && !args.includes("--count");

test("computeJjDiff: pinned flags, mainline revset, telemetry-only revisions excluded from the count", async () => {
  const { out, calls } = await runJj();
  assert.deepEqual(out.modified_files, ["src/a.ts", "test/a.test.ts"]);
  assert.deepEqual(out.diff, { base: "jjbase0001", commits: 2, buckets: { code: { files: 1, insertions: 10, deletions: 2 }, test: { files: 1, insertions: 5, deletions: 0 } } });
  assert.equal(out.warning, undefined);
  assert.equal(calls.length, 3);
  assert.ok(calls.every((a) => a.includes("--color=never")));
  assert.deepEqual(calls[1].slice(0, 4), ["--color=never", "--config", "diff.git.show-path-prefix=true", "diff"]);
  assert.ok(calls[0].some((a) => a.includes(`fork_point(${JJ_MAINLINE} | @) ~ root() & ::${JJ_MAINLINE}`)));
});

test("computeJjDiff: empty mainline -> jj-named warning", async () => {
  const { out } = await runJj((args) => (isBaseLog(args) ? ok("") : undefined));
  assert.deepEqual(out, { warning: "diff omitted: jj mainline unresolved (trunk() is root(); no main/master bookmark)" });
});

test("computeJjDiff: nonzero exit -> first stderr line; empty stderr -> unknown error", async () => {
  const a = await runJj((args) => (args.includes("diff") ? { code: 1, stdout: "", stderr: "boom\nmore" } : undefined));
  assert.deepEqual(a.out, { warning: "diff omitted: jj diff failed: boom" });
  const b = await runJj((args) => (isBaseLog(args) ? { code: 1, stdout: "", stderr: "" } : undefined));
  assert.deepEqual(b.out, { warning: "diff omitted: jj log failed: unknown error" });
});

test("computeJjDiff: unparseable patch and unparseable count", async () => {
  const a = await runJj((args) => (args.includes("diff") ? ok("not a patch") : undefined));
  assert.deepEqual(a.out, { warning: "diff omitted: jj diff unparseable" });
  const b = await runJj((args) => (args.includes("--count") ? ok("many\n") : undefined));
  assert.deepEqual(b.out, { warning: "diff omitted: jj log --count unparseable: many" });
});
