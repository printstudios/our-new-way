import path from "node:path";

export function dataDir(): string {
  return path.join(process.cwd(), "data");
}

export function catalogPath(): string {
  return path.join(dataDir(), "catalog.json");
}

export function lawPath(slug: string): string {
  return path.join(dataDir(), "laws", `${slug}.json`);
}

export function statePath(): string {
  return path.join(dataDir(), "state.json");
}

export function ingestMetaPath(): string {
  return path.join(dataDir(), "ingest-meta.json");
}
