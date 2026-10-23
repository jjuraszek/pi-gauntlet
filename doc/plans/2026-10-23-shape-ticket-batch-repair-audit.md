# Shape-ticket batch repair and repo-grounded audit Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Ground create and repair drafts in repository evidence and repair a ref list through independent, sequential exact-diff ticket gates.

**Architecture:** Put scout dispatch, six-label output, fold-in, and degradation in a gather-time reference; keep the roast content-only. Commit the initially unreferenced audit and eval assembly preparation at A before changing skill behavior. Integrate ref-list routing, per-ticket stops, and AC uniqueness while preserving split approval and overlap payload ownership.

**Tech Stack:** Markdown skills/references, Node.js built-in tests, existing text eval runner, pi-cohort scout and council dispatch.

**Spec:** `doc/specs/2026-10-23-shape-ticket-batch-repair-audit.md`

**Verification:** `npm test && node eval/run.mjs shape-ticket --base "$(git log --diff-filter=A -1 --format=%H -- skills/shape-ticket/reference/repo-audit.md)"` - npm test invokes scripts/ci.mjs and bundles repository tests, style, instruction size, eval structure/hygiene, marketplace/reference checks, and packed-install checks. The second command runs the complete behavior target against preparation commit A.

---

## Files

### Skill implementation

**Create:**
- `skills/shape-ticket/reference/repo-audit.md` - complete contract, initially unreferenced by the skill.
- `skills/shape-ticket/reference/examples.md` - extract Examples and rationalizations.
- `skills/shape-ticket/reference/tracker-ladder.md` - create only if the edited skill reaches 49,000 bytes after the examples extraction.

**Modify:**
- `skills/shape-ticket/SKILL.md`
- `skills/shape-ticket/reference/overlap-check.md`

### Eval inputs and deterministic tests

**Modify:**
- `eval/lib/replay.test.mjs`
- `eval/shape-ticket/target.json`
- `eval/shape-ticket/intent.md`
- `eval/shape-ticket/README.md`
- `eval/shape-ticket/samples/bounded-prose/case.md`
- `eval/shape-ticket/samples/bug-source-ack/case.md`
- `eval/shape-ticket/samples/closed-concern-additions/case.md`
- `eval/shape-ticket/samples/displaced-detail/case.md`
- `eval/shape-ticket/samples/domain-reader/case.md`
- `eval/shape-ticket/samples/member-file-only/case.md`
- `eval/shape-ticket/samples/menu-after-numbered-findings/case.md`
- `eval/shape-ticket/samples/multi-repo-groups/case.md`
- `eval/shape-ticket/samples/repair-overflow/case.md`
- `eval/shape-ticket/samples/repair-source/case.md`
- `eval/shape-ticket/samples/source-carried/case.md`
- `eval/shape-ticket/samples/source-missing/case.md`
- `eval/shape-ticket/samples/venue-stripped/case.md`

**Create:**
- `eval/shape-ticket/samples/batch-repair/case.md`
- `eval/shape-ticket/samples/batch-repair/expected.md`
- `eval/shape-ticket/samples/audit-repo-fit/case.md`
- `eval/shape-ticket/samples/audit-repo-fit/expected.md`
- `eval/shape-ticket/samples/scenario-best-effort/case.md`
- `eval/shape-ticket/samples/scenario-best-effort/expected.md`
- `eval/shape-ticket/samples/audit-quiet-noop/case.md`
- `eval/shape-ticket/samples/audit-quiet-noop/expected.md`
- `eval/shape-ticket/samples/audit-byte-lock/case.md`
- `eval/shape-ticket/samples/audit-byte-lock/expected.md`
- `eval/shape-ticket/samples/audit-dispatch/case.md`
- `eval/shape-ticket/samples/audit-dispatch/expected.md`
- `eval/shape-ticket/samples/audit-grounding/case.md`
- `eval/shape-ticket/samples/audit-grounding/expected.md`

### Generated eval evidence

**Create:**
- `eval/shape-ticket/results/batch-repair/baseline.json`
- `eval/shape-ticket/results/batch-repair/candidate.json`
- `eval/shape-ticket/results/audit-repo-fit/baseline.json`
- `eval/shape-ticket/results/audit-repo-fit/candidate.json`
- `eval/shape-ticket/results/scenario-best-effort/baseline.json`
- `eval/shape-ticket/results/scenario-best-effort/candidate.json`
- `eval/shape-ticket/results/audit-quiet-noop/baseline.json`
- `eval/shape-ticket/results/audit-quiet-noop/candidate.json`
- `eval/shape-ticket/results/audit-byte-lock/baseline.json`
- `eval/shape-ticket/results/audit-byte-lock/candidate.json`
- `eval/shape-ticket/results/audit-dispatch/baseline.json`
- `eval/shape-ticket/results/audit-dispatch/candidate.json`
- `eval/shape-ticket/results/audit-grounding/baseline.json`
- `eval/shape-ticket/results/audit-grounding/candidate.json`

**Modify:**
- Existing `baseline.json` and `candidate.json` records under `eval/shape-ticket/results/` when the runner detects stale assemblies or judgments.
- `eval/shape-ticket/report.md`

### Public documentation

**Modify:**
- `README.md`

**Delete:** none.

The conditional tracker extraction is an observed-size branch, not an unsettled design choice. Do not edit this repo's overrides, personas, peer dependency, release notes, configuration guide, or sibling repos.

## Recon and execution constraints

- Apply `skills/forge-skill/SKILL.md`: imperative voice, observable branching, minimal owning-sentence edits, ASCII, present-tense instructions. Marketplace checks at `scripts/ci.mjs:572-621` also scan Markdown mentions of relative reference paths; use valid relative links and contextual filenames for temp artifacts.
- Skill call sites: routing/gather `skills/shape-ticket/SKILL.md:34-65`; draft through write `:71-170`; normalization/hard-stop `:174-194`; roast `:223-247`; tracker ladder/default verbs `:249-269`; examples `:303-333`; edge cases and overrides `:335-359`. Update the stale ordinary repair/split-batch sentence at `skills/shape-ticket/reference/overlap-check.md:45-48` without changing overlap gates.
- Existing tests: `eval/lib/replay.test.mjs:1-200`, using `assemble`, `parseCase`, `sliceText`, `treeReader`, and `baseReader` from `eval/lib/replay.mjs:12-100`. Extend this file, not the eval runner. Eval preparation and intent checks are in `eval/run.mjs:156-239`; baseline reuse and generated evidence are in `:318-369`.
- No independent formatter, ESLint, Prettier, or Biome config exists. Match existing two-space JavaScript and Markdown manually; run the scoped checks below. Repo-wide style is bundled in the header entrypoint.
- Task 1's creation commit is A. Resolve A using `git log --diff-filter=A -1 --format=%H -- skills/shape-ticket/reference/repo-audit.md`. Do not squash preparation with behavior before final model evidence is recorded. The creation selector remains stable even if the reference later changes.
- Baseline commands ran at 555a5bb: 21 tests passed per run, exit 0, with no source changes. The intentional invalid-gitfile fixture prints a fatal diagnostic while its test passes.
- The three implementation tasks form a dependency chain and extend the same test file. Keep them in serial waves. Public docs occupy a trailing doc-only wave. No documented deployment split or review-risk isolation requires another plan.

## Wave 1 - Baseline contract

### Task 1: Prepare the unreferenced audit contract and baseline assembly

**TDD scenario:** Modifying tested code - run existing tests first, then red/green assembly and source-contract tests.

**Spec:** doc/specs/2026-10-23-shape-ticket-batch-repair-audit.md § "Entry and batch" L36, § "Entry and batch" L38, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L42, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L44-L55, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L58, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L60, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L62-L64, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L65, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L66, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L70-L75, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L78, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L80, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L86, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L87, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L88, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L89, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L90, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L91, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L92, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L93, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L94-L95, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L97, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L99, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L101, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L103, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L105, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L107, § "Overrides contract" L117, § "Errors and edge cases" L125, § "Errors and edge cases" L126, § "Errors and edge cases" L127, § "Errors and edge cases" L129, § "Errors and edge cases" L130, § "Errors and edge cases" L131, § "Errors and edge cases" L132, § "Errors and edge cases" L133, § "Errors and edge cases" L134, § "Errors and edge cases" L135, § "Errors and edge cases" L137, § "Tests" L143, § "Out of scope" L165, § "Out of scope" L166, § "Out of scope" L167, § "Out of scope" L169

**Files:**
- Create: `skills/shape-ticket/reference/repo-audit.md`
- Modify: `eval/lib/replay.test.mjs:1-200`
- Modify: `eval/shape-ticket/target.json:1-6`
- Modify: `eval/shape-ticket/intent.md:1-33`
- Modify: `eval/shape-ticket/samples/bounded-prose/case.md:1-4`
- Modify: `eval/shape-ticket/samples/bug-source-ack/case.md:1-4`
- Modify: `eval/shape-ticket/samples/closed-concern-additions/case.md:1-4`
- Modify: `eval/shape-ticket/samples/displaced-detail/case.md:1-4`
- Modify: `eval/shape-ticket/samples/domain-reader/case.md:1-4`
- Modify: `eval/shape-ticket/samples/member-file-only/case.md:1-4`
- Modify: `eval/shape-ticket/samples/menu-after-numbered-findings/case.md:1-4`
- Modify: `eval/shape-ticket/samples/multi-repo-groups/case.md:1-4`
- Modify: `eval/shape-ticket/samples/repair-overflow/case.md:1-4`
- Modify: `eval/shape-ticket/samples/repair-source/case.md:1-4`
- Modify: `eval/shape-ticket/samples/source-carried/case.md:1-4`
- Modify: `eval/shape-ticket/samples/source-missing/case.md:1-4`
- Modify: `eval/shape-ticket/samples/venue-stripped/case.md:1-4`
- Test: `eval/lib/replay.test.mjs`

**Tests:**
- `node --test eval/lib/replay.test.mjs`
- baseline: 555a5bb pass
- via: `assemble`, `parseCase`, `sliceText`

Decision: replace the installed scout's output through its brief, not its persona - installed pi-cohort `agents/scout.md:1-46` has `inheritSkills: false`, tools `read, grep, find, ls, bash, write`, and default `# Code Context` in `context.md`. Supply every instruction and authorize only one absolute output file.

Decision: use eight-task foreground chunks, never a chain or consumer-cap change - installed `src/shared/types.ts:951` and `src/runs/foreground/subagent-executor.ts:1558-1563` implement the `parallel.maxTasks` rejection with zero results; `src/runs/foreground/chain-execution.ts:757-779` fails the whole parallel step on a member failure. `Max 8 tasks` is an implementation bug, not audit unavailability.

- [ ] **Step 1: Run existing assembly tests.**

  Run: `node --test eval/lib/replay.test.mjs`
  Expected: 21 existing tests pass.

- [ ] **Step 2: Add failing reference/manifest tests.**

  Extend the existing test imports. Assert the first three parsed `skillFiles` entries stay unchanged, the fourth is the audit reference, and all 13 existing cases have a leading exclusion that removes only that added entry. Assemble those cases with their existing additions and assert the audit heading is absent. Add this complete source-contract test:

  ```js
  test("shape-ticket audit reference carries the six-label contract", () => {
    const text = readFileSync(new URL("../../skills/shape-ticket/reference/repo-audit.md", import.meta.url), "utf8");
    for (const label of ["Claims:", "Repo-fit:", "AC-fit:", "Sibling:", "In-motion:", "Scenario:"]) {
      assert.ok(text.includes(label), label);
    }
    for (const token of ["async: false", 'context: "fresh"', 'outputMode: "file-only"', "60000", "240000", "300000"]) {
      assert.ok(text.includes(token), token);
    }
  });
  ```

  These prove source and assembly, not live scout execution. Task 2 supplies the prescribed nine-ref replay.

- [ ] **Step 3: Confirm red.**

  Run: `node --test eval/lib/replay.test.mjs`
  Expected: missing reference/manifest/drop assertions fail; old tests remain green.

- [ ] **Step 4: Write gather ordering and the dispatch recipe in the unreferenced file.**

  Own the complete audit recipe in the new reference. Use one `mktemp -d` root, serial tracker fetches, and fenced untrusted snapshots. Create runs necessary clarification and parent-owned `reference/overlap-check.md` discovery first; snapshot the clarified ask and any candidate as separate blocks under the create subdirectory. Audit the ask once and fold into create-anyway or added/changed enrichment prose only. Preserve overlap legacy bodies, payload-local gates, and the alternatives menu. Repair questions and gather-time AC recovery wait until every scout finishes; ask by ref order one question at a time.

  Specify foreground `subagent` calls with `async: false`, `context: "fresh"`, `forceTopLevelAsync` unset, one `scout` per ticket, repo-root `cwd`, absolute per-ticket output, `outputMode: "file-only"`, and exactly `control: { needsAttentionAfterMs: 60000, inFlightSilenceCeilingMs: 240000, inFlightSilenceKillMs: 300000 }`. Use sequential calls of at most eight ref-ordered tasks; inspect files on disk regardless of result labels; await all terminal results before folding. An async handle stops the run with a report, without polling or relaunching.

  Resolve the checkout by `git rev-parse --show-toplevel`; assume each ticket belongs to it. Pass no `model:`; `agentOverrides` owns the scout model. Outside a checkout report `audit unavailable (no repository)`. Missing/error/empty/malformed audit files are ticket-local unavailable results, not retries or batch failures.

- [ ] **Step 5: Write the self-contained scout brief.**

  Supply absolute snapshot/output paths, the untrusted-data boundary, six labels replacing persona defaults, and permission to write only the audit file. Read root `AGENTS.md`, `CLAUDE.md`, `REVIEW.md`, then their touched-area routes, including configured siblings. Parent-copy exact resolved tracker read and open-PR search commands, `## Capabilities` text, and documented staging reads. The GitHub `gh` default is `gh pr list --search "<ref>" --limit 20`; Linear commands come from the parent's `/skill:linear`, because the scout cannot load it. A missing verb is `unavailable (<what>)`, never guessed. Authorize only documented read commands, not checkout/source changes, staging mutations, browser use, or binary attachment reads.

  Copy spec L70-L75's six-line output template. Require every label on every file, with repeated `Claims:` and `Sibling:` rows where appropriate:

  | Field | Required content |
  |---|---|
  | `Claims:` | One factual Context/Problem or create-input claim per line, with verified path/line, contradicted fact plus citation, or not-checkable reason; empty is `Claims: none`. |
  | `Repo-fit` | Judge only Idea/ask approach. Cite why an existing/simpler path fits; an uncited alternative is `kept`. |
  | `AC-fit` | One `how:` row per mechanism/new abstraction routed elsewhere by cited docs. Uncited objections are `clear`. |
  | `Sibling:` | One row per configured relative path: none, grounded observable leg already stated by the ticket, or not found; empty is `Sibling: none`. |
  | `In-motion` | Ref first, then quoted title terms, against `git -C <repo root> worktree list` and resolved open-PR search bounded to 20; do not scan `git branch -a`. No hit is `none`; no search verb is `unavailable`. |
  | `Scenario` | Best-effort authorized current-system reads: setup, action, current observation, links/attachment names. Fresh work or missing access is `none (<reason>)`. Never drive a browser or read an attachment. |

  Accept only a non-empty file with each of `^Claims:`, `^Repo-fit:`, `^AC-fit:`, `^Sibling:`, `^In-motion:`, `^Scenario:` at a line start. Counts do not matter. Everything else is `audit unavailable (<reason>)` for that ticket. Include fresh-work, unavailable credentials/browser, missing PR search, unresolved sibling, and quiet-noop outcomes without new human questions.

- [ ] **Step 6: Write claim, Idea, AC, and sibling fold-in.**

  | Finding | Parent action before Draft |
  |---|---|
  | `Claims: ... contradicted` | Replace a code/config/doc factual error in Problem with the cited fact; keep original wording verbatim in accumulated Reporter note. Report the old/new premise and citation. |
  | Reporter observation contradicted by code or any ambiguous claim | Preserve the reporter statement and surface the disagreement as an ambiguous premise in Audit; do not ask an audit-created question or block. |
  | `Claims: ... not checkable` | Leave prose unchanged and report `unverified` with claim and reason. |
  | `Repo-fit: simpler/exists` | Attribute the cited existing/simpler route in one Idea sketch. Retain original overflow via existing Reporter-note rules. |
  | `AC-fit: how:` | Restate the row as its observable result without prescribing the alternative; retain removed mechanism verbatim in the note and report ac-fit plus citation. |
  | `Sibling: ... leg` | Resolve tracker name from `git -C <path> remote get-url origin` as `owner/name` with `.git` stripped, or from documented repo name. Only an already-stated grounded observable moves to `### <repo>` and Idea names that repo. Unresolved name/observable means no AC change. |
  | `In-motion` | Report only; never change body or metadata because a PR/worktree exists. |
  | `Scenario: setup...` | Fill supported setup/action gaps, strip venue/credentials from ACs, keep the expected result unchanged rather than making observation the success condition, and report `scenario: present`. Fresh features change no AC. |
  | `kept`, `clear`, `none`, unavailable | Do not manufacture a draft change or block. |

  Resolve siblings only from `## shape-ticket` / `- sibling:` in the resolved overrides file. Paths are relative; absent heading means single-repo audit. Not found or ungrounded legs create no empty group. Use the existing `## <skill-name>` convention; never add `.pi/gauntlet-overrides.md` content here or invocation arguments.

- [ ] **Step 7: Write body evidence, repair classification, and no-op rules.**

  Put one scenario footer under Problem's `source:` footers whenever a body is drafted: `scenario: setup: <...>; action: <...>; observed: <...>; inputs: <links or attachment names | none>` or `scenario: none (<reason>)`. Preserve observation and inputs as evidence; environments are allowed there, not in ACs. The footer is not a `source:` footer, counts toward no source gap, and takes part in no source-gap resolution. A none scenario alone never causes a draft.

  Any audit or uniqueness AC text/row/group change selects substantive full-replacement repair with `- [ ]` normalization and all gates. With no AC change, preserve raw bytes on conformance-only and missing-footer-only paths. Every displaced original claim, sketch, removed row, or mechanism remains verbatim in accumulated Reporter note, requiring a new comment even when an old one exists; never edit old comments.

  Draft-changing findings defeat no-op. Behavior-only ambiguity, `unverified`, in-motion, `scenario: none`, and unavailable results alone preserve an otherwise-conforming no-op. Attach that ticket's `Audit:` lines to its no-op report, without roast, gate, write, question, or invented blocking status.

- [ ] **Step 8: Write sequential gate/report and content-only roast handoff.**

  Finish every initial gather/audit/draft/deterministic-gate/roast before printing the first ticket's gate. Present each ref's report or gate only in its turn; do not disclose later tickets before the current answer. A stopped ticket receives its hard-stop report and no option number. Other tickets retain today's single-ticket numbered choices. Decline skips that ticket; revision re-drafts/re-gates that ticket and re-presents before advancing; approval runs step 9 immediately before the next gate. A response about another ticket never approves its unseen diff. A split retains its N-body one-approval subset gate. A completed run ends with one exact status line per ref using `written`, `declined`, `stopped`, `no-op`, or `unfetched`.

  Place one `Audit:` block per issue immediately above its Title line. When repro bugs have `source missing:` lines before Title, Audit follows those lines; other source gaps stay after Evidence. Render findings using spec L86-L95's gate/report formats, including premise, unverified, repo-fit, ac-fit, sibling, in-motion, and scenario outcomes. Do not invent a three-field schema or move Audit between Evidence and roast.

  Reuse the gather temp root with per-ticket `draft.md`, `snapshot.md`, `audit.md`, member/retry outputs, and `chair.md`. Run the existing roast independently per eligible ticket in ref order; do not roast stopped tickets. Add the audit path as explicitly untrusted permitted input for members, worker/native fallbacks, and chair. Cited audit-traceable fact/Idea/AC/sibling/scenario/footer changes and their note moves are source-grounded, not fidelity `added`/`lost` or over-spec. Other additions/scope remain checked. Members and chair never re-verify against the repo, and no fifth axis is added. On a harness without `subagent()`, native fresh low-effort dispatch with this same brief/probe/artifacts is the sole conditional in the reference. Change no persona, attachment-read policy, split stop, or consumer cap.

- [ ] **Step 9: Append the target entry, exclusions, and current intent SHA.**

  Keep the three current target slices byte-equivalent as parsed entries. Append `skills/shape-ticket/reference/repo-audit.md` to `skillFiles` in `target.json`. Prefix every existing sample with `bundle-: skills/shape-ticket/reference/repo-audit.md` while retaining its additions/input. Refresh only the first `for:` line of `intent.md` to the new assembly SHA with existing `assemble`, `treeReader`, and `sha256`. Do not load the reference from the skill yet. This prepares `eval/run.mjs`'s later `--baseline-only` seed, not a behavioral run.

- [ ] **Step 10: Confirm green and run scoped style checks.**

  Run: `node --test eval/lib/replay.test.mjs`
  Expected: old and new deterministic tests pass.

  Run: `node --check eval/lib/replay.test.mjs`

  Run: `node --input-type=module -e 'import assert from "node:assert/strict"; import { lintTarget } from "./eval/lib/lint.mjs"; import { lintSkillSizes } from "./scripts/skill-size-lint.mjs"; assert.deepEqual(lintTarget("eval/shape-ticket"), []); assert.deepEqual(lintSkillSizes(process.cwd()).filter(x => x.startsWith("skills/shape-ticket/")), []);'`
  Expected: syntax succeeds, no target/style/size errors, compact tables and imperative reference wording after manual review.

- [ ] **Step 11: Commit preparation A without skill behavior edits.**

  ```bash
  git add skills/shape-ticket/reference/repo-audit.md eval/lib/replay.test.mjs eval/shape-ticket/target.json eval/shape-ticket/intent.md eval/shape-ticket/samples
  git commit -m "Prepare shape-ticket audit baseline"
  ```

  After wave review lands A, Task 2 resolves its creation SHA and seeds before Task 3. The skill still has original single-ticket/whole-run behavior at A.

## Wave 2 - Replay fixtures

Depends on Wave 1: samples consume the new reference and target, and extend the same test file.

### Task 2: Add bounded audit replays and seed the pre-behavior baseline

**TDD scenario:** New feature - add named model facts and failing fixture-assembly checks before behavior changes.

**Spec:** doc/specs/2026-10-23-shape-ticket-batch-repair-audit.md § "Entry and batch" L30, § "Entry and batch" L32, § "Entry and batch" L34, § "Entry and batch" L36, § "Entry and batch" L38, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L58, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L60, § "Errors and edge cases" L125, § "Errors and edge cases" L126, § "Errors and edge cases" L127, § "Errors and edge cases" L128, § "Errors and edge cases" L129, § "Errors and edge cases" L130, § "Errors and edge cases" L131, § "Errors and edge cases" L132, § "Errors and edge cases" L133, § "Errors and edge cases" L134, § "Errors and edge cases" L135, § "Errors and edge cases" L136, § "Errors and edge cases" L137, § "Tests" L143, § "Tests" L145, § "Tests" L149, § "Tests" L150, § "Tests" L151, § "Tests" L152, § "Tests" L153

**Files:**
- Create: `eval/shape-ticket/samples/batch-repair/case.md`
- Create: `eval/shape-ticket/samples/batch-repair/expected.md`
- Create: `eval/shape-ticket/samples/audit-repo-fit/case.md`
- Create: `eval/shape-ticket/samples/audit-repo-fit/expected.md`
- Create: `eval/shape-ticket/samples/scenario-best-effort/case.md`
- Create: `eval/shape-ticket/samples/scenario-best-effort/expected.md`
- Create: `eval/shape-ticket/samples/audit-quiet-noop/case.md`
- Create: `eval/shape-ticket/samples/audit-quiet-noop/expected.md`
- Create: `eval/shape-ticket/samples/audit-byte-lock/case.md`
- Create: `eval/shape-ticket/samples/audit-byte-lock/expected.md`
- Create: `eval/shape-ticket/samples/audit-dispatch/case.md`
- Create: `eval/shape-ticket/samples/audit-dispatch/expected.md`
- Create: `eval/shape-ticket/samples/audit-grounding/case.md`
- Create: `eval/shape-ticket/samples/audit-grounding/expected.md`
- Create: `eval/shape-ticket/results/batch-repair/baseline.json`
- Create: `eval/shape-ticket/results/audit-repo-fit/baseline.json`
- Create: `eval/shape-ticket/results/scenario-best-effort/baseline.json`
- Create: `eval/shape-ticket/results/audit-quiet-noop/baseline.json`
- Create: `eval/shape-ticket/results/audit-byte-lock/baseline.json`
- Create: `eval/shape-ticket/results/audit-dispatch/baseline.json`
- Create: `eval/shape-ticket/results/audit-grounding/baseline.json`
- Modify: `eval/lib/replay.test.mjs:1-200`
- Modify: `eval/shape-ticket/intent.md:1-33`
- Modify: `eval/shape-ticket/README.md:1-30`
- Modify: `eval/shape-ticket/results/*/baseline.json`
- Modify: `eval/shape-ticket/report.md:1-180`
- Test: `eval/lib/replay.test.mjs`

**Tests:**
- `node --test eval/lib/replay.test.mjs`
- baseline: 555a5bb pass
- via: `assemble`, `parseCase`, `baseReader`

Decision: test nine-ref transport through prescribed dispatch output, not real tracker/scout calls - the existing member-file-only sample and `eval/shape-ticket/replay.md:1-7` already prescribe tool-free outputs. Inline all docs/audits/capabilities, disable tools, and use anonymized refs/paths.

- [ ] **Step 1: Add failing sample-assembly assertions.**

  Enumerate seven new sample names. Parse cases and expected files with existing helpers, importing `parseExpected` from `eval/lib/checks.mjs`; require non-empty fact IDs and audit inclusion. Assert dispatch/routing cases add the whole skill because default slices omit routing/gather. Keep `wordCap` 1600. Run `node --test eval/lib/replay.test.mjs`; expect missing fixture failures.

- [ ] **Step 2: Write the exact batch case and facts.**

  Primary invocation is `ABC-101, ABC-102 ABC-102, ABC-103`: three fetched bodies/audits, duplicate collapse, one wishful AC surviving recovery in `ABC-102`, and an implied AC row in `ABC-103`. Give the third ticket a same-subject different-result row that must stay. Add compound-independent observations as another row, and nested details that must not split. Name extra context with `ABC-102: the dashboard here is the admin one`; common context is supported by only one snapshot. Add separate `#N`, `ABC-123`, URL, partial-fetch, and all-fetch failure branches.

  Require ABC-101's gate alone in today's format, Audit immediately above Title (after any pre-Title bug gaps), no information about later tickets before its answer, and recovery questions only after all audits. Continue with decline 101, report 102 stopped without an option number, and gate/approve 103; re-fetch/write 103 before advancing. Keep removed implied text in Reporter note and retain different-result rows. Add a revise continuation that re-presents the current ticket; a response selecting another ticket must not approve an unseen diff. End with one specified status line per distinct ref.

  Fact IDs: `parse`, `scope`, `dedup`, `first-gate`, `stop-local`, `unique`, `audit-lines`, `off-turn`, `terminal`. Include an overlap control retaining parent discovery via `reference/overlap-check.md`, clarified create snapshots under one `mktemp -d` root, immutable legacy ACs, and payload-local alternatives.

- [ ] **Step 3: Write repo-fit, scenario, and byte-lock samples.**

  | Sample | Inline setup and named facts |
  |---|---|
  | `audit-repo-fit` | Reporter proposes a new wrapper; cite an existing helper from inline docs. Require attributed Idea and original note retention (`idea`, `retained`), and gate `repo-fit:` with citation. AC-only branch has cited `AC-fit: how:`; restate the observable without naming the alternative, retain mechanism, and report `ac-fit:` (`ac-only`). No new question (`no-question`). |
  | `scenario-best-effort` | Feature audit is `Scenario: none (nothing to observe - new capability)`; drafted body carries `scenario: none (...)` under source footers and the write is offered (`feature`, `footer`), without park or `Blocked on:`. Defect branch has setup/action/current zero-row observation and expected nonzero result; fill setup/action without making zero rows desired (`defect`). Footer preserves observation/link, uses `observed:`, and neither creates nor resolves source gaps (`source-independent`). Missing credentials/browser is a note (`access`). |
  | `audit-quiet-noop` | Conforming ticket with active PR and quiet findings remains no-op, reports Audit, skips roast/gate/write (`active-noop`). Empty-file branch reports `audit unavailable (empty file)` and remains no-op (`empty-noop`). Also exercise a usable all-none audit. |
  | `audit-byte-lock` | Quiet prose-only rewrite preserves mixed checked/numbered AC bytes (`quiet-bytes`). Scenario fills setup/action so full repair normalizes all ACs and passes gates without byte mismatch (`scenario-normalize`). Existing note does not suppress newly displaced mechanism (`new-note`). |

- [ ] **Step 4: Write the nine-ref transport sample.**

  Supply nine distinct fetched tickets, checkout identity, inline scout capability contract, absolute `/tmp/shape-ticket-audit/` artifacts, and tools unavailable. Require two top-level calls of eight and one tasks, nine separate file-only outputs, exact controls, fresh context, `async: false`, no `model:`, `forceTopLevelAsync` unset, and no `parallel.maxTasks` or chain changes. Cite `src/shared/types.ts:951`, `src/runs/foreground/subagent-executor.ts:1558-1563`, and `src/runs/foreground/chain-execution.ts:757-779`. Resolve root with `git rev-parse --show-toplevel`; `agentOverrides` owns model choice.

  Prescribe missing/empty/missing-`Scenario:` files plus a valid file whose tool label says failed. Require disk-based ticket-local degradation and healthy audits retained. Async handle must stop without polling/relaunching. `Max 8 tasks` is a failed recipe, not unavailable evidence. Fact IDs: `chunks`, `controls`, `files`, `isolation`, `foreground`.

- [ ] **Step 5: Write grounding, sibling, and degradation sample.**

  Inline a contradicted code fact, reporter observation disagreed with by code, not-checkable fact, uncited Idea/AC alternatives, and configured `- sibling:` paths for grounded/not-found/no-observable cases. Require code correction plus verbatim retention (`claim`), preserved reporter observation/ambiguity (`reporter`), unchanged uncheckable prose (`uncheckable`), kept/clear uncited alternatives (`citations`), and only already-stated grounded observable in a named-repo group with Idea attribution (`sibling`). Attachments remain names (`attachments`). No-checkout branch is `audit unavailable (no repository)`; missing PR search is not none (`degradation`). Include defect-still-mismatches-expected and native fallback without a new question/gate.

- [ ] **Step 6: Bound output and document intentional moves.**

  Start expected files with `anonymized: true`. Use mechanical checks only for literals; judge framing, bytes, routing, fidelity. New cases load the audit and add the whole skill where needed; retain original `skillFiles` slices and old `bundle-:` exclusions in `target.json`. Inputs are inline docs/audits; no repo tools. Cap multi-branch replies at 1200 words below global `wordCap` 1600.

  Preserve `repair-overflow/expected.md` byte-for-byte: singleton `repair-overflow` / `invalid` still stops its whole run. Keep all legacy source/overflow facts. Name new fact moves in `intent.md` with current first `for:`. Update target README with A, inclusion rules, samples, prescribed-not-live transport, and cache behavior; no hash/assembly algorithm changes.

- [ ] **Step 7: Confirm fixture green and lint.**

  Run: `node --test eval/lib/replay.test.mjs`
  Expected: fixture assembly/expected tests pass; these do not claim model behavior passed.

  Run: `node --check eval/lib/replay.test.mjs`

  Run: `node --input-type=module -e 'import assert from "node:assert/strict"; import { lintTarget } from "./eval/lib/lint.mjs"; import { scanTree } from "./eval/lib/hygiene.mjs"; assert.deepEqual(lintTarget("eval/shape-ticket"), []); assert.deepEqual(scanTree("eval/shape-ticket"), []);'`
  Expected: no lint/hygiene issues; manually review ASCII and compact tables.

- [ ] **Step 8: Seed while the skill has pre-behavior rules.**

  This preparation operation is not final verification. Run from the worktree:

  ```bash
  AUDIT_BASE=$(git log --diff-filter=A -1 --format=%H -- skills/shape-ticket/reference/repo-audit.md)
  node eval/run.mjs shape-ticket --base "$AUDIT_BASE" --baseline-only
  ```

  A contains the full unreferenced audit/target, so `baseReader` can read it; fixtures come from the working tree. Require all 20 baseline records. Review new facts' actual baseline outcomes and set moves from evidence, not assumed failures. Inspect each cell's recorded words. If any arm reaches `wordCap`, reduce case/reply scope without dropping facts, update moves, and reseed changed cells before Task 3. Never raise the cap or refresh/promote a post-behavior baseline.

- [ ] **Step 9: Commit fixtures, seed evidence, and target guide.**

  ```bash
  git add eval/lib/replay.test.mjs eval/shape-ticket/samples eval/shape-ticket/intent.md eval/shape-ticket/README.md eval/shape-ticket/results eval/shape-ticket/report.md
  git commit -m "Add bounded ticket audit and batch repair replays"
  ```

## Wave 3 - Behavior integration

Depends on Wave 2: A and seeded evidence exist before any skill behavior changes. This task consumes those fixtures and extends the same test file.

### Task 3: Integrate audited gather, per-ticket gates, and AC uniqueness

**TDD scenario:** Modifying tested code - run existing tests first, then red/green integration/assembly assertions; model facts compare against A at verification.

**Spec:** doc/specs/2026-10-23-shape-ticket-batch-repair-audit.md § "Entry and batch" L30, § "Entry and batch" L32, § "Entry and batch" L34, § "Entry and batch" L36, § "Entry and batch" L38, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L42, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L99, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L101, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L103, § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L105, § "Deterministic gate changes (SKILL.md)" L111, § "Deterministic gate changes (SKILL.md)" L112, § "Deterministic gate changes (SKILL.md)" L113, § "Overrides contract" L117, § "Byte budget" L121, § "Errors and edge cases" L128, § "Errors and edge cases" L129, § "Errors and edge cases" L130, § "Errors and edge cases" L131, § "Errors and edge cases" L132, § "Errors and edge cases" L133, § "Errors and edge cases" L134, § "Errors and edge cases" L135, § "Errors and edge cases" L136, § "Errors and edge cases" L137, § "Tests" L143, § "Tests" L145, § "Out of scope" L164, § "Out of scope" L165, § "Out of scope" L166, § "Out of scope" L167, § "Out of scope" L168, § "Out of scope" L169, § "Out of scope" L170

**Files:**
- Create: `skills/shape-ticket/reference/examples.md`
- Create: `skills/shape-ticket/reference/tracker-ladder.md` (only at measured threshold)
- Create: `eval/shape-ticket/results/batch-repair/candidate.json`
- Create: `eval/shape-ticket/results/audit-repo-fit/candidate.json`
- Create: `eval/shape-ticket/results/scenario-best-effort/candidate.json`
- Create: `eval/shape-ticket/results/audit-quiet-noop/candidate.json`
- Create: `eval/shape-ticket/results/audit-byte-lock/candidate.json`
- Create: `eval/shape-ticket/results/audit-dispatch/candidate.json`
- Create: `eval/shape-ticket/results/audit-grounding/candidate.json`
- Modify: `skills/shape-ticket/SKILL.md:8-359`
- Modify: `skills/shape-ticket/reference/overlap-check.md:45-48`
- Modify: `eval/lib/replay.test.mjs:1-200`
- Modify: `eval/shape-ticket/intent.md:1-33`
- Modify: `eval/shape-ticket/results/*/baseline.json`
- Modify: `eval/shape-ticket/results/*/candidate.json`
- Modify: `eval/shape-ticket/report.md:1-180`
- Test: `eval/lib/replay.test.mjs`

**Tests:**
- `node --test eval/lib/replay.test.mjs`
- baseline: 555a5bb pass
- via: `assemble`, `parseCase`, `sliceText`

Decision: reuse existing ref input, artifacts, gate, note accumulator, and overlap alternatives - current `skills/shape-ticket/SKILL.md:34-170` and `reference/overlap-check.md:38-54` own them. Add no `--repair`, batch option, or runtime state machine; this is a Markdown instruction change.

- [ ] **Step 1: Run current tests and add failing integration checks.**

  Run: `node --test eval/lib/replay.test.mjs`
  Expected: Task 2 tests pass.

  Add source/assembly assertions for gather audit pointer, examples pointer/absent inline exemplar, per-ticket gates, unchanged slice delimiters, and legacy exclusions. Pin the scenario body-footer rule and `Audit:` before Title rather than an Evidence insertion. Retain roast `outputMode: "file-only"` and existing usable-member `^lean:` probe because CI pins them. Assert overlap ordinary repair is per-ticket and split remains atomic. Accept absent tracker-ladder below threshold or valid extracted file/pointer at threshold. Run the same command; expect red before implementation.

- [ ] **Step 2: Extract examples to fund bytes.**

  Move all `## Examples and rationalizations` content byte-preserving to `reference/examples.md`; leave a read-now pointer where AC examples/rationalizations are needed. Keep `### 4 - Draft` -> `## Roast` and `## Evidence gate` -> `## Ticket wording` slices unchanged. If edited skill remains >=49,000 bytes after examples extraction, move `## Tracker abstraction and capability ladder` including verbs to `reference/tracker-ladder.md`, leaving a read-now pointer at step 1. Fix relative links only where extraction changes their base. Final instructions must be under 50,000 bytes/2,000 lines.

  Preserve the audit `skillFiles` entry in `eval/shape-ticket/target.json`, original slices, and every old `bundle-: skills/shape-ticket/reference/repo-audit.md`. Extraction must not leak audit input into excluded cases.

- [ ] **Step 3: Change routing, gather, and question ordering.**

  Parse comma/whitespace ref lists and deduplicate first occurrence; singleton uses same path. Apply text like `ABC-102: the dashboard here is the admin one` only to its ref. Test shared context independently against each fetched snapshot: append supported assertions; unsupported applicability is surfaced in that ticket's audit report, never copied as fact. Continue fetched tickets after partial failures; list unfetched refs; none fetched preserves abort/offer-create.

  Fetch serially into one `mktemp -d` root with per-ticket fenced snapshots; create snapshots clarified input plus any parent-discovered candidate. Read `reference/repo-audit.md` at gather in both modes, after necessary create clarification and `reference/overlap-check.md` discovery, before Draft. Repair questions/gather recovery wait for audits, then run one at a time in ref order. Keep legacy overlap bodies and payload-local alternatives. Use the reference recipe rather than duplicating dispatch/fold-in in the near-limit skill.

- [ ] **Step 4: Classify substantive repair and apply uniqueness after normalization.**

  Any audit or uniqueness AC row/text/group change exits raw-byte-lock paths. Normalize all substantive rows and retain every existing integrity outcome. Quiet conformance/missing-footer repairs preserve exact checked/numbered bytes. Grounded sibling observables go only under resolved `### <repo>` and Idea names the repo. Every displaced claim/sketch/row/mechanism accumulates verbatim under `## Proposed Reporter note` in untrusted fences and can require a new comment despite an older note.

  Immediately after normalization remove an implied row only when another row's setup/action/result already contains its observable; retain removed text in Reporter note. Split bundled independent observations into individually tickable rows; nested numbering remains detail, and same-subject different-result rows stay separate. A conformance-only repair needing uniqueness change becomes substantive rather than silently violating byte lock. Apply this only to added/changed overlap rows; never serialize legacy rows.

- [ ] **Step 5: Make hard stops ticket-local; retain split atomicity.**

  Replace ordinary multi-ticket whole-run stop wording in hard-stop paragraph, quick reference, and edge cases. A surviving wishful/tautological AC stops its source ticket; singleton therefore still stops its whole run. Present its draft-so-far/report in its turn with no option number. Keep recovery choices: values arriving in-session re-draft/re-gate that ticket's exact diff, never append it to an earlier approval. Continue healthy refs. Split slices of one source ticket retain all-or-nothing stops.

  Update only the stale ordinary repair/split-batch sentence in `reference/overlap-check.md`; retain independent alternative gates, protected workflow bodies, exact mutually exclusive payloads, and source revalidation. Keep relocation/park behavior and `--skip-overlap` unchanged.

- [ ] **Step 6: Sequence exact-diff gates and Audit blocks.**

  Remove whole-repair-batch approval implications in quick reference, hard constraint, steps 8/9, split prose, and red flags. One gate covers a split's N bodies; a repair batch is N single-ticket gates. Initial preparation/roasts finish before the first gate. In ref order show only the current report/gate; approval re-fetches/compares/writes that ticket immediately before advancing, decline skips, revision rechecks/re-presents. Preserve split subset approval, headless stop, source substitutions, source re-asks, and no approval of an unseen other ticket.

  Place each issue's `Audit:` immediately above Title; when repro bugs have pre-Title `source missing:` rows, Audit follows them. Other source gaps stay after Evidence. Render concrete premise/unverified/repo-fit/ac-fit/sibling/in-motion/scenario findings per the reference, not a new fixed schema. End completed runs with one ref line using `written`, `declined`, `stopped`, `no-op`, `unfetched`.

- [ ] **Step 7: Wire evidence, no-op, and content-only roast.**

  Drafted bodies receive the reference's scenario footer under Problem source footers, with `observed:` for observation; none is retained only when a draft already exists. It is evidence allowed to name environment/inputs, not an AC and not a `source:` gap. Add the explicit footer allowance at the evidence/wording owner so displacement checks do not move it or treat it as a missing source.

  Cited `simpler`/exists Idea, `AC-fit: how`, factual correction, sibling group, and AC-fed scenario defeat no-op; behavior-only conflict, `unverified`, in-motion, `scenario: none`, unavailable, kept/clear alone do not. No-op reports retain `Audit:` and propose no gate/write. Report `audit unavailable (no repository)`, credential/browser notes, and search unavailable rather than none without questions. Uncited alternatives stay kept/clear; unresolved/ungrounded `- sibling:` creates no group; attachments remain names.

  Reuse root/per-ticket `draft.md`, `snapshot.md`, `audit.md`, member/retry output, `chair.md`, and existing `Reporter note:` / `Overlap evidence:` payload. Add the untrusted audit to permitted input for members, worker/native fallbacks, and chair. Cited audit-traceable fact/Idea/AC/sibling/scenario/footer changes plus note moves are source-grounded, not fidelity `added`/`lost` or over-spec; uncited additions/scope remain checked. Members and chair stay content-only. Run roast per eligible ref, skip stopped tickets, and retain controls, retries, probes, coverage, failure-to-gate, and one re-pass. Add no fifth axis or repository access.

- [ ] **Step 8: Add documented PR reads and sibling hook.**

  Add `gh pr list --search "<ref>" --limit 20` as the GitHub open-PR read row in its existing/extracted ladder owner. Parent copies exact read verbs/capability text; scout loads no skills and guesses no commands. State `## shape-ticket` relative `- sibling:` entries as the only sibling source under existing `## <skill-name>` convention. Leave `.pi/gauntlet-overrides.md` untouched. Add no invocation paths, cross-repo detection, attachment/browser ability, consumer `parallel.maxTasks` change, or batching of `check-delivery`, `gatekeep-pr`, or other tracker skills.

- [ ] **Step 9: Update intent and confirm deterministic green/style.**

  Refresh first `for:` in `intent.md` from final assembly; retain named moves allowed by observed A evidence. `eval/run.mjs` continues comparing A, never promotes candidates. Keep `wordCap` 1600, existing `repair-overflow`, and its `invalid` fact unchanged. Inspect actual baseline/candidate words at model verification, reducing long case/reply scope without dropping facts rather than raising cap.

  Run: `node --test eval/lib/replay.test.mjs`
  Expected: all legacy and integration assertions pass.

  Run: `node --check eval/lib/replay.test.mjs`

  Run: `node --input-type=module -e 'import assert from "node:assert/strict"; import { lintTarget } from "./eval/lib/lint.mjs"; import { scanTree } from "./eval/lib/hygiene.mjs"; import { lintSkillSizes } from "./scripts/skill-size-lint.mjs"; import { lintModelLiterals } from "./scripts/model-literal-lint.mjs"; assert.deepEqual(lintTarget("eval/shape-ticket"), []); assert.deepEqual(scanTree("eval/shape-ticket"), []); assert.deepEqual(lintSkillSizes(process.cwd()).filter(x => x.startsWith("skills/shape-ticket/")), []); assert.deepEqual(lintModelLiterals(process.cwd()).filter(x => x.startsWith("skills/shape-ticket/")), []);'`
  Expected: no syntax, target, hygiene, size, or scoped model-literal errors. Manually review imperative voice, ASCII, links, and exact footer/gate placement. Extraction stays conditional only on measured bytes.

- [ ] **Step 10: Commit behavior and hand off final model evidence.**

  ```bash
  git add skills/shape-ticket eval/lib/replay.test.mjs eval/shape-ticket/intent.md
  git commit -m "Audit ticket drafts and gate batch repairs per ticket"
  ```

  Header verification generates current candidates/final report after docs. This task owns those listed paths: preserve A baselines, inspect every intended-move disposition, require new must-hold facts and old source/overflow guards, and commit generated evidence before completion. Do not duplicate the full target invocation in tasks or replace final evidence with a partial run. Classify the change as behavioral instruction editing in its eventual change summary.

## Wave 4 - Documentation

Depends on Wave 3: publish implemented gate/sibling behavior in a trailing file-disjoint doc-only wave.

### Task 4: Update the public batch and sibling configuration contract

**TDD scenario:** Trivial change - use judgment; compare docs to implemented skill/reference.

**Spec:** doc/specs/2026-10-23-shape-ticket-batch-repair-audit.md § "Overrides contract" L117, § "Documentation impact" L157, § "Documentation impact" L158, § "Documentation impact" L160

**Files:**
- Modify: `README.md:38-80`
- Modify: `README.md:277-325`

**Tests:**
- none: public Markdown documentation; no independent Markdown formatter is configured

Decision: keep heading ownership in the README named-section table - `doc/configuration.md:1-20` routes there, and the spec names no new configuration-guide change. Keep `CHANGELOG.md - deferred: release` out of this change.

- [ ] **Step 1: Update workflow and skill wording.**

  Replace single-issue-only workflow/skill bullet with create-one/ref-list-repair wording. Describe grounded claims/Idea/AC fit, configured sibling legs, in-motion work, and best-effort scenario without promising replication or a concrete fix. State sequential per-ticket confirmation and no extra audit gate.

- [ ] **Step 2: Update named-section and fixed confirmation rows.**

  Add `## shape-ticket` with relative `- sibling:` paths, reader shape-ticket, single-repo default, kind extends, and second-leg checkout purpose. This is existing `## <skill-name>` convention, not a setting or local `.pi/gauntlet-overrides.md` edit. Fixed rule becomes one exact-diff confirmation per ticket write; split N bodies count as one write. Retain headless-no-write and compact tables.

- [ ] **Step 3: Read touched units against implementation.**

  Compare paragraph, bullet, rows to `skills/shape-ticket/SKILL.md`, `reference/repo-audit.md`, `reference/examples.md`. References remain implementation surfaces, not new guides. Confirm `doc/configuration.md` routes headings to README; leave release notes deferred. Reject fifth-axis, roast repo access, and whole-batch approval claims.

- [ ] **Step 4: Commit docs.**

  ```bash
  git add README.md
  git commit -m "Document batch ticket repair and sibling audit overrides"
  ```

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Entry and batch" L30 | Comma/whitespace refs, deduplication, singleton uses same pipeline | Task 2, Task 3 |
| § "Entry and batch" L32 | Named-ref context scoped locally; common assertions require local support | Task 2, Task 3 |
| § "Entry and batch" L34 | Continue fetched tickets; all-unfetched preserves abort/create offer | Task 2, Task 3 |
| § "Entry and batch" L36 | Serial snapshots, parent overlap, one audit and payload-local fold-in | Task 1, Task 2, Task 3 |
| § "Entry and batch" L38 | Recovery questions after audits, ref order, one at a time | Task 1, Task 2, Task 3 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L42 | Reference owns recipe, gather reads it in both modes | Task 1, Task 3 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L44-L55 | Fresh foreground file-only scouts, exact controls | Task 1 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L58 | Eight-task chunks, disk authority, no chain or cap change | Task 1, Task 2 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L60 | Checkout identity, no model override, terminal wait, async stop | Task 1, Task 2 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L62-L64 | Complete brief overrides scout output, one-file authorization | Task 1 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L65 | Root docs and routes for main/sibling repos | Task 1 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L66 | Parent-resolved reads/capabilities and unavailable degradation | Task 1 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L70-L75 | Fixed six-label output grammar | Task 1 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L78 | Per-claim, cited fit, sibling, in-motion, read-only scenario semantics | Task 1 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L80 | Non-empty six-label disk probe; ticket-local failure | Task 1 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L86 | Correct contradicted code fact, retain original verbatim | Task 1 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L87 | Preserve reporter observation and surface ambiguity without questioning | Task 1 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L88 | Not-checkable claims do not change prose | Task 1 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L89 | Cited attributed Idea alternative, overflow retained | Task 1 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L90 | Observable AC replaces mechanism; alternative stays out; note retains it | Task 1 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L91 | Resolve sibling name, move stated grounded observable, name repo in Idea | Task 1 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L92 | In-motion changes report only | Task 1 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L93 | Scenario fills setup/action, strips venue/credentials, keeps expected result | Task 1 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L94-L95 | None/unusable alone neither drafts nor blocks | Task 1 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L97 | Body scenario footer under source footers, independent of source gaps | Task 1 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L99 | Audit/uniqueness AC change substantive; quiet byte lock; displaced note retained | Task 1, Task 3 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L101 | Draft-changing findings defeat no-op; quiet reports preserve it | Task 1, Task 3 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L103 | Initial prep complete, sequential gates/writes, statuses, subsets, pre-Title Audit | Task 1, Task 3 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L105 | Untrusted audit, content-only roast, traceable fidelity exemption, artifacts | Task 1, Task 3 |
| § "The audit: `skills/shape-ticket/reference/repo-audit.md` (new)" L107 | Native low-effort fallback is sole reference conditional | Task 1 |
| § "Deterministic gate changes (SKILL.md)" L111 | Per-ticket stop/recovery with no option number; split atomic | Task 3 |
| § "Deterministic gate changes (SKILL.md)" L112 | Existing gate per ticket, approved write before next gate | Task 3 |
| § "Deterministic gate changes (SKILL.md)" L113 | Implied removal/note, independent split, nested/distinct guards, overlap legacy | Task 3 |
| § "Overrides contract" L117 | Named-section sibling paths, single-repo default, public row, no local config | Task 1, Task 3, Task 4 |
| § "Byte budget" L121 | Minimal hooks, extraction, stable slices and bundle exclusions | Task 3 |
| § "Errors and edge cases" L125 | Scout/file failures degrade only that ticket | Task 1, Task 2 |
| § "Errors and edge cases" L126 | Async handle stops without polling/relaunch | Task 1, Task 2 |
| § "Errors and edge cases" L127 | Nine refs dispatch safely; cap error is a bug | Task 1, Task 2 |
| § "Errors and edge cases" L128 | Partial/all fetch failure outcomes preserved | Task 2, Task 3 |
| § "Errors and edge cases" L129 | Missing/unresolved/ungrounded sibling neither groups nor fails | Task 1, Task 2, Task 3 |
| § "Errors and edge cases" L130 | No checkout reports unavailable | Task 1, Task 2, Task 3 |
| § "Errors and edge cases" L131 | Credentials/browser absence is a scenario note, not blocker | Task 1, Task 2, Task 3 |
| § "Errors and edge cases" L132 | Missing search unavailable, not none | Task 1, Task 2, Task 3 |
| § "Errors and edge cases" L133 | Quiet no-op reports audit without a gate | Task 1, Task 2, Task 3 |
| § "Errors and edge cases" L134 | Uncited alternatives kept/clear | Task 1, Task 2, Task 3 |
| § "Errors and edge cases" L135 | Attachments linked by name, never read | Task 1, Task 2, Task 3 |
| § "Errors and edge cases" L136 | Duplicate refs collapse | Task 2, Task 3 |
| § "Errors and edge cases" L137 | Audit adds no human question/gate | Task 1, Task 2, Task 3 |
| § "Tests" L141 | Bundled deterministic suite, size, marketplace, eval lint | Verification |
| § "Tests" L143 | Prepare readable A and exclusions/current intent, seed before behavior, compare A | Task 1, Task 2, Task 3 |
| § "Tests" L145 | Inline tool-free cases, bounded measured words, named moves, legacy invalid guard | Task 2, Task 3 |
| § "Tests" L149 | Exact batch parse/first gate/stop/uniqueness/status facts | Task 2 |
| § "Tests" L150 | Cited repo-fit/AC-only branch, no new questions | Task 2 |
| § "Tests" L151 | Feature body footer/write and defect scenario preserve expected result | Task 2 |
| § "Tests" L152 | Active-PR and empty-file no-op report | Task 2 |
| § "Tests" L153 | Quiet byte lock versus substantive scenario normalization | Task 2 |
| § "Documentation impact" L157 | Workflow/skill/override table describe batch audit; release notes deferred | Task 4 |
| § "Documentation impact" L158 | Per-ticket fixed confirmation, split N bodies one write | Task 4 |
| § "Documentation impact" L160 | References are implementation surfaces; configuration guide unchanged | Task 4 |
| § "Out of scope" L164 | No repair flag, new option, invocation sibling paths | Task 3 |
| § "Out of scope" L165 | No roast repo access or fifth axis | Task 1, Task 3 |
| § "Out of scope" L166 | Refs belong to cwd checkout | Task 1, Task 3 |
| § "Out of scope" L167 | No attachment reads or browser replication | Task 1, Task 3 |
| § "Out of scope" L168 | Split all-or-nothing stop retained | Task 3 |
| § "Out of scope" L169 | No consumer cap change | Task 1, Task 3 |
| § "Out of scope" L170 | No batching of other tracker skills | Task 3 |
