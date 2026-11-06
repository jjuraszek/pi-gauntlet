import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
const conformance = readFileSync(new URL('skills/verification-before-completion/reference/conformance-check.md', root), 'utf8');
const step3 = driver.split('\n3. Run happy path')[1].split('\n4. Complete verify')[0];
const step6 = conformance.split('6. **Converge or continue**')[1].split('**Convergence**')[0];

test('loop conformance funding uses the observed cap count and the verbatim standing grant', () => {
  for (const token of [
    '<used> fix round(s) used against a cap of <cap>',
    'read `<used>` from that text', 'Under amend permission',
    '`<used>` below the ledger allowance', 'when the block is live',
    'phase_tracker({ action: "grant_fix_rounds", rounds: <allowance - used>, reason: "<Amend-grant sentence verbatim>" })',
    'funded <allowance - used> conformance rounds under the grant',
    'closureReview.enforce` is false', 'continue without a call',
    '`<used>` at or above the allowance', 'an error reply', 'no amend permission',
    'Never call the tool as a probe', 'never count rounds yourself',
    'a resumed run with unspent credits',
  ]) assert.ok(step3.includes(token), token);
  assert.doesNotMatch(driver, /Preserve `STAGNANT`, `REJECT`, closureReview and grant_fix_rounds boundaries/);
});

test('shared conformance step 6 routes loop funding before the human ask without changing other engines', () => {
  assert.match(step6, /Under the loop engine with amend permission,.*After the loop step 3.*before this ask; ask the human only when it declines/);
  assert.match(step6, /If the human explicitly\s+approves N more rounds/);
  assert.match(conformance, /\*\*`maxFixRounds: 0`\*\*: skip this loop entirely/);
  assert.ok(Buffer.byteLength(driver) < 45_000, 'extract the driver before crossing 45 KB');
  assert.ok(Buffer.byteLength(conformance) < 50_000);
  assert.ok(conformance.split('\n').length <= 500);
});
