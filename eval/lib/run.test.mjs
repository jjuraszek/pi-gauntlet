import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { runTarget } from "../run.mjs";
import { sha256 } from "./checks.mjs";
import { INTENT_STUB } from "./intent.mjs";
import { MODELS } from "./models.mjs";
import { writeRecordAtomic } from "./records.mjs";

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
const modelOf = (args) => args[args.indexOf("--model") + 1];
const isJudge = (args) => args.includes("anthropic-fable/claude-fable-5-1");
const hiFor = (args) => `hi ${modelOf(args)}`;
const modelIn = (input) => /hi (\S+)/.exec(input)[1];
const record = (root, arm) => JSON.parse(readFileSync(join(root, `eval/t/results/s1/${arm}.json`), "utf8"));
const run = (root, spawn, extra = {}) => runTarget({ root, target: "t", base: "HEAD", spawn, ...extra });

test("baseline-only seeds records without an intent and refuses the candidate arm on a stub", async () => {
  const { root } = repo(); const calls = [];
  const spawn = (args) => { calls.push(args); return { status: "ok", stdout: "hi there", wallMs: 1 }; };
  assert.match((await run(root, spawn, { baselineOnly: true })).message, /^baseline seeded \(replay 2, wall \d+s\)$/);
  assert.equal(calls.length, 2);
  assert.equal(record(root, "baseline").skillSha, sha256("BASE\n"));
  assert.equal(record(root, "baseline").outputs["anthropic/claude-opus-5-5"].mechanical.f2, "holds");
  const path = join(root, "eval/t/results/s1/baseline.json");
  const before = [readFileSync(path, "utf8"), statSync(path).mtimeMs];
  assert.match((await run(root, spawn, { baselineOnly: true })).message, /baseline fresh/);
  assert.deepEqual([readFileSync(path, "utf8"), statSync(path).mtimeMs], before);
  assert.equal(calls.length, 2);
  const refused = (await run(root, spawn)); assert.equal(refused.exit, 2); assert.match(refused.message, /intent.md is the template stub/);
});

for (const words of [50, 51]) test(`text replay enforces wordCap at ${words} words`, async () => {
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
  assert.equal((await run(root, spawn)).exit, words === 50 ? 0 : 1);
  for (const arm of ["baseline", "candidate"]) {
    for (const cell of Object.values(record(root, arm).outputs)) {
      assert.equal(cell.words, words);
      assert.equal(cell.status, words === 50 ? "ok" : "error");
      assert.equal(cell.error, words === 50 ? undefined : "51 words over the 50 cap");
    }
  }
  assert.equal(judges, words === 50 ? 2 : 0);
});

test("replay scrubs its scratch cwd before storing output", async () => {
  const { root } = repo();
  const spawn = (_args, { cwd }) => ({ status: "ok", stdout: `${cwd}/x`, wallMs: 1 });
  assert.equal((await run(root, spawn, { baselineOnly: true })).exit, 0);
  for (const cell of Object.values(record(root, "baseline").outputs)) assert.equal(cell.text, "<scratch>/x");
});

test("candidate run judges pairs, derives labels, writes report, exits on regression", async () => {
  const { root } = candidate();
  const spawn = (args) => ({ status: "ok", stdout: args.includes("anthropic-fable/claude-fable-5-1") ? judgeReply("holds", "fails") : "hi", wallMs: 1 });
  const result = await run(root, spawn);
  assert.equal(result.exit, 1);
  assert.match(result.message, /^t: regressed \(report.md written; replay 4, judge 4, confirm 2, wall \d+s\)$/);
  const report = readFileSync(join(root, "eval/t/report.md"), "utf8");
  assert.ok(report.includes("| s1 | anthropic/claude-opus-5-5 | regressed |")); assert.ok(report.trimEnd().endsWith("exit: 1"));
  const cell = record(root, "candidate").judge["anthropic/claude-opus-5-5"];
  assert.equal(cell.facts.f1.label, "regression"); assert.ok("confirmation" in cell);
  assert.equal(cell.wallMs, 1);
  assert.equal(cell.confirmation.judgeWallMs, 1);
  assert.match(report, /wall: /);
  assert.match(report, /judge ms/);
});

for (const sameFact of [true, false]) test(`confirmation regression on ${sameFact ? "the same" : "a different"} fact`, async () => {
  const { root, put } = candidate(); const seen = {};
  put("eval/t/samples/s1/expected.md", "- f1: judged: says hi\n- f2: judged: stays brief\n");
  const spawn = (args, { input }) => {
    if (!isJudge(args)) return { status: "ok", stdout: hiFor(args), wallMs: 1 };
    const model = modelIn(input);
    const first = (seen[model] = (seen[model] ?? 0) + 1) === 1;
    const offending = first || sameFact ? "f1" : "f2";
    return { status: "ok", stdout: "```json\n" + JSON.stringify({ facts: {
      f1: { before: "holds", after: offending === "f1" ? "fails" : "holds" },
      f2: { before: "holds", after: offending === "f2" ? "fails" : "holds" },
    }, feedback: first ? "first observation" : "second observation" }) + "\n```", wallMs: 1 };
  };
  assert.equal((await run(root, spawn)).exit, 1);
  for (const [model, entry] of Object.entries(record(root, "candidate").judge)) {
    assert.equal(entry.verdict, sameFact ? "regressed" : "inconclusive");
    assert.equal(entry.facts.f1.label, "regression");
    assert.equal(entry.feedback, "first observation");
    assert.equal(entry.confirmation.facts[sameFact ? "f1" : "f2"].label, "regression");
    assert.equal(entry.confirmation.feedback, "second observation");
    assert.equal(entry.confirmation.text, `hi ${model}`);
  }
});

test("regression that does not reproduce is inconclusive", async () => {
  const { root } = candidate(); const seen = {};
  const spawn = (args, { input }) => {
    if (!isJudge(args)) return { status: "ok", stdout: hiFor(args), wallMs: 1 };
    const model = modelIn(input);
    return { status: "ok", stdout: judgeReply("holds", (seen[model] = (seen[model] ?? 0) + 1) === 1 ? "fails" : "holds"), wallMs: 1 };
  };
  assert.equal((await run(root, spawn)).exit, 1);
  assert.equal(record(root, "candidate").judge["anthropic/claude-opus-5-5"].verdict, "inconclusive");
});

test("replay error marks the cell and continues; hygiene hit redacts", async () => {
  const { root } = candidate(); const userPath = ["/Us", "ers/alice"].join("");
  const spawn = (args) => args.includes("github-copilot/gpt-6.1-sol") ? { status: "error", stderr: "boom", wallMs: 1 } : { status: "ok", stdout: args.includes("anthropic-fable/claude-fable-5-1") ? judgeReply("holds", "holds") : `hi ${userPath}`, wallMs: 1 };
  assert.equal((await run(root, spawn)).exit, 1);
  const outputs = record(root, "candidate").outputs;
  assert.equal(outputs["github-copilot/gpt-6.1-sol"].status, "error"); assert.equal(outputs["github-copilot/gpt-6.1-sol"].error, "boom");
  assert.ok(outputs["anthropic/claude-opus-5-5"].text.includes("[redacted:user-path]")); assert.equal(outputs["anthropic/claude-opus-5-5"].status, "error");
});

test("changed facts rejudge without replay; partial run is titled", async () => {
  const { root, put } = candidate(); let replays = 0;
  const spawn = (args) => args.includes("anthropic-fable/claude-fable-5-1") ? { status: "ok", stdout: judgeReply("holds", "holds"), wallMs: 1 } : (replays++, { status: "ok", stdout: "hi", wallMs: 1 });
  assert.equal((await run(root, spawn)).exit, 0); assert.equal(replays, 4);
  put("eval/t/samples/s2/case.md", "OTHER");
  put("eval/t/samples/s2/expected.md", "- f1: judged: other\n");
  put("eval/t/samples/s1/expected.md", '- f1: judged: says hello\n- f2: mechanical: contains "hi"\n');
  assert.equal((await run(root, spawn, { sample: "s1" })).exit, 0); assert.equal(replays, 4);
  const report = readFileSync(join(root, "eval/t/report.md"), "utf8");
  assert.ok(!report.includes("| s2 |"));
  assert.ok(report.startsWith("# eval report: t (partial run: s1)")); assert.ok(report.includes("## Change\n\nx\n"));
});

test("rejudge refreshes mechanical facts and stamps every changed record with HEAD", async () => {
  const { root, put } = candidate(); let replays = 0;
  const spawn = (args) => {
    if (!args.includes("anthropic-fable/claude-fable-5-1")) replays++;
    return okSpawn(args);
  };
  assert.equal((await run(root, spawn)).exit, 0);
  const paths = ["baseline", "candidate"].map((arm) => join(root, `eval/t/results/s1/${arm}.json`));
  const before = paths.map((path) => [readFileSync(path, "utf8"), statSync(path).mtimeMs]);
  execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@localhost", "-c", "commit.gpgsign=false", "commit", "--no-verify", "--allow-empty", "-m", "advance HEAD"], { cwd: root });
  const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  assert.equal((await run(root, spawn)).exit, 0);
  assert.deepEqual(paths.map((path) => [readFileSync(path, "utf8"), statSync(path).mtimeMs]), before);
  put("eval/t/samples/s1/expected.md", '- f1: judged: says hi\n- f3: mechanical: contains "hi"\n- f4: mechanical: contains "bye"\n');
  assert.equal((await run(root, spawn)).exit, 0);
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

test("edit replay materializes unsliced skill, invokes its name, captures diff and cleans scratch", async () => {
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
  assert.equal((await run(root, spawn, { baselineOnly: true })).exit, 0);
  const baseline = record(root, "baseline");
  assert.equal(baseline.skillSha, sha256(readFileSync(join(root, "skills/x/SKILL.md"), "utf8") + "\nreference\n"));
  for (const cell of Object.values(baseline.outputs)) {
    assert.match(cell.text, /diff --git/);
    assert.equal(cell.tree["SKILL.md"].content, "changed\n");
  }
  for (const call of calls) { assert.equal(existsSync(call.skillDir), false); assert.equal(existsSync(call.cwd), false); }
});

test("edit replay ignores wordCap even when its diff exceeds the cap", async () => {
  const { root, put } = editRepo();
  const target = JSON.parse(readFileSync(join(root, "eval/t/target.json"), "utf8"));
  put("eval/t/target.json", JSON.stringify({ ...target, wordCap: 1 }));
  const spawn = (_args, { cwd }) => {
    writeFileSync(join(cwd, "SKILL.md"), "changed with several words\n");
    return { status: "ok", stdout: "done with several words", wallMs: 1 };
  };
  assert.equal((await run(root, spawn, { baselineOnly: true })).exit, 0);
  for (const cell of Object.values(record(root, "baseline").outputs)) {
    assert.ok(cell.words > 1);
    assert.equal(cell.status, "ok");
    assert.equal(cell.error, undefined);
    assert.equal(cell.tree["SKILL.md"].content, "changed with several words\n");
  }
});

test("a throwing spawn marks its cell error, keeps siblings, and cleans scratch", async () => {
  const { root } = editRepo(); const dirs = [];
  const result = await run(root, (args, { cwd }) => {
    dirs.push(cwd, args[args.indexOf("--skill") + 1]);
    if (modelOf(args) === "github-copilot/gpt-6.1-sol") throw new Error("spawn broke");
    writeFileSync(join(cwd, "SKILL.md"), "changed\n");
    return { status: "ok", stdout: "done", wallMs: 1 };
  }, { baselineOnly: true });
  assert.equal(result.exit, 1); assert.match(result.message, /spawn broke/);
  const outputs = record(root, "baseline").outputs;
  assert.equal(outputs["github-copilot/gpt-6.1-sol"].error, "spawn broke");
  assert.equal(outputs["anthropic/claude-opus-5-5"].status, "ok");
  for (const dir of dirs) assert.equal(existsSync(dir), false);
});

const okSpawn = (args) => ({ status: "ok", stdout: args.includes("anthropic-fable/claude-fable-5-1") ? judgeReply("holds", "holds") : "hi", wallMs: 1 });
test("bundle-free intent permits mixed bundle samples", async () => {
  const { root, put } = candidate();
  put("skills/x/extra.md", "EXTRA\n");
  execFileSync("git", ["add", "skills/x/extra.md"], { cwd: root });
  execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@localhost", "-c", "commit.gpgsign=false", "commit", "--no-verify", "-m", "extra"], { cwd: root });
  put("eval/t/samples/s2/case.md", "bundle+: skills/x/extra.md\nCASE\n");
  put("eval/t/samples/s2/expected.md", '- f1: judged: says hi\n');
  assert.equal((await run(root, okSpawn)).exit, 0);
  const second = JSON.parse(readFileSync(join(root, "eval/t/results/s2/candidate.json")));
  assert.equal(second.skillSha, sha256("NEW\n\nEXTRA\n"));
  assert.match(readFileSync(join(root, "eval/t/report.md"), "utf8"), new RegExp(`for: ${sha256("NEW\n")}`));
});
test("runner refuses all four bundle- lint errors before spawning", async () => {
  for (const { kind, caseText, message } of [
    { kind: "text", caseText: "bundle-: skills/x/missing.md\nCASE\n", message: "bundle- skills/x/missing.md not in skillFiles" },
    { kind: "text", caseText: "bundle-: skills/x/SKILL.md\nbundle-: skills/x/ref.md\nCASE\n", message: "bundle- leaves an empty assembly" },
    { kind: "edit", caseText: "bundle-: skills/x/ref.md\nCASE\n", message: "bundle- not allowed for kind edit" },
    { kind: "text", caseText: "bundle+: skills/x/ref.md\nbundle-: skills/x/ref.md\nCASE\n", message: "skills/x/ref.md in both bundle+ and bundle-" },
  ]) {
    const { root, put } = repo();
    put("eval/t/target.json", JSON.stringify({ kind, skillFiles: [{ path: "skills/x/SKILL.md" }, { path: "skills/x/ref.md" }], assembly: "concat", wordCap: 50 }));
    put("eval/t/samples/s1/case.md", caseText);
    if (kind === "edit") put("eval/t/samples/s1/fixture/file.md", "fixture\n");
    const result = await run(root, () => assert.fail("unexpected call"));
    assert.equal(result.exit, 2);
    assert.equal(result.message, `lint: t:\n  s1: ${message}`);
  }
});

test("denylist configuration does not refuse its own target", async () => {
  const { root, put } = candidate();
  const target = JSON.parse(readFileSync(join(root, "eval/t/target.json")));
  put("eval/t/target.json", JSON.stringify({ ...target, denylist: ["acme-corp"] }));
  assert.equal((await run(root, okSpawn)).exit, 0);
});
for (const recovers of [true, false]) test(`malformed judge reply ${recovers ? "recovers on one retry" : "errors after one retry and stays retryable"}`, async () => {
  const { root, put } = candidate();
  assert.equal((await run(root, okSpawn)).exit, 0);
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
  assert.equal((await run(root, spawn)).exit, recovers ? 0 : 1);
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
    assert.equal((await run(root, (args) => {
      assert.ok(args.includes("anthropic-fable/claude-fable-5-1"), "next run must only rejudge the failed pair");
      retryCalls++;
      return okSpawn(args);
    })).exit, 0);
    assert.equal(retryCalls, 1);
    assert.equal(record(root, "candidate").judge[model].verdict, "unchanged");
  }
});

test("judge failures are retried on the next run", async () => {
  const { root } = candidate();
  assert.equal((await run(root, (args) => args.includes("anthropic-fable/claude-fable-5-1") ? { status: "error", stderr: "unavailable" } : okSpawn(args))).exit, 1);
  assert.equal(record(root, "candidate").judge["anthropic/claude-opus-5-5"].factsSha, undefined);
  let calls = 0;
  assert.equal((await run(root, (args) => { if (args.includes("anthropic-fable/claude-fable-5-1")) calls++; else assert.fail("unexpected replay"); return okSpawn(args); })).exit, 0);
  assert.equal(calls, 2);
});
for (const baselineOnly of [true, false]) test(`candidate promotion without replay: baselineOnly=${baselineOnly}`, async () => {
  const { root } = candidate();
  assert.equal((await run(root, okSpawn)).exit, 0);
  const candidateRecord = record(root, "candidate");
  commit(root, "merge candidate skill");
  assert.equal((await run(root, () => assert.fail("unexpected call"), { baselineOnly })).exit, 0);
  const baseline = record(root, "baseline");
  assert.equal(baseline.arm, "baseline");
  assert.equal(baseline.judge, undefined);
  assert.deepEqual(baseline.outputs, candidateRecord.outputs);
});

for (const failure of ["replay", "judge"]) test(`confirmation ${failure} failure stays retryable`, async () => {
  const { root } = candidate(); const replays = {}, judges = {};
  const result = (await run(root, (args, { input }) => {
    if (args.includes("anthropic-fable/claude-fable-5-1")) {
      const model = modelIn(input);
      judges[model] = (judges[model] ?? 0) + 1;
      if (failure === "judge" && judges[model] > 1) return { status: "error", stderr: "down" };
      return { status: "ok", stdout: judgeReply("holds", "fails") };
    }
    const model = modelOf(args);
    replays[model] = (replays[model] ?? 0) + 1;
    return failure === "replay" && replays[model] === 3 ? { status: "error", stderr: "down" } : { status: "ok", stdout: hiFor(args) };
  }));
  assert.equal(result.exit, 1);
  const entry = record(root, "candidate").judge["anthropic/claude-opus-5-5"];
  assert.equal(entry.verdict, "error");
  assert.equal(entry.factsSha, undefined);
});
test("missing base skill refuses with its file and base selection advice", async () => {
  const { root, put } = candidate();
  put("skills/new/SKILL.md", "NEW\n");
  put("eval/t/target.json", JSON.stringify({ kind: "text", skillFiles: [{ path: "skills/new/SKILL.md" }], assembly: "concat", wordCap: 50 }));
  const result = (await run(root, () => assert.fail("unexpected call"), { baselineOnly: true }));
  assert.equal(result.exit, 2);
  assert.match(result.message, /skills\/new\/SKILL.md at [\s\S]*--base/);
});

test("missing tree skill refuses with its file and ref", async () => {
  const { root, put } = candidate();
  put("eval/t/target.json", JSON.stringify({ kind: "text", skillFiles: [{ path: "skills/missing/SKILL.md" }], assembly: "concat", wordCap: 50 }));
  const result = (await run(root, () => assert.fail("unexpected call")));
  assert.equal(result.exit, 2);
  assert.match(result.message, /skills\/missing\/SKILL.md at working tree: /);
});

test("renamed slice heading refuses with its file and tree ref", async () => {
  const { root, put } = candidate();
  put("eval/t/target.json", JSON.stringify({ kind: "text", skillFiles: [{ path: "skills/x/SKILL.md", slice: "## Old" }], assembly: "concat", wordCap: 50 }));
  put("skills/x/SKILL.md", "## Renamed\nNEW\n");
  const result = (await run(root, () => assert.fail("unexpected call")));
  assert.equal(result.exit, 2);
  assert.match(result.message, /skills\/x\/SKILL.md at working tree: heading not found: ## Old/);
});

test("CLI parse errors print usage and exit 2", async () => {
  for (const args of [["--unknown"], ["t", "--base"], [], ["t", "s", "extra"]]) {
    assert.throws(() => execFileSync(process.execPath, [new URL("../run.mjs", import.meta.url).pathname, ...args], { stdio: "pipe" }), (error) => error.status === 2 && /usage:/.test(error.stderr));
  }
});

const tick = () => new Promise((resolve) => setImmediate(resolve));
const commit = (root, message) => execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@localhost", "-c", "commit.gpgsign=false", "commit", "--no-verify", "-q", "-am", message], { cwd: root });

test("pool keeps at most concurrency adapter calls in flight", async () => {
  const { root, put } = repo();
  put("eval/t/samples/s2/case.md", "CASE2\n"); put("eval/t/samples/s2/expected.md", "- f1: judged: x\n");
  let inFlight = 0, peak = 0; const release = [];
  const spawn = () => new Promise((resolve) => { inFlight++; peak = Math.max(peak, inFlight); release.push(() => { inFlight--; resolve({ status: "ok", stdout: "hi", wallMs: 1 }); }); });
  const done = run(root, spawn, { baselineOnly: true, concurrency: 2 });
  await tick(); assert.equal(inFlight, 2);
  release.shift()(); await tick(); assert.equal(inFlight, 2);
  while (release.length) { release.shift()(); await tick(); }
  assert.equal((await done).exit, 0); assert.equal(peak, 2);
});

test("all four stale replay cells start before any resolves", async () => {
  const { root } = candidate();
  const release = [];
  const done = run(root, (args) => isJudge(args) ? okSpawn(args) : new Promise((resolve) => release.push(() => resolve(okSpawn(args)))), { concurrency: 4 });
  await tick();
  const started = release.length;
  while (release.length) { release.shift()(); await tick(); }
  assert.equal((await done).exit, 0);
  assert.equal(started, 4);
});

test("concurrency 1 runs confirmation and judge retry in strict sequence and completes", async () => {
  const { root } = candidate(); let inFlight = 0, peak = 0; const judges = {};
  const spawn = async (args, { input }) => {
    inFlight++; peak = Math.max(peak, inFlight); await tick(); inFlight--;
    if (!isJudge(args)) return { status: "ok", stdout: hiFor(args), wallMs: 1 };
    const model = modelIn(input); judges[model] = (judges[model] ?? 0) + 1;
    return { status: "ok", stdout: judges[model] === 1 ? "no JSON block" : judgeReply("holds", "fails"), wallMs: 1 };
  };
  const result = await run(root, spawn, { concurrency: 1 });
  assert.equal(result.exit, 1); assert.equal(peak, 1);
  assert.match(result.message, /replay 4, judge 6, confirm 2/);
  for (const entry of Object.values(record(root, "candidate").judge)) {
    assert.equal(entry.verdict, "regressed");
    assert.equal(entry.wallMs, 2);
    assert.equal(entry.confirmation.judgeWallMs, 1);
  }
});

test("EVAL_CONCURRENCY must be a positive integer", async () => {
  const { root } = candidate();
  for (const value of ["abc", "0", "-1", "1.5", ""]) {
    const result = await run(root, () => assert.fail("unexpected call"), { concurrency: value });
    assert.equal(result.exit, 2); assert.equal(result.message, `EVAL_CONCURRENCY must be a positive integer, got ${value}`);
  }
  const saved = process.env.EVAL_CONCURRENCY; process.env.EVAL_CONCURRENCY = "abc";
  try { assert.equal((await run(root, () => assert.fail("unexpected call"))).exit, 2); }
  finally { if (saved === undefined) delete process.env.EVAL_CONCURRENCY; else process.env.EVAL_CONCURRENCY = saved; }
});

function subsetRepo() {
  const fixture = repo();
  fixture.put("skills/x/ref.md", "REF\n");
  execFileSync("git", ["add", "skills/x/ref.md"], { cwd: fixture.root }); commit(fixture.root, "ref");
  fixture.put("eval/t/target.json", JSON.stringify({ kind: "text", skillFiles: [{ path: "skills/x/SKILL.md" }, { path: "skills/x/ref.md" }], assembly: "concat", wordCap: 50 }));
  fixture.put("eval/t/samples/s2/case.md", "bundle-: skills/x/ref.md\nCASE2\n");
  fixture.put("eval/t/samples/s2/expected.md", "- f1: judged: says hi\n");
  fixture.intent = (ref) => fixture.put("eval/t/intent.md", `for: ${sha256(`BASE\n\n${ref}`)}\n\n## Change\nx\n\n## Expected to move\n`);
  return fixture;
}

test("a dropped file's edit replays only the samples that kept it", async () => {
  const { root, put, intent } = subsetRepo();
  let replays = 0;
  const spawn = (args) => isJudge(args) ? okSpawn(args) : { status: "ok", stdout: `hi ${++replays}`, wallMs: 1 };
  put("skills/x/ref.md", "REF2\n"); intent("REF2\n");
  assert.match((await run(root, spawn)).message, /replay 8, judge 4, confirm 0/);
  const s2 = JSON.parse(readFileSync(join(root, "eval/t/results/s2/candidate.json"), "utf8"));
  assert.equal(s2.skillSha, sha256("BASE\n"));
  const paths = ["baseline", "candidate"].map((arm) => join(root, `eval/t/results/s2/${arm}.json`));
  const before = paths.map((path) => readFileSync(path, "utf8"));
  put("skills/x/ref.md", "REF3\n"); intent("REF3\n");
  assert.match((await run(root, spawn)).message, /replay 2, judge 2, confirm 0/);
  assert.deepEqual(paths.map((path) => readFileSync(path, "utf8")), before);
  assert.equal(JSON.parse(readFileSync(join(root, "eval/t/results/s1/candidate.json"), "utf8")).skillSha, sha256("BASE\n\nREF3\n"));
  assert.match((await run(root, spawn)).message, /replay 0, judge 0, confirm 0/);
});

test("a for:-only intent bump keeps judgments current; a Change edit stales them", async () => {
  const { root, put } = candidate();
  assert.match((await run(root, okSpawn)).message, /replay 4, judge 2/);
  put("skills/x/SKILL.md", "NEW2\n");
  put("eval/t/intent.md", `for: ${sha256("NEW2\n")}\n\n## Change\nx\n\n## Expected to move\n`);
  assert.match((await run(root, okSpawn)).message, /replay 2, judge 0, confirm 0/);
  put("eval/t/intent.md", `for: ${sha256("NEW2\n")}\n\n## Change\ny\n\n## Expected to move\n`);
  assert.match((await run(root, okSpawn)).message, /replay 0, judge 2, confirm 0/);
});

test("one failing cell leaves sibling cells and records intact", async () => {
  const { root } = candidate();
  const result = await run(root, (args) => { if (!isJudge(args) && modelOf(args) === "github-copilot/gpt-6.1-sol") throw new Error("boom"); return okSpawn(args); });
  assert.equal(result.exit, 1);
  const cand = record(root, "candidate");
  assert.equal(cand.outputs["github-copilot/gpt-6.1-sol"].error, "boom");
  assert.equal(cand.judge["anthropic/claude-opus-5-5"].verdict, "unchanged");
  assert.equal(cand.judge["github-copilot/gpt-6.1-sol"].verdict, "error");
});

test("abort keeps completed samples, drops in-flight ones, writes no report", async () => {
  const { root, put } = candidate();
  put("eval/t/samples/s2/case.md", "CASE2\n"); put("eval/t/samples/s2/expected.md", "- f1: judged: says hi\n");
  const controller = new AbortController();
  const spawn = async (args, { input }) => {
    if (isJudge(args) && input.includes("CASE2")) { await tick(); controller.abort(); return { status: "error", stderr: "aborted", wallMs: 1 }; }
    return okSpawn(args);
  };
  const result = await run(root, spawn, { concurrency: 1, signal: controller.signal });
  assert.equal(result.exit, 130);
  assert.ok(existsSync(join(root, "eval/t/results/s1/candidate.json")));
  assert.equal(existsSync(join(root, "eval/t/results/s2")), false);
  assert.equal(existsSync(join(root, "eval/t/report.md")), false);
});

test("a zero-call run leaves report.md byte-identical; rows are ordered by sample then model", async () => {
  const { root, put } = candidate();
  put("eval/t/samples/s2/case.md", "CASE2\n"); put("eval/t/samples/s2/expected.md", "- f1: judged: says hi\n");
  const spawn = async (args) => { await new Promise((resolve) => setTimeout(resolve, modelOf(args) === "anthropic/claude-opus-5-5" ? 5 : 0)); return okSpawn(args); };
  assert.equal((await run(root, spawn)).exit, 0);
  for (const arm of ["baseline", "candidate"]) {
    const saved = record(root, arm);
    assert.deepEqual(Object.keys(saved.outputs), MODELS.replay);
    if (saved.judge) assert.deepEqual(Object.keys(saved.judge), MODELS.replay);
  }
  const path = join(root, "eval/t/report.md");
  const report = readFileSync(path, "utf8");
  const order = [...report.matchAll(/^\| (s\d) \| (\S+) \|/gm)].map((m) => `${m[1]}/${m[2]}`);
  assert.deepEqual(order, ["s1/anthropic/claude-opus-5-5", "s1/github-copilot/gpt-6.1-sol", "s2/anthropic/claude-opus-5-5", "s2/github-copilot/gpt-6.1-sol"]);
  const before = [report, statSync(path).mtimeMs];
  const again = await run(root, () => assert.fail("unexpected call"));
  assert.equal(again.exit, 0); assert.match(again.message, /report.md unchanged; replay 0, judge 0, confirm 0/);
  assert.deepEqual([readFileSync(path, "utf8"), statSync(path).mtimeMs], before);
});

test("a record without judge wallMs is still current", async () => {
  const { root, put } = candidate();
  assert.equal((await run(root, okSpawn)).exit, 0);
  const saved = record(root, "candidate");
  for (const entry of Object.values(saved.judge)) { assert.equal(typeof entry.wallMs, "number"); delete entry.wallMs; }
  put("eval/t/results/s1/candidate.json", JSON.stringify(saved, null, 2) + "\n");
  assert.match((await run(root, () => assert.fail("unexpected call"))).message, /judge 0/);
});

for (const extra of [{}, { sample: "missing" }, { sample: "s1", baselineOnly: true }]) test(`refresh admission rejects ${JSON.stringify(extra)}`, async () => {
  const { root } = candidate();
  assert.equal((await run(root, () => assert.fail("unexpected call"), { refreshJudgments: true, ...extra })).exit, 2);
});

for (const outcome of ["pass", "regressed", "inconclusive", "judge error", "replay error", "confirmation error"]) test(`refresh activates ${outcome} with immutable replies and bounded audit`, async () => {
  const { root, put } = candidate();
  put("eval/t/samples/s2/case.md", "OTHER\n"); put("eval/t/samples/s2/expected.md", "- f1: judged: other\n");
  assert.equal((await run(root, okSpawn)).exit, 0);
  const saved = record(root, "candidate");
  for (const cell of Object.values(saved.outputs)) cell.mechanical = { historical: "fails" };
  saved.outputs.historical = { status: "ok", text: "old", tree: { x: { content: "old" } }, wallMs: 123 };
  put("eval/t/results/s1/candidate.json", JSON.stringify(saved));
  const baseline = readFileSync(join(root, "eval/t/results/s1/baseline.json"), "utf8");
  const other = readFileSync(join(root, "eval/t/results/s2/candidate.json"), "utf8");
  let judges = 0, confirmations = 0;
  const result = await run(root, (args) => {
    const active = record(root, "candidate");
    assert.equal(active.refresh.status, "running");
    if (!judges && !confirmations) for (const model of MODELS.replay) {
      assert.deepEqual(active.judge[model], { verdict: "error", error: "refresh incomplete", judgeModel: MODELS.judge, thinking: MODELS.thinking });
      assert.deepEqual(active.refresh.refreshed[model], active.judge[model]);
    }
    if (!isJudge(args)) { confirmations++; return outcome === "replay error" ? { status: "error", stderr: "down" } : okSpawn(args); }
    judges++;
    if (outcome === "judge error" || (outcome === "confirmation error" && judges > 2)) return { status: "error", stderr: "down" };
    return { status: "ok", stdout: judgeReply("holds", outcome === "pass" || (outcome === "inconclusive" && judges > 2) ? "holds" : "fails"), wallMs: 3 };
  }, { sample: "s1", refreshJudgments: true });
  assert.equal(result.exit, outcome === "pass" ? 0 : 1);
  const refreshed = record(root, "candidate");
  assert.deepEqual(refreshed.outputs, saved.outputs);
  assert.equal(readFileSync(join(root, "eval/t/results/s1/baseline.json"), "utf8"), baseline);
  assert.equal(readFileSync(join(root, "eval/t/results/s2/candidate.json"), "utf8"), other);
  assert.equal(refreshed.refresh.status, "complete");
  assert.equal(confirmations, ["pass", "judge error"].includes(outcome) ? 0 : 2);
  assert.equal(judges, outcome === "pass" || outcome === "replay error" ? 2 : outcome === "confirmation error" ? 6 : 4);
  for (const model of MODELS.replay) {
    for (const arm of ["baseline", "candidate"]) {
      const identity = refreshed.refresh.identity.outputs[arm][model];
      assert.equal(identity[`${arm}OutputSha`], sha256(record(root, arm).outputs[model].text));
      assert.equal(Object.hasOwn(identity, "textSha"), false);
      assert.match(identity.payloadSha, /^[a-f0-9]{64}$/);
    }
    const entry = refreshed.judge[model];
    assert.equal(entry.verdict, outcome.includes("error") ? "error" : outcome === "pass" ? "unchanged" : outcome);
    assert.equal(entry.judgeModel, MODELS.judge);
    assert.equal(entry.thinking, MODELS.thinking);
    if (["replay error", "confirmation error"].includes(outcome)) {
      assert.equal(entry.error, "down");
      assert.equal(entry.confirmation.error, "down");
      assert.equal(entry.confirmation.status, outcome === "replay error" ? "error" : "ok");
      assert.equal(entry.confirmation.text, outcome === "replay error" ? undefined : "hi");
      assert.equal(entry.confirmation.judgeWallMs, outcome === "replay error" ? undefined : 0);
      assert.equal(entry.facts.f1.label, "regression");
      assert.equal(entry.feedback, "fb");
    }
    assert.equal(entry.factsSha === undefined, outcome.includes("error"));
    assert.deepEqual(refreshed.refresh.refreshed[model], entry);
    assert.equal(refreshed.refresh.previous[model].judgeModel, null);
    assert.equal(refreshed.refresh.previous[model].verdict, "unchanged");
  }
  assert.match(result.message, /refresh.*s1/);
  assert.match(readFileSync(join(root, "eval/t/report.md"), "utf8"), /refresh/i);
  const audit = refreshed.refresh;
  await run(root, okSpawn, { sample: "s1" });
  assert.deepEqual(record(root, "candidate").refresh, audit);
  await run(root, okSpawn, { sample: "s1", refreshJudgments: true });
  assert.equal(record(root, "candidate").refresh.previous[MODELS.replay[0]].judgeModel, outcome.includes("error") ? null : MODELS.judge);
});

for (const arm of ["baseline", "candidate"]) for (const defect of ["missing", "malformed", "skillSha", "inputSha", "assembly", "thinking", "membership", "failed", "missing text", "non-string text", "promotable", ...(arm === "candidate" ? ["invalid intent"] : [])]) test(`refresh refuses ${defect} ${arm} replies without writes`, async () => {
  const { root, put } = candidate();
  await run(root, okSpawn);
  const saved = record(root, arm);
  if (defect === "missing") put(`eval/t/results/s1/${arm}.json`, "null");
  else if (defect === "malformed") put(`eval/t/results/s1/${arm}.json`, "{");
  else {
    if (["skillSha", "inputSha", "assembly"].includes(defect)) saved[defect] = "stale";
    if (defect === "thinking") saved.models.thinking = "stale";
    if (defect === "membership") saved.models.replay.pop();
    if (defect === "failed") saved.outputs[MODELS.replay[1]].status = "error";
    if (defect === "missing text") delete saved.outputs[MODELS.replay[1]].text;
    if (defect === "non-string text") saved.outputs[MODELS.replay[1]].text = 42;
    saved.refresh = { status: "complete", previous: {}, refreshed: {} };
    if (defect === "promotable") commit(root, "advance base");
    if (defect === "invalid intent") put("eval/t/intent.md", INTENT_STUB);
    put(`eval/t/results/s1/${arm}.json`, JSON.stringify(saved));
  }
  const paths = ["results/s1/baseline.json", "results/s1/candidate.json", "report.md"].map((p) => join(root, "eval/t", p));
  const bytes = paths.map((p) => readFileSync(p, "utf8"));
  let calls = 0;
  const result = await run(root, () => { calls++; return okSpawn([]); }, { sample: "s1", refreshJudgments: true });
  assert.equal(result.exit, 2);
  assert.equal(calls, 0);
  if (["missing text", "non-string text"].includes(defect)) assert.ok(result.message.includes(`s1/${arm}/${MODELS.replay[1]}:`));
  if (defect === "invalid intent") assert.match(result.message, /intent.md is the template stub/);
  if (defect === "malformed") for (const model of MODELS.replay) assert.ok(result.message.includes(`s1/${arm}/${model}:`));
  assert.deepEqual(paths.map((p) => readFileSync(p, "utf8")), bytes);
});

for (const history of ["inconclusive", "missing", "stale", "error"]) test(`refresh bypasses ${history} judgment and keeps a bounded predecessor`, async () => {
  const { root, put } = candidate();
  await run(root, okSpawn);
  const saved = record(root, "candidate");
  for (const model of MODELS.replay) {
    if (history === "missing") delete saved.judge[model];
    else if (history === "stale") saved.judge[model].factsSha = "old";
    else saved.judge[model].verdict = history;
  }
  put("eval/t/results/s1/candidate.json", JSON.stringify(saved));
  let calls = 0;
  const fresh = (args) => { assert.ok(isJudge(args)); calls++; return okSpawn(args); };
  assert.equal((await run(root, fresh, { sample: "s1", refreshJudgments: true })).exit, 0);
  assert.equal(calls, 2);
  const first = record(root, "candidate");
  for (const model of MODELS.replay) {
    assert.equal(first.refresh.previous[model]?.factsSha ?? null, history === "missing" ? null : history === "stale" ? "old" : saved.judge[model].factsSha);
    assert.equal(first.refresh.previous[model]?.judgeModel ?? null, null);
  }
  const report = readFileSync(join(root, "eval/t/report.md"), "utf8");
  assert.equal((await run(root, () => assert.fail("ordinary selection must reuse"), { sample: "s1" })).exit, 0);
  assert.equal(readFileSync(join(root, "eval/t/report.md"), "utf8"), report);
  await run(root, fresh, { sample: "s1", refreshJudgments: true });
  const second = record(root, "candidate");
  for (const model of MODELS.replay) assert.deepEqual(second.refresh.previous[model], first.judge[model]);
  put("skills/x/SKILL.md", "NEW2\n");
  put("eval/t/intent.md", `for: ${sha256("NEW2\n")}\n\n## Change\nx\n\n## Expected to move\n`);
  await run(root, okSpawn);
  assert.deepEqual(record(root, "candidate").refresh, second.refresh);
});

test("refresh uses saved edit trees without rewriting their payloads", async () => {
  const { root, put } = editRepo();
  const skill = readFileSync(join(root, "skills/x/SKILL.md"), "utf8") + "\nreference\n";
  put("eval/t/intent.md", `for: ${sha256(skill)}\n\n## Change\nx\n\n## Expected to move\n`);
  const spawn = (args, { cwd }) => {
    if (isJudge(args)) return okSpawn(args);
    writeFileSync(join(cwd, "SKILL.md"), "hi changed\n");
    return { status: "ok", stdout: "done", wallMs: 7 };
  };
  assert.equal((await run(root, spawn)).exit, 0);
  const before = record(root, "candidate");
  let calls = 0;
  assert.equal((await run(root, (args, { input }) => {
    assert.ok(isJudge(args)); assert.match(input, /hi changed/); calls++;
    return okSpawn(args);
  }, { sample: "s1", refreshJudgments: true })).exit, 0);
  assert.equal(calls, 2);
  const after = record(root, "candidate");
  assert.deepEqual(after.outputs, before.outputs);
  for (const model of MODELS.replay) {
    assert.match(after.refresh.identity.outputs.candidate[model].payloadSha, /^[a-f0-9]{64}$/);
    assert.equal(after.refresh.identity.outputs.candidate[model].candidateOutputSha, sha256(before.outputs[model].text));
    assert.equal(Object.hasOwn(after.refresh.identity.outputs.candidate[model], "textSha"), false);
  }
});

for (const arm of ["baseline", "candidate"]) for (const [defect, tree] of [
  ["missing tree", undefined], ["null tree", null], ["array tree", []], ["string tree", "bad"],
  ["null entry", { x: null }], ["array entry", { x: [] }],
  ["missing content", { x: { lines: 0 } }], ["non-string content", { x: { content: 42, lines: 0 } }],
  ["missing lines", { x: { content: "" } }], ["negative lines", { x: { content: "", lines: -1 } }],
  ["fractional lines", { x: { content: "", lines: 0.5 } }], ["string lines", { x: { content: "", lines: "0" } }],
  ["empty tree", {}], ["empty file", { x: { content: "", lines: 0 } }],
]) test(`refresh edit payload ${defect} in ${arm}`, async () => {
  const { root, put } = editRepo();
  const skill = readFileSync(join(root, "skills/x/SKILL.md"), "utf8") + "\nreference\n";
  put("eval/t/intent.md", `for: ${sha256(skill)}\n\n## Change\nx\n\n## Expected to move\n`);
  put("eval/t/samples/s1/expected.md", "- f1: judged: says hi\n");
  await run(root, (args, { cwd }) => {
    if (isJudge(args)) return okSpawn(args);
    writeFileSync(join(cwd, "SKILL.md"), "hi changed\n");
    return { status: "ok", stdout: "done", wallMs: 1 };
  });
  const saved = record(root, arm);
  saved.outputs[MODELS.replay[1]].tree = tree;
  saved.outputs[MODELS.replay[1]].text = "";
  saved.outputs.historical = { status: "ok" };
  saved.refresh = { status: "complete", previous: {}, refreshed: {} };
  put(`eval/t/results/s1/${arm}.json`, JSON.stringify(saved));
  const paths = ["results/s1/baseline.json", "results/s1/candidate.json", "report.md"].map((p) => join(root, "eval/t", p));
  const bytes = paths.map((p) => readFileSync(p, "utf8"));
  let calls = 0;
  const result = await run(root, (args) => { assert.ok(isJudge(args)); calls++; return okSpawn(args); }, { sample: "s1", refreshJudgments: true });
  const valid = defect === "empty tree" || defect === "empty file";
  assert.equal(result.exit, valid ? 0 : 2);
  assert.equal(calls, valid ? 2 : 0);
  if (valid) assert.deepEqual(record(root, arm).outputs, saved.outputs);
  else {
    assert.ok(result.message.includes(`s1/${arm}/${MODELS.replay[1]}:`));
    assert.deepEqual(paths.map((p) => readFileSync(p, "utf8")), bytes);
  }
});

test("refresh overlapping settlements persist both results in every later snapshot", async () => {
  const { root } = candidate();
  await run(root, okSpawn);
  const releases = [], snapshots = [];
  const done = run(root, (args) => new Promise((resolve) => releases.push(() => resolve(okSpawn(args)))), {
    sample: "s1", refreshJudgments: true, concurrency: 2,
    refreshWriter: (...args) => { writeRecordAtomic(...args); snapshots.push(record(root, "candidate")); },
  });
  await tick(); assert.equal(releases.length, 2);
  releases.shift()(); await tick();
  releases.shift()();
  assert.equal((await done).exit, 0);
  assert.equal(snapshots.length, 4);
  assert.equal(snapshots[1].judge[MODELS.replay[0]].verdict, "unchanged");
  for (const saved of snapshots.slice(2)) for (const model of MODELS.replay) {
    assert.equal(saved.judge[model].verdict, "unchanged");
    assert.deepEqual(saved.refresh.refreshed[model], saved.judge[model]);
  }
});

for (const phase of ["before admission", "queued", "confirmation"]) test(`refresh interruption ${phase} retains evidence`, async () => {
  const { root } = candidate(); await run(root, okSpawn);
  const controller = new AbortController(); let calls = 0;
  const before = readFileSync(join(root, "eval/t/results/s1/candidate.json"), "utf8");
  const previous = Object.fromEntries(Object.entries(JSON.parse(before).judge).map(([model, entry]) =>
    [model, { ...entry, judgeModel: null, thinking: null }]));
  let attemptIdentity;
  if (phase === "before admission") controller.abort();
  const result = await run(root, (args) => {
    calls++;
    attemptIdentity ??= record(root, "candidate").refresh.identity;
    if (phase === "queued" || !isJudge(args)) { controller.abort(); return okSpawn(args); }
    return { status: "ok", stdout: judgeReply("holds", "fails"), wallMs: 1 };
  }, { sample: "s1", refreshJudgments: true, concurrency: 1, signal: controller.signal });
  assert.equal(result.exit, 130);
  if (phase === "before admission") {
    assert.equal(calls, 0);
    assert.equal(readFileSync(join(root, "eval/t/results/s1/candidate.json"), "utf8"), before);
  } else {
    const saved = record(root, "candidate");
    assert.equal(saved.refresh.status, "interrupted");
    assert.deepEqual(saved.refresh.previous, previous);
    assert.deepEqual(saved.refresh.identity, attemptIdentity);
    assert.equal(saved.judge[MODELS.replay[1]].verdict, "error");
    assert.match(saved.judge[MODELS.replay[1]].error, /interrupt/);
    if (phase === "queued") { assert.equal(calls, 1); assert.equal(saved.judge[MODELS.replay[0]].verdict, "unchanged"); }
    else assert.equal(saved.judge[MODELS.replay[0]].confirmation.text, "hi");
    const report = readFileSync(join(root, "eval/t/report.md"), "utf8");
    assert.match(report, /partial run: s1/); assert.match(report, /refresh: interrupted/); assert.match(report, /exit: 130/);
  }
});

for (const failure of ["initial", "middle", "abort"]) test(`refresh ${failure} save failure is sticky and preserves report`, async () => {
  const { root } = candidate(); await run(root, okSpawn);
  const report = readFileSync(join(root, "eval/t/report.md"), "utf8");
  const controller = new AbortController(); let writes = 0, calls = 0;
  const result = await run(root, async (args) => {
    const call = ++calls;
    await tick();
    if (failure === "abort") controller.abort();
    if (failure === "middle" && call === 2) {
      await tick();
      return { status: "ok", stdout: judgeReply("holds", "fails"), wallMs: 1 };
    }
    return okSpawn(args);
  }, { sample: "s1", refreshJudgments: true, concurrency: failure === "initial" ? 1 : 2, signal: controller.signal,
    refreshWriter: (...args) => {
      writes++;
      if (writes === (failure === "initial" ? 1 : 2)) throw new Error("ENOSPC: disk full");
      writeRecordAtomic(...args);
    },
  });
  assert.equal(result.exit, 1);
  assert.match(result.message, /results\/s1\/candidate.json/); assert.match(result.message, /ENOSPC: disk full/);
  assert.equal(readFileSync(join(root, "eval/t/report.md"), "utf8"), report);
  assert.equal(calls, failure === "initial" ? 0 : 2);
  if (failure !== "initial") { assert.ok(writes > 2); assert.equal(record(root, "candidate").judge[MODELS.replay[0]].verdict, "unchanged"); }
  if (failure === "middle") assert.match(record(root, "candidate").judge[MODELS.replay[1]].confirmation.error, /persistence failed/);
});

for (const { name, args, message } of [
  { name: "accepts refresh flag with the existing base option", args: ["s1"], message: /unknown target/ },
  { name: "rejects refresh without a sample", args: [], message: /refresh judgments requires one sample/ },
  { name: "rejects refresh with baseline-only", args: ["s1", "--baseline-only"], message: /cannot use --baseline-only/ },
]) test(`CLI ${name}`, () => {
  assert.throws(() => execFileSync(process.execPath, [new URL("../run.mjs", import.meta.url).pathname, "unknown-refresh-target", ...args, "--refresh-judgments", "--base", "HEAD"], { stdio: "pipe" }),
    (error) => error.status === 2 && message.test(error.stderr) && !/usage:/.test(error.stderr));
});

for (const listed of [false, true]) test(`fresh improvement skips confirmation: opposite intent ${listed}`, async () => {
  const { root, put } = candidate();
  if (listed) put("eval/t/intent.md", `for: ${sha256("NEW\n")}\n\n## Change\nx\n\n## Expected to move\n- s1/f1: holds -> fails - intended effect\n`);
  let calls = 0;
  const result = await run(root, (args) => { calls++; return { status: "ok", stdout: isJudge(args) ? judgeReply("fails", "holds") : "hi", wallMs: 7 }; });
  assert.equal(result.exit, 0);
  assert.equal(calls, 6);
  for (const entry of Object.values(record(root, "candidate").judge)) {
    assert.equal(entry.verdict, "improved");
    assert.equal(entry.facts.f1.label, "unplanned improvement");
    assert.equal(entry.confirmation, undefined);
  }
  assert.match(readFileSync(join(root, "eval/t/report.md"), "utf8"), /f1: fails -> holds \(unplanned improvement\)/);
});

for (const replay of ["regression", "improvement", "error"]) test(`mixed fresh cell confirms only regression: ${replay}`, async () => {
  const { root, put } = candidate(); const seen = {};
  put("eval/t/samples/s1/expected.md", "- f1: judged: improves\n- f2: judged: regresses\n");
  const result = await run(root, (args, { input }) => {
    if (!isJudge(args)) return { status: "ok", stdout: hiFor(args), wallMs: 3 };
    const model = modelIn(input); const first = (seen[model] = (seen[model] ?? 0) + 1) === 1;
    if (!first && replay === "error") return { status: "error", stderr: "confirmation failed", wallMs: 4 };
    return { status: "ok", stdout: "```json\n" + JSON.stringify({ facts: {
      f1: { before: "fails", after: "holds" },
      f2: { before: "holds", after: first || replay === "regression" ? "fails" : "holds" },
    }, feedback: "mixed" }) + "\n```", wallMs: 5 };
  });
  assert.equal(result.exit, 1);
  for (const entry of Object.values(record(root, "candidate").judge)) {
    assert.equal(entry.facts?.f1.label, "unplanned improvement");
    assert.equal(entry.verdict, replay === "regression" ? "regressed" : replay === "error" ? "error" : "inconclusive");
  }
});

for (const scenario of ["regressed improvement", "inconclusive improvement", "mixed disputed", "mixed reproduced", "missing confirmation", "error", "missing outcomes", "identity mismatch", "write failure"]) test(`cached policy reclassification: ${scenario}`, async () => {
  const { root, put } = candidate();
  const pairReply = (regressed) => "```json\n" + JSON.stringify({ facts: { f1: { before: "fails", after: "holds" }, f2: { before: "holds", after: regressed ? "fails" : "holds" } }, feedback: "fb" }) + "\n```";
  put("eval/t/samples/s1/expected.md", "- f1: judged: improves\n- f2: judged: stays steady\n");
  await run(root, (args) => ({ status: "ok", stdout: isJudge(args) ? pairReply(false) : "hi", wallMs: 7 }));
  const saved = record(root, "candidate");
  for (const entry of Object.values(saved.judge)) {
    entry.verdict = scenario === "error" ? "error" : scenario.startsWith("inconclusive") || scenario === "mixed disputed" ? "inconclusive" : "regressed";
    entry.facts.f1 = { before: "fails", after: "holds", label: "unexplained change" };
    entry.confirmation = { status: "ok", text: "old replay", wallMs: 11, judgeWallMs: 13, feedback: "old confirmation", facts: structuredClone(entry.facts) };
    if (scenario.startsWith("mixed") || scenario === "missing confirmation") {
      entry.facts.f2 = { before: "holds", after: "fails", label: "regression" };
      entry.confirmation.facts.f2 = { before: "holds", after: scenario === "mixed reproduced" ? "fails" : "holds", label: "held" };
    }
    if (scenario === "missing confirmation") delete entry.confirmation;
    if (scenario === "missing outcomes") delete entry.facts.f1.after;
    if (scenario === "identity mismatch") entry.intentSha = "stale";
  }
  put("eval/t/results/s1/candidate.json", JSON.stringify(saved, null, 2) + "\n");
  const paths = ["results/s1/baseline.json", "results/s1/candidate.json", "report.md"].map((p) => join(root, "eval/t", p));
  const before = paths.map((p) => readFileSync(p, "utf8"));
  if (scenario === "missing confirmation") {
    let failedCalls = 0;
    const failed = await run(root, () => { failedCalls++; return { status: "error", stderr: "confirmation down", wallMs: 1 }; });
    assert.equal(failed.exit, 1);
    assert.equal(failedCalls, 2);
    for (const entry of Object.values(record(root, "candidate").judge)) {
      assert.equal(entry.verdict, "error");
      assert.equal(entry.error, "confirmation down");
    }
  }
  let calls = 0;
  const result = await run(root, (args) => { calls++; return { status: "ok", stdout: isJudge(args) ? pairReply(true) : "hi", wallMs: 1 }; }, scenario === "write failure" ? { recordWriter: () => { throw new Error("record save failed"); } } : {});
  if (scenario === "write failure") {
    assert.equal(result.exit, 1); assert.match(result.message, /save failed/);
    assert.equal(readFileSync(paths[2], "utf8"), before[2]);
    assert.equal(calls, 0); return;
  }
  const recovery = scenario === "missing confirmation" || scenario === "identity mismatch";
  assert.equal(calls, recovery ? 6 : 0);
  const after = record(root, "candidate");
  const preserved = scenario === "error" || scenario === "missing outcomes";
  assert.equal(result.exit, !preserved && !recovery && !scenario.startsWith("mixed") ? 0 : 1);
  for (const [model, entry] of Object.entries(after.judge)) {
    const expected = preserved ? saved.judge[model].verdict : scenario === "mixed disputed" ? "inconclusive" : scenario === "mixed reproduced" || recovery ? "regressed" : "improved";
    assert.equal(entry.verdict, expected);
    if (preserved) assert.deepEqual(entry, saved.judge[model]);
    if (!recovery && !preserved) {
      assert.equal(entry.facts.f1.label, "unplanned improvement");
      assert.equal(entry.feedback, saved.judge[model].feedback);
      assert.equal(entry.wallMs, 7);
      assert.equal(entry.confirmation.wallMs, 11);
      assert.equal(entry.confirmation.feedback, "old confirmation");
      assert.equal(entry.confirmation.judgeWallMs, 13);
      assert.equal(entry.confirmation.text, "old replay");
      if (!scenario.startsWith("mixed")) assert.deepEqual(entry.confirmation, saved.judge[model].confirmation);
    }
  }
  assert.deepEqual(after.outputs, saved.outputs);
  if (!preserved && !recovery) assert.match(readFileSync(paths[2], "utf8"), /unplanned improvement/);
  const snapshot = paths.map((p) => [readFileSync(p, "utf8"), statSync(p).mtimeMs]);
  await run(root, () => assert.fail("second identical run must not spawn"));
  assert.deepEqual(paths.map((p) => [readFileSync(p, "utf8"), statSync(p).mtimeMs]), snapshot);
});
