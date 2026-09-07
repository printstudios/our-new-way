import Link from "next/link";
import { DemoBanner } from "@/components/DemoBanner";
import { getState } from "@/lib/store";
import { boot } from "@/lib/snapshot";

export const metadata = { title: "Diskurs" };

export default function DiscoursePage() {
  boot();
  const comments = getState().comments.slice(0, 80);
  return (
    <>
      <DemoBanner />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-[12px] uppercase tracking-[0.22em] text-gold">Öffentlichkeit</p>
        <h1 className="serif text-4xl text-navy mt-2">Der gemeinsame Tisch</h1>
        <p className="mt-3 text-muted leading-relaxed">
          Divide et impera endet, wenn wir uns zuhören. Hier liegt, was Bürgerinnen und Bürger
          gerade zu Gesetzen, Entwürfen und Lagen sagen.
        </p>
        <ol className="mt-8 divide-y divide-rule">
          {comments.map((c) => {
            const href = c.targetId.startsWith("law:")
              ? `/gesetze/${c.targetId.slice(4)}`
              : c.targetId.startsWith("draft:")
                ? `/entwuerfe/${c.targetId.slice(6)}`
                : `/abstimmen/${c.targetId.slice(9)}`;
            return (
              <li key={c.id} className="py-5">
                <p className="text-sm font-semibold">
                  {c.name} <span className="font-normal text-muted">· {c.city}</span>
                </p>
                <p className="mt-2 leading-relaxed">{c.body}</p>
                <Link href={href} className="mt-2 inline-block text-[12px] uppercase tracking-[0.14em] underline underline-offset-4">
                  Zum Gegenstand
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
