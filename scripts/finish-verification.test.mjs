import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

const skill = readFileSync(new URL("../skills/finishing-a-development-branch/SKILL.md", import.meta.url), "utf8");
const rule = skill.match(/\*\*Skip rule\.\*\*[^\n]+/)[0];
const commands = [...rule.matchAll(/`(git -C "\$WORKTREE"[^`]+)`/g)].map((m) => m[1]);
assert.ok(commands.length, "skip rule must contain executable Git checks");

test("ledger finish preserves verification, strip and amendment contracts", () => {
  assert.ok(skill.includes("# Ledger - loop engine"));
  assert.ok(skill.includes("verification:"));
  assert.ok(skill.includes("<spec stem>-ledger.md"));
  assert.match(skill, /--grep[^\n]*loop: cut row[^\n]*loop: amend/);
  assert.match(skill, /take the `auto-apply` and `granted` records from those commit bodies/);
});

for (const telemetry of [".pi/gauntlet/telemetry", "records/custom telemetry"]) {
  for (const scenario of [
    ["clean tree", true, () => {}],
    ["unstaged source edit", false, ({ write }) => write("source.txt", "changed")],
    ["staged source edit", false, ({ write, git }) => { write("source.txt", "changed"); git("add", "source.txt"); }],
    ["untracked source file", false, ({ write }) => write("new source.txt", "new")],
    ["committed source edit", false, ({ write, commit }) => { write("source.txt", "changed"); commit(); }],
    ["staged edit restored only in worktree", false, ({ write, git }) => { write("source.txt", "changed"); git("add", "source.txt"); write("source.txt", "original"); }],
    ["unstaged telemetry edit", true, ({ write }) => write(`${telemetry}/run.yaml`, "changed")],
    ["untracked telemetry file", true, ({ write }) => write(`${telemetry}/new.yaml`, "new")],
    ["committed telemetry edit", true, ({ write, commit }) => { write(`${telemetry}/run.yaml`, "changed"); commit(); }],
    ["telemetry-named sibling is not excluded", false, ({ write }) => write(`${telemetry}-other/source.txt`, "new")],
    ["unknown verified commit", false, ({ state }) => { state.sha = "missing-verified-commit"; }],
  ]) {
    const [name, maySkip, arrange] = scenario;
    test(`${telemetry}: ${name}`, () => {
      const worktree = mkdtempSync(join(tmpdir(), "finish-verification-"));
      const git = (...args) => execFileSync("git", ["-C", worktree, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
      const write = (path, value) => {
        mkdirSync(join(worktree, path, ".."), { recursive: true });
        writeFileSync(join(worktree, path), value);
      };
      const commit = () => { git("add", "."); git("commit", "-qm", "fixture"); };
      git("init", "-q");
      git("config", "user.name", "Fixture");
      git("config", "user.email", "fixture@example.invalid");
      git("config", "commit.gpgsign", "false");
      git("config", "core.hooksPath", "/dev/null");
      write("source.txt", "original");
      write(`${telemetry}/run.yaml`, "original");
      commit();
      const state = { sha: git("rev-parse", "HEAD") };
      arrange({ write, git, commit, state });
      const results = commands.map((command) => spawnSync("bash", ["-c", command
        .replaceAll("<commit the run passed on>", state.sha)
        .replaceAll("<telemetry.dir>", telemetry)], {
        cwd: tmpdir(),
        env: { ...process.env, WORKTREE: worktree },
        encoding: "utf8",
      }));
      const actual = results.every((r) => r.status === 0 && r.stdout.trim() === "");
      assert.equal(actual, maySkip, `skip=${actual}; ${JSON.stringify(results.map((r) => ({ status: r.status, stdout: r.stdout, stderr: r.stderr })))}`);
    });
  }
}
