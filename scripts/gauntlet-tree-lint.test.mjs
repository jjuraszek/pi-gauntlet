import assert from "node:assert/strict";
import { cpSync, globSync, mkdtempSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { lintHandoffPointers, lintOverridesFile, lintOverridesOutline, lintPlacementRule, lintReferences, lintReleaseNotes, lintTreeShape, retiredNames } from "./gauntlet-tree-lint.mjs";

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

test("overrides-outline: private settings come from the reader's own block", () => {
  const root = join(import.meta.dirname, "..");
  const read = file => readFileSync(join(root, file), "utf8");
  const skills = readdirSync(join(root, "skills"));
  for (const file of globSync("skills/**/*.md", { cwd: root })) {
    const owner = file.split("/")[1];
    for (const [, block] of read(file).matchAll(/`# ([a-z-]+)`/g)) {
      if (skills.includes(block)) assert.equal(block, owner, file);
    }
  }
  for (const [file, heading] of [
    ["agents/plan-writer.md", /only `# gauntlet` `## happy-path`/],
    ["skills/gauntlet/documentation-impact.md", /`# gauntlet` `## documentation`/],
    ["skills/check-delivery/SKILL.md", /^# check-delivery\n## delivery$/m],
    ["skills/chase-bug/SKILL.md", /^ +# chase-bug\n +## response-channels$/m],
    ["skills/gatekeep-pr/reference/assessment.md", /^# gatekeep-pr\n- timeout minutes:.*\n(?:- [^\n]+\n)*- merge policy:/m],
    ["skills/gatekeep-pr/reference/fix-wave.md", /in `# gatekeep-pr` or `# shared` `## verification`/],
  ]) assert.match(read(file), heading, file);
  for (const file of globSync("{skills,agents}/**/*.md", { cwd: root })) {
    assert.doesNotMatch(read(file), /`## (Happy path|Delivery|Response channels|housekeeping|Capabilities)`/, file);
  }
});

test("overrides-outline: sample inputs use the same blocks as the installed skills", () => {
  const root = join(import.meta.dirname, "..");
  const errors = [];
  const inputs = ["eval/*/replay.md", "eval/*/samples/*/case.md", "eval/*/samples/*/fixture/**/*.md", "eval/*/samples/*/fixture/.pi/gauntlet.md"];
  for (const file of globSync(inputs, { cwd: root })) {
    const text = readFileSync(join(root, file), "utf8");
    if (file.endsWith("/gauntlet.md")) {
      errors.push(...lintOverridesFile(text).map(reason => `${file}: ${reason}`));
      continue;
    }
    // Unfenced excerpts end at the next sample paragraph; fenced excerpts can contain blank lines.
    for (const [, fenced, plain] of text.matchAll(/^(?:[^\n]*\bgauntlet\.md[^\n]*:|## Overrides at merge-base)\n\n?(?:```markdown\n([\s\S]*?)\n```|(#{1,2} [^\n]+(?:\n[^\n]+)*))/gm)) {
      errors.push(...lintOverridesFile(fenced ?? plain).map(reason => `${file}: ${reason}`));
    }
    assert.doesNotMatch(text, /(?:Overrides, |Resolved overrides |supplied project overrides' `)## (?:shape-ticket|Issue tracker)\b|`## PR gate` - /, file);
    const overrides = text.split(/^## Project overrides\n/m)[1]?.split(/^#{1,2} /m, 1)[0] ?? "";
    for (const [, heading] of overrides.matchAll(/\bapply (?:its |the )?`(## (?:conventions|comms style))`/gi)) {
      errors.push(`${file}: obsolete section ${heading}`);
    }
  }
  assert.deepEqual(errors, []);
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

test("release-notes: the major carries its migrations before and after promotion", () => {
  const changelog = readFileSync(join(import.meta.dirname, "../CHANGELOG.md"), "utf8");
  assert.deepEqual(lintReleaseNotes(changelog), []);
  const sections = changelog.split(/^## /m);
  const major = sections.find(s => s.startsWith("v9.0.0 ")) ?? sections.find(s => s.startsWith("Unreleased\n"));
  const notes = major.slice(major.indexOf("\n"));
  const unreleased = `## Unreleased${notes}`;
  const promoted = `## Unreleased\nLater changes.\n\n## v9.0.0 - 2026-12-01${notes}`;
  for (const text of [unreleased, promoted]) {
    assert.deepEqual(lintReleaseNotes(text), []);
    for (const [before, after] of [
      [`/skill:${retiredNames.entry}`, "/skill:missing"], ["skills/gauntlet/plan/plan.md", "skills/gauntlet/ship/ship.md"],
      ["`implement/stop-note`", "`plan/stop-note`"], [`${retiredNames.overrides}.md`, "another-file.md"],
      ["`## issue-tracker`", "`## siblings`"], ["No longer read", "Still read"],
      ["on the previous major", "on the new major"], ["--migrate-records", "--other"],
    ]) {
      const corrupted = text.replace(before, after);
      assert.notEqual(corrupted, text, before);
      assert.ok(lintReleaseNotes(`${corrupted}\n## v8.8.7 - 2026-11-22${notes}`).length, `wrong migration: ${after}`);
    }
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
  const body = "### Gauntlet file placement\n\nPut a file read by more than one phase beside the entry file.\n\nSkills outside the run never move a file.\n\n## Authoring rules\n";
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

test("placement reports each run file outside its assigned or computed directory", t => {
  const root = mkdtempSync(join(tmpdir(), "gauntlet-placement-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const tree = "skills/gauntlet";
  const guide = "skills/forge-skill/SKILL.md";
  for (const [file, text] of [
    ["AGENTS.md", `[Placement](${guide}#gauntlet-file-placement)`],
    [guide, "### Gauntlet file placement\n\n| File | Directory | Owner |\n|---|---|---|\n| `anchored.md` | `implement/` | Engines |\n\nPut a file read by more than one phase beside the entry file.\n\nSkills outside the run never move a file."],
    ["extensions/phase-tracker.ts", 'const instructionFiles = { plan: "plan/plan.md", waves: "implement/waves/waves.md", loop: "implement/loop/loop.md", verify: "verify.md", ship: "ship/ship.md" };'],
    ["skills/other/SKILL.md", "[Shared](../gauntlet/ship/shared.md)"],
    [`${tree}/SKILL.md`, "Read `plan/entry-help.md`, [Common](plan/common.md) and [Reader](common-reader.md)."],
    [`${tree}/verify.md`, "Read `plan/common.md`, `common-reader.md`, and `ship/plan.md`."],
    [`${tree}/plan/plan.md`, "Read `anchored.md` and the consumer's `gauntlet.md`."],
    [`${tree}/plan/gauntlet.md`, ""],
    [`${tree}/plan/entry-help.md`, ""],
    [`${tree}/plan/common.md`, ""],
    [`${tree}/plan/unused.md`, ""],
    [`${tree}/implement/waves/waves.md`, "[Engines](engine-help.md#heading)"],
    [`${tree}/implement/loop/loop.md`, "Read `../waves/engine-help.md`."],
    [`${tree}/implement/waves/engine-help.md`, ""],
    [`${tree}/implement/anchored.md`, "Read [Helper](../anchor-help.md)."],
    [`${tree}/anchor-help.md`, ""],
    [`${tree}/common-reader.md`, "Read [Shared](ship/shared.md) and [Entry help](plan/entry-help.md)."],
    [`${tree}/ship/ship.md`, "Read `plan.md` and `anchored.md`."],
    [`${tree}/ship/plan.md`, "Read `../ship-help.md`."],
    [`${tree}/ship/anchored.md`, "Read `../ship-help.md`."],
    [`${tree}/ship-help.md`, ""],
    [`${tree}/ship/shared.md`, ""],
  ]) {
    mkdirSync(join(root, dirname(file)), { recursive: true });
    writeFileSync(join(root, file), text);
  }
  assert.deepEqual(lintPlacementRule(root).sort(), [
    `${tree}/anchor-help.md: actual directory ${tree}; expected ${tree}/implement`,
    `${tree}/implement/waves/engine-help.md: actual directory ${tree}/implement/waves; expected ${tree}/implement`,
    `${tree}/plan/common.md: actual directory ${tree}/plan; expected ${tree}`,
    `${tree}/plan/entry-help.md: actual directory ${tree}/plan; expected ${tree}/brainstorm`,
    `${tree}/plan/gauntlet.md: actual directory ${tree}/plan; expected no directory (no run reader or anchor)`,
    `${tree}/plan/unused.md: actual directory ${tree}/plan; expected no directory (no run reader or anchor)`,
    `${tree}/ship-help.md: actual directory ${tree}; expected ${tree}/ship`,
    `${tree}/ship/plan.md: actual directory ${tree}/ship; expected ${tree}`,
    `${tree}/ship/shared.md: actual directory ${tree}/ship; expected ${tree}`,
    `${tree}/verify.md: actual directory ${tree}; expected ${tree}/verify`,
  ]);
  renameSync(join(root, tree, "implement/anchored.md"), join(root, tree, "plan/anchored.md"));
  const moved = lintPlacementRule(root);
  assert.deepEqual(moved.filter(error => error.includes("anchored.md:")).sort(), [
    `${tree}/plan/anchored.md: same name as missing anchor; expected directory ${tree}/implement`,
    `${tree}/ship/anchored.md: same name as missing anchor; expected directory ${tree}/implement`,
  ]);
  assert.ok(moved.includes(`${tree}/anchor-help.md: actual directory ${tree}; expected ${tree}/plan`));
  assert.ok(moved.includes(`${tree}/ship-help.md: actual directory ${tree}; expected ${tree}/ship`));

  rmSync(join(root, tree, "plan/anchored.md"));
  rmSync(join(root, tree, "ship/anchored.md"));
  assert.ok(lintPlacementRule(root).includes(`${tree}/implement/anchored.md: anchor file missing; expected directory ${tree}/implement`));
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
