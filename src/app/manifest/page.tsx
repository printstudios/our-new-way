import { DemoBanner } from "@/components/DemoBanner";

export const metadata = { title: "Manifest" };

export default function ManifestPage() {
  return (
    <>
      <DemoBanner />
      <article className="mx-auto max-w-3xl px-4 py-10 text-[17px] leading-8">
        <p className="text-[12px] uppercase tracking-[0.22em] text-gold">Grundsatz</p>
        <h1 className="serif text-4xl text-navy mt-2">Wir leben jetzt.</h1>
        <p className="mt-6">
          Wir leben in einer der wichtigsten Zeiten der Menschheit. Wer 1999 geboren wurde, hat das
          Netz, den Rechner und das Telefon wachsen sehen. Allgemeine künstliche Intelligenz wird
          nicht lange mehr Theorie bleiben. Ein System mit Auftrag und Mitteln kann planen, bestellen,
          bauen, verwalten.
        </p>
        <p className="mt-4">
          Die Frage ist nicht, ob das kommt. Die Frage ist, für wen. Für alle — oder für wenige.
        </p>
        <p className="mt-4">
          Wenn wir schlafen, entscheiden Vorstände. Wenn wir aufwachen, entscheiden wir. Macht, die
          nur gilt, weil wir sie hinnehmen, ist keine Naturgewalt.
        </p>
        <p className="mt-4">
          Der Sinn des Lebens ist, dass das Leben nicht endet. Kinder. Schutz. Den Planeten hüten.
          Das Leben weitertragen. Alles andere ist Extra.
        </p>
        <p className="mt-4">
          Deshalb dieses Register: Gesetze des Volkes, durch das Volk, in der Sprache des Volkes.
          Nicht perfekt. Nicht fertig. Offen. Gemeinsam.
        </p>
      </article>
    </>
  );
}
