import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import test from 'node:test';
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
  const steps = ['## Before each dispatch', '## Dispatch', '## Validate the return', '## Exit verification', '## After the loop'];
  for (let i = 1; i < steps.length; i++) assert.ok(driver.indexOf(steps[i]) > driver.indexOf(steps[i - 1]), steps[i]);
  const continuation = driver.slice(driver.indexOf('## After the loop'));
  assert.ok(driver.indexOf('action: "complete", phase: "implement"') < driver.indexOf('## After the loop'));
  assert.ok(continuation.indexOf('whole-diff `code-reviewer`') < continuation.indexOf('separate fresh `conformance-reviewer`'));
  for (const fact of ['3 + funded N', 'latest `row <n> retry`', 'Two consecutive validation misses', 'only `open` -> `done`', 'attempts +1', 'Exactly one NEW', 'spent < N', 'no reopening and no automatic rerun', 'No task reopen/update is awaited']) assert.ok(driver.includes(fact), fact);
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
  assert.doesNotMatch(driver, /plan_tracker\(.*init|worktree: true|model:\s/);
  assert.ok(STAGE_SKILL_DIRS.includes('skills/loop-implementation'));
  assert.deepEqual(lintStageSkillDirs(root.pathname, ['skills/loop-implementation']), []);
});

test('coordinated loop owns stable mappings, attributed returns and pending recovery', () => {
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const persona = readFileSync(new URL('agents/loop-implementer.md', root), 'utf8');
  for (const token of ['missing/duplicate scope lines', 'duplicate indices within a list', 'malformed tokens', 'out-of-range original indices', 'cut original AC indices', 'absent from every valid list to home', 'repeat shared indices', 'independent of scope-list order', 'duplicate/missing mappings', 'All-cut cap stays 1', 'unseeded leg with non-cut entries in membership order', 'wholly cut legs', 'legacy and single-member ledger bytes unchanged', 'scope: AC 1, AC 3', 'scope: none', 'original AC order', 'membership order', '## Leg mapping', 'row | ac | leg', 'base repo-a:', 'seeded repo-a:', 'cap 14', 'pending: 2 | repo-b | abc1234', 'without another attempt or iteration bump', 'zero commits', 'foreign entry', 'disposition-only cut', 'design:']) assert.ok(driver.includes(token), token);
  for (const token of ['pending:', 'iteration:', 'four-column', 'home ledger untouched', 'loop: seed evidence', 'loop: row', 'mapped original AC', 'Rules:']) assert.ok(persona.includes(token), token);
  assert.match(driver, /Read each member's verification from the home spec's `## Legs` `contract:` `- verification:` line before dispatch/);
  assert.match(driver, /For coordinated exit, read each leg's verification from the home spec's `## Legs` `contract:` `- verification:` line/);
  assert.doesNotMatch(driver, /record each member's verification contract|each leg's recorded verification/);
  assert.ok(driver.indexOf('Recover pending companion work') < driver.indexOf('## Before each dispatch'));
  const legacySkeleton = driver.match(/```markdown\n([\s\S]*?)```/)[1];
  assert.doesNotMatch(legacySkeleton, /Leg mapping|base repo-|seeded repo-|pending:|legs:|--leg/);
  assert.ok(driver.includes('single-member/legacy paths free of a companion loop, leg file, `legs:` brief or `--leg` argument'));
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
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  assert.match(driver, /After persisting the bump and pending tuple, bind `SAVED_LEDGER` to the durable home ledger/);
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
  const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
  const block = driver.match(/<!-- companion-return-shell -->\s*```bash\n([\s\S]*?)\n```/);
  assert.ok(block, 'driver must supply executable companion commit admission');
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
  const entry = driver.split('## Entry')[1].split('## Before each dispatch')[0];
  assert.match(entry, /\(rows not initialized cut\) \* maxIterationsPerRow \+ 1/);
  assert.match(entry, /Later cuts, reopens and requirement-preserving amendments leave cap unchanged/);
  assert.doesNotMatch(entry, /`maxIterations`/);
  const stop = driver.split('## Human stop')[1].split('## After the loop')[0];
  for (const token of ['durable iterations + N', 'leaving iterations and all attempts unchanged', 'return to the ordered table', 'a second invalid reply holds the same stop with no commit', 'Only retry starts new windows']) assert.ok(stop.includes(token), token);
  assert.match(driver, /dirty-tree and commit-boundary stops.*never offer `cap \+N`/);
  assert.match(driver, /before.*rule 1/);
  assert.match(driver, /every stop.*Preserve every row's attempts and the total iteration cap\./);
});
