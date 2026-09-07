import Link from "next/link";
import { DemoBanner } from "@/components/DemoBanner";
import { StatusPill } from "@/components/StatusPill";
import { VoteBar } from "@/components/VoteBar";
import { publicSnapshot } from "@/lib/snapshot";

export const metadata = { title: "Abstimmen" };

export default function VotesPage() {
  const { decisions } = publicSnapshot();
  return (
    <>
      <DemoBanner />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-[12px] uppercase tracking-[0.22em] text-gold">Gemeinwesen</p>
        <h1 className="serif text-4xl text-navy mt-2">Lagen zur Abstimmung</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Geopolitik, Krisen, Grundsätze. Was früher in Gremien verschwand, liegt hier auf dem Tisch.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {decisions.map((d) => (
            <Link key={d.id} href={`/abstimmen/${d.id}`} className="paper-card p-6 hover:border-gold cursor-pointer">
              <p className="text-[11px] uppercase tracking-[0.16em] text-gold">{d.kind}</p>
              <div className="mt-2">
                <StatusPill status={d.tally.status} label={d.statusLabel} />
              </div>
              <h2 className="serif text-2xl text-navy mt-3">{d.title}</h2>
              <p className="mt-3 text-muted line-clamp-4">{d.body}</p>
              <div className="mt-4">
                <VoteBar tally={d.tally} compact />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
