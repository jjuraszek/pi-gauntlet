import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const script = join(root, "scripts/commit-subject-lint.mjs");
const legacyPath = "skills/gauntlet-resume/reference/reconstruction.md";
const begin = "<!-- legacy-commit-labels:begin -->";
const end = "<!-- legacy-commit-labels:end -->";
const labels = ["loop: row 2 done", "amend: change scope", "grant: allow amendments", "plan: write tasks", "resume: repair citations", "fix: <slug>"];

function fixture(files) {
  const dir = mkdtempSync(join(tmpdir(), "commit-subject-lint-"));
  for (const [file, text] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, file)), { recursive: true });
    writeFileSync(join(dir, file), text);
  }
  return dir;
}

function lint(cwd) {
  const result = spawnSync("timeout", ["-k", "30", "20", process.execPath, script], { cwd, encoding: "utf8" });
  assert.ifError(result.error);
  assert.notEqual(result.status, null, result.stderr);
  return result;
}

for (const label of labels) {
  test(`CLI rejects a subject starting with ${label}`, () => {
    const file = "skills/example/SKILL.md";
    const text = `# Example\n\nCommit with subject \`${label}\`.\n`;
    const result = lint(fixture({ [file]: text }));
    assert.equal(result.status, 1);
    assert.ok(result.stderr.includes(`${file}:3:`), result.stderr);
    assert.ok(result.stderr.includes(label), result.stderr);
  });
}

test("subject spellings are detected without treating ordinary prose as subjects", () => {
  const prescriptions = [
    "loop: row 2 done",
    "Commit with subject loop: row 2 done.",
    "Commit with subject\nloop: row 2 done.",
    'git commit -m "loop: row 2 done"',
    "git commit -m 'loop: row 2 done'",
    "git commit -m loop: row-2-done",
    "Use `loop: row 2 done`.",
    "Subject templates:\n- loop: row 2 done",
    "| Subject |\n| loop: row 2 done |",
    "**Subject:** loop: row 2 done",
    "```text\nSubject\nloop: row 2 done\n```",
  ];
  const files = Object.fromEntries(prescriptions.map((text, i) => [`skills/example/reference/${i}.md`, text]));
  const result = lint(fixture(files));
  assert.equal(result.status, 1);
  for (const file of Object.keys(files)) assert.ok(result.stderr.includes(`${file}:`), result.stderr);

  const prose = [
    "Runs in the main\nloop: tracker state is local.",
    "Write a plan: you do the recon.",
    "Standing grant: reply with consent.",
    "Take a named amend: print the decision.",
    "Record `whole-diff minors fix: <full SHA>`.",
  ].join("\n\n");
  const clean = lint(fixture({ "skills/example/SKILL.md": prose }));
  assert.equal(clean.status, 0, clean.stderr);
});

test("reason exemptions apply to the reason value, not every subject on its line", () => {
  const allowed = [
    'phase_tracker({ action: "skip", reason: "resume: <spec path>" })',
    "`skip plan` with reason `resume: <spec> (loop engine)`.",
    "Skip with reason\n`resume: <spec path>`.",
    "`skip brainstorm resume: <spec path>`",
    "  ⊘ brainstorm (resume: <spec path>)",
    '`R = resume: <brief file>` and `S = resume: <spec path>` are skip reasons.',
  ].join("\n\n");
  const file = "skills/example/SKILL.md";
  const clean = lint(fixture({ [file]: allowed }));
  assert.equal(clean.status, 0, clean.stderr);
  const bad = lint(fixture({ [file]: 'Use reason "resume: <spec>" then commit with subject "resume: repair plan".' }));
  assert.equal(bad.status, 1);
  assert.ok(bad.stderr.includes(`${file}:1:`), bad.stderr);
  const misleading = lint(fixture({ [file]: 'For this reason, commit with subject "loop: row 2 done".' }));
  assert.equal(misleading.status, 1);
});

test("only a complete marked block in reconstruction exempts legacy labels", () => {
  const legacy = `${begin}\n${labels.map((label) => `Decode \`${label}\`.`).join("\n")}\n${end}`;
  const clean = lint(fixture({ [legacyPath]: legacy }));
  assert.equal(clean.status, 0, clean.stderr);
  for (const [name, file, text, line] of [
    ["before", legacyPath, `Commit with subject \`loop: row 2 done\`.\n${legacy}`, 1],
    ["after", legacyPath, `${legacy}\nCommit with subject \`loop: row 2 done\`.`, 9],
    ["other skill", "skills/example/reference/reconstruction.md", legacy, 2],
    ["persona", "agents/example.md", legacy, 2],
    ["unclosed", legacyPath, `${begin}\nCommit with subject \`loop: row 2 done\`.`, 2],
    ["duplicate blocks", legacyPath, `${legacy}\n${legacy}`, 2],
  ]) {
    const bad = lint(fixture({ [file]: text }));
    assert.equal(bad.status, 1, name);
    assert.ok(bad.stderr.includes(`${file}:${line}:`), `${name}: ${bad.stderr}`);
  }
});

test("scope is recursive skills Markdown and top-level persona Markdown only", () => {
  const bad = 'Commit with subject "plan: write tasks".\n';
  const files = {
    "skills/example/reference/deep/contract.md": bad,
    "agents/example.md": bad,
    "agents/reference/example.md": bad,
    "skills/example/sample.txt": bad,
    "eval/example/samples/input.md": bad,
    "doc/specs/example.md": bad,
    "README.md": bad,
  };
  const result = lint(fixture(files));
  assert.equal(result.status, 1);
  const diagnostics = result.stderr.trim().split("\n");
  assert.equal(diagnostics.length, 2, result.stderr);
  assert.ok(diagnostics.some((line) => line.startsWith("skills/example/reference/deep/contract.md:1:")));
  assert.ok(diagnostics.some((line) => line.startsWith("agents/example.md:1:")));
});

test("CLI accepts the repository's current skills and personas", () => {
  const result = lint(root);
  assert.equal(result.status, 0, result.stderr);
});

test("CI runs the lint and its fixtures and reports either failure in isolation", () => {
  const ci = readFileSync(join(root, "scripts/ci.mjs"), "utf8");
  const block = ci.match(/try \{\n  execFileSync\(process\.execPath, \[R\("scripts\/commit-subject-lint\.mjs"\)\][\s\S]*?\n\}(?=\n)/)?.[0];
  assert.ok(block, "CI must invoke the commit-subject lint");
  for (const failedCall of [0, 1, 2]) {
    const calls = [];
    const failures = [];
    const successes = [];
    runInNewContext(block, {
      process: { execPath: process.execPath },
      root,
      R: (file) => join(root, file),
      execFileSync: (exe, args, options) => {
        assert.equal(exe, process.execPath);
        calls.push(Array.from(args));
        if (calls.length === 1) assert.equal(options.cwd, root);
        if (calls.length === failedCall) throw Object.assign(new Error("fixture failure"), { stderr: "fixture failure" });
      },
      fail: (message) => failures.push(message),
      ok: (message) => successes.push(message),
    });
    assert.deepEqual(calls[0], [script]);
    if (failedCall !== 1) assert.deepEqual(calls[1], ["--test", join(root, "scripts/commit-subject-lint.test.mjs")]);
    assert.equal(failures.length, failedCall ? 1 : 0);
    assert.equal(successes.length, failedCall ? 0 : 1);
    if (failedCall) assert.match(failures[0], /fixture failure/);
  }
});
