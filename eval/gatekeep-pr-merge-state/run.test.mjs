import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { loadPersona, PERSONA_FILES, PROMPT_INSTRUCTION, parseArgs, parseReview, aggregate, evaluate, loadExpected, loadRecords, QUALITY, WORD_CAP, READABLE_THRESHOLD } from "./run.mjs";

const root = new URL("./", import.meta.url);
const SLUGS = ["bound-viewer-green-ci", "exempt-viewer-status-pending", "flip-after-update-branch", "live-checkrun-pending", "same-head-flip", "unknown-after-repoll"];

test("six frozen samples carry a digest, a reviewer output, and 4-6 unique expected facts", () => {
  const slugs = readdirSync(new URL("sample/", root)).sort();
  assert.deepEqual(slugs, SLUGS);
  for (const slug of slugs) {
    assert.deepEqual(readdirSync(new URL(`sample/${slug}/`, root)).sort(), ["expected.md", "source.md"]);
    const source = readFileSync(new URL(`sample/${slug}/source.md`, root), "utf8");
    const expected = readFileSync(new URL(`sample/${slug}/expected.md`, root), "utf8");
    assert.ok(source.includes("## Digest"));
    assert.ok(source.includes("## Step 4 reviewer output"));
    assert.match(source, /merge_state_status: (BLOCKED|BEHIND|UNKNOWN|UNSTABLE)/);
    assert.match(source, /kind: (check_run|status_context)/);
    assert.ok(expected.startsWith(`anonymized: true\n# Expected facts: ${slug}\n`));
    const ids = loadExpected(expected).facts.map((f) => f.id);
    assert.ok(ids.length >= 4 && ids.length <= 6, slug);
    assert.equal(new Set(ids).size, ids.length);
  }
  for (const slug of ["flip-after-update-branch", "same-head-flip"]) assert.match(readFileSync(new URL(`sample/${slug}/source.md`, root), "utf8"), /^## After /m);
});

test("committed driver, prompt, and samples name no provider, model, private path, or consumer token", () => {
  const walk = (url) => readdirSync(url, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(new URL(`${e.name}/`, url)) : [new URL(e.name, url)]));
  const forbidden = new RegExp(["/" + "Users/", "/" + "var/folders", "jjura" + "szek", "grid" + "strong", "devs-" + "approval", "dash" + "board", "anthropic" + "/", "github-copilot" + "/", "openai" + "/", "claude" + "-", "gpt" + "-"].join("|"), "i");
  const files = [...walk(new URL("sample/", root)), new URL("run.mjs", root), new URL("run.test.mjs", root), new URL("reviewer-prompt.md", root)];
  for (const file of files) assert.equal(forbidden.test(readFileSync(file, "utf8")), false, file.pathname);
});

test("loadPersona concatenates the five skill files in order and rejects a missing one", () => {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), "persona-")));
  mkdirSync(join(dir, "reference"));
  for (const f of PERSONA_FILES) writeFileSync(join(dir, f), `# ${f}\n`);
  assert.equal(loadPersona(dir), PERSONA_FILES.map((f) => `# ${f}\n`).join("\n"));
  assert.deepEqual(PERSONA_FILES, ["verification-brief.md", "reference/findings.md", "reference/decision-menu.md", "reference/post-selection-loop.md", "reference/report.md"]);
  const bad = realpathSync(mkdtempSync(join(tmpdir(), "persona-")));
  assert.throws(() => loadPersona(bad), /verification-brief\.md/);
});

test("the candidate prompt starts at Section B resolution and forbids tools", () => {
  assert.match(PROMPT_INSTRUCTION, /Resolve Section B's Evidence resolution table/);
  assert.match(PROMPT_INSTRUCTION, /no tools, no fetches/);
  assert.match(PROMPT_INSTRUCTION, /pre-menu state/);
});

test("quality scale, threshold and cap are the target's", () => {
  assert.deepEqual(QUALITY, ["unreadable", "cluttered", "readable", "crisp"]);
  assert.equal(READABLE_THRESHOLD, "readable");
  assert.equal(WORD_CAP, 600);
});

test("parseArgs supports the convention flags with --persona as a directory", () => {
  assert.deepEqual(parseArgs(["--arm", "baseline", "--candidate-model", "m", "--reviewers", "a,b", "--persona", "skills/x", "--thinking", "high", "--only", "s1"]), {
    arm: "baseline", candidateModel: "m", reviewers: "a,b", persona: "skills/x", thinking: "high", only: ["s1"],
  });
  assert.throws(() => parseArgs(["--skill-dir", "x"]), /unknown flag/);
});

test("parseReview accepts one fenced JSON object with every fact id and a known label", () => {
  const ok = parseReview('```json\n{"facts":{"f1":"yes","f2":"no"},"quality":"crisp","rationale":"r"}\n```', ["f1", "f2"]);
  assert.deepEqual(ok, { facts: { f1: "yes", f2: "no" }, quality: "crisp", rationale: "r" });
  assert.equal(parseReview('```json\n{"facts":{"f1":"yes"},"quality":"briefing","rationale":"r"}\n```', ["f1"]), null);
  assert.deepEqual(aggregate({ f1: { a: "yes", b: "yes" }, f2: { a: "yes", b: "no" }, f3: { a: "no", b: "no" } }), { kept: 1, disputed: 1, lost: 1 });
});

const tmp = () => realpathSync(mkdtempSync(join(tmpdir(), "eval-test-")));
const record = (over) => ({
  sample: "s1", arm: "candidate", candidate_model: "m", reviewers: ["a", "b"],
  persona_sha256: over?.arm === "baseline" ? "baseline-p" : "p", input_sha256: "i", repo_sha: "r", text: "t",
  words: 100, backtick_lines: 0, path_tokens: 0,
  facts: { f1: { a: "yes", b: "yes" }, f2: { a: "yes", b: "yes" } },
  quality: { a: "readable", b: "crisp" }, rationale: { a: "ok", b: "ok" },
  aggregate: { kept: 2, disputed: 0, lost: 0 }, ...over,
});

test("evaluate passes, fails on a unanimous loss or quality drop, and is incomplete on a failed arm", () => {
  assert.equal(evaluate([record({ arm: "baseline" })], [record()]).status, "pass");
  assert.equal(evaluate([record({ arm: "baseline" })], [record({ facts: { f1: { a: "no", b: "no" }, f2: { a: "yes", b: "yes" } } })]).status, "fail");
  assert.equal(evaluate([record({ arm: "baseline" })], [record({ quality: { a: "cluttered", b: "crisp" } })]).status, "fail");
  assert.equal(evaluate([record({ arm: "baseline" })], [record({ words: 601 })]).status, "fail");
  assert.equal(evaluate([record({ arm: "baseline" })], [record({ error: "pi failed" })]).status, "incomplete");
});

test("compare exits 0/1/2 on fixture record dirs and --help prints usage", () => {
  const run = (...args) => spawnSync(process.execPath, [fileURLToPath(new URL("run.mjs", root)), ...args], { encoding: "utf8" });
  const mk = (b, c) => { const base = tmp(), cand = tmp(); writeFileSync(join(base, "s1.json"), JSON.stringify(b)); writeFileSync(join(cand, "s1.json"), JSON.stringify(c)); return [base, cand]; };
  assert.equal(run("compare", ...mk(record({ arm: "baseline" }), record())).status, 0);
  assert.equal(run("compare", ...mk(record({ arm: "baseline" }), record({ words: 601 }))).status, 1);
  assert.equal(run("compare", ...mk(record({ arm: "baseline" }), record({ error: "x" }))).status, 2);
  const help = run("--help");
  assert.equal(help.status, 0);
  assert.match(help.stdout, /--persona <skill-dir>/);
  assert.deepEqual(loadRecords(mk(record({ arm: "baseline" }), record())[0]).length, 1);
});
