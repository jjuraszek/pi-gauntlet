import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

const skill = readFileSync(new URL("../skills/finishing-a-development-branch/SKILL.md", import.meta.url), "utf8");
const verificationPath = new URL("../skills/finishing-a-development-branch/reference/verification-set.md", import.meta.url);
const verification = readFileSync(verificationPath, "utf8");
const rule = verification.match(/\*\*Skip rule\.\*\*[^\n]+/)[0];
const commands = [...rule.matchAll(/`(git -C "\$WORKTREE"[^`]+)`/g)].map((m) => m[1]);
assert.ok(commands.length, "skip rule must contain executable Git checks");

test("ledger finish preserves gate set, strip and amendment contracts", () => {
  assert.ok(verification.includes("# Ledger - loop engine"));
  assert.match(skill, /read.*absolute path.*reference\/verification-set\.md/);
  assert.doesNotMatch(skill, /For a ledger, (?:use|supply) its `verification:` command/);
  for (const token of ['## Gate set', '## Leg mapping', 'checks:', 'ordered list of (leg, command) pairs', 'LOG_DIR=$(mktemp -d)', 'SCOPED_TEST_COMMANDS', 'verify-before-ship may warn', 'do not run the full suite to clear the warning', 'Commit verification-produced tracked changes, or stop']) assert.ok(verification.includes(token), token);
  assert.match(skill, /For a ledger, supply the gate set as `SCOPED_TEST_COMMANDS`/);
  assert.match(skill, /Verification: scoped - <commands>; CI on this push holds the full run.*last `## Summary` bullet/);
  assert.match(skill, /ledger.*post-squash.*verification-set\.md/);
  assert.match(verification, /\(cd "<leg primary>" && <command>\) > "\$LOG_DIR\/gate-<i>\.log" 2>&1/);
  assert.ok(skill.includes("<spec stem>-ledger.md"));
  assert.match(skill, /--grep[^\n]*loop: cut row[^\n]*loop: amend/);
  assert.match(skill, /take the `auto-apply` and `granted` records from those commit bodies/);
});

for (const telemetry of [".pi/gauntlet/telemetry", "records/custom telemetry"]) {
  for (const scenario of [
    ["clean tree", true, () => {}],
    ["unstaged source edit", false, ({ write }) => write("source.txt", "changed")],
    ["staged source edit", false, ({ write, git }) => { write("source.txt", "changed"); git("add", "source.txt"); }],
    ["untracked source file", false, ({ write }) => write("new source.txt", "new")],
    ["committed source edit", false, ({ write, commit }) => { write("source.txt", "changed"); commit(); }],
    ["staged edit restored only in worktree", false, ({ write, git }) => { write("source.txt", "changed"); git("add", "source.txt"); write("source.txt", "original"); }],
    ["unstaged telemetry edit", true, ({ write }) => write(`${telemetry}/run.yaml`, "changed")],
    ["untracked telemetry file", true, ({ write }) => write(`${telemetry}/new.yaml`, "new")],
    ["committed telemetry edit", true, ({ write, commit }) => { write(`${telemetry}/run.yaml`, "changed"); commit(); }],
    ["telemetry-named sibling is not excluded", false, ({ write }) => write(`${telemetry}-other/source.txt`, "new")],
    ["unknown verified commit", false, ({ state }) => { state.sha = "missing-verified-commit"; }],
  ]) {
    const [name, maySkip, arrange] = scenario;
    test(`${telemetry}: ${name}`, () => {
      const worktree = mkdtempSync(join(tmpdir(), "finish-verification-"));
      const git = (...args) => execFileSync("git", ["-C", worktree, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
      const write = (path, value) => {
        mkdirSync(join(worktree, path, ".."), { recursive: true });
        writeFileSync(join(worktree, path), value);
      };
      const commit = () => { git("add", "."); git("commit", "-qm", "fixture"); };
      git("init", "-q");
      git("config", "user.name", "Fixture");
      git("config", "user.email", "fixture@example.invalid");
      git("config", "commit.gpgsign", "false");
      git("config", "core.hooksPath", "/dev/null");
      write("source.txt", "original");
      write(`${telemetry}/run.yaml`, "original");
      commit();
      const state = { sha: git("rev-parse", "HEAD") };
      arrange({ write, git, commit, state });
      const results = commands.map((command) => spawnSync("bash", ["-c", command
        .replaceAll("<commit the run passed on>", state.sha)
        .replaceAll("<telemetry.dir>", telemetry)], {
        cwd: tmpdir(),
        env: { ...process.env, WORKTREE: worktree },
        encoding: "utf8",
      }));
      const actual = results.every((r) => r.status === 0 && r.stdout.trim() === "");
      assert.equal(actual, maySkip, `skip=${actual}; ${JSON.stringify(results.map((r) => ({ status: r.status, stdout: r.stdout, stderr: r.stderr })))}`);
    });
  }
}

test("stripped ledger recovery keeps checkout ownership instead of spec full commands", () => {
  assert.match(verification, /git -C <home> show <strip commit>\^:<ledger path>/);
  assert.match(verification, /never from the spec's `contract:` `- verification:` lines/);
  assert.match(verification, /missing.*stop/i);
  for (const path of ['skills/finishing-a-development-branch/reference/legs.md', 'skills/gauntlet-resume/reference/brief-contract.md']) {
    const text = readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
    assert.match(text, /pre-strip ledger/);
    assert.match(text, /gate pairs/);
    assert.match(text, /verification-set\.md/);
    assert.ok(Buffer.byteLength(text) < 50000);
    assert.ok(text.split('\n').length < 2000);
  }
});

test("non-ledger set resolution retains task and ad-hoc behavior", () => {
  for (const token of ["union of every plan task's `Tests:` commands", 'none - PR subject, scoped', "plan header's `**Verification:**` set", 'With no plan in this session', 'accepted-complete task evidence']) assert.ok(verification.includes(token), token);
  assert.match(skill, /\(cd "\$PRIMARY" && <the Step 1 set>\)/);
  for (const text of [skill, verification]) {
    assert.ok(Buffer.byteLength(text) < 50000);
    assert.ok(text.split('\n').length < 2000);
  }
});

// Wording checks pin the finish-owned contract, not a live GitHub boundary.
const legsPath = new URL("../skills/finishing-a-development-branch/reference/legs.md", import.meta.url);
const legs = () => readFileSync(legsPath, "utf8");

for (const [name, pattern] of [
  ["all-leg verification before menu", /Before Step 4[\s\S]*every leg's recorded verification[\s\S]*owned AC/],
  ["changed-leg freshness", /audited head and tree[\s\S]*re-verify and re-review/],
  ["companion-first delivery", /companions in declared sibling order, then home/],
  ["durable receipt shape", /receipts\/<spec filename>\/<repo>[\s\S]*attempted-head:[\s\S]*delivered:[\s\S]*verification: passed/],
  ["PR retry validation", /state,headRefOid[\s\S]*attempted head[\s\S]*update the existing PR/],
  ["squash retry validation", /reachable from the primary's default branch[\s\S]*rerun verification, not squash/],
  ["complete home seal", /complete companion results[\s\S]*strip[\s\S]*--leg[\s\S]*Never seal partial/],
  ["stripped-plan retry", /stripped plan[\s\S]*every companion has a receipt/],
  ["one discard confirmation", /branch, commit count, and worktree[\s\S]*one typed `discard`/],
  ["recorded cleanup", /recorded `## cleanup`[\s\S]*`destroy:`[\s\S]*teardown hook[\s\S]*owned built-in/],
  ["cleanup refusal", /`failed`[\s\S]*leave the tree intact[\s\S]*remaining report lines/],
  ["failure reporting", /Shipped: <repo> <sha\|pr>[\s\S]*Not shipped: <repo>/],
]) {
  test(`coordinated finish: ${name}`, () => assert.match(legs(), pattern));
}

test("coordinated retry verifies and delivers unlanded home without the removed companion checkout", () => {
  const text = legs();
  const receipts = text.indexOf('## Durable receipts');
  const verification = text.indexOf('## Verification and closure');
  assert.ok(receipts < verification, 'validate receipts before checkout-based fan-out');
  assert.match(text.slice(verification), /Exempt a leg with a validated receipt and a missing worktree from checkout-based verification and conformance/);
  assert.match(text.slice(verification), /Run fresh checks for every unlanded leg/);
  assert.match(text, /rerun verification, not squash, against the delivered primary state/);
  const members = [
    { repo: 'companion', validatedReceipt: true, treeExists: false },
    { repo: 'home', validatedReceipt: false, treeExists: true },
  ];
  const actions = [];
  for (const member of members) {
    if (member.validatedReceipt && !member.treeExists) continue;
    assert.ok(member.treeExists, 'verification must not touch a removed checkout');
    actions.push(`verify ${member.repo}`, `conformance ${member.repo}`);
  }
  for (const member of members) {
    actions.push(`${member.validatedReceipt ? 'skip' : 'deliver'} ${member.repo}`);
  }
  assert.deepEqual(actions, ['verify home', 'conformance home', 'skip companion', 'deliver home']);
});

test("finish routes coordinated mechanics once and retains legacy cleanup", () => {
  assert.equal((skill.match(/\]\(reference\/legs\.md\)/g) ?? []).length, 1);
  assert.match(skill, /recorded `contract:` lines[\s\S]*legacy spec without `## Legs`/);
});
for (const [name, pattern] of [
  ["ordered record pairs", /every top-level `PR:`\/`Pre-rework head:` pair, home first/],
  ["all original heads", /\| Merge \| For every recorded original head, home first, `git merge-base --is-ancestor <PRE_REWORK_HEAD> HEAD`/],
  ["per-PR refs", /Then probe each recorded PR with its own number using `git -C "\$WORKTREE" rev-parse -q --verify refs\/gauntlet\/pre-rework\/pr-<N>`; only when absent, run `git -C "\$WORKTREE" update-ref refs\/gauntlet\/pre-rework\/pr-<N> <PRE_REWORK_HEAD>` with that PR's original SHA/],
  ["home-only push", /Push only home/],
  ["body prerequisite", /Only after a successful push and successful home body edit/],
  ["member eligibility", /--json state,headRefOid/],
  ["pushed ancestry", /--is-ancestor <current headRefOid> <pushed home head>/],
  ["exact authorization", /only the displayed target\/text pairs/],
  ["no deletion", /never pass `--delete-branch`/],
  ["stale authorization", /state or head changed after approval/],
  ["failure no retry", /failed close once, never retry/],
  ["final closing rule", /Post no review-thread replies, merge no PR, change no ticket state, and close no PR other than the absorbed members through the question above\./],
]) {
  test(`PR-list finish: ${name}`, () => assert.match(skill, pattern));
}

test("finish preserves rendered template whitespace and the skill line budget", () => {
  for (const fragment of [
    "Tests failing (<N> failures). Must fix before completing:\n\n[Show failures]\n\nCannot proceed until tests pass.",
    "Implementation complete. What would you like to do?\n\n1. Push to the PR branch",
    "6. Discard this work (removes the worktree and local branch; the PR branch on origin is untouched)\n\nWhich option?",
    "```markdown\n## Rework\n\nBefore:",
  ]) {
    assert.ok(skill.includes(fragment), `missing preserved template: ${fragment}`);
  }
  assert.ok(skill.trimEnd().split("\n").length < 500);
});

test("PR-list close question follows body edit and precedes completion", () => {
  const row = skill.slice(skill.indexOf("#### PR-subject row 1:"), skill.indexOf("#### Option 1:"));
  assert.ok(row.indexOf("gh pr edit") < row.indexOf("Close the absorbed PRs with these comments?"));
  assert.match(row, /#13: "Reworked into #12/);
  assert.match(row, /#14: "Reworked into #12/);
  assert.match(row, /1 - yes, close #13, #14/);
  assert.match(row, /Rows 2-6[\s\S]*never offer/);
});
