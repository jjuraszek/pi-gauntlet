# Bound ticket prose for a product-owner reader, keep implementer detail in the Reporter note

**Goal:** shape-ticket bodies stay readable by someone who knows the product but has never opened the repo, get shorter by moving implementer detail (paths, identifiers, sizes, lists, design sketches) into the gated `Reporter note:` comment, and brainstorming reads that comment as part of the ticket so nothing moved is lost to the spec.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Ticket:** jjuraszek/pi-gauntlet#75
**Supersedes:** `doc/specs/2026-08-31-gh-18-self-contained-ticket-wording.md`, "The contract (ticket-wording.md)" rules 1, 5, 6 (reader definition, example rule, jargon rule) only; its strip test, comprehension-over-brevity precedence, plain-words Problem lead, pointer demotion, exemplar, and explicit-ticket-wording override restriction stay live.

## Problem

shape-ticket's body contract (`skills/shape-ticket/reference/ticket-wording.md`, from #18) made Context, Problem, and Idea readable by a repo stranger. That fix holds; the remaining fault is length. The reporter measured 29 tickets shaped in one consumer repo: Context+Problem+Idea median 591 words, Idea longer than Problem in 9, the longest Idea 1,266 words. The product owner who triages them skims and asks in chat what the ticket is about.

Three causes, each verified in this repo:

1. The one-attributed-sketch-line Idea rule exists only in the draft step (`skills/shape-ticket/SKILL.md:73-84`). The step-5 deterministic gates (`:88`) do not check it, the roast brief's quality axis (Roast item 4, `:184`) does not name it, and the repair-mode no-op checklist (`:95`) keys to rules 2, 4, 5, 6, 7, 8 without it. Ideas grow into design documents because nothing enforces the rule that already exists.
2. The contract's reader is a stranger to the domain as well as to the repo, so bodies define terms the real reader uses daily (one ticket defines the requester's own industry acronym for him). Rule 5's "concrete example per failure" has no size bound, so examples run to transcripts.
3. Shortening the body today would lose what the implementer needs: brainstorming's ticket handling takes implied requirements from the body only (`skills/brainstorming/reference/ticket-acceptance.md:3`) and the gatherer takes terms from title and body (`skills/brainstorming/gatherer.md`, scout and context-builder task text). A `Reporter note:` comment carrying a migration size and move target never reaches the spec.

Framing: kept (ticket #75). The user's constraint - the ticket must stay readable for a person without in-depth knowledge of the internals; the only fault is long prose - is the ticket's reader redefinition (knows the product and its customers, never opened the repo). Rules 2-4 (strip test, comprehension over brevity, plain-words lead) are untouched; the body shortens by losing addresses and inventories, never explanation.

AC 4's check stays at `eval/spec-council-member/samples/ticket-idea-overflow` as the ticket names it. The roast ticket brief is task text in `skills/shape-ticket/SKILL.md` Roast item 4, not in `agents/spec-council-member.md`, and `eval/spec-council-member/target.json` bundles only the persona body; the sample supplies the brief itself through sample-local `bundle+` lines (Design 6), so the member replay sees the edited sentence without the AC path moving.

Unverified: the 29-ticket measurements live in a private consumer repo and cannot be reproduced from here. The design rests on the structural finding (rule exists, unenforced; brainstorming reads body only), which is verified against the files cited above.

## Acceptance criteria

Ticket jjuraszek/pi-gauntlet#75, `## Acceptance Criteria`, rows verbatim:

- [ ] `reference/ticket-wording.md` rule 1 defines the reader as someone who knows the product and its customers but has never opened the repo; rule 6 requires repo-native terms (module, script, internal tool names) to be defined or dropped and leaves product and domain terms the requester used undefined. Check: `eval/shape-ticket/samples/domain-reader` - a create-mode ask that uses one domain term the requester used and one repo-native term; the body defines the repo-native term and does not define the domain term.
  in-scope
- [ ] Rule 5 bounds the example per failure to one sentence or one number; a new clause under the reader contract bounds Context to the trigger of the ask and what exists today, with mechanism in the Problem's pointer; rule 4's plain-words Problem lead stays as is. Check: `eval/shape-ticket/samples/bounded-prose` - a four-failure ask; the body's Problem has no example longer than one sentence and its Context names no mechanism.
  in-scope
- [ ] Pipeline step 5 carries a displaced-detail check over Context, Problem and Idea: anything beyond the one attributed sketch line in Idea (a second paragraph, a list, a code block), and any mechanism, size, path or identifier the bounds remove from Context or Problem, is moved verbatim into the proposed `Reporter note:` comment before the roast - never dropped. Check: `eval/shape-ticket/samples/displaced-detail` - an ask that prescribes a three-item migration list in the Idea and a module path plus line count in the Problem; the draft reaches the roast with a one-line Idea and the comment payload carrying the three items, the path and the count.
  in-scope
- [ ] The roast brief's quality axis names Idea overflow and the reader, example and Context bounds, so a draft that bypasses the pre-review check still surfaces as a member finding. Check: `eval/spec-council-member/samples/ticket-idea-overflow` - a member is handed a deliberately non-conforming draft with a 400-word Idea under the ticket brief; its findings name the overflow.
  in-scope
- [ ] Repair mode treats an Idea overflow, a Context or Problem mechanism beyond the bounds, or a defined term the body attributes to the requester as non-conforming and proposes a rewrite instead of reporting "conforms"; the rewrite moves the displaced detail to a new Reporter-note comment and leaves the AC section byte-identical. Check: `eval/shape-ticket/samples/repair-overflow` - a body with a 300-word Idea; the gate presents an old->new diff with a one-line Idea plus a comment payload, and an unchanged AC section.
  in-scope
- [ ] brainstorming's ticket handling fetches the ticket's comments and treats every `Reporter note:` comment as part of the ticket for implied requirements and term collection. Check: `eval/brainstorming/samples/reporter-note` - a ticket whose only mention of a move target and a line count sits in a Reporter-note comment; the spec names both.
  in-scope

## Design

Every change edits an existing rule, gate, brief, or fetch step. No new file, channel, setting, or persona; the only new artifacts are eval samples.

### 1. Reader contract (`skills/shape-ticket/reference/ticket-wording.md`)

- **Rule 1 (reader).** First sentence becomes: the reader knows the product and its customers but has never opened the repo. The second sentence (Acceptance Criteria are exempt throughout the contract; they address the implementer and may name files, symbols, and settings freely) stays verbatim. The same reader definition replaces "a reader who has never opened the repo" in the `## Ticket wording` bullet of `skills/shape-ticket/SKILL.md` ("Minimal-to-actionable, split scoping", `:255`), so both entry points state one reader.
- **Rules 2, 3, 4 unchanged.** Strip test, comprehension over brevity, plain-words Problem lead before any mechanism.
- **Rule 5 (example per failure).** One sentence or one number per independently asserted failure. `none (<reason>)` stays as today. The exemplar's Good body already fits: its cause sentence is product-terms prose, its example is one sentence with numbers; the exemplar is not rewritten and passes the step-5 check unchanged (Design 2 exemptions).
- **Context clause (new, under the reader contract, after rule 1).** Context states the trigger of the ask and what exists today; it names no mechanism. Mechanism, when needed, goes in the Problem's parenthetical pointer (rule 7 as it stands).
- **Mechanism, defined (one sentence beside the Context clause).** Mechanism is internal implementation explanation: which module, step, store, or call does the work and in what order. Product-level cause and effect - what the user does, what they see instead, and why that is wrong for them - is not mechanism and stays wherever the plain-words lead needs it. Example of mechanism (moves to the pointer or the note): "the export job writes the CSV through the mailer queue before the row count is known". Example of product explanation (stays): "the export email arrives before the file is complete, so the first download is empty".
- **Rule 6 (terms).** Repo-native terms - module, script, internal tool, extension, setting names - are defined at first use in plain words or dropped. Product and domain terms the requester used stay undefined; when a term is both (a feature named after its module), the requester's usage wins and it stays undefined. "The requester used it" means the term appears in the ask's own words (create mode), or in repair mode in a reporter-authored comment, a quoted ask inside the body, or an explicit attribution ("the reporter calls this ..."). Mere appearance in the existing body prose is not requester usage - a prior shape-ticket run may have introduced and defined the term, and a repo-native term rule 6 requires defined keeps its definition. Example: the ask says "CSV export" with no definition -> stays undefined. Counterexample: the existing body reads "the mailer queue (the service that sends outbound mail)" and no reporter text uses "mailer queue" -> repo-native, definition stays.
- **Precedence line.** Rule 3 is restated once beside the new bounds: when a bound and comprehension conflict, comprehension wins and the material stays or is restored. This is the Q1 tie-breaker; the bounds shorten by removing addresses and inventories, never cause-and-effect prose in product terms.

### 2. Displaced-detail check (`skills/shape-ticket/SKILL.md`, step 5)

A new deterministic gate beside the AC integrity, evidence, metadata, and split gates. It runs over Context, Problem, and Idea with a **closed list**:

| Section | Moves to the Reporter note |
|---|---|
| Idea | anything beyond the one attributed sketch line: a second paragraph, a list, a code block |
| Context, Problem | implementer inventories: file paths, module/script/function/setting identifiers, sizes and line counts, lists of those, code blocks |

**Exempt from the list** (they stay in the body): the rule-7 parenthetical pointer (one deletion-safe parenthetical per failure, e.g. "(Pointer for the implementer: detectSpans, src/span-detector.ts.)"), the rule-5 example when it is one sentence or one number, requester-used terms that are also repo-native (rule 6), and any list whose items are plain-words failures or impacts (rule 4's one lead per failure). The exemplar's Good body in `ticket-wording.md` passes with no match. A one-line Idea whose single line is paragraph-long does not match; the roast judges it (Design 3).

Matches are moved as **coherent units** (the whole list, the whole code block, the sentence that carries the path or count), **verbatim**, never summarized, never dropped. When a move leaves a failure without its plain-words lead or breaks the cause-and-effect reading, the unit is restored to the body (rule 3 precedence); the roast's strip test is the backstop for anything the list does not catch.

**Accumulated payload.** The proposed `Reporter note:` comment is the single gated comment slot step 4 already owns (at most one proposed comment per issue). Its payload accumulates: step 4's own Idea demotion, step 5's moves, and any roast-applied removal of mechanism (Design 3) are appended verbatim under the `Reporter note:` labeled part, beside the `Overlap evidence:` part when overlap produced one (`reference/overlap-check.md` combined-comment rule). The source snapshot and the accumulated payload are carried through drafting, step 5, roast fixes, and the step-5 rerun after a roast edit; a rerun with no new match adds nothing and never clears earlier content. Only a body that never displaced anything shows the body write alone as today.

**Carrier.** The payload lives in the existing draft artifact (the temp file Roast item 2 already writes) as a trailing `## Proposed Reporter note` section, delimited as untrusted ticket data like the source snapshot; no third file.

Data flow: draft body (+ step-4 demotion) -> step-5 check -> {trimmed body, accumulated Reporter-note payload} -> roast (draft artifact: body + payload, plus snapshot) -> roast fixes rerun step 5 -> gate -> one body write plus one gated comment write.

### 3. Roast brief (`skills/shape-ticket/SKILL.md`, Roast item 4)

The quality axis gains one sentence naming Idea overflow (including a one-line Idea whose line is a paragraph), the reader definition, the example bound, and the Context bound as findings, with rule 3 precedence stated so a member does not recommend cutting explanation. The member task (Roast item 2) names the draft artifact's `## Proposed Reporter note` section so the member can confirm displaced detail moved rather than vanished. A roast finding that removes mechanism from Context or Problem is applied by moving the text into that payload, never by deletion. The persona `agents/spec-council-member.md` is untouched.

### 4. Repair mode (`skills/shape-ticket/SKILL.md`, no-op checklist, `:95`)

The checklist adds: an Idea beyond one attributed sketch line, Context or Problem material the closed list matches, and a definition of a term the requester used (per Design 1's attribution test: reporter comment, quoted ask, or explicit attribution - not mere appearance in the body) are non-conforming. The rewrite runs the step-5 check and presents an old -> new body diff plus a new Reporter-note comment payload. The AC section is preserved raw: the rewrite copies the bytes under the AC heading unchanged and checks byte equality before the gate; the existing AC integrity gate parses the criteria (checked, numbered, prose rows alike) without reserializing them into `- [ ]` form for this conformance-only repair, and its existing hard-stop still fires on invalid criteria. An existing `Reporter note:` comment is never edited; the newly displaced material is "materially changed" demoted detail under the current step-4 rule, so a new comment is proposed.

### 5. brainstorming reads the note (`skills/brainstorming/gatherer.md`, `reference/ticket-acceptance.md`)

- The context-builder task template fetches the ticket's full comment history through the tracker CLI in pages of 50 until the tracker returns a short page, and quotes every `Reporter note:` labeled section verbatim, in creation order, under its own `## Reporter notes (verbatim)` heading in the draft, after the AC rows. A section matches wherever it sits in a comment - a combined comment may lead with `Overlap evidence:` and carry the `Reporter note:` part second - and matches regardless of author (AC 6 says every note; no author filter). When shape-ticket emits a new combined comment it puts the `Reporter note:` part first and the `Overlap evidence:` part second; the reader accepts both orders. Ordinary comments beyond the gather budget may be trimmed; Reporter-note sections are never trimmed. The heading reports `comments: N fetched, M pages` so a truncation is visible.
- The scout task runs its own fetch: its "take the terms from the ticket title and body via the tracker CLI" becomes "title, body, and every `Reporter note:` section in the ticket's comments via the tracker CLI" (same paging rule). Scout and context-builder run as one parallel batch, so each fetches for itself; nothing new is passed between them and the main loop does not fetch before dispatch.
- `ticket-acceptance.md:3` names `Reporter note:` comments beside Context, Problem, and Idea as sources of implied requirements and terms. AC extraction is unchanged: comments never contribute AC rows.
- A later note that contradicts an earlier one is a contradiction the context-builder already reports; no conflict rule is added.
- A tracker without a fetch path (overrides exclude it, no CLI) degrades exactly as today: the draft lists the ref as unfetched, the spec's `## Acceptance criteria` carries `none - ticket not fetched (<reason>)`, and the gate summary's existing `none` line lets the user paste the rows. No new stop.
- Body fetched, comments failed or incomplete (a page errored, the budget cut a page): the draft's `## Reporter notes (verbatim)` heading reads `comments not fetched (<reason>)` or `comments incomplete after page <k> (<reason>)`, the fetched AC rows stay, and the gate summary carries one line saying implied requirements came from the body only so the user can paste the missing comment text. No new stop.

### 6. Eval assembly

`bundle+` adds whole files to one sample's assembly and `bundle-` drops `skillFiles` by path, not by slice (`eval/lib/replay.mjs:36-55`), so no target gains a new slice and no sample promises an unchanged cache:

- `eval/spec-council-member/samples/ticket-idea-overflow` keeps the member replay (persona body from `target.json`) and adds `bundle+: skills/shape-ticket/SKILL.md` and `bundle+: skills/shape-ticket/reference/ticket-wording.md`; its `case.md` carries the member task text of Roast item 2 pointing at a draft artifact with a 400-word Idea. The AC-4 path is unchanged.
- `eval/shape-ticket/target.json` keeps its Draft-through-Roast slice (steps 4-9 and the AC integrity gate already sit inside it, so the step-5 and no-op edits land there); the four existing samples restale and rerun. The four new shape-ticket samples add `bundle+: skills/shape-ticket/reference/ticket-wording.md`. `wordCap` becomes 1600: `repair-overflow` must emit the old body (300-word Idea), the new body, and the verbatim 300-word payload inside one reply, about 1,000 words; the number is confirmed against the assembled case before the run.
- `eval/brainstorming/target.json` is unchanged; the Reporter-note fetch sample adds `bundle+: skills/brainstorming/gatherer.md` sample-locally so the other 23 brainstorming samples do not rerun.

After the `bundle+` lines land, `node eval/run.mjs <target> --baseline-only` re-seeds the new subsets (`eval/README.md:44`).

## Errors and edge cases

| Case | Behavior |
|---|---|
| Tracker has no fetch path | Degrades as today (Design 5): ticket unfetched, `none` line, user pastes rows |
| Body fetched, comments failed or incomplete | Heading reads `comments not fetched (<reason>)` or `comments incomplete after page <k>`; AC rows kept; gate summary says implied requirements came from the body only |
| Several `Reporter note:` comments | All quoted in creation order; contradictions reported, not resolved |
| More than 50 comments | Paged until exhausted; a note after 50 ordinary comments is still quoted |
| Combined comment with `Overlap evidence:` first | `Reporter note:` section matched and quoted; evidence part skipped |
| Nothing to displace, nothing demoted earlier | No payload; body write alone |
| Step-5 rerun after a roast edit finds no new match | Payload unchanged; earlier displaced text kept |
| Roast removes mechanism from Context or Problem | Text appended to the payload, never deleted |
| Plain-words list of failures in Problem | Not an inventory; stays (exempt from the closed list) |
| Rule-7 pointer or one-number example in Problem | Exempt; stays |
| Repair with an existing note | Existing note untouched; new comment proposed |
| Term both domain and repo-native | Requester's usage wins; stays undefined; strip test is the backstop |
| One-line Idea that is a paragraph-long sentence | Closed list does not match; roast brief names it as overflow |
| AC section drift in repair | Raw bytes copied; byte-equality check fails the run; integrity gate parses without reserializing and hard-stops only on invalid criteria |
| `skills/shape-ticket/SKILL.md` size | Already 38,242 bytes against the 50,000-byte lint; net addition stays under 4,000 bytes - the closed list is one table plus one exemption sentence, the payload rule one paragraph, the brief one sentence; the mechanism definition and attribution test live in `ticket-wording.md` |

## Tests

Eval samples per `eval/README.md`, each with the fact lines `expected.md` must hold; synthetic text only (no consumer names, no `/Users/<name>` paths, nothing the brainstorming denylist blocks).

| Sample | Case | Must hold |
|---|---|---|
| `eval/shape-ticket/samples/domain-reader` | create-mode ask with one requester domain term and one repo-native term | body defines the repo-native term; does not define the domain term |
| `eval/shape-ticket/samples/bounded-prose` | four-failure ask | no Problem example longer than one sentence; Context names no mechanism; each failure still opens with a plain-words sentence |
| `eval/shape-ticket/samples/displaced-detail` | Idea prescribes a three-item migration list; Problem carries a module path and line count; step 4 already demoted one Idea sentence into the slot | Idea is one line at roast time; payload carries the earlier demoted sentence plus the three items, the path, and the count verbatim; Problem keeps its plain-words failure list and rule-7 pointer |
| `eval/spec-council-member/samples/ticket-idea-overflow` | member handed a draft artifact with a 400-word Idea under the ticket brief (`bundle+` SKILL.md and ticket-wording.md) | findings name the overflow; no finding recommends cutting the plain-words lead |
| `eval/shape-ticket/samples/repair-overflow` | existing body with a 300-word Idea and an AC section mixing a checked `- [x]` row and a numbered row | old -> new diff with a one-line Idea plus comment payload; AC section byte-identical (no normalization to `- [ ]`) |
| `eval/brainstorming/samples/reporter-note` | `replay: continuation` positioned at spec writing; the state carries the gather draft with a `## Reporter notes (verbatim)` section whose move target and line count appear nowhere else | the produced spec names both |
| `eval/brainstorming/samples/reporter-note-fetch` | `## Narrated read actions` case (`bundle+: skills/brainstorming/gatherer.md`); a ticket with 52 comments whose only `Reporter note:` section sits in a combined comment after `Overlap evidence:`, older than the newest 50 | narrated actions fetch a second page, the draft quotes the note under `## Reporter notes (verbatim)`, and the scout term list includes the note's terms |

All three targets' `intent.md` rewritten for this change. `node eval/run.mjs shape-ticket`, `node eval/run.mjs spec-council-member`, and `node eval/run.mjs brainstorming` run before the finish (per-sample partial runs while iterating, one full run at the end); `npm test` covers the structural lints, the instruction-size lint, and the eval hygiene scan. The commit body states the edit is semantic.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` - shape-ticket workflow bullet gains that brainstorming reads the Reporter note (communication contract between two skills); `CHANGELOG.md - deferred: release`
- Derived / memory docs invalidated: none - `doc/personas.md` describes the untouched persona; `doc/configuration.md` has no covering section

Materiality bar: `reference/documentation-impact.md`.

## Out of scope

- AC rows: shape, count, content, and the AC integrity gate stay as today.
- A numeric word cap on any section.
- Checking the Idea against repo conventions.
- The split policy (`reference/split-axes.md`).
- Repairing the 29 measured consumer tickets.
- Any change to `agents/spec-council-member.md`.
- A conflict-resolution rule between Reporter notes.

## Open questions

none
