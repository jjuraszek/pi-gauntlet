import { rmSync } from "node:fs";
import { join } from "node:path";
import { CONFIG, RUNS, HERE, VARIANTS, ISO_HOME, ensure, writeJson } from "./lib.mjs";
import { prepareVariants } from "./variants.mjs";
import { extractCase } from "./extract.mjs";
import { runScout } from "./scout.mjs";
import { driveRun } from "./drive.mjs";
import { judgeCell } from "./judge.mjs";
import { buildReport } from "./report.mjs";

const smoke = process.argv.includes("--smoke");
const onlyIdx = process.argv.indexOf("--only");
const only = onlyIdx > -1 ? process.argv[onlyIdx + 1].split(",") : null;
const repsIdx = process.argv.indexOf("--reps");
if (repsIdx > -1) CONFIG.reps = Number(process.argv[repsIdx + 1]);
const cases = smoke ? CONFIG.cases.slice(0, 1) : only ? CONFIG.cases.filter((c) => only.includes(c.label)) : CONFIG.cases;
const candidates = smoke ? CONFIG.models.candidates.slice(0, 1) : CONFIG.models.candidates;
const judges = smoke ? CONFIG.models.judges.slice(0, 1) : CONFIG.models.judges;
const reps = smoke ? 1 : CONFIG.reps;
rmSync(RUNS, { recursive: true, force: true });
rmSync(join(HERE, "report.md"), { force: true });
ensure(RUNS);
writeJson(join(RUNS, "incomplete.json"), ["run did not finish"]);

try {
const variants = prepareVariants();
if (!smoke && variants.before.skillMd === variants.after.skillMd) {
  throw new Error("Before and after brainstorming skill hashes are identical; no change to evaluate.");
}
console.log("variants", JSON.stringify(variants));
for (const c of cases) extractCase(c);

const incompleteRuns = [];
for (const c of cases) {
  const failedScouts = [];
  for (const variant of ["before", "after"]) {
    let ok = false;
    for (let attempt = 1; attempt <= 2 && !ok; attempt++) {
      try { const r = await runScout(c.label, variant, variants); ok = true; console.log(`scout ${c.label}/${variant}: framing=${r.framing}`); }
      catch (err) { console.error(`scout ${c.label}/${variant} attempt ${attempt}: ${err.message}`); }
    }
    if (!ok) failedScouts.push(variant);
  }
  if (failedScouts.length) {
    for (const candidate of candidates) for (const variant of ["before", "after"]) for (let rep = 1; rep <= reps; rep++) {
      incompleteRuns.push(`${c.label}/${candidate}/${variant}/${rep}: scout ${failedScouts.join(", ")} failed`);
    }
    continue;
  }
  for (const candidate of candidates) for (const variant of ["before", "after"]) for (let rep = 1; rep <= reps; rep++) {
    let run = await driveRun({ caseLabel: c.label, candidate, variant, rep, variants });
    if (!run.complete && !run.abort) { console.error(`incomplete ${c.label}/${candidate}/${variant}/${rep}: ${run.incomplete_reason} - re-running once`); run = await driveRun({ caseLabel: c.label, candidate, variant, rep, variants }); }
    if (run.abort) {
      incompleteRuns.push(`${c.label}/${candidate}/${variant}/${rep}: ${run.incomplete_reason}`);
      continue;
    }
    if (!run.complete) incompleteRuns.push(`${c.label}/${candidate}/${variant}/${rep}`);
    console.log(`drive ${c.label}/${candidate}/${variant}/${rep}: complete=${run.complete} turns=${run.turns} facts=${JSON.stringify(run.facts)}`);
  }
  for (const candidate of candidates) for (const judge of judges) {
    const j = await judgeCell(c.label, candidate, judge, { smoke });
    console.log(`judge ${c.label}/${candidate}/${judge}: ${j.verdict} baseline=${j.baseline}`);
  }
}
writeJson(join(RUNS, "incomplete.json"), incompleteRuns);
const { outcome, rows, baseline } = buildReport({ smoke, only });
console.log("\nOUTCOME", outcome);
console.table(rows.map((r) => ({ case: r.case, candidate: r.candidate, majority: r.verdict })));
console.log("baseline", baseline);
} finally {
  rmSync(VARIANTS, { recursive: true, force: true });
  rmSync(ISO_HOME, { recursive: true, force: true });
}
