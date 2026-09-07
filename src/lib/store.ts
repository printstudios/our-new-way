import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { dataDir, statePath } from "./paths";
import { seedState } from "./seed";
import type { AppState, Citizen, VoteValue } from "./types";

let state: AppState | null = null;
let writeTimer: ReturnType<typeof setTimeout> | null = null;

function emptyState(): AppState {
  return {
    version: 1,
    demo: true,
    demoStartedAt: new Date().toISOString(),
    citizens: {},
    votes: {},
    comments: [],
    drafts: [],
    decisions: [],
    activity: [],
    views: {},
    statusOverride: {},
  };
}

export function loadState(): AppState {
  if (state) return state;
  const file = statePath();
  if (existsSync(file)) {
    try {
      state = JSON.parse(readFileSync(file, "utf-8")) as AppState;
      if (!state.version) state = emptyState();
    } catch {
      state = emptyState();
    }
  } else {
    state = seedState(emptyState());
    persistNow();
  }
  return state;
}

export function getState(): AppState {
  return loadState();
}

export function mutate<T>(fn: (s: AppState) => T): T {
  const s = loadState();
  const result = fn(s);
  schedulePersist();
  return result;
}

function schedulePersist() {
  if (writeTimer) return;
  writeTimer = setTimeout(() => {
    writeTimer = null;
    persistNow();
  }, 250);
}

export function persistNow() {
  if (!state) return;
  mkdirSync(dataDir(), { recursive: true });
  const file = statePath();
  const tmp = `${file}.tmp`;
  writeFileSync(tmp, JSON.stringify(state));
  renameSync(tmp, file);
}

export function countVotes(targetId: string): { up: number; down: number } {
  const row = loadState().votes[targetId] ?? {};
  let up = 0;
  let down = 0;
  for (const v of Object.values(row)) {
    if (v === 1) up += 1;
    else down += 1;
  }
  return { up, down };
}

export function recentVotes(targetId: string, minutes = 15): number {
  // Lightweight heat: recent activity lines mentioning this target.
  const since = Date.now() - minutes * 60_000;
  return loadState().activity.filter((a) => a.href.includes(targetId.replace("law:", "/gesetze/").replace("draft:", "/entwuerfe/").replace("decision:", "/abstimmen/")) && Date.parse(a.at) >= since).length;
}

export function setVote(targetId: string, citizen: Citizen, value: VoteValue) {
  mutate((s) => {
    s.votes[targetId] ??= {};
    s.votes[targetId][citizen.id] = value;
    s.citizens[citizen.id] = citizen;
  });
}

export function addComment(comment: AppState["comments"][number]) {
  mutate((s) => {
    s.comments.unshift(comment);
    if (s.comments.length > 4000) s.comments.length = 4000;
  });
}

export function pushActivity(entry: AppState["activity"][number]) {
  mutate((s) => {
    s.activity.unshift(entry);
    if (s.activity.length > 240) s.activity.length = 240;
  });
}

export function bumpView(slug: string) {
  mutate((s) => {
    s.views[slug] = (s.views[slug] ?? 0) + 1;
  });
}

export function ensureCitizen(partial?: Partial<Citizen>): Citizen {
  return mutate((s) => {
    if (partial?.id && s.citizens[partial.id]) return s.citizens[partial.id];
    const id = partial?.id ?? `buerger-${Math.random().toString(36).slice(2, 10)}`;
    const citizen: Citizen = {
      id,
      name: partial?.name || "Bürgerin oder Bürger",
      city: partial?.city || "Deutschland",
      simulated: Boolean(partial?.simulated),
    };
    s.citizens[id] = citizen;
    return citizen;
  });
}

if (typeof process !== "undefined") {
  process.on?.("beforeExit", () => persistNow());
}
