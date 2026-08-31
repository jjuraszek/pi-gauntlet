# Ticket wording contract (self-containment)

Consumed by `shape-ticket`'s SKILL.md (draft step, no-op check, and every roast brief). Normative: "must" means must.

## Reader and scope

1. **Reader definition.** The "stranger" the ticket body serves is a reader who has never opened the repo. Acceptance Criteria are exempt throughout this contract - they address the implementer and may name files, symbols, and settings freely.

Scope: Context/Problem/Idea prose only. ACs, split justification blocks, metadata rationale lines, and Reporter-note comments are out of this contract's scope.

## Rules

2. **Self-containment test.** Remove every code/doc reference from Context, Problem, and Idea; what remains must still make the problem and its impact understandable and triagable by that reader. Deleting the references may lose depth, never comprehension. The test is a reviewer judgment with a mechanical framing (strip, re-read, ask "triagable?"), not a keyword scan.
3. **Precedence.** Self-contained human comprehension wins over brevity and retrieval-density norms; compression applies only after the test passes. "Shortest body" survives as a constraint on what may be omitted, never a license to leave jargon undefined or mechanisms unexplained.
4. **Plain-words lead.** Each independently asserted failure or impact in Problem opens with a plain-words sentence of what goes wrong and what it costs, before any mechanism. (The lead and example rules bind Problem; Context and Idea are bound by the general self-containment test.)
5. **Example per failure.** Each independently asserted failure carries a concrete example: real numbers, a before/after, or a short transcript. One example may serve multiple sentences describing the same failure. `none (<reason>)` is permitted only when no observable exists yet (pure rename/removal, or discovery work whose deliverable is the observable); the reason is part of the draft and thus roast-reviewable. A disputed reason is an ordinary roast finding handled by the existing disposition machinery (applied if unambiguous, surfaced at the gate if not) - no new disposition class.
6. **Jargon.** Domain jargon - including repo-native terms - is defined at first use in plain words, or dropped. A link is not a definition when the term is load-bearing for triage.
7. **Pointer demotion.** Code/doc references in Context/Problem/Idea are demoted to parenthetical pointers whose deletion loses no meaning, e.g. "(Pointer for the implementer: detectChains, src/chain-detector.ts.)". Composition with the tracker-native-links rule in SKILL.md's `## Ticket wording`: that rule governs *how* a reference is written (native link/mention form, never bare identifiers); pointer demotion governs *where* it may sit (parenthetical, deletion-safe).
8. **Link-vs-inline (anti-spiderman).** Linking stays legitimate for targets impractical to inline - a whole design doc, a KB page, a long log - and for general-knowledge material; every such link carries a one-line plain-words statement of what the reader needs from it. What is forbidden is the spiderman shape: many small load-bearing hops, where the full picture must be assembled from N places even when each individual inline would be cheap. Discriminator: "is this definition load-bearing for triage?" - load-bearing small definitions get inlined; big chunks get linked with a summary line.

## Exemplar

One bad->good body pair: a reference-laden mechanism-first fragment vs its self-contained rewrite. Genericized from the pi-condense#13 pair quoted in pi-gauntlet#18 - shape and numbers kept (they carry the persuasive force), repo-specific identifiers swapped for neutral ones, references reduced to the parenthetical-pointer form rule 7 mandates. The exemplar anchors roast review of the mechanism-first failure mode (the most common one); the other rules are checked from their normative statements above.

> Bad: "detectSpans stayed idle from the previous span's close (11:05) until the next real user message (22:26): the registry jumps from s25 (10:47-11:05) directly to s26 (22:26-00:02), leaving the active 11:06->13:43 work stretch unspanned."
>
> Good: "When the workflow auto-continues from one phase to the next, no human message marks the transition - and the context-trimming machinery only recognizes work that starts with a human message. So a 2.5-hour stretch of work became invisible to trimming: every prompt sent to helper agents during it (169KB, a quarter of what remains in the model's context) is stuck there for the rest of the session. (Pointer for the implementer: detectSpans, src/span-detector.ts.)"

Both versions are accurate; only the second is understandable without opening the repo.
