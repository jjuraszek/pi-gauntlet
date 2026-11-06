import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gitRun } from "./vcs.ts";

export const TELEMETRY_REF = "refs/heads/gauntlet/telemetry";

export function trackerRefs(text: string): string[] {
  const tokens = text.match(/https?:\/\/[^\s<>\])]+|[\w.-]+\/[\w.-]+#\d+|#\d+|\b[A-Z][A-Z0-9]*-\d+\b|\bgh-\d+\b/g) ?? [];
  return [...new Set(tokens.map(ref => ref.replace(/[.,;]+$/, ""))
    .filter(ref => !ref.startsWith("http") || /\/(?:issues\/\d+|pull\/\d+|issue\/[A-Z][A-Z0-9]*-\d+)(?:\/[^\s]*)?$/.test(ref))
    .map(ref => ref.startsWith("gh-") ? `#${ref.slice(3)}` : ref))];
}

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

const trackingRef = (remote: string) => `refs/remotes/${remote === "origin" ? "origin" : "telemetry"}/gauntlet/telemetry`;
const fetchBranch = (root: string, remote: string) => gitRun(["fetch", "--no-tags", remote, `+${TELEMETRY_REF}:${trackingRef(remote)}`], root);

export function syncTelemetryBranch(root: string, records: ReadonlyMap<string, string>, remote = "origin"): { ok: boolean; committed: boolean; pushed: boolean; reason?: string; warning?: string } {
  const scratch = mkdtempSync(join(tmpdir(), "gauntlet-telemetry-index-"));
  const env = { GIT_INDEX_FILE: join(scratch, "index") };
  const git = (args: string[], input?: string) => {
    const result = gitRun(args, root, undefined, { env, input });
    if (!result.ok) throw new Error(result.stderr);
    return result.stdout;
  };
  const tracking = trackingRef(remote);
  let fetchWarning: string | undefined;
  const fetch = () => {
    const result = fetchBranch(root, remote);
    fetchWarning = result.ok ? undefined : `fetch failed: ${result.stderr}`;
    return result;
  };
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
    if (!pending().length) return { ok: true, committed, pushed: false, warning: fetchWarning };
    const push = () => gitRun(["push", remote, `${TELEMETRY_REF}:${TELEMETRY_REF}`], root);
    const first = push();
    if (first.ok) return { ok: true, committed, pushed: true, warning: fetchWarning };
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
    return { ok: false, committed, pushed: false, reason, warning: [fetchWarning, `telemetry: not pushed (${reason})`].filter(Boolean).join("; ") };
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

export function readTelemetryBranch(root: string, { remote = "origin", prefix = "" }: { remote?: string; prefix?: string } = {}): { records: { path: string; bytes: string }[]; warning?: string } {
  const records: { path: string; bytes: string }[] = [];
  let warning: string | undefined;
  try {
    const synced = syncTelemetryBranch(root, new Map(), remote);
    warning = synced.warning;
    if (synced.pushed) {
      const fetched = fetchBranch(root, remote);
      warning = fetched.ok ? undefined : `fetch failed: ${fetched.stderr}`;
    }
    const tip = gitRun(["rev-parse", "--verify", trackingRef(remote)], root);
    if (!tip.ok) return { records, warning: [warning, "no telemetry ref fetched yet"].filter(Boolean).join("; ") };
    const tree = gitRun(["ls-tree", "-r", "-z", tip.stdout, ...(prefix ? ["--", prefix] : [])], root);
    if (!tree.ok) throw new Error(tree.stderr);
    for (const entry of tree.stdout.split("\0").filter(Boolean)) {
      const [meta, path] = entry.split("\t");
      const [, type, sha] = meta.split(" ");
      if (type !== "blob" || !path.startsWith(prefix) || !path.endsWith(".yaml")) continue;
      const blob = gitRun(["cat-file", "blob", sha], root, undefined, { raw: true });
      if (!blob.ok) throw new Error(blob.stderr);
      records.push({ path, bytes: blob.stdout });
    }
    return { records, warning };
  } catch (error) {
    return { records, warning: [warning, `read failed: ${(error as Error).message}`].filter(Boolean).join("; ") };
  }
}
