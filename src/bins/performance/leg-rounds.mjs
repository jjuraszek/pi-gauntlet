import { obj, str } from "./shared.mjs";

export const LEG_SKILLS = ["shape-ticket", "gatekeep-pr", "check-delivery"];

export function loadLeg(doc) {
  if (![doc.session, doc.ts].every(v => typeof v === "string" && v.length)
      || !Array.isArray(doc.items)
      || !doc.items.every(item => obj(item) && ["ticket", "pr"].includes(item.kind)
        && str(item.outcome) !== null && (item.key === undefined || str(item.key) !== null))) {
    return { skip: "not a leg record" };
  }
  return { leg: { ...doc, repo: str(doc.repo) ?? "unknown repo" } };
}

export const legId = leg => JSON.stringify([leg.repo, leg.skill, leg.session, leg.ts]);

export function itemKey(key, repo) {
  if (!key) return null;
  const ref = key.replace(/@[a-f\d]+$/i, "");
  if (/^#\d+$/.test(ref)) return `${repo}${ref}`;
  const github = /^https?:\/\/[^/]+\/([^/]+\/[^/]+)\/(?:issues|pull)\/(\d+)\/?$/.exec(ref);
  if (github) return `${github[1]}#${github[2]}`;
  const linear = /^https?:\/\/[^/]+\/[^/]+\/issue\/([A-Z][A-Z0-9]*-\d+)(?:\/.*)?$/.exec(ref);
  return linear ? linear[1] : ref;
}

export function groupRounds(legs, skill) {
  const groups = new Map();
  for (const leg of legs.filter(leg => leg.skill === skill)
    .sort((a, b) => a.ts.localeCompare(b.ts) || a.session.localeCompare(b.session))) {
    const keys = new Set(leg.items.map(item => itemKey(item.key, leg.repo)).filter(Boolean));
    for (const key of keys) {
      const id = JSON.stringify([leg.repo, key]);
      if (!groups.has(id)) groups.set(id, { repo: leg.repo, key, rounds: [] });
      groups.get(id).rounds.push(leg);
    }
  }
  return [...groups.values()].sort((a, b) => a.repo.localeCompare(b.repo) || a.key.localeCompare(b.key));
}
