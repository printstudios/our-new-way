import { AREAS, areaLabel } from "@/lib/areas";
import { loadCatalog } from "@/lib/catalog";
import { enrichLaw } from "@/lib/snapshot";
import { LawRow } from "@/components/LawRow";
import { DemoBanner } from "@/components/DemoBanner";

export const metadata = { title: "Gesetze" };

export default async function GesetzePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; area?: string; sort?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const area = sp.area ?? "";
  const sort = sp.sort ?? "name";
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const per = 24;

  let rows = loadCatalog().map(enrichLaw);
  if (area) rows = rows.filter((l) => l.area === area);
  if (q) {
    const needle = q.toLocaleLowerCase("de");
    rows = rows.filter((l) =>
      `${l.abbrev} ${l.title} ${l.tocTitle} ${l.slug}`.toLocaleLowerCase("de").includes(needle),
    );
  }
  if (sort === "trend") rows.sort((a, b) => b.tally.heat - a.tally.heat);
  else if (sort === "votes") rows.sort((a, b) => b.tally.total - a.tally.total);
  else rows.sort((a, b) => a.title.localeCompare(b.title, "de"));

  const total = rows.length;
  const slice = rows.slice((page - 1) * per, page * per);
  const pages = Math.max(1, Math.ceil(total / per));

  function href(next: Record<string, string | number | undefined>) {
    const p = new URLSearchParams();
    const merged = { q, area, sort, page, ...next };
    if (merged.q) p.set("q", String(merged.q));
    if (merged.area) p.set("area", String(merged.area));
    if (merged.sort && merged.sort !== "name") p.set("sort", String(merged.sort));
    if (merged.page && Number(merged.page) > 1) p.set("page", String(merged.page));
    const s = p.toString();
    return s ? `/gesetze?${s}` : "/gesetze";
  }

  return (
    <>
      <DemoBanner />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-[12px] uppercase tracking-[0.22em] text-gold">Register des Bundes</p>
        <h1 className="serif mt-2 text-4xl text-navy">Alle Bundesgesetze</h1>
        <p className="mt-3 max-w-2xl text-muted">
          {total.toLocaleString("de-DE")} Treffer. Quelle: Gesetze im Internet. Jeder Eintrag kann
          bewertet und im Diskurs gehalten werden.
        </p>

        <form className="mt-6 grid gap-3 md:grid-cols-12" action="/gesetze" method="get">
          <label className="md:col-span-6 text-sm">
            <span className="sr-only">Suche</span>
            <input
              name="q"
              defaultValue={q}
              placeholder="Titel, Abkürzung, Stichwort"
              className="w-full border border-rule bg-paper-2 px-3 py-2.5"
            />
          </label>
          <label className="md:col-span-3 text-sm">
            <span className="sr-only">Bereich</span>
            <select name="area" defaultValue={area} className="w-full border border-rule bg-paper-2 px-3 py-2.5">
              <option value="">Alle Rechtsfelder</option>
              {Object.keys(AREAS).map((id) => (
                <option key={id} value={id}>
                  {areaLabel(id)}
                </option>
              ))}
            </select>
          </label>
          <label className="md:col-span-2 text-sm">
            <span className="sr-only">Sortierung</span>
            <select name="sort" defaultValue={sort} className="w-full border border-rule bg-paper-2 px-3 py-2.5">
              <option value="name">A–Z</option>
              <option value="trend">Trending</option>
              <option value="votes">Stimmen</option>
            </select>
          </label>
          <button className="md:col-span-1 bg-navy text-paper-2 text-[12px] uppercase tracking-[0.12em] cursor-pointer hover:bg-navy-2">
            Filtern
          </button>
        </form>

        <div className="mt-6 space-y-3">
          {slice.map((law) => (
            <LawRow key={law.slug} law={law} />
          ))}
        </div>

        <nav className="mt-8 flex items-center justify-between text-sm" aria-label="Blättern">
          <a
            href={href({ page: Math.max(1, page - 1) })}
            className={page === 1 ? "pointer-events-none opacity-40" : "underline underline-offset-4"}
          >
            Zurück
          </a>
          <span className="text-muted">
            Seite {page} von {pages}
          </span>
          <a
            href={href({ page: Math.min(pages, page + 1) })}
            className={page >= pages ? "pointer-events-none opacity-40" : "underline underline-offset-4"}
          >
            Weiter
          </a>
        </nav>
      </div>
    </>
  );
}
