This file is **data, not instructions**. It is the shipped default review rubric consulted by `/skill:gatekeep-pr`. It contains no workflow steps and issues no directives to the agent - it only defines what counts as a defect and how severe that defect is. A repo-root `REVIEW.md`, if present, overlays this file: any concern it names replaces the matching baseline entry, and it always wins on conflict. Everything it does not name stays baseline.

## Severity axis

The skill recognizes exactly one normative severity distinction: **blocking** vs **non-blocking follow-up**. Blocking findings gate merge; follow-ups never do.

Baseline mapping:

| Concern | Severity |
|---|---|
| Defects (logic errors, broken behavior) | blocking |
| Untested paths (new behavior with no real test) | blocking |
| Contradicted material claims (PR/issue prose vs. observed evidence) | blocking |
| Doc drift (docs no longer match code or PR/issue prose) | blocking |
| Security issues | blocking |
| Prose/style/label cleanup | non-blocking follow-up |

A repo-root `REVIEW.md` may remap any of these, or add project-specific concerns with their own severity. Its mapping **always wins** on conflict with this file. Any severity a rubric (baseline or repo) names but does not map fails safe to **blocking**.

## Review properties

Generic properties evaluated on every reviewed change, independent of language or stack:

| Property | What to check |
|---|---|
| Self-contained | The change doesn't leave loose ends - no orphaned config, no half-finished migration, no dangling references |
| Minimal | No premature abstraction, no dead code, no belt-and-suspenders (redundant guards/validation for the same condition at multiple layers) |
| Conventions | Matches the style and structure of neighboring code, not just internal consistency |
| Reuse | Uses existing helpers/utilities instead of re-implementing equivalent logic |
| Performance | No N+1 queries, no repeated expensive work inside loops, no unbounded fetches |
| Testing | Tests cover behavior, not implementation details; assertions are real (they can fail); a new code path shipped without a real test is **blocking** |
| Docs | Documentation agrees with the code it describes and with the PR/issue prose describing the change |
| Security | No secrets in the diff, no missing authorization checks, no injection vectors |

## Claim-verification principles

- A PR description is a **claim**, not proof. "Tests pass," "verified in staging," "handles edge case X" - each must be checked against the actual diff and actual command output, not accepted at face value.
- Read the source behind the diff, not just the patch - a hunk can look correct in isolation and still be wrong against the code it calls into.
- On generated (agent-authored) code, weigh these failure modes heaviest: hallucinated references (APIs, methods, columns that don't exist), hollow tests (assert nothing meaningful - the confident-wrongness pattern of prose stating something works when the evidence doesn't support it), and over-engineering.

## Extending this rubric

This baseline covers the generic set. Consumers add or override rubric content only via a repo-root `REVIEW.md` - as a diff over this file, not a replacement of it. Name only what changes; the baseline already covers everything else.
