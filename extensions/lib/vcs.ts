// VCS-flavor dispatch for gauntlet tools: the one module that knows both git and
// jj, so callers (the telemetry seal bin today) stay flavor-free. Checkout
// resolution delegates to checkout.ts, ship-diff derivation to telemetry-diff.ts.
import { spawnSync } from "node:child_process";
import { checkoutOfSync } from "./checkout.ts";
import { computeGitDiff, computeJjDiff, JJ_FORK_POINT, type Buckets, type DiffOutcome, type RunResult } from "./telemetry-diff.ts";

export interface VcsResult extends RunResult { ok: boolean }
export type VcsRun = (args: string[], cwd: string, timeoutMs?: number) => VcsResult;
export interface Vcs { kind: "git" | "jj"; root: string; run: VcsRun }

// Prompts off so a credential or editor request cannot hang a non-interactive caller.
const NO_PROMPT_ENV = { ...process.env, GIT_TERMINAL_PROMPT: "0", GIT_EDITOR: "true" };

const runBinary = (bin: "git" | "jj"): VcsRun => (args, cwd, timeoutMs = 10_000) => {
  // jj diff --git returns full patches; spawnSync's 1 MiB default buffer truncates them (ENOBUFS).
  const r = spawnSync(bin, args, { cwd, encoding: "utf8", env: NO_PROMPT_ENV, timeout: timeoutMs, maxBuffer: 64 * 1024 * 1024 });
  const err = r.error as NodeJS.ErrnoException | undefined;
  const timedOut = err?.code === "ETIMEDOUT";
  const stderr = timedOut ? "timed out" : (r.stderr ?? "").trim().split("\n")[0] || err?.message || `${bin} exited ${r.status}`;
  return { ok: !timedOut && r.status === 0, code: timedOut ? 1 : (r.status ?? 1), stdout: (r.stdout ?? "").trim(), stderr };
};

export function vcsFor(absPath: string): Vcs | undefined {
  const co = checkoutOfSync(absPath);
  return co && { kind: co.via, root: co.toplevel, run: runBinary(co.via) };
}

// The ship diff for a sealed record. git diffs o.base's merge-base against HEAD;
// jj derives its own fork-point base (o.base is validation-only there).
export async function computeShipDiff(vcs: Vcs, o: { spec: string; dir: string; planDirs: readonly string[]; buckets: Buckets; base: string }): Promise<DiffOutcome> {
  return vcs.kind === "jj"
    ? computeJjDiff({ jj: vcs.run, cwd: vcs.root, spec: o.spec, dir: o.dir, planDirs: o.planDirs, buckets: o.buckets })
    : computeGitDiff({ git: vcs.run, cwd: vcs.root, spec: o.spec, dir: o.dir, planDirs: o.planDirs, buckets: o.buckets, base: o.base });
}

// git: any committish. jj: a revset (local bookmark, main@origin, trunk(), ...)
// resolving to at least one commit; the ship diff still derives its own base.
export function validateBase(vcs: Vcs, base: string): boolean {
  const r = vcs.kind === "jj"
    ? vcs.run(["--color=never", "log", "-r", base, "--limit", "1", "--no-graph", "-T", 'commit_id ++ "\\n"'], vcs.root)
    : vcs.run(["rev-parse", "--verify", "-q", `${base}^{commit}`], vcs.root);
  return r.ok && r.stdout !== "";
}

// Name-only working diff for record discovery. git diffs base...HEAD; jj diffs
// the fork point computeJjDiff derives against @ (--base is validation-only on jj).
export function changedNames(vcs: Vcs, base: string): VcsResult {
  if (vcs.kind === "git") return vcs.run(["diff", "--no-renames", "--name-only", `${base}...HEAD`], vcs.root);
  const forkR = vcs.run(["--color=never", "log", "-r", JJ_FORK_POINT, "--no-graph", "-T", 'commit_id ++ "\\n"'], vcs.root);
  if (!forkR.ok) return forkR;
  const fork = forkR.stdout.split("\n")[0];
  if (!fork) return { ok: false, code: 1, stdout: "", stderr: "jj mainline unresolved (trunk() is root(); no main/master bookmark)" };
  return vcs.run(["--color=never", "diff", "--name-only", "--from", fork, "--to", "@"], vcs.root);
}

// git: sealed == tracked and clean (ls-files --error-unmatch, diff --quiet HEAD).
// jj: no commit step, so a shipped record is always sealed.
export function recordSealed(vcs: Vcs, rel: string): boolean {
  if (vcs.kind === "jj") return true;
  return vcs.run(["ls-files", "--error-unmatch", "--", rel], vcs.root).ok
    && vcs.run(["diff", "--quiet", "HEAD", "--", rel], vcs.root).ok;
}

// jj has no commit step: `file track --include-ignored` is the `git add -f` equivalent - it
// snapshots the stamped record into the working-copy change even under a gitignored dir.
export function commitRecordFile(vcs: Vcs, rel: string, message: string): VcsResult {
  if (vcs.kind === "jj") return vcs.run(["file", "track", "--include-ignored", "--", rel], vcs.root);
  const add = vcs.run(["add", "-f", "--", rel], vcs.root);
  const commit = add.ok ? vcs.run(["commit", "-q", "-m", message, "--", rel], vcs.root, 30_000) : add;
  // Unstage the -f add so a retry sees the same state.
  if (!commit.ok) vcs.run(["reset", "-q", "--", rel], vcs.root);
  return commit;
}
