import { cmpSemver, dash, fmtCost, fmtCount, fmtMin, pair, semver, stat, table } from "./shared.mjs";

export const key = "by_version";
const HEADER = ["repo", "version", "n", "shipped", "truncated", "wall p50/max", "tokens p50/max", "cost p50/max", "disp p50", "grants p50/max", "reopens p50/max", "loops p50/max", "findings p50 b/M/m", "models"];
const versionOrder = (a, b) => {
  const x = semver(a), y = semver(b);
  return x && y ? cmpSemver(x, y) : x ? -1 : y ? 1 : 0;
};
export function aggregate(entries) {
  const rows = entries.map((e) => e.row);
  const groups = new Map();
  for (const r of rows) {
    const key = JSON.stringify([r.repo, r.version]);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }
  return [...groups.values()].sort(([a], [b]) => a.repo.localeCompare(b.repo) || versionOrder(a.version, b.version)).map((all) => {
    const shipped = all.filter((r) => r.status === "shipped" && !r.truncated);
    const models = {};
    for (const r of shipped) for (const m of r.models) models[m] = (models[m] ?? 0) + 1;
    return {
      repo: all[0].repo,
      version: all[0].version,
      n: all.length,
      shipped: shipped.length,
      truncated: all.filter((r) => r.truncated).length,
      wall_s: stat(shipped, (r) => r.wall_s),
      tokens: stat(shipped, (r) => r.tokens),
      cost: stat(shipped, (r) => r.cost),
      dispatches: { p50: stat(shipped, (r) => r.dispatches).p50 },
      grants: stat(shipped, (r) => r.grants),
      reopens: stat(shipped, (r) => r.reopens),
      loops: stat(shipped, (r) => r.loops),
      findings: {
        blocker: { p50: stat(shipped, (r) => r.findings?.blocker ?? null).p50 },
        major: { p50: stat(shipped, (r) => r.findings?.major ?? null).p50 },
        minor: { p50: stat(shipped, (r) => r.findings?.minor ?? null).p50 },
      },
      models,
    };
  });
}
const versionRow = (g) => [
  g.repo, g.version, String(g.n), String(g.shipped), String(g.truncated), pair(g.wall_s, fmtMin), pair(g.tokens, fmtCount), pair(g.cost, fmtCost),
  dash(g.dispatches.p50), pair(g.grants, dash), pair(g.reopens, dash), pair(g.loops, dash),
  `${dash(g.findings.blocker.p50)}/${dash(g.findings.major.p50)}/${dash(g.findings.minor.p50)}`,
  Object.entries(g.models).map(([m, n]) => `${m}:${n}`).join(",") || "-",
];
export const renderText = (agg) => ["by version", table(HEADER, agg.map(versionRow))].join("\n");
