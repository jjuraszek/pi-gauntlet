# Carry the source of every Problem example into shape-ticket bodies

**Goal:** every URL, attachment, or pasted screenshot the reporter already had lands in the ticket body as a `source:` footer line under the Problem example it supports; a non-discovery example without one is shown as a named gap at the existing confirmation gate, filled or acknowledged by the human in the same approval reply, and repair never reports "conforms" for such a body.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Ticket:** jjuraszek/pi-gauntlet#76
**Supersedes:** `doc/specs/2026-08-18-gh-8-shape-ticket-skill.md`, "Evidence gate (generalized)" section only (the gate gains the source-carrying rule; UI-evidence and bug-repro requirements stay); `doc/specs/2026-08-31-gh-18-self-contained-ticket-wording.md`, "The contract (ticket-wording.md)" rule 7 (pointer demotion) only - the `source:` footer becomes the one parenthetical reference that is never demoted to the Reporter note, and rule 8 gains the interpretation that a footer's association with its example is its summary line; every other rule stays live.

## Problem

shape-ticket's Evidence gate (`skills/shape-ticket/SKILL.md` `## Evidence gate`) asks for screenshots on UI claims and repro steps on bugs, and nothing else. A reporter who pastes a Sentry link and a log line into the ask gets a body whose Problem paragraph quotes the log line and drops the link; a reporter who attaches a CSV gets a body that describes the file and never names it. The next reader - the implementer, or the product owner triaging - has to search chat history or the tracker's attachment list for the observable the ticket describes. The reporter measured 29 tickets shaped in one consumer repo over three weeks: 9 carried no URL at all and 3 had an attachment the body never pointed at (reporter-supplied counts; the corpus is private and not checkable here). Only 2 of the 29 were bug-shaped, so the ticket itself rules out a hard stop for source-less bugs.

Nothing in the skill is mechanical at runtime today. Step 5 is titled "Deterministic gates", but every gate (AC integrity, evidence, metadata audit, displaced-detail, the step 6 byte compare) is prose the model executes inline; `extensions/`, `src/bins/`, and `scripts/` contain no code that reads a ticket body (the only shape-ticket references in code are two literal-marker asserts in `scripts/ci.mjs`). The deterministic layer is the eval: `mechanical:` facts (`contains`/`lacks`/`matches`, `eval/lib/checks.mjs`) run over replay output under `node eval/run.mjs shape-ticket`, not under `npm test`. The eval target's SKILL.md slice (`eval/shape-ticket/target.json`: `### 4 - Draft` to before `## Roast`) stops before `## Evidence gate`, so an edit to the gate alone replays nothing.

Two contracts need reconciling. Ticket-wording rule 7 demotes every code/doc reference in Problem to a deletion-safe parenthetical, rule 8 asks every link for a one-line summary, and step 5's closed list moves "file paths" and "code blocks" out of Problem into the Reporter note; a source link next to the example would be demoted, flagged, or moved by all three unless named as exempt. Rule 5's `none (<reason>)` is drafter-authored and roast-reviewable and marks a missing *example*; the ticket forbids the drafter authoring the reason for a missing *source*. The spec keeps them as two different markers.

Framing: kept - a runtime URL/attachment diff bin was weighed and rejected: it covers only text URLs (pasted screenshots and the gate-reply ACs 2-4 are not code-checkable), there is no hook to force its call because shape-ticket is a tool with no extension, and the URL case gets its determinism from a `matches:` fact in the `source-carried` sample. The change is the prose rule in the Evidence gate plus step 5/6/7/8 wiring and one sentence in the Hard constraint, one sentence in ticket-wording rules 7 and 8, and four replay samples.

## Acceptance criteria

Ticket jjuraszek/pi-gauntlet#76, "Acceptance Criteria", rows verbatim:

- [ ] Every URL, file or attachment present in the ask or the session appears in the drafted body, adjacent to the Problem example it supports. Check: `eval/shape-ticket/samples/source-carried` - an ask that pastes a log line and a Sentry URL; the drafted Problem carries that URL next to the log-line example.
  in-scope
- [ ] For a ticket without a `Discovery:` / `Spike:` title prefix, a Problem example with no adjacent source renders at the confirmation gate as a named gap line (`source missing: <example>`), the write is still offered, and the body is written only with the link or the `source: none (<reason>)` line the human supplies at the gate - the drafter never authors the reason. Check: `eval/shape-ticket/samples/source-missing` - an ask that quotes a log line without a source; the gate message carries the gap line and the draft body carries no `source:` line until the human answers.
  in-scope
- [ ] For a bug ticket (repro steps present) the gap line is rendered first in the gate message and the approval reply must name the gap (link, reason, or "proceed without") before the write; a plain "yes" is re-asked. Check: `eval/shape-ticket/samples/bug-source-ack` - a bug ask with repro steps and no source; a plain "yes" at the gate yields a re-ask naming the gap.
  in-scope
- [ ] Repair mode on a non-discovery body whose Problem example has no adjacent source presents the same gap at the gate and proposes a rewrite that adds the link or `source: none (<reason>)` line the human supplies; it never reports "conforms". Check: `eval/shape-ticket/samples/repair-source` - such a body; the gate output contains the gap line and an old->new diff whose only prose change is the added source line, and does not contain "conforms".
  in-scope

Readings carried as Design clauses: "adjacent" (AC1) is satisfied by a footer line at the end of the Problem section that names its example, not by placement inside the example paragraph (Design 1, footer shape). The "line the human supplies" (AC2) in create mode is the human's reply text only - a link, an attachment name, a reason, or the explicit acknowledgment "proceed without"; a plain "yes" with an unresolved gap keeps the gate open in both bug and non-bug create (Design 3). In repair (AC4) the "line the human supplies" is the reply text, or the constant `source: none (not recorded at filing)` that a plain "yes" accepts from the prefilled diff (Design 3); the drafter composes no reason text in either mode. "Proceed without" (AC3) writes `source: none (proceed without - <YYYY-MM-DD>)` (Design 3).

## Design

All runtime edits land in `skills/shape-ticket/`; no new runtime file, bin, extension, or setting. The four eval samples and their records land under `eval/shape-ticket/` (Tests).

### 1. Evidence gate owns the source rule (`SKILL.md` `## Evidence gate`)

Add to the section:

- **Source definition.** A source is provenance separate from the example text: a URL (`http(s)://...`), a tracker or upload attachment reference (a file the reporter attached or named), or a pasted image (cited as `pasted screenshot`). A quoted log line, error message, or other pasted text is the Problem example (rule 5) or body evidence; it is never its own source. Quoting one with no URL, attachment, or screenshot behind it is a source gap. The ask, the session, and in repair the existing ticket body, comments, and attachment list are where sources are found. A source is never invented; a URL or attachment the drafter cannot see in those inputs is an evidence-gate failure as today ("never invent ... URL").
- **Carry rule.** Every source found lands in the Problem section as a `source:` footer line (shape below) under the example it supports. This applies to every body, Discovery and Spike included. The existing bug requirement (repro steps + observed-vs-expected) is met by the gate's Evidence list and the AC rows' setup/action/result; it never expands a Problem example beyond rule 5's one sentence or one number, so the footer follows that single example.
- **Gap rule.** For a body whose title lacks the `Discovery:` / `Spike:` prefix, each Problem example (rule 5) with no `source:` footer naming it is a *source gap*. A gap is never a stop: it renders at step 8 and the write is still offered. A Problem whose only example slot is rule 5's `none (<reason>)` has no gap (nothing to source). Discovery/Spike bodies have no gaps.
- **Footer shape.** One line per example, after the Problem prose, at the end of the section: `source: <label> - <value>`, where `<value>` is one of `<url>`, `attachment: <name>`, `pasted screenshot`, or `none (<reason>)`. The label is a short, unambiguous name for the example (a few words the reader can match to the example sentence); the same label string is used in the step 8 gap row `source missing: <label>` and in the footer. A single-example Problem omits the label in both places: footer `source: <value>`, gap row `source missing: <example sentence or its opening words>`. Two examples backed by one URL get two lines. The footer is a parenthetical in rule 7's sense: deleting it loses no comprehension.
- **Two `none`s.** Rule 5's `none (<reason>)` fills the example slot and its reason is drafter-authored. A `source: none (<reason>)` footer's reason is the human's reply text verbatim, the dated proceed-without form, or the repair constant in Design 3; the drafter never composes it.

### 2. Step 5, step 6, and step 7 wiring

- Step 5 (deterministic gates) runs the gap rule over the draft after the evidence gate's existing checks; gaps are carried to step 8. The displaced-detail closed list does not match a `source:` footer: it stays in Problem (ticket-wording rule 7, Design 4). Step 5's exemption sentence ("Exempt one deletion-safe rule-7 pointer per failure, ...") gains `and source: footers (Evidence gate)`, so an existing rule-7 pointer and a source footer coexist under one failure without demotion.
- Step 6 (no-op check) gains two checklist items: `every gathered URL, attachment, or pasted screenshot is carried in a source: footer under its example (Evidence gate carry rule)?` - checked for every title, Discovery/Spike included - and `every non-discovery Problem example has a source: footer (Evidence gate gap rule)?` A "no" on either makes the body non-conforming, so repair never reports "conforms" for it; a Discovery/Spike body fails only the first. The rule 8 checklist item ("links summarized, no spiderman hops") reads a `source:` footer's association with its already-described example as its summary; a bare-URL footer is not a rule 8 "no" (Design 4). The conformance-only rewrite rule is unchanged: Context/Problem/Idea prose only, AC bytes copied and compared. An existing `source:` line is preserved verbatim.
- Step 7 (roast): a roast finding on a source gap is always surfaced at step 8, never applied - roast cannot resolve a gap by authoring a reason or inserting a `none` footer. Findings that a gathered URL or attachment was dropped are ordinary unambiguous findings and are applied (the footer value is the gathered reference, not an authored reason).

### 3. Step 8 gate rendering and reply contract

The per-issue list gains one item, `Source gaps:`, rendered as `source missing: <label>` rows. For a bug ticket (repro steps present) this item is rendered first in the gate message, before Title; otherwise it sits after the Evidence list. The existing single approval covers the body plus the footer substitutions the same reply resolves; there is no second gate.

Gate-time body, per mode: in create, the draft body shown at the gate carries no `source:` line for a gap - the footer slot is empty until the reply resolves it, and the gate asks for the link, attachment, reason, or "proceed without" in the reply without printing any hypothetical `source:` value in commentary or options. In repair, the proposed old->new diff already carries `source: [<label> - ]none (not recorded at filing)` for each gap beside the gap row; a plain "yes" approves that diff as presented, and a reply naming a link, attachment, or reason replaces that footer under the same approval before step 9 writes.

Reply contract, per gap:

| Mode / ticket | Reply names a link or attachment | Reply gives a reason | Plain "yes" (approval with no gap named) | "proceed without" |
|---|---|---|---|---|
| Create, bug | `source: [<label> - ]<url or attachment: <name>>` | `source: [<label> - ]none (<verbatim reason>)` | no write; the gate stays open and re-asks, naming every unresolved gap (`source missing: <label> - link, reason, or "proceed without"?`); a later plain "yes" re-asks again - only a reply that resolves every gap approves | `source: [<label> - ]none (proceed without - <YYYY-MM-DD>)` |
| Create, non-bug | same | same | no write; the gate stays open and restates the unresolved gap rows with the same prompt; no constant is written | same |
| Repair | same (replaces the prefilled footer) | same (replaces the prefilled footer) | approves the prefilled `source: [<label> - ]none (not recorded at filing)`; no re-ask | same (replaces the prefilled footer) |

The repair constant is a fixed string, not an authored reason: it tells the next reader the ticket predates the rule or was filed by hand, and the human has accepted that. The date in the proceed-without form is the session date (shell `date +%F` when a shell is available, else the date the session supplies); replay cases that exercise it state the date in the case input. A reply that is not an approval keeps the gate open as today; the source re-ask is the same gate, not a new one.

Approval contract (one sentence added to the Hard constraint, mirrored in step 8's closing bold line and the Red flags entry): the approved payload is the exact presented diff plus only the `source:` footer substitutions the same approving reply resolved under this reply contract - no other post-approval edit, and no additional human gate.

Step 9's write carries the resolved footers in the approved payload. Step 9's pre-write re-fetch is unchanged: it compares the re-fetched ticket against the original snapshot the user approved, not against the footer-bearing replacement; the pending repair's own footer is never read as a concurrent change.

### 4. Ticket-wording rules 7 and 8 (`reference/ticket-wording.md`)

Append one sentence to rule 7: the `source:` footer (Evidence gate in SKILL.md) is the one sanctioned parenthetical reference next to an example - deletion-safe, kept in Problem, never moved to the Reporter note by step 5's closed list. Append one sentence to rule 8: a `source:` footer's summary line is the example it names - the footer satisfies rule 8 without a separate plain-words statement. Rule 5 is untouched; the "two `none`s" distinction lives in SKILL.md's Evidence gate.

### 5. Split and overlap

In a split, a footer follows its example to the slice that owns it. Overlap enrichment keeps the gathered reference's payload-local rules; the carry rule applies to the added or changed Problem prose only, never to a legacy body preserved verbatim. Roast item 2's Call 2 names the chair's `cwd` = repo root, as Call 1 does for members; the longer skill made replays drop the implicit chair `cwd` (member-file-only `cheap-controls`).

## Errors and edge cases

- A URL present in the ask or session that supports no Problem example (an unrelated link) is still carried, as a footer with the label `other` - AC1 says every URL; it is not a gap.
- A pasted image with no URL is cited as `pasted screenshot`; the drafter never writes a `none` reason for it.
- A pasted text artifact (log block) displaced to the Reporter note by step 4 overflow or step 5's code-block row stays the example's evidence, not its source; the example still needs a URL, attachment, or screenshot footer or is a gap.
- Discovery/Spike: footers are carried; no gap rendered; no re-ask; repair fails "conforms" only when a gathered source is not carried.
- A bug ticket with two gaps: the re-ask names both; a reply resolving one leaves the other row open and the gate re-asks for it - the gate never fills an unnamed gap with a constant.
- Repair where the only non-conformance is a missing footer: the body otherwise passes every step 6 checklist item, so roast applies nothing and the old->new diff's only change is the added `source:` line(s).
- Hygiene: sample asks use synthetic URLs (`https://errors.example.test/...`), synthetic log text, no real services or user paths.

## Tests

Four replay samples under `eval/shape-ticket/samples/`, each `case.md` + `expected.md` with `mechanical:` facts over the output and `judged:` facts where the behavior is wording or placement. Samples with a reply stage follow `menu-after-numbered-findings/case.md`: one response with explicitly labeled independent checkpoints (checkpoint 1 renders the gate; checkpoint 2 is given the reply and emits what follows), and each fact is bound to its checkpoint. The replay is tool-free (`eval/shape-ticket/replay.md`) and proves prescribed gate and reply wording, not an actual tracker write.

| Sample | Case | Must-hold facts |
|---|---|---|
| `source-carried` | create, non-bug ask pasting a log line and `https://errors.example.test/issues/4242`; stage `### 8 - Confirmation gate` | `matches /source:.*https:\/\/errors\.example\.test\/issues\/4242/`; the footer sits inside the Problem section of the draft body, not only in a Reporter note (judged); the log line appears in Problem (judged); `lacks "source missing"` |
| `source-missing` | create, non-bug ask quoting a log line, no URL or attachment; stage `### 8 - Confirmation gate` | `contains "source missing:"`; `lacks "source: none"`; the draft body block carries no `source:` line (judged); no fabricated URL (judged); write still offered (judged) |
| `bug-source-ack` | create, bug ask with repro steps and no source; checkpoint 1 renders the gate, checkpoint 2 is given the reply `yes` | checkpoint 1: `contains "source missing:"`; the gap row precedes the Title line (judged). checkpoint 2: the output is a re-ask naming the gap with link / reason / "proceed without" (judged); no simulated write (judged) |
| `repair-source` | repair, hand-filed non-discovery body with one example, no footer, otherwise conforming; checkpoint 1 renders the gate, checkpoint 2 is given the reply `yes` | checkpoint 1: `contains "source missing:"`; `contains "source: none (not recorded at filing)"`; `lacks "conforms, no changes proposed"`; old->new diff's only change is the added `source:` line (judged); AC bytes unchanged (judged). checkpoint 2: the footer is accepted as the fixed constant with no source re-ask (judged); Context/Problem/Idea prose and AC bytes otherwise unchanged (judged) |

`eval/shape-ticket/target.json`: the existing SKILL.md slice (`### 4 - Draft` to before `## Roast`) stays; a second `skillFiles` entry `{ "path": "skills/shape-ticket/SKILL.md", "slice": "## Evidence gate", "sliceTo": "## Ticket wording" }` is appended (`assemble()` in `eval/lib/replay.mjs` concatenates repeated paths), so the gate text reaches every cell without dragging `## Roast`, `## Tracker abstraction`, or `## Metadata audit` into the assembly. `wordCap` stays 1600 - it caps replay output words (`eval/run.mjs` `cell.words > target.wordCap`), not assembly size. `reference/ticket-wording.md` stays out of `skillFiles`; the four new samples declare `bundle+: skills/shape-ticket/reference/ticket-wording.md` like `bounded-prose`, so the four existing samples that already `bundle+` it are not duplicated. No existing sample has a `bundle-` line and none gains one. `intent.md` gets a new `## Change` paragraph and `## Expected to move` rows for the four samples (`sample/fact: fails -> holds`); its `for:` hash is updated by hand to the candidate assembly SHA that the for-mismatch refusal prints (`--baseline-only` skips intent validation and never rewrites `intent.md`; use it only to capture baseline records), then the full target runs with intent validation on. Per-sample runs while iterating; the full `node eval/run.mjs shape-ticket` once before finish; `report.md` committed. `npm test` is unchanged except the eval structural lint and hygiene scan over the new samples.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `eval/shape-ticket/README.md` - slice table gains the `## Evidence gate` to before `## Ticket wording` entry and the sample paragraph names the four source samples and their `bundle+`
- Derived / memory docs invalidated: `CHANGELOG.md - deferred: release`

`skills/shape-ticket/SKILL.md` and `reference/ticket-wording.md` are implementation surface. The top-level README's shape-ticket sentence stays accurate (the footer rides inside the existing gated write); `eval/README.md`'s iterating procedure does not change. Materiality bar: `reference/documentation-impact.md`.

## Out of scope

- A runtime extraction or diff helper for URLs/attachments (weighed in Framing; rejected).
- Screenshot or log capture tooling; the overrides capability ladder stays as is.
- A hard stop for source-less bugs (the ticket defers that until more than 2 bugs are shaped under the rule).
- Changes to Discovery ticket bodies beyond carrying URLs and attachments already present.
- Overlap evidence-only operations and legacy-body preservation rules.

## Open questions

- None.
