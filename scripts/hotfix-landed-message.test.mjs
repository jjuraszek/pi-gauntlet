import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const hotfix = read('skills/chase-bug/hotfix.md');
const wording = read('skills/finishing-a-development-branch/reference/commit-message.md');
const finish = hotfix.split('8. **Finish.**')[1].split('9. **Cleanup evidence.**')[0];
const sample = read('eval/chase-bug/samples/hotfix-plain-landing/case.md');
const story = sample.match(/Fault story: (.*?) Bound ticket:/)?.[1];
assert.ok(story, 'select the isolated message sample, not a workflow replay');

// Synthetic messages test transport, not model composition or delivery.
const examples = [
  { name: 'body ticket convention', subject: 'Reject blank plant names', body: `${story}\n\nRefs #241` },
  { name: 'default ticket convention', subject: 'Reject blank plant names (ref #241)', body: story },
  { name: 'no bound ticket', subject: 'Reject blank plant names', body: story },
];

function scratch() {
  const cwd = mkdtempSync(join(tmpdir(), 'hotfix-message-'));
  const env = {
    ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null',
    GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
    GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid',
    HOTFIX_BODY: join(cwd, 'fault story.txt'), ARGS: join(cwd, 'pr arguments'),
  };
  const run = (command, args, input) => execFileSync('timeout', ['-k', '30', '15', command, ...args], {
    cwd, env, input, encoding: 'utf8', timeout: 50_000, stdio: ['pipe', 'pipe', 'pipe'],
  });
  return { cwd, env, run };
}

test('hotfix landing and PR delegate the fault story and ticket to the shared wording contract', () => {
  assert.match(hotfix, /Read \[commit-message.md\]\(\.\.\/finishing-a-development-branch\/reference\/commit-message.md\)/);
  assert.match(hotfix, /resolve its absolute path and the ticket named in the record once/);
  assert.match(finish, /Compose the message through the shared Hotfix landing and Landed message rules, using the record's fault story and resolved ticket/);
  assert.match(finish, /Use its subject as the PR title and save its body to a temporary file/);
  assert.match(finish, /feed the complete message on stdin at the commit below/);
  assert.match(wording, /Write one imperative sentence stating what the commit changes/);
  assert.match(wording, /at most 72 characters/);
  assert.match(wording, /For a hotfix, use the handoff's fault story as the paragraph and omit bullets/);
  assert.match(wording, /Hotfix landing and hotfix pull request \| The fault story in the handoff record/);
  assert.match(wording, /place and form named by the overrides `## Issue tracker` `refs:` line/);
  assert.match(wording, /Without that convention, append `\(ref <ticket-id>\)` to the subject/);
  assert.match(wording, /With no bound ticket, add no reference/);
  assert.doesNotMatch(finish, /commit -m|fix: <slug>|--body\s/);
});

test('the isolated hotfix commit command preserves the plain subject, fault story and ticket', async t => {
  const line = finish.split('\n').find(line => line.trimStart().startsWith('git commit '));
  assert.ok(line, 'one landing commit command');
  const command = line.trim().split(' || ')[0];
  assert.equal(command, 'git commit -F -');
  for (const { name, subject, body } of examples) await t.test(name, () => {
    const { cwd, run } = scratch();
    run('git', ['init', '-q', '-b', 'fixture']);
    writeFileSync(join(cwd, 'plants.txt'), 'Reject blank plant names before saving.\n');
    run('git', ['add', '--', 'plants.txt']);
    const message = `${subject}\n\n${body}`;
    run('bash', ['-c', command], `${message}\n`);
    const actual = run('git', ['show', '-s', '--format=%B', 'HEAD']).trimEnd();
    assert.equal(actual, message);
    assert.equal(run('git', ['show', '-s', '--format=%s', 'HEAD']).trimEnd(), subject);
    assert.ok(subject.length <= 72);
    assert.doesNotMatch(actual, /^(?:fix:|pending:|iteration:|row \d|[-*] )/m);
    assert.equal(run('git', ['ls-tree', '--name-only', 'HEAD']).trimEnd(), 'plants.txt');
  });
});

test('the isolated hotfix PR command passes the same subject and fault-story body file', async t => {
  const recipe = finish.match(/`(gh pr create[^`]+)`/)?.[1].replace(/\n\s*/g, ' ');
  assert.ok(recipe, 'select only PR creation, without push or any other stage');
  const command = recipe.replace('<default>', 'fixture-base').replace('<slug>', 'blank-plant-names')
    .replace('"<composed subject>"', '"$HOTFIX_SUBJECT"').replace('<temporary body file>', '"$HOTFIX_BODY"');
  for (const { name, subject, body } of examples) await t.test(name, () => {
    const { env, run } = scratch();
    env.HOTFIX_SUBJECT = subject;
    writeFileSync(env.HOTFIX_BODY, `${body}\n`);
    run('bash', ['-c', `gh() { printf '%s\\0' "$@" > "$ARGS"; }\n${command}`]);
    const args = readFileSync(env.ARGS, 'utf8').split('\0').slice(0, -1);
    assert.deepEqual(args, ['pr', 'create', '--base', 'fixture-base', '--head', 'hotfix/blank-plant-names',
      '--title', subject, '--body-file', env.HOTFIX_BODY]);
    assert.equal(readFileSync(args[args.indexOf('--body-file') + 1], 'utf8'), `${body}\n`);
    assert.doesNotMatch(body, /^(?:[-*] |pending:|iteration:|row \d)/m);
  });
});
