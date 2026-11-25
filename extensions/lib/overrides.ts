import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const locations = [".pi/gauntlet.md", "gauntlet.md", "doc/gauntlet.md"];
const disk = { exists: existsSync, readFile: (path: string) => readFileSync(path, "utf8") };

export function readSharedSection(root: string, section: string, fs: { exists(path: string): boolean; readFile(path: string): string | undefined } = disk): string {
  const path = locations.map(file => join(root, file)).find(file => fs.exists(file));
  if (!path) return "";
  const lines: string[] = [];
  let shared = false, selected = false, fence = "";
  for (const line of (fs.readFile(path) ?? "").split(/\r?\n/)) {
    if (fence) {
      if (line.match(/^ {0,3}(`+|~+)[\t ]*$/)?.[1].startsWith(fence)) fence = "";
    } else {
      fence = line.match(/^ {0,3}(`{3,}|~{3,})/)?.[1] ?? "";
      const heading = /^(#{1,2})[\t ]+(.*)$/.exec(line);
      if (heading) {
        const [, level, name] = heading;
        if (selected || (shared && level === "#")) break;
        if (level === "#") shared = name.trim() === "shared";
        else selected = shared && name.trim() === section;
        continue;
      }
    }
    if (selected) lines.push(line);
  }
  return lines.join("\n");
}
