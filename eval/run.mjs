#!/usr/bin/env node
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync, rmSync, realpathSync } from "node:fs";
import { join, resolve, dirname, basename, relative } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { parseArgs } from "node:util";
import { MODELS, judgeArg } from "./lib/models.mjs";
import { parseIntent, intentBody } from "./lib/intent.mjs";
import { parseExpected, runMechanical, wordCount, sha256 } from "./lib/checks.mjs";
import { scanText, scanTree, redact } from "./lib/hygiene.mjs";
import { assemble, parseCase, textArgs, editArgs, prepareFixture, captureEdit, readTree, inputSha, baseReader, treeReader, PI_FLAGS } from "./lib/replay.mjs";
import { parseJudgeReply, deriveLabels, cellVerdict, worseVerdict, buildJudgePrompt } from "./lib/judge.mjs";
import { baselineFresh, judgmentCurrent, promote, readRecord, writeRecord, writeRecordAtomic, payloadSha, cellReusable } from "./lib/records.mjs";
import { renderReport } from "./lib/report.mjs";
import { spawnCommand, limiter } from "./lib/spawn.mjs";
import { lintTarget } from "./lib/lint.mjs";

export const defaultSpawn = (args, options) => spawnCommand("pi", args, options);
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
  for (const key of ["outputs", "judge"]) {
    if (record[key]) record[key] = Object.fromEntries(MODELS.replay.filter((model) => model in record[key]).map((model) => [model, record[key][model]]));
  }
  const path = join(results, sample, `${arm}.json`);
  if (!existsSync(path) || read(path) !== JSON.stringify(record, null, 2) + "\n") {
    record.repoSha = repoSha;
    writeRecord(results, sample, arm, record);
  }
}

async function confirm(entry, replayCell, judgeCell, labels) {
  const again = await replayCell();
  const judged = again.status === "ok" ? await judgeCell(again) : { error: again.error };
  entry.confirmation = { ...again };
  if (judged.wallMs !== undefined) entry.confirmation.judgeWallMs = judged.wallMs;
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

async function judgeEntry({ current, previous, judgeCell, candidate, labels, replayCell, refresh = false }) {
  if (!refresh && judgmentCurrent(previous, current)) return previous;
  const judged = await judgeCell(candidate);
  if (judged.error) return { verdict: "error", error: judged.error, ...(refresh ? { wallMs: judged.wallMs } : {}) };
  const entry = { ...current, facts: labels(judged, candidate), feedback: judged.feedback, wallMs: judged.wallMs };
  entry.verdict = cellVerdict(entry.facts);
  if (entry.verdict === "regressed") await confirm(entry, replayCell, judgeCell, labels);
  if (entry.verdict === "error") for (const key of Object.keys(current)) delete entry[key];
  return entry;
}
async function replay({ target, skill, skillFiles, replayText, caseText, fixtureDir, facts, model, spawn }) {
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
    const out = await spawn(args, { cwd, input });
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

async function judge({ spawn, judgeText, caseText, facts, intent, before, after, beforeTree, baselineTree, candidateTree, denylist }) {
  const prompt = buildJudgePrompt({ judgeText, caseText, facts, ...intent, before, after, beforeTree, baselineTree, candidateTree });
  let error = "", wallMs = 0;
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await spawn([...PI_FLAGS, "--no-tools", ...judgeArg()], { cwd: tmpdir(), input: prompt + (attempt ? `\n\nYour previous reply was rejected: ${error}. Reply again with exactly one fenced JSON block.` : "") });
    wallMs += res.wallMs ?? 0;
    const safe = safeOutput(res.stdout || res.stderr || "", denylist);
    if (safe.error) return { error: safe.error, text: safe.text, wallMs };
    if (res.status !== "ok") { error = redact(res.stderr || "judge failed", denylist); continue; }
    try { return { ...parseJudgeReply(safe.text, facts.filter((f) => f.kind === "judged").map((f) => f.id)), wallMs }; }
    catch (e) { error = e.message; }
  }
  return { error, wallMs };
}
function labeled(sample, judged, facts, before, after, moves) {
  const outcomes = { ...judged.facts };
  const b = before.mechanical;
  for (const [id, value] of Object.entries(after.mechanical)) outcomes[id] = { before: b[id], after: value };
  return deriveLabels(sample, outcomes, moves);
}

export async function runTarget({ root, target: name, sample: only, baselineOnly = false, refreshJudgments = false, base, spawn = defaultSpawn, concurrency = process.env.EVAL_CONCURRENCY ?? 4, signal, refreshWriter = writeRecordAtomic }) {
  const started = Date.now();
  if (refreshJudgments && (!only || baselineOnly)) return { exit: 2, message: "refresh judgments requires one sample and cannot use --baseline-only" };
  const dir = join(root, "eval", name);
  const refuse = (message) => ({ exit: 2, message });
  const pool = Number(concurrency);
  if (!Number.isInteger(pool) || pool < 1) return refuse(`EVAL_CONCURRENCY must be a positive integer, got ${concurrency}`);
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
  const checkedAssembly = (reader, ref, skillFiles, bundle = []) => {
    const parts = skillFiles.map((file) => {
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
  forSha = sha256(checkedAssembly(treeRead, "working tree", target.skillFiles));
  intentParsed = baselineOnly ? undefined : parseIntent(intentText, forSha, knownFacts);
  if (intentParsed && intentParsed.status !== "ok") return refuse(`intent: ${intentParsed.reason}`);
  const rawFiles = (reader) => target.skillFiles.map((file) => ({ path: file.path, content: reader(file.path) }));
  const baseFiles = target.kind === "edit" ? rawFiles(baseRead) : undefined;
  const candFiles = target.kind === "edit" ? rawFiles(treeRead) : undefined;
  for (const sample of names.filter((n) => !only || n === only)) {
    const sdir = join(dir, "samples", sample);
    const { bundle, drop, text: caseText } = parseCase(read(join(sdir, "case.md")));
    const skillFiles = target.skillFiles.filter((file) => !drop.includes(file.path));
    const expectedText = read(join(sdir, "expected.md"));
    const { facts } = parseExpected(expectedText);
    const baseSkill = checkedAssembly(baseRead, baseRef, skillFiles, bundle);
    const candSkill = checkedAssembly(treeRead, "working tree", skillFiles, bundle);
    const skillHygiene = scanText(baseSkill + "\n" + candSkill, target.denylist);
    if (skillHygiene.length) return refuse(`hygiene: skill assembly: ${skillHygiene.map((h) => h.rule).join(",")}`);
    const fixtureDir = join(sdir, "fixture");
    const input = inputSha(replayText, caseText, bundle, target.kind === "edit" ? fixtureDir : null);
    const beforeTree = target.kind === "edit" ? readTree(fixtureDir) : undefined;
    plans.push({ baseFiles, candFiles, beforeTree, sample, caseText, expectedText, facts, baseSkill, candSkill, fixtureDir, input });
  }
  } catch (e) { return refuse(e.message); }
  const results = join(dir, "results");
  const counts = { replay: 0, judge: 0, confirm: 0 };
  const limited = limiter(pool);
  let persistenceError;
  // The pooled unit is one adapter call; orchestration above it never holds a slot while awaiting.
  const call = (args, options) => limited(async () => {
    if (signal?.aborted || (refreshJudgments && persistenceError)) return { status: "error", stderr: signal?.aborted ? (refreshJudgments ? "refresh interrupted" : "aborted") : "refresh persistence failed", wallMs: 0 };
    try { return await spawn(args, { ...options, signal }); }
    catch (e) { return { status: "error", stderr: e?.message ?? String(e), wallMs: 0 }; }
  });
  const intentSha = sha256(intentBody(intentText));
  const judgePromptSha = sha256(judgeText);
  const identityFor = (skill, input) => ({ skillSha: sha256(skill), inputSha: input, kind: target.kind, assembly: target.assembly ?? "n/a", thinking: MODELS.thinking });
  let admitted;
  if (refreshJudgments && signal?.aborted) return { exit: 130, message: `${name}: refresh ${only} interrupted before admission; records and report.md unchanged` };
  if (refreshJudgments) {
    const plan = plans[0];
    admitted = {};
    for (const arm of ["baseline", "candidate"]) {
      try {
        admitted[arm] = readRecord(results, plan.sample, arm);
        for (const model of MODELS.replay) {
          if (!cellReusable(admitted[arm], model, identityFor(arm === "baseline" ? plan.baseSkill : plan.candSkill, plan.input))) return refuse(`${plan.sample}/${arm}/${model}: saved reply is not reusable`);
          const cell = admitted[arm].outputs[model];
          if (typeof cell.text !== "string") return refuse(`${plan.sample}/${arm}/${model}: saved reply text must be a string`);
          if (target.kind === "edit") {
            const tree = cell.tree;
            if (!tree || typeof tree !== "object" || Array.isArray(tree) || Object.values(tree).some((entry) =>
              !entry || typeof entry !== "object" || Array.isArray(entry) || typeof entry.content !== "string" || !Number.isInteger(entry.lines) || entry.lines < 0)) {
              return refuse(`${plan.sample}/${arm}/${model}: saved reply tree must contain entries with string content and nonnegative integer lines`);
            }
          }
        }
      } catch (error) { return refuse(MODELS.replay.map((model) => `${plan.sample}/${arm}/${model}: ${error.message}`).join("\n")); }
    }
  }
  const rowsBySample = plans.map(() => []);
  const baselineErrors = [];
  const runSample = async (plan, index) => {
    const { sample, facts, baseSkill, candSkill, input, expectedText } = plan;
    const identity = (skill) => identityFor(skill, input);
    const freshRecord = (arm, skill) => ({ sample, arm, ...identity(skill), models: { replay: [...MODELS.replay], judge: MODELS.judge, thinking: MODELS.thinking }, outputs: {} });
    const replayCell = (skill, model, skillFiles, kind = "replay") => { counts[kind]++; return replay({ ...plan, target, skill, skillFiles, replayText, model, spawn: call }); };
    const judgeSpawn = (args, options) => { counts.judge++; return call(args, options); };
    if (refreshJudgments) {
      const { baseline, candidate: cand } = admitted;
      const previous = Object.fromEntries(MODELS.replay.map((model) => {
        const old = cand.judge?.[model];
        return [model, old ? { ...structuredClone(old), judgeModel: old.judgeModel ?? null, thinking: old.thinking ?? null,
          ...Object.fromEntries(["factsSha", "judgePromptSha", "intentSha", "baselineOutputSha", "candidateOutputSha"].map((key) => [key, old[key] ?? null])) } : null];
      }));
      const outputIdentity = (record, arm) => Object.fromEntries(MODELS.replay.map((model) => [model, { [`${arm}OutputSha`]: sha256(record.outputs[model].text), payloadSha: payloadSha(record.outputs[model]) }]));
      cand.refresh = { status: "running", identity: { sample, kind: target.kind, assembly: target.assembly ?? "n/a",
        baselineSkillSha: sha256(baseSkill), candidateSkillSha: sha256(candSkill), inputSha: input,
        factsSha: sha256(expectedText), judgePromptSha, intentSha,
        models: { replay: [...MODELS.replay], judge: MODELS.judge }, thinking: MODELS.thinking,
        outputs: { baseline: outputIdentity(baseline, "baseline"), candidate: outputIdentity(cand, "candidate") } }, previous, refreshed: {} };
      const provenance = { judgeModel: MODELS.judge, thinking: MODELS.thinking };
      cand.judge ??= {};
      for (const model of MODELS.replay) {
        cand.judge[model] = { verdict: "error", error: "refresh incomplete", ...provenance };
        cand.refresh.refreshed[model] = structuredClone(cand.judge[model]);
      }
      const save = () => {
        cand.repoSha = repoSha;
        try { refreshWriter(results, sample, "candidate", cand); return true; }
        catch (error) {
          persistenceError ??= `${relative(root, join(results, sample, "candidate.json"))}: ${redact(error?.message ?? String(error), target.denylist)}`;
          return false;
        }
      };
      if (!save()) return;
      await Promise.all(MODELS.replay.map(async (model, m) => {
        const b = structuredClone(baseline.outputs[model]), c = structuredClone(cand.outputs[model]);
        b.mechanical = runMechanical(facts, b.text);
        c.mechanical = runMechanical(facts, c.text);
        const current = { factsSha: sha256(expectedText), judgePromptSha, intentSha, baselineOutputSha: sha256(b.text), candidateOutputSha: sha256(c.text) };
        const judgeCell = (after) => judge({ spawn: judgeSpawn, judgeText, ...plan, intent: intentParsed, before: b.text, after: after.text,
          baselineTree: target.kind === "edit" ? b.tree : undefined, candidateTree: target.kind === "edit" ? after.tree : undefined, denylist: target.denylist });
        const entry = await judgeEntry({ current, previous: previous[model], refresh: true, judgeCell, candidate: c,
          labels: (judged, after) => labeled(sample, judged, facts, b, after, intentParsed.moves),
          replayCell: () => replayCell(candSkill, model, plan.candFiles, "confirm") });
        if (signal?.aborted && entry.verdict === "error") entry.error = `refresh interrupted: ${entry.error}`;
        cand.judge[model] = { ...entry, ...provenance };
        cand.refresh.refreshed[model] = structuredClone(cand.judge[model]);
        rowsBySample[index][m] = { sample, model, mechanical: c.mechanical, ...cand.judge[model] };
        save();
      }));
      cand.refresh.status = signal?.aborted ? "interrupted" : "complete";
      save();
      return;
    }
    let baseline = readRecord(results, sample, "baseline");
    const stored = readRecord(results, sample, "candidate");
    if (!baselineFresh(baseline, MODELS.replay, identity(baseSkill)).fresh && stored?.skillSha === sha256(baseSkill)) baseline = promote(structuredClone(stored));
    const stale = baselineFresh(baseline, MODELS.replay, identity(baseSkill)).stale;
    if (!baseline || stale.length === MODELS.replay.length) baseline = freshRecord("baseline", baseSkill);
    const cand = baselineOnly ? null : stored && MODELS.replay.some((m) => cellReusable(stored, m, identity(candSkill))) ? stored : freshRecord("candidate", candSkill);
    if (cand) {
      cand.judge ??= {};
      if (stored?.refresh) cand.refresh = structuredClone(stored.refresh);
    }
    await Promise.all(MODELS.replay.map(async (model, m) => {
      const baselinePromise = stale.includes(model) ? replayCell(baseSkill, model, plan.baseFiles) : baseline.outputs[model];
      const candidatePromise = !baselineOnly && !cellReusable(cand, model, identity(candSkill)) ? replayCell(candSkill, model, plan.candFiles) : cand?.outputs[model];
      const [b, c] = await Promise.all([baselinePromise, candidatePromise]);
      baseline.outputs[model] = b;
      if (baselineOnly) return;
      cand.outputs[model] = c;
      if (b?.status !== "ok" || c.status !== "ok") cand.judge[model] = { verdict: "error", error: c.status !== "ok" ? c.error : `baseline: ${b?.error}` };
      else {
        b.mechanical = runMechanical(facts, b.text);
        c.mechanical = runMechanical(facts, c.text);
        const current = { factsSha: sha256(expectedText), judgePromptSha, intentSha, baselineOutputSha: sha256(b.text), candidateOutputSha: sha256(c.text) };
        const judgeCell = (after) => judge({ spawn: judgeSpawn, judgeText, ...plan, intent: intentParsed, before: b.text, after: after.text, baselineTree: target.kind === "edit" ? b.tree : undefined, candidateTree: target.kind === "edit" ? after.tree : undefined, denylist: target.denylist });
        cand.judge[model] = await judgeEntry({ current, previous: stored?.judge?.[model], judgeCell, candidate: c,
          labels: (judged, after) => labeled(sample, judged, facts, b, after, intentParsed.moves),
          replayCell: () => replayCell(candSkill, model, plan.candFiles, "confirm") });
      }
      rowsBySample[index][m] = { sample, model, mechanical: c.mechanical ?? {}, ...cand.judge[model] };
    }));
    if (signal?.aborted) return;
    writeChanged(results, sample, "baseline", baseline, repoSha);
    if (baselineOnly) {
      for (const model of MODELS.replay) if (baseline.outputs[model]?.status !== "ok") baselineErrors.push(`${sample}/${model}: ${baseline.outputs[model]?.error}`);
      return;
    }
    writeChanged(results, sample, "candidate", cand, repoSha);
  };
  await Promise.all(plans.map(runSample));
  const called = counts.replay + counts.judge + counts.confirm;
  const wall = `wall ${Math.round((Date.now() - started) / 1000)}s`;
  if (persistenceError) return { exit: 1, message: `${name}: refresh ${only} save failed: ${persistenceError}; report.md unchanged` };
  if (signal?.aborted && !refreshJudgments) return { exit: 130, message: `${name}: interrupted (${wall}); in-flight samples not written, report.md not written` };
  if (baselineOnly) return { exit: baselineErrors.length ? 1 : 0, message: baselineErrors.length ? baselineErrors.join("\n") : called ? `baseline seeded (replay ${counts.replay}, ${wall})` : "baseline fresh" };
  const rows = rowsBySample.flat();
  let worst = "improved";
  for (const row of rows) worst = worseVerdict(worst, row.verdict);
  const exit = signal?.aborted ? 130 : ["error", "inconclusive", "regressed"].includes(worst) ? 1 : 0;
  const tally = `${refreshJudgments ? `refresh ${only} [${MODELS.replay.join(", ")}]; ` : ""}replay ${counts.replay}, judge ${counts.judge}, confirm ${counts.confirm}, ${wall}`;
  if (!called) return { exit, message: `${name}: ${worst} (report.md unchanged; ${tally})` };
  writeFileSync(join(dir, "report.md"), renderReport({ target: name, forSha, change: intentParsed.change, rows, partial: only ?? null, ...(refreshJudgments ? { refresh: { sample: only, models: MODELS.replay, status: signal?.aborted ? "interrupted" : "complete" } } : {}), exit, wallMs: Date.now() - started }));
  return { exit, message: `${name}: ${signal?.aborted ? "interrupted" : worst} (report.md written; ${tally})` };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let parsed;
  try {
    parsed = parseArgs({ strict: true, allowPositionals: true, options: { "baseline-only": { type: "boolean" }, "refresh-judgments": { type: "boolean" }, base: { type: "string" } } });
    if (parsed.positionals.length < 1 || parsed.positionals.length > 2) throw new Error("invalid positionals");
  } catch {
    console.error("usage: node eval/run.mjs <target> [<sample>] [--baseline-only] [--refresh-judgments] [--base <ref>]");
    process.exit(2);
  }
  const [target, sample] = parsed.positionals;
  const { base, "baseline-only": baselineOnly, "refresh-judgments": refreshJudgments } = parsed.values;
  const controller = new AbortController();
  process.once("SIGINT", () => controller.abort());
  const result = await runTarget({ root: resolve(dirname(fileURLToPath(import.meta.url)), ".."), target, sample, baselineOnly, refreshJudgments, base, signal: controller.signal });
  console[result.exit ? "error" : "log"](result.message);
  process.exit(result.exit);
}
