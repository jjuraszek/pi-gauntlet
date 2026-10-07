import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import * as replay from "./replay.mjs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { sliceText, stripFrontmatter, assemble, parseCase, textArgs, editArgs, prepareFixture, captureEdit, inputSha } from "./replay.mjs";

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
