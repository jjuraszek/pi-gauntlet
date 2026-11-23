# Coordinated resume and handoff (gauntlet-resume + gauntlet-handoff supplementary)

Read in full only for a brief that carries a `legs:` block (resume, before entry check 3) or a run with more than one member (handoff, at the append step). Leg grammar lives only here.

## Entry checks

Apply these beside SKILL.md entry checks, before any tracker write:

- **Check 3.** For member-primary entry, also print `home is <repo>; restart there`, naming the run home.
- **Check 3b. Coordinated admission.** After check 3, apply `## Coordinated admission`: resolve the home spec without inferring approval, compare ordered membership, validate each declared primary/common directory, shared branch and full home tuple, and live-validate receipts before admitting any missing tree. Preserve check 3's home binding.
- **Check 4.** Apply `## Coordinated admission`'s drift notice per leg.

## Coordinated brief grammar

For more than one member only, append this block after the optional PR pairs and before the terminal gate-history line. Emit entries in the home spec's `### Leg:` order, home first. Keep the six core headings and `## Repo state` fields unchanged and bound to the run home. Distinguish PR home (the leading PR pair) from run home (the first member); do not infer one from the other.

```text
legs:
  - repo: repo-a
    worktree: <absolute home worktree>
    branch: <shared branch>
    HEAD: <full sha>
    dirty: clean
  - repo: repo-b
    worktree: missing
    branch: <shared branch>
    HEAD: <last recorded full sha or unavailable>
    dirty: unavailable
    receipt: <absolute home-owned receipt path>
Gate history not restored - re-validate before advancing.
```

Keep fields in this order. Use the portable repo identifier from `../../gauntlet/legs.md`. Record the absolute worktree path or the literal `missing` when absent; record live HEAD and porcelain dirt (`clean` when empty), or last recorded HEAD and `unavailable` dirt for a missing tree. Include the optional receipt path only when a delivery receipt exists; transport is not proof. For a live tree without a receipt omit that field. Single-member briefs carry no coordinated block, leg file, receipt, `--leg` or companion loop.

## Coordinated admission

Run resume entry check 3 against the run home unchanged. Resolve the home spec through `reconstruction.md` "Candidates", retaining human approval/confirmation requirements; artifact presence supplies no approval. Before any tracker write, compare ordered brief membership with the home spec's `### Leg:` blocks exactly; name the missing, extra or reordered leg and both lists on mismatch. Use `../../gauntlet/legs.md` for membership, companion-file and scope grammar; keep no duplicate grammar here.

For each companion, parse the home overrides' selected sibling clone URL with shape-ticket's shared parser and use `<home PRIMARY parent>/<NAME>` as its declared primary. Canonicalize that primary's git common directory. For a brief's `worktree: missing`, apply [Locate a leg tree](../../gauntlet/legs.md#locate-a-leg-tree) using the declared primary and recorded branch. Use a found tree as the companion worktree for the remaining admission checks. On lookup failure, report that rule's repo, branch and reason; state that an empty lookup authorizes no recreation, receipt or approval, retaining live receipt admission below for a missing delivered tree. Keep an explicit brief `worktree:` path as recorded and validate it without replacing it from the lookup. Require the companion worktree's canonical git common directory to equal the declared primary's, its live branch to equal the shared branch, and its leg file's full `**Home:**` tuple to equal the run home's repo, shared branch and repo-relative spec path. Stop naming the offending leg and expected/observed path, branch or full tuple. A live tree's branch or tuple mismatch is not informational drift.

Admit a missing companion tree only after live receipt validation under `../../gauntlet/ship/legs.md`. A copied receipt alone proves nothing. Announce per-leg HEAD and dirty drift against live trees without stopping; identify each leg. Keep approval, standing-grant validation, arming order and task snapshots unchanged. Dispatch task `Leg:` work in that leg's checkout, not the home by default.

For a ship-stage retry with a correctly stripped plan, require every companion receipt to validate live before admitting the missing plan. Restore through the legal brainstorm start/skip, plan start/skip and implement skip sequence to verify, without inventing a plan_check stamp or conformance evidence. Re-validate unlanded home using recorded contracts and original scoped ACs; for a ledger subject, recover gate pairs from the committed pre-strip ledger per [finish verification-set.md](../../gauntlet/ship/verification-set.md#post-strip-recovery), not the spec's full verification contract. Then run fresh home conformance and finish; use the finishing reference's retry route. Preserve receipts on seal or home delivery failure; do not repair or replace a correctly stripped plan. An absent plan without this fully validated ship retry remains a stop.
