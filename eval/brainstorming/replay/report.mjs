import { writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { CONFIG, RUNS, HERE, readJson, slug } from "./lib.mjs";

export function majority(values) {
  const counts = {};
  for (const v of values) counts[v] = (counts[v] || 0) + 1;
  const [top, n] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || [null, 0];
  return n > values.length / 2 && top !== "abstain" ? top : "unresolved";
}

export function buildReport({ smoke = false, only = null } = {}) {
  const incompleteRuns = readJson(join(RUNS, "incomplete.json"));
  const variants = readJson(join(HERE, "variants.json"));
  const cases = smoke ? CONFIG.cases.slice(0, 1) : only ? CONFIG.cases.filter((c) => only.includes(c.label)) : CONFIG.cases;
  const candidates = smoke ? CONFIG.models.candidates.slice(0, 1) : CONFIG.models.candidates;
  const rows = [], rationales = [], baselineVotes = {};
  for (const c of cases) for (const cand of candidates) {
    const dir = join(RUNS, c.label, slug(cand), "judgments");
    const judgments = existsSync(dir) ? CONFIG.models.judges.map((j) => join(dir, `${slug(j)}.json`)).filter((path) => existsSync(path)).map((path) => readJson(path)) : [];
    const verdict = majority(judgments.map((j) => j.verdict));
    for (const j of judgments) if (j.baseline) (baselineVotes[cand] ||= []).push(j.baseline);
    const facts = ["concern_cited", "alternative_named", "pivot_in_set", "pivot_invented"].map((k) => `${k}=${majority(judgments.map((j) => String(j.facts?.[k])))}`).join(" ");
    rows.push({ case: c.label, candidate: cand, judges: judgments.map((j) => `${j.judge}: ${j.verdict}`).join("; "), verdict, facts });
    for (const j of judgments) rationales.push(`- ${c.label} / ${cand} / ${j.judge} (${j.verdict}): ${j.rationale}`);
  }
  const baseline = Object.fromEntries(Object.entries(baselineVotes).map(([k, v]) => [k, majority(v)]));
  const verdicts = rows.map((r) => r.verdict);
  let outcome;
  if (incompleteRuns.length || verdicts.includes("regression")) outcome = "fail";
  else {
    const compliant = Object.entries(baseline).filter(([, b]) => b === "compliant").map(([k]) => k);
    const compliantProgressed = rows.some((r) => compliant.includes(r.candidate) && r.verdict === "progression");
    outcome = compliant.length === 1 && verdicts.every((v) => v !== "unresolved") && compliantProgressed ? "pass" : "not demonstrated";
  }
  const md = [
    `# Brainstorm replay experiment${smoke ? " (smoke)" : only ? ` (cases ${only.join(",")}, reps ${CONFIG.reps})` : ""}`,
    ``,
    `Outcome: **${outcome}**`,
    `Before skill SHA-256: ${variants.before.skillMd}`,
    `After skill SHA-256: ${variants.after.skillMd}`,
    ``,
    `Judge overlap: ${CONFIG.models.judges.filter((j) => CONFIG.models.candidates.some((c) => c.split(":")[0] === j.split(":")[0])).join(", ") || "none"} judge(s) are also candidates.`,
    ``,
    `| case | candidate | judge verdicts | majority | facts |`,
    `|---|---|---|---|---|`,
    ...rows.map((r) => `| ${r.case} | ${r.candidate} | ${r.judges} | ${r.verdict} | ${r.facts} |`),
    ``,
    `Baseline labels: ${Object.entries(baseline).map(([k, v]) => `${k} = ${v}`).join("; ") || "none"}`,
    ``,
    incompleteRuns.length ? `Incomplete runs (after one re-run): ${incompleteRuns.join(", ")}` : `Incomplete runs: none`,
    ``,
    `## Rationales`,
    ``,
    ...rationales,
    ``,
  ].join("\n");
  writeFileSync(join(HERE, "report.md"), md);
  return { outcome, rows, baseline };
}

