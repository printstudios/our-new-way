import { areaLabel } from "./areas";
import { loadCatalog, tokens } from "./catalog";
import type { CatalogLaw, HeuristicReport } from "./types";

const NEGATION = [
  ["erlauben", "verbieten"],
  ["zulassen", "untersagen"],
  ["fördern", "beschränken"],
  ["einführen", "abschaffen"],
  ["erheben", "streichen"],
  ["verpflichten", "freistellen"],
  ["überwachen", "schützen"],
  ["speichern", "löschen"],
  ["zentralisieren", "dezentralisieren"],
];

function overlap(a: string[], b: string[]): string[] {
  const set = new Set(b);
  return a.filter((t) => set.has(t));
}

function scoreAgainst(queryTokens: string[], law: CatalogLaw): number {
  const lawTokens = tokens(`${law.abbrev} ${law.title} ${law.excerpt}`);
  if (!queryTokens.length || !lawTokens.length) return 0;
  const shared = overlap(queryTokens, lawTokens);
  const jaccard = shared.length / new Set([...queryTokens, ...lawTokens]).size;
  const titleHit = overlap(queryTokens, tokens(law.title)).length * 0.08;
  const abbrevHit = queryTokens.includes(law.abbrev.toLocaleLowerCase("de")) ? 0.2 : 0;
  return jaccard + titleHit + abbrevHit;
}

function detectArea(text: string): string {
  const blob = text.toLocaleLowerCase("de");
  const map: Array<[string, string[]]> = [
    ["verfassungsrecht", ["grundrecht", "verfassung", "menschenwürde", "artikel 1"]],
    ["digitalrecht", ["daten", "algorithm", "ki", "künstliche intelligenz", "überwachung", "plattform"]],
    ["umweltrecht", ["klima", "tier", "arten", "umwelt", "emission"]],
    ["sozialrecht", ["einkommen", "teilhabe", "rente", "grundsicherung", "sozial"]],
    ["steuerrecht", ["steuer", "abgabe", "finanzamt"]],
    ["strafrecht", ["strafe", "haft", "tatbestand"]],
    ["arbeitsrecht", ["arbeit", "lohn", "betrieb"]],
    ["wahlrecht", ["wahl", "volksabstimmung", "plebiszit"]],
  ];
  for (const [area, keys] of map) {
    if (keys.some((k) => blob.includes(k))) return area;
  }
  return "sonstiges";
}

export function analyzeDraft(title: string, body: string): HeuristicReport {
  const text = `${title}\n${body}`;
  const qTokens = tokens(text);
  const area = detectArea(text);
  const ranked = loadCatalog()
    .map((law) => ({ law, score: scoreAgainst(qTokens, law) }))
    .filter((x) => x.score > 0.03)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  const similar = ranked.slice(0, 5).map(({ law, score }) => ({
    slug: law.slug,
    title: law.title,
    abbrev: law.abbrev,
    score: Math.round(score * 1000) / 1000,
    reason: score > 0.12 ? "Hohe begriffliche Nähe zum geltenden Text." : "Verwandtes Regelungsfeld.",
  }));

  const overlaps = ranked
    .filter((x) => x.score > 0.1)
    .slice(0, 3)
    .map(({ law }) => ({
      slug: law.slug,
      title: law.title,
      note: "Ähnlicher Anwendungsbereich. Prüfung, ob eine Änderung des bestehenden Gesetzes reicht.",
    }));

  const contradictions: HeuristicReport["contradictions"] = [];
  const blob = text.toLocaleLowerCase("de");
  for (const { law } of ranked.slice(0, 12)) {
    const lawBlob = `${law.title} ${law.excerpt}`.toLocaleLowerCase("de");
    for (const [a, b] of NEGATION) {
      if ((blob.includes(a) && lawBlob.includes(b)) || (blob.includes(b) && lawBlob.includes(a))) {
        contradictions.push({
          slug: law.slug,
          title: law.title,
          note: `Mögliche Gegenläufigkeit der Begriffe „${a}“ und „${b}“.`,
        });
        break;
      }
    }
  }

  let recommendation: HeuristicReport["recommendation"] = "new";
  if (contradictions.length) recommendation = "conflict";
  else if (overlaps.length) recommendation = "amend";

  const summary =
    recommendation === "conflict"
      ? "Die Heuristik findet mögliche Widersprüche zu geltendem Bundesrecht. Der Entwurf sollte im Diskurs mit den genannten Normen abgeglichen werden — nicht automatisch verworfen."
      : recommendation === "amend"
        ? "Es existieren nahe Gesetze. Die sparsamste Lösung ist oft die Änderung eines bestehenden Textes statt eines neuen Gesetzes."
        : "Kein nahes Bundesgesetz mit hoher Überschneidung. Der Entwurf kann als neues Instrument diskutiert werden.";

  return {
    area,
    areaLabel: areaLabel(area),
    similar,
    overlaps,
    contradictions: contradictions.slice(0, 4),
    recommendation,
    summary,
  };
}
