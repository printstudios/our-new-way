import Link from "next/link";
import { StatusPill } from "./StatusPill";
import { VoteBar } from "./VoteBar";
import type { CatalogLaw, LawStatus, Tallies } from "@/lib/types";

export function LawRow({
  law,
}: {
  law: CatalogLaw & { areaLabel?: string; tally: Tallies; statusLabel: string };
}) {
  return (
    <Link
      href={`/gesetze/${law.slug}`}
      className="paper-card block p-4 md:p-5 hover:border-gold transition-colors cursor-pointer"
    >
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {law.abbrev ? (
              <span className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy">
                {law.abbrev}
              </span>
            ) : null}
            <StatusPill status={law.tally.status as LawStatus} label={law.statusLabel} />
            <span className="text-[11px] uppercase tracking-[0.12em] text-muted">
              {law.areaLabel}
            </span>
          </div>
          <h3 className="serif text-xl leading-snug text-navy">{law.title}</h3>
          {law.excerpt ? (
            <p className="mt-2 text-sm text-muted line-clamp-2">{law.excerpt}</p>
          ) : null}
        </div>
        <div className="w-full md:w-56 shrink-0">
          <VoteBar tally={law.tally} compact />
        </div>
      </div>
    </Link>
  );
}
