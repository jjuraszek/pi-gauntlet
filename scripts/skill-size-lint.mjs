import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

function scan(dir, recursive, files) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (recursive && entry.isDirectory()) scan(path, true, files);
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(path);
  }
}

export function lintSkillSizes(root) {
  const files = [];
  scan(join(root, "skills"), true, files);
  scan(join(root, "agents"), false, files);
  const errors = [];
  for (const file of files) {
    const bytes = readFileSync(file);
    const content = bytes.toString("utf8");
    const lines = content === "" ? 0 : content.split("\n").length - (content.endsWith("\n") ? 1 : 0);
    if (bytes.length >= 50000 || lines >= 2000) {
      errors.push(`${relative(root, file)}: ${bytes.length} bytes, ${lines} lines; must be under 50000 bytes and 2000 lines. Extract the touched concern to reference/.`);
    }
  }
  return errors;
}
