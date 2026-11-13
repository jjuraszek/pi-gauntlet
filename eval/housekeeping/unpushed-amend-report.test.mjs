import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { parseCase, inputSha } from "../lib/replay.mjs";
import { parseExpected, runMechanical, sha256 } from "../lib/checks.mjs";
import { cellReusable, judgmentCurrent } from "../lib/records.mjs";
import { MODELS } from "../lib/models.mjs";

const read = (path) => readFileSync(new URL(`../../skills/housekeeping/${path}`, import.meta.url), "utf8");

test("AC 8 conformance: Delete authorizes only accepted spec deletions through the run's delivery", () => {
  const fix = read("reference/fix.md");
  const card = read("reference/card.md");
  assert.match(card, /Record Delete as `fix` and Keep as `ignore`/);
  assert.match(fix, /execute only recorded picks/);
  assert.match(fix, /Carry excluded items and the human's verbatim instruction into each class/);
  assert.match(fix, /Build jobs from `delivery`/);
  assert.match(fix, /\| `in-place` \| Expected copies of `files` and `specs`: contents, existence and modes, plus the recorded index listing\. \|/,
    "Admission must protect specs as well as ordinary selected files");
  assert.match(fix, /For `spec-superseded`, delete only the accepted `specs` paths and edit no file/,
    "The fix duty must allow deletion of accepted specs, not general edits");
  assert.match(fix, /For every other class, edit only the listed items' files inside the target tree; for `in-place`, edit only selected files/,
    "The ordinary files-only duty must not override the spec deletion exception");
  assert.match(fix, /For `spec-superseded`, the allowed files are exactly the accepted `specs` paths and the only allowed change is their deletion/,
    "Diff validation must reject modified specs, excluded specs and unrelated files");
  assert.match(fix, /For every other class, treat a diff touching a spec-dir or plan-dir path as an edit outside allowed files/);
  assert.match(fix, /Leave mentions of deleted specs in other files, telemetry records and index rows unchanged/);
  assert.match(fix, /For `spec-superseded`, repeat the derived search over only the accepted paths and pass only when none exists/,
    "Removing a banner from an existing file must not count as Delete");
  assert.match(fix, /Review only the class's change against its supplied rule and items/);
  assert.match(fix, /For other classes with `bounds: on`, include the six \[hotfix predicates\]/,
    "Spec deletion review must stay rule-bound rather than reintroducing hotfix eligibility");
  assert.match(fix, /Keep a class only with `SHIP`, passing required checks and a valid allowed-file diff/);
  assert.match(fix, /For `in-place`, never commit or run a command that changes the index/);
  assert.match(fix, /For `in-place`, compare the index listing byte for byte with the recorded one/);
  assert.match(fix, /Restore the class's changed files from the pre-class expected copies/);
  assert.match(fix, /an edit outside allowed files or an index change for `in-place`/);

  assert.match(card, /for Delete, state the removal of the accepted specs first, then the same delivery promise/);
  assert.match(card, /1\. \[ \] Delete - remove the listed specs; <delivery from the table below>/);
  assert.ok(card.includes("| `amend` | Make one commit for this class on the default branch in the primary checkout, fold the kept fixes into the last unpushed commit after the last class, and push nothing. |"),
    "The unpushed Delete promise must use the amend delivery, not push");
});

const local = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("AC 12 conformance: amend is a sequential commit delivery with checked fold and recovery", () => {
  const fix = read("reference/fix.md");
  const spine = read("SKILL.md");
  for (const pattern of [
    /\| `amend` \| Use one job in `root`, with Fix-picked classes in card order\. \| One commit per kept class on top of the recorded `commit`\. \|/,
    /\| `pr-per-class`, `commit-push`, `amend` \| Expected HEAD and clean status/,
    /\| `commit-push`, `amend` \| Reset its worktree to the pre-class commit, preserving earlier kept class commits/,
    /Run `commit-push`, `amend` and `in-place` classes one after another/,
    /For `pr-per-class` only, leave the primary checkout's tracked files unchanged/,
    /For `amend`, allow staging and committing on the primary for the class commits and the fold/,
    /Treat `amend` as a commit delivery throughout these stages/,
    /only with at least one kept class/,
    /recorded default branch is checked out, HEAD equals expected HEAD, and the index and worktree are clean/,
    /complete ordered parent list and message/,
    /new HEAD's complete ordered parent list to equal `commit`'s, its message to equal `commit`'s, its tree to equal the recorded pre-fold tree, and a clean status/,
    /Only then advance expected HEAD/,
    /step 3 difference resets nothing, folds nothing and reverts nothing/,
    /record every kept class as left open with the reason/,
    /After a successful fold, compare the primary with the post-fold expected HEAD and a clean status, not with Select's snapshot/,
    /Push nothing in any case/,
  ]) assert.match(fix, pattern);
  assert.match(spine, /Write the primary checkout only for `delivery: in-place` and `delivery: amend`; stage, unstage and commit there only for `amend`/);
  assert.match(spine, /Never stash or force-push/);
  for (const text of [spine, local("../../doc/gate-contract.md")]) {
    assert.ok(text.includes("prs,commits,amended,edited,tickets,not-filed,ignored,not-decided,open"));
  }
  assert.match(spine, /Count classes folded into the last unpushed commit under `amended`/);
  assert.match(spine, /last unpushed commit before and after the fold and state that nothing was pushed/);
  assert.match(spine, /number of `specs` searched for the banner only/);
});

const bounded = (command, args, options = {}) => execFileSync("timeout", ["-k", "30", "15", command, ...args], {
  encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...options,
}).trim();

function scratchFold(scenario) {
  const scratch = bounded("mktemp", ["-d", join(tmpdir(), "housekeeping-fold.XXXXXX")]);
  const root = join(scratch, "root");
  const origin = join(scratch, "origin.git");
  const env = { ...process.env, GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_NOSYSTEM: "1",
    GIT_AUTHOR_NAME: "Fixture", GIT_AUTHOR_EMAIL: "fixture@example.invalid",
    GIT_COMMITTER_NAME: "Fixture", GIT_COMMITTER_EMAIL: "fixture@example.invalid" };
  const git = (...args) => bounded("git", ["-C", root, ...args], { env });
  bounded("git", ["init", "--initial-branch=trunk", root], { env });
  git("config", "commit.gpgsign", "false");
  const hooks = join(scratch, "hooks");
  mkdirSync(hooks);
  git("config", "core.hooksPath", hooks);
  const commitFile = (path, content, message) => {
    writeFileSync(join(root, path), content);
    git("add", "--", path);
    git("commit", "-m", message);
  };
  commitFile("base.txt", "remote base\n", "Remote base");
  bounded("git", ["clone", "--bare", root, origin], { env });
  git("remote", "add", "origin", origin);
  git("fetch", "origin", "trunk");
  commitFile("first.txt", "first unpushed\n", "First unpushed");
  if (scenario === "merge") {
    git("checkout", "-b", "side");
    commitFile("side.txt", "side\n", "Side parent");
    git("checkout", "trunk");
    commitFile("last.txt", "last unpushed\n", "Trunk parent");
    git("merge", "--no-ff", "side", "-m", "Last unpushed\n\nKeep this body.");
  } else {
    commitFile("last.txt", "last unpushed\n", "Last unpushed\n\nKeep this body.");
  }
  const commit = git("rev-parse", "HEAD");
  const ahead = git("rev-list", "--count", "origin/trunk..HEAD");
  if (scenario !== "merge") assert.equal(ahead, "2");
  const parents = git("show", "-s", "--format=%P", commit);
  assert.equal(parents.split(" ").length, scenario === "merge" ? 2 : 1);
  const message = git("cat-file", "commit", commit).split("\n\n").slice(1).join("\n\n");
  commitFile("first.txt", "fixed first\n", "Fix class one");
  commitFile("last.txt", "fixed last\n", "Fix class two");
  const preFold = git("rev-parse", "HEAD");
  const tree = git("rev-parse", "HEAD^{tree}");
  const remoteRefs = () => bounded("git", ["--git-dir", origin, "show-ref"], { env });
  const refs = remoteRefs();
  const fix = read("reference/fix.md");
  const command = (literal) => {
    assert.ok(fix.includes(`\`${literal}\``), `Fix must prescribe ${literal}`);
    return literal.replace("<default>", "trunk").replace("<pre-fold HEAD>", preFold).replace("<commit>", commit).split(" ").slice(1);
  };
  git(...command("git fetch origin <default>"));
  assert.equal(git(...command("git branch -r --contains <commit>")), "");
  assert.equal(git("branch", "--show-current"), "trunk");
  assert.equal(git("rev-parse", "HEAD"), preFold);
  assert.equal(git("status", "--porcelain"), "");
  if (scenario === "hook-failure") writeFileSync(join(hooks, "pre-commit"), "#!/bin/sh\necho fixture-hook-refusal >&2\nexit 1\n", { mode: 0o755 });
  git(...command("git reset --soft <commit>"));
  const amended = spawnSync("timeout", ["-k", "30", "15", "git", "-C", root, ...command("git commit --amend --no-edit")], { env, encoding: "utf8" });
  if (scenario === "hook-failure") {
    assert.equal(amended.status, 1);
    assert.match(amended.stderr, /fixture-hook-refusal/);
    git(...command("git reset --soft <pre-fold HEAD>"));
    assert.equal(git("rev-parse", "HEAD"), preFold);
    assert.equal(git("rev-list", "--count", `${commit}..HEAD`), "2");
  } else {
    assert.equal(amended.status, 0, amended.stderr);
    assert.notEqual(git("rev-parse", "HEAD"), commit);
    assert.equal(git("rev-list", "--count", "origin/trunk..HEAD"), ahead);
    assert.equal(git("show", "-s", "--format=%P", "HEAD"), parents);
    assert.equal(git("cat-file", "commit", "HEAD").split("\n\n").slice(1).join("\n\n"), message);
  }
  assert.equal(git("rev-parse", "HEAD^{tree}"), tree);
  assert.equal(git("status", "--porcelain"), "");
  assert.equal(remoteRefs(), refs);
}

for (const scenario of ["linear", "merge", "hook-failure"]) {
  test(`AC 12 executed fold: ${scenario}`, () => scratchFold(scenario));
}

test("AC 12 replay: two folded classes report amended=2 and no push", () => {
  const sample = "unpushed-amend-report";
  const target = JSON.parse(local("target.json"));
  const { text, bundle } = parseCase(local(`samples/${sample}/case.md`));
  assert.deepEqual(bundle, ["skills/housekeeping/reference/fix.md"]);
  const expected = local(`samples/${sample}/expected.md`);
  const { facts } = parseExpected(expected);
  assert.ok(facts.length > 0);
  const baseline = JSON.parse(local(`results/${sample}/baseline.json`));
  const candidate = JSON.parse(local(`results/${sample}/candidate.json`));
  for (const [arm, record] of [["baseline", baseline], ["candidate", candidate]]) {
    assert.equal(record.arm, arm);
    assert.equal(record.sample, sample);
    assert.deepEqual(record.models, MODELS);
    assert.match(record.repoSha, /^[a-f0-9]{40}$/);
    assert.match(record.skillSha, /^[a-f0-9]{64}$/);
    assert.deepEqual(Object.keys(record.outputs).sort(), [...MODELS.replay].sort());
    for (const model of MODELS.replay) assert.ok(cellReusable(record, model, {
      kind: target.kind, assembly: target.assembly, thinking: MODELS.thinking,
      inputSha: inputSha(local("replay.md"), text, bundle), skillSha: record.skillSha,
    }), `${arm}: successful reply with retained provenance`);
  }
  assert.deepEqual(Object.keys(candidate.judge).sort(), [...MODELS.replay].sort());
  for (const model of MODELS.replay) {
    const output = candidate.outputs[model].text;
    assert.ok(Object.values(runMechanical(facts, output)).every((result) => result === "holds"));
    const judged = candidate.judge[model];
    assert.match(judged.intentSha, /^[a-f0-9]{64}$/);
    assert.ok(judgmentCurrent(judged, {
      factsSha: sha256(expected), judgePromptSha: sha256(local("../judge.md")), intentSha: judged.intentSha,
      baselineOutputSha: sha256(baseline.outputs[model].text), candidateOutputSha: sha256(output),
    }));
    for (const { id } of facts) assert.equal(judged.facts[id]?.after, "holds", `${model}: ${id}`);
    assert.ok(["improved", "unchanged"].includes(judged.verdict));
  }
});
