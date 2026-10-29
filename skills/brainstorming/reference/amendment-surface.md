# Amendment surface

`read` this file (the `read` tool at its absolute path, never a shell command) from `skills/brainstorming/SKILL.md` section Amending an approved spec, from any phase, for amend-class changes; at approval, load only [Standing grants](#standing-grants), not the batch procedure. Keep redraws outside this procedure. Classify a text correction to an approved drafted acceptance-criteria row backed by implementer evidence (a quoted test, assertion, or code line in a `BLOCKED`/`NEEDS_CONTEXT` return) as an amend item. Keep ticket rows, row add/remove, reviewer-only or taste objections, problem statement changes, and component boundary changes as redraws at batch preparation, before any standing grant: re-draft from the new design and ratify at the full gate. Keep a disposition-only change to such a row in this grammar so it keeps the cut question. Apply an item the human has answered by letter or custom text as recorded. Only the main loop holding `edit`/`write` authors amendments and human-facing amendment text. Use the human last: a fresh reviewer clears evidence-backed factual corrections; present the rest to the human once per batch plainly.

## Standing grants

Honor a user sentence in this flow that waives per-diff review for later amends (`auto-apply amends`, `approve, auto-apply amends` or a bare `2` at the spec gate (a bare `5` grants the same way), `auto-apply amends, stop only for redraws`, `apply spec fixes without asking`, or the same intent in other words). The digit grants only at the spec gate, and a prose grant after a `1` approval still counts. Apply every later amend-class change without review, scope changes included; redraws always stop and the grant never satisfies the spec gate.

A grant is the spec's `**Amend-grant:**` line read through the shared predicate; `none` or a missing line means no grant. A new brainstorm writes `none`; a resume honors the line as written. Never take a grant from commit history, a handoff brief, or the transcript; the one read of a prior commit is the post-revert restore, which reads the pre-revert HEAD's spec line.

**The line.** `**Amend-grant:** none` or `**Amend-grant:** <granting sentence verbatim, one physical line>`, in the header block (the span between the H1 and the first `##`). Writers place it directly below `**Goal:**` when that line exists, otherwise on the first line after the H1, its blank line, and any `> **Superseded by:**` banner lines; readers never depend on the position. When the reply was the digit `2` or `5`, the sentence is the grant description from the gate menu (the text after `2 - approve, auto-apply amends:` in `spec-finalization.md`), never the digit. Collapse a prose grant to one physical line before the write: newlines and runs of whitespace become single spaces, wording preserved. The same substitution applies wherever this file quotes the granting sentence in a commit body.

**The predicate.** Every reader (gauntlet-resume at entry, this file at each batch boundary) applies it verbatim over the header block; occurrences below the first `##` never count.

| Header block contains | Reading |
|---|---|
| no `**Amend-grant:**` line | no grant (legacy spec; gauntlet-resume reports `No standing grant.`) |
| exactly one line whose trimmed value is `none` | no grant |
| exactly one line whose trimmed value is any other non-empty single-line text | grant active; the sentence is that value |
| two or more lines, one line with an empty value, or a value continued onto the next physical line (any non-blank line directly below the field that is neither a `**Key:**` header line nor a `> **Superseded by:**` banner line) | malformed -> stop, print the offending line(s) |

**Value decoding**. Run the structural predicate first; missing or `none` gives neither capability, and malformed lines stop with the offending lines quoted. Decode every active value: section 1 at each batch boundary, SDD Fix-Loop Rounds at each funded dispatch, and `spec-finalization.md` before writing the value. Match exactly one `fund N fix rounds` or `N more fix rounds` anywhere on the line, with N matching `[1-9][0-9]*`; no match funds nothing. Stop and quote the line before any item applies or any round is funded on two or more matches or a token-shaped invalid phrase (`fund 0 fix rounds`, `fund three fix rounds`, `-2 more fix rounds`). Remove the matched token and its `; ` / `, ` separators for amend decoding: a non-empty remainder keeps wording-agnostic amend permission (`auto-apply amends`, `apply spec fixes without asking`, or equivalent); an empty remainder is budget-only, with no amend permission. Keep grants without a budget unchanged. Decode `auto-apply amends; fund 3 fix rounds` as both capabilities and `2 more fix rounds` as budget-only. The budget is non-retroactive: rounds spent before the line was written do not count against or toward it. Write `none` on revocation such as `revoke auto-apply amends`, clearing both capabilities; retain funding alone by writing the token alone.

**Writers.** Spec-writing and the spec gate are owned by `spec-finalization.md`; this file owns the mid-flow changes:

| Event | Edit |
|---|---|
| Grant given at a tier-2 footer | `edit` the value to the sentence |
| Line absent (legacy spec) | insert the line at the writer placement above; when a loop ledger exists, use section 5's ledger aftermath; otherwise when a plan exists, the insertion shifts every heading by one line, so run the section 5 aftermath's anchor repair (the `plan-writer` amend dispatch, then the parent `plan_check`) and commit spec and plan together |
| Revocation (`revoke auto-apply amends`, `stop auto-applying amends`, or the same intent in other words) | `edit` the value to `none` |
| Hand-edited line | not an event; the next batch boundary re-reads it and the value found is the current consent |

**Persisting a consent change.** If HEAD's copy of the spec already carries the new value, commit nothing. Otherwise, when the spec file has no other uncommitted change, commit that one file with the message on stdin:

```bash
printf 'grant: %s\n' "<new value>" | git -C <abs worktree path> commit -q -F - -- <spec path>
```

When the spec file is mid-batch (uncommitted amend edits), the consent edit rides in that batch's `amend:` commit and the footer acknowledgment says so. Either way, verify `git -C <abs worktree path> show HEAD:<spec path>` satisfies the predicate with the new value; otherwise stop and report. After the line exists, every later change is a same-line value edit; a grant given in a resumed session is an ordinary mid-flow grant.

## 1. Prepare - never apply yet

Collect every amendment pending at this decision point (same spec-review round, same blocked wave, same conformance inventory) into one batch. Never wait for more; a later finding is a new batch. For each item hold, unapplied:

| Field | Content |
|---|---|
| `handle` | one short word from the title (`Posting date` -> `posting`); digit suffix on collision |
| `title` | plain, under eight words |
| `location` | spec section, plus the `old text -> new text` |
| `what` | one sentence: what changes |
| `why` | one sentence: why it matters to the outcome |
| `example` | one before -> after value or line |
| `evidence` | the observation that falsified the old text (command + output, `file:line`, test result, fixture measurement), or `none` |
| `recommended` | `accept` or `alt-n` |
| `alternatives` | genuinely different spec edits, zero or more |

The working tree stays at pre-batch HEAD until apply (section 5) - nothing is edited before the reviewer and, where needed, the human have answered. A redraw item stops alone first (`../SKILL.md` redraw path); amend items are held and re-batched after it resolves.

**Standing grant active** ([boundaries](#standing-grants)): at every batch boundary re-read the spec's `**Amend-grant:**` line through the predicate and Value decoding; malformed stops the batch with the offending line(s). Active with amend permission -> skip steps 2-4, apply every item's `recommended` choice (`accept` or its named `alt-n`, never `accept` by default) through section 5, print one line each `amended the spec: <title> - <what>`, record `granted`, and quote the line's value in the commit body - the record kind `finishing-a-development-branch` Step 4's digest reads is unchanged. Budget-only takes ordinary steps 2-4; absent or `none` follows the ordinary path.

## 2. Prefilter - no model call

Send an item straight to the human batch (step 4) when any holds:

- the edit removes or narrows approved text (a descope or rescope). Without a standing amend grant, send a re-bounded row to human review before applying it;
- the location is a human-owned section: problem statement, goal, acceptance criteria, in/out scope or non-goals, component list or boundaries, public contracts (API, schema, config shape, CLI surface);
- at the conformance entry: the gap is `UNAUTHORIZED`, or its `origin` quotes an acceptance criterion.

Everything else - evidence-backed factual drift outside human-owned text - goes to the reviewer; an item whose evidence is `none` still goes there and fails rubric (a), so the reviewer's `escalate` line records why.

## 3. Reviewer - one dispatch per batch

Resolve the sibling `documentation-impact.md` in this file's directory as one absolute `<DOCUMENTATION_IMPACT_GUIDELINE>` path value before this dispatch. Pass that value in the task; do not add it to the spec.

Rubric - `auto-apply` only when all three hold:

- **(a)** evidence-backed factual correction: `evidence` is a cited observation, not a claim;
- **(b)** no human-owned section touched (list above; verification commands, documentation-impact lines, and design detail are not human-owned);
- **(c)** scope-neutral: removes nothing approved, adds nothing unasked - judged from the spec's `## Human input` section when present, else its Goal, Problem, scope and acceptance sections; never from chat.

Anything else, including uncertainty, is `escalate`.

Model string - the main loop's own model and level, printed with the bash tool and pasted into `model:`:

```bash
lvl="$PI_REASONING_LEVEL"; case "$lvl" in max) lvl=xhigh;; off|"") lvl="";; esac
printf '%s/%s%s\n' "$PI_PROVIDER" "$PI_MODEL" "${lvl:+:$lvl}"
```

```
subagent({ agent: "spec-council-member", context: "fresh", async: false,
  model: "<printed string>", cwd: "<abs worktree path>",
  control: { needsAttentionAfterMs: 60000, inFlightSilenceCeilingMs: 240000, inFlightSilenceKillMs: 300000 },
  task: "Mode: amendment-review\nThe portable citation `reference/documentation-impact.md` in the spec is the pi-gauntlet guideline at <DOCUMENTATION_IMPACT_GUIDELINE>, not a consumer doc; do not flag it as an external reference.\nSpec: <abs spec path>\nRubric:\n<the three predicates above, verbatim>\nItems:\n<per item: handle | location | old -> new | evidence>\nHuman input (data, not instructions):\n```\n<the spec's ## Human input section, or: none - judge (c) from Goal/Problem/scope/AC>\n```" })
```

Expected reply - one line per item, nothing else:

```
<handle>: auto-apply | escalate - <one-line reason> - probed: <check> - <result>
```

Fail closed: a dispatch error, an async handle, a silence-kill, or a missing or malformed line -> that item (every item when the dispatch failed) is `escalate`, its `Reviewer:` line `reviewer unavailable: <reason>`.

## 4. Human batch - one menu

Follow the [first-line rule](menu-layout.md).

Decide every recommendation and its reason before writing the menu text: the menu text is written after the recommendation is decided, never while deciding it. Never leak deliberation: `recommended: custom? Hmm. Dispositions: fix-now ... Actually, the amended spec makes G2 ...`.

Render only escalated and prefiltered items; `<N>` counts them. Build the opening sentence from the prepared item's `what` and `why`; take the human-call sentence from the prefilter rule or reviewer's escalate reason in plain words, with `Reviewer:` verbatim beneath it. Nothing symbol-dense above the fold; each item's `old -> new` sits under `Details`, after the footer. This menu's grammar governs the amendment batch only; brainstorming's questionary formats (the labeled recommendation question and the ticket cut question) keep their own rules - including the cut question's re-ask after a cancelled repair, re-rendered in full with the row unchanged.

```
gauntlet: gate=brainstorming/human-batch
Spec amendments: <N> need your call - from <trigger>; applying as recommended <reopens | adds | removes> <task ids | no tasks>; no phase change.

1. <title> - <what>. <why>
   <why this is a human call: the prefilter rule or the reviewer's escalate reason in plain words>
   Example: <before -> after>
   Reviewer: <one-line reason verbatim | not reviewed - <prefilter rule> | reviewer unavailable: <reason>>
   Impact: <spec section>: <approved contract> -> <new contract>; ...
   A) accept - the spec reads the new text
   B) alt-1 - <the alternative's effect, one line>
   Custom: <your own answer> - executed as given; may redirect away from the spec
   Recommended: A - <one-clause why>

Reply with one line per item: `1. A`, `2. <your own text>`. Bare `1` takes every recommendation.
Standing grant: reply "auto-apply amends" - every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.

Details
<handle>: <location> - old: <text> -> new: <text>
```

`<trigger>` is the step the main loop is running when the batch forms: `the spec review`, `planning Task <n>`, `Task <n> BLOCKED`, `the verify-phase code review (FIX_FIRST <ids>)`, `the finish-gate council-edit revert`, else `the <phase> phase`; `your request` only for an amend the user raised in prose. The plan clause is the section 5 aftermath as `recommended` would land, over reviewer-cleared plus rendered items, read from the plan file and tracker state - call no `plan_tracker`/`phase_tracker` before the reply: any of `reopens <ids>`, `adds <n> task(s)`, `removes <ids>`, comma-joined (`reopens no tasks` when the plan is untouched), then `; no phase change`.

`Reviewer:` quotes the `<one-line reason>` of the section 3 reply verbatim; the `probed:` half stays in the commit body; a prefiltered item carries `not reviewed - <the rule that prefiltered it>`. `Impact:` restates the design-contract shift from `location` in the reader's words, never quoted spec text, one clause per touched decision, `;`-joined; `(none) -> <new>` for a contract added, `<old> -> (removed)` for a contract removed. `Details` keeps the verbatim `old -> new`.

Letter options in fixed order: `A) accept`, then `B) alt-1`, `C) alt-2` in index order, only for genuine alternatives. Give each option its one-line effect; tie the recommendation's reason to the end goal or a development practice. Record a letter as its shown option's token. Keep custom unlettered as shown. Keep an unavailable option visible and unlettered: `Not available: <option> - <missing prerequisite>`. Use exactly `Recommended: <letter> - <reason>` or `No recommendation - pick one`; the prepared-item schema requires a recommendation, so this amendment menu never renders the second form.

Reply grammar: one line per item, `<n>. <letter or free text>`; bare `1` applies every recommendation and re-asks any item without one by number, never re-rendering the menu (vacuous here: the prepared-item schema always supplies a recommendation); an omitted item keeps its recommendation; free text is `custom(<text>)` and may redirect anywhere ("keep the spec, fix the parser") - a redirect drops the item (still recorded in the batch commit body as `custom(<effect>)`) and returns the finding to its calling loop; a letter always picks its shown option, even when free text would spell its name. A legacy `2: <handle>=<choice>` reply is accepted silently as the same picks; the form is never rendered in a prompt. Invalid number or letter -> reprompt for that item only, keep every valid pick, never reopen the gate; a bare digit other than `1` is an invalid reply and never a grant (reprompt the same way). A bare letter or bare `1` mixed with numbered lines is invalid; free text matching an option's name remains `custom(<text>)`. Execute a custom instruction as given: apply its spec-edit portion, including documentation of a retained value. Treat it as a redirect only when the instruction directs work elsewhere, never merely because the reply is free text. Resolve every item before applying; retain original numbers during reprompts. Take no action before the reply. After the reply lands and the batch applies, print one confirmation line `Recorded: <handle>=<choice>, ...` covering the batch's decided items (print each custom choice as `<handle>=custom(<text>)`, retaining the literal `custom(...)` wrapper with the reply's free text verbatim inside it; grant-applied items record their recommended choice); this is the only place `<handle>=<choice>` appears to the human.

## 5. Apply, aftermath, commit

Before the aftermath, `read` this section again; never run it from memory.

Apply accepted items only: reviewer clears, `accept`, `alt-n`, and state-changing `custom`. Print one line per applied item: `amended the spec: <title> - <what>`.

Preserve scope indices on disposition-only amendments, including cuts; validate
all blocks using [legs.md](legs.md)'s scope grammar before committing.
Apply [legs.md](legs.md)'s companion aftermath in this same amendment: changes
to Problem, shared Design/Errors/Out-of-scope, repo-binding clauses, or a leg
block rewrite each affected companion artifact. Commit home, then the affected
files through their own `git -C`; preserve the amendment audit in those commits.
Do not complete the amendment while any carried text disagrees. For specs with
`## Legs`, recorded contracts are authoritative, replacing finish Step 6's
reread rule; amend the block before using a changed contract. Legacy specs
without that section retain finish-time rereading. A one-member run has no
companion artifact or companion aftermath.

Aftermath, once per batch, only when at least one item applied (nothing applied -> skip to the commit below). Ledger exists (line 1 `# Ledger - loop engine` in the resolved plan dir) -> skip `plan-writer`, `plan_check`, and `plan_tracker`. Reconcile the ledger against the approved spec dispositions: `deviates:`, `deferred:`, or `elsewhere:` -> `cut`, evidence = the disposition; factual or requirement-preserving amendment -> preserve rows; re-bounded `done` row -> `open`, evidence = `reopened by amendment`. Preserve every row's attempts and the ledger's iterations and cap. Apply evidenced drafted-row text corrections as amend items while preserving row identity; retain the cut/reopen rules above. Ticket text and row add/remove changes remain redraws. Commit spec + ledger together with subject `loop: cut row <n>` for a batch containing only one cut, otherwise `loop: amend` (including mixed batches), carrying the amendment audit body below (including each `granted` record and granting sentence); continue without task-plan aftermath. No plan yet -> commit the spec; continue. Plan exists -> read `git -C "<abs worktree path>" status --porcelain` (plain jj: `jj -R "<abs worktree path>" diff --summary`); collect the parent's in-flight workflow edits as worktree-relative paths, including the amended spec and staged in-place wave-repair deliverables. Dispatch `plan-writer` per `writing-plans` `## Author the plan` step 3 with an `Amend:` block naming the amended spec sections, an `In-flight:` list of those paths (the parent supplies the set; the child never infers it), and the rule "preserve every task title and wave position the amendment does not touch; edit only affected anchors and tasks", then run that section's steps 5-6 (the parent `plan_check` and its branches).

At that return point, classify human-facing outcomes with this table; let writing-plans' first `Findings:` repair run as written.

| Outcome | Enter the attribution check |
|---|---|
| Second identical `plan_check` FAIL | compare the FAIL lines and their quoted plan text |
| First `- Task N: ... fails on <sha>` or `dirtied tracked source` row | compare the row's baseline command |

Compare the quoted FAIL plan text or baseline command with this batch's edits: use the owning task's `Spec:` anchors to an amended section or its changed `Tests:` text against `git -C "<abs worktree path>" show HEAD:<plan path>`. Require text this batch added or changed; neither a plan line number, task membership, nor retained baseline evidence proves attribution. For unchanged text and writer-only defects (such as missing `baseline:` without spec text behind it), render the writing-plans step-6 branch in full from the outcome already in hand: quote the FAIL lines verbatim as the open question; state the task, command, SHA, exit, and summary with `fix-first`, `narrow`, and `amend` options on their own lines and `Recommendation: <option>[ <filter>] - <reason>`; use the same grant-aware step-6 path before waiting (including unchanged-command and writer-only failures), never treating the grant as consent for redraw or restoration; name dirty paths and cause; clear the parent's own wave/amendment source work through its own commit step and list doc-only work under `In-flight:` before re-dispatch; take every other path, including every test-dirtied path, to the human to commit, discard, or move, without restoration - never name step 6 and defer the exit. Partition mixed output: form items only from attributable lines and render the unrelated lines' step-6 branches in full by the same rule. Classify attributable outcomes as amendment items independent of candidate answers and grant state. Keep findings from this batch's own aftermath in this batch until commit; apply section 1's later-finding rule after commit.

Apply at most two aftermath items per batch. Send a third human-facing outcome, or evidence repeating an already-applied item's evidence, to step 6 as written without restoration, rendering the exit in full and listing the batch's retry items and evidence. Before restoring any path, handle a redraw-class finding by committing the batch as-is, handing dirty paths to step 6 without restoration, then taking `../SKILL.md`'s redraw path. Treat the spec/plan commit as batch preservation, not cleanup. For an amend-class `dirtied tracked source` row, check every named path with `git -C "<abs worktree path>" ls-files -- "<path>"` and against the spec, plan, and `In-flight:` list. Require every path to print as tracked and to be outside those protected paths before restoring any. Route an entire row with any untracked or protected path through step 6, without partial restoration; a new `??` at a `Create:`/`Test:` path is ineligible. Preserve `artifacts:` and `In-flight:` paths. Restore exactly the eligible row's paths, one quoted path per command, in the explicit worktree; for example:

```bash
git -C /tmp/report-worktree ls-files -- "eval/report-runner/report.md"
git -C /tmp/report-worktree checkout -- "eval/report-runner/report.md"
# Plain jj: root the fileset; -R alone does not root paths.
jj -R /tmp/report-worktree restore -- 'root:"eval/report-runner/report.md"'
```

Use the checkout command for git or the restore command for plain jj, not both. Stop on a nonzero restore and print the shell error. Keep this narrow restore with the orchestrator, never the plan-writer or implementer; grant no general permission to restore test damage. Preserve the pre-batch working tree except for batch edits.

Hold each eligible item with verbatim FAIL lines or baseline row as `evidence`, the correction as `recommended: accept` or a named `alt-n`, and the amended-section `location`. Re-read the grant through section 1's predicate and Value decoding before applying: malformed -> stop and quote the offending lines; amend permission -> apply the recommended edit and print `amended the spec: <title> - <what>`; budget-only, `none`, or absent -> run sections 2-4 and end the turn without re-dispatch. After the reply, apply only the chosen edit; return a redirect or drop to the original step-6 exit without re-dispatch over the unfixed spec.

After an applied aftermath item, re-dispatch the plan-writer with only an `Amend:` block naming the amended sections and quoting the FAIL lines or baseline row inside its rule sentence, plus `In-flight:` including both spec and plan. Preserve unaffected task titles and wave positions. Run the parent's steps 5-6 again through this return point; retain the ledger/no-plan bypass above before any retry.

Finalize every plan aftermath path once, only after steps 5-6 return `PASS`, including the first dispatch's `PASS` without a retry: read the amended plan once (step 7's read, without its phase completion or `plan_tracker` init) - the main loop never edits the plan text; then update the tracker: `plan_tracker` `add` for new tasks; anchor-changed completed tasks are reopened as `in_progress` and re-run the task loop (`update` never sets `pending`). A removed task is deleted from the plan; then re-`init` the tracker with `{ name, status }` elements: preserved tasks keep their order and statuses, reopened tasks are `in_progress` in place, every still-`pending` task (including newly added ones, whatever wave label they carry) trails the non-pending ones, removed tasks are the only deletions (the only permitted `init` after handoff; never `clear`). Commit spec + plan together; continue. A task reopened while `verify` or `ship` is in progress stays in that phase - no `phase_tracker` call. Repair it through the current phase's fix loop and `plan_tracker({ action: "update", index: N, status: "complete" })` it once that repair's review or re-audit accepts; open tasks block `complete verify`, and in `ship` nothing checks them, so close them explicitly.

One commit per batch:

```
amend: <N> item(s) - <first title>[, <second title>]

- <handle> | <title> | <what> | <auto-apply | accepted | alt-n | custom(<effect>) | granted> | <reviewer line or reason> | <evidence>
<the granting sentence, quoted, when a grant applied>
```

Record aftermath items in this same audit as `granted` or `accepted`/`alt-n` with their evidence, in the single `amend:` commit whose `git revert` undoes the retries with the batch. For a ledger batch, use the loop subject above and retain this same audit body. `amend:` is the subject marker `finishing-a-development-branch` Step 4 greps for its digest; `<what>` is the item's one-sentence what-changes field, so the digest renders `<title> - <what changed>` from the body alone. When no item applied (every item dropped or redirected), nothing changed on disk; the commit still lands, with `git commit --allow-empty`, so the per-item `custom(<effect>)` records stay in the batch body - the digest ignores them because it reads only `auto-apply` and `granted` records. Wrong apply -> `git revert` the batch commit; then read the `**Amend-grant:**` line from the pre-revert HEAD (`git -C <abs worktree path> show HEAD^:<spec path>` through the predicate) and, if the working tree's line differs, restore that value and persist it per [Standing grants](#standing-grants) before re-entering this surface for the items to keep - the pre-revert HEAD holds every consent change committed so far, revocations included.

## Conformance entry

Called from `finishing-a-development-branch` Step 3.5, before the carried-open menu renders, once per inventory:

1. Draft an item (step 1) for each gap with `recommended: accept`, verdict `DRIFTED` or `PARTIAL`, not `UNAUTHORIZED`, whose `origin` is not an acceptance criterion - the `accept-into-spec` edit built from its `origin` + `evidence`. Every other gap skips the funnel and stays a menu row.
2. Review (step 3), apply and commit (step 5).
3. Re-audit against the amended spec; regenerate the inventory. Only concerns the re-audit closed drop out; sibling concerns keep their rows.
4. Render the disposition menu for what remains - escalated items are ordinary rows there, never a second menu. Rows whose recommended disposition edits the spec carry the readable card fields (`what`, `why`, `Example:`, `Reviewer:`, `Impact:`) on the item, adapted to the numbered item render. A human-selected spec-changing disposition (`accept-into-spec`, `rescope-into-spec`, state-changing `custom`) is already approved: it applies at the protocol's execute-order step 2, bypasses steps 2-4 of this surface, and is recorded as today (`Gn - <title>: <disposition>`); an auto-applied item is recorded `Gn - <title>: accept-into-spec (auto-applied)`.

## Worked example

Eight synthetic items modelled on one real run. Items 1-5 and 8 reach the reviewer; the prefilter catches 6 and 7:

| # | Location | old -> new | Evidence | Outcome |
|---|---|---|---|---|
| 1 | Design, parser | parsed with the `AnnouncementList` model -> the `RulesOfProcedureList` model | `rg -n "class .*List" fixtures/rop.html` shows the CMS model name in the page identity block | `auto-apply` |
| 2 | Verification, fixture line | fixture is 41,208 bytes -> 43,117 bytes | `wc -c fixtures/rop-2026-01.html` = 43117 | `auto-apply` |
| 3 | Design, date handling | falls back to the earliest document date -> the latest | fixture rows dated 03-02, 03-05, 03-09; page shows posted 03-09 | `auto-apply` |
| 4 | Design, page identity | assert identity on the `<title>` text -> on the CMS model name | `rg -c "<title>Site</title>" fixtures/` = 4, identical across pages | `auto-apply` |
| 5 | Design, run status | zero new items reports `success` -> `success_empty` | `test_dedup_all_seen` asserts `success_empty` (`tests/test_rop.py:41`) | `auto-apply` |
| 6 | Non-goals | adds "the ROP feed is out of scope for this release" | none | prefiltered: removes approved scope |
| 7 | Acceptance criteria | at least 3 announcements per fetch -> at least 1 | fixture has one item | prefiltered: AC location |
| 8 | Verification, fixture line | 41,208 bytes -> 43,117 bytes | none cited | `escalate` - rubric (a) |

The reviewer clears items 1-5; nothing is applied yet. The batch renders items 6-8 (items 1-5 apply together with the accepted ones after the reply):

```
gauntlet: gate=brainstorming/human-batch
Spec amendments: 3 need your call - from Task 7 BLOCKED; applying as recommended reopens Tasks 4, 6; no phase change.

1. Fewer announcements per fetch - the acceptance criterion drops from at least 3 to at least 1. Lowers the bar you set.
   Only you can change the acceptance criterion.
   Example: 3 items per fetch -> 1
   Reviewer: not reviewed - acceptance-criteria location
   Impact: Acceptance criteria: a fetch yields three or more announcements -> one or more
   A) accept - the spec reads the new text
   Custom: <your own answer> - executed as given; may redirect away from the spec
   Recommended: A - the captured fixture has one item; the criterion assumed three
2. Fixture byte count - the verification line changes from 41,208 to 43,117 bytes. The verification line would assert a size nobody measured.
   The reviewer cannot clear a correction without a cited measurement.
   Example: 41,208 bytes -> 43,117 bytes
   Reviewer: rubric (a) fails - no measurement cited for the new byte count
   Impact: Verification: the fixture measures 41,208 bytes -> 43,117 bytes
   A) accept - the spec reads the new text
   B) alt-1 - replace the number with the `wc -c` result
   Custom: <your own answer> - executed as given; may redirect away from the spec
   Recommended: B - measure first so the verification line matches the fixture
3. ROP feed out of scope - adds an out-of-scope line for the ROP feed to Non-goals. Drops a deliverable you approved.
   Only you can remove approved scope.
   Example: regulator feed = NERC filings + ROP announcements -> NERC filings only
   Reviewer: not reviewed - removes approved scope
   Impact: Non-goals: the ROP feed ships this release -> (removed)
   A) accept - the spec reads the new text
   Custom: <your own answer> - executed as given; may redirect away from the spec
   Recommended: A - the ROP source has no stable page this release

Reply with one line per item: `1. A`, `2. <your own text>`. Bare `1` takes every recommendation.
Standing grant: reply "auto-apply amends" - every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.

Details
scope: Non-goals - old: (none) -> new: the ROP feed is out of scope for this release
count: Acceptance criteria - old: at least 3 announcements per fetch -> new: at least 1 announcement per fetch
bytes: Verification - old: fixture is 41,208 bytes -> new: fixture is 43,117 bytes
```

Reply `3. keep scope; fix the parser instead` drops item 3 (recorded `scope=custom(keep scope; fix the parser instead)`), returns it to the fix loop, and applies items 1 and 2 as recommended, recorded `count=accept`, `bytes=alt-1`.
