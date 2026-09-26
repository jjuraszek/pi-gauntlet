#!/usr/bin/env node
// Bundle the shipped CLI bins. Sources live in src/bins/ and import the TypeScript
// helpers under extensions/lib/; the committed output at bin/*.mjs is self-contained
// (yaml external) so an npm-installed copy never asks Node to strip types under
// node_modules. Bundles are committed: rerun via `npm run build:bins` after touching
// src/bins/ or extensions/lib/.
import { chmodSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildSync } from "esbuild";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

for (const name of ["gauntlet-telemetry-seal", "gauntlet-performance"]) {
  const outfile = join(root, "bin", `${name}.mjs`);
  buildSync({
    absWorkingDir: root,
    entryPoints: [join("src", "bins", `${name}.mjs`)],
    outfile,
    bundle: true,
    format: "esm",
    platform: "node",
    external: ["yaml"],
    logLevel: "warning",
  });
  chmodSync(outfile, 0o755);
  console.log(`built bin/${name}.mjs`);
}
