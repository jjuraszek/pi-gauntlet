# Verdict report

## Shape

Render `### What is broken`, `### Why it is broken`, then `### How to fix it`
(real bug) or `### What happens next` (negative verdict), in that order with a
blank line between sections. Prepend `### Context` only for useful evidence.
Use one short paragraph or one list per section, never both.

Keep markers, channel text, selection echoes, menus, and confirmation outside
the report. At the gate, put `Pick one:` and the unchanged numbered menu after
the last section; the eligibility line ends the real-bug message. End a negative
gate with its menu, a gated draft with an explicit request to reply `send it`
outside the draft, and a summary or ungated draft with its last section. Drop evidence, transcripts, status, and housekeeping
that do not fit; never append them after that ending.

## Section content

| Section | Content |
|---|---|
| Context | Build only from the failing action's repro (one line), the explanation that survived testing, and a line naming a specific unchecked fact. Leave the unchecked-fact line absent when nothing remains unchecked; omit Context when it adds no evidence. |
| What is broken | State the failure in the reporter's terms; for a negative verdict, contrast the report with what the chase observed. |
| Why it is broken | Explain the mechanism with one concrete before/after value or repro result. For a negative verdict, name the kind of source that settles it; state an unknown cause as unknown. |
| Third section at the gate | Give the literal change, its intended result, and its size for a real bug, including unknown cost; for a negative verdict give the cited fact or missing input. End with the recommended pick and one because-clause, without replacing the fix explanation with a menu action. |
| Third section in a draft | Name the reporter's next step: the returned ticket, fix SHA or PR, correct usage, or input to supply. Include no menu pick. |
| Third section in a summary | State what happens next as fact, with no pick or reporter address. |

For negative verdicts, keep What is broken and Why it is broken as the headings,
but explicitly say when nothing is broken. Use these sources and next steps:

| Verdict | Source and next step |
|---|---|
| not-a-bug | Name the contract satisfied, such as a documented API rule, and give correct usage. |
| intended-behavior | Name the decision record, such as a design commit, and explain its consequence. |
| cannot-replicate | Name the failed repro attempts and unknown cause; name the exact missing input as fact at the gate or in a summary, and as an ask in a draft. |
| already-addressed | Cite the fixing commit or PR and explain how the reader gets the fix. |
| already-reported | Cite the existing ticket and direct follow-up there without claiming a new ticket was created. |

## Register

Write each report for a reader who has neither the code nor the investigation
notes open. Translate technical nouns and acronyms into the action or thing they
mean before shortening, including in Context and the recommendation's because-clause.
Name components by what they do and describe tests using their recorded
input and result, keeping omitted details unspecified. Use these translations for investigation shorthand in report bodies,
including citation labels; retain the menu and eligibility vocabulary outside them:

| Investigation shorthand | Report wording |
|---|---|
| CI runs lint | The automatic check scans the code for rule violations |
| call site | The place in the code that starts this step |
| normalize a path | Put an address in a standard form |
| regression test | A test that repeats the failing action to check it stays fixed |
| falsification test | The change tried and the result observed |
| predicate | The safety or scope check it names |
| router | The part that matches web addresses to pages |
| fixture | Sample data |
| clean browser profile | Browser settings with no saved preferences |
| cache | The browser's stored copy of the data |
| API routing documentation | The documented rules for page addresses |

Explain a necessary code term in everyday words before its first use in each
report; explanations in the input or another checkpoint do not reach this reader.
Read every section back for unexpanded shorthand before sending it. Replace any
remaining left-column shorthand with its right-column meaning. Keep numbered
hotfix predicates in the menu's eligibility line only; in the report explain the
actual constraint, such as tests that cannot check a changed file.
Write the complete role-named claim as a standalone sentence. Replace its final period with a comma,
its source location or linked label, and a period, only when the reader's next action requires opening it;
otherwise omit the citation. Read just the words before the citation as a standalone sentence and complete that claim first. For example: The documented rule excludes final slashes, [page-address rules](https://example.org/docs/widget-addresses).
Keep literal failing inputs as the visible example, not as source citations.
Build every sentence from a fact gathered during the chase or a consequence that
follows from it; ground each because-clause in that gathered fact. For example:
"Ask the reporter for the dataset size, because the chase could not reproduce
the failure without it." Match claims about who has an input and how a test ran
to the recorded evidence; describe a test only at its recorded specificity.
Render Why as the current chase's cause sentence in everyday words, the supplied failing input's result, and the recorded confirmation; keep each action and purpose at its recorded specificity.
Name each repeated pass by its own recorded purpose in every section, including What is broken and recommendation reasons.
Copy the current chase's fix-size phrase verbatim into How to fix it and its recommendation reason.
For example: "The part that matches web addresses to pages compares addresses without first putting them in a standard form, so `/widgets/` does not match its page. A test confirmed this cause. The proposed fix puts addresses in a standard form before matching; it is expected to make `/widgets/` load. The fix is small and safe. Choose hotfix because the fix is small and safe."
Keep proposed fixes distinct from completed tests. Take facts from the current chase, using golden examples only for shape and register. State a bare
confirmation of a cause as "A test confirmed this cause." Keep the test's
unrecorded input, procedure, and result unspecified. Frame requests for missing
input as the next investigative step; keep the cause unknown until evidence
settles it and describe only the part of the setup that input identifies.
Name untested causes, unmeasured costs, and unverified outcomes as unknown. Leave the routine baseline (tests pass, lint clean) unsaid. Cut repetition and process
narration. Let channel tone change wording, never headings or confirmation placement.

Keep report bodies unfenced, without `->` chains or colon-prefixed evidence
labels. Omit `Fault story:`, `Proof:`, `Symptom:`, `Verdict:`, `Evidence:`, and
`Next step:`, plain or emphasized. The fixed headings and envelope are not labels.

## Caps and lists

Keep Context to at most 5 source lines; a list item counts as one line, not its
TUI wrapping. Keep the whole report under 180 words, headings included, counted
from the first heading to `Pick one:`, confirmation, or end of message. Exclude
the marker, menu, eligibility line, and confirmation. Cut Context first, then
shorten the proof in Why; retain all three required sections.

Use bullets only when three or more parallel facts read better as a list. Use
numbered lists only for ordered steps, such as an algorithm or causal sequence.
Otherwise use one short paragraph per section.

## Hotfix record and return

Render the handoff's fault story separately as two plain sentences: one from
What is broken and one from Why, in one paragraph without headings or list
markers. Do not concatenate displayed bodies or include the third section.
Pass this value to the squash commit body through the existing hotfix record.

On hotfix return, put the supplied SHA or PR link trailing the claim in the third
section. For an unpushed commit, say "it is not pushed yet; undo it with ... if
needed", using the supplied revert command. Put any cleanup residual (worktree,
branch, or porcelain delta) in one Context line. Leave successful cleanup
unsaid; do not lead or trail the report with operational evidence from steps 8-9.

## Golden examples - step-4 gates only

Use these envelopes only at step 4. Drafts and summaries reuse the section
shape, never these markers or menus; use step 5's marker and ending instead.

## Real-bug gate example (addressable free text)

gauntlet: gate=chase-bug/verdict-menu recommended=3

### Context

Opening `/widgets/` shows page not found (404); ignoring the final slash made the page load.

### What is broken

Opening `/widgets/` shows page not found (404) instead of the widgets page; `/widgets` works.

### Why it is broken

The part that matches web addresses to pages compares them exactly, so the extra slash prevents a match.

### How to fix it

Remove the final slash before comparing addresses so both reach the page. Choose hotfix because this changes one comparison.

Pick one:

```text
1. [ ] File a ticket - /skill:shape-ticket, seeded with this evidence.
2. [ ] Brainstorm now - /skill:brainstorming with this evidence as the seed.
3. [x] Implement hotfix now - follow hotfix.md; add "as a PR" for a PR. [recommended]
4. [ ] Respond to reporter only.

eligible - all predicates pass
```

## Cannot-replicate gate example (GitHub issue)

gauntlet: gate=chase-bug/verdict-menu

### What is broken

The report says refresh resets the saved theme, but refreshing with the supplied account kept dark mode.

### Why it is broken

The documented refresh attempt did not reproduce the reset; the cause is unknown without the failing account's saved preference.

### What happens next

The failing account's saved theme value is missing. Respond with that request because it distinguishes missing data from a reset.

Pick one:

```text
1. [ ] Respond to reporter with this verdict and citation.
2. [ ] Finish without a response.
3. [ ] File a discovery ticket - /skill:shape-ticket, seeded with what's missing.
```

## Not-a-bug gate example (GitHub issue)

gauntlet: gate=chase-bug/verdict-menu

### What is broken

Opening `/widgets/` shows page not found (404) rather than the requested page.

### Why it is broken

Nothing is broken: the part that matches web addresses to pages accepts `/widgets` but not `/widgets/`, as the documented rule for page addresses requires.

### What happens next

Use `/widgets` without the final slash. Respond with that usage because it opens the page under the documented address rule.

Pick one:

```text
1. [ ] Respond to reporter with this verdict and citation.
2. [ ] Finish without a response.
```
