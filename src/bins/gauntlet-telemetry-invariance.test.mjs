import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, readlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const seal = new URL("./gauntlet-telemetry-seal.mjs", import.meta.url).pathname;
const branchLibrary = new URL("../../extensions/lib/telemetry-branch.ts", import.meta.url).href;
const hasJj = spawnSync("jj", ["--version"], { timeout: 5000 }).status === 0;

function snapshot(root) {
  const files = [];
  for (const entry of readdirSync(root, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name === ".git") continue;
    const path = join(root, entry.name);
    files.push([entry.name, entry.isDirectory() ? snapshot(path) : entry.isSymbolicLink() ? readlinkSync(path) : readFileSync(path)]);
  }
  return files;
}

for (const workspace of ["git", "linked", "jj-colocated"]) {
  for (const operation of ["seal", "leg", "rejected leg push"]) {
    test(`${operation} preserves checkout bytes and worktrees in ${workspace}`, {
      skip: workspace === "jj-colocated" && !hasJj ? "jj is not installed" : false,
    }, () => {
      const scratch = mkdtempSync(join(tmpdir(), "telemetry-invariance-"));
      const primary = join(scratch, "product");
      const origin = join(scratch, "origin.git");
      const temporary = join(scratch, "temporary");
      const agent = join(scratch, "agent");
      for (const dir of [primary, temporary, agent]) mkdirSync(dir);
      const env = {
        ...process.env,
        TMPDIR: temporary,
        PI_CODING_AGENT_DIR: agent,
        GIT_CONFIG_GLOBAL: join(scratch, "gitconfig"),
        GIT_CONFIG_NOSYSTEM: "1",
        GIT_AUTHOR_NAME: "test", GIT_AUTHOR_EMAIL: "test@example.test",
        GIT_COMMITTER_NAME: "test", GIT_COMMITTER_EMAIL: "test@example.test",
        JJ_CONFIG: join(scratch, "jjconfig.toml"),
      };
      writeFileSync(env.GIT_CONFIG_GLOBAL, "");
      writeFileSync(env.JJ_CONFIG, '[user]\nname = "test"\nemail = "test@example.test"\n');
      const run = (binary, args, cwd = primary) => {
        const result = spawnSync(binary, args, { cwd, env, encoding: "utf8", timeout: 30_000 });
        assert.equal(result.status, 0, `${binary} ${args.join(" ")}: ${result.stderr}`);
        return result.stdout.trim();
      };
      const git = (cwd, ...args) => run("git", ["-c", "commit.gpgsign=false", ...args], cwd);
      git(scratch, "init", "--bare", origin);
      git(primary, "init", "-b", "main");
      git(primary, "config", "user.name", "test");
      git(primary, "config", "user.email", "test@example.test");
      git(primary, "remote", "add", "origin", "https://example.test/team/product.git");
      git(primary, "config", `url.${origin}.insteadOf`, "https://example.test/team/product.git");
      mkdirSync(join(primary, "doc/specs"), { recursive: true });
      writeFileSync(join(primary, "doc/specs/example.md"), "# Example\n");
      writeFileSync(join(primary, "user.txt"), "base\n");
      git(primary, "add", ".");
      git(primary, "commit", "-m", "initial");
      git(primary, "push", "origin", "main");
      let root = primary;
      if (workspace === "linked") {
        root = join(scratch, "linked");
        git(primary, "worktree", "add", "-b", "feature/example", root);
      } else {
        git(primary, "switch", "-c", "feature/example");
        if (workspace === "jj-colocated") run("jj", ["git", "init", "--colocate"]);
      }
      writeFileSync(join(root, "user.txt"), "staged user change\n");
      git(root, "add", "user.txt");
      writeFileSync(join(root, "user.txt"), "unstaged user change\n");
      writeFileSync(join(root, "untracked.txt"), "untracked user change\n");
      const common = git(root, "rev-parse", "--path-format=absolute", "--git-common-dir");
      const pending = join(common, "gauntlet/telemetry/doc/specs");
      mkdirSync(pending, { recursive: true });
      writeFileSync(join(pending, "example.yaml"), "schema: 1\nspec: doc/specs/example.md\nrun_id: test\nstatus: in_progress\ncreated_at: 2026-01-01\n");
      if (operation === "rejected leg push") git(root, "remote", "set-url", "--push", "origin", join(scratch, "missing.git"));
      const index = git(root, "rev-parse", "--path-format=absolute", "--git-path", "index");
      const before = {
        files: snapshot(root), index: readFileSync(index),
        head: git(root, "rev-parse", "HEAD"), worktrees: git(root, "worktree", "list", "--porcelain"),
      };
      if (operation === "seal") {
        assert.match(run(process.execPath, [seal, "--worktree", root, "--option", "pr", "--base", "main", "--spec", "doc/specs/example.md"], root), /^sealed /);
      } else {
        const script = `import { syncTelemetryBranch } from ${JSON.stringify(branchLibrary)}; console.log(JSON.stringify(syncTelemetryBranch(process.cwd(), new Map([["team/product/shape-ticket/20260101T000000Z-session.yaml", "skill: shape-ticket\\nsession: session\\n"]]))));`;
        const result = JSON.parse(run(process.execPath, ["--input-type=module", "--eval", script], root));
        assert.equal(result.ok, operation !== "rejected leg push", result.warning);
      }
      assert.deepEqual(readFileSync(index), before.index, "checkout index bytes");
      assert.deepEqual(snapshot(root), before.files, "checkout file bytes, including jj metadata");
      assert.equal(git(root, "rev-parse", "HEAD"), before.head);
      assert.equal(git(root, "worktree", "list", "--porcelain"), before.worktrees);
      assert.deepEqual(readdirSync(temporary), [], "no clone, worktree, or temporary index remains");
      const ref = "refs/heads/gauntlet/telemetry";
      assert.match(git(root, "ls-tree", "-r", "--name-only", ref), operation === "seal" ? /brainstorming\/doc\/specs\/example.yaml/ : /shape-ticket\/20260101T000000Z-session.yaml/);
      if (operation !== "rejected leg push") assert.equal(git(origin, "rev-parse", ref), git(root, "rev-parse", ref));
    });
  }
}
