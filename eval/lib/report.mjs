export function renderReport({ target, forSha, change, rows, partial, exit }) {
  const out = [`# eval report: ${target}${partial ? ` (partial run: ${partial})` : ""}`, "", `for: ${forSha}`, "", "## Change", "", change, "", "## Cells", "", "| sample | model | verdict | facts |", "|---|---|---|---|"];
  for (const r of rows) {
    const facts = Object.entries(r.facts ?? {}).map(([id, f]) => `${id}: ${f.before} -> ${f.after} (${f.label})`).join("; ");
    const mech = Object.entries(r.mechanical ?? {}).filter(([id]) => !Object.hasOwn(r.facts ?? {}, id)).map(([id, v]) => `${id}: ${v}`).join("; ");
    out.push(`| ${r.sample} | ${r.model} | ${r.verdict} | ${[facts, mech].filter(Boolean).join("; ")} |`);
  }
  out.push("", "## Feedback", "");
  for (const r of rows) if (r.feedback) out.push(`- ${r.sample} / ${r.model}: ${r.feedback}`);
  for (const r of rows) if (r.error) out.push(`- ${r.sample} / ${r.model}: error - ${r.error}`);
  out.push("", `exit: ${exit}`, "");
  return out.join("\n");
}
