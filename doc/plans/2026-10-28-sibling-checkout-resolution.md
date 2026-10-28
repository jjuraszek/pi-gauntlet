# Sibling checkout resolution Implementation Plan

> **REQUIRED SUB-SKILL:** Use the subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Resolve shape-ticket sibling clone URLs beside the primary checkout, verify stored origin identity, and report unavailable siblings without blocking ticket work.

**Architecture:** Keep the implementation in the existing shape-ticket audit instructions. The parent resolves and classifies siblings, retains report-only outcomes independently of the scout artifact, and gives the scout only verified absolute paths plus lines to copy. Extend the existing tool-free eval target; add no executable resolver or runtime setting.

**Tech Stack:** Markdown skills, Git read commands, Node.js node:test structural checks, existing text-replay eval harness.

**Spec:** `doc/specs/2026-10-28-sibling-checkout-resolution.md`

**Verification:** `npm test` and `node eval/run.mjs shape-ticket --base 5b97a46a7b0ef331e72077362e92eff4a59e1b77` - scripts/ci.mjs bundles style and structural checks; model replay follows eval/README.md and checks Audit: reports.

---

## Files

**Modify - audit implementation:**
- `skills/shape-ticket/reference/repo-audit.md` - resolution, scout brief, outcome folding and quiet reporting.
- `skills/shape-ticket/SKILL.md` - replace only the Project overrides sibling grammar pointer.

**Modify - eval inputs and generated evidence:**
- `eval/shape-ticket/samples/audit-grounding/case.md`
- `eval/shape-ticket/samples/audit-grounding/expected.md`
- `eval/shape-ticket/samples/audit-dispatch/case.md`
- `eval/shape-ticket/samples/audit-dispatch/expected.md`
- `eval/shape-ticket/intent.md`
- `eval/shape-ticket/results/*/baseline.json` - existing generated records refreshed only by the driver when stale.
- `eval/shape-ticket/results/*/candidate.json` - existing generated records refreshed only by the driver when stale.
- `eval/shape-ticket/report.md` - generated report; final target-wide report replaces partial iteration reports.

**Create - eval samples and generated records:**
- `eval/shape-ticket/samples/sibling-primary-anchor/case.md`
- `eval/shape-ticket/samples/sibling-primary-anchor/expected.md`
- `eval/shape-ticket/samples/sibling-not-found-hint/case.md`
- `eval/shape-ticket/samples/sibling-not-found-hint/expected.md`
- `eval/shape-ticket/results/sibling-primary-anchor/baseline.json`
- `eval/shape-ticket/results/sibling-primary-anchor/candidate.json`
- `eval/shape-ticket/results/sibling-not-found-hint/baseline.json`
- `eval/shape-ticket/results/sibling-not-found-hint/candidate.json`

**Modify - documentation:**
- `README.md` - named-section overrides row.
- `CHANGELOG.md` - Unreleased breaking entry.
- `eval/shape-ticket/README.md` - sample inventory and proof limits.

**Already satisfied:** `doc/specs/2026-10-23-shape-ticket-batch-repair-audit.md:3` already has the exact scoped supersession banner. Inspect and retain it; do not add a duplicate banner or rewrite historical requirements.

**Delete:** No whole files. Remove superseded instruction sentences and fixture lines in Task 1.

## Recon and verification boundaries

- `skills/shape-ticket/SKILL.md:61-69` routes Gather into the audit reference; `:298-304` contains the Project overrides hook. Keep frontmatter, dispatch semantics, slices and the standard overrides block intact.
- `skills/shape-ticket/reference/repo-audit.md:3-11` prepares runs; `:36-67` supplies and validates the six-label brief; `:69-89` folds findings; `:125-129` controls quiet no-ops. Edit these owning units, not unrelated obsolete/close behavior.
- `eval/shape-ticket/target.json:1-7` already includes the whole audit reference; `eval/shape-ticket/replay.md:1` disables tools. The existing audit-grounding and audit-dispatch cases already bundle the complete skill and ticket-wording reference. Keep target.json, replay.md, global 1600-word cap and existing bundle exclusions unchanged.
- `eval/lib/lint.test.mjs:84-87` tests every committed target's structure through `lintAll`; `node --test eval/lib/lint.test.mjs` is the file-scoped deterministic command. It is structural evidence, not behavioral evidence. Model replay supplies behavioral red/green evidence.
- `eval/lib/replay.mjs:37-47` exports `assemble`; `:79-85` exports arm readers. `eval/run.mjs:202-205` derives the intent binding with `sha256(assemble(...))`. Use these existing definitions rather than inventing an intent hash.
- `scripts/ci.mjs:464-468,515-552` bundles deterministic tests, instruction-size checks, provider/model lint and eval structural lint; it also scans eval hygiene at `:167-177`. No Markdown formatter or standalone format script is configured. Review compact tables, ASCII and imperative wording manually. The header owns repository-wide verification; task steps run scoped checks only.
- No overrides Happy path or Deployment table exists. This is one concern and one plan; there is no deployment split. No bin/library source changes require regenerated bundles.

## Baseline provenance

Initial provenance on `2a8dd3f8`: `git status --porcelain --untracked-files=all` was empty. Immediately before Task 1's baseline command, the sole entry was `?? doc/plans/2026-10-28-sibling-checkout-resolution.md`, admitted as this plan. No source paths or in-flight paths were admitted. The command exited 0 with 14 tests, 14 pass, 0 fail. Post-run HEAD remained `2a8dd3f8` and status still contained only that plan. No generated artifacts or source contamination occurred. Task 2 is documentation-only. Model comparisons run during implementation/verification, not planning baseline.

## Wave 1 - Audit resolution and replay evidence

### Task 1: Resolve sibling identities and preserve report-only outcomes

**TDD scenario:** Modifying tested instructions - run existing structural checks, add replay facts, observe pre-edit replies, then change the owning instructions and replay.

**Spec:** doc/specs/2026-10-28-sibling-checkout-resolution.md § "Acceptance criteria" L22-L31, § "Grammar" L37-L49, § "Primary checkout anchor" L53-L55, § "Responsibilities" L59-L75, § "Data flow" L79-L79, § "Documented convention, not an enforced scheme" L83-L83, § "Remove" L87-L89, § "Remove" L91-L91, § "Add" L95-L98, § "Add" L102-L102, § "Errors and edge cases" L106-L122, § "Tests" L128-L131, § "Documentation impact" L137-L137, § "Out of scope" L143-L147

**Files:**
- Modify: `skills/shape-ticket/reference/repo-audit.md:3-129`
- Modify: `skills/shape-ticket/SKILL.md:302`
- Modify: `eval/shape-ticket/samples/audit-grounding/case.md`
- Modify: `eval/shape-ticket/samples/audit-grounding/expected.md`
- Modify: `eval/shape-ticket/samples/audit-dispatch/case.md`
- Modify: `eval/shape-ticket/samples/audit-dispatch/expected.md`
- Modify: `eval/shape-ticket/intent.md`
- Modify: `eval/shape-ticket/results/*/baseline.json`
- Modify: `eval/shape-ticket/results/*/candidate.json`
- Modify: `eval/shape-ticket/report.md`
- Create: `eval/shape-ticket/samples/sibling-primary-anchor/case.md`
- Create: `eval/shape-ticket/samples/sibling-primary-anchor/expected.md`
- Create: `eval/shape-ticket/samples/sibling-not-found-hint/case.md`
- Create: `eval/shape-ticket/samples/sibling-not-found-hint/expected.md`
- Create: `eval/shape-ticket/results/sibling-primary-anchor/baseline.json`
- Create: `eval/shape-ticket/results/sibling-primary-anchor/candidate.json`
- Create: `eval/shape-ticket/results/sibling-not-found-hint/baseline.json`
- Create: `eval/shape-ticket/results/sibling-not-found-hint/candidate.json`
- Test: `eval/lib/lint.test.mjs`

**Tests:**
- `node --test eval/lib/lint.test.mjs`
- baseline: 2a8dd3f8 pass
- via: `lintAll`, `skills/shape-ticket/reference/repo-audit.md` Prepare the run / scout brief / Fold findings before Draft; `eval/shape-ticket/samples/sibling-primary-anchor`, `eval/shape-ticket/samples/sibling-not-found-hint`, `audit-grounding`, `audit-dispatch` text replays.

Decision: This is an instruction implementation, not a new JavaScript parser. `eval/shape-ticket/target.json:2-6` selects text replay and the spec's Tests section supplies inline Git facts. Keep the existing six-label artifact and parent/scout split rather than adding a runtime helper, config key or persona.

Decision: Retain audit baseline A `5b97a46a7b0ef331e72077362e92eff4a59e1b77` for model comparisons, as required by `eval/shape-ticket/README.md:14` and the current intent. Planning baseline `2a8dd3f8` refers only to the deterministic task command and is not the eval's historical arm. Follow `eval/README.md` for replay evidence and intent.

- [ ] **Step 1: Establish the existing deterministic result.**

  Run: `node --test eval/lib/lint.test.mjs`

  Expected: every committed target and template pass. Read `/skill:forge-skill` authoring rules before instruction edits; preserve frontmatter and unrelated prose.

- [ ] **Step 2: Add the primary-anchor replay input and facts.**

  Create the two files under `eval/shape-ticket/samples/sibling-primary-anchor`. Use the existing case preamble: tools disabled, inline evidence authoritative, independent checkpoints, entire reply at most 1200 words. Bundle the complete `skills/shape-ticket/SKILL.md`; retain the target's audit reference. Supply the first checkpoint exactly: cwd and `git rev-parse --show-toplevel` are `/repos/pi-gauntlet/.worktrees/x`, `git worktree list --porcelain` begins `worktree /repos/pi-gauntlet`, configured line is `- sibling: git@github.com:acme/viewer.git`, and `/repos/viewer` has stored origin `https://github.com/acme/viewer.git`.

  Add independent checkpoints for `/repos/app` with Git directory `/store/git/app.git`; a submodule `/repos/app/vendor/lib` with Git directory `/repos/app/.git/modules/lib` and first entry `/repos/app/vendor/lib`; and successful worktree-list output with no `worktree` entry. Facts `primary`, `home`, `external-git-dir`, `submodule`, `unresolved` assert `/repos/viewer`, unchanged home `/repos/pi-gauntlet/.worktrees/x`, sibling `/repos/app/vendor/viewer`, and the no-primary report. Use mechanical absence facts for `/repos/pi-gauntlet/.worktrees/viewer`, `/store/viewer`, `/repos/app/.git/modules/viewer`; instruct the replay to emit selected paths only, not repeat rejected paths.

- [ ] **Step 3: Add the unavailable-sibling replay input and facts.**

  Create the two files under `eval/shape-ticket/samples/sibling-not-found-hint`. Supply a conforming repair snapshot and primary `/repos/pi-gauntlet`, with no other draft-changing facts. Configure `git@github.com:acme/viewer.git`, `git@github.com:acme/billing.git`, `git@github.com:acme/docs.git`, `git@github.com:acme/tools.git`, `git@github.com:acme/data.git`. Supply absence at `/repos/viewer`; `/repos/billing` origin `https://github.com/acme/billing-legacy.git`; plain directory `/repos/docs`; checkout without origin `/repos/tools`; and `/repos/data` stored origin `/srv/git/data.git`.

  Facts `hint`, `wrong-repo`, `not-checkout`, `no-origin`, `unparseable-origin`, `quiet`, `empty-audit` assert the five outcomes, no rejected path among scout read inputs, five report lines and no gate. Assert these exact report-body fragments: `/repos/billing is github.com/acme/billing-legacy, expected github.com/acme/billing`, `/repos/docs is not a git checkout`, `/repos/tools has no origin remote`, `/repos/data origin /srv/git/data.git is not a clone url`. The independent empty-file checkpoint must render `audit unavailable (empty file)` with all five lines. Keep the wrong path visible in the report but absent from the list of scout read paths.

- [ ] **Step 4: Migrate the two existing replay cases without losing their guards.**

  In `eval/shape-ticket/samples/audit-grounding/case.md`, remove the path-form `- sibling: ../viewer`, `../missing`, `../billing`, the viewer remote origin sentence and the three `Sibling: ../...` lines. Add a Prepare-the-run checkpoint before the already-returned audit: cwd `/repos/reports/.worktrees/abc-701`, first entry `worktree /repos/reports`, configured `- sibling: git@example.test:team/viewer.git` plus URLs `git@example.test:team/missing.git`, `git@example.test:team/billing.git`; viewer stored origin `https://example.test/team/viewer.git`, billing origin `git@example.test:team/billing.git`, missing absent. The brief receives `/repos/viewer`, `/repos/billing` and the parent's missing line. Replace the supplied audit lines with:

  ```text
  Sibling: /repos/viewer - leg: opening a receipt shows its report ID, src/receipt.ts:9
  Sibling: git@example.test:team/missing.git - not found: expected at /repos/missing; clone with git clone 'git@example.test:team/missing.git' '/repos/missing'
  Sibling: /repos/billing - none
  ```

  Add a `prepare` fact for cross-scheme matching and absolute paths; extend `sibling` to require `team/viewer` from stored origin and a report-only missing line without a group. Preserve claims, reporter ambiguity, scenario, fallback and degradation assertions. In audit-dispatch, replace "No sibling paths" with the legacy configuration `- sibling: ../viewer`, and give the valid audit the same pre-rendered migration line copied by each brief. Add `legacy-brief` and `legacy-unavailable` facts; ABC-601 missing and ABC-602 empty audits must still report the line. Preserve 8+1 foreground calls, controls, file authority and no retry.

- [ ] **Step 5a: Observe the primary-anchor pre-edit replay.**

  Run: `node eval/run.mjs shape-ticket sibling-primary-anchor --base 5b97a46a7b0ef331e72077362e92eff4a59e1b77`

  Inspect saved candidate replies and per-fact results for omitted primary anchoring. A both-arms failure can exit zero as pre-existing; use fact evidence, not exit alone, as red. Keep already-holding facts as guards and do not invent failures.

- [ ] **Step 5b: Observe the unavailable-sibling pre-edit replay.**

  Run: `node eval/run.mjs shape-ticket sibling-not-found-hint --base 5b97a46a7b0ef331e72077362e92eff4a59e1b77`

  Inspect saved replies for absent clone hints or lost parent-retained lines on empty audits; preserve both new samples' generated records.

- [ ] **Step 5c: Observe the grounding pre-edit replay.**

  Run: `node eval/run.mjs shape-ticket audit-grounding --base 5b97a46a7b0ef331e72077362e92eff4a59e1b77`

  Inspect the Prepare checkpoint for cross-scheme matching and absolute read paths, separately from the already-supplied grounded audit.

- [ ] **Step 5d: Observe the legacy-dispatch pre-edit replay.**

  Run: `node eval/run.mjs shape-ticket audit-dispatch --base 5b97a46a7b0ef331e72077362e92eff4a59e1b77`

  Inspect migration lines in briefs and unavailable-audit reports. These commands each write their sample records and a partial report; none is the final target-wide report.

- [ ] **Step 6: Replace preparation's path grammar and define one shared URL parser.**

  Replace the paragraph at `repo-audit.md:11`, and only the grammar pointer at `skills/shape-ticket/SKILL.md:302`. The pointer names `## shape-ticket`, `- sibling: <clone url>` and routes to `repo-audit.md`; absent section remains single-repository auditing. Keep invocation text and configuration writes outside discovery.

  In Prepare the run, define one parser for configured values and stored origins with this contract:

  | Field | Instruction |
  |---|---|
  | Accepted | Accept scheme URLs with `ssh`, `https`, `http`, or `git`, optional userinfo and port, a host and a nonempty path segment; accept scp host:path with optional user. Include the accepted SSH form `ssh://git@host[:port]/owner/name.git`. |
  | Rejected | Emit `not a clone url` for missing host/path, empty value, bare word, local paths including `../viewer` and `/srv/git/viewer.git`, and `file://` paths. |
  | `NAME` | Use last path segment, strip `.git`, preserve URL case. |
  | `IDENTITY` | Remove scheme, userinfo and port; turn `host:path` into `host/path`; strip a trailing `/` and `.git`; lowercase the entire host/path, preserving all subgroup depth such as `gitlab.example/group/sub/name`. |
  | `PATH` | Join the parent of `PRIMARY` with `NAME`. |

  Use one example: `git@github.com:acme/viewer.git` resolves to `viewer`, `github.com/acme/viewer` and `/repos/viewer` for primary `/repos/pi-gauntlet`. Accept equivalent `ssh://git@github.com:7999/acme/viewer.git` and `https://user@github.com/acme/viewer` identities. Reject invalid configured values before checking the checkout.

- [ ] **Step 7: Anchor on the primary and classify each line in order.**

  Derive `PRIMARY` from the first `worktree <path>` entry in `git worktree list --porcelain` from the current directory. Use it only for sibling resolution; the ticket's own repository and scout cwd stay `git rev-parse --show-toplevel`. Do not derive siblings from Git-directory locations. State the linked-worktree, externally located Git directory and submodule rules established by Step 2. Outside a checkout retain `audit unavailable (no repository)`; on successful output with no `worktree` entry emit the unresolved line for each valid URL and keep single-repo auditing.

  Apply the seven-outcome table, stopping at the first match for each line:

  | Order | Classification |
  |---|---|
  | 1 | Configured value does not parse: report not a clone URL. |
  | 2 | Nothing exists at `PATH`: report not found with clone hint. |
  | 3 | A file or directory exists but `git -C <PATH> rev-parse --git-dir` fails: report not a checkout. |
  | 4 | Checkout exists but `git -C <PATH> config --get remote.origin.url` exits nonzero: report no origin. |
  | 5 | Stored origin fails the same parser: report unparseable origin. |
  | 6 | Stored origin `IDENTITY` differs: classify `wrong repo` and report found versus expected identity. |
  | 7 | Identities equal: supply the absolute `PATH` as a found scout read input. |

  Read stored `remote.origin.url`, never `git remote get-url origin`, because `url.<base>.insteadOf` rewrites must not change comparison. Process duplicate lines resolving to one `PATH` independently; add no deduplication, directory scanning, location override, clone/fetch/create operation, credential/network use or path backward compatibility. The multi-repo coordinated flow draft remains untouched.

- [ ] **Step 8: Encode exact report text and safe clone hints.**

  Use these concrete instances to verify the templated outcome table in the instructions. Single-quote both clone arguments; an embedded `'` becomes `'\''`. Render the command only; never execute it or automatically remove a conflicting path.

  | Outcome | Exact example |
  |---|---|
  | Missing | `Sibling: git@github.com:acme/viewer.git - not found: expected at /repos/viewer; clone with git clone 'git@github.com:acme/viewer.git' '/repos/viewer'` |
  | Not checkout | `Sibling: git@github.com:acme/viewer.git - /repos/viewer is not a git checkout, expected github.com/acme/viewer` |
  | No origin | `Sibling: git@github.com:acme/viewer.git - /repos/viewer has no origin remote, expected github.com/acme/viewer` |
  | Unparseable origin | `Sibling: git@github.com:acme/viewer.git - /repos/viewer origin /srv/git/viewer.git is not a clone url, expected github.com/acme/viewer` |
  | Wrong repository | `Sibling: git@github.com:acme/viewer.git - /repos/viewer is github.com/acme/viewer-legacy, expected github.com/acme/viewer` |
  | Invalid configuration | `Sibling: ../viewer - not a clone url; use git@host:owner/name.git or https://host/owner/name.git` |
  | No primary entry | `Sibling: git@github.com:acme/viewer.git - unresolved: no primary checkout found; expected beside it as viewer` |

  Every unavailable line continues as a single-repo audit for that line. The `not a clone url` outcome is the migration notice; add no separate migration workflow. Retain one convention sentence in `repo-audit.md`: siblings sit beside the primary under the repository name, missing siblings are reported with their clone destination and never block, and the configured URL controls the clone hint rather than the teammate's clone scheme.

- [ ] **Step 9: Replace the scout's path-form instructions and retain parent-owned outcomes.**

  Keep each ticket's pre-rendered lines beside its brief under the existing per-ticket temp directory; name the retained text artifact `sibling-lines.md` beside `snapshot.md` and `audit.md`. Pass `{found absolute paths, pre-rendered lines}` in the self-contained brief. Replace the old sentence with: "Read each supplied sibling checkout path, an absolute path, the same way. Copy each supplied `Sibling:` line verbatim."

  Replace the emission instruction with: "Emit one Sibling line per supplied checkout path and one verbatim copy per supplied `Sibling:` line. Ground a leg only in an observable the ticket already states and the sibling can see; use none for no leg. Use Sibling: none when no path and no line are supplied."

  Replace only the template's sibling line with:

  ```text
  Sibling: none | <absolute path> - none | <absolute path> - leg: <observable the ticket already states that this repo can see, cited> | <supplied line, verbatim>
  ```

  Remove its old not-found alternative. Preserve all six labels, `Sibling: none`, file-only output, foreground dispatch and native fallback. A failed classification never authorizes reading that sibling. Use supplied paths for `none` or grounded legs and copy supplied `Sibling:` lines without reinterpretation.

- [ ] **Step 10: Fold outcomes from the correct authority without extra gates.**

  Add a report-only fold row: no draft effect, render `sibling:` plus the body after `Sibling:`. Read these lines from the parent's retained list, never from `audit.md`; do not duplicate the scout's copies. Update the unusable-audit row to render retained lines alongside `audit unavailable (<reason>)` for missing, empty or malformed files. Add report-only siblings to the quiet-findings list: no roast, gate, write, question or blocking status on their own; show them in the no-op report or an already-opening confirmation gate's `Audit:` block.

  For grounded legs, use the parent's absolute `PATH`, read the same stored origin through the shared parser, and derive `owner/name` from its last two path segments. Preserve the existing rule that unresolved tracker names or unstated observables leave ACs unchanged and produce no empty groups. Viewer configured as `git@example.test:team/viewer.git` and cloned as `https://example.test/team/viewer.git` must group under `team/viewer`. The data flow is overrides -> parent found paths/retained lines -> scout artifact -> grounded legs from artifact/report-only lines from parent -> one sibling report per configured line. A found path with no leg reports its supplied absolute path and `none`, without a draft effect.

  Decision: Preserve `Sibling: <absolute path> - none` as the scout's ungrounded-found outcome and do not invent a cited grounded leg. The existing template and fold table at `repo-audit.md:62,81` and the spec's Data flow section own that distinction and per-line reporting; report-only classification does not rewrite ACs.

- [ ] **Step 11: Update intent binding.**

  Update `eval/shape-ticket/intent.md` with this change and the actual observed movement of the new facts; retain existing accepted moves. Compute the current bundle-free `for:` value with:

  ```sh
  node --input-type=module -e 'import {readFileSync} from "node:fs"; import {assemble,treeReader} from "./eval/lib/replay.mjs"; import {sha256} from "./eval/lib/checks.mjs"; const t=JSON.parse(readFileSync("eval/shape-ticket/target.json","utf8")); console.log(sha256(assemble(t,treeReader(process.cwd()))));'
  ```

  Coordinate the derived docs with Task 2: `doc/specs/2026-10-23-shape-ticket-batch-repair-audit.md` already has the scoped `### Overrides contract`/`Sibling:` supersession banner; `eval/shape-ticket/README.md` receives the new coverage inventory there.

- [ ] **Step 12a: Confirm primary-anchor behavior.**

  Run: `node eval/run.mjs shape-ticket sibling-primary-anchor --base 5b97a46a7b0ef331e72077362e92eff4a59e1b77`

  Expected: primary/home/external-Git-dir/submodule/unresolved facts hold and the forbidden sibling paths are absent.

- [ ] **Step 12b: Confirm nonblocking unavailable-sibling behavior.**

  Run: `node eval/run.mjs shape-ticket sibling-not-found-hint --base 5b97a46a7b0ef331e72077362e92eff4a59e1b77`

  Expected: all five reports survive the empty audit, rejected paths are absent from scout read inputs, and no gate opens.

- [ ] **Step 12c: Confirm cross-scheme grounding.**

  Run: `node eval/run.mjs shape-ticket audit-grounding --base 5b97a46a7b0ef331e72077362e92eff4a59e1b77`

  Expected: Prepare finds viewer and billing, viewer groups under team/viewer, and all unchanged claims/scenario/fallback guards hold.

- [ ] **Step 12d: Confirm legacy migration and dispatch isolation.**

  Run: `node eval/run.mjs shape-ticket audit-dispatch --base 5b97a46a7b0ef331e72077362e92eff4a59e1b77`

  Expected: briefs and unavailable-audit reports carry the migration line; 8+1 foreground dispatch and file-authority facts still hold. Review saved replies as well as judgments and word counts. Batch instruction fixes before another replay and never widen intent to bless unrelated regressions. Reserve the full target run for header verification; it regenerates `eval/shape-ticket/report.md` and stale `results` records before finish.

- [ ] **Step 13: Format and lint the touched instruction and eval files.**

  Run: `node --test eval/lib/lint.test.mjs`

  Run the scoped target lint using the actual exported API:

  ```sh
  node --input-type=module -e 'import {lintTarget} from "./eval/lib/lint.mjs"; const e=lintTarget("eval/shape-ticket"); console.log(e); process.exitCode=e.length?1:0;'
  ```

  Expected: tests pass and lint prints `[]`. Check changed Markdown for ASCII, compact tables and imperative voice. No configured formatter exists. Run `wc -l skills/shape-ticket/SKILL.md skills/shape-ticket/reference/repo-audit.md`; keep each under the forge-skill 500-line extraction trigger and CI's 50,000-byte/2,000-line limit. Keep all new rules in the existing reference and the skill pointer minimal.

- [ ] **Step 14: Commit the behavior and its local evidence.**

  ```sh
  git add skills/shape-ticket/SKILL.md skills/shape-ticket/reference/repo-audit.md eval/shape-ticket/samples/audit-grounding eval/shape-ticket/samples/audit-dispatch eval/shape-ticket/samples/sibling-primary-anchor eval/shape-ticket/samples/sibling-not-found-hint eval/shape-ticket/intent.md eval/shape-ticket/results eval/shape-ticket/report.md
  git commit -m "Resolve sibling clone URLs beside the primary checkout" -m "Behavior change: parent-owned identity checks and nonblocking sibling reports; add and extend shape-ticket text replays."
  ```

## Wave 2 - Publish the overrides contract

Depends on Wave 1: documentation describes the implemented resolver and the new replay coverage. One documentation task owns the shared README and CHANGELOG; there is no parallel file or runtime contention.

### Task 2: Document clone-URL configuration and its breaking migration

**TDD scenario:** Documentation-only change - inspect the implementation and existing supersession record.

**Spec:** doc/specs/2026-10-28-sibling-checkout-resolution.md § "Documented convention, not an enforced scheme" L83-L83, § "Remove" L90-L90, § "Add" L99-L101, § "Documentation impact" L135-L139

**Files:**
- Modify: `README.md:334`
- Modify: `CHANGELOG.md:1-5`
- Modify: `eval/shape-ticket/README.md:1-32`

**Tests:**
- none: documentation; repository-wide documentation and eval checks are in the verification header

Decision: Do not add the predecessor banner again. `doc/specs/2026-10-23-shape-ticket-batch-repair-audit.md:3` already names this spec and limits supersession to `### Overrides contract` sibling grammar and the `Sibling:` not-found line in Errors and edge cases.

- [ ] **Step 1: Replace the README overrides row in place.**

  Change `README.md`'s `## shape-ticket` row to `- sibling: <clone url>`, preserving reader shape-ticket, default `single-repo audit` and extends classification. Include one convention sentence: siblings are expected beside the primary checkout under the repository name; a missing one is reported with its clone path and never blocks; the configured URL supplies the clone hint, while either clone scheme matches identity. Link the detailed grammar to `skills/shape-ticket/reference/repo-audit.md`. Remove the relative-path grammar rather than documenting it as supported.

- [ ] **Step 2: Record the breaking migration.**

  Add `## Unreleased` with a Changed entry in `CHANGELOG.md`, marked Breaking. State that `## shape-ticket` sibling lines accept clone URLs, the path form is no longer accepted and renders `not a clone url`, and missing/wrong siblings are report-only. Do not bump a version or change release machinery.

- [ ] **Step 3: Update the eval inventory and verify derived documentation.**

  Amend `eval/shape-ticket/README.md` to list sibling-primary-anchor and sibling-not-found-hint, plus audit-grounding's Prepare checkpoint and audit-dispatch's legacy failure-artifact coverage. State that these are tool-free supplied-Git-fact replays, not live cloning or Git integration tests. Preserve baseline A, unchanged slices/cap, independent historical replay documentation and existing unrelated sample rows. `eval/shape-ticket/intent.md` is task-local and already updated by Task 1; do not rewrite it here.

  Inspect and retain the scoped supersession banner in `doc/specs/2026-10-23-shape-ticket-batch-repair-audit.md`. Add no new feature guide, configuration row or `.pi/gauntlet-overrides.md` sibling entry. `doc/configuration.md` covers `piGauntlet.*`; README remains the overrides front door.

- [ ] **Step 4: Check documentation and commit.**

  Confirm the touched row's links resolve, its command/grammar matches `repo-audit.md`, all tables have compact separators, and the existing predecessor banner covers only the specified contract. There is no Markdown format command. The header verification checks README structure, CHANGELOG heading/version rules and eval structure and produces the final target-wide evidence; commit any regenerated verification evidence before finish.

  ```sh
  git add README.md CHANGELOG.md eval/shape-ticket/README.md
  git commit -m "Document clone-URL sibling configuration and migration"
  ```

## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Acceptance criteria" L22-L31 | A linked-worktree audit reads the sibling beside the primary, never beside the worktree | Task 1 |
| § "Acceptance criteria" L22-L31 | Missing sibling yields URL, expected path and clone command on the no-op or already-open gate report | Task 1 |
| § "Acceptance criteria" L22-L31 | Wrong identity is not read and reports found versus expected identity | Task 1 |
| § "Acceptance criteria" L22-L31 | SSH-configured and HTTPS-cloned identities match | Task 1 |
| § "Acceptance criteria" L22-L31 | Legacy relative paths report invalid clone URL and accepted forms without stopping | Task 1 |
| § "Grammar" L37-L49 | Accept the listed scheme/scp shapes with host and path; reject local/empty forms | Task 1 |
| § "Grammar" L37-L49 | Derive case-preserving name from the last segment | Task 1 |
| § "Grammar" L37-L49 | Normalize full-depth identity by removing scheme/userinfo/port/trailing suffix and lowercasing | Task 1 |
| § "Grammar" L37-L49 | Resolve sibling location from primary parent | Task 1 |
| § "Grammar" L37-L49 | Compare stored origin through the same parser without rewrite expansion | Task 1 |
| § "Primary checkout anchor" L53-L55 | First worktree entry owns sibling anchoring while home repo stays current checkout | Task 1 |
| § "Primary checkout anchor" L53-L55 | External Git directory and submodule layouts never anchor on Git metadata directories | Task 1 |
| § "Primary checkout anchor" L53-L55 | Outside-checkout behavior is unchanged; successful empty worktree list reports unresolved without stopping | Task 1 |
| § "Responsibilities" L59-L75 | Parent resolves and classifies; first of seven ordered outcomes wins per configured line | Task 1 |
| § "Responsibilities" L59-L75 | Duplicate destinations are checked separately with separate outcomes | Task 1 |
| § "Responsibilities" L59-L75 | Retain pre-rendered outcomes per ticket independently of the scout artifact | Task 1 |
| § "Responsibilities" L59-L75 | Pass only found absolute paths for reads; copy supplied lines and preserve six labels/empty sentinel | Task 1 |
| § "Responsibilities" L59-L75 | Report-only folding uses parent authority even for unusable audits | Task 1 |
| § "Responsibilities" L59-L75 | Report-only lines never draft, roast, gate, write or question on their own | Task 1 |
| § "Responsibilities" L59-L75 | Grounded-leg repository names come from the same parsed stored origin's final two segments | Task 1 |
| § "Data flow" L79-L79 | Separate artifact-owned grounded legs from parent-owned report lines, visible per configured URL | Task 1 |
| § "Documented convention, not an enforced scheme" L83-L83 | Reference and README state adjacent checkout convention, nonblocking hints and clone-scheme independence | Task 1, Task 2 |
| § "Remove" L87-L89 | Remove skill's relative-path grammar sentence | Task 1 |
| § "Remove" L87-L89 | Replace preparation's relative-path grammar paragraph | Task 1 |
| § "Remove" L87-L89 | Remove all three path-form scout instructions | Task 1 |
| § "Remove" L90-L90 | Replace README's existing shape-ticket overrides row | Task 2 |
| § "Remove" L91-L91 | Remove old grounding fixture paths, origin sentence and relative sibling outputs | Task 1 |
| § "Add" L95-L98 | Add parser, primary anchor, ordered outcomes and parent retention to preparation | Task 1 |
| § "Add" L95-L98 | Replace scout sentences and sibling template | Task 1 |
| § "Add" L95-L98 | Add report-only fold, quiet/unusable reporting and absolute-path grounded fold | Task 1 |
| § "Add" L95-L98 | Add clone-URL skill pointer to the reference owner | Task 1 |
| § "Add" L99-L101 | Publish URL row and convention with single-repo default | Task 2 |
| § "Add" L99-L101 | Retain already-present scoped predecessor supersession | Task 2 |
| § "Add" L99-L101 | Add breaking Unreleased entry | Task 2 |
| § "Add" L102-L102 | Extend grounding/dispatch cases, create two specified samples and update eval intent | Task 1 |
| § "Errors and edge cases" L106-L122 | Continue auditing per unavailable sibling and shell-quote URL/destination with embedded-quote escaping | Task 1 |
| § "Errors and edge cases" L106-L122 | Missing checkout renders exact expected-path clone hint | Task 1 |
| § "Errors and edge cases" L106-L122 | Existing file/plain directory renders not-checkout outcome | Task 1 |
| § "Errors and edge cases" L106-L122 | Checkout without origin renders no-origin outcome | Task 1 |
| § "Errors and edge cases" L106-L122 | Unparseable stored origin renders the raw origin and expected identity | Task 1 |
| § "Errors and edge cases" L106-L122 | Wrong identity renders found versus expected identity | Task 1 |
| § "Errors and edge cases" L106-L122 | Invalid configured URL renders accepted forms; this is the sole migration message | Task 1 |
| § "Errors and edge cases" L106-L122 | Missing primary entry reports unresolved; outside-checkout behavior remains unchanged | Task 1 |
| § "Errors and edge cases" L106-L122 | Cross-scheme forms compare equal and stored-origin comparison ignores rewrite effects | Task 1 |
| § "Errors and edge cases" L106-L122 | Missing/empty/malformed audit retains every parent sibling report | Task 1 |
| § "Tests" L126-L126 | Structural checks and tool-free model replay run under the documented eval process | Verification |
| § "Tests" L128-L131 | Primary replay covers linked worktree, external Git directory, submodule and unresolved checkpoints | Task 1 |
| § "Tests" L128-L131 | Five unavailable reports survive empty audits without gates or rejected-path reads | Task 1 |
| § "Tests" L128-L131 | Grounding replay covers cross-scheme preparation, grouped viewer and report-only missing sibling | Task 1 |
| § "Tests" L128-L131 | Legacy dispatch replay preserves migration lines beside failed audit reports | Task 1 |
| § "Tests" L132-L132 | README, CHANGELOG and eval structural checks run through the repository entrypoint | Verification |
| § "Documentation impact" L137-L137 | Update invalidated eval intent alongside behavior and recognize predecessor/eval-guide handoff | Task 1 |
| § "Documentation impact" L135-L139 | Amend existing README/CHANGELOG/eval guide and preserve supersession | Task 2 |
| § "Documentation impact" L135-L139 | Create no new feature guide or configuration setting row | Task 2 |
| § "Out of scope" L143-L147 | No cloning, fetching, creating checkouts or network/credential use | Task 1 |
| § "Out of scope" L143-L147 | No location override | Task 1 |
| § "Out of scope" L143-L147 | No parent-directory sibling discovery scan | Task 1 |
| § "Out of scope" L143-L147 | Leave the coordinated-flow draft unchanged | Task 1 |
| § "Out of scope" L143-L147 | No backward compatibility for relative-path form | Task 1 |
