import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdtempSync, writeFileSync, mkdirSync, unlinkSync, realpathSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { loadPersona, parseReview, aggregate, metrics, leakCheck, evaluate, loadExpected, loadSample, loadRecords, renderTable, QUALITY, WORD_CAP, parseArgs, redactScratch } from "./run.mjs";
const root = new URL('./', import.meta.url);
test('redactScratch replaces the scratch cwd and its /private alias with <scratch>', () => {
  assert.equal(redactScratch("cwd /private/var/x/eval-scratch-ab/.worktrees/pr and /var/x/eval-scratch-ab/y", "/var/x/eval-scratch-ab"), "cwd <scratch>/.worktrees/pr and <scratch>/y");
});
test('loadPersona concatenates SKILL.md, decision-menu.md and an optional sync.md from a skill directory', () => {
  assert.equal(typeof loadPersona, 'function');
  const dir = mkdtempSync(join(tmpdir(), 'persona-'));
  mkdirSync(join(dir, 'reference'));
  writeFileSync(join(dir, 'SKILL.md'), 'skill\n');
  writeFileSync(join(dir, 'reference', 'decision-menu.md'), 'menu\n');
  assert.equal(loadPersona(dir), 'skill\n\n---\n\nmenu\n');
  writeFileSync(join(dir, 'reference', 'sync.md'), 'sync\n');
  assert.equal(loadPersona(dir), 'skill\n\n---\n\nmenu\n\n---\n\nsync\n');
  assert.throws(() => loadPersona(mkdtempSync(join(tmpdir(), 'empty-'))), /SKILL.md/);
});
test('seven frozen samples carry a digest, an arguments line, and unique expected facts', () => {
  const slugs = readdirSync(new URL('sample/', root)).sort();
  assert.deepEqual(slugs, ['conflict-free-sync', 'conflicting-file-sync', 'head-not-pushable', 'helper-unavailable', 'no-flag-unchanged', 'other-author-confirm', 'red-ci-no-autofix']);
  for (const slug of slugs) {
    const source = readFileSync(new URL(`sample/${slug}/source.md`, root), 'utf8');
    for (const heading of ['Digest', 'Arguments']) assert.ok(source.includes(`## ${heading}`), `${slug}: ${heading}`);
    if (slug === 'no-flag-unchanged') assert.ok(!source.includes('--rebase'));
    else assert.ok(source.includes('--rebase'), `${slug}: arguments carry --rebase`);
    const expectedUrl = new URL(`sample/${slug}/expected.md`, root);
    if (!existsSync(expectedUrl)) continue;
    const expected = readFileSync(expectedUrl, 'utf8');
    assert.ok(expected.startsWith(`# Expected facts: ${slug}\n`));
    const ids = [...expected.matchAll(/^- ([A-Za-z0-9_-]+): .+$/gm)].map(m => m[1]);
    assert.ok(ids.length >= 4 && ids.length <= 6);
    assert.equal(new Set(ids).size, ids.length);
  }
});
test('committed eval carries no private paths or consumer ticket ids', () => {
  const walk = url => readdirSync(url, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(new URL(`${e.name}/`, url)) : [new URL(e.name, url)]);
  const forbidden = new RegExp(['/' + 'Users/', '/' + 'var/folders', '\\bE-' + '[0-9]{3,}', 'PRC-' + '[0-9]', 'jjura' + 'szek', 'grid' + 'strong', 'customer' + '-ops', 'gs' + '_core', 'dash' + 'board', 'exca' + 'vation'].join('|'), 'i');
  for (const file of walk(root)) assert.equal(forbidden.test(readFileSync(file, 'utf8')), false, file.pathname);
});


test("parseArgs supports convention flags, thinking and repeated selectors", () => {
  assert.deepEqual(parseArgs(["--arm", "baseline", "--candidate-model", "m", "--thinking", "high", "--reviewers", "a,b", "--persona", "skill.md", "--only", "one", "--only", "two"]), {
    arm: "baseline", candidateModel: "m", thinking: "high", reviewers: "a,b", persona: "skill.md", only: ["one", "two"],
  });
  assert.throws(() => parseArgs(["--thinking"]), /requires a value/);
});

const tmp = () => realpathSync(mkdtempSync(join(tmpdir(), "eval-test-")));
const record = (over) => ({
  sample: "s1", arm: "candidate", candidate_model: "m", reviewers: ["a", "b"],
  persona_sha256: over?.arm === "baseline" ? "baseline-p" : "p", input_sha256: "i", repo_sha: "r", text: "t",
  words: 100, backtick_lines: 0, path_tokens: 0,
  facts: { f1: { a: "yes", b: "yes" }, f2: { a: "yes", b: "yes" } },
  quality: { a: "faithful", b: "exact" }, rationale: { a: "ok", b: "ok" },
  aggregate: { kept: 2, disputed: 0, lost: 0 }, ...over,
});

test("fixture records round-trip the convention shape with a persona hash", () => {
  const dir = tmp();
  writeFileSync(join(dir, "s1.json"), JSON.stringify(record()));
  const [loaded] = loadRecords(dir);
  assert.equal(loaded.arm, "candidate");
  assert.equal(loaded.persona_sha256, "p");
  assert.equal(loaded.text, "t");
  assert.equal(loaded.words, 100);
  assert.deepEqual(loaded.facts.f1, { a: "yes", b: "yes" });
  assert.deepEqual(loaded.quality, { a: "faithful", b: "exact" });
  assert.deepEqual(loaded.aggregate, aggregate(loaded.facts));
});

test("loadExpected parses ids, facts and the anonymized flag", () => {
  const parsed = loadExpected("anonymized: true\n# Expected facts: x\n\n- f1: one\n- f2: two\n");
  assert.deepEqual(parsed.facts, [{ id: "f1", text: "one" }, { id: "f2", text: "two" }]);
  assert.equal(parsed.anonymized, true);
  assert.equal(loadExpected("# x\n- f1: one\n").anonymized, false);
});

test("parseReview accepts exactly one fenced JSON object with every fact id", () => {
  const ok = parseReview('text\n```json\n{ "facts": { "f1": "yes", "f2": "no" }, "quality": "partial", "rationale": "r" }\n```\n', ["f1", "f2"]);
  assert.deepEqual(ok, { facts: { f1: "yes", f2: "no" }, quality: "partial", rationale: "r" });
  assert.equal(parseReview("no json here", ["f1"]), null);
  assert.equal(parseReview('```json\n{ "facts": { "f1": "yes" }, "quality": "great", "rationale": "r" }\n```', ["f1"]), null);
  assert.equal(parseReview('```json\n{ "facts": { "f1": "yes" }, "quality": "faithful", "rationale": "r" }\n```', ["f1", "f2"]), null);
  assert.equal(parseReview('```json\n{"a":1}\n```\n```json\n{ "facts": { "f1": "yes" }, "quality": "faithful", "rationale": "r" }\n```', ["f1"]), null);
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

test("evaluate passes when every fact is yes, quality holds and the cap holds", () => {
  const r = evaluate([record({ arm: "baseline", quality: { a: "partial", b: "faithful" } })], [record()]);
  assert.equal(r.status, "pass");
  assert.equal(r.exitCode, 0);
});

test("evaluate fails on a unanimously lost fact, a quality drop, or an over-cap briefing", () => {
  const base = record({ arm: "baseline", facts: { f1: { a: "yes", b: "no" }, f2: { a: "yes", b: "yes" } } });
  assert.equal(evaluate([base], [record({ facts: { f1: { a: "no", b: "no" }, f2: { a: "yes", b: "yes" } } })]).exitCode, 1);

  assert.equal(evaluate([record({ arm: "baseline", quality: { a: "exact", b: "exact" } })], [record()]).exitCode, 1);
  assert.equal(evaluate([record({ arm: "baseline" })], [record({ quality: { a: "partial", b: "exact" } })]).exitCode, 1);
  assert.equal(evaluate([record({ arm: "baseline" })], [record({ words: WORD_CAP + 1 })]).exitCode, 1);
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
  assert.equal(evaluate([record({ arm: "baseline" })], [record({ facts: { f1: { a: "unparsed", b: "yes" }, f2: { a: "yes", b: "yes" } }, quality: { a: "unparsed", b: "faithful" } })]).exitCode, 2);
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
  assert.equal(evaluate(loadRecords(a), loadRecords(b)).exitCode, 1);
  unlinkSync(candidateFile);
  assert.equal(evaluate(loadRecords(a), loadRecords(b)).exitCode, 2);
});

test("QUALITY is the four ordered labels", () => {
  assert.deepEqual(QUALITY, ["off-script", "partial", "faithful", "exact"]);
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
  assert.equal(evaluate([record({ quality: { a: "unknown", b: "faithful" } })], [record()]).exitCode, 2);
});


test("evaluate rejects wrong arms and identical persona hashes", () => {
  const base = record({ arm: "baseline" });
  for (const [b, c] of [[record(), record()], [base, record({ arm: "baseline" })], [base, record({ persona_sha256: base.persona_sha256 })]]) {
    assert.equal(evaluate([b], [c]).exitCode, 2);
  }
});

test("run rejects unknown flags and removed aliases, and supports help", () => {
  for (const flag of ["--thinkng", "--model", "--skill"]) {
    assert.throws(() => parseArgs([flag, "x"]), /unknown flag/);
    assert.equal(cli("run", flag, "x").status, 64);
  }
  const help = cli("run", "--help");
  assert.equal(help.status, 0);
  assert.match(help.stdout, /usage:/);
});

test("split fact votes pass and compare reports disputed", () => {
  const a = tmp();
  const b = tmp();
  const facts = { f1: { a: "yes", b: "no" }, f2: { a: "yes", b: "yes" } };
  writeFileSync(join(a, "s1.json"), JSON.stringify(record({ arm: "baseline" })));
  writeFileSync(join(b, "s1.json"), JSON.stringify(record({ facts, aggregate: aggregate(facts) })));
  const result = evaluate(loadRecords(a), loadRecords(b));
  assert.equal(result.exitCode, 0);
  assert.match(renderTable(result), /disputed: s1 f1/);
  const compared = cli("compare", a, b);
  assert.equal(compared.status, 0);
  assert.match(compared.stdout, /disputed: s1 f1/);
});

test("one faithful reviewer suffices without per-reviewer regression", () => {
  const quality = { a: "faithful", b: "partial" };
  assert.equal(evaluate([record({ arm: "baseline", quality })], [record({ quality })]).exitCode, 0);
  assert.equal(evaluate([record({ arm: "baseline", quality: { a: "partial", b: "partial" } })], [record({ quality: { a: "partial", b: "partial" } })]).exitCode, 1);
});

test("unanimous no exceeds zero run-level loss tolerance", () => {
  const facts = { f1: { a: "no", b: "no" }, f2: { a: "yes", b: "yes" } };
  const result = evaluate([record({ arm: "baseline" })], [record({ facts, aggregate: aggregate(facts) })]);
  assert.equal(result.exitCode, 1);
  assert.match(renderTable(result), /fact f1 lost by every reviewer/);
});
