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
