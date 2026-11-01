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

const reconstruction = realFiles.find(f => f.rel === "skills/gauntlet-resume/reference/reconstruction.md").text;
const ledgerRestore = reconstruction.split("## Spec with ledger")[1].split("## Spec with plan")[0];
for (const token of ["Shared allowance boundary", "Skip Entry step 1 entirely", "ledger has no allowance: line - resume through /skill:gauntlet-resume", "After the loop", "latest operational"]) assert.ok(ledgerRestore.includes(token), token);
const boundary = ledgerRestore.split('4. **Shared allowance boundary')[1].split('5. Continue')[0];
const ordered = ['Apply pending recovery below against the unmigrated ledger', 'Migrate only an admitted, clean, tuple-free ledger', 'Require `allowance:` and no `cap:`', 'Call `plan_tracker({ action: "refresh"'];
for (let i = 1; i < ordered.length; i++) assert.ok(boundary.indexOf(ordered[i - 1]) >= 0 && boundary.indexOf(ordered[i - 1]) < boundary.indexOf(ordered[i]), ordered[i]);
for (const token of [
  'both or neither is `ledger header malformed: <observed header lines>`',
  'legacy-compatible admission', 'original one-commit `<pre-dispatch HEAD>..HEAD`',
  'unchanged home HEAD', 'iterations-bump-plus-tuple dirt',
  'resolve `gauntlet_setting({ key: "loopEngine" })` for this migration only',
  'Commit only that header replacement as parent `loop: migrate allowance`',
  'preserve iterations, every attempts cell and all decisions',
  'cannot migrate allowance: settings tool unavailable (loopEngine.maxIterationsPerRow)',
  'With an existing allowance, use it without settings resolution or a migration commit',
  'Defer migration through any retained recovery stop or dirty tree',
  'project the unmigrated ledger solely to report the stop',
  'header plus one per matching retry decision', "ignore the retry's audit ceiling",
  'Keep `cap +N` history as inert text and restore no funded rounds',
  'at or above its effective allowance stops under rule 2 without an attempt',
]) assert.ok(ledgerRestore.includes(token), token);
assert.doesNotMatch(ledgerRestore, /ledger has no cap:|loop: raise cap|legacy `cap \+N` grant|funding and retry allowances/);
for (const rel of ["skills/gauntlet-resume/SKILL.md", CONTRACT_FILE]) {
  const text = realFiles.find(f => f.rel === rel).text;
  assert.ok(text.includes("shared allowance boundary"), rel);
}

const routes = realFiles.find(f => f.rel === "skills/gauntlet-resume/SKILL.md").text;
for (const route of ["implement with line-1 ledger", "verify with `Ledger:`"]) {
  const row = routes.split("\n").find(line => line.startsWith("| " + route));
  assert.ok(row.includes("shared allowance boundary"), route);
  assert.match(row, /pending recovery.*unmigrated ledger.*clean-tree migration.*final allowance validation.*refresh/);
}
const noLedgerRow = routes.split("\n").find(line => line.startsWith('| approved spec with `**Engine:** loop`, no ledger'));
assert.match(noLedgerRow, /label Entry steps 1-5 explicitly in the response/);
assert.match(noLedgerRow, /Entry step 1: resolved settings; Entry step 2: verification; Entry step 3: driver's plan skip; Entry step 4: clean named-branch check and ledger creation; Entry step 5: `plan_check`, commit and implement start/);
for (const token of ["after check 6", "start brainstorm", "skip brainstorm resume: <spec path>", "absolute worktree/spec paths and plan directory", "no writing-plans body or task tracker"]) assert.ok(noLedgerRow.includes(token), token);
const actualContract = realFiles.find(f => f.rel === CONTRACT_FILE).text;
for (const token of ['^(row \\d+(?: \\(\\S+\\))?) \\| .+$', '^\\d+/\\d+: ', '^row \\d+(?: \\(\\S+\\))?$', 'Strip recognized labels before verify/ship `plan_tracker init` and snapshot name comparisons', 'never derive identity from the description', 'Keep Gn and every other task name byte-identical', 'Never restore labels from a brief', 'changed description or denominator is not drift or a second task']) assert.ok(actualContract.includes(token), token);
assert.match(ledgerRestore, /Match the snapshot's ledger task names\/statuses.*stripping only the recognized ledger-description suffix or legacy ledger-label prefix.*keep Gn and other names byte-identical/);
assert.match(ledgerRestore, /Ignore label differences.*post-restore refresh recomputes descriptions and allowance labels/);
const implementRow = actualContract.split("\n").find(line => line.startsWith("| implement with ledger"));
assert.ok(implementRow.includes("shared allowance boundary"));
assert.match(implementRow, /pending recovery.*unmigrated ledger.*clean-tree migration.*final allowance validation.*refresh/);
const ledgerGrammar = actualContract.split("## Brief grammar")[1].split("## Producers")[0];
assert.match(ledgerGrammar, /Permit task rows beside a ledger/);
assert.match(ledgerGrammar, /Reject a block mixing these fields with `Active task` or missing either loop field/);
assert.doesNotMatch(ledgerGrammar, /carrying task rows with a ledger|Never initialize a task tracker/);
const ledgerStatus = "Plan: 0/1 done (1 in progress)\n\n  → [0] row 1\n";
assert.deepEqual(rules(files({ [CONTRACT_FILE]: contract.replace("Ledger: ", "```\n```text\n" + ledgerStatus + "Ledger: ") })), []);
for (const [name, text, pattern] of [
  ["implement", implementRow, /`start implement`.*pending recovery.*refresh.*no `init`/],
  ["verify and ship", actualContract, /For verify\/ship ledger briefs[^\n]*`start verify`[^\n]*saved task list[^\n]*`plan_tracker init`[^\n]*refresh/],
]) assert.match(text, pattern, `${name}: phase and ledger task restoration order`);
assert.match(ledgerRestore, /pending recovery.*before.*refresh/i);
assert.match(ledgerRestore, /refresh[^\n]*before[^\n]*dirty-tree stop/);
for (const token of ["exactly one new home commit", "zero new commits", "multiple commits", "pre-dispatch", "## Validate the return", "restore the target row and the tuple", "preserve other child changes"]) assert.ok(ledgerRestore.includes(token), token);
const recovery = ledgerRestore.split("### Pending recovery")[1];
assert.match(ledgerRestore, /row <n> in_progress \(pending tuple restored\)/);
assert.match(recovery, /Confirmed interrupted[^\n]*full `<HEAD_BEFORE>\.\.HEAD` range[^\n]*row <n>[^\n]*open\/attempts 0[^\n]*tuple before refresh[^\n]*iterations stay at the recovered count[^\n]*child commits\/changes are kept/);
assert.match(routes, /verify with `Ledger:`[^\n]*fresh home conformance review/);
assert.match(recovery, /no `pending:`.*home commit history.*before.*refresh/i);
assert.match(recovery, /latest home child row\/seed commit.*unrelated commits follow it/);
assert.match(recovery, /commit body's first two lines.*`pending:` tuple.*consumed `iteration:`/);
assert.match(recovery, /pre-dispatch SHA.*ancestor.*live HEAD/);
assert.match(recovery, /entire.*pre-dispatch HEAD>\.\.HEAD.*never.*HEAD\^/);
assert.match(recovery, /missing.*malformed.*mismatched.*stop before refresh/i);
assert.match(recovery, /parent admission\/repair or approved ledger mutation.*never replay/);
for (const [name, pattern] of [
  ["saved admission evidence", /saved post-admission snapshot.*HEAD.*dirty/],
  ["snapshot binding", /ancestor of live HEAD.*ledger.*unchanged/],
  ["ordinary admission has no marker", /ordinary home admission.*no parent commit or ledger mutation/i],
  ["ambiguous history question", /Was home return <sha> admitted before the later commits or dirty changes/],
  ["read-only ambiguity stop", /ledger bytes, counters and task list unchanged.*no refresh.*no target\/tuple restoration/],
  ["settled continuation", /Confirmed settled.*preserve the current ledger.*normal restore/i],
]) assert.match(recovery, pattern, name);
assert.match(recovery, /read-only admission-evidence check.*before phase\/task restoration/);
assert.match(ledgerRestore, /unrecoverable attribution or before-image.*stop before refresh/i);
assert.match(actualContract, /legacy ledger brief without task rows[^\n]*omits init[^\n]*ordered recovery\/migration boundary/i);
assert.match(actualContract, /Never send a ledger task list through task-plan repair/);
assert.match(actualContract, /For every ledger brief apply the shared allowance boundary[^\n]+before dispatch or verification/);

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
assert.match(realHandoff, /Never refresh or mutate either tracker/);
const amendment = realFiles.find(f => f.rel === "skills/brainstorming/reference/amendment-surface.md").text;
assert.match(amendment, /skip `plan-writer` and `plan_check`/);
assert.match(amendment, /commit[^\n]*refresh/i);
assert.match(amendment, /Stopped: row <n> reopened by amendment during verify/);
assert.match(amendment, /## Dispatch[^\n]*## Validate the return/);
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
assert.ok(actualContract.includes('Render that derivation in the stop: name the recorded `home:` pattern and the shared NAME it was resolved from, and state that the pattern locates the tree without authorizing its recreation, a synthesized receipt or inferred approval.'));
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

console.log("brief-contract lint fixtures pass");
