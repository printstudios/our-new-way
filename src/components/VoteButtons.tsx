"use client";

import { useState } from "react";

export function VoteButtons({
  targetId,
  onDone,
}: {
  targetId: string;
  onDone?: () => void;
}) {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function vote(value: 1 | -1) {
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId, value }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    setMsg(data.ok ? "Stimme gezählt." : data.error || "Nicht gespeichert.");
    setBusy(false);
    onDone?.();
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={busy}
        onClick={() => vote(1)}
        className="cursor-pointer bg-yes text-paper-2 px-4 py-2.5 text-[12px] uppercase tracking-[0.16em] hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        Dafür
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => vote(-1)}
        className="cursor-pointer bg-no text-paper-2 px-4 py-2.5 text-[12px] uppercase tracking-[0.16em] hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        Dagegen
      </button>
      {msg ? <span className="text-sm text-muted">{msg}</span> : null}
    </div>
  );
}
