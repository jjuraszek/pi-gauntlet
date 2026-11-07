import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const jj = spawnSync("jj", ["--version"], { encoding: "utf8" });
test("plain jj seal reports the unsupported shared store without stamping a local record", {
  skip: jj.status === 0 ? false : "jj binary unavailable",
}, () => {
  const scratch = mkdtempSync(join(tmpdir(), "telemetry-jj-"));
  const root = join(scratch, "repo");
  const env = { ...process.env, JJ_CONFIG: "", PI_CODING_AGENT_DIR: join(scratch, "agent") };
  const init = spawnSync("jj", ["git", "init", "--no-colocate", root], { encoding: "utf8", env });
  assert.equal(init.status, 0, init.stderr);
  const dir = join(root, ".jj/gauntlet/telemetry/doc/specs");
  mkdirSync(dir, { recursive: true });
  const file = join(dir, "example.yaml");
  const bytes = "schema: 1\nspec: doc/specs/example.md\nrun_id: jj-run\nstatus: in_progress\ncreated_at: 2026-01-01\n";
  writeFileSync(file, bytes);
  const result = spawnSync(process.execPath, [new URL("./gauntlet-telemetry-seal.mjs", import.meta.url).pathname,
    "--worktree", root, "--option", "pr", "--base", "root()", "--spec", "doc/specs/example.md"],
    { encoding: "utf8", env, timeout: 10_000 });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), "telemetry: not pushed (jj workspace: no git remote)");
  assert.equal(result.stderr, "");
  assert.equal(readFileSync(file, "utf8"), bytes);
});
