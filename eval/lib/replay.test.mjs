import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import * as replay from "./replay.mjs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { sliceText, stripFrontmatter, assemble, parseCase, textArgs, editArgs, prepareFixture, captureEdit, inputSha } from "./replay.mjs";

import { parseExpected, runMechanical } from "./checks.mjs";

test("chase-bug prose samples preserve slices and reject label leaks", () => {
  const read = replay.treeReader(new URL("../../", import.meta.url).pathname);
  const target = JSON.parse(read("eval/chase-bug/target.json"));
  assert.deepEqual(target.skillFiles, [{ path: "skills/chase-bug/SKILL.md", slice: "### 5. Response to origin (human gate 2)", sliceTo: "## Quick Reference" }]);
  for (const sample of ["prose-verdict-above-menu", "returned-ticket-link"]) {
    const { bundle } = parseCase(read(`eval/chase-bug/samples/${sample}/case.md`));
    assert.deepEqual(bundle, sample === "prose-verdict-above-menu" ? ["skills/brainstorming/reference/menu-layout.md", "skills/chase-bug/SKILL.md"] : ["skills/chase-bug/SKILL.md"]);
    const result = assemble(target, read, bundle);
    assert.ok(result.includes(stripFrontmatter(read("skills/chase-bug/SKILL.md")))) ;
    assert.ok(result.includes("**Verdict shape.**"));
    const { facts } = parseExpected(read(`eval/chase-bug/samples/${sample}/expected.md`));
    for (const id of ["no-fence", "no-labels", "three-sentences", "under-80-words", "plain-reader", ...(sample === "prose-verdict-above-menu" ? ["menu-intact", "draft-asks-reporter"] : ["returned-reference", "no-new-creation"])]) assert.ok(facts.some((f) => f.id === id), id);
    const labels = facts.filter((f) => f.id === "no-labels");
    assert.equal(labels.length, 1);
    for (const label of ["Fault story:", "Proof:", "Symptom:", "Verdict:", "Evidence:", "Next step:"]) {
      for (const rendered of [label, `**${label}**`]) {
        for (const prefix of ["", "Opening the page fails. ", "Opening the page fails.\n\n"]) assert.equal(runMechanical(labels, `${prefix}${rendered} details`)["no-labels"], "fails");
      }
    }
    assert.equal(runMechanical(labels, "Opening the page fails.\nPick one:\n1. Fix it\neligible - all predicates pass")["no-labels"], "holds");
    const fence = facts.find((f) => f.id === "no-fence");
    if (sample === "returned-ticket-link") {
      assert.equal(runMechanical([fence], "```text\nstory\n```")["no-fence"], "fails");
      assert.equal(runMechanical([fence], "The matcher in `src/router.ts:88` fails.")["no-fence"], "holds");
    } else assert.equal(fence.kind, "judged");
  }
});

const auditSamples = ["batch-repair", "audit-repo-fit", "scenario-best-effort", "audit-quiet-noop", "audit-byte-lock", "audit-dispatch", "audit-grounding", "obsolete-premise-contradicted", "obsolete-create-drop-idea", "quiet-audit-no-close-row", "sibling-not-found-hint", "sibling-primary-anchor"];
const auditPath = "skills/shape-ticket/reference/repo-audit.md";
const shapeTicketFiles = [
  { path: "skills/shape-ticket/SKILL.md", slice: "### 4 - Draft", sliceTo: "## Roast" },
  { path: "skills/brainstorming/reference/menu-layout.md" },
  { path: "skills/shape-ticket/SKILL.md", slice: "## Evidence gate", sliceTo: "## Ticket wording" },
];

test("shape-ticket baseline preserves slices and excludes only audit from all existing cases", () => {
  const root = new URL("../../", import.meta.url).pathname;
  const read = replay.treeReader(root);
  const target = JSON.parse(read("eval/shape-ticket/target.json"));
  assert.deepEqual(target.skillFiles, [...shapeTicketFiles, { path: auditPath }]);
  const samples = readdirSync(join(root, "eval/shape-ticket/samples")).filter((name) => !auditSamples.includes(name));
  assert.equal(samples.length, 13);
  for (const sample of samples) {
    const raw = read(`eval/shape-ticket/samples/${sample}/case.md`);
    assert.equal(raw.split("\n")[0], `bundle-: ${auditPath}`, sample);
    const { bundle, drop } = parseCase(raw);
    assert.deepEqual(drop, [auditPath], sample);
    const filtered = { ...target, skillFiles: target.skillFiles.filter((f) => !drop.includes(f.path)) };
    const result = assemble(filtered, read, bundle);
    assert.equal(result, assemble({ ...target, skillFiles: shapeTicketFiles }, read, bundle), sample);
    assert.ok(!result.includes("# Repository audit"), sample);
    for (const path of bundle) assert.ok(result.includes(read(path)), `${sample}: ${path}`);
  }
});

test("shape-ticket audit samples parse facts and assemble audit without changing target slices", () => {
  const root = new URL("../../", import.meta.url).pathname;
  const read = replay.treeReader(root);
  const target = JSON.parse(read("eval/shape-ticket/target.json"));
  assert.equal(target.wordCap, 1600);
  for (const sample of auditSamples) {
    const { bundle, drop, text } = parseCase(read(`eval/shape-ticket/samples/${sample}/case.md`));
    const expected = parseExpected(read(`eval/shape-ticket/samples/${sample}/expected.md`));
    assert.equal(expected.anonymized, true, sample);
    assert.ok(expected.facts.length > 0, sample);
    assert.ok(text.includes("Scenario:"), sample);
    assert.deepEqual(drop, [], sample);
    const result = assemble(target, read, bundle);
    assert.ok(result.includes("# Repository audit"), sample);
    if (["batch-repair", "audit-dispatch", "audit-grounding"].includes(sample)) {
      assert.ok(bundle.includes("skills/shape-ticket/SKILL.md"), sample);
      assert.ok(result.includes("## Mode routing"), sample);
    }
  }
});

test("shape-ticket audit source carries six labels and foreground file-only controls", () => {
  const text = readFileSync(new URL("../../skills/shape-ticket/reference/repo-audit.md", import.meta.url), "utf8");
  for (const label of ["Claims:", "Repo-fit:", "AC-fit:", "Sibling:", "In-motion:", "Scenario:"]) {
    assert.ok(text.split("\n").some((line) => line.startsWith(label)), label);
  }
  for (const token of ['async: false', 'context: "fresh"', 'outputMode: "file-only"', "60000", "240000", "300000"]) {
    assert.ok(text.includes(token), token);
  }
});

test("shape-ticket integrates audited batch gates without changing replay boundaries", () => {
  const read = replay.treeReader(new URL("../../", import.meta.url).pathname);
  const text = read("skills/shape-ticket/SKILL.md");
  const target = JSON.parse(read("eval/shape-ticket/target.json"));
  const { bundle } = parseCase(read("eval/shape-ticket/samples/batch-repair/case.md"));
  const result = assemble(target, read, bundle);
  for (const token of ["reference/repo-audit.md", "reference/examples.md", "first occurrence", "current ticket", "ticket-local", "all-or-nothing", "AC uniqueness", "Audit:"]) assert.ok(text.includes(token), token);
  assert.ok(!text.includes("### Bad -> good AC examples"));
  const draft = sliceText(text, "### 4 - Draft", "## Roast");
  assert.ok(draft.includes("AC uniqueness"));
  assert.ok(result.includes("scenario: setup:"));
  assert.ok(text.includes('outputMode: "file-only"'));
  assert.ok(text.includes("^lean:"));
  const overlap = read("skills/shape-ticket/reference/overlap-check.md");
  assert.ok(overlap.includes("ticket-local"));
  assert.ok(!overlap.includes("retain whole-run semantics"));
  assert.ok(text.indexOf("Audit:", text.indexOf("### 8 -")) < text.indexOf("**Title**", text.indexOf("### 8 -")));
  assert.ok(Buffer.byteLength(text) < 50000);
  assert.ok(text.split("\n").length < 2000);
  const ladder = text.includes("## Tracker abstraction and capability ladder") ? text : read("skills/shape-ticket/reference/tracker-ladder.md");
  assert.ok(ladder.includes('gh pr list --search "<ref>" --limit 20'));
  assert.ok(text.includes("Read `reference/tracker-ladder.md` now"));
  for (const token of ["substantive full-replacement repair", "another row's setup, action, and result", "same-subject rows with different results", "never serialize legacy rows", "no fifth axis", "Max 8 tasks", "before the next ticket prints"]) assert.ok(text.includes(token), token);
  const examples = read("skills/shape-ticket/reference/examples.md");
  assert.ok(examples.startsWith("## Examples and rationalizations\n"));
  assert.match(examples, /^### Bad -> good AC examples$/m);
  assert.match(examples, /^### Rationalization table$/m);
  assert.doesNotMatch(text, /^## Examples and rationalizations$/m);
  assert.ok(text.includes("reference/examples.md"));
});

const skill = "---\nname: x\n---\n# T\n\n### 3. A\na\n\n### 4. B\nb\n\n### 5. C\nc\n\n### 6. D\nd\n";

test("slice ends at the next same-or-higher heading by default", () => {
  assert.equal(sliceText(skill, "### 4"), "### 4. B\nb\n\n");
});
test("sliceTo spans sibling sections", () => {
  const s = sliceText(skill, "### 3", "### 6");
  assert.ok(s.includes("### 5. C"));
  assert.ok(!s.includes("### 6"));
});
test("conformance slice spans Step 3.5 to before Step 5", () => {
  const root = new URL("../../", import.meta.url);
  const text = readFileSync(new URL("skills/finishing-a-development-branch/SKILL.md", root), "utf8");
  const slice = sliceText(text, "### Step 3.5", "### Step 5");
  assert.ok(slice.includes("### Step 4"));
  assert.ok(!slice.includes("### Step 5"));
});
test("directional-dependency bundle+ is assembled", () => {
  const root = new URL("../../", import.meta.url);
  const read = (path) => readFileSync(new URL(path, root), "utf8");
  const { bundle } = parseCase(read("eval/gatekeep-pr-scope/samples/directional-dependency/case.md"));
  assert.deepEqual(bundle, ["skills/check-delivery/SKILL.md"]);
  const result = assemble({ skillFiles: [{ path: "skills/gatekeep-pr/SKILL.md" }], assembly: "headed" }, read, bundle);
  assert.ok(result.includes("# skills/check-delivery/SKILL.md"));
  assert.ok(result.includes(read("skills/check-delivery/SKILL.md").split("\n")[0]));
});
test("missing heading throws", () => {
  assert.throws(() => sliceText(skill, "### 9"), /heading not found: ### 9/);
});
test("body strips frontmatter", () => {
  assert.equal(stripFrontmatter(skill).startsWith("# T"), true);
});
test("concat joins with one blank line; headed prefixes a path line", () => {
  const read = (p) => ({ "a.md": "A\n", "b.md": "B\n" })[p];
  assert.equal(assemble({ skillFiles: [{ path: "a.md" }, { path: "b.md" }], assembly: "concat" }, read, []), "A\n\nB\n");
  assert.equal(assemble({ skillFiles: [{ path: "a.md" }], assembly: "headed" }, read, ["b.md"]), "# a.md\nA\n\n# b.md\nB\n");
});
test("case.md bundle+ lines are stripped from the user turn", () => {
  const c = parseCase("bundle+: skills/x/SKILL.md\n# Digest\nbody\n");
  assert.deepEqual(c.bundle, ["skills/x/SKILL.md"]);
  assert.equal(c.text, "# Digest\nbody\n");
});
test("case.md leading bundle- lines are collected as drops and stripped; later ones stay text", () => {
  const c = parseCase("bundle+: skills/x/extra.md\nbundle-: skills/x/reference/sync.md\n# Digest\nbundle-: late.md\n");
  assert.deepEqual(c.bundle, ["skills/x/extra.md"]);
  assert.deepEqual(c.drop, ["skills/x/reference/sync.md"]);
  assert.equal(c.text, "# Digest\nbundle-: late.md\n");
});
test("a case without directives has empty bundle and drop", () => {
  assert.deepEqual(parseCase("# Digest\n"), { bundle: [], drop: [], text: "# Digest\n" });
});
test("text args", () => {
  const a = textArgs("anthropic/claude-opus-5-5", "/tmp/sys.md");
  assert.deepEqual(a, ["-p", "--no-skills", "--no-extensions", "--no-context-files", "--no-session", "--no-tools", "--model", "anthropic/claude-opus-5-5", "--thinking", "medium", "--system-prompt", "/tmp/sys.md"]);
});
test("edit args", () => {
  const a = editArgs("github-copilot/gpt-6.1-sol", "/tmp/skilldir");
  assert.deepEqual(a, ["-p", "--no-skills", "--no-extensions", "--no-context-files", "--no-session", "--tools", "read,edit,write", "--skill", "/tmp/skilldir", "--model", "github-copilot/gpt-6.1-sol", "--thinking", "medium"]);
});
test("fixture commit and capture include a new untracked file and the tree", (t) => {
  const fx = mkdtempSync(join(tmpdir(), "fx-"));
  t.after(() => rmSync(fx, { recursive: true, force: true }));
  writeFileSync(join(fx, "SKILL.md"), "one\n");
  const scratch = prepareFixture(fx);
  t.after(() => rmSync(scratch, { recursive: true, force: true }));
  writeFileSync(join(scratch, "NEW.md"), "new\n");
  writeFileSync(join(scratch, "SKILL.md"), "one\ntwo\n");
  const { diff, tree } = captureEdit(scratch);
  assert.ok(diff.includes("+++ b/NEW.md"));
  assert.ok(diff.includes("+two"));
  assert.deepEqual(Object.keys(tree).sort(), ["NEW.md", "SKILL.md"]);
  assert.equal(tree["SKILL.md"].lines, 2);
});
test("fixture scratch is removed when git initialization fails", (t) => {
  const fx = mkdtempSync(join(tmpdir(), "fx-"));
  t.after(() => rmSync(fx, { recursive: true, force: true }));
  writeFileSync(join(fx, ".git"), "invalid git metadata\n");
  const dirs = () => readdirSync(tmpdir()).filter((name) => name.startsWith("eval-fixture-")).sort();
  const before = dirs();
  assert.throws(() => prepareFixture(fx));
  assert.deepEqual(dirs(), before);
});

test("inputSha hashes fixture in sorted order", (t) => {
  const fx = mkdtempSync(join(tmpdir(), "fx-"));
  t.after(() => rmSync(fx, { recursive: true, force: true }));
  writeFileSync(join(fx, "b.md"), "b"); writeFileSync(join(fx, "a.md"), "a");
  assert.equal(inputSha("R", "C", [], fx), inputSha("R", "C", [], fx));
  assert.notEqual(inputSha("R", "C", [], fx), inputSha("R", "C2", [], fx));
});


test("brainstorming slice spans sections 3 through 5", () => {
  const text = readFileSync(new URL("../../skills/brainstorming/SKILL.md", import.meta.url), "utf8");
  const slice = sliceText(text, "### 3", "### 6");
  assert.ok(slice.includes("### 5"));
  assert.ok(!slice.includes("### 6"));
});
test("default slices ignore headings in code fences", () => {
  for (const fence of ["```", "~~~"]) {
    const text = `### A\n${fence}\n# comment\n${fence}\nbody\n### B\n`;
    assert.equal(sliceText(text, "### A"), `### A\n${fence}\n# comment\n${fence}\nbody\n`);
  }
});
test("baseline and tree readers work in a dirty tree", (t) => {
  const root = mkdtempSync(join(tmpdir(), "reader-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8", env: { ...process.env, GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_SYSTEM: "/dev/null" } });
  git("init", "-q", "-b", "main");
  mkdirSync(join(root, "skills/x"), { recursive: true });
  writeFileSync(join(root, "skills/x/SKILL.md"), "BASE\n");
  git("add", "-A");
  git("-c", "user.name=t", "-c", "user.email=t@localhost", "-c", "commit.gpgsign=false", "commit", "--no-verify", "-qm", "base");
  writeFileSync(join(root, "skills/x/SKILL.md"), "NEW\n");
  mkdirSync(join(root, "eval/t/samples/new"), { recursive: true });
  writeFileSync(join(root, "eval/t/samples/new/case.md"), "case\n");
  const target = { skillFiles: [{ path: "skills/x/SKILL.md" }], assembly: "concat" };
  assert.equal(typeof replay.baseReader, "function");
  assert.equal(assemble(target, replay.baseReader(root, "HEAD"), []), "BASE\n");
  assert.equal(assemble(target, replay.treeReader(root), []), "NEW\n");
  assert.notEqual(git("status", "--porcelain"), "");
});
test("capture reports zero lines for an empty file", (t) => {
  const fx = mkdtempSync(join(tmpdir(), "empty-"));
  t.after(() => rmSync(fx, { recursive: true, force: true }));
  writeFileSync(join(fx, "empty.md"), "");
  const scratch = prepareFixture(fx);
  t.after(() => rmSync(scratch, { recursive: true, force: true }));
  assert.equal(captureEdit(scratch).tree["empty.md"].lines, 0);
});

test("brainstorming read-once assembly includes owners and the second stage", () => {
  const root = new URL("../../", import.meta.url);
  const read = (path) => readFileSync(new URL(path, root), "utf8");
  const target = JSON.parse(read("eval/brainstorming/target.json"));
  const result = assemble(target, read);
  assert.ok(result.includes("## Ticket Handling"));
  assert.ok(result.includes("## Project overrides"));
  const { bundle, text } = parseCase(read("eval/brainstorming/samples/overrides-read-once/case.md"));
  assert.deepEqual(bundle, ["skills/writing-plans/SKILL.md"]);
  assert.ok(text.includes("## Narrated read actions"));
  assert.ok(assemble(target, read, bundle).includes("# skills/writing-plans/SKILL.md"));
});

test("SDD assembly keeps completion and runner with candidate late read", () => {
  const root = new URL("../../", import.meta.url).pathname;
  const target = JSON.parse(readFileSync(join(root, "eval/subagent-driven-development/target.json"), "utf8"));
  const candidate = assemble(target, replay.treeReader(root));
  assert.ok(candidate.includes("## After All Tasks Complete"));
  assert.ok(candidate.includes("Happy path: <abs path to $HP_DIR/summary.txt> (<outcome>)"));
  assert.ok(candidate.includes("<!-- happy-path-shell -->"));
  assert.ok(!candidate.includes("## When a Subagent Fails"));
  assert.ok(candidate.includes("reference/happy-path-run.md` at its absolute path"));
  assert.ok(candidate.includes("On an unreadable reference, stop with a blocking error"));
});
