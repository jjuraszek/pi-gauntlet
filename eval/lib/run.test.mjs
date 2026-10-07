import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { runTarget } from "../run.mjs";
import { sha256 } from "./checks.mjs";
import { INTENT_STUB } from "./intent.mjs";

function repo() {
  const root = mkdtempSync(join(tmpdir(), "run-"));
  const put = (path, text) => { mkdirSync(join(root, path, ".."), { recursive: true }); writeFileSync(join(root, path), text); };
  put("skills/x/SKILL.md", "BASE\n");
  const g = (...args) => execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@localhost", "-c", "commit.gpgsign=false", ...args], { cwd: root, encoding: "utf8" });
  g("init", "-q", "-b", "main"); g("add", "-A"); g("commit", "--no-verify", "-q", "-m", "base");
  put("eval/t/target.json", JSON.stringify({ kind: "text", skillFiles: [{ path: "skills/x/SKILL.md" }], assembly: "concat", wordCap: 50 }));
  put("eval/t/replay.md", "Reply.\n"); put("eval/t/README.md", "# t\n");
  put("eval/t/samples/s1/case.md", "CASE\n");
  put("eval/t/samples/s1/expected.md", '- f1: judged: says hi\n- f2: mechanical: contains "hi"\n');
  put("eval/judge.md", "JUDGE\n"); put("eval/t/intent.md", INTENT_STUB);
  return { root, put };
}
function candidate() {
  const fixture = repo();
  fixture.put("skills/x/SKILL.md", "NEW\n");
  fixture.put("eval/t/intent.md", `for: ${sha256("NEW\n")}\n\n## Change\nx\n\n## Expected to move\n`);
  return fixture;
}
const judgeReply = (before, after) => "```json\n" + JSON.stringify({ facts: { f1: { before, after } }, feedback: "fb" }) + "\n```";
const record = (root, arm) => JSON.parse(readFileSync(join(root, `eval/t/results/s1/${arm}.json`), "utf8"));
const run = (root, spawn, extra = {}) => runTarget({ root, target: "t", base: "HEAD", spawn, ...extra });

test("baseline-only seeds records without an intent and refuses the candidate arm on a stub", () => {
  const { root } = repo(); const calls = [];
  const spawn = (args) => { calls.push(args); return { status: "ok", stdout: "hi there", wallMs: 1 }; };
  assert.equal(run(root, spawn, { baselineOnly: true }).exit, 0);
  assert.equal(calls.length, 2);
  assert.equal(record(root, "baseline").skillSha, sha256("BASE\n"));
  assert.equal(record(root, "baseline").outputs["anthropic/claude-opus-5-5"].mechanical.f2, "holds");
  const path = join(root, "eval/t/results/s1/baseline.json");
  const before = [readFileSync(path, "utf8"), statSync(path).mtimeMs];
  assert.match(run(root, spawn, { baselineOnly: true }).message, /baseline fresh/);
  assert.deepEqual([readFileSync(path, "utf8"), statSync(path).mtimeMs], before);
  assert.equal(calls.length, 2);
  const refused = run(root, spawn); assert.equal(refused.exit, 2); assert.match(refused.message, /intent.md is the template stub/);
});

for (const words of [50, 51]) test(`text replay enforces wordCap at ${words} words`, () => {
  const { root } = candidate();
  const output = Array(words).fill("hi").join(" ");
  let judges = 0;
  const spawn = (args) => {
    if (args.includes("anthropic-fable/claude-fable-5-1")) {
      judges++;
      return { status: "ok", stdout: judgeReply("holds", "holds"), wallMs: 1 };
    }
    return { status: "ok", stdout: output, wallMs: 1 };
  };
  assert.equal(run(root, spawn).exit, words === 50 ? 0 : 1);
  for (const arm of ["baseline", "candidate"]) {
    for (const cell of Object.values(record(root, arm).outputs)) {
      assert.equal(cell.words, words);
      assert.equal(cell.status, words === 50 ? "ok" : "error");
      assert.equal(cell.error, words === 50 ? undefined : "51 words over the 50 cap");
    }
  }
  assert.equal(judges, words === 50 ? 2 : 0);
});

test("replay scrubs its scratch cwd before storing output", () => {
  const { root } = repo();
  const spawn = (_args, { cwd }) => ({ status: "ok", stdout: `${cwd}/x`, wallMs: 1 });
  assert.equal(run(root, spawn, { baselineOnly: true }).exit, 0);
  for (const cell of Object.values(record(root, "baseline").outputs)) assert.equal(cell.text, "<scratch>/x");
});

test("candidate run judges pairs, derives labels, writes report, exits on regression", () => {
  const { root } = candidate();
  const spawn = (args) => ({ status: "ok", stdout: args.includes("anthropic-fable/claude-fable-5-1") ? judgeReply("holds", "fails") : "hi", wallMs: 1 });
  assert.equal(run(root, spawn).exit, 1);
  const report = readFileSync(join(root, "eval/t/report.md"), "utf8");
  assert.ok(report.includes("| s1 | anthropic/claude-opus-5-5 | regressed |")); assert.ok(report.trimEnd().endsWith("exit: 1"));
  const cell = record(root, "candidate").judge["anthropic/claude-opus-5-5"];
  assert.equal(cell.facts.f1.label, "regression"); assert.ok("confirmation" in cell);
});

for (const sameFact of [true, false]) test(`confirmation regression on ${sameFact ? "the same" : "a different"} fact`, () => {
  const { root, put } = candidate(); let judges = 0;
  put("eval/t/samples/s1/expected.md", "- f1: judged: says hi\n- f2: judged: stays brief\n");
  const spawn = (args) => {
    if (!args.includes("anthropic-fable/claude-fable-5-1")) return { status: "ok", stdout: "hi", wallMs: 1 };
    const first = judges++ % 2 === 0;
    const offending = first || sameFact ? "f1" : "f2";
    return { status: "ok", stdout: "```json\n" + JSON.stringify({ facts: {
      f1: { before: "holds", after: offending === "f1" ? "fails" : "holds" },
      f2: { before: "holds", after: offending === "f2" ? "fails" : "holds" },
    }, feedback: first ? "first observation" : "second observation" }) + "\n```", wallMs: 1 };
  };
  assert.equal(run(root, spawn).exit, 1);
  for (const entry of Object.values(record(root, "candidate").judge)) {
    assert.equal(entry.verdict, sameFact ? "regressed" : "inconclusive");
    assert.equal(entry.facts.f1.label, "regression");
    assert.equal(entry.feedback, "first observation");
    assert.equal(entry.confirmation.facts[sameFact ? "f1" : "f2"].label, "regression");
    assert.equal(entry.confirmation.feedback, "second observation");
    assert.equal(entry.confirmation.text, "hi");
  }
});

test("regression that does not reproduce is inconclusive", () => {
  const { root } = candidate(); let judges = 0;
  const spawn = (args) => ({ status: "ok", stdout: args.includes("anthropic-fable/claude-fable-5-1") ? judgeReply("holds", judges++ % 2 === 0 ? "fails" : "holds") : "hi", wallMs: 1 });
  assert.equal(run(root, spawn).exit, 1);
  assert.equal(record(root, "candidate").judge["anthropic/claude-opus-5-5"].verdict, "inconclusive");
});

test("replay error marks the cell and continues; hygiene hit redacts", () => {
  const { root } = candidate(); const userPath = ["/Us", "ers/alice"].join("");
  const spawn = (args) => args.includes("github-copilot/gpt-6.1-sol") ? { status: "error", stderr: "boom", wallMs: 1 } : { status: "ok", stdout: args.includes("anthropic-fable/claude-fable-5-1") ? judgeReply("holds", "holds") : `hi ${userPath}`, wallMs: 1 };
  assert.equal(run(root, spawn).exit, 1);
  const outputs = record(root, "candidate").outputs;
  assert.equal(outputs["github-copilot/gpt-6.1-sol"].status, "error"); assert.equal(outputs["github-copilot/gpt-6.1-sol"].error, "boom");
  assert.ok(outputs["anthropic/claude-opus-5-5"].text.includes("[redacted:user-path]")); assert.equal(outputs["anthropic/claude-opus-5-5"].status, "error");
});

test("changed facts rejudge without replay; partial run is titled", () => {
  const { root, put } = candidate(); let replays = 0;
  const spawn = (args) => args.includes("anthropic-fable/claude-fable-5-1") ? { status: "ok", stdout: judgeReply("holds", "holds"), wallMs: 1 } : (replays++, { status: "ok", stdout: "hi", wallMs: 1 });
  assert.equal(run(root, spawn).exit, 0); assert.equal(replays, 4);
  put("eval/t/samples/s2/case.md", "OTHER");
  put("eval/t/samples/s2/expected.md", "- f1: judged: other\n");
  put("eval/t/samples/s1/expected.md", '- f1: judged: says hello\n- f2: mechanical: contains "hi"\n');
  assert.equal(run(root, spawn, { sample: "s1" }).exit, 0); assert.equal(replays, 4);
  const report = readFileSync(join(root, "eval/t/report.md"), "utf8");
  assert.ok(!report.includes("| s2 |"));
  assert.ok(report.startsWith("# eval report: t (partial run: s1)")); assert.ok(report.includes("## Change\n\nx\n"));
});

test("rejudge refreshes mechanical facts and stamps every changed record with HEAD", () => {
  const { root, put } = candidate(); let replays = 0;
  const spawn = (args) => {
    if (!args.includes("anthropic-fable/claude-fable-5-1")) replays++;
    return okSpawn(args);
  };
  assert.equal(run(root, spawn).exit, 0);
  const paths = ["baseline", "candidate"].map((arm) => join(root, `eval/t/results/s1/${arm}.json`));
  const before = paths.map((path) => [readFileSync(path, "utf8"), statSync(path).mtimeMs]);
  execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@localhost", "-c", "commit.gpgsign=false", "commit", "--no-verify", "--allow-empty", "-m", "advance HEAD"], { cwd: root });
  const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  assert.equal(run(root, spawn).exit, 0);
  assert.deepEqual(paths.map((path) => [readFileSync(path, "utf8"), statSync(path).mtimeMs]), before);
  put("eval/t/samples/s1/expected.md", '- f1: judged: says hi\n- f3: mechanical: contains "hi"\n- f4: mechanical: contains "bye"\n');
  assert.equal(run(root, spawn).exit, 0);
  assert.equal(replays, 4);
  for (const arm of ["baseline", "candidate"]) {
    const saved = record(root, arm);
    assert.equal(saved.repoSha, head);
    for (const cell of Object.values(saved.outputs)) assert.deepEqual(cell.mechanical, { f3: "holds", f4: "fails" });
  }
  for (const entry of Object.values(record(root, "candidate").judge)) {
    assert.deepEqual(Object.keys(entry.facts).sort(), ["f1", "f3", "f4"]);
    assert.deepEqual(entry.facts.f3, { before: "holds", after: "holds", label: "held" });
    assert.deepEqual(entry.facts.f4, { before: "fails", after: "fails", label: "pre-existing" });
  }
  const report = readFileSync(join(root, "eval/t/report.md"), "utf8");
  assert.ok(report.includes("f3")); assert.ok(report.includes("f4")); assert.ok(!report.includes("f2"));
});

function editRepo() {
  const fixture = repo();
  fixture.put("skills/x/SKILL.md", "---\nname: actual-name\n---\n# Selected\nselected\n# Outside\nunsliced\n");
  execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@localhost", "-c", "commit.gpgsign=false", "commit", "--no-verify", "-am", "edit skill"], { cwd: fixture.root });
  fixture.put("skills/x/reference/x.md", "reference\n");
  execFileSync("git", ["add", "skills/x/reference/x.md"], { cwd: fixture.root });
  execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@localhost", "-c", "commit.gpgsign=false", "commit", "--no-verify", "-m", "reference"], { cwd: fixture.root });
  fixture.put("eval/t/target.json", JSON.stringify({ kind: "edit", skillFiles: [{ path: "skills/x/SKILL.md" }, { path: "skills/x/reference/x.md" }], assembly: "concat" }));
  fixture.put("eval/t/samples/s1/fixture/SKILL.md", "original\n");
  fixture.put("eval/t/samples/s1/fixture/sub/file.md", "nested\n");
  return fixture;
}

test("edit replay materializes unsliced skill, invokes its name, captures diff and cleans scratch", () => {
  const { root } = editRepo(); const calls = [];
  const spawn = (args, options) => {
    const skillDir = args[args.indexOf("--skill") + 1];
    calls.push({ skillDir, ...options });
    assert.match(readFileSync(join(skillDir, "SKILL.md"), "utf8"), /name: actual-name[\s\S]*unsliced/);
    assert.equal(readFileSync(join(skillDir, "reference/x.md"), "utf8"), "reference\n");
    assert.match(options.input, /^\/skill:actual-name CASE/);
    assert.ok(options.input.includes("Files in this checkout: SKILL.md, sub/file.md"));
    assert.ok(!options.input.includes("Reply."));
    writeFileSync(join(options.cwd, "SKILL.md"), "changed\n");
    return { status: "ok", stdout: "done", wallMs: 1 };
  };
  assert.equal(run(root, spawn, { baselineOnly: true }).exit, 0);
  const baseline = record(root, "baseline");
  assert.equal(baseline.skillSha, sha256(readFileSync(join(root, "skills/x/SKILL.md"), "utf8") + "\nreference\n"));
  for (const cell of Object.values(baseline.outputs)) {
    assert.match(cell.text, /diff --git/);
    assert.equal(cell.tree["SKILL.md"].content, "changed\n");
  }
  for (const call of calls) { assert.equal(existsSync(call.skillDir), false); assert.equal(existsSync(call.cwd), false); }
});

test("edit replay ignores wordCap even when its diff exceeds the cap", () => {
  const { root, put } = editRepo();
  const target = JSON.parse(readFileSync(join(root, "eval/t/target.json"), "utf8"));
  put("eval/t/target.json", JSON.stringify({ ...target, wordCap: 1 }));
  const spawn = (_args, { cwd }) => {
    writeFileSync(join(cwd, "SKILL.md"), "changed with several words\n");
    return { status: "ok", stdout: "done with several words", wallMs: 1 };
  };
  assert.equal(run(root, spawn, { baselineOnly: true }).exit, 0);
  for (const cell of Object.values(record(root, "baseline").outputs)) {
    assert.ok(cell.words > 1);
    assert.equal(cell.status, "ok");
    assert.equal(cell.error, undefined);
    assert.equal(cell.tree["SKILL.md"].content, "changed with several words\n");
  }
});

test("edit scratch directories are removed even when spawn throws", () => {
  const { root } = editRepo(); let dirs;
  assert.throws(() => run(root, (args, { cwd }) => {
    dirs = [cwd, args[args.indexOf("--skill") + 1]];
    throw new Error("spawn broke");
  }, { baselineOnly: true }), /spawn broke/);
  for (const dir of dirs) assert.equal(existsSync(dir), false);
});

const okSpawn = (args) => ({ status: "ok", stdout: args.includes("anthropic-fable/claude-fable-5-1") ? judgeReply("holds", "holds") : "hi", wallMs: 1 });
test("bundle-free intent permits mixed bundle samples", () => {
  const { root, put } = candidate();
  put("skills/x/extra.md", "EXTRA\n");
  execFileSync("git", ["add", "skills/x/extra.md"], { cwd: root });
  execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@localhost", "-c", "commit.gpgsign=false", "commit", "--no-verify", "-m", "extra"], { cwd: root });
  put("eval/t/samples/s2/case.md", "bundle+: skills/x/extra.md\nCASE\n");
  put("eval/t/samples/s2/expected.md", '- f1: judged: says hi\n');
  assert.equal(run(root, okSpawn).exit, 0);
  const second = JSON.parse(readFileSync(join(root, "eval/t/results/s2/candidate.json")));
  assert.equal(second.skillSha, sha256("NEW\n\nEXTRA\n"));
  assert.match(readFileSync(join(root, "eval/t/report.md"), "utf8"), new RegExp(`for: ${sha256("NEW\n")}`));
});
test("denylist configuration does not refuse its own target", () => {
  const { root, put } = candidate();
  const target = JSON.parse(readFileSync(join(root, "eval/t/target.json")));
  put("eval/t/target.json", JSON.stringify({ ...target, denylist: ["acme-corp"] }));
  assert.equal(run(root, okSpawn).exit, 0);
});
for (const recovers of [true, false]) test(`malformed judge reply ${recovers ? "recovers on one retry" : "errors after one retry and stays retryable"}`, () => {
  const { root, put } = candidate();
  assert.equal(run(root, okSpawn).exit, 0);
  const saved = record(root, "candidate");
  const model = Object.keys(saved.judge)[0];
  delete saved.judge[model];
  put("eval/t/results/s1/candidate.json", JSON.stringify(saved, null, 2) + "\n");
  let judges = 0;
  const spawn = (args, { input }) => {
    assert.ok(args.includes("anthropic-fable/claude-fable-5-1"), "stored outputs must not replay");
    judges++;
    if (judges === 2) assert.match(input, /Your previous reply was rejected:.*found 0/);
    return { status: "ok", stdout: recovers && judges === 2 ? judgeReply("holds", "holds") : "no JSON block", wallMs: 1 };
  };
  assert.equal(run(root, spawn).exit, recovers ? 0 : 1);
  assert.equal(judges, 2);
  const entry = record(root, "candidate").judge[model];
  if (recovers) {
    assert.equal(entry.verdict, "unchanged");
    assert.deepEqual(entry.facts.f1, { before: "holds", after: "holds", label: "held" });
    assert.equal(entry.feedback, "fb");
    assert.equal(entry.factsSha, sha256(readFileSync(join(root, "eval/t/samples/s1/expected.md"), "utf8")));
  } else {
    assert.deepEqual(entry, { verdict: "error", error: "judge reply must contain exactly one fenced JSON block (found 0)" });
    let retryCalls = 0;
    assert.equal(run(root, (args) => {
      assert.ok(args.includes("anthropic-fable/claude-fable-5-1"), "next run must only rejudge the failed pair");
      retryCalls++;
      return okSpawn(args);
    }).exit, 0);
    assert.equal(retryCalls, 1);
    assert.equal(record(root, "candidate").judge[model].verdict, "unchanged");
  }
});

test("judge failures are retried on the next run", () => {
  const { root } = candidate();
  assert.equal(run(root, (args) => args.includes("anthropic-fable/claude-fable-5-1") ? { status: "error", stderr: "unavailable" } : okSpawn(args)).exit, 1);
  assert.equal(record(root, "candidate").judge["anthropic/claude-opus-5-5"].factsSha, undefined);
  let calls = 0;
  assert.equal(run(root, (args) => { if (args.includes("anthropic-fable/claude-fable-5-1")) calls++; else assert.fail("unexpected replay"); return okSpawn(args); }).exit, 0);
  assert.equal(calls, 2);
});
for (const baselineOnly of [true, false]) test(`candidate promotion without replay: baselineOnly=${baselineOnly}`, () => {
  const { root, put } = repo();
  put("eval/t/intent.md", `for: ${sha256("BASE\n")}\n\n## Change\nx\n\n## Expected to move\n`);
  assert.equal(run(root, okSpawn).exit, 0);
  const candidateRecord = record(root, "candidate");
  assert.equal(run(root, () => assert.fail("unexpected call"), { baselineOnly }).exit, 0);
  const baseline = record(root, "baseline");
  assert.equal(baseline.arm, "baseline");
  assert.equal(baseline.judge, undefined);
  assert.deepEqual(baseline.outputs, candidateRecord.outputs);
});

for (const failure of ["replay", "judge"]) test(`confirmation ${failure} failure stays retryable`, () => {
  const { root } = candidate(); let replays = 0, judges = 0;
  const result = run(root, (args) => {
    if (args.includes("anthropic-fable/claude-fable-5-1")) {
      judges++;
      if (failure === "judge" && judges > 1) return { status: "error", stderr: "down" };
      return { status: "ok", stdout: judgeReply("holds", "fails") };
    }
    replays++;
    return failure === "replay" && replays === 4 ? { status: "error", stderr: "down" } : { status: "ok", stdout: "hi" };
  });
  assert.equal(result.exit, 1);
  const entry = record(root, "candidate").judge["anthropic/claude-opus-5-5"];
  assert.equal(entry.verdict, "error");
  assert.equal(entry.factsSha, undefined);
});
test("missing base skill refuses with its file and base selection advice", () => {
  const { root, put } = candidate();
  put("skills/new/SKILL.md", "NEW\n");
  put("eval/t/target.json", JSON.stringify({ kind: "text", skillFiles: [{ path: "skills/new/SKILL.md" }], assembly: "concat", wordCap: 50 }));
  const result = run(root, () => assert.fail("unexpected call"), { baselineOnly: true });
  assert.equal(result.exit, 2);
  assert.match(result.message, /skills\/new\/SKILL.md at [\s\S]*--base/);
});

test("missing tree skill refuses with its file and ref", () => {
  const { root, put } = candidate();
  put("eval/t/target.json", JSON.stringify({ kind: "text", skillFiles: [{ path: "skills/missing/SKILL.md" }], assembly: "concat", wordCap: 50 }));
  const result = run(root, () => assert.fail("unexpected call"));
  assert.equal(result.exit, 2);
  assert.match(result.message, /skills\/missing\/SKILL.md at working tree: /);
});

test("renamed slice heading refuses with its file and tree ref", () => {
  const { root, put } = candidate();
  put("eval/t/target.json", JSON.stringify({ kind: "text", skillFiles: [{ path: "skills/x/SKILL.md", slice: "## Old" }], assembly: "concat", wordCap: 50 }));
  put("skills/x/SKILL.md", "## Renamed\nNEW\n");
  const result = run(root, () => assert.fail("unexpected call"));
  assert.equal(result.exit, 2);
  assert.match(result.message, /skills\/x\/SKILL.md at working tree: heading not found: ## Old/);
});

test("CLI parse errors print usage and exit 2", () => {
  for (const args of [["--unknown"], ["t", "--base"], [], ["t", "s", "extra"]]) {
    assert.throws(() => execFileSync(process.execPath, [new URL("../run.mjs", import.meta.url).pathname, ...args], { stdio: "pipe" }), (error) => error.status === 2 && /usage:/.test(error.stderr));
  }
});
