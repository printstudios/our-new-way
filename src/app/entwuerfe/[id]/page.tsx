import { notFound } from "next/navigation";
import { CommentForm } from "@/components/CommentForm";
import { DemoBanner } from "@/components/DemoBanner";
import { StatusPill } from "@/components/StatusPill";
import { VoteBar } from "@/components/VoteBar";
import { VoteButtons } from "@/components/VoteButtons";
import { getState } from "@/lib/store";
import { targetTally } from "@/lib/snapshot";
import { STATUS_LABEL } from "@/lib/scoring";
import Link from "next/link";

export default async function DraftDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const draft = getState().drafts.find((d) => d.id === id);
  if (!draft) notFound();
  const tally = targetTally(`draft:${id}`, "draft");

  return (
    <>
      <DemoBanner />
      <article className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/entwuerfe" className="text-[12px] uppercase tracking-[0.14em] text-muted">
          Alle Entwürfe
        </Link>
        <div className="mt-4">
          <StatusPill status={tally.status} label={STATUS_LABEL[tally.status]} />
        </div>
        <h1 className="serif text-4xl text-navy mt-3">{draft.title}</h1>
        <p className="mt-2 text-sm text-muted">
          Eingebracht von {draft.authorName}
        </p>
        <div className="mt-6 paper-card p-5">
          <VoteBar tally={tally} />
          <div className="mt-4">
            <VoteButtons targetId={`draft:${id}`} />
          </div>
        </div>
        <div className="mt-8 whitespace-pre-wrap text-[17px] leading-8">{draft.body}</div>
        {draft.analysis ? (
          <aside className="mt-8 paper-card p-5 text-sm leading-relaxed">
            <h2 className="serif text-2xl text-navy">Heuristik</h2>
            <p className="mt-3">{draft.analysis.summary}</p>
            <p className="mt-2 text-muted">Rechtsfeld: {draft.analysis.areaLabel}</p>
            {draft.analysis.similar.length ? (
              <ul className="mt-3 space-y-1">
                {draft.analysis.similar.map((s) => (
                  <li key={s.slug}>
                    <Link className="underline underline-offset-2" href={`/gesetze/${s.slug}`}>
                      {s.abbrev ? `${s.abbrev} — ` : ""}
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </aside>
        ) : null}
        <section className="mt-10">
          <h2 className="serif text-2xl text-navy">Diskurs</h2>
          <div className="mt-4">
            <CommentForm targetId={`draft:${id}`} />
          </div>
        </section>
      </article>
    </>
  );
}
