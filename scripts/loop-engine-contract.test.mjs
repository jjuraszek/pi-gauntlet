import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import test from 'node:test';
import { lintTarget } from '../eval/lib/lint.mjs';
import { STAGE_SKILL_DIRS, lintStageSkillDirs } from './stage-skill-lint.mjs';
const root = new URL('../', import.meta.url);
test('driver dispatch matches fresh persona and durable ledger contract', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const persona = readFileSync(new URL('agents/loop-implementer.md', root), 'utf8');
  for (const field of ['iteration', 'spec', 'ledger', 'base', 'target', 'previous decision', 'hint']) {
    assert.ok(driver.includes(`${field}:`), field);
    assert.ok(persona.includes(field), field);
  }
  for (const token of ['context: "fresh"', 'async: false', 'outputMode: "file-only"', 'the parent validates the ledger and the commit', '# Ledger - loop engine', 'iterations: 0', 'loop: repair row', 'whole-diff minors:', 'audited-base:', 'plan_check']) assert.ok(driver.includes(token), token);
  const steps = ['## Before each dispatch', '## Dispatch', '## Validate the return', '## After the loop'];
  for (let i = 1; i < steps.length; i++) assert.ok(driver.indexOf('\n' + steps[i] + '\n') > driver.indexOf('\n' + steps[i - 1] + '\n'), steps[i]);
  const continuation = driver.slice(driver.indexOf('## After the loop'));
  assert.ok(driver.indexOf('action: "complete", phase: "implement"') < driver.indexOf('## After the loop'));
  assert.ok(continuation.indexOf('whole-diff `wave-reviewer`') < continuation.indexOf('separate fresh `conformance-reviewer`'));
  for (const fact of ['effective allowance', 'count of that row', 'Two consecutive validation misses', 'only `open` -> `done`', 'attempts +1', 'zero or more other', 'attempts unchanged', 'exactly one new decision line, target first', 'No task reopen/update is awaited']) assert.ok(driver.includes(fact), fact);
  assert.match(driver, /Count empty child commits and validation misses only after the latest `loop: retry row <n>` commit\. Raising allowance resets neither window\. Preserve every row's attempts\./);
  assert.match(driver, /Select `seed` until a validated `loop: seed evidence` commit with its `row 0 done` decision and evidence on every non-cut row survives on the branch, independently of `iterations`/);
  assert.match(driver, /Validate by dispatched `target`, not iteration number/);
  assert.match(driver, /For `target: seed`, explicitly instruct the child to apply its seed contract even when iteration is greater than 0/);
  assert.doesNotMatch(driver, /Select `seed` at iteration 0; otherwise/);
  assert.match(persona, /defaultContext: fresh/);
  assert.match(persona, /completionGuard: true/);
  assert.doesNotMatch(persona.split('---')[1], /^(model|thinking):/m);
  assert.ok(persona.includes('semicolons'));
  assert.ok(persona.includes('Escape pipes'));
  assert.ok(driver.split('\n').length < 500);
  assert.doesNotMatch(driver, /plan_tracker\(.*init|worktree: true/);
  assert.ok(STAGE_SKILL_DIRS.includes('skills/loop-implementation'));
  assert.deepEqual(lintStageSkillDirs(root.pathname, ['skills/loop-implementation']), []);
});

test('worker records selective commands and keeps row-scoped TDD evidence valid', () => {
  const persona = readFileSync(new URL('agents/loop-implementer.md', root), 'utf8');
  for (const token of [
    '## Three-scenario TDD', '## Test economy', '## Evidence command',
    'RED', 'GREEN', 'REFACTOR', 'extend the existing test first',
    'Keep and extend the test from earlier attempts', 'no test file',
    'parameter row or a stronger assertion', 'table-driven cases', 'one scenario',
    'cheapest layer', 'slow tier',
    'No convention named or discoverable: place the test beside its siblings and say so in your report.',
    "another closed row's recorded command", 're-record',
    'first unescaped semicolon', 'one selective invocation', 'no `;`, `|` or `&&`',
    "owning checkout's full verification command", 'runner with no file or filter',
    'name that matches nothing', 'nonzero exit', 'otherwise record the file',
    'passing check for every baseline closure',
  ]) assert.ok(persona.includes(token), token);
  assert.match(persona, /5\. .*command you ran.*at most three result lines/);
  assert.match(persona, /For each selected `open` row,.*command.*`evidence`/);
  assert.match(persona, /evidence seeding for at least one non-cut row/);
  assert.match(persona, /Count only rows given evidence in this return/);
  assert.match(persona, /Include the evidence command.*at most three semicolon-separated result lines/);
  assert.doesNotMatch(persona, /containing the check name|Include the check name/);
  assert.deepEqual(lintTarget(new URL('eval/loop-implementer', root).pathname), []);
  const fixture = mkdtempSync(join(tmpdir(), 'loop-selector-'));
  const file = join(fixture, 'row.test.mjs');
  writeFileSync(file, "import test from 'node:test';\ntest('row proof', () => {});\n");
  assert.equal(spawnSync(process.execPath, ['--test', file]).status, 0);
  assert.notEqual(spawnSync(process.execPath, ['--test', join(fixture, 'missing.test.mjs')]).status, 0);
  const empty = spawnSync(process.execPath, ['--test', '--test-name-pattern=absent-row', file], { encoding: 'utf8' });
  assert.equal(empty.status, 0, 'Node name filters cannot be recorded as fail-closed selectors');
});

test('effective allowance counts retries rather than historical ceilings or other budgets', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const before = driver.split('## Before each dispatch')[1].split('## Dispatch')[0];
  for (const token of [
    'attempts >= effective allowance', "ledger's `allowance:` plus the count of that row's",
    '`row <n> retry | ... | allowed attempts <m>` lines in `## Decisions`',
    'Count each retry once', 'historical, not an absolute override',
    'Ignore every other decision and grant',
    'every coordinated entry, regardless of leg', 'allowance 4 and two retries',
    'raising the shared header to 7 makes it 9', 'an unretried row gets 7',
    'already at or above its effective allowance is exhausted', 'Never reset or reduce attempts',
  ]) assert.ok(before.includes(token), token);
  assert.doesNotMatch(before, /Set row allowance to 3 \+ funded|Recover spent funding|latest .*retry.*when larger/);
});

test('last-attempt escalation uses the resolved model under both approval options', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const before = driver.split('## Before each dispatch')[1].split('## Dispatch')[0];
  assert.match(before, /attempts >= effective allowance \| Human stop under approval option 4 and option 5 alike/);
  assert.match(before, /Select target by the priority below, then apply the last-attempt escalation check/);
  for (const token of [
    'For a numbered target at attempts == effective allowance - 1',
    'no existing durable `row <n> escalated` decision',
    'gauntlet_setting({ key: "escalationLoop" })',
    'Never consult this value for row escalation',
    'returned non-empty `implModel` string', 'main-loop model fallback',
    'setting is unset or malformed', 'settings tool unavailable or `implModel` undefined',
    'neither a configured model nor a main-loop model',
    'Problem: escalationLoop.implModel unavailable',
    'write no escalation decision and leave attempts at effective allowance - 1',
    'Never substitute a default-model last attempt',
    'row <n> escalated | implModel round | allowed attempts <effective allowance>',
    'loop: escalate row <n>', 'escalated round for row <n>', 'model: <implModel>',
    'normal loop-implementer target, bump and validation path',
    'At allowance 1, escalate the first and only allowed attempt',
    'within the effective allowance, never an extra attempt',
    'starts no new empty-child or validation-miss window',
  ]) assert.ok(before.includes(token), token);
  assert.ok(before.indexOf('Select `seed` until') < before.indexOf('For a numbered target at'));
  assert.ok(before.indexOf('Apply hard boundaries') < before.indexOf('For a numbered target at'));
  assert.doesNotMatch(before, /With amend permission|no amend permission or escalation|allowed attempts <attempts \+ 1>/);
  assert.match(driver, /Omit the model override except on an escalated round/);
});

test('spent row escalation survives grants, resume and rejected returns', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const before = driver.split('## Before each dispatch')[1].split('## Dispatch')[0];
  for (const token of [
    'escalation identity from `## Decisions` on every dispatch and resume',
    'unrecoverable means spent', 'whole flow across retry, `rows +N`, amendments and resume',
    'omit the model override on every later authorized attempt',
    'including a new last allowed attempt', 'never resolve another row escalation or append a second marker',
    'With no marker and recoverable history, apply the normal last-attempt predicate',
    'a previously missing model or migrated row has not spent escalation',
  ]) assert.ok(before.includes(token), token);
  const stop = driver.split('## Human stop')[1].split('## After the loop')[0];
  for (const token of [
    'Preserve the pre-dispatch escalation decision through authorized discard/reset',
    'Boundary rejection never increments attempts', 'attempts at effective allowance - 1',
    'after authorized recovery dispatch on the default model without requiring retry or `rows +N`',
    'An admitted validation miss instead increments attempts through `loop: repair row <n>`',
    'stops under rule 2, retaining the spent decision',
  ]) assert.ok(stop.includes(token), token);
});

test('automatic exit verification repair is once per flow under both options', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const gate = driver.split('\n## After the loop\n')[1].split('\n1. ')[1].split('\n2. ')[0];
  for (const token of ['loop: repair verification', 'exactly one commit', 'rows unchanged', 'Rerun the failing checkout\'s gate pairs once', 'gate set', 'Commit verification-produced tracked changes', 'escalated round spent']) assert.ok(gate.includes(token), token);
  for (const token of ['Recommendation: none - evidence repeats row <n>', 'took recommendation: amend for row <n>', 'budget-only']) assert.ok(driver.includes(token), token);
  for (const token of [
    'approval option 4 and option 5 alike', 'never consult amend permission or gate on the iteration count',
    'gauntlet_setting({ key: "escalationLoop" })', "resolver's main-loop model fallback",
    'Problem: escalationLoop.implModel unavailable', 'without a bump or spent marker',
    'bump iterations once', 'record `HEAD_BEFORE` in the failing leg',
    'preserving attempts, mapping, allowance and prior decisions',
    'Dispatch error or non-DONE consumes the round', 'preserve the consumed count and stop',
    'interrupted or unrecoverable identity is spent', 'never add a carrier or fabricate success',
    'rejected dirty/zero/multiple-commit return also keeps the round spent',
    'Never repair again for another leg', 'Never spend verify-phase credits',
  ]) assert.ok(gate.includes(token), token);
  assert.doesNotMatch(gate, /With amend permission|iterations < cap|at cap stop|With no permission/);
  assert.match(gate, /With spent.*stop without dispatch or automatic rerun/);
  assert.match(driver, /Omit the model override except on an escalated round/);
  assert.match(driver, /empty parent marker/);
  assert.match(driver, /This marker is once per flow\./);
  for (const token of ['the implementation worktree as cwd and its Rules', 'absolute spec path, failing command, its checkout, exit code and log path', 'On success record verified HEAD and clean status']) assert.ok(driver.includes(token), token);
  assert.ok(Buffer.byteLength(driver) < 50000);
  assert.deepEqual(lintTarget(new URL('eval/loop-implementation', root).pathname), []);
});

test('coordinated loop owns stable mappings, attributed returns and pending recovery', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const reference = readFileSync(new URL('skills/loop-implementation/reference/coordinated-legs.md', root), 'utf8');
  const persona = readFileSync(new URL('agents/loop-implementer.md', root), 'utf8');
  for (const token of ['missing/duplicate scope lines', 'duplicate indices within a list', 'malformed tokens', 'out-of-range original indices', 'cut original AC indices', 'absent from every valid list to home', 'repeat shared indices', 'independent of scope-list order', 'duplicate/missing mappings', 'All-cut ledgers exit without seed', 'unseeded leg with non-cut entries in membership order', 'wholly cut legs', 'scope: AC 1, AC 3', 'scope: none', 'original AC order', 'membership order', '## Leg mapping', 'row | ac | leg', 'base repo-a:', 'seeded repo-a:', 'allowance 4', 'pending: 2 | repo-b | abc1234', 'without another attempt or iteration bump', 'zero commits', 'foreign entry', 'disposition-only cut', 'design:']) assert.ok(reference.includes(token), token);
  for (const token of ['pending:', 'iteration:', 'four-column', 'home ledger untouched', 'loop: seed evidence', 'loop: row', 'mapped original AC', 'Rules:']) assert.ok(persona.includes(token), token);
  assert.match(reference, /`checks: commands`/);
  assert.match(reference, /gate set grouped by `## Leg mapping`/);
  assert.doesNotMatch(reference, /`contract:` `- verification:`/);
  assert.doesNotMatch(reference, /record each member's verification contract|each leg's recorded verification/);
  const headings = ['## Entry', '## Resume', '## Targeting and dispatch', '## Companion return validation', '### Companion commit admission', '## Amendments'];
  for (let i = 1; i < headings.length; i++) assert.ok(reference.indexOf('\n' + headings[i] + '\n') > reference.indexOf('\n' + headings[i - 1] + '\n'), headings[i]);
  assert.ok(reference.indexOf('Recover pending companion work') < reference.indexOf('\n## Targeting and dispatch\n'));
  for (const token of ['once per flow, not per failing leg', 'Success only after every leg passes']) assert.ok(reference.includes(token), token);
  assert.ok(Buffer.byteLength(reference) < 50000);
  assert.ok(reference.split('\n').length < 2000);
  assert.ok(driver.includes('legacy and single-member ledger bytes unchanged'));
  const legacySkeleton = driver.match(/```markdown\n([\s\S]*?)```/)[1];
  assert.doesNotMatch(legacySkeleton, /Leg mapping|base repo-|seeded repo-|pending:|legs:|--leg/);
  assert.ok(driver.includes('single-member/legacy paths free of a companion loop, leg file, `legs:` brief or `--leg` argument'));
});

test('driver holds capture grant and leg paths outside the dispatch loop', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const entry = driver.split('\n## Entry\n')[1].split('\n## Driver holds\n')[0];
  const holds = driver.split('\n## Driver holds\n')[1]?.split('\n## Before each dispatch\n')[0];
  assert.ok(holds, 'Driver holds section after Entry');
  for (const token of ['ledger', 'one file reference', 'status --porcelain', 'rev-list --count', 'rev-parse', 'show -s --format=%b', 'absolute paths', 'overrides', 'source files', 'test output', 'logs', 'last 20 lines', 'Never diagnose', 'rows by status', 'iterations', 'cap', 'last decision', 'decoded amendment grant', "each leg's checkout path"]) assert.ok(holds.includes(token), token);
  assert.match(entry, /At seed and at an authorized restore, before entering the dispatch loop, read the spec in full/);
  assert.match(entry, /Decode `\*\*Amend-grant:\*\*`.*Value decoding/);
  assert.match(entry, /Capture.*ordered leg membership.*checkout paths.*Rules/);
  const before = driver.split('\n## Before each dispatch\n')[1].split('\n## Dispatch\n')[0];
  assert.match(before, /Use the held decoded amendment grant/);
  assert.doesNotMatch(before, /Decode the current|spec whose `## Legs`/);
  const human = driver.split('\n## Human stop\n')[1].split('\n## Gate set\n')[0];
  assert.match(human, /Outside the dispatch loop.*amendment.*re-decode.*refresh.*held.*checkout paths/);
  assert.doesNotMatch(human, /Stopped on row <n> \(<row text>\)/);
  const reference = readFileSync(new URL('skills/loop-implementation/reference/coordinated-legs.md', root), 'utf8');
  assert.match(reference, /At seed, read `## Legs`/);
  assert.match(reference, /Use the held membership and checkout paths/);
  assert.match(reference, /Pass absolute home spec and ledger paths for the child to read/);
  assert.doesNotMatch(reference, /Read spec and ledger by absolute home paths/);
});

test('ledger resume delegates gate execution to the loop skill', () => {
  for (const file of ['skills/gauntlet-resume/SKILL.md', 'skills/gauntlet-resume/reference/brief-contract.md']) {
    const text = readFileSync(new URL(file, root), 'utf8');
    assert.match(text, /After the loop.*step 1.*gate set per.*`## Gate set`/);
    assert.doesNotMatch(text, /ledger gate once per leg/);
  }
});

test('coordinated reference reads use held membership before dispatch decisions', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const path = 'reference/coordinated-legs.md';
  assert.equal(driver.split(path).length - 1, 2);
  const entry = driver.split('\n## Entry\n')[1].split('\n## Before each dispatch\n')[0];
  const dispatch = driver.split('\n## Before each dispatch\n')[1].split('\n## Dispatch\n')[0].trimStart();
  const entryRead = entry.split('\n').find(line => line.includes(path));
  const dispatchRead = dispatch.split('\n')[0];
  for (const line of [entryRead, dispatchRead]) {
    assert.ok(line.includes(path));
    assert.match(line.split('. ')[0], /held membership has more than one leg/);
    assert.match(line.split('. ')[0], /absolute path/);
    assert.match(line.split('. ')[0], /stop on an unreadable reference naming its path, never reconstruct it/);
  }
  assert.match(entryRead, /At seed and at an authorized restore/);
  assert.match(entryRead, /On fresh entry apply its `## Entry` section at step 4 instead of the home-only skeleton below, using step 4's resolved allowance seed value\./);
  assert.match(entryRead, /On a restore apply its `## Resume` section before the dirty-tree stop and before any pending recovery/);
  assert.ok(dispatch.startsWith('When the held membership'));
  assert.ok(dispatch.indexOf(path) < dispatch.indexOf('| 1 |'));
  assert.match(dispatchRead, /Apply its `## Resume`, `## Targeting and dispatch`, `## Companion return validation`, `### Companion commit admission` and `## Amendments` sections together with this driver; never apply `## Entry` here/);
  assert.doesNotMatch(driver, /^## Coordinated Entry and resume$|^### Companion commit admission$/m);
  const dispatchBody = driver.split('\n## Dispatch\n')[1].split('\n## Validate the return\n')[0];
  assert.match(dispatchBody, /pending: <row or seed> \| <repo> \| <HEAD sha>/);
  assert.doesNotMatch(driver, /companion-return-shell/);
});

test('ledger refresh owns entry, dispatch and implement completion', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const entry = driver.split('\n## Entry\n')[1].split('\n## Before each dispatch\n')[0];
  const seed = entry.slice(entry.indexOf('5. Call `plan_check'));
  const refresh = 'plan_tracker({ action: "refresh", path: <absolute ledger path> })';
  const sequence = ['plan_check', 'loop: seed ledger', 'action: "start", phase: "implement"', refresh];
  for (let i = 1; i < sequence.length; i++) assert.ok(seed.indexOf(sequence[i]) > seed.indexOf(sequence[i - 1]), sequence[i]);
  assert.match(driver, /No `open` or `failed` row \| Refresh; require implement complete; continue at ## After the loop step 0/);
  assert.match(driver, /refresh leaves implement active.*never start verify/i);
  assert.match(driver, /After every admitted `loop:` commit.*refresh once/);
  const dispatch = driver.split('\n## Dispatch\n')[1].split('\n## Validate the return\n')[0];
  assert.match(dispatch, /save the ledger before the iterations bump and tuple write/);
  assert.match(dispatch, /`home` for zero or one.*actual member identifier for coordinated/);
  assert.match(dispatch, /Persist the consumed count and tuple before every home or companion dispatch; then refresh/);
  assert.match(dispatch, /Commit nothing extra/);
  assert.match(dispatch, /Send `iteration: i`.*write `iterations: i \+ 1` before dispatch.*admission requires.*child commit body.*`i \+ 1`.*ledger header/);
  const reference = readFileSync(new URL('skills/loop-implementation/reference/coordinated-legs.md', root), 'utf8');
  assert.match(reference, /Send `iteration: i`.*write `iterations: i \+ 1` before dispatch.*admission requires.*child commit body.*`i \+ 1`.*ledger header/);
  for (const text of [driver, reference]) assert.ok(text.includes('State that difference when rendering a dispatch or admission: the task line carries the pre-bump count by design, the body line and `ITERATION` carry the consumed count `i + 1`, and the two never compare to each other.'));
  assert.match(reference, /That home-ledger commit.*`loop: record <repo> row <n>`.*parent commit, not a child `loop: row .*` commit: it never counts toward child-only empty-commit stagnation; only the companion.*own commits are counted at the boundary/);
  assert.doesNotMatch(driver, /plan_tracker\(.*(?:init|add|update)|phase_tracker\(\{ action: "complete", phase: "implement"/);
  assert.ok(driver.trimEnd().split('\n').length < 500);
});

test('terminal home results refresh only after admission and retain pending on boundary stops', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const persona = readFileSync(new URL('agents/loop-implementer.md', root), 'utf8');
  const validation = driver.split('\n## Validate the return\n')[1].split('\n## Human stop\n')[0];
  assert.match(validation, /restore the pre-dispatch target cells.*saved copy.*separately recorded dispatch identity.*`pending:` tuple/);
  assert.match(validation, /seed.*all dispatched non-cut rows/);
  assert.match(validation, /Preserve consumed iterations.*other child changes and commits.*Refresh before the discard\/reset stop/);
  assert.match(validation, /Never project terminal child results before clean\/exactly-one-commit admission/);
  assert.match(validation, /`iterations` \+1 and removal of the dispatched `pending:` line.*reject every other header change/);
  assert.match(validation, /Seed or ordinary.*committed tuple.*ordinary miss/);
  assert.match(validation, /Clear `pending:`.*commit `loop: repair row <n>`/);
  assert.match(driver, /Retry, cut, amend, raise-allowance and escalate commits never clear the tuple/);
  assert.match(persona, /Remove the `pending:` line from the ledger in your commit/);
  assert.match(persona, /Preserve row identifiers, row text, ledger headers \(except removal of `pending:`\)/);
  assert.match(persona, /Stage the seeded evidence changes and ledger.*remove `pending:`/);
  assert.match(persona, /Save the exact `pending:` tuple and bumped `iterations:` count before editing/);
  assert.match(persona, /For every home row or seed commit.*`pending:` tuple and consumed `iteration:`.*separate body lines/);
  assert.match(persona, /ledger's bumped `iterations:` header, not the task's pre-bump `iteration`/);
  assert.match(validation, /commit body's first two lines.*exact dispatched `pending:` tuple.*consumed `iteration:`.*saved iterations \+1/);
});

test('verify owns the gate set, bounded repair and authorized ledger re-bound', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const reference = readFileSync(new URL('skills/loop-implementation/reference/coordinated-legs.md', root), 'utf8');
  const after = driver.split('\n## After the loop\n')[1];
  const gate = after.split('\n1. ')[1].split('\n2. ')[0];
  for (const token of ['gate set', 'Commit verification-produced tracked changes', 'approval option 4 and option 5 alike', 'escalationLoop.implModel', 'loop: repair verification', 'exactly one commit', 'all ledger rows unchanged', 'failing checkout', 'verify active and implement complete', 'amend or stop only', 'no `Retry with hint` or `rows +N`']) assert.ok(gate.includes(token), token);
  assert.match(driver, /Implement-phase stops only: leave implement active/);
  assert.match(driver, /Offer retry and `rows \+N` only at row stops.*alongside Amend and Stop/);
  assert.match(driver, /verification-failure stop keeps amend\/stop only/);
  const expected = readFileSync(new URL('eval/loop-implementation/samples/cap-and-exit-verification/expected.md', root), 'utf8');
  assert.match(expected, /Closed rows run the gate set at verify step 1; option 4 automatically repairs once without amend permission or a cap check/);
  const intent = readFileSync(new URL('eval/loop-implementation/intent.md', root), 'utf8');
  assert.match(intent, /cap-and-exit-verification\/contract: fails -> holds - .*verify step 1/);
  assert.match(after, /Gn tasks.*same tracker/);
  assert.match(after, /Stopped: row <n> reopened by amendment during verify/);
  assert.match(after, /authorize the row's return to ledger implementation or stop/);
  assert.match(after, /Dispatch.*Validate the return.*refresh.*verify still active.*no phase reset/);
  assert.match(after, /close on disk.*rerun step 1/);
  assert.doesNotMatch(driver + reference, /## Exit verification|Reuse the passing exit run|without plan_tracker initialization or lifecycle updates/);
});

test('gate set owns membership, fail-fast logs and every loop verification site', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const conformance = readFileSync(new URL('skills/verification-before-completion/reference/conformance-check.md', root), 'utf8');
  assert.match(driver, /verification: <resolved command>\nchecks: commands\niterations: 0/);
  const before = driver.split('\n## Before each dispatch\n')[1].split('\n## Dispatch\n')[0];
  assert.ok(before.indexOf('checks:') < before.indexOf('| 1 |'));
  const gate = driver.split('\n## Gate set\n')[1]?.split('\n## After the loop\n')[0];
  assert.ok(gate, 'Gate set section before After the loop');
  for (const token of [
    'ledger has no checks: line - seeded under the old contract', '`stop` only',
    'deduplicated union', '(owning checkout, command)', 'non-cut `done` row',
    'first unescaped semicolon', '`failed` rows contribute nothing',
    'ledger row number', 'first row', '## Leg mapping', 'row | ac | leg',
    'never the spec', 'no mapping', 'two checkouts',
    'gate set empty - every row cut', 'foreground', 'one at a time',
    '(cd "<checkout>" && <command>) > "$LOG_DIR/gate-<i>.log" 2>&1',
    'gate <i> exit <code> <log path>', 'Fail-fast', 'later pairs do not run',
    'exit 127', 'no format rule', 'finish Step 1',
    'zero invocations', 'CI runs',
  ]) assert.ok(gate.includes(token), token);
  const after = driver.split('\n## After the loop\n')[1];
  assert.match(after, /0\. .*LOG_DIR=\$\(mktemp -d\)/);
  assert.match(after, /1\. Run the gate set/);
  assert.match(after, /Rerun the failing checkout's gate pairs once/);
  assert.ok(after.includes("After the failing checkout's rerun passes, run the original fail-fast run's still-unexecuted pairs from other checkouts in ledger order under the same redirection before recording verified HEAD."));
  assert.match(after, /2\. .*Rerun the complete gate set after every fix round/);
  assert.match(after, /3\. .*gate set replacing plan Verification/);
  assert.doesNotMatch(after, /Run the ledger's `verification:` command|rerun the full command|Rerun full verification|`contract:` `- verification:`/);
  for (const token of ['### Ledger subjects', 'never the ad-hoc no-plan path', '## Gate set', 'LOG_DIR', 'exit code and log path', 'child reads the log']) assert.ok(conformance.includes(token), token);
  assert.match(conformance, /SCOPED_TEST_COMMANDS`\s+to the gap block: for a ledger, the complete gate set/);
  assert.ok(conformance.includes("retain leg identity, remap the child's repaired leg to its actual isolated worktree and run that leg's pairs with `LOG_DIR` from its own `mktemp -d`; preserve the parent's checkout set and session `LOG_DIR` for post-integration runs"));
  assert.match(conformance, /4\. \*\*Scoped tests\*\*.*ledger.*gate set/);
  assert.match(conformance, /a\. .*ledger.*gate set/);
  assert.match(conformance, /Run the full plan-header `Verification` set once/);
  assert.match(conformance, /round's `SCOPED_TEST_COMMANDS` union/);
});

test('gate output stays in session logs through repair, conformance and finish', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const conformance = readFileSync(new URL('skills/verification-before-completion/reference/conformance-check.md', root), 'utf8');
  const finish = readFileSync(new URL('skills/finishing-a-development-branch/reference/verification-set.md', root), 'utf8');
  const gate = driver.split('\n## Gate set\n')[1].split('\n## After the loop\n')[0];
  const after = driver.split('\n## After the loop\n')[1];
  assert.match(gate, /Use the executing process's `LOG_DIR` for every run and rerun: the parent's session directory minted at verify step 0, or the child's own temporary directory per the conformance ledger-subject override/);
  assert.match(gate, /Print `gate <i> exit <code> <log path>` and keep nothing else from output/);
  assert.match(after, /Mint `LOG_DIR=\$\(mktemp -d\)` once for this verify session; a resumed session mints a new one at its first gate-set site/);
  assert.match(after, /`Problem:` naming `gate <i> exit <code> <log path>` and quoting at most the last 20 lines of that log with `tail -n 20`; this human-stop excerpt is the driver's only log read/);
  assert.match(after, /Rerun the failing checkout's gate pairs once using ## Gate set's log redirection and fail-fast rule/);
  assert.match(after, /absolute spec path, failing command, its checkout, exit code and log path, never pasted output/);
  assert.match(conformance, /Reuse the executing skill's session `LOG_DIR`; on a resumed session mint it once at the first gate-set site/);
  assert.match(conformance, /The child reads the log.*the driver does not read it/);
  assert.match(finish, /mint `LOG_DIR=\$\(mktemp -d\)` once for this session; reuse it for every finish rerun/);
  assert.match(finish, /Do not rely on a verify-session shell variable/);
  assert.match(finish, /For a human stop, quote at most `tail -n 20` from the failing log, alongside its exit line/);
  assert.ok(finish.includes('(cd "<leg primary>" && <command>) > "$LOG_DIR/gate-<i>.log" 2>&1'));
});

const git = (cwd, ...args) => execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8' }).trim();

function companionFixture(target, extraRows = false) {
  const dir = mkdtempSync(join(tmpdir(), 'loop-return-'));
  const repos = ['home', 'companion'].map(name => {
    const path = join(dir, name); mkdirSync(path);
    git(path, 'init', '-q');
    for (const [key, value] of [['user.name', 'Test'], ['user.email', 'test@example.org'], ['commit.gpgsign', 'false'], ['core.hooksPath', '/dev/null']]) git(path, 'config', key, value);
    git(path, 'commit', '--allow-empty', '-qm', 'base');
    return path;
  });
  const [home, companion] = repos;
  const base = git(companion, 'rev-parse', 'HEAD');
  const pending = `pending: ${target} | repo-b | ${base}`;
  let saved = `# Ledger - loop engine\nbase: ${git(home, 'rev-parse', 'HEAD')}\niterations: 1\nallowance: 6\nbase repo-a: ${base}\nseeded repo-a: yes\nbase repo-b: ${base}\nseeded repo-b: no\n${pending}\n\n| row | status | attempts | evidence |\n|---|---|---|---|\n| 1 | open | 0 | home check |\n| 2 | open | 0 | |\n| 3 | cut | 0 | deferred: later |\n\n## Leg mapping\n| row | ac | leg |\n|---|---|---|\n| 1 | 1 | repo-a |\n| 2 | 1 | repo-b |\n| 3 | 2 | repo-b |\n\n## Decisions\nrows +2 | shared allowance\n`;
  if (extraRows) {
    saved = saved.replace('\n## Leg mapping', '| 4 | open | 0 | |\n| 5 | done | 0 | node --test baseline.test.mjs; passed |\n\n## Leg mapping')
      .replace('\n## Decisions', '| 4 | 3 | repo-b |\n| 5 | 4 | repo-b |\n\n## Decisions');
  }
  const ledger = join(home, 'ledger.md');
  writeFileSync(ledger, saved.replace('iterations: 1', 'iterations: 0').replace(pending + '\n', ''));
  git(home, 'add', '.'); git(home, 'commit', '-qm', 'loop: seed ledger');
  const preDispatch = join(dir, 'pre-dispatch.md');
  writeFileSync(preDispatch, readFileSync(ledger, 'utf8'));
  writeFileSync(ledger, saved);
  const reference = readFileSync(new URL('skills/loop-implementation/reference/coordinated-legs.md', root), 'utf8');
  assert.match(reference, /After persisting the bump and pending tuple, bind `SAVED_LEDGER` to the durable home ledger/);
  const admissionLedger = ledger;
  assert.notEqual(readFileSync(preDispatch, 'utf8'), readFileSync(admissionLedger, 'utf8'));
  return { home, companion, base, pending, ledger, saved, target, admissionLedger, preDispatch };
}
function returnCommit(f, { tuple = f.pending, iteration = 1, row = 2, extra = false, unrelated = false, rows, decisions, status = 'done' } = {}) {
  writeFileSync(join(f.companion, 'code.txt'), 'implemented\n');
  git(f.companion, 'add', '.');
  const seed = f.target === 'seed';
  const decision = seed ? 'row 0 done | seeded 1 rows, closed 1 on baseline | none' : 'row 2 done | implemented | do not redo';
  const body = `${tuple}\niteration: ${iteration}\n\n${rows?.join('\n') ?? `| ${row} | done | ${seed ? 0 : 1} | check; passed \\| expected |`}\n\n${decisions?.join('\n') ?? decision}`;
  git(f.companion, 'commit', '-qm', unrelated ? 'unrelated' : seed ? 'loop: seed evidence' : `loop: row 2 ${status}`, '-m', body);
  if (extra) git(f.companion, 'commit', '--allow-empty', '-qm', 'extra');
}
function validateCompanion(f) {
  const reference = readFileSync(new URL('skills/loop-implementation/reference/coordinated-legs.md', root), 'utf8');
  const block = reference.match(/<!-- companion-return-shell -->\s*```bash\n([\s\S]*?)\n```/);
  assert.ok(block, 'reference must supply executable companion commit admission');
  const script = block[1];
  return spawnSync('bash', ['-c', script], { encoding: 'utf8', env: { ...process.env, CHECKOUT: f.companion, PENDING: f.pending, ITERATION: '1', SAVED_LEDGER: f.admissionLedger } });
}

test('partial companion seed admits evidenced subsets and rejects invalid seed rows', () => {
  const valid = [
    ['later row only', ['| 4 | open | 0 | node --test later.test.mjs; assertion mismatch |'], 1, 0],
    ['baseline subset', ['| 2 | done | 0 | node --test first.test.mjs; passed |'], 1, 1],
    ['complete seed', ['| 2 | done | 0 | check-first; passed |', '| 4 | open | 0 | check-later; failed |', '| 5 | done | 0 | check-baseline; passed |'], 3, 2],
  ];
  const invalid = [
    ['no rows', [], 0, 0],
    ['empty evidence', ['| 2 | open | 0 | |'], 1, 0],
    ['foreign row', ['| 1 | open | 0 | check; failed |'], 1, 0],
    ['cut row', ['| 3 | done | 0 | check; passed |'], 1, 1],
    ['attempt changed', ['| 2 | open | 1 | check; failed |'], 1, 0],
    ['failed status', ['| 2 | failed | 0 | check; failed |'], 1, 0],
    ['lost baseline', ['| 5 | open | 0 | check; failed |'], 1, 0],
    ['invented seeded count', ['| 2 | open | 0 | check; failed |'], 3, 0],
    ['invented closure count', ['| 2 | open | 0 | check; failed |'], 1, 1],
    ['duplicate row', ['| 2 | open | 0 | check; failed |', '| 2 | open | 0 | check; failed |'], 2, 0],
  ];
  for (const [cases, passes] of [[valid, true], [invalid, false]]) {
    for (const [name, rows, seeded, closed] of cases) {
      const f = companionFixture('seed', true);
      returnCommit(f, { rows, decisions: [`row 0 done | seeded ${seeded} rows, closed ${closed} on baseline | row 2`] });
      const result = validateCompanion(f);
      assert.equal(result.status === 0, passes, `${name}: ${result.stderr}`);
      if (passes) assert.deepEqual(JSON.parse(result.stdout).rows, rows);
      assert.equal(readFileSync(f.ledger, 'utf8'), f.saved, 'admission is read-only');
    }
  }
});

test('interrupted ordinary and seed returns recover once across two repositories', () => {
  for (const target of ['2', 'seed']) {
    const f = companionFixture(target);
    const homeBefore = git(f.home, 'rev-parse', 'HEAD');
    returnCommit(f);
    assert.notEqual(validateCompanion({ ...f, admissionLedger: f.preDispatch }).status, 0, 'pre-dispatch snapshot is not the admission ledger');
    const result = validateCompanion(f);
    assert.equal(result.status, 0, result.stderr);
    const admitted = JSON.parse(result.stdout);
    assert.equal(git(f.companion, 'rev-list', '--count', `${f.base}..HEAD`), '1');
    assert.equal(readFileSync(f.ledger, 'utf8'), f.saved, 'child leaves home untouched');
    assert.equal(git(f.home, 'rev-parse', 'HEAD'), homeBefore);
    assert.equal(git(f.home, 'status', '--porcelain'), 'M ledger.md', 'only durable pending/bump dirt');
    let next = f.saved.replace(f.pending + '\n', '').replace('| 2 | open | 0 | |', admitted.rows[0].replace('expected |', `expected; commit ${admitted.sha} |`));
    if (target === 'seed') next = next.replace('seeded repo-b: no', 'seeded repo-b: yes');
    next += admitted.decision + '\n';
    writeFileSync(f.ledger, next); git(f.home, 'add', '.'); git(f.home, 'commit', '-qm', 'loop: record companion');
    assert.equal(git(f.home, 'rev-list', '--count', `${homeBefore}..HEAD`), '1');
    assert.match(next, /iterations: 1\nallowance: 6/);
    assert.ok(next.includes(`| 2 | done | ${target === 'seed' ? 0 : 1} |`));
    assert.ok(next.includes('| 1 | open | 0 | home check |'));
    assert.ok(next.includes('| 3 | cut | 0 | deferred: later |'));
    assert.ok(next.includes('seeded repo-a: yes'));
    assert.ok(next.includes('rows +2 | shared allowance'));
    assert.doesNotMatch(next, /^pending:/m, 'resume has no work to recover again');
    assert.notEqual(validateCompanion(f).status, 0, 'cleared tuple cannot be credited twice');
  }
});

test('companion recovery rejects movement and unattributed or foreign results', () => {
  for (const [name, options] of [
    ['zero commits', null], ['wrong tuple', { tuple: 'pending: 1 | repo-b | abc1234' }],
    ['wrong iteration', { iteration: 2 }], ['unrelated commit', { unrelated: true }],
    ['multiple commits', { extra: true }], ['foreign row', { row: 1 }],
  ]) {
    const f = companionFixture('2');
    if (options) returnCommit(f, options);
    const result = validateCompanion(f);
    assert.notEqual(result.status, 0, name);
    assert.equal(readFileSync(f.ledger, 'utf8'), f.saved, name);
  }
});

test('companion ordinary returns admit same-leg extras with matching decisions only', async t => {
  const row = (n, status, attempts) => `| ${n} | ${status} | ${attempts} | node --test row-${n}.test.mjs; passed |`;
  const decision = (n, status) => `row ${n} ${status} | recorded evidence | nothing new to build on`;
  for (const [name, status, extra, lines, accepted] of [
    ['target only', 'done', null, [decision(2, 'done')], true],
    ['done target and same-leg extra', 'done', row(4, 'done', 0), [decision(2, 'done'), decision(4, 'done')], true],
    ['duplicate target row', 'done', row(2, 'done', 1), [decision(2, 'done'), decision(2, 'done')], false],
    ['extra decision status mismatch', 'done', row(4, 'done', 0), [decision(2, 'done'), decision(4, 'failed')], false],
    ['unbounded extra decision', 'done', row(4, 'done', 0), [decision(2, 'done'), `row 4 done | ${'x'.repeat(201)} | reusable fixture`], false],
    ['unbounded extra evidence', 'done', '| 4 | done | 0 | check; a; b; c; d |', [decision(2, 'done'), decision(4, 'done')], false],
    ['failed target and evidenced extra', 'failed', row(4, 'done', 0), [decision(2, 'failed'), decision(4, 'done')], true],
    ['extra without decision', 'done', row(4, 'done', 0), [decision(2, 'done')], false],
    ['decision without changed row', 'done', null, [decision(2, 'done'), decision(4, 'done')], false],
    ['extra decision before target', 'done', row(4, 'done', 0), [decision(4, 'done'), decision(2, 'done')], false],
    ['duplicate extra decision', 'done', row(4, 'done', 0), [decision(2, 'done'), decision(4, 'done'), decision(4, 'done')], false],
    ['foreign extra', 'done', row(1, 'done', 0), [decision(2, 'done'), decision(1, 'done')], false],
    ['failed extra', 'done', row(4, 'failed', 0), [decision(2, 'done'), decision(4, 'failed')], false],
    ['cut extra', 'done', row(3, 'done', 0), [decision(2, 'done'), decision(3, 'done')], false],
    ['already done extra', 'done', row(5, 'done', 0), [decision(2, 'done'), decision(5, 'done')], false],
    ['extra attempts incremented', 'done', row(4, 'done', 1), [decision(2, 'done'), decision(4, 'done')], false],
    ['extra without evidence', 'done', '| 4 | done | 0 | |', [decision(2, 'done'), decision(4, 'done')], false],
  ]) {
    await t.test(name, () => {
      const f = companionFixture('2', true);
      const rows = [row(2, status, 1), ...(extra ? [extra] : [])];
      returnCommit(f, { status, rows, decisions: lines });
      const result = validateCompanion(f);
      assert.equal(result.status === 0, accepted, result.stderr);
      if (accepted) {
        const admitted = JSON.parse(result.stdout);
        assert.deepEqual(admitted.rows, rows);
        assert.deepEqual(admitted.decisions, lines);
        assert.equal(admitted.decision, lines[0], 'operational decision belongs to target');
        assert.deepEqual(JSON.parse(validateCompanion(f).stdout), admitted, 'pending recovery returns the same rows and decisions');
      }
      assert.equal(readFileSync(f.ledger, 'utf8'), f.saved, 'admission never mutates home');
    });
  }
});

test('fresh ledger seeds one allowance without row or leg scaling', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const entry = driver.split('\n## Entry\n')[1].split('For resume,')[0];
  assert.match(entry, /iterations: 0\nallowance: <n>/);
  for (const token of ['maxIterationsPerRow', 'default 4', 'approved `; allowance N`', 'only in the ledger', '24 non-cut rows at default 4 yield allowance 4', 'All-cut ledgers', 'leave allowance unchanged']) assert.ok(entry.includes(token), token);
  assert.doesNotMatch(entry, /cap:|Compute cap|\* maxIterationsPerRow|`maxIterations`/);
  assert.match(driver, /require `allowance:` and no `cap:` before the ordered table, including for seed and completed ledgers/);
  const reference = readFileSync(new URL('skills/loop-implementation/reference/coordinated-legs.md', root), 'utf8').split('## Resume')[0];
  for (const token of ['`allowance:`', 'same allowance', 'never multiply', 'allowance 4', 'All-cut ledgers exit without seed']) assert.ok(reference.includes(token), token);
  assert.doesNotMatch(reference, /cap:|initial cap|cap 14/);
});

test('row budget replies preserve counters and reject malformed grants without writes', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const stop = driver.split('## Human stop')[1].split('## After the loop')[0];
  const retry = stop.split('\n').find(line => line.startsWith('| Retry ('));
  for (const token of [
    'retry <n> \\| <hint>', 'Parse the row number and hint',
    'row <n> retry \\| <hint> \\| allowed attempts <effective allowance + 1>',
    'loop: retry row <n>', 'resume checks with that target/hint',
    'Preserve the header allowance, every attempts cell and iterations',
    "increment only that row's effective allowance by one",
  ]) assert.ok(retry.includes(token), token);
  const raise = stop.split('\n').find(line => line.startsWith('| Raise allowance'));
  for (const token of [
    'Parse anchored `rows +<n>`', '[1-9][0-9]*', 'token boundary (end, whitespace or `\\|`)',
    'Trim the optional remainder and optional leading pipe into the words cell',
    'rows +<n> \\| <words>', 'bare `rows +50` writes `rows +50 \\|`',
    'Raise the shared header allowance by N for every row and leg',
    'Commit both changes exactly once as parent `loop: raise allowance`',
    'leaving iterations and all attempts unchanged', 'return to the ordered table',
    'rows +0', 'rows +x', 'rows -1', 'rows +50x',
    'print the accepted forms `retry <n> \\| <hint>` and `rows +N` once',
    'On the first and every later invalid reply, keep the same stop open with no writes, commit or dispatch',
    'preserve allowance, decisions, iterations and all attempts',
  ]) assert.ok(raise.includes(token), token);
  assert.match(stop, /Offer retry and `rows \+N` only at row stops \(allowance, stagnation or missing-model\), alongside Amend and Stop/);
  assert.match(stop, /Dirty-tree and commit-boundary stops keep discard authorization only/);
  assert.match(stop, /verification-failure stop keeps amend\/stop only/);
  assert.match(stop, /Raising allowance resets neither window/);
  assert.match(stop, /Only retry starts new windows/);
  assert.match(stop, /Retry, `rows \+N` and redraw wait for the human/);
  const replies = readFileSync(new URL('doc/gate-contract.md', root), 'utf8').split('\n').find(line => line.startsWith('| free / question'));
  assert.ok(replies.includes('`retry <n> \\| <hint>` or `rows +N` for loop row stops'));
  assert.doesNotMatch(replies, /cap \+N|loop funding/);
});

test('human stop counts cover every boundary without widening its menu', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const stop = driver.split('## Human stop')[1].split('## After the loop')[0];
  for (const token of [
    'At every human stop, including allowance, stagnation, missing-model, dirty-tree, commit-boundary, interrupted-dispatch and exit-verification stops',
    'list every `open` or `failed` row after the header as `row <n>: <attempts> of <effective allowance>`',
    "then print `Preserve every row's attempts.`",
    'Compute each denominator from the ledger using Before each dispatch',
    'keep retry increments in `## Decisions`, never a new table column',
    'Use restored pre-dispatch target cells at rejected-return stops, not unadmitted child results',
    'With no open or failed rows, omit row lines but retain the preservation sentence',
    'Offer retry and `rows +N` only at row stops (allowance, stagnation or missing-model)',
    'Dirty-tree and commit-boundary stops keep discard authorization only',
    'interrupted-dispatch stops keep their recovery authorization, never budget offers',
    'verification-failure stop keeps amend/stop only',
  ]) assert.ok(stop.includes(token), token);
  assert.match(stop, /Start the message with `gauntlet: question` at every human stop/);
  assert.match(stop, /For verify stops use the menus in After the loop, retaining verify active/);
  assert.match(driver, /\| row \| status \| attempts \| evidence \|/);
});

test('retired loop budgets yield to durable shared allowance and keep waves decoding', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const reference = readFileSync(new URL('skills/loop-implementation/reference/coordinated-legs.md', root), 'utf8');
  const amendment = readFileSync(new URL('skills/brainstorming/reference/amendment-surface.md', root), 'utf8');
  assert.doesNotMatch(driver, /iterations[^\n]*[<>]=?[^\n]*cap|total iteration cap|cap \+|loop: raise cap|ledger has no cap:|3 \+ funded|Recover spent funding|funded round|budget:/);
  assert.doesNotMatch(reference, /\bcap\b|funded|budget:/);
  const before = driver.split('## Before each dispatch')[1].split('## Dispatch')[0];
  assert.match(before, /Keep `iterations:` as a dispatch counter only; it bounds nothing/);
  assert.match(before, /require `allowance:` and no `cap:` before the ordered table/);
  assert.match(before, /ledger has no allowance: line - resume through \/skill:gauntlet-resume/);
  assert.match(before, /ignore its waves-only budget token, retaining no amend permission for a budget-only value/);
  assert.match(before, /\| 3 \| .*two consecutive validation misses/);
  assert.match(before, /\| 4 \| Dispatch allowed/);
  assert.doesNotMatch(before, /\| 5 \|/);
  for (const fact of ['loop: raise allowance', 'including allowance', 'including the saved allowance', 'Preserve attempts, iterations and allowance']) assert.ok(driver.includes(fact), fact);
  for (const fact of ['saved allowance', 'without resetting attempts, iterations or allowance']) assert.ok(reference.includes(fact), fact);
  const stop = driver.split('## Human stop')[1].split('## After the loop')[0];
  for (const fact of ['rows +50 |', '[1-9][0-9]*', 'rows +50x', 'rows +0', 'rows +x', 'rows -1', 'Raise the shared header allowance by N for every row and leg', 'leaving iterations and all attempts unchanged', 'Raising allowance resets neither window', 'Only retry starts new windows']) assert.ok(stop.includes(fact), fact);
  assert.match(stop, /every human stop.*then print `Preserve every row's attempts\.`/);
  assert.match(stop, /Dirty-tree and commit-boundary stops keep discard authorization only/);
  assert.match(amendment, /Apply the budget to the waves engine only; loop ignores the budget token and keeps only the decoded amendment permission \(none for a budget-only value\)/);
  assert.match(amendment, /stop for human authorization before redraw resets or deletions/);
  assert.match(amendment, /Match exactly one `fund N fix rounds` or `N more fix rounds` anywhere on the line/);
  assert.match(amendment, /Decode `auto-apply amends; fund 3 fix rounds` as both capabilities and `2 more fix rounds` as budget-only/);
  assert.match(amendment, /Preserve every row's attempts and the ledger's iterations and allowance\./);
});

test('configuration-allowance: binding documentation describes the single allowance', () => {
  const required = {
    'doc/configuration.md': [
      'iterations: 0\nallowance: 4', 'allowance <n> per row', 'run allowance: <n>',
      'allowance: <n> (reply)', 'allowance: <n> (setting)', 'positive safe integer',
      'last allowed attempt', 'at most once per row', 'one exit-verification repair per flow',
      'retry <n> | <hint>', 'rows +N', 'loop: raise allowance', 'loop: migrate allowance',
      'effective allowance is the header allowance plus one per',
      'Preserve every row\'s attempts.', 'both or neither requires human repair',
      'Old funding supplies no attempts', 'only discard/reset authorization',
    ],
    'doc/implement-engines.md': [
      'no total iteration cap', 'no amend permission required', 'rows +N',
      'loop: migrate allowance', 'Only retry starts new stagnation',
    ],
    'doc/gate-contract.md': [
      'positive safe integer', 'funding on 4/5 and malformed tokens re-present',
      'allowance <n> per row', 'run allowance: <n>', 'rows +N',
    ],
    'README.md': ['loopEngine.maxIterationsPerRow', '4; allowance 6', 'no total iteration cap'],
    'doc/personas.md': ['ordinary attempts', 'last allowed attempt', 'at most once per row'],
  };
  for (const [path, tokens] of Object.entries(required)) {
    const text = readFileSync(new URL(path, root), 'utf8');
    for (const token of tokens) assert.ok(text.includes(token), `${path}: ${token}`);
    assert.doesNotMatch(text, /cap \+N|row-scaled cap|amend-gated within the durable cap|3 \+ funded/);
  }
});

test('eval-allowance-contract: approved fixtures retain IDs and exercise the allowance protocol', () => {
  const inventory = {
    'loop-implementation/scaled-cap-grant': ['rows +50', 'allowance:4', 'retry 24'],
    'loop-implementation/cap-and-exit-verification': ['iterations:200', 'allowance:2'],
    'loop-implementation/funding': ['rows +2', 'fund 2 fix rounds'],
    'loop-implementation/legacy-cap': ['cap97', 'maxIterationsPerRow4', 'unavailable loopEngine settings tool'],
    'loop-implementation/row-progress': ['allowance:4'],
    'loop-implementation/stagnation-and-retry': ['allowance:3', 'allowance:8', 'failed attempts3, below its allowance'],
    'loop-implementation/leg-iteration': ['allowance 4'],
    'loop-implementation/leg-resume': ['allowance: 4'],
    'loop-implementation/commit-boundary': ['allowance:1'],
    'loop-implementation/decision-repair': ['sufficient row allowance'],
    'loop-implementation/tracker-refresh': ['allowance 4'],
    'brainstorming/loop-gate': ['maxIterationsPerRow'],
    'brainstorming/loop-funded-reply': ['allowance'],
    'brainstorming/loop-ledger-amend': ['allowance'],
    'brainstorming/engine-waves': ['fund 2 fix rounds'],
    'gauntlet-resume/loop-ledger-brief': ['allowance:4'],
    'gauntlet-resume/loop-ledger-worktree': ['allowance:4'],
    'gauntlet-resume/ledger-tracker-recovery': ['allowance:4'],
    'gauntlet-resume/ledger-tracker-verify': ['allowance:4', 'row 3 | 2/5: Verify loop behavior and recovery', 'row 3 | 2/6: Verify loop behavior and recovery', '2/5: row 3'],
    'gauntlet-handoff/ledger-task-list': ['allowance4', 'row 1 | 0/4: Verify loop behavior and recovery', 'row 2 | Reject malformed allowance replies'],
    'gauntlet-resume/legacy-cap-brief': ['cap:'],
  };
  for (const target of ['spec-gate', 'brainstorming']) {
    const gateReplay = readFileSync(new URL(`eval/${target}/replay.md`, root), 'utf8');
    assert.match(gateReplay, /gauntlet_setting\(\{ key: "loopEngine" \}\) (?:already )?returned maxIterationsPerRow: 4/);
  }
  for (const [id, tokens] of Object.entries(inventory)) {
    const [target, sample] = id.split('/');
    const dir = new URL(`eval/${target}/samples/${sample}/`, root);
    const input = readFileSync(new URL('case.md', dir), 'utf8');
    const expected = readFileSync(new URL('expected.md', dir), 'utf8');
    for (const token of tokens) assert.ok(input.includes(token), `${id}: ${token}`);
    assert.match(expected, /^- [\w-]+: judged:/m, `${id}: judged facts`);
    if (!sample.startsWith('legacy-')) assert.doesNotMatch(input, /\bcap:\s*\d|iterations \d+, cap \d/);
  }
  const scaled = readFileSync(new URL('eval/loop-implementation/samples/scaled-cap-grant/expected.md', root), 'utf8');
  for (const id of ['stop', 'grant', 'parse', 'independent', 'windows', 'entry', 'validation']) {
    assert.match(scaled, new RegExp(`^- ${id}: judged:`, 'm'), `preserve scaled-cap-grant/${id}`);
  }
  assert.match(scaled, /allowance:54/);
  assert.match(scaled, /allowed attempts 5/);
  assert.doesNotMatch(scaled, /total-cap stop|loop: raise cap/);
  const funding = readFileSync(new URL('eval/loop-implementation/samples/funding/expected.md', root), 'utf8');
  assert.ok(funding.includes('row 1 retry | inspect delimiter | allowed attempts 5'));
  const stagnation = readFileSync(new URL('eval/loop-implementation/samples/stagnation-and-retry/expected.md', root), 'utf8');
  assert.match(stagnation, /allowed attempts9, keeps attempts3 and header8/);
  const labels = readFileSync(new URL('eval/gauntlet-resume/samples/ledger-tracker-verify/expected.md', root), 'utf8');
  assert.match(labels, /canonical ledger identity separately from the description suffix before init and snapshot comparison/);
  assert.ok(labels.includes('row 3 | 2/6: Verify loop behavior and recovery'));
  assert.match(labels, /cut row2 retains its criterion description without an attempt prefix/);
  for (const target of ['loop-implementation', 'gauntlet-resume', 'gauntlet-handoff', 'brainstorming', 'spec-gate', 'writing-plans']) {
    assert.deepEqual(lintTarget(new URL(`eval/${target}`, root).pathname), [], target);
  }
});

test('configuration-allowance: documented gate and entry behavior matches instruction sources', () => {
  const gate = readFileSync(new URL('skills/brainstorming/reference/spec-finalization.md', root), 'utf8');
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const missing = [];
  for (const option of [4, 5]) {
    if (!new RegExp(`^${option} - .*allowance <n> per row`, 'm').test(gate)) {
      missing.push(`approval option ${option} does not render its resolved allowance`);
    }
  }
  if (gate.includes('ignore the funding token and treat the reply as the corresponding bare option')) {
    missing.push('approval gate accepts waves funding on 4/5 instead of re-presenting without writes');
  }
  for (const [name, text] of [['approval gate', gate], ['loop entry', driver]]) {
    if (!text.includes('run allowance: <n>')) missing.push(`${name} omits the literal run allowance carrier`);
  }
  for (const source of ['reply', 'setting']) {
    if (!driver.includes(`allowance: <n> (${source})`)) missing.push(`loop entry omits the ${source} source echo`);
  }
  assert.deepEqual(missing, [], missing.join('; '));
  const gateOnly = gate.slice(gate.indexOf('## User Review Gate'));
  assert.match(gateOnly, /Before the summary `Read` below, resolve `gauntlet_setting\(\{ key: "loopEngine" \}\)` once/);
  assert.match(gateOnly, /Render any settings warning as one adjacent line\. Stop on an unavailable settings tool/);
  assert.match(gateOnly, /print exactly one line `run allowance: <n>` immediately before invoking/);
  assert.match(gateOnly, /omit that line on a bare approval/);
  const funding = gateOnly.split('\n').find(line => line.startsWith('| `4` or `5` with a funding token'));
  assert.match(funding, /re-present the gate quoting the token; write nothing and wait/);
  const entry = driver.slice(driver.indexOf('\n4.'), driver.indexOf('## Before each dispatch'));
  assert.match(entry, /Read the literal `run allowance: <n>` line from the invoking approval turn/);
  assert.match(entry, /Use that value over step 1's setting; with no carrier use `maxIterationsPerRow`/);
  assert.match(entry, /Ignore the carrier once a ledger exists; resume uses its header only/);
  assert.match(readFileSync(new URL('skills/loop-implementation/reference/coordinated-legs.md', root), 'utf8'), /same allowance seed value and source echo as the home driver's Entry step 4/);
});
