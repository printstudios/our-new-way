"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Item = {
  id: string;
  at: string;
  label: string;
  href: string;
  city: string;
};

export function LiveFeed({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState(initial);

  useEffect(() => {
    const t = setInterval(async () => {
      const res = await fetch("/api/activity", { cache: "no-store" });
      const data = (await res.json()) as { activity: Item[] };
      setItems(data.activity);
    }, 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <ol className="space-y-0 divide-y divide-rule">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={item.href}
            className="block py-3 hover:bg-[#efe6d2] px-1 transition-colors cursor-pointer"
          >
            <p className="text-sm leading-snug">{item.label}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">
              {item.city} · {new Date(item.at).toLocaleTimeString("de-DE")}
            </p>
          </Link>
        </li>
      ))}
    </ol>
  );
}
