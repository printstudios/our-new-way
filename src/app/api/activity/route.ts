import { getState } from "@/lib/store";
import { boot } from "@/lib/snapshot";

export const dynamic = "force-dynamic";

export function GET() {
  boot();
  return Response.json({ activity: getState().activity.slice(0, 18) });
}
