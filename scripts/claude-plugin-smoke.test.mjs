#!/usr/bin/env node
import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const claude = process.env.CLAUDE_BIN || join(root, "node_modules/.bin/claude");
const scratch = mkdtempSync(join(tmpdir(), "gauntlet-claude-smoke-"));
console.log(`Claude plugin smoke artifacts: ${scratch}`);
const expectedSkills = ["shape-ticket", "gatekeep-pr", "check-delivery", "chase-bug", "linear", "forge-skill"]
  .map((name) => `gauntlet:${name}`).sort();
const candidateMarketplace = JSON.parse(readFileSync(join(root, ".claude-plugin/marketplace.json"), "utf8"));
const manifestPath = join(root, ".claude-plugin/plugin.json");
const candidateManifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : null;
const personas = execFileSync("git", ["ls-files", "agents"], { cwd: root, encoding: "utf8" })
  .trim().split("\n").map((p) => `gauntlet:${p.slice(7, -3)}`).sort();
const files = execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" }).split("\0").filter(Boolean);

function fixture(name) {
  const dir = join(scratch, name);
  const source = join(dir, "marketplace.git");
  const home = join(dir, "home");
  const work = join(dir, "dummy-repo");
  for (const p of [source, home, work]) mkdirSync(p, { recursive: true });
  const env = {
    PATH: process.env.PATH, HOME: home, TMPDIR: tmpdir(),
    CLAUDE_CONFIG_DIR: join(home, ".claude"),
    CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1",
    GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: join(home, ".gitconfig"),
    GIT_TERMINAL_PROMPT: "0",
  };
  function run(command, args, cwd = work) {
    return execFileSync(command, args, { cwd, env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 60000 });
  }
  function git(...args) { return run("git", ["-C", source, ...args]); }
  function commit() {
    git("add", ".");
    git("-c", "user.name=smoke", "-c", "user.email=smoke@example.invalid", "-c", "commit.gpgsign=false", "commit", "-qm", "fixture");
  }
  for (const file of files) {
    const dest = join(source, file);
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(join(root, file), dest);
  }
  run("git", ["init", "-q", "-b", "main", source]);
  run("git", ["init", "-q", "-b", "main", work]);
  const json = (path, data) => writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
  function configure(variant, version) {
    const mp = structuredClone(candidateMarketplace);
    const entry = mp.plugins[0];
    entry.version = version;
    let manifest = structuredClone(candidateManifest);
    if (variant === "baseline") {
      manifest = null;
      entry.strict = false;
      entry.agents = [];
    } else if (variant === "conflict") {
      entry.strict = false;
    } else if (variant === "skills-in-manifest") {
      manifest.skills = entry.skills;
      delete entry.skills;
    }
    json(join(source, ".claude-plugin/marketplace.json"), mp);
    const path = join(source, ".claude-plugin/plugin.json");
    if (manifest) json(path, manifest);
    else rmSync(path, { force: true });
    commit();
  }
  function install() {
    // Exercise Git clone/cache/update, not Claude's live-directory shortcut, without a network server.
    const url = "https://gauntlet-smoke.invalid/marketplace.git";
    run("git", ["config", "--global", `url.${pathToFileURL(source).href}.insteadOf`, url]);
    run(claude, ["plugin", "marketplace", "add", url]);
    run(claude, ["plugin", "install", "gauntlet@pi-gauntlet"]);
  }
  function installed() {
    return JSON.parse(readFileSync(join(env.CLAUDE_CONFIG_DIR, "plugins/installed_plugins.json"), "utf8"))
      .plugins["gauntlet@pi-gauntlet"][0];
  }
  async function inventory(label) {
    // Stop at the real runtime's init event, before any model response. No real credentials or model calls.
    const child = spawn(claude, ["-p", "Reply OK", "--verbose", "--output-format", "stream-json",
      "--no-session-persistence", "--strict-mcp-config", "--mcp-config", '{"mcpServers":{}}'], {
      cwd: work, env: { ...env, ANTHROPIC_API_KEY: "dummy-loader-test", ANTHROPIC_BASE_URL: "http://127.0.0.1:1" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "", stderr = "", pending = "", init;
    const timer = setTimeout(() => child.kill("SIGKILL"), 30000);
    child.stderr.on("data", (data) => { stderr += data; });
    child.stdout.on("data", (data) => {
      stdout += data;
      pending += data;
      let end;
      while ((end = pending.indexOf("\n")) !== -1) {
        const line = pending.slice(0, end);
        pending = pending.slice(end + 1);
        let event;
        try { event = JSON.parse(line); } catch { continue; }
        if (event.type === "system" && event.subtype === "init") {
          init = event;
          child.kill("SIGTERM");
        }
      }
    });
    await new Promise((resolve, reject) => { child.on("error", reject); child.on("close", resolve); }).finally(() => clearTimeout(timer));
    writeFileSync(join(dir, `${label}.jsonl`), stdout);
    writeFileSync(join(dir, `${label}.stderr`), stderr);
    assert.ok(init, `Claude emitted no init event: ${stderr}\n${stdout}`);
    return init;
  }
  return { configure, install, installed, inventory, run, source };
}

function assertPortable(init) {
  assert.ok(init.plugins.some((p) => p.source === "gauntlet@pi-gauntlet"), "gauntlet plugin failed to load");
  assert.deepEqual(init.agents.filter((n) => n.startsWith("gauntlet:")).sort(), [], "pi personas leaked into Claude");
  assert.deepEqual(init.skills.filter((n) => n.startsWith("gauntlet:")).sort(), expectedSkills, "Claude skill allowlist changed");
  assert.ok(init.agents.includes("general-purpose"), "native helper unavailable");
  assert.ok(init.tools.includes("Task") || init.tools.includes("Agent"), "native helper dispatch unavailable");
}

console.log(execFileSync(claude, ["--version"], { encoding: "utf8" }).trim());
const fresh = fixture("fresh");
fresh.configure("candidate", "1.0.1");
fresh.install();
assertPortable(await fresh.inventory("candidate"));
assert.equal(fresh.installed().version, "1.0.1", "versionless manifest must use marketplace version");
console.log("PASS: fresh Git-marketplace install loads zero pi agents and exactly six portable skills");

const upgrade = fixture("upgrade");
upgrade.configure("baseline", "1.0.0");
upgrade.install();
const before = await upgrade.inventory("before");
assert.deepEqual(before.agents.filter((n) => n.startsWith("gauntlet:")).sort(), personas);
assert.throws(() => assertPortable(before), /pi personas leaked/);
const oldPath = upgrade.installed().installPath;
upgrade.configure("candidate", "1.0.1");
upgrade.run(claude, ["plugin", "marketplace", "update", "pi-gauntlet"]);
upgrade.run(claude, ["plugin", "update", "gauntlet@pi-gauntlet"]);
const updated = upgrade.installed();
assert.equal(updated.version, "1.0.1");
assert.notEqual(updated.installPath, oldPath, "upgrade must replace the cached plugin");
assert.deepEqual(JSON.parse(readFileSync(join(updated.installPath, ".claude-plugin/plugin.json"), "utf8")), candidateManifest);
assertPortable(await upgrade.inventory("after"));
console.log("PASS: cached upgrade replaces marketplace version and removes the reproduced agent leak");

for (const variant of ["conflict", "skills-in-manifest"]) {
  const control = fixture(variant);
  control.configure(variant, "1.0.1");
  control.install();
  const init = await control.inventory(variant);
  assert.throws(() => assertPortable(init), variant === "conflict" ? /plugin failed to load/ : /allowlist changed/);
  console.log(`PASS: inventory assertions reject ${variant}`);
}
