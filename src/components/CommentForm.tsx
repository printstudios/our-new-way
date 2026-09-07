"use client";

import { useState } from "react";

export function CommentForm({ targetId }: { targetId: string }) {
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId, body, name, city }),
    });
    if (res.ok) {
      setBody("");
      setMsg("Im Diskurs.");
    } else {
      setMsg("Bitte einen klaren Gedanken schreiben.");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm">
          <span className="block text-[11px] uppercase tracking-[0.14em] text-muted mb-1">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-rule bg-paper-2 px-3 py-2"
            placeholder="Vor- und Nachname oder Kennung"
          />
        </label>
        <label className="block text-sm">
          <span className="block text-[11px] uppercase tracking-[0.14em] text-muted mb-1">Ort</span>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border border-rule bg-paper-2 px-3 py-2"
            placeholder="Stadt"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="block text-[11px] uppercase tracking-[0.14em] text-muted mb-1">Beitrag</span>
        <textarea
          required
          minLength={12}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="w-full border border-rule bg-paper-2 px-3 py-2"
          placeholder="Sachlich, prüfbar, an das Gemeinwohl gerichtet."
        />
      </label>
      <button
        type="submit"
        className="cursor-pointer bg-navy text-paper-2 px-4 py-2.5 text-[12px] uppercase tracking-[0.16em] hover:bg-navy-2 transition-colors"
      >
        In den Diskurs
      </button>
      {msg ? <p className="text-sm text-muted">{msg}</p> : null}
    </form>
  );
}
