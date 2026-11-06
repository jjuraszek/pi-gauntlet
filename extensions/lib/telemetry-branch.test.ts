import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

const library = new URL("./telemetry-branch.ts", import.meta.url).href;

function fixture() {
  const scratch = mkdtempSync(join(tmpdir(), "telemetry-identity-"));
  const root = join(scratch, "primary product");
  const home = join(scratch, "home");
  mkdirSync(root); mkdirSync(home);
  const env = {
    ...process.env, HOME: home, GIT_CONFIG_GLOBAL: join(scratch, "gitconfig"), GIT_CONFIG_NOSYSTEM: "1",
    GIT_AUTHOR_NAME: "test", GIT_AUTHOR_EMAIL: "test@example.test",
    GIT_COMMITTER_NAME: "test", GIT_COMMITTER_EMAIL: "test@example.test",
  };
  writeFileSync(env.GIT_CONFIG_GLOBAL, "");
  const run = (binary: string, args: string[], cwd = root) => {
    const result = spawnSync(binary, args, { cwd, env, encoding: "utf8", timeout: 10_000 });
    assert.equal(result.status, 0, `${binary} ${args.join(" ")}: ${result.stderr}`);
    return result.stdout.trim();
  };
  const git = (...args: string[]) => run("git", ["-c", "commit.gpgsign=false", ...args]);
  git("init", "-b", "main");
  const identity = (cwd = root) => JSON.parse(run(process.execPath, ["--input-type=module", "--eval",
    `import { telemetryRepo } from ${JSON.stringify(library)}; console.log(JSON.stringify(telemetryRepo(process.cwd()) ?? null));`,
  ], cwd));
  return { scratch, root, git, identity };
}

test("repository identity normalizes origin URL forms and keeps every namespace segment", async (t) => {
  const f = fixture();
  for (const [name, url, expected] of [
    ["scp", "git@host.test:team/product.git", "team/product"],
    ["ssh", "ssh://git@host.test/team/product.git", "team/product"],
    ["ssh port and nested namespace", "ssh://git@host.test:2222/group/sub/product.git/", "group/sub/product"],
    ["https", "https://host.test/team/product.git/", "team/product"],
    ["nested scp", "git@host.test:group/sub/product.git", "group/sub/product"],
    ["nested https", "https://host.test/group/other/product/", "group/other/product"],
    ["case preserved", "https://host.test/Team/Product.git", "Team/Product"],
  ]) {
    await t.test(name, () => {
      f.git("config", "remote.origin.url", url);
      assert.equal(f.identity(), expected);
    });
  }
  mkdirSync(join(f.root, ".pi"));
  writeFileSync(join(f.root, ".pi/settings.json"), JSON.stringify({ piGauntlet: { telemetry: { remote: "https://elsewhere.test/central/telemetry.git" } } }));
  assert.equal(f.identity(), "Team/Product", "telemetry.remote never changes product identity");
});

test("origin-less identity uses repo from the first-found overrides Issue tracker section", () => {
  const f = fixture();
  mkdirSync(join(f.root, ".pi"));
  mkdirSync(join(f.root, "doc"));
  writeFileSync(join(f.root, "doc/gauntlet-overrides.md"), "## Issue tracker\n- repo: doc/product\n");
  assert.equal(f.identity(), "doc/product");
  writeFileSync(join(f.root, "gauntlet-overrides.md"), "## Issue tracker\n- repo: root/product\n");
  assert.equal(f.identity(), "root/product");
  writeFileSync(join(f.root, ".pi/gauntlet-overrides.md"), "## Other\n- repo: wrong/product\n## Issue tracker\n- tracker: none\n- repo: group/sub/product\n## Later\n- repo: also/wrong\n");
  assert.equal(f.identity(), "group/sub/product");
  f.git("config", "remote.origin.url", "git@host.test:origin/product.git");
  assert.equal(f.identity(), "origin/product", "origin takes precedence over overrides");
});

test("local fallback uses the primary directory from linked worktrees and ignores later overrides", () => {
  const f = fixture();
  assert.equal(f.identity(), "local/primary product");
  mkdirSync(join(f.root, ".pi"));
  writeFileSync(join(f.root, ".pi/gauntlet-overrides.md"), "## Issue tracker\n- repo:\n- tracker: none\n## Other\n- repo: wrong/product\n");
  writeFileSync(join(f.root, "gauntlet-overrides.md"), "## Issue tracker\n- repo: ignored/product\n");
  assert.equal(f.identity(), "local/primary product");
  f.git("commit", "--allow-empty", "-m", "initial");
  const linked = join(f.scratch, "different worktree");
  f.git("worktree", "add", "-b", "feature", linked);
  const nested = join(linked, "nested");
  mkdirSync(nested);
  assert.equal(f.identity(linked), "local/primary product");
  assert.equal(f.identity(nested), "local/primary product");
});
