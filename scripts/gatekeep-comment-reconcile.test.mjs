import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
// A missing or empty report.md must fail the order assertion, not crash the loader.
const readOrEmpty = (p) => { try { return read(p); } catch { return ''; } };

const section = (text, start, end) => {
  assert.ok(text.includes(start), `Missing section heading: ${start.trim()}`);
  const body = text.slice(text.indexOf(start) + start.length);
  if (!end) return body;
  assert.ok(body.includes(end), `Missing section boundary: ${end.trim()}`);
  return body.slice(0, body.indexOf(end));
};

const skill = read('../skills/gatekeep-pr/SKILL.md');
const loop = read('../skills/gatekeep-pr/reference/post-selection-loop.md');
const menu = read('../skills/gatekeep-pr/reference/decision-menu.md');
const brief = read('../skills/gatekeep-pr/verification-brief.md');
const findings = read('../skills/gatekeep-pr/reference/findings.md');
const report = readOrEmpty('../skills/gatekeep-pr/reference/report.md');
const baseline = read('../skills/gatekeep-pr/review-baseline.md');
const delivery = read('../skills/check-delivery/SKILL.md');

// Static source contracts only: these do not execute the skill, a reviewer, or gh.
test('all comment-refetch entrypoints reconcile source-backed body deltas', () => {
  assert.match(loop, /Before a merge executes[^\n]*### Re-render.*steps 1-5/);
  const rerender = section(loop, '### Re-render\n', '### Wait course\n');
  assert.match(rerender, /After every push[^\n]*Then refetch comments/);
  assert.match(rerender, /^4\. Reconcile the body delta/m);
  assert.match(rerender, /^5\.[^\n]*Only after that review completes/m);
  assert.match(loop, /On (?:completion or )?timeout[^\n]*steps 1-5/i);
  assert.match(loop, /body delta[^\n]*digest's `comments`|digest's `comments`[^\n]*body delta/i);
  assert.match(loop, /same-head identical-body[^\n]*no source review/i);
});

test('new concerns block stale merge consent, including anyway, but failed fetch retains override', () => {
  assert.match(loop, /new or changed-body delta[^\n]*aborts[^\n]*merge/i);
  assert.match(menu, /`anyway`[^\n]*not[^\n]*unreviewed delta/i);
  assert.match(loop, /failed refetch[^\n]*`anyway`|`anyway`[^\n]*refetch-failure/i);
});

test('source review is not comment triage or blind bot promotion', () => {
  assert.match(loop, /Review each eligible delta[^\n]*source[^\n]*merged rubric/i);
  assert.match(loop, /step 5[^\n]*deduplicat/i);
  assert.match(brief, /comment triage never\s+mints `P#`\/`L#`/i);
  assert.match(brief, /inline\[ \{ id, updated_at, user_type, body,/);
  assert.match(brief, /top_level\[ \{ id, updated_at, user_type, body,/);
});

test('wait polling preserves the review baseline and checks freshness before reusing evidence', () => {
  const wait = section(loop, '### Wait course\n', '### Teardown\n');
  assert.match(wait, /polling refetch[^\n]*leave[^\n]*digest[^\n]*ledger[^\n]*untouched/i);
  assert.match(wait, /head[^\n]*advanced[^\n]*re-assessment[^\n]*before[^\n]*evidence/i);
});

test('SKILL.md is a short orchestrator carrying none of the retired vocabulary', () => {
  assert.ok(skill.split('\n').length < 120, 'SKILL.md must stay under 120 lines');
  for (const stage of ['`gather`', '`provision`', '`verify`', '`review`', '`report`', '`menu`']) {
    assert.ok(skill.includes(stage), `SKILL.md must name stage ${stage}`);
  }
  for (const banned of ['F#', 'raw_tail', 'push-docs', 'follow-up', '`met`', '`partial`', '`missing`', 'apply the doc fixes']) {
    assert.ok(!skill.includes(banned), `SKILL.md must not contain ${banned}`);
  }
});

test('findings.md owns the mechanism-only AC contract, drafted doc fixes, and the C# ledger', () => {
  assert.match(findings, /observation half[^\n]*is checked after merge, not here/);
  assert.match(findings, /observation half[^\n]*blocks nothing|blocks nothing[^\n]*observation half/);
  assert.match(findings, /`gap`[^\n]*is a blocker/);
  assert.match(findings, /applied only on a `fix` pick/);
  assert.match(findings, /`drafted`[^\n]*`proposed`[^\n]*`resolved`/);
  assert.match(findings, /ticket body[^\n]*lifts|lifts[^\n]*ticket body/i);
  assert.match(findings, /`id`[^\n]*`updated_at`/);
  assert.match(findings, /^\| nit \|/m);
  assert.ok(!findings.includes('follow-up'));
});

test('report.md renders bottom-up and ends on a two-state verdict', () => {
  const order = ['Delivers', 'Ticket changes', 'PR comments', 'Nits', 'Blockers', 'Verdict:'];
  const orderSection = section(report, '## Order\n');
  const fence = orderSection.match(/```[^\n]*\n([\s\S]*?)\n```/);
  assert.ok(fence, 'Missing fenced report template after ## Order');
  const idx = order.map((s) => fence[1].indexOf(s));
  assert.ok(idx.every((i) => i >= 0), `report.md is missing section ${order[idx.indexOf(-1)]}`);
  assert.deepEqual([...idx].sort((a, b) => a - b), idx, 'sections must appear in bottom-up order');
  assert.match(report, /^Verdict: mergeable - [^\n]*\| fixable - <N> blockers/m);
  assert.ok(!report.includes('not mergeable'));
  assert.match(report, /[Ee]mpty sections are omitted/);
});

test('decision-menu.md offers fix to every author and bounds the impossible-AC anyway', () => {
  assert.ok(menu.includes('merge anyway - accept AC'));
  const consent = section(menu, '## Consent table\n', '\n## ');
  const rows = consent.split('\n').filter((l) => /^\| (you|someone else) \|/.test(l));
  for (const who of ['you', 'someone else']) {
    assert.ok(rows.some((row) => row.startsWith(`| ${who} |`)), `Consent table lacks ${who} rows`);
  }
  for (const row of rows) assert.match(row, /`fix`/, `row lacks fix: ${row}`);
  const forks = menu.split('\n').filter((line) => line.startsWith('| fork PR |'));
  assert.ok(forks.length > 0, 'overlay table needs a fork PR row');
  for (const fork of forks) {
    assert.match(fork, /`push` and `merge` render `\(not available: fork\)`/);
    assert.match(fork, /`fix` stays/);
    const effect = fork.split('|')[3];
    assert.ok(effect, 'fork PR row lacks an effect cell');
    for (const clause of effect.split(';').filter((part) => part.includes('`fix`'))) {
      assert.ok(!clause.includes('(not available: fork)'), 'fork PR fix clause must remain available');
    }
  }
});

test('post-selection-loop.md verifies once per wave and re-enters step 4 after its own push', () => {
  assert.match(loop, /one verification pass per wave/i);
  assert.match(loop, /own push[^\n]*re-enters? step 4|re-enters? step 4[^\n]*own push/i);
  assert.ok(!loop.includes('push-docs'));
  assert.ok(!loop.includes('F#'));
});

test('verification-brief.md drops the merge-proof rule and the ticket fetch', () => {
  assert.ok(!brief.includes('Merge-proof rule'));
  for (const t of ['`met`', '`partial`', '`missing`']) assert.ok(!brief.includes(t), `brief must not contain ${t}`);
  const sectionA = section(brief, '## Section A', '## Section B');
  assert.ok(!sectionA.includes('gh issue view'), 'ticket fetch moved to step 2');
});

test('review-baseline.md splits doc drift and names blocker vs nit', () => {
  assert.match(baseline, /\bnit\b/);
  assert.ok(!baseline.includes('follow-up'));
  assert.match(baseline, /beyond wording[^\n]*blocking/i);
  assert.match(baseline, /wording-only[^\n]*\bnit\b/i);
});

test('check-delivery takes no input from the pre-merge gate', () => {
  assert.ok(delivery.includes('takes no input from `/skill:gatekeep-pr`'));
});
