import assert from "node:assert/strict";
import { after, test } from "node:test";
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import registerVerifyBeforeShip from "./verify-before-ship.ts";
import { execFileSync } from "node:child_process";

const tempDirs: string[] = [];
after(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
});

function harness() {
  const handlers = new Map<string, ((event: unknown, ctx: unknown) => unknown)[]>();
  const dir = mkdtempSync(join(tmpdir(), "verify-before-ship-test-"));
  tempDirs.push(dir);
  const ctx = { cwd: dir };
  const pi = {
    on(event: string, handler: (event: unknown, context: unknown) => unknown) {
      const registered = handlers.get(event) ?? [];
      registered.push(handler);
      handlers.set(event, registered);
    },
  };
  registerVerifyBeforeShip(pi as any);
  const emitEvent = async (name: string, event: unknown) => {
    const results: unknown[] = [];
    for (const handler of handlers.get(name) ?? []) results.push(await handler(event, ctx));
    return results;
  };
  return { emitEvent, dir };
}

const bashCall = (id: string, command: string) => ({ toolName: "bash", toolCallId: id, input: { command } });
const bashResult = (id: string, isError = false) => ({
  toolName: "bash",
  toolCallId: id,
  isError,
  content: [{ type: "text", text: "ok" }],
});
const writeCall = (id: string, path: string) => ({ toolName: "write", toolCallId: id, input: { path } });

const editSource = async (h: ReturnType<typeof harness>) => {
  await h.emitEvent("tool_call", writeCall("w1", "src/x.ts"));
};

const warningOf = (results: unknown[]): string | undefined => {
  const r = results[0] as { content?: { text?: string }[] } | undefined;
  return r?.content?.[0]?.text;
};

test("git commit is not watched: no warning even when unverified", async () => {
  const h = harness();
  await editSource(h);
  await h.emitEvent("tool_call", bashCall("c1", "git commit -m 'wave 1'"));
  assert.equal((await h.emitEvent("tool_result", bashResult("c1")))[0], undefined);
});

test("git push warns when unverified", async () => {
  const h = harness();
  await editSource(h);
  await h.emitEvent("tool_call", bashCall("p1", "git push origin main"));
  const warning = warningOf(await h.emitEvent("tool_result", bashResult("p1")));
  assert.match(warning ?? "", /ran without verification/);
});

test("gh pr create warns when unverified", async () => {
  const h = harness();
  await editSource(h);
  await h.emitEvent("tool_call", bashCall("pr1", "gh pr create --fill"));
  const warning = warningOf(await h.emitEvent("tool_result", bashResult("pr1")));
  assert.match(warning ?? "", /ran without verification/);
});

test("git -C <worktree> push and merge --squash are ship events (AC 5)", async () => {
  for (const cmd of ["git -C /p push -u origin HEAD", "git -C /p merge --squash f"]) {
    const h = harness();
    await editSource(h);
    await h.emitEvent("tool_call", bashCall("s1", cmd));
    assert.match(warningOf(await h.emitEvent("tool_result", bashResult("s1"))) ?? "", /ran without verification/, cmd);
  }
});

test("a quoted mention of git push is not a ship event", async () => {
  const h = harness();
  await editSource(h);
  await h.emitEvent("tool_call", bashCall("q1", 'rg "git push" skills/'));
  assert.equal((await h.emitEvent("tool_result", bashResult("q1")))[0], undefined);
});

test("a passing recognised run clears the warning for push", async () => {
  const h = harness();
  await editSource(h);
  await h.emitEvent("tool_call", bashCall("t1", "npm test"));
  await h.emitEvent("tool_result", bashResult("t1"));
  await h.emitEvent("tool_call", bashCall("p1", "git push"));
  assert.equal((await h.emitEvent("tool_result", bashResult("p1")))[0], undefined);
});

test("a failing recognised run does not clear", async () => {
  const h = harness();
  await editSource(h);
  await h.emitEvent("tool_call", bashCall("t1", "npm test"));
  await h.emitEvent("tool_result", bashResult("t1", true));
  await h.emitEvent("tool_call", bashCall("p1", "git push"));
  const warning = warningOf(await h.emitEvent("tool_result", bashResult("p1")));
  assert.match(warning ?? "", /ran without verification/);
});

test("verification belongs to its checkout and interleaved calls retain ownership", async () => {
  const h = harness();
  await h.emitEvent("tool_call", bashCall("a", "(cd /tmp/home-leg && npm test)"));
  await h.emitEvent("tool_call", bashCall("b", "(cd /tmp/other-leg && npm test)"));
  await h.emitEvent("tool_result", bashResult("a"));
  await h.emitEvent("tool_result", bashResult("b", true));
  await h.emitEvent("tool_call", bashCall("p", "git -C /tmp/other-leg push"));
  assert.match(warningOf(await h.emitEvent("tool_result", bashResult("p"))) ?? "", /ran without verification/);
  await h.emitEvent("tool_call", bashCall("q", "git -C /tmp/home-leg push"));
  assert.equal(warningOf(await h.emitEvent("tool_result", bashResult("q"))), undefined);
});


test("checkout policies and source invalidation stay local; chained shipping requires prior evidence", async () => {
  const h = harness();
  const other = mkdtempSync(join(tmpdir(), "verify-other-")); tempDirs.push(other);
  mkdirSync(join(other, ".pi"));
  writeFileSync(join(other, ".pi/settings.json"), JSON.stringify({ piGauntlet: { verifyBeforeShip: { testCommands: ["custom-check"] } } }));
  for (const [id, command] of [["home", "npm test"], ["other", `(cd ${other} && custom-check)`]]) {
    await h.emitEvent("tool_call", bashCall(id, command));
    await h.emitEvent("tool_result", bashResult(id));
  }
  await h.emitEvent("tool_call", writeCall("edit", join(other, "source.ts")));
  await h.emitEvent("tool_call", bashCall("p", `git -C ${other} push`));
  assert.match(warningOf(await h.emitEvent("tool_result", bashResult("p"))) ?? "", /custom-check/);
  await h.emitEvent("tool_call", bashCall("h", "git push"));
  assert.equal(warningOf(await h.emitEvent("tool_result", bashResult("h"))), undefined);
  await h.emitEvent("tool_call", bashCall("chain", `(cd ${other} && custom-check && git push)`));
  assert.match(warningOf(await h.emitEvent("tool_result", bashResult("chain"))) ?? "", /ran without verification/);
});

test("unresolved shipping targets never borrow home verification", async () => {
  const h = harness();
  await h.emitEvent("tool_call", bashCall("test", "npm test"));
  await h.emitEvent("tool_result", bashResult("test"));
  for (const command of ['git -C "$X" push', 'cd $X && git push']) {
    await h.emitEvent("tool_call", bashCall("ship", command));
    assert.match(warningOf(await h.emitEvent("tool_result", bashResult("ship"))) ?? "", /ran without verification/, command);
  }
});

test("quoted test mentions do not supply evidence", async () => {
  for (const command of ['git commit -m "npm test"', "printf 'npm test'", 'rg "npm test" .']) {
    const h = harness();
    await h.emitEvent("tool_call", bashCall("mention", command));
    await h.emitEvent("tool_result", bashResult("mention"));
    await h.emitEvent("tool_call", bashCall("ship", "git push"));
    assert.match(warningOf(await h.emitEvent("tool_result", bashResult("ship"))) ?? "", /ran without verification/, command);
  }
});

test("skipped or masked companion tests never supply verification", async () => {
  // `unreached` rows never run the test in real bash; the others stay uncredited even with a successful tool result.
  const rows: { wrap: (target: string) => string; unreached: boolean }[] = [
    { wrap: (target) => `false && (cd ${target} && npm test); true`, unreached: true },
    { wrap: (target) => `f() (cd ${target} && npm test)`, unreached: true },
    { wrap: (target) => `f() { cd ${target} && npm test; }`, unreached: true },
    { wrap: (target) => `function f { cd ${target} && npm test; }`, unreached: true },
    { wrap: (target) => `if false; then (cd ${target} && npm test); fi`, unreached: true },
    { wrap: (target) => `(cd ${target} && npm test) || true`, unreached: false },
    { wrap: (target) => `false || (cd ${target} && npm test)`, unreached: false },
    { wrap: (target) => `(cd ${target} && npm test | tail -50)`, unreached: false },
    { wrap: (target) => `set +o pipefail; (cd ${target} && npm test | tail -50)`, unreached: false },
    { wrap: (target) => `set -o pipefail | cat; (cd ${target} && npm test | tail -50)`, unreached: false },
    { wrap: (target) => `set -o pipefail; (cd ${target} && npm test | tail -50)`, unreached: false },
    { wrap: (target) => `(set -o pipefail; cd ${target} && npm test | tail -50)`, unreached: false },
    { wrap: (target) => `set -o pipefail; (set +o pipefail); (cd ${target} && npm test | tail -50)`, unreached: false },
    { wrap: (target) => `set -eo pipefail\n(cd ${target} && npm test | tail -50)`, unreached: false },
    { wrap: (target) => `(cd ${target} && npm test; true)`, unreached: false },
  ];
  for (const { wrap, unreached } of rows) {
    const h = harness();
    const companion = mkdtempSync(join(tmpdir(), "verify-skipped-"));
    tempDirs.push(companion);
    const command = wrap(companion);
    if (unreached) assert.equal(execFileSync("bash", ["-c", command], { encoding: "utf8" }), "", command);
    await h.emitEvent("tool_call", bashCall("masked", command));
    await h.emitEvent("tool_result", bashResult("masked"));
    await h.emitEvent("tool_call", bashCall("ship", `git -C ${companion} push`));
    assert.match(warningOf(await h.emitEvent("tool_result", bashResult("ship"))) ?? "", /ran without verification/, command);
  }
});

test("unconditional companion test statements supply verification", async () => {
  for (const prefix of ["true; ", "true\n", "true && "]) {
    const h = harness();
    const companion = mkdtempSync(join(tmpdir(), "verify-unconditional-"));
    tempDirs.push(companion);
    await h.emitEvent("tool_call", bashCall("test", `${prefix}(cd ${companion} && npm test)`));
    await h.emitEvent("tool_result", bashResult("test"));
    await h.emitEvent("tool_call", bashCall("ship", `git -C ${companion} push`));
    assert.equal(warningOf(await h.emitEvent("tool_result", bashResult("ship"))), undefined, prefix);
  }
});

test("masked pipeline exits 0 in bash while npm test fails, and still warns", async () => {
  const h = harness();
  const companion = mkdtempSync(join(tmpdir(), "verify-pipeline-"));
  tempDirs.push(companion);
  const command = `set +o pipefail; (cd ${companion} && npm test | tail -50)`;
  assert.equal(execFileSync("bash", ["-c", `${command}; echo status=$?`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(), "status=0");
  assert.throws(() => execFileSync("bash", ["-c", `cd ${companion} && npm test`], { stdio: "ignore" }));
  await h.emitEvent("tool_call", bashCall("masked", command));
  await h.emitEvent("tool_result", bashResult("masked"));
  await h.emitEvent("tool_call", bashCall("ship", `git -C ${companion} push`));
  assert.match(warningOf(await h.emitEvent("tool_result", bashResult("ship"))) ?? "", /ran without verification/);
});

test("redirections, pipelines, and env-assignment prefixes keep baseline credit", async () => {
  const rows: { command: (leg: string) => string; leg: boolean }[] = [
    { command: () => "npm test 2>&1", leg: false },
    { command: () => "npm test > log", leg: false },
    { command: () => "cat /dev/null | npm test", leg: false },
    { command: (leg) => `(cd ${leg} && tail -50 | npm test)`, leg: true },
    { command: () => "CI=1 npm test", leg: false },
    { command: (leg) => `(cd ${leg} && CI=1 npm test 2>&1)`, leg: true },
  ];
  for (const row of rows) {
    const h = harness();
    const leg = mkdtempSync(join(tmpdir(), "verify-redirect-"));
    tempDirs.push(leg);
    const command = row.command(leg);
    await h.emitEvent("tool_call", bashCall("test", command));
    await h.emitEvent("tool_result", bashResult("test"));
    await h.emitEvent("tool_call", bashCall("ship", row.leg ? `git -C ${leg} push` : "git push"));
    assert.equal(warningOf(await h.emitEvent("tool_result", bashResult("ship"))), undefined, command);
  }
});

test("settings errors appear once per chained call", async () => {
  const h = harness();
  mkdirSync(join(h.dir, ".pi"));
  writeFileSync(join(h.dir, ".pi/settings.json"), "{");
  await h.emitEvent("tool_call", bashCall("chain", "npm test && git push"));
  const warning = warningOf(await h.emitEvent("tool_result", bashResult("chain"))) ?? "";
  assert.equal(warning.split("gauntlet settings load error").length - 1, 1, warning);
});

test("coordinated linked worktree verification uses its primary's custom policy", async () => {
  const h = harness();
  const git = (...args: string[]) => execFileSync("git", ["-C", h.dir, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  git("init", "-b", "main");
  git("-c", "user.name=Test", "-c", "user.email=test@example.invalid", "commit", "--allow-empty", "-m", "base");
  const worktree = join(h.dir, "linked-feature");
  git("worktree", "add", "-b", "feature", worktree);
  mkdirSync(join(h.dir, ".pi"));
  writeFileSync(join(h.dir, ".pi/settings.json"), JSON.stringify({ piGauntlet: { verifyBeforeShip: { testCommands: ["custom-check"] } } }));
  git("remote", "add", "origin", "https://example.invalid/team/companion.git");
  const spec = join(h.dir, "spec.md");
  writeFileSync(spec, "## Legs\n### Leg: team/home\n### Leg: team/companion\nbranch: feature\nhome: linked-<name>\n");
  await h.emitEvent("tool_result", { toolName: "plan_check", isError: false, details: { status: "pass", specPath: spec } });
  for (const [id, command, warns] of [["default", "npm test", true], ["custom", "custom-check", false]] as const) {
    await h.emitEvent("tool_call", bashCall(id, `(cd ${worktree} && ${command})`));
    await h.emitEvent("tool_result", bashResult(id));
    await h.emitEvent("tool_call", bashCall("ship", `git -C ${worktree} push`));
    const warning = warningOf(await h.emitEvent("tool_result", bashResult("ship")));
    if (warns) assert.match(warning ?? "", /custom-check/);
    else assert.equal(warning, undefined);
  }
});

test("real linked worktree evidence stays separate from primary post-squash verification", async () => {
  const h = harness();
  const git = (cwd: string, ...args: string[]) => execFileSync("git", ["-C", cwd, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  git(h.dir, "init", "-b", "main");
  git(h.dir, "config", "user.name", "Test");
  git(h.dir, "config", "user.email", "test@example.invalid");
  writeFileSync(join(h.dir, "source.ts"), "export const value = 1;\n");
  git(h.dir, "add", ".");
  git(h.dir, "commit", "-m", "base");
  const worktree = join(h.dir, "linked");
  git(h.dir, "worktree", "add", "-b", "feature", worktree);
  writeFileSync(join(worktree, "source.ts"), "export const value = 2;\n");
  git(worktree, "commit", "-am", "change");
  await h.emitEvent("tool_call", bashCall("feature-test", `(cd ${worktree} && npm test)`));
  await h.emitEvent("tool_result", bashResult("feature-test"));
  git(h.dir, "merge", "--squash", "feature");
  git(h.dir, "commit", "-m", "squash");
  await h.emitEvent("tool_call", bashCall("primary-ship", "git push"));
  assert.match(warningOf(await h.emitEvent("tool_result", bashResult("primary-ship"))) ?? "", /ran without verification/);
  await h.emitEvent("tool_call", bashCall("post-squash", "npm test"));
  await h.emitEvent("tool_result", bashResult("post-squash", true));
  await h.emitEvent("tool_call", bashCall("failed-ship", "git push"));
  assert.match(warningOf(await h.emitEvent("tool_result", bashResult("failed-ship"))) ?? "", /ran without verification/);
  await h.emitEvent("tool_call", bashCall("retry", "npm test"));
  await h.emitEvent("tool_result", bashResult("retry"));
  await h.emitEvent("tool_call", bashCall("verified-ship", "git push"));
  assert.equal(warningOf(await h.emitEvent("tool_result", bashResult("verified-ship"))), undefined);
  await h.emitEvent("tool_call", writeCall("feature-edit", join(worktree, "source.ts")));
  await h.emitEvent("tool_call", bashCall("primary-still-verified", "git push"));
  assert.equal(warningOf(await h.emitEvent("tool_result", bashResult("primary-still-verified"))), undefined);
  await h.emitEvent("tool_call", bashCall("feature-stale", `git -C ${worktree} push`));
  assert.match(warningOf(await h.emitEvent("tool_result", bashResult("feature-stale"))) ?? "", /ran without verification/);
});

test("fresh-session ship retry restores the home primary's policy from resume arming", async () => {
  const h = harness();
  const git = (...args: string[]) => execFileSync("git", ["-C", h.dir, ...args], { stdio: "ignore" });
  git("init", "-b", "main");
  git("-c", "user.name=Test", "-c", "user.email=test@example.invalid", "commit", "--allow-empty", "-m", "base");
  const worktree = join(h.dir, "linked");
  git("worktree", "add", "-b", "feature", worktree);
  mkdirSync(join(h.dir, ".pi"));
  writeFileSync(join(h.dir, ".pi/settings.json"), JSON.stringify({ piGauntlet: { verifyBeforeShip: { testCommands: ["custom-check"] } } }));
  const spec = join(worktree, "spec.md");
  writeFileSync(spec, "## Legs\n### Leg: team/home\n### Leg: team/companion\nbranch: feature\nhome: linked-<name>\n");
  await h.emitEvent("tool_result", { toolName: "phase_tracker", details: { action: "start", phases: { brainstorm: { status: "in_progress" } } } });
  await h.emitEvent("tool_result", { toolName: "phase_tracker", details: { action: "skip", phases: { brainstorm: { status: "skipped", reason: `resume: ${spec}` } } } });
  for (const [id, command, warns] of [["default", "npm test", true], ["custom", "custom-check", false]] as const) {
    await h.emitEvent("tool_call", bashCall(id, `(cd ${worktree} && ${command})`));
    await h.emitEvent("tool_result", bashResult(id));
    await h.emitEvent("tool_call", bashCall("ship", `git -C ${worktree} push`));
    const warning = warningOf(await h.emitEvent("tool_result", bashResult("ship")));
    if (warns) assert.match(warning ?? "", /custom-check/);
    else assert.equal(warning, undefined);
  }
});

test("legacy linked worktree verification uses its local custom policy", async () => {
  const h = harness();
  const git = (...args: string[]) => execFileSync("git", ["-C", h.dir, ...args], { stdio: "ignore" });
  git("init", "-b", "main");
  git("-c", "user.name=Test", "-c", "user.email=test@example.invalid", "commit", "--allow-empty", "-m", "base");
  const worktree = join(h.dir, "linked");
  git("worktree", "add", "-b", "feature", worktree);
  mkdirSync(join(worktree, ".pi"));
  writeFileSync(join(worktree, ".pi/settings.json"), JSON.stringify({ piGauntlet: { verifyBeforeShip: { testCommands: ["custom-check"] } } }));
  for (const [id, command, warns] of [["default", "npm test", true], ["custom", "custom-check", false]] as const) {
    await h.emitEvent("tool_call", bashCall(id, `(cd ${worktree} && ${command})`));
    await h.emitEvent("tool_result", bashResult(id));
    await h.emitEvent("tool_call", bashCall("ship", `git -C ${worktree} push`));
    const warning = warningOf(await h.emitEvent("tool_result", bashResult("ship")));
    if (warns) assert.match(warning ?? "", /custom-check/);
    else assert.equal(warning, undefined);
  }
});
