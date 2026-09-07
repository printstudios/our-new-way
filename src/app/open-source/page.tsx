import { DemoBanner } from "@/components/DemoBanner";
import { QrFrame } from "@/components/QrFrame";

export const metadata = { title: "Quellcode" };

export default function OpenSourcePage() {
  const site = process.env.PUBLIC_URL || "https://our-new-way.com";
  const repo = process.env.PUBLIC_REPO || "https://github.com/printstudios/our-new-way";
  return (
    <>
      <DemoBanner />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-[12px] uppercase tracking-[0.22em] text-gold">Offenheit</p>
        <h1 className="serif text-4xl text-navy mt-2">Nehmen Sie das System mit</h1>
        <p className="mt-3 max-w-2xl text-muted leading-relaxed">
          Der gesamte Code ist frei. Die Gesetzestexte sind amtlich und gemeinfrei. Wer uns nicht
          traut, soll uns lesen.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <QrFrame value={site} caption="Plattform — our-new-way.com" />
          <QrFrame value={repo} caption="Quellcode auf GitHub" />
        </div>
        <div className="mt-10 paper-card p-6 text-[17px] leading-8">
          <p>
            Lizenz der Software: MIT. Lizenz der Rechtstexte: amtliche Werke, gemeinfrei, Quelle
            Bundesministerium der Justiz / juris GmbH.
          </p>
          <p className="mt-4">
            <a className="underline underline-offset-4" href={repo}>
              {repo}
            </a>
          </p>
          <p className="mt-4">
            <a className="underline underline-offset-4" href="/api/source.zip">
              Quellarchiv als ZIP laden
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
