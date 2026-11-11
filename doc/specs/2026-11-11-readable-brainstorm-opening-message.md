# Readable brainstorm opening message: fixed sections, everyday words, sources in the draft

**Goal:** Make the first message of `/skill:brainstorming`'s questionary (question one at checklist step 4) readable in a terminal: three titled sections in everyday words under a word cap, then the question, with every source, path, and lookup recorded in the draft spec instead of chat.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Predecessor:** `doc/specs/2026-09-17-gh-32-questionary-rules.md` - superseded for Design `### 2. Premise verdict paragraph` (plain prose with no template, sources in chat).
**Predecessor:** `doc/specs/2026-10-04-brainstorming-challenge-note-replay.md` - superseded for Design `### 2. Framing question in ### 3. Understand the idea`: the holds-statement naming traces, the `<cited reason>` slot in option B, and the location of the framing template and its Bad/Good pair. Its flow rules (ask once, recommend, record `Framing:`) stay live.

## Problem

The user reports that the brainstorming opening message is hard to read in the TUI while the rest of the process reads well, and asks for a template in the spirit of chase-bug's verdict report: informative, dense, human-readable, with pointers, SHAs, and code references kept out of chat and the detail kept in the spec. Follow-up constraints: avoid duplication, follow forge-skill authoring rules and the 50,000-byte instruction-size limit, and carve out no exception from the plain-words rule.

Framing: kept - the scout's objection (a template layered over the sentences that force sources into chat is a band-aid) is absorbed by the user's follow-up: the template replaces those sentences.

Checked premises:

| Premise | Result | Source and lookup |
|---|---|---|
| Opening messages are hard to read | Held | Four opening messages read from machine-local pi session logs of two private consumer repos: 89, 268, 433, and 581 words; one carried a single ~330-word paragraph of inline `Supported: / Corrected: / Unverified:` runs with about twenty path, ticket, and count references; one holds-statement listed twelve checked items, most with `file:line`. |
| The skill text causes it | Held | `skills/brainstorming/SKILL.md:113` (`with sources and attempted lookups, in full sentences - no status-keyword lists, no template`) and `:115` (`name the traces and dependencies in the holds-statement, not only the files read`); both sentences appear verbatim in the recorded sessions of both repos. The Good example at `:133-140` shows `(settings/resolver.ts:11)` in chat. |
| The detail already lands in the spec | Held in part | `skills/brainstorming/SKILL.md:111` appends only citable findings (schemas, hard constraints, contradictions, scope-changing answers) to the draft's `## Appended during questionary`; held claims are none of those kinds and are not appended today. `:113` carries corrected facts into `## Problem`. Design 2 edits `:111` in place so every checked claim is recorded. |
| The missing template is an omission | Corrected | `doc/specs/2026-09-17-gh-32-questionary-rules.md` `### 2. Premise verdict paragraph` chose plain prose, no template, and sources in chat on purpose. This spec reverses that clause. The recorded messages used keyword lists despite the ban. |
| "No exception" can be met by citing AGENTS.md Communication Style | Corrected | `doc/specs/2026-10-28-chase-bug-summary-prose.md:26` records the user's constraint that a shipped skill carries its own wording; AGENTS files do not reach consumer repos. |
| gatekeep-pr copies chase-bug's comms | Corrected | `skills/gatekeep-pr/SKILL.md` `## Wording rules` is its own ten-rule set (`doc/specs/2026-10-01-gatekeep-pr-capability-gate-compact-report.md:163`), older than chase-bug's report shape, and keeps a `file:line` locator per item. No skill cites another skill's wording rules (`rg "chase-bug" skills` outside `skills/chase-bug/` matches hotfix routing only). The conclusion holds: each skill owns its wording so it can be tuned verbatim on its own. |
| forge-skill requires SKILL.md to be flow-only | Corrected | `skills/forge-skill/SKILL.md` `## Authoring rules` forces extraction only above 500 lines (`skills/brainstorming/SKILL.md` is 225 lines, 27,377 bytes). The split into a reference file is a design decision matching `skills/chase-bug/reference/verdict-report.md` and `skills/gatekeep-pr/reference/report.md`. forge-skill is not edited. |
| Ticket AC handling predates the opening message | Held in part | `skills/brainstorming/reference/ticket-acceptance.md`: gather fetches the ticket and copies rows verbatim into the draft before any message; the cut question is screened "at checklist step 4, before question one" and asked as the first ordinary question. A whole-ticket fetch failure surfaces only at the user review gate today. |
| pi renders `##` cleanly | Held | `@earendil-works/pi-tui/dist/components/markdown.js:426-447` in the installed pi 1.5.2 runtime (outside this repo's tree, so a worktree search does not find it): the heading case styles level 1 bold and underlined and level 2 and deeper bold, and line 444 prepends the literal `#` prefix only when `headingLevel >= 3`. A `##` title therefore renders as a bold line without hashes; `###` keeps them. Other harnesses are not checked. |
| A fixed shape makes models comply | Not checked | The keyword-list ban did not hold in live use. Only the selected eval runs named in Design settle it. |

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] On a brainstorm whose framing holds, the opening message is the `gauntlet: question` line, then the titled sections `## Today`, `## The change`, `## What I checked` in that order, then a `The framing holds: checked ...` line and one question with each lettered option on its own line.
  in-scope
- [ ] That message runs at most 220 words from `## Today` through the line before the first lettered option, a word being a whitespace-delimited token containing a letter or digit: replaying `opening-message-shape`, whose claims all hold and whose question quotes no ticket row, the span stays within 220. Only `Corrected:` lines, `Not checked:` lines, and an intact quoted ticket row may carry a message past 220, and then `## Today` and `## The change` are one sentence each.
  in-scope
- [ ] A claim the recon contradicts appears as one `Corrected:` line stating the right fact and its consequence for the design in everyday words: replaying a draft that cites `settings/resolver.ts:11` for the contradicted claim, the reply contains neither that path nor a line number, and the framing question follows with its three options on separate lines.
  in-scope
- [ ] A dependency found missing stays visible by its own name with where it was looked for: replaying the missing-template draft, the opening message names `templates/deck.pptx` as not found in the supplied `templates/` directory listing.
  in-scope
- [ ] A ticket that gather could not fetch appears as one `Not checked:` line in the opening message.
  in-scope
- [ ] A ticket row that only proves a workflow stage is asked as the opening message's question, quoted intact, after the `The framing holds: checked ...` line.
  in-scope
- [ ] Before the opening message is sent, the draft lists each checked claim with its source, the lookup, and the result: under `## Appended during questionary` when the draft is the gather draft, and directly in `## Problem` when the draft is the approved or carried spec (redraw, unmarked spec-only PR route), which has no such section.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: readable-brainstorm-opening-message
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: `npm test` (runs `scripts/ci.mjs`: skill lint, instruction-size lint, gate-contract lint, contract tests, eval structural lint and hygiene); selected model evals `node eval/run.mjs brainstorming <sample>` for the seven samples named in Design 5
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: README.md
Rules: CHANGELOG.md
Rules: doc/personas.md
Rules: doc/configuration.md
Rules: doc/install-internals.md
Rules: doc/gate-contract.md
Rules: doc/implement-engines.md
Rules: eval/README.md
Rules: .pi/gauntlet-overrides.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: AC 1, AC 2, AC 3, AC 4, AC 5, AC 6, AC 7
design: owns `skills/brainstorming/SKILL.md`, new `skills/brainstorming/reference/opening-message.md`, `scripts/brainstorming-contract.test.mjs`, `doc/gate-contract.md`, `eval/brainstorming/` (`target.json`, `intent.md`, `README.md`, `report.md`, two new and five existing samples), `CHANGELOG.md`, and the two predecessor banners; observable outcomes are the seven AC rows.

## Design

Every skill edit follows `/skill:forge-skill` `## Authoring rules`: imperative voice, the sentence that owns a rule is edited in place, no rule is stated in two files, and the register is written as a recipe (what the message is), not a list of things to avoid.

### 1. Split of responsibility

| File | Owns |
|---|---|
| `skills/brainstorming/SKILL.md` `### 3. Understand the idea` | Flow: read the draft, verify claims, trace dependencies, decide whether a framing concern exists, ask once, record the outcome, write sources to the draft. |
| `skills/brainstorming/reference/opening-message.md` (new) | Wording: the message shape, section content, plain-words register, word cap, framing-question template, worked examples. |

The opening message is question one's message at checklist step 4: fresh entry, redraw, restored entry, and the unmarked spec-only PR route. The relatedness question in `reference/pr-subject.md` runs before provisioning and is not the opening message.

### 2. `skills/brainstorming/SKILL.md` `### 3. Understand the idea`

Remove:

- From the paragraph starting `Before approaches, state in chat`: the clause `with sources and attempted lookups, in full sentences - no status-keyword lists, no template; if the design depends on no claims, one sentence says so`, and the words `with its source` in `states the corrected fact with its source`.
- From the paragraph starting `Before question one, verify the draft's` `Framing:` `line`: the clause `and name the traces and dependencies in the holds-statement, not only the files read`, and the fenced framing template that follows the paragraph.
- The paragraph starting `For a band-aid concern, put the root-cause alternative in B.` (band-aid rule, holds-statement form, scout-objection rule).
- The framing Bad/Good pair (`Bad: The ask adds another settings path ...` and its fenced Good example).

Edit in place (the sentence that owns the rule):

- The sentence `Append only citable findings - schemas, hard constraints, contradictions, and scope-changing answers - to ## Appended during questionary using edit.` becomes the single owner of the evidence write: before sending the opening message, append every checked claim, held ones included, with its source, the lookup, and the result, together with the citable findings the sentence already names. It names the destination by route: `## Appended during questionary` when the draft is the gather draft; directly in `## Problem` when the draft is the approved or carried spec (redraw and the unmarked spec-only PR route), where gather is skipped and that section does not exist. This is the destination the `Framing:` record paragraph already uses on redraw.
- In the `Before approaches, state in chat` paragraph, which keeps those opening words: the supported, disproved, corrected, and unverified premises go in the opening message's `## What I checked` section, and one sentence states the mapping - supported renders as `Held:`, disproved and corrected as `Corrected:`, unverified as `Not checked:`, and that section is the premise note (after the opening message, a premise note is a `Corrected:` line). The terms `premise note` and `unverified` in `### 4` and `## Red Flags` keep their meaning through this sentence; no later question's flow changes. Spec-writing carries every recorded claim, held ones included, into `## Problem`.
- In the same paragraph, the implicit-dependency sentence `state each in the premise note with the lookup the repo or spec names and its result, and carry it into ## Problem` becomes: state each in the premise note in everyday words that name what was looked at and what was found; record the lookup the repo or spec names and its result in the draft, and carry it into `## Problem`.
- In the ordinary-question paragraph, `adopt a ticket-recorded decision and cite the ticket` becomes `adopt a ticket-recorded decision and attribute it to the ticket`. The paragraph no longer tells any message to print a tracker id; the opening message's register (Design 3) keeps ids inside command options, and later messages are not otherwise changed. The draft record `Framing: kept (ticket <id>)` is unchanged.

Add:

- In the `Before question one` paragraph: traces and dependencies are recorded in the draft through the evidence write above; the paragraph ends with the flow rule that a concern makes question one the framing question and no concern makes the message carry the holds-statement and the first ordinary question.
- One pointer sentence at the removed template's position: read `reference/opening-message.md` now and write question one's message against it; unreadable -> stop with a blocking error, never write it from memory.

Unchanged in `### 3`: the marker paragraph, the rest of the ordinary-question paragraph with its `AGENTS.md` layout sentence and its Bad/Good pair, `After any premise correction in the same message, ask the framing question or give the holds-statement`, the ask-once rule, and the `Framing:` record paragraph including its scout-failed sentence, which stays the owner of the scout-failure flow. `### 3` then holds one marked fenced block. Both `## Red Flags` lines on the premise note and the holds-statement stay.

### 3. `skills/brainstorming/reference/opening-message.md`

H1 `# Opening message`; at most 120 lines. It cites `menu-layout.md` for the first-line rule and restates none of it. It contains three marked fenced blocks: the shape template and two worked examples.

Shape template, verbatim:

```text
gauntlet: question

## Today
<how the affected part works now>

## The change
<what the request does to it, as something the user observes>

## What I checked
- Held: <one short sentence naming the held claims by role>
- Corrected: <the claim as stated>; <the fact>, so <the consequence for the design>.
- Not checked: <the claim> - <why it could not be checked>, so <what the design assumes or waits on>.

The framing holds: checked <things, named by what they do>.
<lead-in question>
A) <outcome>
B) <outcome>
Recommendation: <letter> - <why>
```

Rules the file states:

| Topic | Rule |
|---|---|
| Sections | The three `##` titles in fixed order with a blank line between; each body is one short paragraph or one list. `##` is used because pi renders it as a bold title and keeps the hashes on `###`. |
| `## Today` | One to three present-tense sentences on how the affected part behaves now. For a PR subject it describes the PR's current state; on a redraw, the approved spec. |
| `## The change` | One to three sentences on what the user observes once it ships, including what the held claims mean for the design - that consequence is said here, not on the `Held:` line. When a ticket is the request, it says what the ticket asks; acceptance rows are never listed. An assumption made in place of a yes/no question is its last sentence. |
| `## What I checked` | `Held:` is one short sentence that groups the held claims by role; per-claim evidence stays in the draft. Each corrected premise is one `Corrected:` line with the fact and its consequence for the design. Each unverified premise, and a ticket gather could not fetch, is one `Not checked:` line with the reason and its consequence for the design: what the design assumes or what it waits on. Which premise is which kind is decided by SKILL.md's premise paragraph, not restated here. A label with no entry is omitted. With no claims at all the body is the single line `The design rests on no claims.` |
| Unread ticket | When the request is only a ticket reference and gather could not fetch it, `## Today` and `## The change` are one sentence each saying their content is not known until the ticket's content is supplied. Nothing about current behavior or the requested change is inferred from the reference or from repo recon. The `Not checked:` line stays; the framing line and the question slot are unchanged, and the holds line names the failed fetch among the things checked. |
| Register | Name a part by what it does. A literal name appears when the user used it in the request or when it is the finding itself: a missing file, a failing input, a quoted ticket row. A lookup is named by what was looked at (`the supplied templates/ directory listing`). File-and-line references, commit ids, tracker ids, and trace counts go to the draft. A tracker id is not a literal name under this rule, even when the user typed it: it appears in chat only inside an option that is a command (`/skill:shape-ticket <ref>`), and everywhere else, the unfetched-ticket line included, the message says `the ticket`. |
| Cap | At most 220 words from the `## Today` line through the line before the first lettered option, both included; the marker and the options are excluded. A word is a whitespace-delimited token containing a letter or digit, so `##` and `-` do not count and title and label words do. Over the cap, cut `## Today` and `## The change` to one sentence each; `Held:` is already one short sentence. Only `Corrected:` lines, `Not checked:` lines, and an intact quoted ticket row in the question may then still carry the message past 220: none of them is dropped, and the row stays intact. |
| Framing holds | `The framing holds: checked <x>, <y>` names the checked things by role; a scout objection that yielded no alternative is named among them. |
| Framing concern | The holds line is replaced by the concern in one sentence, followed by `A) as framed`, `B) pivot: <named alternative> - <reason in everyday words>`, `C) smaller or none: <what ships, or what happens if nothing ships>`, and the `Recommendation:` line. A band-aid concern puts the root-cause alternative in B. |
| Question slot | The slot holds one question: the framing question when a concern exists, otherwise the first ordinary question. Which question is first, when a cut question takes that place, and how its row is quoted are owned by `ticket-acceptance.md` `Cut question` and its trigger table; this file cites that owner and restates none of it. |
| Later correction | A claim found wrong after the opening message opens the next message as one `Corrected:` line under the same register, with no section titles: the first line, or directly after the marker when the message has one. |
| Thin recon | Rendering only: the sections render from the recon at hand, and anything it could not check is a `Not checked:` line. When the scout failed, the flow rule stays in SKILL.md's `Framing:` record paragraph and is not restated here. |

Worked examples: one holds variant and one concern variant, both synthetic. The concern variant re-renders the settings-resolver case of the removed Good example with no path or line number.

Contract strings (pinned by tests; changed only through a spec amendment): the three section titles, the labels `Held:`, `Corrected:`, `Not checked:`, `The framing holds: checked`, the stems `A) as framed`, `B) pivot:`, `C) smaller or none:`, the cap value 220, and the rule anchors below. Each anchor is a short literal the sentence must contain; the prose around an anchor, the example prose, and all other rule phrasing are tunable during the eval wording rounds.

| Pinned instruction | File | Anchor |
|---|---|---|
| Pointer sentence | `SKILL.md` `### 3` | `reference/opening-message.md` and `never write it from memory` |
| Evidence write | `SKILL.md` `### 3` | `every checked claim` |
| Over-cap cut order | `reference/opening-message.md` | `one sentence each` and `none of them is dropped` |
| No-claims line | `reference/opening-message.md` | `The design rests on no claims.` |
| Later correction | `reference/opening-message.md` | `with no section titles` |
| Thin recon | `reference/opening-message.md` | `the recon at hand` |
| PR or redraw `## Today` | `reference/opening-message.md` | `on a redraw, the approved spec` |

`skills/brainstorming/reference/ticket-acceptance.md`, `gatherer.md`, and `menu-layout.md` are not edited: the unfetched-ticket line is owned by the new file, the gate's `none` line and paste-rows affordance stay, the scout keeps writing cited lines into the draft, and the marker rule is unchanged.

### 4. Gate inventory and contract tests

- `doc/gate-contract.md`: the `brainstorming/understand-the-idea` row for `skills/brainstorming/SKILL.md` becomes `X) options; templates=1`; add a second row with the same id, kind `question`, file `skills/brainstorming/reference/opening-message.md`, site `# Opening message`, layout `X) options; templates=3`. `scripts/gate-contract-lint.mjs` is not edited; it counts marked blocks per row and requires the new file's menu-layout citation to resolve.
- `scripts/brainstorming-contract.test.mjs`, section-3 test: keeps the assertion that the premise paragraph precedes the framing paragraph and keeps its eight flow pins on `SKILL.md` (`After any premise correction in the same message, ask the framing question or give the holds-statement`, `at most once per brainstorm`, `Framing: kept`, `Framing: pivoted to <x> - <why>`, `## Appended during questionary`, `the count restarts`, `adds to the premise verification above`, `trace every consumer, caller, and data path`) and the ordinary-question Good example's wording. It adds the two `SKILL.md` anchors from Design 3 and asserts the two removed clauses are absent. It drops what moved: the four strings `A) as framed`, `B) pivot:`, `C) smaller or none:`, `The framing holds: checked`, the framing-template assertion, and the framing Bad/Good assertions (one Good example remains in `### 3`).
- `scripts/brainstorming-contract.test.mjs`, new test: reads `reference/opening-message.md` and asserts the contract strings and the five `reference/opening-message.md` anchors from Design 3, the three marked blocks, one labeled option per line, and a final `Recommendation:` line in each rendering.
- `scripts/skill-size-lint.mjs` already bounds both files (under 50,000 bytes and 2,000 lines); no change.

### 5. Eval

- `eval/brainstorming/target.json`: add `{ "path": "skills/brainstorming/reference/opening-message.md", "new": true }` to `skillFiles`, so every replay sees the wording rules the pointer names.
- `eval/brainstorming/intent.md`: rewrite the `for:` line, the change statement, and the sentences on the premise note and framing template. In `## Expected to move`, the label lookup takes the first line matching a sample and fact, so no line is appended for a fact that already has one. Keep byte-for-byte every existing line of the five existing samples: `workflow-stage-ticket-row/f1`-`f7`, `implicit-template-not-found/premise`, `/approaches`, `/problem`, `missing-db-extension/premise`, `/approaches`, `/problem`, `gate-line-first/first-line`, and `review-and-apply-containment/holds`, `/no-pivot`, `/review`, `/containment`, `/pattern`. Keep `review-and-apply-containment/constraints: holds -> fails` as carried accepted variance (it regresses on one replay model and holds on the other); a `holds -> fails` there is the recorded variance, not a new regression of this change. Add lines only for facts that have none and are expected to move, each `fails -> holds`: `gate-line-first/correction`, the `opening-shape` fact of the three multi-message samples, and the moving facts of the two new samples named below. A fact with no line that holds in both arms needs none.
- `eval/brainstorming/README.md`: add the new skill file and the two new samples to its tables.

| Sample | Status | Facts |
|---|---|---|
| `opening-message-shape` | new, synthetic; `replay: continuation` with a first-message-only output boundary, as `gate-line-first` has; a framing-holds draft whose claims all hold, cites a `file.ext:line` source, and has no ticket | Mechanical `first-line`, `titles`, `no-locator`, `word-bound` (regexes below). Judged `register`: parts are named by what they do. Judged `holds-question`: the holds line and one question follow the sections. Expected `fails -> holds`: `titles`, `no-locator`, `word-bound`, `register`; `first-line` and `holds-question` are expected to hold in both arms. |
| `opening-message-ticket-not-fetched` | new, synthetic; `replay: continuation`, first-message-only; the request is an opaque ticket id and nothing else, with gather's recorded unfetched result and no fetch path | Judged `not-checked`: one `Not checked:` line says the ticket could not be read and what the design waits on, calling it `the ticket`. Judged `unknown-content`: `## Today` and `## The change` say their content is not known and attribute no behavior, file, or requested change to the ticket. Judged `register`: the message says `the ticket` and carries no tracker id, path, or line number. Judged `question`: the holds line follows the sections, then one question on how to obtain the ticket's content, and the brainstorm does not stop. Mechanical `first-line`, `titles`, `no-locator`, `word-bound` (regexes below). Expected `fails -> holds`: `not-checked`, `unknown-content`; `question` is expected to hold in both arms; the added shape and register facts take the moves `eval/brainstorming/intent.md` records. |
| `gate-line-first` | existing | Rewrite fact `correction`: the correction is one `Corrected:` line in everyday words with no path or line number, before the framing question. Expected `fails -> holds`; `first-line` and `framing` are expected to hold in both arms. |
| `implicit-template-not-found` | existing; output boundary and approaches facts unchanged | Add mechanical fact `opening-shape` (regex below), scoped to message one (`fails -> holds`), and judged fact `register`, scoped to message one. The opening message's lookup wording is `the supplied templates/ directory listing`, which is what the existing `premise` fact requires. Existing facts are expected to hold in both arms. |
| `missing-db-extension` | existing; output boundary and approaches facts unchanged | Add mechanical fact `opening-shape` (`fails -> holds`) and judged fact `register`, scoped to message one; existing facts are expected to hold in both arms. |
| `review-and-apply-containment` | existing; approaches facts unchanged, including `pattern`'s fixture-file citation in the later message | Add mechanical fact `opening-shape` (`fails -> holds`) and judged fact `register`, scoped to message one; existing facts are expected to hold in both arms, except `constraints`, which keeps its accepted `holds -> fails` variance. |
| `workflow-stage-ticket-row` | existing | Add mechanical fact `opening-titles` (the three titles in order in message one) and judged fact `opening-register` (everyday words around the intact quoted row; the tracker id only in the repair command option). `f1`-`f7` are unchanged and expected to hold in both arms under the new assembly. |

The shape checks use the existing `expected.md` grammar (`matches /<regex>/<flags>`, compiled with `new RegExp`); no checker operation is added and `eval/lib/` is not edited. The word bound is the same span and the same word definition as AC 2 and the Cap rule: `eval/lib/checks.mjs` `wordCount` counts whitespace-delimited tokens containing a letter or digit. Later-message rules are untouched: `opening-shape` stops at message one's `Recommendation:` line, so approaches citations and `## Problem` excerpts stay required by their own facts.

```text
- first-line: mechanical: matches /^gauntlet: question(?:\r?\n|$)/
- titles: mechanical: matches /^gauntlet: question\r?\n\s*## Today\n[\s\S]+?\n## The change\n[\s\S]+?\n## What I checked\n/
- no-locator: mechanical: matches /^(?![\s\S]*[\w-]\.[A-Za-z]{1,5}:\d)/
- word-bound: mechanical: matches /## Today\s+(?:[^\s\p{L}\p{N}]+\s+)*(?:[^\s\p{L}\p{N}]*[\p{L}\p{N}]\S*\s+(?:[^\s\p{L}\p{N}]+\s+)*){0,219}(?<=\n)A\) /u
- opening-shape: mechanical: matches /## Today\n(?:(?![\w-]\.[A-Za-z]{1,5}:\d|\nRecommendation:)[\s\S])+?\n## The change\n(?:(?![\w-]\.[A-Za-z]{1,5}:\d|\nRecommendation:)[\s\S])+?\n## What I checked\n(?:(?![\w-]\.[A-Za-z]{1,5}:\d|\nRecommendation:)[\s\S])+?\nRecommendation:/
```

`word-bound` counts `Today` as word one and allows 219 more before the first line starting `A) `; `opening-shape` requires the three titles in order and no `name.ext:<digit>` locator between `## Today` and message one's `Recommendation:` line.

Paid and external actions for the whole flow (seed, rows, repairs, finish):

| Action | Runner | Inputs | Count |
|---|---|---|---|
| Model eval run | `node eval/run.mjs brainstorming <sample>` (models frozen in `eval/lib/models.mjs`), including `--baseline-only` seeding | The seven samples above, one at a time, never target-wide | At most 280 model calls in total, counting every replay, judge, and confirmation call, judge retries included. Planned shape: one initial run and up to three wording rounds per sample |

The 280-call ceiling binds; the run count does not guarantee it. One comparing invocation can make up to 14 calls with the two frozen replay models: 4 replays, 4 judge calls (each judgment may retry once), and 6 confirmation calls (one replay and up to two judge calls per regressed model). A `--baseline-only` seed makes at most 2. The loop keeps a running total from each finished invocation's completion line (`replay <n>, judge <n>, confirm <n>`, or `baseline seeded (replay <n>, ...)`), and starts an invocation only when its worst case (14, or 2 for a seed) fits what remains of 280. When it does not fit, the loop stops and reports the samples and rounds not run; the ceiling is never raised, and not every sample is guaranteed four runs.

Design approval authorizes these runs within those bounds without per-step prompts. The loop treats any paid or external action without a clause here as unreachable; adding one needs separate explicit authorization. The committed evidence is the selected sample records and a partial `eval/brainstorming/report.md` naming the seven samples and the remaining coverage limit: the concern variant of the first message is exercised only through synthetic `gate-line-first`, and the two other facts that judge it, `latest-run-indicator/framing` and `explicit-unit-normalization/framing`, are not run. No target-wide pass is claimed.

## Errors and edge cases

- `reference/opening-message.md` unreadable: the brainstorm stops with a blocking error.
- Message over 220 words: the cut order in Design 3 applies; corrected lines, not-checked lines, and an intact quoted ticket row survive and are the only content that may leave the message over 220.
- Request is only a ticket reference that gather could not fetch: `## Today` and `## The change` say their content is not known; nothing is invented from the reference; the `Not checked:` line and the question follow as usual.
- Redraw or unmarked spec-only PR route: the draft is the approved or carried spec with no `## Appended during questionary`; the checked claims are written directly in `## Problem`.
- No claims to check: the single `The design rests on no claims.` line.
- Scout failed: sections render from main-loop recon; unverifiable items become `Not checked:` lines.
- A correction found after the opening message: one `Corrected:` line as the next message's first line, or directly after the marker when that message has one; no sections.
- PR subject or redraw: same shape; `## Today` describes the PR or the approved spec.
- Framing concern and a cut-question trigger together: ordering is owned by `ticket-acceptance.md` and unchanged (the framing question goes first, the cut question follows it); the new file does not restate it.
- A literal name that is the finding (a missing file, a failing input, a quoted ticket row) stays in chat; this is the register's rule for findings, applied to every finding alike.
- An eval sample regresses after three wording rounds: the loop stops and reports the sample and fact; it does not widen the run or the call budget.
- The 280-call allowance cannot fit the next invocation's worst case: the loop stops before that invocation and reports the samples and rounds not run.

## Tests

- AC 1 opening-message order and shape - `eval/brainstorming/samples/opening-message-shape` (mechanical facts `first-line`, `titles`; judged fact `holds-question`); template strings - `scripts/brainstorming-contract.test.mjs`.
- AC 2 220-word bound - `opening-message-shape` mechanical fact `word-bound`; cap value and over-cap anchors - `scripts/brainstorming-contract.test.mjs`; live overflow past 220 - none: no selected sample carries enough corrected or unchecked lines.
- AC 3 plain-words correction - `eval/brainstorming/samples/gate-line-first` facts `correction`, `framing`.
- AC 4 missing dependency named with its lookup - `eval/brainstorming/samples/implicit-template-not-found` fact `premise`; `missing-db-extension` fact `premise`.
- AC 5 unfetched ticket line - `eval/brainstorming/samples/opening-message-ticket-not-fetched` facts `not-checked`, `unknown-content`, `question`.
- AC 6 workflow-stage row as the question - `eval/brainstorming/samples/workflow-stage-ticket-row` facts `f1`-`f4`.
- AC 7 sources recorded in the draft - `scripts/brainstorming-contract.test.mjs` pins the evidence-write sentence by its anchor `every checked claim`; live behavior on either destination - none: eval replays are tool-free and cannot observe a draft write.
- Unreadable reference stops the flow - `scripts/brainstorming-contract.test.mjs` pins the pointer sentence by its two anchors.
- Over-cap cut order, no-claims line, later-correction line, thin recon, PR/redraw `## Today` - `scripts/brainstorming-contract.test.mjs` asserts each rule's anchor from Design 3 in the new file; live behavior - none: no selected sample exercises them.
- Opening shape on multi-message replays - mechanical fact `opening-shape` in `implicit-template-not-found`, `missing-db-extension`, `review-and-apply-containment`.
- No path or line number in the opening message - `opening-message-shape` mechanical fact `no-locator`, judged fact `register`.
- Holds wording under the new shape - `eval/brainstorming/samples/review-and-apply-containment` fact `holds`.
- Gate inventory matches the files - `scripts/gate-contract-lint.mjs` through `npm test`.
- Both instruction files under 50,000 bytes - `scripts/skill-size-lint.mjs` through `npm test`.
- Regression after three wording rounds - none: a stop condition of the loop, not product behavior.

## Documentation impact

Applied per `reference/documentation-impact.md`.

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md` - `## Unreleased` entry (communication contract: the opening message's shape changes for every consumer)
- Derived / memory docs invalidated: `doc/gate-contract.md` `## Gates` (template count and a second rendering site); `eval/brainstorming/README.md` (skill-file and sample tables)

## Out of scope

- `### 4. Explore approaches`, including the message that restates missing or not-checkable dependencies, and the `Pattern:` / `Removes:` / `Adds:` lines with their repo citations.
- The two design rounds, the user review gate, and every later phase's messages.
- The lettered option layout and its `AGENTS.md` layout sentence.
- chase-bug's `###` report headings.
- `skills/forge-skill/SKILL.md`, `AGENTS.core.md`, and any other skill's wording rules.
- A shared wording file cited by several skills.

## Open questions

- Whether a fixed shape holds on the replay models is settled by the selected eval runs; a sample that still fails after three wording rounds is reported, not papered over.
- Heading rendering is checked for pi only. No other harness renders this message today: brainstorming is not in the Claude Code marketplace allowlist.
