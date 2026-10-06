#!/usr/bin/env node
// Eval driver for /skill:gatekeep-pr step 5-7 rendering (report, menu, one pick). Convention: eval/README.md.
// Candidate and reviewer calls go through `pi -p` (print mode); --out defaults to a fresh dir under $TMPDIR;
// the leak check covers every file under sample/ before any model call.
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { spawnSync, execFileSync } from "node:child_process";
import { tmpdir } from "node:os";

const HERE = dirname(fileURLToPath(import.meta.url));
const SAMPLE_DIR = join(HERE, "sample");
const REVIEWER_PROMPT_PATH = join(HERE, "reviewer-prompt.md");
export const BUNDLE = ["skills/gatekeep-pr/SKILL.md", "skills/gatekeep-pr/verification-brief.md"];
// --persona is a snapshot root (the worktree, or `git archive <sha> skills | tar -x` into $TMPDIR); paths are repo-relative.
export function bundle(root, extra) {
  const refDir = join(root, "skills/gatekeep-pr/reference");
  const refs = existsSync(refDir) ? readdirSync(refDir).filter((f) => f.endsWith(".md")).sort().map((f) => `skills/gatekeep-pr/reference/${f}`) : [];
  const parts = [];
  for (const [files, kind] of [[[...BUNDLE, ...refs], "skill"], [extra, "bundle+"]]) {
    for (const rel of files) {
      const abs = join(root, rel);
      if (!existsSync(abs)) throw new Error(`${kind} file not found: ${rel}`);
      parts.push(`# ${rel}\n${readFileSync(abs, "utf8")}`);
    }
  }
  return parts.join("\n") + "\n";
}
export function splitSource(text) {
  const lines = text.split(/\r?\n/);
  const extra = [];
  while (lines[0]?.startsWith("bundle+: ")) extra.push(lines.shift().slice("bundle+: ".length).trim());
  if (extra.length > 1) throw new Error("source.md carries at most one bundle+ line");
  return { extra, body: lines.join("\n") };
}
const PI_FLAGS = ["-p", "--no-tools", "--no-skills", "--no-extensions", "--no-context-files", "--no-session"];

export const QUALITY = ["unreadable", "engineer-only", "mixed", "readable", "briefing"];
export const READABLE_THRESHOLD = "readable";
export const WORD_CAP = 1200;
export const LOST_TOLERANCE = 0;

export const sha256 = (text) => createHash("sha256").update(text).digest("hex");

export function loadExpected(text) {
  const lines = text.split(/\r?\n/);
  const anonymized = lines[0]?.trim() === "anonymized: true";
  const facts = [];
  for (const line of lines) {
    const m = /^- ([A-Za-z0-9_-]+): (.+)$/.exec(line);
    if (m) facts.push({ id: m[1], text: m[2].trim() });
  }
  return { anonymized, facts };
}

export function loadSample(dir) {
  const source = readFileSync(join(dir, "source.md"), "utf8");
  const expectedText = readFileSync(join(dir, "expected.md"), "utf8");
  const { facts } = loadExpected(expectedText);
  if (facts.length === 0) throw new Error("expected.md has no facts");
  return { source, expectedText, facts };
}

export function metrics(text) {
  const lines = text.split("\n");
  const words = text.split(/\s+/).filter((token) => /[\p{L}\p{N}]/u.test(token)).length;
  const backtick_lines = lines.filter((l) => l.includes("`")).length;
  const path_tokens = text.split(/\s+/).filter((t) => /\w\/\w/.test(t) || /\.(md|mjs|ts|json|yml)$/.test(t.replace(/[`"'.,;:)]+$/, ""))).length;
  return { words, backtick_lines, path_tokens };
}

export function parseReview(text, factIds) {
  const blocks = [...text.matchAll(/```(?:json)?\s*\n([\s\S]*?)```/g)];
  if (blocks.length !== 1) return null;
  let obj;
  try { obj = JSON.parse(blocks[0][1]); } catch { return null; }
  if (!obj || typeof obj !== "object" || !obj.facts || typeof obj.facts !== "object") return null;
  if (!QUALITY.includes(obj.quality) || typeof obj.rationale !== "string") return null;
  const facts = {};
  for (const id of factIds) {
    if (obj.facts[id] !== "yes" && obj.facts[id] !== "no") return null;
    facts[id] = obj.facts[id];
  }
  return { facts, quality: obj.quality, rationale: obj.rationale };
}

export function aggregate(facts) {
  const out = { kept: 0, disputed: 0, lost: 0 };
  for (const judgments of Object.values(facts)) {
    const values = Object.values(judgments);
    if (values.every((v) => v === "yes")) out.kept += 1;
    else if (values.every((v) => v === "no")) out.lost += 1;
    else out.disputed += 1;
  }
  return out;
}

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));

export function leakCheck(sampleDir, denylistPath) {
  if (!denylistPath || !existsSync(denylistPath)) return { status: "skipped" };
  const patterns = readFileSync(denylistPath, "utf8").split("\n").map((l, i) => [l.trim(), i + 1]).filter(([l]) => l && !l.startsWith("#")).map(([l, line]) => {
    try { return new RegExp(l, "i"); } catch { throw new Error(`invalid denylist expression in ${denylistPath}:${line}`); }
  });
  for (const file of walk(sampleDir)) {
    const lines = readFileSync(file, "utf8").split("\n");
    for (let i = 0; i < lines.length; i += 1) if (patterns.some((p) => p.test(lines[i]))) return { status: "hit", file, line: i + 1 };
  }
  return { status: "clean" };
}

const level = (label) => QUALITY.indexOf(label);

export function evaluate(baselineRecords, candidateRecords) {
  const reasons = [];
  const incomplete = [];
  const disputed = [];
  const lost = [];
  const byId = (records) => Object.fromEntries(records.map((r) => [r.sample, r]));
  const base = byId(baselineRecords);
  const cand = byId(candidateRecords);
  const samples = [...new Set([...Object.keys(base), ...Object.keys(cand)])].sort();
  const rows = [];
  if (samples.length === 0) incomplete.push("no samples in either dir");
  for (const sample of samples) {
    const b = base[sample];
    const c = cand[sample];
    if (!b || !c) { incomplete.push(`${sample}: missing ${!b ? "baseline" : "candidate"} arm`); continue; }
    if (b.error || c.error) { incomplete.push(`${sample}: failed arm - ${b.error || c.error}`); continue; }
    if (b.arm !== "baseline" || c.arm !== "candidate" || b.persona_sha256 === c.persona_sha256) { incomplete.push(`${sample}: wrong arms or identical persona_sha256`); continue; }
    if (b.input_sha256 !== c.input_sha256) { incomplete.push(`${sample}: input_sha256 differs`); continue; }
    if (JSON.stringify([...b.reviewers].sort()) !== JSON.stringify([...c.reviewers].sort())) { incomplete.push(`${sample}: reviewer set differs`); continue; }
    const unparsed = [b, c].some((r) => Object.values(r.quality).includes("unparsed") || Object.values(r.facts).some((j) => Object.values(j).includes("unparsed")));
    if (unparsed) { incomplete.push(`${sample}: unparsed reviewer answer`); continue; }
    if (Object.keys(c.facts).length === 0) { incomplete.push(`${sample}: candidate has no facts`); continue; }
    if (c.reviewers.some((r) => level(c.quality[r]) === -1 || level(b.quality[r]) === -1)) { incomplete.push(`${sample}: unknown or missing quality label`); continue; }
    for (const id of new Set([...Object.keys(b.facts), ...Object.keys(c.facts)])) {
      for (const reviewer of c.reviewers) {
        if (b.facts[id]?.[reviewer] === undefined) incomplete.push(`${sample}: fact ${id} missing judgment in baseline for ${reviewer}`);
        const v = c.facts[id]?.[reviewer];
        if (v === undefined) incomplete.push(`${sample}: fact ${id} missing judgment for ${reviewer}`);
      }
      const values = c.reviewers.map((reviewer) => c.facts[id]?.[reviewer]);
      if (values.every((v) => v === "no")) lost.push({ sample, id });
      else if (values.includes("yes") && values.includes("no")) {
        const rejected = c.reviewers.filter((reviewer) => c.facts[id]?.[reviewer] === "no").map((reviewer) => `${reviewer.split("/").pop()}: no`);
        disputed.push(`${sample} ${id} (${rejected.join(", ")})`);
      }
    }
    if (!c.reviewers.some((reviewer) => level(c.quality[reviewer]) >= level(READABLE_THRESHOLD))) reasons.push(`${sample}: no reviewer quality reaches ${READABLE_THRESHOLD}`);
    for (const reviewer of c.reviewers) {
      if (level(c.quality[reviewer]) < level(b.quality[reviewer])) reasons.push(`${sample}: quality dropped ${b.quality[reviewer]} -> ${c.quality[reviewer]} for ${reviewer}`);
    }
    if (c.words > WORD_CAP) reasons.push(`${sample}: ${c.words} words over the ${WORD_CAP} cap`);
    rows.push({ sample, baseline: b, candidate: c });
  }
  if (lost.length > LOST_TOLERANCE) for (const { sample, id } of lost) reasons.push(`${sample}: fact ${id} lost by every reviewer`);
  const status = incomplete.length ? "incomplete" : reasons.length ? "fail" : "pass";
  return { status, exitCode: status === "pass" ? 0 : status === "fail" ? 1 : 2, reasons, incomplete, disputed, lost, rows };
}

export function renderTable(result) {
  const q = (r) => r.reviewers.map((rv) => `${rv.split("/").pop()}=${r.quality[rv]}`).join(" ");
  const a = (r) => `${r.aggregate.kept}/${r.aggregate.disputed}/${r.aggregate.lost}`;
  const lines = ["| sample | words b/c | backtick lines b/c | path tokens b/c | kept/disputed/lost b | kept/disputed/lost c | quality b | quality c |", "|---|---|---|---|---|---|---|---|"];
  for (const { sample, baseline: b, candidate: c } of result.rows) lines.push(`| ${sample} | ${b.words}/${c.words} | ${b.backtick_lines}/${c.backtick_lines} | ${b.path_tokens}/${c.path_tokens} | ${a(b)} | ${a(c)} | ${q(b)} | ${q(c)} |`);
  lines.push("", `result: ${result.status}`);
  for (const r of result.incomplete) lines.push(`incomplete: ${r}`);
  for (const r of result.reasons) lines.push(`fail: ${r}`);
  if (result.lost.length <= LOST_TOLERANCE) for (const { sample, id } of result.lost) lines.push(`lost: ${sample} ${id}`);
  for (const r of result.disputed) lines.push(`disputed: ${r}`);
  return lines.join("\n");
}

function callPi(model, systemPrompt, userMessage, cwd, thinking) {
  // The bundle exceeds Linux's single-argument limit; pi accepts a file path for --system-prompt.
  const systemPath = join(cwd, "system-prompt.md");
  writeFileSync(systemPath, systemPrompt);
  const res = spawnSync("pi", [...PI_FLAGS, "--model", model, ...(thinking ? ["--thinking", thinking] : []), "--system-prompt", systemPath, "--", userMessage], { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 15 * 60 * 1000 });
  if (res.status !== 0) throw new Error(`${res.error?.message ?? `pi exited ${res.status ?? res.signal}` }: ${(res.stderr || "").trim().split("\n").slice(-3).join(" | ")}`);
  const out = (res.stdout || "").trim();
  if (!out) throw new Error("pi returned empty output");
  return out;
}

function review(model, reviewerPrompt, source, facts, candidate, cwd) {
  const user = ["```source", source, "```", "", "```facts", ...facts.map((f) => `- ${f.id}: ${f.text}`), "```", "", "```candidate", candidate, "```"].join("\n");
  const ids = facts.map((f) => f.id);
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const parsed = parseReview(callPi(model, reviewerPrompt, user, cwd), ids);
    if (parsed) return parsed;
  }
  return { facts: Object.fromEntries(ids.map((id) => [id, "unparsed"])), quality: "unparsed", rationale: "unparsed" };
}

export function parseArgs(argv) {
  const opts = { only: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!["--arm", "--candidate-model", "--reviewers", "--persona", "--thinking", "--out", "--only"].includes(key)) throw new Error(`unknown flag ${key}`);
    if (key.startsWith("--") && (argv[i + 1] === undefined || argv[i + 1].startsWith("--"))) throw new Error(`${key} requires a value`);
    if (key === "--only") opts.only.push(argv[++i]);
    else if (key.startsWith("--")) opts[key.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = argv[++i];
  }
  return opts;
}

const USAGE = "usage: run.mjs run --arm baseline|candidate --candidate-model <id> --reviewers <id,id> --persona <snapshot-root> [--thinking <level>] [--out <dir>] [--only <slug>]... | compare <baseline-dir> <candidate-dir>";

function runArm(argv) {
  if (argv.length === 1 && argv[0] === "--help") { console.log(USAGE); return 0; }
  let opts;
  try { opts = parseArgs(argv); } catch (e) { console.error(`run: ${e.message}`); return 64; }
  const available = readdirSync(SAMPLE_DIR).filter((s) => statSync(join(SAMPLE_DIR, s)).isDirectory());
  for (const slug of opts.only) if (!available.includes(slug)) { console.error(`run: unknown sample ${slug}`); return 64; }
  for (const key of ["arm", "candidateModel", "reviewers", "persona"]) if (!opts[key]) { console.error(`run: --${key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())} is required`); return 64; }
  if (!["baseline", "candidate"].includes(opts.arm)) { console.error("run: --arm must be baseline or candidate"); return 64; }
  let leak;
  try { leak = leakCheck(SAMPLE_DIR, process.env.GAUNTLET_EVAL_DENYLIST); } catch (e) { console.error(e.message); return 65; }
  if (leak.status === "skipped") console.log("leak check: skipped (no denylist)");
  if (leak.status === "hit") { console.error(`leak check: hit in ${leak.file}:${leak.line}`); return 65; }
  const slugs = available.filter((s) => opts.only.length === 0 || opts.only.includes(s)).sort();
  const reviewers = opts.reviewers.split(",").map((s) => s.trim()).filter(Boolean);
  const personaRoot = resolve(opts.persona);
  let personaText;
  try { personaText = bundle(personaRoot, []); } catch (e) { console.error(`run: ${e.message}`); return 64; }
  const reviewerPrompt = readFileSync(REVIEWER_PROMPT_PATH, "utf8");
  const out = opts.out ? resolve(opts.out) : mkdtempSync(join(tmpdir(), `eval-${opts.arm}-`));
  mkdirSync(out, { recursive: true });
  const scratch = mkdtempSync(join(tmpdir(), "eval-scratch-"));
  let repoSha;
  try { repoSha = execFileSync("git", ["rev-parse", "HEAD"], { cwd: HERE, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { repoSha = "unknown"; } // a checkout without .git (CI tarball) still records
  let failed = false;
  for (const slug of slugs) {
    const base = { sample: slug, arm: opts.arm, candidate_model: opts.candidateModel, thinking: opts.thinking, reviewers, repo_sha: repoSha };
    let record;
    let facts = [];
    try {
      const sample = loadSample(join(SAMPLE_DIR, slug));
      const { source, expectedText } = sample;
      const { extra, body } = splitSource(source);
      const system = extra.length ? bundle(personaRoot, extra) : personaText;
      base.persona_sha256 = sha256(system);
      facts = sample.facts;
      base.input_sha256 = sha256(source + expectedText + reviewerPrompt);
      const prompt = `${body}\n\nYou are the gatekeep-pr orchestrator at step 5. Steps 1-4 ran; every helper output is inlined above and no tool is available. Render the report (report.md order) and the menu (decision-menu.md) exactly as the skill instructs. When "## Pick" is not "none", execute that pick per post-selection-loop.md against this fixture: write each external command you would run and its payload verbatim, then re-render the menu and handle the named reply. When "## After the gate" is present, answer it last. Do not use tools.`;
      const text = callPi(opts.candidateModel, system, prompt, scratch, opts.thinking);
      const judged = reviewers.map((r) => [r, review(r, reviewerPrompt, source, facts, text, scratch)]);
      const factsOut = Object.fromEntries(facts.map((f) => [f.id, Object.fromEntries(judged.map(([r, j]) => [r, j.facts[f.id]]))]));
      record = { ...base, text, ...metrics(text), facts: factsOut, quality: Object.fromEntries(judged.map(([r, j]) => [r, j.quality])), rationale: Object.fromEntries(judged.map(([r, j]) => [r, j.rationale])), aggregate: aggregate(factsOut) };
    } catch (e) {
      record = { ...base, error: e.message };
    }
    writeFileSync(join(out, `${slug}.json`), JSON.stringify(record, null, 2) + "\n");
    failed ||= Boolean(record.error) || Object.values(record.quality).includes("unparsed");
    console.log(`${slug}: ${record.error ? `failed - ${record.error}` : `${record.words} words, kept ${record.aggregate.kept}/${facts.length}`}`);
  }
  console.log(`records: ${out}`);
  return failed ? 2 : 0;
}

export const loadRecords = (dir) => readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")));

function compare(argv) {
  const [a, b] = argv;
  if (!a || !b) { console.error("compare <baseline-dir> <candidate-dir>"); return 64; }
  try {
    const result = evaluate(loadRecords(resolve(a)), loadRecords(resolve(b)));
    console.log(renderTable(result));
    return result.exitCode;
  } catch (e) {
    console.error(`incomplete: ${e.message}`);
    return 2;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [sub, ...rest] = process.argv.slice(2);
  if (sub === "--help") {
    console.log(USAGE);
    process.exit(0);
  }
  if (sub === "run") process.exit(runArm(rest));
  if (sub === "compare") process.exit(compare(rest));
  console.error(USAGE);
  process.exit(64);
}
