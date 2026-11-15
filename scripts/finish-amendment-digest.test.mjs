import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const skill = read('skills/finishing-a-development-branch/SKILL.md');
const digest = skill.split('**Amendment digest (both variants).**')[1].split('**Rework PR subject')[0];
const command = digest.match(/`(git -C "\$WORKTREE" log [^`]+)`/)?.[1];
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
  return { run, git };
}

test('the extracted log recipe and selector keep every applied body row and exclude unrelated records', async t => {
  assert.equal(command, 'git -C "$WORKTREE" log <base-branch>..HEAD --format=%b');
  const selector = digest.match(/lines matching `([^`]+)`/)?.[1];
  assert.equal(selector, '^- [^|]+ \\| [^|]+ \\| [^|]+ \\| (auto-apply|granted) \\| ');
  const pattern = new RegExp(selector);
  const cases = [
    ['plain-subject amendments and citation repair', [
      `Amend the spec for Fixture byte count\n\n${bytes}`,
      `Amend the spec for Cache lifetime and 1 more\n\n${cache}\n${accepted}\n"auto-apply amends"`,
      repair,
    ], '', [cache, bytes]],
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
    assert.deepEqual(bodies.split('\n').filter(line => pattern.test(line)), expected);
    assert.equal(f.git('rev-parse', 'HEAD'), head);
    assert.equal(f.git('status', '--porcelain'), '');
  });
});

test('saved digest examples render the selected title and change fields, not current model execution', async t => {
  const saved = JSON.parse(read('eval/finishing-a-development-branch/results/digest-from-record-lines/candidate.json'));
  const outputs = Object.entries(saved.outputs);
  assert.ok(outputs.length > 0, 'reuse at least one saved rendering');
  const expected = [cache, bytes].map(line => {
    const [, title, what] = line.split(' | ');
    return `- ${title} - ${what}`;
  }).join('\n');
  for (const [model, output] of outputs) await t.test(model, () => {
    assert.equal(output.status, 'ok');
    assert.ok(output.text.includes(`Amendments auto-applied (2):\n${expected}`));
    assert.match(output.text, /(?:block is omitted|block is omitted entirely)/);
  });
  assert.match(digest, /Select by these body records, never by subject/);
  assert.match(digest, /commits without matching rows contribute nothing/);
  assert.match(digest, /Amendments auto-applied \(N\):\n- <title> - <what changed>/);
  assert.match(digest, /Omit the block when N = 0/);
});
