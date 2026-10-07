import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, relative, isAbsolute } from "node:path";
import { parseExpected } from "./checks.mjs";

export const KINDS = ["text", "edit"];
export const ASSEMBLIES = ["concat", "headed"];

export function lintTarget(dir) {
  const errs = [];
  for (const f of ["target.json", "replay.md", "intent.md", "README.md"]) if (!existsSync(join(dir, f))) errs.push(`${f} missing`);
  let target = null;
  if (existsSync(join(dir, "target.json"))) {
    try { target = JSON.parse(readFileSync(join(dir, "target.json"), "utf8")); } catch (e) { errs.push(`target.json invalid: ${e.message}`); }
  }
  if (target) {
    if (!KINDS.includes(target.kind)) errs.push(`unknown kind: ${target.kind}`);
    if ((target.kind === "text" || Object.hasOwn(target, "assembly")) && !ASSEMBLIES.includes(target.assembly)) errs.push(`unknown assembly: ${target.assembly}`);
    if (!Array.isArray(target.skillFiles) || target.skillFiles.length === 0) errs.push("skillFiles empty");
    else for (const f of target.skillFiles) {
      if (!f.path) errs.push("skillFiles entry without path");
      if (target.kind === "edit" && f.path && target.skillFiles[0].path) {
        const base = dirname(target.skillFiles[0].path);
        const rel = relative(base, f.path);
        if (isAbsolute(f.path) || rel === ".." || rel.startsWith("../")) errs.push(`skillFiles entry ${f.path}: must be under ${base}`);
      }
      if (target.kind === "edit" && ["slice", "sliceTo", "body"].some((key) => Object.hasOwn(f, key))) errs.push(`skillFiles entry ${f.path}: slice/body not allowed for kind edit`);
    }
    if (target.kind === "text" && !(Number.isInteger(target.wordCap) && target.wordCap > 0)) errs.push("wordCap must be a positive integer");
    if (target.denylist !== undefined && !Array.isArray(target.denylist)) errs.push("denylist must be an array");
  }
  const samples = join(dir, "samples");
  if (!existsSync(samples)) { errs.push("samples/ missing"); return errs; }
  const names = readdirSync(samples).filter((n) => statSync(join(samples, n)).isDirectory()).sort();
  if (!names.length) errs.push("samples/ empty");
  for (const n of names) {
    const s = join(samples, n);
    for (const f of ["case.md", "expected.md"]) if (!existsSync(join(s, f))) errs.push(`${n}: ${f} missing`);
    if (existsSync(join(s, "expected.md"))) { try { parseExpected(readFileSync(join(s, "expected.md"), "utf8")); } catch (e) { errs.push(`${n}: ${e.message}`); } }
    if (target?.kind === "edit" && existsSync(join(s, "case.md")) && /^bundle\+:/m.test(readFileSync(join(s, "case.md"), "utf8"))) errs.push(`${n}: bundle+ not allowed for kind edit`);
    if (target?.kind === "edit" && !existsSync(join(s, "fixture"))) errs.push(`${n}: kind edit needs fixture/`);
    if (target?.kind === "text" && existsSync(join(s, "fixture"))) errs.push(`${n}: kind text must not have fixture/`);
  }
  return errs;
}

// Only immediate directories are targets; nested replay directories are not visited.
export function lintAll(evalRoot) {
  const out = {};
  for (const n of readdirSync(evalRoot).sort()) {
    const p = join(evalRoot, n);
    if (n === "lib" || !statSync(p).isDirectory()) continue;
    out[n] = lintTarget(p);
  }
  return out;
}
