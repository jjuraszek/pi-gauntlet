import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { UsageError, aggregate, buildReviewerPrompt, compare, main, materialize, median, parseArgs, parseCase, parseExpected, parseReview, runSample } from "./run.mjs";

function skillDir() {
  const dir = mkdtempSync(join(tmpdir(), "forge-eval-skill-"));
  writeFileSync(join(dir, "SKILL.md"), "---\nname: forge-skill\ndescription: t\n---\n# x\n");
  execFileSync("git", ["init", "-q"], { cwd: dir });
  execFileSync("git", ["-c", "user.email=t@t", "-c", "user.name=t", "add", "-A"], { cwd: dir });
  execFileSync("git", ["-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "-m", "s"], { cwd: dir });
  return dir;
}
const base = (dir) => ["--skill-dir", dir, "--candidate-model", "m-cand", "--reviewers", "m1,m2"];

test("parseArgs: happy path and thinking default", () => {
  const o = parseArgs(base(skillDir()));
  assert.equal(o.candidateModel, "m-cand");
  assert.deepEqual(o.reviewers, ["m1", "m2"]);
  assert.equal(o.thinking, "medium");
});
test("parseArgs: missing flags, duplicate reviewers, missing SKILL.md", () => {
  const dir = skillDir();
  assert.throws(() => parseArgs(["--skill-dir", dir, "--reviewers", "m1,m2"]), UsageError);
  assert.throws(() => parseArgs(["--skill-dir", dir, "--candidate-model", "c"]), UsageError);
  assert.throws(() => parseArgs(["--candidate-model", "c", "--reviewers", "m1,m2"]), UsageError);
  assert.throws(() => parseArgs(["--skill-dir", dir, "--candidate-model", "c", "--reviewers", "m1,m1"]), /two distinct/);
  assert.throws(() => parseArgs(["--skill-dir", mkdtempSync(join(tmpdir(), "nosk-")), "--candidate-model", "c", "--reviewers", "m1,m2"]), /SKILL.md is absent/);
});
test("parseCase: two files (one nested) and the request; fences of 3 and 4 backticks", () => {
  const text = ["```file SKILL.md", "line one", "```", "````file reference/checks.md", "has ```inner``` fence", "```", "still inside", "````", "```request", "Tighten rule two.", "```", ""].join("\n");
  const c = parseCase(text);
  assert.deepEqual(c.files.map((f) => f.path), ["SKILL.md", "reference/checks.md"]);
  assert.equal(c.files[0].text, "line one\n");
  assert.equal(c.files[1].text, "has ```inner``` fence\n```\nstill inside\n");
  assert.equal(c.request, "Tighten rule two.");
  assert.throws(() => parseCase("```request\nx\n```\n"), /file <path>/);
});
test("materialize: two files including a nested path are written with exact text", () => {
  const root = mkdtempSync(join(tmpdir(), "forge-eval-materialize-"));
  const { files } = parseCase("```file SKILL.md\nline one\n```\n```file reference/checks.md\ncheck one\ncheck two\n```\n```request\nTighten the checks.\n```\n");
  materialize(root, files);
  assert.equal(readFileSync(join(root, "SKILL.md"), "utf8"), "line one\n");
  assert.equal(readFileSync(join(root, "reference/checks.md"), "utf8"), "check one\ncheck two\n");
});
test("parseExpected: bullets only", () => {
  assert.deepEqual(parseExpected("# facts\n\n- a\n- b\nnot a fact\n"), ["a", "b"]);
  assert.throws(() => parseExpected("nothing\n"), /no `- ` fact bullets/);
});
test("parseReview: valid, one vote short, unknown level, no JSON block", () => {
  const ok = parseReview('text\n```json\n{ "votes": ["yes","no"], "level": "clean", "rationale": "r" }\n```\n', 2);
  assert.deepEqual(ok, { votes: ["yes", "no"], level: "clean", rationale: "r" });
  assert.throws(() => parseReview('```json\n{ "votes": ["yes"], "level": "clean", "rationale": "r" }\n```', 2), /votes must have 2/);
  assert.throws(() => parseReview('```json\n{ "votes": ["yes","no"], "level": "great", "rationale": "r" }\n```', 2), /level must be one of/);
  assert.throws(() => parseReview("I think it is fine.", 2), /no parseable JSON/);
});
test("parseReview: fence-less valid JSON is rejected", () => {
  assert.throws(() => parseReview('{ "votes": ["yes"], "level": "clean", "rationale": "r" }', 1), /no parseable JSON/);
});
test("aggregate: kept / disputed / lost, worker-failed, reviewer-invalid", () => {
  const facts = ["f1", "f2", "f3"];
  const r1 = { status: "ok", votes: ["yes", "yes", "no"] };
  const r2 = { status: "ok", votes: ["yes", "no", "no"] };
  assert.deepEqual(aggregate(facts, [r1, r2], "ok"), { status: "ok", facts: [{ text: "f1", status: "kept" }, { text: "f2", status: "disputed" }, { text: "f3", status: "lost" }] });
  assert.deepEqual(aggregate(facts, [], "failed").facts.map((f) => f.status), ["lost", "lost", "lost"]);
  assert.equal(aggregate(facts, [], "failed").status, "worker-failed");
  const inv = aggregate(facts, [r1, { status: "reviewer-invalid" }], "ok");
  assert.equal(inv.status, "reviewer-invalid");
  assert.deepEqual(inv.facts.map((f) => f.status), ["disputed", "disputed", "disputed"]);
});
test("buildReviewerPrompt: request, facts, diff, every file with its line count", () => {
  const p = buildReviewerPrompt("TEMPLATE", { facts: ["a", "b"], request: "REQ", diff: "DIFF", files: [{ path: "SKILL.md", lines: 2, text: "x\ny\n" }, { path: "reference/c.md", lines: 1, text: "z\n" }] });
  for (const needle of ["TEMPLATE", "1. a", "2. b", "REQ", "DIFF", "SKILL.md (2 lines)", "reference/c.md (1 lines)", "x\ny", "z"]) assert.ok(p.includes(needle), needle);
});
test("runSample: added untracked file lands in diff and files[]; reviewers get request and files; record shape", () => {
  const dir = skillDir();
  const sampleDir = mkdtempSync(join(tmpdir(), "forge-eval-sample-"));
  writeFileSync(join(sampleDir, "case.md"), "```file SKILL.md\nold\n```\n```request\nAdd a reference file.\n```\n");
  writeFileSync(join(sampleDir, "expected.md"), "- change present\n- no nuance clause\n");
  const seen = [];
  const pi = (args, { cwd }) => {
    seen.push(args);
    if (args.includes("--skill")) {
      mkdirSync(join(cwd, "reference"), { recursive: true });
      writeFileSync(join(cwd, "reference/new.md"), "new\n");
      writeFileSync(join(cwd, "SKILL.md"), "old\nread reference/new.md now\n");
      return { status: "ok", stdout: "", stderr: "" };
    }
    return { status: "ok", stdout: '```json\n{ "votes": ["yes","no"], "level": "clean", "rationale": "r" }\n```', stderr: "" };
  };
  const opts = parseArgs(base(dir));
  const rec = runSample({ slug: "s", sampleDir, opts, identity: { skillSha: "abc", skillHash: "h" }, reviewerPrompt: "TPL", pi });
  assert.equal(rec.status, "ok");
  assert.ok(rec.diff.includes("+++ b/reference/new.md"));
  assert.deepEqual(rec.files, [{ path: "SKILL.md", lines: 2 }, { path: "reference/new.md", lines: 1 }]);
  assert.equal(seen[0][0], "-p");
  assert.ok(seen[0].at(-1).startsWith("/skill:forge-skill Add a reference file."));
  assert.ok(seen[0].at(-1).endsWith("\n\nFiles in this checkout: SKILL.md"));
  assert.ok(seen[1].at(-1).includes("Add a reference file."));
  assert.ok(seen[1].at(-1).includes("read reference/new.md now"));
  assert.deepEqual(rec.facts.map((f) => f.status), ["kept", "lost"]);
  for (const k of ["sample", "scratch", "skillDir", "skillSha", "skillHash", "taskHash", "reviewerPromptHash", "candidateModel", "thinking", "reviewers", "diff", "files", "wallMs", "status", "facts"]) assert.ok(k in rec, k);
  assert.equal(rec.reviewers.length, 2);
  assert.equal(rec.reviewers[0].model, "m1");
});
test("runSample: empty diff is worker-failed; bad reviewer JSON retried once then reviewer-invalid", () => {
  const dir = skillDir();
  const sampleDir = mkdtempSync(join(tmpdir(), "forge-eval-sample-"));
  writeFileSync(join(sampleDir, "case.md"), "```file SKILL.md\nold\n```\n```request\nDo it.\n```\n");
  writeFileSync(join(sampleDir, "expected.md"), "- f\n");
  const opts = parseArgs(base(dir));
  const noop = () => ({ status: "ok", stdout: "", stderr: "" });
  const failed = runSample({ slug: "s", sampleDir, opts, identity: { skillSha: "a", skillHash: "h" }, reviewerPrompt: "T", pi: noop });
  assert.equal(failed.status, "worker-failed");
  assert.deepEqual(failed.facts.map((f) => f.status), ["lost"]);
  let reviewerCalls = 0;
  const badReviewer = (args, { cwd }) => {
    if (args.includes("--skill")) { writeFileSync(join(cwd, "SKILL.md"), "new\n"); return { status: "ok", stdout: "", stderr: "" }; }
    reviewerCalls++;
    if (reviewerCalls % 2 === 0) assert.ok(args.at(-1).includes("Your previous reply was rejected: no parseable JSON block"));
    return { status: "ok", stdout: '{ "votes": ["yes"], "level": "clean", "rationale": "r" }', stderr: "" };
  };
  const invalid = runSample({ slug: "s", sampleDir, opts, identity: { skillSha: "a", skillHash: "h" }, reviewerPrompt: "T", pi: badReviewer });
  assert.equal(invalid.status, "reviewer-invalid");
  for (const reviewer of invalid.reviewers) assert.equal(reviewer.status, "reviewer-invalid");
  assert.equal(reviewerCalls, 4);
  assert.deepEqual(invalid.facts.map((f) => f.status), ["disputed"]);
});
function agg(over) {
  return { skillHash: "h", skillSha: "s", reviewerPromptHash: "p", candidateModel: "c", thinking: "medium", reviewers: ["m1", "m2"], taskHashes: { a: "ta" }, totals: { kept: 1, disputed: 0, lost: 1 }, samples: [{ sample: "a", status: "ok", levels: ["clean", "clean"], facts: [{ text: "f1", status: "kept" }, { text: "f2", status: "lost" }] }], ...over };
}
test("compare: no movement exits 0; kept->lost exits 1; one lost one gained exits 1", () => {
  assert.equal(compare(agg(), agg()).exit, 0);
  const regressed = agg({ samples: [{ sample: "a", status: "ok", facts: [{ text: "f1", status: "lost" }, { text: "f2", status: "lost" }] }] });
  assert.equal(compare(agg(), regressed).exit, 1);
  const swapped = agg({ samples: [{ sample: "a", status: "ok", facts: [{ text: "f1", status: "lost" }, { text: "f2", status: "kept" }] }] });
  const r = compare(agg(), swapped);
  assert.equal(r.exit, 1);
  assert.ok(r.lines.some((l) => l.startsWith("regression: a:")));
});
test("compare: refuses (exit 2) on taskHash, reviewerPromptHash, model, thinking, reviewers, dirty, non-ok sample", () => {
  for (const over of [{ taskHashes: { a: "other" } }, { reviewerPromptHash: "q" }, { candidateModel: "d" }, { thinking: "high" }, { reviewers: ["m1", "m3"] }, { skillSha: "s-dirty" }, { samples: [{ sample: "a", status: "worker-failed", facts: [{ text: "f1", status: "lost" }, { text: "f2", status: "lost" }] }] }]) {
    const r = compare(agg(), agg(over));
    assert.equal(r.exit, 2, JSON.stringify(over));
    assert.ok(r.lines[0].startsWith("refused:"));
  }
});

test("median: majority status per fact, disputed on three-way split, levels concatenated", () => {
  const mk = (s1, s2) => agg({ samples: [{ sample: "a", status: "ok", levels: ["clean", "clean"], facts: [{ text: "f1", status: s1 }, { text: "f2", status: s2 }] }] });
  const m = median([mk("kept", "kept"), mk("kept", "lost"), mk("lost", "disputed")]);
  assert.equal(m.exit, 0);
  assert.deepEqual(m.aggregate.samples[0].facts, [{ text: "f1", status: "kept" }, { text: "f2", status: "disputed" }]);
  assert.deepEqual(m.aggregate.samples[0].counts, { kept: 1, disputed: 1, lost: 0 });
  assert.equal(m.aggregate.samples[0].levels.length, 6);
  assert.deepEqual(m.aggregate.totals, { kept: 1, disputed: 1, lost: 0 });
  assert.deepEqual(m.aggregate.runIds, [undefined, undefined, undefined]);
  assert.equal(m.aggregate.skillSha, "s");
});

test("main: median with three inputs writes beside the first input and prints its path", (t) => {
  const dir = mkdtempSync(join(tmpdir(), "forge-eval-median-"));
  const [a, b, c] = ["a.json", "b.json", "c.json"].map((name) => join(dir, name));
  for (const path of [a, b, c]) writeFileSync(path, JSON.stringify(agg()));
  const lines = [];
  t.mock.method(console, "log", (line) => lines.push(line));
  assert.equal(main(["median", a, b, c]), 0);
  const out = join(dir, "median.json");
  assert.ok(existsSync(out));
  assert.deepEqual(JSON.parse(readFileSync(out, "utf8")).totals, agg().totals);
  assert.ok(lines[0].startsWith("| sample |"));
  assert.equal(lines.at(-1), `median: ${out}`);
});

test("median: refuses (exit 2) on identity mismatch or non-ok sample", () => {
  for (const over of [
    { skillSha: "t" }, { skillHash: "x" }, { taskHashes: { a: "other" } }, { reviewerPromptHash: "q" },
    { candidateModel: "d" }, { thinking: "high" }, { reviewers: ["m1", "m3"] },
    { samples: [{ sample: "a", status: "worker-failed", facts: [{ text: "f1", status: "lost" }, { text: "f2", status: "lost" }] }] },
  ]) {
    const r = median([agg(), agg(), agg(over)]);
    assert.equal(r.exit, 2, JSON.stringify(over));
    assert.ok(r.lines[0].startsWith("refused:"));
  }
  for (const inputs of [[], [agg(), agg()]]) assert.equal(median(inputs).exit, 2);
});
