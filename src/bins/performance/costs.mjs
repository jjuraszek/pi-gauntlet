import { groupRounds, itemKey } from "./leg-rounds.mjs";
import { fmtCost, num, sumOrNull, table } from "./shared.mjs";

export const allocationNote = "costs: batch and multi-ticket records are split equally across their items; the rounding remainder lands on the last row";
const columns = ["shape", "run", "gatekeep", "delivery"];
const skillColumn = { "shape-ticket": "shape", "gatekeep-pr": "gatekeep", "check-delivery": "delivery" };
const id = (repo, key) => JSON.stringify([repo, key]);
const ordered = map => [...map.values()].sort((a, b) => a.repo.localeCompare(b.repo) || a.key.localeCompare(b.key));
const add = (row, column, cost) => { if (cost !== null) row[column] = (row[column] ?? 0) + cost; };

function split(cost, count, cents) {
  if (cost === null) return Array(count).fill(null);
  if (!cents) return Array(count).fill(cost / count);
  const total = Math.round(cost * 100);
  const share = Math.round(total / count);
  return Array.from({ length: count }, (_, i) => (i === count - 1 ? total - share * (count - 1) : share) / 100);
}

export function aggregateCosts(entries, legs, cents = false) {
  const tickets = new Map(), prs = new Map(), unattributed = new Map();
  const ensure = (map, repo, key) => {
    const identity = id(repo, key);
    if (!map.has(identity)) map.set(identity, { repo, key, shape: null, run: null, gatekeep: null, delivery: null, rounds: [] });
    return map.get(identity);
  };
  for (const { row } of entries) {
    const keys = [...new Set(row.tickets.map(ref => itemKey(ref, row.repo)))].sort();
    const shares = split(row.cost, keys.length || 1, cents);
    if (!keys.length) add(ensure(unattributed, row.repo, row.session), "run", shares[0]);
    keys.forEach((key, i) => add(ensure(tickets, row.repo, key), "run", shares[i]));
  }
  const ticketPrs = new Map();
  for (const leg of [...legs].sort((a, b) => a.ts.localeCompare(b.ts) || a.session.localeCompare(b.session))) {
    // Put keyless shares last, matching the separate unattributed table below the keyed rows.
    const items = [...leg.items].sort((a, b) => (itemKey(a.key, leg.repo) ?? "\uffff").localeCompare(itemKey(b.key, leg.repo) ?? "\uffff"));
    const shares = split(num(leg.cost), items.length || 1, cents);
    if (!items.length) add(ensure(unattributed, leg.repo, leg.session), skillColumn[leg.skill], shares[0]);
    const roundShares = new Map();
    items.forEach((item, i) => {
      const key = itemKey(item.key, leg.repo);
      const ticket = item.kind === "ticket" ? key : itemKey(item.ticket, leg.repo);
      const row = ticket ? ensure(tickets, leg.repo, ticket) : ensure(unattributed, leg.repo, item.kind === "pr" && key ? key : leg.session);
      add(row, skillColumn[leg.skill], shares[i]);
      if (item.kind !== "pr" || !key || leg.skill !== "gatekeep-pr") return;
      const pr = ensure(prs, leg.repo, key);
      if (!roundShares.has(pr)) roundShares.set(pr, null);
      roundShares.set(pr, sumOrNull([roundShares.get(pr), shares[i]]));
      if (ticket) {
        const identity = id(leg.repo, ticket);
        if (!ticketPrs.has(identity)) ticketPrs.set(identity, new Set());
        ticketPrs.get(identity).add(pr);
      }
    });
    for (const [pr, cost] of roundShares) {
      pr.rounds.push(leg);
      (pr.round_costs ??= []).push(cost);
    }
  }
  for (const [identity, linked] of ticketPrs) {
    const cost = tickets.get(identity).run;
    const rows = [...linked].sort((a, b) => a.key.localeCompare(b.key));
    const shares = split(cost, rows.length, cents);
    rows.forEach((row, i) => add(row, "run", shares[i]));
  }
  for (const group of groupRounds(legs, "shape-ticket")) {
    const row = tickets.get(id(group.repo, group.key));
    if (row) row.rounds = group.rounds;
  }
  for (const row of [...tickets.values(), ...unattributed.values()]) row.total = sumOrNull(columns.map(column => row[column]));
  const prRows = ordered(prs).map(({ repo, key, run, rounds, round_costs }) => ({ repo, key, run, rounds, round_costs, total: sumOrNull([run, ...round_costs]) }));
  return { tickets: ordered(tickets), prs: prRows, unattributed: ordered(unattributed) };
}

export function renderCosts({ tickets, prs, unattributed }) {
  const roundCount = Math.max(0, ...prs.map(row => row.round_costs.length));
  const costs = rows => rows.map(row => [row.repo, row.key, ...columns.map(column => fmtCost(row[column])), fmtCost(row.total)]);
  return [
    `tickets\n${table(["repo", "ticket", "rounds", ...columns, "total"], costs(tickets).map((cells, i) => [...cells.slice(0, 2), String(tickets[i].rounds.length), ...cells.slice(2)]))}`,
    `prs\n${table(["repo", "PR", "rounds", "run", ...Array.from({ length: roundCount }, (_, i) => `round ${i + 1}`), "total"], prs.map(row => [row.repo, row.key, String(row.rounds.length), fmtCost(row.run), ...Array.from({ length: roundCount }, (_, i) => fmtCost(row.round_costs[i] ?? null)), fmtCost(row.total)]))}`,
    `unattributed\n${table(["repo", "PR/session", ...columns, "total"], costs(unattributed))}`,
    allocationNote,
  ].join("\n\n");
}
