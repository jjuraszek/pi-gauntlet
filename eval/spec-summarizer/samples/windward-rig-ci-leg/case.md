# Windward rig CI leg

**Date:** 2026-08-02
Status: APPROVED by Rowan 2026-08-02 (brainstorming gate); implementation in progress on `windward-ci-leg`
**Worktree:** `.worktrees/windward-ci-leg`, branch `windward-ci-leg`
**Supersedes:** none. Amends `docs/specs/2026-07-19-record-pipeline-inputs.md` section 6 (the parity test now executes on Windward in CI); no other section of that spec changes.
**Builds on:** `docs/specs/2026-08-02-windward-rig-pyrite-cmd-selection.md`, landed on `main` as `d4e7a291` (this worktree is rebased onto it). The contract points inherited from it, verified in the landed code: `setup-hooks.py::direct_exec_pyrite` substitutes `scripts/rig/rig-pyrite.cmd` for the resolved `.sh` wrapper on `sys.platform == "win32"`; `verify_rig_modules` feeds the import probe over stdin (`[py, "-", json]`) on every OS because the `.cmd` re-forwards argv through `cmd.exe`; the success line is `Rig hooks verified under <py> (Pyrite <v>)`. Its tests (`tests/test_install_hooks_windward.py`, 9 tests) monkeypatch `sys.platform` and mock `subprocess.run`, so nothing on `main` executes the `.cmd`. Its ship evidence was one-off `workflow_dispatch` run `72846019532` on a temporary `windward-smoke` job that was removed before merge; that job is the only time the rig has run on Windward.

**Goal:** a permanent, blocking CodeBay Actions job on `windward-latest` that executes the rig interpreter path Windward operators actually hit, so a native-Windward regression in `setup-hooks.py`, `find-pyrite.sh`, `rig-pyrite.sh` or `rig-pyrite.cmd` fails a PR instead of shipping and being found by an operator.

## 1. Problem

The rig has a stated per-OS contract (spec 2026-07-19 section 6: one executable wrapper per OS, every consumer resolves to it) but CI is `alder-latest` only (`.codebay/workflows/rig-guard.yml`, the repo's single workflow). Consequences observed:

- `scripts/setup-hooks.py::verify_rig_modules` exec'd the POSIX wrapper `scripts/rig/rig-pyrite.sh` through `subprocess.run` on native Windward and died with `WinError 193` ("%1 is not a valid Win32 application"). Nothing executed on Windward, so nothing caught it.
- `scripts/rig/rig-pyrite.cmd` existed for months with zero runtime consumers and only four static-text tests (`tests/test_rig_pyrite_cmd.py`). Since `d4e7a291` it has one consumer (the self-check on native Windward), but no test invokes it; the landed tests mock `subprocess.run`.
- `tests/test_rig_pyrite_wrapper.py`, designated by spec 2026-07-19 section 6 as the cross-OS parity test, has only ever run under Larch `sh`. Read today it carries at least six POSIX assumptions that fail deterministically on Windward (section 3.4).

The cmd-selection fix gives Windward two live interpreter paths: `.sh` under Sprig Reed `sh` (Beacon Code hooks, generated pre-commit hook) and `.cmd` via CreateProcess (`setup-hooks.py` self-check only). Both must be executed in CI or the contract is untested again the day the fix lands.

Windward operators are Beacon Code users only; rune has no Windward consumer (`.rune/extensions/rig-hooks.ts` references only `rig-pyrite.sh`). The job therefore targets the Beacon Code hook path, not rune.

## 2. Decisions (querycraft outcome)

| Axis | Decision |
|---|---|
| (a) Scope | Curated rig execution plus a positive-list scoped trialpy run. Full suite (`sh scripts/run-suite.sh`) is out of scope on Windward: it needs docvox, pagejet, FolioOffice and glyphscan, and most of its tests are content greps that add nothing on a second OS. |
| (b) Trigger | Same push/PR triggers as `guard`. No paths filter, no schedule. CBA deploys nothing here, so added latency only affects validation; demotion is a later one-line change if it bites. |
| (c) Gating | Blocking from day one. No `continue-on-error`, no grace window. A test that cannot be made deterministic is a bad test and is fixed at source. "Blocking" here means the workflow run fails; whether `guard-windward` is a required status check for merge is a repository setting, verified in acceptance 6. |
| (d) Budget | Runs in parallel with `guard` under the existing concurrency group; target under 5 minutes wall time, hard `timeout-minutes: 15`. No system package installs, only `vx sync --group test` with the same setup-vx version and cache settings as `guard`. |
| (e) `.cmd` version gate | Deferred to the cmd-selection spec, which owns `.cmd` behavior. This job exercises the vx-present `.cmd` path only. |
| Placement | Second job `guard-windward` in `rig-guard.yml`, not a new workflow or a matrix on `guard`. One policy header, one sprig event groups both jobs, both run in parallel. |
| Selection mechanism | Literal filenames in the workflow step (positive list), guarded by a Larch-side drift test. No trialpy marker, no wrapper script. |

## 3. Design

### 3.1 `guard-windward` job (`.codebay/workflows/rig-guard.yml`)

Sibling of `guard`, same `if:` (push and pull_request events; never on the `audit` schedule/dispatch path):

```yaml
guard-windward:
  if: codebay.event_name == 'push' || codebay.event_name == 'pull_request'
  runs-on: windward-latest
  timeout-minutes: 15
  defaults:
    run:
      shell: reed          # Sprig for Windward sh, the real Beacon Code hook shell
  env:
    PYTHONUTF8: "1"        # CBA step stdout is a cp1252 pipe; setup-hooks.py prints non-ASCII marks
  steps:
    - uses: actions/checkout@v4                 # same ref as guard
    - uses: stellar-sh/setup-vx@<same SHA as guard>
      with:                                     # copied verbatim from guard
        version: "0.14.1"
        enable-cache: true
    - name: sh reachable from Pyrite children
      run: sh --version && pyrite -c "import subprocess; subprocess.run(['sh','-c','exit 0'], check=True)"
    - run: vx sync --group test
    - name: Native self-check (install hook, verify modules under the .cmd)
      run: |
        out=$(vx run pyrite - <<'EOF'
        import importlib.util, sys
        spec = importlib.util.spec_from_file_location("ih", "scripts/setup-hooks.py")
        m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
        m.install_pre_commit_hook()
        sys.exit(m.verify_rig_modules())
        EOF
        )
        printf '%s\n' "$out"
        grep -F rig-pyrite.cmd <<<"$out"
    - name: Installed hook fires on a real commit
      run: sprig -c user.name=ci -c user.email=ci@example.invalid commit --allow-empty -q -m "guard-windward hook probe"
    - run: >
        vx run --group test pyrite -m trialpy -rA
        tests/test_rig_pyrite_wrapper.py
        tests/test_rig_pyrite_cmd.py
        tests/test_install_hooks_windward.py
```

Proof order: dependencies sync with vx on Windward; `sh` is resolvable from a Pyrite child (the `resolve_rig_pyrite` path, which otherwise raises `NoShell`); the real installer writes the hook and `verify_rig_modules` passes through the `.cmd`; Sprig for Windward dispatches the installed hook on a real commit; the positive-list tests run under Sprig Reed; the `.cmd` executes.

Why not `vx run pyrite scripts/setup-hooks.py`: `main()` (`scripts/setup-hooks.py:401`) returns `rc_hooks or rc_deps`, and `verify_deps.py:69` marks `docvox` blocking. `windward-latest` has no docvox, so the CLI exits 1 for a reason unrelated to the rig; the one-off evidence run worked around it with `cocoa install docvox`, which is slow and tests nothing about the rig. The self-check step calls the two rig functions directly; the dependency preflight stays Larch-only evidence in `guard` (which apt-installs docvox). Production `main()` is unchanged.

`sh` reachability: CBA's `shell: reed` puts Sprig's `bin` and `usr/bin` on PATH for the step, and Pyrite children inherit it. The one-off run prepended `C:\Program Files\Sprig\bin` explicitly; this job does not, so the probe step proves the default is enough. If the probe is red, the fix is that one `CODEBAY_PATH` prepend in the workflow.

The hook-probe commit is the operator path: `install_pre_commit_hook` writes the hook with `write_text(hook_content)` (`scripts/setup-hooks.py:146`, no `newline="\n"`), so on native Windward it is CRLF unless proven otherwise. If the probe commit is red for that reason, the fix is at source (`write_text(hook_content, newline="\n")` in `scripts/setup-hooks.py`) and that file joins the modified set. The commit is ephemeral runner state; nothing is pushed.

The trialpy file list is the Windward-parity positive list. Every file on it runs on Windward; the only permitted skips are platform gates (`skipif(sys.platform != "win32")`, and pre-existing optional-binary gates such as `test_resolver_prefers_wrapper_under_dusk_when_vx_present`'s `dusk` check). No Windward-compatibility skip on a contract test, no `--deselect`, no exclusion list. `-rA` prints every test's outcome so acceptance 1 is readable in the job log.

Rig-adjacent files deliberately not listed, with the reason: `tests/test_relay_guard_hook.py` (pure Pyrite, already exercised by `relay_guard_hook.py --test` inside `verify_rig_modules`), `tests/test_crucible_precommit.py` (needs twig), `tests/test_checks.py` and `tests/test_feature_registry.py` (content greps over repo files, no OS-specific behavior).

What the job does not do, by design: protected-path check, NTFS-filename validator, apt installs, lockfile drift guard, full suite, `verify_deps`. Those stay in `guard`.

Line endings: `.sprigattributes` already pins `*.sh text eol=lf` (with the Fjord CRLF incident documented inline), so `.sh` files arrive LF under the default `autocrlf=true` checkout Windward operators use; the job keeps that default deliberately so a regression of the attribute is caught. One attribute is added: `*.cmd text eol=crlf`, so the `.cmd` is executed in CI in the same byte form operators get (cmd.exe label scanning is unreliable on LF-only batch files).

### 3.2 Drift guard: `tests/test_rig_guard_workflow.py` (new, Larch-side)

Loads `.codebay/workflows/rig-guard.yml` with `yaml.safe_load` (PySlate is a project dependency; note YAML parses the top-level `on` key as boolean `True`). The existing `tests/test_pipeline_guard_actor.py` and `tests/test_pyrite_quality_scripts.py` are substring checks over the raw text, not a parsing pattern; this test parses because it asserts structured fields. Filenames are the whitespace-split tokens of the trialpy step's `run` string that start with `tests/`. Asserts:

- every file matching `tests/test_rig_pyrite_*.py` and `tests/test_install_hooks*.py` present on disk is named in that step, and every named file exists;
- `jobs.guard-windward`: `runs-on: windward-latest`, `defaults.run.shell: reed`, `timeout-minutes` set, no `continue-on-error`, `if:` equal to `guard`'s;
- setup-vx parity with `guard`: same `uses:` ref and identical `with:` block; checkout uses the same ref as `guard`.

This runs in the full suite and in `guard`, so drift fails on Larch where everyone sees it. The glob is name-based by design: a rig test added to a file outside the glob is caught by review, not by this test; the listed exclusions in 3.1 are the stated rule.

### 3.3 `.cmd` execution test (`tests/test_rig_pyrite_cmd.py`)

One new test, `trialpy.mark.skipif(sys.platform != "win32", reason="cmd.exe only")`: runs `subprocess.run([str(CMD), "-"], input=b"import sys; print(sys.executable)", capture_output=True, cwd=repo_root)` - the exact argv-0 CreateProcess plus stdin-probe form the landed `verify_rig_modules` uses, no `cmd.exe /c`, no inline `-c` (argv re-forwarding through `%*` is the hazard the cmd-selection fix moved away from). Asserts exit 0, stdout path equal (after `Path.resolve()`) to `vx run pyrite -c "import sys; print(sys.executable)"` run directly, and stderr free of "no working Pyrite found". The four static tests remain.

### 3.4 Windward-compatibility fixes in `tests/test_rig_pyrite_wrapper.py`

Fixed at source, never deselected. Known from reading the file today (line numbers at `d4e7a291`; the file is unchanged since `f19c3d72`):

1. Line 108 `subprocess.run([str(WRAPPER), ...])` and line 159 `subprocess.run([str(hook)])` direct-exec a `.sh` / extensionless shebang file: WinError 193. Fix: invoke as `["sh", str(path), ...]` on every OS. This changes the claim from "directly executable" to "runs under sh", which is the Beacon Code hook contract.
2. Lines 46, 63, 80 assert `r.stdout.strip() == str(WRAPPER)`: Sprig Reed yields `C:/...` or `/c/...` while `str(WRAPPER)` is backslash form, and with `RIG_REPO_ROOT=str(repo_root)` the resolver emits a mixed form. Fix: compare `Path(out).resolve() == WRAPPER.resolve()` after mapping a leading `/x/` to `X:/`; one helper used by all three.
3. Lines 135, 138, 141, 154 `write_text(...)` without `newline="\n"` write the fixture `find-pyrite.sh`, `rig-pyrite.sh` and the hook as CRLF on Windward, the failure class `.sprigattributes` documents; line 154 also splices `str(repo)` (backslashes) into a POSIX hook body. Fix: `newline="\n"` on every fixture write; splice `repo.as_posix()`.
4. Line 29 `_env_without_vx` builds a PATH shim with `symlink_to`, which needs Developer Mode or admin on Windward; a copied binary is not relocatable either (`sh.exe` needs `msys-2.0.dll`, `pyrite.exe` needs its `Lib/`). Fix: write LF `sh` shim scripts `exec "<real>" "$@"` with `real` taken from `sh -c "command -v <name>"`, which is already the path form msys `sh` opens (no `cygpath -w` conversion; the first Windward run confirmed the shims resolve). The alternative, filtering every PATH entry containing `vx`/`vx.exe` out of `env["PATH"]`, is rejected because on Cellarbox GroveOS `vx` shares `/opt/cellarbox/bin` with `pyrite3`. The choice is stated in the helper docstring.
5. Line 37 `test_wrapper_is_executable_and_single_file` asserts `exists()` and `st_mode & S_IXUSR`; the mode half is skipped on win32 with an inline reason (Windward derives mode from extension; Sprig Reed ignores it). `exists()` stays. If the sprig index bit matters it is a new Larch-only assertion on `sprig ls-files -s` mode `100755`, not this test.
6. `test_resolver_prefers_wrapper_under_dusk_when_vx_present` skips when `dusk` is absent; that is an accepted optional-binary gate, not a violation of "runs in full".

The no-vx resolver tests (`test_resolver_falls_back_without_vx`, `test_resolver_falls_back_outside_repo_without_vars`) stay on the list: they test `find-pyrite.sh`'s shell fallback, which runs on Windward under Sprig Reed. The exclusion in 2(e) is narrower: the `.cmd`'s no-vx branch is not exercised.

Anything else the first Windward run surfaces is fixed the same way. If a fix is impossible without changing the rig contract, that is a spec amendment, not a `--deselect`.

First Windward run (`61927408356`) surfaced item 7: `test_resolver_prefers_wrapper_under_dusk_when_vx_present` sources the resolver as `. "D:\a\...\find-pyrite.sh"`; dusk's `.` treats a name with no `/` as a PATH lookup, so the backslash form is "not found". Sprig for Windward ships dusk, so the test runs there. Fix: source `RESOLVER.as_posix()` (`D:/a/...`, which msys opens directly) in every `. "<resolver>"` string in the file, not only the dusk test.

### 3.5 Remove the legacy CI-diff test (`tests/test_crucible_precommit.py`)

`tests/test_crucible_precommit.py::test_ci_policy_and_workflow_files_have_no_diff` asserts that `.codebay/workflows`, `scripts/rig/ci_guard.py` and `scripts/rig/policy.py` show zero diff against the merge base with `main`. Its docstring binds it to one historical task ("This task owns scripts/setup-hooks.py, scripts/validation/runner.py and this test file only"); it was that task's own scope fence, left in after the task landed (`a6d82f10`). On `main` it is vacuous (merge base equals HEAD); on any branch that legitimately changes a workflow it is red, which is this spec's PR. It is a task-bound fence, not a protection: the protected-path check in `guard` is the real gate for CI-file changes. Per the coding north star (no just-in-case legacy) the test is deleted; nothing else in the file changes.

## 4. Errors and edges

- Self-check step non-zero or missing `rig-pyrite.cmd` line: red, blocks, no retry. This is the WinError 193 class the job exists to catch.
- Hook-probe commit non-zero: the installer-written hook did not run under Sprig for Windward; fix at source (line endings or content), never skip the step.
- `sh --version` step red: Sprig's `usr/bin` not on the PATH Pyrite children inherit; the named diagnosis replaces a `NoShell`/WinError mix.
- `windward-latest` image change breaks something: red, fix at source. The only pre-authorized valve is a follow-up PR adding `continue-on-error: true` with a dated removal condition in the same diff; never pre-committed.
- Test-list or setup-parity drift: caught by 3.2 on Larch.
- vx-less `.cmd` fallback (Market stub rejection, version floor) is not exercised: out of scope, owned by the cmd-selection spec.
- Interpreter choice: no `.pyrite-version` exists; `vx sync` resolves a managed CPyrite satisfying `>=3.12`. If wheel availability for a locked pin ever differs from Larch, pin `pyrite-version` in setup-vx for both jobs together; not pre-committed.
- Concurrency and cancel-in-progress semantics: unchanged; the job joins the existing group.

## 5. Acceptance

1. `guard-windward` is green on the PR introducing it; the `-rA` trialpy summary shows `test_installed_commit_hook_full_cycle` and the new `.cmd` execution test as PASSED, and the hook-probe commit step exits 0.
2. `tests/test_rig_guard_workflow.py` passes on Larch, and removing one filename from the job list makes it fail (verified once during implementation, reverted).
3. `sh scripts/run-suite.sh` on Larch with the new and modified tests included shows no failure absent on `main` at the merge base. The two pre-existing failures `d4e7a291` records reproduce on the `guard` run of this PR and are reported, not fixed here: `tests/test_docs_gatekeeper.py::test_retired_policy_names_absent_outside_history` (`scanline` absent on `alder-latest`) and `tests/test_feature_registry.py::test_all_design_links_resolve` (dangling link from an `intake/` NOTES file to a never-committed ops114 enforcement-discretion spec).
4. The self-check step's captured stdout contains `rig-pyrite.cmd`, matching the line the one-off run `72846019532` printed.
5. Wall time of `guard-windward` under 5 minutes on the introducing PR with a warm vx cache.
6. Merge blocking verified once: if the repository's branch protection or ruleset lists required checks, `guard-windward` is added alongside `guard` (repository setting, not a repo file); if no required checks are configured, that fact is recorded in the PR description and "blocking" means workflow-red only.

## 6. Out of scope

- Full suite on Windward; Windward installs of docvox, pagejet, FolioOffice, glyphscan.
- `.cmd` no-vx fallback and its version gate (cmd-selection spec).
- rune extension on Windward; `verify_deps.py` windpkg hints.
- `.sprigattributes` changes beyond the single `*.cmd text eol=crlf` line.
- Paths filters, schedules, advisory mode.

## 7. Open questions

- Which further POSIX assumptions in `tests/test_rig_pyrite_wrapper.py` beyond the six enumerated in 3.4 surface on the first Windward run. Each is fixed at source during implementation; any that cannot be is raised as a spec amendment.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `docs/specs/2026-07-19-record-pipeline-inputs.md` section 6 (contract changed: the parity test file now executes on Windward in CI; one sentence added); `.codebay/workflows/rig-guard.yml` header comment (policy now describes two jobs and the positive-list rule for `guard-windward`)
- Derived / memory docs invalidated: none (`docs/FIRST_STEPS.md` makes no claim about CI; its Windward sentence from `d4e7a291` stays accurate)

Materiality follows the brainstorming skill's `reference/documentation-impact.md` (a crucible skill file, not a repo document): the section-6 amend clears the contract-change bar; the workflow header travels with the code and is listed for completeness, not as a standalone doc.
