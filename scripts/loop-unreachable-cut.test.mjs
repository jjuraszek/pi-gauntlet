import { existsSync, readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
const section = readFileSync(new URL('skills/loop-implementation/reference/unreachable-returns.md', root), 'utf8');

test('admitted target evidence routes before budget and dispatch without driver diagnosis', () => {
  assert.match(driver, /Before the ordered table, route each admitted failed target through ## Unreachable returns once at admission \(including companions\), or on resume when admitted but not yet routed/);
  for (const token of [
    'Key routing to the admitted return, not unchanged evidence',
    'Keep an unanswered stop pending',
    'Recover answered state on resume from the existing retry, raise-allowance and amendment decisions/commits',
    'Treat a human retry, `rows +N`, an applied amendment answering the stop, or an applied cut as answering that return',
    'Continue at the ordered table without re-firing its marker',
    'Route a newly admitted failed return independently, even with identical evidence',
  ]) assert.ok(section.includes(token), token);
  for (const token of [
    'first result segment after the check name', 'trim whitespace',
    '^unreachable: .+ - .+$',
    'Never inspect later result segments, other rows or a rejected return',
    'Leave malformed markers on the ordinary failed-attempt path',
    'Keep `venue:` rows on the ordinary failed-attempt path',
    '| Otherwise | Return to the ordered table. |',
  ]) assert.ok(section.includes(token), token);
  assert.doesNotMatch(section, /bound spent:|action counts|authorization bounds|raise an action's bound/);
  assert.match(driver, /Capture the decoded grant, row dispositions,/);
  assert.match(driver, /refresh the held row dispositions, membership, checkout paths and Rules/);
});

test('action accounting has no driver hook or eval resource', () => {
  assert.doesNotMatch(driver, /action-spend|action records|repair accounting/);
  assert.equal(existsSync(new URL('skills/loop-implementation/reference/action-spend.md', root)), false);
  const { skillFiles } = JSON.parse(readFileSync(new URL('eval/loop-implementation/target.json', root), 'utf8'));
  assert.ok(skillFiles.every(({ path }) => !path.endsWith('/action-spend.md')));
  for (const name of ['unreachable-returns', 'interrupted-recovery']) {
    const resource = skillFiles.find(({ path }) => path.endsWith(`/${name}.md`));
    assert.ok(resource, name);
    assert.equal(resource.new, undefined, `${name} must use its baseline version`);
  }
});

test('unreachable cuts reuse the amendment owner and preserve ledger accounting', () => {
  for (const token of [
    'outside the dispatch loop', 'amendment-surface', 'section 5',
    'deviates: unreachable in this checkout - <what>; proof at <where>',
    '## Out of scope', '<row text, first 60 chars> - unreachable in this checkout - <what>',
    'amended the spec: row <n> - unreachable in this checkout - <what>',
    'Without amend permission', 'human batch',
    'single `loop: cut row <n>` commit', 'Preserve attempts, iterations, allowance and spent escalation',
    '`Deferred/deviates per spec:`', 'never convert the disposition to `venue:`',
  ]) assert.ok(section.includes(token), token);
  assert.match(driver, /Read \[unreachable-returns\]\(reference\/unreachable-returns.md\) in full now with read at its absolute path/);
  assert.ok(Buffer.byteLength(driver) < 45_000);
  assert.ok(Buffer.byteLength(section) < 50_000);
  assert.ok(driver.split('\n').length <= 500);
});
