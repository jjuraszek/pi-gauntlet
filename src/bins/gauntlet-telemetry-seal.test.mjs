import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseRecord } from "../../extensions/lib/telemetry-record.ts";

const cli = new URL("./gauntlet-telemetry-seal.mjs", import.meta.url);
const invoke = (args) => spawnSync(process.execPath, [cli.pathname, ...args], { encoding: "utf8" });
test("malformed leg arguments name the value", () => {
  for (const value of ["missing", "=abc", "repo=", "repo= "]) {
    const result = invoke(["--leg", value]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /invalid --leg/);
    assert.ok(result.stderr.includes(value));
  }
});
test("source seal stores repeated legs, splits first equals, and checks retry sets without companion writes", () => {
  const root = mkdtempSync(join(tmpdir(), "seal-legs-"));
  const companion = mkdtempSync(join(tmpdir(), "seal-companion-"));
  const git = (...args) => {
    const r = spawnSync("git", ["-C", root, "-c", "user.name=test", "-c", "user.email=test@example.test", "-c", "commit.gpgsign=false", ...args], { encoding: "utf8" });
    assert.equal(r.status, 0, r.stderr);
  };
  git("init", "-b", "main");
  writeFileSync(join(root, "file"), "x");
  git("add", "file"); git("commit", "-m", "init");
  const dir = join(root, ".pi/gauntlet/telemetry"); mkdirSync(dir, { recursive: true });
  const file = join(dir, "x.yaml");
  writeFileSync(file, "schema: 1\nspec: x.md\nrun_id: r\nstatus: in_progress\ncreated_at: 2026-01-01\n");
  const base = ["--worktree", root, "--option", "pr", "--base", "main", "--spec", "x.md"];
  const a = `${companion}=abc`, b = "second=https://example.test/pull/1?q=yes";
  const run = (legs) => spawnSync(process.execPath, [cli.pathname, ...base, ...legs.flatMap((leg) => ["--leg", leg])], { encoding: "utf8", env: { ...process.env, GIT_AUTHOR_NAME: "test", GIT_AUTHOR_EMAIL: "test@example.test", GIT_COMMITTER_NAME: "test", GIT_COMMITTER_EMAIL: "test@example.test" } });
  let result = run([a, b]); assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(parseRecord(readFileSync(file, "utf8")).legs, [{ repo: companion, sha: "abc" }, { repo: "second", pr: "https://example.test/pull/1?q=yes" }]);
  result = run([b, a]); assert.equal(result.status, 0, result.stderr);
  result = run([b.replace("second=", "SECOND="), a]); assert.equal(result.status, 0, result.stderr);
  assert.equal(parseRecord(readFileSync(file, "utf8")).legs[1].repo, "second");
  result = run([b.replace("q=yes", "q=YES"), a]); assert.equal(result.status, 1);
  result = run([b, `${companion}=ABC`]); assert.equal(result.status, 1);
  for (const legs of [[], [a], [a, "second=def"]]) {
    result = run(legs); assert.equal(result.status, 1); assert.match(result.stderr, /legs differ/);
  }
  assert.equal(existsSync(join(companion, ".pi/gauntlet/telemetry")), false);
});
