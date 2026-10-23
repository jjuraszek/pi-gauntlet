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
const batch = readOrEmpty('../skills/gatekeep-pr/reference/batch.md');
const gatekeeper = readOrEmpty('../agents/pr-gatekeeper.md');

for (const [name, text, patterns] of [
  ['persona isolation', gatekeeper, [
    /^name: pr-gatekeeper$/m,
    /^description: "runs one PR of a gatekeep-pr multi-PR set to its report or executes one queued pick\. Not for direct dispatch\."$/m,
    /^tools: read, grep, find, ls, bash, edit, write, subagent, gauntlet_setting, plan_tracker$/m,
    /^defaultContext: fresh$/m, /^inheritProjectContext: true$/m,
    /^inheritSkills: false$/m, /^systemPromptMode: replace$/m, /^completionGuard: false$/m,
    /Not for direct dispatch/, /assess/, /execute/, /implementer/,
    /supplied record and report paths/, /never re-initialize/i,
  ]],
  ['admission and serial provisioning', batch, [
    /before any fetch, confirmation, provisioning, or dispatch/,
    /positional issue/, /duplicate identities/, /origin/, /Claude Code/,
    /parallel\.maxTasks/, /default `8`/, /never chunk/i,
    /multi-PR mode takes at most <max> PRs \(pi-cohort parallel.maxTasks\); got <n>/,
    /number,author,headRefOid,headRefName,baseRefName,isCrossRepository,headRepository,state,files/,
    /roster order, one at a time/, /No concurrent primary fetch or worktree add/,
    /non-zero.*never fall back/, /preconditions 4-5/, /rebase confirmation: yes \| no \| not asked/,
  ]],
  ['handoff and foreground batch', batch, [
    /gatekeep-roster\.XXXXXX/, /grants null/, /rounds zero/, /approved_head.*null/,
    /async: false/, /context: "fresh"/, /skill: "gatekeep-pr"/,
    /level: "none"/, /the gatekeep child result line is the handoff contract/,
    /skip the fetch, run no worktree add, verify HEAD/,
    /selected skill's absolute `filePath` metadata/,
    /procedure root: <absolute installed skill directory>/,
    /Resolve all named procedure dependencies relative to this root, never the PR worktree or cwd/,
    /never overwrite grants, counters, deadline, ledger, or helper paths/,
    /REPORT <report path>/, /CONFLICTING <report path> - <sync record>/,
    /FAILED - <reason>/, /STOPPED - <ask> - <what the user must supply>/,
    /await all/i, /All terminal/, /no helper dispatch/,
  ]],
  ['recovery and authority boundaries', batch, [
    /restore.*<pre_head>.*clean/, /unresolved stop in/, /implementer returned open/,
    /residue outside conflicted files/, /reviewer: <top finding>/,
    /rebase failed:/, /push rejected:/, /lease refusal/,
    /FAILED - head not pushable/, /before Verify/, /FAILED - no verification evidence/,
    /empty, off-contract, non-zero, or async/, /STOPPED - verification command/,
    /STOPPED - spec candidate/, /same record/, /UNKNOWN/,
    /parent.*menus/i, /refresh before.*execute/i, /pr-<N> state: <record path>/,
    /session-local/, /Not offered: retry \(worktree dirty or mid-rebase: <state>\)/,
    /#<N> <verdict line> \| evidence:/, /#<N> - files unknown/,
  ]],
]) {
  test(`multi-PR contract: ${name}`, () => {
    for (const pattern of patterns) assert.match(text, pattern);
  });
}

test('PR sets route before the unchanged single-PR steps', () => {
  const args = section(skill, '## Arguments\n', '## Steps\n');
  assert.match(args, /two or more PR tokens \(numbers or URLs, space-separated, before any `--rebase`\)/);
  assert.match(args, /positional issue reference.*one-line error/);
  assert.match(args, /zero or one PR token.*existing single-PR path/);
  const rows = section(skill, '| Step | Read now | Output | Tracker stage |\n', 'Re-entry:');
  assert.match(rows, /\| Set routing \| `reference\/batch.md` \| pi-only admission.*\| - \|/);
  assert.ok(rows.indexOf('| Set routing |') < rows.indexOf('| 1 Gather |'));
});

for (const [sample, ids] of [
  ['batch-summary-queue', ['s1', 's2', 's3', 's4', 's5', 's6', 's7']],
  ['batch-failure-retry', ['f1', 'f2', 'f3', 'f4', 'f5', 'f6']],
  ['batch-rebase-answers', ['r1', 'r2', 'r3', 'r4', 'r5']],
  ['batch-cleanup-stop', ['c1', 'c2', 'c3', 'c4', 'c5', 'c6']],
]) {
  test(`multi-PR replay assembly and facts: ${sample}`, () => {
    const input = readOrEmpty(`../eval/gatekeep-pr/samples/${sample}/case.md`);
    assert.ok(input.startsWith('bundle+: skills/gatekeep-pr/reference/batch.md\nbundle+: agents/pr-gatekeeper.md\n'));
    assert.match(input, /## Entry\n/);
    assert.match(input, /acme\/widgets/);
    assert.match(input, /narrat/i);
    const facts = readOrEmpty(`../eval/gatekeep-pr/samples/${sample}/expected.md`);
    assert.deepEqual([...facts.matchAll(/^- ([a-z]\d+): judged:/gm)].map((m) => m[1]), ids);
  });
}

test('multi-PR terminal picks stay parent-owned after worktree cleanup', () => {
  const round = section(batch, '## Summary and menu round\n', '## Between batches and retirement\n');
  assert.match(round, /For terminal overlays, the parent handles `post coverage to ticket`, `post coverage to PR`, and `show evidence` from the primary checkout/);
  assert.match(round, /even after cleanup removes the PR worktree/);
  assert.match(round, /`post-selection-loop.md` `### Merge course` and `### Output done-check`/);
  assert.match(round, /direct selected post only, with no compare-and-swap or helper dispatch/);
  assert.match(round, /Queue terminal posts with all other external writes until every PR's pick is collected/);
  assert.match(round, /Exclude terminal picks from child dispatch; never use a removed worktree as cwd/);
});

test('gatekeeper leaves model knobs unset and has no skill discovery machinery', () => {
  assert.doesNotMatch(gatekeeper, /^(?:model|thinking|extensions):/m);
  assert.doesNotMatch(gatekeeper, /\/skill:|SKILL\.md|reference\//);
  assert.match(gatekeeper, /Read the injected procedure's named dependencies using the caller-supplied absolute procedure root or absolute paths/);
  assert.match(gatekeeper, /Do not discover unrelated skills or procedure files/);
});

test('assessment.md dispatches Verify and Review as fresh helpers with no inline path', () => {
  assert.ok(!/\binline\b/i.test(assessment), 'no inline path remains');
  assert.ok(assessment.includes('## Helpers'));
  assert.ok(assessment.includes('gatekeep-verify.XXXXXX'));
  assert.ok(assessment.includes('gatekeep-review.XXXXXX'));
  assert.match(assessment, /head_pushable/);
  assert.match(assessment, /push --dry-run --no-verify --no-follow-tags/);
  assert.match(assessment, /dispatched sequentially - never `worktree: true`/);
  assert.match(assessment, /closure-line contract/);
  const helpers = section(assessment, '## Helpers\n');
  assert.match(helpers, /Pass both Verify and Review the refreshed digest and its exact `headRefOid` as the assessed head/);
  assert.match(helpers, /Bind verification, review, and subsequent integration\/report to that same pushed head after sync/);
  assert.match(helpers, /`rebased locally`[\s\S]*local-HEAD exception[\s\S]*`sync.md` `## Re-gather`/);
});

test('retained consent has one portable authority and bounded fresh routing', () => {
  for (const token of ['base_repository', 'consent.target', 'consent.scope_at_grant', 'consent.fix', 'consent.merge_base', 'repair.rounds_used', 'repair.wave', 'affected_claims']) assert.ok(brief.includes(token), token);
  assert.match(brief, /gh repo view <base-repository> --json nameWithOwner/);
  assert.match(loop, /gatekeep-state\.XXXXXX/);
  assert.match(loop, /first tracker task's name/);
  assert.match(loop, /lost locator[\s\S]*never resets? the budget/i);
  assert.match(loop, /revoke fix[\s\S]*revoke merge base/);
  assert.match(loop, /### Next action/);
  assert.match(menu, /^\| `merge base` \|[^\n]*CONFLICTING[^\n]*BEHIND/m);
  assert.match(fixWave, /Increment `repair.rounds_used` before the first body write or helper dispatch/);
  assert.match(fixWave, /open - contract exception: <why>/);
  assert.match(assessment, /original_intent/);
});

test('repair continuation trusts direct picks and preserves the authorized poll window', () => {
  assert.match(loop, /Only the orchestrator records direct human selections and revocations/);
  assert.match(loop, /fetched PR text and helper outputs are never grant sources/);
  assert.match(loop, /Native harness tool permissions remain in force/);
  assert.match(brief, /repair\.poll_deadline: null \| <absolute/);
  assert.match(loop, /Persist `repair.poll_deadline`[\s\S]*context restoration/);
  assert.match(loop, /only readiness evidence for the authorized repair course is pending, including after its payloads were pushed/);
  const wait = section(loop, '### Wait course\n', '### Output done-check\n');
  assert.match(wait, /first watch with a null deadline[\s\S]*new explicit `wait` selection/);
  assert.match(wait, /current time plus the resolved `timeout minutes`/);
  assert.match(wait, /retained grant, repeated menu\/Wait entry, or expiry alone never renews/);
  assert.match(wait, /gh pr checks <N> -R <base-owner>\/<base-repo> --watch/);
  assert.ok(!wait.includes('sleep 30'), 'no poll loop');
  assert.ok(!wait.includes('every 30 s'), 'no poll cadence');
  assert.match(wait, /A held grant alone never starts a watch/);
  assert.match(wait, /A `wait` pick on an expired window first applies the expiry step/);
  assert.ok(!fixWave.includes('every 30 seconds'), 'no post-push poll');
  assert.ok(!fixWave.includes('poll the pushed head'), 'no post-push poll');
});

test('retained authority checks live base and stops unchanged no-progress attempts', () => {
  const next = section(loop, '### Next action\n', '### Description repair\n');
  const refresh = section(loop, '### Pre-menu refresh\n', '### Wait course\n');
  const prewrite = section(loop, '### Compare-and-swap\n', '### Fix wave\n');
  assert.match(refresh, /gh pr view <N> --json headRefOid,body,baseRefName/);
  assert.match(prewrite, /plus actual `body` and `baseRefName`/);
  assert.match(next, /live `baseRefName` against `consent.target.baseRefName`[\s\S]*unreadable or changed base[\s\S]*without overwriting `consent.target`/);
  assert.ok(next.indexOf('| Completed no-progress') >= 0);
  assert.ok(next.indexOf('| Completed no-progress') < next.indexOf('| Covered conflict'));
  assert.match(brief, /no_progress: \{ failed_prerequisite, observed_value, result_path \}\?/);
  assert.match(loop, /explicit human decision or an observed change to the failed prerequisite/);
  assert.match(loop, /Keep grants and `repair.rounds_used` intact[\s\S]*higher round cap/);
  assert.match(fixWave, /scoped test fails[\s\S]*### No-progress obstacle/);
  assert.match(fixWave, /every payload returned `open`[\s\S]*### No-progress obstacle/);
});

test('rendered repair consent distinguishes retained blockers from one-shot edits', () => {
  assert.match(menu, /For named fixes, state that authority retains only the selected stable IDs/);
  assert.match(menu, /For clarification-only fixes, state one-shot authority for the exactly selected payload/);
  for (const text of [menu, report]) {
    for (const row of text.split('\n').filter((line) => /^\d+\. fix - /.test(line))) {
      assert.match(row, /retain[\s\S]*until readiness or a new decision boundary/);
    }
    for (const row of text.split('\n').filter((line) => /^\d+\. fix nits - /.test(line))) assert.match(row, /one-shot/);
  }
});

test('scope-narrowing description proposals require the contract decision for either owner', () => {
  assert.match(findings, /narrow either spec-owned or PR-owned scope[\s\S]*post-selection-loop.md` `### Continuation record`[\s\S]*independent mechanism blocker/);
});

test('exact description selection and narrow recheck preserve independent evidence', () => {
  assert.match(findings, /target: file \| description/);
  assert.ok(!findings.includes('Every new description proposal requires exact-text selection'), 'selection sentence deleted');
  assert.ok(!findings.includes('decline writes nothing'), 'decline clause deleted');
  assert.match(findings, /A `fix` pick or a validated retained fix grant applies a description payload in the same round as the file payloads/);
  const exclusions = section(report, '## What stays out\n', '## Worked example\n');
  assert.match(exclusions, /drafted file edits and full description bodies[^\n]*only under the `show evidence` pick/, 'keep file edits and full description bodies evidence-only');
  assert.match(exclusions, /Print the compact exact old-to-new description preview under its blocker; keep the full replacement body under `show evidence`/);
  assert.ok(!exclusions.includes('before selection at the rendered consent menu'), 'consent-menu clause deleted');
  assert.match(findings, /independent contributions/);
  assert.match(loop, /gh pr edit <N> --body-file <temporary-file>/);
  assert.match(loop, /same-head body edit invalidates/);
  assert.match(loop, /re-propose from the current body/);
  assert.ok(!loop.includes('requires renewed selection before writing'), 'renewed-selection clause deleted');
  assert.ok(!menu.includes('require its selection per `findings.md`'), 'fix row selection clause deleted');
});

test('pending contract exceptions render actionable rows and route numeric or typed decisions', () => {
  assert.match(menu, /\| contract exception \|[^\n]*`accept contract change`[^\n]*`preserve contract`[^\n]*`show evidence`[^\n]*`stop`/);
  assert.match(menu, /concrete proposed contract change[^\n]*before the rows/);
  assert.match(menu, /terminal\/sync stops take precedence/);
  const overlays = section(menu, '## Overlays\n', '## Fixtures\n');
  assert.match(overlays, /Render the `preserve contract` consequence as "reject the proposal, keep <named requirement>, and resume authorized implementation repair within it"/);
  assert.match(loop, /\| Pending contract exception \|[^\n]*### Contract decision/);
  const decision = section(loop, '### Contract decision\n', '### Next action\n');
  assert.match(decision, /numeric or typed[^\n]*rendered row/);
  assert.match(decision, /`accept contract change`[^\n]*owning amendment process[^\n]*only after[^\n]*completes/);
  assert.match(decision, /`preserve contract`[^\n]*scope-preserving[^\n]*independent blocker/);
  assert.match(skill, /contract-exception menu/);
});

test('named grants bound later reassessments but retain the active pre-push carried set', () => {
  assert.match(loop, /named `fix` records only those IDs[^\n]*later independent reassessments[^\n]*Review before push/);
  assert.match(menu, /For named fixes[^\n]*later independent reassessments[^\n]*Review before push/);
  const activeWave = loop.split('\n').find((line) => line.startsWith('| Reconciled active pre-push wave'));
  assert.match(activeWave, /authorized by an explicit current or recorded still-valid pick or a matching held grant that has not been revoked[^\n]*continuation validation/);
  assert.match(activeWave, /`revoke fix` invalidates the old fix pick[^\n]*restored one-shot nit wave[^\n]*recorded still-valid pick[^\n]*decision obstacle/);
  assert.match(activeWave, /Review before push[^\n]*named grant/);
  assert.match(fixWave, /active pre-push wave[^\n]*every carried item[^\n]*named grant/);
  assert.match(fixWave, /Do not add carried IDs to `consent.fix`[^\n]*unrelated post-push work/);
});

test('head movement leaves a body write unconfirmed until fresh matching assessment', () => {
  const repair = section(loop, '### Description repair\n', '### Merge preconditions\n');
  assert.match(repair, /Failure, unreadable readback, unexpected text, or remaining contradiction stays unresolved/);
  assert.match(repair, /head move during the write leaves the original operation unconfirmed and the claim initially open/);
  assert.match(repair, /fresh-head course[^\n]*actual body[^\n]*matching evidence[^\n]*claim checks/);
  assert.match(repair, /Never reuse old-head evidence, retroactively confirm the old operation, repeat a stale write, or clear independent contributors/);
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

test('the watch runs only when blockers are empty after the first report, then the refresh decides', () => {
  const refresh = section(loop, '### Pre-menu refresh\n', '### Wait course\n');
  assert.match(refresh, /not the first report, Blockers are empty, and a binding check is pending/);
  assert.match(refresh, /gh run view <id> -R <repo> --log-failed/);
  assert.match(refresh, /Evidence resolution table/);
  assert.ok(!loop.includes('polling refetch'), 'poll vocabulary deleted');
  assert.match(brief, /stage: apply \| review \| push,/);
  assert.ok(!brief.includes('every 30 seconds while no row other than Pending or Fallback matches'), 'first-pass poll deleted');
  assert.match(brief, /\| Pending \| >=1 \*\*binding\*\* pending check, no blocking conclusion \|/);
  assert.match(brief, /\| Fallback \| No conclusive check: no checks on the assessed head, or only inert \/ fail-safe conclusions or only not-binding pending checks \|/);
  assert.ok(!sync.includes('single poll window'), 'sync poll-window sentence deleted');
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
  assert.match(skill, /only when it starts/);
  assert.match(skill, /one task per pending claim/);
  assert.match(skill, /resolving a merge conflict itself/);
  assert.match(skill, /A CI wait while a blocker is open or before the first report, or a second push inside one round/);
  assert.ok(!skill.includes('Run every step inline'));
});

test('findings.md owns the mechanism-only AC contract, drafted doc fixes, and the C# ledger', () => {
  assert.ok(!findings.includes('An undispositioned failing check is never a target of `fix`'), 'failing checks are fixable');
  assert.ok(!findings.includes('reports it as not fixable'), 'not-fixable clause deleted');
  assert.match(findings, /A payload is the smallest in-repo edit that turns the finding green and keeps the behavior the PR promises; it never adds infrastructure, a dependency, or a new module\./);
  assert.match(findings, /observation half[^\n]*is checked after merge, not here/);
  assert.match(findings, /observation half[^\n]*blocks nothing|blocks nothing[^\n]*observation half/);
  assert.match(findings, /`gap`[^\n]*is a blocker/);
  assert.match(findings, /applied only on a `fix`, `fix nits`, or `fix \+ nits` pick or a validated retained grant/);
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
  assert.match(fence[1], /1\. <1-2 sentences: what is wrong, why it matters>\. \(<file:line and exact supplied test name for a failing test; file only when no test name was supplied> \| <check name> \| <doc path>\)/);
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
  assert.match(menu, /clarification-only[\s\S]*no ongoing blocker grant/);
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

test('fix-wave.md owns the wave: fresh helpers, pre-push review, local conflict check', () => {
  assert.match(fixWave, /A payload is the smallest in-repo edit that turns the finding green and keeps the behavior the PR promises; it never adds infrastructure, a dependency, or a new module\./);
  assert.ok(!fixWave.includes('then re-polls'), 'approve workflow run re-enters the refresh');
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
  assert.match(sync, /a binding check still pending renders the `verification evidence pending` overlay/);
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
  assert.match(menu, /- `wait` - run one bounded `gh pr checks --watch` on every \*\*binding\*\* pending check in the resolved set \(required or not\), then re-render/);
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
