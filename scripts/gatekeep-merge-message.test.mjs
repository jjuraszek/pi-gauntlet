import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { sha256 } from '../eval/lib/checks.mjs';

function historicalReplies(record) {
  const replies = [];
  for (const model of record.models.replay) {
    const output = record.outputs[model];
    const context = `${record.sample}/${model}`;
    if (output?.status === 'error') {
      assert.equal(output.status, 'error', `${context}: errored replay excluded from evidence`);
      assert.ok(typeof output.error === 'string' && output.error.trim().length > 0, `${context}: errored replay excluded from evidence needs an error string`);
      console.log(`${context}: errored replay excluded from evidence`);
      continue;
    }
    assert.equal(output?.status, 'ok', context);
    assert.ok(typeof output.text === 'string' && output.text.trim().length > 0, `${context}: nonempty reply text`);
    assert.equal(record.judge?.[model]?.candidateOutputSha, sha256(output.text), `${context}: recorded output hash`);
    replies.push([model, output]);
  }
  assert.ok(replies.length > 0, `${record.sample}: at least one hash-verified ok reply`);
  return replies;
}

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const loop = read('skills/gatekeep-pr/reference/post-selection-loop.md');
const merge = loop.split('### Merge course\n')[1].split('### Re-render\n')[0];
const wording = read('skills/gauntlet/commit-message.md');
const saved = JSON.parse(read('eval/gatekeep-pr/results/merge-landed-message/candidate.json'));
const policies = [['squash', '--squash'], ['merge-commit', '--merge'], ['rebase', '--rebase']];

function commandFor(policy) {
  const rows = [...merge.matchAll(/^\| `([^`]+)` \| `([^`]+)` \|$/gm)];
  const selected = rows.filter(([, name]) => name === policy);
  assert.equal(selected.length, 1, `one isolated merge command for ${policy}`);
  return selected[0][2];
}

// Read only message examples from the historical record, not its workflow claims or judgments.
function messageExamples() {
  const examples = historicalReplies(saved).map(([model, output]) => {
    assert.equal(output.status, 'ok', model);
    const text = output.text.split(/^###? B\./m)[0];
    const subject = text.match(/--subject (['"])(.*?)\1/)?.[2];
    const body = text.match(/^\s*(?:Compliance pages|Imported plants)[\s\S]*?^\s*- Imported[^\n]+/m)?.[0]
      .trim().split('\n').map(line => line.trim()).join('\n');
    assert.ok(subject && body, `${model}: complete saved message`);
    return { model, subject, body: `${body}\n` };
  });
  assert.ok(examples.length > 0, 'select at least one saved message');
  return examples;
}

function capture(command, { policy, subject, body, admin }) {
  const cwd = mkdtempSync(join(tmpdir(), 'gatekeep-message-'));
  const env = {
    PATH: process.env.PATH, HOME: cwd, BASE_REPO: 'acme/widgets', PR_NUMBER: '37',
    ASSESSED_SHA: 'a'.repeat(40), LANDED_SUBJECT: subject.replace(/ \(#37\)$/, ''),
    LANDED_BODY: join(cwd, 'landed body.txt'), ARGS: join(cwd, 'argv'), INPUT: join(cwd, 'stdin'),
  };
  if (policy !== 'rebase') writeFileSync(env.LANDED_BODY, body);
  const script = `gh() { printf '%s\\0' "$@" > "$ARGS"; cat > "$INPUT"; }\nADMIN_ARGS=(${admin ? '--admin' : ''})\n${command}`;
  execFileSync('timeout', ['-k', '30', '15', 'bash', '-c', script], {
    cwd, env, encoding: 'utf8', timeout: 50_000, stdio: ['ignore', 'pipe', 'pipe'],
  });
  return {
    args: readFileSync(env.ARGS, 'utf8').split('\0').slice(0, -1),
    input: readFileSync(env.INPUT, 'utf8'),
  };
}

function assertCapture(actual, { policy, flag, subject, body, admin }) {
  assert.deepEqual(actual.args, ['pr', 'merge', '37', '-R', 'acme/widgets',
    '--match-head-commit', 'a'.repeat(40), flag,
    ...(policy === 'rebase' ? [] : ['--subject', subject, '--body-file', '-']),
    ...(admin ? ['--admin'] : [])]);
  assert.equal(actual.input, policy === 'rebase' ? '' : body);
}

test('merge wording delegates to the shared landed-message and ticket rules', () => {
  assert.match(merge, /Read \[commit message\]\(\.\.\/\.\.\/finishing-a-development-branch\/reference\/commit-message.md\)/);
  assert.match(merge, /compose its Landed message from the carried spec or the PR title and description, using its Gatekeep ticket rule/);
  assert.match(merge, /For rebase pass neither message flag/);
  assert.match(merge, /Keep these message flags on a merge-queue request too/);
  assert.match(merge, /merge_state_status == BLOCKED.*permissions.bypass_eligible == true/);
  assert.match(wording, /one paragraph, at most three sentences/);
  assert.match(wording, /at most five outcome bullets total/);
  assert.match(wording, /Gatekeep.*carried spec's.*Ticket.*else the ticket the roster row already takes/);
});

test('saved gatekeep messages contain an imperative subject, short paragraph and observed outcomes', async t => {
  for (const { model, subject, body } of messageExamples()) await t.test(model, () => {
    assert.match(subject, /^Count imported plants in (?:compliance )?pagination \(#37\)$/);
    assert.ok(subject.replace(/ \(#37\)$/, '').length <= 72);
    const [paragraph, outcomes, ...rest] = body.trimEnd().split('\n\n');
    assert.ok(paragraph.match(/[.!?](?:\s|$)/g)?.length <= 3);
    assert.match(paragraph, /counts/);
    const bullets = outcomes.split('\n');
    assert.ok(bullets.length > 0 && bullets.length <= 5);
    assert.ok(bullets.every(line => line.startsWith('- ')));
    assert.match(outcomes, /single-company/);
    assert.match(outcomes, /Imported.*answers.*compliance pages/);
    assert.deepEqual(rest, []);
    assert.doesNotMatch(body, /pending:|iteration:|doc\/|loop:|Count imported plants|Refs #/);
  });
});

test('isolated policy commands preserve subject, body and head guard without calling GitHub', async t => {
  const examples = [...messageExamples(), {
    model: 'quoted shell data', subject: 'Count "imported" plants with $limits (#37)',
    body: 'Imported plants now count toward totals.\n\n- Preserve $values and `literal` text\n',
  }];
  for (const [policy, flag] of policies) {
    const command = commandFor(policy);
    for (const example of examples) for (const admin of [false, true]) {
      await t.test(`${policy}, ${example.model}, admin=${admin}`, () => {
        const input = { ...example, policy, flag, admin };
        assertCapture(capture(command, input), input);
      });
    }
  }
});
