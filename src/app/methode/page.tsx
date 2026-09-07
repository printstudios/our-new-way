import { DemoBanner } from "@/components/DemoBanner";
import { ELECTORATE, PASS_RATE, quorumNeeded } from "@/lib/scoring";

export const metadata = { title: "Methode" };

export default function MethodPage() {
  return (
    <>
      <DemoBanner />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-[12px] uppercase tracking-[0.22em] text-gold">Auszählung</p>
        <h1 className="serif text-4xl text-navy mt-2">Unparteiisch, prüfbar, in Echtzeit</h1>
        <div className="mt-6 space-y-6 text-[17px] leading-8 text-ink">
          <p>
            Politikerinnen und Politiker sind nicht das Recht. Sie waren ein Verfahren, weil das
            Volk kein gemeinsames Register hatte. Dieses Register ist der Vorschlag, das Verfahren
            selbst in die Hand zu nehmen.
          </p>
          <h2 className="serif text-2xl text-navy">Wilson-Heuristik</h2>
          <p>
            Rangfolgen nutzen die untere Wilson-Grenze, nicht rohe Prozente. Ein Text mit 3 von 3
            Stimmen steht nicht über einem Text mit 8&nbsp;000 von 10&nbsp;000. Reihenfolge der
            Stimmen ändert das Ergebnis nicht. Es gibt keine geheimen Gewichte.
          </p>
          <h2 className="serif text-2xl text-navy">Schwellen der Demo</h2>
          <p>
            Demo-Wahlkörper: {ELECTORATE} simulierte Bürgerinnen und Bürger. Quorum:{" "}
            {quorumNeeded()} Stimmen. Annahme oder Abwahl: {Math.round(PASS_RATE * 100)}&nbsp;% der
            abgegebenen Stimmen. Diese Zahlen sind Parameter. Sie gehören später in denselben
            Diskurs wie die Gesetze selbst.
          </p>
          <h2 className="serif text-2xl text-navy">Maschine ohne Meinung</h2>
          <p>
            Die Prüfung neuer Entwürfe ist kein Orakel. Sie ordnet das Rechtsfeld, sucht nahe
            Texte und markiert gegenläufige Begriffe. Sie darf nichts beschließen. Sie darf nur
            zeigen, wo der Bestand schon spricht.
          </p>
          <h2 className="serif text-2xl text-navy">Was diese Seite nicht ist</h2>
          <p>
            Keine Behörde. Kein Ersatzgericht. Keine geheime Volkszählung. Ausweis-Anmeldung ist
            vorbereitet, noch nicht angeschlossen. Bis dahin gilt: eine Stimme je Sitzung, offener
            Diskurs, voller Quellcode.
          </p>
        </div>
      </div>
    </>
  );
}
