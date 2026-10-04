import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { CONFIG, RUNS, CASES, ensure, oneShot, extractJson, slug } from "./lib.mjs";

const RUBRIC = `You judge whether a change to a design-brainstorming skill is a regression, a progression, or neutral for one driver model, from four transcripts of the same historical design discussion: two runs under the BEFORE skill text and two under the AFTER skill text. The shipped spec is reference evidence of what the real team eventually built - a sound alternative the shipped spec did not take also counts.

A transcript ending with \`approaches skipped\` means the driver went from questions straight to a round-1 design or spec; judge its design content as the approach set.

Verdicts:
- regression - the after-runs lose a diagnosis the before-runs had; pivot unilaterally (design proceeds on B/C without asking); drop a recorded user constraint; invent a pivot on a negative-control case (label N1) with no cited concern; make the shipped-spec pivot unreachable from the approach set on a positive case (labels P1/P2); or produce approaches that extend identified debt as the recommendation.
- progression - the after-runs cite a concern to a repo location and name a sound alternative where the before-runs had none; or the approach set is better bounded (viable minimal option present, pattern diagnosis sound) with no regression marker.
- neutral - otherwise.

Also label the BEFORE runs' baseline: "compliant" when they proceed on the ask as framed without challenging it, "pushy" when they challenge or reframe it on their own.

Facts (booleans, judged on the AFTER runs): concern_cited (a framing concern cited to a repo location), alternative_named (an alternative named by the driver itself - lines tagged [sim-supplied-alternative] came from the simulated user and do not count), pivot_in_set (positive cases only: the alternative or the approach set contains the pivot the shipped spec took; null for N1), pivot_invented (N1 only: a pivot was proposed with no cited concern; null for P cases).

Output exactly one JSON object in a json code block:
{"baseline": "compliant"|"pushy", "verdict": "regression"|"progression"|"neutral", "facts": {"concern_cited": bool, "alternative_named": bool, "pivot_in_set": bool|null, "pivot_invented": bool|null}, "rationale": "<= 6 sentences, cite turn numbers>"}`;

function bundle(caseLabel, candidate, smoke) {
  const dir = join(RUNS, caseLabel, slug(candidate));
  const read = (v, r) => existsSync(join(dir, v, `${r}.md`)) ? readFileSync(join(dir, v, `${r}.md`), "utf8") : `(missing run ${v}/${r})`;
  const scout = (v) => readFileSync(join(RUNS, caseLabel, "scout", `${v}.md`), "utf8");
  const spec = readFileSync(join(CASES, caseLabel, "shipped-spec.md"), "utf8");
  const parts = [`# Case ${caseLabel} - candidate ${candidate}`];
  for (const v of ["before", "after"]) {
    parts.push(`\n\n# ${v.toUpperCase()} scout draft\n\n${scout(v)}`);
    for (let r = 1; r <= (smoke ? 1 : CONFIG.reps); r++) parts.push(`\n\n# ${v.toUpperCase()} run ${r}\n\n${read(v, r)}`);
  }
  parts.push(`\n\n# Shipped spec (reference evidence)\n\n${spec}`);
  return parts.join("");
}

const VALID = new Set(["regression", "progression", "neutral"]);

export async function judgeCell(caseLabel, candidate, judgeModel, { smoke = false } = {}) {
  const outDir = ensure(join(RUNS, caseLabel, slug(candidate), "judgments"));
  const outPath = join(outDir, `${slug(judgeModel)}.json`);
  const input = bundle(caseLabel, candidate, smoke);
  let result = null;
  for (let attempt = 1; attempt <= 2 && !result; attempt++) {
    try {
    const raw = await oneShot(judgeModel, RUBRIC, input + (attempt === 2 ? "\n\nYour previous reply was not the required JSON object. Reply with the JSON object only." : ""));
    const parsed = extractJson(raw);
    if (parsed && VALID.has(parsed.verdict) && ["compliant", "pushy"].includes(parsed.baseline)) result = { ...parsed, judge: judgeModel, attempts: attempt };
    } catch (err) {
      console.error(`judge ${judgeModel} attempt ${attempt}: ${err.message}`);
    }
  }
  if (!result) result = { judge: judgeModel, verdict: "abstain", baseline: null, facts: {}, rationale: "non-verdict after re-ask", attempts: 2 };
  writeFileSync(outPath, JSON.stringify(result, null, 2) + "\n");
  return result;
}
