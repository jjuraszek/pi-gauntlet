# pi-superpowers

Workflow skills, agent personas, and runtime extensions for the [pi coding agent](https://github.com/mariozechner/pi). Inspired by [obra/superpowers](https://github.com/obra/superpowers) and [coctostan/pi-superpowers-plus](https://github.com/coctostan/pi-superpowers-plus).

## What's inside

| Category | Count | Examples |
|---|---|---|
| Skills | 13 | brainstorming, writing-plans, executing-plans, test-driven-development, requesting-code-review, systematic-debugging |
| Agents | 3 | implementer (strict TDD), code-reviewer (read-only), spec-reviewer (verifies impl vs plan) |
| Extensions | 2 | plan-tracker (todo persistence), verify-before-ship (test-before-commit gate) |

## Requirements

- [pi-coding-agent](https://github.com/mariozechner/pi) ≥ 0.1.0
- [pi-subagents](https://github.com/jjuraszek/pi-subagents) — required peer package. The `requesting-code-review`, `subagent-driven-development`, and `dispatching-parallel-agents` skills call `subagent({})`.

Both must be listed in your `.pi/settings.json#packages` array.

## Install (production)

In your repo (project scope, shareable via the repo's `.pi/settings.json`):

```bash
pi install -l git:github.com/jjuraszek/pi-subagents@<sha-or-tag>
pi install -l git:github.com/jjuraszek/pi-superpowers@v0.1.0
```

Or at user scope (all repos under your pi profile):

```bash
pi install git:github.com/jjuraszek/pi-subagents@<sha-or-tag>
pi install git:github.com/jjuraszek/pi-superpowers@v0.1.0
```

Pi clones the package, runs `npm install --omit=dev`, which triggers `postinstall` → symlinks agents into `~/.agents/`.

## Install (local development)

```bash
git clone git@github.com:jjuraszek/pi-superpowers.git ~/repos/pi-superpowers
cd ~/path/to/your/repo
pi install -l ~/repos/pi-superpowers
# Local-path installs skip npm install; run the symlink step manually:
cd ~/repos/pi-superpowers && npm run link-agents
```

Live edits in `~/repos/pi-superpowers/` are picked up on next pi launch.

## Project-specific overrides

Skills shipped here are generic. To inject project-specific routing tables, verification commands, or service paths without forking, create `.pi/superpowers-overrides.md` in your repo. Skills check for it and merge sections matching the skill's name.

Example `.pi/superpowers-overrides.md`:

```markdown
## brainstorming

Project routing: dashboard work → `dashboard/AGENTS.md`. Standards work → `compliance/AGENTS.md`.

## verification-before-completion

Canonical verification: `make ci` per service. Bare `pytest` does not satisfy the gate.

## using-git-worktrees

Use the project-native `script/worktree create <name>` wrapper. It handles env file copy and isolated DB provisioning.
```

The override file is read by skill instructions at runtime — not by the pi runtime itself. Section headers match skill names.

## Agent personas

Three personas ship in `agents/` and land in `~/.agents/` via postinstall:

- **implementer** — strict RED→GREEN→REFACTOR TDD with completion-guard. Inherits project context.
- **code-reviewer** — read-only review (no edit/write tools). Critical/Moderate/Minor severity scheme.
- **spec-reviewer** — verifies an implementation against its plan/spec. Per-requirement table output.

All three honor pi-subagents' override precedence (`project > user > builtin`). Define `.pi/agents/<name>.md` in your repo to shadow per-project.

## verify-before-ship configuration

Default verification regex matches: `make ci`, `make test`, `npm test`, `pytest`, `rspec`, `cargo test`, `go test`.

Override via `settings.json`:

```json
{
  "piSuperpowers": {
    "verifyBeforeShip": {
      "testCommands": ["make ci", "bundle exec rspec"],
      "warningReference": "doc/testing.md"
    }
  }
}
```

## Upstream

Last inspiration sync — see `AGENTS.md`.

## License

MIT.
