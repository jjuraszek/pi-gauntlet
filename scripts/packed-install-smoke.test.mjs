#!/usr/bin/env node
// Packed-install smoke (gh-39): the npm tarball, unpacked into a scratch
// node_modules/pi-gauntlet, runs the bundled bins without
// ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING. Installer checks use isolated
// homes and profiles so they cannot re-point the user's persona links.
import { after, test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
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

test("seal: non-git dir -> not a git or jj checkout, exit 1", () => {
  const r = run("bin/gauntlet-telemetry-seal.mjs", ["--worktree", emptyDir, "--option", "squash", "--base", "origin/main"]);
  assert.equal(r.status, 1);
  assert.equal(r.stderr.trim(), "not a git or jj checkout");
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

test("spec-index: runs from the packed install (usage error, no crash)", () => {
  const r = run("bin/gauntlet-spec-index.mjs", []);
  assert.equal(r.status, 1);
  assert.ok(!r.stderr.includes(CRASH), r.stderr);
});

test("packed personas retain their bytes and install as user links or project copies", () => {
  const names = readdirSync(join(root, "agents")).filter((name) => name.endsWith(".md")).sort();
  assert.deepEqual(readdirSync(join(pkgDir, "agents")).sort(), names);
  for (const name of names) {
    assert.equal(readFileSync(join(pkgDir, "agents", name), "utf8"), readFileSync(join(root, "agents", name), "utf8"));
  }
  for (const mode of ["user", "project", "override"]) {
    const home = join(scratch, `home-${mode}`);
    const profile = join(home, ".pi", "test-profile");
    let source = pkgDir;
    let target = join(profile, "agents");
    const env = { ...process.env, HOME: home, PI_CODING_AGENT_DIR: profile };
    delete env.PI_GAUNTLET_AGENT_DIR;
    mkdirSync(home, { recursive: true });
    if (mode === "project") {
      source = join(scratch, "project", ".pi", "npm", "node_modules", "pi-gauntlet");
      cpSync(pkgDir, source, { recursive: true });
      target = join(scratch, "project", ".pi", "agents");
    } else if (mode === "override") {
      target = join(scratch, "override-agents");
      env.PI_GAUNTLET_AGENT_DIR = target;
    }
    for (let install = 0; install < 2; install++) {
      execFileSync(process.execPath, [join(source, "bin/install-agents.mjs")], { env, stdio: "pipe" });
      assert.deepEqual(readdirSync(target).sort(), names);
      for (const name of names) {
        const dest = join(target, name);
        assert.equal(lstatSync(dest).isSymbolicLink(), mode !== "project");
        assert.equal(readFileSync(dest, "utf8"), readFileSync(join(root, "agents", name), "utf8"));
        if (mode !== "project") assert.equal(realpathSync(dest), realpathSync(join(source, "agents", name)));
      }
    }
  }
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
