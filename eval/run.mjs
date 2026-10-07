#!/usr/bin/env node
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync, rmSync, realpathSync } from "node:fs";
import { join, resolve, dirname, basename, relative } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { execFileSync, spawnSync } from "node:child_process";
import { parseArgs } from "node:util";
import { MODELS, judgeArg } from "./lib/models.mjs";
import { parseIntent } from "./lib/intent.mjs";
import { parseExpected, runMechanical, wordCount, sha256 } from "./lib/checks.mjs";
import { scanText, scanTree, redact } from "./lib/hygiene.mjs";
import { assemble, parseCase, textArgs, editArgs, prepareFixture, captureEdit, readTree, inputSha, baseReader, treeReader, PI_FLAGS } from "./lib/replay.mjs";
import { parseJudgeReply, deriveLabels, cellVerdict, worseVerdict, buildJudgePrompt } from "./lib/judge.mjs";
import { baselineFresh, judgmentCurrent, promote, readRecord, writeRecord, cellReusable } from "./lib/records.mjs";
import { renderReport } from "./lib/report.mjs";
import { lintTarget } from "./lib/lint.mjs";

export function defaultSpawn(args, { cwd, input }) {
  const start = Date.now();
  const res = spawnSync("pi", args, { cwd, input, encoding: "utf8", timeout: 600000, maxBuffer: 64 * 1024 * 1024 });
  const wallMs = Date.now() - start;
  if (res.error || res.status !== 0 || !res.stdout?.trim()) return { status: "error", stderr: res.error?.code === "ETIMEDOUT" ? "timeout" : res.error ? String(res.error) : res.stderr?.trim() || (res.status !== 0 ? `exit ${res.status}` : "empty output"), wallMs };
  return { status: "ok", stdout: res.stdout, wallMs };
}
const git = (root, ...args) => execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const read = (path) => readFileSync(path, "utf8");

function safeOutput(text, denylist) {
  const hits = scanText(text, denylist);
  return { text: hits.length ? redact(text, denylist) : text, ...(hits.length ? { error: `hygiene: ${[...new Set(hits.map((h) => h.rule))].join(",")}` } : {}) };
}

function editInput(skillFiles, caseText, fixtureDir) {
  const first = skillFiles[0];
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(first.content)?.[1];
  const name = /^name:\s*(.+?)\s*$/m.exec(frontmatter ?? "")?.[1].replace(/^["']|["']$/g, "") ?? basename(dirname(first.path));
  return `/skill:${name} ${caseText}\n\nFiles in this checkout: ${Object.keys(readTree(fixtureDir)).sort().join(", ")}`;
}

function writeChanged(results, sample, arm, record, repoSha) {
  const path = join(results, sample, `${arm}.json`);
  if (!existsSync(path) || read(path) !== JSON.stringify(record, null, 2) + "\n") {
    record.repoSha = repoSha;
    writeRecord(results, sample, arm, record);
  }
}

function confirm(entry, replayCell, judgeCell, labels) {
  const again = replayCell();
  const judged = again.status === "ok" ? judgeCell(again) : { error: again.error };
  entry.confirmation = { ...again };
  if (judged.error) {
    entry.confirmation.error = judged.error;
    entry.error = judged.error;
    entry.verdict = "error";
    return;
  }
  entry.confirmation.facts = labels(judged, again);
  entry.confirmation.feedback = judged.feedback;
  const reproduced = Object.entries(entry.facts).some(([id, fact]) =>
    ["regression", "unexplained change"].includes(fact.label) && entry.confirmation.facts[id]?.label === fact.label);
  if (!reproduced) entry.verdict = "inconclusive";
}

function judgeEntry({ current, previous, judgeCell, candidate, labels, replayCell }) {
  if (judgmentCurrent(previous, current)) return previous;
  const judged = judgeCell(candidate);
  if (judged.error) return { verdict: "error", error: judged.error };
  const entry = { ...current, facts: labels(judged, candidate), feedback: judged.feedback };
  entry.verdict = cellVerdict(entry.facts);
  if (entry.verdict === "regressed") confirm(entry, replayCell, judgeCell, labels);
  if (entry.verdict === "error") for (const key of Object.keys(current)) delete entry[key];
  return entry;
}

function replay({ target, skill, skillFiles, replayText, caseText, fixtureDir, facts, model, spawn }) {
  const dir = mkdtempSync(join(tmpdir(), "eval-skill-"));
  const path = join(dir, "SKILL.md");
  let cwd = dir;
  try {
    if (target.kind === "edit") {
      for (const file of skillFiles) {
        const destination = join(dir, relative(dirname(skillFiles[0].path), file.path));
        mkdirSync(dirname(destination), { recursive: true });
        writeFileSync(destination, file.content);
      }
      cwd = prepareFixture(fixtureDir);
    } else writeFileSync(path, skill);
    const args = target.kind === "edit" ? editArgs(model, dir) : textArgs(model, path);
    const input = target.kind === "edit" ? editInput(skillFiles, caseText, fixtureDir) : `${replayText}\n\n${caseText}`;
    const scratchPaths = [...new Set([dir, cwd].flatMap((scratch) => [scratch, realpathSync(scratch)]))].sort((a, b) => b.length - a.length);
    const scrub = (text) => scratchPaths.reduce((output, scratch) => output.replaceAll(scratch, "<scratch>"), text);
    const out = spawn(args, { cwd, input });
    if (out.status !== "ok") {
      const safe = safeOutput(scrub(out.stderr || "replay failed"), target.denylist);
      return { status: "error", error: safe.error || safe.text, ...(safe.error ? { text: safe.text } : {}), wallMs: out.wallMs };
    }
    const stdout = safeOutput(scrub(out.stdout || ""), target.denylist);
    if (stdout.error) return { status: "error", ...stdout, words: wordCount(stdout.text), wallMs: out.wallMs };
    const captured = target.kind === "edit" ? captureEdit(cwd) : null;
    const safe = safeOutput(scrub(captured ? captured.diff : stdout.text), target.denylist);
    const cell = { status: safe.error ? "error" : "ok", ...safe, words: wordCount(safe.text), wallMs: out.wallMs };
    if (captured) {
      cell.tree = {};
      for (const [name, value] of Object.entries(captured.tree)) {
        const entry = safeOutput(scrub(value.content), target.denylist);
        cell.tree[redact(name, target.denylist)] = { ...value, content: entry.text };
        if (entry.error) { cell.status = "error"; cell.error = entry.error; }
      }
    }
    if (!cell.text.trim() && cell.status === "ok") { cell.status = "error"; cell.error = captured ? "worker produced no diff" : "empty output"; }
    if (cell.status === "ok") cell.mechanical = runMechanical(facts, cell.text);
    if (cell.status === "ok" && target.kind === "text" && cell.words > target.wordCap) { cell.status = "error"; cell.error = `${cell.words} words over the ${target.wordCap} cap`; }
    return cell;
  } finally {
    rmSync(dir, { recursive: true, force: true });
    if (cwd !== dir) rmSync(cwd, { recursive: true, force: true });
  }
}

function judge({ spawn, judgeText, caseText, facts, intent, before, after, beforeTree, baselineTree, candidateTree, denylist }) {
  const prompt = buildJudgePrompt({ judgeText, caseText, facts, ...intent, before, after, beforeTree, baselineTree, candidateTree });
  let error = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = spawn([...PI_FLAGS, "--no-tools", ...judgeArg()], { cwd: tmpdir(), input: prompt + (attempt ? `\n\nYour previous reply was rejected: ${error}. Reply again with exactly one fenced JSON block.` : "") });
    const safe = safeOutput(res.stdout || res.stderr || "", denylist);
    if (safe.error) return { error: safe.error, text: safe.text };
    if (res.status !== "ok") { error = res.stderr || "judge failed"; continue; }
    try { return parseJudgeReply(safe.text, facts.filter((f) => f.kind === "judged").map((f) => f.id)); }
    catch (e) { error = e.message; }
  }
  return { error };
}

function labeled(sample, judged, facts, before, after, moves) {
  const outcomes = { ...judged.facts };
  const b = before.mechanical;
  for (const [id, value] of Object.entries(after.mechanical)) outcomes[id] = { before: b[id], after: value };
  return deriveLabels(sample, outcomes, moves);
}

export function runTarget({ root, target: name, sample: only, baselineOnly = false, base, spawn = defaultSpawn }) {
  const dir = join(root, "eval", name);
  const refuse = (message) => ({ exit: 2, message });
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return refuse(`unknown target: ${name}`);
  const errors = lintTarget(dir);
  if (errors.length) return refuse(`lint: ${name}:\n  ${errors.join("\n  ")}`);
  const target = JSON.parse(read(join(dir, "target.json")));
  const hygiene = scanTree(join(root, "eval"), { denylists: { [name]: target.denylist ?? [] } }).filter((hit) => hit.where.startsWith(`${name}/`));
  if (hygiene.length) return refuse(`hygiene:\n  ${hygiene.map((h) => `${h.where}: ${h.rule}`).join("\n  ")}`);
  let baseRef;
  try { baseRef = base ? git(root, "rev-parse", "--verify", `${base}^{commit}`) : git(root, "merge-base", "HEAD", "origin/main"); }
  catch { return refuse("no valid --base and no origin/main: cannot resolve the baseline ref"); }
  const repoSha = git(root, "rev-parse", "HEAD");
  const replayText = read(join(dir, "replay.md"));
  const judgeText = read(join(root, "eval", "judge.md"));
  const intentText = read(join(dir, "intent.md"));
  const judgeHygiene = scanText(judgeText, target.denylist);
  if (judgeHygiene.length) return refuse(`hygiene: judge.md: ${judgeHygiene.map((h) => h.rule).join(",")}`);
  const names = readdirSync(join(dir, "samples")).filter((n) => statSync(join(dir, "samples", n)).isDirectory()).sort();
  if (only && !names.includes(only)) return refuse(`unknown sample: ${only}`);
  const knownFacts = Object.fromEntries(names.map((n) => [n, parseExpected(read(join(dir, "samples", n, "expected.md"))).facts.map((f) => f.id)]));
  const plans = [];
  const checkedReader = (ref, reader) => (path) => {
    try { return reader(path); }
    catch (e) { throw new Error(`${path} at ${ref}: ${e.message}${ref === baseRef ? "; use --base <ref> to pick a base that has this file" : ""}`); }
  };
  const baseRead = checkedReader(baseRef, baseReader(root, baseRef));
  const treeRead = checkedReader("working tree", treeReader(root));
  const checkedAssembly = (reader, ref, bundle = []) => {
    const parts = target.skillFiles.map((file) => {
      try { return assemble({ ...target, skillFiles: [file] }, reader); }
      catch (e) {
        if (e.message.startsWith(`${file.path} at `)) throw e;
        throw new Error(`${file.path} at ${ref}: ${e.message}`);
      }
    });
    if (bundle.length) parts.push(assemble({ ...target, skillFiles: [] }, reader, bundle));
    return parts.join("\n");
  };
  let forSha, intentParsed;
  try {
  forSha = sha256(checkedAssembly(treeRead, "working tree"));
  intentParsed = baselineOnly ? undefined : parseIntent(intentText, forSha, knownFacts);
  if (intentParsed && intentParsed.status !== "ok") return refuse(`intent: ${intentParsed.reason}`);
  const rawFiles = (reader) => target.skillFiles.map((file) => ({ path: file.path, content: reader(file.path) }));
  const baseFiles = target.kind === "edit" ? rawFiles(baseRead) : undefined;
  const candFiles = target.kind === "edit" ? rawFiles(treeRead) : undefined;
  for (const sample of names.filter((n) => !only || n === only)) {
    const sdir = join(dir, "samples", sample);
    const { bundle, text: caseText } = parseCase(read(join(sdir, "case.md")));
    const expectedText = read(join(sdir, "expected.md"));
    const { facts } = parseExpected(expectedText);
    const baseSkill = checkedAssembly(baseRead, baseRef, bundle);
    const candSkill = checkedAssembly(treeRead, "working tree", bundle);
    const skillHygiene = scanText(baseSkill + "\n" + candSkill, target.denylist);
    if (skillHygiene.length) return refuse(`hygiene: skill assembly: ${skillHygiene.map((h) => h.rule).join(",")}`);
    const fixtureDir = join(sdir, "fixture");
    const input = inputSha(replayText, caseText, bundle, target.kind === "edit" ? fixtureDir : null);
    const beforeTree = target.kind === "edit" ? readTree(fixtureDir) : undefined;
    plans.push({ baseFiles, candFiles, beforeTree, sample, caseText, expectedText, facts, baseSkill, candSkill, fixtureDir, input });
  }
  } catch (e) { return refuse(e.message); }
  const results = join(dir, "results");
  const rows = [];
  let worst = "improved", called = false;
  for (const plan of plans) {
    const { sample, facts, baseSkill, candSkill, input, expectedText } = plan;
    const identity = (skill) => ({ skillSha: sha256(skill), inputSha: input, kind: target.kind, assembly: target.assembly ?? "n/a", thinking: MODELS.thinking });
    const freshRecord = (arm, skill) => ({ sample, arm, ...identity(skill), models: { replay: [...MODELS.replay], judge: MODELS.judge, thinking: MODELS.thinking }, outputs: {} });
    const replayCell = (skill, model, skillFiles) => { called = true; return replay({ ...plan, target, skill, skillFiles, replayText, model, spawn }); };
    let baseline = readRecord(results, sample, "baseline");
    const stored = readRecord(results, sample, "candidate");
    if (stored?.skillSha === sha256(baseSkill)) baseline = promote(structuredClone(stored));
    const stale = baselineFresh(baseline, MODELS.replay, identity(baseSkill)).stale;
    if (!baseline || stale.length === MODELS.replay.length) baseline = freshRecord("baseline", baseSkill);
    for (const model of stale) baseline.outputs[model] = replayCell(baseSkill, model, plan.baseFiles);
    if (baselineOnly) {
      writeChanged(results, sample, "baseline", baseline, repoSha);
      for (const model of MODELS.replay) if (baseline.outputs[model]?.status !== "ok") { worst = "error"; rows.push({ error: `${sample}/${model}: ${baseline.outputs[model]?.error}` }); }
      continue;
    }
    const cand = stored && MODELS.replay.some((m) => cellReusable(stored, m, identity(candSkill))) ? stored : freshRecord("candidate", candSkill);
    cand.judge ??= {};
    for (const model of MODELS.replay) {
      if (!cellReusable(cand, model, identity(candSkill))) { cand.outputs[model] = replayCell(candSkill, model, plan.candFiles); delete cand.judge[model]; }
      const b = baseline.outputs[model], c = cand.outputs[model];
      if (b?.status !== "ok" || c.status !== "ok") cand.judge[model] = { verdict: "error", error: c.status !== "ok" ? c.error : `baseline: ${b?.error}` };
      else {
        b.mechanical = runMechanical(facts, b.text);
        c.mechanical = runMechanical(facts, c.text);
        const current = { factsSha: sha256(expectedText), judgePromptSha: sha256(judgeText), intentSha: sha256(intentText), baselineOutputSha: sha256(b.text), candidateOutputSha: sha256(c.text) };
        const judgeCell = (after) => judge({ spawn, judgeText, ...plan, intent: intentParsed, before: b.text, after: after.text, baselineTree: target.kind === "edit" ? b.tree : undefined, candidateTree: target.kind === "edit" ? after.tree : undefined, denylist: target.denylist });
        cand.judge[model] = judgeEntry({ current, previous: cand.judge[model], judgeCell, candidate: c,
          labels: (judged, after) => labeled(sample, judged, facts, b, after, intentParsed.moves),
          replayCell: () => replayCell(candSkill, model, plan.candFiles) });
      }
      rows.push({ sample, model, mechanical: c.mechanical ?? {}, ...cand.judge[model] });
      worst = worseVerdict(worst, cand.judge[model].verdict);
    }
    writeChanged(results, sample, "baseline", baseline, repoSha);
    writeChanged(results, sample, "candidate", cand, repoSha);
  }
  if (baselineOnly) return { exit: worst === "error" ? 1 : 0, message: worst === "error" ? rows.map((r) => r.error).join("\n") : called ? "baseline seeded" : "baseline fresh" };
  const exit = ["error", "inconclusive", "regressed"].includes(worst) ? 1 : 0;
  writeFileSync(join(dir, "report.md"), renderReport({ target: name, forSha, change: intentParsed.change, rows, partial: only ?? null, exit }));
  return { exit, message: `${name}: ${worst} (report.md written)` };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let parsed;
  try {
    parsed = parseArgs({ strict: true, allowPositionals: true, options: { "baseline-only": { type: "boolean" }, base: { type: "string" } } });
    if (parsed.positionals.length < 1 || parsed.positionals.length > 2) throw new Error("invalid positionals");
  } catch {
    console.error("usage: node eval/run.mjs <target> [<sample>] [--baseline-only] [--base <ref>]");
    process.exit(2);
  }
  const [target, sample] = parsed.positionals;
  const { base, "baseline-only": baselineOnly } = parsed.values;
  const result = runTarget({ root: resolve(dirname(fileURLToPath(import.meta.url)), ".."), target, sample, baselineOnly, base });
  console[result.exit ? "error" : "log"](result.message);
  process.exit(result.exit);
}
