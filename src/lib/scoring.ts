import type { LawStatus, Tallies } from "./types";

export const ELECTORATE = 847;
export const QUORUM_RATE = 0.05;
export const PASS_RATE = 0.55;

export function quorumNeeded(electorate = ELECTORATE): number {
  return Math.max(24, Math.ceil(electorate * QUORUM_RATE));
}

/** Wilson lower bound — unparteiische Rangfolge, unabhängig von Reihenfolge. */
export function wilsonLower(up: number, n: number, z = 1.96): number {
  if (n <= 0) return 0;
  const p = up / n;
  const z2 = z * z;
  const denom = 1 + z2 / n;
  const center = p + z2 / (2 * n);
  const margin = z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n);
  return (center - margin) / denom;
}

export function heatScore(total: number, recent: number, comments: number, views: number): number {
  return recent * 4 + comments * 2.2 + Math.log10(total + 1) * 3 + Math.log10(views + 1);
}

export function deriveStatus(kind: "law" | "draft" | "decision", up: number, down: number): LawStatus {
  const total = up + down;
  const q = quorumNeeded();
  const upRate = total ? up / total : 0;
  const downRate = total ? down / total : 0;
  if (kind === "law") {
    if (total >= q && downRate >= PASS_RATE) return "zur_abwahl";
    if (total >= Math.ceil(q * 0.6) && downRate >= 0.5) return "gefaehrdet";
    if (total >= 12) return "im_diskurs";
    return "in_kraft";
  }
  if (total >= q && upRate >= PASS_RATE) return "zur_annahme";
  if (total >= 8) return "im_diskurs";
  return "entwurf";
}

export function tally(
  up: number,
  down: number,
  kind: "law" | "draft" | "decision",
  recent = 0,
  comments = 0,
  views = 0,
  override?: LawStatus,
): Tallies {
  const total = up + down;
  return {
    up,
    down,
    total,
    score: wilsonLower(up, total),
    percentUp: total ? Math.round((up / total) * 1000) / 10 : 0,
    quorum: total >= quorumNeeded(),
    status: override ?? deriveStatus(kind, up, down),
    heat: heatScore(total, recent, comments, views),
  };
}

export const STATUS_LABEL: Record<LawStatus, string> = {
  in_kraft: "In Kraft",
  im_diskurs: "Im Diskurs",
  gefaehrdet: "Mehrheit kritisch",
  zur_abwahl: "Schwelle zur Abwahl",
  entlassen: "Abgewählt (Konzept)",
  entwurf: "Entwurf",
  zur_annahme: "Schwelle zur Annahme",
  angenommen: "Angenommen (Konzept)",
};
