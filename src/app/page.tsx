import Link from "next/link";
import { DemoBanner } from "@/components/DemoBanner";
import { LawRow } from "@/components/LawRow";
import { LiveFeed } from "@/components/LiveFeed";
import { QrFrame } from "@/components/QrFrame";
import { StatusPill } from "@/components/StatusPill";
import { VoteBar } from "@/components/VoteBar";
import { publicSnapshot } from "@/lib/snapshot";

export default function HomePage() {
  const snap = publicSnapshot();
  const site = process.env.PUBLIC_URL || "https://our-new-way.com";

  return (
    <>
      <DemoBanner />
      <section className="border-b border-rule bg-navy text-paper-2">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <p className="text-[12px] uppercase tracking-[0.28em] text-gold-2">
            Bundesrepublik · Bürgerrecht · 2026
          </p>
          <h1 className="serif mt-4 max-w-4xl text-4xl md:text-6xl leading-[1.12] tracking-tight">
            Das Recht gehört dem Volk.
          </h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-white/80">
            Alle Bundesgesetze liegen offen. Jede Bürgerin, jeder Bürger kann sie
            prüfen, bewerten, widersprechen, verbessern. Auszählung in Echtzeit.
            Ohne Partei. Ohne Hinterzimmer.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/gesetze"
              className="bg-gold-2 text-navy-2 px-5 py-3 text-[12px] uppercase tracking-[0.16em] hover:bg-[#d4b56a] transition-colors cursor-pointer"
            >
              Alle Gesetze
            </Link>
            <Link
              href="/entwuerfe/neu"
              className="border border-white/40 px-5 py-3 text-[12px] uppercase tracking-[0.16em] hover:bg-white/10 transition-colors cursor-pointer"
            >
              Entwurf einbringen
            </Link>
            <Link
              href="/methode"
              className="border border-transparent px-5 py-3 text-[12px] uppercase tracking-[0.16em] text-white/80 hover:text-white cursor-pointer"
            >
              Wie die Zählung arbeitet
            </Link>
          </div>
          <dl className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-gold-2">Bundesrecht</dt>
              <dd className="serif mt-1 text-3xl">{snap.stats.count.toLocaleString("de-DE")}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-gold-2">Volltexte geladen</dt>
              <dd className="serif mt-1 text-3xl">{snap.stats.withText.toLocaleString("de-DE")}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-gold-2">Stimmen im Raum</dt>
              <dd className="serif mt-1 text-3xl">{snap.stats.citizens.toLocaleString("de-DE")}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-gold-2">Rechtsfelder</dt>
              <dd className="serif mt-1 text-3xl">{snap.stats.areas}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="serif text-3xl text-navy">Im Trend</h2>
            <Link href="/gesetze?sort=trend" className="text-[12px] uppercase tracking-[0.14em] text-muted hover:text-navy">
              Gesamtkatalog
            </Link>
          </div>
          <p className="text-sm text-muted">
            Oben steht, worüber das Volk gerade spricht — gemessen an frischer
            Beteiligung, nicht an Geld, Reichweite oder Parteizentrale.
          </p>
          <div className="space-y-3">
            {snap.trending.map((law) => (
              <LawRow key={law.slug} law={law} />
            ))}
          </div>
        </div>
        <aside className="lg:col-span-2">
          <div className="paper-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="live-dot" />
              <h2 className="serif text-2xl text-navy">Jetzt im Land</h2>
            </div>
            <LiveFeed initial={snap.activity} />
          </div>
        </aside>
      </section>

      <section className="bg-[#efe6d2] border-y border-rule">
        <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 md:grid-cols-3">
          {[
            ["1 · Sehen", "Jedes geltende Bundesgesetz liegt hier. Quelle: das amtliche Register. Nichts versteckt."],
            ["2 · Zählen", "Dafür oder dagegen. Wilson-Heuristik, Quorum, Schwellen. Keine geheimen Gewichte."],
            ["3 · Schreiben", "Neue Texte werden gegen den Bestand geprüft: Feld, Doppelung, Widerspruch."],
          ].map(([t, d]) => (
            <div key={t}>
              <h3 className="serif text-2xl text-navy">{t}</h3>
              <p className="mt-3 text-muted leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="serif text-3xl text-navy">Vorlagen des Volkes</h2>
          <div className="mt-5 space-y-3">
            {snap.drafts.map((d) => (
              <Link key={d.id} href={`/entwuerfe/${d.id}`} className="paper-card block p-5 hover:border-gold cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <StatusPill status={d.tally.status} label={d.statusLabel} />
                </div>
                <h3 className="serif text-xl text-navy">{d.title}</h3>
                <div className="mt-3">
                  <VoteBar tally={d.tally} compact />
                </div>
              </Link>
            ))}
          </div>
          <Link href="/entwuerfe/neu" className="inline-block mt-5 text-[12px] uppercase tracking-[0.14em] text-navy underline underline-offset-4">
            Eigenen Entwurf einbringen
          </Link>
        </div>
        <div>
          <h2 className="serif text-3xl text-navy">Lagen zur Abstimmung</h2>
          <div className="mt-5 space-y-3">
            {snap.decisions.map((d) => (
              <Link key={d.id} href={`/abstimmen/${d.id}`} className="paper-card block p-5 hover:border-gold cursor-pointer">
                <p className="text-[11px] uppercase tracking-[0.16em] text-gold">{d.kind}</p>
                <h3 className="serif text-xl text-navy mt-1">{d.title}</h3>
                <div className="mt-3">
                  <VoteBar tally={d.tally} compact />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 grid gap-8 md:grid-cols-[1.2fr_0.8fr] items-center">
        <div>
          <h2 className="serif text-3xl md:text-4xl text-navy">
            Der Sinn bleibt: dass das Leben nicht endet.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Technik kann Städte bauen, Güter erzeugen, Straßen hüten. Ob sie allen
            dient oder wenigen, entscheidet kein Vorstand. Das entscheiden wir —
            sichtbar, gemeinsam, in diesem Register.
          </p>
          <p className="mt-4 text-muted leading-relaxed">
            Laden Sie den Code. Prüfen Sie die Zählung. Laden Sie Menschen ein, die
            etwas zu sagen haben. Keine Regierung der Welt wird uns darum bitten.
          </p>
        </div>
        <QrFrame value={site} caption="Scannen · mitmachen · den Code mitnehmen" />
      </section>
    </>
  );
}
