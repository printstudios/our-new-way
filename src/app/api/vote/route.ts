import { citizenCookie, readCitizenCookie, uid } from "@/lib/ids";
import { ensureCitizen, pushActivity, setVote } from "@/lib/store";
import { boot } from "@/lib/snapshot";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  boot();
  const body = (await req.json().catch(() => ({}))) as {
    targetId?: string;
    value?: number;
    name?: string;
    city?: string;
  };
  if (!body.targetId || (body.value !== 1 && body.value !== -1)) {
    return Response.json({ error: "Ungültige Stimme." }, { status: 400 });
  }
  const existing = readCitizenCookie(req.headers.get("cookie"));
  const citizen = ensureCitizen({
    id: existing?.id ?? uid("buerger"),
    name: body.name || existing?.name || "Bürgerin oder Bürger",
    city: body.city || existing?.city || "Deutschland",
    simulated: false,
  });
  setVote(body.targetId, citizen, body.value);
  pushActivity({
    id: uid("act"),
    at: new Date().toISOString(),
    kind: "vote",
    citizenName: citizen.name,
    city: citizen.city,
    label: `${citizen.name} hat eine Stimme abgegeben.`,
    href: body.targetId.startsWith("law:")
      ? `/gesetze/${body.targetId.slice(4)}`
      : body.targetId.startsWith("draft:")
        ? `/entwuerfe/${body.targetId.slice(6)}`
        : `/abstimmen/${body.targetId.slice(9)}`,
  });
  return Response.json(
    { ok: true },
    { headers: { "Set-Cookie": citizenCookie(citizen) } },
  );
}
