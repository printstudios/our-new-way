import Link from "next/link";
import { Seal } from "./Seal";

const NAV = [
  ["/", "Start"],
  ["/gesetze", "Gesetze"],
  ["/entwuerfe", "Entwürfe"],
  ["/abstimmen", "Abstimmen"],
  ["/diskurs", "Diskurs"],
  ["/methode", "Methode"],
  ["/open-source", "Quellcode"],
];

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col">
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-paper-2 focus:px-3 focus:py-2"
      >
        Zum Inhalt
      </a>
      <div className="bg-navy-2 text-paper-2 text-[11px] tracking-[0.18em] uppercase">
        <div className="mx-auto max-w-6xl px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <span>Konzept-Demonstration · Keine amtliche Stelle · Beschlüsse nicht rechtsverbindlich</span>
          <span className="text-gold-2">Deutschland · Bundesrecht · Open Source</span>
        </div>
      </div>
      <header className="border-b border-rule bg-paper-2">
        <div className="mx-auto max-w-6xl px-4 py-5 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-4 min-w-0">
            <Seal className="h-14 w-14 shrink-0" />
            <span className="min-w-0">
              <span className="block serif text-2xl md:text-3xl leading-none tracking-tight text-navy">
                Our New Way
              </span>
              <span className="block mt-1 text-[12px] uppercase tracking-[0.22em] text-muted">
                Offene Bürgerplattform · Bundesrepublik
              </span>
            </span>
          </Link>
          <div className="ml-auto hidden md:block text-right text-[12px] text-muted leading-relaxed">
            Ein Land. Alle Gesetze.
            <br />
            Das Volk zählt selbst.
          </div>
        </div>
        <nav aria-label="Hauptnavigation" className="border-t border-rule">
          <ul className="mx-auto max-w-6xl px-2 flex flex-wrap">
            {NAV.map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-flex px-3 py-3 text-[13px] uppercase tracking-[0.16em] text-navy hover:bg-[#efe6d2] transition-colors cursor-pointer"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main id="inhalt" className="flex-1">
        {children}
      </main>
      <footer className="border-t border-rule bg-navy-2 text-paper-2 mt-16">
        <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3 text-sm leading-relaxed">
          <div>
            <p className="serif text-xl text-gold-2">Our New Way</p>
            <p className="mt-3 text-white/75">
              Offenes System für Gesetzgebung durch die Bürgerinnen und Bürger. Kein Staatswappen.
              Keine Amtsanmaßung. Eine Einladung zum Diskurs.
            </p>
          </div>
          <div>
            <p className="uppercase tracking-[0.16em] text-[11px] text-gold-2">Rechtstexte</p>
            <p className="mt-3 text-white/75">
              Die Gesetzestexte stammen aus dem amtlichen Angebot{" "}
              <a className="underline underline-offset-2" href="https://www.gesetze-im-internet.de/">
                gesetze-im-internet.de
              </a>{" "}
              (BMJV / juris). Amtliche Werke sind gemeinfrei.
            </p>
          </div>
          <div>
            <p className="uppercase tracking-[0.16em] text-[11px] text-gold-2">Software</p>
            <p className="mt-3 text-white/75">
              Der gesamte Code ist frei. Laden, prüfen, forken, verbessern.{" "}
              <Link className="underline underline-offset-2" href="/open-source">
                Quellcode und QR
              </Link>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
