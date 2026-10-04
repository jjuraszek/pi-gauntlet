#!/usr/bin/env node
// Eval driver for skills/forge-skill: one worker edit per sample, two reviewers vote per
// must-hold fact, arithmetic aggregation. Models are arguments, never defaults.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const LEVELS = ["wrong", "blunt", "acceptable", "clean", "exemplary"];
export const WORKER_TIMEOUT_MS = 10 * 60 * 1000;
export const USAGE = [
  "usage: node eval/forge-skill/run.mjs --skill-dir <path> --candidate-model <id> --reviewers <id>,<id> [--thinking <level>] [--out <dir>] [--sample <slug>]",
  "       node eval/forge-skill/run.mjs compare <baseline-aggregate.json> <candidate-aggregate.json>",
  "       node eval/forge-skill/run.mjs median <agg1.json> <agg2.json> <agg3.json> [<out.json>]",
].join("\n");
const HERE = dirname(fileURLToPath(import.meta.url));

export class UsageError extends Error {}

export function parseArgs(argv) {
  const opts = { thinking: "medium", out: null, sample: null };
  for (let i = 0; i < argv.length; i += 2) {
    const flag = argv[i];
    const value = argv[i + 1];
    if (value === undefined) throw new UsageError(USAGE);
    if (flag === "--skill-dir") opts.skillDir = resolve(value);
    else if (flag === "--candidate-model") opts.candidateModel = value;
    else if (flag === "--reviewers") opts.reviewers = value.split(",").map((s) => s.trim()).filter(Boolean);
    else if (flag === "--thinking") opts.thinking = value;
    else if (flag === "--out") opts.out = resolve(value);
    else if (flag === "--sample") opts.sample = value;
    else throw new UsageError(USAGE);
  }
  if (!opts.skillDir || !opts.candidateModel || !opts.reviewers) throw new UsageError(USAGE);
  if (new Set(opts.reviewers).size < 2) throw new UsageError(`--reviewers needs two distinct model strings\n${USAGE}`);
  if (!existsSync(join(opts.skillDir, "SKILL.md"))) throw new UsageError(`${opts.skillDir}/SKILL.md is absent\n${USAGE}`);
  return opts;
}

export function sha256(...parts) {
  const h = createHash("sha256");
  for (const p of parts) h.update(p);
  return h.digest("hex");
}

// case.md: one or more ```file <path> fences (3+ backticks, closed by the same run), then one ```request fence.
export function parseCase(text) {
  const files = [];
  const fence = /^(`{3,})file (\S+)\n([\s\S]*?)\n\1$/gm;
  let m;
  while ((m = fence.exec(text))) files.push({ path: m[2], text: `${m[3]}\n` });
  const req = /^(`{3,})request\n([\s\S]*?)\n\1$/m.exec(text);
  if (!files.length || !req) throw new Error("case.md needs one or more ```file <path> blocks and one ```request block");
  return { files, request: req[2].trim() };
}

export function parseExpected(text) {
  const facts = text.split("\n").filter((l) => l.startsWith("- ")).map((l) => l.slice(2).trim());
  if (!facts.length) throw new Error("expected.md has no `- ` fact bullets");
  return facts;
}

export function parseReview(text, factCount) {
  const block = /```(?:json)?[ \t]*\n([\s\S]*?)\n```/.exec(text);
  if (!block) throw new Error("no parseable JSON block");
  const raw = block[1];
  let obj;
  try {
    obj = JSON.parse(raw);
  } catch (e) {
    throw new Error(`no parseable JSON block: ${e.message}`);
  }
  const n = Array.isArray(obj.votes) ? obj.votes.length : "none";
  if (n !== factCount) throw new Error(`votes must have ${factCount} entries, got ${n}`);
  if (obj.votes.some((v) => v !== "yes" && v !== "no")) throw new Error('every vote is "yes" or "no"');
  if (!LEVELS.includes(obj.level)) throw new Error(`level must be one of ${LEVELS.join(", ")}, got ${JSON.stringify(obj.level)}`);
  if (typeof obj.rationale !== "string") throw new Error("rationale must be a string");
  return { votes: obj.votes, level: obj.level, rationale: obj.rationale };
}

export function aggregate(facts, reviews, workerStatus) {
  if (workerStatus !== "ok") return { status: "worker-failed", facts: facts.map((text) => ({ text, status: "lost" })) };
  if (reviews.some((r) => r.status !== "ok")) return { status: "reviewer-invalid", facts: facts.map((text) => ({ text, status: "disputed" })) };
  return {
    status: "ok",
    facts: facts.map((text, i) => {
      const yes = reviews.filter((r) => r.votes[i] === "yes").length;
      return { text, status: yes === reviews.length ? "kept" : yes === 0 ? "lost" : "disputed" };
    }),
  };
}

export function buildReviewerPrompt(template, { facts, request, diff, files }) {
  const factList = facts.map((f, i) => `${i + 1}. ${f}`).join("\n");
  const fileBlocks = files.map((f) => `\`\`\`\`\`\` ${f.path} (${f.lines} lines)\n${f.text}\`\`\`\`\`\``).join("\n\n");
  return [template, "## Must-hold facts", factList, "## Edit request", request, "## Unified diff", `\`\`\`\`\`\` diff\n${diff}\`\`\`\`\`\``, "## Files after the edit", fileBlocks].join("\n\n");
}

export function listFiles(root) {
  const paths = [];
  (function walk(dir) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name === ".git") continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else paths.push(p);
    }
  })(root);
  return paths
    .map((p) => {
      const text = readFileSync(p, "utf8");
      const lines = text.endsWith("\n") ? text.split("\n").length - 1 : text.split("\n").length;
      return { path: relative(root, p).split("\\").join("/"), text, lines };
    })
    .sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
}

export function materialize(root, files) {
  for (const f of files) {
    mkdirSync(dirname(join(root, f.path)), { recursive: true });
    writeFileSync(join(root, f.path), f.text);
  }
}

function git(cwd, ...args) {
  return execFileSync("git", ["-c", "user.email=eval@local", "-c", "user.name=eval", ...args], { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

export function skillIdentity(skillDir) {
  let sha;
  try {
    sha = git(skillDir, "rev-parse", "HEAD").trim();
  } catch {
    throw new UsageError(`${skillDir} is not inside a git checkout; the skill SHA is part of the record`);
  }
  const dirty = git(skillDir, "status", "--porcelain", "--", ".").trim() !== "";
  const body = readFileSync(join(skillDir, "SKILL.md"), "utf8");
  return { skillSha: dirty ? `${sha}-dirty` : sha, skillHash: sha256(body) };
}

export function defaultPi(args, { cwd, timeoutMs }) {
  const r = spawnSync("pi", args, { cwd, encoding: "utf8", timeout: timeoutMs, maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
  if (r.error) return { status: "failed", stdout: r.stdout || "", stderr: `${r.error.message}\n${r.stderr || ""}` };
  if (r.status !== 0) return { status: "failed", stdout: r.stdout || "", stderr: r.stderr || `exit ${r.status}` };
  return { status: "ok", stdout: r.stdout, stderr: r.stderr };
}

function reviewOnce(pi, model, prompt, factCount) {
  const args = (p) => ["-p", "--model", model, "--no-tools", "--no-extensions", "--no-skills", "--no-context-files", "--no-session", p];
  let error = "";
  let attempt = pi(args(prompt), { cwd: tmpdir(), timeoutMs: WORKER_TIMEOUT_MS });
  for (let i = 0; i < 2; i++) {
    if (attempt.status !== "ok") error = attempt.stderr;
    else {
      try {
        return { model, status: "ok", ...parseReview(attempt.stdout, factCount) };
      } catch (e) {
        error = e.message;
      }
    }
    if (i === 0) attempt = pi(args(`${prompt}\n\nYour previous reply was rejected: ${error}. Reply again with exactly one fenced JSON block.`), { cwd: tmpdir(), timeoutMs: WORKER_TIMEOUT_MS });
  }
  return { model, status: "reviewer-invalid", error };
}

export function runSample({ slug, sampleDir, opts, identity, reviewerPrompt, pi = defaultPi }) {
  const started = Date.now();
  const caseText = readFileSync(join(sampleDir, "case.md"), "utf8");
  const expectedText = readFileSync(join(sampleDir, "expected.md"), "utf8");
  const { files, request } = parseCase(caseText);
  const facts = parseExpected(expectedText);
  const scratch = mkdtempSync(join(tmpdir(), `forge-eval-${slug}-`));
  materialize(scratch, files);
  git(scratch, "init", "-q");
  git(scratch, "add", "-A");
  git(scratch, "commit", "-q", "-m", "fixture");

  const worker = pi(
    ["-p", "--model", opts.candidateModel, "--thinking", opts.thinking, "--tools", "read,edit,write", "--no-extensions", "--no-skills", "--skill", opts.skillDir, "--no-context-files", "--no-session", `/skill:forge-skill ${request}\n\nFiles in this checkout: ${files.map((f) => f.path).join(", ")}`],
    { cwd: scratch, timeoutMs: WORKER_TIMEOUT_MS },
  );
  git(scratch, "add", "-A");
  const diff = worker.status === "ok" ? git(scratch, "diff", "--cached", "HEAD") : "";
  const workerStatus = worker.status === "ok" && diff.trim() !== "" ? "ok" : "failed";
  const after = listFiles(scratch);
  const reviews = [];
  if (workerStatus === "ok") {
    const prompt = buildReviewerPrompt(reviewerPrompt, { facts, request, diff, files: after });
    for (const model of opts.reviewers) reviews.push(reviewOnce(pi, model, prompt, facts.length));
  }
  const agg = aggregate(facts, reviews, workerStatus);
  return {
    sample: slug,
    scratch,
    skillDir: opts.skillDir,
    skillSha: identity.skillSha,
    skillHash: identity.skillHash,
    taskHash: sha256(caseText, expectedText),
    reviewerPromptHash: sha256(reviewerPrompt),
    candidateModel: opts.candidateModel,
    thinking: opts.thinking,
    reviewers: reviews,
    diff,
    files: after.map(({ path, lines }) => ({ path, lines })),
    wallMs: Date.now() - started,
    workerStderr: workerStatus === "ok" ? "" : worker.stderr || "empty diff",
    status: agg.status,
    facts: agg.facts,
  };
}

export function summarize(records, opts, identity, reviewerPromptHash, runId) {
  const totals = { kept: 0, disputed: 0, lost: 0 };
  const samples = records.map((r) => {
    const counts = { kept: 0, disputed: 0, lost: 0 };
    for (const f of r.facts) counts[f.status]++;
    for (const k of Object.keys(counts)) totals[k] += counts[k];
    return { sample: r.sample, status: r.status, counts, levels: r.reviewers.map((x) => x.level ?? "invalid"), facts: r.facts, scratch: r.scratch };
  });
  return {
    runId,
    skillDir: opts.skillDir,
    skillSha: identity.skillSha,
    skillHash: identity.skillHash,
    candidateModel: opts.candidateModel,
    thinking: opts.thinking,
    reviewers: opts.reviewers,
    reviewerPromptHash,
    taskHashes: Object.fromEntries(records.map((r) => [r.sample, r.taskHash])),
    totals,
    samples,
  };
}

export function renderTable(agg) {
  const rows = agg.samples.map((s) => `| ${s.sample} | ${s.counts.kept} | ${s.counts.disputed} | ${s.counts.lost} | ${s.levels.join(", ")} |`);
  return ["| sample | kept | disputed | lost | levels |", "|---|---|---|---|---|", ...rows, `| total | ${agg.totals.kept} | ${agg.totals.disputed} | ${agg.totals.lost} | |`].join("\n");
}

export function compare(base, cand) {
  const refusals = [];
  const same = (k, a, b) => {
    if (JSON.stringify(a) !== JSON.stringify(b)) refusals.push(`${k} differs: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
  };
  same("reviewerPromptHash", base.reviewerPromptHash, cand.reviewerPromptHash);
  same("candidateModel", base.candidateModel, cand.candidateModel);
  same("thinking", base.thinking, cand.thinking);
  same("reviewers", base.reviewers, cand.reviewers);
  same("taskHashes", base.taskHashes, cand.taskHashes);
  for (const [label, agg] of [["baseline", base], ["candidate", cand]]) {
    if (String(agg.skillSha).endsWith("-dirty")) refusals.push(`${label} skill SHA is dirty: ${agg.skillSha}`);
    for (const s of agg.samples) if (s.status !== "ok") refusals.push(`${label} sample ${s.sample} status ${s.status}`);
  }
  if (refusals.length) return { exit: 2, lines: refusals.map((r) => `refused: ${r}`) };
  const lines = [];
  let regressions = 0;
  const after = new Map(cand.samples.flatMap((s) => s.facts.map((f) => [`${s.sample}\u0000${f.text}`, f.status])));
  for (const s of base.samples) {
    for (const f of s.facts) {
      const now = after.get(`${s.sample}\u0000${f.text}`);
      if (now === undefined) continue;
      if (f.status === "kept" && now === "lost") {
        regressions++;
        lines.push(`regression: ${s.sample}: "${f.text}" kept -> lost`);
      } else if (f.status !== now) lines.push(`moved: ${s.sample}: "${f.text}" ${f.status} -> ${now}`);
    }
  }
  lines.push(`kept: baseline ${base.totals.kept} -> candidate ${cand.totals.kept}; regressions: ${regressions}`);
  return { exit: regressions ? 1 : 0, lines };
}

export function median(aggs) {
  const refusals = [];
  if (aggs.length !== 3) refusals.push(`median needs exactly 3 aggregates, got ${aggs.length}`);
  const [first] = aggs;
  for (const k of ["skillSha", "skillHash", "taskHashes", "reviewerPromptHash", "candidateModel", "thinking", "reviewers"]) {
    for (const a of aggs.slice(1)) {
      if (JSON.stringify(a[k]) !== JSON.stringify(first[k])) refusals.push(`${k} differs: ${JSON.stringify(first[k])} vs ${JSON.stringify(a[k])}`);
    }
  }
  for (const [i, a] of aggs.entries()) for (const s of a.samples ?? []) if (s.status !== "ok") refusals.push(`run ${i} sample ${s.sample} status ${s.status}`);
  if (refusals.length) return { exit: 2, lines: refusals.map((r) => `refused: ${r}`) };
  const totals = { kept: 0, disputed: 0, lost: 0 };
  const samples = first.samples.map((s0) => {
    const others = aggs.map((a) => a.samples.find((s) => s.sample === s0.sample));
    const facts = s0.facts.map((f, i) => {
      const votes = others.map((s) => s.facts[i].status);
      const win = ["kept", "lost", "disputed"].find((st) => votes.filter((v) => v === st).length >= 2) ?? "disputed";
      return { text: f.text, status: win };
    });
    const counts = { kept: 0, disputed: 0, lost: 0 };
    for (const f of facts) counts[f.status]++;
    for (const k of Object.keys(counts)) totals[k] += counts[k];
    return { sample: s0.sample, status: "ok", counts, levels: others.flatMap((s) => s.levels ?? []), facts };
  });
  const { samples: _s, totals: _t, runId, ...identity } = first;
  return { exit: 0, aggregate: { ...identity, runIds: aggs.map((a) => a.runId), totals, samples } };
}

export function main(argv, pi = defaultPi) {
  if (argv[0] === "median") {
    if (argv.length !== 4 && argv.length !== 5) throw new UsageError(USAGE);
    const r = median(argv.slice(1, 4).map((p) => JSON.parse(readFileSync(p, "utf8"))));
    if (r.exit) { console.log(r.lines.join("\n")); return r.exit; }
    const out = argv[4] ?? join(dirname(argv[1]), "median.json");
    writeFileSync(out, JSON.stringify(r.aggregate, null, 2));
    console.log(renderTable(r.aggregate));
    console.log(`median: ${out}`);
    return 0;
  }
  if (argv[0] === "compare") {
    if (argv.length !== 3) throw new UsageError(USAGE);
    const r = compare(JSON.parse(readFileSync(argv[1], "utf8")), JSON.parse(readFileSync(argv[2], "utf8")));
    console.log(r.lines.join("\n"));
    return r.exit;
  }
  const opts = parseArgs(argv);
  const identity = skillIdentity(opts.skillDir);
  const reviewerPrompt = readFileSync(join(HERE, "reviewer-prompt.md"), "utf8");
  const sampleRoot = join(HERE, "sample");
  const slugs = readdirSync(sampleRoot)
    .filter((s) => statSync(join(sampleRoot, s)).isDirectory())
    .sort()
    .filter((s) => !opts.sample || s === opts.sample);
  if (!slugs.length) throw new UsageError(`no sample matches ${opts.sample}`);
  const runId = new Date().toISOString().replace(/[:.]/g, "-");
  const outDir = join(opts.out ?? mkdtempSync(join(tmpdir(), "forge-eval-out-")), runId);
  mkdirSync(outDir, { recursive: true });
  const records = [];
  for (const slug of slugs) {
    const rec = runSample({ slug, sampleDir: join(sampleRoot, slug), opts, identity, reviewerPrompt, pi });
    writeFileSync(join(outDir, `${slug}.json`), JSON.stringify(rec, null, 2));
    console.error(`${slug}: ${rec.status} (${rec.wallMs} ms) scratch ${rec.scratch}`);
    records.push(rec);
  }
  const agg = summarize(records, opts, identity, sha256(reviewerPrompt), runId);
  writeFileSync(join(outDir, "aggregate.json"), JSON.stringify(agg, null, 2));
  console.log(renderTable(agg));
  console.log(`aggregate: ${join(outDir, "aggregate.json")}`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    if (e instanceof UsageError) {
      console.error(e.message);
      process.exit(64);
    }
    throw e;
  }
}
