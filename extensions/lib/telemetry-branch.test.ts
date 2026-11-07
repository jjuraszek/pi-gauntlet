import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, chmodSync } from "node:fs";
import { isolatedGitEnv } from "../test-support/git-env.mjs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

const library = new URL("./telemetry-branch.ts", import.meta.url).href;

function fixture() {
  const scratch = mkdtempSync(join(tmpdir(), "telemetry-identity-"));
  const root = join(scratch, "primary product");
  const home = join(scratch, "home");
  mkdirSync(root); mkdirSync(home);
  const env = { ...process.env, HOME: home, ...isolatedGitEnv(scratch) };
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
  return { scratch, root, git, identity, run };
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

test("failed telemetry ref commit reports committed: false and preserves the feature index", (t) => {
  const f = fixture();
  t.after(() => rmSync(f.scratch, { recursive: true, force: true }));
  writeFileSync(join(f.root, "file"), "feature\n");
  f.git("add", "file");
  f.git("commit", "-m", "initial");
  const before = f.git("rev-parse", "HEAD");
  const index = readFileSync(join(f.root, ".git/index"));
  const hook = join(f.root, ".git/hooks/reference-transaction");
  writeFileSync(hook, '#!/bin/sh\nif [ "$1" = prepared ]; then echo rejected >&2; exit 1; fi\n');
  chmodSync(hook, 0o755);
  const result = JSON.parse(f.run(process.execPath, ["--input-type=module", "--eval",
    `import { syncTelemetryBranch } from ${JSON.stringify(library)}; console.log(JSON.stringify(syncTelemetryBranch(process.cwd(), new Map([["team/product/brainstorming/x.yaml", "schema: 1\\n"]]))));`,
  ]));
  assert.equal(result.ok, false);
  assert.equal(result.committed, false);
  assert.equal(result.pushed, false);
  assert.match(result.reason, /rejected|reference transaction/);
  assert.equal(f.git("rev-parse", "HEAD"), before);
  assert.deepEqual(readFileSync(join(f.root, ".git/index")), index);
  assert.equal(f.git("for-each-ref", "refs/heads/gauntlet/telemetry"), "");
});

test("record comparison reports missing paths and every conflicting snapshot pair", () => {
  const f = fixture();
  const snapshots = ["remote", "local", "destination"].map(label => {
    writeFileSync(join(f.root, "record.yaml"), label + "\n");
    f.git("add", "."); f.git("commit", "-m", label);
    return { label, oid: f.git("rev-parse", "HEAD") };
  });
  const [remote, local, destination] = snapshots;
  const empty = { label: "empty", oid: null };
  for (const [sources, dest, conflicts, missing] of [
    [[remote], remote, [], []],
    [[remote], empty, [], [{ path: "record.yaml", source: remote }]],
    [[remote], destination, [{ path: "record.yaml", a: "remote", b: "destination" }], []],
    [[remote, local], empty, [{ path: "record.yaml", a: "remote", b: "local" }], [{ path: "record.yaml", source: remote }]],
    [[remote, local], destination, [
      { path: "record.yaml", a: "remote", b: "local" },
      { path: "record.yaml", a: "remote", b: "destination" },
      { path: "record.yaml", a: "local", b: "destination" },
    ], []],
  ]) {
    const result = JSON.parse(f.run(process.execPath, ["--input-type=module", "--eval",
      `import { compareRecords } from ${JSON.stringify(library)}; console.log(JSON.stringify(compareRecords(process.cwd(), ${JSON.stringify(sources)}, ${JSON.stringify(dest)})));`,
    ]));
    assert.deepEqual(result, { conflicts, missing });
  }
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
