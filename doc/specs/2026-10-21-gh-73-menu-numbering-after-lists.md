# Menu numbering after ordered lists (#73)

**Goal:** Decision menus whose message carries a numbered list above the options render as `1.`-`N.` in pi's Markdown component, and a numeric reply that was typed against merged numbering is mapped to the intended option and echoed before the agent acts.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Ticket:** jjuraszek/pi-gauntlet#73
**Worktree:** `.worktrees/gh-73-menu-numbering`

## Problem

pi-tui's `Markdown` component (marked 18.0.11, verified in the pi 1.3.0 install) merges two ordered lists separated only by a blank line into one list. A gate message that lists three findings as `1.`-`3.` and then offers options `1.`-`3.` displays the options as `4.`-`6.`. The human types `5`, the agent reads `5` against a three-option menu, and either re-asks or guesses. Three sessions (chase-bug 2026-09-03, shape-ticket 2026-09-15, gatekeep-pr 2026-10-19) show the trigger; none shows a wrong action yet.

Verified layouts (lexer and `Markdown.render(60)`): a prose line between the lists, a `---` rule between them, or the preceding list written as bullets all keep the options at `1.`-`3.`. Every listed menu template already sits under a prose line (`Proof:`, `Verdict:`, `Implementation complete. What would you like to do?`) or under bullets; the exposure the three sessions show is model-authored numbered content (findings, blockers, hypotheses the agent writes as `1.`-`3.` in the same message) placed directly above the options. The shared rule guards that authored content; no template today places an ordered list above a menu. Options written `1)`-`3)` also start a new list under CommonMark; the user kept the ticket's framing (shared rule plus permitted layouts) over that delimiter convention.

Implicit dependencies: pi-tui and `marked` exist only in the pi install (`~/.pi/agent/install/releases/<version>/node_modules`), not in the repo's `package.json` or CI, so the render check is a one-off observation, not a committed test. `eval/check-delivery/` does not exist and is created. Text eval targets replay with `--no-tools` (`eval/lib/replay.mjs` `textArgs`), so a cite link is inert under eval: the shared reference reaches the model only through the assembly (`target.json` `skillFiles` or a sample's `bundle+`). The eval runner reads every assembled path from the baseline commit too (`eval/run.mjs` `checkedReader`, refusing with `use --base <ref>` when a file is missing there), so the new reference lands in its own commit before the site edits and eval runs pass `--base <that commit>`.

Framing: kept - user chose the shared rule with one cite line per site; constraint: the layouts are stated once and never duplicated at a site.

## Acceptance criteria

Ticket #73, `Acceptance criteria`, rows verbatim:

- [ ] Every skill or reference file that instructs the model to present numbered options cites one rule, stated in one shared reference file whose location the implementer chooses, that a numbered option list never directly follows another ordered list in the same message, naming the permitted layouts (preceding content as bullets, a prose line, a horizontal rule); each citation is a relative path that resolves. Known locations today: `skills/shape-ticket/SKILL.md` (confirmation gate), `skills/chase-bug/SKILL.md` (three menus), `skills/gatekeep-pr/reference/decision-menu.md`, `skills/gatekeep-pr/reference/report.md`, `skills/check-delivery/SKILL.md` (confirmation gate), `skills/finishing-a-development-branch/SKILL.md` (Step 4); `skills/brainstorming/reference/spec-finalization.md` keeps its `1 - approve` rows and is exempt.
  in-scope
- [ ] For each permitted layout, a message with three preceding numbered items and options written as `1.`-`3.`, rendered through the Markdown component of pi-tui in the pi install (`node_modules/@earendil-works/pi-tui`), shows the option lines as `1.`-`3.`; the control message with the two ordered lists separated only by a blank line shows them as `4.`-`6.`. Any supporting parser assertion counts ordered-list tokens, not all list tokens.
  in-scope
- [ ] A gate that receives a numeric reply outside `1`-`N` and whose message carries an ordered list above the options re-reads the reply against the rendered numbering (reply minus the count of preceding ordered items) and names the mapped option back to the human before acting on it; it never acts on the raw number and never silently re-asks.
  in-scope
- [ ] Each edited skill's `eval/<target>/` carries a sample where the gate renders after a numbered list, with the layout rule and the out-of-range reply mapping as must-hold facts, and `node eval/run.mjs <target>` passes for the changed cells (`check-delivery` has no target today and gets one per `eval/README.md`).
  in-scope

## Design

### The shared reference

New file `skills/brainstorming/reference/menu-layout.md`, under 40 lines, three sections. It is the only place the layouts and the mapping are written; a site that restates either is a defect.

- `## Exposure` - a numbered option list placed directly below another ordered list, separated only by a blank line, merges into it under CommonMark and displays as `N+1.`-`N+k.`.
- `## Permitted layouts` - one shared failing control (three items, blank line, options; shown once, rendering `4.`-`6.`), then exactly three layouts with one compact example each: (1) a prose line between the list and the menu (the default pick; an instruction such as `Verdict:` or `Pick one:`), (2) a `---` rule between them, (3) the preceding list written as bullets.
- `## Reply mapping` - applies only to a bare numeric reply to a numbered option menu. `L` is the item count of the ordered-list run the options merge into: every ordered list joined to the options by blank lines alone, back to the nearest prose line, rule, or bullet block. A permitted separator directly above the options gives `L = 0`; an earlier ordered list separated by prose, a rule, or bullets contributes nothing. A reply `R` with `R > N` options and `1 <= R - L <= N` resolves to option `R - L`; the agent writes one sentence naming the resolution (`Taking 5 as option 2 - merge`) before acting; any other out-of-range reply gets a clarifying question that names the valid range. A reply in `1`-`N` is taken as written and never re-mapped.

The file lives beside `amendment-surface.md`, `ticket-acceptance.md`, and `superseding.md`. Sibling skill roots already cite that directory as `../brainstorming/reference/<file>.md` (`finishing-a-development-branch/SKILL.md:97`); files under `gatekeep-pr/reference/` cite it as `../../brainstorming/reference/<file>.md` (`assessment.md:71`).

### Site edits

Each site gets one imperative cite line directly before its fenced menu template, outside the fence (inside the fence it would render to the human as menu text): `Read and apply [menu-layout](<path>) before presenting these options and before acting on a numeric reply.` The line instructs; it never restates a layout or the mapping. `<path>` is `../brainstorming/reference/menu-layout.md` from a `skills/<name>/SKILL.md` and `../../brainstorming/reference/menu-layout.md` from `skills/gatekeep-pr/reference/*.md`. Every listed template already follows a prose line or bullets, so no template changes layout; the only template edit is check-delivery's new two-option menu.

| Site | Current state | Edit |
|---|---|---|
| `skills/shape-ticket/SKILL.md` ~114 (confirmation gate) | bullets above, menu wording only | cite line only |
| `skills/chase-bug/SKILL.md` 164-184 (real-bug menus) | menu follows the `Proof:` prose line; the hypothesis list goes below the fault story, never above | cite line only |
| `skills/chase-bug/SKILL.md` 238-262 (negative verdict) | `Verdict:` prose line present | cite line only |
| `skills/chase-bug/SKILL.md` 388-391 (worked example) | options follow the `Proof:` line | cite line only; example text unchanged |
| `skills/gatekeep-pr/reference/decision-menu.md` 123-171 | menu contract; fixtures keep `Verdict:`; fixture 5's `AC coverage` block is `- [ ]` bullets | cite line in the contract; fixtures unchanged |
| `skills/gatekeep-pr/reference/report.md` 20-40 | `Verdict:` already separates numbered `Blockers:` from `<menu>`; holds no AC checklist | cite line only (ticket-required) |
| `skills/gatekeep-pr/reference/post-selection-loop.md` ~94 (`## AC coverage`) | owns the post-merge block, already `- [ ]` bullets (layout 3), rendered beside the re-rendered menu | cite line on the rendering instruction; block unchanged |
| `skills/check-delivery/SKILL.md` 252-270 (confirmation gate) | explicit yes-gate, no numbered options; steps 1-2 are the post-approval write procedure below the gate | cite line; the gate presents `1. approve the write` / `2. decline`; selecting `1` is the explicit yes, `2` or anything else is no write; the write boundary and the steps below are unchanged |
| `skills/finishing-a-development-branch/SKILL.md` Step 4 (both menus) | both open with a prose line (`Implementation complete. What would you like to do?`, the detached-HEAD line); the amendment digest above is bullets | cite line only on both menus |
| `skills/gauntlet-resume/SKILL.md` 44 (discovery route) | dynamic `<n>. <title>` candidates with a numeric pick; nothing ordered above | cite line only |

`skills/brainstorming/reference/spec-finalization.md` is untouched per the ticket. Numbered decision items with lettered choices (#63 briefs in `amendment-surface.md`, `disposition-protocol.md`) are not numeric option menus and get no cite line.

### Inventory of unlisted surfaces

Settled here, no amendment step. AC 1 covers every file that instructs numbered options, exposed or not, which is why `gauntlet-resume` joins the table. `rg -n -B3 "^\s*1\. " skills/gauntlet-resume/SKILL.md skills/chase-bug/hotfix.md skills/gatekeep-pr/reference/post-selection-loop.md skills/gatekeep-pr/SKILL.md skills/brainstorming/reference/amendment-surface.md` hits `hotfix.md:24,179`, `gauntlet-resume:71`, `post-selection-loop:112`, `gatekeep-pr/SKILL.md:46`, `amendment-surface:112,160,185`; every hit is a procedure or a #63 item list under a prose header, none a numeric option menu. The table above is the full site list.

### Evals

Per `eval/README.md`: targets `shape-ticket`, `chase-bug`, `gatekeep-pr`, `finishing-a-development-branch`, and `gauntlet-resume` each gain one sample; `eval/check-delivery/` is created by copying all of `eval/_template` (`intent.md`, `README.md`, `replay.md`, `target.json`, `samples/`; lint refuses a target without `replay.md`) with one sample, its `target.json` slicing `## Confirmation gate and the batched write`.

Assembly: where a target's `skillFiles` assembly contains a cite line (`shape-ticket`, `gatekeep-pr`, `check-delivery`), its `target.json` adds `skills/brainstorming/reference/menu-layout.md` as a whole-file entry, so every sample that sees the cite also sees the rule it points to; every cell in those targets re-runs once, and their new `case.md` carries no `bundle+` for the reference. Where the slices exclude every cite line (`chase-bug`, `finishing-a-development-branch`, `gauntlet-resume`), `target.json` is unchanged and the new `case.md` opens with `bundle+: skills/brainstorming/reference/menu-layout.md`. `chase-bug`, `finishing-a-development-branch`, and `gauntlet-resume` also add `bundle+: skills/<name>/SKILL.md`, because their slices (`### 5`, `### Step 6`, `## Boundaries`-`## Arguments`) exclude the menu sections and `bundle+` takes whole files; the slice repeats inside that one sample's assembly, accepted over widening the shared slice. `shape-ticket`'s slice already includes `### 8 - Confirmation gate` and does not widen; `gatekeep-pr` loads `decision-menu.md`, `report.md`, and `post-selection-loop.md` whole.

Replay entry: `finishing-a-development-branch/replay.md` and `shape-ticket/replay.md` pin one workflow stage (Step 6 after squash; step 4 Draft plus the AC gate). Both become the template's generic sentence plus `The case names the step you are at.`, and each existing `case.md` gains one leading line naming its former stage, so no existing sample moves stage; those cells re-run once because `inputSha` changes.

Sample shape: one `case.md` per target, one judged output with two independently judged checkpoints. Checkpoint 1: the transcript ends with the skill's input and the candidate must author the gate message itself, in which three ordered findings (or candidates, or blockers) precede the options in the same assistant message; must-hold: the generated options render `1.`-`N.` under one of the three layouts (no ordered list directly above the options). Checkpoint 2: the case then supplies a legacy assistant message for the same gate with three ordered items, a blank line, and the options `1.`-`N.`, followed by the human reply `R = 3 + k`; must-hold: the candidate names option `k` by its label in one sentence before any simulated action, never acts on `R` as written, never re-asks silently. Per target (`N`, `L=3`, `R`, `k`, label): shape-ticket (its gate's N; `R = 3 + 1`, approve), chase-bug real-bug menu (`N=4`, `R=5`, `k=2`, Brainstorm now), gatekeep-pr fixture 1 menu (`N=6`, `R=7`, `k=4`, reply), finishing Step 4 named-branch menu (`N=5`, `R=6`, `k=3`, Squash-merge to <base-branch>), check-delivery (`N=2`, `R=4`, `k=1`, approve the write; also a plain `yes` is taken as approval and never offset-mapped), gauntlet-resume (three candidates, `N=3`, `R=5`, `k=2`, the second brief's title). The judge scores generated text only; layout text already supplied in the transcript is never a fact.

`intent.md` is updated in all six targets (`## Change`, `## Expected to move` naming the new sample's facts). Its `for:` binds to the bundle-free `skillFiles` assembly, so it is rewritten where that assembly changes: `shape-ticket` (gate inside the slice, added reference), `gatekeep-pr` (whole reference files, added reference), and the new `check-delivery`; `chase-bug`, `finishing-a-development-branch`, and `gauntlet-resume` slices exclude the edited lines, so their `for:` stays unless the driver prints a mismatch. `eval/brainstorming/target.json` does not add `menu-layout.md`: brainstorming's own gate is exempt.

## Errors and edge cases

- A reply `R > N` where `R - L` is outside `1`-`N` (a `9` on three options after two items) gets the clarifying question; the agent never guesses.
- A reply that fits both readings (in range and equal to `L + k`) is taken in range, silently; the echo sentence appears only for mapped replies.
- A message with an earlier two-item ordered list, a prose line, then three ordered items, a blank line, and the options renders the options `4.`-`6.` (verified: lexer returns separate ordered lists of 2 and 6 items); `L = 3`, so reply `6` is option 3, never option 1. Two ordered lists joined to each other and to the options by blank lines alone merge into one run and `L` is their sum. A message whose block directly above the options is prose, a rule, or bullets has `L = 0` and no mapping applies; its out-of-range reply gets the clarifying question.
- A menu site that already has a bullet list or a prose line above it is safe and gets only the cite line.
- Compound `<n>: <handle>=<choice>` replies and the bare-`1` shortcut on #63 item briefs belong to `disposition-protocol.md` and are not menu selections; the mapping never touches them.
- The reference never lists its citing sites, so a later site adds one cite line and no edit to the reference.

## Tests

- `npm test` (`scripts/ci.mjs`): skill lint, instruction-size lint, eval structural lint against `eval/_template` for the new `check-delivery` target, eval hygiene scan.
- AC 2 render check: a throwaway script under `$TMPDIR` that renders the four layouts (three permitted plus the blank-line control) through `Markdown` from the pi install's `@earendil-works/pi-tui` and the control through `marked`'s lexer, asserting the option lines start `1.`, `2.`, `3.` for the permitted layouts and `4.`, `5.`, `6.` for the control, and that the `marked` token count is of `type === "list" && ordered` tokens. Output goes into the PR verification section and the telemetry record. Not committed: neither package is a repo dependency and CI has no pi install.
- Evals: `node eval/run.mjs <target> --base <sha of the commit that adds menu-layout.md>` per changed target (six targets), per-sample while iterating, full target at the end; committed `report.md` per target. The commit body states the edit is behavior-changing. `gatekeep-pr`'s committed report keeps its pre-existing `exit: 1`: the new sample's two facts hold on both models, and the regressed and inconclusive cells (`scoped-test-red-sync` S1, `conflict-free-sync` f5, `wave-closure-retry` w3) judge sync-step and evidence wording this change never edits; main's report was already `exit: 1` on that target, so those cells are accepted as unrelated rather than re-run.
- Cite-path resolution: `rg -o "\]\([^)]*menu-layout\.md\)" skills/` and a `test -f` against each resolved path, in the plan's verification step.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: CHANGELOG.md - deferred: release
- Derived / memory docs invalidated: none

Per `reference/documentation-impact.md`: skill bodies and `reference/` files are implementation surface; `README.md` and `doc/configuration.md` do not describe menu rendering, so nothing drifts.

## Out of scope

- #63's mid-flow decision-brief grammar (numbered items, lettered choices, bare `1`), shipped in v7.12.0 per the owner's comment; not re-verified here and not changed.
- A committed render test with `marked` or pi-tui as a devDependency.
- A CI lint rejecting an ordered list directly above `<menu>` in skill files; no template today has one, so there is nothing for a lint to catch.
- Switching menus to `1)` delimiters or lettered options.

## Open questions

none - the #63 shipment claim rests on the owner comment, but `disposition-protocol.md:30-36` carries the lettered-option grammar and the silent legacy-form acceptance today, which is all this spec relies on.
