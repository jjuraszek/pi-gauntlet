# Brainstorming challenges the ask: framing question, pattern-judged approaches, replay validation

> **Superseded by:** [doc/specs/2026-10-07-gh-50-universal-eval-template.md](./2026-10-07-gh-50-universal-eval-template.md) - the `eval/brainstorming/` sample package only; section 6 "Replay harness" stays live

**Goal:** Make `/skill:brainstorming` challenge the idea behind the initial ask instead of hardening it, with the challenge shape fixed so that a compliant driver model produces one and a pushy driver model stays bounded to one, and validate the change by replaying historical brainstorms on two driver models before and after the edit.

## Problem

The skill's design content is three short passages: the premise note in `### 3. Understand the idea` (verifies claims), `### 4. Explore approaches` (one sentence: "Propose 2-3 approaches with trade-offs"), and `### 5. Design for clarity and isolation` (one sentence). Nothing asks whether the ask is the right change - misdiagnosed, wrong-sized, already solved, a band-aid where the root cause is reachable, or cutting across a sound pattern - and nothing requires an approach that drops an assumption the ask makes. The explicit path is compliance-shaped; pushback appears only when the driver model brings it. In practice two of the four driver models in use challenge the ask and two follow it, on the same skill text.

The only normalizer available to a skill (skills never name models; `scripts/model-literal-lint.mjs`) is output shape: a required slot with a mandatory null form, the convention this skill already uses (`Predecessor: none`, `Docs touched: none`). A required framing slot forces a compliant model to look, and a fixed question format bounds a pushy model to recommending rather than pivoting on its own.

Repo convention is evidence, not authority. A pattern the repo already follows can itself be the debt; "it matches what is there" is never a sufficient reason for an approach.

Framing: kept - the ask (challenge the idea, not the claims; keep the council unchanged; validate by replay) survived the questionary unchanged; the one correction is that the scout supplies evidence and the main loop owns the judgment.

## Acceptance criteria

none - no ticket

## Design

Supersedes: none. `doc/specs/2026-10-01-questionary-options-format.md` is extended (its question format is reused for the framing question), not replaced. `doc/specs/2026-09-24-gh-52-scout-predecessor-anchors.md`'s scout template gains one finding; its contract is untouched.

The spec council (`agents/spec-council-member.md`, `agents/spec-council-synthesizer.md`, `/skill:roasting-the-spec`) is out of scope and unchanged: it critiques after two user approvals, where a wrong-problem finding can only trigger a redraw.

### 1. Scout template gains a framing finding (`skills/brainstorming/gatherer.md`)

Inside the scout blockquote, after the "already solves any of this" clause and before the predecessor check, add one required finding:

```
Framing: <the strongest cited case that the request as framed is the wrong change - a path that already covers it, a sound convention it cuts across, an existing convention it would extend that is itself the debt, a band-aid where the root cause is reachable, or a smaller change with the same outcome>
```

or `Framing: no objection - checked <what was read>`. The template states that this line is evidence for the design discussion, not a verdict; the main loop decides. The finding reaches step 4 through the existing draft assembly (`## Codebase recon`), so no new plumbing.

### 2. Framing question in `### 3. Understand the idea` (`skills/brainstorming/SKILL.md`)

A new paragraph after the premise-note paragraph:

- Before question one, verify the draft's `Framing:` line against primary code and add the main loop's own recon. The framing check adds to the premise verification above and never replaces it: every consumer, caller, or data path the ask's constraints name is traced before the holds-statement or the question is written, and the holds-statement names those traces, not only the files read. A concern exists when the main loop can state a cited case that the ask is misdiagnosed, wrong-sized, already solved, a band-aid where the root cause is reachable, or cuts across a sound pattern (or extends a repo convention that is itself the debt) **and** can name the alternative it implies. A scout objection without an alternative is a lead: the main loop investigates and derives the alternative itself; if none can be derived, there is no concern and the holds-statement names that objection among the things checked.
- With a concern, question one is the framing question in the standard questionary format:

  ```
  A) as framed
  B) pivot: <named alternative> - <cited reason>
  C) smaller or none: <what ships, or what happens if nothing ships>
  Recommendation: <letter> - <why>
  ```

  Option B always names a concrete alternative with its cited reason; for a band-aid concern, B carries the root-cause alternative. Without a concern, the first message opens with one sentence naming what was checked ("The framing holds: checked <x>, <y>") and continues to the first ordinary question; a holds-statement that names nothing is a Red Flag.
- Precedence with the premise note: when a contradicted load-bearing claim and a framing concern both exist, the first message carries the corrected fact with its source first, then the framing question. The Red Flag accepts this combined form.
- Asked at most once per brainstorm, including after pushback; the user's reply is final. Later doubts on the same point go to Open Questions or a `Pattern:` line, never a second framing question. The recommendation is where a pushy model is bounded: recommend, never pivot unilaterally.
- A ticket-recorded decision on the exact point follows the existing rule (adopt and cite; ask only on a cited code or API contradiction); an adopted decision is recorded as `Framing: kept (ticket <id>)`. A pivot never rewrites AC rows; ACs the pivot no longer satisfies take `deviates:` dispositions through ticket handling. A pivot that changes the topic re-mints the slug under the existing rule.
- Record the outcome in the draft under `## Appended during questionary` as `Framing: kept` or `Framing: pivoted to <x> - <why>`; spec-writing carries it into `## Problem`.
- Redraw entry (resume at checklist step 4) starts a new count: the framing evaluation runs once against the new draft before approaches, and may ask the framing question again; on redraw the draft is the approved spec, so its `## Problem` `Framing:` line is context, not scout evidence, and the new outcome is recorded directly in `## Problem`; the amend path is untouched.
- When the scout failed (degraded recon) there is no `Framing:` line; the main loop still owes the holds-statement or the question from its own recon.

One Bad/Good example pair in the existing style: Bad - a pure objection ("the ask adds another settings path - should we?"); Good - the question with a named alternative and a cited reason.

### 3. Approaches judged by pattern (`### 4. Explore approaches`)

Replace the one-sentence section with:

- Propose 2-3 genuinely distinct approaches and name what separates them (the axis), comparing them on explicit trade-offs.
- Consider two candidates in every set: the minimal reuse-only option (no new construct) and an option that drops an assumption the ask makes which the framing reply did not settle. Each is listed when viable; when not, one sentence with evidence says why ("reuse-only: not viable - the only existing path is the one identified as debt"). A non-viable candidate is not an approach and does not count toward the 2-3. An approach that extends identified debt is never the recommendation - except when the framing reply or an adopted ticket decision kept the ask as framed: then recommend the best as-framed approach and name the debt in its `Pattern:` line.
- Each approach ends `Pattern: <what it follows or cuts across, cited to a repo location>`. Judge against sound engineering practice first, then repo rules; when the repo's own convention is the debt, say so and the approach must not extend it. The skill gives two or three illustrative examples only (a band-aid over a shared contract, a second settings path beside the owning one, a layer bypassed for one caller) and no catalogue; the judgment comes from the repo and the model's own engineering knowledge.
- Lead with the recommendation and end with the condition that would flip it.
- Conversational prose unless the user asks for a table (kept).

### 4. Convention wording (`### 5. Design for clarity and isolation`)

Reword "existing conventions" to "existing conventions when they are sound; when the convention is the debt, say so and do not extend it". No other change.

### 5. Red Flags and spec record

- Red Flags gains `Approaches before the framing question or the holds-statement (either may follow the premise correction in the same message); a holds-statement that names nothing checked ([owner](#3-understand-the-idea))`.
- `## Problem` of every spec carries the `Framing:` line, copied from the draft's `## Appended during questionary` at spec-writing (this spec is the first instance). `reference/spec-finalization.md`'s inline lint does not change; the line is a Problem clause the summarizer already carries as part of the section.

### 6. Replay harness (dev-only, never committed)

Location `build/brainstorm-replay/` (already gitignored). Not a bin, not under `npm test`, no `package.json` entry; the plan tracks it as a verification step. `build/brainstorm-replay/report.md` is the experiment note the ship gate reads.

**Cases.** `cases.json` names three cases from the consumer repos' session transcripts and shipped specs - `P1`, `P2` (the shipped design departed from the ask: `deviates:` rows or a recorded questionary pivot) and `N1` (shipped as asked). Each case holds the transcript path, the shipped spec path, the base commit, the original ask, and the label. Model ids for the two driver candidates, the fixed scout model, the three judges, and the user-sim live here too; nothing under `skills/`, `agents/`, `extensions/`, `README.md`, or `AGENTS.md` names a model.

**Skill variants and isolation.** `before` = `skills/` from this worktree's base commit, checked out via `git show`/`git archive` into a scratch dir; `after` = this worktree's `skills/`. Never the installed package. Each session gets a scratch `agentDir` (no installed skills or extensions discovered) with `modelRuntime` built from the real agent dir, and the variant's skill tree supplied through the resource loader's skill override. Before accepting a run, the runner asserts the resolved `brainstorming` skill path and the SHA-256 of its `SKILL.md` and `gatherer.md` match the intended variant and records both in the run log. Every session (scout, driver, user-sim, judge) runs with a scratch `HOME`, a `PATH` holding only shim stubs for tracker and forge CLIs, git, node, and the base system binaries (`/usr/bin`, `/bin`), and every provider API-key, tracker, and pi environment variable removed, so no session can read the live tracker, later commits, or the operator's credentials; the scratch checkout holds only the base commit (shallow fetch of that sha, no other refs).

**Scout path.** Per case and variant, the runner dispatches the scout once on the historical base with the variant's gatherer template and the fixed scout model, assembles the draft exactly as `gatherer.md` does, and retains it under `runs/<case>/scout/<variant>.md`. The driver runs for that case and variant read this draft, so the changed scout-to-driver path is exercised; the recorded historical draft is kept for audit only.

**Driver runs** (pi SDK `createAgentSession`, `SessionManager.inMemory()`, `cwd` = scratch worktree at the base commit with the variant draft placed at the spec path, `model` = candidate). The opening prompt reuses the redraw wording: "Resume `/skill:brainstorming` at checklist step 4 with the draft at `<spec path>`; steps 1-3 are done." Stubbed tools (`customTools`): `phase_tracker` and `plan_tracker` return `{ ok: true }`; `gauntlet_setting` returns the schema-correct `flowGuards` payload whose `specDirs` holds the case's own spec directory (the consumer repo nests `doc/specs` per package) and the real shape for the other keys; `subagent` returns an explicit "unavailable in replay - do the recon directly" error, never a success without output. Completion: a candidate message presenting two or more approaches and a recommendation - the approaches message under either skill variant - or, when the driver skips that message, its first round-1 design presentation or spec write (recorded as the fact `approachesSkipped`, a driver habit the judges see, not a harness failure); `Pattern:` lines and the flip condition are recorded as facts of the after-runs, never as completion gates; the turn cap is 12, after which the run is `incomplete`.

**User-sim.** Answers each candidate question from the original ask, the recorded questionary answers, and the recorded user constraints only; the shipped spec is withheld from it. A question the record does not answer gets "not decided - your call" tagged `unanswered`. The transcript marks every alternative the sim supplied so judges can separate driver-originated alternatives from supplied ones.

**Matrix.** 3 cases x 2 candidates x 2 variants x 2 reps = 24 driver runs plus 6 scout runs. An `incomplete` run is re-run once; a second `incomplete` makes the whole experiment `fail` (no verdict is issued on partial coverage).

**Judges.** Three configured models each receive, for one case and candidate, all four driver transcripts (both reps of both variants), the variant drafts, the shipped spec as reference evidence, and the rubric below. Each returns `baseline: compliant | pushy` (from the before transcripts), `verdict: regression | progression | neutral`, the four facts, and a cited rationale.

Rubric:
- `regression` - the after-runs lose a diagnosis the before-runs had; pivot unilaterally (design proceeds on B/C without asking); drop a recorded user constraint; invent a pivot on `N1` with no cited concern; make the shipped-spec pivot unreachable from the approach set on `P1`/`P2`; or produce approaches that extend identified debt as the recommendation.
- `progression` - the after-runs cite a concern to a repo location and name a sound alternative where the before-runs had none; or the approach set is better bounded (viable minimal option present, pattern diagnosis sound) with no regression marker. The shipped pivot is reference evidence; a sound alternative the shipped spec did not take also counts.
- `neutral` - otherwise.
- Facts: framing concern cited to a repo location; alternative named by the driver (not supplied by the sim); for `P1`/`P2`, the alternative or approach set contains the shipped pivot; for `N1`, a pivot was invented.

**Aggregation.** Per case and candidate: majority of three verdicts; a non-verdict is re-asked once, then `abstain`; no majority (including 1-1-abstain) is `unresolved`. Baseline label per candidate = majority of its judges' `baseline` across cases. Experiment outcome: `pass` when every case and candidate has a verdict, none is `regression`, and the candidate labeled `compliant` at baseline has at least one `progression`; `fail` when any verdict is `regression` or any run stayed `incomplete`; `not demonstrated` when there is no `regression` but the `compliant` candidate has no `progression` or any cell is `unresolved`. `report.md` records the table, the outcome, and each rationale.

The chat report carries labels, verdicts, and the outcome only, no case text. `report.md` (gitignored, local audit artifact) carries the rationales with ticket ids, consumer paths, and project identifiers redacted; it is never pasted into chat or committed.

## Errors and edge cases

- Missing transcript, spec, or base commit for a case: rejected at load with the path; never substituted.
- Skill-hash assertion fails: the run aborts before the first prompt and the report names the resolved path.
- Scout run fails for a variant: the case is `incomplete` for that variant (the degraded-draft text would change what the driver sees); re-run once, then `fail`.
- Judge returns anything but the three verdicts: re-asked once, then `abstain`; see Aggregation.
- User-sim asked a question the record does not answer: "not decided - your call", tagged `unanswered`; judges see the tag.
- Skill edge cases are listed in Design 2 (no concern, scout objection without alternative, premise-correction precedence, scout failed, ticket decision, pivot vs ACs, redraw, amend).

## Tests

- `scripts/brainstorming-contract.test.mjs` pins: the `Framing:` template line and the evidence-not-verdict sentence in `gatherer.md`; the framing-question format (`A) as framed`, `B) pivot:`, `C) smaller or none:`), the holds-statement, the precedence sentence, and the once-per-brainstorm bound in SKILL.md `### 3`; the axis, the reuse-only and drop-an-assumption candidates with their not-viable form, the `Pattern:` line, the never-recommend-debt rule, and the flip condition in `### 4`; the reworded `### 5` clause; the new Red Flag; the 13-item checklist unchanged.
- `npm test` stays green (skill lint, stage-skill lint, model-literal-lint on `skills/`, `rg -ni "jjuraszek|/Users/[^/]+" skills/` returns nothing new).
- Replay harness outcome (`pass | fail | not demonstrated`) with its table is the experiment note the ship gate reads from `build/brainstorm-replay/report.md`; `fail` blocks. The `pass` clause requires a candidate the judges label `compliant` at baseline; both candidates in use were labeled `pushy` on the positive cases, so that clause has no subject for this pair and the accepted ship evidence is: no `regression` majority in any cell after the "framing check adds to premise verification" amendment, at least one `progression` majority on the weaker-baseline candidate, and `pivot_invented=false` on the negative control. The matrix is rerun against the final skill text (HEAD) before ship so the judged after-variant hash matches the shipped `SKILL.md` and `gatherer.md`.
- A committed eval package at `eval/brainstorming/` follows the `eval/<target>/` convention (`README.md`, `run.mjs`, `run.test.mjs`, `reviewer-prompt.md`, `sample/<slug>/source.md` + `expected.md`, `results/`): the three replay cases become anonymized samples (ask, gather draft, recorded questionary answers, fixture stubs the framing concern cites) with human-approved must-hold facts derived from the shipped spec and the judges' agreement; `run.mjs` replays the first-message (framing question or holds-statement) and approaches slices against the frozen fixture with no tools and scores them with the reviewer prompt; `run.test.mjs` asserts sample shape and runs under `npm test`; the `scripts/ci.mjs` hygiene scan over `eval/` gains the consumer-project tokens so no proprietary name, ticket id, path, or symbol lands in the public repo. A baseline note lands on GitHub issue #50.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` - the brainstorming step description gains the framing question and the pattern-judged approaches (major procedures / conventions: a consumer observes a new first question); `CHANGELOG.md` - `## Unreleased` entry with the change
- Derived / memory docs invalidated: none

Per `reference/documentation-impact.md`. `doc/configuration.md` was a candidate and is dropped: no settings key changes. Skill and reference bodies are implementation surface.

## Out of scope

- Any change to the spec council, synthesizer, `/skill:roasting-the-spec`, or persona frontmatter.
- A new persona, a new dispatch slot, or a settings key.
- A pattern catalogue in the skill.
- Shipping the live-tool harness under `build/`, or running it under `npm test` (the committed `eval/brainstorming/` package is the frozen-fixture, no-tools slice of it).

## Open questions

- Whether a judge model separates a real pivot from a well-worded fake one; `N1`'s invented-pivot fact and the driver-vs-supplied alternative marking are the measurement, and the answer arrives with the experiment note.
- Whether the fixed scout model raises a framing concern often enough to matter; the paired scout runs measure it, and if it never does, the main loop's own recon carries the question alone (still within this design).
