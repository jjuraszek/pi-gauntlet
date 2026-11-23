bundle-: skills/gauntlet/implement/waves/wave-reviewer-prompt.md
bundle-: skills/gauntlet/implement/happy-path-run.md
bundle-: skills/gauntlet/implement/waves/implementer-prompt.md
bundle-: skills/gauntlet/requesting-review.md
bundle-: skills/gauntlet/wave-reviewer.md
bundle-: agents/wave-reviewer.md

The worktree is /workspace/app on branch profile-cache. You hold the manifest, spec H1 `Cache profile lookups`, and bound ticket #241 from planning. The `.pi/gauntlet.md` `# shared` `## issue-tracker` convention is `refs: #N in commit bodies as Refs #N`. The plan and spec are doc/plans/cache.md and doc/specs/cache.md. Before the first wave their scoped status is nonempty, while unrelated src/config.mjs is staged. The path-scoped add and commit succeed.

Later, an isolated wave has integrated successfully. Its manifest task headings are `Cache profile lookups` and `Invalidate stale profile cache`; all scoped tests are green and the latest wave-reviewer verdict is SHIP. WAVE_BASE_SHA is aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, and both tasks are in_progress. You already hold all needed inputs; no source lookup or review dispatch is needed.

Show only the initial committed-originals commands and the later wave commit commands, including the actual subject and any body on stdin for each commit and the tracker updates after the wave commit. Preserve the phase's parent source-read boundary and scoped entry commit. Do not use tools or invent new observations.
