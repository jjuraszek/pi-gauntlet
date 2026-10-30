# gatekeep-pr without arguments: gate my open PR queue, and name my role on every report

**Goal:** `/skill:gatekeep-pr` with no PR token discovers the open PRs in the origin repository that the viewer authored or was directly asked to review, drops drafts and already-decided PRs, orders them smallest diff first, and gates them through the existing single-PR or set pipeline; every rendered report carries one `Role:` line saying whether the viewer is the author, a directly requested reviewer, or neither, with the other requested reviewers and teams named.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** waves
**Predecessor:** `doc/specs/2026-10-23-gh-79-parallel-gatekeep-prs.md` - extended, not superseded: that spec owns set admission, child dispatch, summary and queued menus; this one feeds its set-routing row from discovery and adds one report line.

## Problem

A no-argument `/skill:gatekeep-pr` resolves the PR of the current branch (`skills/gatekeep-pr/verification-brief.md` Section A, `Missing PR number: gh pr view --json number,url on the current branch; no PR found -> STOP and report.`). Gating the viewer's queue - own open PRs plus PRs where the viewer is a requested reviewer - means listing them by hand and typing the set form from the predecessor spec. Nothing in the report says whether the viewer owns the PR under assessment or was asked to review it, so the `approve` row's `is_author` rule (`reference/decision-menu.md` `## Availability`) is the only place the relationship surfaces, and only by its absence.

Premises checked during brainstorming:

- Supported: the batch contract is pi-only, rejects sets above pi-cohort `parallel.maxTasks` (default 8) and never chunks (`reference/batch.md` `## Admit before effects`); `viewer.login` already comes from `gh api user --jq .login` and `viewer.is_author` is derived from it (Section A digest).
- Supported (GitHub search docs, "Searching issues and pull requests", review-requested table): `user-review-requested:@me` matches only PRs the viewer was directly asked to review; `review-requested:@me` also matches requests to a team the viewer belongs to; a reviewer who has reviewed drops out of both.
- Supported (`gh` 2.101.0 `--help`; cli/cli `api/export_pr.go`): `gh pr list` takes `--author @me`, `--search`, and `--json`; `reviewRequests` exports a User as `{"__typename":"User","login":...}` and a Team as `{"__typename":"Team","name":...,"slug":"<org>/<slug>"}`; `isDraft`, `reviewDecision`, `additions`, `deletions` ride in the same `--json` call.
- Corrected: the scout read "requested reviewer, not team member" as a post-filter over `reviewRequests`; the `user-review-requested:@me` qualifier performs the team exclusion itself, and `reviewRequests` is needed only for the `Role:` line.
- Unverified: a live differential between `review-requested:@me` and `user-review-requested:@me` - the one repository with direct requests returned the same seven PRs for both and no team-requested PR exists in any repository the viewer can see. Carried to Open questions.
- Implicit dependencies: none missing - `gh pr list`, `gh api user`, the set-routing row, and the batch dispatch all exist and were exercised or read.

User decisions: oversized discovered sets stop at the existing cap error with a pasteable comma-separated list (Q1 A); discovery filters drafts, `APPROVED`, and `CHANGES_REQUESTED`, and sorts by `additions + deletions` ascending; discovery runs on both harnesses and Claude Code gates only a single match (Q2 B); the role renders as one report line under `Delivers`, never on the summary row (Q3 A); edits follow `/skill:forge-skill` and every touched instruction file stays under the 50,000-byte / 2,000-line lint.

Framing: kept - the scout's two objections (the cap vs "all", and the Claude Code single-PR no-arg path) became Q1 and Q2 decisions, not a different change.

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] On pi, `/skill:gatekeep-pr` with no PR token and nine open PRs in the origin repository where the viewer is author or directly requested reviewer - one draft, one `APPROVED`, one `CHANGES_REQUESTED` - under a `parallel.maxTasks` of 4, performs no provisioning and no dispatch and stops with the existing `multi-PR mode takes at most 4 PRs (pi-cohort parallel.maxTasks); got 6` line followed by `discovered, smallest first: <six numbers>` ordered by `additions + deletions` ascending, ties by number ascending.
  in-scope
- [ ] With no PR token and exactly one PR left after filtering, the run gates that PR on the single-PR path with no batch dispatch, on both harnesses.
  in-scope
- [ ] With no PR token and no PR left after filtering, the run stops before provisioning with `no open PRs authored by <login> or awaiting <login>'s review in <owner/repo>`.
  in-scope
- [ ] With no PR token and two to `parallel.maxTasks` PRs left after filtering on pi, the set enters the set-routing row in size-ascending order and the batch summary rows and queued menus appear in that order.
  in-scope
- [ ] On Claude Code with no PR token and two or more PRs left after filtering, the run dispatches nothing and stops with `multi-PR mode requires pi's nested dispatch` followed by the same `discovered, smallest first:` line.
  in-scope
- [ ] A `gh pr list` discovery call that exits non-zero stops before provisioning with `discovery failed: <first gh error line>`; one that exits zero and returns a row without `number`, or returns as many rows as its `--limit`, stops before provisioning with `discovery failed: malformed gh pr list output` or `discovery failed: incomplete (<query> hit --limit <n>)`; none of the three falls back to the current branch's PR.
  in-scope
- [ ] An explicit PR token never triggers discovery: `/skill:gatekeep-pr 123` run from a branch that has its own open PR gates 123 only.
  in-scope
- [ ] Every rendered report - single-PR, explicit-argument, and batch child - carries exactly one `Role:` line directly under `Delivers`, in one of the forms `Role: author (requested: <entries>)`, `Role: requested reviewer (also requested: <entries>)`, `Role: none (requested: <entries>)`, `Role: unreadable (requested: <entries>)`, where `<entries>` lists the other pending `reviewRequests` as user logins and `org/slug` team slugs in API order, read at the pre-menu refresh that precedes the render, and the parenthetical is omitted when the list is empty; the batch parent prints the child's `Role:` line verbatim.
  in-scope
- [ ] When `gh api user` fails, the line renders `Role: unreadable (requested: <entries>)` and discovery still runs; a `reviewRequests` entry without `login` or `slug` renders as `unknown`.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gatekeep-pr-mine
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test; node eval/run.mjs gatekeep-pr
Rules: AGENTS.md
Rules: eval/README.md
Rules: README.md
Rules: CHANGELOG.md
Rules: .pi/gauntlet-overrides.md
Rules: doc/personas.md
Rules: doc/configuration.md
scope: none
design: owns every path under `skills/gatekeep-pr/`, `eval/gatekeep-pr/`, `README.md`, `CHANGELOG.md`; observable outcomes are the nine acceptance rows above.

## Design

All changes are skill prose under `skills/gatekeep-pr/`; no extension, bin, persona, or settings key changes. Each rule lands in the file that owns the neighboring rule.

### Discovery (Section A of `verification-brief.md`, executed from `SKILL.md` `## Arguments`)

Discovery runs during argument resolution - before the set-vs-single branch, before the continuation record is minted (`SKILL.md` `## Progress tracking`), before tracker `init`, and before any provisioning. Its rules live in Section A as a reference block because Section A owns the fixed `gh` command set; the Gatherer never executes it as step 1. A roster of two or more re-enters the set-routing row with the discovered roster, so the predecessor's admission, provisioning, and dispatch run exactly once, on the roster.

Remove: the sentence `Missing PR number: gh pr view --json number,url on the current branch; no PR found -> STOP and report.`

Add, in its place, the discovery block. With no PR token, resolve `<owner/repo>` from `git remote get-url origin` (`.git` suffix stripped, lowercased; an unreadable or non-GitHub origin stops with `discovery failed: origin is not a GitHub repository`) and read `viewer.login` once with `gh api user --jq .login` (failure -> `unreadable`; the `@me` qualifiers carry identity regardless). Then run the two fixed commands, each bound to origin:

```bash
gh pr list -R <owner/repo> --author @me --state open --limit 1000 --json number,isDraft,reviewDecision,additions,deletions
gh pr list -R <owner/repo> --search 'user-review-requested:@me' --state open --limit 1000 --json number,isDraft,reviewDecision,additions,deletions
```

Completeness before filtering: a query that returns as many rows as its `--limit` is incomplete and stops with `discovery failed: incomplete (<query> hit --limit 1000)`; a query that exits non-zero stops with `discovery failed: <first gh error line>`; a zero-exit query whose output is not a JSON array of objects each carrying an integer `number` stops with `discovery failed: malformed gh pr list output`. Every discovery stop happens before provisioning and never falls back to the current branch's PR. With both queries complete, union the rows by `number`, drop rows where `isDraft` is true or `reviewDecision` is exactly `APPROVED` or `CHANGES_REQUESTED` - a two-value exclusion, so `REVIEW_REQUIRED`, `null`, an empty string, and any other value stay - and sort the remainder by `additions + deletions` ascending, ties by `number` ascending. The result is the discovered roster: `<owner/repo>` plus an ordered list of numbers. Outcomes:

| Roster size | Action |
|---|---|
| 0 | stop: `no open PRs authored by <login> or awaiting <login>'s review in <owner/repo>` (`<login>` is `viewer.login`, or `@me` when unreadable; `<owner/repo>` is the origin identity above) |
| 1 | continue the single-PR path with `https://github.com/<owner/repo>/pull/<N>` as the PR token |
| 2+ on pi | re-enter the set-routing row with the roster as `https://github.com/<owner/repo>/pull/<N>` tokens in roster order, tagged `source: discovered` |
| 2+ on Claude Code | stop: print `multi-PR mode requires pi's nested dispatch`, then the `discovered, smallest first:` line below |

Handing the roster as origin URLs keeps the repository identity through the existing URL normalization (`batch.md` `## Admit before effects`: URLs must match origin) and through the single-PR path's `gh pr view`, so a `GH_REPO` or `gh repo set-default` pointing elsewhere cannot swap the repository between discovery and gating. The printed `discovered, smallest first:` line stays bare numbers, which the next invocation reads as origin tokens.

`user-review-requested:@me` is the qualifier because it matches direct requests only; team requests to a team the viewer belongs to never enter the roster. A no-argument run means "my queue" on both harnesses; a feature-branch PR enters through the author query like any other.

### Set routing (`SKILL.md` `## Arguments`, `batch.md` `## Admit before effects`)

`SKILL.md` set bullet: replace `keep zero or one PR token on the existing single-PR path below` with `keep one PR token on the single-PR path below; zero tokens discover per verification-brief.md Section A before this row runs and re-enter it with the discovered roster when the roster holds two or more`. Add to the same bullet: `a trailing comma on a PR token is stripped before identity normalization, so a pasted discovered, smallest first: list is a valid set`; the token order and every other admission check are unchanged.

`batch.md`: pin the Claude Code rejection text as a print-exactly line, `multi-PR mode requires pi's nested dispatch`, beside the existing oversized-set line. Add: roster order is the supplied token order, so a discovered set keeps its size-ascending order through provisioning, summary rows, and queued menus. Add: when the set is tagged `source: discovered`, the oversized-set error and the Claude Code rejection are each followed by exactly one line, `discovered, smallest first: <numbers comma-separated>`, in the sorted order; an explicitly typed set prints no such line.

### Role line (Section A digest, `post-selection-loop.md` `### Pre-menu refresh`, `report.md`)

`Role:` is the viewer's current relationship to the PR at the refresh that precedes the render, not the relationship when the run started: a pending review request is what `reviewRequests` holds now, and a request the viewer has already answered is no longer pending. No inference from `reviews` history.

Add `reviewRequests` to Section A's fixed `gh pr view --json` field list and to the digest as `pr.review_requests` (the raw entries, each `{__typename, login}` for a User or `{__typename, name, slug}` for a Team - the two typenames the `gh` export emits). Add `viewer.role` beside `viewer.is_author`, derived as: `author` when `is_author`; else `requested reviewer` when a `User` entry's `login` equals `viewer.login` (case-insensitive); else `none`; `unreadable` when `viewer.login` is unreadable. `author` wins when both hold.

`post-selection-loop.md` `### Pre-menu refresh`: add `reviewRequests` to its fixed `gh pr view` field list and, in the unchanged-head sentence, replace `pr.review_requests` and re-derive `viewer.role` together with merge state, `reviewDecision`, `status_checks`, and `actions_runs`. The step-2b full re-gather (`sync.md`) already re-runs the Section A fixed set and so picks the field up without a change. The batch parent's no-rewrite rule prints the child's line verbatim; no `batch.md` change for the line.

Add to `report.md`'s fixed order, directly under `Delivers` and before `PR comments`:

```
Role: author | requested reviewer | none | unreadable, optionally followed by one parenthetical:
      `(also requested: <entries>)` for requested reviewer, `(requested: <entries>)` otherwise;
      <entries> = the review_requests other than the viewer, User as login, Team as org/slug, API order,
      an entry whose login (User) or slug (Team) is missing as `unknown`; omit the parenthetical when <entries> is empty.
```

Add the `Role:` line directly under `Delivers` in both worked examples (`Role: author` on the own-PR examples), update the clean-report sentence in `## What stays out` to `Delivers`, `Role`, the verdict line, and the menu - about five lines, and add `Role:` to the rule-5 exemption sentence beside `Sync:` (a passing fact that prints on every render).

### Arguments and surface (`SKILL.md`, README)

Remove: `omitted -> resolved from the current branch per verification-brief.md Section A` from the PR-number bullet. Add: `omitted -> discovered per verification-brief.md Section A during argument resolution (my open PRs in origin: authored or directly requested, no drafts or decided PRs, smallest first); one match gates on this path, two or more re-enter the set-routing row on pi and stop with the discovered list on Claude Code`. `argument-hint` gains a leading `[no argument: my open PRs]` form.

README: `## Architecture` gatekeep-pr paragraph - the "single-PR behavior on Claude Code is unchanged" sentence becomes the no-argument contract above (my queue on both harnesses; batch stays pi-only). The skills-list run clause `run it with /skill:gatekeep-pr <pr> [--rebase [base]]` becomes `run it with /skill:gatekeep-pr [<pr>] [--rebase [base]] (no argument: your open PRs)`. `## Claude Code` smoke step 7 expectation becomes: in a scratch repo with no GitHub origin the skill stops before provisioning with `discovery failed: origin is not a GitHub repository`; with a GitHub origin and no matching PR it stops with the `no open PRs authored by ...` line - no error about missing pi tools, no mutation.

### Evals

Discovery samples start before step 1, so `eval/gatekeep-pr/replay.md` gains one sentence: an `## Entry` block may also name argument resolution with no PR token, in which case the narration starts from the arguments line, treats the digest's `gh pr list` rows and origin as the commands' results, and stops at the discovery outcome the block names. Add these `kind: text` samples, one fixture and one outcome each, every `case.md` carrying `bundle+: skills/gatekeep-pr/reference/batch.md` (and `bundle+: agents/pr-gatekeeper.md` only where a batch dispatch is narrated) and never a `bundle+` on a file `target.json` already supplies:

| Sample | Fixture | Outcome under test |
|---|---|---|
| `no-arg-discovery-over-cap` | pi, cap 4, nine PRs (one draft, one `APPROVED`, one `CHANGES_REQUESTED`) | the cap line then `discovered, smallest first: 101, 97, 112, 88, 130, 104`; no provisioning or dispatch |
| `no-arg-discovery-single` | pi, `GH_REPO` set to another repository, one PR left | both list commands carry `-R <origin owner/repo>`; single-PR path with the origin URL token, no batch |
| `no-arg-discovery-zero` | Claude Code, `gh api user` failing, no PR left | the `no open PRs authored by @me ...` line naming origin, before provisioning |
| `no-arg-discovery-cc-multi` | Claude Code, three PRs left | `multi-PR mode requires pi's nested dispatch` then the sorted line; nothing dispatched |
| `no-arg-discovery-failed` | pi, author query exits non-zero; second scenario in the same fixture: a query returning 1000 rows | `discovery failed: <first gh error line>`; `discovery failed: incomplete (...)`; no current-branch fallback |
| `no-arg-discovery-under-cap` | pi, cap 8, author query returning 102 rows of which 100 are drafts, three PRs left overall | the three origin URL tokens re-enter set routing in size order, tagged `source: discovered`; admission accepts the pasted trailing-comma form |

Add `eval/gatekeep-pr/samples/role-line-requested/` (no `bundle+`; the fixture carries a pre-menu refresh whose `reviewRequests` differ from step 1's on an unchanged head). `expected.md` in every new sample holds one `- <id>: judged: <sentence>` or `- <id>: mechanical: <check>` line per fact listed in this spec's `## Tests`, nothing else. `eval/gatekeep-pr/intent.md`: bump `for:` to the candidate assembly SHA, extend `## Change` with one paragraph naming the discovery and role samples, and add `## Expected to move` rows for every existing report-shape fact the new `Role:` line shifts (the clean-report line count and any fact that pins the line directly after `Delivers`). `eval/gatekeep-pr/README.md`: raise the sample count, and add the six discovery samples to the multi-PR table (they bundle `batch.md`). Run `node eval/run.mjs gatekeep-pr` before finishing; commit `eval/gatekeep-pr/report.md`.

### Size budget

Every touched file under `skills/gatekeep-pr/` stays under 50,000 bytes and 2,000 lines (`scripts/ci.mjs` instruction-size lint); the largest touched files, `post-selection-loop.md` at 33,311 bytes and `verification-brief.md` at 28,151 bytes, each gain under 3,000. Edits follow `/skill:forge-skill` authoring rules (imperative voice, low conditionality, minimal diff).

## Errors and edge cases

- Discovery stops, each before any provisioning and with no current-branch fallback: non-zero exit -> `discovery failed: <first gh error line>`; zero exit with output that is not an array of objects each carrying an integer `number` -> `discovery failed: malformed gh pr list output`; a query returning exactly its `--limit` of rows -> `discovery failed: incomplete (<query> hit --limit 1000)`; origin unreadable or not a GitHub remote -> `discovery failed: origin is not a GitHub repository`.
- `gh api user` failing: discovery still runs (the `@me` queries carry identity); `viewer.role` is `unreadable`; the zero-match message uses `@me`.
- `GH_REPO` or a `gh repo set-default` naming another repository: both list commands carry `-R <origin owner/repo>` and the roster is handed on as origin URLs, so the other repository is never read.
- A `reviewRequests` entry without `login` (User, deleted account) or without `slug` (Team) renders as `unknown`. The `Role:` entries are the User and Team entries the `gh` `reviewRequests` export emits; a request to any other actor type is not exported by that field and so does not appear.
- Over the cap: the discovered line prints once, after the existing cap sentence; the run never auto-retries or chunks; the human pastes the printed list (trailing commas accepted) or types explicit tokens.
- An explicit token never discovers; an explicit draft token still gates as today.
- A PR in both query results, or a stale `reviewRequests` naming the author, counts once and resolves `Role: author`.
- The viewer posts a review during the run (the `assess` course, or a review left before the run): the next pre-menu refresh shows the request as no longer pending, so `Role:` moves from `requested reviewer` to `none` on an unchanged head; a reviewer added or removed on the same head moves `<entries>` the same way.
- `--rebase [base]` with no PR token applies to the discovered set exactly as it applies to a typed set (`batch.md` other-author confirmation included).
- `Role:` never changes menu availability; `approve` keeps `decision-menu.md`'s `is_author` rule.

## Tests

- Over-cap discovery filters, sorts, prints the pasteable line, provisions and dispatches nothing - `eval/gatekeep-pr/samples/no-arg-discovery-over-cap` (nine fixture PRs, cap 4; stop text ends `discovered, smallest first: 101, 97, 112, 88, 130, 104`; no continuation record minted)
- One match continues on the single-PR path with the origin URL token and no batch dispatch; both list commands carry `-R <origin owner/repo>` despite a mismatched `GH_REPO` - `no-arg-discovery-single`
- Zero matches stop before provisioning with the `@me`-and-origin message when `gh api user` fails - `no-arg-discovery-zero`
- Claude Code two-or-more stops with `multi-PR mode requires pi's nested dispatch` and the discovered line, dispatches nothing - `no-arg-discovery-cc-multi`
- Non-zero exit stops with `discovery failed: <first gh error line>`; a query returning its `--limit` of rows stops with `discovery failed: incomplete (...)`; neither falls back to the current branch - `no-arg-discovery-failed`
- Under-cap discovered set re-enters set routing as origin URL tokens in size order, tagged `source: discovered`, with the eligible PRs beyond the first 100 rows present; a pasted `101, 97, 112` form is admitted - `no-arg-discovery-under-cap`
- `Role:` renders under `Delivers` in all four forms, `Role: author (requested: <entries>)` naming the other reviewers on an own PR, teams as `org/slug`, parenthetical omitted when empty, verbatim on a batch child report - `eval/gatekeep-pr/samples/role-line-requested`
- `Role: unreadable` and `unknown` entries - `role-line-requested`, second fact
- Explicit token never discovers - `role-line-requested`, third fact
- Same-head pre-menu refresh moves `Role:` and `<entries>`: a reviewer added, a reviewer removed, and the viewer's own review clearing the pending request render the refreshed relationship, with no inference from `reviews` - `role-line-requested`, fourth fact
- Touched skill files stay under the size lint - `npm test` (instruction-size lint, existing)
- `scripts/gatekeep-comment-reconcile.test.mjs` prose assertions: `batch.md` carries the print-exactly `multi-PR mode requires pi's nested dispatch` line; `post-selection-loop.md` `### Pre-menu refresh` names `reviewRequests` - `npm test` (existing test file, two assertions added)
- `user-review-requested:@me` excludes team requests - none: GitHub-side semantics with no reachable fixture; stated assumption in Open questions

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: README.md `## Architecture` (communication contract: the no-argument invocation now means the viewer's queue on both harnesses, batch stays pi-only); README.md skills-list `run it with /skill:gatekeep-pr ...` clause (the invocation no longer requires a PR token); README.md `## Claude Code` smoke step 7 (the no-argument expectation becomes the discovery stop text); `eval/gatekeep-pr/README.md` (sample count and the multi-PR sample table gain the six discovery samples, which bundle `batch.md`); CHANGELOG.md - deferred: release
- Derived / memory docs invalidated: none (no AGENTS.md router entry names the no-argument behavior)

Bar applied: `skills/brainstorming/reference/documentation-impact.md`.

## Out of scope

- A `role:` segment on the batch summary row (Q3: report line only).
- Chunking or trimming an oversized discovered set (Q1: stop and list).
- Review requests to actor types the `gh` `reviewRequests` export does not emit (bots, mannequins); the `Role:` line names User and Team entries only.
- Binding typed bare-number tokens to origin; the existing typed-token path is unchanged, and only the discovered roster is handed on as origin URLs.
- Serial multi-PR execution on Claude Code (Q2: stop and list).
- Team-based review requests as a roster source.
- Any change to the predecessor's child dispatch, menus, or cleanup.

## Open questions

- Team exclusion of `user-review-requested:@me` is taken from GitHub's documentation; if a team-requested fixture becomes reachable, the implementer runs both qualifiers against it and records the differential in the PR body. The spec stands either way; a contradiction would change only the qualifier choice.
