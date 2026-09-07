import { addComment, ensureCitizen, pushActivity } from "@/lib/store";
import { citizenCookie, readCitizenCookie, uid } from "@/lib/ids";
import { boot } from "@/lib/snapshot";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  boot();
  const body = (await req.json().catch(() => ({}))) as {
    targetId?: string;
    body?: string;
    name?: string;
    city?: string;
  };
  if (!body.targetId || !body.body || body.body.trim().length < 12) {
    return Response.json({ error: "Bitte ausführlicher schreiben." }, { status: 400 });
  }
  const existing = readCitizenCookie(req.headers.get("cookie"));
  const citizen = ensureCitizen({
    id: existing?.id ?? uid("buerger"),
    name: body.name || existing?.name || "Bürgerin oder Bürger",
    city: body.city || existing?.city || "Deutschland",
  });
  addComment({
    id: uid("c"),
    targetId: body.targetId,
    citizenId: citizen.id,
    name: citizen.name,
    city: citizen.city,
    body: body.body.trim(),
    createdAt: new Date().toISOString(),
  });
  pushActivity({
    id: uid("act"),
    at: new Date().toISOString(),
    kind: "comment",
    citizenName: citizen.name,
    city: citizen.city,
    label: `${citizen.name} spricht im Diskurs.`,
    href: body.targetId.startsWith("law:")
      ? `/gesetze/${body.targetId.slice(4)}`
      : body.targetId.startsWith("draft:")
        ? `/entwuerfe/${body.targetId.slice(6)}`
        : `/abstimmen/${body.targetId.slice(9)}`,
  });
  return Response.json({ ok: true }, { headers: { "Set-Cookie": citizenCookie(citizen) } });
}
