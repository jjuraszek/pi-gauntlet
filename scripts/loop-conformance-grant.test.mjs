import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const driver = readFileSync(new URL('skills/gauntlet/implement/loop/loop.md', root), 'utf8');
const conformance = readFileSync(new URL('skills/gauntlet/conformance-check.md', root), 'utf8');
const step6 = conformance.split('6. **Converge or continue**')[1].split('**Convergence**')[0];

test('a spent counter with no prior comparison permits one more round at every progress check', () => {
  const fallback = 'when the round before is not recoverable, take one round';
  const read = path => readFileSync(new URL(`skills/gauntlet/${path}`, root), 'utf8');
  const wave = read('implement/waves/waves.md');
  for (const [label, section] of [
    ['row', driver.split('| 2 | Unresolved row attempts')[1].split('\n')[0]],
    ['seed', driver.split('\nCount seed attempts as ')[1].split('\n')[0]],
    ['verification repair', driver.split('\n   Rerun the failing checkout')[1].split('\n')[0]],
    ['wave task and re-review', wave.split('**Spent-counter test.**')[1].split('\n')[0]],
    ['whole-diff review', read('requesting-review.md').split('**Fix rounds.**')[1]],
    ['conformance', step6],
  ]) assert.ok(section.includes(fallback), label);
  assert.match(wave, /Wave reaches `4 \+ N` re-reviews[^\n]+apply the same spent-counter test/);
});

test('both engines buy one more conformance round only on progress at the cap', () => {
  for (const token of ['newly `DELIVERED`', 'newly passing', 'Critical or Moderate finding gone',
    'when the block is live', 'phase_tracker({ action: "grant_fix_rounds", rounds: 1, reason: "<what the last round closed>" })',
    'closureReview.enforce` is false', 'continue without a call', 'an error reply',
    'gauntlet: gate=verify/step-6', 'human explicitly approves N more rounds']) assert.ok(step6.includes(token), token);
  assert.match(step6, /Give each gap's verdict for each round under `Problem:` and the input needed to proceed under `Needs:`; no menu\./);
  assert.doesNotMatch(driver, /rounds: <allowance - used>|funds conformance rounds from the allowance/);
  assert.match(conformance, /\*\*`maxFixRounds: 0`\*\*: skip this loop entirely/);
  assert.ok(Buffer.byteLength(driver) < 45_000, 'extract the driver before crossing 45 KB');
  assert.ok(Buffer.byteLength(conformance) < 50_000);
  assert.ok(conformance.split('\n').length <= 500);
});

test('conformance closure and its callers do not treat exhaustion alone as a stop', () => {
  const read = path => readFileSync(new URL(`skills/gauntlet/${path}`, root), 'utf8');
  for (const [path, text] of [
    ['implement/loop/loop.md', driver.split('\n4. Complete verify only')[1].split('\n')[0]],
    ['implement/waves/waves.md', read('implement/waves/waves.md').split('## After All Tasks Complete\n')[1].split('## Red Flags')[0]],
    ['verify/verify.md', read('verify/verify.md').split('| Intent delivered (loop closed) |')[1].split('\n')[0]],
    ['conformance-check.md (opt-out)', conformance.split('**`maxFixRounds: 0`**:')[1].split('\n\n')[0]],
    ['conformance-check.md (closure)', conformance.split('\n## Closure / conformance\n')[1].split('\n### ')[0]],
  ]) {
    assert.doesNotMatch(text, /exhaust\w*/i, path);
    assert.match(text, /step 6/i, path);
  }
});
