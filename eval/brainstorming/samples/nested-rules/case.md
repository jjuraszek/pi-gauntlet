bundle-: skills/brainstorming/reference/amendment-surface.md
bundle-: skills/brainstorming/reference/ticket-acceptance.md
bundle-: skills/brainstorming/reference/spec-finalization.md
bundle+: skills/brainstorming/reference/legs.md
bundle+: skills/using-git-worktrees/SKILL.md
bundle+: skills/brainstorming/gatherer.md
# Input

Gather rules for repo-a touch pkg-x/src/parser.ts, repo-b touch lib/reader.ts. Repo-a root AGENTS.md links doc/root.md in a table; CLAUDE.md is a symlink to AGENTS.md. pkg-x/AGENTS.md contains bullet [Conventions](doc/conventions.md) and table | details | [Parser](doc/parser.md) |. pkg-x/doc/conventions.md links second-hop.md. pkg-y/AGENTS.md exists but is untouched. pkg-x/CLAUDE.md links ../outside.md; /work/repo-a/outside.md does not exist. Repo-b root AGENTS.md only. Every named first-hop document except outside.md exists; second-hop.md exists. Show scout cwd and Rules lines. Independent run: touched paths not yet known.

Use the supplied synthetic observations as tool results. Narrate the prescribed actions and stops; do not execute tools. Treat independent observations as separate runs.
