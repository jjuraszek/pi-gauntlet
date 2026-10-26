## Tracker abstraction and capability ladder

One resolution ladder, applied to every capability (tracker, browser/screenshot, DB, asset hosting; `<repo root>` = `git rev-parse --show-toplevel`, or the current directory outside a repo):

0. **Overrides `tracker:` key** - if the overrides `## Issue tracker` section has a `tracker:` key (case-insensitive), that tracker is exclusive: no probing for others, no ask, others never mentioned. `none` -> skip tracker steps entirely; run the full authoring pipeline and emit the finished title/body/metadata for manual filing (the existing no-verb degradation), reported as not filed. Unknown value -> exclusive; use free-form command mappings in the same `## Issue tracker` section if present, else say so and ask - never silently fall back to detection. Unparseable `tracker:` line -> ask, never probe. Selected tracker unavailable (e.g. `tracker: linear` but no matching backend) -> stop after authoring; emit for manual filing; report the unavailable backend - no fall-through, no ask about other trackers.
1. **Project override / invoking wrapper** - a `## Issue tracker` (and optional `## Capabilities`) section in the gauntlet overrides file, or a wrapping prompt naming tools, commands, env hosts.
2. **Repo documentation** - `AGENTS.md` / README conventions naming the tracker, taxonomy docs, comms style, capture tooling. Expect root plus possibly nested `AGENTS.md`; follow pointers.
3. **Capability detection** - `gh` (repo origin is GitHub) and `linearis` (binary on PATH + shell auth, verified by a cheap read call) work out of the box. Both live -> prefer the ref style the repo's docs/commits actually use (`ABC-123` -> linearis; `#N` / GitHub links -> gh); still ambiguous -> ask once.
   Tracker resolves to Linear -> load `/skill:linear` before the first `linearis` call; all verbs, flags, and failure modes live there.
4. **Ask the user.** Never guess, never fabricate access.

Auth failure at detection time makes that rung dead; continue down the ladder (ultimately: ask).

**Default verb table** (zero-config command shape; overrides replace it):

| Verb | `gh` |
|---|---|
| read (full, incl. comments) | `gh issue view <n> --json title,body,labels,assignees,milestone,comments,state` |
| search (bounded overlap) | `gh search issues` / `gh issue list --search` (incl. `state:closed`) |
| read open PRs (bounded in-motion search) | `gh pr list --search "<ref>" --limit 20` |
| read linked PR state and diff (parent) | `gh pr view <n> --json state,mergedAt` then `gh pr diff <n>` |
| close (approved evidence, no body write) | `gh issue close <n> --reason "<reason>" [--duplicate-of <ref>] --comment "<evidence>"` |
| create | `gh issue create --title --body [--label]` |
| update | `gh issue edit <n> --title --body [--add-label/--remove-label]` |
| post comment (approved Reporter note/evidence) | `gh issue comment <n> --body ...` |

**Tracker-agnostic contract** required of whatever resolves: read the full ticket incl. comments; write title + body + metadata; post a comment; bounded search (overlap check); tracker-native reference form for links. Field names, states, and taxonomies come from steps 1-2 of the ladder, never hardcoded in this skill except the zero-config close state names below, which overrides replace. If an approved comment has no resolvable post-comment verb, the body write still proceeds; the comment text is emitted for manual posting and reported as not performed - never silently dropped.

**Close resolution:** Resolve capabilities before rendering executable ID-bearing operations. Map delivered to GitHub `completed` / Linear `Done`; superseded, premise contradicted, and not reproduced to `not planned` / `Canceled`; duplicate to `duplicate` / `Duplicate` only for a tracker-native target (GitHub number or URL, Linear `ABC-123`). For a nonnative duplicate target, use `not planned` / `Canceled` and retain the reference in evidence. Include `--duplicate-of <ref>` only for the native duplicate mapping.

For Linear, resolve reads through `/skill:linear`, including linked ticket bodies and state plus workflow type; read linked PR state and diff through its host. Execute close as `linearis issues discuss <id> --body "<evidence>"` then `linearis issues update <id> --status <Done|Canceled|Duplicate> [--duplicate-of <ref>]`. Treat GitHub `CLOSED` and Linear workflow types `completed` or `canceled` as terminal.

Apply `- close: <command>` under `## Issue tracker` as a replacement for the whole close sequence, like read/update overrides. Apply section prose too: a forbidden mapped state renders `Close as <reason> - run by hand: <operations>`; selecting it runs nothing and retains its recommendation. Never let ordinary status prose such as "announced, not gated" waive the close gate.

**States:** generalized routing - ready (gates pass), not-ready/triage-equivalent (parked, blocker named). **Zero-config GitHub park fallback:** GitHub Issues have no native not-ready state, and this skill never invents labels - so parking writes no state/label; instead the blocker is recorded in the body (a `Blocked on: <missing value / external input>` line under the ACs), and the run report states the ticket is parked-by-convention. A repo-documented triage/not-ready label or status overrides this. Never auto-assign to an active cycle/sprint unless asked.

