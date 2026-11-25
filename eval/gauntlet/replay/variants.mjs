import { join, dirname } from "node:path";
import { rmSync, cpSync, existsSync, globSync } from "node:fs";
import { CONFIG, HERE, VARIANTS, ISO_HOME, ensure, sha256, sh, writeJson } from "./lib.mjs";

export function prepareVariants() {
  rmSync(VARIANTS, { recursive: true, force: true });
  const before = ensure(join(VARIANTS, "skills-a"));
  sh("bash", ["-c", `git -C "${CONFIG.gauntletWorktree}" archive "${CONFIG.gauntletBaseCommit}" skills | tar -x -C "${before}"`]);
  const after = ensure(join(VARIANTS, "skills-b"));
  cpSync(join(CONFIG.gauntletWorktree, "skills"), join(after, "skills"), { recursive: true });
  const specIndex = join(VARIANTS, "gauntlet-spec-index.mjs");
  cpSync(join(CONFIG.gauntletWorktree, "bin/gauntlet-spec-index.mjs"), specIndex);
  cpSync(join(CONFIG.gauntletWorktree, "node_modules/yaml"), join(VARIANTS, "node_modules/yaml"), { recursive: true, dereference: true });
  const record = { specIndex };
  for (const v of ["before", "after"]) {
    const dir = join(v === "before" ? before : after, "skills");
    const gatherers = globSync("**/gatherer.md", { cwd: dir });
    if (gatherers.length !== 1) throw new Error(`${v}: expected one context gatherer, found ${gatherers.length}`);
    const gathererPath = join(dir, gatherers[0]);
    let owner = dirname(gathererPath);
    while (owner !== dir && !existsSync(join(owner, "SKILL.md"))) owner = dirname(owner);
    if (owner === dir) throw new Error(`${v}: no entry owns ${gathererPath}`);
    const skillPath = join(owner, "SKILL.md");
    record[v] = {
      skillsDir: dir, skillPath, gathererPath,
      skillMd: sha256(skillPath),
      gathererMd: sha256(gathererPath),
    };
  }
  writeJson(join(HERE, "variants.json"), record);
  return record;
}

if (process.argv[1] && process.argv[1].endsWith("variants.mjs")) {
  try { console.log(JSON.stringify(prepareVariants(), null, 2)); }
  finally {
    rmSync(VARIANTS, { recursive: true, force: true });
    rmSync(ISO_HOME, { recursive: true, force: true });
  }
}
