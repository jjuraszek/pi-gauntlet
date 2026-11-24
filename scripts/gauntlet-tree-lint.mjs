import { globSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, relative, sep } from "node:path";

const tree = "skills/gauntlet";
const phases = ["brainstorm", "plan", "implement", "verify", "ship"];
const directories = new Set([...phases, "implement/waves", "implement/loop"]);
const anchorRow = /^\| `([\w-]+\.md)` \| `([.\w/-]+)` \| (.*?) \|$/gm;
const pathReference = /(?<![\w./<>*-])(?:(?:[\w.-]+\/)*[\w][\w.-]*\.(?:md|mjs|ts)|(?:\.\.\/)+package\.json)\b/g;
const packageRooted = /^(?:skills|agents|extensions|bin|doc)\//;
const sourceRepositorySuffix = /^`?(?:\s+"[^"`\n]+"`?)?(?:\s+linked to\s+[^`,;.!?\n]+?)?\s+in the source repository named in\s+`(?:\.\.\/)+package\.json`/i;
const installedPackage = /\b(?:installed\s+(?:[\w@./-]+\s+)?package|package\s+root|package(?:'s)?\s+install\s+directory)\b/i;
const sentenceBoundary = /(?<=[.!?][`"')\]]*)\s+|\n[ \t]*\n|\n(?=[ \t]*(?:[-*] |\d+\. |#{1,6} ))/;
const markdownLink = /\[[^\]\n]*\]\([ \t]*(?:<(?<angle>[^<>\n]+)>|(?<plain>[^<>\s)]+))(?:[ \t]+(?:"[^"\n]*"|'[^'\n]*'|\([^()\n]*\)))?[ \t]*\)/g;
const markdownCode = /(?<code>^[ \t]*(?<fence>`{3,}|~{3,})[^\n]*\n[\s\S]*?(?:^[ \t]*\k<fence>[`~]*[ \t]*$|(?![\s\S]))|(?<!`)(?<ticks>`+)(?!`)[^\n]*?(?<!`)\k<ticks>(?!`))/gm;
const markdownReference = new RegExp(`${markdownCode.source}|${markdownLink.source}`, "gm");
// Scratch artifacts and consumer checkout names, not files in the install.
const artifacts = /^(?:(?:AGENTS|CHANGELOG|CLAUDE|REVIEW|ITERATION|audit|snapshot|spec|ledger|context|meta-prompt|gauntlet|name)\.md$|doc\/gauntlet\.md$|extensions\/x\.test\.ts$|(?:doc\/(?:specs|plans|cache)|docs|\.pi|pkg-x|repo-a\/pkg-x|eval|src)\/|\d{4}-\d\d-\d\d-)/;

function scanPathReferences(text, visit) {
  for (const sentence of text.split(sentenceBoundary)) {
    const installed = installedPackage.test(sentence);
    for (const match of sentence.matchAll(pathReference)) {
      const [ref] = match;
      const rooted = packageRooted.test(ref);
      if (rooted && sourceRepositorySuffix.test(sentence.slice(match.index + ref.length))) continue;
      if (artifacts.test(ref) || (!rooted && ref.endsWith(".ts") && !ref.includes("../"))) {
        if (installed) visit(ref, "");
      } else {
        visit(ref);
      }
    }
  }
}

function referenceBase(file, ref) {
  return packageRooted.test(ref) ? "" : dirname(file);
}

function instructionFileRows(text) {
  const table = text.match(/const instructionFiles = \{([^}]+)\}/)?.[1] ?? "";
  return table.matchAll(/([\w]+):\s*"([^"]+)"/g);
}

function stripMarkdownLinks(body, linkBase, visit) {
  return body
    .replace(/^  touched-files: .*$/gm, "") // example reviewer output
    .replace(/^\| .*? \| checker fixtures: .*? \| Task \d+ \|$/gm, "")
    .replace(markdownReference, (...args) => {
      const { code, angle, plain } = args.at(-1);
      if (code) return code.replace(markdownLink, "");
      const target = (angle ?? plain).split("#", 1)[0];
      if (target && !/^(?:[a-z][\w+.-]*:|\/)/i.test(target)) visit(target, linkBase);
      return "";
    })
    .replace(/https?:\/\/[^\s)\]`]+/g, "")
    .replace(/(<[\w -]+>|\$[A-Z_]+)\/([\w./-]*[\w/-])(\.*)/g, (_, prefix, ref, punctuation) => {
      if (prefix.toLowerCase() === "<package root>") visit(ref, "");
      return punctuation;
    });
}

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
  const consentPhrase = `explicit prose requesting ${entry}/the gauntlet,`;
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
      const match = line.replaceAll(consentPhrase, " ").replaceAll("\\/", "/").match(pattern);
      if (match) hits.push(`${path}:${i + 1}: ${match[0]}`);
    }
  }
  return hits.sort();
}

export function lintReleaseNotes(changelog) {
  const sections = changelog.split(/^## /m).slice(1);
  const notes = sections.find(s => /^v9\.0\.0(?: |\n)/.test(s)) ?? sections.find(s => s.startsWith("Unreleased\n")) ?? "";
  const rows = new Map([...notes.matchAll(/^\| `([^`\n]+)` \| (.+) \|$/gm)].map(([, old, destination]) => [old, destination]));
  const errors = [];
  function expect(old, ...destinations) {
    for (const destination of destinations) {
      if (!rows.get(old)?.includes(destination)) errors.push(`release-notes: ${old} -> ${destination}`);
    }
  }
  const code = text => `\`${text}\``;
  const section = (block, name) => `${code(`# ${block}`)} > ${code(`## ${name}`)}`;
  const [plan, waves, loop, council, ship, worktrees, verify, request, receive, parallel, tdd] = steps;
  expect(`/skill:${entry}`, code("/skill:gauntlet"), section("gauntlet", "brainstorm"));
  for (const [old, file] of [
    [plan, "plan/plan.md"], [waves, "implement/waves/waves.md"], [loop, "implement/loop/loop.md"],
    [council, "brainstorm/council.md"], [ship, "ship/ship.md"], [worktrees, "worktrees.md"],
    [verify, "verify/verify.md"], [request, "requesting-review.md"], [receive, "receiving-review.md"],
    [parallel, "implement/waves/parallel-agents.md"], [tdd, "implement/tdd.md"],
  ]) expect(`/skill:${old}`, code(`${tree}/${file}`), file.includes("/") ? section("gauntlet", file.split("/")[0]) : "Directly under `# gauntlet`");
  for (const [old, owner, ids] of [
    [entry, "brainstorm", "understand-the-idea present-the-design cut-question relatedness-before-provisioning user-review-gate human-batch"],
    [plan, "plan", "step-6-baseline-failure step-6-baseline-dirty step-6-contract-questions"],
    [waves, "implement", "stop-note"], [loop, "implement", "human-stop discard-authorization"], [verify, "verify", "step-6"],
    [ship, "ship", "step-4 carried-open pr-subject-row-1 option-5"], [worktrees, "gauntlet", "step-3 detached-head"],
  ]) for (const id of ids.split(" ")) expect(`${old}/${id}`, code(`${owner}/${id}`));
  expect(`${overrides}.md`, code("gauntlet.md"));
  for (const [old, ...destinations] of [
    ["Issue tracker", section("shared", "issue-tracker")], [worktrees, section("shared", "worktrees"), "`# gauntlet`"],
    ["PR gate", section("shared", "verification"), "`verification command`", "`requires credentials`", "`# gatekeep-pr`"],
    [verify, section("gauntlet", "verify"), section("shared", "verification")], ["cleanup", section("shared", "cleanup")],
    ["shape-ticket", section("shared", "siblings"), "`# shape-ticket`"], ["Deployment", section("shared", "deployment")],
    ["Spec index", section("shared", "spec-index")], ["Happy path", section("gauntlet", "happy-path")], ["documentation", section("gauntlet", "documentation")],
    ["Capabilities", section("shape-ticket", "capabilities")], ["Ticket wording", section("shape-ticket", "wording")],
    ["Response channels", section("chase-bug", "response-channels")], ["Delivery", section("check-delivery", "delivery")],
    ["housekeeping", "`# housekeeping`"], ["<skill-name>", "`# <skill-name>`"], ["conventions", "No longer read"], ["comms style", "No longer read"],
  ]) expect(`## ${old}`, ...destinations);
  if (!/finish an interrupted run before upgrading, or finish it on the previous major/i.test(notes)) errors.push("release-notes: interrupted run");
  if (!/omit earlier records until you run `gauntlet-telemetry-seal --migrate-records`/.test(notes)) errors.push("release-notes: earlier records");
  return errors;
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
  const readers = new Map(globSync(`${tree}/**/*`, { cwd: root })
    .filter(file => statSync(join(root, file)).isFile()).sort().map(file => [file, new Set()]));
  const assigned = new Map([[`${tree}/SKILL.md`, tree]]);
  for (const [, name, dir] of section.matchAll(anchorRow)) {
    const path = join(tree, dir, name);
    const expected = dirname(path);
    if (readers.has(path)) {
      assigned.set(path, expected);
    } else {
      const sameName = [...readers.keys()].filter(file => basename(file) === name);
      if (!sameName.length) errors.push(`${path}: anchor file missing; expected directory ${expected}`);
      for (const file of sameName) errors.push(`${file}: same name as missing anchor; expected directory ${expected}`);
    }
  }
  const tracker = "extensions/phase-tracker.ts";
  if (files.includes(tracker)) {
    for (const [, step, file] of instructionFileRows(read(tracker))) {
      const dir = step === "waves" || step === "loop" ? `implement/${step}` : step;
      if (step !== "brainstorm" && directories.has(dir)) assigned.set(join(tree, file), join(tree, dir));
    }
  }
  for (const file of readers.keys()) {
    if (!file.endsWith(".md")) continue;
    const base = dirname(file);
    // A tracker file counts in its assigned phase even when the tracker names a misplaced path.
    const reader = file === `${tree}/SKILL.md` ? `${tree}/brainstorm` : assigned.get(file) ?? base;
    const visit = (ref, base = referenceBase(file, ref)) => {
      const target = join(base, ref);
      if (target !== file) readers.get(target)?.add(reader);
    };
    scanPathReferences(stripMarkdownLinks(read(file), base, visit), visit);
  }
  for (const [file, readersOfFile] of readers) {
    const actual = dirname(file);
    let expected = assigned.get(file);
    if (!expected && readersOfFile.size) {
      const phaseReaders = [...readersOfFile].filter(dir => dir !== tree);
      expected = phaseReaders[0] ?? tree;
      for (const dir of phaseReaders.slice(1)) {
        while (expected !== "." && dir !== expected && !dir.startsWith(`${expected}/`)) expected = dirname(expected);
      }
    }
    if (expected !== actual) {
      errors.push(`${file}: actual directory ${actual}; expected ${expected ?? "no directory (no run reader or anchor)"}`);
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
  function check(file, ref, base = referenceBase(file, ref)) {
    const target = join(base, ref);
    if (target.startsWith("../") || !statSync(join(root, target), { throwIfNoEntry: false })?.isFile()) {
      errors.add(`${file}: ${ref}`);
    }
  }
  const read = file => readFileSync(join(root, file), "utf8");
  for (const file of files.filter(f => f.endsWith(".md"))) {
    let body = read(file);
    if (file === "skills/forge-skill/SKILL.md") {
      // The placement table declares its base and directory separately from each filename.
      body = body.replace(anchorRow, (_, name, dir, owner) => {
        check(file, name, join(tree, dir));
        if (/^`[\w-]+\.md`$/.test(owner)) check(file, owner.slice(1, -1), join(tree, dir));
        return "";
      });
    }
    const text = stripMarkdownLinks(body, dirname(file), (ref, base) => check(file, ref, base));
    if (file.startsWith("skills/") && !file.startsWith(`${tree}/`)) {
      for (const [, ref, number] of text.matchAll(/`([\w./-]+\.md)` Step (\d+[a-z]?)\b/gi)) {
        const target = join(referenceBase(file, ref), ref);
        if (!target.startsWith(`${tree}/`) || !statSync(join(root, target), { throwIfNoEntry: false })?.isFile()) continue;
        if (!new RegExp(`^#{1,6} (?:Step )?${number}\\b`, "im").test(read(target))) errors.add(`${file}: ${ref} Step ${number}`);
      }
    }
    scanPathReferences(text, (ref, base) => check(file, ref, base));
  }
  for (const file of files.filter(f => f.endsWith(".ts"))) {
    const text = read(file);
    const messages = text.replace(/new URL\(["'`]([^$"'`]+\.(?:md|mjs))["'`],\s*import\.meta\.url\)/g, (_, ref) => {
      check(file, ref, dirname(file));
      return "";
    }).replace(/^[\t ]*(?:\/\/|\/\*|\*).*$/gm, "")
      .matchAll(/"(?:[^"\\\n]|\\[\s\S])*"|'(?:[^'\\\n]|\\[\s\S])*'|`((?:[^`\\]|\\[\s\S])*)`/g);
    for (const [literal, template] of messages) {
      // Template delimiters are source syntax; escaped backticks belong to the emitted Markdown.
      const message = template === undefined ? literal.slice(1, -1) : template.replace(/\\[\\`]/g, escape => escape === "\\`" ? "`" : escape);
      const prose = stripMarkdownLinks(message, dirname(file), (ref, base) => check(file, ref, base));
      scanPathReferences(prose, (ref, base) => {
        if (base === "" || packageRooted.test(ref) || /^(?:\.\.\/)+(?:skills\/.+\.md|package\.json)$/.test(ref)) check(file, ref, base);
      });
    }
    const base = text.match(/new URL\(`([^`]+)\/\$\{file\}`, import\.meta\.url\)/)?.[1];
    if (base) {
      const refs = [...instructionFileRows(text)].map(([, , ref]) => ref)
        .concat([...text.matchAll(/gauntletFile\("([^"]+)"\)/g)].map(([, ref]) => ref));
      for (const ref of refs) check(file, ref, join(dirname(file), base));
    }
  }
  return [...errors].sort();
}

const overrideSections = {
  shared: {
    "issue-tracker": ["tracker-facing skills", "tracker-reading extensions"],
    worktrees: ["`gauntlet`", "`gatekeep-pr`", "`housekeeping`", "`gauntlet-resume`"],
    verification: ["`gauntlet`", "`gatekeep-pr`", "`chase-bug`", "`housekeeping`"],
    cleanup: ["`gatekeep-pr`", "`gauntlet`"],
    siblings: ["`shape-ticket`", "`gauntlet`", "`gauntlet-resume`", "phase tracker extension"],
    deployment: ["`shape-ticket`", "`gauntlet`"],
    "spec-index": ["`gauntlet-spec-index`"],
  },
  gauntlet: {
    ...Object.fromEntries(phases.map(phase => [phase, phase === "implement" ? ["waves", "loop"] : [`${phase} phase`]])),
    "happy-path": ["plan step", "`plan-writer`", "both implementation engines"],
    documentation: ["`documentation-impact.md`"],
  },
  "shape-ticket": { capabilities: ["`shape-ticket`"], wording: ["`shape-ticket`"] },
  "chase-bug": { "response-channels": ["`chase-bug`"] },
  "check-delivery": { delivery: ["`check-delivery`"] },
  "gatekeep-pr": {}, housekeeping: {}, linear: {}, "forge-skill": {},
  "gauntlet-handoff": {}, "gauntlet-resume": {}, "gauntlet-performance": {},
};

export function lintOverridesFile(text) {
  const errors = [];
  let block, fence;
  for (const line of text.split("\n")) {
    if (fence) {
      const close = line.match(/^ {0,3}(`+|~+)\s*$/)?.[1];
      if (close?.startsWith(fence)) fence = undefined;
      continue;
    }
    fence = line.match(/^ {0,3}(`{3,}|~{3,})/)?.[1];
    const heading = line.match(/^(#{1,2}) (.+)$/);
    if (!heading) continue;
    const [, level, name] = heading;
    if (level === "#") {
      block = name;
      if (!Object.hasOwn(overrideSections, block)) errors.push(`unknown block: ${block}`);
    } else if (!Object.hasOwn(overrideSections, block) || !Object.hasOwn(overrideSections[block], name)) {
      errors.push(`unknown section: ${block ?? "(no block)"}/${name}`);
    }
  }
  return errors;
}

export function lintOverridesOutline(readme) {
  const outline = readme.split(/^### What you can tweak\s*$/m)[1]?.split(/^#{1,3} /m, 1)[0] ?? "";
  const missing = new Set(Object.entries(overrideSections).flatMap(([name, sections]) =>
    [name, ...Object.keys(sections).map(section => `${name}/${section}`)]));
  const errors = [];
  let block;
  for (const line of outline.split("\n").filter(line => /^\s*- /.test(line))) {
    const row = line.match(/^( *)- `(#|##) ([a-z0-9-]+)` - (.+)$/);
    if (!row) {
      errors.push(`malformed outline row: ${line}`);
      continue;
    }
    const [, indent, level, name, description] = row;
    const isBlock = level === "#";
    if (isBlock) block = name;
    const path = isBlock ? block : `${block}/${name}`;
    if (indent !== (isBlock ? "" : "  ") || !missing.delete(path)) {
      errors.push(`unexpected or duplicate outline row: ${path}`);
      continue;
    }
    const readers = !isBlock ? overrideSections[block][name] : block === "shared" ? []
      : block === "gauntlet" ? ["every run file"] : [`\`${block}\``];
    for (const reader of readers) {
      if (!description.toLowerCase().includes(reader)) errors.push(`${path}: missing reader ${reader}`);
    }
  }
  return [...errors, ...[...missing].map(path => `missing outline row: ${path}`)];
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
