import './gatekeep-bypass-pick.test.mjs';
import './gatekeep-post-selection.test.mjs';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { parseExpected, sha256 } from '../eval/lib/checks.mjs';
import { assemble, inputSha, parseCase } from '../eval/lib/replay.mjs';
import { parseIntent } from '../eval/lib/intent.mjs';
import { lintTarget } from '../eval/lib/lint.mjs';
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

const courseSamples = [
  'course-deliver-no-mid-menu', 'course-deliver-nits',
  'course-ready-at-first-report', 'course-assess-terminal',
  'course-cap-exhausted', 'course-obstacle-unknown',
  'course-stop-cleanup', 'menu-rows-omitted',
];

for (const sample of courseSamples) {
  test(`course replay fixture: ${sample}`, () => {
    const root = `../eval/gatekeep-pr/samples/${sample}`;
    const input = readOrEmpty(`${root}/case.md`);
    assert.match(input, /## Digest/);
    assert.match(input, /## Entry/);
    assert.match(input, /## Arguments/);
    const facts = parseExpected(readOrEmpty(`${root}/expected.md`));
    assert.ok(facts.facts.length > 0, 'concrete expected facts required');
    assert.equal(new Set(facts.facts.map((f) => f.id)).size, facts.facts.length);
  });
}

for (const target of ['gatekeep-pr', 'gatekeep-pr-scope', 'gatekeep-pr-merge-state']) {
  test(`course replay assembly: ${target}`, () => {
    const config = JSON.parse(read(`../eval/${target}/target.json`));
    assert.ok(config.skillFiles.some((f) => f.path === 'skills/gatekeep-pr/reference/menus.md'));
    const targetRoot = new URL(`../eval/${target}/`, import.meta.url);
    assert.deepEqual(lintTarget(targetRoot.pathname), []);
    const knownFacts = Object.fromEntries(readdirSync(new URL('samples/', targetRoot)).map((sample) => [
      sample, parseExpected(read(`../eval/${target}/samples/${sample}/expected.md`)).facts.map((f) => f.id),
    ]));
    const skillSha = sha256(assemble(config, (path) => read(`../${path}`)));
    const intent = parseIntent(read(`../eval/${target}/intent.md`), skillSha, knownFacts);
    assert.equal(intent.status, 'ok', intent.reason);
    for (const sample of Object.keys(knownFacts)) {
      const input = read(`../eval/${target}/samples/${sample}/case.md`);
      assert.doesNotMatch(input, /"(?:fix|merge_base|scope_at_grant|granted_by)"\s*:|consent\.(?:fix|merge_base|scope_at_grant)/);
    }
    if (target === 'gatekeep-pr') for (const sample of ['per-ref-settlement', 'reviewer-row-reopen', 'loop-worker', 'nit-batch-row']) {
      const parsed = parseCase(read(`../eval/${target}/samples/${sample}/case.md`));
      const selected = { ...config, skillFiles: config.skillFiles.filter(f => !parsed.drop.includes(f.path)) };
      const saved = JSON.parse(read(`../eval/${target}/results/${sample}/candidate.json`));
      assert.equal(saved.skillSha, sha256(assemble(selected, path => read(`../${path}`), parsed.bundle)), sample);
      assert.equal(saved.inputSha, inputSha(read(`../eval/${target}/replay.md`), parsed.text, parsed.bundle), sample);
      assert.equal(Object.keys(saved.outputs).length, 2, sample);
      for (const [model, output] of Object.entries(saved.outputs)) {
        assert.equal(output.status, 'ok', `${sample}/${model}`);
        assert.equal(saved.judge[model].factsSha, sha256(read(`../eval/${target}/samples/${sample}/expected.md`)));
        assert.equal(saved.judge[model].candidateOutputSha, sha256(output.text));
        for (const fact of knownFacts[sample]) assert.equal(saved.judge[model].facts[fact].after, 'holds', `${sample}/${model}/${fact}`);
      }
    }
  });
}

const skill = read('../skills/gatekeep-pr/SKILL.md');
const loop = read('../skills/gatekeep-pr/reference/post-selection-loop.md');
const menus = readOrEmpty('../skills/gatekeep-pr/reference/menus.md');
const decisionMenu = menus;
const menu = menus;
const brief = read('../skills/gatekeep-pr/verification-brief.md');
const findings = read('../skills/gatekeep-pr/reference/findings.md');
const report = readOrEmpty('../skills/gatekeep-pr/reference/report.md');
const baseline = read('../skills/gatekeep-pr/review-baseline.md');
const delivery = read('../skills/check-delivery/SKILL.md');
const fixWave = read('../skills/gatekeep-pr/reference/fix-wave.md');
const assessment = read('../skills/gatekeep-pr/reference/assessment.md');
const sync = read('../skills/gatekeep-pr/reference/sync.md');
const batch = readOrEmpty('../skills/gatekeep-pr/reference/batch.md');
test('UNKNOWN exit precedes pending CI and other-author explanation stays verbatim', () => {
  assert.match(loop, /UNKNOWN\/unreadable after step 2's single re-poll, regardless of CI color or a pending binding check/);
  assert.match(loop, /merging cannot proceed until GitHub's merge status is readable/);
  assert.match(loop, /let merge state own the withhold reason; render the wait through `report\.md`/);
  assert.match(sync, /print this fixed block verbatim, one line per point/);
  assert.match(sync, /^Authorship stays, but the committer becomes this checkout's local git identity\.$/m);
});

const cleanup = read('../skills/gatekeep-pr/reference/cleanup.md');
const gatekeeper = readOrEmpty('../agents/pr-gatekeeper.md');

for (const [name, text, patterns] of [
  ['persona isolation', gatekeeper, [
    /^name: pr-gatekeeper$/m,
    /^description: "runs one PR of a gatekeep-pr multi-PR set to its report or executes one queued pick\. Not for direct dispatch\."$/m,
    /^tools: read, grep, find, ls, bash, edit, write, subagent, gauntlet_setting, plan_tracker$/m,
    /^defaultContext: fresh$/m, /^inheritProjectContext: true$/m,
    /^inheritSkills: false$/m, /^systemPromptMode: replace$/m, /^completionGuard: false$/m,
    /Not for direct dispatch/, /In `report`/, /execute/, /implementer/,
    /supplied record and report paths/, /never re-initialize/i,
  ]],
  ['admission and serial provisioning', batch, [
    /before any fetch, confirmation, provisioning, or dispatch/,
    /positional issue/, /duplicate identities/, /origin/, /Claude Code/,
    /print exactly: `multi-PR mode requires pi's nested dispatch`/,
    /parallel\.maxTasks/, /default `8`/, /never chunk/i,
    /multi-PR mode takes at most <max> PRs \(pi-cohort parallel.maxTasks\); got <n>/,
    /number,author,headRefOid,headRefName,baseRefName,isCrossRepository,headRepository,state,files/,
    /roster order, one at a time/, /No concurrent primary fetch or worktree add/,
    /non-zero.*never fall back/, /preconditions 4-5/, /rebase confirmation: yes \| no \| not asked/,
  ]],
  ['handoff and foreground batch', batch, [
    /gatekeep-roster\.XXXXXX/, /`course` null/, /`repair.rounds_used` and `repair.syncs_used` zero/, /`repair.rounds_cap` and `repair.syncs_cap` to `2 x`/, /approved_head.*null/,
    /async: false/, /context: "fresh"/, /skill: "gatekeep-pr"/,
    /level: "none"/, /the gatekeep child result line is the handoff contract/,
    /skip the fetch, run no worktree add, verify HEAD/,
    /selected skill's absolute `filePath` metadata/,
    /procedure root: <absolute installed skill directory>/,
    /Resolve all named procedure dependencies relative to this root, never the PR worktree or cwd/,
    /never overwrite course, counters, caps, deadline, ledger, or helper paths/,
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
    /session-local/, /omit retry and explain that the worktree is dirty or mid-rebase, naming the observed porcelain line or rebase directory/,
    /print `#<N>` and copy the child's standing sentence unchanged/, /#<N> - files unknown/,
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
  assert.match(args, /zero tokens discover.*before this row runs/);
  assert.match(args, /during argument resolution/);
  assert.match(args, /trailing comma.*before identity normalization/);
  assert.doesNotMatch(brief, /Missing PR number:|gh pr view --json number,url/);
  const discovery = section(brief, '### Argument-resolution discovery\n', '### Gather fixed commands\n');
  for (const pattern of [
    /git remote get-url origin/, /gh api user --jq \.login/,
    /gh pr list -R <owner\/repo> --author @me --state open --limit 1000 --json number,isDraft,reviewDecision,additions,deletions/,
    /gh pr list -R <owner\/repo> --search 'user-review-requested:@me' --state open --limit 1000 --json number,isDraft,reviewDecision,additions,deletions/,
    /discovery failed: malformed gh pr list output/, /discovery failed: incomplete \(<query> hit --limit 1000\)/,
    /source: discovered/, /GH_REPO/, /never falls back/i,
  ]) assert.match(discovery, pattern);
  const rows = section(skill, '| Step | Read now | Output | Tracker stage |\n', 'Re-entry:');
  assert.match(rows, /\| Set routing \| `reference\/batch.md` \| pi-only admission.*\| - \|/);
  assert.ok(rows.indexOf('| Set routing |') < rows.indexOf('| 1 Gather |'));
});

for (const [sample, ids] of [
  ['batch-summary-queue', ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8']],
  ['batch-failure-retry', ['f1', 'f2', 'f3', 'f4', 'f5', 'f6']],
  ['batch-rebase-answers', ['r1', 'r2', 'r3', 'r4', 'r5']],
  ['batch-cleanup-stop', ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7']],
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

test('batch rendering preserves child reports and confines pending checks to menus', () => {
  const round = section(batch, '## Summary and menu round\n', '## Between batches and retirement\n');
  assert.match(round, /naming the observed porcelain line or rebase directory/);
  assert.doesNotMatch(round, /`<observed state>`|print `Not offered:/);
  assert.match(round, /Print each supplied child report file verbatim in roster order/);
  assert.match(round, /copy the child's standing sentence unchanged/);
  assert.match(round, /Preserve each supplied child report unchanged, including under show evidence/);
  assert.match(round, /Describe a pending required check in that PR's deliver row; leave the supplied standing sentence unchanged/);
  assert.match(round, /add no verdict, evidence or blocker fields/);
});

test('obstacle menus extend both caps even below their limits', () => {
  const obstacle = section(menus, '### obstacle\n', '## final\n');
  assert.match(report, /distinguish CI from local runs and never turn pending or missing evidence into a pass/);
  assert.match(report, /check conclusions, run URLs, head, prior-review and sync SHAs, pending-check counts, repair\/sync usage counters and raw field\/value pairs under `show evidence`/);
  assert.match(report, /Apply the same rule to obstacle and final reports/);
  assert.match(obstacle, /course unset describe starting work; otherwise describe continuing it/);
  assert.match(obstacle, /For every non-timeout deliver selection, add exactly `2 x maxFixRounds` to both caps and persist before work, preserving usage/);
  assert.match(obstacle, /explain the added repair and sync attempts in the row, leaving counters under show evidence/);
  assert.match(obstacle, /timeout.*exactly one additional watch window.*neither cap extended/);
  assert.match(obstacle, /unchanged prerequisite re-exits even after extension/);
});

test('multi-PR terminal picks stay parent-owned after worktree cleanup', () => {
  const round = section(batch, '## Summary and menu round\n', '## Between batches and retirement\n');
  assert.match(round, /Execute queued terminal picks in roster order from the primary checkout through `post-selection-loop.md` `### Post steps`/);
  assert.match(round, /Show evidence in-place from retained record\/helper paths and leave the same menu waiting/);
  assert.match(round, /parent owns every post step, even after cleanup removes a PR worktree/);
  assert.match(round, /`merge queued`, the parent handles `wait` after all picks/);
  assert.match(round, /gh pr view <N> --json state,mergeCommit/);
  assert.match(round, /`MERGED`.*`pr.state`.*`pr.merge_commit`.*`own merge`/);
  assert.match(round, /otherwise re-render `merge queued` with wait\/stop and the evidence hint, without helper, child or CI watch/);
  assert.match(round, /`post-selection-loop.md` `### Merge course`/);
  assert.match(section(loop, '### Post steps\n', '### Exit check\n'), /Execute posts in the orchestrator after Output done-check/);
  assert.match(round, /Run no helper for terminal posts/);
  assert.match(round, /Skip compare-and-swap only on merged or closed PRs/);
  assert.match(round, /approved\/open reply freshness to `### Post steps`/);
  assert.match(round, /Queue every parent-owned terminal pick.*until every roster entry's pick for the round is collected/);
  assert.match(round, /Print `Queued until all picks are collected \(<roster summary>\)` before the execution block for each queued pick, including a single-entry roster/);
  assert.match(round, /exclude terminal picks from child dispatch and never use a removed worktree as cwd/);
});

test('gatekeeper leaves model knobs unset and has no skill discovery machinery', () => {
  assert.doesNotMatch(gatekeeper, /^(?:model|thinking|extensions):/m);
  assert.doesNotMatch(gatekeeper, /\/skill:|SKILL\.md|reference\//);
  assert.match(gatekeeper, /Read the injected procedure's named dependencies using the caller-supplied absolute procedure root or absolute paths/);
  assert.match(gatekeeper, /Do not discover unrelated skills or procedure files/);
});

test('assessment.md dispatches Verify and Review as fresh helpers with no inline path', () => {
  assert.ok(!/\binline\b(?!\s+comments?\b)/i.test(assessment), 'no inline path remains');
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

test('undispositionable BLOCKED selects obstacle even before a course pick', () => {
  assert.match(menus, /course unset[\s\S]*undispositionable BLOCKED[\s\S]*obstacle/);
  assert.match(menus, /Resolve BLOCKED through `post-selection-loop.md` `### Merge preconditions` before selecting an obstacle/);
  assert.match(findings, /With BLOCKED, no eligible bypass under `post-selection-loop.md` `### Merge preconditions`, and no dispositionable local repair/);
  assert.match(decisionMenu, /BLOCKED with no eligible bypass and no local repair/);
  assert.match(menus, /no wait row, no sync promise, and no approve row/);
  assert.match(report, /Otherwise say GitHub blocks this actor from merging; never invent a named rule/);
  assert.match(cleanup, /both the cleanup row text and the result block/);
  assert.match(cleanup, /skipped - needs a landed change/);
  assert.match(menus, /cleanup \| At least one worktree, local branch or base-pull sub-step can run/);
});

test('scope-narrowing description proposals require the contract decision for either owner', () => {
  assert.match(findings, /narrow either spec-owned or PR-owned scope[\s\S]*post-selection-loop.md` `### Continuation record`[\s\S]*independent mechanism blocker/);
});

test('exact description selection and narrow recheck preserve independent evidence', () => {
  assert.match(findings, /target: file \| description/);
  assert.ok(!findings.includes('Every new description proposal requires exact-text selection'), 'selection sentence deleted');
  assert.ok(!findings.includes('decline writes nothing'), 'decline clause deleted');
  assert.match(findings, /A delivery course applies a description payload alongside the file payloads/);
  const exclusions = section(report, '## What stays out\n');
  assert.match(exclusions, /`show evidence`[^\n]*Keep full drafted file edits, description bodies and replies[^\n]*behind that command/, 'keep file edits and full description bodies evidence-only');
  assert.match(report, /Print a compact exact old-to-new description preview under its blocker for consent/);
  assert.match(report, /retain a declined proposal's preview on every re-render until the claim resolves/);
  assert.ok(!exclusions.includes('before selection at the rendered consent menu'), 'consent-menu clause deleted');
  assert.match(findings, /independent contributions/);
  assert.match(loop, /gh pr edit <N> --body-file <temporary-file>/);
  assert.match(loop, /same-head body edit invalidates/);
  assert.match(loop, /re-propose from the current body/);
  assert.match(loop, /end the current delivery iteration without any write/);
  assert.match(loop, /next iteration[\s\S]*fresh compare-and-swap[\s\S]*original_body/);
  assert.match(findings, /Author's statement: <assertion> \(not verified by this gate\)\. Gate evidence: <evidence>/);
  assert.match(findings, /dropping a mechanism sentence[\s\S]*description defect[\s\S]*untouched spec requirements/);
  assert.ok(!loop.includes('requires renewed selection before writing'), 'renewed-selection clause deleted');
  assert.ok(!menu.includes('require its selection per `findings.md`'), 'fix row selection clause deleted');
});

test('head movement leaves a body write unconfirmed until fresh matching assessment', () => {
  const repair = section(loop, '### Description repair\n', '### Merge preconditions\n');
  assert.match(repair, /Failure, unreadable readback, unexpected text, or remaining contradiction stays unresolved/);
  assert.match(repair, /never resolving it or minting a replacement ID/);
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

test('new concerns and failed refetch withhold stale merge selection', () => {
  assert.match(loop, /new or changed-body delta[^\n]*aborts[^\n]*merge/i);
  assert.match(loop, /failed refetch[^\n]*withholds merge/i);
  assert.match(loop, /no override bypasses a new blocker or unreviewed delta/);
});

test('source review is not comment triage or blind bot promotion', () => {
  assert.match(loop, /Review each eligible delta[^\n]*source[^\n]*merged rubric/i);
  assert.match(loop, /step 5[^\n]*deduplicat/i);
  assert.match(brief, /comment triage never\s+mints `P#`\/`L#`/i);
  assert.match(brief, /inline\[ \{ id, updated_at, user_type, body,/);
  assert.match(brief, /top_level\[ \{ id, updated_at, user_type, body,/);
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
  assert.match(fixWave, /Never resolve conflicts in the orchestrator/);
  assert.match(loop, /Admit one bounded watch only at D3 step 4, after the first report/);
  assert.match(loop, /3\. Run pre-push review and one push through/);
  assert.ok(!skill.includes('Run every step inline'));
});

test('findings.md owns the mechanism-only AC contract, drafted doc fixes, and the C# ledger', () => {
  assert.ok(!findings.includes('An undispositioned failing check is never a target of `fix`'), 'failing checks are fixable');
  assert.ok(!findings.includes('reports it as not fixable'), 'not-fixable clause deleted');
  assert.match(findings, /A payload is the smallest in-repo edit that turns the finding green and keeps the behavior the PR promises; it never adds infrastructure, a dependency, or a new module\./);
  assert.match(findings, /observation half[^\n]*is checked after merge, not here/);
  assert.match(findings, /observation half[^\n]*blocks nothing|blocks nothing[^\n]*observation half/);
  assert.match(findings, /`gap`[^\n]*is a blocker/);
  assert.match(findings, /applied only under a delivery course or a terminal `fix nits` pick/);
  assert.match(findings, /Draft nit payloads under `deliver-nits` or a terminal `fix nits` pick/);
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
  assert.match(assessment, /End a differing-ticket cross-check line immediately after `\/skill:check-delivery judges the ticket`; append no reconciliation of the ticket's extra wording against Design clauses\./);
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

test('report.md renders three unlabeled parts and delegates the recommendation', () => {
  assert.match(report, /three unlabeled parts/);
  assert.match(report, /one paragraph of exactly two sentences/);
  assert.match(report, /name the behavior, never a row number/);
  assert.match(report, /Start the second part with the standing sentence/);
  assert.match(report, /part three's recommendation sentence and reason immediately above `Pick one:`; follow `menus\.md`\./);
  assert.match(report, /Translate verdict and exit state into prose\./);
  assert.match(report, /Write whole sentences in three unlabeled parts/);
  assert.match(report, /Keep other requested users and teams in API order: exclude the viewer by case-insensitive User login comparison/);
  assert.match(report, /exclude nobody when that login is unreadable/);
  assert.match(report, /render Users by login and Teams by slug, and use `unknown` for a missing login or slug/);
  assert.match(brief, /viewer: \{ login, is_author, role \}/);
  assert.match(brief, /else author when is_author; else requested reviewer/);
  assert.match(brief, /Pending reviewRequests only, never reviews history/);
  assert.match(report, /Name a running required check or unchanged obstacle, not readiness\./);
  assert.match(report, /distinguish CI from local runs and never turn pending or missing evidence into a pass/);
  assert.match(report, /retain the exact supplied failing test name and its file, or the file when no test name was supplied/);
  assert.match(report, /Retain supplied path:line locators for every problem and nit/);
  assert.match(report, /Keep nits distinct and name their count and the offered action that can take them/);
  assert.match(report, /Omit empty sections/);
  assert.match(report, /show evidence: <log_path>/);
  assert.match(report, /Only with `--rebase`, explain the sync outcome, including resolved files on success and the actual reason on a skip, decline or failure/);
  assert.match(report, /Translate the digest's status into prose; keep its exact value in the evidence record/);
  assert.match(report, /Do not invent a sync result on loop re-entry/);
  assert.match(report, /covered and deferred behavior, its references, deliberate deviations and their reasons, behavior handled elsewhere and its repositories, and observations checked after merge/);
  assert.match(report, /Count a covered mechanism as covered even when its observation waits/);
  assert.match(report, /Explain replyable PR comments and the drafted reply's meaning/);
  assert.doesNotMatch(report, /```|captured tail|^Verdict:|^Delivers:|^Evidence:/m);
  assert.match(findings, /Compose a posted review body at post time from the blockers being addressed through `report\.md`'s review-body rule/);
  assert.match(brief, /Render a `pending` row through `reference\/report\.md`'s waits rule/);
  assert.match(brief, /Render a run with `status != completed` through `reference\/report\.md`'s waits rule;\nwithhold pre-composed merge exactly like a `pending` row/);
  assert.match(loop, /render the queued-merge wait through `report\.md`/);
  assert.match(loop, /Render reports through `report\.md`; a report above a menu is not a terminal/);
  for (const owner of [findings, brief, loop]) {
    assert.doesNotMatch(owner, /`Delivers`|`PR comments`|report Verdict|then the numbered items/);
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
  assert.match(loop, /`BEHIND`[^\n]*### Loop sync/);
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
  assert.ok(sectionA.includes("gh api graphql -f query='query($o:String!,$r:String!,$n:Int!){ repository(owner:$o,name:$r){ viewerPermission pullRequest(number:$n){ viewerCanUpdateBranch viewerCanMergeAsAdmin headRefOid body baseRefName } } }'"));
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
  assert.match(fixWave, /round cap reached/);
  assert.match(fixWave, /2 x 5/);
  assert.match(fixWave, /stops the round: dispatch no further implementer/);
  assert.match(fixWave, /Never the resolved `verification command`/);
  assert.ok(fixWave.includes("insert each path made only of `[A-Za-z0-9/._-]` bare; insert any other path single-quoted with embedded `'` escaped as `'\\''`"));
  assert.match(fixWave, /keep each path relative to the runner's working directory \(strip the `cd <dir> &&` prefix's directory from the path\)/);
  assert.match(fixWave, /for a `P#` carried by a `rebased locally` sync record the failing test file named in that record/);
  assert.match(fixWave, /`<finding id>: resolved`/);
  assert.match(fixWave, /Push only when the carried set holds no Critical or Moderate/);
  assert.ok(fixWave.includes('gh api --method POST repos/<base-owner>/<base-repo>/actions/runs/<id>/approve'));
  assert.match(fixWave, /merge-tree --write-tree/);
  assert.doesNotMatch(fixWave, /`update branch`/);
  assert.match(fixWave, /local run: no conclusive check/);
  assert.match(fixWave, /On a locally rewritten head push only when every carried `P#` has a `resolved` closure line/);
  assert.match(fixWave, /entry-time `rebased locally` record without a loop checkpoint[\s\S]*--force-with-lease=<head_ref>:<pre_head>/);
  assert.match(fixWave, /git push --no-follow-tags --force-with-lease=<head_ref>:<expected_remote_head> <head_url> HEAD:refs\/heads\/<head_ref>/);
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

test('eligible BLOCKED uses fresh viewer-relative authority on the ordinary merge row', () => {
  const gather = section(brief, '## Section A - Gatherer', '## Section B - Verifier');
  assert.match(gather, /gh api graphql[^\n]*viewerCanUpdateBranch viewerCanMergeAsAdmin/);
  assert.match(gather, /permissions: \{[^\n]*bypass_eligible/, 'AC 1 and Design require permissions.bypass_eligible');
  assert.match(gather, /`bypass_eligible`.*`viewerCanMergeAsAdmin`/);
  assert.match(gather, /false stays false; null, missing, non-boolean, or a failed\/error-bearing response becomes `unreadable`/);
  assert.match(gather, /Never infer bypass eligibility from `viewer_permission`/);
  const refresh = section(loop, '### Pre-menu refresh\n', '### Wait course\n');
  assert.match(refresh, /Refresh `permissions.bypass_eligible` through Section A's fixed GraphQL query on every pre-menu refresh/);
  const final = section(menus, '## final\n', '## post\n');
  assert.match(final, /merge - <policy>-merge using your admin override/);
  assert.match(final, /GitHub requires an admin override and required checks passed/);
  assert.match(final, /Keep one merge row, no bypass row/);
  assert.match(final, /merge state under show evidence/);
  assert.doesNotMatch(final, /merge \(admin\)/);
  assert.match(report, /For eligible BLOCKED readiness, omit the blocked comment/);
  for (const command of brief.matchAll(/gh pr view[^\n]+/g)) assert.ok(!command[0].includes('viewerCanMergeAsAdmin'));
  assert.doesNotMatch(gather + refresh, /can_bypass_merge/);
  assert.match(refresh, /replace merge state, bypass_eligible, reviewDecision/);
  const sample = '../eval/gatekeep-pr-merge-state/samples/bypass-eligible-green-ci';
  assert.match(read(`${sample}/case.md`), /viewer_permission: MAINTAIN[^\n]*bypass_eligible: true/);
  assert.match(read(`${sample}/case.md`), /is_author: true/);
  assert.match(read(`${sample}/expected.md`), /squash-merge using your admin override/);
  const saved = JSON.parse(read('../eval/gatekeep-pr-merge-state/results/bypass-eligible-green-ci/candidate.json'));
  const parsed = parseCase(read(`${sample}/case.md`));
  assert.equal(saved.inputSha, inputSha(read('../eval/gatekeep-pr-merge-state/replay.md'), parsed.text, parsed.bundle));
  assert.equal(Object.keys(saved.outputs).length, 2);
  for (const [model, output] of Object.entries(saved.outputs)) {
    assert.equal(output.status, 'ok', model);
    assert.match(output.text, /gate=gatekeep-pr\/final/);
    assert.match(output.text, /merge - squash-merge using your admin override/);
    assert.match(output.text, /required(?: CI)? (?:checks|test check) passed|checks.*passed.*required/i);
    assert.doesNotMatch(output.text, /merge waits|Not offered: merge|^Evidence:|merge_state_status|reviewDecision|ruleset bypass authority/im);
    const judge = saved.judge[model];
    assert.equal(judge.factsSha, sha256(read(`${sample}/expected.md`)));
    assert.equal(judge.candidateOutputSha, sha256(output.text));
    for (const fact of ['f1', 'f2', 'f3', 'f4', 'f5']) assert.equal(judge.facts[fact].after, 'holds', `${model}/${fact}`);
  }
});

test('bypass eligibility preserves pending CI and every independent merge withhold', () => {
  const pre = section(loop, '### Merge preconditions\n', '### Compare-and-swap\n');
  for (const clause of [
    'keep every other precondition binding',
    '`mergeable == MERGEABLE`',
    '`merge_state_status` is not `BEHIND`',
    'no undispositioned failing check in the resolved set, no **binding** pending check',
    'no retained, unreviewed comment delta',
  ]) assert.ok(pre.includes(clause), clause);
  assert.match(decisionMenu, /\| `merge` \| Non-draft; viewer_permission WRITE, MAINTAIN or ADMIN; all `### Merge preconditions` hold \|/);
  assert.match(decisionMenu, /\| binding pending check \| Name the required check still running; watch only at delivery step 4/);
  const binding = section(brief, '**Binding classification**', '**Reviewer-check exception**');
  assert.match(binding, /`merge_state_status` is `BLOCKED`, `UNKNOWN` \(after the step-2 re-poll\), or `unreadable`/);
  assert.doesNotMatch(binding, /bypass_eligible/);
  assert.match(loop, /Use initial for repairable blockers or a pending-only CI withhold/);

  const root = '../eval/gatekeep-pr-merge-state';
  const sample = 'bypass-eligible-check-pending';
  const input = read(`${root}/samples/${sample}/case.md`);
  assert.match(input, /merge_state_status: BLOCKED, bypass_eligible: true/);
  assert.match(input, /name: e2e, kind: check_run, status: in_progress/);
  const saved = JSON.parse(read(`${root}/results/${sample}/candidate.json`));
  const parsed = parseCase(input);
  const target = JSON.parse(read(`${root}/target.json`));
  const skillFiles = target.skillFiles.filter(({ path }) => !parsed.drop.includes(path));
  assert.equal(saved.repoSha, '24038667b1645b736e9c03512632cda643eb1034');
  assert.equal(saved.skillSha, sha256(assemble({ ...target, skillFiles }, (path) => read(`../${path}`), parsed.bundle)));
  assert.equal(saved.inputSha, inputSha(read(`${root}/replay.md`), parsed.text, parsed.bundle));
  assert.equal(Object.keys(saved.outputs).length, 2);
  const expected = read(`${root}/samples/${sample}/expected.md`);
  for (const [model, output] of Object.entries(saved.outputs)) {
    assert.equal(output.status, 'ok', model);
    assert.match(output.text, /gate=gatekeep-pr\/initial/);
    assert.match(output.text, /e2e[^\n]*(?:pending|running|progress)|(?:pending|running)[^\n]*e2e|the required end-to-end check is still running/i);
    assert.doesNotMatch(output.text, /^Not offered:|^Evidence:|merge_state_status|reviewDecision/im);
    assert.doesNotMatch(output.text, /^\d+\. merge\b/m);
    assert.doesNotMatch(output.text, /ruleset bypass authority|bypass eligible|\badmin\b|blocked by GitHub/i);
    const judge = saved.judge[model];
    assert.equal(judge.factsSha, sha256(expected));
    assert.equal(judge.candidateOutputSha, sha256(output.text));
    for (const { id } of parseExpected(expected).facts) assert.equal(judge.facts[id].after, 'holds', `${model}/${id}`);
  }
});

test('false or unreadable bypass eligibility keeps BLOCKED fail-closed', () => {
  const gather = section(brief, '## Section A - Gatherer', '## Section B - Verifier');
  assert.match(gather, /false stays false; null, missing, non-boolean, or a failed\/error-bearing response becomes `unreadable`/);
  const pre = section(loop, '### Merge preconditions\n', '### Compare-and-swap\n');
  assert.match(pre, /For `BLOCKED`, require fresh `permissions.bypass_eligible == true`/);
  assert.match(loop, /Undispositionable BLOCKED without eligible bypass under Merge preconditions/);
  assert.match(decisionMenu, /BLOCKED with no eligible bypass and no local repair/);
  assert.match(findings, /With BLOCKED, no eligible bypass under `post-selection-loop.md` `### Merge preconditions`, and no dispositionable local repair/);
  assert.match(report, /Otherwise say GitHub blocks this actor from merging; never invent a named rule/);
  assert.match(report, /Keep `bypass_eligible` and its value in the digest's permissions only, including when answering `show evidence`/);
  assert.match(report, /explain their actual missing prerequisites in prose, not a separate omission line/);

  const root = '../eval/gatekeep-pr-merge-state';
  const sample = 'bound-viewer-green-ci';
  for (const [name, value] of [
    [sample, 'unreadable'],
    ['exempt-viewer-status-pending', 'false'],
    ['flip-after-update-branch', 'false'],
    ['live-checkrun-pending', 'false'],
    ['same-head-flip', 'false'],
    ['unknown-after-repoll', 'false'],
  ]) {
    const input = read(`${root}/samples/${name}/case.md`);
    assert.match(input, new RegExp(`permissions: \\{[^\\n]*bypass_eligible: ${value}`), name);
  }
  const saved = JSON.parse(read(`${root}/results/${sample}/candidate.json`));
  const parsed = parseCase(read(`${root}/samples/${sample}/case.md`));
  const target = JSON.parse(read(`${root}/target.json`));
  const skillFiles = target.skillFiles.filter(({ path }) => !parsed.drop.includes(path));
  assert.equal(saved.repoSha, '24038667b1645b736e9c03512632cda643eb1034');
  assert.equal(saved.skillSha, sha256(assemble({ ...target, skillFiles }, (path) => read(`../${path}`), parsed.bundle)));
  assert.equal(saved.inputSha, inputSha(read(`${root}/replay.md`), parsed.text, parsed.bundle));
  assert.equal(Object.keys(saved.outputs).length, 2);
  const expected = read(`${root}/samples/${sample}/expected.md`);
  for (const [model, output] of Object.entries(saved.outputs)) {
    assert.equal(output.status, 'ok', model);
    assert.match(output.text, /gate=gatekeep-pr\/obstacle/);
    assert.match(output.text, /GitHub[^\n]*(?:blocks|blocked)[^\n]*(?:merg|actor)|GitHub[^\n]*merg[^\n]*blocked/i);
    assert.doesNotMatch(output.text, /^Not offered:|^Evidence:|merge_state_status|reviewDecision/im);
    assert.doesNotMatch(output.text, /^\d+\. (?:merge|wait|approve)\b/m);
    assert.doesNotMatch(output.text, /bypass_eligible|ruleset bypass authority|bypass eligible|\badmin\b/i);
    const judge = saved.judge[model];
    assert.equal(judge.factsSha, sha256(expected));
    assert.equal(judge.candidateOutputSha, sha256(output.text));
    for (const { id } of parseExpected(expected).facts) assert.equal(judge.facts[id].after, 'holds', `${model}/${id}`);
  }
});

test('sync.md re-gather resolves pending checks through the binding rule', () => {
  assert.match(sync, /Write out the dispatch as the harness call[\s\S]*subagent\(\{ agent: "implementer", context: "fresh", async: false, cwd: <worktree> \}\)[\s\S]*name each conflicted file by path in the task text[\s\S]*Write out the dispatch as the harness call[\s\S]*subagent\(\{ agent: "wave-reviewer", context: "fresh", async: false, cwd: <worktree> \}\)/);
  assert.match(sync, /a binding check still pending routes to the initial or terminal template/);
});

test('post-selection-loop.md refreshes merge state before every menu and binds the preconditions to it', () => {
  const refresh = section(loop, '### Pre-menu refresh\n', '### Wait course\n');
  assert.match(refresh, /gh pr view <N> --json headRefOid,state,mergeable,mergeStateStatus,reviewDecision,statusCheckRollup[^`\n]*,reviewRequests/);
  assert.match(refresh, /replace.*pr\.review_requests.*re-derive `viewer\.role`/);
  assert.match(refresh, /gh run list -R <owner>\/<repo> -c <headRefOid> --json databaseId,status,conclusion,workflowName,url/);
  assert.match(refresh, /merge state not refreshed \(<reason>\)/);
  assert.match(refresh, /never mints `C#` rows/);
  assert.match(refresh, /classifies every pending check as binding/);
  const pre = section(loop, '### Merge preconditions\n', '### Compare-and-swap\n');
  assert.match(pre, /after any head move, re-resolve evidence through `\.\.\/verification-brief\.md` Section B's Evidence resolution table for the new head only/);
  assert.match(pre, /a check run or local result bound to any other head is not an input/);
  assert.doesNotMatch(pre, /When no check run is bound to the new head/);
  assert.match(pre, /no \*\*binding\*\* pending check/);
  assert.match(pre, /`merge_state_status` is not `UNKNOWN` or `unreadable`, and the pre-menu refresh succeeded/);
  assert.match(pre, /For `BLOCKED`, require fresh `permissions.bypass_eligible == true`; lift only this merge-state withhold/);
  assert.ok(!pre.includes('no pending required check'));
  assert.match(section(loop, '### Compare-and-swap\n', '### Fix wave\n'), /re-fetch `headRefOid`, `state`, `mergeable`, and `mergeStateStatus`/);
  assert.match(section(loop, '### Re-render\n', '### Pre-menu refresh\n'), /1\. Run the pre-menu refresh \(`### Pre-menu refresh`\)/);
  assert.match(fixWave, /binding classification/);
  assert.match(fixWave, /runs the pre-menu refresh as `post-selection-loop\.md` `### Re-render` step 1/);
});

test('SKILL.md names the pre-menu refresh at step 5 and in the red flags', () => {
  assert.match(skill, /\| 5 Integrate \+ report \| `reference\/post-selection-loop.md` `### Pre-menu refresh`, then `reference\/findings.md`/);
  assert.match(skill, /\| 6 Menu \| `reference\/menus.md` \|/);
  assert.match(skill, /an unchanged head re-enters step 5 through `reference\/post-selection-loop.md` `### Pre-menu refresh`/);
  assert.match(skill, /or a binding pending check, or a merge-state withhold under `reference\/post-selection-loop.md` `### Merge preconditions`/);
  assert.match(skill, /A menu rendered without the pre-menu refresh - owner: `reference\/post-selection-loop.md` `### Pre-menu refresh`/);
  const gather = section(brief, '## Section A - Gatherer', '## Section B - Verifier');
  assert.match(gather, /written only from a `gh pr view` invocation that names `mergeStateStatus`/);
  assert.match(gather, /never from an ad hoc GraphQL query or `gh pr list`/);
  assert.match(gather, /gate never names which rule blocks/);
  assert.match(gather, /A non-`BLOCKED` value never approves a merge/);
  assert.ok(!skill.includes('pending required check'));
});

test('course state replaces grants and preserves immutable target and original intent', () => {
  assert.match(brief, /gh repo view <base-repository> --json nameWithOwner/);
  assert.match(loop, /gatekeep-state\.XXXXXX/);
  assert.match(loop, /first tracker task's name/);
  assert.match(loop, /Only the orchestrator records direct human selections/);
  assert.match(loop, /Native harness tool permissions remain in force/);
  assert.match(assessment, /original_intent/);
  assert.match(brief, /no_progress: \{ failed_prerequisite, observed_value, result_path \}\?/);
  assert.match(loop, /higher round cap is not permission to repeat/);
  assert.ok(loop.includes('stuck - no progress: <failed prerequisite>'));
  assert.match(loop, /^\| HEAD equals pre_wave_head with all payloads open, or scoped test unchanged-red after restore \| render per ### No-progress obstacle \|$/m);
  assert.match(fixWave, /scoped test fails[\s\S]*### No-progress obstacle/);
  assert.match(fixWave, /every payload returned `open`[\s\S]*### No-progress obstacle/);
  for (const token of ['consent.target', 'course: null | assess | deliver | deliver-nits', 'repair.rounds_used', 'repair.rounds_cap', 'repair.syncs_used', 'repair.syncs_cap', 'repair.poll_deadline', 'repair.wave', 'counted']) assert.ok(brief.includes(token), token);
  for (const text of [brief, loop, fixWave, findings, report, decisionMenu, menus, skill, assessment]) {
    assert.doesNotMatch(text, /consent\.(?:fix|merge_base|scope_at_grant)|revoke fix|revoke merge base|validated retained|held grant|named grant/i);
  }
  assert.match(loop, /stuck - run record unreadable/);
  assert.match(loop, /never reset `repair\.\*`/);
  assert.match(loop, /original_intent/);
  assert.match(loop, /live `baseRefName` against `consent.target.baseRefName`/);
  assert.match(loop, /never discovers or resumes a course/);
});

test('delivery has one fixed loop with ordered exits and cumulative budgets', () => {
  const next = section(loop, '### Next action\n', '### No-progress obstacle\n');
  for (const pattern of [/Under deliver or deliver-nits and no exit/, /CI-minted `P#`/, /deliver-nits/, /### Loop sync/, /## Evidence after push/, /### Wait course/, /### Re-render/, /### Exit check/]) assert.match(next, pattern);
  const exits = section(loop, '### Exit check\n', '### Loop sync\n');
  assert.ok(exits.indexOf('| readiness |') < exits.indexOf('| obstacle |'));
  assert.ok(exits.indexOf('| obstacle |') < exits.indexOf('| cap |'));
  for (const token of ['red twice without a source change', 'GitHub reports BLOCKED, no local repair applies', 'stuck - merge state unknown', 'stuck - refresh failed:', 'stuck - comment source review incomplete', 'stuck - CI pending past', 'stuck - workflow run awaiting approval', 'stuck - cannot push to', 'stuck - remote head moved', 'stuck - sync:', 'stuck - phase-tracker fix-round guard:', 'credentials', 'dirty', 'unreadable target', 'failed push']) assert.ok(exits.includes(token), token);
  assert.match(loop, /before every iteration and after every head, digest, or record change/);
  assert.match(fixWave, /2 x closureReview.maxFixRounds/);
  assert.match(fixWave, /2 x 5/);
  assert.match(fixWave, /counted true and counted_head/);
  assert.match(fixWave, /per-pass checkpoint with round_start_head/);
  assert.match(fixWave, /preserve it on interrupted reconciliation/);
  assert.match(fixWave, /source-changing commit/);
  assert.match(loop, /extends neither cap/);
});

test('watch belongs only to delivery and renews only on own push', () => {
  assert.doesNotMatch(loop, /sleep 30|every 30 s/);
  assert.doesNotMatch(fixWave, /every 30 seconds|poll the pushed head/);
  const refresh = section(loop, '### Pre-menu refresh\n', '### Wait course\n');
  assert.match(refresh, /never starts an independent watch/);
  assert.doesNotMatch(refresh, /Blockers are empty|wait.*row 1/);
  const wait = section(loop, '### Wait course\n', '### Output done-check\n');
  assert.match(wait, /only the gate's own push renews an existing window automatically/);
  assert.match(wait, /Base movement, refresh, repeated entry, or unrelated head\/body\/check changes never renew/);
  assert.match(wait, /Immediately after record validation, evaluate the last helper result and retained no-progress checkpoint through `### Exit check` before minting a deadline or watching binding pending CI/);
  assert.match(wait, /Admit the watch with a retained CI `P#` only when its authorized re-run is in progress and that CI result is the sole remaining blocker/);
  assert.match(wait, /do not dispatch another repair while awaiting that result/);
  assert.doesNotMatch(loop, /admit the watch only with no open blocker/);
  assert.match(wait, /never let an open evidence-dependent blocker \(a blocker whose closure depends on CI evidence\) disable the step-4 watch/);
  assert.match(loop, /unchanged `open - needs <X>` prerequisite, exit `stuck - needs <X>` immediately/);
  assert.match(wait, /gh pr checks <N> -R <base-owner>\/<base-repo> --watch/);
});

test('three archetypes own menus and typed dispatch is not row authority', () => {
  const root = new URL('../skills/gatekeep-pr/', import.meta.url);
  assert.equal(existsSync(new URL('reference/decision-menu.md', root)), false);
  for (const path of ['SKILL.md', 'verification-brief.md', 'review-baseline.md', ...readdirSync(new URL('reference/', root)).filter(p => p.endsWith('.md')).map(p => `reference/${p}`)]) {
    assert.doesNotMatch(readFileSync(new URL(path, root), 'utf8'), /decision-menu/, path);
  }
  assert.deepEqual([...menus.matchAll(/^## (.+)$/gm)].map(m => m[1]), ['States', 'Recommendation', 'action', 'final', 'post', 'Missing rows', 'batch summary']);
  const states = section(menus, '## States\n', '## Recommendation\n');
  for (const [archetype, ids] of Object.entries({ action: ['initial', 'obstacle', 'contract-exception'], final: ['final', 'assess-terminal'], post: ['own-merge', 'approved', 'closed-pr', 'merge-queued'] })) {
    for (const id of ids) assert.match(states, new RegExp(`^\\| ${id} \\|[^\\n]*\\| ${archetype} \\|[^\\n]*Start the message with \x60gauntlet: gate=gatekeep-pr/${id}\x60`, 'm'));
  }
  const nonterminal = section(menus, '## action\n', '## post\n');
  for (const verb of ['wait', 'merge base', 'update branch', 'show evidence']) assert.doesNotMatch(nonterminal, new RegExp('^(?:- |\\| )`'+verb+'`', 'm'));
  assert.match(menus, /Under deliver, render no menu before an exit except contract exception/);
  assert.match(menus, /add exactly `2 x maxFixRounds` to both caps/);
  assert.match(loop, /every other non-numeric string is a change request/);
  assert.match(loop, /including typed `deliver`/);
  assert.match(menus, /Render every menu in full: the standing sentence, every available row as `<n>\. <verb> - <consequence>`, then the hint/);
  assert.match(menus, /Quote a numeric pick only after the rendered menu/);
  assert.match(menus, /Never narrate or summarize a menu/);
  assert.match(menus, /approved_head/);
  assert.match(menus, /Move the recommended action to row 1 before numbering every menu, including child and batch menus/);
  assert.match(menus, /Append ` recommended=1` to each gate line/);
  assert.match(menus, /Keep non-recommended stop last/);
  assert.doesNotMatch(menus, /recommended=<n>|stop not last|[Kk]eep stop last|Put stop last/);
  assert.match(skill, /a recommendation not on row 1/);
  for (const text of [loop, batch]) assert.doesNotMatch(text, /keep stop last|and stop last/);
  for (const row of menus.matchAll(/^(\d+)\. .*\[recommended\].*$/gm)) assert.equal(row[1], '1');
  for (const gate of menus.matchAll(/^gauntlet: gate=gatekeep-pr\/\S+ recommended=(\d+)$/gm)) assert.equal(gate[1], '1');
  const replay = JSON.parse(read('../eval/gatekeep-pr/results/gate-line-first/candidate.json'));
  assert.ok(Object.keys(replay.outputs).length > 0);
  for (const [model, output] of Object.entries(replay.outputs)) {
    assert.equal(output.status, 'ok', model);
    assert.match(output.text, /^gauntlet: gate=gatekeep-pr\/obstacle recommended=1\r?\n/);
    assert.match(output.text, /^1\. .*\bstop\b.*\[recommended\]/m);
    assert.equal([...output.text.matchAll(/\[recommended\]/g)].length, 1);
    for (const fact of ['first-line', 'gate-first']) assert.equal(replay.judge[model].facts[fact].after, 'holds', `${model}: ${fact}`);
  }
  assert.match(menus, /For a recovered `CONFLICTING` child, offer only safe `retry` and `stop`/);
  assert.match(batch, /conflicts through `menus.md` `## batch summary`'s recovered CONFLICTING template/);
  assert.match(menus, /settle without another menu/);
  assert.match(loop, /continue after a failed step without retry/);
  assert.match(loop, /After all picked steps finish, end through Teardown without another gatekeep-pr menu/);
  assert.match(loop, /Retain the body files of unrun or failed posts and name them/);
  assert.match(section(menus, '## final\n', '## post\n'), /Keep the resolved source, head, check results and merge state under show evidence, not a report line or hint parenthetical/);
  for (const redFlag of ['validated action-scoped retained authority', 'without `fix` while an open blocker exists', 'A CI wait while a blocker is open', 'cleanup` rendered on an ordinary open-PR menu', 'An ordinary open-PR `stop` offers teardown', 'Blockers are empty', 'Count file, description-only, and conflict-only attempts under the same cap', 'a grant never raises the cap', '## Consent table', '## Overlays', '## Conflicts']) {
    for (const text of [skill, loop, fixWave, brief, decisionMenu, menus, findings, report, sync]) assert.ok(!text.includes(redFlag), redFlag);
  }
});


test('assess and terminal nit paths retain bounded write authority', () => {
  assert.match(decisionMenu, /^\| `approve` \| viewer\.is_author false, zero blockers, non-draft \| Approve; persist approved_head only after success\. \|$/m);
  assert.match(loop, /^\| action_required \| `viewer\.is_author` true and `viewer_permission` at least `WRITE`: approve workflow run then watch under the course;/m);
  assert.match(decisionMenu, /zero blockers post nothing/);
  assert.match(decisionMenu, /one head-pinned review through `post-selection-loop.md` `### Fix wave`/);
  assert.match(loop, /pulls\/<N>\/reviews -f commit_id=<assessed headRefOid> -f event=<event>/);
  assert.match(loop, /`COMMENT` for `viewer\.is_author` true, `REQUEST_CHANGES` otherwise/);
  assert.match(decisionMenu, /without repair or sync/);
  assert.match(decisionMenu, /keep C# replies behind reply/);
  assert.match(section(menus, '## States\n', '## Recommendation\n'), /\| assess-terminal \| Assess completed \| final \| merge, fix nits \|/);
  assert.match(loop, /exactly one complete D3 iteration/);
  assert.match(loop, /without changing course/);
  assert.match(loop, /Initialize missing accounting/);
  const contract = section(loop, '### Contract decision\n', '### Next action\n');
  assert.match(contract, /owning amendment process; update the stored baseline[^\n]*only after it completes/);
  assert.match(contract, /omit only the rejected payload[^\n]*preserve every independent blocker/);
});

test('loop sync preserves rewrite lease recovery and independent contributor closure', () => {
  const syncBody = section(fixWave, '## Sync\n', '## Wave\n');
  for (const pattern of [/git -C <worktree> rev-parse HEAD/, /author_is_bot false/, /git rev-list --merges/, /sync: merged base - head contains merge commits/, /git range-diff/, /git show --remerge-diff/, /GIT_EDITOR=true git rebase --continue/, /rebase --abort while in progress/, /HEAD == pre_head/, /repair.syncs_used/, /P#\/L# closure IDs/]) assert.match(syncBody, pattern);
  assert.match(fixWave, /Mark a finding resolved only from a `resolved` closure line/);
  assert.match(loop, /scope block including original_intent/);
  assert.match(brief, /sync: null \| \{ pre_head, expected_remote_head \}/);
  assert.match(syncBody, /repair\.wave\.sync\.pre_head/);
  assert.match(syncBody, /repair\.wave\.sync\.expected_remote_head/);
  assert.match(syncBody, /before sync and again before push/);
  assert.match(syncBody, /Preserve expected_remote_head through local repair and rebase/);
  assert.match(syncBody, /remote A, local repair B, then rebase C: lease A, restore B/);
  assert.match(syncBody, /mismatch must never replace A/);
  assert.match(syncBody, /--force-with-lease=<head_ref>:<expected_remote_head>/);
  assert.doesNotMatch(syncBody, /--force-with-lease=<head_ref>:<pre_head>/);
  assert.match(section(fixWave, '## Evidence after push\n'), /Only for an entry-time `rebased locally` record, rewrite that entry sync record to plain rebased form after a successful lease push/);
  assert.match(section(fixWave, '## Evidence after push\n'), /For loop rewrites, settle only repair\.wave\.sync through Sync's successful push\/rebinding rule; leave the entry sync record unchanged/);
  for (const consumer of [section(fixWave, '## Evidence after push\n'), section(loop, '### Compare-and-swap\n', '### Fix wave\n'), section(loop, '### Pre-menu refresh\n', '### Wait course\n')]) {
    assert.match(consumer, /repair\.wave\.sync\.expected_remote_head/);
    assert.match(consumer, /repair\.wave\.sync\.pre_head/);
    assert.match(consumer, /entry.*pre_head/);
  }
});

test('terminal nit selection blocks readiness until its single complete iteration settles', () => {
  assert.match(brief, /action: fix-nits/);
  const next = section(loop, '### Next action\n', '### Exit check\n');
  assert.match(next, /Before invoking the entry Exit check, persist `repair.wave.action: fix-nits`/);
  assert.match(next, /selected_ids and payload snapshots/);
  assert.match(next, /Under deliver or deliver-nits or an outstanding terminal nit selection/);
  const exits = section(loop, '### Exit check\n', '### Loop sync\n');
  assert.match(exits, /no outstanding terminal fix-nits selection/);
  assert.match(next, /course unset or deliver/);
  assert.match(next, /release the one-shot hold only after selected work and reconciliation complete/);
  assert.match(next, /Obstacles and caps retain the checkpoint/);
  assert.match(section(fixWave, '## Wave\n', '## Review before push\n'), /For `action: fix-nits`, retain repair\.wave including its action and selected payloads through watch and own-push re-review; clear it only through `post-selection-loop\.md` `### Next action`'s one-shot completion rule/);
  assert.match(section(loop, '### Fix wave\n', '### Merge course\n'), /recorded selected_ids and payload snapshots/);
});

test('non-final stop removes only owned tracked-clean pushed trees without terminal consequences', () => {
  const stop = section(cleanup, '## Non-final stop\n');
  assert.match(stop, /discarding those commits is a separate explicit human decision - never a consequence of `stop`/);
  for (const pattern of [
    /initial, assess-terminal, obstacle, or contract-exception/,
    /git -C <worktree\.path> reset --hard <pre_head>.*HEAD == <pre_head>.*clean tree/,
    /created and reused/i, /not the primary/, /status --porcelain --untracked-files=no/,
    /merge-base --is-ancestor HEAD <last pushed head>/,
    /repair.wave.pushed_head.*headRefOid/, /realpath/, /home:.*<name>/,
    /unpushed commits <shas>/, /uncommitted changes/, /outside configured home/, /ambiguous home match/,
    /worktree: kept - <reason> at <path>/, /untracked.*deleted/i,
    /worktree.destroy/, /git -C <primary> worktree remove --force/, /git -C <primary> worktree prune/, /worktree: done/,
    /failed.*keeps the tree.*never fall back/, /Keep the primary/,
    /Never run terminal steps 2-4/, /branch deletion, base pull, or `## cleanup` overrides/,
    /### Teardown/,
  ]) assert.match(stop, pattern);
});

test('batch courses preserve two budgets and parent lifecycle ownership', () => {
  assert.match(batch, /Supply mode `report` or `execute`/);
  assert.doesNotMatch(batch, /mode `assess`|assess and execute task|`assess` with ordinary|grant grammar|Retained fix\/merge-base grants/);
  assert.match(batch, /Only the first course pick may resolve.*initial D4 allowance/);
  assert.match(batch, /re-dispatch never reinitializes usage or caps/);
  assert.match(batch, /Record direct picks as the child's `course` or terminal selection/);
  assert.match(batch, /under `deliver`.*readiness, obstacle, or cap.*`REPORT`/);
  assert.match(batch, /child's template from `menus.md`/);
  assert.match(batch, /after all children finish, never on a live child's tree/);
  assert.match(batch, /non-final.*`cleanup.md` `## Non-final stop`/);
  assert.match(gatekeeper, /In `report`/);
  assert.match(gatekeeper, /under `deliver`.*readiness, obstacle, or cap.*REPORT/);
  assert.match(gatekeeper, /course,.*repair.rounds_cap.*repair.syncs_cap/);
  assert.doesNotMatch(gatekeeper, /In `assess`|retained grants|next-action\/fix-wave/);
});

const discoverySamples = ['over-cap', 'single', 'zero', 'cc-multi', 'failed', 'under-cap'].map((suffix) => `no-arg-discovery-${suffix}`);
for (const sample of [...discoverySamples, 'role-line-requested']) {
  test(`discovery and role replay structure: ${sample}`, () => {
    const root = `../eval/gatekeep-pr/samples/${sample}`;
    const input = readOrEmpty(`${root}/case.md`);
    assert.match(input, /## Entry\n/);
    assert.match(input, /## Arguments\n/);
    const config = JSON.parse(read('../eval/gatekeep-pr/target.json'));
    const { bundle } = parseCase(input);
    const wanted = sample === 'role-line-requested' ? [] : ['skills/gatekeep-pr/reference/batch.md', ...(sample.endsWith('under-cap') ? ['agents/pr-gatekeeper.md'] : [])];
    assert.deepEqual(bundle, wanted);
    for (const path of bundle) assert.ok(!config.skillFiles.some((file) => file.path === path), `global-manifest duplicate: ${path}`);
    const facts = parseExpected(readOrEmpty(`${root}/expected.md`));
    assert.deepEqual(facts.facts.map((fact) => fact.id), sample === 'role-line-requested' ? ['r1', 'r2', 'r3', 'r4'] : ['f1']);
    assert.match(read('../eval/gatekeep-pr/replay.md'), /argument resolution with no PR token/);
  });
}
