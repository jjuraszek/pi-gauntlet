import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const brief = readFileSync(new URL('../skills/gatekeep-pr/verification-brief.md', import.meta.url), 'utf8');
const early = '2026-01-01T10:00:00Z';
const middle = '2026-01-01T11:00:00Z';
const late = '2026-01-01T12:00:00Z';

const review = (login, submittedAt) => ({ author: login ? { login } : null, submittedAt, state: 'CHANGES_REQUESTED' });
const user = login => ({ __typename: 'User', login });
const connection = nodes => ({ nodes, pageInfo: { hasNextPage: false } });
const pr = (reviews = [review('Lee', early)], requests = [], committedDate = early) => ({
  latestOpinionatedReviews: connection(reviews),
  reviewRequests: connection(requests.map(requestedReviewer => ({ requestedReviewer }))),
  commits: { nodes: [{ commit: { committedDate } }] },
});

const two = [review('Lee', early), review('Sam', late)];
const withoutLogin = [review(null, early)];
const page = { ...connection([]), pageInfo: { hasNextPage: true } };

test('run the discovery review lookup against GitHub responses', async t => {
  const section = brief.split('\n#### Review lookup\n')[1]?.split(/\n#{1,4} /)[0];
  const block = section?.match(/```bash\n([\s\S]*?)\n```/)?.[1];
  assert.ok(block, 'Missing executable bash fence under Review lookup');
  const command = block.replaceAll('<owner>', 'acme').replaceAll('<repo>', 'widgets').replaceAll('<N>', '42');
  const dir = mkdtempSync(join(tmpdir(), 'gatekeep-review-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  writeFileSync(join(dir, 'gh'), `#!/bin/sh
case "$1 $2" in 'api graphql') ;; *) exit 2 ;; esac
case "$*" in *latestOpinionatedReviews*) ;; *) exit 2 ;; esac
if [ "$GH_STUB_FAIL" = 1 ]; then
  echo 'gh: review lookup failed' >&2
  exit 7
fi
printf '%s\\n' "$GH_STUB_JSON"
`, { mode: 0o755 });

  function run(pullRequest, fail = false, json = JSON.stringify({ data: { repository: { pullRequest } } })) {
    const result = spawnSync('bash', ['-c', command], { cwd: dir, encoding: 'utf8', timeout: 5000,
      env: { PATH: `${dir}:${process.env.PATH}`, GH_STUB_JSON: json, GH_STUB_FAIL: fail ? '1' : '0' },
    });
    assert.ifError(result.error);
    assert.equal(result.signal, null);
    return result;
  }
  for (const [name, response, verdict] of [
    ['all requesters re-requested', pr(two, [user('LEE'), user('sAm')]), 'answered'],
    ['later commit without a re-request', pr(undefined, [], late), 'answered'],
    ['later plain comment does not withdraw a change request', { ...pr(), latestReviews: { nodes: [{ author: { login: 'Lee' }, state: 'COMMENTED', submittedAt: late }] } }, 'unanswered'],
    ['only one of two re-requested', pr(two, [user('Lee')]), 'unanswered'],
    ['signals cannot be split across requesters', pr(two, [user('Sam')], middle), 'unanswered'],
    ['equal commit and review dates', pr(), 'unanswered'],
    ['equal instants in different time zones', pr(undefined, [], '2026-01-01T12:00:00+02:00'), 'unanswered'],
    ['later instant with an earlier local clock', pr(undefined, [], '2026-01-01T09:00:01-01:00'), 'answered'],
    ['later fractional second', pr(undefined, [], '2026-01-01T10:00:00.1Z'), 'answered'],
    ['no change requester', pr([{ ...review('Lee', late), state: 'APPROVED' }]), 'answered'],
    ['only a team requested', pr(undefined, [{ __typename: 'Team' }]), 'unanswered'],
    ['null pending reviewer cannot match', pr(undefined, [null]), 'unanswered'],
    ['deleted requester cannot match', pr(withoutLogin, [user('Lee')]), 'unanswered'],
    ['later commit after deleted requester', pr(withoutLogin, [], late), 'answered'],
    ['missing pull request', null, 'malformed'],
    ['missing opinionated reviews', { ...pr(), latestOpinionatedReviews: undefined }, 'malformed'],
    ['missing requests', { ...pr(), reviewRequests: undefined }, 'malformed'],
    ['missing commits', { ...pr(), commits: undefined }, 'malformed'],
    ['missing reviews page flag', { ...pr(), latestOpinionatedReviews: { nodes: [], pageInfo: {} } }, 'malformed'],
    ['missing requests page flag', { ...pr(), reviewRequests: { nodes: [], pageInfo: {} } }, 'malformed'],
    ['missing last commit', { ...pr(), commits: { nodes: [] } }, 'malformed'],
    ['missing requester timestamp', pr([review('Lee', undefined)]), 'malformed'],
    ['missing pending reviewer type', pr(undefined, [{ login: 'Lee' }]), 'malformed'],
    ['non-string pending reviewer type', pr(undefined, [{ __typename: 1, login: 'Lee' }]), 'malformed'],
    ['incomplete reviews', { ...pr(), latestOpinionatedReviews: page }, 'incomplete'],
    ['incomplete requests', { ...pr(), reviewRequests: page }, 'incomplete'],
  ]) {
    await t.test(name, () => {
      const result = run(response);
      assert.equal(result.stdout, `${verdict}\n`, result.stderr);
      assert.equal(result.status === 0, verdict === 'answered' || verdict === 'unanswered');
    });
  }
  for (const json of ['', '{', '{}\n{}']) {
    await t.test(`malformed JSON response: ${JSON.stringify(json)}`, () => {
      const result = run(null, false, json);
      assert.equal(result.stdout, 'malformed\n');
      assert.notEqual(result.status, 0);
    });
  }
  await t.test('preserve failed lookup status and first stderr line', () => {
    const result = run(null, true);
    assert.equal(result.status, 7);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, 'gh: review lookup failed\n');
  });
});
