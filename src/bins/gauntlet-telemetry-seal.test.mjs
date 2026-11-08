import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { isolatedGitEnv } from "../../extensions/test-support/git-env.mjs";
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
test("source seal stores repeated legs, splits first equals, and checks retry sets without companion writes", (t) => {
  const root = mkdtempSync(join(tmpdir(), "seal-legs-"));
  const companion = mkdtempSync(join(tmpdir(), "seal-companion-"));
  t.after(() => { rmSync(root, { recursive: true, force: true }); rmSync(companion, { recursive: true, force: true }); });
  const env = { ...process.env, ...isolatedGitEnv(companion), PI_CODING_AGENT_DIR: companion };
  const git = (...args) => {
    const r = spawnSync("git", ["-C", root, "-c", "user.name=test", "-c", "user.email=test@example.test", "-c", "commit.gpgsign=false", ...args], { encoding: "utf8", env });
    assert.equal(r.status, 0, r.stderr);
    return r.stdout.trim();
  };
  git("init", "-b", "main");
  writeFileSync(join(root, "file"), "x");
  git("add", "file"); git("commit", "-m", "init");
  git("remote", "add", "origin", "https://example.test/team/product.git");
  git("config", `url.${root}.insteadOf`, "https://example.test/team/product.git");
  const dir = join(root, ".git/gauntlet/telemetry"); mkdirSync(dir, { recursive: true });
  const file = join(dir, "x.yaml");
  writeFileSync(file, "schema: 1\nspec: x.md\nrun_id: r\nstatus: in_progress\ncreated_at: 2026-01-01\n");
  const base = ["--worktree", root, "--option", "pr", "--base", "main", "--spec", "x.md"];
  const a = `${companion}=abc`, b = "second=https://example.test/pull/1?q=yes";
  const run = (legs) => spawnSync(process.execPath, [cli.pathname, ...base, ...legs.flatMap((leg) => ["--leg", leg])], { encoding: "utf8", env });
  const record = () => parseRecord(git("show", "refs/telemetry/records:team/product/brainstorming/x.yaml"));
  let result = run([a, b]); assert.equal(result.status, 0, result.stderr);
  assert.equal(existsSync(file), false);
  assert.deepEqual(record().legs, [{ repo: companion, sha: "abc" }, { repo: "second", pr: "https://example.test/pull/1?q=yes" }]);
  result = run([b, a]); assert.equal(result.status, 0, result.stderr);
  result = run([b.replace("second=", "SECOND="), a]); assert.equal(result.status, 0, result.stderr);
  assert.equal(record().legs[1].repo, "second");
  result = run([b.replace("q=yes", "q=YES"), a]); assert.equal(result.status, 1);
  result = run([b, `${companion}=ABC`]); assert.equal(result.status, 1);
  for (const legs of [[], [a], [a, "second=def"]]) {
    result = run(legs); assert.equal(result.status, 1); assert.match(result.stderr, /legs differ/);
  }
  assert.equal(existsSync(join(companion, ".pi/gauntlet/telemetry")), false);
});
