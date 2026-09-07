"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { HeuristicReport } from "@/lib/types";

export function DraftForm({ refSlug }: { refSlug?: string }) {
  const router = useRouter();
  const [title, setTitle] = useState(refSlug ? `Änderung: ${refSlug.toUpperCase()}` : "");
  const [body, setBody] = useState(
    refSlug
      ? `Dieser Entwurf ändert das bestehende Bundesgesetz „${refSlug}“.\n\nZiel:\n\nRegelungsvorschlag:\n`
      : "",
  );
  const [name, setName] = useState("");
  const [report, setReport] = useState<HeuristicReport | null>(null);
  const [busy, setBusy] = useState(false);

  const canAnalyze = useMemo(() => title.trim().length > 8 && body.trim().length > 40, [title, body]);

  async function analyze() {
    setBusy(true);
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });
    setReport((await res.json()) as HeuristicReport);
    setBusy(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/drafts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, name }),
    });
    const data = (await res.json()) as { id?: string };
    if (data.id) router.push(`/entwuerfe/${data.id}`);
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm">
        <span className="block text-[11px] uppercase tracking-[0.14em] text-muted mb-1">Titel</span>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-rule bg-paper px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        <span className="block text-[11px] uppercase tracking-[0.14em] text-muted mb-1">Ihr Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-rule bg-paper px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        <span className="block text-[11px] uppercase tracking-[0.14em] text-muted mb-1">Wortlaut</span>
        <textarea
          required
          minLength={40}
          rows={12}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full border border-rule bg-paper px-3 py-2"
        />
      </label>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!canAnalyze || busy}
          onClick={analyze}
          className="cursor-pointer border border-navy px-4 py-2.5 text-[12px] uppercase tracking-[0.14em] disabled:opacity-40"
        >
          Heuristik prüfen
        </button>
        <button
          type="submit"
          disabled={busy}
          className="cursor-pointer bg-navy text-paper-2 px-4 py-2.5 text-[12px] uppercase tracking-[0.14em]"
        >
          Dem Volk vorlegen
        </button>
      </div>
      {report ? (
        <aside className="border border-rule bg-[#efe6d2] p-4 text-sm leading-relaxed">
          <p className="uppercase tracking-[0.14em] text-[11px] text-navy">Unparteiische Prüfung</p>
          <p className="mt-2 font-semibold">
            Feld: {report.areaLabel} · Empfehlung:{" "}
            {report.recommendation === "new"
              ? "neuer Text"
              : report.recommendation === "amend"
                ? "bestehendes Gesetz ändern"
                : "möglichen Widerspruch klären"}
          </p>
          <p className="mt-2">{report.summary}</p>
          {report.similar.length ? (
            <ul className="mt-3 list-disc pl-5">
              {report.similar.map((s) => (
                <li key={s.slug}>
                  {s.abbrev ? `${s.abbrev} — ` : ""}
                  {s.title} ({s.score})
                </li>
              ))}
            </ul>
          ) : null}
        </aside>
      ) : null}
    </form>
  );
}
