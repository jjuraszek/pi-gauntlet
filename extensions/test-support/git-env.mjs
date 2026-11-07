import { writeFileSync } from "node:fs";
import { join } from "node:path";

export function isolatedGitEnv(scratch) {
  const env = {
    GIT_CONFIG_GLOBAL: join(scratch, "gitconfig"),
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_AUTHOR_NAME: "test", GIT_AUTHOR_EMAIL: "test@example.test",
    GIT_COMMITTER_NAME: "test", GIT_COMMITTER_EMAIL: "test@example.test",
  };
  writeFileSync(env.GIT_CONFIG_GLOBAL, "");
  return env;
}
