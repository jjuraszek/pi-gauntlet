import assert from "node:assert/strict";
import { cpSync, mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { lintHandoffPointers, lintPlacementRule, lintReferences, lintTreeShape } from "./gauntlet-tree-lint.mjs";

const phases = ["brainstorm", "plan", "implement", "verify", "ship"];

test("package references resolve from the caller, not the checkout or a same-named sibling", t => {
  const root = mkdtempSync(join(tmpdir(), "gauntlet-references-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const [file, body] of [
    ["skills/one/SKILL.md", "Read [the guide](reference/guide.md) and `../two/helper.md`. Read `doc/specs/example.md` in the consumer repo."],
    ["skills/one/reference/guide.md", "Read `../../two/helper.md`."],
    ["skills/two/helper.md", "# Helper"],
    ["agents/reviewer.md", "Use [the guide](../skills/one/reference/guide.md)."],
    ["extensions/advice.ts", 'const help = new URL("../skills/two/helper.md", import.meta.url);'],
  ]) {
    mkdirSync(join(root, dirname(file)), { recursive: true });
    writeFileSync(join(root, file), body);
  }
  assert.deepEqual(lintReferences(root), []);
  rmSync(join(root, "skills/two/helper.md"));
  assert.deepEqual(lintReferences(root), [
    "extensions/advice.ts: ../skills/two/helper.md", "skills/one/SKILL.md: ../two/helper.md", "skills/one/reference/guide.md: ../../two/helper.md",
  ]);
  rmSync(join(root, "skills/one/reference/guide.md"));
  assert.ok(lintReferences(root).includes("agents/reviewer.md: ../skills/one/reference/guide.md"));
  assert.deepEqual(lintReferences(join(import.meta.dirname, "..")), []);
});

test("numbered citations from retained skills name headings in the moved file", t => {
  const root = mkdtempSync(join(tmpdir(), "gauntlet-steps-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const name of ["gatekeep-pr", "gauntlet"]) mkdirSync(join(root, "skills", name), { recursive: true });
  const file = "skills/gatekeep-pr/SKILL.md";
  const ref = "../gauntlet/worktrees.md";
  writeFileSync(join(root, file), `Read \`${ref}\` Step 1a and \`${ref}\` Step 2b.`);
  writeFileSync(join(root, "skills/gauntlet/worktrees.md"), "## Step 1a - Contract\n### 2b. Create\n");
  assert.deepEqual(lintReferences(root), []);
  writeFileSync(join(root, "skills/gauntlet/worktrees.md"), "## Step 1a - Contract\nStep 2b is not a heading.\n");
  assert.deepEqual(lintReferences(root), [`${file}: ${ref} Step 2b`]);
});

test("the README inventory matches the registered skill directories", () => {
  const root = join(import.meta.dirname, "..");
  const readme = readFileSync(join(root, "README.md"), "utf8");
  const inventory = readme.match(/^- \*\*(\d+) skills\*\* - (.+)$/m);
  assert.ok(inventory, "missing README skill inventory");
  const names = [...inventory[2].matchAll(/`([^`]+)`/g)].map(match => match[1]).sort();
  const entries = readdirSync(join(root, "skills"), { withFileTypes: true })
    .filter(dir => dir.isDirectory() && readdirSync(join(root, "skills", dir.name)).includes("SKILL.md"))
    .map(dir => dir.name).sort();
  assert.equal(Number(inventory[1]), entries.length);
  assert.deepEqual(names, entries);
});

test("the eleven run steps are instruction files, not separate skill entries", () => {
  const steps = {
    "brainstorm/council.md": "The council run",
    "plan/plan.md": "Author the plan",
    "implement/waves/waves.md": "The Wave Loop",
    "implement/loop/loop.md": "Validate the return",
    "verify/verify.md": "The Gate Function",
    "ship/ship.md": "Step 5: Execute Choice",
    "worktrees.md": "Keeping a Worktree Current",
    "requesting-review.md": "How to Request",
    "receiving-review.md": "Handling Unclear Feedback",
    "implement/waves/parallel-agents.md": "Identify Independent Domains",
    "implement/tdd.md": "Red-Green-Refactor",
  };
  for (const [file, section] of Object.entries(steps)) {
    const body = readFileSync(join(import.meta.dirname, "../skills/gauntlet", file), "utf8");
    assert.ok(body.includes(section), `${file}: missing ${section}`);
    assert.ok(!body.startsWith("---"), `${file}: unexpected skill header`);
  }
});

test("the run's tree has exactly five phases", () => {
  assert.deepEqual(lintTreeShape(join(import.meta.dirname, "..")), []);
});

test("placement has one owner; other guides link instead of restating the rule", (t) => {
  const repo = join(import.meta.dirname, "..");
  assert.deepEqual(lintPlacementRule(repo), []);
  const root = mkdtempSync(join(tmpdir(), "gauntlet-placement-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (file, text) => {
    mkdirSync(join(root, dirname(file)), { recursive: true });
    writeFileSync(join(root, file), text);
  };
  const guide = "skills/forge-skill/SKILL.md";
  const body = readFileSync(join(repo, guide), "utf8");
  const pointer = `For links from skills outside the run, see [placement](${guide}#gauntlet-file-placement).`;
  put("AGENTS.md", pointer);
  put(guide, "# Authoring\n");
  assert.ok(lintPlacementRule(root).some(error => error.startsWith(guide)));
  put(guide, body);
  put("AGENTS.md", "# Instructions\n");
  assert.ok(lintPlacementRule(root).some(error => error.startsWith("AGENTS.md")));
  put("AGENTS.md", pointer);
  const rule = body.match(/^### Gauntlet file placement\n[^]*?(?=^## )/m)[0];
  for (const [file, copy] of [
    ["AGENTS.md", rule],
    ["skills/example/helper.md", "Keep files shared by multiple phases at the tree root."],
    ["agents/example.md", rule.replace(/^### .*\n/, "")],
  ]) {
    put(file, `${pointer}\n\n${copy}`);
    assert.deepEqual(lintPlacementRule(root), [`${file}: link to the placement rule instead of restating it`]);
    put(file, pointer);
  }
  assert.deepEqual(lintPlacementRule(root), []);
});

test("only the tracker supplies the next file at each engine's handoffs", (t) => {
  const repo = join(import.meta.dirname, "..");
  assert.deepEqual(lintHandoffPointers(repo), []);
  const root = mkdtempSync(join(tmpdir(), "gauntlet-handoff-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const tree = "skills/gauntlet";
  cpSync(join(repo, tree), join(root, tree), { recursive: true });
  for (const [file, from, to] of [
    ["SKILL.md", "13. **Transition**", "13. **Transition** - read plan/plan.md"],
    ["brainstorm/spec-finalization.md", "Continue without another prompt.", "Continue in implement/loop/loop.md."],
    ["plan/plan.md", "## Execution Handoff", "## Execution Handoff\nRead implement/waves/waves.md."],
    ["implement/waves/waves.md", "## After All Tasks Complete", "## After All Tasks Complete\nRead ship/ship.md."],
    ["implement/loop/loop.md", "## After the loop", "## After the loop\nInvoke /skill:example."],
    ["plan/plan.md", 'plan_tracker({ action: "init", tasks:', 'plan_tracker({ action: "clear", tasks:'],
    ["brainstorm/spec-pr.md", "print `run allowance: N`", "omit the carrier"],
    ["implement/loop/loop.md", "Read the literal `run allowance: <n>`", "Ignore the carrier"],
    ["ship/ship.md", "WORKTREE=<worktree-path>", 'WORKTREE="$1"'],
  ]) {
    const path = join(root, tree, file);
    const saved = readFileSync(path, "utf8");
    const changed = saved.replaceAll(from, to);
    assert.notEqual(changed, saved, from);
    writeFileSync(path, changed);
    assert.ok(lintHandoffPointers(root).some(error => error.startsWith(`${tree}/${file}:`)), `${file}: ${to}`);
    writeFileSync(path, saved);
  }
});

test("tree-shape names each path that breaks the phase layout", (t) => {
  const root = mkdtempSync(join(tmpdir(), "gauntlet-tree-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const tree = join(root, "skills/gauntlet");
  for (const path of [...phases, "implement/waves", "implement/loop"]) {
    mkdirSync(join(tree, path), { recursive: true });
  }
  writeFileSync(join(tree, "SKILL.md"), "# Entry\n");
  assert.deepEqual(lintTreeShape(root), []);
  for (const path of ["other", "plan/deeper", "implement/loop/deeper"]) {
    mkdirSync(join(tree, path));
    assert.deepEqual(lintTreeShape(root), [`skills/gauntlet/${path}: unexpected directory`]);
    rmSync(join(tree, path), { recursive: true });
  }
  const nestedEntry = "implement/waves/SKILL.md";
  writeFileSync(join(tree, nestedEntry), "# Another entry\n");
  assert.deepEqual(lintTreeShape(root), [`skills/gauntlet/${nestedEntry}: nested skill entry`]);
  rmSync(join(tree, nestedEntry));
  rmSync(join(tree, "plan"), { recursive: true });
  assert.deepEqual(lintTreeShape(root), ["skills/gauntlet/plan: missing phase directory"]);
});
