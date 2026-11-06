import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gitRun } from "./vcs.ts";

export const TELEMETRY_REF = "refs/heads/gauntlet/telemetry";

export function telemetryDir(root: string): string | undefined {
  const result = gitRun(["rev-parse", "--path-format=absolute", "--git-common-dir"], root);
  return result.ok ? join(result.stdout, "gauntlet", "telemetry") : undefined;
}

export function telemetryRepo(root: string): string | undefined {
  // Read the configured URL, not get-url's transport rewrite (which may be local).
  const result = gitRun(["config", "--get", "remote.origin.url"], root);
  const match = result.stdout.match(/^(?:https?:\/\/[^/]+\/|ssh:\/\/(?:[^@/]+@)?[^/]+\/|[^@\s]+@[^:\s]+:)([^/\s]+\/[^/\s]+?)\/?$/);
  return result.ok && match ? match[1].replace(/\.git$/, "") : undefined;
}

export function syncTelemetryBranch(root: string, records: ReadonlyMap<string, string>, remote = "origin"): { ok: boolean; warning?: string } {
  const scratch = mkdtempSync(join(tmpdir(), "gauntlet-telemetry-index-"));
  const env = { GIT_INDEX_FILE: join(scratch, "index") };
  const git = (args: string[], input?: string) => {
    const result = gitRun(args, root, 30_000, { env, input });
    if (!result.ok) throw new Error(result.stderr);
    return result.stdout;
  };
  try {
    const local = gitRun(["rev-parse", "--verify", TELEMETRY_REF], root);
    let parent = local.ok ? local.stdout : undefined;
    const fetched = gitRun(["fetch", "--no-tags", remote, TELEMETRY_REF], root, 30_000);
    if (fetched.ok) {
      const upstream = git(["rev-parse", "FETCH_HEAD"]);
      if (!parent || gitRun(["merge-base", "--is-ancestor", parent, upstream], root).ok) parent = upstream;
      else if (!gitRun(["merge-base", "--is-ancestor", upstream, parent], root).ok) {
        throw new Error("local and remote telemetry histories diverged");
      }
    }
    git(parent ? ["read-tree", parent] : ["read-tree", "--empty"]);
    for (const [path, content] of records) {
      const blob = git(["hash-object", "-w", "--stdin"], content);
      git(["update-index", "--add", "--cacheinfo", "100644", blob, path]);
    }
    const tree = git(["write-tree"]);
    const tip = parent && git(["rev-parse", `${parent}^{tree}`]) === tree
      ? parent
      : git(["-c", "commit.gpgsign=false", "commit-tree", tree, ...(parent ? ["-p", parent] : []), "-m", "telemetry: update records"]);
    git(["update-ref", TELEMETRY_REF, tip, local.ok ? local.stdout : ""]);
    git(["push", remote, `${TELEMETRY_REF}:${TELEMETRY_REF}`]);
    return { ok: true };
  } catch (error) {
    return { ok: false, warning: `telemetry sync failed: ${(error as Error).message}` };
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}
