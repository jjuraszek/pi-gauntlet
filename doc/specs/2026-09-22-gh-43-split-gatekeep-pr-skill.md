# Split gatekeep-pr SKILL.md into a flow-ordered body plus reference files

> **Superseded by:** [doc/specs/2026-10-01-gatekeep-pr-capability-gate-compact-report.md](./2026-10-01-gatekeep-pr-capability-gate-compact-report.md) - file layout and SKILL.md content split only

**Ticket:** jjuraszek/pi-gauntlet#43
**Date:** 2026-09-22
**Goal:** `skills/gatekeep-pr/SKILL.md` (589 lines) becomes a flow-ordered body under 500 lines - target 200-250 - with four `reference/` files owning the deep mechanics; every rule in SKILL.md and the four new files keeps exactly one owner, and the skill's runtime behavior is unchanged.

## Problem

`skills/gatekeep-pr/SKILL.md` is the only skill over the 500-line ceiling `skills/writing-skills/SKILL.md:29` sets. Four blocks carry 353 of its 589 lines: `## Assessment` (99-217, 119 lines), the ID rules and payload contract under `## Output` (314-370, 57), `## Decision rendering` (371-465, 95), `## Post-selection loop` (466-540, 75). The body also reads out of flow order - the fenced report template sits before the ID rules that define its entries, `## Inline-first execution` is wedged between Assessment and Verdict, merge execution sits in the pre-selection `## Verdict` - and several rules are stated three times in complementary words:

| Rule | Current sites (`6a6a820`) |
|---|---|
| `[quality]` (and `[performance]`) on a `P#` is a category, never a downgrade | ID rules Precedence (`:318-323`), triage bar (`:347-353`), Red flags (`:569-571`, the only site naming `[performance]`) |
| One gate run and one push per fix wave | Post-selection loop step 2 (`:507-522`), step 3 (`:523-530`), Red flags (`:582-585`) |
| flaky / real / CI-infrastructure-broken disposition mechanics | Phase 4 `CI checks` (`:192-210`), ID rules `Failing checks close by disposition` (`:335-346`), Decision rendering CI-check gate (`:426-438`) |

Ticket #43 asks for a pure move (its AC 3 pins a `--color-moved` diff). The user chose instead to reword, deduplicate, and reorganize in the same change, because a pure move fixes length without fixing organization and a second pass would cost more than doing both once. Ticket #43's body is refined to match.

## Acceptance criteria

Ticket #43, `## Acceptance criteria`, rows verbatim:

- [ ] `skills/gatekeep-pr/SKILL.md` is under 500 lines (today 589); extracted content lives in `skills/gatekeep-pr/reference/<topic>.md` or a sibling `.md` beside `review-baseline.md`, and SKILL.md names each extracted file inline at the exact step where the agent must read it.
  in-scope
- [ ] Each extracted file holds whole sections at their existing heading level; no heading's content is divided between SKILL.md and an extracted file; SKILL.md keeps only the one-line read pointer at that step.
  deviates: the user chose to reorganize by flow stage and give every rule one owner, so a current section's rules may land in different files (Design, "Reference file ownership"). The surviving guarantee is the rule-survival table plus the token proxy below, not heading atomicity.
- [ ] Content is preserved: `git diff --color-moved=dimmed-zebra` between the pre-split SKILL.md and the concatenation of post-split SKILL.md plus extracted files shows only moved blocks and the added read-pointer lines; no other line changes.
  deviates: the user chose to reword while moving (imperative voice, low conditionality, one owner per rule). Content preservation is verified by the rule-survival table (every row resolves to an owning sentence) and the backticked-token proxy (Verification).
- [ ] Regression check owned by this ticket: one gatekeep-pr run before and one after the split against the same PR of this repo (not the split PR itself), pinned to a head commit named in the split PR's body; the verdict line and the numbered Decision menu entries are identical, and the Evidence lines cite the same set of checks (compared as check names, not wording). Both transcripts are linked from the split PR.
  in-scope
- [ ] `npm test` passes on the branch.
  in-scope
- [ ] `CHANGELOG.md` `## Unreleased` names the split.
  in-scope

After `/skill:shape-ticket` rewrites the ticket body (Design, "Ticket refinement"), the refined ticket text is authoritative and this section is re-synced to the refined rows in the same flow via brainstorming's amend path; the rows above are the contract until then.

## Design

### Files

| Path | Role | Change |
|---|---|---|
| `skills/gatekeep-pr/SKILL.md` | flow-ordered orchestration body | rewritten, 200-250 lines |
| `skills/gatekeep-pr/reference/assessment.md` | Phases 1-4 and inline-first execution | new |
| `skills/gatekeep-pr/reference/findings.md` | finding IDs, total mapping, triage bar, drafted-fixes payload contract, disposition mechanics | new |
| `skills/gatekeep-pr/reference/decision-menu.md` | action vocabulary, selection grammar, consent table, courses table, fork overlay, CI-check gate on merge courses, golden fixtures | new |
| `skills/gatekeep-pr/reference/post-selection-loop.md` | compare-and-swap, fix wave, merge course, re-render, teardown | new |
| `skills/gatekeep-pr/verification-brief.md` | dispatch payload | two pointer retargets only: `:58` "see SKILL.md Phase 2" -> `reference/assessment.md` Phase 2; `:84` "(SKILL.md Phase 4)" -> `reference/findings.md` `## Dispositions` |
| `skills/gatekeep-pr/review-baseline.md` | rubric data | byte-identical |
| `scripts/ci.mjs` | telemetry-salvage probe follows the loop | edited |
| `CHANGELOG.md` | `## Unreleased` entry | edited |

Destination follows `skills/writing-skills/SKILL.md:54`: the four new files are read at a decision point, so they live under `reference/`; the two existing siblings are a dispatch payload and rubric data and stay where `README.md:354,359` and SKILL.md name them.

### Path rule

`scripts/ci.mjs:523-538` resolves every `*.md` token in a marketplace-listed skill's files against the file's own directory. Therefore: SKILL.md names reference files as `reference/<file>.md`; a reference file names a sibling reference file as bare `<file>.md` and the two dispatch payloads as `../verification-brief.md` and `../review-baseline.md`. The `<bin>` definition (`<directory of this skill's SKILL.md>/../../bin`, today `:168-169`) is owned by SKILL.md `## Verdict`, where the merge-precondition sentence first uses it; reference files use `<bin>` without redefining it.

### SKILL.md body, in walk order

| # | Section | Content | Pointer |
|---|---|---|---|
| 0 | frontmatter, title, intro | unchanged frontmatter; verify-don't-trust framing, consent gate, residual risk | - |
| 1 | `## Arguments` | as today (`:27-34`), reworded | - |
| 2 | `## Configuration resolution` | ladder, `## PR gate` schema fence, thin-wrapper contract, merge-base read rule (`:35-83`) | - |
| 3 | `## Progress tracking` | `plan_tracker` init and claim rows (`:84-98`) | - |
| 4 | `## Assess` | topic sentence only: four phases in order, then read the two files | "Read `reference/assessment.md` and `reference/findings.md` now." |
| 5 | `## Verdict` | three states; merge preconditions predicate; `<bin>` definition | "Merge execution per `reference/post-selection-loop.md` `### Merge course`." |
| 6 | `## Report` | terse-by-design rule; the fenced output template kept whole and copy-pasteable, with `:308` reading `<action vocabulary + numbered courses>` (pointer moved out of the fence) | "Consent table and courses per `reference/decision-menu.md`." |
| 7 | `## Decide` | topic sentence only: the menu is the consent table rendered as numbered courses | "Read `reference/decision-menu.md` now." |
| 8 | `## Act` | topic sentence only: the menu is a state machine that loops until merge or stop | "Read `reference/post-selection-loop.md` now." |
| 9 | `## Output done-check` | as today (`:541-556`) | - |
| 10 | `## Red flags - STOP` | one line per rule, each ending `- owner: <section or reference file>` | - |
| 11 | `## Project overrides` | verbatim (`:587-589`), including the `## comms style` sentence | - |

Rows 4, 7, 8 carry a topic sentence and the pointer, never a rule clause; they are pointers under the dedup rule, not owners. `findings.md` is read at `## Assess` because Phase 4 mints `P#`s and applies dispositions before any report renders.

### Reference file ownership

| File | Owns |
|---|---|
| `assessment.md` | `## Phase 1` gather; `## Phase 2` worktree state table and create-vs-reuse record, `mergeable` re-poll; `## Phase 3` verify-then-review, timeout mechanism, tracked-only cleanliness assertion, rubric merge; `## Phase 4` provenance, evidence wording per path, telemetry `--check` probe and its `P#`/follow-up rule, evidence pasting, severity translation, AC coverage, claims, doc-drift auto-apply, and a pointer to `findings.md` `## Dispositions` for CI-check dispositions; `## Inline-first execution` persona mapping, sequential dispatch, `worktree: true` forbidden, one re-dispatch then inline |
| `findings.md` | `## IDs` - `source_ref` definition, `P#`/`L#`/`C#`/`F#` namespaces, total mapping, precedence (Phase 4 and rubric decide blocking; this file picks namespace), `C#` verdict-neutral, `F#` owner field, append-only IDs and `(fixed in <sha>)`, "None" for empty groups; `## Triage` - triage bar, `[quality]`/`[performance]` never downgrade (merged from `:318-323`, `:347-353`, `:569-571`); `## Dispositions` - flaky / real / CI-infrastructure-broken effects on the `P#` and on merge availability, pending required check is wait-until-green and mints no `P#`, failing checks close by disposition not by fix, evidence independence, no consent-surface change (merged from `:192-210`, `:335-346`, `:426-438`); `## Payloads` - drafted-fixes contract and posted-review-body composition |
| `decision-menu.md` | `## Actions` - vocabulary block with availability constraints, `+ tracker <act>` suffix, selection grammar; `## Consent table` (moved from `:264-282`) with GitHub-refused rows and never-approve-own-PR; `## Courses` - author x state table, atomic across pushes; `## Fork overlay`; `## CI-check gate` - effect of each disposition on course rendering (definitions live in `findings.md` `## Dispositions`), pending-only render; `## Fixtures` - listed-but-unavailable, zero-mutation render, both golden fixtures |
| `post-selection-loop.md` | first heading `## Post-selection loop`, all subsections `###`: `### Compare-and-swap` and the course's-own-push exception; `### Fix wave` - worktree-fixable filter, file-less `P#` inline, a claim `P#` with a drafted file edit is worktree-fixable and may batch (owner sentence for `:577-578`), batching by drafted-edit file union with `source_ref` fallback, child contract (`implementer`, `cwd` = PR worktree, edit-only, never delete telemetry), inline below the 2-finding cutoff, parallel above, one commit set with subjects naming the fixes, one evidence re-resolution, telemetry salvage without `--check`, one gate run and one push per wave (merged from `:507-522`, `:523-530`, `:582-585`), red-gate hold and its warning, `push-docs` path, reviews/replies/tracker execution; `### Merge course` - `gh pr merge --match-head-commit`, salvage restore commit push and SHA re-fetch, `restore failed` path, refused selection re-render (moved from `:253-263`); `### Re-render` - claim re-check without a second gate run, `(fixed in <sha>)`; `### Teardown` table (merge success / non-merge stop x created / reused) |

### Dedup rule

Every rule has one owning sentence in SKILL.md or one of the four new files. Every other site is a pointer: "per `reference/<file>.md` `## <section>`" from the body, "per `<file>.md` `## <section>`" between reference files, "per `## <section>`" within one file. Where a rule is stated at several sites today, the owner holds the union of every site's constraints; on a direct conflict the stricter wins and the rule-survival row's "merged from" column names the sites. The council's spot check found no direct conflict among the three triplicated rules, so the conflict branch is a safety net, not an expected path. Red flags never owns a rule: each line points at the sentence it guards. Three rules Red flags states alone today get owner sentences first: merge-base read (`:71-83`, already in `## Configuration resolution`), append-only IDs (`:358-360`, already in `findings.md`), and the claim-`P#`-with-draft-may-batch rule (`:577-578`, new sentence in `### Fix wave`). `verification-brief.md`'s restatements (`:50-54`, `:177-188`) are out of scope for the one-owner rule.

### Wording rule

Every written or moved line follows `skills/writing-skills/SKILL.md` `## Authoring rules`: imperative voice; at most two branches per step, a third goes into a table; no "should", "consider", "you may want to", "it is recommended". Branchy content lands in tables: consent table, courses table, disposition effects, teardown cases, Phase 2 worktree states. Inside the fenced report template and the action-vocabulary block, text is copy-pasteable output and is exempt. Positional words ("above", "below", "see <old section name>") are replaced by pointers naming a heading that exists. The sentence forbidding telemetry deletion keeps `never delete` and `telemetry` on one line for the CI regex.

### Rule-survival table

The reviewer's checklist for "nothing lost". Each row is a line range in `skills/gatekeep-pr/SKILL.md` at `6a6a820` (identical to the branch base) and the owner it resolves to. A row with no owning sentence in the new files fails the conformance gate; the backticked-token proxy in Verification catches sub-rule drops within a row.

| Lines | Rule or content | New owner | Merged from |
|---|---|---|---|
| 1-6 | frontmatter | SKILL.md frontmatter, unchanged | |
| 8-17 | verify-don't-trust framing | SKILL.md intro | |
| 18-21 | consent gate | SKILL.md intro | |
| 23-25 | residual risk | SKILL.md intro | |
| 27-34 | arguments, inference order, never invent ACs | SKILL.md `## Arguments` | |
| 35-53 | four-rung ladder | SKILL.md `## Configuration resolution` | |
| 54-65 | `## PR gate` schema fence | SKILL.md `## Configuration resolution` | |
| 67-72 | thin-wrapper contract | SKILL.md `## Configuration resolution` | |
| 73-83 | merge-base read rule, `git show "$MB:<path>"` recipe, `REVIEW.md`-in-diff exception | SKILL.md `## Configuration resolution` | `:565-566` |
| 84-98 | `plan_tracker` protocol, no-tracker fallback | SKILL.md `## Progress tracking` | |
| 99-102 | four phases in order, read-only through Phase 3 | `assessment.md` intro | |
| 103-107 | Phase 1 gather, fixed `gh` set | `assessment.md` `## Phase 1` | |
| 108-124 | Phase 2 state machine: reuse, wrong-branch STOP, create | `assessment.md` `## Phase 2` | |
| 125 | record create-vs-reuse | `assessment.md` `## Phase 2` | |
| 127-130 | `mergeable` single re-poll | `assessment.md` `## Phase 2` | |
| 131-147 | Phase 3 verify: Section B, timeout ladder, cleanliness assertion, re-provision once | `assessment.md` `## Phase 3` | |
| 148-152 | Phase 3 review: Section C, rubric merge, native output | `assessment.md` `## Phase 3` | |
| 153-166 | Phase 4 provenance, one re-fetch, evidence wording per path | `assessment.md` `## Phase 4` | |
| 167-177 | telemetry `--check` probe, `stripped` -> `P#`, no-push-row -> follow-up, `unfinished` non-blocking | `assessment.md` `## Phase 4` | |
| 178-180 | evidence pasting verbatim, summaries labelled | `assessment.md` `## Phase 4` | `:561` |
| 181-183 | severity translation, unmapped severity fail-safe blocking | `assessment.md` `## Phase 4` | |
| 184-187 | AC coverage | `assessment.md` `## Phase 4` | |
| 188-191 | claims: failed gate, contradicted, unverifiable-pre-merge | `assessment.md` `## Phase 4` | |
| 192-210 | CI checks: three dispositions, pending wait-until-green, evidence independence, no consent change | `findings.md` `## Dispositions` | `:335-346`, `:426-438` |
| 211-217 | doc-drift auto-apply, follow-ups never trigger | `assessment.md` `## Phase 4` | |
| 218-227 | inline path primary, delegation optional | `assessment.md` `## Inline-first execution` | |
| 228-233 | persona mapping | `assessment.md` `## Inline-first execution` | |
| 234-240 | sequential dispatch, `worktree: true` forbidden, re-dispatch once then inline | `assessment.md` `## Inline-first execution` | `:488-495` |
| 241-247 | three verdict states | SKILL.md `## Verdict` | |
| 248-253 | merge preconditions predicate | SKILL.md `## Verdict` | |
| 253-263 | merge execution: `--match-head-commit`, salvage restore push, `(marked shipped)`, `restore failed` | `post-selection-loop.md` `### Merge course` | |
| 264-276 | consent table | `decision-menu.md` `## Consent table` | |
| 277-282 | oracle sentence, GitHub-refused rows, never approve own PR | `decision-menu.md` `## Consent table` | `:559` |
| 283-287 | terse by design | SKILL.md `## Report` | |
| 288-312 | fenced report template | SKILL.md `## Report` | |
| 314-317 | `source_ref` definition | `findings.md` `## IDs` | |
| 318-323 | precedence: Phase 4 decides blocking, this section picks namespace | `findings.md` `## IDs` | |
| 324-334 | total mapping, `P#` vs `L#` boundary | `findings.md` `## IDs` | `:567-568` |
| 335-346 | failing checks close by disposition; three annotations and their effects | `findings.md` `## Dispositions` | `:192-210`, `:426-438` |
| 347-353 | triage bar, `[quality]` never downgrades | `findings.md` `## Triage` | `:318-323`, `:569-571` |
| 354-357 | `C#` verdict-neutral, `F#` owner | `findings.md` `## IDs` | |
| 358-360 | append-only IDs, `(fixed in <sha>)` | `findings.md` `## IDs` | `:566` |
| 361 | empty groups say "None" | `findings.md` `## IDs` | |
| 363-370 | drafted-fixes payload contract, review-body composition | `findings.md` `## Payloads` | |
| 371-374 | Decision has two parts | `decision-menu.md` intro | |
| 375-390 | action vocabulary block | `decision-menu.md` `## Actions` | |
| 392-396 | tracker suffix, selection grammar | `decision-menu.md` `## Actions` | |
| 398-413 | numbered courses, atomic across pushes, courses table | `decision-menu.md` `## Courses` | `:574-575` |
| 415-425 | fork overlay | `decision-menu.md` `## Fork overlay` | `:576-577` |
| 426-438 | CI-check gate on merge courses, pending-only render | `decision-menu.md` `## CI-check gate` | `:192-210`, `:335-346` |
| 439-442 | listed-but-unavailable, zero-mutation render | `decision-menu.md` `## Fixtures` | |
| 443-464 | golden fixtures 1 and 2 | `decision-menu.md` `## Fixtures` | |
| 466-469 | menu is a state machine | `post-selection-loop.md` intro | |
| 470-475 | compare-and-swap, own-push exception | `post-selection-loop.md` `### Compare-and-swap` | |
| 476-482 | fix wave filter, file-less `P#` inline | `post-selection-loop.md` `### Fix wave` | `:577-578` |
| 483-487 | batching by drafted-edit file union, `source_ref` fallback | `post-selection-loop.md` `### Fix wave` | `:579-580` |
| 488-506 | child contract, never delete telemetry, cutoff, parallel batches | `post-selection-loop.md` `### Fix wave` | `:580-582` |
| 507-522 | commit set, evidence re-resolution once, salvage, one push, red-gate hold, `push-docs`, reviews/replies/tracker | `post-selection-loop.md` `### Fix wave` | `:523-530`, `:582-585` |
| 523-530 | re-render, no second gate run, `(fixed in <sha>)`, merge as row 1 | `post-selection-loop.md` `### Re-render` | |
| 531 | loop exit | `post-selection-loop.md` intro | |
| 533-540 | teardown: merge success, non-merge stop, created vs reused | `post-selection-loop.md` `### Teardown` | |
| 541-556 | output done-check | SKILL.md `## Output done-check` | `:586` |
| 557-586 | red flags | SKILL.md `## Red flags - STOP`, one line per rule with owner | |
| 587-589 | project overrides | SKILL.md `## Project overrides`, verbatim | |

### CI

`scripts/ci.mjs:297-300` today reads `skills/gatekeep-pr/SKILL.md`, slices from `^## Post-selection loop` to the next `^## `, and asserts the slice contains `gauntlet-telemetry-salvage.mjs` and matches `/never delete[^\n]*telemetry/`. The probe reads `skills/gatekeep-pr/reference/post-selection-loop.md` instead; the slicing stays and works because the file's only `##` heading is `## Post-selection loop` with `###` subsections; both assertions stay; the two fail messages name the new path.

### Regression procedure (AC 4)

| Step | Action |
|---|---|
| Target PR | at run time, the most recently updated open PR of this repo other than the split PR; when none is open, the most recently merged one (a merged PR renders report-only with `stop`, still a verdict line and a Decision list). Pin its `headRefOid` and name both in the split PR body |
| Before run | with the main checkout installed (`pi install -l ~/repos/pi-gauntlet`, main at `6a6a820`), run `/skill:gatekeep-pr <N>`, select `stop`, accept teardown of the created worktree |
| After run | `pi install -l <split worktree path>`, same PR, same head, same selection and teardown; then reinstall main |
| Compare | verdict line identical; Decision entries identical as course verbs and order (ID ranges such as `P1-P10` normalized out); Evidence check-name set identical |
| Mismatch | rerun the differing side once against the same head; a second mismatch fails AC 4 |
| Transcripts | both saved to a gist and linked from the split PR body |

One run exercises one author x state cell; the rule-survival table is the primary "no rule lost" guarantee and this run is the smoke test the ticket owns.

### Ticket refinement

After spec approval, `/skill:shape-ticket` rewrites #43's body: the Idea names reword + dedupe + reorganize into a flow-ordered body and four `reference/` files; AC 2 and AC 3 are replaced by "every row of the spec's rule-survival table resolves to an owning sentence in the new files, no rule has two owners, and every backticked token of the pre-split SKILL.md appears in the post-split corpus"; AC 1, 4, 5, 6 stay. The exact text is confirmed at that skill's gate.

### Out of scope

- Any change to gatekeep-pr's verdict rules, menu vocabulary, consent table cells, or telemetry hooks.
- Cutting rules that duplicate harness enforcement (e.g. the `worktree: true` prohibition). Needs behavioral evidence per cut; separate ticket.
- Deduplicating `verification-brief.md` against the new files beyond the two pointer retargets.
- Re-anchoring line-number citations in older specs (`doc/specs/2026-09-13-gh-30-code-reviewer-verdict-severity.md:14`, `doc/specs/2026-09-16-plan-tracker-state-contract.md:17,20,111`). Flagged, not fixed.
- Moving `verification-brief.md` or `review-baseline.md`.
- A repo-wide mechanical 500-line CI assertion.
- Splitting `chase-bug` or `writing-skills`.

## Edge cases

- Several sites state one rule: the owner holds the union; direct conflict -> stricter wins; the row's "merged from" column names the sites.
- The fenced report template stays copy-pasteable: no pointer text inside the fence; `:308` becomes `<action vocabulary + numbered courses>`.
- Consent table, courses table, and fork overlay stay in one file so a render needs no cross-file lookup.
- A pointer names the file and, where the file has more than one `##`, the section; positional words are gone.

## Verification

| Check | Method | Pass |
|---|---|---|
| Ceiling | `wc -l skills/gatekeep-pr/SKILL.md` | < 500 (target 200-250) |
| CI | `npm test` | green, including the redirected probe and the marketplace bundle-local ref check |
| Rule survival | reviewer walks every row of the rule-survival table against the new files | every row resolves; no rule has two owning sentences in SKILL.md plus the four new files |
| Token proxy | `rg -o '`[^`]+`' <(git show 6a6a820:skills/gatekeep-pr/SKILL.md) \| sort -u` diffed against the same over `skills/gatekeep-pr/SKILL.md skills/gatekeep-pr/reference/*.md` | every pre-split token present post-split |
| Hedges | `rg -n -i 'should\|consider\|you may want\|it is recommended' skills/gatekeep-pr/SKILL.md skills/gatekeep-pr/reference/` and `rg -n -i '\b(may\|might\|could\|if appropriate)\b'` over the same files, reviewed line by line | first: zero matches outside the verbatim `## Project overrides` block; second: every hit is inside a fence or a quoted GitHub string |
| Positional refs | `rg -n -w 'above\|below' skills/gatekeep-pr/SKILL.md skills/gatekeep-pr/reference/` | zero matches; every "per `<file>` `## <section>`" pointer names an existing heading |
| Placeholders | `rg -n 'TODO\|TBD\|<fill in>' skills/gatekeep-pr/` | zero matches |
| Regression (AC 4) | the Regression procedure | identical verdict line, identical course verbs and order, same Evidence check-name set; both transcripts linked |
| Existing companions | `git diff 6a6a820 -- skills/gatekeep-pr/review-baseline.md` empty; `git diff 6a6a820 -- skills/gatekeep-pr/verification-brief.md` touches only `:58` and `:84` | as stated |

The `\|` in the `rg` patterns above is markdown-table escaping; the shell commands use a bare `|`.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md` (`## Unreleased`: the split and the four reference files); ticket #43 body via `/skill:shape-ticket`
- Derived / memory docs invalidated: none (`README.md:354,359` references to `review-baseline.md` stay valid; `AGENTS.md` names no gatekeep-pr paths)

Per `reference/documentation-impact.md` (brainstorming skill), the new reference files are skill bodies - implementation surface - not doc-impact entries.

## Open questions

none
