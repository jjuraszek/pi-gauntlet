// One checkout resolver for every extension that needs "which git checkout owns this
// path" (#37): plan_check, the settings loader, Guard 2, telemetry. `--path-format=absolute`
// (git >= 2.31) makes git-dir and common-dir comparable as strings from any subdirectory.
// A plain (non-colocated) jj checkout has no .git for rev-parse, so when git fails the
// resolver falls back to `jj root`; colocated jj repos still resolve through git first.
// checkoutOfSync is the same resolution for sync callers (the settings loader).
import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";

export type GitResult = { code: number; stdout: string };
// `via` records which binary resolved the checkout, so callers with git-only follow-ups
// (telemetry's checkpoint commit) can skip them in a plain jj workspace.
export type Checkout = { toplevel: string; isPrimary: boolean; via: "git" | "jj" };
type ResolvedCheckout = { toplevel: string; isPrimary: boolean };

export const CHECKOUT_ARGS = ["rev-parse", "--path-format=absolute", "--show-toplevel", "--git-dir", "--git-common-dir"];

// isPrimary = gitDir === commonDir (both absolute thanks to --path-format).
export function parseCheckout(r: GitResult): ResolvedCheckout | undefined {
  if (r.code !== 0) return undefined;
  const lines = r.stdout.trim().split("\n").map((l) => l.trim());
  if (lines.length < 3 || !lines[0]) return undefined;
  return { toplevel: lines[0], isPrimary: lines[1] === lines[2] };
}

const isDir = (p: string): boolean => {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
};

// Nearest existing directory at or above absPath: the path itself when it is a directory,
// else its dirname, walking up. Covers the first write into a not-yet-existing doc/specs/.
export function nearestExistingDir(absPath: string): string {
  let p = absPath;
  while (!(existsSync(p) && isDir(p))) {
    const parent = dirname(p);
    if (parent === p) return p;
    p = parent;
  }
  return p;
}

export const JJ_ROOT_ARGS = ["root"];

// Added jj workspaces keep .jj/repo as a pointer file into the main repo; the primary
// checkout keeps it as the real directory.
function parseJjRoot(r: GitResult): ResolvedCheckout | undefined {
  if (r.code !== 0) return undefined;
  const toplevel = r.stdout.trim();
  if (!toplevel) return undefined;
  return { toplevel, isPrimary: isDir(join(toplevel, ".jj", "repo")) };
}

export async function checkoutOf(
  absPath: string,
  git: (args: string[], cwd: string) => GitResult | Promise<GitResult>,
  jj: (args: string[], cwd: string) => GitResult | Promise<GitResult> = jjSync,
): Promise<Checkout | undefined> {
  const cwd = nearestExistingDir(absPath);
  const g = parseCheckout(await git(CHECKOUT_ARGS, cwd));
  if (g) return { ...g, via: "git" };
  const j = parseJjRoot(await jj(JJ_ROOT_ARGS, cwd));
  return j ? { ...j, via: "jj" } : undefined;
}

// Same git-then-jj resolution for sync callers; either side injectable for tests.
export function checkoutOfSync(
  absPath: string,
  git: (args: string[], cwd: string) => GitResult = gitSync,
  jj: (args: string[], cwd: string) => GitResult = jjSync,
): Checkout | undefined {
  const cwd = nearestExistingDir(absPath);
  const g = parseCheckout(git(CHECKOUT_ARGS, cwd));
  if (g) return { ...g, via: "git" };
  const j = parseJjRoot(jj(JJ_ROOT_ARGS, cwd));
  return j ? { ...j, via: "jj" } : undefined;
}

// Never throws: any failure (not a repo, missing dir, missing binary) is a nonzero code.
const commandSync =
  (bin: string) =>
  (args: string[], cwd: string): GitResult => {
    try {
      const stdout = execFileSync(bin, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 5000 });
      return { code: 0, stdout };
    } catch (e) {
      const status = (e as { status?: unknown }).status;
      return { code: typeof status === "number" ? status : 1, stdout: "" };
    }
  };

export const gitSync = commandSync("git");
export const jjSync = commandSync("jj");
