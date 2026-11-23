import { globSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";

const tree = "skills/gauntlet";
const phases = ["brainstorm", "plan", "implement", "verify", "ship"];
const directories = new Set([...phases, "implement/waves", "implement/loop"]);

const [entry, overrides, ...steps] = `
brainstorming
gauntlet-overrides
writing-plans
subagent-driven-development
loop-implementation
roasting-the-spec
finishing-a-development-branch
using-git-worktrees
verification-before-completion
requesting-code-review
receiving-code-review
dispatching-parallel-agents
test-driven-development
`.trim().split("\n");
export const retiredNames = { entry, overrides, steps };

export function lintRetiredNames(root) {
  const inputs = new Set([entry, overrides, ...steps]);
  const pattern = new RegExp([...steps, overrides, `/skill:${entry}\\b`, `skills/${entry}\\b`, `\\b${entry}/[a-z0-9-]+`, `#{1,2}\\s+${entry}\\b`].join("|"));
  const scope = ["{skills,agents,extensions,bin,src/bins,scripts,test,tests,doc}/**/*", "README.md", "AGENTS.md", ".pi/*.md", "gauntlet.md", `${overrides}.md`, "eval/**/*"];
  const exclude = ["doc/specs", "doc/plans", "eval/**/results", "eval/*/report.md", "eval/*/records.jsonl", "eval/*/replay/results.md"];
  const hits = [];
  for (const file of globSync(scope, { cwd: root, exclude, withFileTypes: true })) {
    const path = relative(root, join(file.parentPath, file.name)).split(sep).join("/");
    if (file.isDirectory() && path === `eval/${file.name}` && (steps.includes(file.name) || file.name === entry)) hits.push(`${path}: retired target name`);
    if (!file.isFile()) continue;
    if (file.name === `${overrides}.md`) hits.push(`${path}: retired overrides filename`);
    const text = readFileSync(join(root, path), "utf8");
    const lines = text.split("\n");
    for (const [i, line] of lines.entries()) {
      if (path === "scripts/gauntlet-tree-lint.mjs" && inputs.has(line)) continue;
      const match = line.replaceAll("\\/", "/").match(pattern);
      if (match) hits.push(`${path}:${i + 1}: ${match[0]}`);
    }
  }
  return hits.sort();
}

export function lintPlacementRule(root) {
  const guide = "skills/forge-skill/SKILL.md";
  const files = globSync(["AGENTS.md", "README.md", "CHANGELOG.md", "doc/*.md", "{skills,agents,extensions,bin}/**/*.{md,ts,mjs}"], { cwd: root });
  const read = file => readFileSync(join(root, file), "utf8");
  const guideText = files.includes(guide) ? read(guide) : "";
  const section = guideText.split(/^### Gauntlet file placement\s*$/m)[1]?.split(/^#{1,3} /m, 1)[0] ?? "";
  const crossPhase = paragraph => /(?:more than one phase|(?:different|multiple|two) phases|across phases)/i.test(paragraph)
    && /(?:beside|alongside|next to) (?:the )?entry|(?:tree|skill) root/i.test(paragraph);
  const outside = paragraph => /skills outside the run|non-run skills/i.test(paragraph)
    && /(?:not|never) (?:change|determine|affect|move)|without (?:changing|moving)/i.test(paragraph);
  const paragraphs = text => text.split(/\n\s*\n/).map(p => p.replace(/\s+/g, " "));
  const rules = paragraphs(section);
  const errors = [];
  if (!rules.some(crossPhase) || !rules.some(outside)) errors.push(`${guide}: missing placement rule for cross-phase or external readers`);
  if (!files.includes("AGENTS.md") || !read("AGENTS.md").includes(`](${guide}#gauntlet-file-placement)`)) errors.push(`AGENTS.md: link to ${guide}#gauntlet-file-placement`);
  for (const file of files) {
    const text = read(file);
    const rest = file === guide ? text.replace(section, "") : text;
    if (paragraphs(rest).some(p => crossPhase(p) || outside(p) || /lowest directory containing .*phase readers/i.test(p))) {
      errors.push(`${file}: link to the placement rule instead of restating it`);
    }
  }
  return errors;
}

export function lintHandoffPointers(root) {
  const errors = new Set();
  const read = file => readFileSync(join(root, tree, file), "utf8");
  function visit(file, start, nextFile, ...actions) {
    const body = read(file);
    const offset = body.indexOf(`\n${start}`);
    const site = offset < 0 ? "" : body.slice(offset + 1).split(/\n## /, 1)[0];
    const report = message => errors.add(`${tree}/${file}: ${message}`);
    if (!site) return report(`missing handoff site ${start}`);
    const pointer = site.match(new RegExp(`/skill:[\\w-]+|\\b${nextFile}\\.md\\b`));
    if (pointer) report(`handoff names ${pointer[0]} instead of using the tracker's pointer`);
    let previous = -1;
    for (const action of actions) {
      const index = site.search(action);
      if (index <= previous) return report(`missing or out-of-order handoff action: ${action.source}`);
      previous = index;
    }
  }
  const complete = phase => `phase_tracker({ action: "complete", phase: "${phase}"`;
  for (const engine of ["waves", "loop"]) {
    const next = engine === "waves" ? "plan" : "loop";
    visit("SKILL.md", "13. **Transition**", next);
    const allowance = engine === "loop" ? [/print (?:exactly one line )?`run allowance: /, /before reading the file named by `Instructions:`/] : [];
    visit("brainstorm/spec-finalization.md", "After implementation approval (1/2)", next, /phase: "brainstorm", engine/, ...allowance);
    visit("brainstorm/spec-pr.md", "For approval 1/2", next, /completing brainstorm with the selected engine/, ...allowance);
    if (engine === "waves") {
      visit("plan/plan-contract.md", "## Plan header", "waves");
      visit("plan/plan.md", "## Execution Handoff", "waves", /phase_tracker\(\{ action: "complete", phase: "plan"/, /plan_tracker\(\{ action: "init", tasks: \["W1:/, /read the file named by the phase tracker's `Instructions:`/);
      visit("implement/waves/waves.md", "## After All Tasks Complete", "ship", /phase_tracker\(\{ action: "complete", phase: "verify"/);
    } else {
      visit("implement/loop/loop.md", "4. Require a clean named-branch", "ship", /Read the literal `run allowance: <n>`/, /Write `<resolved plan dir>/, /^allowance: <n>$/m);
      visit("implement/loop/loop.md", "## After the loop", "ship", /Complete verify only on current CONFORMS/);
    }
  }
  visit("verify/verify.md", complete("verify"), "ship");
  const ship = "ship/ship.md";
  const input = read(ship).split("## Input\n")[1]?.split("\n## ")[0] ?? "";
  if (!/retained absolute worktree path.*on resume.*restore.*if it is missing, stop/i.test(input)
      || /worktree(?:-| )path[^.\n]*\bargument\b|WORKTREE=.*(?:\$1\b|\$ARGUMENTS)/i.test(read(ship))) {
    errors.add(`${tree}/${ship}: use the retained or restored worktree, never a command argument`);
  }
  return [...errors];
}

export function lintReferences(root, scope = ["{skills,agents}/**/*.md", "extensions/**/*.ts"]) {
  const files = globSync(scope, { cwd: root, exclude: ["**/*.test.ts"] });
  const errors = new Set();
  function check(file, ref, base = dirname(file)) {
    const target = join(base, ref);
    if (target.startsWith("../") || !statSync(join(root, target), { throwIfNoEntry: false })?.isFile()) {
      errors.add(`${file}: ${ref}`);
    }
  }
  const read = file => readFileSync(join(root, file), "utf8");
  // Scratch artifacts and consumer checkout names, not files in the install.
  const artifacts = /^(?:AGENTS|CHANGELOG|CLAUDE|REVIEW|ITERATION|audit|snapshot|spec|ledger|context|meta-prompt|gauntlet|name)\.md$/;
  for (const file of files.filter(f => f.endsWith(".md"))) {
    let body = read(file);
    if (file === "skills/forge-skill/SKILL.md") {
      // The placement table declares its base and directory separately from each filename.
      body = body.replace(/^\| `([\w-]+\.md)` \| `([.\w/-]+)` \| (.*?) \|$/gm, (_, name, dir, owner) => {
        check(file, name, join(tree, dir));
        if (/^`[\w-]+\.md`$/.test(owner)) check(file, owner.slice(1, -1), join(tree, dir));
        return "";
      });
    }
    const text = body
      .replace(/`\[[^`\n]*\]\([^`\n]+\)`/g, "") // inline example of Markdown syntax
      .replace(/^  touched-files: .*$/gm, "") // example reviewer output
      .replace(/^\| .*? \| checker fixtures: .*? \| Task \d+ \|$/gm, "")
      .replace(/https?:\/\/[^\s)\]`]+/g, "")
      .replace(/\[[^\]\n]*\]\(([^)\n]*)\)/g, (_, href) => {
        const target = href.split("#", 1)[0];
        if (target && !/^(?:[a-z][\w+.-]*:|\/|<)/i.test(target)) check(file, target);
        return "";
      })
      .replace(/(?:<[\w -]+>|\$[A-Z_]+)\/[\w./-]+/g, "");
    if (file.startsWith("skills/") && !file.startsWith(`${tree}/`)) {
      for (const [, ref, number] of text.matchAll(/`([\w./-]+\.md)` Step (\d+[a-z]?)\b/gi)) {
        const target = join(dirname(file), ref);
        if (!target.startsWith(`${tree}/`) || !statSync(join(root, target), { throwIfNoEntry: false })?.isFile()) continue;
        if (!new RegExp(`^#{1,6} (?:Step )?${number}\\b`, "im").test(read(target))) errors.add(`${file}: ${ref} Step ${number}`);
      }
    }
    for (const { 0: ref } of text.matchAll(/(?<![\w./<>*-])(?:(?:[\w.-]+\/)*[\w][\w.-]*\.(?:md|mjs|ts)|(?:\.\.\/)+package\.json)\b/g)) {
      if (artifacts.test(ref) || /^(?:(?:doc|docs)\/|(?:\.pi|pkg-x|repo-a\/pkg-x)\/|eval\/|src\/)|^\d{4}-\d\d-\d\d-/.test(ref)) continue;
      if (ref.endsWith(".ts") && !ref.startsWith("extensions/lib/") && !ref.includes("../")) continue;
      check(file, ref);
    }
  }
  for (const file of files.filter(f => f.endsWith(".ts"))) {
    const text = read(file);
    for (const [, ref] of text.matchAll(/(?:new URL\(["'`]([^$"'`]+\.(?:md|mjs))["'`],\s*import\.meta\.url\))/g)) check(file, ref);
    for (const [ref] of text.matchAll(/(?<![\w./-])(?:\.\.\/)*skills\/[\w./-]+\.md\b/g)) check(file, ref);
    const base = text.match(/new URL\(`([^`]+)\/\$\{file\}`, import\.meta\.url\)/)?.[1];
    if (base) {
      const table = text.match(/const instructionFiles = \{([^}]+)\}/)?.[1] ?? "";
      for (const [, ref] of [...table.matchAll(/:\s*"([^"]+)"/g), ...text.matchAll(/gauntletFile\("([^"]+)"\)/g)]) {
        check(file, ref, join(dirname(file), base));
      }
    }
  }
  return [...errors].sort();
}

export function lintTreeShape(root) {
  const base = join(root, tree);
  const entries = readdirSync(base, { recursive: true, withFileTypes: true });
  const found = new Set();
  const errors = [];
  for (const entry of entries) {
    const path = relative(base, join(entry.parentPath, entry.name)).split(sep).join("/");
    if (entry.isDirectory()) {
      found.add(path);
      if (!directories.has(path)) errors.push(`${tree}/${path}: unexpected directory`);
    } else if (entry.name === "SKILL.md" && path !== "SKILL.md") {
      errors.push(`${tree}/${path}: nested skill entry`);
    }
  }
  for (const phase of phases) {
    if (!found.has(phase)) errors.push(`${tree}/${phase}: missing phase directory`);
  }
  return errors;
}
