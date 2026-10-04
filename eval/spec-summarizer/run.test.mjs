import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, mkdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { parseReview, aggregate, metrics, leakCheck, evaluate, loadExpected, loadSample, loadRecords, QUALITY, WORD_CEILING, renderTable } from "./run.mjs";

const tmp = () => mkdtempSync(join(tmpdir(), "eval-test-"));
const record = (over) => ({
  sample: "s1", arm: "candidate", candidate_model: "m", reviewers: ["a", "b"],
  persona_sha256: "p", input_sha256: "i", repo_sha: "r", text: "t",
  words: 100, backtick_lines: 0, path_tokens: 0,
  facts: { f1: { a: "yes", b: "yes" }, f2: { a: "yes", b: "yes" } },
  quality: { a: "readable", b: "briefing" }, rationale: { a: "ok", b: "ok" },
  aggregate: { kept: 2, disputed: 0, lost: 0 }, ...over,
});

test("loadExpected parses ids and facts", () => {
  const parsed = loadExpected("anonymized: true\n# Expected facts: x\n\n- f1: one\n- f2: two\n");
  assert.deepEqual(parsed.facts, [{ id: "f1", text: "one" }, { id: "f2", text: "two" }]);

});

test("parseReview accepts exactly one fenced JSON object with every fact id", () => {
  const ok = parseReview(' \n```json\n{ "facts": { "f1": "yes", "f2": "no" }, "quality": "mixed", "rationale": "r" }\n```\n', ["f1", "f2"]);
  assert.deepEqual(ok, { facts: { f1: "yes", f2: "no" }, quality: "mixed", rationale: "r" });
  assert.equal(parseReview("no json here", ["f1"]), null);
  assert.equal(parseReview('```json\n{ "facts": { "f1": "yes" }, "quality": "great", "rationale": "r" }\n```', ["f1"]), null);
  assert.equal(parseReview('```json\n{ "facts": { "f1": "yes" }, "quality": "readable", "rationale": "r" }\n```', ["f1", "f2"]), null);
  assert.equal(parseReview('```json\n{"a":1}\n```\n```json\n{ "facts": { "f1": "yes" }, "quality": "readable", "rationale": "r" }\n```', ["f1"]), null);
});

test("parseReview rejects malformed envelopes and unexpected fact ids", () => {
  const object = { facts: { f1: "yes" }, quality: "readable", rationale: "r" };
  const fence = (value) => `\`\`\`json\n${JSON.stringify(value)}\n\`\`\``;
  const valid = fence(object);
  assert.deepEqual(parseReview(`  ${valid}\n`, ["f1"]), object);
  assert.deepEqual(parseReview(valid.replace("```json", "```"), ["f1"]), object);
  for (const answer of [
    `prose\n${valid}`,
    `${valid}\nprose`,
    `${valid}\n${valid}`,
    fence({ ...object, extra: true }),
    fence({ facts: object.facts, quality: object.quality }),
    fence({ ...object, facts: { f1: "yes", unknown: "no" } }),
    fence({ ...object, facts: ["yes"] }),
    fence({ ...object, facts: { f1: "maybe" } }),
    fence([object]),
  ]) assert.equal(parseReview(answer, ["f1"]), null, answer);
});

test("aggregate counts kept, disputed and lost; unparsed is disputed", () => {
  assert.deepEqual(aggregate({ f1: { a: "yes", b: "yes" }, f2: { a: "no", b: "no" }, f3: { a: "yes", b: "no" }, f4: { a: "unparsed", b: "yes" } }), { kept: 1, disputed: 2, lost: 1 });
});

test("metrics counts words, backtick lines and path tokens", () => {
  const m = metrics("Plain words here.\nThe `guard` job in harness-guard.yml runs script/guard.ps1 and a/b.\nDone when it passes.");
  assert.equal(m.words, 16);
  assert.equal(m.backtick_lines, 1);
  assert.equal(m.path_tokens, 3);
});

test("leakCheck skips without a denylist, aborts on a hit, rejects an invalid expression", () => {
  const dir = tmp();
  mkdirSync(join(dir, "s1"));
  writeFileSync(join(dir, "s1", "source.md"), "line one\nAcme Corp secret\n");
  assert.deepEqual(leakCheck(dir, undefined), { status: "skipped" });
  assert.deepEqual(leakCheck(dir, join(dir, "missing.txt")), { status: "skipped" });
  const deny = join(tmp(), "deny.txt");
  writeFileSync(deny, "# comment\n\nacme corp\n");
  assert.deepEqual(leakCheck(dir, deny), { status: "hit", file: join(dir, "s1", "source.md"), line: 2 });
  writeFileSync(deny, "nothing-matches\n");
  assert.deepEqual(leakCheck(dir, deny), { status: "clean" });
  writeFileSync(deny, "[unclosed\n");
  assert.throws(() => leakCheck(dir, deny), (error) => {
    assert.match(error.message, /invalid denylist expression in .+:1$/);
    assert.ok(!error.message.includes("[unclosed"));
    return true;
  });
});

test("evaluate passes when every fact is yes, quality holds and the ceiling holds", () => {
  const r = evaluate([record({ arm: "baseline", quality: { a: "mixed", b: "readable" } })], [record()]);
  assert.equal(r.status, "pass");
  assert.equal(r.exitCode, 0);
});

test("evaluate tolerates one lost fact; quality drops fail and missing judgments are incomplete", () => {
  const base = record({ arm: "baseline", facts: { f1: { a: "yes", b: "no" }, f2: { a: "yes", b: "yes" } } });
  assert.equal(evaluate([base], [record({ facts: { f1: { a: "no", b: "no" }, f2: { a: "yes", b: "yes" } } })]).exitCode, 0);
  const disputed = evaluate([base], [record({ facts: { f1: { a: "yes", b: "yes" }, f2: { a: "no", b: "yes" } } })]);
  assert.equal(disputed.exitCode, 0);
  assert.match(renderTable(disputed), /disputed: s1 f2 \(a: no\)/);
  assert.equal(evaluate([record({ arm: "baseline", quality: { a: "briefing", b: "briefing" } })], [record()]).exitCode, 1);
  assert.equal(evaluate([record({ arm: "baseline" })], [record({ quality: { a: "mixed", b: "briefing" } })]).exitCode, 1);
  assert.equal(evaluate([record({ arm: "baseline" })], [record({ words: WORD_CEILING })]).exitCode, 0);
  assert.equal(evaluate([record({ arm: "baseline" })], [record({ words: WORD_CEILING + 1 })]).exitCode, 1);
  const mixedBase = record({ quality: { a: "mixed", b: "mixed" } });
  assert.equal(evaluate([mixedBase], [record({ quality: { a: "mixed", b: "mixed" } })]).exitCode, 1);
  assert.equal(evaluate([mixedBase], [record({ quality: { a: "mixed", b: "readable" } })]).exitCode, 0);
  const missingFact = evaluate([base], [record({ facts: { f1: { a: "yes", b: "yes" } } })]);
  assert.equal(missingFact.exitCode, 2);
  assert.ok(missingFact.incomplete.includes("s1: fact f2 missing judgment for b"));
  const missingReviewer = evaluate([base], [record({ facts: { f1: { a: "yes" }, f2: { a: "yes", b: "yes" } } })]);
  assert.equal(missingReviewer.exitCode, 2);
  assert.ok(missingReviewer.incomplete.includes("s1: fact f1 missing judgment for b"));
  const extraFact = evaluate([base], [record({ facts: { ...base.facts, f3: { a: "yes", b: "yes" } } })]);
  assert.equal(extraFact.exitCode, 2);
  assert.ok(extraFact.incomplete.includes("s1: fact f3 missing judgment in baseline for b"));
});

test("evaluate is incomplete on a failed arm, an unparsed reviewer, or mismatched inputs", () => {
  assert.equal(evaluate([record({ arm: "baseline" })], [{ sample: "s1", arm: "candidate", error: "pi exited 1" }]).exitCode, 2);
  assert.equal(evaluate([record({ arm: "baseline" })], [record({ facts: { f1: { a: "unparsed", b: "yes" }, f2: { a: "yes", b: "yes" } }, quality: { a: "unparsed", b: "readable" } })]).exitCode, 2);
  assert.equal(evaluate([record({ arm: "baseline", input_sha256: "other" })], [record()]).exitCode, 2);
  assert.equal(evaluate([record({ arm: "baseline", reviewers: ["a", "c"] })], [record()]).exitCode, 2);
  assert.equal(evaluate([record({ arm: "baseline" }), record({ arm: "baseline", sample: "s2" })], [record()]).exitCode, 2);
});

test("evaluate returns compare exit codes 0/1/2 on fixture record dirs", () => {
  const a = tmp();
  const b = tmp();
  const candidateFile = join(b, "s1.json");
  writeFileSync(join(a, "s1.json"), JSON.stringify(record({ arm: "baseline" })));
  writeFileSync(candidateFile, JSON.stringify(record()));
  assert.equal(evaluate(loadRecords(a), loadRecords(b)).exitCode, 0);
  writeFileSync(candidateFile, JSON.stringify(record({ facts: { f1: { a: "no", b: "no" }, f2: { a: "yes", b: "yes" } } })));
  assert.equal(evaluate(loadRecords(a), loadRecords(b)).exitCode, 0);
  writeFileSync(candidateFile, JSON.stringify(record({ words: WORD_CEILING + 1 })));
  assert.equal(evaluate(loadRecords(a), loadRecords(b)).exitCode, 1);
  unlinkSync(candidateFile);
  assert.equal(evaluate(loadRecords(a), loadRecords(b)).exitCode, 2);
});

test("QUALITY is the five ordered labels", () => {
  assert.deepEqual(QUALITY, ["unreadable", "engineer-only", "mixed", "readable", "briefing"]);
});

const cli = (...args) => spawnSync(process.execPath, [fileURLToPath(new URL("./run.mjs", import.meta.url)), ...args], { encoding: "utf8" });

test("sample loading rejects empty facts and missing expected files before model calls", () => {
  const dir = tmp();
  writeFileSync(join(dir, "source.md"), "source");
  assert.throws(() => loadSample(dir), /ENOENT/);
  writeFileSync(join(dir, "expected.md"), "# no facts");
  assert.throws(() => loadSample(dir), { message: "expected.md has no facts" });
});

test("CRLF facts parse and zero-fact records are incomplete", () => {
  assert.equal(loadExpected("# x\r\n- f1: one\r\n").facts.length, 1);
  assert.equal(evaluate([record({ facts: {} })], [record({ facts: {} })]).exitCode, 2);
});

test("empty and unreadable record dirs are incomplete", () => {
  assert.equal(evaluate(loadRecords(tmp()), loadRecords(tmp())).exitCode, 2);
  assert.equal(cli("compare", join(tmp(), "missing"), tmp()).status, 2);
  const bad = tmp();
  writeFileSync(join(bad, "s.json"), "bad json");
  assert.equal(cli("compare", bad, tmp()).status, 2);
});

test("unknown run flags and stray positionals are usage errors", () => {
  for (const key of ["--typo", "stray"]) {
    const result = cli("run", key, "value");
    assert.equal(result.status, 64);
    assert.equal(result.stderr.trim(), `run: unknown flag ${key}`);
  }
});

test("missing persona path is a usage error", () => {
  const path = join(tmp(), "missing.md");
  const result = cli("run", "--arm", "candidate", "--candidate-model", "m", "--reviewers", "a,b", "--persona", path);
  assert.equal(result.status, 64);
  assert.equal(result.stderr.trim(), `run: persona not found: ${path}`);
});

test("flags without values and unknown sample selectors are usage errors", () => {
  assert.equal(cli("run", "--only").status, 64);
  assert.equal(cli("run", "--reviewers", "--persona", "x").status, 64);
  assert.equal(cli("run", "--arm", "baseline", "--candidate-model", "m", "--reviewers", "a,b", "--persona", "missing", "--only", "not-a-sample").status, 64);
});

test("invalid denylist reports original file line without pattern text", () => {
  const deny = join(tmp(), "deny.txt");
  writeFileSync(deny, "# comment\n\nok\n[private-pattern\n");
  assert.throws(() => leakCheck(tmp(), deny), (error) => {
    assert.equal(error.message, `invalid denylist expression in ${deny}:4`);
    assert.ok(!error.message.includes("[private-pattern"));
    return true;
  });
});

test("invalid denylist names its file and exits cleanly before model calls", () => {
  const deny = join(tmp(), "deny.txt");
  writeFileSync(deny, "[private-pattern\n");
  const result = spawnSync(process.execPath, [fileURLToPath(new URL("./run.mjs", import.meta.url)), "run", "--arm", "baseline", "--candidate-model", "m", "--reviewers", "a,b", "--persona", "missing"], {
    encoding: "utf8",
    env: { ...process.env, GAUNTLET_EVAL_DENYLIST: deny },
  });
  assert.equal(result.status, 65);
  assert.equal(result.stderr.trim(), `invalid denylist expression in ${deny}:1`);
  assert.ok(!result.stderr.includes("[private-pattern"));
});

test("word count excludes markdown-only tokens", () => {
  assert.equal(metrics("- one\n- two").words, 2);
});

test("unknown or missing baseline quality is incomplete", () => {
  assert.equal(evaluate([record({ quality: { a: "unknown", b: "readable" } })], [record()]).exitCode, 2);
});

test("empty reviewer list is a usage error before model calls", () => {
  const result = spawnSync(process.execPath, [fileURLToPath(new URL("./run.mjs", import.meta.url)), "run", "--arm", "candidate", "--candidate-model", "m", "--reviewers", ",", "--persona", "missing"], {
    encoding: "utf8",
    env: { ...process.env, GAUNTLET_EVAL_DENYLIST: "" },
  });
  assert.equal(result.status, 64);
  assert.match(result.stderr, /run: --reviewers is empty/);
});

test("two run-wide lost facts pass; three fail with every loss listed", () => {
  const base = [record({ arm: "baseline" }), record({ sample: "s2", arm: "baseline" })];
  const lost = { f1: { a: "no", b: "no" }, f2: { a: "yes", b: "yes" } };
  const two = evaluate(base, [record({ facts: lost }), record({ sample: "s2", facts: lost })]);
  assert.equal(two.exitCode, 0);
  assert.match(renderTable(two), /lost: s1 f1/);
  assert.match(renderTable(two), /lost: s2 f1/);
  assert.doesNotMatch(renderTable(two), /fail:/);
  const three = evaluate(base, [record({ facts: lost }), record({ sample: "s2", facts: { f1: { a: "no", b: "no" }, f2: { a: "no", b: "no" } } })]);
  assert.equal(three.exitCode, 1);
  assert.equal(renderTable(three).split("\n").filter((line) => line.startsWith("fail:")).length, 3);
  assert.doesNotMatch(renderTable(three), /^lost:/m);
  assert.match(renderTable(three), /fail: s2: fact f2 lost by every reviewer/);
});
