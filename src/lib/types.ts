export type VoteValue = 1 | -1;

export type LawStatus =
  | "in_kraft"
  | "im_diskurs"
  | "gefaehrdet"
  | "zur_abwahl"
  | "entlassen"
  | "entwurf"
  | "zur_annahme"
  | "angenommen";

export type CatalogLaw = {
  slug: string;
  title: string;
  tocTitle: string;
  abbrev: string;
  date: string;
  stand: string;
  area: string;
  sourceHtml: string;
  sectionCount: number;
  excerpt: string;
  hasText: boolean;
};

export type LawSection = {
  ref: string;
  heading: string;
  text: string;
};

export type FullLaw = CatalogLaw & {
  sections: LawSection[];
};

export type Citizen = {
  id: string;
  name: string;
  city: string;
  simulated: boolean;
};

export type Comment = {
  id: string;
  targetId: string;
  citizenId: string;
  name: string;
  city: string;
  body: string;
  createdAt: string;
};

export type Draft = {
  id: string;
  title: string;
  body: string;
  area: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  analysis?: HeuristicReport;
};

export type Decision = {
  id: string;
  title: string;
  body: string;
  kind: "geopolitik" | "krise" | "haushalt" | "grundsatz";
  createdAt: string;
};

export type Activity = {
  id: string;
  at: string;
  kind: "vote" | "comment" | "draft" | "decision" | "view" | "status";
  citizenName: string;
  city: string;
  label: string;
  href: string;
};

export type HeuristicReport = {
  area: string;
  areaLabel: string;
  similar: Array<{ slug: string; title: string; abbrev: string; score: number; reason: string }>;
  overlaps: Array<{ slug: string; title: string; note: string }>;
  contradictions: Array<{ slug: string; title: string; note: string }>;
  recommendation: "new" | "amend" | "conflict";
  summary: string;
};

export type Tallies = {
  up: number;
  down: number;
  total: number;
  score: number;
  percentUp: number;
  quorum: boolean;
  status: LawStatus;
  heat: number;
};

export type AppState = {
  version: 1;
  demo: boolean;
  demoStartedAt: string | null;
  citizens: Record<string, Citizen>;
  votes: Record<string, Record<string, VoteValue>>;
  comments: Comment[];
  drafts: Draft[];
  decisions: Decision[];
  activity: Activity[];
  views: Record<string, number>;
  statusOverride: Record<string, LawStatus>;
};
