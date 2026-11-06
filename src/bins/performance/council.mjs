import { num, obj, str, table } from "./shared.mjs";

export const key = "council";
const SEVERITIES = ["blocker", "major", "minor"];
const COUNTERS = ["total", "unique", "applied", "unique_applied", "deferred", "rejected"];
const MIN_RUNS = 5;
const HEADER = ["member", "total", "unique", "applied", "uniq_appl", "deferred", "rejected", "uniq_appl_nonminor/run"];

const zero = () => ({ blocker: 0, major: 0, minor: 0 });
const addInto = (acc, src) => { for (const s of SEVERITIES) acc[s] += num(obj(src)?.[s]) ?? 0; };
const sum = (c) => c.blocker + c.major + c.minor;
const cell = (c) => `${c.blocker}/${c.major}/${c.minor}`;
const pct = (x) => `${Math.round(x * 100)}%`;

function flagsFor(members, runs) {
  const share = (m) => (sum(m.total) === 0 ? null : sum(m.rejected) / sum(m.total));
  const quiet = Object.entries(members).filter(([, m]) => share(m) !== null && share(m) < 0.25);
  const out = [];
  for (const [name, m] of Object.entries(members)) {
    if (m.unique_applied_nonminor_per_run < 0.2) {
      out.push({ member: name, rule: "low_unique_applied", detail: `${m.unique_applied_nonminor_per_run.toFixed(2)} unique-and-applied blocker/major per run in ${runs} runs (total ${cell(m.total)})` });
    }
    const s = share(m);
    const other = quiet[0];
    if (s !== null && s > 0.5 && other) {
      out.push({ member: name, rule: "high_rejection", detail: `rejected ${pct(s)} vs ${other[0]} ${pct(share(other[1]))} (total ${cell(m.total)})` });
    }
  }
  return out;
}

export function aggregate(entries) {
  const groups = new Map();
  for (const [i, e] of entries.entries()) {
    const members = obj(obj(e.council)?.members);
    if (!members) continue;
    const roster = Object.keys(members).sort();
    const k = JSON.stringify([e.row.repo, roster]);
    if (!groups.has(k)) groups.set(k, { repo: e.row.repo, roster, entries: [] });
    groups.get(k).entries.push(e);
    groups.get(k).last = i;
  }
  return [...groups.values()].sort((a, b) => b.last - a.last).map((g) => {
    const runs = g.entries.length;
    const members = {};
    for (const m of g.roster) members[m] = { dispatches: 0, ...Object.fromEntries(COUNTERS.map((c) => [c, zero()])) };
    const chairs = new Map();
    for (const e of g.entries) {
      for (const m of g.roster) {
        const src = obj(e.council.members[m]);
        members[m].dispatches += num(src?.dispatches) ?? 0;
        for (const c of COUNTERS) addInto(members[m][c], src?.[c]);
      }
      const ch = obj(e.council.chair);
      const model = str(ch?.model) ?? "unknown";
      const c = chairs.get(model) ?? { model, runs: 0, clusters: 0, reported: 0, retried_runs: 0 };
      c.runs += 1;
      c.clusters += num(ch?.clusters) ?? 0;
      c.reported += num(ch?.members_reported) ?? 0;
      if ((num(ch?.dispatches) ?? 1) > 1) c.retried_runs += 1;
      chairs.set(model, c);
    }
    for (const m of g.roster) members[m].unique_applied_nonminor_per_run = (members[m].unique_applied.blocker + members[m].unique_applied.major) / runs;
    const chairList = [...chairs.values()]
      .sort((a, b) => b.runs - a.runs || a.model.localeCompare(b.model))
      .map((c) => ({ model: c.model, runs: c.runs, avg_clusters: c.clusters / c.runs, avg_members_reported: c.reported / c.runs, retried_runs: c.retried_runs }));
    return { repo: g.repo, roster: g.roster, runs, members, chairs: chairList, flags: runs >= MIN_RUNS ? flagsFor(members, runs) : [] };
  });
}

export function renderText(agg) {
  if (!agg.length) return "council\nno council data in selected records";
  const out = ["council", "severity is the chair's consolidated severity (highest any co-raiser assigned), not the member's own"];
  for (const g of agg) {
    out.push(`repo: ${g.repo}`, `roster (${g.runs} runs): ${g.roster.join(", ")}`);
    const rows = g.roster.map((m) => {
      const x = g.members[m];
      return [m, cell(x.total), cell(x.unique), cell(x.applied), cell(x.unique_applied), cell(x.deferred), cell(x.rejected), x.unique_applied_nonminor_per_run.toFixed(2)];
    });
    for (const line of table(HEADER, rows).split("\n")) out.push(`  ${line}`);
    for (const c of g.chairs) out.push(`  chair: ${c.model} - ${c.runs} runs, avg ${c.avg_clusters.toFixed(1)} clusters from ${c.avg_members_reported.toFixed(1)} members reported, retried in ${c.retried_runs}`);
    if (g.runs < MIN_RUNS) out.push(`  not enough runs to assess (${g.runs} of ${MIN_RUNS})`);
    for (const f of g.flags) out.push(`  flag: ${f.member} - ${f.detail}`);
  }
  return out.join("\n");
}
