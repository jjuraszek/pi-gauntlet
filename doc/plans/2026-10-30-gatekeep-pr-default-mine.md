# gatekeep-pr default queue and role Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Discover the viewer's open origin-repository PR queue when no PR token is supplied, and show the viewer's current role on every assessment report.

**Architecture:** Keep discovery in verification-brief.md Section A, called from argument resolution before record, tracker, or provisioning effects. Feed origin URL tokens into existing single/set routes; derive the display-only role from the refreshed digest and render through the existing report contract. Preserve dispatch, menus, cleanup, and settings.

**Tech Stack:** Markdown skill contracts, GitHub CLI, Node.js node:test, existing text replay/judge harness.

**Spec:** `doc/specs/2026-10-30-gatekeep-pr-default-mine.md`

**Verification:** `npm test && node eval/run.mjs gatekeep-pr`

Baseline jjuraszek/pi-gauntlet: 40dce010

---

## Recon and rules

One home leg, `jjuraszek/pi-gauntlet`, uses the supplied `gatekeep-pr-mine` checkout and spec-recorded contract. No companion or deployment split applies. The overrides contain no Happy path table and no separate lint/format commands.

Rules: AGENTS.md
Rules: .pi/gauntlet-overrides.md
Rules: README.md
Rules: CHANGELOG.md
Rules: eval/README.md
Rules: doc/personas.md
Rules: doc/configuration.md
Rules: doc/gate-contract.md
Rules: doc/implement-engines.md
Rules: doc/install-internals.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
Rules: skills/forge-skill/SKILL.md

The task-path walk found no nested AGENTS.md or CLAUDE.md governing skills/gatekeep-pr, scripts, eval/gatekeep-pr, eval/gatekeep-pr-scope, or eval/gatekeep-pr-merge-state. Root documentation links contribute the additional rules above. Use forge-skill's imperative voice, minimal edits, observable branches, and compact tables. No instruction file in this change currently exceeds its 500-line extraction threshold.

| Seam | Existing source and implementation consequence |
|---|---|
| Invocation | skills/gatekeep-pr/SKILL.md:1-38 owns arguments, set routing, and progress initialization. Discovery finishes before the latter. |
| Gather | skills/gatekeep-pr/verification-brief.md:26-128 owns fixed commands, current-branch fallback, digest, and viewer identity. Preserve adjacent issue-reference resolution. |
| Refresh | skills/gatekeep-pr/reference/post-selection-loop.md, `### Pre-menu refresh`, owns same-head digest replacement. Add the field to its existing command. |
| Report | skills/gatekeep-pr/reference/report.md:5-105 owns order, passing-fact exceptions, clean-report description, and both examples. |
| Admission | skills/gatekeep-pr/reference/batch.md:5-15 owns cap and harness rejection. Later roster-order provisioning and verbatim child-report rendering already implement downstream behavior. |
| Re-gather and authority | skills/gatekeep-pr/reference/sync.md, `## Re-gather`, replays Section A. skills/gatekeep-pr/reference/decision-menu.md:35 retains viewer.is_author approval. Neither needs modification. |
| Static tests | scripts/gatekeep-comment-reconcile.test.mjs:1-73 loads sources and validates three target hashes; lines 95-105 assert admission; lines 351-370 pin report order; lines 556-574 assert refresh/watch behavior. |
| Eval assembly | eval/lib/replay.mjs:36-55 implements assemble and leading bundle directives; eval/lib/checks.mjs exports sha256. eval/lib/lint.test.mjs checks every committed target. eval/run.mjs:172-205 resolves baseline and validates intent; its final run writes report.md. |
| Docs | README.md:90,98,309-312 owns invocation/smoke statements. eval/gatekeep-pr/README.md:3,18-29 owns sample count and local bundles. |

Scoped tests use Node's file-addressable test runner. There is no configured formatter or standalone Markdown linter. Apply authoring rules; use `node --check scripts/gatekeep-comment-reconcile.test.mjs` for scoped JavaScript syntax and `node scripts/skill-size-lint.mjs` for instruction-size lint. The header's first command bundles repository structural/style checks, eval lint/hygiene, deterministic tests, package checks, and smoke tests; its second command is required model-backed target verification. Full verification runs only after the task waves.

## Files

### Instruction contracts and static tests

**Modify:**
- `skills/gatekeep-pr/SKILL.md`
- `skills/gatekeep-pr/verification-brief.md`
- `skills/gatekeep-pr/reference/batch.md`
- `skills/gatekeep-pr/reference/post-selection-loop.md`
- `skills/gatekeep-pr/reference/report.md`
- `scripts/gatekeep-comment-reconcile.test.mjs`
- `eval/gatekeep-pr/intent.md`
- `eval/gatekeep-pr-scope/intent.md` (assembly hash only)
- `eval/gatekeep-pr-merge-state/intent.md` (assembly hash only)

### Replay fixtures and evidence

**Create:**
- `eval/gatekeep-pr/samples/no-arg-discovery-over-cap/case.md`
- `eval/gatekeep-pr/samples/no-arg-discovery-over-cap/expected.md`
- `eval/gatekeep-pr/samples/no-arg-discovery-single/case.md`
- `eval/gatekeep-pr/samples/no-arg-discovery-single/expected.md`
- `eval/gatekeep-pr/samples/no-arg-discovery-zero/case.md`
- `eval/gatekeep-pr/samples/no-arg-discovery-zero/expected.md`
- `eval/gatekeep-pr/samples/no-arg-discovery-cc-multi/case.md`
- `eval/gatekeep-pr/samples/no-arg-discovery-cc-multi/expected.md`
- `eval/gatekeep-pr/samples/no-arg-discovery-failed/case.md`
- `eval/gatekeep-pr/samples/no-arg-discovery-failed/expected.md`
- `eval/gatekeep-pr/samples/no-arg-discovery-under-cap/case.md`
- `eval/gatekeep-pr/samples/no-arg-discovery-under-cap/expected.md`
- `eval/gatekeep-pr/samples/role-line-requested/case.md`
- `eval/gatekeep-pr/samples/role-line-requested/expected.md`

**Modify:**
- `eval/gatekeep-pr/replay.md`
- `eval/gatekeep-pr/report.md` (generated by verify, never hand-authored)
- `eval/gatekeep-pr/results/**` (runner-owned records for changed assemblies, generated by verify)

### Index and user documentation

**Modify:**
- `README.md`
- `eval/gatekeep-pr/README.md`

**Delete:** none.

CHANGELOG.md is release-owned and explicitly deferred by the spec; leave it unchanged. No runtime module, persona, settings key, or global target manifest changes apply.

## Baseline provenance

Initial jjuraszek/pi-gauntlet inventory at 40dce010 was clean. Admitted paths: `doc/specs/2026-10-30-gatekeep-pr-default-mine.md` and `doc/plans/2026-10-30-gatekeep-pr-default-mine.md`; no In-flight paths were supplied. Immediately before execution, status contained only `?? doc/plans/2026-10-30-gatekeep-pr-default-mine.md`. Both commands were executed again while repairing the header separator: Task 1 exited 0 with 60 tests passed; Task 2 exited 0 with 74 tests passed. After each run, HEAD remained 40dce010 and status contained only that admitted plan path. No generated artifacts or source contamination occurred. Commands ran at the home leg's checkout root; full verification was not run.

## Wave 1 - Invocation and report contracts

### Task 1: Route discovery and refresh the role line
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** Modifying tested code - run existing prose-contract tests, add failing assertions, then edit their owning instructions.

**Spec:** doc/specs/2026-10-30-gatekeep-pr-default-mine.md § "Acceptance criteria" L29-L45, § "Design" L71-L71, § "Discovery (Section A of `verification-brief.md`, executed from `SKILL.md` `## Arguments`)" L75-L79, § "Discovery (Section A of `verification-brief.md`, executed from `SKILL.md` `## Arguments`)" L82-L83, § "Discovery (Section A of `verification-brief.md`, executed from `SKILL.md` `## Arguments`)" L86-L93, § "Discovery (Section A of `verification-brief.md`, executed from `SKILL.md` `## Arguments`)" L95-L97, § "Set routing (`SKILL.md` `## Arguments`, `batch.md` `## Admit before effects`)" L101-L103, § "Role line (Section A digest, `post-selection-loop.md` `### Pre-menu refresh`, `report.md`)" L107-L111, § "Role line (Section A digest, `post-selection-loop.md` `### Pre-menu refresh`, `report.md`)" L113-L113, § "Role line (Section A digest, `post-selection-loop.md` `### Pre-menu refresh`, `report.md`)" L116-L119, § "Role line (Section A digest, `post-selection-loop.md` `### Pre-menu refresh`, `report.md`)" L122-L122, § "Arguments and surface (`SKILL.md`, README)" L126-L126, § "Size budget" L147-L147, § "Errors and edge cases" L151-L160, § "Tests" L175-L176, § "Out of scope" L187-L193, § "Open questions" L197-L197

**Files:**
- Modify: `skills/gatekeep-pr/SKILL.md:1-38`
- Modify: `skills/gatekeep-pr/verification-brief.md:26-128`
- Modify: `skills/gatekeep-pr/reference/batch.md:5-15`
- Modify: `skills/gatekeep-pr/reference/post-selection-loop.md`
- Modify: `skills/gatekeep-pr/reference/report.md:5-105`
- Modify: `scripts/gatekeep-comment-reconcile.test.mjs`
- Modify: `eval/gatekeep-pr/intent.md:1`
- Modify: `eval/gatekeep-pr-scope/intent.md:1`
- Modify: `eval/gatekeep-pr-merge-state/intent.md:1`
- Test: `scripts/gatekeep-comment-reconcile.test.mjs`

**Tests:**
- `node --test scripts/gatekeep-comment-reconcile.test.mjs`
- baseline: 40dce010 pass
- via: `verification-brief.md` Section A, `batch.md` `## Admit before effects`, `post-selection-loop.md` `### Pre-menu refresh`, `report.md`

Decision: reuse discovery-time `viewer.login` for the first single-PR gather rather than reading twice; explicit-token invocations still read identity in Section A. The spec requires one discovery read and Section A already owns the same field. Preserve sync.md's later full re-gather and each batch child's independent gather; do not extend the private dispatch schema.

Decision: update all three existing target intent hashes with the instruction change. scripts/gatekeep-comment-reconcile.test.mjs:41-58 computes `sha256(assemble(target, read))`; the scope and merge-state targets include edited files. Preserve their intent bodies and do not claim new model evidence for those targets.

- [ ] **Step 1: Run existing scoped tests.**

  Run: `node --test scripts/gatekeep-comment-reconcile.test.mjs`
  Expected: existing assertions pass before edits.

- [ ] **Step 2: Add failing contract assertions.**

  Extend admission assertions with the print-exactly `multi-PR mode requires pi's nested dispatch` line. Assert the command inside `### Pre-menu refresh` includes `reviewRequests`, not merely a mention elsewhere. Extend report-order expectations to `Delivers`, `Role:`, `PR comments`, `Nits`, `Blockers`, `Verdict:`. Assert origin-bound discovery commands, early argument-resolution ordering, and absence of the removed branch fallback. Reuse the existing `section` helper and assertion-table style.

- [ ] **Step 3: Confirm red.**

  Run: `node --test scripts/gatekeep-comment-reconcile.test.mjs`
  Expected: missing discovery rejection, refreshed field, and Role line fail the new assertions.

- [ ] **Step 4: Replace Section A's fallback with discovery.**

  Remove `Missing PR number: gh pr view --json number,url on the current branch; no PR found -> STOP and report.` Keep the adjacent issue-reference resolution. Mark the new block argument-resolution-only, not a Gatherer step-1 operation. Finish before `SKILL.md` `## Progress tracking`, record minting, tracker `init`, set admission, or provisioning.

  Resolve origin with `git remote get-url origin`, strip `.git`, lowercase the GitHub owner/repository, and stop on unreadable/non-GitHub origin with `discovery failed: origin is not a GitHub repository`. Read `gh api user --jq .login` once into `viewer.login`; failure records `unreadable` but continues using `@me`. Document exactly these commands, substituting resolved origin:

  ```bash
  gh pr list -R <owner/repo> --author @me --state open --limit 1000 --json number,isDraft,reviewDecision,additions,deletions
  gh pr list -R <owner/repo> --search 'user-review-requested:@me' --state open --limit 1000 --json number,isDraft,reviewDecision,additions,deletions
  ```

  Use `user-review-requested:@me`, not `review-requested:@me`; team membership is not a roster source. The spec accepts the documented GitHub semantics without a reachable live fixture. If one becomes reachable during implementation, compare both qualifiers and record the actual differential in the PR body; route a contradiction through amendment. Do not claim a live test occurred otherwise.

- [ ] **Step 5: Specify completeness, filtering, and routing outcomes.**

  Validate each query before filtering: nonzero exit reports `discovery failed: <first gh error line>`; non-array, non-object row, missing `number`, or non-integer `number` reports `discovery failed: malformed gh pr list output`; count equal to `--limit` reports `discovery failed: incomplete (<query> hit --limit 1000)`. Never convert malformed/partial results to zero matches or fall back to the current branch.

  Union complete results by `number`; remove `isDraft` true and only exact `reviewDecision` values `APPROVED` and `CHANGES_REQUESTED`. Retain `REVIEW_REQUIRED`, `null`, empty string, and other values. Sort by `additions + deletions`, then number ascending; duplicates count once. Empty output prints `no open PRs authored by <login> or awaiting <login>'s review in <owner/repo>`, substituting `@me` for unreadable identity.

  One match becomes an origin URL token on either harness. Two or more on pi become ordered origin URL tokens with `source: discovered`; two or more on Claude Code print `multi-PR mode requires pi's nested dispatch` and exactly one `discovered, smallest first:` comma-separated-number line. Preserve origin through URLs despite `GH_REPO` or `gh repo set-default`; do not change typed bare-number repository binding.

- [ ] **Step 6: Route arguments and admission once.**

  In `SKILL.md` `## Arguments`, replace `keep zero or one PR token on the existing single-PR path below` with `keep one PR token on the single-PR path below; zero tokens discover per verification-brief.md Section A before this row runs and re-enter it with the discovered roster when the roster holds two or more`. Add `a trailing comma on a PR token is stripped before identity normalization, so a pasted discovered, smallest first: list is a valid set`. Preserve order and existing duplicate, issue-reference, repository, and harness checks.

  Remove `omitted -> resolved from the current branch per verification-brief.md Section A`. Replace it with `omitted -> discovered per verification-brief.md Section A during argument resolution (my open PRs in origin: authored or directly requested, no drafts or decided PRs, smallest first); one match gates on this path, two or more re-enter the set-routing row on pi and stop with the discovered list on Claude Code`. Prefix `argument-hint` with `[no argument: my open PRs]`. Explicit `/skill:gatekeep-pr 123` bypasses discovery, including on a branch with another PR; explicit drafts remain assessable.

  In `batch.md` `## Admit before effects`, pin the Claude Code rejection beside the cap text. Preserve `parallel.maxTasks` (default 8), no chunking/trimming. Only for `source: discovered`, append the sorted list once after cap/harness rejection. The acceptance example is `multi-PR mode takes at most 4 PRs (pi-cohort parallel.maxTasks); got 6`, followed by `discovered, smallest first: 101, 97, 112, 88, 130, 104`. Explicit sets print no discovered list. Supplied order survives provisioning, summary rows, and queued menus. Carry `--rebase [base]` into existing routing, including other-author confirmation.

- [ ] **Step 7: Extend digest and same-head refresh.**

  Add `reviewRequests` to Section A's fixed `gh pr view --json` list. Retain raw exports as `pr.review_requests`: `{__typename, login}` for a `User`, `{__typename, name, slug}` for a `Team`. Add `viewer.role` beside `viewer.is_author`. Compute `unreadable` first when `viewer.login` is unreadable; otherwise `author` when `is_author`; otherwise `requested reviewer` when a User login equals the viewer case-insensitively; otherwise `none`. Author wins over a stale request to self.

  In `post-selection-loop.md` `### Pre-menu refresh`, add the same field to its command and replace `pr.review_requests` and re-derive `viewer.role` together with merge state, `reviewDecision`, `status_checks`, and `actions_runs` on an unchanged head. Use pending requests, never `reviews` history. `sync.md` already replays Section A. Keep `decision-menu.md`'s `approve` availability based on `is_author`, not the display role.

- [ ] **Step 8: Render the role in the report owner.**

  Put exactly one `Role:` directly under `Delivers` before `PR comments`. Read current `review_requests` in API order, omit the viewer using case-insensitive comparison, render User `login` and Team `slug` as `org/slug`, and missing login/slug as `unknown`. A `gh` export contains only User and Team entries; add no bot/mannequin adapter.

  Examples: `Role: author (requested: robin, acme/reviewers)`, `Role: requested reviewer (also requested: robin, acme/reviewers)`, `Role: none (requested: robin)`, `Role: unreadable (requested: unknown, acme/reviewers)`. Omit the parenthetical for an empty list; unreadable viewer identity excludes no user by guess. Same-head review submission moves requested reviewer to none; additions/removals replace the list on refresh.

  Put `Role: author` under Delivers in both worked examples. In `## What stays out`, describe the clean report as `Delivers`, `Role`, the verdict line, and the menu - about five lines. Add `Role:` to the wording-rule-5 exemption beside `Sync:`. Keep `role:` out of the batch summary; the parent prints the child's report verbatim. Preserve predecessor dispatch, menus, and cleanup.

- [ ] **Step 9: Refresh existing assembly metadata.**

  Compute the three target hashes using the existing `assemble` and `sha256` functions with each target.json and current source text; replace only each intent.md `for:` line. Do not predict a hash. Task 2 owns new intent narrative and facts; static tests verify metadata here.

- [ ] **Step 10: Confirm green and check scoped style.**

  Run: `node --test scripts/gatekeep-comment-reconcile.test.mjs`
  Expected: all tests pass, including admission, refresh, report-order, and hash assertions. The package's `npm test` entrypoint later executes them through `scripts/ci.mjs` as part of header verification.

  Run: `node --check scripts/gatekeep-comment-reconcile.test.mjs`
  Run: `node scripts/skill-size-lint.mjs`
  Expected: exit 0. Review changed text against `/skill:forge-skill`: ASCII punctuation, compact tables, no unrelated reflow. Each touched skill stays below 50,000 bytes and 2,000 lines; verification-brief.md and post-selection-loop.md each gain less than 3,000 bytes. No formatter is configured.

- [ ] **Step 11: Commit contracts and static tests.**

  Stage exactly the nine Modify paths for this task. Commit with `git commit -m "Discover the viewer PR queue and render refreshed roles" -m "Behavior change; replay samples and candidate evidence follow in the eval wave."`.

## Wave 2 - Replay coverage

Depends on Wave 1: fixtures and intent describe the new contract; scripts/gatekeep-comment-reconcile.test.mjs is edited again, preventing same-wave execution.

### Task 2: Add discovery and role replay cases
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** New behavior fixtures - assert required structure first, then add synthetic cases and expected facts.

**Spec:** doc/specs/2026-10-30-gatekeep-pr-default-mine.md § "Evals" L132-L143, § "Tests" L164-L173

**Files:**
- Modify: `eval/gatekeep-pr/replay.md:1`
- Modify: `eval/gatekeep-pr/intent.md`
- Modify: `eval/gatekeep-pr/report.md`
- Modify: `eval/gatekeep-pr/results/**`
- Modify: `scripts/gatekeep-comment-reconcile.test.mjs`
- Create: `eval/gatekeep-pr/samples/no-arg-discovery-over-cap/case.md`
- Create: `eval/gatekeep-pr/samples/no-arg-discovery-over-cap/expected.md`
- Create: `eval/gatekeep-pr/samples/no-arg-discovery-single/case.md`
- Create: `eval/gatekeep-pr/samples/no-arg-discovery-single/expected.md`
- Create: `eval/gatekeep-pr/samples/no-arg-discovery-zero/case.md`
- Create: `eval/gatekeep-pr/samples/no-arg-discovery-zero/expected.md`
- Create: `eval/gatekeep-pr/samples/no-arg-discovery-cc-multi/case.md`
- Create: `eval/gatekeep-pr/samples/no-arg-discovery-cc-multi/expected.md`
- Create: `eval/gatekeep-pr/samples/no-arg-discovery-failed/case.md`
- Create: `eval/gatekeep-pr/samples/no-arg-discovery-failed/expected.md`
- Create: `eval/gatekeep-pr/samples/no-arg-discovery-under-cap/case.md`
- Create: `eval/gatekeep-pr/samples/no-arg-discovery-under-cap/expected.md`
- Create: `eval/gatekeep-pr/samples/role-line-requested/case.md`
- Create: `eval/gatekeep-pr/samples/role-line-requested/expected.md`
- Test: `scripts/gatekeep-comment-reconcile.test.mjs`
- Test: `eval/lib/lint.test.mjs`

**Tests:**
- `node --test scripts/gatekeep-comment-reconcile.test.mjs eval/lib/lint.test.mjs`
- baseline: 40dce010 pass
- via: `eval/gatekeep-pr/replay.md`, `verification-brief.md` Section A, `batch.md`, `post-selection-loop.md` pre-menu refresh, `report.md`

Decision: use `kind: text` with inline fixtures in case.md, not fixture directories; eval/lib/lint.mjs rejects fixture/ for text targets. Keep target.json unchanged. batch.md is absent from the global manifest; other instruction owners already appear there.

Decision: the existing expected.md files contain no fact pinning a clean-report line count or the line immediately after `Delivers`. Preserve those facts and verbatim supplied batch reports; add no invented Expected-to-move entries for absent facts. The new role sample owns report-shape assertions. Existing stale supplied reports remain verbatim under the predecessor's no-rewrite rule.

- [ ] **Step 1: Add failing sample-structure assertions.**

  Extend scripts/gatekeep-comment-reconcile.test.mjs with its read/parseExpected style and import parseCase from the existing replay module to inspect bundles. Require all seven case/expected pairs, six `bundle+: skills/gatekeep-pr/reference/batch.md` directives, only the under-cap dispatch case's `bundle+: agents/pr-gatekeeper.md`, and no `bundle+` for role-line-requested. Reject global-manifest duplicates. Require the replay argument-resolution sentence and fact IDs f1 for each discovery sample and r1-r4 for role-line-requested.

- [ ] **Step 2: Confirm missing fixtures fail.**

  Run: `node --test scripts/gatekeep-comment-reconcile.test.mjs eval/lib/lint.test.mjs`
  Expected: new sample assertions fail; existing targets still lint.

- [ ] **Step 3: Extend replay entry without changing existing continuations.**

  Add one sentence to eval/gatekeep-pr/replay.md: an `## Entry` block may start at argument resolution with no PR token, taking supplied origin and `gh pr list` rows as command results and ending at its named discovery outcome. Keep step-2 and continuation narration intact. Replay itself uses no tools.

- [ ] **Step 4: Add over-cap discovery.**

  Create the pair under `eval/gatekeep-pr/samples/no-arg-discovery-over-cap`. Use pi, `parallel.maxTasks` 4, origin `git@github.com:acme/widgets.git`, viewer alex. Eligible rows: 101 (1+1), 97 (2+2), 112 (3+3), 88 (4+4), 130 (4+4), 104 (5+5). Add one draft, one `APPROVED`, one `CHANGES_REQUESTED`; repeat 101 across queries without changing nine unique PRs. Retained reviewDecision values include REVIEW_REQUIRED, null, and empty string. The 88/130 tie tests numeric order.

  Its f1 requires the cap line then `discovered, smallest first: 101, 97, 112, 88, 130, 104`, with no provisioning, dispatch, continuation record, or tracker initialization. Prefix case.md with the batch.md bundle directive.

- [ ] **Step 5: Add single, zero, and Claude Code multi discovery.**

  `no-arg-discovery-single`: pi, `GH_REPO=other/project`, origin acme/widgets, one eligible PR 101. f1 requires both list commands use `-R acme/widgets` (resolved `-R <origin owner/repo>`), and only `https://github.com/acme/widgets/pull/101` enters the single-PR path, with no batch. Stop at route handoff.

  `no-arg-discovery-zero`: Claude Code, `gh api user` fails, both complete lists empty. f1 requires `no open PRs authored by @me or awaiting @me's review in acme/widgets` before provisioning: the concrete `no open PRs authored by @me ...` form, not a lookup-failure stop or branch fallback.

  `no-arg-discovery-cc-multi`: Claude Code, 101, 97, 112 in increasing diff-size order. f1 requires `multi-PR mode requires pi's nested dispatch` followed by the sorted line with no dispatch. Give these three cases only the batch.md bundle directive.

- [ ] **Step 6: Add failed and incomplete query observations.**

  `no-arg-discovery-failed` carries the spec's two isolated observations: author query exits nonzero with first stderr line `HTTP 503: Service Unavailable`; a second scenario returns 1000 valid authored rows at `--limit 1000`. Specify the row family deterministically in the inline fixture so count is exactly 1000 even when every row is a draft. Stop each narration at its error. One f1 requires `discovery failed: HTTP 503: Service Unavailable` and `discovery failed: incomplete (author query hit --limit 1000)`, with no provisioning/fallback. This instantiates `discovery failed: incomplete (...)`. Task 1's instruction assertions cover malformed-array/integer and bad-origin paths; do not invent extra sample facts beyond spec `## Tests`.

- [ ] **Step 7: Add under-cap routing and pasteback.**

  `no-arg-discovery-under-cap`: pi, cap 8, author query has exactly 102 rows: 100 drafts numbered 200 through 299, then eligible 101 (1+1) and 112 (3+3). Direct-review query adds 97 (2+2). f1 requires origin URL tokens in order 101, 97, 112, tagged `source: discovered`, entering set routing once; preserve order through summary and queued menus, and admit pasted `101, 97, 112` after stripping trailing commas. Include batch.md and agents/pr-gatekeeper.md bundle directives because this case narrates dispatch. Supply clean per-PR child reports/results and stop after ordered menus before unselected consequences.

- [ ] **Step 8: Add four refreshed-role facts.**

  Under `eval/gatekeep-pr/samples/role-line-requested/`, use explicit arguments 123 on a branch with another PR. No `bundle+`. Carry explicitly labeled successive `reviewRequests` refresh snapshots on an unchanged head: author with stale self-request and robin/acme-reviewers requests; directly requested viewer with different login casing; request cleared after review; reviewer added then removed; unreadable viewer with missing User login and missing Team slug; empty requests. Keep a historical `reviews` entry to distinguish history from pending requests.

  Exactly four judged facts, corresponding to Tests lines 170-173: r1 requires one `Role:` under `Delivers` in all four forms, other reviewers in API order, teams as `org/slug`, empty-parenthetical omission, and a supplied child's report printed verbatim; r2 requires `Role: unreadable` and `unknown`; r3 requires explicit-token discovery bypass; r4 requires refreshed roles/entries after additions, removals, and the viewer's review without inference from `reviews`. Include concrete own-author output demonstrating `Role: author (requested: <entries>)`. For the child assertion supply a report as input; no batch dispatch or persona bundle is needed.

- [ ] **Step 9: Record intent and the candidate-evidence boundary.**

  Preserve `for:` at Task 1's candidate assembly SHA. Extend `## Change` in eval/gatekeep-pr/intent.md with a paragraph naming the six discovery samples and role-line-requested. In `## Expected to move`, predict fails -> holds for new facts; preserve existing stable IDs and add rows for any genuinely shifted pre-existing report-shape fact, but the inspected files contain none. Keep expected.md to one judged fact line per approved fact, no headings or explanatory prose.

  The full `node eval/run.mjs gatekeep-pr` subcommand belongs to header verification, not scoped task execution. After verify generates results, require every new fact's `after: holds` in both frozen replay models, no regressions/errors/inconclusive outcomes; unchanged failures are not delivery. Commit generated eval/gatekeep-pr/report.md and changed runner records during verify's artifact commit before finishing. Never manufacture evidence during this fixture commit. Task 3 owns eval/gatekeep-pr/README.md and sample count.

- [ ] **Step 10: Confirm green and review style.**

  Run: `node --test scripts/gatekeep-comment-reconcile.test.mjs eval/lib/lint.test.mjs`
  Expected: all structural assertions and committed targets pass. This proves structure, not model behavior.

  Run: `node --check scripts/gatekeep-comment-reconcile.test.mjs`
  Expected: exit 0. Review synthetic text for secrets/private identifiers/home paths per eval/README.md; no formatter is configured. Keep existing samples and target.json untouched.

- [ ] **Step 11: Commit fixtures and intent.**

  Stage the fourteen new files, eval/gatekeep-pr/replay.md, eval/gatekeep-pr/intent.md, and scripts/gatekeep-comment-reconcile.test.mjs. Commit with `git commit -m "Cover queue discovery and refreshed roles in gatekeep replays" -m "Behavior change; full candidate replay evidence is generated at verification."`.

## Wave 3 - User and eval indexes

Depends on Waves 1-2: document the delivered contract and actual sample inventory. Keep index edits in this trailing doc-only wave.

### Task 3: Document no-argument invocation and sample inventory
Leg: jjuraszek/pi-gauntlet

**TDD scenario:** Trivial documentation change - inspect rendered contract and inventory; no executable code changes.

**Spec:** doc/specs/2026-10-30-gatekeep-pr-default-mine.md § "Arguments and surface (`SKILL.md`, README)" L128-L128, § "Documentation impact" L180-L180

**Files:**
- Modify: `README.md:90-98`
- Modify: `README.md:309-312`
- Modify: `eval/gatekeep-pr/README.md:1-29`

**Tests:**
- none: documentation indexes; no Markdown formatter is configured

- [ ] **Step 1: Update invocation docs in place.**

  In README.md `## Architecture`, replace the unchanged-Claude-Code sentence with the queue contract on both harnesses: open authored/directly requested origin PRs, no drafts or two decided states, diff-size/number ordering, direct single-match gating, pi-only batch and sorted Claude Code stop list. State that every report shows a refreshed role under Delivers, not on the summary row.

  In the skills-list `run it with /skill:gatekeep-pr ...` clause, change `run it with /skill:gatekeep-pr <pr> [--rebase [base]]` to `run it with /skill:gatekeep-pr [<pr>] [--rebase [base]] (no argument: your open PRs)`. Preserve explicit-invocation consent and course/terminal gates; do not broaden ambient auto-activation.

- [ ] **Step 2: Replace the Claude Code smoke expectation.**

  The spec's `## Claude Code` reference resolves to README's current `## Use from Claude Code`; edit smoke step 7 there. No GitHub origin expects `discovery failed: origin is not a GitHub repository` before provisioning. GitHub origin with no match expects `no open PRs authored by ...` naming origin. Preserve no missing-pi-tool error and no mutation.

- [ ] **Step 3: Update eval inventory and bundle explanations.**

  Recount case.md-bearing sample directories after the seven additions; replace stale Fifty-one with the actual total, not stale prose plus seven. Add six discovery samples to eval/gatekeep-pr/README.md's multi-PR table and mention role-line-requested separately. Update the touched explanation: all six discovery cases bundle `batch.md`, only under-cap adds agents/pr-gatekeeper.md, role-line-requested has no extras, original four batch cases retain both extras. Keep target.json unchanged.

- [ ] **Step 4: Review and commit.**

  Check links and current-state wording in touched units. No new guide or AGENTS.md router change applies. CHANGELOG.md remains deferred to release per Documentation impact. Commit with `git add README.md eval/gatekeep-pr/README.md` and `git commit -m "Document gatekeep default queue and replay coverage"`. Header verification follows all waves and commits generated candidate report/results before finishing.

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Acceptance criteria" L29-L45 | AC1: over-cap filtering and ordered stop before effects | Task 1 |
| § "Acceptance criteria" L29-L45 | AC2: one match uses single-PR path on both harnesses | Task 1 |
| § "Acceptance criteria" L29-L45 | AC3: zero matches stop before provisioning | Task 1 |
| § "Acceptance criteria" L29-L45 | AC4: under-cap pi set preserves sorted summary/menu order | Task 1 |
| § "Acceptance criteria" L29-L45 | AC5: Claude Code multi discovery stops with sorted list | Task 1 |
| § "Acceptance criteria" L29-L45 | AC6: failed, malformed, or incomplete discovery never falls back | Task 1 |
| § "Acceptance criteria" L29-L45 | AC7: explicit token bypasses discovery | Task 1 |
| § "Acceptance criteria" L29-L45 | AC8: every rendered report has one refreshed role line with ordered requests | Task 1 |
| § "Acceptance criteria" L29-L45 | AC9: unreadable viewer still discovers; missing request identity renders unknown | Task 1 |
| § "Design" L71-L71 | Behavior lives in neighboring skill prose; no runtime/settings additions | Task 1 |
| § "Discovery (Section A of `verification-brief.md`, executed from `SKILL.md` `## Arguments`)" L75-L79 | Discover before records, tracker initialization, admission, and provisioning; gather does not repeat it | Task 1 |
| § "Discovery (Section A of `verification-brief.md`, executed from `SKILL.md` `## Arguments`)" L75-L79 | Replace branch fallback; resolve GitHub origin and viewer once | Task 1 |
| § "Discovery (Section A of `verification-brief.md`, executed from `SKILL.md` `## Arguments`)" L82-L83 | Execute both fixed origin-bound list commands | Task 1 |
| § "Discovery (Section A of `verification-brief.md`, executed from `SKILL.md` `## Arguments`)" L86-L93 | Validate completeness before filtering; union, filter, and sort | Task 1 |
| § "Discovery (Section A of `verification-brief.md`, executed from `SKILL.md` `## Arguments`)" L86-L93 | Zero, one, pi set, and Claude Code set outcomes | Task 1 |
| § "Discovery (Section A of `verification-brief.md`, executed from `SKILL.md` `## Arguments`)" L95-L97 | Direct requests only; origin URLs prevent foreign defaults redirecting discovery or gating | Task 1 |
| § "Set routing (`SKILL.md` `## Arguments`, `batch.md` `## Admit before effects`)" L101-L103 | Zero-token routing and trailing-comma normalization preserve other checks | Task 1 |
| § "Set routing (`SKILL.md` `## Arguments`, `batch.md` `## Admit before effects`)" L101-L103 | Exact harness rejection and discovered-only sorted list after cap/harness failure | Task 1 |
| § "Set routing (`SKILL.md` `## Arguments`, `batch.md` `## Admit before effects`)" L101-L103 | Preserve supplied order through provisioning, summary, and queued menus | Task 1 |
| § "Role line (Section A digest, `post-selection-loop.md` `### Pre-menu refresh`, `report.md`)" L107-L111 | Raw pending requests and current role with author precedence/unreadable identity | Task 1 |
| § "Role line (Section A digest, `post-selection-loop.md` `### Pre-menu refresh`, `report.md`)" L107-L111 | Same-head refresh; full re-gather inheritance and verbatim parent rendering | Task 1 |
| § "Role line (Section A digest, `post-selection-loop.md` `### Pre-menu refresh`, `report.md`)" L113-L113 | One role line directly under Delivers | Task 1 |
| § "Role line (Section A digest, `post-selection-loop.md` `### Pre-menu refresh`, `report.md`)" L116-L119 | API-order other User/Team requests, unknown and empty-list forms | Task 1 |
| § "Role line (Section A digest, `post-selection-loop.md` `### Pre-menu refresh`, `report.md`)" L122-L122 | Both examples, clean-report description, and passing-fact exemption | Task 1 |
| § "Arguments and surface (`SKILL.md`, README)" L126-L126 | Remove branch-default language and prefix argument hint | Task 1 |
| § "Arguments and surface (`SKILL.md`, README)" L128-L128 | Architecture, optional-PR invocation, and Claude Code smoke stops | Task 3 |
| § "Evals" L132-L143 | Pre-step-1 replay entry; extras stay sample-local | Task 2 |
| § "Evals" L132-L143 | Six discovery samples and one refreshed-role sample with approved fact grammar | Task 2 |
| § "Evals" L132-L143 | Candidate-bound intent and actual changed facts; generated candidate evidence | Task 2 |
| § "Size budget" L147-L147 | Authoring rules, absolute instruction limits, and per-file growth budget | Task 1 |
| § "Errors and edge cases" L151-L160 | Fail before effects on bad origin, failed query, malformed output, or incomplete query | Task 1 |
| § "Errors and edge cases" L151-L160 | Discovery continues on unreadable viewer; foreign defaults cannot redirect origin | Task 1 |
| § "Errors and edge cases" L151-L160 | Missing request identities and only exported User/Team entries | Task 1 |
| § "Errors and edge cases" L151-L160 | Cap stop, pasteback, explicit drafts, deduplication, and author precedence | Task 1 |
| § "Errors and edge cases" L151-L160 | Refresh after reviews and request changes on the same head | Task 1 |
| § "Errors and edge cases" L151-L160 | Rebase semantics retained; display role never changes approval availability | Task 1 |
| § "Tests" L164-L173 | Over-cap filter/order/no-effects replay | Task 2 |
| § "Tests" L164-L173 | Single-match origin binding and zero-match unreadable-viewer replay | Task 2 |
| § "Tests" L164-L173 | Claude Code multi refusal and nonzero/incomplete query replay | Task 2 |
| § "Tests" L164-L173 | Beyond-100-row under-cap discovery and trailing-comma pasteback replay | Task 2 |
| § "Tests" L164-L173 | Role format, unreadable/unknown, explicit bypass, and same-head refresh | Task 2 |
| § "Tests" L174-L174 | Instruction-size lint passes in the full repository gate | Verification |
| § "Tests" L175-L176 | Admission/refresh static assertions; documented team semantics remain an assumption | Task 1 |
| § "Documentation impact" L180-L180 | Existing README and eval index changes; CHANGELOG deferred to release | Task 3 |
| § "Out of scope" L187-L193 | Keep `role:` out of summary; request actors stay exported types | Task 1 |
| § "Out of scope" L187-L193 | No chunking, bare-number rebinding, serial Claude Code batch, or team-discovery source | Task 1 |
| § "Out of scope" L187-L193 | Preserve predecessor dispatch, menus, and cleanup | Task 1 |
| § "Open questions" L197-L197 | Accepted team-exclusion assumption; record live differential only if fixture becomes reachable | Task 1 |
