import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const skill = read('skills/finishing-a-development-branch/SKILL.md');
const wording = read('skills/finishing-a-development-branch/reference/commit-message.md');
const pr = skill.split('#### Option 1: Push and Create PR\n')[1].split('#### Option 2:')[0];
const squash = skill.split('#### Option 3: Squash-merge to base\n')[1].split('#### Option 4:')[0];
const saved = JSON.parse(read('eval/finishing-a-development-branch/results/landed-message/candidate.json'));
const subject = 'Count imported plants in compliance pagination';

// Reuse only the saved message/title examples, not the historical workflow traces or their judgments.
const examples = Object.entries(saved.outputs).map(([model, output]) => {
  assert.equal(output.status, 'ok', model);
  const message = output.text.match(/\n(Count imported plants in compliance pagination\n\n[\s\S]*?\nRefs #241)\n/);
  assert.ok(message, `${model}: a complete saved squash message`);
  const title = output.text.split('## Trace B')[1]?.split('## Trace C')[0];
  assert.ok(title?.includes(subject), `${model}: the same saved PR title`);
  return { model, message: message[1] };
});
assert.ok(examples.length > 0, 'select at least one saved message');

function run(cwd, env, command, args) {
  return execFileSync('timeout', ['-k', '30', '15', command, ...args], {
    cwd, env, encoding: 'utf8', timeout: 50_000, stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function environment(cwd) {
  return {
    ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null',
    GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
    GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid',
    PRIMARY: cwd, WORKTREE: cwd, LANDED_SUBJECT: subject,
    ARGS: join(cwd, 'pr arguments'),
  };
}

function assertMessage(message) {
  const [title, paragraph, outcomes, ticket, ...rest] = message.split('\n\n');
  assert.equal(title, subject);
  assert.ok(title.length <= 72);
  assert.doesNotMatch(title, /:|[/.#]|\b[0-9a-f]{7,40}\b/);
  assert.match(paragraph, /Compliance pages skipped plants[\s\S]*counts disagreed with totals/);
  assert.ok(paragraph.match(/[.!?](?:\s|$)/g)?.length <= 3);
  const bullets = outcomes.split('\n');
  assert.equal(bullets.length, 5, 'combine six in-scope rows into five outcomes');
  assert.ok(bullets.every(line => line.startsWith('- ')));
  for (const outcome of [/single-company.*plant total/i, /imported profile answers/i,
    /filter/i, /duplicate imports count once/i, /empty imports leave counts unchanged/i,
    /page boundaries include imported profiles/i]) assert.match(outcomes, outcome);
  assert.equal(ticket, 'Refs #241');
  assert.deepEqual(rest, []);
  assert.doesNotMatch(message, /offline|caching|deferred|pending:|iteration:|doc\//i);
}

test('finish delegates squash and PR wording to the shared contract without rewriting the PR body', () => {
  assert.match(wording, /at most 72 characters/);
  assert.match(wording, /one paragraph, at most three sentences/);
  assert.match(wording, /at most five outcome bullets total/);
  assert.match(wording, /Combine related acceptance rows into one bullet rather than adding a sixth/);
  assert.match(wording, /Use the same subject for the pull request title; apply the ticket rule above/);
  assert.match(wording, /spec header's `\*\*Ticket:\*\*` line/);
  assert.match(wording, /place and form named by the overrides `## Issue tracker` `refs:` line/);
  assert.match(pr, /Read \[commit-message.md\]\(reference\/commit-message.md\) for the Landed message subject and resolve its ticket rule/);
  assert.match(pr, /Set `LANDED_SUBJECT` to that subject for the PR title; keep the PR body's project style/);
  assert.match(pr, /Keep this disposition appendix out of Option 3's landed message/);
  assert.match(squash, /Read \[commit-message.md\]\(reference\/commit-message.md\) and compose its Landed message from the spec's Goal and in-scope acceptance rows, applying its ticket rule/);
  assert.match(squash, /Compose it before stripping the plan; insert the composed message verbatim into the quoted heredoc below/);
  assert.match(skill, /Option 1's push and `gh pr create` commands with `--draft` added\. The PR body is unchanged/);
});

test('saved landed-message examples retain all six outcomes and only the bound body ticket', async t => {
  for (const { model, message } of examples) await t.test(model, () => assertMessage(message));
});

test('the isolated commit command preserves each message through a quoted stdin heredoc', async t => {
  const command = squash.match(/git -C "\$PRIMARY" commit [^\n]+\n[\s\S]*?\nEOF/)?.[0];
  assert.equal(command, 'git -C "$PRIMARY" commit -F - <<\'EOF\'\n<landed message>\nEOF');
  const cases = [...examples, {
    model: 'literal shell text',
    message: 'Preserve literal text in landed messages\n\nKeep $PRIMARY, ${WORKTREE}, $(printf expanded), `printf expanded` and "quotes" literal.',
  }];
  for (const { model, message } of cases) await t.test(model, () => {
    const cwd = mkdtempSync(join(tmpdir(), 'finish-message-'));
    const env = environment(cwd);
    const git = (...args) => run(cwd, env, 'git', args);
    git('init', '-q', '-b', 'fixture');
    writeFileSync(join(cwd, 'plants.txt'), 'Imported plants count toward pagination.\n');
    git('add', '--', 'plants.txt');
    run(cwd, env, 'bash', ['-c', command.replace('<landed message>', () => message)]);
    assert.equal(git('show', '-s', '--format=%B', 'HEAD').trimEnd(), message);
    assert.equal(git('show', '-s', '--format=%s', 'HEAD').trimEnd(), message.split('\n')[0]);
    assert.equal(git('ls-tree', '--name-only', 'HEAD').trimEnd(), 'plants.txt');
  });
});

test('the isolated PR command passes the same subject and keeps the project body for normal and draft PRs', async t => {
  const command = pr.match(/```bash\n# Create PR\n([\s\S]*?)\n```/)?.[1];
  assert.ok(command, 'select only gh pr create, without push, strip, seal or cleanup');
  const body = '## Summary\n<2-3 bullets of what changed>\n\n## Test Plan\n- [ ] <verification steps>';
  for (const draft of [false, true]) await t.test(draft ? 'draft' : 'normal', () => {
    const cwd = mkdtempSync(join(tmpdir(), 'finish-title-'));
    const env = environment(cwd);
    const selected = draft ? command.replace('gh pr create', 'gh pr create --draft') : command;
    run(cwd, env, 'bash', ['-c', `gh() { printf '%s\\0' "$@" > "$ARGS"; }\n${selected}`]);
    const args = readFileSync(env.ARGS, 'utf8').split('\0').slice(0, -1);
    assert.deepEqual(args, ['pr', 'create', ...(draft ? ['--draft'] : []), '--title', subject, '--body', body]);
  });
});
