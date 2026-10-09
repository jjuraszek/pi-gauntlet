# A ticket ships in full per repo: AC attribution, human-only scope cuts, venue-free rows

**Goal:** One gauntlet delivers every acceptance criterion the ticket assigns to its repo. Rows another repo owns are attributed at ticket authoring and marked `elsewhere:` without a question; every other row ships `in-scope` unless the human cuts it in their own words; a row the code contradicts is repaired on the ticket through `/skill:shape-ticket`, never papered over with a disposition; the council blocks any cut the human did not make and any production venue; the gate lists every scope cut on one line; every downstream consumer reads `elsewhere:` as settled attribution.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Date:** 2026-10-09
**Supersedes:** `doc/specs/2026-10-06-gh-59-spec-disposition-coverage.md`, the cross-repo `deferred: <ref>` authoring clause and the ask-when-observable rule in `ticket-acceptance.md` (gatekeep-pr's honoring of dispositions stays in force); `doc/specs/2026-09-20-gh-41-ticket-acs-carried-into-spec.md`, the AC extraction rule (stop at next heading) and the disposition ask rule.

## Problem

Framing: kept - checked `ticket-acceptance.md:18`, `spec-council-member.md:34`, `spec-finalization.md:42` and the gate template, `spec-summarizer.md`, the gh-59 Problem.

A spec author facing a multi-repo ticket cannot tell which rows this repo owns, and `ticket-acceptance.md:18` gives it a legal exit for any row it is unsure of or finds expensive: `deferred: <spec path>` is a valid destination, the ask rule fires only "when it changes what the user observes once the change ships" (a row another repo or a later slice delivers never trips it), the council checks only a deferral's form (ref present, operates-without-it), and the gate summary has no slot for dispositions although the rule says "Name every disposition in the gate summary". Result: the author mints follow-up specs itself (a handoff spec with 11 of 17 rows deferred, 8 to a spec path the same brainstorm created), the human approves a scope cut they never saw as a list, and the omission surfaces only at `/skill:check-delivery`, which reads the whole ticket. Same-repo splits and cross-repo attribution collapse into one mechanism because the skill text never distinguishes "another repo delivers this" from "I'd rather not". Separately, shape-ticket's own examples bake a venue into AC text ("p95 latency <= 300ms in staging"), so authors copy it, and nothing stops a `venue: prd` row although the deploy-window rule says every AC is fulfillable before production.

Decisions from the questionary (user's words): split by repo is desirable and implicit, never a sign-off; a split within one repo is the failure case; brainstorming and council always want full coverage of this repo's rows; follow-ups are extraordinary and happen only when the user asks; a cut is the human's own decision; local, experimental, and staging proofs are equal when the scenario is replayable, so AC rows never name an environment and `venue:` is never production.

## Acceptance criteria

none - no ticket

## Design

### Vocabulary

- **This repo**: the `repo:` value of the overrides `## Issue tracker` section, else the `owner/name` path of `git remote get-url origin` with any `.git` suffix stripped (SSH and HTTPS forms alike); a group name matches when it equals that value or its basename, case-insensitive.
- **Repo group**: inside the ticket's acceptance-criteria section, a heading one level deeper than the AC heading whose text is a repo name. Attribution, never a split: `split-axis:` findings do not fire on it.
- **Scope cut**: a `deferred: <where>` or `deviates: <why>` disposition. Written only from the answer to a cut question (below) that the `Human input` block carries; a prompt sentence alone or ticket snapshot text never counts.
- **Scope-neutral correction**: a moved path or a workflow artifact (spec, plan, changelog, telemetry file). The row stays `in-scope`; the correction is a Design clause. Not a cut, never asked.
- **Dispositions**: `in-scope`, `deviates: <why>`, `deferred: <where>`, `venue: <env> - <observation>`, `elsewhere: <repo>`; default `in-scope`. `venue:` never carries `prd`, `prod`, or `production`.

### D1 - shape-ticket attributes rows to repos and strips venues

`skills/shape-ticket/SKILL.md`:

- AC template: when the Idea names more than one repo, the AC section groups rows under one repo group per repo. A single-repo ticket stays flat. The heading-scaffolding ban (`SKILL.md:254`) lists repo groups inside Acceptance Criteria as its third exception.
- Wording rule, beside the deploy-window rule: an AC row names setup, action, and observable result; it never names an environment. The deploy-window override valve (production verification for operational-acceptance classes) is removed; production-only observations live under `Post-deployment housekeeping`. The four examples carrying "in staging" (`SKILL.md:152,268,278,284`) lose that clause; baseline and method text stays.
- Roast: a fourth axis - every row sits under the repo that can observe it. Items 4 and 6 and the worker fallback say "four axes". An unambiguous regrouping applies like any roast fix and shows in the old->new diff at the confirm gate.

### D2 - brainstorming reads groups, cuts only on the human's words, offers ticket repair

`skills/brainstorming/gatherer.md:121`: the context-builder quotes the AC rows and their repo-group headings verbatim.

`skills/brainstorming/reference/ticket-acceptance.md`, edits in the owning sentences:

- Extraction: a heading one level deeper than the AC heading groups rows and does not end extraction; extraction ends at the next heading of the AC heading's level or higher.
- Attribution: a row under a repo group that is not this repo is `elsewhere: <repo>`, stated, never asked. A group whose name matches no repo (typo, alias, legacy phase heading) asks `A) this repo B) elsewhere: <name> C) repair the ticket`; a grouped ticket with no group matching this repo stops the brainstorm with that fact. The spec's `## Acceptance criteria` section stays flat; ownership lives only in the `elsewhere: <repo>` token.
- Cuts: the author never proposes one. Removed sentences: the ask-when-observable rule; "Defer a row only when the shipped change's own mechanism operates without it ... a hard but direct AC stays `in-scope` and ships"; "a row another repo or workflow delivers is `deferred: <that ticket or spec ref>`"; the stated-not-asked moved-path/workflow-artifact `deviates:` clause (now a scope-neutral correction). Kept: the `deferred:` destination forms (tracker ref, spec path, URL). "Never author acceptance criteria on the ticket's behalf" stays. The `brainstorming/SKILL.md:97` example (two ACs with a moved path marked `deviates: location only`) reads `in-scope` with the moved path as a Design clause.
- Cut question: asked in the standard questionary format when the human's prompt or an answer raises dropping or changing a row, or when code, a cited contract, or the human shows a row is wrong or impossible: `A) in-scope - <reading> B) deviates: <why> C) deferred: <where> D) repair the ticket - /skill:shape-ticket <ref> <row and evidence>`, `Recommendation:` A or D with the reason the row ships in this gauntlet; B and C are never recommended - a follow-up is the human's extraordinary call, not the author's. On D, shape-ticket runs in repair mode with the row and evidence as its driver (ref plus text, `shape-ticket/SKILL.md:43`) and its own confirm gate; brainstorming re-fetches the ticket, replaces the gather draft's verbatim block, and re-extracts. Cancel at that gate returns to this question with the row unchanged.
- The `Human input` block carries the full question and answer of every question that offered a disposition (`spec-finalization.md:52`).
- Replace "Name every disposition in the gate summary" with a pointer to the gate line below.

`skills/brainstorming/reference/spec-finalization.md`, gate template: one line directly after `Spec written and committed to ...`, rendered by brainstorming from the spec's `## Acceptance criteria` section (never by the summarizer):

```
Scope cuts: <row text, first 60 chars> - <disposition>; ... | none
```

`deferred:`, `deviates:`, and `venue:` rows are listed; `in-scope` and `elsewhere:` are not. The spec-summarizer is untouched.

### D3 - council blocks cuts the human did not make

`agents/spec-council-member.md:34`, in the existing AC comparison sentence, kind `scope`, severity blocker:

- a `deferred:` or `deviates:` row with no cut question and user answer in `Human input` picking that cut for that row - a prompt sentence alone never counts (this also covers a self-minted follow-up spec path);
- an `elsewhere:` row whose snapshot row is not under a repo group other than this repo;
- a `venue:` carrying `prd`, `prod`, or `production`.

The operates-without-it test is removed with its authoring clause. The amendment-review rubric (`spec-council-member.md:20`) carries the same three checks with outcome `escalate`.

### D4 - downstream reads `elsewhere:` as settled attribution

- `agents/conformance-reviewer.md:43,47,152` and `skills/verification-before-completion/reference/conformance-check.md:61`: the closed set is five; `elsewhere:` rows are recorded attribution (`recorded in spec? yes`), no `Rn`, no corrective finding.
- `skills/gatekeep-pr/reference/assessment.md:70` builds `ref` from `elsewhere: <repo>` as well; `findings.md:18`, `report.md:12-17`, `post-selection-loop.md:37-45` carry an `elsewhere: <repo> per spec` settled outcome, and `skills/gatekeep-pr/SKILL.md:53` and `skills/gatekeep-pr/verification-brief.md:240` list it beside `deferred per spec`/`deviates per spec`; the post-merge `AC coverage` venue line reads "checked before prod deploy".
- `skills/finishing-a-development-branch/SKILL.md:234-239`: the PR-body disposition block lists `elsewhere:` rows.
- `skills/check-delivery/SKILL.md:141-153`: AC extraction reads repo groups; a row under another repo's group gets a non-blocking `elsewhere: <repo>` verdict; this repo's rows keep the full check. The repo-identity preflight (`SKILL.md:76-79`) accepts a ticket whose tracker repo differs from `origin` when one of its repo groups names this repo, and linked-PR resolution then covers this repo only; the zero-config `gh issue` commands bind to the ticket's repo (`--repo <ticket repo>`), PR and commit lookups stay bound to the checkout.
- `skills/writing-plans/SKILL.md:238`: the coverage-table rule lists `elsewhere:` beside `deviates:`/`deferred:` as rows that get no table row.
- `README.md:39`: the workflow sentence lists the five dispositions, says scope cuts come only from the user's answer to a cut question and are listed at the gate, and says venue rows are verified before the prod deploy.
- `scripts/ci.mjs:264`: the `operates-without-it` assertion flips to the new markers (`elsewhere:`, `no human input to match`); `scripts/brainstorming-contract.test.mjs:37` asserts the five markers, the absence of "only when it changes what the user observes", and the `Scope cuts:` marker.

### Out of scope

The scope-check rule in `brainstorming/SKILL.md:86` ("Never split by service, package, repo") and `split-axes.md` stay: they govern cutting one request into several specs; repo attribution inside one ticket is not a split. Shipped specs carrying cuts without `Human input` provenance keep their gh-59 honoring at the PR gate.

## Errors and edge cases

| Case | Behavior |
|---|---|
| Flat ticket (no repo groups) | Every row is this repo's; brainstorming never guesses attribution. A row this repo cannot observe is an incorrect row -> the cut question. |
| Group name matches no repo | Asked (`A) this repo B) elsewhere: <name> C) repair the ticket`); never silent. |
| Grouped ticket, no group matches this repo | Brainstorm stops with that fact (wrong checkout or wrong ticket). |
| Ticket not fetched | Existing `none - ticket not fetched (<reason>)`; no `elsewhere:` rows. |
| User cancels at shape-ticket's repair gate | Back to the cut question, row unchanged. |
| Old approved spec with unprovenanced cuts | Council checks run at authoring and amendment review; conformance and gatekeep-pr unchanged. |
| Roast unavailable at shape-ticket | The draft's repo groups reach the confirm gate unverified; the existing `roast unavailable (<reason>)` line says so and the human checks the groups in the old->new diff. |
| `Human input` block missing | Members already emit `lean: nothing to cut`; every cut is a `scope` blocker "no human input to match", surfaced by the chair as a gate ambiguity. |

## Tests

- `scripts/brainstorming-contract.test.mjs` and `scripts/ci.mjs:264` as in D4.
- `eval/brainstorming`: `skillFiles` gains `reference/ticket-acceptance.md`; the replay reaches the disposition step. Samples: a cut proposed without the user's words stays `in-scope`; a row under another repo's group gets `elsewhere:` with no question; an unmatched group name is asked; a human-raised drop and an incorrect row each get the cut question with recommendation A or D; cancelled repair returns to the question.
- `eval/shape-ticket` (new or extended): multi-repo Idea yields repo groups; a row written "in staging" loses the venue at the AC gate.
- New `eval/spec-council-member`, samples: unprovenanced `deferred:` -> blocker; `deferred:` to a self-minted spec path -> blocker; human-named same-repo follow-up -> no `scope` finding on that row; `elsewhere:` under this repo's group -> blocker; `venue: prd` -> blocker; flat conforming spec -> no `scope` finding on any row (other finding kinds are not under test).
- `eval/spec-gate`: a spec with cuts renders the `Scope cuts:` line; a spec without renders `none`.
- `eval/conformance-check` and `eval/gatekeep-pr-scope`: an `elsewhere:` row is settled attribution, no gap.
- `node eval/run.mjs <target>` per touched target; `npm test`.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` (workflow sentence: five dispositions, pre-prod venue verification - communication contract); `CHANGELOG.md - deferred: release`
- Derived / memory docs invalidated: none

Skill and persona bodies are implementation surface per `reference/documentation-impact.md`.

## Open questions

none
