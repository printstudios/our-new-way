import { catalogStats } from "@/lib/catalog";
import { boot } from "@/lib/snapshot";

export const dynamic = "force-dynamic";

export function GET() {
  boot();
  return Response.json({ ok: true, service: "our-new-way", ...catalogStats() });
}
