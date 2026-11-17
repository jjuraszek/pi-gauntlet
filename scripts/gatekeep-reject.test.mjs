import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parseExpected, sha256 } from '../eval/lib/checks.mjs';
import { assemble, inputSha, parseCase } from '../eval/lib/replay.mjs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('reject executes frozen steps and settles only a successful note or close', () => {
  const reject = read('../skills/gatekeep-pr/reference/reject.md');
  const menus = read('../skills/gatekeep-pr/reference/menus.md');
  const loop = read('../skills/gatekeep-pr/reference/post-selection-loop.md');
  const brief = read('../skills/gatekeep-pr/verification-brief.md');
  const cleanup = read('../skills/gatekeep-pr/reference/cleanup.md');
  const batch = read('../skills/gatekeep-pr/reference/batch.md');
  assert.match(menus, /\| reject \|[^\n]*\| post \|/);
  for (const phrase of ['## Reject', 'post the rejection note', 'close the PR', 'note changed since preview', 'PR changed since review', 'note not posted', 'stopped at reject', 'recommended=1', 'post_steps']) assert.ok(reject.includes(phrase), phrase);
  assert.match(reject, /gh pr close <N> -R <base-owner>\/<base-repo>/);
  assert.match(reject, /note_sha256/);
  assert.match(reject, /Keep every freshness, state or permission skip recorded in step 1 unchanged/);
  assert.match(reject, /Only when close remains eligible/);
  assert.match(reject, /commit_id[\s\S]*event[\s\S]*body/);
  assert.match(loop, /own-merge, approved, closed-pr and reject/);
  assert.match(loop, /gauntlet: done rejected/);
  assert.match(brief, /viewerCanClose/);
  assert.match(brief, /viewer_can_close/);
  assert.match(menus, /menu-only continuation of initial, obstacle or assess-terminal/);
  assert.match(menus, /including ordinary `deliver`, use exactly one complete recommendation sentence/);
  assert.match(menus, /do not apply the own-PR default before the after-assess rule/);
  assert.match(cleanup, /already removed/);
  assert.match(batch, /reject[\s\S]*parent-owned/);
});

test('remedy-only approach findings dispatch on both harnesses and survive external-head re-review', () => {
  const wave = read('../skills/gatekeep-pr/reference/fix-wave.md');
  const findings = read('../skills/gatekeep-pr/reference/findings.md');
  const assessment = read('../skills/gatekeep-pr/reference/assessment.md');
  assert.match(wave, /every open approach blocker[\s\S]*no drafted edit/);
  assert.match(wave, /instead:[^\n]*derived AC/);
  assert.match(wave, /tests exercising the replaced mechanism/);
  assert.match(wave, /copy the derived AC text verbatim, including contributor IDs/);
  assert.match(wave, /common finding\/evidence block identical on both harnesses/);
  const sharedContext = wave.split('\n### Shared worker context\n')[1]?.split('```text\n')[1]?.split('\n```')[0];
  assert.match(sharedContext, /For every finding,[^\n]*never adds infrastructure, a dependency, or a new module/,
    'the shared worker context must apply the payload limit to approach findings too');
  assert.match(findings, /never withhold.*dispatch.*pre-judging/i);
  assert.match(assessment, /external head move/);
  assert.match(assessment, /builds:[\s\S]*instead:[\s\S]*P#.*L#/);
});

test('approach rubric requires evidence and a replacement of the main mechanism', () => {
  const baseline = read('../skills/gatekeep-pr/review-baseline.md');
  const grounds = baseline.split('\n## Approach grounds\n')[1]?.split('\n## ')[0];
  assert.ok(grounds, 'the review rubric must define Approach grounds');

  const rows = grounds.split('\n')
    .filter((line) => /^\|\s*\d+\s*\|/.test(line))
    .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()));
  assert.deepEqual(rows.map(([number, name, , , recommends]) => [number, name, recommends]), [
    ['1', 'Second mechanism', 'yes'],
    ['2', 'Architecture boundary', 'yes'],
    ['3', 'Unjustified reversal', 'yes'],
    ['4', 'Weakened guard', 'yes'],
    ['5', 'Symptom-level fix', 'yes'],
    ['6', 'Needless machinery', 'no'],
  ]);
  for (const [, name, definition, evidence] of rows) {
    assert.ok(definition?.length, `${name} must define the conflict`);
    assert.ok(evidence?.length, `${name} must name its evidence`);
  }
  assert.match(rows[5][3], /smaller change/i, 'complexity needs a concrete simpler alternative');
  assert.match(rows[5][3], /preserv.*outcome/i, 'the smaller change must keep the intended outcome');
  assert.match(grounds, /base.branch/i, 'other grounds cite evidence on the base branch');
  assert.match(grounds, /main mechanism/i, 'an approach remedy replaces the main mechanism');
  assert.match(grounds, /part of the diff/i, 'a local repair stays an ordinary finding');
  assert.match(grounds, /configures or records/, 'framework and external decisions need base-file evidence');
  assert.match(grounds, /non-blocking[\s\S]*nits[\s\S]*no note[\s\S]*no `reject`/, 'an overlay can downgrade a ground');

  const severity = baseline.split('\n## Severity axis\n')[1]?.split('\n## ')[0];
  assert.match(severity, /\| Approach conflict[^\n]*\| blocking \|/,
    'valid approach conflicts must be blockers rather than reuse nits');
});

test('the caller requests and validates approach conflicts before rendering the first report', () => {
  const brief = read('../skills/gatekeep-pr/verification-brief.md');
  const assessment = read('../skills/gatekeep-pr/reference/assessment.md');
  const findings = read('../skills/gatekeep-pr/reference/findings.md');
  const report = read('../skills/gatekeep-pr/reference/report.md');
  for (const field of ['builds', 'path', 'conflicts with', 'smaller', 'instead', 'replaces']) {
    assert.ok(brief.includes(`${field}:`), `reviewer entries need ${field}`);
  }
  assert.match(brief, /A<n>: <ground name/);
  assert.match(brief, /one hop/);
  assert.match(brief, /native verdict[\s\S]*never/);
  assert.match(brief, /## Approach conflicts/);
  assert.match(brief, /whole-PR approach check/);
  assert.match(brief, /native findings.*delta-bounded/);
  assert.match(assessment, /work_started == false/);
  assert.match(assessment, /## Approach conflicts[\s\S]*off-contract/);
  for (const rule of [/unknown ground/, /no base path/, /base path missing/, /no smaller change/, /no remedy/, /remedy edits part of the diff/, /cat-file -e/]) {
    assert.match(findings, rule);
  }
  assert.match(findings, /`P#` blocker[\s\S]*conflict key[\s\S]*provenance/);
  assert.match(findings, /approach entry dropped - <reason>/);
  assert.match(findings, /non-blocking[\s\S]*nits[\s\S]*no note[\s\S]*no `reject`/);
  assert.match(report, /one or two sentences/);
  assert.match(report, /base path.*trailing/);
  assert.match(report, /native verdict/);
  assert.match(report, /Do not double-count/);
  assert.ok(read('ci.mjs').includes('R("scripts/gatekeep-reject.test.mjs")'), 'CI selects the deterministic approach checks');
});

test('the first report previews a saved, checked rejection note without exposing other drafts', () => {
  const note = read('../skills/gatekeep-pr/reference/reject.md');
  const findings = read('../skills/gatekeep-pr/reference/findings.md');
  const report = read('../skills/gatekeep-pr/reference/report.md');
  for (const heading of ['What this PR builds', 'Why it does not fit this repo', 'What to do instead']) {
    assert.ok(note.includes(`### ${heading}`), heading);
  }
  for (const rule of [/under 180 words/, /Count whitespace-separated words including headings/, /short everyday role alone on later mentions/, /one short paragraph or one list/, /every open approach blocker and nothing else/, /everyday role before/, /base path trails/, /Output done-check/, /mktemp/, /note_sha256/, /same head/, /missing or unreadable/, /remaining blockers/, /reject_withdrawn/, /never rewrite/i]) {
    assert.match(note, rule);
  }
  assert.match(findings, /reject\.md.*Draft note/);
  assert.match(findings, /post.time composition.*does not apply.*rejection note/);
  assert.match(report, /saved note.*full.*unfenced/);
  assert.match(report, /after the problems and before the recommendation/);
  assert.match(report, /print exactly "Here is the saved rejection note\." as the one neutral lead-in sentence/);
  assert.match(report, /Put no rationale, recommendation or claim that these problems cannot be repaired in the lead-in/);
  assert.match(report, /one drafted body printed outside `show evidence`/);
  assert.match(report, /Keep full drafted file edits, description bodies and replies.*behind that command/);
});

test('approach-conflict-report: each saved note has three compact sections', () => {
  const candidate = JSON.parse(read('../eval/gatekeep-pr/results/approach-conflict-report/candidate.json'));
  const target = JSON.parse(read('../eval/gatekeep-pr/target.json'));
  const readSkill = (path) => read(`../${path}`);
  const intent = read('../eval/gatekeep-pr/intent.md');
  assert.ok(intent.startsWith(`for: ${sha256(assemble(target, readSkill))}\n`));
  assert.match(candidate.skillSha, /^[a-f0-9]{64}$/);
  for (const [model, output] of Object.entries(candidate.outputs)) {
    const start = output.text.indexOf('### What this PR builds');
    assert.ok(start >= 0, `${model}: missing note preview`);
    const note = output.text.slice(start).trim();
    assert.deepEqual([...note.matchAll(/^### (.+)$/gm)].map((match) => match[1]), [
      'What this PR builds', 'Why it does not fit this repo', 'What to do instead',
    ]);
    assert.ok(note.split(/\s+/).length < 180, `${model}: note exceeds word cap`);
    assert.doesNotMatch(note, /```|\b[APLRC]\d+\b/);
    const sections = note.split(/^### .+$/m).slice(1).map((text) => text.trim());
    for (const section of sections) {
      assert.ok(section.length > 0, `${model}: empty section`);
      const paragraphs = section.split(/\n\s*\n/);
      assert.ok(paragraphs.length === 1 || paragraphs.every((text) => /^[-*] /.test(text)),
        `${model}: mix of paragraphs or paragraph and list`);
    }
    assert.match(sections[1], /docs\/architecture\.md/);
  }
});

test('the first action menu offers reject after assess and recommends evidence-backed grounds', () => {
  const menus = read('../skills/gatekeep-pr/reference/menus.md');
  const action = menus.split('\n## action\n')[1].split('\n## final\n')[0];
  const rows = [...action.matchAll(/^\| `([^`]+)` \|/gm)].map((match) => match[1]);
  assert.equal(rows.indexOf('reject'), rows.indexOf('assess') + 1);
  assert.ok(rows.indexOf('deliver') < rows.indexOf('reject'));
  const reject = action.split('\n').find((line) => line.startsWith('| `reject` |'));
  for (const rule of [/Initial or obstacle/, /work_started.*false/, /reject_withdrawn.*false/, /open approach blocker/, /OPEN/, /Write nothing/]) {
    assert.match(reject, rule);
  }
  assert.match(action, /close permission, authorship or draft state/);
  const recommendation = menus.split('\n## Recommendation\n')[1].split('\n## action\n')[0];
  assert.match(recommendation, /Before the pins below/);
  assert.match(recommendation, /ground recommends reject/);
  assert.match(recommendation, /first.*report order/);
  assert.match(recommendation, /one sentence.*conflict.*Pick one:/);
  assert.match(recommendation, /only.*ground.?6.*existing rules/);
  const brief = read('../skills/gatekeep-pr/verification-brief.md');
  const loop = read('../skills/gatekeep-pr/reference/post-selection-loop.md');
  for (const field of ['work_started', 'reject_withdrawn']) {
    assert.ok(brief.includes(`- ${field}: false | true`));
    assert.ok(loop.includes(`${field} false`));
  }
  assert.match(loop, /never reset either inside a run/);
});

test('work picks withdraw reject before work and keep later review on carried closures', () => {
  const loop = read('../skills/gatekeep-pr/reference/post-selection-loop.md');
  const lifecycle = loop.split('\n### Pick lifecycle\n')[1]?.split('\n### ')[0];
  assert.ok(lifecycle, 'the pick boundary must persist rejection eligibility before work');
  for (const pick of ['deliver', 'deliver with nits', 'fix nits', 'assess', 'approve workflow run', 'approve', 'merge']) {
    assert.ok(lifecycle.includes(`\`${pick}\``), `work-starting pick: ${pick}`);
  }
  assert.match(lifecycle, /work_started.*true.*persist.*before.*dispatch or external write/);
  assert.match(lifecycle, /failed.*refused.*zero.blocker.*never reset/);
  assert.match(lifecycle, /show evidence.*check <name>.*overrule <n>/);
  assert.match(lifecycle, /delete.*note.*reject.*null/i);
  assert.match(loop.split('\n### Next action\n')[1].split('\n### Post steps\n')[0], /Pick lifecycle.*before/);
  const back = read('../skills/gatekeep-pr/reference/reject.md').split('\n## Back\n')[1];
  assert.ok(back, 'back must withdraw rejection without starting work');
  assert.match(back, /reject_withdrawn.*true.*persist/);
  assert.match(back, /delete.*note.*reject.*null/i);
  assert.match(back, /work_started.*unchanged/);
  assert.match(back, /nothing.*posted.*closed/i);
  const task = read('../skills/gatekeep-pr/reference/fix-wave.md').split('\n## Re-review task\n')[1].split('\n## Evidence after push\n')[0];
  assert.match(task, /carried approach.*closure lines/);
  assert.match(task, /never.*whole.PR approach.*after.*work_started/i);
  assert.match(read('../skills/gatekeep-pr/reference/assessment.md'), /work_started == false/);
});

test('approach-none-unchanged: no-conflict reports and menus match the pre-feature baseline', () => {
  const root = '../eval/gatekeep-pr/';
  const sample = 'approach-none-unchanged';
  const expected = read(`${root}samples/${sample}/expected.md`);
  const { facts } = parseExpected(expected);
  const { text, bundle } = parseCase(read(`${root}samples/${sample}/case.md`));
  const baseline = JSON.parse(read(`${root}results/${sample}/baseline.json`));
  const candidate = JSON.parse(read(`${root}results/${sample}/candidate.json`));
  assert.match(candidate.skillSha, /^[a-f0-9]{64}$/);
  assert.equal(candidate.inputSha, inputSha(read(`${root}replay.md`), text, bundle));
  assert.equal(baseline.inputSha, candidate.inputSha);
  assert.deepEqual(Object.keys(candidate.outputs), candidate.models.replay);
  assert.equal(candidate.models.replay.length, 2);
  const menuRows = (output) => [...output.matchAll(/^\d+\. ([a-z ]+) -/gm)].map((match) => match[1]);
  for (const [model, output] of Object.entries(candidate.outputs)) {
    const before = baseline.outputs[model];
    const judgment = candidate.judge[model];
    assert.equal(before.status, 'ok', model);
    assert.equal(output.status, 'ok', model);
    assert.equal(judgment.factsSha, sha256(expected), model);
    assert.equal(judgment.baselineOutputSha, sha256(before.text), model);
    assert.equal(judgment.candidateOutputSha, sha256(output.text), model);
    assert.deepEqual(menuRows(output.text), ['merge', 'approve', 'stop', 'deliver', 'assess', 'stop', 'deliver', 'assess', 'stop']);
    assert.deepEqual(menuRows(output.text), menuRows(before.text), model);
    assert.equal((output.text.match(/Type a number; show evidence prints the full record\./g) ?? []).length, 3);
    assert.doesNotMatch(output.text, /^### (?:What this PR builds|Why it does not fit this repo|What to do instead)|^\d+\. reject\b/gm);
    for (const fact of facts) {
      assert.equal(judgment.facts[fact.id]?.before, 'holds', `${model}/${fact.id}/baseline`);
      assert.equal(judgment.facts[fact.id]?.after, 'holds', `${model}/${fact.id}/candidate`);
    }
  }
});

for (const sample of ['approach-conflict-report', 'approach-local-instance', 'reject-row-first-menu', 'reject-not-after-pick', 'reject-menu-note-preview', 'reject-back', 'reject-step-failures', 'batch-reject-queue', 'approach-blocker-other-row']) {
  test(`${sample}: saved sample-scoped replies satisfy every approach fact`, () => {
    const root = `../eval/gatekeep-pr/`;
    const expectedText = read(`${root}samples/${sample}/expected.md`);
    const { facts } = parseExpected(expectedText);
    const candidate = JSON.parse(read(`${root}results/${sample}/candidate.json`));
    const { text, bundle } = parseCase(read(`${root}samples/${sample}/case.md`));
    assert.equal(candidate.inputSha, inputSha(read(`${root}replay.md`), text, bundle));
    assert.match(candidate.skillSha, /^[a-f0-9]{64}$/);
    assert.equal(Object.keys(candidate.outputs).length, 2);
    if (sample === 'reject-row-first-menu') {
      for (const [model, output] of Object.entries(candidate.outputs)) {
        const reasons = output.text.split('\n').filter((line) => /I recommend reject\b/.test(line));
        for (const reason of reasons) {
          assert.doesNotMatch(reason, /GitHub|BLOCKED|cannot (?:push|close)|helpers/i,
            `${model}: the reject recommendation names only the conflict`);
        }
      }
    }
    for (const [model, output] of Object.entries(candidate.outputs)) {
      assert.equal(output.status, 'ok', model);
      const judgment = candidate.judge[model];
      assert.equal(judgment.factsSha, sha256(expectedText), model);
      assert.equal(judgment.candidateOutputSha, sha256(output.text), model);
      for (const fact of facts) {
        assert.equal(judgment.facts[fact.id]?.after, 'holds', `${sample}/${model}/${fact.id}`);
      }
    }
  });
}
