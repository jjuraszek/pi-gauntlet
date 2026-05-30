#!/usr/bin/env node
/**
 * Install agents/*.md into the pi-subagents discovery path.
 *
 * Two modes, chosen by where this package was installed:
 *
 *   - PROJECT install (package lives under <repo>/.pi/...): copy personas into
 *     <repo>/.pi/agents/ so pi-subagents discovers them at PROJECT scope. The
 *     dir is install-managed (repos should gitignore .pi/agents/), so
 *     copies are refreshed on every install. Project scope wins over user scope
 *     on name collisions, keeping per-repo installs independent.
 *
 *   - USER/global install (package lives under <home>/.pi/<profile>/...) or a
 *     local-path dev install (no .pi ancestor): symlink personas into ~/.agents/
 *     (the user-scope discovery path). Symlinks refresh on install; non-symlink
 *     files the user dropped there are left alone.
 *
 * Override the target dir via PI_SUPERPOWERS_AGENT_DIR (always symlink mode).
 *
 * Invoked automatically by `npm install` (which pi runs on git package installs)
 * and manually via `npm run link-agents` for local-path dev installs.
 */
import { readdirSync, symlinkSync, unlinkSync, mkdirSync, existsSync, lstatSync, copyFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, basename } from "node:path";
import { homedir } from "node:os";

const PKG_DIR = dirname(fileURLToPath(import.meta.url)).replace(/\/bin$/, "");
const AGENTS_SRC = join(PKG_DIR, "agents");

if (!existsSync(AGENTS_SRC)) {
  console.log(`pi-superpowers: no agents/ dir at ${AGENTS_SRC}; skipping`);
  process.exit(0);
}

const { target, mode } = resolveTarget(PKG_DIR);
if (!existsSync(target)) mkdirSync(target, { recursive: true });

for (const f of readdirSync(AGENTS_SRC).filter((n) => n.endsWith(".md"))) {
  const src = join(AGENTS_SRC, f);
  const dst = join(target, f);
  const dstStat = safelstat(dst);

  if (mode === "copy") {
    // .pi/agents/ is install-managed: refresh our copies unconditionally.
    if (dstStat?.isSymbolicLink()) unlinkSync(dst);
    copyFileSync(src, dst);
    console.log(`pi-superpowers: copied ${dst}`);
    continue;
  }

  if (dstStat === null) {
    symlinkSync(src, dst);
    console.log(`pi-superpowers: linked ${dst}`);
  } else if (dstStat.isSymbolicLink()) {
    unlinkSync(dst);
    symlinkSync(src, dst);
    console.log(`pi-superpowers: refreshed ${dst}`);
  } else {
    console.warn(`pi-superpowers: skip ${dst} (not a symlink; delete to install)`);
  }
}

/**
 * Decide where personas go and how. A project install is one whose nearest
 * `.pi` ancestor is NOT the user's home `.pi` (i.e. `<repo>/.pi`, not
 * `<home>/.pi/<profile>`). Env override always forces user-style symlinks.
 */
function resolveTarget(pkgDir) {
  if (process.env.PI_SUPERPOWERS_AGENT_DIR) {
    return { target: process.env.PI_SUPERPOWERS_AGENT_DIR, mode: "symlink" };
  }
  const piDir = findPiAncestor(pkgDir);
  if (piDir && canonical(dirname(piDir)) !== canonical(homedir())) {
    return { target: join(piDir, "agents"), mode: "copy" };
  }
  return { target: join(homedir(), ".agents"), mode: "symlink" };
}

function findPiAncestor(start) {
  let dir = start;
  for (;;) {
    if (basename(dir) === ".pi") return dir;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function canonical(p) {
  try { return realpathSync(p); } catch { return p; }
}

function safelstat(p) {
  try { return lstatSync(p); } catch { return null; }
}
