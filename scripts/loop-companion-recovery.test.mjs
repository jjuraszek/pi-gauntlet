import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const reference = read('skills/loop-implementation/reference/coordinated-legs.md');

test('companion interruptions use the common recovery before clean-return admission', () => {
  const resume = reference.split('## Resume\n')[1].split('## Targeting and dispatch')[0];
  assert.match(resume, /Classify interrupted boundaries before applying clean-return admission checks/);
  for (const token of [
    'three-step rule and failure pass',
    "selected companion's base and pre-bump iteration jobs file",
    'Reset and clean the selected companion to its `HEAD_BEFORE` and home to the saved home HEAD',
    'write the repair commit only in home',
    'companion HEAD for the reset check and the saved home HEAD for the ledger-only commit boundary',
    'Restore the saved home ledger with consumed iterations',
    'preserve foreign rows, mappings, bases and seeded flags',
    'Increment only the numbered target\'s attempts once; seed leaves rows unchanged',
    'without double counting',
  ]) assert.ok(reference.includes(token), token);
  assert.doesNotMatch(reference, /ownership-fenced|exclusive companion|accounted-for writers|require confirmed job exits|Missing provenance|unresolved cleanup/);
});

test('clean companion results retain attribution and row admission checks', () => {
  for (const token of [
    'unchanged home HEAD and expected-only home dirt',
    'Route wrong attribution, unexpected home dirt and home movement through common interrupted recovery',
    "'pending mismatch'", "'iteration mismatch'", "'foreign row'", "'attempt mismatch'",
    "'seed counts mismatch'", "'changed cut or closed row'", "'unmatched decision'",
    'post-boundary result-validation misses', 'clear `pending:` and preserve the consumed iteration',
  ]) assert.ok(reference.includes(token), token);
});

test('companion sample recovers absent provenance and skipped jobs without losing foreign state', () => {
  const sample = 'eval/loop-implementation/samples/companion-interrupted-recovery';
  const input = read(`${sample}/case.md`);
  const expected = read(`${sample}/expected.md`);
  assert.match(input, /missing provenance/);
  assert.match(input, /absent jobs file/);
  assert.match(input, /start-99/);
  assert.match(input, /seed/);
  assert.match(expected, /- unsafe: judged:/);
  assert.match(expected, /skip.*continue recovery/);
  assert.match(expected, /- admission: judged:/);
  assert.doesNotMatch(expected, /recovery incomplete|requires clean zero-commit|proves? no ownership/);
});
