import { analyzeDraft } from "@/lib/heuristic";
import { boot } from "@/lib/snapshot";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  boot();
  const body = (await req.json().catch(() => ({}))) as { title?: string; body?: string };
  return Response.json(analyzeDraft(body.title ?? "", body.body ?? ""));
}
