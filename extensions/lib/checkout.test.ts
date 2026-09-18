import assert from "node:assert/strict";
import { after, test } from "node:test";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkoutOf, checkoutOfSync, parseCheckout, gitSync, jjSync, type GitResult } from "./checkout.ts";

const tempDirs: string[] = [];
after(() => { for (const d of tempDirs) rmSync(d, { recursive: true, force: true }); });
const tmp = () => { const d = realpathSync(mkdtempSync(join(tmpdir(), "checkout-test-"))); tempDirs.push(d); return d; };

const out = (lines: string[]): GitResult => ({ code: 0, stdout: lines.join("\n") + "\n" });

test("parseCheckout: primary checkout when git-dir equals common-dir", () => {
  assert.deepEqual(parseCheckout(out(["/repo", "/repo/.git", "/repo/.git"])), { toplevel: "/repo", isPrimary: true });
});

test("parseCheckout: linked worktree when the dirs differ", () => {
  assert.deepEqual(
    parseCheckout(out(["/repo/.worktrees/x", "/repo/.git/worktrees/x", "/repo/.git"])),
    { toplevel: "/repo/.worktrees/x", isPrimary: false },
  );
});

test("parseCheckout: nonzero code or fewer than three lines -> undefined", () => {
  assert.equal(parseCheckout({ code: 128, stdout: "" }), undefined);
  assert.equal(parseCheckout(out(["/repo", "/repo/.git"])), undefined);
});

test("checkoutOf: a file path runs git in its dirname", async () => {
  const dir = tmp();
  writeFileSync(join(dir, "spec.md"), "# s\n");
  const cwds: string[] = [];
  const git = (_args: string[], cwd: string): GitResult => { cwds.push(cwd); return out([dir, dir + "/.git", dir + "/.git"]); };
  assert.deepEqual(await checkoutOf(join(dir, "spec.md"), git), { toplevel: dir, isPrimary: true, via: "git" });
  assert.deepEqual(cwds, [dir]);
});

test("checkoutOf: a nonexistent leaf walks up to the nearest existing ancestor", async () => {
  const dir = tmp();
  mkdirSync(join(dir, "doc"));
  const cwds: string[] = [];
  const git = async (_args: string[], cwd: string): Promise<GitResult> => { cwds.push(cwd); return out([dir, dir + "/.git", dir + "/.git"]); };
  await checkoutOf(join(dir, "doc", "specs", "new.md"), git);
  assert.deepEqual(cwds, [join(dir, "doc")]);
});

test("checkoutOf: an existing directory is used as-is", async () => {
  const dir = tmp();
  const cwds: string[] = [];
  await checkoutOf(dir, (_a, cwd) => { cwds.push(cwd); return out([dir, dir + "/.git", dir + "/.git"]); });
  assert.deepEqual(cwds, [dir]);
});

test("gitSync: never throws; nonzero code outside a repo", () => {
  const r = gitSync(["rev-parse", "--path-format=absolute", "--show-toplevel", "--git-dir", "--git-common-dir"], tmp());
  assert.notEqual(r.code, 0);
  assert.equal(typeof r.stdout, "string");
});

test("checkoutOf: falls back to `jj root` when git fails, added workspace is not primary", async () => {
  const dir = tmp();
  mkdirSync(join(dir, ".jj"));
  writeFileSync(join(dir, ".jj", "repo"), "/main/repo/.jj/repo\n"); // pointer file in added workspaces
  const git = (): GitResult => ({ code: 128, stdout: "" });
  const jj = (args: string[], cwd: string): GitResult => {
    assert.deepEqual(args, ["root"]);
    assert.equal(cwd, dir);
    return { code: 0, stdout: dir + "\n" };
  };
  assert.deepEqual(await checkoutOf(join(dir, "doc", "plan.md"), git, jj), { toplevel: dir, isPrimary: false, via: "jj" });
});

test("checkoutOf: jj primary checkout keeps .jj/repo as a directory", async () => {
  const dir = tmp();
  mkdirSync(join(dir, ".jj", "repo"), { recursive: true });
  const git = (): GitResult => ({ code: 128, stdout: "" });
  const jj = (): GitResult => ({ code: 0, stdout: dir + "\n" });
  assert.deepEqual(await checkoutOf(dir, git, jj), { toplevel: dir, isPrimary: true, via: "jj" });
});

test("checkoutOf: git result wins when it resolves, jj is not consulted", async () => {
  const dir = tmp();
  let jjCalled = false;
  const git = (): GitResult => out([dir, dir + "/.git", dir + "/.git"]);
  const jj = (): GitResult => { jjCalled = true; return { code: 0, stdout: "/elsewhere\n" }; };
  assert.deepEqual(await checkoutOf(dir, git, jj), { toplevel: dir, isPrimary: true, via: "git" });
  assert.equal(jjCalled, false);
});

test("checkoutOf: undefined when neither git nor jj resolves", async () => {
  const fail = (): GitResult => ({ code: 1, stdout: "" });
  assert.equal(await checkoutOf(join(tmp(), "x.md"), fail, fail), undefined);
});

test("jjSync: never throws; nonzero code outside a jj repo", () => {
  const r = jjSync(["root"], tmp());
  assert.notEqual(r.code, 0);
  assert.equal(typeof r.stdout, "string");
});

test("checkoutOfSync: git wins without consulting jj", () => {
  const dir = tmp();
  let jjCalled = false;
  const git = (): GitResult => out([dir, dir + "/.git", dir + "/.git"]);
  const jj = (): GitResult => { jjCalled = true; return { code: 0, stdout: "/elsewhere\n" }; };
  assert.deepEqual(checkoutOfSync(dir, git, jj), { toplevel: dir, isPrimary: true, via: "git" });
  assert.equal(jjCalled, false);
});

test("checkoutOfSync: falls back to `jj root` when git fails", () => {
  const dir = tmp();
  mkdirSync(join(dir, ".jj", "repo"), { recursive: true });
  const git = (): GitResult => ({ code: 128, stdout: "" });
  const jj = (): GitResult => ({ code: 0, stdout: dir + "\n" });
  assert.deepEqual(checkoutOfSync(join(dir, "doc", "specs"), git, jj), { toplevel: dir, isPrimary: true, via: "jj" });
});

test("checkoutOfSync: undefined when neither git nor jj resolves", () => {
  const fail = (): GitResult => ({ code: 1, stdout: "" });
  assert.equal(checkoutOfSync(join(tmp(), "x.md"), fail, fail), undefined);
});
