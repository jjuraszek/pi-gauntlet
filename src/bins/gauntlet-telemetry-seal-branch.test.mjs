import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseRecord } from "../../extensions/lib/telemetry-record.ts";

const cli = new URL("./gauntlet-telemetry-seal.mjs", import.meta.url);

for (const { option, separateRemote } of [
  { option: "pr", separateRemote: false },
  { option: "squash", separateRemote: false },
  { option: "pr", separateRemote: true },
]) {
test(`${option} seal pushes an orphan telemetry record to ${separateRemote ? "the configured remote" : "origin"} without touching the feature branch or index`, () => {
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
  const originRefs = git(origin, "show-ref");
  const remoteConfig = git(root, "remote", "-v");
  const destination = separateRemote ? join(scratch, "telemetry.git") : origin;
  if (separateRemote) {
    git(scratch, "init", "--bare", destination);
    writeFileSync(join(agentDir, "settings.json"), JSON.stringify({
      piGauntlet: { telemetry: { remote: new URL(`file://${destination}`).href } },
    }));
  }
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
  const localHeads = git(root, "show-ref", "--heads");
  const remoteHeads = git(root, "ls-remote", "--heads", destination);
  const legs = ["--leg", "Team/Companion=abc1234", "--leg", "team/other=https://example.test/pull/2"];
  const result = spawnSync(process.execPath, [cli.pathname, "--worktree", root, "--option", option, "--base", "main", "--spec", spec, ...legs], {
    encoding: "utf8", env, timeout: 30_000,
  });
  assert.equal(result.status, 0, result.stderr);
  const branch = "refs/telemetry/records";
  assert.equal(git(root, "show-ref", "--heads"), localHeads, "sealing must not create a local branch");
  assert.equal(git(root, "ls-remote", "--heads", destination), remoteHeads, "sealing must not create a remote branch");
  assert.equal(git(root, "ls-remote", destination, "refs/telemetry/*"), `${git(root, "rev-parse", branch)}\t${branch}`);
  const recordPath = "team/product/brainstorming/doc/specs/example.yaml";
  assert.equal(git(root, "rev-parse", "HEAD"), featureHead);
  assert.equal(git(root, "status", "--porcelain"), status);
  assert.equal(git(root, "write-tree"), indexTree);
  assert.equal(git(root, "log", "--format=%s", "main..HEAD", "--grep=^telemetry:"), "");
  if (separateRemote) {
    assert.equal(git(origin, "show-ref"), originRefs, "origin must receive no telemetry refs");
    assert.equal(git(root, "remote", "-v"), remoteConfig, "the seal must not add a remote");
  }
  assert.equal(git(root, "rev-parse", branch), git(destination, "rev-parse", branch));
  const unrelated = gitResult(root, "merge-base", "main", branch);
  assert.equal(unrelated.status, 1, "telemetry history must have no ancestor shared with main");
  assert.equal(git(destination, "ls-tree", "-r", "--name-only", branch), recordPath);
  const record = parseRecord(git(destination, "show", `${branch}:${recordPath}`));
  assert.ok(record);
  assert.equal(record.spec, spec);
  assert.equal(record.status, "shipped");
  assert.ok(record.shipped_at);
  assert.deepEqual(record.legs, [{ repo: "Team/Companion", sha: "abc1234" }, { repo: "team/other", pr: "https://example.test/pull/2" }]);
  assert.equal(existsSync(join(pendingDir, "example.yaml")), false, "the branch owns the committed record");
  const sealedHead = git(root, "rev-parse", branch);
  for (const selector of [["--spec", spec], []]) {
    const retry = spawnSync(process.execPath, [cli.pathname, "--worktree", root, "--option", option, "--base", "main", ...selector, "--leg", legs[3], "--leg", "team/companion=abc1234"], {
      encoding: "utf8", env, timeout: 30_000,
    });
    assert.equal(retry.status, 0, retry.stderr);
    assert.match(retry.stdout, /^already sealed /);
    assert.equal(git(root, "rev-parse", branch), sealedHead, "retry must not re-stamp or commit");
  }

  git(root, "restore", "--staged", "--worktree", "file.txt");
  git(root, "switch", "main");
  git(root, "merge", "--squash", "feature/example");
  git(root, "commit", "-m", "deliver example");
  assert.deepEqual(git(root, "ls-tree", "-r", "--name-only", "HEAD").split("\n"), [spec, "file.txt"]);
});
}
