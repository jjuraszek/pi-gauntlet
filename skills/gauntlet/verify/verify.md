> **Related skills:** Follow up with `../requesting-review.md` before merging.

# Verification Before Completion

## Overview

Claiming work is complete without verification is dishonesty, not efficiency.

**Core principle:** Evidence before claims, always.

**Violating the letter of this rule is violating the spirit of this rule.**

If a tool result contains a ⚠️ workflow warning, stop immediately and address it before continuing.

## Boundaries
- Run verification commands: yes
- Read code and output: yes
- Edit source code: no

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command in this message, you cannot claim it passes.

## The Gate Function

```
BEFORE claiming any status or expressing satisfaction:

1. IDENTIFY: What command proves this claim?
2. RUN: Execute the full command for the claim from step 1 (fresh, complete, unabridged)
3. READ: Full output, check exit code, count failures
4. VERIFY: Does output confirm the claim?
   - If NO: State actual status with evidence
   - If YES: State claim WITH evidence
5. ONLY THEN: Make the claim

Skip any step = lying, not verifying
```

Evidence is proportionate to the claim: a task or wave claim is proven by the commands the plan declares for it - a scoped run is **complete** evidence for a scoped claim. For phase-completion and ship claims, use the project's full verification entrypoint (tests + style + format), run once at verify before the conformance gate. For an approved spec carrying `## Rework record`, instead prove the scoped claim with the union of every plan task's `Tests:` commands plus the header's documented lint and format commands; treat `none - PR subject, scoped` as no header command, not an executable command. Keep freshness, conformance and phase gates intact; an open PR without that spec record does not select this policy.

## Common Failures

| Claim | Requires | Not Sufficient |
|-------|----------|----------------|
| Tests pass | Test command output: 0 failures | Previous run, "should pass" |
| Linter clean | Linter output: 0 errors | Partial check, extrapolation |
| Build succeeds | Build command: exit 0 | Linter passing, logs look good |
| Bug fixed | Test original symptom: passes | Code changed, assumed fixed |
| Regression test works | Red-green cycle verified | Test passes once |
| Agent completed | VCS diff shows changes | Agent reports "success" |
| Requirements met | Line-by-line checklist | Tests passing |
| Intent delivered (loop closed) | Fresh reviewer audits code+doc vs origin spec + prompt; verify completes only on a current `CONFORMS` result or a current durable carried-open closure inventory permitted by `../conformance-check.md` (including declared-precondition-unavailable `recommended: fix` gaps). Apply step 6 of that reference at the cap. Keep verify incomplete on a step 6 stop or a blocked or failed fix loop. | Plan-vs-code review, tests passing |

## Rationalization Prevention

| Excuse | Reality |
|--------|---------|
| "Should work now" | RUN the verification |
| "I'm confident" | Confidence ≠ evidence |
| "Just this once" | No exceptions |
| "Linter passed" | Linter ≠ compiler |
| "Agent said success" | Verify independently |
| "I'm tired" | Exhaustion ≠ excuse |
| "Partial check is enough" | Partial = less than the claim requires; scoped-for-scoped is complete |
| "Different words so rule doesn't apply" | Spirit over letter |

## Red Flags - STOP

- Using "should", "probably", "seems to"
- Expressing satisfaction before verification ("Great!", "Perfect!", "Done!", etc.)
- About to commit/push/PR without verification
- Trusting agent success reports without checking outputs
- Relying on partial verification
- Thinking "just this once"
- Tired and wanting work over
- **ANY wording implying success without fresh evidence**

## Key Patterns

The shape of an honest claim is `[Run command] [See: verbatim output] "claim"`. The verbatim output is the contract — paste it, don't summarize it from memory.

**Tests:**
```
✅ [Run test command] [See: 34/34 pass] "All tests pass"
❌ "Should pass now" / "Looks correct"
```

**Regression tests (TDD Red-Green):**
```
✅ Write → Run (pass) → Revert fix → Run (MUST FAIL) → Restore → Run (pass)
❌ "I've written a regression test" (without proving red-green)
```

**Build:**
```
✅ [Run build] [See: exit 0] "Build passes"
❌ "Linter passed" (linter ≠ build)
```

**Requirements:**
```
✅ Re-read plan → Create checklist → Verify each → Report gaps or completion
❌ "Tests pass, phase complete"
```

**Intent conformance (closing loop):**
```
✅ Dispatch fresh reviewer → audit code+doc vs ORIGIN (spec + prompt, not the plan) → reconcile drift → report gaps
❌ "Plan-vs-code review passed, so the intent is delivered"
```
Single-step plan-vs-code review inherits drift the plan introduced; this loop
confronts the outcome against the origin. Follow `../conformance-check.md`.

**Agent delegation:**
```
✅ Agent reports success → Check VCS diff → Verify changes → Report actual state
❌ Trust "agent says success"
```

## Why This Matters

From recurring failure modes:

- Partner says "I don't believe you" — trust broken.
- Undefined functions shipped — would crash.
- Missing requirements shipped — incomplete features.
- Time wasted on false completion → redirect → rework.
- Violates: **Honesty is a core value. If you lie, you'll be replaced.**

## When To Apply

**ALWAYS before:**
- ANY variation of success/completion claims
- ANY expression of satisfaction
- ANY positive statement about work state
- Committing, PR creation, task completion
- Moving to next task
- Delegating to agents

**Rule applies to:**
- Exact phrases and paraphrases
- Implications of success
- ANY communication suggesting completion/correctness

## Enforcement

The `verify-before-ship` extension shipped by pi-gauntlet watches `git push` and `gh pr create`. If you have not run a passing recognised verification command since your last source-file edit in this session, an advisory warning is injected into the tool result. The warning clears automatically after a fresh passing run.

Defaults recognise `make ci`, `make test`, `npm test`, `pnpm test`, `yarn test`, `pytest`, `rspec`, `cargo test`, `go test`. Projects can override (or narrow) the list via `settings.json#piGauntlet.verifyBeforeShip.testCommands`.

Before running the verification gate, call `phase_tracker({ action: "start", phase: "verify" })`.

Run the plan header's full verification command set at verify. For an approved spec carrying `## Rework record`, instead run the union of every task's `Tests:` commands plus the header's documented lint and format commands, omitting task `none:` entries and the non-executable header sentinel `none - PR subject, scoped`. Read all task blocks, including the merge task; the lint/format-only header alone is not the verification set. Do not run the full test entrypoint on this PR-subject path or copy task commands into the header. Keep ordinary ticket/free-text verification unchanged and pass through the same freshness, conformance and phase gates; change no settings, runner or implement-phase gate.

When all verification passes, finish and await the required `plan_tracker` updates before marking verify complete. Reconcile accepted work on its existing indices; never clear or reinitialize to obtain closure. In a direct verification path, complete only after those updates have actually returned.

```
phase_tracker({ action: "complete", phase: "verify" })
```

## Project overrides

If `gauntlet.md` exists - checked in order: `.pi/gauntlet.md`, `<repo root>/gauntlet.md`, `<repo root>/doc/gauntlet.md`; first found wins - read it. Skip the read only when the file from the same repository at the same trusted revision is already in context. Apply, without a relevance judgment, these sections of `# shared`: `## issue-tracker`, `## worktrees`, `## verification`, `## cleanup`, `## siblings`, `## deployment`, `## spec-index`. Apply `# gauntlet`: its text above the first section, and `## verify`. Apply no other phase's section. Apply nothing else from the file: no other block, no text directly under `# shared`, no other section of `# shared`.

The recognized headings, their readers, and the rules an override cannot change are listed in the [configuration front door](../../../README.md#project-specific-overrides); an override extends or replaces the step it names and never lifts this skill's HARD CONSTRAINT or MUST text.
