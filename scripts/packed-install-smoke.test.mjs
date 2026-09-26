#!/usr/bin/env node
// Packed-install smoke (gh-39): the npm tarball, unpacked into a scratch
// node_modules/pi-gauntlet, runs both bundled bins without
// ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING. Never npm-installs the tarball -
// its postinstall would re-point persona links in the real ~/.pi/agent* dirs.
import { after, test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CRASH = "ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING";

const scratch = mkdtempSync(join(tmpdir(), "gauntlet-packed-smoke-"));
after(() => rmSync(scratch, { recursive: true, force: true }));

// Layout: <scratch>/node_modules/pi-gauntlet (the unpacked tarball) + yaml sibling.
const nm = join(scratch, "node_modules");
const pkgDir = join(nm, "pi-gauntlet");
const agentDir = join(scratch, "agent");
const fixture = join(scratch, "fixture");
const emptyDir = join(scratch, "empty");
const corpusDir = join(scratch, "corpus");
mkdirSync(nm, { recursive: true });
mkdirSync(agentDir);
mkdirSync(emptyDir);
mkdirSync(corpusDir);

const tgzName = execFileSync("npm", ["pack", "--pack-destination", scratch], {
  cwd: root,
  encoding: "utf8",
}).trim().split("\n").at(-1);
execFileSync("tar", ["xzf", join(scratch, tgzName), "-C", nm]);
renameSync(join(nm, "package"), pkgDir);

const yamlSource = join(root, "node_modules", "yaml");
if (!existsSync(yamlSource)) throw new Error("node_modules/yaml missing - run npm install first");
symlinkSync(yamlSource, join(nm, "yaml"), "dir");

// Disposable fixture: git init + one empty commit + git update-ref refs/remotes/origin/main HEAD,
// so --base origin/main resolves and the branch carries no spec.
execFileSync("git", ["init", "-q", "-b", "main", fixture]);
execFileSync("git", [
  "-C", fixture,
  "-c", "user.email=smoke@test",
  "-c", "user.name=smoke",
  "commit", "-q", "--allow-empty", "-m", "init",
]);
execFileSync("git", ["-C", fixture, "update-ref", "refs/remotes/origin/main", "HEAD"]);

const run = (binRel, args) =>
  spawnSync(process.execPath, [join(pkgDir, binRel), ...args], {
    cwd: scratch,
    env: { ...process.env, PI_CODING_AGENT_DIR: agentDir },
    encoding: "utf8",
  });

test("seal: no-arg invocation prints usage and exits 1 without crashing", () => {
  const r = run("bin/gauntlet-telemetry-seal.mjs", []);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /^usage: gauntlet-telemetry-seal/);
  assert.ok(!r.stderr.includes(CRASH), r.stderr);
});

test("seal: non-git dir -> not a git checkout, exit 1", () => {
  const r = run("bin/gauntlet-telemetry-seal.mjs", ["--worktree", emptyDir, "--option", "squash", "--base", "origin/main"]);
  assert.equal(r.status, 1);
  assert.equal(r.stderr.trim(), "not a git checkout");
  assert.ok(!r.stderr.includes(CRASH), r.stderr);
});

test("seal: fixture branch with no spec -> no telemetry run", () => {
  const r = run("bin/gauntlet-telemetry-seal.mjs", ["--worktree", fixture, "--option", "squash", "--base", "origin/main"]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout.trim(), "no telemetry run");
  assert.ok(!r.stderr.includes(CRASH), r.stderr);
});

test("performance: empty-corpus digest", () => {
  const r = run("bin/gauntlet-performance.mjs", ["--dir", corpusDir]);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /no records found/);
  assert.ok(!r.stderr.includes(CRASH), r.stderr);
});

test("negative control: a planted relative .ts import still crashes", () => {
  const bundle = readFileSync(join(pkgDir, "bin/gauntlet-performance.mjs"), "utf8");
  writeFileSync(
    join(pkgDir, "bin/neg-control.mjs"),
    `${bundle}\nimport "../extensions/lib/gauntlet-settings.ts";\n`,
  );
  const r = run("bin/neg-control.mjs", []);
  assert.notEqual(r.status, 0);
  assert.ok(r.stderr.includes(CRASH), r.stderr);
});
