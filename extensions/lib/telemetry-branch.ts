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

export function syncTelemetryBranch(root: string, records: ReadonlyMap<string, string>, remote = "origin"): { ok: boolean; committed: boolean; pushed: boolean; reason?: string; warning?: string } {
  const scratch = mkdtempSync(join(tmpdir(), "gauntlet-telemetry-index-"));
  const env = { GIT_INDEX_FILE: join(scratch, "index") };
  const git = (args: string[], input?: string) => {
    const result = gitRun(args, root, 30_000, { env, input });
    if (!result.ok) throw new Error(result.stderr);
    return result.stdout;
  };
  const tracking = `refs/remotes/${remote === "origin" ? "origin" : "telemetry"}/gauntlet/telemetry`;
  const fetch = () => gitRun(["fetch", "--no-tags", remote, `+${TELEMETRY_REF}:${tracking}`], root, 30_000);
  const resolve = (ref: string) => {
    const result = gitRun(["rev-parse", "--verify", ref], root);
    return result.ok ? result.stdout : undefined;
  };
  const commit = (tree: string, parent: string | undefined, message: string) =>
    git(["-c", "commit.gpgsign=false", "commit-tree", tree, ...(parent ? ["-p", parent] : []), "-m", message]);
  let committed = false;
  try {
    let tip = resolve(TELEMETRY_REF);
    committed = !!tip;
    fetch();
    let upstream = resolve(tracking);
    if (records.size) {
      const parent = tip ?? upstream;
      git(parent ? ["read-tree", parent] : ["read-tree", "--empty"]);
      for (const [path, content] of records) {
        const blob = git(["hash-object", "-w", "--stdin"], content);
        git(["update-index", "--add", "--cacheinfo", "100644", blob, path]);
      }
      const tree = git(["write-tree"]);
      const next = parent && git(["rev-parse", `${parent}^{tree}`]) === tree
        ? parent : commit(tree, parent, "telemetry: update records");
      git(["update-ref", TELEMETRY_REF, next, tip ?? ""]);
      tip = next;
      committed = true;
    }
    const pending = () => tip ? git(["rev-list", "--reverse", "--topo-order", tip, ...(upstream ? [`^${upstream}`] : [])]).split("\n").filter(Boolean) : [];
    if (!pending().length) return { ok: true, committed, pushed: false };
    const push = () => gitRun(["push", remote, `${TELEMETRY_REF}:${TELEMETRY_REF}`], root, 30_000);
    const first = push();
    if (first.ok) return { ok: true, committed, pushed: true };
    const fetched = fetch();
    if (!fetched.ok) throw new Error(`${first.stderr}; refresh failed: ${fetched.stderr}`);
    upstream = resolve(tracking);
    let replayed = upstream;
    for (const sha of pending()) {
      git(replayed ? ["read-tree", replayed] : ["read-tree", "--empty"]);
      // Apply only this commit's changes, not its whole tree: remote-only records survive.
      const changes = git(["diff-tree", "--root", "--no-commit-id", "--raw", "--no-abbrev", "--no-renames", "-r", "-z", sha]).split("\0");
      for (let i = 0; i + 1 < changes.length; i += 2) {
        const [, mode, , blob] = changes[i].split(" ");
        const path = changes[i + 1];
        git(mode === "000000" ? ["update-index", "--force-remove", "--", path] : ["update-index", "--add", "--cacheinfo", mode, blob, path]);
      }
      replayed = commit(git(["write-tree"]), replayed, git(["log", "-1", "--format=%B", sha]));
    }
    // Publish the replay atomically only after every pending commit has survived it.
    if (replayed) git(["update-ref", TELEMETRY_REF, replayed, tip!]);
    const second = push();
    if (!second.ok) throw new Error(second.stderr);
    return { ok: true, committed, pushed: true };
  } catch (error) {
    const reason = (error as Error).message;
    return { ok: false, committed, pushed: false, reason, warning: `telemetry: not pushed (${reason})` };
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}
