import { areaLabel, loadCatalog, loadFullLaw } from "./catalog";
import { catalogStats } from "./catalog";
import { ensureDemoLoop } from "./demo";
import { countVotes, getState } from "./store";
import { STATUS_LABEL, tally } from "./scoring";
import type { CatalogLaw, LawStatus, Tallies } from "./types";

export function boot() {
  getState();
  ensureDemoLoop();
}

export function targetTally(targetId: string, kind: "law" | "draft" | "decision"): Tallies {
  const s = getState();
  const { up, down } = countVotes(targetId);
  const comments = s.comments.filter((c) => c.targetId === targetId).length;
  const slug = targetId.split(":")[1] ?? "";
  const views = s.views[slug] ?? 0;
  const recent = s.activity.filter((a) => a.href.includes(slug)).slice(0, 12).length;
  return tally(up, down, kind, recent, comments, views, s.statusOverride[targetId]);
}

export function enrichLaw(law: CatalogLaw) {
  const t = targetTally(`law:${law.slug}`, "law");
  return {
    ...law,
    areaLabel: areaLabel(law.area),
    tally: t,
    statusLabel: STATUS_LABEL[t.status],
  };
}

export function trending(limit = 8) {
  return loadCatalog()
    .map(enrichLaw)
    .sort((a, b) => b.tally.heat - a.tally.heat || b.tally.total - a.tally.total)
    .slice(0, limit);
}

export function threatened(limit = 6) {
  const rank: LawStatus[] = ["zur_abwahl", "gefaehrdet", "im_diskurs"];
  return loadCatalog()
    .map(enrichLaw)
    .filter((l) => rank.includes(l.tally.status))
    .sort((a, b) => rank.indexOf(a.tally.status) - rank.indexOf(b.tally.status) || b.tally.total - a.tally.total)
    .slice(0, limit);
}

export function publicSnapshot() {
  boot();
  const s = getState();
  const stats = catalogStats();
  return {
    demo: s.demo,
    stats: {
      ...stats,
      citizens: Object.keys(s.citizens).length,
      comments: s.comments.length,
      drafts: s.drafts.length,
      decisions: s.decisions.length,
    },
    trending: trending(8),
    threatened: threatened(5),
    activity: s.activity.slice(0, 18),
    drafts: s.drafts.map((d) => ({
      ...d,
      tally: targetTally(`draft:${d.id}`, "draft"),
      statusLabel: STATUS_LABEL[targetTally(`draft:${d.id}`, "draft").status],
    })),
    decisions: s.decisions.map((d) => ({
      ...d,
      tally: targetTally(`decision:${d.id}`, "decision"),
      statusLabel: STATUS_LABEL[targetTally(`decision:${d.id}`, "decision").status],
    })),
  };
}

export function lawPage(slug: string) {
  boot();
  const law = loadFullLaw(slug);
  if (!law) return null;
  const s = getState();
  const t = targetTally(`law:${slug}`, "law");
  return {
    law: { ...law, areaLabel: areaLabel(law.area) },
    tally: t,
    statusLabel: STATUS_LABEL[t.status],
    comments: s.comments.filter((c) => c.targetId === `law:${slug}`).slice(0, 40),
    related: loadCatalog()
      .filter((l) => l.area === law.area && l.slug !== slug)
      .slice(0, 6)
      .map(enrichLaw),
  };
}
