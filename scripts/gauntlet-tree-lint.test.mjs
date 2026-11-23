import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { lintPlacementRule, lintTreeShape } from "./gauntlet-tree-lint.mjs";

const phases = ["brainstorm", "plan", "implement", "verify", "ship"];

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
