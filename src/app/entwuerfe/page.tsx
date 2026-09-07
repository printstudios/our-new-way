import Link from "next/link";
import { DemoBanner } from "@/components/DemoBanner";
import { StatusPill } from "@/components/StatusPill";
import { VoteBar } from "@/components/VoteBar";
import { publicSnapshot } from "@/lib/snapshot";

export const metadata = { title: "Entwürfe" };

export default function DraftsPage() {
  const { drafts } = publicSnapshot();
  return (
    <>
      <DemoBanner />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-[12px] uppercase tracking-[0.22em] text-gold">Gesetzgebung</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="serif text-4xl text-navy">Entwürfe des Volkes</h1>
          <Link
            href="/entwuerfe/neu"
            className="bg-navy text-paper-2 px-4 py-2.5 text-[12px] uppercase tracking-[0.14em] cursor-pointer hover:bg-navy-2"
          >
            Neuen Entwurf
          </Link>
        </div>
        <p className="mt-3 max-w-2xl text-muted">
          Jeder Entwurf wird heuristisch gegen den Bestand gelegt: Rechtsfeld, Nähe, Widerspruch.
          Genug Zustimmung — und der Text steht zur Annahme.
        </p>
        <div className="mt-8 space-y-4">
          {drafts.map((d) => (
            <Link key={d.id} href={`/entwuerfe/${d.id}`} className="paper-card block p-6 hover:border-gold cursor-pointer">
              <StatusPill status={d.tally.status} label={d.statusLabel} />
              <h2 className="serif text-2xl text-navy mt-3">{d.title}</h2>
              <p className="mt-2 text-muted line-clamp-3">{d.body}</p>
              <div className="mt-4 max-w-md">
                <VoteBar tally={d.tally} compact />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
