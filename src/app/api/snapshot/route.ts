import { publicSnapshot } from "@/lib/snapshot";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(publicSnapshot());
}
