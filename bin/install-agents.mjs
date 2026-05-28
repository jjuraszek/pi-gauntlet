#!/usr/bin/env node
/**
 * Symlink agents/*.md into ~/.agents/ (pi-subagents user-scope discovery path).
 * Idempotent: refreshes our own symlinks, skips files the user has customized.
 * Override target via PI_SUPERPOWERS_AGENT_DIR.
 *
 * Invoked automatically by `npm install` (which pi runs on git package installs)
 * and manually via `npm run link-agents` for local-path dev installs.
 */
import { readdirSync, symlinkSync, unlinkSync, mkdirSync, existsSync, lstatSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { homedir } from "node:os";

const PKG_DIR = dirname(fileURLToPath(import.meta.url)).replace(/\/bin$/, "");
const AGENTS_SRC = join(PKG_DIR, "agents");
const TARGET = process.env.PI_SUPERPOWERS_AGENT_DIR ?? join(homedir(), ".agents");

if (!existsSync(AGENTS_SRC)) {
  console.log(`pi-superpowers: no agents/ dir at ${AGENTS_SRC}; skipping`);
  process.exit(0);
}

if (!existsSync(TARGET)) mkdirSync(TARGET, { recursive: true });

for (const f of readdirSync(AGENTS_SRC).filter((n) => n.endsWith(".md"))) {
  const src = join(AGENTS_SRC, f);
  const dst = join(TARGET, f);

  const dstStat = safelstat(dst);
  if (dstStat === null) {
    symlinkSync(src, dst);
    console.log(`pi-superpowers: linked ${dst}`);
    continue;
  }

  if (dstStat.isSymbolicLink()) {
    unlinkSync(dst);
    symlinkSync(src, dst);
    console.log(`pi-superpowers: refreshed ${dst}`);
  } else {
    console.warn(`pi-superpowers: skip ${dst} (not a symlink; delete to install)`);
  }
}

function safelstat(p) {
  try { return lstatSync(p); } catch { return null; }
}
