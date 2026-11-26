import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { sha256 } from '../eval/lib/checks.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const wording = read('skills/gauntlet/commit-message.md');
const note = wording.split('## Squash-default note\n')[1];
const finish = read('skills/gauntlet/ship/ship.md');
const pr = finish.split('#### Option 1: Push and Create PR\n')[1].split('#### Option 3:')[0];
const gatekeep = read('skills/gatekeep-pr/reference/post-selection-loop.md');
const preconditions = gatekeep.split('### Merge preconditions\n')[1].split('### Plan-free head\n')[0];
const merge = gatekeep.split('### Merge course\n')[1].split('### Re-render\n')[0];
const expected = "Note: this repo's squash default (squash_merge_commit_message: COMMIT_MESSAGES) pastes every branch commit into the landed message when someone merges from the GitHub button; set it to PR_BODY or BLANK in the repo settings to stop that.";

function printedNotes(text) {
  return text.split('\n').map(line => line.trim()).filter(line => line.startsWith('Note:'));
}

function savedOutputs(path) {
  const record = JSON.parse(read(path));
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

test('the shared note has one exact positive branch and silent other-value and read-failure branches', () => {
  assert.match(note, /Read `gh api repos\/<owner>\/<repo> --jq \.squash_merge_commit_message` once/);
  assert.match(note, /In gatekeep, add the field to the existing repository-settings read instead of making a second request/);
  assert.match(note, /On `COMMIT_MESSAGES`, print exactly this line:/);
  assert.deepEqual(printedNotes(note), [expected]);
  assert.match(note, /On any other value or a failed read, print nothing\. Never write a repository setting\./);
  assert.doesNotMatch(note, /--method|\s-X\s|--field|--raw-field|gh repo edit/);
});

test('normal and draft PR options and gatekeep reuse the same read-only note rule', () => {
  assert.match(pr, /Read \[commit-message\.md\]\(\.\.\/commit-message\.md\)/);
  assert.match(pr, /Run its Squash-default note read once for Options 1-2, printing only the prescribed outcome/);
  assert.match(pr, /Follow Option 1, adding `--draft` only to `gh pr create`/);
  const reads = preconditions.match(/`gh api repos\/<owner>\/<repo> --jq '[^']+'`/g);
  assert.deepEqual(reads, ["`gh api repos/<owner>/<repo> --jq '{allow_squash_merge,allow_merge_commit,allow_rebase_merge,squash_merge_commit_message}'`"]);
  assert.match(merge, /Read \[commit message\]\(\.\.\/\.\.\/gauntlet\/commit-message.md\)/);
  assert.match(merge, /Apply the reference's Squash-default note using `squash_merge_commit_message` from the Merge preconditions repository-settings read; print nothing for a failed read and never write settings/);
  assert.doesNotMatch(merge, /gh api repos\//);
  assert.deepEqual(printedNotes(pr + merge), [], 'callers cite the note instead of duplicating its text');
});

// Inspect only historical note excerpts, not workflow claims, commands or judge verdicts.
test('saved finish note excerpts preserve the exact text and silent PR_BODY and permission-denied outcomes', async t => {
  for (const [model, output] of savedOutputs('eval/ship/results/landed-message/candidate.json')) {
    await t.test(model, () => {
      const section = output.text.split(/^## Trace B[^\n]*\n/m)[1]?.split(/^## Trace C/m)[0];
      assert.ok(section, 'saved PR note section is present');
      const excerpt = section.split(/(?:\*\*2\. Strip|^Strip the ephemeral)/m)[0];
      assert.deepEqual(printedNotes(excerpt), [expected]);
      assert.match(excerpt, /PR_BODY[\s\S]*print (?:\*\*)?nothing/);
      assert.match(excerpt, /permission-denied[\s\S]*(?:print (?:\*\*)?nothing|also print nothing)/);
      assert.match(excerpt, /No repository setting is ever written|Never write a setting/);
    });
  }
});

test('saved gatekeep note excerpts select COMMIT_MESSAGES but not PR_BODY or a failed read', async t => {
  for (const [model, output] of savedOutputs('eval/gatekeep-pr/results/merge-landed-message/candidate.json')) {
    await t.test(model, () => {
      const sections = output.text.split(/^#{2,3} [ABCD]\. [^\n]*\n/m).slice(1);
      assert.equal(sections.length, 4, 'saved labeled observations remain present');
      const [positive, other, failed] = sections;
      assert.deepEqual(printedNotes(positive), [expected]);
      for (const silent of [other, failed]) assert.deepEqual(printedNotes(silent), []);
      assert.match(other, /printed no note|Print no squash-default note/);
      assert.match(failed, /failed read prints nothing|read fails\. Print no squash-default note/);
      assert.match(failed, /no second request and wrote no settings|do not retry or change repository settings/);
    });
  }
});
