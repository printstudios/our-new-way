import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentForm } from "@/components/CommentForm";
import { DemoBanner } from "@/components/DemoBanner";
import { StatusPill } from "@/components/StatusPill";
import { VoteBar } from "@/components/VoteBar";
import { VoteButtons } from "@/components/VoteButtons";
import { bumpView } from "@/lib/store";
import { lawPage } from "@/lib/snapshot";
import { quorumNeeded } from "@/lib/scoring";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = lawPage(slug);
  return { title: data?.law.abbrev || data?.law.title || "Gesetz" };
}

export default async function LawDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = lawPage(slug);
  if (!data) notFound();
  bumpView(slug);
  const { law, tally, statusLabel, comments, related } = data;

  return (
    <>
      <DemoBanner />
      <article className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-[12px] uppercase tracking-[0.22em] text-gold">{law.areaLabel}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {law.abbrev ? <span className="serif text-3xl text-navy">{law.abbrev}</span> : null}
          <StatusPill status={tally.status} label={statusLabel} />
        </div>
        <h1 className="serif mt-3 text-3xl md:text-5xl text-navy leading-tight">{law.title}</h1>
        <p className="mt-4 text-sm text-muted">
          {law.date ? `Ausfertigung ${law.date}` : "Datum laut Register"}
          {law.stand ? ` · ${law.stand}` : ""}
          {" · "}
          <a className="underline underline-offset-2" href={law.sourceHtml}>
            Amtliche Quelle
          </a>
          {` · ${law.sectionCount} Abschnitte`}
        </p>

        <div className="mt-8 paper-card p-5 md:p-6 grid gap-5 md:grid-cols-2">
          <div>
            <VoteBar tally={tally} />
            <p className="mt-3 text-sm text-muted">
              Abwahl oder Änderung braucht Quorum ({quorumNeeded()} Stimmen in der Demo) und 55&nbsp;%
              der abgegebenen Stimmen. Die Schwellen sind Parameter — das Volk legt sie später fest.
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted mb-3">Ihre Stimme</p>
            <VoteButtons targetId={`law:${law.slug}`} />
            <Link
              href={`/entwuerfe/neu?ref=${law.slug}`}
              className="inline-block mt-4 text-[12px] uppercase tracking-[0.14em] underline underline-offset-4"
            >
              Änderung dieses Gesetzes vorschlagen
            </Link>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="serif text-3xl text-navy">Wortlaut</h2>
          {law.sections.length === 0 ? (
            <p className="mt-4 text-muted">
              Der Volltext wird aus dem amtlichen XML nachgeladen. Der Titel steht bereits im
              vollständigen Bundesregister.
            </p>
          ) : (
            <div className="mt-6 space-y-8">
              {law.sections.slice(0, 40).map((sec, i) => (
                <section key={`${sec.ref}-${i}`}>
                  <h3 className="serif text-xl text-navy">
                    {sec.ref}
                    {sec.heading ? <span className="text-muted"> — {sec.heading}</span> : null}
                  </h3>
                  {sec.text ? (
                    <div className="mt-2 whitespace-pre-wrap text-[17px] leading-8 text-ink">
                      {sec.text}
                    </div>
                  ) : null}
                </section>
              ))}
              {law.sections.length > 40 ? (
                <p className="text-sm text-muted">
                  Weitere {law.sections.length - 40} Abschnitte in der amtlichen Quelle.
                </p>
              ) : null}
            </div>
          )}
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 className="serif text-3xl text-navy">Diskurs</h2>
            <div className="mt-5">
              <CommentForm targetId={`law:${law.slug}`} />
            </div>
            <ol className="mt-6 divide-y divide-rule">
              {comments.map((c) => (
                <li key={c.id} className="py-4">
                  <p className="text-sm font-semibold">
                    {c.name} <span className="font-normal text-muted">· {c.city}</span>
                  </p>
                  <p className="mt-1 leading-relaxed">{c.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <aside className="lg:col-span-2">
            <h2 className="serif text-2xl text-navy">Nachbarrecht</h2>
            <ul className="mt-4 space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/gesetze/${r.slug}`} className="text-sm underline underline-offset-2">
                    {r.abbrev ? `${r.abbrev} — ` : ""}
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </article>
    </>
  );
}
