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
  for (const fact of ['3 + funded N', 'latest `row <n> retry`', 'Two consecutive validation misses', 'only `open` -> `done`', 'attempts +1', 'Exactly one NEW', 'spent < N', 'No task reopen/update is awaited']) assert.ok(driver.includes(fact), fact);
  assert.match(driver, /Count empty child commits and validation misses only after the latest `loop: retry row <n>` commit\. Funding alone resets neither window\. Preserve every row's attempts and the total iteration cap\./);
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

test('amend permission bounds row escalation and one exit repair', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  for (const token of ['attempts >= allowance', 'row <n> escalated | implModel round | allowed attempts <attempts + 1>', 'loop: escalate row <n>', 'escalated round for row <n>', 'max(0, min(attempts, 3 + N) - 3)', 'model: <implModel>', 'gauntlet_setting({ key: "escalationLoop" })', 'rules 3-4', 'starts no new empty-child or validation-miss window', 'unrecoverable means spent', 'loop: repair verification', 'exactly one commit', 'rows unchanged', 'Rerun that command once', 'escalated round spent', 'Recommendation: none - evidence repeats row <n>', 'took recommendation: amend for row <n>', 'budget-only', 'iterations < cap']) assert.ok(driver.includes(token), token);
  assert.match(driver, /Omit the model override except on an escalated round/);
  assert.match(driver, /no permission or spent identity: no reopening and no automatic rerun/);
  assert.match(driver, /empty parent marker/);
  assert.match(driver, /This marker is once per flow\./);
  for (const token of ['the implementation worktree as cwd and its Rules', 'absolute spec path and the exact verification command', 'On success record verified HEAD and clean status']) assert.ok(driver.includes(token), token);
  assert.ok(Buffer.byteLength(driver) < 50000);
  assert.deepEqual(lintTarget(new URL('eval/loop-implementation', root).pathname), []);
});

test('coordinated loop owns stable mappings, attributed returns and pending recovery', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const reference = readFileSync(new URL('skills/loop-implementation/reference/coordinated-legs.md', root), 'utf8');
  const persona = readFileSync(new URL('agents/loop-implementer.md', root), 'utf8');
  for (const token of ['missing/duplicate scope lines', 'duplicate indices within a list', 'malformed tokens', 'out-of-range original indices', 'cut original AC indices', 'absent from every valid list to home', 'repeat shared indices', 'independent of scope-list order', 'duplicate/missing mappings', 'All-cut cap stays 1', 'unseeded leg with non-cut entries in membership order', 'wholly cut legs', 'scope: AC 1, AC 3', 'scope: none', 'original AC order', 'membership order', '## Leg mapping', 'row | ac | leg', 'base repo-a:', 'seeded repo-a:', 'cap 14', 'pending: 2 | repo-b | abc1234', 'without another attempt or iteration bump', 'zero commits', 'foreign entry', 'disposition-only cut', 'design:']) assert.ok(reference.includes(token), token);
  for (const token of ['pending:', 'iteration:', 'four-column', 'home ledger untouched', 'loop: seed evidence', 'loop: row', 'mapped original AC', 'Rules:']) assert.ok(persona.includes(token), token);
  assert.match(reference, /Read each member's verification from the home spec's `## Legs` `contract:` `- verification:` line before dispatch/);
  assert.match(reference, /For coordinated exit, read each leg's verification from the home spec's `## Legs` `contract:` `- verification:` line/);
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

test('coordinated reference reads gate fresh entry and every restore before dispatch decisions', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const path = 'reference/coordinated-legs.md';
  assert.equal(driver.split(path).length - 1, 2);
  const entry = driver.split('\n## Entry\n')[1].split('\n## Before each dispatch\n')[0];
  const dispatch = driver.split('\n## Before each dispatch\n')[1].split('\n## Dispatch\n')[0].trimStart();
  const entryRead = entry.split('\n').find(line => line.includes(path));
  const dispatchRead = dispatch.split('\n')[0];
  for (const line of [entryRead, dispatchRead]) {
    assert.ok(line.includes(path));
    assert.match(line.split('. ')[0], /spec whose `## Legs` section has more than one `### Leg:` block/);
    assert.match(line.split('. ')[0], /stop on an unreadable reference naming its path, never reconstruct it/);
  }
  assert.match(entryRead, /On fresh entry and on every ledger restore/);
  assert.match(entryRead, /On fresh entry apply its `## Entry` section instead of the home-only skeleton and cap calculation below/);
  assert.match(entryRead, /On a restore apply its `## Resume` section before the dirty-tree stop and before any pending recovery/);
  assert.ok(dispatch.startsWith('For a spec whose'));
  assert.ok(dispatch.indexOf(path) < dispatch.indexOf('| 1 |'));
  assert.match(dispatchRead, /Apply its `## Resume`, `## Targeting and dispatch`, `## Companion return validation`, `### Companion commit admission` and `## Amendments` sections together with this driver; never apply `## Entry` here/);
  assert.doesNotMatch(driver, /^## Coordinated Entry and resume$|^### Companion commit admission$/m);
  const dispatchBody = driver.split('\n## Dispatch\n')[1].split('\n## Validate the return\n')[0];
  assert.match(dispatchBody, /pending: <row or seed> \| <repo> \| <HEAD sha>/);
  assert.doesNotMatch(driver, /companion-return-shell|## Leg mapping/);
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
  assert.match(reference, /That home-ledger commit.*`loop: record <repo> row <n>`.*parent commit, not a child `loop: row .*` commit: it never counts toward child-only empty-commit stagnation; only the companion.*own commits are counted at the boundary/);
  assert.doesNotMatch(driver, /plan_tracker\(.*(?:init|add|update)|phase_tracker\(\{ action: "complete", phase: "implement"/);
  assert.ok(driver.trimEnd().split('\n').length < 150);
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
  assert.match(driver, /Retry, cut, amend, raise-cap and escalate commits never clear the tuple/);
  assert.match(persona, /Remove the `pending:` line from the ledger in your commit/);
  assert.match(persona, /Preserve row identifiers, row text, ledger headers \(except removal of `pending:`\)/);
  assert.match(persona, /Stage the seeded evidence changes and ledger.*remove `pending:`/);
  assert.match(persona, /Save the exact `pending:` tuple and bumped `iterations:` count before editing/);
  assert.match(persona, /For every home row or seed commit.*`pending:` tuple and consumed `iteration:`.*separate body lines/);
  assert.match(persona, /ledger's bumped `iterations:` header, not the task's pre-bump `iteration`/);
  assert.match(validation, /commit body's first two lines.*exact dispatched `pending:` tuple.*consumed `iteration:`.*saved iterations \+1/);
});

test('verify owns the per-leg gate, bounded repair and authorized ledger re-bound', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const reference = readFileSync(new URL('skills/loop-implementation/reference/coordinated-legs.md', root), 'utf8');
  const after = driver.split('\n## After the loop\n')[1];
  const gate = after.split('\n1. ')[1].split('\n2. ')[0];
  for (const token of ['ledger', 'verification:', 'contract:', '- verification:', 'once foreground', 'owning checkout', 'iterations < cap', 'escalationLoop.implModel', 'loop: repair verification', 'exactly one commit', 'all ledger rows unchanged', 'failing leg only', 'verify active and implement complete', 'amend or stop only', 'no `Retry with hint` or `cap +N`']) assert.ok(gate.includes(token), token);
  assert.match(driver, /Implement-phase stops only: leave implement active/);
  assert.match(driver, /clean cap stop.*`cap \+N` alongside.*`Retry with hint`.*Amend.*Stop/);
  assert.match(driver, /Only the verify-step-1 verification-failure stop restricts.*amend\/stop/);
  const expected = readFileSync(new URL('eval/loop-implementation/samples/cap-and-exit-verification/expected.md', root), 'utf8');
  assert.match(expected, /Closed rows run the ledger gate once at verify step 1; failure quotes output, never reopens\/reruns, keeps verify active and implement complete, and offers amend or stop only/);
  const intent = readFileSync(new URL('eval/loop-implementation/intent.md', root), 'utf8');
  assert.match(intent, /cap-and-exit-verification\/contract: fails -> holds - .*verify step 1/);
  assert.match(after, /Gn tasks.*same tracker/);
  assert.match(after, /Stopped: row <n> reopened by amendment during verify/);
  assert.match(after, /authorize the row's return to ledger implementation or stop/);
  assert.match(after, /Dispatch.*Validate the return.*refresh.*verify still active.*no phase reset/);
  assert.match(after, /close on disk.*rerun step 1/);
  assert.doesNotMatch(driver + reference, /## Exit verification|Reuse the passing exit run|without plan_tracker initialization or lifecycle updates/);
});

const git = (cwd, ...args) => execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8' }).trim();

function companionFixture(target) {
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
  const saved = `# Ledger - loop engine\nbase: ${git(home, 'rev-parse', 'HEAD')}\niterations: 1\ncap: 14\nbase repo-a: ${base}\nseeded repo-a: yes\nbase repo-b: ${base}\nseeded repo-b: no\n${pending}\n\n| row | status | attempts | evidence |\n|---|---|---|---|\n| 1 | open | 0 | home check |\n| 2 | open | 0 | |\n| 3 | cut | 0 | deferred: later |\n\n## Leg mapping\n| row | ac | leg |\n|---|---|---|\n| 1 | 1 | repo-a |\n| 2 | 1 | repo-b |\n| 3 | 2 | repo-b |\n\n## Decisions\ncap +2 | funded\n`;
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
function returnCommit(f, { tuple = f.pending, iteration = 1, row = 2, extra = false, unrelated = false } = {}) {
  writeFileSync(join(f.companion, 'code.txt'), 'implemented\n');
  git(f.companion, 'add', '.');
  const seed = f.target === 'seed';
  const decision = seed ? 'row 0 done | seeded 1 rows, closed 1 on baseline | none' : 'row 2 done | implemented | do not redo';
  const body = `${tuple}\niteration: ${iteration}\n\n| ${row} | done | ${seed ? 0 : 1} | check; passed \\| expected |\n\n${decision}`;
  git(f.companion, 'commit', '-qm', unrelated ? 'unrelated' : seed ? 'loop: seed evidence' : 'loop: row 2 done', '-m', body);
  if (extra) git(f.companion, 'commit', '--allow-empty', '-qm', 'extra');
}
function validateCompanion(f) {
  const reference = readFileSync(new URL('skills/loop-implementation/reference/coordinated-legs.md', root), 'utf8');
  const block = reference.match(/<!-- companion-return-shell -->\s*```bash\n([\s\S]*?)\n```/);
  assert.ok(block, 'reference must supply executable companion commit admission');
  const script = block[1];
  return spawnSync('bash', ['-c', script], { encoding: 'utf8', env: { ...process.env, CHECKOUT: f.companion, PENDING: f.pending, ITERATION: '1', SAVED_LEDGER: f.admissionLedger } });
}

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
    assert.match(next, /iterations: 1\ncap: 14/);
    assert.ok(next.includes(`| 2 | done | ${target === 'seed' ? 0 : 1} |`));
    assert.ok(next.includes('| 1 | open | 0 | home check |'));
    assert.ok(next.includes('| 3 | cut | 0 | deferred: later |'));
    assert.ok(next.includes('seeded repo-a: yes'));
    assert.ok(next.includes('cap +2 | funded'));
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

test('ledger cap is durable across grants, child validation and legacy admission', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  assert.match(driver, /iterations: 0\ncap: <n>/);
  for (const fact of ['maxIterationsPerRow', '`iterations` >= `cap`', 'loop: raise cap', 'ledger has no cap: line - seeded under the old loopEngine contract', 'latest operational `row <n> ...` decision', 'including cap', 'cap +50 |', '[1-9][0-9]*', 'cap +50x', 'separate replies', 'cap grant resets neither window']) assert.ok(driver.includes(fact), fact);
  const entry = driver.split('\n## Entry\n')[1].split('\n## Before each dispatch\n')[0];
  assert.match(entry, /\(rows not initialized cut\) \* maxIterationsPerRow \+ 1/);
  assert.match(entry, /Later cuts, reopens and requirement-preserving amendments leave cap unchanged/);
  assert.doesNotMatch(entry, /`maxIterations`/);
  const stop = driver.split('## Human stop')[1].split('## After the loop')[0];
  for (const token of ['durable iterations + N', 'leaving iterations and all attempts unchanged', 'return to the ordered table', 'a second invalid reply holds the same stop with no commit', 'Only retry starts new windows']) assert.ok(stop.includes(token), token);
  assert.match(driver, /dirty-tree and commit-boundary stops.*never offer `cap \+N`/);
  assert.match(driver, /before.*rule 1/);
  assert.match(driver, /every stop.*Preserve every row's attempts and the total iteration cap\./);
});
