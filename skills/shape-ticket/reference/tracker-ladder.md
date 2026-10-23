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
| read (full, incl. comments) | `gh issue view <n> --json title,body,labels,assignees,milestone,comments` |
| search (bounded overlap) | `gh search issues` / `gh issue list --search` (incl. `state:closed`) |
| read open PRs (bounded in-motion search) | `gh pr list --search "<ref>" --limit 20` |
| create | `gh issue create --title --body [--label]` |
| update | `gh issue edit <n> --title --body [--add-label/--remove-label]` |
| post comment (approved Reporter note/evidence) | `gh issue comment <n> --body ...` |

**Tracker-agnostic contract** required of whatever resolves: read the full ticket incl. comments; write title + body + metadata; post a comment; bounded search (overlap check); tracker-native reference form for links. Field names, states, and taxonomies come from steps 1-2 of the ladder, never hardcoded in this skill. If an approved comment has no resolvable post-comment verb, the body write still proceeds; the comment text is emitted for manual posting and reported as not performed - never silently dropped.

**States:** generalized routing - ready (gates pass), not-ready/triage-equivalent (parked, blocker named). **Zero-config GitHub park fallback:** GitHub Issues have no native not-ready state, and this skill never invents labels - so parking writes no state/label; instead the blocker is recorded in the body (a `Blocked on: <missing value / external input>` line under the ACs), and the run report states the ticket is parked-by-convention. A repo-documented triage/not-ready label or status overrides this. Never auto-assign to an active cycle/sprint unless asked.

