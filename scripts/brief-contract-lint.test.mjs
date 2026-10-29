import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { CONTRACT_FILE, CITING_SKILLS, lintBriefGrammar, readSkillFiles } from "./brief-contract-lint.mjs";

const contract = [
  "# Handoff brief contract",
  "## Process state",
  "```text",
  "Active task: W2: producer",
  "Ledger: doc/plans/example-ledger.md",
  "Last decision: row 1 failed | check failed | retry",
  "Gate history not restored - re-validate before advancing.",
  "```",
].join("\n");
const handoff = "# Gauntlet Handoff\n\nStep 4 checks for `^## Process state\\s*$`. See reference/brief-contract.md.\n";
const resume = "# Gauntlet Resume\n\n| brief with `## Process state` | restore |\n\nGrammar: reference/brief-contract.md.\n";
const other = "# reconstruction\n\nA brief without `## Process state` is reconstructed.\n";

const files = (overrides = {}) => [
  { rel: CONTRACT_FILE, text: contract },
  { rel: "skills/gauntlet-handoff/SKILL.md", text: handoff },
  { rel: "skills/gauntlet-resume/SKILL.md", text: resume },
  { rel: "skills/gauntlet-resume/reference/reconstruction.md", text: other },
].map((f) => (f.rel in overrides ? { ...f, text: overrides[f.rel] } : f));

const rules = (fs) => lintBriefGrammar(fs).map((f) => `${f.rule}:${f.file}`).sort();

assert.equal(CONTRACT_FILE, "skills/gauntlet-resume/reference/brief-contract.md");
assert.deepEqual(CITING_SKILLS, ["skills/gauntlet-handoff/SKILL.md", "skills/gauntlet-resume/SKILL.md"]);

// clean repo shape: zero findings; inline mentions of the heading are legal
assert.deepEqual(rules(files()), []);

// negative: a standalone heading line inserted into the producer skill
assert.deepEqual(
  rules(files({ "skills/gauntlet-handoff/SKILL.md": handoff + "\n## Process state\n" })),
  ["grammar-outside-contract:skills/gauntlet-handoff/SKILL.md"],
);

// negative: active-task line inlined into the consumer skill
assert.deepEqual(
  rules(files({ "skills/gauntlet-resume/SKILL.md": resume + "Active task: none\n" })),
  ["grammar-outside-contract:skills/gauntlet-resume/SKILL.md"],
);

for (const field of ["Ledger: doc/plans/example-ledger.md", "Last decision: row 1 failed | check failed | retry"]) {
  assert.deepEqual(
    rules(files({ "skills/gauntlet-handoff/SKILL.md": handoff + field + "\n" })),
    ["grammar-outside-contract:skills/gauntlet-handoff/SKILL.md"],
  );
}

// negative: contract lost the gate-history line
assert.deepEqual(
  rules(files({ [CONTRACT_FILE]: contract.replace("Gate history not restored - re-validate before advancing.\n", "") })),
  [`grammar-missing:${CONTRACT_FILE}`],
);

// negative: producer skill stopped citing the contract
assert.deepEqual(
  rules(files({ "skills/gauntlet-handoff/SKILL.md": handoff.replace("reference/brief-contract.md", "the contract") })),
  ["cite-missing:skills/gauntlet-handoff/SKILL.md"],
);

// findings name the offending line text
const [hit] = lintBriefGrammar(files({ "skills/gauntlet-handoff/SKILL.md": handoff + "\n## Process state  \n" }));
assert.equal(hit.text, "## Process state");

const root = fileURLToPath(new URL("..", import.meta.url));
const realFiles = readSkillFiles(root);
assert.deepEqual(rules(realFiles), []);
for (const rel of [
  "skills/gauntlet-resume/SKILL.md",
  "skills/gauntlet-resume/reference/reconstruction.md",
  CONTRACT_FILE,
]) {
  assert.ok(realFiles.find((f) => f.rel === rel).text.includes("resume: <spec> (loop engine)"), `${rel}: exact ledger skip reason`);
}
assert.ok(realFiles.some((f) => f.rel === "skills/gauntlet-handoff/SKILL.md"));
const mutated = realFiles.map((f) =>
  f.rel === "skills/gauntlet-handoff/SKILL.md" ? { ...f, text: f.text + "\n## Process state\n" } : f,
);
assert.deepEqual(rules(mutated), ["grammar-outside-contract:skills/gauntlet-handoff/SKILL.md"]);

console.log("brief-contract lint fixtures pass");

const reconstruction = realFiles.find(f => f.rel === "skills/gauntlet-resume/reference/reconstruction.md").text;
const ledgerRestore = reconstruction.split("## Spec with ledger")[1].split("## Spec with plan")[0];
for (const token of ["Shared cap boundary", "cap:", "Skip Entry step 1 entirely", "ledger has no cap: line - seeded under the old loopEngine contract", "After the loop", "latest operational"]) assert.ok(ledgerRestore.includes(token), token);
assert.doesNotMatch(ledgerRestore, /resolve its Entry settings|maxIterations|gauntlet_setting/);
for (const rel of ["skills/gauntlet-resume/SKILL.md", CONTRACT_FILE]) {
  const text = realFiles.find(f => f.rel === rel).text;
  assert.ok(text.includes("shared cap boundary"), rel);
}

const routes = realFiles.find(f => f.rel === "skills/gauntlet-resume/SKILL.md").text;
for (const route of ["implement with line-1 ledger", "verify with `Ledger:`"]) {
  const row = routes.split("\n").find(line => line.startsWith("| " + route));
  assert.ok(row.includes("shared cap boundary"), route);
}
const noLedgerRow = routes.split("\n").find(line => line.startsWith('| approved spec with `**Engine:** loop`, no ledger'));
assert.match(noLedgerRow, /label Entry steps 1-5 explicitly in the response/);
assert.match(noLedgerRow, /Entry step 1: resolved settings; Entry step 2: verification; Entry step 3: driver's plan skip; Entry step 4: clean named-branch check and ledger creation; Entry step 5: `plan_check`, commit and implement start/);
for (const token of ["after check 6", "start brainstorm", "skip brainstorm resume: <spec path>", "absolute worktree/spec paths and plan directory", "no writing-plans body or task tracker"]) assert.ok(noLedgerRow.includes(token), token);
const actualContract = realFiles.find(f => f.rel === CONTRACT_FILE).text;
const implementRow = actualContract.split("\n").find(line => line.startsWith("| implement with ledger"));
assert.ok(implementRow.includes("shared cap boundary"));
assert.match(actualContract, /For every ledger brief apply the shared cap boundary[^\n]+before dispatch or verification/);

const producer = actualContract.split("## Producers")[1].split("## Tracker output grammar")[0];
const processRow = actualContract.split("\n").find(line => line.startsWith("| `## Process state`"));
for (const [name, text] of [["process table", processRow], ["producer and loop", producer]]) {
  assert.match(text, /one or more consecutive/ , name);
  assert.match(text, /home first/ , name);
  assert.match(text, /record order/ , name);
}
assert.match(processRow, /optional single `Rework base: <40-char sha>` after all PR pairs/);
assert.match(producer, /optional single `Rework base: <40-char sha>` after all PR pairs, then the optional coordinated block below, then the gate-history line after the last pair, rework-base line, or block/);
assert.match(producer, /loop alternative above, retaining the optional PR pairs and rework base before the gate-history line/);
assert.match(producer, /Copy the full rework base only from the top-level record when present; never invent a boundary for incomplete sync/);
const identityRestore = actualContract.split("## Process-state restore")[1].split("Facts that fix the order")[0];
for (const token of ["first pair only", "later pairs", "brief lists <brief order>, record lists <record order>", "top-level", "all paired full pre-rework heads", "Before any tracker write"]) assert.ok(identityRestore.includes(token), token);
assert.ok(identityRestore.includes("brief names PR #N on <headRefName>, worktree is on <branch>"));
assert.match(identityRestore, /Carry the optional full rework base downstream; reconstruction prefers it over the first pair's head as its scan base/);
const candidateRules = reconstruction.split("## Candidates")[1].split("## Spec without plan")[0];
for (const token of ["first pair's", "## Problem", "Read candidate contents before choosing", "exclude exactly those paths", "before the multi-spec prompt", "Keep this explicit exclusion set authoritative through plan/ledger pairing", "skip that pair", "Never promote an excluded member spec", "Never choose by filename"]) assert.ok(candidateRules.includes(token), token);
const realHandoff = realFiles.find(f => f.rel === "skills/gauntlet-handoff/SKILL.md").text;
assert.ok(realHandoff.includes("every top-level PR identity"));
assert.match(realHandoff, /copy the optional top-level rework base after the pairs as the contract specifies/);
assert.match(candidateRules, /use its full `Rework base:` SHA as `<base>` when present, else the first pair's full `Pre-rework head:` SHA/);
assert.match(candidateRules, /Without the optional pairs, including a bare worktree, use the ordinary base/);

const legBlock = [
  'legs:',
  '  - repo: repo-a',
  '    worktree: /tmp/repo-a/run',
  '    branch: feature/shared-change',
  '    HEAD: <sha>',
  '    dirty: clean',
  '  - repo: repo-b',
  '    worktree: missing',
  '    branch: feature/shared-change',
  '    HEAD: <sha>',
  '    dirty: unavailable',
  '    receipt: /tmp/repo-a/run/.pi/gauntlet/receipts/spec.md/repo-b',
].join('\n');
const coordinatedContract = contract.replace('Gate history', legBlock + '\nGate history');
assert.deepEqual(rules(files({ [CONTRACT_FILE]: coordinatedContract })), []);
for (const [name, text] of [
  ['ordered fields', coordinatedContract.replace('    branch: feature/shared-change\n    HEAD: <sha>', '    HEAD: <sha>\n    branch: feature/shared-change')],
  ['placement', coordinatedContract.replace(legBlock + '\n', '').replace('Gate history not restored - re-validate before advancing.', 'Gate history not restored - re-validate before advancing.\n' + legBlock)],
  ['missing tree spelling', coordinatedContract.replace('worktree: missing', 'worktree: gone')],
]) {
  assert.ok(lintBriefGrammar(files({ [CONTRACT_FILE]: text })).some(f => f.rule === 'legs-layout'), name);
}
assert.deepEqual(rules(files({ [CONTRACT_FILE]: coordinatedContract.replace(/    receipt: .*\n/, '') })), []);
for (const line of legBlock.split('\n')) {
  assert.ok(lintBriefGrammar(files({ 'skills/gauntlet-handoff/SKILL.md': handoff + '\n' + line + '\n' })).some(f => f.rule === 'grammar-outside-contract'), line);
}
assert.ok(actualContract.includes('worktree: missing'));
assert.ok(actualContract.includes('## Coordinated admission'));
assert.ok(routes.includes('3b. **Coordinated admission.**'));

for (const [name, text, tokens] of [
  ["handoff home pin", realHandoff, ["Run worktree: <home worktree>", '"was told to work in"', "Coordinated brief grammar"]],
  ["entry checks", routes, ["home is <repo>; restart there", "3b. **Coordinated admission.**", "per leg"]],
  ["admission", actualContract, ["declared primary", "canonical git common directory", "full `**Home:**` tuple", "every companion receipt", "correctly stripped plan", "original scoped ACs", "Preserve receipts"]],
  ["ledger recovery", reconstruction, ["pending:", "exactly one new companion commit", "before dispatch or verification", "never rerun the recovered row"]],
  ["seed refusal", realFiles.find(f => f.rel.endsWith("/gauntlet-resume/reference/seed.md")).text, ["`**Home:**`", "home repo, branch and spec path", "Never create a run from a leg file"]],
]) {
  for (const token of tokens) assert.ok(text.includes(token), `${name}: ${token}`);
}
