import { existsSync, readFileSync } from "node:fs";
import { areaLabel } from "./areas";
import { catalogPath, ingestMetaPath, lawPath } from "./paths";
import type { CatalogLaw, FullLaw } from "./types";

let cache: CatalogLaw[] | null = null;
let bySlug: Map<string, CatalogLaw> | null = null;

export function loadCatalog(): CatalogLaw[] {
  if (cache) return cache;
  const file = catalogPath();
  if (!existsSync(file)) {
    cache = [];
    bySlug = new Map();
    return cache;
  }
  cache = JSON.parse(readFileSync(file, "utf-8")) as CatalogLaw[];
  bySlug = new Map(cache.map((l) => [l.slug, l]));
  return cache;
}

export function getCatalogLaw(slug: string): CatalogLaw | null {
  loadCatalog();
  return bySlug?.get(slug) ?? null;
}

export function loadFullLaw(slug: string): FullLaw | null {
  const meta = getCatalogLaw(slug);
  const file = lawPath(slug);
  if (existsSync(file)) {
    const raw = JSON.parse(readFileSync(file, "utf-8")) as FullLaw;
    return {
      ...meta,
      ...raw,
      slug,
      title: raw.title || meta?.title || slug,
      tocTitle: raw.tocTitle || meta?.tocTitle || raw.title,
      abbrev: raw.abbrev || meta?.abbrev || "",
      date: raw.date || meta?.date || "",
      stand: raw.stand || meta?.stand || "",
      area: raw.area || meta?.area || "sonstiges",
      sourceHtml: raw.sourceHtml || meta?.sourceHtml || `https://www.gesetze-im-internet.de/${slug}/`,
      sectionCount: raw.sections?.length ?? raw.sectionCount ?? 0,
      excerpt: raw.excerpt || meta?.excerpt || "",
      hasText: Boolean(raw.sections?.length),
      sections: raw.sections ?? [],
    };
  }
  if (!meta) return null;
  return { ...meta, sections: [] };
}

export function catalogStats() {
  const laws = loadCatalog();
  const withText = laws.filter((l) => l.hasText).length;
  let source = "https://www.gesetze-im-internet.de/gii-toc.xml";
  let license = "Amtliche Werke, gemeinfrei. Quelle: BMJV / juris, gesetze-im-internet.de";
  if (existsSync(ingestMetaPath())) {
    const meta = JSON.parse(readFileSync(ingestMetaPath(), "utf-8")) as {
      source?: string;
      license?: string;
    };
    source = meta.source ?? source;
    license = meta.license ?? license;
  }
  const areas = new Set(laws.map((l) => l.area)).size;
  return { count: laws.length, withText, areas, source, license };
}

export function searchLaws(query: string, area = "", limit = 40, offset = 0): CatalogLaw[] {
  const q = query.trim().toLocaleLowerCase("de");
  let rows = loadCatalog();
  if (area) rows = rows.filter((l) => l.area === area);
  if (q) {
    rows = rows.filter((l) => {
      const hay = `${l.abbrev} ${l.title} ${l.tocTitle} ${l.slug} ${l.excerpt}`.toLocaleLowerCase("de");
      return hay.includes(q);
    });
  }
  return rows.slice(offset, offset + limit);
}

export function tokens(text: string): string[] {
  return text
    .toLocaleLowerCase("de")
    .replace(/[^a-zäöüß0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 3);
}

export { areaLabel };
