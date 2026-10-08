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
const fixWave = read('../skills/gatekeep-pr/reference/fix-wave.md');
const assessment = read('../skills/gatekeep-pr/reference/assessment.md');
const sync = read('../skills/gatekeep-pr/reference/sync.md');

test('assessment.md dispatches Verify and Review as fresh helpers with no inline path', () => {
  assert.ok(!/\binline\b/i.test(assessment), 'no inline path remains');
  assert.ok(assessment.includes('## Helpers'));
  assert.ok(assessment.includes('gatekeep-verify.XXXXXX'));
  assert.ok(assessment.includes('gatekeep-review.XXXXXX'));
  assert.match(assessment, /head_pushable/);
  assert.match(assessment, /push --dry-run --no-verify --no-follow-tags/);
  assert.match(assessment, /dispatched sequentially - never `worktree: true`/);
  assert.match(assessment, /closure-line contract/);
});

// Static source contracts only: these do not execute the skill, a reviewer, or gh.
test('all comment-refetch entrypoints reconcile source-backed body deltas', () => {
  assert.match(loop, /Before a merge executes[^\n]*### Re-render.*steps 1-5/);
  const rerender = section(loop, '### Re-render\n', '### Wait course\n');
  assert.match(rerender, /After every push[^\n]*then run steps 1-5 below/);
  assert.match(rerender, /^4\. Reconcile the body delta/m);
  assert.match(rerender, /^5\.[^\n]*Only after that review completes/m);
  assert.match(loop, /On (?:completion or )?timeout[^\n]*steps 2-5[^\n]*plus step 1's comment and reviewer-run reads/i);
  assert.match(loop, /body delta[^\n]*digest's `comments`|digest's `comments`[^\n]*body delta/i);
  assert.match(loop, /same-head identical-body[^\n]*no source review/i);
});

test('new concerns block stale merge consent, including anyway, but failed fetch retains override', () => {
  assert.match(loop, /new or changed-body delta[^\n]*aborts[^\n]*merge/i);
  assert.match(menu, /anyway`[^\n]*not[^\n]*unreviewed delta/i);
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
  assert.ok(skill.includes('## Harness notes'));
  assert.match(skill, /resolving a merge conflict itself/);
  assert.match(skill, /A local verification run while a binding check is pending, or a second push inside one round/);
  assert.ok(!skill.includes('Run every step inline'));
});

test('findings.md owns the mechanism-only AC contract, drafted doc fixes, and the C# ledger', () => {
  assert.match(findings, /observation half[^\n]*is checked after merge, not here/);
  assert.match(findings, /observation half[^\n]*blocks nothing|blocks nothing[^\n]*observation half/);
  assert.match(findings, /`gap`[^\n]*is a blocker/);
  assert.match(findings, /applied only on a `fix`, `fix nits`, or `fix \+ nits` pick/);
  assert.match(findings, /Draft nit payloads on a `fix nits` or `fix \+ nits` pick/);
  assert.ok(findings.includes('deferred per spec'));
  assert.ok(!findings.includes('Only the tracker waives'));
  assert.ok(!findings.includes('`impossible`'));
  assert.match(findings, /`id`[^\n]*`updated_at`/);
  assert.match(findings, /^\| nit \|/m);
  assert.ok(!findings.includes('follow-up'));
});

test('assessment.md selects the scope contract from the spec at head with a harness fallback', () => {
  assert.ok(assessment.includes('## Select the scope contract'));
  assert.match(assessment, /`doc\/specs` and `docs\/specs`/);
  assert.match(assessment, /cross_check: matched \| differs/);
  assert.ok(!assessment.includes('author: unreadable'));
});

test('verification-brief.md Section C judges against the scope block, not the ticket', () => {
  const c = section(brief, '## Section C - Reviewer\n', '## Edge cases\n');
  assert.ok(c.includes('`scope` block'));
  assert.ok(!c.includes("ticket's actual acceptance criteria"));
});

test('post-selection-loop.md reads the merge state before offering coverage posts', () => {
  assert.ok(loop.includes('gh pr view <N> --json state,mergeCommit'));
  assert.ok(loop.includes('Loop until `stop`.'));
  assert.ok(!loop.includes('impossible'));
});

test('conformance-check.md sentinel names the deferred/deviates line', () => {
  const cc = read('../skills/verification-before-completion/reference/conformance-check.md');
  assert.ok(cc.includes('Deferred/deviates per spec:'));
});

test('report.md renders bottom-up and ends on a two-state verdict', () => {
  const order = ['Delivers', 'PR comments', 'Nits', 'Blockers', 'Verdict:'];
  const orderSection = section(report, '## Order\n');
  const fence = orderSection.match(/```[^\n]*\n([\s\S]*?)\n```/);
  assert.ok(fence, 'Missing fenced report template after ## Order');
  const idx = order.map((s) => fence[1].indexOf(s));
  assert.ok(idx.every((i) => i >= 0), `report.md is missing section ${order[idx.indexOf(-1)]}`);
  assert.deepEqual([...idx].sort((a, b) => a - b), idx, 'sections must appear in bottom-up order');
  assert.match(report, /^Verdict: mergeable - [^\n]*\| fixable - <N> blockers/m);
  assert.ok(!report.includes('not mergeable'));
  assert.ok(!report.includes('Ticket changes'));
  assert.match(report, /[Ee]mpty sections are omitted/);
  assert.match(report, /show evidence: <log_path>/);
  assert.ok(!report.includes('captured tail'));
});

test('decision-menu.md offers fix to every author, omits rows the actor cannot run, and posts coverage only after an own merge', () => {
  assert.ok(!menu.includes('merge anyway - accept AC'));
  assert.ok(!menu.includes('propose ticket change'));
  assert.ok(menu.includes('`post coverage to ticket`') && menu.includes('`post coverage to PR`'));
  assert.match(menu, /`post coverage to ticket`[^\n]*renders only under the `own merge` overlay/);
  assert.match(menu, /`post coverage to PR`[^\n]*renders only under the `own merge` overlay/);
  const overlays = menu.split('\n');
  const own = overlays.findIndex((l) => l.startsWith('| own merge |'));
  const merged = overlays.findIndex((l) => l.startsWith('| merged or closed PR |'));
  assert.ok(own >= 0 && merged >= 0 && own < merged, 'own merge overlay sits above merged or closed PR');
  assert.ok(menu.split('\n').some((l) => l.startsWith('| verification evidence pending |')));
  const consent = section(menu, '## Consent table\n', '\n## ');
  const rows = consent.split('\n').filter((l) => /^\| (you|someone else) \|/.test(l));
  for (const who of ['you', 'someone else']) {
    assert.ok(rows.some((row) => row.startsWith(`| ${who} |`)), `Consent table lacks ${who} rows`);
  }
  for (const row of rows) assert.match(row, /`fix`|`fix nits`/, `row lacks fix or fix nits: ${row}`);
  for (const row of rows.filter((r) => / \| fixable \| /.test(r))) assert.match(row, /`fix`; `fix nits`/, `fixable row lacks fix; fix nits: ${row}`);
  for (const row of rows.filter((r) => / \| mergeable \| /.test(r))) assert.ok(!/`fix`;/.test(row), `mergeable row offers fix: ${row}`);
  assert.ok(!menu.includes('(not available:'), 'no row renders a not-available suffix');
  assert.match(menu, /Not offered:/);
  assert.ok(menu.includes('## Availability'));
  const avail = section(menu, '## Availability\n', '\n## ');
  assert.match(avail, /`unreadable`/);
  assert.match(avail, /`WRITE`, `MAINTAIN`, or `ADMIN`/);
  assert.match(avail, /^\| `push` \|[^\n]*head_pushable/m);
  assert.match(menu, /^- `approve workflow run` - /m);
  assert.match(menu, /^- `update branch` - /m);
  assert.ok(!menu.split('\n').some((line) => line.startsWith('| fork PR |')), 'fork overlay replaced by the permission overlay');
  const perm = menu.split('\n').filter((line) => line.startsWith('| head not pushable |'));
  assert.ok(perm.length > 0, 'overlay table needs a head not pushable row');
  for (const row of perm) {
    assert.match(row, /`push` is omitted/);
    assert.match(row, /`fix` and `fix nits` stay/);
  }
});

test('post-selection-loop.md delegates the wave to fix-wave.md and re-enters step 4 after its own push', () => {
  assert.match(loop, /own push[^\n]*re-enters? step 4|re-enters? step 4[^\n]*own push/i);
  assert.match(loop, /Apply per `fix-wave\.md`/);
  assert.match(loop, /claim-check-only mode/);
  assert.match(loop, /a disposition for every material claim/);
  assert.ok(!loop.includes('one verification pass per wave'));
  assert.ok(!loop.includes('apply inline'));
  assert.ok(!loop.includes('falling back inline'));
  assert.match(loop, /`BEHIND`[^\n]*`update branch`/);
  assert.ok(!loop.includes('push-docs'));
  assert.ok(!loop.includes('F#'));
});

test('gatekeep-pr names its dispatch mechanics only under Harness notes', () => {
  const notes = section(skill, '## Harness notes\n', '\n## ');
  assert.match(notes, /subagent\(/);
  const texts = { skill: skill.replace(notes, ''), loop, menu, brief, findings, report, baseline, assessment, fixWave };
  for (const [name, text] of Object.entries(texts)) {
    assert.ok(!text.includes('subagent('), `${name} names subagent( outside Harness notes`);
    assert.ok(!text.includes('pi-cohort'), `${name} names pi-cohort outside Harness notes`);
  }
});

test('verification-brief.md drops the merge-proof rule and the ticket fetch', () => {
  assert.ok(!brief.includes('Merge-proof rule'));
  for (const t of ['`met`', '`partial`', '`missing`']) assert.ok(!brief.includes(t), `brief must not contain ${t}`);
  const sectionA = section(brief, '## Section A', '## Section B');
  assert.ok(!sectionA.includes('gh issue view'), 'ticket fetch moved to step 2');
});

test('verification-brief.md gathers permissions, treats held runs as pending, and hands the orchestrator log paths', () => {
  const sectionA = section(brief, '## Section A', '## Section B');
  assert.ok(!sectionA.includes('--jq .viewerPermission'), 'REST viewerPermission read must go');
  assert.ok(sectionA.includes("gh api graphql -f query='query($o:String!,$r:String!,$n:Int!){ repository(owner:$o,name:$r){ viewerPermission pullRequest(number:$n){ viewerCanUpdateBranch } } }'"));
  assert.match(sectionA, /headRepository,maintainerCanModify,mergeStateStatus/);
  assert.match(sectionA, /head_pushable/);
  const sectionB = section(brief, '## Section B', '## Section C');
  assert.match(sectionB, /^\| Held run \|/m);
  assert.match(sectionB, /`approve workflow run`/);
  assert.match(sectionB, /local run: no conclusive check`, `local run: held run not approvable`,\s+`local run: local verification: always`/);
  assert.match(sectionB, /log_path: <file under \$\{TMPDIR:-\/tmp\}/);
  assert.match(sectionB, /^\| Fix wave \|[^\n]*reference\/fix-wave\.md/m);
  assert.ok(!sectionB.includes('`action_required`/`error` block'), 'action_required is no longer a blocking conclusion');
  assert.ok(!brief.includes('raw_tail'), 'the orchestrator reads log_path, never a tail');
  assert.ok(!brief.includes('inline yourself'), 'no inline execution sentence');
  assert.match(brief, /Sections B and C are each a fresh helper's whole duty/);
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

test('fix-wave.md owns the wave: fresh helpers, pre-push review, CI poll, local conflict check', () => {
  assert.match(fixWave, /one fresh implementer helper/);
  assert.match(fixWave, /claim-check-only mode/);
  assert.match(fixWave, /<pushed_head>\.\.HEAD/);
  assert.match(fixWave, /fix, fix nits \(round cap reached\)/);
  assert.match(fixWave, /else 3; a cap of `0` omits `fix`/);
  assert.match(fixWave, /stops the round: dispatch no further implementer/);
  assert.match(fixWave, /Never the resolved `verification command`/);
  assert.match(fixWave, /for a `P#` carried by a `rebased locally` sync record the failing test file named in that record/);
  assert.match(fixWave, /`<finding id>: resolved`/);
  assert.match(fixWave, /Push only when the carried set holds no Critical or Moderate/);
  assert.ok(fixWave.includes('gh api --method POST repos/<base-owner>/<base-repo>/actions/runs/<id>/approve'));
  assert.match(fixWave, /merge-tree --write-tree/);
  assert.match(fixWave, /never shows `update branch`/);
  assert.match(fixWave, /local run: no conclusive check/);
  assert.match(fixWave, /On a `rebased locally` head push only when every carried `P#` has a `resolved` closure line, with `--force-with-lease=<head_ref>:<pre_head>`/);
  assert.strictEqual((fixWave.match(/force-with-lease/g) || []).length, 1);
  assert.ok(!/\binline\b/i.test(fixWave));
  assert.match(fixWave, /No claim re-check and no whole-wave review runs after an own push/);
});

test('verification-brief.md classifies pending checks as binding from merge_state_status and kind', () => {
  const sectionA = section(brief, '## Section A - Gatherer', '## Section B - Verifier');
  assert.match(sectionA, /status_checks: \[ \{ name, kind, status, conclusion, required, url, workflowName \} \]/);
  assert.match(sectionA, /kind: check_run \| status_context \| unreadable/);
  assert.match(sectionA, /merge_state_status.*`gh pr view`.*never.*GraphQL/);
  const sectionB = section(brief, '## Section B - Verifier', '## Section C - Reviewer');
  assert.match(sectionB, /\*\*Binding classification\*\*/);
  assert.match(sectionB, /\*\*Binding classification\*\*[^\n]*`kind` is `unreadable`/);
  assert.match(sectionB, /`BLOCKED`, `UNKNOWN`[^\n]*`unreadable`/);
  assert.match(sectionB, /status` other than `completed`/);
  assert.ok(!/binding[^\n]*`queued` or `in_progress`\b(?![^\n]*other than)/.test(sectionB), 'the live-run rule names "other than completed", never the two literals alone');
  assert.match(sectionB, /\| Pending \| >=1 \*\*binding\*\* pending check/);
  assert.match(sectionB, /zero \*\*binding\*\* pending checks, no\nopt-out/);
  assert.match(sectionB, /only not-binding pending checks/);
  assert.match(sectionB, /or the pre-menu refresh failed[^\n]*every pending check binds/);
  assert.match(assessment, /--json mergeable,mergeStateStatus/);
});

test('sync.md re-gather resolves pending checks through the binding rule', () => {
  assert.match(sync, /a binding check still pending at the limit renders the `verification evidence pending` overlay/);
});

test('post-selection-loop.md refreshes merge state before every menu and binds the preconditions to it', () => {
  const refresh = section(loop, '### Pre-menu refresh\n', '### Wait course\n');
  assert.match(refresh, /gh pr view <N> --json headRefOid,state,mergeable,mergeStateStatus,reviewDecision,statusCheckRollup/);
  assert.match(refresh, /gh run list -R <owner>\/<repo> -c <headRefOid> --json databaseId,status,conclusion,workflowName,url/);
  assert.match(refresh, /merge state not refreshed \(<reason>\)/);
  assert.match(refresh, /never mints `C#` rows/);
  assert.match(refresh, /classifies every pending check as binding/);
  const pre = section(loop, '### Merge preconditions\n', '### Compare-and-swap\n');
  assert.match(pre, /no \*\*binding\*\* pending check/);
  assert.match(pre, /`merge_state_status` is not `BLOCKED`, `UNKNOWN`, or `unreadable`, and the pre-menu refresh succeeded/);
  assert.ok(!pre.includes('no pending required check'));
  assert.match(section(loop, '### Compare-and-swap\n', '### Fix wave\n'), /re-fetch `headRefOid`, `state`, `mergeable`, and `mergeStateStatus`/);
  assert.match(section(loop, '### Re-render\n', '### Pre-menu refresh\n'), /1\. Run the pre-menu refresh \(`### Pre-menu refresh`\)/);
  const wait = section(loop, '### Wait course\n', '### Output done-check\n');
  assert.match(wait, /--json statusCheckRollup,mergeStateStatus/);
  assert.match(wait, /or the polled `mergeStateStatus` is `BLOCKED`, `UNKNOWN`, or `unreadable`/);
  assert.match(fixWave, /gh pr view <N> --json headRefOid,statusCheckRollup,mergeStateStatus/);
  assert.match(fixWave, /binding classification/);
  assert.match(fixWave, /runs the pre-menu refresh as `post-selection-loop\.md` `### Re-render` step 1/);
});

test('decision-menu.md resolves the withhold reason once and overlays merge state above evidence pending', () => {
  const resolver = section(menu, '## Withhold reason resolver\n', '## Overlays\n');
  assert.match(resolver, /Not offered: merge \(blocked by GitHub\)/);
  assert.match(resolver, /Not offered: merge \(merge state unknown\)/);
  assert.match(resolver, /Not offered: merge \(<check name> pending\)/);
  assert.match(resolver, /`reviewDecision`[^\n]*locator/);
  assert.match(resolver, /overlays above `merge state`[^\n]*keep their own reasons/);
  const overlays = section(menu, '## Overlays\n', '## Fixtures\n');
  const rows = overlays.split('\n').filter((l) => l.startsWith('| ')).map((l) => l.split('|')[1].trim());
  assert.ok(rows.indexOf('merge state') > rows.indexOf('held run') && rows.indexOf('merge state') < rows.indexOf('verification evidence pending'));
  assert.match(overlays, /\| merge state \| `merge_state_status` is `BLOCKED`, `UNKNOWN`, or `unreadable`, or the pre-menu refresh failed/);
  assert.match(overlays, /\| verification evidence pending \|[^\n]*reason 3's text/);
  assert.ok(!menu.includes('Not offered: merge (verification evidence pending)'));
  assert.ok(!overlays.includes('pending required check'));
  assert.match(overlays, /a binding pending check renders one `PR comments` line/);
  assert.match(overlays, /\| merge state \|[^\n]*`\[recommended\]` goes to `approve` when the consent row renders it/);
  assert.match(menu, /else to `approve` or `wait` under the merge state overlay/);
  assert.match(menu, /- `wait` - poll the reviewer run, every \*\*binding\*\* pending check in the resolved set \(required or not\), `mergeStateStatus` while it is `BLOCKED`, `UNKNOWN`, or `unreadable`, and the comment set/);
  assert.match(findings, /A \*\*binding\*\* pending check/);
  assert.match(findings, /<name> pending - not binding this viewer \(merge_state_status <value>\)/);
  assert.ok(!report.includes('required check pending'));
  assert.ok(!report.includes('A required check is still pending'));
  assert.match(report, /`binding check pending`, `blocked by GitHub`, `merge state unknown`/);
});

test('SKILL.md names the pre-menu refresh at step 5 and in the red flags', () => {
  assert.match(skill, /\| 5 Integrate \+ report \| `reference\/post-selection-loop.md` `### Pre-menu refresh`, then `reference\/findings.md`/);
  assert.match(skill, /\| 6 Menu \| `reference\/decision-menu.md` \|/);
  assert.match(skill, /an unchanged head re-enters step 5 through `reference\/post-selection-loop.md` `### Pre-menu refresh`/);
  assert.match(skill, /or a binding pending check, or a `BLOCKED`\/`UNKNOWN`\/`unreadable` merge state/);
  assert.match(skill, /A menu rendered without the pre-menu refresh - owner: `reference\/post-selection-loop.md` `### Pre-menu refresh`/);
  assert.match(skill, /Reading `mergeStateStatus` from anything but a `gh pr view` invocation, attributing a `BLOCKED` to a named rule, or treating a non-`BLOCKED` value as a merge verdict - owner: `verification-brief.md` Section A/);
  assert.ok(!skill.includes('pending required check'));
});
