import assert from "node:assert/strict";
import { cpSync, globSync, mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { lintHandoffPointers, lintOverridesFile, lintOverridesOutline, lintPlacementRule, lintReferences, lintTreeShape } from "./gauntlet-tree-lint.mjs";

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

test("the overrides outline gives every block its sections and names their readers", () => {
  const readme = readFileSync(join(import.meta.dirname, "../README.md"), "utf8");
  assert.deepEqual(lintOverridesOutline(readme), []);
  for (const [from, to] of [
    ["- `# linear`", "- `# other`"],
    ["- `## issue-tracker`", "- `## Issue tracker`"],
    ["- `## verification`", "- `## delivery`"],
    ["- `## spec-index` - `gauntlet-spec-index`", "- `## spec-index` - `shape-ticket`"],
  ]) {
    const changed = readme.replace(from, to);
    assert.notEqual(changed, readme);
    assert.ok(lintOverridesOutline(changed).length, `${from} changed to ${to}`);
  }
});

test("overrides-outline: each caller applies only the seven shared sections and its own scope", () => {
  const root = join(import.meta.dirname, "../skills");
  const shared = ["issue-tracker", "worktrees", "verification", "cleanup", "siblings", "deployment", "spec-index"];
  const moved = ["brainstorm/council", "plan/plan", "implement/loop/loop", "implement/waves/waves", "implement/waves/parallel-agents", "implement/tdd", "verify/verify", "ship/ship", "worktrees", "requesting-review", "receiving-review"];
  const entries = readdirSync(root, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => `${d.name}/SKILL.md`);
  for (const file of [...entries, ...moved.map(step => `gauntlet/${step}.md`)]) {
    const [skill, dir] = file.split("/");
    const phase = dir === "SKILL.md" ? "brainstorm" : phases.find(p => p === dir);
    const section = readFileSync(join(root, file), "utf8").split("\n## Project overrides\n")[1] ?? "";
    const paragraph = section.trim().split(/\n\s*\n/)[0].replace(/\s+/g, " ");
    assert.match(paragraph, /`\.pi\/gauntlet\.md`, `<repo root>\/gauntlet\.md`, `<repo root>\/doc\/gauntlet\.md`; first found wins/, file);
    assert.match(paragraph, /only when the file from the same repository at the same trusted revision is already in context/, file);
    assert.ok(paragraph.includes("Apply, without a relevance judgment, these sections of `# shared`: " + shared.map(s => "`## " + s + "`").join(", ") + "."), file);
    const own = skill !== "gauntlet" ? `Apply the whole \`# ${skill}\` block.` : phase
      ? `Apply \`# gauntlet\`: its text above the first section, and \`## ${phase}\`. Apply no other phase's section.`
      : "Apply the block of the skill that invoked this file: inside a run the text directly under `# gauntlet`; from another skill, that skill's block.";
    assert.ok(paragraph.includes(own), file);
    assert.ok(paragraph.endsWith("Apply nothing else from the file: no other block, no text directly under `# shared`, no other section of `# shared`."), file);
    const allowed = new Set(["# shared", `# ${skill}`, ...shared.map(s => `## ${s}`)]);
    if (skill === "gauntlet" && phase) allowed.add(`## ${phase}`);
    if (["gauntlet/plan/plan.md", "gauntlet/implement/loop/loop.md", "gauntlet/implement/waves/waves.md"].includes(file)) {
      assert.match(paragraph, /Apply `## happy-path`/, file);
      allowed.add("## happy-path");
    }
    for (const [, heading] of paragraph.matchAll(/`(#{1,2} [^`]+)`/g)) assert.ok(allowed.has(heading), `${file}: ${heading}`);
    assert.match(section, /README\.md#project-specific-overrides/, file);
    assert.match(section, /never lifts this skill's HARD CONSTRAINT or MUST text/, file);
    if (skill === "gatekeep-pr") assert.match(paragraph, /gate configuration at the PR's merge base, never its head/, file);
  }
});

test("overrides-outline: readers no longer get shared settings from flat headings", () => {
  const root = join(import.meta.dirname, "..");
  for (const file of globSync(["{skills,agents}/**/*.md", "doc/*.md"], { cwd: root })) {
    assert.doesNotMatch(readFileSync(join(root, file), "utf8"), /## (?:Issue tracker|Deployment|Spec index|PR gate|shape-ticket)\b/, file);
  }
  const assessment = readFileSync(join(root, "skills/gatekeep-pr/reference/assessment.md"), "utf8");
  assert.match(assessment, /^# shared\n## verification\n- verification command:[^\n]*\n- requires credentials:/m);
  assert.match(assessment, /merge-base of the PR's base branch[^\n]+never from the PR's head tree/);
});

test("overrides-outline: repo-wide wording comes from the agent instructions", () => {
  const root = join(import.meta.dirname, "..");
  const files = globSync(["{skills,agents}/**/*.md", "doc/*.md", "README.md", "AGENTS.md"], { cwd: root });
  const old = files.filter(file => /`## (?:conventions|comms style)`/i.test(readFileSync(join(root, file), "utf8")));
  assert.deepEqual(old.sort(), []);
  assert.match(readFileSync(join(root, "skills/gauntlet/commit-message.md"), "utf8"), /subject convention from the repo's agent instructions/);
  assert.match(readFileSync(join(root, "README.md"), "utf8"), /repo-wide rules in the repo's agent instructions[^\n]+one skill directly under that skill's block heading[^\n]+whole run, put it directly under `# gauntlet`/);
});

test("the repo's overrides put tracker and cleanup in shared and release in ship", () => {
  const file = readFileSync(join(import.meta.dirname, "../.pi/gauntlet.md"), "utf8");
  assert.deepEqual(lintOverridesFile(file), []);
  assert.match(file, /^## issue-tracker\n(?:[^#\n].*\n|\n)*- tracker: github$/m);
  assert.match(file, /^## cleanup\n(?:[^#\n].*\n|\n)*- release: \/skill:release$/m);
  assert.match(file, /^## ship\n\s*`\/skill:release`/m);
  for (const [suffix, errors] of [
    ["# unlisted", ["unknown block: unlisted"]],
    ["# gatekeep-pr\n## cleanup", ["unknown section: gatekeep-pr/cleanup"]],
    ["# gatekeep-pr\n```markdown\n## cleanup\n```", []],
  ]) assert.deepEqual(lintOverridesFile(`${file}\n${suffix}`), errors);
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
