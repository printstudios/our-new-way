"use client";

import { useEffect, useState } from "react";

export function DemoBanner() {
  const [demo, setDemo] = useState(true);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const res = await fetch("/api/demo", { cache: "no-store" });
    const data = (await res.json()) as { demo: boolean };
    setDemo(data.demo);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function toggle() {
    setBusy(true);
    await fetch("/api/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ demo: !demo }),
    });
    await refresh();
    setBusy(false);
  }

  return (
    <div className="border-b border-rule bg-[#efe3c4]">
      <div className="mx-auto max-w-6xl px-4 py-2.5 flex flex-wrap items-center gap-3 text-sm">
        <span className="live-dot" aria-hidden="true" />
        <p className="text-navy">
          <strong className="font-semibold">Demonstrationsmodus</strong>
          {demo
            ? " — die Plattform simuliert gerade sinnvolle Bürgeraktivität für die Bühne."
            : " — Simulation pausiert. Echte Stimmen bleiben sichtbar."}
        </p>
        <button
          type="button"
          onClick={toggle}
          disabled={busy}
          className="ml-auto cursor-pointer border border-navy px-3 py-1.5 text-[12px] uppercase tracking-[0.14em] text-navy hover:bg-navy hover:text-paper-2 transition-colors disabled:opacity-60"
        >
          {demo ? "Simulation halten" : "Simulation starten"}
        </button>
      </div>
    </div>
  );
}
