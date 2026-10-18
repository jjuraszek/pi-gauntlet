import { PHASES, dash, findingsCell, fmtCost, fmtCount, fmtMin, table } from "./shared.mjs";

export const key = "runs";
const HEADER = ["run_id", "repo", "spec", "version", "status", "wall", "b/p/i/v/s min", "tokens", "cost", "models", "disp", "grants", "reopens", "loops", "findings", "council", "big"];
const runRow = (r) => [
  r.run_id.slice(0, 8), r.repo, r.spec, r.version, `${dash(r.status)}${r.truncated ? "*" : ""}`, fmtMin(r.wall_s),
  PHASES.map((p) => (r.phase_min[p] === null ? "-" : String(Math.round(r.phase_min[p])))).join("/"),
  fmtCount(r.tokens), fmtCost(r.cost), r.models.join(",") || "-", dash(r.dispatches), dash(r.grants), dash(r.reopens), dash(r.loops),
  findingsCell(r.findings), dash(r.council),
  r.big_calls === null ? dash(null) : `${r.big_calls}/${r.big_write_share === null ? "-" : `${Math.round(r.big_write_share * 100)}%`}`,
];
export const aggregate = (entries) => entries.map((e) => e.row);
export const renderText = (rows) => [`runs (${rows.length})`, table(HEADER, rows.map(runRow))].join("\n");
