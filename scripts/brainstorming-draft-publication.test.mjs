import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { sha256 } from '../eval/lib/checks.mjs';
import { replayFactsSha } from './replay-facts.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const sample = 'eval/spec-gate/samples/option-6-handoff';

test('draft PR row 4 persists deferred headers before spec-only publication and create-only retry', () => {
  const gate = read('skills/gauntlet/brainstorm/spec-finalization.md');
  assert.ok(gate.includes('for row-4 reply decoding, publication'));
  assert.ok(gate.split('\n').includes("4 - draft PR: approve the spec's content only and publish it as a draft PR; to continue, start a fresh session and run `/skill:gauntlet #<N>` there."), 'draft row includes the fresh-session continuation command before publication');
  assert.ok(gate.includes('omit row 2 and all its flag lines, including `--allowance=N`; render rows 1, 3, 4'));
  assert.ok(gate.includes('Loop engine unavailable: this spec has no acceptance-criteria rows.'));
  const ref = read('skills/gauntlet/brainstorm/spec-pr.md');
  const publish = ref.slice(ref.indexOf('## Publish row 4'), ref.indexOf('### Draft-PR cleanup'));
  for (const token of [
    'On clean `4`', '**Amend-grant:** none', '**Engine:** deferred',
    'commit --amend --no-edit -q', 'show HEAD:<spec path>',
    'shared predicate against `origin/$DEFAULT` before pushing',
    'push -u origin <branch>', 'gh pr create --draft --head <branch> --base "$DEFAULT"',
    'no push, no amend',
    '4 - retry opening the draft PR [recommended]',
    'gauntlet: gate=brainstorm/user-review-gate recommended=4',
    'Context: unknown', 'no amend and no push',
    'Continue: start a fresh session, then run `/skill:gauntlet #<N>`.',
    'Start no plan or loop',
  ]) assert.ok(publish.includes(token), token);
  const ship = read('skills/gauntlet/ship/ship.md').split('#### Option 1: Push and Create PR')[1].split('#### Option 2:')[0];
  for (const recipe of [publish, ship]) {
    assert.doesNotMatch(recipe, /<</);
  }
  const heading = 'Export `pwd` receipts';
  const env = { ...process.env, SCRATCH: mkdtempSync(join(tmpdir(), 'draft body ')), HEADING: heading, DEFAULT: 'main' };
  delete env.BODY;
  const mint = publish.match(/`([^`]*mktemp [^`]+)`/)[1];
  const bodyFile = execFileSync('bash', ['-ec', mint], { env, encoding: 'utf8' }).trimEnd();
  assert.equal(dirname(bodyFile), env.SCRATCH);
  const body = 'Repeated exports return one receipt.\n\n## Integration\n\n~~~text\nEOF\nEnd of receipt\n~~~';
  writeFileSync(bodyFile, body, { flag: 'r+' });
  const create = publish.split('```bash\n').map(block => block.split('\n```')[0]).find(block => block.includes('gh pr create --draft'))
    .replaceAll('<worktree>', 'work').replaceAll('<branch>', 'topic').replaceAll('<spec path>', 'spec.md').replaceAll('<spec H1 text>', heading).replace('<scratch-file>', '"$1"');
  const args = execFileSync('bash', ['-ec', `
    git() {
      case "$*" in
        '-C work push -u origin topic') return 0 ;;
        '-C work show HEAD:spec.md') printf '# %s\\n\\n## Integration\\n' "$HEADING" ;;
        *) return 1 ;;
      esac
    }
    gh() { printf '%s\\0' "$@"; }
    ${create}`, 'create', bodyFile], { encoding: 'utf8', env });
  const argv = args.split('\0').slice(0, -1);
  assert.deepEqual(argv, ['pr', 'create', '--draft', '--head', 'topic', '--base', 'main', '--title', heading, '--body-file', bodyFile]);
  assert.equal(readFileSync(argv.at(-1), 'utf8'), body);
  assert.match(ship, /```markdown\n## Summary[^`]*## Test Plan[^`]*<[^>]*Integration[^>]*>\s+<[^>]*disposition appendix[^>]*>\n```/);
  assert.doesNotMatch(publish, /(?:option|row|Retry|clean|hidden|retryable)\s+`?6\b/);
  assert.ok(publish.indexOf('show HEAD:<spec path>') < publish.indexOf('push -u origin'));
});

test('saved row-4 publication replay proves persistence, spec-only push and safe retry on both models', () => {
  const candidate = JSON.parse(read('eval/spec-gate/results/option-6-handoff/candidate.json'));
  const factsSha = replayFactsSha(candidate, read(`${sample}/expected.md`));
  assert.equal(Object.keys(candidate.outputs).length, 2);
  for (const [model, output] of Object.entries(candidate.outputs)) {
    assert.equal(output.status, 'ok', model);
    const initialGate = output.text.split(/\nRecommended:/)[0];
    assert.deepEqual([...initialGate.matchAll(/^(\d+) - /gm)].map((match) => match[1]), ['1', '3', '4'], `${model}: zero-row publication stays reachable`);
    assert.doesNotMatch(initialGate, /--allowance/);
    assert.ok(output.text.includes('Loop engine unavailable: this spec has no acceptance-criteria rows.'), `${model}: omission explained`);
    const judged = candidate.judge[model];
    assert.equal(judged.factsSha, factsSha, `${model}: recorded facts`);
    assert.equal(judged.candidateOutputSha, sha256(output.text), `${model}: judged output`);
    for (const id of ['menu', 'persistence', 'publication', 'single-member', 'completion', 'replies', 'invalid', 'rejection', 'create-failure', 'retry', 'retry-menu', 'continue']) {
      assert.equal(judged.facts[id]?.after, 'holds', `${model}/${id}`);
    }
  }
});
