export const VERDICT_ORDER = ["error", "inconclusive", "regressed", "unchanged", "improved"];

export function parseJudgeReply(text, factIds) {
  const blocks = [...text.matchAll(/```(?:json)?[ \t]*\n([\s\S]*?)\n```/g)];
  if (blocks.length !== 1) throw new Error(`judge reply must contain exactly one fenced JSON block (found ${blocks.length})`);
  const block = blocks[0];
  let obj;
  try { obj = JSON.parse(block[1]); } catch (e) { throw new Error(`judge JSON invalid: ${e.message}`); }
  if (!obj?.facts || typeof obj.facts !== "object") throw new Error("judge JSON lacks facts");
  for (const id of factIds) {
    const f = obj.facts[id];
    if (!f) throw new Error(`judge JSON missing fact ${id}`);
    for (const k of ["before", "after"]) if (!["holds", "fails"].includes(f[k])) throw new Error(`judge JSON ${id} ${k} must be holds or fails`);
  }
  if (typeof obj.feedback !== "string") throw new Error("judge JSON lacks feedback");
  return { facts: Object.fromEntries(factIds.map((id) => [id, { before: obj.facts[id].before, after: obj.facts[id].after }])), feedback: obj.feedback };
}

export function deriveLabels(sample, outcomes, moves) {
  const out = {};
  for (const [id, { before, after }] of Object.entries(outcomes)) {
    const listed = moves.find((m) => m.sample === sample && m.fact === id);
    let label;
    if (before === after) label = listed ? "intended but unchanged" : before === "holds" ? "held" : "pre-existing";
    else if (listed && listed.from === before && listed.to === after) label = "intended change";
    else if (after === "fails") label = "regression";
    else label = "unexplained change";
    out[id] = { before, after, label };
  }
  return out;
}

export function cellVerdict(labels) {
  const ls = Object.values(labels).map((l) => l.label);
  if (ls.some((l) => l === "regression" || l === "unexplained change")) return "regressed";
  if (ls.some((l) => l === "intended change")) return "improved";
  return "unchanged";
}

export function worseVerdict(a, b) {
  return VERDICT_ORDER.indexOf(a) <= VERDICT_ORDER.indexOf(b) ? a : b;
}

export function buildJudgePrompt({ judgeText, caseText, facts, change, moves, before, after, beforeTree, baselineTree, candidateTree }) {
  const factLines = facts.filter((f) => f.kind === "judged").map((f) => `- ${f.id}: ${f.text}`).join("\n");
  const moveLines = moves.length ? moves.map((m) => `- ${m.sample}/${m.fact}: ${m.from} -> ${m.to} - ${m.why ?? ""}`).join("\n") : "(none)";
  const renderTree = (tree) => Object.keys(tree).sort().map((path) => {
    const { lines, content } = tree[path];
    const fence = "`".repeat(Math.max(3, ...[...content.matchAll(/`+/g)].map((m) => m[0].length + 1)));
    return `#### ${path} (${lines} lines)\n\n${fence}\n${content}\n${fence}`;
  }).join("\n\n");
  return [judgeText, "## Case", caseText, "## Facts", factLines, "## Change", change, "## Expected to move", moveLines, ...(beforeTree ? ["## Fixture before", renderTree(beforeTree)] : []), "## Before", before, ...(baselineTree ? ["### Resulting tree", renderTree(baselineTree)] : []), "## After", after, ...(candidateTree ? ["### Resulting tree", renderTree(candidateTree)] : [])].join("\n\n");
}
