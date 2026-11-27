import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const skill = read('skills/gauntlet/ship/ship.md');
const step = skill.split('### Step 4: Present Options')[1].split('**Rework PR subject')[0];
const legs = read('skills/gauntlet/ship/legs.md');
const rendering = legs.split('## Decisions above the ship menu')[1]?.split('## Activation and authority')[0] ?? '';
const digest = `${step}\n${rendering}`;
const command = digest.match(/`(git -C "\$WORKTREE" log [^`]+)`/)?.[1];
const choice = '- choice | Keep the old cache key | Existing readers still need it';
const cache = '- cache | Cache lifetime | Cache entries expire after one hour | granted | standing grant | fixture measured 3600 seconds';
const bytes = '- bytes | Fixture byte count | The fixture contains 43117 bytes | auto-apply | measured correction | wc returned 43117';
const accepted = '- scope | Keep offline cache deferred | Offline cache stays outside this change | accepted | human pick | approved disposition';
const repair = 'Repair plan citations\n\nThe section offsets now match the spec.';
const subjectOnly = '- subject | Not an amendment | This line is only a subject | granted | fixture | no body record';

function fixture(messages, baseBody = '') {
  const cwd = mkdtempSync(join(tmpdir(), 'finish-digest-'));
  const env = {
    ...process.env, WORKTREE: cwd,
    GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null',
    GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
    GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid',
  };
  const run = (program, args) => execFileSync('timeout', ['-k', '30', '10', program, ...args], {
    cwd, env, encoding: 'utf8', timeout: 45_000, stdio: ['ignore', 'pipe', 'pipe'],
  });
  const git = (...args) => run('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', ...args]);
  git('init', '-q', '-b', 'fixture-base');
  git('commit', '--allow-empty', '-qm', `Create fixture base\n\n${baseBody}`);
  git('checkout', '-qb', 'fixture-change');
  for (const message of messages) git('commit', '--allow-empty', '-qm', message);
  return { cwd, run, git };
}

test('the extracted log recipe and selector keep every applied body row and exclude unrelated records', async t => {
  assert.equal(command, 'git -C "$WORKTREE" log <base-branch>..HEAD --format=%b --reverse');
  const selector = digest.match(/lines matching `([^`]+)`/)?.[1];
  assert.equal(selector, '^- [^|]+ \\| [^|]+ \\| [^|]+ \\| (auto-apply|granted) \\| ');
  const selectors = [selector, digest.match(/`(\^- choice [^`]+)`/)?.[1]];
  assert.equal(selectors[1], '^- choice \\| [^|]+ \\| .+$');
  const patterns = selectors.map(s => new RegExp(s));
  const cases = [
    ['plain-subject amendments and citation repair', [
      `Amend the spec for Fixture byte count\n\n${bytes}`,
      `Amend the spec for Cache lifetime and 1 more\n\n${cache}\n${accepted}\n"auto-apply amends"`,
      repair,
    ], '', [bytes, cache]],
    ['repeated recommendations stay separate', [`Keep the cache key\n\n${choice}`, `Retain old readers\n\n${choice}`], '', [choice, choice]],
    ['multiple applied rows in one body', [`Amend the spec for two facts\n\n${cache}\n${bytes}\n${accepted}`], '', [cache, bytes]],
    ['citation repair only', [repair], '', []],
    ['base records are outside the branch range', [repair], cache, []],
    ['record-shaped subject only', [`${subjectOnly}\n\nNo amendment applied.`], '', []],
    ['empty application batch and near matches', [
      'Record redirected amendment choices\n\n' + [
        '- cache | Cache lifetime | Route to follow-up | custom(follow-up) | human pick | separate work',
        accepted, '"auto-apply amends"',
        '- granted | Kind is elsewhere | auto-apply | accepted | reviewer | evidence',
        '  - cache | Indented quote | Not an audit row | granted | reviewer | evidence',
      ].join('\n'),
    ], '', []],
  ];
  for (const [name, messages, baseBody, expected] of cases) await t.test(name, () => {
    const f = fixture(messages, baseBody);
    const head = f.git('rev-parse', 'HEAD');
    const bodies = f.run('bash', ['-c', command.replace('<base-branch>', 'fixture-base')]);
    assert.deepEqual(bodies.split('\n').filter(line => patterns.some(pattern => pattern.test(line))), expected);
    assert.equal(f.git('rev-parse', 'HEAD'), head);
    assert.equal(f.git('status', '--porcelain'), '');
  });
});

test('a receipt-proven companion without a worktree reads the attempted feature range', () => {
  const retry = rendering.match(/`(git -C "<companion primary>" log [^`]+)`/)?.[1];
  assert.ok(retry, 'the decision list defines a log recipe for a missing companion worktree');
  assert.match(step, /read companion ranges per the \[decision list\]/);
  assert.match(rendering, /validated receipt.*`attempted-head`/);
  assert.match(rendering, /On failure, stop before the menu and name the companion and unreadable range/);

  const standIn = '- stand-in | paper receipt | typed receipt';
  const f = fixture([`Test receipt printing\n\n${standIn}`]);
  const attemptedHead = f.git('rev-parse', 'HEAD').trim();
  f.git('checkout', '-q', 'fixture-base');
  f.git('commit', '--allow-empty', '-qm', 'Squash delivery');
  f.git('commit', '--allow-empty', '-qm', 'Unrelated primary update');
  assert.equal(f.git('worktree', 'list', '--porcelain').match(/^worktree /gm).length, 1);

  const readRange = head => f.run('bash', ['-c', retry.replace('<companion primary>', f.cwd)
    .replace('<base-branch>', 'fixture-base').replace('<attempted-head>', head)]);
  assert.deepEqual(readRange(attemptedHead).trim().split('\n'), [standIn]);
  assert.throws(() => readRange('0'.repeat(attemptedHead.length)), /bad revision|unknown revision|Invalid revision range|ambiguous argument/);
});

test('the decision list shortens wording rather than dropping reasons or stand-ins', () => {
  assert.match(digest, /verdict-report\.md#register/);
  assert.match(digest, /commit hashes or row, task or finding numbers/);
  assert.match(digest, /under 180 words, heading included/);
  assert.match(digest, /each choice and reason/);
  assert.match(digest, /stand-in lines alone.*cap.*print them all/i);
  const { outputs } = JSON.parse(read('eval/ship/results/choices-list/candidate.json'));
  assert.ok(Object.keys(outputs).length > 0);
  for (const { status, text } of Object.values(outputs)) {
    assert.equal(status, 'ok');
    const list = text.match(/What the run decided on its own \(4\):\n(?:- [^\n]+\n?){4}/)?.[0];
    assert.ok(list && list.split(/\s+/).length < 180);
    assert.doesNotMatch(list, /a1b2c3d|(?:row|task|finding) \d+|normalize (?:the )?paths? before routing/i);
    const overflow = text.split('What the run decided on its own (20):')[1];
    assert.equal(overflow?.match(/^- (?=.*receipts)(?=.*handwritten).+/gim)?.length, 20);
  }
});

test('one list maps audit evidence and recommendations without merging equal lines', () => {
  assert.match(step, /\[decision list\]\(legs\.md#decisions-above-the-ship-menu\)/);
  assert.equal(existsSync(new URL('../skills/gauntlet/ship/decisions.md', import.meta.url)), false);
  assert.match(rendering, /What the run decided on its own \(N\):\n- <what> - <why>/);
  assert.match(rendering, /- <missing data> was not available, so <what stood in> stood in; this is not proven on the data the ticket meant\./);
  assert.match(digest, /<title>: <what changed>/);
  assert.match(digest, /evidence.*`none`.*fifth cell/);
  assert.match(digest, /one entry per matching line, including repeats/i);
  assert.match(digest, /Omit the block when N = 0/);
  assert.doesNotMatch(digest, /Amendments auto-applied/);
  const { outputs } = JSON.parse(read('eval/ship/results/digest-from-record-lines/candidate.json'));
  assert.ok(Object.keys(outputs).length > 0);
  for (const { status, text } of Object.values(outputs)) {
    assert.equal(status, 'ok');
    const list = text.split('What the run decided on its own (4):\n')[1]?.split('\n\n')[0];
    assert.match(list, /^- .*43117.*measured again\n- .*one hour.*3600 seconds(\n- .*old cache key.*readers.*){2}$/i);
  }
});
