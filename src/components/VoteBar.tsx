import type { Tallies } from "@/lib/types";

export function VoteBar({ tally, compact = false }: { tally: Tallies; compact?: boolean }) {
  const up = tally.total ? (tally.up / tally.total) * 100 : 50;
  return (
    <div className="w-full">
      <div className="flex justify-between text-[11px] tracking-wide uppercase text-muted mb-1.5">
        <span>Dafür {tally.up.toLocaleString("de-DE")}</span>
        <span>Dagegen {tally.down.toLocaleString("de-DE")}</span>
      </div>
      <div className="h-2 w-full bg-[#e4d8bf] overflow-hidden" aria-hidden="true">
        <div className="h-full bg-yes" style={{ width: `${up}%` }} />
      </div>
      {!compact && (
        <p className="mt-2 text-sm text-muted">
          {tally.total.toLocaleString("de-DE")} Stimmen · Wilson {tally.score.toFixed(3)}
          {tally.quorum ? " · Quorum erreicht" : " · Quorum offen"}
        </p>
      )}
    </div>
  );
}
