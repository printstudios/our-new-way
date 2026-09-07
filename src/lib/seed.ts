import { analyzeDraft } from "./heuristic";
import type { AppState, Citizen } from "./types";

const CITIES = [
  "Berlin", "Hamburg", "München", "Köln", "Frankfurt", "Stuttgart", "Düsseldorf",
  "Leipzig", "Dresden", "Hannover", "Nürnberg", "Bremen", "Essen", "Dortmund",
  "Freiburg", "Rostock", "Kiel", "Aachen", "Erfurt", "Regensburg", "Fürth", "Potsdam",
];

const FIRST = [
  "Anna", "Jonas", "Fatima", "Lukas", "Mira", "Paul", "Leila", "Noah", "Greta", "Emil",
  "Sofia", "Jonas", "Amelie", "Yusuf", "Clara", "Theo", "Hannah", "Omar", "Lina", "Ben",
  "Marie", "David", "Nina", "Ali", "Johanna", "Max", "Sara", "Felix", "Elena", "Tim",
];

const LAST = [
  "Berger", "Hoffmann", "Schmidt", "Nguyen", "Köhler", "Wolf", "Richter", "Krüger",
  "Hartmann", "Scholz", "Lehmann", "König", "Schäfer", "Keller", "Lorenz", "Vogel",
];

export function makeSimulatedCitizens(n = 220): Citizen[] {
  const out: Citizen[] = [];
  for (let i = 0; i < n; i++) {
    const name = `${FIRST[i % FIRST.length]} ${LAST[i % LAST.length]}`;
    out.push({
      id: `sim-${String(i + 1).padStart(3, "0")}`,
      name,
      city: CITIES[i % CITIES.length],
      simulated: true,
    });
  }
  return out;
}

export function seedState(state: AppState): AppState {
  for (const c of makeSimulatedCitizens()) state.citizens[c.id] = c;

  state.decisions = [
    {
      id: "ki-sicherheit-eu",
      kind: "geopolitik",
      createdAt: "2026-09-01T08:00:00.000Z",
      title: "Gemeinsame europäische Sicherheitsstandards für allgemeine künstliche Intelligenz",
      body: "Soll die Bundesrepublik in den kommenden 24 Monaten auf verbindliche, öffentlich prüfbare Sicherheits- und Transparenzstandards für Systeme mit allgemeiner Problemlösefähigkeit hinwirken — und diese Standards nur mittragen, wenn sie demokratisch kontrollierbar bleiben?",
    },
    {
      id: "extremwetter-hilfe",
      kind: "krise",
      createdAt: "2026-08-28T10:00:00.000Z",
      title: "Soforthilfe und Wiederaufbau nach Extremwetter: Vorrang für Leben und Wohnen",
      body: "Im Katastrophenfall sollen Mittel zuerst Leben, Wohnraum, Trinkwasser und medizinische Versorgung sichern. Geopolitische Prestigeprojekte warten. Stimmen Sie diesem Grundsatz für den nächsten Bundeshaushalt zu?",
    },
    {
      id: "mandat-ausland",
      kind: "geopolitik",
      createdAt: "2026-08-12T09:00:00.000Z",
      title: "Kein Auslandseinsatz ohne ausdrückliche, befristete Zustimmung der Bürgerplattform",
      body: "Militärische Mandate außerhalb des Bündnisfalls sollen künftig nicht allein in geschlossenen Gremien verlängert werden. Jede Verlängerung über 90 Tage braucht eine offene Abstimmung mit Begründung, Minderheitenschutz und klarem Enddatum.",
    },
    {
      id: "digitaler-euro",
      kind: "grundsatz",
      createdAt: "2026-07-20T11:00:00.000Z",
      title: "Bargeld bleibt gesetzliches Zahlungsmittel — kein Zwang zu implantierbarer Identität",
      body: "Digitale Zahlungswege dürfen angeboten werden. Sie dürfen nicht zur Bedingung für Teilhabe werden. Ein gesetzliches Recht auf analoge Zahlung und analoge Identifikation bleibt unantastbar.",
    },
  ];

  const drafts = [
    {
      id: "digitale-selbstbestimmung",
      title: "Grundrecht auf digitale Selbstbestimmung",
      body: "Ergänzung des Grundgesetzes: Jeder Mensch hat das Recht, über die Erhebung, Speicherung und automatisierte Auswertung seiner Daten selbst zu bestimmen. Staat und Unternehmen dürfen personenbezogene Profile nur mit klarer, widerruflicher Einwilligung oder auf gesetzlicher Grundlage verwenden, die dem Wesensgehalt der Menschenwürde entspricht. Automatisierte Entscheidungen von erheblicher Tragweite müssen erklärbar und durch Menschen überprüfbar bleiben.",
      authorId: "sim-004",
      authorName: "Mira Schmidt",
    },
    {
      id: "teilhabe-automatisierung",
      title: "Gesetz über die Teilhabe an automatisierter Wertschöpfung",
      body: "Wenn allgemeine künstliche Intelligenz in einem Gemeinwesen wesentliche Güter und Dienste erzeugt, gehört der Ertrag nicht allein den Eigentümern der Modelle. Das Gesetz verpflichtet den Bund, einen öffentlich einsehbaren Teilhabefonds einzurichten. Ausschüttungen erfolgen an alle hier lebenden Menschen, unabhängig von Erwerbsarbeit. Zweck: Leben erhalten, Familien ermöglichen, Würde sichern — nicht Konsum ersetzen.",
      authorId: "sim-011",
      authorName: "Yusuf Hoffmann",
    },
    {
      id: "leben-im-verkehr",
      title: "Gesetz zum Schutz jedes Lebens im Straßenverkehr",
      body: "Verkehrsräume werden so überwacht, dass Unfälle mit Menschen und Tieren in Echtzeit erkannt werden. Automatisierte Hilfe (Sanität, Wildtiere, Räumung) wird ausgelöst, ohne Bewegungsprofile für Werbe- oder Strafzwecke zu speichern. Das Leben — nicht der Verkehrsfluss — ist der Maßstab der Infrastruktur.",
      authorId: "sim-019",
      authorName: "Elena Berger",
    },
  ];

  state.drafts = drafts.map((d) => ({
    ...d,
    area: "verfassungsrecht",
    createdAt: "2026-09-05T12:00:00.000Z",
    analysis: analyzeDraft(d.title, d.body),
  }));

  const seedVotes: Array<[string, number, number]> = [
    ["law:gg", 612, 41],
    ["law:bgb", 388, 96],
    ["law:stgb", 274, 188],
    ["law:bdsg", 401, 77],
    ["law:ifsg", 219, 263],
    ["law:bwahlg", 356, 84],
    ["law:versammlg", 344, 71],
    ["law:tkg", 198, 121],
    ["decision:ki-sicherheit-eu", 502, 63],
    ["decision:digitaler-euro", 544, 48],
    ["decision:extremwetter-hilfe", 488, 39],
    ["decision:mandat-ausland", 361, 142],
    ["draft:digitale-selbstbestimmung", 277, 34],
    ["draft:teilhabe-automatisierung", 241, 88],
    ["draft:leben-im-verkehr", 198, 52],
  ];

  const citizenIds = Object.keys(state.citizens);
  for (const [target, up, down] of seedVotes) {
    state.votes[target] = {};
    for (let i = 0; i < up; i++) state.votes[target][citizenIds[i % citizenIds.length] + "-u" + i] = 1;
    for (let i = 0; i < down; i++) state.votes[target][citizenIds[i % citizenIds.length] + "-d" + i] = -1;
  }

  state.comments = [
    {
      id: "c1",
      targetId: "law:gg",
      citizenId: "sim-002",
      name: "Jonas Hoffmann",
      city: "Hamburg",
      createdAt: "2026-09-06T18:12:00.000Z",
      body: "Artikel 1 ist nicht verhandelbar. Eine Bürgerplattform, die das Grundgesetz zur Abstimmung stellt, muss den Wesensgehalt schützen — sonst wird Mehrheit zur Gefahr.",
    },
    {
      id: "c2",
      targetId: "law:ifsg",
      citizenId: "sim-008",
      name: "Noah Krüger",
      city: "Dresden",
      createdAt: "2026-09-06T16:40:00.000Z",
      body: "Seuchenschutz braucht klare Befristung und öffentliche Begründung. Dauerhafte Sonderlagen ohne Diskurs darf es nicht geben.",
    },
    {
      id: "c3",
      targetId: "draft:digitale-selbstbestimmung",
      citizenId: "sim-015",
      name: "Clara Wolf",
      city: "Freiburg",
      createdAt: "2026-09-06T14:02:00.000Z",
      body: "Wenn Maschinen ganze Städte steuern können, ist Datenmacht Verfassungsfrage. Dieser Entwurf gehört nach oben.",
    },
    {
      id: "c4",
      targetId: "decision:digitaler-euro",
      citizenId: "sim-021",
      name: "Felix Nguyen",
      city: "Köln",
      createdAt: "2026-09-05T19:20:00.000Z",
      body: "Technik darf helfen. Sie darf niemanden ausschließen, der ohne Chip und Konto leben will.",
    },
  ];

  state.activity = [
    {
      id: "a1",
      at: new Date().toISOString(),
      kind: "status",
      citizenName: "System",
      city: "Deutschland",
      label: "Plattform geöffnet. Demonstrationsmodus bereit.",
      href: "/",
    },
  ];

  return state;
}
