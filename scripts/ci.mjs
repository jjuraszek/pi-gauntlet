#!/usr/bin/env node
// Repo validator. Runs in CI and as the release gate.
// Run `npm install` first: telemetry tests use `yaml`.
//
// Usage:
//   node scripts/ci.mjs                      # validate repo
//   node scripts/ci.mjs --expect-version X   # also assert package.json == X (tag gate)

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { scanTree } from "../eval/lib/hygiene.mjs";
import { lintAll } from "../eval/lib/lint.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const R = (p) => join(root, p);

const errors = [];
const fail = (msg) => errors.push(msg);
const ok = (msg) => console.log(`  ok  ${msg}`);

execFileSync(process.execPath, ["--test", R("scripts/gauntlet-tree-lint.test.mjs"), R("scripts/retired-names.test.mjs")], { stdio: "inherit" });

const expectIdx = process.argv.indexOf("--expect-version");
const expectVersion = expectIdx !== -1 ? process.argv[expectIdx + 1] : null;

// telemetry-ref-lint:begin
function retiredTelemetryReferences(path, text) {
  if (path === "CHANGELOG.md" || path.startsWith("doc/specs/") ||
      /^eval\/.*\/(?:results\/.*|report\.md|intent\.md)$/.test(path) ||
      ["extensions/lib/telemetry-branch.ts", "src/bins/gauntlet-telemetry-seal.mjs",
        "src/bins/gauntlet-telemetry-ref-migration.test.mjs", "bin/gauntlet-telemetry-seal.mjs",
        "bin/gauntlet-performance.mjs", "bin/gauntlet-spec-index.mjs", "scripts/ci.mjs"].includes(path)) return [];
  const retired = /refs\/heads\/gauntlet\/telemetry|orphan `gauntlet\/telemetry` branch|gauntlet\/telemetry` branch|fetch `gauntlet\/telemetry` |branches-ignore/;
  let migration = false;
  return text.split("\n").flatMap((text, index) => {
    if (path === "doc/configuration.md" && /^#{1,4} /.test(text)) {
      migration = text === "#### Moving off the gauntlet/telemetry branch";
    }
    return !migration && retired.test(text) ? [{ line: index + 1, text }] : [];
  });
}
// telemetry-ref-lint:end
for (const path of execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" }).split("\0").filter(Boolean)) {
  for (const hit of retiredTelemetryReferences(path, readFileSync(R(path), "utf8"))) {
    fail(`${path}:${hit.line}: retired telemetry branch reference: ${hit.text}`);
  }
}

// ---- package.json ----------------------------------------------------------
const pkg = JSON.parse(readFileSync(R("package.json"), "utf8"));

if (!pkg.name) fail("package.json: missing name");
if (!/^\d+\.\d+\.\d+/.test(pkg.version || "")) fail(`package.json: bad version "${pkg.version}"`);
if (pkg.private) fail("package.json: private:true would block publish");
if (!pkg.license) fail("package.json: missing license field");
if (pkg.engines?.node !== ">=24.15.0") fail('package.json: engines.node must equal ">=24.15.0"');
if (pkg.bin?.["gauntlet-spec-index"] !== "bin/gauntlet-spec-index.mjs") fail("package.json: bin.gauntlet-spec-index must point at bin/gauntlet-spec-index.mjs");
if (pkg.bin?.["gauntlet-telemetry-seal"] !== "bin/gauntlet-telemetry-seal.mjs") fail("package.json: bin.gauntlet-telemetry-seal must point at bin/gauntlet-telemetry-seal.mjs");
if (pkg.bin?.["gauntlet-performance"] !== "bin/gauntlet-performance.mjs") fail("package.json: bin.gauntlet-performance must point at bin/gauntlet-performance.mjs");
const dependencyKeys = Object.keys(pkg.dependencies || {}).sort();
if (JSON.stringify(dependencyKeys) !== JSON.stringify(["yaml"])) {
  fail(`package.json: dependencies must contain exactly "yaml" (got ${dependencyKeys.join(", ") || "none"})`);
}
if (!existsSync(R("LICENSE"))) fail("LICENSE file missing");
if (!existsSync(R("README.md"))) fail("README.md missing (npm shows it on the package page)");

const keywords = pkg.keywords || [];
if (!keywords.includes("pi-package"))
  fail('package.json: keywords must include "pi-package" (drives pi.dev/packages discovery)');
else ok('keyword "pi-package" present');

// files allowlist must ship what the postinstall persona copy needs
const files = pkg.files || [];
if (files.length === 0) {
  fail("package.json: no files allowlist (tarball would ship everything)");
} else {
  for (const need of ["agents", "bin"]) {
    if (!files.includes(need))
      fail(`package.json: files allowlist missing "${need}" (postinstall persona copy would break on npm install)`);
  }
  if (files.includes("agents") && files.includes("bin")) ok("files allowlist ships agents/ + bin/");
}

// pi skills resolve from a non-empty directory
const skillEntries = pkg.pi?.skills;
if (!Array.isArray(skillEntries) || skillEntries.length === 0) {
  fail("package.json: pi.skills missing");
} else {
  for (const rel of skillEntries) {
    const dir = R(rel.replace(/^\.\//, ""));
    if (!existsSync(dir) || !statSync(dir).isDirectory()) fail(`package.json: pi.skills points at missing dir ${rel}`);
    else if (readdirSync(dir).length === 0) fail(`package.json: pi.skills dir ${rel} is empty`);
  }
}

// Extension entrypoints are explicit so Pi never auto-discovers tests or helpers.
const expectedExtensions = [
  "./extensions/phase-tracker.ts",
  "./extensions/plan-tracker.ts",
  "./extensions/verify-before-ship.ts",
  "./extensions/telemetry.ts",
];
const extensionEntries = pkg.pi?.extensions;
if (!Array.isArray(extensionEntries) || extensionEntries.length === 0) {
  fail("package.json: pi.extensions missing");
} else {
  const actual = [...extensionEntries].sort();
  const expected = [...expectedExtensions].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`package.json: pi.extensions must be exactly ${expectedExtensions.join(", ")} (got ${extensionEntries.join(", ")})`);
  }
  for (const rel of extensionEntries) {
    const file = R(rel.replace(/^\.\//, ""));
    if (!/\.(ts|js)$/.test(rel) || !existsSync(file) || !statSync(file).isFile()) {
      fail(`package.json: pi.extensions points at invalid extension file ${rel}`);
    }
  }
}
ok("pi manifest resources resolve");

// ---- version consistency: package.json == CHANGELOG top ==------------------
const changelog = readFileSync(R("CHANGELOG.md"), "utf8");
const clMatch = changelog.match(/^##\s+v(\d+\.\d+\.\d+)/m);
if (!clMatch) fail("CHANGELOG.md: no `## vX.Y.Z` heading found");
else if (clMatch[1] !== pkg.version)
  fail(`version drift: package.json ${pkg.version} != CHANGELOG top v${clMatch[1]}`);
else ok(`version aligned: ${pkg.version} == CHANGELOG top`);

if (expectVersion && expectVersion !== pkg.version)
  fail(`tag/version drift: pushed tag v${expectVersion} != package.json ${pkg.version}`);
else if (expectVersion) ok(`tag matches package.json (${pkg.version})`);

// ---- shared AGENTS core: AGENTS.md region == AGENTS.core.md ----------------
{
  const norm = (s) => s.replace(/\r\n/g, "\n").trim();
  const core = norm(readFileSync(R("AGENTS.core.md"), "utf8"));
  const agents = readFileSync(R("AGENTS.md"), "utf8");
  const b = agents.indexOf("<!-- agents-core:begin");
  const e = agents.indexOf("<!-- agents-core:end");
  if (b === -1 || e === -1) fail("AGENTS.md: missing agents-core begin/end markers");
  else if (norm(agents.slice(agents.indexOf("\n", b) + 1, e)) !== core)
    fail("AGENTS.md shared core drifted from AGENTS.core.md (run: node scripts/check-agents-core.mjs --fix)");
  else ok("AGENTS.md shared core matches AGENTS.core.md");
}

// ---- frontmatter on every skill + agent ------------------------------------
const hasFrontmatter = (file, required) => {
  const txt = readFileSync(file, "utf8");
  const m = txt.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return `no YAML frontmatter`;
  for (const field of required) if (!new RegExp(`^${field}:`, "m").test(m[1])) return `missing "${field}"`;
  return null;
};

for (const d of readdirSync(R("skills"))) {
  const skill = R(`skills/${d}/SKILL.md`);
  if (!existsSync(skill)) { fail(`skills/${d}: no SKILL.md`); continue; }
  const err = hasFrontmatter(skill, ["name", "description"]);
  if (err) fail(`skills/${d}/SKILL.md: ${err}`);
}
ok(`${readdirSync(R("skills")).length} skills have frontmatter`);

const agents = readdirSync(R("agents")).filter((f) => f.endsWith(".md"));
for (const a of agents) {
  const err = hasFrontmatter(R(`agents/${a}`), ["name", "description"]);
  if (err) fail(`agents/${a}: ${err}`);
}
ok(`${agents.length} agents have frontmatter`);

// ---- stale rename tokens (post-v4 regression guard) ------------------------
// "superpowers" alone is legit lineage; these renamed identifiers are not.
const forbidden = ["piSuperpowers", "PI_SUPERPOWERS_AGENT_DIR", "superpowers-overrides", "@jjuraszek/pi-superpowers"];
const scanDirs = ["skills", "extensions", "agents", "bin"];
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = join(dir, e.name);
  return e.isDirectory() ? walk(p) : [p];
});
const hits = [];
for (const base of scanDirs) {
  for (const file of walk(R(base))) {
    const txt = readFileSync(file, "utf8");
    for (const tok of forbidden) if (txt.includes(tok)) hits.push(`${file.replace(root + "/", "")}: "${tok}"`);
  }
}

if (hits.length) fail("stale rename tokens found:\n    " + hits.join("\n    "));
else ok("no stale rename tokens in skills/extensions/agents/bin");

const denylists = {};
for (const target of readdirSync(R("eval")).sort()) {
  const config = R(`eval/${target}/target.json`);
  if (!existsSync(config)) continue;
  const { denylist } = JSON.parse(readFileSync(config, "utf8"));
  if (denylist) denylists[target] = denylist;
}
const evalHits = scanTree(R("eval"), { denylists })
  .map((hit) => `eval/${hit.where}: ${hit.rule}`);
if (evalHits.length) fail(`eval/ hygiene:\n    ${evalHits.join("\n    ")}`);
else ok("eval/ hygiene: no private paths, stray owner handles, secrets or denylist tokens");

// ---- subtractive review pass (over-spec kind + closure removal) -------------
// wave-contract-checks:begin
function retiredDispatch(path, text) {
  return (/^skills\/.*\.md$/.test(path) || /^agents\/[^/]+\.md$/.test(path)) && /^.*\bagent:\s*["'](?:spec-reviewer|code-reviewer)["'].*$/m.test(text);
}
function supersessionTarget(text) {
  return text.match(/^> \*\*Superseded by:\*\*[^\n]*\[[^\]]+\]\(([^)]+)\)/m)?.[1] ?? null;
}
// wave-contract-checks:end
for (const base of ["skills", "agents"]) {
  for (const file of walk(R(base)).filter(file => file.endsWith(".md"))) {
    const path = file.slice(root.length + 1);
    if (retiredDispatch(path, readFileSync(file, "utf8"))) fail(`${path}: retired reviewer dispatch`);
  }
}
const predecessor = R("doc/specs/2026-10-29-orchestrator-delegation-guard.md");
const successor = supersessionTarget(readFileSync(predecessor, "utf8"));
if (successor !== "./2026-10-30-slim-subagent-dispatch.md" || !existsSync(join(dirname(predecessor), successor))) fail("delegation guard: missing or wrong supersession target");

const subtractiveErrorsBefore = errors.length;
const txt = (p) => readFileSync(R(p), "utf8");
const tokenChecks = [
  // present
  ["agents/spec-council-member.md", "over-spec", true],
  ["agents/spec-council-member.md", "\nlean: nothing to cut | <N> over-spec findings above\n", true],
  ["agents/spec-council-synthesizer.md", "over-spec:", true],
  ["agents/spec-council-synthesizer.md", "\nlean: <k> of <n> members found nothing to cut\n", true],
  ["skills/gauntlet/brainstorm/council.md", "Human input (verbatim", true],
  ["skills/shape-ticket/SKILL.md", "`^lean:` line", true],
  ["skills/shape-ticket/reference/ac-classes.md", "a CI or workflow run result, a pull request's title, body, state or review, a merge, or a full verification-suite run", true],
  ["agents/conformance-reviewer.md", "(over-spec)", true],
  ["agents/conformance-reviewer.md", "a CI or workflow run result, a pull request's title, body, state or review, a merge, or a full verification-suite run", true],
  ["agents/conformance-reviewer.md", "This is the only exception to", false],
  ["agents/wave-reviewer.md", "met | unmet | out-of-scope", true],
  ["skills/gauntlet/implement/waves/wave-reviewer-prompt.md", "TRAJECTORY: CONVERGING", true],
  ["skills/gauntlet/implement/waves/dispatch-contract.md", "WAVE_VERDICT_SCHEMA", true],
  ["skills/gauntlet/plan/plan-contract.md", "is never waivable", true],
  ["skills/gauntlet/plan/plan-contract.md", "a CI or workflow run result, a pull request's title, body, state or review, a merge, or a full verification-suite run", true],
  // council provenance / probe-before-apply / standing amend approval
  ["agents/spec-council-member.md", "probed:", true],
  ["agents/spec-council-member.md", "End every finding with `probed:`", true],
  ["agents/spec-council-synthesizer.md", "grounded|hypothesis:", true],
  ["agents/spec-council-applier.md", "clusters that assert data shape, ordering, or semantics", true],
  ["agents/spec-council-applier.md", "a CI or workflow run result, a pull request's title, body, state or review, a merge, or a full verification-suite run", true],
  ["skills/gauntlet/brainstorm/council.md", "outputMode: \"file-only\"", true],
  ["skills/shape-ticket/SKILL.md", "outputMode: \"file-only\"", true],
  ["skills/gauntlet/amendment-surface.md", "waives per-diff review", true],
  // #27 gate removal / amendment path
  ["skills/gauntlet/SKILL.md", "## Amending an approved spec", true],
  ["skills/gauntlet/plan/plan.md", "#amending-an-approved-spec", true],
  ["skills/gauntlet/implement/waves/prerequisites.md", "#amending-an-approved-spec", true],
  ["skills/gauntlet/ship/ship.md", "#amending-an-approved-spec", true],
  ["skills/gauntlet/SKILL.md", "Ask once whether the design replaces", false],
  ["skills/gauntlet/SKILL.md", "get approval after each", false],
  ["skills/gauntlet/SKILL.md", "validate each", false],
  ["skills/gauntlet/SKILL.md", "Ask after each", false],
  ["skills/gauntlet/SKILL.md", "200-300-word sections", false],
  ["skills/gauntlet/SKILL.md", "## Marking superseded specs", false],
  ["skills/gauntlet/SKILL.md", "#marking-superseded-specs", false],
  ["skills/gauntlet/brainstorm/gatherer.md", "node <SPEC_INDEX> --query", true],
  ["skills/gauntlet/SKILL.md", "brainstorm/superseding.md", true],
  ["skills/gauntlet/plan/plan.md", "the spec is frozen once planning starts", false],
  // #52 scout predecessor anchors
  ["skills/gauntlet/brainstorm/gatherer.md", "Predecessor anchors", true],
  ["skills/gauntlet/brainstorm/gatherer.md", "modified file list missing for this spec", true],
  ["skills/gauntlet/brainstorm/gatherer.md", "Judge by topic; shared file paths never decide.", true],
  ["skills/gauntlet/brainstorm/gatherer.md", "too small for the confidence rule; no rows returned", true],
  ["skills/gauntlet/brainstorm/gatherer.md", "Predecessor: none (specs corpus too small:", true],
  ["skills/gauntlet/brainstorm/gatherer.md", "Docs touched: none (docs corpus too small:", true],
  // absent (retired rules)
  ["skills/gauntlet/conformance-check.md", "always** defers to the finish gate", false],
  ["skills/gauntlet/conformance-check.md", "`accept`/`rescope`/`UNAUTHORIZED`", false],
  ["agents/conformance-reviewer.md", "`accept`/`rescope`/`UNAUTHORIZED`", false],
  ["agents/conformance-reviewer.md", "harmless \u2192 `accept`", false],
  // absent (spec-in-hand resume path and pi-intercom are gone)
  ["skills/gauntlet/plan/plan.md", "spec in hand", false],
  ["skills/gauntlet/plan/plan.md", "Resuming with", false],
  ["skills/gauntlet/implement/waves/parallel-agents.md", "intercom", false],
  ["skills/gauntlet/SKILL.md", "intercom", false],
  ["doc/configuration.md", "intercom", false],
  // unchanged surface (must still be present)
  ["skills/gauntlet/conformance-check.md", "keep `origin: none (scope creep)` verbatim", true],
  ["skills/gauntlet/conformance-check.md", "Unavailable: scope creep has no origin requirement to defer", true],
  ["agents/conformance-reviewer.md", "use the literal `none (scope creep)`", true],
  // #36 hotfix worktree binding
  ["skills/chase-bug/hotfix.md", 'context: "fresh"', true],
  ["skills/chase-bug/hotfix.md", "fork context", false],
  ["skills/chase-bug/hotfix.md", "git -C <WORKTREE>", true],
  ["skills/gauntlet/SKILL.md", "`amendment-surface.md`", true],
  ["skills/gauntlet/SKILL.md", "Show `git -C <abs worktree path> --no-pager diff -- <spec path>`", false],
  ["skills/gauntlet/amendment-surface.md", "Mode: amendment-review", true],
  ["skills/gauntlet/amendment-surface.md", "auto-apply", true],
  ["skills/gauntlet/amendment-surface.md", "escalate", true],
  ["skills/gauntlet/amendment-surface.md", "Reviewer:", true],
  ["skills/gauntlet/amendment-surface.md", "applying as recommended", true],
  ["skills/gauntlet/amendment-surface.md", "or: no plan yet", false],
  ["skills/gauntlet/ship/disposition-protocol.md", "Reviewer:", true],
  ["agents/spec-council-member.md", "Mode: amendment-review", true],
  ["skills/gauntlet/ship/ship.md", "Amendments auto-applied", true],
  // #41 ticket ACs carried verbatim into the spec
  ["skills/gauntlet/brainstorm/ticket-acceptance.md", "## Acceptance criteria", true],
  ["skills/gauntlet/brainstorm/spec-finalization.md", "**Ticket contract present.**", true],
  ["skills/gauntlet/brainstorm/ticket-acceptance.md", "none - ticket has no acceptance criteria", true],
  ["skills/gauntlet/brainstorm/ticket-acceptance.md", "**Write the section in every spec**, after `## Problem`:", true],
  ["skills/gauntlet/brainstorm/gatherer.md", "verbatim", true],
  ["skills/gauntlet/brainstorm/gatherer.md", "Ticket acceptance criteria (verbatim)", true],
  ["agents/spec-council-member.md", "deferred:", true],
  ["agents/spec-council-member.md", "operates-without-it", false],
  ["agents/spec-council-member.md", "elsewhere:", true],
  ["agents/spec-council-member.md", "no human input to match", true],
  ["agents/conformance-reviewer.md", "recorded in spec? yes", true],
  ["skills/gauntlet/conformance-check.md", "The spec's `## Acceptance criteria` section", true],
  ["skills/gauntlet/conformance-check.md", "`in-scope`/`venue:` rows are requirements", true],
  ["skills/gauntlet/plan/plan-contract.md", "deviates:", true],
  ["skills/gauntlet/plan/plan-contract.md", "table only `in-scope` and `venue:` rows", true],
  ["skills/gauntlet/ship/ship.md", "## Acceptance criteria", true],
  ["skills/gauntlet/ship/ship.md", "- deferred: <where>", true],
  ["skills/gauntlet/ship/ship.md", "When the spec's `## Acceptance criteria` has at least one `venue:`, `deferred:`, or `elsewhere:` row", true],
  // #40 gauntlet-handoff ownership boundary: delegates the core brief to cohort, never copies it
  ["skills/gauntlet-handoff/SKILL.md", "phase_tracker", true],
  ["skills/gauntlet-handoff/SKILL.md", "plan_tracker", true],
  ["skills/gauntlet-handoff/SKILL.md", "reference/brief-contract.md", true],
  ["skills/gauntlet-handoff/SKILL.md", "/skill:handoff", true],
  ["skills/gauntlet-handoff/SKILL.md", "node_modules/pi-cohort", false],
  ["skills/gauntlet-handoff/SKILL.md", ".pi/agent", false],
  // spec-gate approval menu: rows 1/2 grant by default; flags retain review or fund the selected engine
  ["skills/gauntlet/brainstorm/spec-finalization.md", "1 - plan engine:", true],
  ["skills/gauntlet/brainstorm/spec-finalization.md", "2 - loop engine:", true],
  ["skills/gauntlet/brainstorm/spec-finalization.md", "`1 --amends-stop` | approve; persist `none`; engine `waves`", true],
  ["skills/gauntlet/brainstorm/spec-finalization.md", "`2 --amends-stop` | approve; persist `none`; engine `loop`", true],
  ["skills/gauntlet/brainstorm/spec-finalization.md", "`--fund-rounds=N`: fund up to N extra fix rounds per task after its escalated round", true],
  ["skills/gauntlet/brainstorm/spec-finalization.md", "`--allowance=N`: attempts per row before the loop stops and asks (default: <n>)", true],
  ["skills/gauntlet/brainstorm/spec-finalization.md", "Approve to proceed", false],
  ["skills/gauntlet/amendment-surface.md", "The gate grants on a `1` or `2` approval without `--amends-stop`", true],
  ["skills/gauntlet/amendment-surface.md", "is an invalid reply and never a grant", true],
  ["README.md", "Experimental approval options", false],
  ["README.md", "experimental loop", false],
  ["doc/configuration.md", "experimental option", false],
  ["doc/implement-engines.md", "experimental loop engine", false],
  ["doc/personas.md", "experimental loop engine", false],
  // standing grant lives in the spec header, read by gauntlet-resume; the brief grammar stays grant-free
  ["skills/gauntlet-resume/SKILL.md", "**Amend-grant:**", true],
  ["skills/gauntlet-resume/SKILL.md", "Standing grant active:", true],
  ["skills/gauntlet-resume/SKILL.md", "No standing grant.", true],
  ["skills/gauntlet-handoff/SKILL.md", "Amend-grant", false],
  ["skills/gauntlet-resume/reference/brief-contract.md", "Amend-grant", false],
];
for (const [file, tok, want] of tokenChecks) {
  const has = txt(file).includes(tok);
  if (has !== want) fail(`${file}: token "${tok.trim()}" ${want ? "missing" : "must be absent"}`);
}
// spec-gate approval menu: the default grant sentence is byte-identical in the gate's
// default grant line (1x) and both tier-2 footers (2x); any other count is drift
{
  const GRANT_SENTENCE =
    "every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.";
  const count = (file) => txt(file).split(GRANT_SENTENCE).length - 1;
  for (const [file, want] of [
    ["skills/gauntlet/brainstorm/spec-finalization.md", 1],
    ["skills/gauntlet/amendment-surface.md", 2],
  ]) {
    const n = count(file);
    if (n !== want) fail(`${file}: grant description sentence occurs ${n}x, expected ${want}x`);
    else ok(`${file}: grant description sentence ${want}x`);
  }
}
// #36: the first-command toplevel guard must live inside hotfix.md step 4
{
  const hf = txt("skills/chase-bug/hotfix.md");
  const s = hf.indexOf("4. **Implement.**");
  const e = hf.indexOf("5. **Test.**");
  if (s < 0 || e < 0 || e < s) fail("skills/chase-bug/hotfix.md: step 4 / step 5 headings not found in order");
  else {
    const step4 = hf.slice(s, e);
    for (const tok of ["Your first command, before any", "git rev-parse --show-toplevel"]) {
      if (!step4.includes(tok)) fail(`skills/chase-bug/hotfix.md: step 4 lacks "${tok}"`);
    }
  }
}
// Both council probes name ^lean:.
const roastProbeHits = (txt("skills/gauntlet/brainstorm/council.md").match(/`\^lean:` line/g) || []).length;
if (roastProbeHits < 2) fail(`skills/gauntlet/brainstorm/council.md: expected ^lean: in both member and chair probes, found ${roastProbeHits}`);
if (!existsSync(R("skills/gauntlet/brainstorm/superseding.md"))) {
  fail("skills/gauntlet/brainstorm/superseding.md missing");
}
// Telemetry publication stays separate from product delivery and gatekeep-pr instructions.
{
  const trackedTelemetry = execFileSync("git", ["ls-files", "--", ".pi/gauntlet/telemetry"], { cwd: root, encoding: "utf8" }).trim();
  if (trackedTelemetry) fail(".pi/gauntlet/telemetry: migrate tracked records to refs/telemetry/records and remove them from the product branch");
  const worktreeFirst = txt("skills/gauntlet/SKILL.md").split(/^## /m).find((s) => s.startsWith("Worktree First")) ?? "";
  if (!worktreeFirst.includes("the `refs/telemetry/records` ref")) fail("skills/gauntlet/SKILL.md: Worktree First must publish telemetry outside the checkout");
  const finishing = txt("skills/gauntlet/ship/ship.md");
  if (!finishing.includes("gauntlet-telemetry-seal.mjs")) fail("skills/gauntlet/ship/ship.md: missing the gauntlet-telemetry-seal.mjs call");
  if (!finishing.includes("the `refs/telemetry/records` ref") || /telemetry\.dir|git-excluded/.test(finishing)) fail("skills/gauntlet/ship/ship.md: seal to the telemetry ref, not the product checkout");
  for (const opt of ["#### Option 1: Push and Create PR", "#### Option 2: Push and Create Draft PR", "#### Option 3: Squash-merge to base"]) {
    const block = finishing.split(opt)[1]?.split(/^#### /m)[0] ?? "";
    if (!block.includes("telemetry record")) fail(`skills/gauntlet/ship/ship.md: "${opt}" must name the telemetry record`);
  }
  if (!txt("skills/gatekeep-pr/reference/post-selection-loop.md").includes("#<N>@<head sha>: <outcome>")) fail("gatekeep-pr: missing per-PR settlement rows");
  for (const f of walk(R("skills/gatekeep-pr")).filter((f) => f.endsWith(".md"))) {
    if (/telemetry/i.test(readFileSync(f, "utf8"))) fail(`${f.replace(root + "/", "")}: gatekeep-pr must not mention telemetry`);
  }
}
// touched-files + over-spec in the same paragraph of conformance-check.md
const ccParas = txt("skills/gauntlet/conformance-check.md").split(/\n\s*\n/);
if (!ccParas.some((p) => p.includes("touched-files") && p.includes("over-spec"))) fail("conformance-check.md: no paragraph carries both `touched-files` and `over-spec`");
if (errors.length === subtractiveErrorsBefore) ok("subtractive review pass tokens present/absent as specified");

// ---- gauntlet-resume worktree path discipline ------------------------------
{
  const resumeErrorsBefore = errors.length;
  const resumeSkill = txt("skills/gauntlet-resume/SKILL.md");
  if (!resumeSkill.includes("git -C <worktree> rev-parse --path-format=absolute --git-common-dir")) {
    fail("gauntlet-resume: entry check 3 must compare the resolved worktree git-common-dir");
  }
  if (!resumeSkill.includes("git rev-parse --path-format=absolute --git-common-dir")) {
    fail("gauntlet-resume: entry check 3 must resolve the session git-common-dir absolutely");
  }
  if (resumeSkill.includes("restart pi in <worktree>")) {
    fail("gauntlet-resume: same-repo worktrees must not require restarting pi in the worktree");
  }
  for (const name of ["reconstruction", "restore-loop", "restore-plan", "plan-repair"]) {
    if (/\bgit (?!-C (?:<worktree>|"\$CHECKOUT"))/.test(txt(`skills/gauntlet-resume/reference/${name}.md`))) {
      fail(`gauntlet-resume ${name}: git commands must target the resolved worktree with -C`);
    }
  }
  if (errors.length === resumeErrorsBefore) ok("gauntlet-resume targets same-repo worktrees by path");
}

// ---- gauntlet-handoff + brief contract: one grammar file, delegated core (#40) ----
{
  const handoffErrorsBefore = errors.length;
  const { lintBriefGrammar, readSkillFiles, CONTRACT_FILE } = await import("./brief-contract-lint.mjs");
  const drift = lintBriefGrammar(readSkillFiles(root)).map((f) => `${f.file} [${f.rule}] ${f.text}`);
  if (drift.length) fail(`brief grammar must live only in ${CONTRACT_FILE}:\n    ` + drift.join("\n    "));

  const handoffSkill = "skills/gauntlet-handoff/SKILL.md";
  const handoffText = txt(handoffSkill);
  const coreHeading = handoffText.match(/^## (Intent|Repo state|Decisions|Open questions|Skills loaded)\s*$/m);
  if (coreHeading) fail(`${handoffSkill}: carries cohort core heading "${coreHeading[0].trim()}" - the skill delegates the core brief, never copies it`);

  // Path discipline: same banned tokens as scripts/stage-skill-lint.mjs (fenced `cd ` at statement
  // start, `git rev-parse --show-toplevel`, "switch into the worktree" prose) without adding
  // the handoff skill to the list of run files.
  const { lintStageSkill } = await import("./stage-skill-lint.mjs");
  const pathHits = lintStageSkill(handoffText).map((h) => `${handoffSkill}:${h.line} [${h.rule}] ${h.text}`);
  if (pathHits.length) fail("gauntlet-handoff must carry the worktree path, not cd into it:\n    " + pathHits.join("\n    "));

  if (errors.length === handoffErrorsBefore) ok("gauntlet-handoff/gauntlet-resume share one brief contract; producer delegates the core brief");
}

// ---- gate render-site inventory -------------------------------------------
{
  const { lintGateContract } = await import("./gate-contract-lint.mjs");
  const diagnostics = lintGateContract(root);
  for (const diagnostic of diagnostics) fail(diagnostic);
  if (!diagnostics.length) ok("gate render sites match doc/gate-contract.md");
  try {
    execFileSync(process.execPath, ["--test", R("scripts/gate-contract-lint.test.mjs")], { stdio: "pipe" });
    ok("gate contract lint fixtures pass");
  } catch (e) {
    fail(`gate contract lint fixtures failed:\n    ${String(e.stdout || e.stderr || e).split("\n").join("\n    ")}`);
  }
}

// ---- extension syntax (type-stripped parse) --------------------------------
for (const f of walk(R("extensions")).filter((f) => f.endsWith(".ts"))) {
  try {
    execFileSync(process.execPath, ["--experimental-strip-types", "--check", f], { stdio: "pipe" });
  } catch (e) {
    fail(`${f.replace(root + "/", "")}: syntax error\n    ${String(e.stderr || e).split("\n").slice(0, 3).join("\n    ")}`);
  }
}
ok("extensions parse clean (incl. lib/)");

// ---- bin bundles: rebuild + freshness (gh-39) -----------------------------
try {
  execFileSync(process.execPath, [R("scripts/build-bins.mjs")], { stdio: "pipe" });
} catch (e) {
  fail(`bin bundle build failed (run npm install first - esbuild is a devDependency):\n    ${String(e.stderr || e).split("\n").slice(0, 10).join("\n    ")}`);
}
{
  const dirty = execFileSync("git", ["status", "--porcelain", "--", "bin/"], { cwd: root, encoding: "utf8" }).trim();
  if (dirty) fail(`bin/ bundles are stale - run \`npm run build:bins\` and commit the result:\n    ${dirty.split("\n").join("\n    ")}`);
  else ok("bin bundles fresh");
}

// ---- resolver unit tests ---------------------------------------------------
try {
  execFileSync(
    process.execPath,
    [
      "--experimental-loader",
      R("extensions/test-support/pi-stubs.mjs"),
      "--test",
      R("extensions/lib/gauntlet-settings.test.ts"),
      R("extensions/lib/gauntlet-settings-loader.test.ts"),
      R("extensions/lib/checkout.test.ts"),
      R("extensions/lib/overrides.test.ts"),
      R("extensions/lib/plan-check.test.ts"),
      R("extensions/lib/phase-tracker-helpers.test.ts"),
      R("extensions/lib/tool-result-warnings.test.ts"),
      R("extensions/plan-tracker.test.ts"),
      R("extensions/phase-tracker.test.ts"),
      R("extensions/verify-before-ship.test.ts"),
      R("extensions/lib/telemetry-paths.test.ts"),
      R("extensions/lib/telemetry-record.test.ts"),
      R("extensions/lib/telemetry-collect.test.ts"),
      R("extensions/lib/telemetry-council.test.ts"),
      R("extensions/lib/telemetry-ship.test.ts"),
      R("extensions/telemetry.test.ts"),
      R("extensions/telemetry-leg.test.ts"),
      R("extensions/telemetry-leg-fields.test.ts"),
      R("extensions/telemetry-leg-rounds.test.ts"),
      R("extensions/telemetry-leg-no-write.test.ts"),
      R("extensions/telemetry-leg-trackers.test.ts"),
      R("extensions/telemetry-leg-failures.test.ts"),
      R("extensions/telemetry-settlement-contract.test.ts"),
      R("extensions/lib/telemetry-branch.test.ts"),
      R("bin/gauntlet-spec-index.test.mjs"),
      R("bin/gauntlet-telemetry-seal.test.mjs"),
      R("src/bins/gauntlet-telemetry-seal.test.mjs"),
      R("src/bins/gauntlet-telemetry-seal-branch.test.mjs"),
      R("src/bins/gauntlet-telemetry-jj.test.mjs"),
      R("src/bins/gauntlet-telemetry-readers.test.mjs"),
      R("src/bins/gauntlet-telemetry-migration.test.mjs"),
      R("src/bins/gauntlet-telemetry-ref-migration.test.mjs"),
      R("src/bins/gauntlet-telemetry-concurrency.test.mjs"),
      R("src/bins/gauntlet-telemetry-invariance.test.mjs"),
      R("bin/gauntlet-performance.test.mjs"),
      R("src/bins/gauntlet-performance-rollup.test.mjs"),
    ],
    { stdio: "pipe" },
  );
  ok("resolver and bin unit tests pass");
} catch (e) {
  fail(`resolver or bin unit tests failed:\n    ${String(e.stdout || e.stderr || e).split("\n").slice(0, 20).join("\n    ")}`);
}

try {
  execFileSync(process.execPath, ["--test", R("scripts/phase-tracker-host.test.mjs")], { stdio: "pipe" });
  ok("implement recovery respects Pi's settlement order");
} catch (e) {
  fail(`phase tracker host regression failed:\n${String(e.stdout || e.stderr || e)}`);
}

// ---- executable skill examples --------------------------------------------
try {
  execFileSync(process.execPath, ["--test", R("scripts/finish-verification.test.mjs")], { stdio: "pipe" });
  ok("finish verification skip checks pass real Git fixtures");
} catch (e) {
  fail(`finish verification skip checks failed:\n    ${String(e.stdout || e.stderr || e).split("\n").slice(0, 30).join("\n    ")}`);
}

try {
  execFileSync(process.execPath, ["--test", "--test-reporter=dot", R("scripts/happy-path-run.test.mjs"), R("scripts/implement-amendment.test.mjs"), R("scripts/skill-size-lint.test.mjs"), R("scripts/pi-cohort-floor-lint.test.mjs"), R("scripts/wave-review.test.mjs"), R("scripts/implement-failure-paths.test.mjs"), R("scripts/anchored-task.test.mjs"), R("scripts/gatekeep-comment-reconcile.test.mjs"), R("scripts/gatekeep-discovery-answered.test.mjs"), R("scripts/gate-teardown.test.mjs"), R("scripts/gatekeep-fix-loop-contract.test.mjs"), R("scripts/gatekeep-reject.test.mjs"), R("scripts/gatekeep-overrule.test.mjs"), R("scripts/brainstorming-contract.test.mjs"), R("scripts/brainstorming-plan-approval.test.mjs"), R("scripts/brainstorming-loop-approval.test.mjs"), R("scripts/brainstorming-funded-approval.test.mjs"), R("scripts/brainstorming-budget-only-approval.test.mjs"), R("scripts/brainstorming-allowance-approval.test.mjs"), R("scripts/brainstorming-rejected-replies.test.mjs"), R("scripts/brainstorming-pr-subject-gate.test.mjs"), R("scripts/brainstorming-worker-gate.test.mjs"), R("scripts/brainstorming-bare-approve.test.mjs"), R("scripts/brainstorming-council-reply.test.mjs"), R("scripts/brainstorming-draft-publication.test.mjs"), R("scripts/brainstorming-pr-regate-approval.test.mjs"), R("scripts/delivery-stage-authoring.test.mjs"), R("eval/conformance-reviewer/ci-step-is-the-change.test.mjs"), R("eval/conformance-reviewer/legs-verification-line.test.mjs"), R("eval/conformance-reviewer/prompt-stage-sentence.test.mjs"), R("eval/conformance-reviewer/stage-exclusion.test.mjs"), R("eval/spec-council-applier/pr-description-finding.test.mjs"), ...readdirSync(R("eval/lib")).filter((f) => f.endsWith(".test.mjs")).sort().map((f) => R(`eval/lib/${f}`))], { stdio: "pipe" });
  ok("happy-path and wave-review shell fixtures, PR comment, brainstorming source, delivery-stage authoring and eval contracts pass");
} catch (e) {
  fail(`happy-path, wave-review, PR comment, brainstorming, delivery-stage authoring or eval regression checks failed:\n    ${String(e.stdout || e.stderr || e).trimEnd().replaceAll("\n", "\n    ")}`);
}

try {
  execFileSync(process.execPath, [R("scripts/linear-download-doc.test.mjs")], { stdio: "pipe" });
  ok("Linear download recovery example passes offline fixture test");
} catch (e) {
  fail(`Linear download recovery example failed:\n    ${String(e.stdout || e.stderr || e).split("\n").slice(0, 20).join("\n    ")}`);
}

try {
  execFileSync(process.execPath, [R("scripts/stage-skill-lint.test.mjs")], { stdio: "pipe" });
  execFileSync(process.execPath, ["--test",
    R("scripts/loop-engine-contract.test.mjs"),
    R("scripts/loop-boundary-integration.test.mjs"),
    R("scripts/loop-conformance-grant.test.mjs"),
    R("scripts/loop-companion-recovery.test.mjs"),
    R("scripts/loop-dirty-tree-stop.test.mjs"),
    R("scripts/loop-implementer-actions.test.mjs"),
    R("scripts/loop-implementer-process.test.mjs"),
    R("scripts/loop-unreachable-cut.test.mjs"),
    R("scripts/loop-verification-repair.test.mjs"),
    R("scripts/loop-home-resume.test.mjs"),
    R("scripts/commit-message-contract.test.mjs"),
    R("scripts/resume-routes.test.mjs"),
  ], { stdio: "pipe" });
  ok("stage-skill lint fixtures pass");
} catch (e) {
  fail(`stage-skill lint fixtures failed:\n    ${String(e.stdout || e.stderr || e).split("\n").slice(0, 20).join("\n    ")}`);
}

try {
  execFileSync(process.execPath, [R("scripts/brief-contract-lint.test.mjs")], { stdio: "pipe" });
  ok("brief-contract lint fixtures pass");
} catch (e) {
  fail(`brief-contract lint fixtures failed:\n    ${String(e.stdout || e.stderr || e).split("\n").slice(0, 20).join("\n    ")}`);
}

// ---- no ad-hoc settings reads ----------------------------------------------
{
  const offenders = walk(R("extensions"))
    .filter((f) => f.endsWith(".ts"))
    .filter((f) => readFileSync(f, "utf8").includes("pi.settings"))
    .map((f) => f.replace(root + "/", ""));
  if (offenders.length) fail("pi.settings read found (route through the gauntlet-settings helper):\n    " + offenders.join("\n    "));
  else ok("no pi.settings reads in extensions");
}

// ---- stage skills: process in primary, work by path (#37) ---------------------
// Fenced `cd` that changes the process cwd, `git rev-parse --show-toplevel` derivation,
// and "switch into / from inside the worktree" prose are banned in the five stage skills.
{
  const { lintStageFiles } = await import("./stage-skill-lint.mjs");
  const offenders = lintStageFiles(root).map(
    (hit) => `${hit.file}:${hit.line} [${hit.rule}] ${hit.text}`,
  );
  if (offenders.length) fail("stage skills must carry the worktree path, not cd into it:\n    " + offenders.join("\n    "));
  else ok("stage skills carry the worktree path by value");
}

{
  const { lintTempPathScope } = await import("./stage-skill-lint.mjs");
  const offenders = lintTempPathScope(root).map(
    (hit) => `${hit.file}:${hit.line} [${hit.rule}] ${hit.text}`,
  );
  if (offenders.length) fail("gauntlet scratch must stay under its owning Git directory:\n    " + offenders.join("\n    "));
  else ok("gauntlet scratch paths stay under their owning Git directories");
}

{
  const { lintSkillSizes } = await import("./skill-size-lint.mjs");
  const errors = lintSkillSizes(root);
  if (errors.length) fail("instruction files exceed the single-read budget:\n    " + errors.join("\n    "));
  else ok("instruction files fit the single-read budget");
}
{
  const { lintPiCohortFloor } = await import("./pi-cohort-floor-lint.mjs");
  const errors = lintPiCohortFloor(root);
  if (errors.length) fail(errors.join("\n    "));
  else ok("pi-cohort peer and README floors match");
}

try {
  execFileSync(process.execPath, [R("scripts/commit-subject-lint.mjs")], { cwd: root, stdio: "pipe" });
  execFileSync(process.execPath, ["--test", R("scripts/commit-subject-lint.test.mjs")], { stdio: "pipe" });
  ok("commit-subject lint and fixtures pass");
} catch (e) {
  fail(`commit-subject lint or fixtures failed:\n    ${String(e.stdout || e.stderr || e).split("\n").slice(0, 20).join("\n    ")}`);
}

// ---- no provider/model literals in skills, personas, extensions (#42) -----------
try {
  execFileSync(process.execPath, [R("scripts/model-literal-lint.test.mjs")], { stdio: "pipe" });
  ok("model-literal lint fixtures pass");
} catch (e) {
  fail(`model-literal lint fixtures failed:\n    ${String(e.stdout || e.stderr || e).split("\n").slice(0, 20).join("\n    ")}`);
}
{
  const { lintModelLiterals } = await import("./model-literal-lint.mjs");
  const hits = lintModelLiterals(root).map((h) => `${h.path}:${h.line}: ${h.text}`);
  if (hits.length) {
    fail(
      hits.join("\n    ") +
        '\n    Skills never name a provider or model - see doc/configuration.md "Dispatch model precedence".',
    );
  } else ok("no provider/model literals in skills, agents, extensions");
}

// ---- eval targets: shared template shape -----------------------------------
{
  const targets = lintAll(R("eval"));
  const bad = Object.entries(targets).flatMap(([target, errs]) =>
    errs.map((err) => `eval/${target}: ${err}`));
  if (bad.length) fail("eval targets do not match the template shape:\n    " + bad.join("\n    "));
  else ok(`eval targets match the template shape (${Object.keys(targets).length} targets incl. _template)`);
}

// ---- Claude Code marketplace (.claude-plugin/) -------------------------------
// Guards the gh-11 allowlist: entries must be specific existing skill dirs with
// valid SKILL.md (existence-checked, not count-hardcoded); scan-leak paths
// (".", "./", "./skills", "./skills/") are banned. The root-source marketplace
// allowlist restricts skills; plugin.json suppresses default agent discovery.
{
  const mpErrorsBefore = errors.length;
  const mpPath = R(".claude-plugin/marketplace.json");
  if (!existsSync(mpPath)) {
    fail(".claude-plugin/marketplace.json missing");
  } else {
    let mp = null;
    let parsed = false;
    try {
      mp = JSON.parse(readFileSync(mpPath, "utf8"));
      parsed = true;
    } catch (e) {
      fail(`.claude-plugin/marketplace.json: invalid JSON (${e.message})`);
    }
    if (parsed && (mp === null || typeof mp !== "object" || Array.isArray(mp))) {
      fail("marketplace.json: must be a JSON object");
      mp = null;
    }
    if (mp) {
      if (mp.name !== "pi-gauntlet") fail(`marketplace.json: name must be "pi-gauntlet" (got ${JSON.stringify(mp.name)})`);
      if (!mp.owner || !mp.owner.name) fail("marketplace.json: missing owner.name");
      if (!mp.description) fail("marketplace.json: missing description");
      const plugins = Array.isArray(mp.plugins) ? mp.plugins : [];
      if (plugins.length !== 1) fail(`marketplace.json: expected exactly 1 plugin, got ${plugins.length}`);
      const plugin = plugins[0] || {};
      if (plugin.name !== "gauntlet") fail(`marketplace.json: plugin name must be "gauntlet" (got ${JSON.stringify(plugin.name)})`);
      if (plugin.source !== "./") fail(`marketplace.json: plugin source must be "./" (got ${JSON.stringify(plugin.source)})`);
      if (plugin.strict !== true) fail("marketplace.json: plugin strict must be true (plugin.json and the marketplace skill allowlist coexist)");
      if (plugin.version !== pkg.version) fail(`marketplace.json: plugin version must equal package.json version ${pkg.version} (got ${JSON.stringify(plugin.version)}) - release.sh writes it`);
      if ("agents" in plugin) fail("marketplace.json: declare agents only in plugin.json; marketplace agents do not suppress discovery");
      try {
        const manifest = JSON.parse(readFileSync(R(".claude-plugin/plugin.json"), "utf8"));
        if (JSON.stringify(Object.keys(manifest).sort()) !== JSON.stringify(["agents", "name"]) ||
            manifest.name !== "gauntlet" || !Array.isArray(manifest.agents) || manifest.agents.length !== 0) {
          fail('plugin.json: expected only name "gauntlet" and agents []; version and skills belong to the marketplace');
        }
      } catch (e) {
        fail(`plugin.json: missing or invalid manifest (${e.message})`);
      }
      const mpSkills = Array.isArray(plugin.skills) ? plugin.skills : [];
      if (mpSkills.length === 0) fail("marketplace.json: plugin skills must be a non-empty array");
      // These entries re-enable Claude Code's full scan and would leak all skills.
      const scanLeaks = new Set([".", "./", "./skills", "./skills/"]);
      for (const entry of mpSkills) {
        if (scanLeaks.has(entry)) {
          fail(`marketplace.json: skills entry "${entry}" would re-enable the full scan (allowlist must name specific skill dirs)`);
          continue;
        }
        const dir = R(entry.replace(/^\.\//, ""));
        if (!existsSync(dir) || !statSync(dir).isDirectory()) {
          fail(`marketplace.json: skills path ${entry} is not a directory`);
          continue;
        }
        const skillFile = join(dir, "SKILL.md");
        if (!existsSync(skillFile)) {
          fail(`marketplace.json: ${entry} has no SKILL.md`);
          continue;
        }
        const err = hasFrontmatter(skillFile, ["name", "description"]);
        if (err) fail(`marketplace.json: ${entry}/SKILL.md: ${err}`);
      }
      if (errors.length === mpErrorsBefore) ok(`marketplace allowlist valid (${mpSkills.length} skills)`);
    }
  }
}

try {
  execFileSync(process.execPath, [R("scripts/claude-plugin-smoke.test.mjs")], { stdio: "pipe", timeout: 300000 });
  ok("real Claude Git-marketplace loading, cached upgrade and negative controls pass");
} catch (e) {
  fail(`Claude plugin loading failed:\n    ${String(e.stdout || "")}\n${String(e.stderr || e)}`);
}

// ---- npm pack contents -----------------------------------------------------
try {
  const out = execFileSync("npm", ["pack", "--dry-run", "--json"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  const packed = JSON.parse(out)[0].files.map((f) => f.path);
  for (const need of [
    "extensions/lib/gauntlet-settings.ts",
    "extensions/lib/gauntlet-settings-loader.ts",
    "bin/gauntlet-spec-index.mjs",
    "bin/gauntlet-telemetry-seal.mjs",
    "bin/gauntlet-performance.mjs",
    "extensions/lib/telemetry-record.ts",
    "extensions/lib/telemetry-paths.ts",
    "extensions/lib/telemetry-ship.ts",
    "extensions/lib/phase-tracker-helpers.ts",
    "skills/gauntlet-handoff/SKILL.md",
  ]) {
    if (!packed.includes(need)) fail(`npm pack: ${need} missing from tarball (runtime would fail)`);
  }
  if (!packed.some((f) => f.startsWith("agents/"))) fail("npm pack: no agents/ in tarball");
  if (packed.some((f) => f.startsWith("doc/"))) fail("npm pack: doc/ leaked into tarball");
  if (packed.some((f) => f.startsWith("eval/"))) fail("npm pack: eval/ leaked into tarball");
  if (packed.some((f) => f.startsWith(".claude-plugin/"))) fail("npm pack: .claude-plugin/ leaked into tarball (Claude Code marketplace is source-only)");
  if (packed.some((f) => f.startsWith("src/"))) fail("npm pack: src/ leaked into tarball (bin sources are not shipped)");
  ok(`npm pack: ${packed.length} files, agents/ + bin/*.mjs and Pi extension helpers present, no doc/ leak`);
} catch (e) {
  fail(`npm pack failed: ${String(e.stderr || e).split("\n")[0]}`);
}

// ---- bin bundles: no runtime .ts imports, shebang intact (gh-39) -----------
for (const b of ["bin/gauntlet-telemetry-seal.mjs", "bin/gauntlet-performance.mjs", "bin/gauntlet-spec-index.mjs"]) {
  const firstLine = readFileSync(R(b), "utf8").split("\n", 1)[0];
  if (firstLine !== "#!/usr/bin/env node") fail(`${b}: first line must be #!/usr/bin/env node`);
}
for (const f of walk(R("bin"))) {
  const rel = f.replace(root + "/", "");
  const m = readFileSync(f, "utf8").match(/(?:from\s*|import\s*(?:\(\s*)?)["']\.{1,2}\/[^"']*\.ts["']/);
  if (m) fail(`${rel}: relative .ts import ${JSON.stringify(m[0])} - bins must bundle their helper graph (npm run build:bins)`);
}
ok("bin bundles self-contained (no relative .ts imports), shebangs intact");

// ---- packed-install smoke (gh-39) -----------------------------------------
try {
  execFileSync(process.execPath, [R("scripts/packed-install-smoke.test.mjs")], { stdio: "pipe" });
  ok("packed-install smoke passes (all bins run from a scratch node_modules/pi-gauntlet)");
} catch (e) {
  fail(`packed-install smoke failed:\n    ${String(e.stdout || e.stderr || e).split("\n").slice(0, 20).join("\n    ")}`);
}

// ---- report ----------------------------------------------------------------
if (errors.length) {
  console.error(`\nFAIL (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`\nPASS: repo valid${expectVersion ? ` for release v${expectVersion}` : ""}`);
