for: 3060385552f5417c4ea49a6b837844f28775e5651e008135387b8f911fe7a597

## Change
The skill reads the overrides file's `## using-git-worktrees` section before any native-tool or wrapper discovery. With at least one of `home:`, `create:`, `destroy:` present it runs `create:` (tokens single-quoted, unresolved tokens asked once) or the built-in add at `home:`, checks `git worktree list` afterward, and reports that path; with no section or a keyless section it follows the legacy ladder unchanged.

## Expected to move
- create-with-literal-token/c1: fails -> holds - the baseline guesses a wrapper or runs git worktree add; the keyed contract runs the configured command.
- create-with-literal-token/c2: fails -> holds - the literal-token rule is new.
- create-with-literal-token/c3: fails -> holds - the post-create check is new.
- home-only-sibling/h1: fails -> holds - the baseline creates under .worktrees/; home: relocates it.
- home-only-sibling/h2: fails -> holds - the baseline gitignores .worktrees/ unconditionally.
- home-only-sibling/h3: fails -> holds - the reported path follows home:.
- branch-with-metacharacters/m1: fails -> holds - the quoting rule is new.
- branch-with-metacharacters/m2: fails -> holds - the quoting rule is new.
