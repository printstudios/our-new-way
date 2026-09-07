import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <p className="text-[12px] uppercase tracking-[0.22em] text-gold">404</p>
      <h1 className="serif text-4xl text-navy mt-2">Dieser Eintrag liegt nicht im Register.</h1>
      <Link href="/gesetze" className="inline-block mt-6 underline underline-offset-4">
        Zurück zum Katalog
      </Link>
    </div>
  );
}
