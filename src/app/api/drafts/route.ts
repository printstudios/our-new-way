import { analyzeDraft } from "@/lib/heuristic";
import { citizenCookie, readCitizenCookie, uid } from "@/lib/ids";
import { boot } from "@/lib/snapshot";
import { ensureCitizen, mutate, pushActivity } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  boot();
  const body = (await req.json().catch(() => ({}))) as {
    title?: string;
    body?: string;
    name?: string;
  };
  if (!body.title || !body.body || body.body.trim().length < 40) {
    return Response.json({ error: "Der Entwurf ist zu kurz." }, { status: 400 });
  }
  const existing = readCitizenCookie(req.headers.get("cookie"));
  const citizen = ensureCitizen({
    id: existing?.id ?? uid("buerger"),
    name: body.name || existing?.name || "Bürgerin oder Bürger",
    city: existing?.city || "Deutschland",
  });
  const id = uid("entwurf");
  const analysis = analyzeDraft(body.title, body.body);
  mutate((s) => {
    s.drafts.unshift({
      id,
      title: body.title!.trim(),
      body: body.body!.trim(),
      area: analysis.area,
      authorId: citizen.id,
      authorName: citizen.name,
      createdAt: new Date().toISOString(),
      analysis,
    });
  });
  pushActivity({
    id: uid("act"),
    at: new Date().toISOString(),
    kind: "draft",
    citizenName: citizen.name,
    city: citizen.city,
    label: `${citizen.name} hat einen Entwurf vorgelegt.`,
    href: `/entwuerfe/${id}`,
  });
  return Response.json({ id }, { headers: { "Set-Cookie": citizenCookie(citizen) } });
}
