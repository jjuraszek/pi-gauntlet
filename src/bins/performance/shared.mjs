export const PHASES = ["brainstorm", "plan", "implement", "verify", "ship"];
export const TOKEN_KEYS = ["input", "output", "cache_read", "cache_write"];
export const BIG_CACHE_WRITE = 50_000;

export const semver = (s) => {
  const m = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(typeof s === "string" ? s.trim() : "");
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : undefined;
};
export const cmpSemver = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
export const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);
export const str = (v) => (typeof v === "string" ? v : null);
export const obj = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v : null);
export const sumOrNull = (vals) => {
  const xs = vals.filter((v) => v !== null);
  return xs.length ? xs.reduce((a, b) => a + b, 0) : null;
};
export const p50 = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
export const stat = (rows, pick) => {
  const xs = rows.map(pick).filter((v) => v !== null && v !== undefined);
  return xs.length ? { p50: p50(xs), max: Math.max(...xs) } : { p50: null, max: null };
};
export const dash = (v) => (v === null || v === undefined ? "-" : String(v));
export const fmtMin = (s) => (s === null ? "-" : `${Math.round(s / 60)}m`);
export const fmtCount = (n) => (n === null ? "-" : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : String(n));
export const fmtCost = (c) => (c === null ? "-" : c.toFixed(2));
export const pair = (s, f) => `${f(s.p50)}/${f(s.max)}`;
export const findingsCell = (f) => (f === null ? "-" : `${dash(f.blocker)}/${dash(f.major)}/${dash(f.minor)}`);
export const table = (header, rows) => {
  const w = header.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
  return [header, ...rows].map((r) => r.map((c, i) => c.padEnd(w[i])).join("  ").trimEnd()).join("\n");
};
