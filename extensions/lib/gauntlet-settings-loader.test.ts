import assert from "node:assert/strict";
import { after, test } from "node:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadGauntletSettings } from "./gauntlet-settings-loader.ts";

const tempDirs: string[] = [];
after(() => { for (const d of tempDirs) rmSync(d, { recursive: true, force: true }); });
const tmp = () => { const d = realpathSync(mkdtempSync(join(tmpdir(), "settings-loader-test-"))); tempDirs.push(d); return d; };
const gitRepo = () => { const d = tmp(); execFileSync("git", ["init", "-q", d]); return d; };

test("settings resolve from the checkout root when cwd is a subdirectory (AC 2)", () => {
  const repo = gitRepo();
  mkdirSync(join(repo, ".pi"));
  mkdirSync(join(repo, "doc"));
  writeFileSync(join(repo, ".pi", "settings.json"), JSON.stringify({ piGauntlet: { specCouncil: { members: ["p/m"] } } }));
  const loaded = loadGauntletSettings(join(repo, "doc"), "/tmp/pi-gauntlet-test-agent");
  assert.equal(loaded.root, repo);
  assert.deepEqual(loaded.gauntlet.specCouncil, { members: ["p/m"] });
  assert.deepEqual(loaded.errors, []);
});

test("outside any checkout the loader falls back to cwd", () => {
  const dir = tmp();
  mkdirSync(join(dir, ".pi"));
  writeFileSync(join(dir, ".pi", "settings.json"), JSON.stringify({ piGauntlet: { flowGuards: { enforce: false } } }));
  const loaded = loadGauntletSettings(dir, "/tmp/pi-gauntlet-test-agent");
  assert.equal(loaded.root, dir);
  assert.deepEqual(loaded.gauntlet.flowGuards, { enforce: false });
});

test("settings resolve through the jj fallback in a plain jj workspace (no .git)", () => {
  const dir = tmp();
  mkdirSync(join(dir, ".jj", "repo"), { recursive: true }); // primary jj checkout marker
  mkdirSync(join(dir, ".pi"));
  mkdirSync(join(dir, "doc"));
  writeFileSync(join(dir, ".pi", "settings.json"), JSON.stringify({ piGauntlet: { specCouncil: { members: ["p/jj"] } } }));
  const jjCheckout = () => ({ toplevel: dir, isPrimary: true, via: "jj" as const });
  const loaded = loadGauntletSettings(join(dir, "doc"), "/tmp/pi-gauntlet-test-agent", jjCheckout);
  assert.equal(loaded.root, dir);
  assert.deepEqual(loaded.gauntlet.specCouncil, { members: ["p/jj"] });
  assert.deepEqual(loaded.errors, []);
});
