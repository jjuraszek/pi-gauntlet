import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse } from 'yaml';
import { fileURLToPath } from 'node:url';
import { lintTarget } from '../eval/lib/lint.mjs';
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const main = () => read('skills/brainstorming/SKILL.md');

test('council applier is unpinned and carries the complete spec-only audit contract', () => {
  const text = read('agents/spec-council-applier.md');
  const [, yaml, body] = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.deepEqual(parse(yaml), {
    name: 'spec-council-applier',
    description: 'Applies a spec-council chair report to the spec under review and returns the audit. Dispatched by the roasting-the-spec skill; not for direct dispatch.',
    tools: 'read, grep, find, ls, bash, edit, write',
    defaultContext: 'fresh',
    inheritProjectContext: true,
    inheritSkills: false,
    completionGuard: false,
    systemPromptMode: 'replace',
  });
  assert.doesNotMatch(body, /\/skill:|\]\([^)]*reference\//);
  assert.ok(body.indexOf('Applied:') < body.indexOf('## Procedure'), 'parsed output contract precedes procedure');
  for (const marker of [
    'exactly one disposition per cluster', 'Read the chair file', 'on scope grounds',
    'Human input (verbatim; off-limits for over-spec)', '## External context', 'ticket reference',
    'DOCUMENTATION_IMPACT_GUIDELINE', 'Preserve the supplied not-an-external-reference sentence verbatim',
    'only to recover the cited probe of a grounded cluster', 'Never reopen adjudication',
    'clusters that assert data shape, ordering, or semantics', 'untagged cluster as hypothesis',
    'one `rg --max-count` under `timeout 30`', 'docs, config, and script directories',
    'at most one bounded read-only check', 'project script whose source you read', 'apply as fact',
    'not found, inconclusive, timed out, contradicted', 'one entry per artifact',
    'every affected edit', 'obtain-hint', 'first plan task that obtains the artifact',
    "brainstorming's amendment path", 'Never fetch, build, or run the proposed change',
    'assert nothing about data', '-> user supplies at gate',
    'every acceptance-criteria or testing-approach line that exists only for it',
    '-> cut (was adds: M files / N tests / K ACs)', '-> shrunk to <replacement> (was adds: ...)',
    'never cut, shrink, flag, or edit it', 'Edit only the supplied spec path',
    'Coverage:', 'Applied:', 'Deferred:', 'Rejected:', 'raised-by: [...]',
    '(grounded: <member probe>)', '(probed: <check> - <result>)', '-> open question (',
    'Applied: none', 'Deferred: none', 'Rejected: none', 'no acknowledgment or second report',
  ]) assert.ok(body.includes(marker), marker);
});
test('brainstorming is explicitly requested and hidden from model advertisement', () => {
  const frontmatter = main().match(/^---\n([\s\S]*?)\n---/)[1];
  assert.match(frontmatter, /^disable-model-invocation: true$/m);
  assert.match(frontmatter, /Use only when the user explicitly requests brainstorming or selects a handoff into it[.;]/);
});

test('consent precedes reset and the 13 checkpoints retain their order', () => {
  const text = main();
  assert.ok(text.indexOf('## Entry consent') < text.indexOf('phase_tracker({ action: "reset" })'));
  assert.match(text, /recommendations are not consent: wait for explicit choice before reset or worktree creation/);
  assert.match(text, /already loaded or identified by an available route/);
  assert.match(text, /Continue restored state and amend\/redraw at their named steps/);
  const checkpoints = [...text.matchAll(/^(\d+)\. \*\*/gm)].map((m) => Number(m[1]));
  assert.deepEqual(checkpoints, Array.from({ length: 13 }, (_, i) => i + 1));
  assert.match(text, /resume at checklist step 4 with the approved spec as the draft \(steps 2-3 skipped\)/);
  const gather = text.match(/^3\. .*/m)[0];
  assert.match(gather, /read \[Ticket Handling\]\(#ticket-handling\), then follow \[`gatherer.md`\]/);
  assert.match(text, /Read \[Ticket Handling\]\(reference\/ticket-acceptance.md\) at first use - before gathering context, even with no ticket/);
  assert.match(text, /a restored session \(`gauntlet-resume` routes there\) loads it once; a same-session redraw or a second brainstorm in one session reuses the content already in context/);
  assert.match(text, /Read \[Spec Self-Review\].*before spec-writing or restored step 8/);
  assert.match(text, /unreadable -> stop with a blocking error, never reconstruct from memory/);
});

test('restored and redraw entry load the ticket contract before questionary or lint', () => {
  const text = main();
  for (const [step, action] of [[4, 'Understand the idea'], [8, 'Spec self-review']]) {
    const checkpoint = text.match(new RegExp(`^${step}\\. .*`, 'm'))[0];
    assert.match(checkpoint, /if `reference\/ticket-acceptance.md` is not already in context this session \(restored entry, or a redraw after a fresh start\), read \[Ticket Handling\]\(#ticket-handling\) before the rest of this step/);
    assert.ok(checkpoint.indexOf('read [Ticket Handling]') < checkpoint.indexOf(step === 4 ? 'see [Understand' : 'run the inline'), action);
  }
});

test('moved ticket contract retains verbatim schema and all no-ticket cases', () => {
  const text = read('skills/brainstorming/reference/ticket-acceptance.md');
  for (const marker of ['every top-level checkbox row', 'Post-deployment housekeeping', 'all written `- [ ]`', 'in-scope', 'deviates: <why>', 'deferred: <where>', 'venue: <env> - <observation>', 'elsewhere: <repo>', 'Cut question', 'Scope cuts:', 'none - no ticket', 'none - ticket has no acceptance criteria', 'none - ticket not fetched (<reason>)', 'Never author acceptance criteria', 'Drafted from the design']) assert.ok(text.includes(marker), marker);
  assert.ok(text.includes('Replace `<name>` with the supplied unmatched group heading verbatim'));
  assert.doesNotMatch(text, /only when it changes what the user observes/);
  assert.doesNotMatch(text, /operates without it/);
  assert.match(text, /\*\*Write the section in every spec\*\*, after `## Problem`/);
  assert.match(text, /\.\.\/SKILL.md#amending-an-approved-spec/);
});

test('drafted contract preserves outcomes, legal bodies, and post-council recovery', () => {
  const ticket = read('skills/brainstorming/reference/ticket-acceptance.md');
  for (const marker of ['Drafted from the design, no ticket rows:', 'Drafted from the design, ticket <ref> has no acceptance criteria:', 'Pasted rows are ticket rows', 'Never append `## Spec contract`', 'Wishful', 'Tautological', 'Unspecified-but-binding', 'External-input', 'Post-deployment', 'never invent', 'binary', 'before writing', 'no valid row', 'explicit scope decision', '## Out of scope']) assert.ok(ticket.includes(marker), marker);
  const draftedCut = ticket.slice(ticket.indexOf('**Drafted cut question.**'));
  for (const marker of ['A) in-scope - <reading>', 'B) deviates: <why>', 'C) deferred: <where>', 'omit D', 'Recommend A', 'full question']) assert.ok(draftedCut.includes(marker), marker);
  const finalization = read('skills/brainstorming/reference/spec-finalization.md');
  const predicate = finalization.slice(finalization.indexOf('- **Ticket contract present.**'), finalization.indexOf('- **Scope check.**'));
  for (const marker of ['exactly three forms', 'Ticket <ref>', 'drafted provenance', 'at least one `- [ ]` row', 'disposition on every row', 'none - ticket not fetched (<reason>)', 'Reject `none - no ticket` and `none - ticket has no acceptance criteria`']) assert.ok(predicate.includes(marker), marker);
  const recovery = finalization.slice(finalization.indexOf('After it returns'), finalization.indexOf('## Spec Council'));
  for (const marker of ['whole-section predicate', 'zero rows', 'applied Design', 'main loop', 'clarification', 'Drafted AC repair: restored acceptance rows from the applied Design.']) assert.ok(recovery.includes(marker), marker);
  for (const marker of ['approved two-round design plus the original prompt', 'before the full replacement', 'never from the summarizer', 'reused verbatim', 'recommitted section', 're-drafted section', 'Exclude drafted rows from']) assert.ok(finalization.includes(marker), marker);
});

test('tree-wide integrity splits only drafted rows using complete Design families', () => {
  const text = read('skills/brainstorming/reference/ticket-acceptance.md');
  const row = text.split('\n').find((line) => line.startsWith('| Tree-wide |'));
  assert.ok(row, 'Tree-wide integrity class exists');
  for (const marker of ['drafted', 'zero/no findings', 'one or several kinds', 'tree or set', 'explicit complete enumeration in Design', 'one row per family', "family's own observable", 'every outcome', 'absent, partial, or unrelated', 'stop before writing', 'quote the row', 'request the complete enumeration in Design']) assert.ok(row.includes(marker), marker);
  for (const marker of ['from the human or Design', 'never invent the list in question options or recommendations or infer completion of a partial list']) assert.ok(row.includes(marker), marker);
  assert.ok(text.includes('ticket row of this shape stays one verbatim row'));
  assert.ok(text.includes('human ticket repair through `/skill:shape-ticket` before approval'));
});

test('drafted requirements are protected in each actual critique task and the applier body', () => {
  const council = read('skills/roasting-the-spec/SKILL.md');
  const starts = ['task: "Problem statement: <the problem', 'task: "Problem statement: <paste>', 'task: "Problem statement: <same problem'];
  const tasks = starts.map((start) => {
    const at = council.indexOf(start);
    assert.ok(at >= 0, start);
    return council.slice(at, council.indexOf('\n```', at));
  });
  tasks.push(read('agents/spec-council-applier.md').split('\n---\n')[1]);
  const finalization = read('skills/brainstorming/reference/spec-finalization.md');
  const worker = finalization.match(/subagent\(\{ agent: "worker",[\s\S]*?task:\n([\s\S]*?)\n```/);
  assert.ok(worker, 'actual worker dispatch task');
  tasks.push(worker[1]);
  for (const task of tasks) {
    for (const marker of ['Drafted rows are spec requirements', 'integrity', 'Design commitment', "user's scope-decision procedure", 'quoting the row alone', 'never replace the section with `none`', 'Never draft new rows']) assert.ok(task.includes(marker), marker);
  }
  for (const marker of ['pre-approval rewrites only for integrity', 'Delete a drafted row only after its Design commitment is cut', 'Preserve every committed outcome', 'clarification', 'never invent']) assert.ok(worker[1].includes(marker), `worker: ${marker}`);
});

test('approved drafted row identity routes to redraw before grants or disposition reconciliation', () => {
  for (const path of ['skills/brainstorming/SKILL.md', 'skills/brainstorming/reference/amendment-surface.md']) {
    const text = read(path);
    for (const marker of ['approved drafted acceptance-criteria row', 'its text, a row added, a row removed', 'at batch preparation', 'before any standing grant', 're-draft from the new design', 'full gate', 'never a disposition amendment', 'disposition-only change to such a row', 'keeps the cut question', 'Apply an item the human has answered by letter or custom text as recorded.']) assert.ok(text.includes(marker), `${path}: ${marker}`);
  }
  assert.ok(read('skills/brainstorming/reference/amendment-surface.md').includes('Never auto-edit ticket or approved drafted AC row texts'));
});

test('gate template renders the Scope cuts line after the commit line', () => {
  const text = read('skills/brainstorming/reference/spec-finalization.md');
  assert.match(text, /Scope cuts: <row text, first 60 chars> - <disposition>; \.\.\. \| none/);
  const commitAt = text.indexOf('Spec written and committed to');
  const cutsAt = text.indexOf('Scope cuts: <row text');
  const draftedAt = text.indexOf('Drafted acceptance criteria (approval ratifies):');
  const councilAt = text.indexOf('Council: <A>');
  assert.ok(commitAt >= 0 && commitAt < cutsAt && cutsAt < draftedAt && draftedAt < councilAt);
});

test('finalization retains ordered write checks, verdict routing and dispatches', () => {
  const text = read('skills/brainstorming/reference/spec-finalization.md');
  const ordered = ['1. `Read` the draft in full', '2. Write the spec', '3. **Immediately after the write**', '4. **After the line-1 check**', '5. **After the second predecessor pass'];
  let previous = -1;
  for (const marker of ordered) { const position = text.indexOf(marker); assert.ok(position > previous, marker); previous = position; }
  assert.match(text, /Read all six bullets first/);
  assert.match(text, /first four are the inline \*\*lint\*\*/);
  assert.match(text, /last two are the \*\*critique pass\*\*, dispatched/);
  for (const marker of ['branch strictly on `verdict`', 'never infer the worker path from `malformed` alone', 'If `gauntlet_setting` is unavailable, stop and report', 'agent: "worker", context: "fresh", async: false', 'agent: "spec-summarizer", context: "fresh", async: false', 'outputMode: "file-only"', 'Human input (verbatim; off-limits for over-spec)', 'ticket AC snapshot', 'passes no `model:`']) assert.ok(text.includes(marker), marker);
  assert.match(text, /relative to this loaded reference as one absolute/);
  assert.match(text, /portable citation `reference\/documentation-impact.md`/);
});

test('summary faults, partial coverage, commit and revisions retain their routes', () => {
  const text = read('skills/brainstorming/reference/spec-finalization.md');
  for (const marker of ['This commit is **unconditional**', 'Coverage:', 'Applied:', 'Deferred:', 'Rejected:', 'under ~500 bytes', 'over ~45 KB', 'last content-producing tool call', 'returns 0 bytes', 'reports truncation', 'never paraphrase', 'rm "$SUMMARY_PATH"', 'fresh** temp path', 'invoke `/skill:writing-plans` on 1/2', 're-dispatch the summarizer or note the discrepancy']) assert.ok(text.includes(marker), marker);
  assert.ok(text.indexOf('Then commit the spec') < text.indexOf('1. **From the dispatch tool result'));
  assert.ok(text.indexOf('1. **From the dispatch tool result') < text.indexOf('2. **The `Read` itself'));
  for (const marker of ['Council: <A> applied, <D> deferred, <R> rejected', '3 - show council dispositions', 'add -- <spec path>', "commit -q -F - -- <spec path>", "<<'EOF'", 'git -C <abs worktree path> show -s --format=%b HEAD', 'a reply carrying `3` never grants', '-> reverted at gate', '`-m`, `-F <file>`']) assert.ok(text.includes(marker), marker);
  const template = text.slice(text.indexOf('<spec-only summary read back'), text.indexOf('Or tell me what to change in the spec'));
  for (const gone of ['Applied: [<severity>]', 'Deferred: [<severity>]', 'Rejected: [<severity>]', 'Coverage: <N> of <M> members reported;']) assert.ok(!template.includes(gone), `template still carries ${gone}`);
  assert.ok(template.includes('Council:'));
});

const walk = (dir) => readdirSync(new URL(`../${dir}/`, import.meta.url), { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(`${dir}/${e.name}`) : e.name.endsWith('.md') ? [`${dir}/${e.name}`] : []);

test('standing grants own boundaries while amendment aftermath and finish recipe survive', () => {
  const text = read('skills/brainstorming/reference/amendment-surface.md');
  for (const marker of ['continued onto the next physical line', 'nor a `> **Superseded by:**` banner line', 'redraws always stop', 'grant never satisfies the spec gate', 'a resume honors the line as written', '**Amend-grant:**', 'skip steps 2-4', 'scope changes included', 'plan_check', 'recommended: accept', 'rescope-into-spec', "printf 'grant: %s\\n'", 'commit -q -F - --', 'Never take a grant from commit history, a handoff brief, or the transcript']) assert.ok(text.includes(marker), marker);
  for (const marker of ['**Value decoding**', 'fund N fix rounds', 'N more fix rounds', '[1-9][0-9]*', 'budget-only', 'The budget is non-retroactive: rounds spent before the line was written do not count against or toward it.', 'never `accept` by default']) assert.ok(text.includes(marker), marker);
  assert.ok(!text.includes('fresh-session resume with no grant'), 'old boundary sentence removed');
  const legacyRow = text.split('\n').find((l) => l.startsWith('| Line absent (legacy spec)'));
  assert.ok(legacyRow && legacyRow.includes('plan_check'), 'legacy insertion row names plan_check');
  assert.match(main(), /plan_tracker\(\{ action: "clear" \}\).*phase_tracker\(\{ action: "reset" \}\).*phase_tracker\(\{ action: "start", phase: "brainstorm" \}\)/);
});

test('no skill records the grant as a commit trailer', () => {
  for (const file of walk('skills')) assert.ok(!read(file).includes('--trailer "Amend-grant'), file);
});

test('spec-finalization writes the grant line and persists approval-time grants in the spec commit', () => {
  const text = read('skills/brainstorming/reference/spec-finalization.md');
  for (const marker of ['**Amend-grant:** none', 'The `**Amend-grant:**` header line is flow machinery owned by the brainstorming gate; never cut, shrink, flag, or edit it.', 'commit --amend --no-edit -q', 'git -C <abs worktree path> add -- <spec path>', 'show HEAD:<spec path>']) assert.ok(text.includes(marker), marker);
  assert.ok(text.indexOf('On approval') < text.indexOf('commit --amend --no-edit -q'), 'amend after On approval');
  for (const marker of ['2; fund 3 fix rounds', '2, fund 3 fix rounds', 'Decode before', 'token alone', 'malformed N']) assert.ok(text.includes(marker), marker);
  const hint = 'Add "; fund N fix rounds" (or "N more fix rounds") to 1, 2, 4, or 5 to fund N extra attempts per stagnant loop row or N implement fix rounds past the escalated waves round.';
  assert.match(text, /Decode before `edit` or `--amend`/);
  assert.ok(text.indexOf('run Value decoding') < text.indexOf('On every approval'), 'decode before approval persistence');
  assert.ok(text.indexOf(hint) > text.indexOf('3 - show council dispositions:'));
  assert.ok(text.indexOf(hint) < text.indexOf('Or tell me what to change'));
  assert.ok(!text.includes('--trailer'), 'trailer step removed');
});

test('roasting-the-spec members, chair and applier preserve the grant line', () => {
  const text = read('skills/roasting-the-spec/SKILL.md');
  const sentence = 'The `**Amend-grant:**` header line is flow machinery owned by the brainstorming gate; never cut, shrink, flag, or edit it.';
  assert.equal(text.split(sentence).length - 1, 3, 'preserve sentence in member, chair and applier tasks');
});

test('council file boundaries, applier rollback and ordered handoff are explicit', () => {
  const text = read('skills/roasting-the-spec/SKILL.md');
  const description = parse(text.match(/^---\n([\s\S]*?)\n---/)[1]).description;
  assert.match(description, /fresh-context applier executor/);
  const overview = text.slice(text.indexOf('## Overview'), text.indexOf('## Hard constraint'));
  assert.match(overview, /Dispatch a fresh-context \*\*applier\*\* inheriting the main loop's model and thinking/);
  const member = text.slice(text.indexOf('tasks: members.map'), text.indexOf('The `Human input'));
  assert.match(member, /output: [^\n]+,\n    outputMode: "file-only"/);
  const chair = text.slice(text.indexOf('agent: "spec-council-synthesizer"'), text.indexOf('### 3'));
  assert.match(chair, /output: "<tmpdir>\/chair.md",\n  outputMode: "file-only"/);
  assert.doesNotMatch(chair, /reads:|injects their contents/);
  for (const marker of ['usableMemberPaths.join', 'non-empty', '^consensus:', '^lean:', 'same model', 'inherited model']) assert.ok(chair.includes(marker), marker);
  const applier = text.slice(text.indexOf('agent: "spec-council-applier"'), text.indexOf('\n```', text.indexOf('agent: "spec-council-applier"')));
  for (const marker of ['async: false', 'cwd: "<abs worktree path>"', 'needsAttentionAfterMs: 300000, inFlightSilenceCeilingMs: 600000, inFlightSilenceKillMs: 900000', 'Human input (verbatim; off-limits for over-spec)', 'External context fetched during brainstorming:', 'ticket reference + body/comments', 'none', 'usableMemberPaths.join']) assert.ok(applier.includes(marker), marker);
  assert.doesNotMatch(applier, /\b(?:model|output|reads):/);
  for (const marker of ['cp <spec> <tmpdir>/spec.before.md', 'git -C <wt> status --porcelain --untracked-files=all > <tmpdir>/status.before', '^Applied:', '^Deferred:', '^Rejected:', "grep -c 'raised-by:'", "grep -Ec '^- \\[(blocker|major|minor)\\]'", 'restore before retry', 'Second failure', 'restore again', 'zero', 'audit.md', 'already-dirty paths', 'accepted gap', 'checkout --', 'reverted applier edit outside the spec:']) assert.ok(text.includes(marker), marker);
  const after = text.slice(text.indexOf('### 4'));
  assert.ok(after.includes('git -C <wt> status --porcelain --untracked-files=all'));
  assert.equal([...text.matchAll(/status --porcelain/g)].length, 2);
  assert.equal([...text.matchAll(/status --porcelain --untracked-files=all/g)].length, 2, 'both snapshots enumerate nested untracked files');
  for (const marker of ['abs worktree path>/<path>', 'rm -- "<abs worktree path>/<path>"', 'complete absolute path', 'Paths in the before-set are never touched']) assert.ok(after.includes(marker), marker);
  assert.doesNotMatch(after, /`rm -- <path>`/);
  let previous = -1;
  for (const marker of ['First `read` the spec', 'status --porcelain', 'placeholder scan', 'predicate', 'rm -rf', 'Return the audit verbatim']) { const at = after.indexOf(marker); assert.ok(at > previous, marker); previous = at; }
  assert.ok(!text.includes('clusters that assert data shape, ordering, or semantics'));
  assert.ok(!text.includes('Upstream nonzero/save-error exception'));
});

test('chair input paths and output destination are factual corrections and ticket chair stays inline', () => {
  const chair = read('agents/spec-council-synthesizer.md');
  assert.deepEqual(parse(chair.match(/^---\n([\s\S]*?)\n---/)[1]), { name: 'spec-council-synthesizer', description: 'Neutral chair that consolidates and adjudicates spec-council member critiques into a single ranked, conflict-resolved report. Dispatched by the roasting-the-spec or shape-ticket skills; not for direct dispatch.', tools: 'read, grep, find, ls, bash', thinking: 'xhigh', defaultContext: 'fresh', inheritProjectContext: true, inheritSkills: false, completionGuard: false, systemPromptMode: 'replace' });
  for (const marker of ['**Output:**', 'entire identical report', 'acknowledgment or partial', 'grounded|hypothesis:', 'lean:', 'consensus:', 'clusters:', 'resolved:']) assert.ok(chair.includes(marker), marker);
  assert.ok(chair.includes('Read the member critique files directly from the explicit paths supplied in your task.'));
  assert.doesNotMatch(chair, /already injected into your context via|(?:injected|injection)[^.\n]*`reads`|`reads`[^.\n]*(?:injected|injection)/i);
  const ticket = read('skills/shape-ticket/SKILL.md');
  const item = ticket.slice(ticket.indexOf('2. **Dispatch shape**'), ticket.indexOf('3. **Effort:'));
  assert.ok(item.includes('outputMode: "file-only"'));
  assert.doesNotMatch(item, /via\s+`reads`|(?:injects|injected|injection)[^.\n]*(?:member|critique|contents)|(?:member|critique|contents)[^.\n]*(?:injects|injected|injection)/i);
  for (const marker of ['every member task and targeted retry', 'inline', 'explicit usable member paths']) assert.ok(item.includes(marker), marker);
  for (const marker of [':low', 'split-axis:', 'parent scans', 'Roast failure never blocks the run']) assert.ok(ticket.includes(marker), marker);
  assert.ok(!ticket.includes('spec-council-applier'));
});

test('gauntlet-resume checks the grant field before dispatch and announces it after restore', () => {
  const text = read('skills/gauntlet-resume/SKILL.md');
  for (const marker of ['continued onto the next physical line', '6. **Grant field.**', 'Standing grant active: <sentence>', 'No standing grant.', 'entry checks 1-6']) assert.ok(text.includes(marker), marker);
  assert.ok(text.includes('## Dispatch') && text.indexOf('**Amend-grant:**') < text.indexOf('## Dispatch'), 'Amend-grant check precedes Dispatch');
  assert.ok(text.includes('## Post-restore continuation') && text.indexOf('## Post-restore continuation') < text.indexOf('No standing grant.'), 'announcement lives in Post-restore');
  const contract = read('skills/gauntlet-resume/reference/brief-contract.md');
  assert.ok(contract.includes('tracked from base'), 'S resolver widened');
  assert.ok(read('skills/gauntlet-resume/reference/reconstruction.md').includes('entry check 6'), 'reconstruction runs check 6 before its tracker calls');
  for (const file of ['skills/gauntlet-resume/reference/brief-contract.md', 'skills/gauntlet-handoff/SKILL.md']) assert.ok(!read(file).includes('Amend-grant'), `${file} stays grant-free`);
});

test('executed brainstorming routes link their hidden skill at the owning action', () => {
  const routes = [
    ['skills/gauntlet-resume/SKILL.md', /worktree: no` \|[^\n]*then invoke \[.*?\]\((\.\.\/brainstorming\/SKILL\.md)\)/],
    ['skills/gauntlet-resume/SKILL.md', /\| brainstorm \| \[brainstorming checklist\]\((\.\.\/brainstorming\/SKILL\.md#checklist)\)/],
    ['skills/gauntlet-resume/reference/reconstruction.md', /Selected unapproved-draft brainstorming handoff:[\s\S]*?invoke \[.*?\]\((\.\.\/\.\.\/brainstorming\/SKILL\.md)\)/],
    ['skills/chase-bug/SKILL.md', /Brainstorm now chosen -> draft[\s\S]*?hand off to \[.*?\]\((\.\.\/brainstorming\/SKILL\.md)\)/],
    ['skills/chase-bug/SKILL.md', /Brainstorm now chosen -> render the summary[\s\S]*?hand off to\s+\[.*?\]\((\.\.\/brainstorming\/SKILL\.md)\)/],
    ['skills/writing-plans/SKILL.md', /If no spec exists,[^\n]*before invoking \[.*?\]\((\.\.\/brainstorming\/SKILL\.md)\)/],
  ];
  for (const [owner, pattern] of routes) {
    const match = read(owner).match(pattern);
    assert.ok(match, `${owner}: ${pattern}`);
    const [target, anchor] = match[1].split('#');
    const url = new URL(target, new URL(`../${owner}`, import.meta.url));
    assert.ok(existsSync(url), `${owner}: ${target}`);
    if (anchor) assert.ok(readFileSync(url, 'utf8').includes('## Checklist'));
  }
});

test('incoming routes wait for fresh consent but retain stateful continuation and stops', () => {
  const resume = read('skills/gauntlet-resume/SKILL.md');
  const reconstruction = read('skills/gauntlet-resume/reference/reconstruction.md');
  const planning = read('skills/writing-plans/SKILL.md');
  assert.match(resume, /brief without process state, `worktree: no`.*offer.*`## Intent`.*wait for explicit selection/);
  assert.match(resume, /brainstorm.*step 4/);
  assert.match(resume, /spec title -> step 8/);
  assert.match(reconstruction, /Ask exactly one question: is this spec approved, or do you select/);
  assert.match(reconstruction, /bare "not approved" answer is not consent/);
  assert.match(reconstruction, /Approved:[\s\S]*?continue in writing-plans/);
  assert.match(reconstruction, /using-git-worktrees Step 0 detects the existing/);
  assert.match(reconstruction, /no spec \| stop; offer.*brainstorming.*no tracker call/);
  assert.match(resume, /anything else \| stop: "this is a new idea - run \/skill:brainstorming"/);
  assert.match(planning, /recommend `\/skill:brainstorming` and await the user's explicit choice/);
  assert.match(planning, /Do not invent a plan without a spec/);
});

test('locator and the specifically moved relative resources resolve from their owners', () => {
  const gatherer = read('skills/brainstorming/gatherer.md');
  assert.match(gatherer, /loaded brainstorming `SKILL.md` path/);
  assert.match(gatherer, /command's skill envelope or the absolute path used to read it/);
  assert.match(gatherer, /never `reference\/` as the base/);
  assert.match(gatherer, /\.\.\/\.\.\/bin\/gauntlet-spec-index.mjs/);
  assert.match(gatherer, /Spec index unavailable - predecessor check used directory listing/);
  const links = [
    ['skills/brainstorming/SKILL.md', 'reference/ticket-acceptance.md', null],
    ['skills/brainstorming/SKILL.md', 'reference/spec-finalization.md', 'Spec Self-Review (Before User Review Gate)'],
    ['skills/brainstorming/reference/ticket-acceptance.md', '../SKILL.md', 'Amending an approved spec'],
    ['skills/brainstorming/reference/spec-finalization.md', '../SKILL.md', 'Filename Convention'],
    ['skills/brainstorming/reference/spec-finalization.md', 'superseding.md', null],
    ['skills/brainstorming/reference/spec-finalization.md', '../../verification-before-completion/reference/settings-precedence.md', null],
    ['skills/brainstorming/reference/spec-finalization.md', '../gatherer.md', null],
  ];
  for (const [owner, target, heading] of links) {
    const targetUrl = new URL(target, new URL(`../${owner}`, import.meta.url));
    assert.ok(existsSync(targetUrl), `${owner}: ${target}`);
    assert.ok(read(owner).includes(target), `${owner}: ${target}`);
    if (heading) assert.ok(readFileSync(targetUrl, 'utf8').includes(`## ${heading}`), heading);
  }
  for (const heading of ['Ticket Handling', 'Spec Self-Review (Before User Review Gate)', 'User Review Gate', 'Amending an approved spec']) assert.ok(main().includes(`## ${heading}`), heading);
});

test('spec-summarizer emits a capped briefing and never writes a file', () => {
  const text = read('agents/spec-summarizer.md');
  for (const marker of ['at most 300 words', 'Missing from the spec', 'do **not** attempt to write']) assert.ok(text.includes(marker), marker);
  assert.ok(!text.includes('gap footer'), 'gap footer wording removed');
});

test('gatherer scout template carries the framing finding as evidence, not verdict', () => {
  const text = read('skills/brainstorming/gatherer.md');
  const scout = text.slice(text.indexOf('Scout (always dispatched):'), text.indexOf('Context-builder (conditional):'));
  let left = scout.indexOf('already solves any of this');
  let right = scout.indexOf('Framing: <the strongest cited case');
  assert.ok(left > -1 && right > -1 && left < right, 'Framing follows the already-solves clause');
  left = scout.indexOf('Framing: <the strongest cited case');
  right = scout.indexOf('Predecessor check:');
  assert.ok(left > -1 && right > -1 && left < right, 'Framing precedes the predecessor check');
  for (const marker of ['Framing: no objection - checked <what was read>', 'not a verdict - the main loop decides']) assert.ok(scout.includes(marker), marker);
});

test('section 3 asks the framing question once, with a named alternative, after the premise correction', () => {
  const text = main();
  const section = text.slice(text.indexOf('### 3. Understand the idea'), text.indexOf('### 4. Explore approaches'));
  const left = section.indexOf('Before approaches, state in chat');
  const right = section.indexOf('verify the draft\'s `Framing:` line');
  assert.ok(left > -1 && right > -1 && left < right, 'framing paragraph follows the premise note');
  for (const marker of ['A) as framed', 'B) pivot:', 'C) smaller or none:', 'The framing holds: checked', 'After any premise correction in the same message, ask the framing question or give the holds-statement', 'at most once per brainstorm', 'Framing: kept', 'Framing: pivoted to <x> - <why>', '## Appended during questionary', 'the count restarts', 'adds to the premise verification above', 'trace every consumer, caller, and data path']) assert.ok(section.includes(marker), marker);
  assert.match(section, /^Bad: `The ask adds another settings path - should we\? Recommendation: no`$/m);
  const good = [...section.matchAll(/^Good:\n```text\n([\s\S]*?)\n```$/gm)].map((match) => match[1]);
  const framing = section.match(/^```text\n(A\) as framed[\s\S]*?)\n```$/m);
  assert.equal(good.length, 2, 'both Good examples use fenced text blocks');
  assert.ok(framing, 'framing template uses a fenced text block');
  const preserved = [
    'The two ACs name a path that moved; the spec keeps them in-scope with the new path as a Design clause. Which surface owns the refresh? A) the extension B) a new bin C) the existing skill step. Recommendation: A - the extension already holds the poll loop, so no new entrypoint.',
    'The ask adds a second settings path beside the resolver that already owns every setting (settings/resolver.ts:11). A) as framed B) pivot: a key under the existing resolver - one read path, no new boundary C) smaller or none: document the default and ship no setting. Recommendation: B - the owning schema already exists.',
  ];
  for (const [index, example] of good.entries()) {
    assert.equal(example.replace(/\n/g, ' '), preserved[index], 'preserve example wording');
    assert.ok(example.indexOf('\nA)') > 0, 'lead-in precedes first option');
  }
  assert.equal(framing[1].replace(/\n/g, ' '), 'A) as framed B) pivot: <named alternative> - <cited reason> C) smaller or none: <what ships, or what happens if nothing ships> Recommendation: <letter> - <why>');
  for (const rendering of [...good, framing[1]]) {
    const lines = rendering.split('\n');
    assert.deepEqual(lines.filter((line) => /^[A-Z]\)/.test(line)).map((line) => line.slice(0, 2)), ['A)', 'B)', 'C)']);
    assert.ok(lines.every((line) => (line.match(/[A-Z]\)/g) ?? []).length <= 1), 'one labeled option per physical line');
    assert.match(lines.at(-1), /^Recommendation: /, 'recommendation owns the final line');
  }
});

test('section 4 demands distinct, pattern-judged approaches and section 5 refuses to extend debt', () => {
  const text = main();
  const four = text.slice(text.indexOf('### 4. Explore approaches'), text.indexOf('### 5. Design for clarity and isolation'));
  for (const marker of ['(the axis)', 'reuse-only option (no new construct)', 'drops an assumption the ask makes', 'not viable -', 'does not count toward the 2-3', 'Pattern: <what it follows or cuts across, cited to a repo location>', 'sound engineering practice first, then repo rules', 'never recommend an approach that extends it', 'kept the ask as framed', 'the condition that would flip it']) assert.ok(four.includes(marker), marker);
  const five = text.slice(text.indexOf('### 5. Design for clarity and isolation'), text.indexOf('### 6. Present the design in two rounds'));
  assert.ok(five.includes('when the convention is the debt, say so and do not extend it'), 'section 5 clause');
  assert.ok(five.includes('including supplied presentation details in the design recap'), 'presentation detail preservation');
});

test('red flags stop approaches that skip the framing question or the holds-statement', () => {
  const text = main();
  assert.match(text, /^- Approaches before the framing question or the holds-statement .*; a holds-statement that names nothing checked \(\[owner\]\(#3-understand-the-idea\)\)\.$/m);
  assert.ok(text.includes("- Approaches before the premise note states a contradicted claim's correction ([owner](#3-understand-the-idea))."), 'premise red flag retained');
});

test('brainstorming eval structure and edited instruction sizes stay valid', () => {
  assert.deepEqual(lintTarget(fileURLToPath(new URL('../eval/brainstorming', import.meta.url))), []);
  for (const path of ['skills/brainstorming/SKILL.md', 'skills/brainstorming/gatherer.md', 'skills/brainstorming/reference/spec-finalization.md']) {
    const text = read(path);
    assert.ok(Buffer.byteLength(text) < 50000, `${path}: byte limit`);
    assert.ok(text.split('\n').length < 2000, `${path}: line limit`);
  }
});

test('PR routing follows reset and preserves the named pre-approval merge exception', () => {
  const text = main();
  const step = text.match(/^2\. .*/m)[0];
  assert.match(step, /reference\/pr-subject.md/);
  assert.ok(text.indexOf('phase_tracker({ action: "reset" })') < text.indexOf(step));
  for (const marker of ['scoped conflict tests', 'PR-head path', "PR's diff as the ask", 'spec commit is appended', 'YYYY-MM-DD-pr-<N>-<topic>.md']) assert.ok(text.includes(marker), marker);
});

test('PR scout receives authoritative base values and emits repair evidence', () => {
  const text = read('skills/brainstorming/gatherer.md');
  for (const marker of ['git show <BASE_SHA>:<path>', 'git diff --name-only <BASE_SHA>...HEAD', 'PR title and body verbatim', 'PR-carried specs', 'full comment threads', 'threads for #<N> not fetched (<gh error>)', 'smallest repair', 'keeps:', 'changes:', 'dropped claims:', 'constraints added since fork:', 'fix | keep open | decline: <reason>', 'context-builder only for the bound ticket']) assert.ok(text.includes(marker), marker);
  assert.match(text, /## Codebase recon[\s\S]*?## PR under rework[\s\S]*?## External context/);
});

test('PR spec replacement and lint preserve the record and raw council input', () => {
  const text = read('skills/brainstorming/reference/spec-finalization.md');
  for (const marker of ['## PR under rework', '## Rework record', 'after `## Acceptance criteria`', '40-character pre-rework SHA', 'merge result', 'thread dispositions', 'contract exceptions', 'scoped test results', 'absence fails inline lint', 'PR title and body verbatim', 'ticket or free-text spec']) assert.ok(text.includes(marker), marker);
});

test('engine gate persists both fields before completing and dispatching the selected engine', () => {
  const text = read('skills/brainstorming/reference/spec-finalization.md');
  for (const line of [
    '4 - approve, loop engine (experimental): skip the plan; iterate a fresh loop-implementer over the acceptance-criteria ledger; amendments stop for your review as under 1.',
    "5 - approve, loop engine, auto-apply amends: as 4 with option 2's amendment grant.",
  ]) assert.ok(text.includes(line), line);
  for (const marker of ['asking for `1`, `2`, `4`, or `5`', '`3` plus `1`/`2`/`4`/`5`', 'a reply carrying `3` never grants', 'token with malformed N', 'write nothing', 'zero `- [ ]` rows', 'Loop engine unavailable', 'render only options 1-3', 'directly below `**Amend-grant:**`', 'absent -> `waves`', 'both fields', '`4` approves without a grant', '`5` approves and grants', 'bare `5`', '`5; fund 3 fix rounds`', '`4` with a budget token', 'mixes approval with a change request']) assert.ok(text.includes(marker), marker);
  const persistence = text.indexOf('On every approval');
  const amend = text.indexOf('commit --amend --no-edit -q', persistence);
  const check = text.indexOf('both fields', amend);
  const complete = text.indexOf('phase_tracker({ action: "complete", phase: "brainstorm" })', check);
  const dispatch = text.indexOf('invoke `/skill:writing-plans` on 1/2', complete);
  assert.ok(persistence > 0 && amend > persistence && check > amend && complete > check && dispatch > complete);
  assert.doesNotMatch(text, /commit is untouched/);
  assert.match(main(), /13\. .*loop-implementation/);
  assert.doesNotMatch(main(), /only\*\* next skill is `\/skill:writing-plans`/);
});

test('ledger amendments precede task-plan aftermath and preserve durable counts and audit', () => {
  const text = read('skills/brainstorming/reference/amendment-surface.md');
  const ledger = text.indexOf('Ledger exists');
  assert.ok(ledger > 0 && ledger < text.indexOf('Plan exists ->'));
  for (const marker of ['# Ledger - loop engine', 'skip `plan-writer`, `plan_check`, and `plan_tracker`', '`deviates:`, `deferred:`, or `elsewhere:`', '`cut`', 'evidence = the disposition', 'requirement-preserving', '`done`', '`open`', 'reopened by amendment', "Preserve every row's attempts and the ledger's iterations", 'loop: cut row <n>', 'loop: amend', 'amendment audit', 'a bare `5` grants the same way', 'digit `2` or `5`']) assert.ok(text.includes(marker), marker);
  for (const marker of ['Without a standing amend grant, send a re-bounded row to human review before applying it', 'for a batch containing only one cut, otherwise `loop: amend` (including mixed batches)']) assert.ok(text.includes(marker), marker);
  assert.match(main(), /delete the plan file and the loop ledger/);
});


test('PR-head provisioning validates and recovers admitted member heads before base', () => {
  const text = read('skills/using-git-worktrees/reference/pr-head.md');
  for (const marker of [
    'ordered array', 'every admitted PR', 'before any worktree write',
    "--first-parent --format='%H %P %s'", 'second parent', 'actual local home branch tip',
    'merge PR #<N> head <sha7> into PR #<home>', '(already landed)',
    'an ancestor no-op records no new commit', 'MEMBER_HEADS',
    'Stop before the base merge, spec, plan, later member merges, push, or close',
    "the base merge and each admitted member-head merge, their conflict helpers' edits to the conflicted files, and their scoped conflict tests",
    'threads for #<N> not fetched (<gh error>)',
    "require abort exit status 0", 'rev-parse HEAD` equal to the saved last-good full SHA',
    'status --porcelain --untracked-files=all', 'manual recovery before rerunning',
    'Never reset or clean',
  ]) assert.ok(text.includes(marker), marker);
  const recoveryRow = text.split('\n').find((line) => line.startsWith('| List recovery validated'));
  for (const marker of ['git -C "$ROOT" worktree add "$WORKTREE" <headRefName>', 'git -C "$WORKTREE" rev-parse HEAD', 'validated local tip', 'Never use update-ref, -b, reset, clean, or deletion']) assert.ok(recoveryRow.includes(marker), marker);
  assert.ok(text.indexOf('every admitted PR') < text.indexOf('## Provision'));
  assert.ok(text.indexOf('## Merge admitted member heads') < text.indexOf('## Merge the fetched base'));
  assert.ok(text.indexOf('BASE_SHA=$(git') < text.indexOf('## Merge admitted member heads'));
  assert.doesNotMatch(text, /On fetch failure carry/);
  assert.doesNotMatch(text, /For members whose original heads are already ancestors without a recognized merge/);
});

test('PR conflict helpers and completion explicitly target the selected tree without changing process cwd', () => {
  const text = read('skills/using-git-worktrees/reference/pr-head.md');
  const base = text.slice(text.indexOf('## Merge the fetched base'), text.indexOf('## Fetch unresolved review threads'));
  assert.ok(base.includes('Keep the process cwd unchanged; explicitly target the selected worktree in every helper discovery, status, staging, completion, commit, and abort command.'));
  for (const command of [
    'status --porcelain', 'diff --name-only --diff-filter=U', 'add',
    'diff --cached --name-only', 'commit --no-edit', 'merge --abort',
  ]) assert.ok(base.includes('`git -C "$WORKTREE" ' + command + '`'), command);
  assert.doesNotMatch(base, /`git (?:diff|status|add|commit|merge)\b/);
});

test('leading PR lists admit in order and keep every retained contract', () => {
  const subject = read('skills/brainstorming/reference/pr-subject.md');
  for (const marker of ['leading run', 'whitespace or commas', 'first token that is not a ref',
    '#12 #13 #14', '#12, #13 tighten the retry path', '#12 fix the retry path, see #13 for context',
    '#13 is MERGED; only an open PR can be reworked.',
    '#13 is an issue, not a pull request; a list admits only PRs. Drop #13 from the list, or brainstorm it alone as a ticket.',
    '#13 targets release-2 but home #12 targets main; mixed bases are not admitted.',
    '#13 is listed twice; list each PR once.',
    'To rework these together anyway, merge the heads into one branch by hand, open one PR, and brainstorm that PR.',
    'gh pr diff <N> -R <owner/repo>', 'Recommendation:', 're-ask once',
    'MEMBER_HEADS', 'Threads: none', '### PR #<N>', 'lowercase', 'N=1']) assert.ok(subject.includes(marker), marker);
  assert.match(subject, /PR: <owner\/repo#N> - <title>\nPre-rework head: <40-char sha>\nThreads:\n/);
  assert.ok(subject.indexOf('Threads: none\nBase:') < subject.indexOf('### PR #<N> - <title>\nkeeps:'));
  assert.match(subject, /only for foreign-repository, fork, and mixed-base failures/);
  assert.match(subject, /lowercase owner\/repo identities/);
  assert.match(subject, /resolved repository and number, including URL\/bare duplicates/);
  assert.match(subject, /extract no member AC rows/);
  assert.ok(subject.includes("git show <that PR's headRefOid>:<path>"), 'carried-spec contents use their owning original head');
  assert.ok(subject.includes('attributed original-head text separately from the combined worktree code input'), 'scout receives distinct claim and code inputs');
  const attributionCase = read('eval/brainstorming/samples/pr-list-per-pr-attribution/case.md');
  const attributionExpected = read('eval/brainstorming/samples/pr-list-per-pr-attribution/expected.md');
  assert.ok(attributionCase.includes('Use compact checkpoint output, retaining every fixed observation and required fact within the existing word cap.'));
  for (const marker of ['doc/specs/retry-cap.md', 'at most five attempts', 'at most three attempts']) {
    assert.ok(attributionCase.includes(marker), `attribution setup: ${marker}`);
    assert.ok(attributionExpected.includes(marker), `attribution expectation: ${marker}`);
  }
  assert.match(main(), /one open PR or a leading list of related open PRs reworked on the home PR's branch/);
  assert.match(main(), /ordered per-PR array \(home first\)/);
  const exception = "the base merge and each admitted member-head merge, their conflict helpers' edits to the conflicted files, and their scoped conflict tests";
  for (const path of ['skills/brainstorming/SKILL.md', 'skills/using-git-worktrees/reference/pr-head.md']) assert.ok(read(path).includes(exception), path);
  assert.ok(read('README.md').includes("the base merge, each admitted member-head merge, their conflict helpers' edits to the conflicted files, and their scoped conflict tests"), 'README.md');
  const gather = read('skills/brainstorming/gatherer.md');
  for (const marker of ['### PR #<N>', 'Member merge:', 'own changed paths', 'home']) assert.ok(gather.includes(marker), marker);
  assert.ok(!gather.includes('or threads: not fetched'));
  const lint = read('skills/brainstorming/reference/spec-finalization.md');
  for (const marker of ['Step 4 report', 'MEMBER_HEADS', 'not from the record', 'missing PR', '### PR #<N>']) assert.ok(lint.includes(marker), marker);
});

test('mid-sentence mentions explicitly use context-builder without classifying trailing PR intent', () => {
  const text = read('skills/brainstorming/reference/pr-subject.md');
  const parser = text.slice(text.indexOf('Parse only'), text.indexOf('\n\nResolve and admit'));
  assert.match(parser, /Route mid-sentence mentions through the free-text path with context-builder/);
  assert.match(parser, /make the retry logic work like #55 did/);
  assert.match(parser, /#55 as context, not a PR subject/);
  assert.match(parser, /carry it verbatim without looking up later references/);
  assert.ok(parser.includes('`#12 fix the retry path, see #13 for context` as one plus intent'));
});

test('all original heads are proven against final HEAD after every base-merge outcome', () => {
  const text = read('skills/using-git-worktrees/reference/pr-head.md');
  const members = text.slice(text.indexOf('## Merge admitted member heads'), text.indexOf('## Merge the fetched base'));
  assert.doesNotMatch(members, /merge-base --is-ancestor/);
  const base = text.slice(text.indexOf('## Merge the fetched base'), text.indexOf('## Fetch unresolved review threads'));
  const proof = base.indexOf('merge-base --is-ancestor <each original head> HEAD');
  assert.ok(proof > base.indexOf('merge: unresolved - <files>'), 'proof follows clean, no-op, resolved and aborted outcomes');
  assert.match(base, /After every base-merge outcome, including clean, no-op, resolved, and aborted unresolved, prove home and every member's original head against final HEAD/);
  assert.match(base.slice(proof), /Stop on any nonzero exit/);
});

test('record completeness is checked against provisioning inputs, not its own groups', () => {
  const head = '1'.repeat(40);
  const group = (n) => `PR: acme/widget#${n} - Retry\nPre-rework head: ${head}\nThreads: none\n`;
  const subsection = (n) => `### PR #${n} - Retry\nkeeps: bounded delay\nchanges: none\ndropped claims: none\n`;
  const validate = (record, expected) => expected.filter((n) =>
    !new RegExp(`^PR: acme/widget#${n} - .*\\nPre-rework head: [a-f0-9]{40}\\nThreads:`, 'm').test(record) ||
    !record.includes(`### PR #${n} - `)).map((n) => `missing PR #${n}`);
  const partial = group(12) + group(13) + subsection(12) + subsection(13);
  assert.deepEqual(validate(partial, [12, 13, 14]), ['missing PR #14']);
  assert.deepEqual(validate(partial + group(14) + subsection(14), [12, 13, 14]), []);
  assert.deepEqual(validate(partial + group(14), [12, 13, 14]), ['missing PR #14']);
});

test('receivers retain plural closure and brief contracts', () => {
  const finish = read('skills/finishing-a-development-branch/SKILL.md');
  for (const marker of ['successful push and successful home body edit', 'close no PR other than the absorbed members through the question above', '--json state,headRefOid', '<current headRefOid> <pushed home head>', '#13: "Reworked into #12', '#14: "Reworked into #12']) assert.ok(finish.includes(marker), marker);
  const brief = read('skills/gauntlet-resume/reference/brief-contract.md');
  assert.ok(brief.includes('optional one or more consecutive'));
  assert.ok(brief.includes('pairs, one per record group,'));
  assert.ok(read('skills/gauntlet-handoff/SKILL.md').includes('home first'));
});
