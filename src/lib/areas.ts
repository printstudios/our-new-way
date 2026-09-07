export const AREAS: Record<string, string> = {
  verfassungsrecht: "Verfassungsrecht",
  strafrecht: "Strafrecht",
  zivilrecht: "Zivilrecht",
  sozialrecht: "Sozialrecht",
  steuerrecht: "Steuerrecht",
  arbeitsrecht: "Arbeitsrecht",
  umweltrecht: "Umwelt- und Klimarecht",
  wirtschaftsrecht: "Wirtschaftsrecht",
  verwaltungsrecht: "Verwaltungsrecht",
  gesundheitsrecht: "Gesundheitsrecht",
  digitalrecht: "Digital- und Datenrecht",
  migrationsrecht: "Migrationsrecht",
  baurecht: "Bau- und Planungsrecht",
  verkehrsrecht: "Verkehrsrecht",
  bildungsrecht: "Bildungsrecht",
  sicherheitsrecht: "Sicherheitsrecht",
  wahlrecht: "Wahl- und Parteienrecht",
  energierecht: "Energierecht",
  verordnung: "Verordnungen",
  sonstiges: "Weitere Bundesgesetze",
};

export const AREA_ORDER = Object.keys(AREAS);

export function areaLabel(id: string): string {
  return AREAS[id] ?? "Weitere Bundesgesetze";
}
