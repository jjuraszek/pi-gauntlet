import { classifyBucket, numstatPath, parsePatchNumstat, type BucketStat } from "./telemetry-paths.ts";
import type { DiffSummary } from "./telemetry-record.ts";
import { modifiedFilesFrom } from "./telemetry-ship.ts";

export interface RunResult { code: number; stdout: string; stderr: string }
export type Runner = (args: string[], cwd: string) => RunResult | Promise<RunResult>;
export type Buckets = [string, string[]][];
// warning set => both fields absent; the caller records the warning as an event.
export interface DiffOutcome { diff?: DiffSummary; modified_files?: string[]; warning?: string }

export function aggregateNumstat(numstat: string, files: Set<string>, buckets: Buckets): Record<string, BucketStat> {
  const out: Record<string, BucketStat> = {};
  for (const line of numstat.split("\n")) {
    if (!line.trim()) continue;
    const [ins, del, ...rest] = line.split("\t");
    const path = numstatPath(rest.join("\t"));
    if (!files.has(path)) continue;
    const bucket = classifyBucket(path, buckets);
    const stat = (out[bucket] ??= { files: 0, insertions: 0, deletions: 0 });
    stat.files += 1;
    stat.insertions += ins === "-" ? 0 : Number(ins) || 0;
    stat.deletions += del === "-" ? 0 : Number(del) || 0;
  }
  return out;
}

export const JJ_MAINLINE = "coalesce(trunk() ~ root(), present(main), present(master))";
const firstLine = (s: string): string => s.trim().split("\n")[0];

export async function computeJjDiff(o: { jj: Runner; cwd: string; spec: string; dir: string; buckets: Buckets }): Promise<DiffOutcome> {
  const failed = (sub: string, r: RunResult): DiffOutcome => ({ warning: `diff omitted: jj ${sub} failed: ${firstLine(r.stderr) || "unknown error"}` });
  // Without the ::M guard an empty mainline resolves to @ and counts the full history.
  const baseR = await o.jj(["--color=never", "log", "-r", `fork_point(${JJ_MAINLINE} | @) ~ root() & ::${JJ_MAINLINE}`, "--no-graph", "-T", 'commit_id ++ "\\n"'], o.cwd);
  if (baseR.code !== 0) return failed("log", baseR);
  const base = firstLine(baseR.stdout).trim();
  if (!base) return { warning: "diff omitted: jj mainline unresolved (trunk() is root(); no main/master bookmark)" };
  const patch = await o.jj(["--color=never", "--config", "diff.git.show-path-prefix=true", "diff", "--from", base, "--to", "@", "--git"], o.cwd);
  if (patch.code !== 0) return failed("diff", patch);
  const rows = parsePatchNumstat(patch.stdout);
  if (!rows) return { warning: "diff omitted: jj diff unparseable" };
  const dir = o.dir.replace(/\/+$/, "");
  // Exclude record-only @ and other telemetry-only revisions from the count.
  const count = await o.jj(["--color=never", "log", "-r", `(${base}::@ ~ ${base}) & files(~glob:"${dir}/**")`, "--count"], o.cwd);
  if (count.code !== 0) return failed("log", count);
  const n = count.stdout.trim();
  if (!/^\d+$/.test(n)) return { warning: `diff omitted: jj log --count unparseable: ${n}` };
  const files = modifiedFilesFrom(rows.map((r) => r.path).join("\n"), o.spec, o.dir);
  const numstat = rows.map((r) => `${r.added}\t${r.removed}\t${r.path}`).join("\n");
  return { modified_files: files, diff: { base, commits: Number(n), buckets: aggregateNumstat(numstat, new Set(files), o.buckets) } };
}

export async function computeGitDiff(o: { git: Runner; cwd: string; spec: string; dir: string; buckets: Buckets; base: string }): Promise<DiffOutcome> {
  const mb = await o.git(["merge-base", "HEAD", o.base], o.cwd);
  if (mb.code !== 0 || !mb.stdout.trim()) return { warning: `diff omitted: merge-base failed: ${firstLine(mb.stderr)}` };
  const base = mb.stdout.trim();
  const names = await o.git(["diff", "--name-only", `${base}...HEAD`], o.cwd);
  const files = modifiedFilesFrom(names.stdout, o.spec, o.dir);
  const numstat = await o.git(["diff", "--numstat", `${base}...HEAD`], o.cwd);
  const count = await o.git(["rev-list", "--count", "--invert-grep", "--grep=^telemetry: ", `${base}..HEAD`], o.cwd);
  return { modified_files: files, diff: { base, commits: Number(count.stdout.trim()) || 0, buckets: aggregateNumstat(numstat.stdout, new Set(files), o.buckets) } };
}
