import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const main = () => read('skills/brainstorming/SKILL.md');
test('brainstorming is explicitly requested and hidden from model advertisement', () => {
  const frontmatter = main().match(/^---\n([\s\S]*?)\n---/)[1];
  assert.match(frontmatter, /^disable-model-invocation: true$/m);
  assert.match(frontmatter, /Use only when the user explicitly requests brainstorming or selects a handoff into it\./);
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
  assert.match(text, /read \[Ticket Handling\].*then follow/);
  assert.match(text, /Read \[Ticket Handling\]\(reference\/ticket-acceptance.md\) before gathering context or step-4\/8 entry, even with no ticket/);
  assert.match(text, /Read \[Spec Self-Review\].*before spec-writing or restored step 8/);
  assert.match(text, /unreadable -> stop with a blocking error, never reconstruct from memory/);
});

test('restored and redraw entry load the ticket contract before questionary or lint', () => {
  const text = main();
  for (const [step, action] of [[4, 'Understand the idea'], [8, 'Spec self-review']]) {
    const checkpoint = text.match(new RegExp(`^${step}\\. .*`, 'm'))[0];
    assert.match(checkpoint, /read \[Ticket Handling\]\(#ticket-handling\)/);
    assert.ok(checkpoint.indexOf('read [Ticket Handling]') < checkpoint.indexOf(step === 4 ? 'see [Understand' : 'run the inline'), action);
  }
});

test('moved ticket contract retains verbatim schema and all no-ticket cases', () => {
  const text = read('skills/brainstorming/reference/ticket-acceptance.md');
  for (const marker of ['every top-level checkbox row', 'Post-deployment housekeeping', 'all written `- [ ]`', 'in-scope', 'deviates: <why>', 'deferred: <where>', 'venue: <env> - <observation>', 'none - no ticket', 'none - ticket has no acceptance criteria', 'none - ticket not fetched (<reason>)', 'Never author acceptance criteria']) assert.ok(text.includes(marker), marker);
  assert.match(text, /\*\*Write the section in every spec\*\*, after `## Problem`/);
  assert.match(text, /\.\.\/SKILL.md#amending-an-approved-spec/);
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
  for (const marker of ['This commit is **unconditional**', 'Coverage:', 'Applied:', 'Deferred:', 'Rejected:', 'under ~500 bytes', 'under ~2%', 'over ~45 KB', 'last content-producing tool call', 'returns 0 bytes', 'reports truncation', 'never paraphrase', 'rm "$SUMMARY_PATH"', 'fresh** temp path', 'proceed immediately to `/skill:writing-plans`', 're-dispatch the summarizer or note the discrepancy']) assert.ok(text.includes(marker), marker);
  assert.ok(text.indexOf('Then commit the spec') < text.indexOf('1. **From the dispatch tool result'));
  assert.ok(text.indexOf('1. **From the dispatch tool result') < text.indexOf('2. **The `Read` itself'));
});

test('standing grants own boundaries while amendment aftermath and finish recipe survive', () => {
  const text = read('skills/brainstorming/reference/amendment-surface.md');
  for (const marker of ['redraws always stop', 'grant never satisfies the spec gate', 'new brainstorm or a fresh-session resume with no grant', 'Amend-grant:', 'skip steps 2-4', 'scope changes included', 'plan_check', 'recommended: accept', 'rescope-into-spec']) assert.ok(text.includes(marker), marker);
  assert.match(main(), /plan_tracker\(\{ action: "clear" \}\).*phase_tracker\(\{ action: "reset" \}\).*phase_tracker\(\{ action: "start", phase: "brainstorm" \}\)/);
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
