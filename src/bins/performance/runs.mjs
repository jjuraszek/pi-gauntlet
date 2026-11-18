import { PHASES, dash, findingsCell, fmtCost, fmtCount, fmtMin, table } from "./shared.mjs";

export const key = "runs";
const HEADER = ["run_id", "repo", "spec", "version", "status", "engine", "iterations", "wall", "b/p/i/v/s min", "tokens", "cost", "models", "disp", "disp/task", "coord", "grants", "reopens", "loops", "findings", "council", "big"];
const runRow = (r) => [
  r.run_id.slice(0, 8), r.repo, r.spec, r.version, `${dash(r.status)}${r.truncated ? "*" : ""}`, r.engine, r.iterations === null ? "" : String(r.iterations), fmtMin(r.wall_s),
  PHASES.map((p) => (r.phase_min[p] === null ? "-" : String(Math.round(r.phase_min[p])))).join("/"),
  fmtCount(r.tokens), fmtCost(r.cost), r.models.join(",") || "-", dash(r.dispatches),
  r.dispatches_per_task === null ? "n/a" : r.dispatches_per_task.toFixed(2), r.coordinated ? "yes" : "no", dash(r.grants), dash(r.reopens), dash(r.loops),
  findingsCell(r.findings), dash(r.council),
  r.big_calls === null ? dash(null) : `${r.big_calls}/${r.big_write_share === null ? "-" : `${Math.round(r.big_write_share * 100)}%`}`,
];
function summarizeReads(coverage, phases) {
  if (coverage !== "complete" && coverage !== "partial") return;
  const files = new Map();
  let total = 0;
  for (const phase of Object.values(phases)) {
    for (const { path, bytes } of phase.skill_reads ?? []) {
      const file = files.get(path) ?? { path, bytes: 0, reads: 0 };
      file.bytes += bytes;
      file.reads++;
      files.set(path, file);
      total += bytes;
    }
  }
  const ranked = [...files.values()].sort((a, b) => b.bytes - a.bytes || (a.path < b.path ? -1 : 1));
  return { coverage, total_bytes: total, files: ranked.map(file => ({ ...file, share: total ? file.bytes / total : null })) };
}

export const aggregate = (entries) => entries.map(e => {
  const skill_reads = summarizeReads(e.skillReadCoverage, e.readPhases);
  return skill_reads ? { ...e.row, skill_reads } : e.row;
});

export const renderText = (rows) => {
  const blocks = [`runs (${rows.length})\n${table(HEADER, rows.map(runRow))}`];
  for (const { run_id, skill_reads } of rows) {
    if (!skill_reads) continue;
    const { coverage, total_bytes, files } = skill_reads;
    const header = `skill reads: run=${run_id} coverage=${coverage} total_bytes=${total_bytes}`;
    const ranked = files.map(f => [f.path, String(f.bytes), String(f.reads), f.share === null ? "-" : `${(f.share * 100).toFixed(1)}%`]);
    blocks.push(ranked.length ? `${header}\n${table(["path", "bytes", "reads", "share"], ranked)}` : header);
  }
  return blocks.join("\n\n");
};
