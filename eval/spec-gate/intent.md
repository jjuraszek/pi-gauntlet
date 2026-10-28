for: 53d67e759ed2fec897cfcc838bcb330f2efaedf6d33d5825db35bf620239ff25

## Change
Render every drafted acceptance row and disposition verbatim under Drafted acceptance criteria (approval ratifies): after Scope cuts: and before Council:, with five options. Ticket-row gates omit this block. The paired sample preserves verbatim briefing and audit counts and narrates reply-1 continuation; text replay proves supplied-observation rendering, not live gate execution.

The Wave 1 edit to skills/brainstorming/reference/spec-finalization.md adds a Scope cuts line between the committed-to line and the Council line. Build it from deferred, deviates, and venue acceptance-criteria rows, excluding in-scope and elsewhere rows; render none when no cuts exist.

Add option-6-handoff narrated publication coverage using sample-local spec-pr and finishing instructions. Both arms use accepted Wave 1 commit `43b5ec3f2933c5a716c49916e9b1b7c002bb3da2` via `--base HEAD`; this is setup-only evidence, not a before/after improvement claim. Every new candidate fact must hold, even if an aggregate verdict is unchanged. Existing scenarios retain their fact IDs and authorized directions, with three fact rewordings for row 6 (fixture sizing and stale menu counts, not a behavior change): full-council/f4 now asserts exactly six rows 1-6 (was three rows 1-3), worker-path/f3 asserts exactly five rows 1, 2, 4, 5, 6 with no row 3 (was exactly two rows), and row-3-reply/f2 asserts the re-presented gate carries exactly six rows 1-6 (was three rows). Each still rejects a missing or extra menu row. The gate's row count is a function of the spec's `## Acceptance criteria` rows (zero rows render 1, 2, 3, 6; any row adds 4/5), and those three `case.md` files never supplied that section, so the absent observation was unknown, not zero, and the old three-row and two-row facts were never proof of a zero-row gate. Each of the three cases now carries one explicit `## Spec acceptance criteria` section between `## Spec commit` and `## User reply`: a single verbatim ticket row (`Repeated collection requests return the original receipt.`, in-scope, ticket provenance), so rows exist, 4/5 render, the drafted block is omitted, and the briefing, critique return, audit counts, and reply stay untouched. option-6-handoff keeps its zero-row gate, with the not-fetched body spelled out as `none - ticket not fetched (tracker unreachable)` so the render carries a concrete reason instead of the `<reason>` template token. row-3-reply's supplied briefing is shortened to fit two verbatim renders, the audit, and two six-row menus under the word cap; its headings, actors, and the second render plus audit requirements are unchanged. Task 1's original-base deterministic red/green proof establishes the instruction change; these no-tool replays establish narrated ordering, not live git/GitHub/tracker behavior.

Preserve the approval gate and recorded design state when finalization materializes coordinated members.

## Expected to move
- scope-cuts-listed/f1: fails -> holds - The gate includes the new Scope cuts line.
- scope-cuts-listed/f2: fails -> holds - Only deferred and venue rows appear as cuts.
- scope-cuts-listed/f3: fails -> holds - Scope cuts appears before Council and after the commit line.
- scope-cuts-none/f1: fails -> holds - A spec containing only in-scope rows renders Scope cuts: none.
- drafted-rows-block/drafted: fails -> holds - Preserve the drafted-row provenance and approval contract while retaining ticket and not-fetched behavior.
- drafted-rows-block/ticket: fails -> holds - Preserve the drafted-row provenance and approval contract while retaining ticket and not-fetched behavior.
- drafted-rows-block/menu: fails -> holds - Preserve the drafted-row provenance and approval contract while retaining ticket and not-fetched behavior.
- drafted-rows-block/briefing: fails -> holds - Preserve the drafted-row provenance and approval contract while retaining ticket and not-fetched behavior.
