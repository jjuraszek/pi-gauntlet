/**
 * Verify-before-ship extension
 *
 * Single-session verification gate for statement-start shipping commands: git merge
 * --squash, git push, and gh pr create (with any git global flags).
 * Local commits are not ship events; commit-time review-cadence advisories live in
 * phase-tracker. Tracks whether a recognised verification command has succeeded
 * since the last source-file write; injects an advisory warning into the tool
 * result of any ship command when verification is stale.
 *
 * In-memory only. No persisted state.
 *
 * Configurable via settings.json:
 *
 *   {
 *     "piGauntlet": {
 *       "verifyBeforeShip": {
 *         "testCommands": ["make ci", "make test", "pytest", "rspec"],
 *         "warningReference": "doc/testing.md"
 *       }
 *     }
 *   }
 *
 * Defaults match common multi-language verification entrypoints. Override
 * `testCommands` to match your project's conventions.
 */

import { resolve, dirname } from "node:path";
import { existsSync, realpathSync } from "node:fs";
import { spawnSync } from "node:child_process";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import {
  DEFAULT_TEST_COMMANDS,
  buildTestCmdRegex,
  resolveVerifyBeforeShip,
  settingsErrorWarning,
} from "./lib/gauntlet-settings.ts";
import { loadGauntletSettings } from "./lib/gauntlet-settings-loader.ts";
import { matchShipStatement } from "./lib/telemetry-paths.ts";

const SOURCE_EXT = /\.(ts|tsx|js|jsx|py|rb|go|rs|java|swift|kt)$/;
const TEST_PATH = /(^|\/)(tests?|__tests__)\/|\.(test|spec)\.|_test\.(py|go|rb)$/;

const isSourceWrite = (filePath: string | undefined): boolean => {
  if (!filePath) return false;
  return SOURCE_EXT.test(filePath) && !TEST_PATH.test(filePath);
};

const formatWarning = (command: string, testCommands: string[], reference: string | undefined): string => {
  const examples = testCommands
    .slice(0, 3)
    .map((c) => "`" + c.replace(/\\s\+/g, " ").replace(/\\b|\(\?!.*?\)/g, "") + "`")
    .join(" / ");
  const refLine = reference ? `\nReference: ${reference}` : "";
  return (
    `⚠️ Ship command \`${command.trim()}\` ran without verification.\n\n` +
    `No successful ${examples} run since the last source edit in this session.\n` +
    `Run your project's verification target before continuing, or confirm with the user that you are deliberately skipping it.${refLine}`
  );
};

const checkout = (path: string): string => {
  let existing = resolve(path);
  while (!existsSync(existing) && dirname(existing) !== existing) existing = dirname(existing);
  const result = spawnSync("git", ["-C", existing, "rev-parse", "--show-toplevel"], { encoding: "utf8" });
  const root = result.status === 0 ? result.stdout.trim() : resolve(path);
  try { return realpathSync(root); } catch { return root; }
};

// Only literal shell directories can supply evidence; expansions remain untrusted.
const statements = (command: string, cwd: string): { command: string; testCommand: string; target: string; trusted: boolean }[] => {
  const tokens = command.match(/"[^"\n]*"|'[^'\n]*'|&&|\|\||[;()\n]|[^\s;()]+/g) ?? [];
  // Allow only literal simple commands and subshells. Only the final list in
  // each sequence can prove success: earlier failures can be masked by a separator.
  const literalWord = /^(?:[a-zA-Z0-9_./:=+,%@-]+|'[^'\\\n$`]*'|"[^"\\\n$`]*")$/;
  // Redirections and leading assignments do not mask a command's exit status.
  const redirection = /^(?:[0-9]*[<>]{1,2}(?:&[0-9]*)?|&>>?)[a-zA-Z0-9_./-]*$/;
  const assignment = /^[a-zA-Z_][a-zA-Z0-9_]*=/;
  const reservedWord = /^(?:if|then|else|elif|fi|for|while|until|do|done|case|esac|in|function|select|time|coproc)$/;
  let position = 0;
  const parseCommand = (): boolean => {
    if (tokens[position] === "(") {
      position++;
      if (!parseSequence() || tokens[position] !== ")") return false;
      position++;
      return true;
    }
    let named = false;
    for (; position < tokens.length; position++) {
      const token = tokens[position];
      if (redirection.test(token)) continue;
      if (!literalWord.test(token)) break;
      if (named || assignment.test(token)) continue;
      if (reservedWord.test(token) || token === "false") return false;
      named = true;
    }
    return named;
  };
  // Earlier pipeline segments cannot prove success because their exit status may be masked.
  const masked = new Set<number>();
  const parsePipeline = (): boolean => {
    const start = position;
    let lastStart = position;
    if (!parseCommand()) return false;
    while (tokens[position] === "|") {
      position++;
      lastStart = position;
      if (!parseCommand()) return false;
    }
    for (let i = start; i < lastStart; i++) masked.add(i);
    return true;
  };
  const parseAndList = (): boolean => {
    if (!parsePipeline()) return false;
    while (tokens[position] === "&&") {
      position++;
      if (!parsePipeline()) return false;
    }
    return true;
  };
  const parseSequence = (): boolean => {
    let start = position;
    if (!parseAndList()) return false;
    while (tokens[position] === ";" || tokens[position] === "\n") {
      position++;
      for (let i = start; i < position; i++) masked.add(i);
      start = position;
      if (position !== tokens.length && !parseAndList()) return false;
    }
    return true;
  };
  const canCredit = parseSequence() && position === tokens.length;
  const out: { command: string; testCommand: string; target: string; trusted: boolean }[] = [];
  const stack: string[] = [];
  let dir = cwd, words: string[] = [], testWords: string[] = [];
  const flush = () => {
    if (!words.length) return;
    const literal = (word: string) => !/[$`]/.test(word);
    if (words[0] === "cd" && words.length === 2) {
      dir = literal(words[1]) ? resolve(dir, words[1]) : "";
    } else {
      let target = dir;
      if (words[0] === "git") {
        for (let i = 1; i < words.length - 1; i++) if (words[i] === "-C") target = literal(words[i + 1]) ? resolve(target, words[++i]) : "";
      }
      out.push({ command: words.join(" "), testCommand: canCredit ? testWords.join(" ") : "", target: checkout(target || cwd), trusted: !!target });
    }
    words = [];
    testWords = [];
  };
  for (const [index, token] of tokens.entries()) {
    if (["&&", "||", ";", "\n", "(", ")"].includes(token)) {
      flush();
      if (token === "(") stack.push(dir);
      if (token === ")") dir = stack.pop() ?? cwd;
    } else {
      const quoted = /^["']/.test(token);
      words.push(quoted ? token.slice(1, -1) : token);
      testWords.push(quoted || masked.has(index) ? '""' : token);
    }
  }
  flush();
  return out;
};

export default function (pi: ExtensionAPI) {
  const verified = new Set<string>();
  const pendingTests = new Map<string, Set<string>>();
  const pendingShipWarnings = new Map<string, string>();

  const getCommand = (event: { input: unknown }): string => {
    const input = event.input as { command?: unknown } | undefined;
    return typeof input?.command === "string" ? input.command : "";
  };

  const getPath = (event: { input: unknown }): string | undefined => {
    const input = event.input as { path?: unknown } | undefined;
    return typeof input?.path === "string" ? input.path : undefined;
  };

  pi.on("tool_call", async (event, ctx) => {
    if (event.toolName === "write" || event.toolName === "edit") {
      if (isSourceWrite(getPath(event))) verified.delete(checkout(dirname(resolve(ctx.cwd, getPath(event)!))));
      return undefined;
    }

    if (event.toolName !== "bash") return undefined;
    const command = getCommand(event);
    if (!command) return undefined;

    const addShipWarning = (id: string, text: string) => {
      const prior = pendingShipWarnings.get(id);
      pendingShipWarnings.set(id, prior ? prior + "\n\n" + text : text);
    };

    const targets = new Set<string>();
    let settingsErrShown = false;
    for (const statement of statements(command, ctx.cwd)) {
      const { gauntlet, errors } = loadGauntletSettings(statement.target);
      const { testCommands, warningReference } = resolveVerifyBeforeShip(gauntlet, DEFAULT_TEST_COMMANDS);
      const isTest = buildTestCmdRegex(testCommands).test(statement.testCommand) && !/^(?:echo|printf|rg|grep)\b/.test(statement.command);
      if (isTest && statement.trusted) targets.add(statement.target);
      if ((isTest || matchShipStatement(statement.command)) && errors.length && !settingsErrShown) {
        addShipWarning(event.toolCallId, settingsErrorWarning(errors));
        settingsErrShown = true;
      }
      if (matchShipStatement(statement.command) && (!statement.trusted || !verified.has(statement.target))) {
        addShipWarning(event.toolCallId, formatWarning(command, testCommands, warningReference));
      }
    }
    if (targets.size) pendingTests.set(event.toolCallId, targets);
    return undefined;
  });

  pi.on("tool_result", async (event) => {
    if (event.toolName !== "bash") return undefined;

    const targets = pendingTests.get(event.toolCallId);
    pendingTests.delete(event.toolCallId);
    if (!event.isError) for (const target of targets ?? []) verified.add(target);

    const warning = pendingShipWarnings.get(event.toolCallId);
    if (!warning) return undefined;
    pendingShipWarnings.delete(event.toolCallId);

    return {
      content: [{ type: "text" as const, text: warning }, ...event.content],
    };
  });
}
