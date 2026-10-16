import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync, unlinkSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { sha256 } from "./checks.mjs";

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
}

export function payloadSha(cell) {
  return sha256(JSON.stringify(canonical(cell)));
}

export function cellReusable(record, model, identity) {
  if (!record) return false;
  if (record.skillSha !== identity.skillSha || record.inputSha !== identity.inputSha || record.kind !== identity.kind || record.assembly !== identity.assembly) return false;
  if (record.models?.thinking !== identity.thinking || !record.models?.replay?.includes(model)) return false;
  return record.outputs?.[model]?.status === "ok";
}

export function baselineFresh(record, models, identity) {
  const stale = models.filter((m) => !cellReusable(record, m, identity));
  return { fresh: stale.length === 0, stale };
}

const JUDGE_KEYS = ["factsSha", "judgePromptSha", "intentSha", "baselineOutputSha", "candidateOutputSha"];
export function judgmentCurrent(stored, current) {
  return !!stored && JUDGE_KEYS.every((k) => stored[k] === current[k]);
}

export function promote(candidate) {
  const { judge, refresh, ...rest } = candidate;
  return { ...rest, arm: "baseline" };
}

export function readRecord(resultsDir, sample, arm) {
  const p = join(resultsDir, sample, `${arm}.json`);
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
}
export function writeRecordAtomic(resultsDir, sample, arm, record) {
  const dir = join(resultsDir, sample);
  mkdirSync(dir, { recursive: true });
  const temporary = join(dir, `.${arm}.${randomUUID()}.tmp`);
  try {
    writeFileSync(temporary, JSON.stringify(record, null, 2) + "\n", { flag: "wx" });
    renameSync(temporary, join(dir, `${arm}.json`));
  } catch (error) {
    try { unlinkSync(temporary); } catch { /* Preserve the original persistence error. */ }
    throw error;
  }
}

export function writeRecord(resultsDir, sample, arm, record) {
  mkdirSync(join(resultsDir, sample), { recursive: true });
  writeFileSync(join(resultsDir, sample, `${arm}.json`), JSON.stringify(record, null, 2) + "\n");
}
