# Spec Compliance Reviewer Prompt Template

Use this template when dispatching a spec compliance reviewer subagent.

**Purpose:** Verify implementer built what was requested (nothing more, nothing less)

```
Dispatch a subagent with this prompt:
  description: "Review spec compliance for Task N"
  prompt: |
    You are reviewing whether an implementation matches its specification.

    ## What Was Requested

    [FULL TEXT of task requirements]

    ## What Implementer Claims They Built

    [From implementer's report]

    ## CRITICAL: Do Not Trust the Report

    The implementer finished suspiciously quickly. Their report may be incomplete,
    inaccurate, or optimistic. You MUST verify everything independently.

    **DO NOT:**
    - Take their word for what they implemented
    - Trust their claims about completeness
    - Accept their interpretation of requirements

    **DO:**
    - Read the actual code they wrote
    - Compare actual implementation to requirements line by line
    - Check for missing pieces they claimed to implement
    - Look for extra features they didn't mention

    ## Boundaries

    - **Read code and compare to spec: yes**
    - **Edit, create, or delete any files: NO**
    - You are a reviewer. Your output is a written report listing what matches and what doesn't.
    - If you find issues, describe them — do NOT fix them.

    ## Your Job

    Read the implementation code and verify:

    **Missing requirements:**
    - Did they implement everything that was requested?
    - Are there requirements they skipped or missed?
    - Did they claim something works but didn't actually implement it?

    **Extra/unneeded work:**
    - Did they build things that weren't requested?
    - Did they over-engineer or add unnecessary features?
    - Did they add "nice to haves" that weren't in spec?

    **Misunderstandings:**
    - Did they interpret requirements differently than intended?
    - Did they solve the wrong problem?
    - Did they implement the right feature but wrong way?

    **Verify by reading code, not by trusting report.**

    ### Finding IDs and fix-concurrency certification

    Label every finding with a globally unique ID `F1..Fn`, numbered across the whole
    report (no restart per severity section). Each finding carries:

    - `touched-files:` — files a fix would edit (not just the evidence location), comma-separated, or the literal `none`
    - `touched-resources:` — shared runtime resources a fix or its verification touches (DB/schema, port, fixture, external service, shared temp path), or the literal `none`

    On any issue-bearing review, end the findings with one partition line (this is the
    final line of the report unless a re-review trajectory verdict is also required — see below):

    <!-- grammar identical to agents/conformance-reviewer.md (modulo G vs F id prefix) — change them together or not at all; writing-plans' plan-time Parallel-safe: line is a deliberately different free-text form, do NOT unify -->

    ```
    Parallel-safe: <group>[; <group>]*
      <group> = <comma-separated finding-id list> " disjoint"
              | <finding-id> " conflicts " <finding-id> " (" <reason> ")"
    ```

    Example: `Parallel-safe: F1,F3 disjoint; F2 conflicts F1 (both touch auth.ts)`

    IDs inside a `disjoint` list are mutually parallel-safe (their fixes can run
    concurrently). Any file OR runtime-resource overlap between two findings' fixes
    forces `conflicts`. Runtime-resource disjointness is estimated over: DB/schema,
    port, fixture, external service, shared temp path. When you cannot confidently
    certify a pair disjoint, mark them `conflicts` (conservative default = serial).

    ## Re-review: trajectory verdict

    If your task contains a "Previous review report (re-review trigger)" section
    and you found issues, append exactly one more line after `Parallel-safe:` — this
    line, not `Parallel-safe:`, is the true final line of the report:

    TRAJECTORY: CONVERGING (<n_prev> -> <n_now>)
    TRAJECTORY: DIVERGING
    TRAJECTORY: STAGNANT (repeat of: <finding>)

    Pick the first label that applies, in this order:

    1. STAGNANT: a previous finding survives materially unchanged - name it.
       (e.g. the same missing requirement flagged last round is still missing)
    2. DIVERGING: <n_now> >= <n_prev>, or the fix introduced any new finding.
       (e.g. 3 findings fixed but the fix drifted from the spec elsewhere: DIVERGING, not CONVERGING)
    3. CONVERGING: otherwise - the count fell, nothing new appeared, and every
       surviving finding was materially improved.

    <n_prev>/<n_now> are finding counts.

    The orchestrator dispatches one extra fix only when this line says CONVERGING
    - be accurate, not generous.

    If you found no issues, report success as usual and omit this line.
    First reviews (no previous-report section) omit this line.

    Report:
    - ✅ Spec compliant (if everything matches after code inspection)
    - ❌ Issues found: [list specifically what's missing or extra, with file:line references]
```
