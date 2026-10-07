import { createHash } from "node:crypto";

export function sha256(...parts) {
  return createHash("sha256").update(parts.join("\u0000")).digest("hex");
}
export function wordCount(text) {
  return text.split(/\s+/).filter((t) => /[\p{L}\p{N}]/u.test(t)).length;
}

const FACT = /^- ([A-Za-z0-9_-]+): (judged|mechanical): (.+)$/;
const CONTAINS = /^(contains|lacks) "(.+)"$/;
const MATCHES = /^matches \/(.+)\/([a-z]*)$/;

export function parseExpected(text) {
  const lines = text.split(/\r?\n/);
  let anonymized = false;
  let start = 0;
  if (lines[0]?.trim() === "anonymized: true") { anonymized = true; start = 1; }
  const facts = [];
  const seen = new Set();
  for (const line of lines.slice(start)) {
    if (!line.trim()) continue;
    if (!line.startsWith("- ")) throw new Error(`expected.md stray line: ${line}`);
    const m = FACT.exec(line);
    if (!m) {
      if (/^- [A-Za-z0-9_-]+: /.test(line)) throw new Error(`expected.md untagged fact (needs judged: or mechanical:): ${line}`);
      throw new Error(`expected.md malformed fact line: ${line}`);
    }
    const [, id, kind, rest] = m;
    if (seen.has(id)) throw new Error(`expected.md duplicate fact id: ${id}`);
    seen.add(id);
    if (kind === "judged") { facts.push({ id, kind, text: rest.trim() }); continue; }
    const c = CONTAINS.exec(rest.trim());
    const r = MATCHES.exec(rest.trim());
    if (c) facts.push({ id, kind, check: { op: c[1], value: c[2] } });
    else if (r) {
      try { new RegExp(r[1], r[2]); }
      catch { throw new Error(`expected.md malformed mechanical check: ${rest}`); }
      facts.push({ id, kind, check: { op: "matches", source: r[1], flags: r[2] } });
    }
    else throw new Error(`expected.md malformed mechanical check: ${rest}`);
  }
  if (!facts.length) throw new Error("expected.md has no facts");
  return { anonymized, facts };
}

export function runMechanical(facts, output) {
  const out = {};
  for (const f of facts) {
    if (f.kind !== "mechanical") continue;
    const { check } = f;
    let ok;
    if (check.op === "contains") ok = output.includes(check.value);
    else if (check.op === "lacks") ok = !output.includes(check.value);
    else ok = new RegExp(check.source, check.flags).test(output);
    out[f.id] = ok ? "holds" : "fails";
  }
  return out;
}
