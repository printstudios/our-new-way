import { notFound } from "next/navigation";
import Link from "next/link";
import { CommentForm } from "@/components/CommentForm";
import { DemoBanner } from "@/components/DemoBanner";
import { StatusPill } from "@/components/StatusPill";
import { VoteBar } from "@/components/VoteBar";
import { VoteButtons } from "@/components/VoteButtons";
import { getState } from "@/lib/store";
import { targetTally } from "@/lib/snapshot";
import { STATUS_LABEL } from "@/lib/scoring";

export default async function DecisionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decision = getState().decisions.find((d) => d.id === id);
  if (!decision) notFound();
  const tally = targetTally(`decision:${id}`, "decision");
  const comments = getState().comments.filter((c) => c.targetId === `decision:${id}`);

  return (
    <>
      <DemoBanner />
      <article className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/abstimmen" className="text-[12px] uppercase tracking-[0.14em] text-muted">
          Alle Lagen
        </Link>
        <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-gold">{decision.kind}</p>
        <div className="mt-2">
          <StatusPill status={tally.status} label={STATUS_LABEL[tally.status]} />
        </div>
        <h1 className="serif text-4xl text-navy mt-3">{decision.title}</h1>
        <p className="mt-6 text-[17px] leading-8">{decision.body}</p>
        <div className="mt-8 paper-card p-5">
          <VoteBar tally={tally} />
          <div className="mt-4">
            <VoteButtons targetId={`decision:${id}`} />
          </div>
        </div>
        <section className="mt-10">
          <h2 className="serif text-2xl text-navy">Diskurs</h2>
          <div className="mt-4">
            <CommentForm targetId={`decision:${id}`} />
          </div>
          <ol className="mt-6 divide-y divide-rule">
            {comments.map((c) => (
              <li key={c.id} className="py-4">
                <p className="text-sm font-semibold">
                  {c.name} <span className="font-normal text-muted">· {c.city}</span>
                </p>
                <p className="mt-1">{c.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </article>
    </>
  );
}
