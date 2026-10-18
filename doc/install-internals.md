# Install internals

Deep reference for how `pi install` places pi-gauntlet's personas on disk. See the [README](../README.md) for the standard install commands.

pi-gauntlet requires Node >=24.15.0. This floor provides the release-candidate `node:sqlite` API used by the [spec search index](../README.md#spec-search-index).

## Symlink vs copy

Pin an exact release with `npm:pi-gauntlet@X.Y.Z`. Pi clones the package, runs `npm install --omit=dev`, which triggers the `postinstall` script. Where personas land depends on the install location:

- **User install** (package under `<home>/.pi/<profile>/...`): symlinks the eight agent files into `getAgentDir()/agents` - i.e. `$PI_CODING_AGENT_DIR/agents`, defaulting to `~/.pi/agent/agents`. This is pi-cohort's profile-scoped user dir, so each pi profile (`agent`, `agent.anthropic`, ...) gets its own personas instead of sharing the machine-global `~/.agents/`. Earlier releases installed into the machine-global `~/.agents/`; on upgrade the postinstall removes stale `~/.agents/<name>.md` symlinks that point into a pi-gauntlet package (which would otherwise shadow the profile-scoped copy) and leaves your own files there alone.
- **Project install** (package under `<repo>/.pi/...`): copies the eight agent files into `<repo>/.pi/agents/` (the project-scope discovery path). Copy, not symlink, so the files stay valid if you commit them; gitignore `.pi/agents/` if you'd rather keep them install-managed. Project scope wins over user scope on name collisions, so each repo's personas are independent of the user dir and of other repos.

## Local development install

```bash
git clone git@github.com:jjuraszek/pi-gauntlet.git ~/repos/pi-gauntlet
cd ~/repos/pi-gauntlet && npm install      # installs the yaml dependency and links the agents
cd ~/path/to/your/repo
pi install -l ~/repos/pi-gauntlet
```

Local-path `pi install -l` does not run `npm install` in the checkout, so run it by hand. Its `postinstall` also performs the agent link, so `npm run link-agents` is only needed after pulling agent changes without reinstalling.

After that, edits in `~/repos/pi-gauntlet/` are picked up on next pi launch.

## Spec search cache

The spec search index creates a per-worktree cache at `.pi/gauntlet/index.sqlite` and refreshes it on every query. On first creation it adds `/.pi/gauntlet/index.sqlite*` to Git's `info/exclude`, which also excludes SQLite journal, WAL, and shared-memory sidecars without changing the repository's `.gitignore`.

## Upgrading from v3.x

v4.0.0 was the first public release and was a **breaking rename** (no behavior change). If you ran the package under its old identity:

- Reinstall under the new name: `pi install -l npm:pi-gauntlet` (was `@jjuraszek/pi-superpowers`).
- Rename settings namespace `piSuperpowers.*` -> `piGauntlet.*` in every preset's `settings.json` (a preset still on the old key silently gets defaults).
- Rename your override file `.pi/superpowers-overrides.md` -> `.pi/gauntlet-overrides.md`.
- Rename the env override `PI_SUPERPOWERS_AGENT_DIR` -> `PI_GAUNTLET_AGENT_DIR` if you set it.

See [CHANGELOG.md](../CHANGELOG.md) for the full v4.0.0 entry.

## Versioning

Bump explicitly:

```bash
pi install -l npm:pi-gauntlet@X.Y.Z
```

See [`CHANGELOG.md`](../CHANGELOG.md) for what changed in each release. Semver: minor for new skill/agent/extension, major for renames or breaking config changes. pi-gauntlet and its dispatch peer [pi-cohort](https://github.com/jjuraszek/pi-cohort) version independently but ship together whenever dispatch semantics change; pin compatible versions of both.
