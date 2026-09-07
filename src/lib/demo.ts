import { loadCatalog } from "./catalog";
import {
  addComment,
  countVotes,
  ensureCitizen,
  getState,
  mutate,
  pushActivity,
  setVote,
} from "./store";
import { deriveStatus } from "./scoring";
import type { Citizen } from "./types";

const FOCUS = [
  "gg", "bgb", "stgb", "stpo", "bdsg", "ifsg", "bwahlg", "versammlg", "tkg",
  "tmg", "aufenthg", "bnatschg", "estg", "ao", "betrvg", "urhg", "gwb", "hgb",
  "luftvg", "stvg", "baugb", "partg",
];

const VOTE_LINES = [
  "stimmt für den Erhalt",
  "stimmt für eine Überprüfung",
  "legt ein kritisches Votum vor",
  "trägt den Text mit",
];

const COMMENTS = [
  "Bitte den Zweck des Gesetzes in einem Satz sichtbar machen. Was schützt es wirklich?",
  "Mehrheit ist kein Ersatz für Grundrechte. Zuerst die Würde, dann der Rest.",
  "Wenn Automation kommt, muss Teilhabe vorher geklärt sein — nicht hinterher.",
  "Ich will den vollen Text lesen, bevor ich endgültig vote. Danke für die Quelle.",
  "Das Volk kann das. Aber nur, wenn der Diskurs sichtbar und langsam genug bleibt.",
  "Unparteiische Auszählung ist gut. Bitte niemals geheime Gewichte einbauen.",
  "Ähnliche Normen sollten zusammengeführt werden, statt immer neue Texte zu stapeln.",
  "Leben schützen ist kein Slogan. Es ist die einzige harte Grenze für Technik.",
];

let timer: ReturnType<typeof setInterval> | null = null;
let tickCount = 0;

function pick<T>(xs: T[]): T {
  return xs[Math.floor(Math.random() * xs.length)]!;
}

function randomCitizen(): Citizen {
  const s = getState();
  const sims = Object.values(s.citizens).filter((c) => c.simulated);
  if (sims.length) return pick(sims);
  return ensureCitizen({ simulated: true, name: "Simulierter Bürger", city: "Deutschland" });
}

function focusSlug(): string {
  const catalog = loadCatalog();
  if (!catalog.length) return "gg";
  if (Math.random() < 0.62) {
    const hit = FOCUS.find((slug) => catalog.some((l) => l.slug === slug));
    if (hit && Math.random() < 0.7) return hit;
    const known = catalog.filter((l) => FOCUS.includes(l.slug));
    if (known.length) return pick(known).slug;
  }
  const hot = catalog.filter((l) => l.hasText).slice(0, 400);
  return pick(hot.length ? hot : catalog).slug;
}

function tick() {
  const s = getState();
  if (!s.demo) return;
  tickCount += 1;
  const citizen = randomCitizen();
  const roll = Math.random();

  if (roll < 0.62) {
    const slug = focusSlug();
    const law = loadCatalog().find((l) => l.slug === slug);
    const lean = ["ifsg", "stgb", "aufenthg"].includes(slug) ? (Math.random() < 0.45 ? 1 : -1) : (Math.random() < 0.72 ? 1 : -1);
    const value = lean as 1 | -1;
    setVote(`law:${slug}`, citizen, value);
    const { up, down } = countVotes(`law:${slug}`);
    const status = deriveStatus("law", up, down);
    pushActivity({
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      at: new Date().toISOString(),
      kind: "vote",
      citizenName: citizen.name,
      city: citizen.city,
      label: `${citizen.name}, ${citizen.city}, ${value === 1 ? VOTE_LINES[0] : VOTE_LINES[1]}: ${law?.abbrev || law?.title || slug}`,
      href: `/gesetze/${slug}`,
    });
    if (status === "zur_abwahl" && s.statusOverride[`law:${slug}`] !== "zur_abwahl") {
      mutate((st) => {
        st.statusOverride[`law:${slug}`] = "zur_abwahl";
      });
      pushActivity({
        id: `st-${Date.now()}`,
        at: new Date().toISOString(),
        kind: "status",
        citizenName: "Auszählung",
        city: "Bund",
        label: `Schwelle erreicht: ${law?.abbrev || slug} steht zur Abwahl.`,
        href: `/gesetze/${slug}`,
      });
    }
    return;
  }

  if (roll < 0.78) {
    const slug = focusSlug();
    const law = loadCatalog().find((l) => l.slug === slug);
    addComment({
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      targetId: `law:${slug}`,
      citizenId: citizen.id,
      name: citizen.name,
      city: citizen.city,
      body: pick(COMMENTS),
      createdAt: new Date().toISOString(),
    });
    pushActivity({
      id: `act-${Date.now()}-k`,
      at: new Date().toISOString(),
      kind: "comment",
      citizenName: citizen.name,
      city: citizen.city,
      label: `${citizen.name} spricht im Diskurs zu ${law?.abbrev || slug}.`,
      href: `/gesetze/${slug}`,
    });
    return;
  }

  if (roll < 0.9 && s.decisions.length) {
    const d = pick(s.decisions);
    const value = Math.random() < 0.74 ? 1 : -1;
    setVote(`decision:${d.id}`, citizen, value as 1 | -1);
    pushActivity({
      id: `act-${Date.now()}-d`,
      at: new Date().toISOString(),
      kind: "decision",
      citizenName: citizen.name,
      city: citizen.city,
      label: `${citizen.name} stimmt ab: ${d.title}`,
      href: `/abstimmen/${d.id}`,
    });
    return;
  }

  if (s.drafts.length) {
    const d = pick(s.drafts);
    const value = Math.random() < 0.7 ? 1 : -1;
    setVote(`draft:${d.id}`, citizen, value as 1 | -1);
    pushActivity({
      id: `act-${Date.now()}-e`,
      at: new Date().toISOString(),
      kind: "draft",
      citizenName: citizen.name,
      city: citizen.city,
      label: `${citizen.name} bewertet den Entwurf „${d.title}“.`,
      href: `/entwuerfe/${d.id}`,
    });
  }
}

export function ensureDemoLoop() {
  if (timer) return;
  timer = setInterval(tick, 1100);
  if (typeof timer === "object" && "unref" in timer) timer.unref();
}

export function setDemo(enabled: boolean) {
  mutate((s) => {
    s.demo = enabled;
    s.demoStartedAt = enabled ? new Date().toISOString() : s.demoStartedAt;
  });
  if (enabled) ensureDemoLoop();
}

export function demoTickCount() {
  return tickCount;
}
