import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const driver = readFileSync(new URL('skills/loop-implementation/SKILL.md', root), 'utf8');
const section = readFileSync(new URL('skills/loop-implementation/reference/unreachable-returns.md', root), 'utf8');

test('admitted target evidence routes before budget and dispatch without driver diagnosis', () => {
  assert.match(driver, /Before the ordered table, route the latest admitted failed target through ## Unreachable returns, including companion admission and resume/);
  for (const token of [
    'first result segment after the check name', 'trim whitespace',
    '^unreachable: .+ - .+$', '^bound spent: .+',
    'Never inspect later result segments, other rows or a rejected return',
    'Leave malformed markers on the ordinary failed-attempt path',
    'Keep `venue:` rows on the ordinary failed-attempt path',
    'under options 4 and 5 alike', 'never cut or redispatch automatically',
    'ordinary row menu (retry, `rows +N`, Amend, Stop)',
  ]) assert.ok(section.includes(token), token);
  assert.match(driver, /Capture the decoded grant, row dispositions,/);
  assert.match(driver, /refresh the held row dispositions, membership, checkout paths and Rules/);
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
