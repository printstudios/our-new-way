import { setDemo } from "@/lib/demo";
import { getState } from "@/lib/store";
import { boot } from "@/lib/snapshot";

export const dynamic = "force-dynamic";

export function GET() {
  boot();
  return Response.json({ demo: getState().demo });
}

export async function POST(req: Request) {
  boot();
  const body = (await req.json().catch(() => ({}))) as { demo?: boolean };
  setDemo(Boolean(body.demo));
  return Response.json({ demo: getState().demo });
}
