import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseRecord } from "../../extensions/lib/telemetry-record.ts";

const cli = new URL("./gauntlet-telemetry-seal.mjs", import.meta.url);

for (const option of ["pr", "squash"]) {
test(`${option} seal pushes an orphan telemetry record without touching the feature branch or index`, () => {
  const scratch = mkdtempSync(join(tmpdir(), "seal-branch-"));
  const root = join(scratch, "product");
  const origin = join(scratch, "origin.git");
  const agentDir = join(scratch, "agent");
  mkdirSync(root);
  mkdirSync(agentDir);
  const env = {
    ...process.env,
    PI_CODING_AGENT_DIR: agentDir,
    GIT_CONFIG_GLOBAL: join(scratch, "gitconfig"),
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_AUTHOR_NAME: "test",
    GIT_AUTHOR_EMAIL: "test@example.test",
    GIT_COMMITTER_NAME: "test",
    GIT_COMMITTER_EMAIL: "test@example.test",
  };
  writeFileSync(env.GIT_CONFIG_GLOBAL, "");
  const gitResult = (cwd, ...args) => spawnSync("git", ["-C", cwd, "-c", "commit.gpgsign=false", ...args], {
    encoding: "utf8", env, timeout: 10_000,
  });
  const git = (cwd, ...args) => {
    const result = gitResult(cwd, ...args);
    assert.equal(result.status, 0, `${args.join(" ")}: ${result.stderr}`);
    return result.stdout.trim();
  };
  git(scratch, "init", "--bare", origin);
  git(root, "init", "-b", "main");
  git(root, "remote", "add", "origin", "https://example.test/team/product.git");
  git(root, "config", `url.${origin}.insteadOf`, "https://example.test/team/product.git");
  writeFileSync(join(root, "file.txt"), "base\n");
  git(root, "add", "file.txt");
  git(root, "commit", "-m", "initial");
  git(root, "push", "origin", "main");
  git(root, "switch", "-c", "feature/example");
  const spec = "doc/specs/example.md";
  mkdirSync(join(root, "doc/specs"), { recursive: true });
  writeFileSync(join(root, spec), "# Example\n");
  git(root, "add", spec);
  git(root, "commit", "-m", "add spec");
  const featureHead = git(root, "rev-parse", "HEAD");
  const commonDir = git(root, "rev-parse", "--path-format=absolute", "--git-common-dir");
  const pendingDir = join(commonDir, "gauntlet/telemetry/doc/specs");
  mkdirSync(pendingDir, { recursive: true });
  writeFileSync(join(pendingDir, "example.yaml"),
    `schema: 1\nspec: ${spec}\nrun_id: run-example\nstatus: in_progress\ncreated_at: 2026-01-01\n`);

  if (option === "pr") {
    writeFileSync(join(root, "file.txt"), "staged user change\n");
    git(root, "add", "file.txt");
  }
  const indexTree = git(root, "write-tree");
  const status = git(root, "status", "--porcelain");
  const result = spawnSync(process.execPath, [cli.pathname, "--worktree", root, "--option", option, "--base", "main", "--spec", spec], {
    encoding: "utf8", env, timeout: 30_000,
  });
  assert.equal(result.status, 0, result.stderr);
  const branch = "refs/heads/gauntlet/telemetry";
  const recordPath = "team/product/brainstorming/doc/specs/example.yaml";
  assert.equal(git(root, "rev-parse", "HEAD"), featureHead);
  assert.equal(git(root, "status", "--porcelain"), status);
  assert.equal(git(root, "write-tree"), indexTree);
  assert.equal(git(root, "log", "--format=%s", "main..HEAD", "--grep=^telemetry:"), "");
  assert.equal(git(root, "rev-parse", branch), git(origin, "rev-parse", branch));
  const unrelated = gitResult(root, "merge-base", "main", branch);
  assert.equal(unrelated.status, 1, "telemetry history must have no ancestor shared with main");
  assert.equal(git(origin, "ls-tree", "-r", "--name-only", branch), recordPath);
  const record = parseRecord(git(origin, "show", `${branch}:${recordPath}`));
  assert.ok(record);
  assert.equal(record.spec, spec);
  assert.equal(record.status, "shipped");
  assert.ok(record.shipped_at);

  git(root, "restore", "--staged", "--worktree", "file.txt");
  git(root, "switch", "main");
  git(root, "merge", "--squash", "feature/example");
  git(root, "commit", "-m", "deliver example");
  assert.deepEqual(git(root, "ls-tree", "-r", "--name-only", "HEAD").split("\n"), [spec, "file.txt"]);
});
}
