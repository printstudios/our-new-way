import { DemoBanner } from "@/components/DemoBanner";
import { DraftForm } from "@/components/DraftForm";

export const metadata = { title: "Neuer Entwurf" };

export default async function NewDraftPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  return (
    <>
      <DemoBanner />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-[12px] uppercase tracking-[0.22em] text-gold">Schreiben</p>
        <h1 className="serif text-4xl text-navy mt-2">Neuen Gesetzentwurf einbringen</h1>
        <p className="mt-3 text-muted leading-relaxed">
          Schreiben Sie, als würde das Volk morgen danach leben. Die Heuristik prüft Feld,
          Doppelungen und Widersprüche. Niemand allein setzt Recht — der Diskurs tut es.
        </p>
        <div className="mt-8 paper-card p-6">
          <DraftForm refSlug={ref} />
        </div>
      </div>
    </>
  );
}
