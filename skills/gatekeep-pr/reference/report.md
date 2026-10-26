# gatekeep-pr: step 5 - report

Read from SKILL.md step 5, after `findings.md`. Input: the integration output. Output: the rendered report, then the menu (`decision-menu.md`). SKILL.md `## Wording rules` bind every line.

## Order

Render bottom-up for a terminal: least important first, verdict and menu last. Empty sections are omitted - never "None". A failed comment refresh, an incomplete comment source review (`post-selection-loop.md` `### Re-render`), a blocked or unknown merge state, or a binding pending check renders its one line under `PR comments` as well.

Section order is fixed:

Read and apply [menu-layout](../../brainstorming/reference/menu-layout.md) before presenting these options and before acting on a numeric reply.

```
Delivers: <one sentence: what the PR does. With source: spec, a second sentence built from these clauses in
          order, each present only when it applies, joined with semicolons: covered rows ("ACs 1, 2, 4";
          "ACs 1-5" when every row is covered; "no ACs" when none; a row whose mechanism half is covered
          counts in the covered list and its observation half adds the trailing clause); deferred rows grouped by ref, in row
          order ("3, 5 deferred per spec to <ref>"); deviating rows ("2 deviates per spec: <why>"); elsewhere rows grouped by repo ("6 elsewhere per spec: <repo>");
          observation halves ("4's observable half (<what>) is checked after merge, not here").>

PR comments:             (replyable review comments, a pending reviewer run, a blocked or unknown merge state, a binding pending check, a failed refresh, or an incomplete source review - see the paragraph above)
- <reviewer>'s comment on <topic> <verdict clause>, so the drafted reply <what it says>. (<locator>)
- The reviewer run is still in progress, so merge waits. (<run url>)
- GitHub reports this actor's merge as blocked, so merge waits. (merge_state_status BLOCKED; reviewDecision <value>)
- <other applicable line from decision-menu.md `## Withhold reason resolver`>

Nits:                   (after the list, one line `<N> nits open - fix nits to take them` (`1 nit open` for one); rendered only while the `fix nits` row renders.)
- <1-2 sentences>. (<file:line>)

Blockers:                (numbered; menu picks reference these numbers)
1. <1-2 sentences: what is wrong, why it matters>. (<file:line and exact supplied test name for a failing test; file only when no test name was supplied> | <check name> | <doc path>)

Description: <optional concise non-blocking uncertainty: author assertion versus what the gate cannot verify>

Sync: <digest's sync field value verbatim; optional explanation after it as a second clause or sentence; only when --rebase was passed>

Verdict: mergeable - <evidence clause> | fixable - <N> blockers | fixable - <withhold reason>

<menu>
```

Render `Sync:` only when `--rebase` was passed. Open the `Sync:` line with the digest's `sync` field value verbatim (for example `Sync: declined - other author's branch`). Put any explanation after that value as a second clause or sentence. Never paraphrase the status value into prose. Exempt this line from SKILL.md wording rule 5 (passing facts only under `show evidence`): name the resolved files even when the sync succeeded.

For obstacle reports, print exactly one `Evidence:` line naming the resolved evidence source and the assessed head, immediately before the verdict (for example `Evidence: CI (run 7001, test_unit and build_image green on 9c1e4f2)`). Use the resolved local verification summary instead when local evidence owns the assessment; do not invent a passing result when evidence is unavailable. Carry the same source summary into the obstacle menu's evidence hint. Exempt this compact source summary from the evidence-only rules below and SKILL.md wording rule 5; keep the full record under `show evidence`.

## Verdict

Two states: `mergeable` or `fixable`. `mergeable` carries the evidence clause from `findings.md` `## Provenance`: `CI green on the assessed head (<check name>)` or `verification command passed locally`. `fixable - <N> blockers` when `Blockers` is non-empty; `fixable - <withhold reason>` when it is empty but a merge prerequisite is unmet: `reviewer run in progress`, `binding check pending`, `blocked by GitHub`, `merge state unknown`, `failed gate` (listed for spec parity; a red gate mints a blocker per `findings.md` `## Namespaces`, so `Blockers` is non-empty), `comments not refreshed`, `comment source review incomplete`, `verification not run` (the command needed credentials or no command resolved, with nothing else blocking), `mergeable unknown`, `behind base`, `merge conflict` (for `mergeable == CONFLICTING`).

`<N> blockers` reads `1 blocker` for one.

## What stays out

Verbatim command output stays in its `log_path` file and never prints; `show evidence` prints its `show evidence: <log_path>` line instead. CI run URLs and conclusions (the pending-reviewer locator in `PR comments` is the one URL that prints in the report), drafted file edits and full description bodies, drafted replies, matched claims, per-row AC outcomes, internal IDs, and disposition annotations print only under the `show evidence` command. A clean run with a spec renders `Delivers`, the verdict line, and the menu - about four lines.

Print the compact exact old-to-new description preview under its blocker; keep the full replacement body under `show evidence`. Uncertainty alone preserves the mergeable verdict.

Print `state: <absolute-path>` under `show evidence`, followed by the run record's course, immutable target, stored scope baseline, cumulative round/sync usage and caps, deadline, wave checkpoints and failed-prerequisite history. Then print, in this order: the evidence record (CI: each satisfying check's name, conclusion, SHA, run URL; local: each run's command, `result`, `exit_code`, and one `show evidence: <log_path>` line pointing at its captured output - never the output itself); claim dispositions; AC outcomes per row and the `cross-check:` line (`assessment.md` `## Select the scope contract`); check dispositions; drafted payloads keyed by the blocker or nit number they fix; drafted replies keyed by the `PR comments` item they answer.

## Worked example

Own PR, ticket gh-45:

```
Delivers: the reports page exports CSV on demand. ACs 1, 2, 4; 3 deferred per spec to acme/widgets#46; 4's observable half (export completes under 5s on production data) is checked after merge, not here.

PR comments:
- maria's comment on the missing CSV header is already addressed, so the drafted reply points her at the fix. (3f2a1c0)

Nits:
- The export pages results with its own loop instead of the shared paging helper, so a paging bug fixed once would need fixing twice. (src/api/export.ts:31, lib/page.ts)
1 nit open - fix nits to take them

Blockers:
1. The export endpoint ships with no test, so nothing proves it works and nothing
   catches it breaking. (src/api/export.ts:10-58)
2. The export guide still says exports run nightly; the PR makes them on-demand, so a
   reader following the docs waits for a job that no longer exists; the doc fix is drafted.
   (docs/exports.rst:88)

Verdict: fixable - 2 blockers

```

A clean own PR with ticket gh-45 and CI green:

```
Delivers: the reports page exports CSV on demand. ACs 1-5.

Verdict: mergeable - CI green on the assessed head (test)

```

Render the initial example and every later menu from `menus.md`; keep all evidence-only details under the hint command. Preserve bottom-up report order before the selected template.
